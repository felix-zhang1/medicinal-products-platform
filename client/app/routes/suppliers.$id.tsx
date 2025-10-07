import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { createServerApi } from "~/lib/net";
import SupplierMap from "~/components/SupplierMap";
import { useTranslation } from "react-i18next";

type Supplier = {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  formatted_address?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const { data } = await api.get<Supplier>(`/suppliers/${params.id}`);
  return data;
}

export default function SupplierDetailPage() {
  const { t } = useTranslation();
  const s = useLoaderData() as Supplier;

  const latNum =
    typeof s.lat === "string" ? parseFloat(s.lat) : (s.lat as number | null);
  const lngNum =
    typeof s.lng === "string" ? parseFloat(s.lng) : (s.lng as number | null);
  const hasLocation =
    Number.isFinite(latNum as number) && Number.isFinite(lngNum as number);

  return (
    <section className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-semibold">
        {t("common:supplierRole")}: {s.name}
      </h1>

      <div className="rounded-xl border p-4 space-y-3">
        {s.image_url && (
          <img
            src={s.image_url}
            alt={s.name}
            className="max-h-48 rounded border"
          />
        )}

        <div className="text-sm">
          <div className="mb-1">
            <span className="text-gray-500">{t("common:supplierId")}:</span>{" "}
            {s.id}
          </div>
          <div className="mb-1">
            <span className="text-gray-500">{t("common:address")}:</span>{" "}
            {s.formatted_address || "-"}
          </div>
          {s.description && (
            <>
              <span className="text-gray-500">{t("common:description")}:</span>{" "}
              {s.description || "-"}
            </>
          )}
        </div>

        {hasLocation ? (
          <div className="mt-2">
            <div className="text-sm text-gray-500 mb-1">
              {t("common:locationPreview")} ({latNum!.toFixed(5)},{" "}
              {lngNum!.toFixed(5)})
            </div>
            <SupplierMap lat={latNum as number} lng={lngNum as number} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
