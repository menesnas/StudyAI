// aiService.js (Final ve Düzeltilmiş Versiyon)

const axios = require('axios');
// Modelleri doğru yerden import ettiğinizden emin olun. Genellikle './models' veya './models/index' olur.
const { LearningPlan } = require('../models');

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

  const systemPrompt = {
    role: 'system',
    content: `You are a helpful assistant that generates learning plans.
      Your response MUST be a JSON object and nothing else. Do not include any text, explanation, or markdown formatting before or after the JSON.
      The JSON object must have these exact keys: "title", "description", "subject", "targetDuration" (number of days), "dailyStudyTime" (number of minutes), and "knowledgeLevel" (one of 'beginner', 'intermediate', 'advanced').
      Example: {"title": "Intro to Python", "description": "A 10-day plan for absolute beginners.", "subject": "Python", "targetDuration": 10, "dailyStudyTime": 45, "knowledgeLevel": "beginner"}`
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
  } catch (error) {
    console.error('DATABASE_SAVE_ERROR: AI içeriği JSON formatında değil.', aiContent);
    // Bu hatayı yukarıya fırlatabiliriz ama şimdilik sadece loglamak yeterli.
    // Çünkü ana amaç kullanıcının cevabı görmesi.
    return;
  }

  // Veritabanına kaydedilecek veriyi hazırla.
  const planData = {
    title: parsedData.title || 'Başlıksız Plan',
    description: parsedData.description || null,
    subject: parsedData.subject || 'Genel',
    targetDuration: Number(parsedData.targetDuration) || 7,
    dailyStudyTime: Number(parsedData.dailyStudyTime) || 30,
    knowledgeLevel: parsedData.knowledgeLevel || 'beginner',
    status: 'active',
    userId: user.id // Bu ID'nin varlığı controller'da kontrol edildi.
  };

  try {
    await LearningPlan.create(planData);
    console.log("Öğrenme planı başarıyla veritabanına kaydedildi:", planData.title);
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
