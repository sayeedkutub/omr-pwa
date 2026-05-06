// Vercel Serverless Function — proxies to OpenRouter (FREE models)
// No API key cost — just a free OpenRouter account needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "OPENROUTER_KEY is not configured. Get a free key from openrouter.ai/keys",
    });
  }

  try {
    const { imageBase64, mimeType, prompt } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://omr-pwa.vercel.app",
        "X-Title": "OMR Marking System",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}` },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || data.error || "OpenRouter API error";
      return res.status(response.status || 500).json({ error: errMsg });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (err) {
    console.error("OpenRouter proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
