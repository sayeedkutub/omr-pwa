// Vercel Serverless Function — proxies to Hugging Face via novita provider (FREE)
// Uses Llama-4-Scout vision model for OMR bubble detection

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) {
    return res.status(500).json({ error: "HF_TOKEN is not configured." });
  }

  try {
    const { imageBase64, mimeType, prompt } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/novita/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
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
      const errMsg = data.error?.message || data.error || data.message || "API error";
      return res.status(response.status).json({ error: errMsg });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ text });
  } catch (err) {
    console.error("HF proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
