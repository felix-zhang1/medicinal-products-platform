import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useCallback } from "react";
import { usePrefix } from "~/hooks/usePrefix";

export default function LanguageSwitcher() {
  const { t } = useTranslation("common");
  const location = useLocation();
  const navigate = useNavigate();

  // extract /en or /zh from the path of the current URL
  const prefix = usePrefix();
  // get "en" or "zh"
  const current = prefix.replace("/", "");

  // build target URL when switching language
  // 1. replace the first path segment (/en or /zh) with the new language
  // 2. preserve query string (?...) and hash (#...)
  const buildTo = useCallback(
    (newLng: "en" | "zh") => {
      const path = location.pathname.replace(/^\/(en|zh)/, `/${newLng}`);
      return path + location.search + location.hash;
    },
    [location]
  );

  // provide two options for the dropdown
  const options = useMemo(
    () => [
      { value: "en", label: t("language.english") },
      { value: "zh", label: t("language.chinese") },
    ],
    [t]
  );

  // build a new path when switching language
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLng = e.target.value as "en" | "zh";
    if (nextLng !== current) navigate(buildTo(nextLng));
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <div className="relative">
        <select
          className="border rounded-md py-1.5 pl-3 pr-8 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={current}
          onChange={onChange}
          aria-label={t("language.label", "Language")}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
