// /api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ text: "Method not allowed" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ text: "Message vide" });

  try {
    // Exemple avec Hugging Face Inference API - modèle open source gratuit
    const HF_API_KEY = process.env.HUGGING_KEY; // ta clé Hugging Face
    const MODEL = "gpt2"; // modèle gratuit simple pour test

    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await response.json();

    // Retour minimal : texte de la première sortie
    let text;
    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    } else if (typeof data?.error === "string") {
      text = `Erreur modèle : ${data.error}`;
    } else {
      text = "Impossible d'obtenir une réponse de l'IA.";
    }

    res.status(200).json({ text });

  } catch (err) {
    res.status(500).json({ text: "Erreur serveur : " + err.message });
  }
}
