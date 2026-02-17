// /api/test-env.js
export default async function handler(req, res) {
  // Vérifie si le token Hugging Face est présent dans les variables d'environnement
  const tokenStatus = process.env.HUGGING_KEY
    ? "TOKEN PRESENT ✅"
    : "TOKEN MISSING ❌";

  return res.status(200).json({
    test_env: tokenStatus
  });
}
