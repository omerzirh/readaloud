import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, NativeModules, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations';

type Language = 'en' | 'tr';
type TranslationKey = keyof typeof translations.en;

interface CommonSection {
  readClipboard: string;
  settings: string;
  help: string;
  messageReader: string;
  reset: string;
}

interface SettingsSection {
  speechRate: string;
  pitch: string;
  language: string;
  appLanguage: string;
  ttsLanguage: string;
  english: string;
  turkish: string;
  preview: string;
}

interface TutorialStep {
  title: string;
  description: string;
}

interface TutorialSection {
  next: string;
  getStarted: string;
  dontShowAgain: string;
  steps: TutorialStep[];
}

interface HelpStep {
  title: string;
  steps: string[];
}

interface HelpSections {
  textSelection: HelpStep;
  clipboard: HelpStep;
  history: HelpStep;
  customizing: HelpStep;
}

interface HelpSection {
  sections: HelpSections;
}

interface TranslationData {
  common: CommonSection;
  settings: SettingsSection;
  help: HelpSection;
  tutorial: TutorialSection;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (section: TranslationKey, key: string, subKey?: string) => string | TutorialStep[] | HelpSections;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const getDeviceLanguage = (): Language => {
  try {
    // Get the device language
    let deviceLanguage: string;

    if (Platform.OS === 'ios') {
      deviceLanguage = 
        NativeModules.SettingsManager?.settings?.AppleLocale ||
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
        'en';
    } else {
      deviceLanguage = 
        I18nManager.getConstants?.().localeIdentifier ||
        NativeModules.I18nManager?.localeIdentifier ||
        Platform.select({ android: 'en', default: 'en' });
    }

    // Check if the device language starts with 'tr'
    return deviceLanguage.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  } catch (error) {
    console.warn('Error detecting device language:', error);
    return 'en';
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      } else {
        const deviceLang = getDeviceLanguage();
        setLanguageState(deviceLang);
        await AsyncStorage.setItem('appLanguage', deviceLang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
      setLanguageState('en'); // Fallback to English on error
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('appLanguage', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (section: TranslationKey, key: string, subKey?: string): string | TutorialStep[] | HelpSections => {
    try {
      const currentTranslations = translations[language] as TranslationData;
      const fallbackTranslations = translations.en as TranslationData;

      if (section === 'tutorial' && key === 'steps') {
        return currentTranslations.tutorial.steps || fallbackTranslations.tutorial.steps;
      }

      if (section === 'help' && key === 'sections') {
        return currentTranslations.help.sections || fallbackTranslations.help.sections;
      }

      const sectionData = currentTranslations[section];
      if (subKey && typeof sectionData === 'object') {
        const subSection = sectionData[key];
        if (typeof subSection === 'object' && subKey in subSection) {
          return subSection[subKey] || fallbackTranslations[section][key][subKey];
        }
      }

      if (key in sectionData) {
        const value = sectionData[key];
        if (typeof value === 'string') {
          return value;
        }
      }

      // Fallback to English
      const fallbackSection = fallbackTranslations[section];
      if (key in fallbackSection) {
        const fallbackValue = fallbackSection[key];
        if (typeof fallbackValue === 'string') {
          return fallbackValue;
        }
      }

      return key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 