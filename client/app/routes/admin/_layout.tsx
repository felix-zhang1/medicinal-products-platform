import {
  Outlet,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { User } from "~/lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  try {
    const { data } = await api.get<User>("/users/me");
    if (data.role !== "admin") {
      return redirect("/login?redirectTo=/admin");
    }
    return { user: data };
  } catch {
    return redirect("/login?redirectTo=/admin");
  }
}

export default function AdminLayout() {
  const { user } = useLoaderData() as { user: User };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <nav className="flex gap-4 text-sm">
        <a href="/admin/products" className="underline">
          Products
        </a>
        <a href="/admin/orders" className="underline">
          Orders
        </a>
        {/* 后续：/admin/categories /admin/suppliers /admin/users */}
      </nav>
      <Outlet />
    </div>
  );
}
