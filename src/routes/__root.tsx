import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useChatStore } from '../useChatStore.ts';
import { BsFillPencilFill, BsFillPlusCircleFill, BsFillTrashFill } from 'react-icons/bs';
import { useState } from 'react';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { chats , deleteChat, renameChat } = useChatStore();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const openRenameModal = (chatId: string) => {
    setCurrentChatId(chatId);
    setTitle(chats[chatId].title ?? "");
    setIsRenameModalOpen(true);
  };

  const handleRename = () => {
    if (!currentChatId) return;
    renameChat(currentChatId, title);
    setIsRenameModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      <nav className="w-[200px] bg-black fixed h-full text-white p-4 flex flex-col gap-4">
        <a href="/" className="flex items-center gap-2">New chat <BsFillPlusCircleFill /></a>
        <div />
        {Object.keys(chats).map(uuid => <div className="flex gap-2 items-center" >
          <a href={`/chat/${uuid}`} className="max-w-[200px] truncate">{chats[uuid].title}</a>
          <BsFillPencilFill onClick={() => openRenameModal(uuid)} className="hover:fill-gray-500 transiton-all" />
          <BsFillTrashFill onClick={() => deleteChat(uuid)} className="shrink-0 hover:fill-red-500 transiton-all" />
        </div>)}
      </nav>
      <main className="flex-1 pl-[200px] pb-[50px] bg-gray-100">
        <Outlet />
      </main>
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col gap-4 w-[300px]">
            <h2 className="text-xl font-semibold">Rename Chat</h2>

            <input
              className="border border-gray-300 rounded-md p-2 w-full"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                className="w-1/2 py-2 bg-gray-200 rounded-md"
                onClick={() => setIsRenameModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="w-1/2 py-2 bg-black text-white rounded-md"
                onClick={handleRename}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}