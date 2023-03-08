
# Landing Page: Gestione Multilingua

Questo repository contiene i sorgenti di una Landing Page sviluppata con l'obbiettivo di implementare una gestione snella e rapida per la gestione delle lingue.

La Landing Page è quindi un mockup sviluppato su un ipotetico ecommerce di marca Tom Ford per i vari prodotti del settore Eyewear. 

Le uniche pagine visitabili sono la Homepage e la Dashboard, ovvero la pagina di gestione account dove un utente appena registrato viene indirizzato dall'applicazione.


## Librerie, Framework e Software utilizzato

- Bootstrap 5.2
- Fontawesome 6.3
- Nodejs
- Webpack
- i18next


## Sintesi

#### Bootstrap 5.2
Per la Landing Page è stato deciso di utilizzare Bootstrap 5.2 per la rapidità che offre nello sviluppo e la facilità di implementazione, soprattutto per quanto riguarda la gestione del display flex.
In più, si presta molto facilmente ad essere personalizzato a seconda delle necessità.

#### Dashboard
La pagina che è stata individuata come quella che accoglie un utente appena registrato è la Dashboard. Solitamente, un utente appena registrato viene indirizzato o nella Homepage o nella Dashboard dove magari ha la possibilità di integrare nel suo profilo informazioni ritenute secondarie e quindi non implementate nel processo di registrazione.
Nella Dashboard di questa Landing Page l'utente ha la possibilità di accedere alle funzionalità più comuni di un profilo eCommerce, che quindi sono:

- Dati Personali
- Ordini
- Carte di Credito e Metodi di Pagamento
- Indirizzi di Spedizione / Indirizzi di Fatturazione
- Wishlist
- Scontistica dedicata

Nella fattispecie di questa Landing Page, si è ipotizzato un "Programma Fedeltà" con dei punti assegnati all'utente in base a varie azioni svolte dallo stesso (es: acquisto di un prodotto ecc..). Al raggiungimento di una quota, il sistema elargirebbe all'utente Coupon o scontistica personalizzata sul prossimo acquisto.
In questa pagina, l'Utente può anche avere evidenza degli eventuali Coupon non ancora riscattati ed in procinto di scadere e la cronologia degli ultimi prodotti visti nell'ecommerce.

#### Gestione Multilingua
Nella Landing Page si è deciso di utilizzare i18next, uno dei framework di localizzazione più famosi disponibili in rete.
i18next permette di gestire la localizzazione di un'applicazione web partendo dalle funzionalità più basiche, come le traduzioni di contenuto, a funzionalità complesse, come la gestione dei plurali o i conflitti di formato.
Nel caso della Landing Page oggetto di questa documentazione, la gestione multilingua è gestita quindi da una Select alla quale è stato attaccato un evento "onchange". Quando questo evento viene attivato, viene attivata anche i18next che va ad accedere al rispettivo JSON della lingua selezionata.
La lettura del JSON viene eseguita con un plugin del framework i18next, nello specifico i18next-http-backend.
Nei JSON vi è tutto il contenuto statico testuale della Landing Page, tradotto nelle rispettive lingue, identificato da un campo univoco "key". Questa "key" è attribuita ad ogni elemento della Landing Page che deve essere tradotto e che generalmente contiene testo statico.

Per rendere più smart questa funzionalità, è stato installato un altro plugin di i18next, nello specifico i18next-browser-languagedetector, che, attraverso dei guess, identifica la lingua preferita del client che accede alla Landing Page e ne conserva l'informazione nel suo storage. I guess che il plugin prova vanno dal controllare l'eventuale esistenza di un URL che termina in "?lng=en" al controllare il metatag "lang" nel tag HTML.
Va comunque detto che è stato previsto un "langFallback" in caso nessun guess vada a buon fine.

Il codice che descrive la gestione della localizzazione nella Landing Page è il seguente:

```bash
import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

//INIZIALIZZAZIONE I18NEXT
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

//INJECTION TESTO 
function translatePageElements() {
  setHTML_lang(i18next.language);
  const translatableElements = document.querySelectorAll("[data-i18n-key]");
  translatableElements.forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    el.innerHTML = i18next.t(key);
  });
}

//EVENTO SELECT
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

//GESTIONE RTL e METATAG LANG
function setHTML_lang(locale) {
  document.documentElement.dir = dir(i18next.resolvedLanguage);
  document.documentElement.lang = i18next.resolvedLanguage;
}

function dir(locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

// INIT
(async function () {
  await initI18next();
  translatePageElements();
  bindLocaleSwitcher(i18next.resolvedLanguage);
})();
```

#### Webpack
Per agevolarmi nel deploy dell'applicativo ho utilizzato Webpack, ovvero un applicativo che permette di impacchettare vari file in uno o più bundle. Nello specifico, l'ho utilizzato per impacchettare le diverse dipendenze di i18next così da poterne fare il deploy in Github Pages. A questo proposito, ho utilizzato anche un altro plugin Javascript (ghub-pages).
Per agevolarmi nello sviluppo ho invece installato webpack-dev che non fa altro che aggiornare la pagina del browser dove è aperto l'applicativo ed aggiornare il server quando vengono notificati dei cambi nei file del progetto.
