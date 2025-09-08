import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  {
    path: "",
    file: "routes/_layout.tsx",
    children: [
      index("routes/home.tsx"),
      route("products", "routes/products.tsx"),
      route("products/:id", "routes/products.$id.tsx"),
      route("cart", "routes/cart.tsx"),
      route("favorites", "routes/favorites.tsx"),
      route("orders", "routes/orders.tsx"),
      route("orders/:id", "routes/orders.$id.tsx"),
      route("login", "routes/login.tsx"),
      route("register", "routes/register.tsx"),
      route("logout", "routes/logout.tsx"),

      route("admin", "routes/admin/_layout.tsx", [
        route("products", "routes/admin/products.tsx"),
        route("products/new", "routes/admin/products.new.tsx"),
        route("products/:id/edit", "routes/admin/products.$id.edit.tsx"),
        route("orders", "routes/admin/orders.tsx"),
        // 可继续扩展：categories、suppliers、users ...
      ]),
      route("supplier", "routes/supplier/_layout.tsx", [
        route("products", "routes/supplier/products.tsx"),
        route("products/new", "routes/supplier/products.new.tsx"),
        route("products/:id/edit", "routes/supplier/products.$id.edit.tsx"),
      ]),
    ],
  },
] satisfies RouteConfig;
