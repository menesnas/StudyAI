const { LearningPlan, Task } = require('../models');
const axios = require('axios');
const fetch = require('node-fetch');

/**
 * Yapay zeka modelini çağırır ve bir JSON string'i döndürür.
 */
async function callOpenRouter(messages = []) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error('OPENROUTER_API_KEY bulunamadı.');
    throw new Error('AI servis konfigürasyonu eksik.');
  }

  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';

  const systemPrompt = {
    role: 'system',
    content: `You are a helpful assistant that generates learning plans with associated tasks.
      Your response MUST be a single JSON object and nothing else. Do not include any text, explanation, or markdown formatting before or after the JSON.
      The JSON object must have a "plan" key and a "tasks" key.
      - The "plan" object must contain: "title", "description", "subject", "targetDuration" (number of days, MUST match the user's requested duration), "dailyStudyTime" (number of minutes), and "knowledgeLevel" ('beginner', 'intermediate', 'advanced').
      - The "tasks" key must be an array of task objects. Each task object must contain: "title" (a short, clear action), "description" (more detail about the task), "day" (which day of the plan this task belongs to, starting from 1 and not exceeding targetDuration), and "priority" ('high', 'medium', 'low').

      IMPORTANT: The targetDuration value MUST match the duration requested by the user in their message.`
  };

  const payload = {
    model,
    messages: [systemPrompt, ...messages],
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: "json_object" }
  };

  try {
    const resp = await axios.post(process.env.OPENROUTER_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    });

    if (!resp.data || !resp.data.choices || !resp.data.choices[0]) {
      throw new Error('Yapay zeka servisinden geçersiz yanıt alındı.');
    }

    return resp.data.choices[0].message.content;

  } catch (error) {
    console.error("callOpenRouter - Axios isteği başarısız:", error.response ? error.response.data : error.message);
    const e = new Error('Yapay zeka servisine ulaşılamadı.');
    e.status = error.response?.status || 500;
    throw e;
  }
}

/**
 * Gelen JSON string'ini ayrıştırır ve veritabanına kaydeder.
 */
async function parseAndSave(aiContent, user) {
  let parsedData;

  if (typeof aiContent !== 'string' || aiContent.trim() === '') {
    console.warn("Kaydedilecek geçerli bir AI içeriği yok.");
    return;
  }

  try {
    parsedData = JSON.parse(aiContent);
    console.log('Parsed AI Response:', JSON.stringify(parsedData, null, 2));

    if (!parsedData.plan) {
      console.error('AI yanıtında plan verisi bulunamadı:', parsedData);
      return;
    }

    const duration = Number(parsedData.plan.targetDuration);
    if (isNaN(duration) || duration <= 0) {
      console.error('Geçersiz targetDuration değeri:', parsedData.plan.targetDuration);
      return;
    }
  } catch (error) {
    console.error('DATABASE_SAVE_ERROR: AI içeriği JSON formatında değil.', aiContent);
    console.error('Raw AI Content:', aiContent);
    return;
  }

  console.log('Plan values from AI:', {
    targetDuration: parsedData.plan.targetDuration,
    dailyStudyTime: parsedData.plan.dailyStudyTime,
    knowledgeLevel: parsedData.plan.knowledgeLevel
  });

  const planData = {
    title: parsedData.plan.title || 'Başlıksız Plan',
    description: parsedData.plan.description || null,
    subject: parsedData.plan.subject || 'Genel',
    targetDuration: parsedData.plan.targetDuration ? Number(parsedData.plan.targetDuration) : 7,
    dailyStudyTime: parsedData.plan.dailyStudyTime ? Number(parsedData.plan.dailyStudyTime) : 30,
    knowledgeLevel: parsedData.plan.knowledgeLevel || 'beginner',
    status: 'active',
    userId: user.id
  };

  console.log('Prepared plan data for database:', planData);

  try {
    const createdPlan = await LearningPlan.create(planData);
    console.log("Öğrenme planı başarıyla veritabanına kaydedildi:", planData.title);

    if (parsedData.tasks && Array.isArray(parsedData.tasks)) {
      for (const task of parsedData.tasks) {
        await Task.create({
          title: task.title,
          description: task.description,
          day: task.day,
          priority: task.priority,
          status: 'pending',
          planId: createdPlan.id,
          userId: user.id
        });
      }
      console.log(`${parsedData.tasks.length} görev başarıyla kaydedildi.`);
    }
  } catch (dbError) {
    console.error('DATABASE_SAVE_ERROR: Veritabanına kayıt sırasında hata oluştu.', dbError.message);
    console.error('Kaydedilmeye çalışılan veri:', planData);
  }
}

/**
 * SerpAPI kullanarak web'de arama yapar ve sonuç snippet'lerini döndürür.
 * @param {string} query Kullanıcının arama sorgusu.
 * @returns {Promise<string>} Birleştirilmiş arama sonucu metinleri.
 */
async function searchWeb(query) {
  try {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      throw new Error("SERPAPI_KEY ortam değişkeni bulunamadı. Lütfen .env dosyanızı kontrol edin.");
    }

    console.log("SerpAPI araması başlatılıyor. Sorgu:", query);
    console.log("Kullanılan SerpAPI anahtarı (ilk 5 karakter):", apiKey.substring(0, 5) + "...");

    // Arama parametreleri
    const params = new URLSearchParams({
      q: query,
      google_domain: "google.com.tr",
      gl: "tr",
      hl: "tr",
      num: 5,
      safe: "active",
      api_key: apiKey
    });

    console.log("SerpAPI arama parametreleri:", params.toString().replace(apiKey, '[GİZLİ]'));

    // fetch ile HTTP GET isteği
    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("SerpAPI'den hata yanıtı:", errorData);
      throw new Error(`SerpAPI hatası: ${errorData.error || response.statusText}`);
    }

    const result = await response.json();
    console.log("SerpAPI'den ham yanıt alındı.");
    console.log("Organik sonuç sayısı:", result.organic_results?.length || 0);

    if (!result.organic_results || result.organic_results.length === 0) {
      console.warn("SerpAPI yanıtında organik sonuç bulunamadı.");
      return "İlgili web sonucu bulunamadı.";
    }

    const formattedResults = result.organic_results
      .slice(0, 5) // İlk 5 sonucu al
      .map((item, index) => {
        const title = item.title || "Başlık yok";
        const snippet = item.snippet || "Açıklama bulunamadı";
        const link = item.link || "Link yok";
        const date = item.date ? ` (${item.date})` : "";

        return `[${index + 1}] Kaynak: ${title}${date}\nÖzet: ${snippet}\nLink: ${link}`;
      })
      .join('\n\n---\n\n');

    console.log("Oluşturulan bağlamın uzunluğu:", formattedResults.length);
    return formattedResults;

  } catch (error) {
    console.error("searchWeb fonksiyonunda beklenmeyen hata:", error.message);
    throw new Error("Web araması sırasında bir hata oluştu: " + error.message);
  }
}

/**
 * DÜZELTME: Sadece LLM çağrısı yapan fonksiyon - web araması yapmaz
 * @param {string} query Kullanıcının orijinal sorgusu
 * @param {string} context Web arama sonuçları (önceden alınmış)
 * @returns {Promise<string>} AI tarafından üretilen yanıt
 */
async function generateResponseFromContext(query, context) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY ortam değişkeni bulunamadı.");
    }

    if (!process.env.OPENROUTER_API_URL) {
      throw new Error("OPENROUTER_API_URL ortam değişkeni bulunamadı.");
    }

    // Prompt'u oluştur: Kullanıcı sorgusu + web sonuçları
    const prompt = `
Kullanıcı Sorgusu: ${query}

Web Arama Sonuçları:
${context}

Yukarıdaki kullanıcı sorgusuna ve web arama sonuçlarına dayanarak, Türkçe, anlaşılır ve kullanıcı dostu bir yanıt üret. Yanıtında, web sonuçlarından gelen bilgileri özetle ve kaynakları açıkça belirt. Cevabı doğal bir şekilde, sanki bir insanla konuşuyormuş gibi yaz. Gereksiz teknik detaylardan kaçın ve kullanıcının sorusuna odaklan.
    `;

    console.log("OpenRouter'a gönderilen prompt uzunluğu:", prompt.length);

    // OpenRouter ile AI yanıtı üret
    const response = await axios.post(process.env.OPENROUTER_API_URL, {
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: "system",
          content: "Sen yardımcı bir asistansın. Verilen bağlamı kullanarak kullanıcının sorularını cevapla. Cevaplarını Türkçe, doğal ve kullanıcı dostu bir şekilde ver. Kaynakları açıkça belirt ve gereksiz teknik detaylardan kaçın."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1000,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:5000',
        'X-Title': process.env.YOUR_APP_NAME || 'NotionAI'
      }
    });

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error("OpenRouter'dan geçersiz yanıt alındı");
    }

    const aiResponse = response.data.choices[0].message.content;
    console.log("OpenRouter'dan alınan yanıt:", aiResponse);

    return aiResponse;

  } catch (error) {
    console.error("generateResponseFromContext - Hata detayı:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    if (error.response?.status === 401) {
      throw new Error("OpenRouter API anahtarı geçersiz veya eksik.");
    } else if (error.response?.status === 429) {
      throw new Error("API rate limit aşıldı. Lütfen biraz bekleyin.");
    } else if (error.response?.status === 400) {
      throw new Error("Geçersiz istek formatı: " + (error.response?.data?.error || ""));
    }

    throw new Error("Yanıt üretilirken bir hata oluştu: " + error.message);
  }
}

/**
 * DEPRECATED: Bu fonksiyon artık kullanılmamalı - çifte web araması yapıyor
 * Yerine generateResponseFromContext kullanın
 */
async function generateRagResponse(query) {
  console.warn("DEPRECATED: generateRagResponse fonksiyonu kullanılıyor. generateResponseFromContext kullanın.");
  
  try {
    // Eski kod - web araması yapıyor (SORUNLU)
    const webResults = await searchWeb(query);
    return await generateResponseFromContext(query, webResults);
  } catch (error) {
    throw new Error("Yanıt üretilirken bir hata oluştu: " + error.message);
  }
}

// Dışa aktarılan fonksiyonlar
module.exports = {
  callOpenRouter,
  parseAndSave,
  searchWeb,
  generateRagResponse, // Geriye uyumluluk için - deprecated
  generateResponseFromContext // Yeni, düzeltilmiş fonksiyon
};
