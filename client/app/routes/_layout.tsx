import { Outlet } from "react-router-dom";
import Nav from "~/components/Nav";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
