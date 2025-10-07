import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  try {
    await api.get("/suppliers/me");

    // 已有就别重复创建
    return redirect(`/${prefix}/supplier/products`);
  } catch {
    return null;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  const fd = await request.formData();
  const name = String(fd.get("name") || "").trim();
  const description = String(fd.get("description") || "");
  const image_url = String(fd.get("image_url") || "");
  const address = String(fd.get("address") || "");

  const place_id = String(fd.get("place_id") || "");
  const formatted_address = String(fd.get("formatted_address") || "");
  const lat = String(fd.get("lat") || "");
  const lng = String(fd.get("lng") || "");
  const address_components = String(fd.get("address_components") || "");

  if (!name) return { error: "Supplier name is required" };

  try {
    await api.post("/suppliers", {
      name,
      description,
      image_url,
      address, // 原始用户输入
      place_id,
      formatted_address,
      lat,
      lng,
      address_components, // JSON 字符串
    });

    // 建档后直接去新建产品
    return redirect(`/${prefix}/supplier/products/new`);
  } catch (e: any) {
    return { error: e?.response?.data?.error || "Create supplier failed" };
  }
}

export default function SupplierSetup() {
  const { t } = useTranslation();

  const nav = useNavigation();
  const res = useActionData() as { error?: string } | undefined;

  // 获取用户输入的地址框的dom元素
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [placeId, setPlaceId] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [componentsJson, setComponentsJson] = useState("");

  useEffect(() => {
    let listener: google.maps.MapsEventListener | undefined;

    async function ensureMapsScript() {
      // 若已存在脚本且 google 可用则直接返回
      if (window.google?.maps) return;

      // 动态注入 Google Maps 基础脚本
      const script = document.createElement("script");
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly`;
      script.async = true;
      script.defer = true;

      const done = new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Failed to load Google Maps JS"));
      });

      document.head.appendChild(script);
      await done;
    }

    async function setupAutocomplete() {
      await ensureMapsScript();

      // 按需加载 Places 库（函数式 API）
      await google.maps.importLibrary("places");

      if (!inputRef.current) return;

      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        fields: [
          "place_id",
          "formatted_address",
          "geometry",
          "address_components",
        ],
        // 限定区域为NZ
        componentRestrictions: { country: ["nz"] },
      });

      listener = ac.addListener("place_changed", () => {
        const p = ac.getPlace();
        if (!p) return;

        const pid = p.place_id || "";
        const fa = p.formatted_address || inputRef.current?.value || "";
        const loc = p.geometry?.location ?? null;
        const comps = p.address_components || [];

        setPlaceId(pid);
        setFormattedAddress(fa);
        if (loc) {
          setLat(String(loc.lat()));
          setLng(String(loc.lng()));
        } else {
          setLat("");
          setLng("");
        }
        setComponentsJson(JSON.stringify(comps));
      });
    }

    setupAutocomplete();

    // 清理：卸载时移除事件监听
    return () => {
      if (listener) listener.remove();
    };
  }, []);

  return (
    <section className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">
        {t("common:createYourSupplierProfile")}
      </h2>
      {res?.error && <p className="text-red-600">{res.error}</p>}

      <Form method="post" className="grid gap-3">
        <input
          name="name"
          placeholder="Supplier Name"
          className="border p-2 rounded"
          required
        />

        {/* Google 自动补全的可见输入（仍提交 address 作为原始文本/展示用） */}
        <input
          name="address"
          placeholder="Search address (Google Autocomplete)"
          className="border p-2 rounded"
          ref={inputRef}
          autoComplete="off"
        />

        {/* 隐藏字段：提交标准化结果 */}
        <input type="hidden" name="place_id" value={placeId} />
        <input
          type="hidden"
          name="formatted_address"
          value={formattedAddress}
        />
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />
        <input type="hidden" name="address_components" value={componentsJson} />

        <input
          name="image_url"
          placeholder="Image URL"
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 rounded"
          rows={3}
        />
        <button
          className="border rounded px-3 py-2 bg-black text-white"
          disabled={nav.state === "submitting"}
        >
          {nav.state === "submitting" ? "Saving..." : "Save"}
        </button>
      </Form>
    </section>
  );
}
