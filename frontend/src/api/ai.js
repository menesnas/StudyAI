// ai.js (Streaming özelliği korunarak kimlik doğrulama eklendi)

export async function sendToAI(messages, onStream) {
  console.log('Sending to AI:', messages);
  console.log('URL:', "http://localhost:5000/api/ai/chat" );

  // --- YENİ: KİMLİK DOĞRULAMA ADIMLARI ---

  let token = null;
  try {
    // 1. localStorage'dan 'user' anahtarındaki veriyi string olarak al.
    const userString = localStorage.getItem('user');

    // 2. Eğer veri varsa, onu JSON'a çevir ve içinden token'ı al.
    if (userString) {
      const userData = JSON.parse(userString);
      token = userData.token; // Token'ı buradan alıyoruz.
    }
  } catch (error) {
    console.error("localStorage'dan kullanıcı verisi okunurken hata:", error);
  }

  // 3. İstek başlıklarını (headers) hazırla.
  const headers = {
    "Content-Type": "application/json",
  };

  // 4. Eğer token bulunduysa, Authorization başlığını ekle.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log("Token bulundu ve isteğe eklendi.");
  } else {
    console.warn('Token bulunamadı. İstek kimliksiz gönderiliyor.');
  }

  // --- KİMLİK DOĞRULAMA ADIMLARI SONU ---


  try {
    // fetch çağrısını güncellenmiş 'headers' ile yapıyoruz.
    // Kodun geri kalanında hiçbir değişiklik yok.
    const resp = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: headers, // Hazırladığımız başlıkları burada kullanıyoruz.
      body: JSON.stringify({ messages } )
    });

    console.log('Response status:', resp.status);
    console.log('Response ok:', resp.ok);

    if (!resp.ok) {
      if (resp.status === 401) {
        alert('Oturumunuz geçersiz. Lütfen tekrar giriş yapın.');
        // İsteğe bağlı: kullanıcıyı otomatik olarak login sayfasına yönlendir
        // localStorage.removeItem('user');
        // window.location.href = '/login';
      }
      const errorText = await resp.text();
      console.error('Error response:', errorText);
      throw new Error(`AI isteği hata verdi: ${resp.status}`);
    }

    // Streaming response için olan kodunuz olduğu gibi kalıyor.
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

          await new Promise(resolve => setTimeout(resolve, 20));
        }
      } finally {
        reader.releaseLock();
      }

      return { role: "assistant", content: accumulatedText };
    }

    // Normal (streaming olmayan) response için olan kodunuz da olduğu gibi kalıyor.
    const result = await resp.json();
    console.log('AI Response:', result);

    if (onStream && result.content && typeof result.content === 'string') {
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
