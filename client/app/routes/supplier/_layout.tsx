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
    if (data.role !== "supplier") {
      return redirect("/login?redirectTo=/supplier");
    }
    return { user: data };
  } catch {
    return redirect("/login?redirectTo=/supplier");
  }
}

export default function SupplierLayout() {
  const { user } = useLoaderData() as { user: User };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Supplier Console</h1>
      <nav className="flex gap-4 text-sm">
        <a href="/supplier/products" className="underline">
          My Products
        </a>
      </nav>
      <Outlet />
    </div>
  );
}
