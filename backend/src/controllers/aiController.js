const { callOpenRouter, parseAndSave } = require('../services/aiService');

// BU FONKSİYONU GÜNCELLEYECEĞİZ
// POST /api/ai/chat
// Artık hem AI'ı çağıracak hem de sonucu veritabanına kaydedecek.
exports.chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }

    // 1. Yapay zekayı çağır ve cevabı al (Bu kısım aynı kalıyor)
    let aiContent;
    try {
      aiContent = await callOpenRouter(messages);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message, upstream: err.responseData || null });
    }

    console.log('--- DEBUGGING DATABASE SAVE ---');
    console.log('AI Content to be saved:', aiContent);
    console.log('Is user authenticated?', !!req.user); // true mu false mu?
    // --- YENİ: KAYDETME ADIMI ---
    // 2. Gelen cevabı veritabanına kaydet
    // Bu adımı yapabilmek için kullanıcının giriş yapmış olması gerekir.
    // req.user objesinin session/token middleware'i tarafından eklendiğini varsayıyoruz.
    if (req.user && req.user.id) {
      console.log('User object:', req.user); // Kullanıcı objesinin içeriğini göster
      try {
        // parseAndSave fonksiyonunu çağırarak veriyi DB'ye kaydediyoruz.
        // Hata olursa yakalayıp logluyoruz ama işlemi durdurmuyoruz.
        // Önemli olan, kullanıcının cevabı görmesidir.
        await parseAndSave(aiContent, req.user);
        console.log('AI response successfully saved to the database for user:', req.user.id);
      } catch (saveError) {
        // Veritabanına kaydetme başarısız olursa bunu konsola yazdırıyoruz.
        // Kullanıcıya hata göstermek yerine sadece loglamak daha iyi bir deneyim olabilir.
        console.error('DATABASE_SAVE_ERROR:', saveError.message);
      }
    } else {
      // Eğer kullanıcı girişi yoksa, sadece loglayıp geçiyoruz.
      console.log('User not authenticated. Skipping database save.');
    }
    // --- KAYDETME ADIMI SONU ---


    // 3. Her durumda, yapay zeka cevabını ön yüze (frontend) geri gönder
    // Bu kısım da aynı kalıyor.
    res.json({ role: 'assistant', content: aiContent });

  } catch (error) {
    console.error('chatWithAI error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/ai/ask
// Call AI, expect JSON describing plans/tasks/resources, parse and persist to DB
exports.askAI = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }

    let aiContent;
    try {
      aiContent = await callOpenRouter(messages);
    } catch (err) {
      // forward status if available (e.g., 429 from upstream)
      const status = err.status || 500;
      return res.status(status).json({ error: err.message, upstream: err.responseData || null });
    }

    // ensure authenticated user exists for saving
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to save AI-generated data' });
    }

    const result = await parseAndSave(aiContent, req.user);

    res.json({ message: 'AI content parsed', result });
  } catch (error) {
    console.error('askAI error:', error);
    res.status(500).json({ error: error.message });
  }
};
