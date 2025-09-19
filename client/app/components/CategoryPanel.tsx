import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import type { Product } from "~/lib/types";
import { useTranslation } from "react-i18next";

/**
 * CategoryPanel component
 *
 * Displays a category section with:
 * - A background image and optional overlay
 * - A title and a "Browse all" link
 * - A grid of ProductCard items (or fallback message if no items)
 *
 * Props:
 * - title: section title text
 * - bgUrl: background image URL
 * - browseLink: link to the category browse page
 * - items: list of Product objects to display
 * - className: optional extra classes for container
 * - overlayClassName: optional classes for overlay
 *
 * Uses React.memo for performance and useMemo for background style memoization.
 */

type CategoryPanelProps = {
  title: string;
  bgUrl: string;
  browseLink: string;
  items: Product[];
  className?: string;
  overlayClassName?: string;
};

const CategoryPanel = memo(function CategoryPanel({
  title,
  bgUrl,
  browseLink,
  items,
  className = "",
  overlayClassName = "bg-white/70 md:bg-white/60",
}: CategoryPanelProps) {
  const { t } = useTranslation();

  const bgStyle = useMemo(
    () => ({ backgroundImage: `url(${bgUrl})` }),
    [bgUrl]
  );

  return (
    <div className={`relative overflow-hidden rounded-xl border ${className}`}>
      {/* 背景图 */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={bgStyle}
        aria-hidden
      />
      {/* 遮罩 */}
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />

      {/* 前景内容 */}
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Link to={browseLink} className="underline">
            {t("common:browseAll")} →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {items.length ? (
            items.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-2 text-sm text-gray-600">
              {t("common:noItemsAvailable")}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default CategoryPanel;
