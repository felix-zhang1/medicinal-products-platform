import { useParams, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * LanguageSwitcher component
 *
 * Purpose: Toggle between English and Chinese URL prefixes (/en or /zh),
 * display a language switch button, and keep query params and hash.
 */
export default function LanguageSwitcher() {
  const { t } = useTranslation("common"); // i18n translation function
  const { lng } = useParams(); // get language code from route params
  const location = useLocation(); // current pathname, search, and hash

  // current language, default to "en" if not defined
  const current = lng === "zh" || lng === "en" ? lng : "en";

  // the other language
  const other = current === "zh" ? "en" : "zh";

  // target URL: replace the prefix with the other language,
  // while keeping ?query and #hash
  const to =
    location.pathname.replace(/^\/(en|zh)/, `/${other}`) +
    location.search +
    location.hash;

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* display "Language" label */}
      <span>{t("language.label")}</span>

      {/* language switch link, navigates to the other language version */}
      <Link className="underline" to={to} prefetch="intent">
        {other.toUpperCase()}
      </Link>
    </div>
  );
}
