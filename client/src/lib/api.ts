export interface TranslationRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
  onChunk?: (chunk: string) => void;
}

export async function translateText({ text, targetLang, sourceLang = "auto", onChunk }: TranslationRequest) {
  if (!text.trim()) return "";

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLang,
        sourceLang,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Translation failed");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullText += parsed.content;
                onChunk?.(fullText);
              }
            } catch (e) {
            }
          }
        }
      }
    }

    return fullText;
  } catch (error: any) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function getRecentTranslations(limit: number = 20) {
  try {
    const response = await fetch(`/api/translations?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch translations");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching translations:", error);
    return [];
  }
}
