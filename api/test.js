export default async function handler(req, res) {

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: "Explique en une phrase ce qu'est la gestion patrimoniale."
      })
    }
  );

  const data = await response.json();

  return res.status(200).json({
    raw: data
  });
}
