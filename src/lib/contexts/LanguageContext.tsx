"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../translations/en';
import { fr } from '../translations/fr';
import { ar } from '../translations/ar';

type Language = 'en' | 'fr' | 'ar';
type TranslationKey = keyof typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
    dir: 'ltr' | 'rtl';
}

const translations = { en, fr, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [mounted, setMounted] = useState(false);

    // Load language from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('marrakech-language') as Language;
        if (saved && ['en', 'fr', 'ar'].includes(saved)) {
            // eslint-disable-next-line
            setLanguageState(saved);
        }
        setMounted(true);
    }, []);

    // Save to localStorage and update HTML dir attribute
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('marrakech-language', language);
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
        }
    }, [language, mounted]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations.en[key] || key;
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
