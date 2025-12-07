export interface TranslationRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

export async function translateText({ text, targetLang, sourceLang = "auto" }: TranslationRequest) {
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

    const data = await response.json();
    return data.translatedText || "";
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
