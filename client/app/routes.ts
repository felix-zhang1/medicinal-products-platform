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
    ],
  },
] satisfies RouteConfig;
