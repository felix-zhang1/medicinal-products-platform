// app/routes.ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // "/" -> "/en"
  index("routes/redirect-to-en.tsx"),

  // 语言父路由（不做正则约束，统一在 loader 里处理）
  {
    path: ":lng",
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
      ]),
      route("supplier", "routes/supplier/_layout.tsx", [
        route("products", "routes/supplier/products.tsx"),
        route("products/new", "routes/supplier/products.new.tsx"),
        route("products/:id/edit", "routes/supplier/products.$id.edit.tsx"),
        route("setup", "routes/supplier/setup.tsx"),
      ]),
    ],
  },
] satisfies RouteConfig;
