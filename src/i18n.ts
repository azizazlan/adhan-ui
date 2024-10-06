import { createI18nContext } from '@solid-primitives/i18n';

const translations = {
  en: {
    hello: "Hello",
    adhan: {
      title: "Waiting for adhan..."
    }
  },
  ms: {
    hello: "Assalamualaikum",
    adhan: {
      title: "Sebentar lagi azan..."
    }
  },
};

export const i18nContext = createI18nContext(translations, 'ms'); // default language is Malay
