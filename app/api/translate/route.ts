import { NextRequest } from "next/server";

const NVIDIA_API_KEY = "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";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await request.json();

    if (!text || !targetLang) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
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
        stream: true
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("NVIDIA API Error:", error);
      return Response.json({ error: error.error?.message || "Translation failed" }, { status: response.status });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

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
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  break;
                }
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  if (content) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                }
              }
            }
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Translation error:", error);
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
