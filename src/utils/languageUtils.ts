import { Voice } from 'expo-speech';

interface LanguageOption {
  code: string;
  name: string;
  localName: string;
}

// These are just for app UI language
export const APP_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    localName: 'English',
  },
  {
    code: 'tr',
    name: 'Turkish',
    localName: 'Türkçe',
  },
];

// Comprehensive language names mapping
const LANGUAGE_NAMES: { [key: string]: { name: string; nativeName: string } } = {
  'af': { name: 'Afrikaans', nativeName: 'Afrikaans' },
  'ar': { name: 'Arabic', nativeName: 'العربية' },
  'bg': { name: 'Bulgarian', nativeName: 'Български' },
  'bn': { name: 'Bengali', nativeName: 'বাংলা' },
  'ca': { name: 'Catalan', nativeName: 'Català' },
  'cs': { name: 'Czech', nativeName: 'Čeština' },
  'cy': { name: 'Welsh', nativeName: 'Cymraeg' },
  'da': { name: 'Danish', nativeName: 'Dansk' },
  'de': { name: 'German', nativeName: 'Deutsch' },
  'el': { name: 'Greek', nativeName: 'Ελληνικά' },
  'en': { name: 'English', nativeName: 'English' },
  'es': { name: 'Spanish', nativeName: 'Español' },
  'et': { name: 'Estonian', nativeName: 'Eesti' },
  'fa': { name: 'Persian', nativeName: 'فارسی' },
  'fi': { name: 'Finnish', nativeName: 'Suomi' },
  'fr': { name: 'French', nativeName: 'Français' },
  'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  'he': { name: 'Hebrew', nativeName: 'עברית' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी' },
  'hr': { name: 'Croatian', nativeName: 'Hrvatski' },
  'hu': { name: 'Hungarian', nativeName: 'Magyar' },
  'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  'is': { name: 'Icelandic', nativeName: 'Íslenska' },
  'it': { name: 'Italian', nativeName: 'Italiano' },
  'ja': { name: 'Japanese', nativeName: '日本語' },
  'kn': { name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  'ko': { name: 'Korean', nativeName: '한국어' },
  'lt': { name: 'Lithuanian', nativeName: 'Lietuvių' },
  'lv': { name: 'Latvian', nativeName: 'Latviešu' },
  'ml': { name: 'Malayalam', nativeName: 'മലയാളം' },
  'mr': { name: 'Marathi', nativeName: 'मराठी' },
  'ms': { name: 'Malay', nativeName: 'Bahasa Melayu' },
  'nl': { name: 'Dutch', nativeName: 'Nederlands' },
  'no': { name: 'Norwegian', nativeName: 'Norsk' },
  'pl': { name: 'Polish', nativeName: 'Polski' },
  'pt': { name: 'Portuguese', nativeName: 'Português' },
  'ro': { name: 'Romanian', nativeName: 'Română' },
  'ru': { name: 'Russian', nativeName: 'Русский' },
  'sk': { name: 'Slovak', nativeName: 'Slovenčina' },
  'sl': { name: 'Slovenian', nativeName: 'Slovenščina' },
  'sr': { name: 'Serbian', nativeName: 'Српски' },
  'sv': { name: 'Swedish', nativeName: 'Svenska' },
  'sw': { name: 'Swahili', nativeName: 'Kiswahili' },
  'ta': { name: 'Tamil', nativeName: 'தமிழ்' },
  'te': { name: 'Telugu', nativeName: 'తెలుగు' },
  'th': { name: 'Thai', nativeName: 'ไทย' },
  'tr': { name: 'Turkish', nativeName: 'Türkçe' },
  'uk': { name: 'Ukrainian', nativeName: 'Українська' },
  'ur': { name: 'Urdu', nativeName: 'اردو' },
  'vi': { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  'zh': { name: 'Chinese', nativeName: '中文' },
};

export const getLanguageFromCode = (code: string): { name: string; nativeName: string } => {
  const langCode = code.split('-')[0].toLowerCase();
  return LANGUAGE_NAMES[langCode] || { name: code, nativeName: code };
};

export const formatVoiceLanguage = (voice: Voice, currentAppLanguage: 'en' | 'tr'): string => {
  const language = getLanguageFromCode(voice.language);
  // If the app is in Turkish, show both native name and English name for non-Turkish languages
  if (currentAppLanguage === 'tr' && voice.language.split('-')[0] !== 'tr') {
    return `${language.nativeName} (${language.name})`;
  }
  // For English app language or when the language matches the app language, show only the name
  return language.name;
};

// Get one voice per language
export const getUniqueLanguageVoices = (voices: Voice[]): Voice[] => {
  const languageMap = new Map<string, Voice>();
  
  voices.forEach(voice => {
    const langCode = voice.language.split('-')[0].toLowerCase();
    if (!languageMap.has(langCode)) {
      languageMap.set(langCode, voice);
    }
  });

  return Array.from(languageMap.values());
}; 