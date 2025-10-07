import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/Button";

type Supplier = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  address?: string | null;
  place_id?: string | null;
  formatted_address?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  address_components?: string | null;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const prefix = params.lng ?? "en";
  try {
    const { data } = await api.get<Supplier>("/suppliers/me");
    return data;
  } catch {
    // 没有 supplier 资料时，引导去创建
    return redirect(`/${prefix}/supplier/setup`);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const api = createServerApi(request);
  const prefix = params.lng ?? "en";
  const fd = await request.formData();
  const id = String(fd.get("id") || "");

  await api.put(`/suppliers/${id}`, fd);

  return redirect(`/${prefix}/account`);
}

export default function EditMySupplier() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const { t } = useTranslation();
  const s = useLoaderData() as Supplier;
  const nav = useNavigation();
  const res = useActionData() as { error?: string } | undefined;

  const inputRef = useRef<HTMLInputElement | null>(null);

  // 状态：默认用后端返回值预填，可被 Google 选择覆盖
  const [placeId, setPlaceId] = useState(s.place_id || "");
  const [formattedAddress, setFormattedAddress] = useState(
    s.formatted_address || ""
  );
  const [lat, setLat] = useState<string>(s.lat ? String(s.lat) : "");
  const [lng, setLng] = useState<string>(s.lng ? String(s.lng) : "");
  const [componentsJson, setComponentsJson] = useState(
    s.address_components || ""
  );

  useEffect(() => {
    let listener: google.maps.MapsEventListener | undefined;

    async function ensureMaps() {
      if (!window.google?.maps) {
        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly`;
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Failed to load Google Maps JS"));
          document.head.appendChild(script);
        });
      }
      // @ts-ignore
      if (google.maps.importLibrary) await google.maps.importLibrary("places");

      if (!inputRef.current) return;
      const ac = new google.maps.places.Autocomplete(inputRef.current, {
        fields: [
          "place_id",
          "formatted_address",
          "geometry",
          "address_components",
        ],
        componentRestrictions: { country: ["nz"] },
      });
      listener = ac.addListener("place_changed", () => {
        const p = ac.getPlace();
        if (!p) return;
        setPlaceId(p.place_id || "");
        setFormattedAddress(
          p.formatted_address || inputRef.current?.value || ""
        );
        const loc = p.geometry?.location ?? null;
        if (loc) {
          setLat(String(loc.lat()));
          setLng(String(loc.lng()));
        } else {
          setLat("");
          setLng("");
        }
        setComponentsJson(JSON.stringify(p.address_components || []));
      });
    }
    ensureMaps();
    return () => listener?.remove();
  }, []);

  return (
    <section className="space-y-4 max-w-lg">
      <h2 className="text-xl font-semibold">{t("common:editSupplier")}</h2>
      {res?.error && <p className="text-red-600">{res.error}</p>}

      <Form method="post" className="grid gap-3" encType="multipart/form-data">
        <input type="hidden" name="id" value={s.id} />

        <label className="text-sm">{t("common:name")}</label>
        <input
          name="name"
          defaultValue={s.name}
          className="border p-2 rounded"
          required
        />

        <label className="text-sm">{t("common:address")}</label>
        <input
          name="address"
          defaultValue={s.address || ""}
          placeholder="Search or type address"
          className="border p-2 rounded"
          ref={inputRef}
          autoComplete="off"
        />

        {/* 隐藏提交：标准化地址数据 */}
        <input type="hidden" name="place_id" value={placeId} />
        <input
          type="hidden"
          name="formatted_address"
          value={formattedAddress}
        />
        <input type="hidden" name="lat" value={lat} />
        <input type="hidden" name="lng" value={lng} />
        <input type="hidden" name="address_components" value={componentsJson} />

        <label className="text-sm">
          {t("common:image")}{" "}
          <span className="text-gray-500">({t("common:optional")})</span>
        </label>

        {/* 选择文件按钮（点击触发隐藏的 <input type="file" />） */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileRef.current?.click()}
            leadingIcon={<span aria-hidden>📷</span>}
          >
            {t("common:chooseImage") || "Choose image"}
          </Button>
          <span className="text-sm text-gray-600">
            {fileName || t("common:noFileSelected") || "No file selected"}
          </span>
        </div>

        {/* 隐藏的文件输入：name 必须叫 image 才能被后端的 upload.single('image') 接住 */}
        <input
          ref={fileRef}
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f) {
              setFileName(f.name);
              setPreviewUrl(URL.createObjectURL(f));
            } else {
              setFileName("");
              setPreviewUrl("");
            }
          }}
        />

        {/* 预览（优先展示新选的文件；否则展示已有的 image_url） */}
        {previewUrl ? (
          <img src={previewUrl} alt="preview" className="h-20 rounded border" />
        ) : s.image_url ? (
          <img
            src={s.image_url}
            alt="current"
            className="h-20 rounded border"
          />
        ) : null}

        <label className="text-sm">
          {t("common:imageUrl")}{" "}
          <span className="text-gray-500">({t("common:optional")})</span>
        </label>

        <input
          name="image_url"
          defaultValue={s.image_url || ""}
          className="border p-2 rounded"
        />

        <label className="text-sm">{t("common:description")}</label>
        <textarea
          name="description"
          defaultValue={s.description || ""}
          className="border p-2 rounded"
          rows={3}
        />

        <Button type="submit" loading={nav.state === "submitting"}>
          {nav.state === "submitting"
            ? t("common:saving") || "Saving..."
            : t("common:save") || "Save"}
        </Button>
      </Form>
    </section>
  );
}
