import { NavLink, Form } from "react-router-dom";
import type { User } from "~/lib/types";

// common highlight style (with bottom border)
function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
    : "text-gray-600 hover:text-blue-500";
}

export default function Nav({ user }: { user: User | null }) {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* for all roles */}
        <NavLink to="/" end className={navLinkClass}>
          MedProducts
        </NavLink>
        <NavLink to="/products" className={navLinkClass}>
          Products
        </NavLink>

        {/* Buyer only */}
        {user?.role === "buyer" && (
          <>
            <NavLink to="/cart" className={navLinkClass}>
              Cart
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Favorites
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          </>
        )}

        {/* Supplier only */}
        {user?.role === "supplier" && (
          <NavLink to="/supplier" className={navLinkClass}>
            Supplier
          </NavLink>
        )}

        {/* Admin only */}
        {user?.role === "admin" && (
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        )}

        {/* Login / Logout */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <Form method="post" action="/logout">
              <button className="text-gray-600 underline">Logout</button>
            </Form>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
