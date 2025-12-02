import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useChatStore } from "../store/useChatStore.ts";
import { type FormEvent, useState } from "react";
import { QuestionInput } from "../components/QuestionInput.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { createChat, addUserMessage } = useChatStore();
  const [question, setQuestion] = useState("");

  const handleCreateChatClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = createChat();
    addUserMessage(uuid, question);
    await navigate({
      to: "/chat/$uuid",
      params: { uuid },
    });
  };

  return (
    <div className="min-h-screen max-w-[768px] mx-auto  flex flex-col p-[20px]">
      <div className="flex-1 overflow-y-auto flex justify-center items-center text-[38px] font-bold">
        Feel free to ask whatever you want!
      </div>
      <QuestionInput
        value={question}
        onChange={setQuestion}
        onSubmit={handleCreateChatClick}
      />
    </div>
  );
}
