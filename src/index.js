import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// We make the function async so we can await
// the translation file as it pipes down the
// network
async function initI18next() {
    await i18next
      .use(HttpApi)
      .use(LanguageDetector)
      .init({
        debug: true,
        supportedLngs: ["en", "it"],
        fallbackLng: "en",
        // Allow "en" to be used for
        // "en-US", "en-CA", etc.
        nonExplicitSupportedLngs: true,
        backend: {
          loadPath: "/lang/{{lng}}.json",
        },
      });
  }
// Quick refactor of the page translation code
// to a function
function translatePageElements() {
  const translatableElements = document.querySelectorAll(
    "[data-i18n-key]",
  );
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

// Init
(async function () {
  await initI18next();
  translatePageElements();
  bindLocaleSwitcher(i18next.resolvedLanguage);
})();