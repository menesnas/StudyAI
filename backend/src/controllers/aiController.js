const aiService = require("../services/aiService");

const chatWithAI = async (req, res) => {
  console.log('=== AI Controller - chatWithAI çağrıldı ===');
  console.log('Request body:', req.body);
  
  try {
    const { messages } = req.body;
    
    // Mesajları validate et
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('Validation failed: Invalid messages');
      return res.status(400).json({ error: "Geçerli mesajlar gönderilmedi" });
    }

    console.log('Calling aiService.askAI with messages:', messages);
    const answer = await aiService.askAI(messages);
    console.log('AI Service returned:', answer);
    
    const response = { role: "assistant", content: answer };
    console.log('Sending response:', response);
    res.json(response);
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

// Kullanıcıdan gelen mesajı alıp AI'dan JSON döndüren fonksiyon
const askAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Mesajı validate et
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Geçerli bir mesaj gönderilmedi" });
    }

    // getAIResponse kullanarak direkt JSON yanıt al
    const response = await aiService.getAIResponse(message);
    res.json(response);
  } catch (error) {
    console.error("AI Controller Error:", error.message);
    res.status(500).json({ error: "AI yanıtı alınamadı" });
  }
};

module.exports = { chatWithAI, askAI };
