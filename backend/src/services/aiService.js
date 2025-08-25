const axios = require("axios");

// Retry fonksiyonu
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mevcut chat fonksiyonu (fetch ile)
async function askAI(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Deneme ${i + 1}/${retries}`);
      console.log('Environment variables kontrol:');
      console.log('API URL:', process.env.OPENROUTER_API_URL);
      console.log('API Key var mı:', !!process.env.OPENROUTER_API_KEY);
      console.log('Model:', process.env.OPENROUTER_MODEL);
      
      const resp = await fetch(process.env.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": `${process.env.HTTP_REFERER}`,
          "X-Title": "StudyAI"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL,
          messages
        })
      });

      console.log('OpenRouter yanıt status:', resp.status);

      if (resp.status === 429 && i < retries - 1) {
        console.log(`Rate limit, ${5 * (i + 1)} saniye bekleniyor...`);
        await delay(5000 * (i + 1)); // Exponential backoff
        continue;
      }

      if (!resp.ok) {
        const errorText = await resp.text();
        console.log('OpenRouter hata yanıtı:', errorText);
        throw new Error(`OpenRouter API error: ${resp.status} ${resp.statusText}`);
      }

      const data = await resp.json();
      console.log('OpenRouter başarılı yanıt:', data);
      
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('OpenRouter API yanıtında içerik bulunamadı');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Deneme ${i + 1} başarısız:`, error.message);
      
      if (i === retries - 1) {
        console.error('Tüm denemeler başarısız oldu');
        throw error;
      }
    }
  }
}

// Plan ve görev üretimi için özel fonksiyon (axios ile)
async function getAIResponse(message) {
  try {
    const response = await axios.post(
      process.env.OPENROUTER_API_URL,
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Kullanıcının mesajına göre öğrenme planı ve görevler üret. Sadece şu formatta JSON dön: {plans:[...], tasks:[...]}"
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    return JSON.parse(aiText);
  } catch (err) {
    console.error("AI Service Error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { askAI, getAIResponse };
  