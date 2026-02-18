export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Méthode non autorisée" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ text: "Message vide" });
  }

try {

  const key = process.env.HUGGINGFACE_API_KEY;

  console.log("KEY FROM VERCEL:", key);

  return res.status(200).json({
    text: key ? "CLE PRESENTE" : "CLE ABSENTE"
  });

} catch (err) {
  return res.status(500).json({ text: err.message });
}

