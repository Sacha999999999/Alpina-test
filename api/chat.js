export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ text: "Method not allowed" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ text: "Message vide" });

  try {
    const MODEL = "gpt2"; // modèle public gratuit
    const HF_API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

    const response = await fetch(HF_API_URL, {
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
    const text = Array.isArray(data) && data[0]?.generated_text ? data[0].generated_text : "🤖 Pas de réponse";

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ text: "Erreur serveur : " + err.message });
  }
}

