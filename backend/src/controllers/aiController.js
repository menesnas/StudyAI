const { askAI } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Mesajları validate et
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Geçerli mesajlar gönderilmedi" });
    }

    const answer = await askAI(messages);
    res.json({ role: "assistant", content: answer });
  } catch (error) {
    console.error('AI Controller Error:', error);
    
    // Daha spesifik hata mesajları
    if (error.message.includes('API error')) {
      res.status(502).json({ error: "AI servisi şu anda kullanılamıyor" });
    } else {
      res.status(500).json({ error: "AI cevabı alınamadı" });
    }
  }
};

module.exports = { chatWithAI };
