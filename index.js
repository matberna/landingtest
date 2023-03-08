import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

async function initI18next() {
  await i18next
    .use(HttpApi)
    .use(LanguageDetector)
    .init({
      debug: true,
      supportedLngs: ["en", "it", "fr", "es", "de", "ar"],
      fallbackLng: "en",
      nonExplicitSupportedLngs: true,
      backend: {
        loadPath: "/lang/{{lng}}.json",
      },
    });
}

function translatePageElements() {
  setHTML_lang(i18next.language);
  const translatableElements = document.querySelectorAll("[data-i18n-key]");
  translatableElements.forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    el.innerHTML = i18next.t(key);
  });
}

function bindLocaleSwitcher(initialValue) {
  const switcher = document.querySelector(
    "[data-i18n-switcher]",
  );
  switcher.value = initialValue;
  switcher.onchange = (e) => {
    i18next
      .changeLanguage(e.target.value)
      .then(translatePageElements);
  };
}

function setHTML_lang(locale) {
  document.documentElement.dir = dir(i18next.resolvedLanguage);
  document.documentElement.lang = i18next.resolvedLanguage;
}

function dir(locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

// Init
(async function () {
  await initI18next();
  translatePageElements();
  bindLocaleSwitcher(i18next.resolvedLanguage);
})();