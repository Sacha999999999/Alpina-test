// /api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ text: 'Méthode non autorisée' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ text: 'Message vide' });

  try {
    const hfResponse = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGING_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await hfResponse.json();

    // Hugging Face renvoie souvent un tableau d'objets { generated_text }
    const text = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : '🤖 L’IA n’a pas pu générer de réponse.';

    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: 'Erreur de connexion à l’IA.' });
  }
}
