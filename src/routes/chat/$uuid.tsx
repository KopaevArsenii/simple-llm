import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useChatStore } from "../../store/useChatStore.ts";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { QuestionInput } from "../../components/QuestionInput.tsx";
import { useOpenRouter } from "../../hooks/useOpenRouter.ts";
import { MessageItem } from "../../components/MessageItem.tsx";
import { v4 as getUuid } from "uuid";

export const Route = createFileRoute("/chat/$uuid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { uuid } = useParams({ from: "/chat/$uuid" });
  const navigate = useNavigate();

  const { chats, addUserMessage } = useChatStore();
  const { messages } = chats[uuid];
  const [question, setQuestion] = useState("");
  const { loading, sendMessage, abort } = useOpenRouter(uuid, messages);

  const bottomRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <MessageItem key={getUuid()} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      <QuestionInput
        value={question}
        onChange={setQuestion}
        onSubmit={handleSend}
        onAbort={() => abort()}
        loading={loading}
      />
    </div>
  );
}
