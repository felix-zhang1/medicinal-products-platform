import { useMemo } from "react";
import SupplierMap from "./SupplierMap";
import { useTranslation } from "react-i18next";

type SupplierInfo = {
  id: number;
  name: string;
  formatted_address?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  image_url?: string | null;
  description?: string | null;
  place_id?: string | null;
};

type UserInfo = {
  id: number;
  email: string;
  username: string | null;
  role: "buyer" | "supplier" | "admin";
  supplier?: SupplierInfo | null;
};

export default function UserProfileShell({ user }: { user: UserInfo }) {
  const { t } = useTranslation();

  const isAdmin = user.role === "admin";
  const isSupplier = user.role === "supplier";

  const supplier = user.supplier ?? null;
  const supplierLatLng = useMemo(() => {
    if (!supplier?.lat || !supplier?.lng) return null;

    // 确保将lat,lng的数值类型为number
    const lat =
      typeof supplier.lat === "string"
        ? parseFloat(supplier.lat)
        : supplier.lat;
    const lng =
      typeof supplier.lng === "string"
        ? parseFloat(supplier.lng)
        : supplier.lng;

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  }, [user]);

  return (
    <section className="space-y-6 max-w-3xl">
      {/* Overview */}
      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-3">{t("common:overview")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">{t("common:userId")}:</span>{" "}
            {user.id}
          </div>
          <div>
            <span className="text-gray-500">{t("common:role")}:</span>{" "}
            {user.role}
          </div>
          <div>
            <span className="text-gray-500">{t("common:username")}:</span>{" "}
            {user.username || "-"}
          </div>
          <div>
            <span className="text-gray-500">{t("common:email")}:</span>{" "}
            {user.email}
          </div>
        </div>
      </div>

      {/* Supplier section（仅 supplier 或 admin 且该用户确有 supplier 记录时显示） */}
      {(isSupplier || isAdmin) && supplier && (
        <div className="rounded-xl border p-4">
          <h3 className="text-lg font-semibold mb-3">
            {t("common:supplierRole")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">{t("common:supplierId")}:</span>{" "}
              {supplier.id}
            </div>
            <div>
              <span className="text-gray-500">{t("common:name")}:</span>{" "}
              {supplier.name}
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500">{t("common:address")}:</span>{" "}
              {supplier.formatted_address || "-"}
            </div>
            {supplier.image_url && (
              <div className="md:col-span-2">
                <img
                  src={supplier.image_url}
                  alt="supplier"
                  className="max-h-40 rounded"
                />
              </div>
            )}
          </div>

          {/* 地图 */}
          {supplierLatLng ? (
            <div className="mt-3">
              <div className="text-sm text-gray-500 mb-1">
                {t("common:locationPreview")}({supplierLatLng.lat.toFixed(5)},{" "}
                {supplierLatLng.lng.toFixed(5)})
              </div>
              <SupplierMap lat={supplierLatLng.lat} lng={supplierLatLng.lng} />
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              {t("common:noLocationSet")}.
            </p>
          )}
        </div>
      )}

      {/* Security / Settings（示例位） */}
      <div className="rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-2">
          {t("common:userSecuritySettings")}
        </h3>
        <p className="text-sm text-gray-600">
          (TODO page)Change password, enable 2FA
        </p>
      </div>
    </section>
  );
}
