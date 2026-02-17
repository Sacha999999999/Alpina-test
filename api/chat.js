// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Méthode non autorisée' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ text: 'Message vide' });
  }

  // 💡 Simulation IA minimaliste
  // Tu peux remplacer cette partie par un vrai appel à une IA open-source plus tard
  const responseText = `✅ Reçu par l'IA : "${message}"`;

  res.status(200).json({ text: responseText });
}
