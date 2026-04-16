import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations, getTranslation } from '../data/translations';

const LanguageContext = createContext(null);
const LANGUAGE_KEY = 'class360_language';

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'hi' || stored === 'en') return stored;
  } catch {
    return 'en';
  }
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
      // ignore storage failures in private mode
    }
  }, [language]);

  const value = useMemo(() => {
    const translate = (path, fallback) => {
      const current = getTranslation(translations[language], path);
      if (current !== undefined) return current;
      const english = getTranslation(translations.en, path);
      return english !== undefined ? english : fallback ?? path;
    };

    return {
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((value) => (value === 'en' ? 'hi' : 'en')),
      t: translate,
      isHindi: language === 'hi',
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
