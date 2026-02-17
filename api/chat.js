// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ text: "Method not allowed" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ text: "Message vide" });

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ text: "Erreur IA : " + errText });
    }

    const data = await response.json();
    // GPT2 renvoie un tableau avec "generated_text"
    const text = data[0]?.generated_text || "Pas de réponse";
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ text: "Erreur de connexion : " + err.message });
  }
}
