// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Méthode non autorisée" });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ text: "Message vide" });

  try {
    const HF_ROUTER = "https://router.huggingface.co/api/experimental/conversation";
    // Remplacer "gpt2" par un modèle gratuit compatible, ex: "gpt2"
    const MODEL = "gpt2";

    const response = await fetch(HF_ROUTER, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        inputs: message,
        options: { wait_for_model: true }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ text: "Erreur IA : " + errText });
    }

    const data = await response.json();
    // le Router renvoie un champ text ou conversation[0].generated_text
    const text = data?.conversation?.[0]?.generated_text || data?.generated_text || "🤖 L'IA n'a pas répondu";

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ text: "Erreur serveur : " + err.message });
  }
}
