// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Méthode non autorisée" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ text: "Message vide" });
  }

  try {
    // 🔥 Appel au router HF (endpoint moderne)
    const HF_API_URL = `https://api-inference.huggingface.co/models/gpt2`;

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: message,
        options: { wait_for_model: true }
      })
    });

    if (!response.ok) {
      // retourne le texte d’erreur complet si échec
      const err = await response.text();
      return res.status(500).json({ text: `Erreur IA : ${err}` });
    }

    const data = await response.json();

    // 💡 HF retourne souvent un tableau avec generated_text
    const text = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : "🤖 L’IA n’a pas généré de texte.";

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ text: `Erreur serveur : ${err.message}` });
  }
}
