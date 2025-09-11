import { useEffect, useMemo, useState } from "react";

export type CatNode = {
  id: number;
  name: string;
  subcategories: Array<{ id: number; name: string }>;
};

export type ProductInitial = {
  name?: string;
  description?: string;
  price?: number | string | null;
  stock?: number | string | null;
  image_url?: string | null;
  category_id?: number | null; // Subcategory
};

export default function ProductFormFields({
  tree,
  initial = {},
}: {
  tree: CatNode[];
  initial?: ProductInitial;
}) {
  // Get initial parent ID from category_id in tree, or "" if not found
  const initialParentId = useMemo(() => {
    if (!initial.category_id) return "";
    const parent = tree.find((t) =>
      t.subcategories.some((s) => s.id === initial.category_id)
    );
    return parent?.id ?? "";
  }, [initial.category_id, tree]);

  const [parentId, setParentId] = useState<number | "">(
    initialParentId as number | ""
  );
  const [childId, setChildId] = useState<number | "">(
    initial.category_id ?? ""
  );

  useEffect(() => {
    if (!initial.category_id) {
      setParentId("");
      setChildId("");
    } else {
      setParentId(initialParentId as number | "");
      setChildId(initial.category_id as number | "");
    }
  }, [initial.category_id, initialParentId]);

  const children = useMemo(() => {
    if (!parentId) return [];
    const p = tree.find((t) => t.id === parentId);
    return p?.subcategories ?? [];
  }, [parentId, tree]);

  return (
    <>
      <input
        name="name"
        defaultValue={initial.name ?? ""}
        placeholder="Name"
        className="border p-2 rounded"
        required
      />
      <textarea
        name="description"
        defaultValue={initial.description ?? ""}
        placeholder="Description"
        className="border p-2 rounded"
        rows={3}
      />
      <input
        name="price"
        type="number"
        step="0.01"
        defaultValue={initial.price ?? ""}
        placeholder="Price"
        className="border p-2 rounded"
        required
      />
      <input
        name="stock"
        type="number"
        defaultValue={initial.stock ?? ""}
        placeholder="Stock"
        className="border p-2 rounded"
      />
      <input
        name="image_url"
        defaultValue={initial.image_url ?? ""}
        placeholder="Image URL"
        className="border p-2 rounded"
      />

      {/* Cascading select: Top-level category */}
      <div className="grid gap-2">
        <label className="text-sm text-gray-600">Top-level Category</label>
        <select
          className="border p-2 rounded"
          value={parentId}
          onChange={(e) => {
            const v = e.target.value ? Number(e.target.value) : "";
            setParentId(v as any);
            setChildId(""); // reset subcategory when switching parent category
          }}
          required
        >
          <option value="">Select an option (Plant / Animal)</option>
          {tree.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cascading dropdown: Subcategory */}
      <div className="grid gap-2">
        <label className="text-sm text-gray-600">Subcategory</label>
        <select
          className="border p-2 rounded"
          value={childId}
          onChange={(e) =>
            setChildId(e.target.value ? Number(e.target.value) : ("" as any))
          }
          disabled={!parentId}
          required
        >
          <option value="">Select a specific part</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* the actual submitted category_id (always a second-level category) */}
      <input type="hidden" name="category_id" value={childId || ""} />
    </>
  );
}
