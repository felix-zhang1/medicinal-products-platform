import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "~/lib/auth";

export default function Nav() {
  const nav = useNavigate();
  const authed = auth.isAuthed();
  const role = auth.payload()?.role;

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
        {role === "admin" && (
          <NavLink to="/admin" className="text-gray-600">
            Admin
          </NavLink>
        )}
        <div className="ml-auto flex items-center gap-3">
          {authed ? (
            <button
              className="text-gray-600 underline"
              onClick={() => {
                auth.logout();
                nav("/", { replace: true });
              }}
            >
              Logout
            </button>
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
