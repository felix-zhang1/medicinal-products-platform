import { NavLink, Form } from "react-router-dom";
import type { User } from "~/lib/types";
import LanguageSwitcher from "~/components/LanguageSwitcher";
import { usePrefix } from "~/hooks/usePrefix";
import { useTranslation } from "react-i18next";

// common highlight style (with bottom border)
function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-green-600 font-semibold border-b-2 border-green-600 pb-1"
    : "text-gray-600 hover:text-green-500";
}

export default function Nav({ user }: { user: User | null }) {
  const prefix = usePrefix();
  const { t } = useTranslation(["home", "common"]);
  return (
    <header className="border-b bg-green-50/80  backdrop-blur shadow-sm">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* for all roles */}
        <NavLink to={`${prefix}/`} end className={navLinkClass}>
          {t("common:appName")}
        </NavLink>
        <NavLink to={`${prefix}/products`} className={navLinkClass}>
          {t("common:products")}
        </NavLink>

        {/* Buyer only */}
        {user?.role === "buyer" && (
          <>
            <NavLink to={`${prefix}/cart`} className={navLinkClass}>
              {t("common:cart")}
            </NavLink>
            <NavLink to={`${prefix}/favorites`} className={navLinkClass}>
              {t("common:favorites")}
            </NavLink>
            <NavLink to={`${prefix}/orders`} className={navLinkClass}>
              {t("common:myOrders")}
            </NavLink>
          </>
        )}

        {/* Supplier only */}
        {user?.role === "supplier" && (
          <NavLink to={`${prefix}/supplier`} className={navLinkClass}>
            {t("common:supplierPanel")}
          </NavLink>
        )}

        {/* Admin only */}
        {user?.role === "admin" && (
          <NavLink to={`${prefix}/admin`} className={navLinkClass}>
            {t("common:adminPanel")}
          </NavLink>
        )}

        {/* Login / Logout */}
        <div className="ml-auto flex items-center gap-3">
          {/* Language switch */}
          <LanguageSwitcher />
          {user ? (
            <>
              <NavLink to={`${prefix}/account`} className={navLinkClass}>
                {t("common:myProfile")}
              </NavLink>
              <Form method="post" action={`${prefix}/logout`}>
                <button className="text-gray-600 underline">
                  {t("common:logout")}
                </button>
              </Form>
            </>
          ) : (
            <>
              <NavLink to={`${prefix}/login`} className={navLinkClass}>
                {t("common:login")}
              </NavLink>
              <NavLink to={`${prefix}/register`} className={navLinkClass}>
                {t("common:register")}
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
