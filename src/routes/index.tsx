import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useChatStore } from '../useChatStore.ts';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const { createChat, addUserMessage } = useChatStore();
  const handleCreateChatClick = () => {
    const uuid = createChat()
    addUserMessage(uuid, question)
    navigate({
      to: "/chat/$uuid",
      params: { uuid }
    })
  }
  return <div className="min-h-screen max-w-[768px] mx-auto  flex flex-col p-[20px]">
    <div className="flex-1 overflow-y-auto flex justify-center items-center text-[38px] font-bold">Feel free to ask whatever you want!</div>

    <form
      onSubmit={handleCreateChatClick}
      className="flex space-x-2 items-center fixed bottom-[20px] w-[768px] bg-gray-100"
    >
      <input
        type="text"
        className="flex-1 p-3 rounded-xl border"
        placeholder="Enter message..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        type="submit"
        className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
        disabled={true}
      >
        Pause
      </button>
      <button
        type="submit"
        className="p-3 rounded-xl bg-black text-white disabled:opacity-50"
      >
        Send
      </button>
    </form>
  </div>
}