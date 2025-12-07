// OpenAI-compatible API client for NVIDIA NIM
const API_KEY = "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";
const BASE_URL = "https://integrate.api.nvidia.com/v1";

export interface TranslationRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

export async function translateText({ text, targetLang, sourceLang = "auto" }: TranslationRequest) {
  if (!text.trim()) return "";

  const systemPrompt = `You are a professional translator. Translate the user's text into ${targetLang}. 
  Maintain the original tone and style. 
  Do not explain the translation. 
  Do not add notes. 
  Just provide the translated text.`;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v3.1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        temperature: 0.3,
        max_tokens: 1024,
        stream: false
      }),
    });

    if (!response.ok) {
        const err = await response.json();
        console.error("NVIDIA API Error:", err);
        throw new Error(err.error?.message || "Translation failed");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Translation error details:", error);
    // Fallback logic
    return translateTextWithFallback({ text, targetLang, sourceLang });
  }
}

async function translateTextWithFallback({ text, targetLang }: TranslationRequest) {
    console.log("Attempting fallback model...");
    try {
      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-r1", 
          messages: [
            { role: "system", content: `Translate to ${targetLang}. Only output the translation.` },
            { role: "user", content: text }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Fallback API Error:", err);
        throw new Error(err.error?.message || "Fallback failed");
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (fallbackError) {
       console.error("Fallback failed:", fallbackError);
       throw fallbackError;
    }
}
