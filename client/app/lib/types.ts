export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string;
  category_id?: number | null;
  supplier_id?: number | null;
};

export type CartItem = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product?: Product;
};

export type Favorite = {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
};

export type Order = {
  id: number;
  user_id: number;
  total_price: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  created_at?: string;
};

export type Review = {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
  created_at?: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  role: "buyer" | "supplier" | "admin";
};
