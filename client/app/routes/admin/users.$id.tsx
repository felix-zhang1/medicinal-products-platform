import {
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import UserProfileShell from "~/components/UserProfileShell";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const id = params.id!;
  try {
    // 先拿当前用户，确认是 admin
    const me = await api.get("/users/me");
    if (me.data?.role !== "admin") {
      const prefix = params.lng ?? "en";
      return redirect(`/${prefix}/403`);
    }
    const { data } = await api.get(`/users/${id}?include=supplier`);
    return data;
  } catch {
    const prefix = params.lng ?? "en";
    return redirect(`/${prefix}/login`);
  }
}

export default function AdminUserDetailPage() {
  const user = useLoaderData() as any;
  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Detail</h2>
      <UserProfileShell user={user} />
    </main>
  );
}
