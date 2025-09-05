import {
  Outlet,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import Nav from "~/components/Nav";
import { createServerApi } from "~/lib/net";
import type { User } from "~/lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  try {
    const { data } = await api.get<User>("/users/me");
    return { user: data };
  } catch {
    return { user: null as User | null };
  }
}

export default function RootLayout() {
  const { user } = useLoaderData() as { user: User | null };
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav user={user} />
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
