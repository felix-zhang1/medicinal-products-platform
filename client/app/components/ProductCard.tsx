import { Link } from "react-router-dom";
import type { Product } from "~/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="border rounded-xl overflow-hidden bg-white hover:shadow"
    >
      <img
        src={product.image_url || "https://placehold.co/600x600?text=No+Image"}
        alt={product.name}
        className="w-full aspect-square object-cover"
      />
      <div className="p-3">
        <div className="font-medium line-clamp-1">{product.name}</div>
        <div className="text-sm text-gray-600 mt-1">
          NZ${product.price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
