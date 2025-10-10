import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

const modules = import.meta.glob("./locales/*/*.json");

void i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend((lng: string, ns: string) => {
      const key = `./locales/${lng}/${ns}.json`;
      const loader = modules[key];
      if (!loader)
        return Promise.reject(new Error(`Missing i18n file: ${key}`));
      return (loader as any)(); // 触发实际动态 import
    })
  )
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "zh"],
    ns: ["common", "home"],
    defaultNS: "common",
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupFromPathIndex: 0,
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
