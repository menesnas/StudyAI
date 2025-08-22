// Node 18+ varsa fetch global; yoksa: npm install node-fetch
async function askAI(messages) {
  try {
    console.log('Environment variables kontrol:');
    console.log('API URL:', process.env.OPENROUTER_API_URL);
    console.log('API Key var mı:', !!process.env.OPENROUTER_API_KEY);
    console.log('Model:', process.env.OPENROUTER_MODEL);
    
    const resp = await fetch(process.env.OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "StudyAI"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages
      })
    });

    console.log('OpenRouter yanıt status:', resp.status);

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
    console.error('AI Service Error:', error);
    throw error;
  }
}

module.exports = { askAI };
  