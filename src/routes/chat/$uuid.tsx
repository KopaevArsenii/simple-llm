import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useChatStore } from "../../store/useChatStore.ts";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { QuestionInput } from "../../components/QuestionInput.tsx";
import { useOpenRouter } from "../../hooks/useOpenRouter.ts";
import { MessageItem } from "../../components/MessageItem.tsx";

export const Route = createFileRoute("/chat/$uuid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { uuid } = useParams({ from: "/chat/$uuid" });
  const navigate = useNavigate();

  const { chats, addUserMessage } = useChatStore();
  const messages = useMemo(() => {
    return chats[uuid]?.messages ?? [];
  }, [chats, uuid]);
  const { loading, sendMessage, abort } = useOpenRouter(uuid, messages);
  const [question, setQuestion] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom on message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Go home if chat was deleted
  useEffect(() => {
    if (messages.length === 0) navigate({ to: "/" });
  }, [messages]);

  // Send request after redirect
  useEffect(() => {
    if (
      messages.length === 1 &&
      messages[0].role === "user" &&
      !hasInitializedRef.current
    ) {
      hasInitializedRef.current = true;
      sendMessage(messages[0].content).then(() => {});
    }
  }, [messages, sendMessage]);

  // Track scroll
  useEffect(() => {
    const onScroll = () => {
      setIsAtBottom(
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 20,
      );
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question) return;
    addUserMessage(uuid, question);
    const message = question;
    setQuestion("");
    await sendMessage(message);
  };

  return (
    <div className="max-w-[768px] mx-auto flex flex-col p-[20px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      <QuestionInput
        value={question}
        onChange={setQuestion}
        onSubmit={handleSend}
        onAbort={() => abort()}
        loading={loading}
        scrollToBottom={scrollToBottom}
        showScrollToBottomButton={!isAtBottom && !loading}
      />
    </div>
  );
}
