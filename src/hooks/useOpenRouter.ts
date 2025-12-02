import { useRef, useState } from "react";
import { OpenRouter } from "@openrouter/sdk";
import { useChatStore } from "../store/useChatStore";
import type { Message } from "../types";

export function useOpenRouter(uuid: string, messages: Message[]) {
  const { addAssistantMessage, appendAssistantDelta } = useChatStore();
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (prompt: string) => {
    setLoading(true);

    abortRef.current = new AbortController();
    const controller = abortRef.current;

    try {
      const openRouter = new OpenRouter({
        apiKey: import.meta.env.VITE_API_KEY,
      });

      const stream = await openRouter.chat.send(
        {
          model: "openai/gpt-5-mini",
          messages: [...messages, { role: "user", content: prompt }],
          stream: true,
          streamOptions: { includeUsage: true },
        },
        {
          signal: controller.signal,
        },
      );

      addAssistantMessage(uuid, "");

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) appendAssistantDelta(uuid, delta);
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setLoading(false);
    }
  };

  const abort = () => {
    abortRef.current?.abort();
  };

  return {
    loading,
    sendMessage,
    abort,
  };
}
