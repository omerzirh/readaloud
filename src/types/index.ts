export type RootStackParamList = {
  Home: undefined;
  Tutorial: undefined;
  Settings: undefined;
  Help: undefined;
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