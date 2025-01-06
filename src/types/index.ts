export interface MessageHistoryItem {
  id: string;
  text: string;
  timestamp: number;
}

export interface TTSSettings {
  rate: number;
  pitch: number;
}

export type RootStackParamList = {
  Home: { sharedText?: string } | undefined;
  Settings: undefined;
  Help: undefined;
  Tutorial: undefined;
}; 