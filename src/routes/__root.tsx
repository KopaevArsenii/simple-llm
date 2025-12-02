import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useChatStore } from '../useChatStore.ts';
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { chats , deleteChat } = useChatStore();
  return (
    <div className="flex min-h-screen">
      <nav className="w-[200px] bg-black fixed h-full text-white p-4 flex flex-col gap-4">
        <a href="/" className="flex items-center gap-2"><BsFillPencilFill /> New chat</a>
        <div />
        {Object.keys(chats).map(uuid => <div className="flex gap-2 items-center" >
          <a href={`/chat/${uuid}`} className="max-w-[200px] truncate">{uuid}</a>
          <BsFillTrashFill onClick={() => deleteChat(uuid)} className="shrink-0 hover:fill-red-500" />
        </div>)}
      </nav>
      <main className="flex-1 pl-[200px] pb-[50px] bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}