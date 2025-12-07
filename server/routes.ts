import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranslationSchema } from "@shared/schema";

const NVIDIA_API_KEY = "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";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Translation endpoint (proxy to NVIDIA API)
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLang, sourceLang } = req.body;

      if (!text || !targetLang) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const systemPrompt = `You are a professional translator. Translate the user's text into ${targetLang}. 
      Maintain the original tone and style. 
      Do not explain the translation. 
      Do not add notes. 
      Just provide the translated text.`;

      const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
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
        const error = await response.json();
        console.error("NVIDIA API Error:", error);
        return res.status(response.status).json({ error: error.error?.message || "Translation failed" });
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content || "";

      // Save to database
      await storage.saveTranslation({
        sourceText: text,
        translatedText,
        sourceLang: sourceLang || "auto",
        targetLang,
      });

      res.json({ translatedText });
    } catch (error: any) {
      console.error("Translation error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Get recent translations
  app.get("/api/translations", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const translations = await storage.getRecentTranslations(limit);
      res.json(translations);
    } catch (error: any) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  return httpServer;
}
