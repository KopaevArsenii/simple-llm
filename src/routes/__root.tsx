import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex min-h-screen">
      <nav className="w-[200px] bg-black fixed h-full text-white p-4 flex flex-col gap-4">
        <a href="/">New chat</a>
      </nav>
      <main className="flex-1 pl-[200px] pb-[50px] bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}