import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-600 mt-10 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        {/* 左侧：品牌 / Logo */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {t("common:appName")}
          </h2>
          <p className="mt-2 text-sm">{t("common:footerDescription")}</p>
        </div>

        {/* 中间：导航链接 */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            {t("common:quickLinks")}
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link to="/en/products" className="hover:text-green-700">
                {t("common:products")}
              </Link>
            </li>
            <li>
              <Link to="/en/about-me" className="hover:text-green-700">
                {t("common:aboutMe")}
              </Link>
            </li>
          </ul>
        </div>

        {/* 右侧：版权与社交信息 */}
        <div className="text-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
            {t("common:followMe")}
          </h3>
          <p className="mt-2">
            {t("common:followMeDescription")}
          </p>
          <div className="flex space-x-3 mt-3">
            <a
              href="https://github.com/felix-zhang1/medicinal-products-platform"
              aria-label="Github"
              className="hover:text-green-700 transition"
            >
              🌿GitHub
            </a>
            <a
              href="https://linkedin.com/in/gongfanzhang"
              aria-label="LinkedIn"
              className="hover:text-green-700 transition"
            >
              🦌LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* 最下方版权条 */}
      <div className="bg-gray-200 text-center text-xs py-3 text-gray-700">
        © {new Date().getFullYear()} MedProducts. All rights reserved.
      </div>
    </footer>
  );
}
