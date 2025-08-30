// aiService.js (Final ve Düzeltilmiş Versiyon)

const axios = require('axios');
// Modelleri doğru yerden import ettiğinizden emin olun. Genellikle './models' veya './models/index' olur.
const { LearningPlan, Task } = require('../models');

/**
 * Yapay zeka modelini çağırır ve bir JSON string'i döndürür.
 * Bu fonksiyonun adı 'callOpenRouter' ve bu isim tutarlı olarak kullanılacak.
 */
async function callOpenRouter(messages = []) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    // Bu hata sunucu tarafında loglanacak ve 500 hatası olarak dönecektir.
    console.error('OPENROUTER_API_KEY bulunamadı.');
    throw new Error('AI servis konfigürasyonu eksik.');
  }

  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';

  // AI'dan hem plan hem de görevleri içeren bir JSON istemek için kullanılan sistem mesajı.
  const systemPrompt = {
    role: 'system',
    content: `You are a helpful assistant that generates learning plans with associated tasks.
      Your response MUST be a single JSON object and nothing else. Do not include any text, explanation, or markdown formatting before or after the JSON.
      The JSON object must have a "plan" key and a "tasks" key.
      - The "plan" object must contain: "title", "description", "subject", "targetDuration" (number of days, MUST match the user's requested duration), "dailyStudyTime" (number of minutes), and "knowledgeLevel" ('beginner', 'intermediate', 'advanced').
      - The "tasks" key must be an array of task objects. Each task object must contain: "title" (a short, clear action), "description" (more detail about the task), "day" (which day of the plan this task belongs to, starting from 1 and not exceeding targetDuration), and "priority" ('high', 'medium', 'low').

      Example of the required JSON structure:
      {
        "plan": {
          "title": "2-Week Python Intro",
          "description": "A 14-day comprehensive plan for Python beginners.",
          "subject": "Python",
          "targetDuration": 14,
          "dailyStudyTime": 60,
          "knowledgeLevel": "beginner"
        },
        "tasks": [
          {
            "title": "Setup Python Environment",
            "description": "Install Python and VS Code editor.",
            "day": 1,
            "priority": "high"
          },
          {
            "title": "Learn Basic Syntax",
            "description": "Complete the 'Variables and Data Types' chapter of the tutorial.",
            "day": 1,
            "priority": "high"
          }
        ]
      }

      IMPORTANT: The targetDuration value MUST match the duration requested by the user in their message (e.g., if they ask for a 2-week plan, targetDuration should be 14).`
  };

  const payload = {
    model,
    messages: [systemPrompt, ...messages],
    temperature: 0.2,
    max_tokens: 1500,
    response_format: { type: "json_object" } // Modeli JSON üretmeye zorla
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

    // Doğrudan JSON string'ini döndür.
    return resp.data.choices[0].message.content;

  } catch (error) {
    console.error("callOpenRouter - Axios isteği başarısız:", error.response ? error.response.data : error.message);
    // Hata detayını koruyarak yeni bir hata fırlat.
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
    return; // Boş içerikse işlemi durdur.
  }

  try {
    parsedData = JSON.parse(aiContent);
    console.log('Parsed AI Response:', JSON.stringify(parsedData, null, 2));
    
    // Plan verilerinin varlığını ve doğruluğunu kontrol et
    if (!parsedData.plan) {
      console.error('AI yanıtında plan verisi bulunamadı:', parsedData);
      return;
    }

    // targetDuration'ın sayısal bir değer olduğundan emin ol
    const duration = Number(parsedData.plan.targetDuration);
    if (isNaN(duration) || duration <= 0) {
      console.error('Geçersiz targetDuration değeri:', parsedData.plan.targetDuration);
      return;
    }
  } catch (error) {
    console.error('DATABASE_SAVE_ERROR: AI içeriği JSON formatında değil.', aiContent);
    console.error('Raw AI Content:', aiContent);
    // Bu hatayı yukarıya fırlatabiliriz ama şimdilik sadece loglamak yeterli.
    // Çünkü ana amaç kullanıcının cevabı görmesi.
    return;
  }

  // AI'dan gelen değerleri kontrol et ve logla
  console.log('Plan values from AI:', {
    targetDuration: parsedData.plan.targetDuration,
    dailyStudyTime: parsedData.plan.dailyStudyTime,
    knowledgeLevel: parsedData.plan.knowledgeLevel
  });

  // Veritabanına kaydedilecek veriyi hazırla.
  const planData = {
    title: parsedData.plan.title || 'Başlıksız Plan',
    description: parsedData.plan.description || null,
    subject: parsedData.plan.subject || 'Genel',
    targetDuration: parsedData.plan.targetDuration ? Number(parsedData.plan.targetDuration) : 7,
    dailyStudyTime: parsedData.plan.dailyStudyTime ? Number(parsedData.plan.dailyStudyTime) : 30,
    knowledgeLevel: parsedData.plan.knowledgeLevel || 'beginner',
    status: 'active',
    userId: user.id // Bu ID'nin varlığı controller'da kontrol edildi.
  };
  
  // Hazırlanan plan verisini logla
  console.log('Prepared plan data for database:', planData);

  try {
    // Önce planı kaydet ve ID'sini al
    const createdPlan = await LearningPlan.create(planData);
    console.log("Öğrenme planı başarıyla veritabanına kaydedildi:", planData.title);

    // Eğer görevler varsa, onları da kaydet
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
    // Hatanın detayını logla
    console.error('Kaydedilmeye çalışılan veri:', planData);
  }
}

// --- EN ÖNEMLİ KISIM ---
// Dışa aktardığımız objenin anahtarları, controller'da kullandığımız isimlerle aynı olmalı.
module.exports = {
  callOpenRouter,
  parseAndSave
};
