import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="flex min-h-screen">
      <nav className="w-[200px] bg-gray-800 text-white p-4 flex flex-col gap-4">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
      <main className="flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}