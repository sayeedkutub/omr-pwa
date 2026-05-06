// Vercel Serverless Function — proxies to Hugging Face Inference API (FREE)
// Uses Qwen2.5-VL vision model for OMR bubble detection

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: "HF_TOKEN is not configured. Get a free token from huggingface.co/settings/tokens" });
  }

  try {
    const { imageBase64, mimeType, prompt } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/Qwen/Qwen2.5-VL-7B-Instruct/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-VL-7B-Instruct",
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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error || data.message || "Hugging Face API error";
      return res.status(response.status).json({ error: errMsg });
    }

    // Extract text from HF response (OpenAI-compatible format)
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (err) {
    console.error("HF proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
