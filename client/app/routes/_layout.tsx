import {
  Outlet,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { redirect } from "react-router";
import { useEffect } from "react";
import Nav from "~/components/Nav";
import { createServerApi } from "~/lib/net";
import type { User } from "~/lib/types";
import i18n from "~/i18n";
import Footer from "~/components/Footer";

export async function loader({ request, params }: LoaderFunctionArgs) {
  // Get the route dynamic parameter (en or zh); if i18n.language is different, switch to the parameter value
  const urlLng = params.lng; // 允许任何 :lng 命中
  const supported = new Set(["en", "zh"]);

  // 如果没有语言码或不受支持，直接 302 到 /en
  if (!urlLng || !supported.has(urlLng)) {
    throw redirect("/en");
  }

  // 与 i18n 同步语言
  if (i18n.language !== urlLng) {
    await i18n.changeLanguage(urlLng);
  }

  const api = createServerApi(request);
  try {
    const { data } = await api.get<User>("/users/me");
    return { user: data, lng: urlLng as "en" | "zh" };
  } catch {
    return { user: null as User | null, lng: urlLng as "en" | "zh" };
  }
}

export default function RootLayout() {
  const { user, lng } = useLoaderData() as {
    user: User | null;
    lng: "en" | "zh";
  };

  useEffect(() => {
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Nav user={user} />

      <main className="flex-1 mx-auto max-w-6xl p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
