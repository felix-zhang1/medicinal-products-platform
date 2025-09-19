import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import languageDector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";

void i18n
  .use(languageDector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (lng: string, ns: string) =>
        import(/* @vite-ignore*/ `./locales/${lng}/${ns}.json`)
    )
  )
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
    react: { useSuspense: true },
  });

export default i18n;
