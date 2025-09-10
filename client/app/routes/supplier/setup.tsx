import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  try {
    await api.get("/suppliers/me");
    return redirect("/supplier/products"); // 已有就别重复创建
  } catch {
    return null;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const api = createServerApi(request);
  const fd = await request.formData();
  const name = String(fd.get("name") || "").trim();
  const description = String(fd.get("description") || "");
  const image_url = String(fd.get("image_url") || "");
  const address = String(fd.get("address") || "");

  if (!name) return { error: "Supplier name is required" };

  try {
    await api.post("/suppliers", { name, description, image_url, address });
    return redirect("/supplier/products/new"); // 建档后直接去新建产品
  } catch (e: any) {
    return { error: e?.response?.data?.error || "Create supplier failed" };
  }
}

export default function SupplierSetup() {
  const nav = useNavigation();
  const res = useActionData() as { error?: string } | undefined;

  return (
    <section className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">Create Your Supplier Profile</h2>
      {res?.error && <p className="text-red-600">{res.error}</p>}
      <Form method="post" className="grid gap-3">
        <input name="name" placeholder="Supplier Name" className="border p-2 rounded" required />
        <input name="address" placeholder="Address" className="border p-2 rounded" />
        <input name="image_url" placeholder="Image URL" className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" className="border p-2 rounded" rows={3} />
        <button className="border rounded px-3 py-2 bg-black text-white" disabled={nav.state === "submitting"}>
          {nav.state === "submitting" ? "Saving..." : "Save"}
        </button>
      </Form>
    </section>
  );
}
