import { GeminiResponse } from "@/app/types/types";

export async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("api key is missing");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1500,
            responseMimeType: "application/json",
          },
        }),
      },
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }
    const data = (await res.json()) as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Gemini returned empty response");
    }
    return text;
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      if (e.name === "AbortError") {
        throw new Error("gemini response error");
      }
      throw e;
    }
    throw new Error("internal server error");
  } finally {
    clearTimeout(timeout);
  }
}
