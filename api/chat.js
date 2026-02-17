export default async function handler(req, res) {
  return res.status(200).json({
    test_env: process.env.HUGGING_KEY ? "TOKEN PRESENT" : "TOKEN MISSING"
  });
}

