const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ou global fetch si Node 18+

const app = express();
const PORT = 3000;

// 🔑 Met ton token ici directement
const HF_TOKEN = "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";

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ text: "Message vide" });

  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_new_tokens: 512,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ text: `Erreur IA provider : ${JSON.stringify(data)}` });
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || "🤖 Pas de réponse du modèle.";
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ text: `Erreur serveur : ${err.message}` });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

