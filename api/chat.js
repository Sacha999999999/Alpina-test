export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ text: "Méthode non autorisée" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ text: "Message vide" });

  try {
    const HF_ROUTER = "https://router.huggingface.co/v1/chat/completions";
    const MODEL = "deepseek-ai/DeepSeek-V3.2"; // modèle public compatible Router

    const response = await fetch(HF_ROUTER, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ text: `Erreur IA provider : ${err}` });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "🤖 L'IA n'a pas répondu";

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ text: `Erreur serveur : ${err.message}` });
  }
}
