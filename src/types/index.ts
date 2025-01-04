import type { Voice } from 'expo-speech';

export type RootStackParamList = {
  Tutorial: undefined;
  Home: undefined;
  Settings: undefined;
  Help: undefined;
  LanguageSelect: {
    voices: Voice[];
    selectedLanguage: string;
    onSelect: (language: string) => void;
  };
};

export type MessageHistoryItem = {
  id: string;
  text: string;
  timestamp: number;
};

export type TTSSettings = {
  rate: number;
  pitch: number;
  language: string;
}; 