// @ts-nocheck

// src/localization/index.ts

export const translations = {
  'en-IN': {
    welcome: 'Welcome to GPP Hub',
    textbooks: 'Digital Textbooks',
  },
  'hi-IN': {
    welcome: 'जीपीपी हब में आपका स्वागत है',
    textbooks: 'डिजिटल पाठ्यपुस्तकें',
  },
};

/**
 * Returns the localized string for a given key and locale.
 * @param key The translation key.
 * @param locale The locale code (default: 'en-IN').
 */
export function t(key, locale) {
  locale = locale || 'en-IN';
  if (translations[locale] && Object.prototype.hasOwnProperty.call(translations[locale], key)) {
    return translations[locale][key];
  }
  if (translations['en-IN'] && Object.prototype.hasOwnProperty.call(translations['en-IN'], key)) {
    return translations['en-IN'][key];
  }
  return key;
}
