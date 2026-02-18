export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Méthode non autorisée" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ text: "Message vide" });
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Meta-Llama-3-8B-Instruct",
          messages: [{ role: "user", content: message }],
          temperature: 0.7,
          max_tokens: 512
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        text: `Erreur IA provider : ${JSON.stringify(data)}`
      });
    }

    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      "🤖 Pas de réponse du modèle.";

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({
      text: `Erreur serveur : ${err.message}`
    });
  }
}
