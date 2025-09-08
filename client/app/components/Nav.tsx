import { NavLink, Form } from "react-router-dom";
import type { User } from "~/lib/types";

export default function Nav({ user }: { user: User | null }) {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <NavLink to="/" className="font-semibold">
          MedProducts
        </NavLink>
        <NavLink to="/products" className="text-gray-600">
          Products
        </NavLink>
        <NavLink to="/cart" className="text-gray-600">
          Cart
        </NavLink>
        <NavLink to="/favorites" className="text-gray-600">
          Favorites
        </NavLink>
        <NavLink to="/orders" className="text-gray-600">
          My Orders
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin" className="text-gray-600">
            Admin
          </NavLink>
        )}
        {user?.role === "supplier" && (
          <NavLink to="/supplier" className="text-gray-600">
            Supplier
          </NavLink>
        )}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <Form method="post" action="/logout">
              <button className="text-gray-600 underline">Logout</button>
            </Form>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-600">
                Login
              </NavLink>
              <NavLink to="/register" className="text-gray-600">
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
