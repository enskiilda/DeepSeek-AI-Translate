module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/api/translate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
const NVIDIA_API_KEY = "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";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
async function POST(request) {
    try {
        const { text, targetLang, sourceLang } = await request.json();
        if (!text || !targetLang) {
            return Response.json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const prompt = `Translate the following text from ${sourceLang || "auto-detect"} to ${targetLang}. Only respond with the translation, no explanations:\n\n${text}`;
        const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-ai/deepseek-v3.1",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                stream: true
            })
        });
        if (!response.ok) {
            const error = await response.json();
            console.error("NVIDIA API Error:", error);
            return Response.json({
                error: error.error?.message || "Translation failed"
            }, {
                status: response.status
            });
        }
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start (controller) {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                if (reader) {
                    let streamComplete = false;
                    while(!streamComplete){
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, {
                            stream: true
                        });
                        const lines = chunk.split("\n").filter((line)=>line.trim() !== "");
                        for (const line of lines){
                            if (line.startsWith("data: ")) {
                                const data = line.slice(6);
                                if (data === "[DONE]") {
                                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                                    streamComplete = true;
                                    break;
                                }
                                try {
                                    const parsed = JSON.parse(data);
                                    const content = parsed.choices?.[0]?.delta?.content || "";
                                    if (content) {
                                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                            content
                                        })}\n\n`));
                                    }
                                } catch (e) {}
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
                "Connection": "keep-alive"
            }
        });
    } catch (error) {
        console.error("Translation error:", error);
        return Response.json({
            error: error.message || "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a3941730._.js.map