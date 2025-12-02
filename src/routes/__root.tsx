import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useChatStore } from "../store/useChatStore.ts";
import { useState } from "react";
import { RenameThreadModal } from "../components/RenameThreadModal.tsx";
import { ChatItem } from "../components/ChatItem.tsx";
import { NewChatItem } from "../components/NewChatItem.tsx";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { chats, deleteChat, renameChat } = useChatStore();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const openRenameModal = (chatId: string) => {
    setSelectedChatId(chatId);
    setTitleInput(chats[chatId].title ?? "");
    setIsRenameModalOpen(true);
  };

  const closeRenameModal = () => {
    setIsRenameModalOpen(false);
  };

  const handleRename = () => {
    if (!selectedChatId) return;
    renameChat(selectedChatId, titleInput);
    setIsRenameModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <RenameThreadModal
        title={titleInput}
        setTitle={setTitleInput}
        open={isRenameModalOpen}
        onClose={closeRenameModal}
        onSubmit={handleRename}
      />
      <nav className="w-[300px] bg-black fixed h-full text-white p-4 flex flex-col gap-4">
        <NewChatItem />
        <div className="overflow-y-auto h-full">
          {Object.keys(chats).map((uuid) => (
            <ChatItem
              uuid={uuid}
              title={chats[uuid].title}
              onRename={() => openRenameModal(uuid)}
              onEdit={() => deleteChat(uuid)}
            />
          ))}
        </div>
      </nav>
      <main className="flex-1 pl-[300px] pb-[50px] bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
