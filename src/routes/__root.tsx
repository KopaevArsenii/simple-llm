import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router';
import { useChatStore } from '../useChatStore.ts';

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { chats } = useChatStore();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      <nav className="w-[200px] bg-black fixed h-full text-white p-4 flex flex-col gap-4">
        <a href="/">New chat</a>
        <div />
        {Object.keys(chats).map(item => <div onClick={() => navigate({ to: `/chat/$uuid`, params: { uuid: item}})} className="max-w-[200px] truncate">{item}</div>)}
      </nav>
      <main className="flex-1 pl-[200px] pb-[50px] bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}