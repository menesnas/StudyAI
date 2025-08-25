export async function sendToAI(messages, onStream) {
  console.log('Sending to AI:', messages);
  console.log('URL:', "http://localhost:5000/api/ai/chat");
  
  try {
    const resp = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    
    console.log('Response status:', resp.status);
    console.log('Response ok:', resp.ok);
    
    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Error response:', errorText);
      throw new Error(`AI isteği hata verdi: ${resp.status}`);
    }

    // Streaming response için
    if (onStream && resp.body && resp.headers.get('content-type')?.includes('text/plain')) {
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          onStream(accumulatedText);
          
          // Küçük bir gecikme ekle (typing efekti için)
          await new Promise(resolve => setTimeout(resolve, 20));
        }
      } finally {
        reader.releaseLock();
      }

      return { role: "assistant", content: accumulatedText };
    }
    
    // Normal response için (JSON)
    const result = await resp.json();
    console.log('AI Response:', result);
    
    // Eğer streaming callback varsa ama response JSON ise, simulate et
    if (onStream && result.content) {
      const words = result.content.split(' ');
      let accumulatedText = '';
      
      for (let i = 0; i < words.length; i++) {
        accumulatedText += (i === 0 ? '' : ' ') + words[i];
        onStream(accumulatedText);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return result;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
}