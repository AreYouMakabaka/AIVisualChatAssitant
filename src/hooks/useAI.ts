import { useCallback, useRef } from "react";
import type { Message, AppConfig } from "@/types";

interface AIResponse {
  content: string;
  tokens: number;
}

export function useAI() {
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (
      messages: Message[],
      currentImage: string | null,
      config: AppConfig
    ): Promise<AIResponse> => {
      // Cancel any previous request before starting a new one
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const apiUrl = `${config.apiBase}/v1/chat/completions`;

      // Build messages with context limit
      const contextMessages = messages.slice(-config.maxContextRounds * 2);

      const apiMessages = contextMessages.map((msg) => {
        if (msg.role === "user" && msg.imageUrl) {
          return {
            role: "user",
            content: [
              { type: "text", text: msg.content },
              {
                type: "image_url",
                image_url: { url: msg.imageUrl },
              },
            ],
          };
        }
        return {
          role: msg.role,
          content: msg.content,
        };
      });

      // Add system prompt
      const systemPrompt = {
        role: "system",
        content:
          "你是一个友好的 AI 视觉对话助手。你可以看到用户摄像头中的画面，听到用户说的话。请用中文自然、亲切地回应用户，回答简洁明了。如果用户画面中有什么有趣的事物，可以主动提及。注意：回复中不要包含任何 Emoji 表情符号。",
      };

      // If there's a current image not yet in messages, add it
      const finalMessages = [systemPrompt, ...apiMessages];
      if (currentImage && !messages.some((m) => m.imageUrl === currentImage)) {
        finalMessages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: "这是当前摄像头画面的截图，请根据这个画面回答我。",
            },
            {
              type: "image_url",
              image_url: { url: currentImage },
            },
          ],
        });
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: finalMessages,
          max_tokens: 800,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const rawContent = data.choices[0]?.message?.content || "";
      // Strip emoji as fallback
      const cleanContent = rawContent.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2B06}]|[\u{2B07}]|[\u{2B05}]|[\u{27A1}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{2934}-\u{2935}]|[\u{25AA}-\u{25AB}]|[\u{25FB}-\u{25FE}]|[\u{25FD}-\u{25FE}]|[\u{25FC}]|[\u{25B6}]|[\u{25C0}]|[\u{1F200}-\u{1F251}]|[\u{1F004}]|[\u{1F0CF}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{24C2}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]|[\u{E000}-\u{F8FF}]|[\u{FE30}-\u{FE4F}]|[\u{FE50}-\u{FE6F}]|[\u{FF00}-\u{FFEF}]|[\u{FFF0}-\u{FFFF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{2300}-\u{23FF}]/gu, "").trim();

      // Clear abort ref only if this request wasn't aborted
      if (abortRef.current === controller) {
        abortRef.current = null;
      }

      return {
        content: cleanContent,
        tokens: data.usage?.total_tokens || 0,
      };
    },
    []
  );

  const cancelRequest = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  // Helper to check if an error is from abort
  const isAbortError = (err: unknown): boolean => {
    return err instanceof Error && (err.name === "AbortError" || err.message?.includes("aborted"));
  };

  return { sendMessage, cancelRequest, isAbortError };
}
