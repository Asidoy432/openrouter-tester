export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, model, reasoning } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "OPENROUTER_API_KEY not set in environment variables" });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://openrouter-tester.vercel.app",
      },
      body: JSON.stringify({
        model: model || "openai/gpt-oss-120b:free",
        messages: [{ role: "user", content: message }],
        ...(reasoning ? { reasoning: { enabled: true } } : {}),
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

