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
  
  // Translation endpoint (proxy to NVIDIA API with streaming)
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLang, sourceLang } = req.body;

      if (!text || !targetLang) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const prompt = `Translate the following text from ${sourceLang || "auto-detect"} to ${targetLang}. Only respond with the translation, no explanations:\n\n${text}`;

      const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-ai/deepseek-v3.1",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 16384,
          stream: true
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("NVIDIA API Error:", error);
        return res.status(response.status).json({ error: error.error?.message || "Translation failed" });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullTranslation = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(line => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                res.write("data: [DONE]\n\n");
                break;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  fullTranslation += content;
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
              } catch (e) {
              }
            }
          }
        }
      }

      res.end();

      // Save to database after streaming completes
      if (fullTranslation) {
        await storage.saveTranslation({
          sourceText: text,
          translatedText: fullTranslation,
          sourceLang: sourceLang || "auto",
          targetLang,
        });
      }
    } catch (error: any) {
      console.error("Translation error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
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
