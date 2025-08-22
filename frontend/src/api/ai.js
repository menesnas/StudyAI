export async function sendToAI(messages) {
    const resp = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });
    if (!resp.ok) throw new Error("AI isteği hata verdi");
    return resp.json(); // { role, content }
  }
  