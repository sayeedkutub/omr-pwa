// Vercel Serverless Function — proxies to OpenRouter (FREE vision models)

const FREE_MODELS = [
  "qwen/qwen-2.5-vl-72b-instruct:free",
  "google/gemini-2.5-flash-preview:free", 
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-4-scout:free",
  "qwen/qwen2.5-vl-32b-instruct:free",
];

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

  const { imageBase64, mimeType, prompt } = req.body;

  // Try each free model until one works
  for (const model of FREE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://omr-pwa.vercel.app",
          "X-Title": "OMR Marking System",
        },
        body: JSON.stringify({
          model,
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

      // If this model works, return the result
      if (response.ok && !data.error) {
        const text = data.choices?.[0]?.message?.content || "";
        return res.status(200).json({ text, model });
      }

      // If "no endpoints" or "not found", try next model
      const errMsg = data.error?.message || data.error || "";
      if (errMsg.includes("No endpoints") || errMsg.includes("not found") || errMsg.includes("not supported")) {
        console.log(`Model ${model} unavailable, trying next...`);
        continue;
      }

      // Other error (rate limit, etc.) — return it
      return res.status(response.status).json({ error: errMsg });
    } catch (err) {
      console.log(`Model ${model} failed: ${err.message}`);
      continue;
    }
  }

  return res.status(500).json({
    error: "সব ফ্রি মডেল ব্যস্ত। কিছুক্ষণ পর আবার চেষ্টা করুন।",
  });
}
