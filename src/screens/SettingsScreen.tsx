import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../i18n/LanguageContext';

const DEFAULT_SETTINGS = {
  rate: 1.0,
  pitch: 1.0,
  language: 'en-US',
};

export const SettingsScreen = () => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [availableLanguages, setAvailableLanguages] = useState<Speech.Voice[]>([]);

  useEffect(() => {
    loadSettings();
    loadAvailableLanguages();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('ttsSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadAvailableLanguages = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      setAvailableLanguages(voices);
    } catch (error) {
      console.error('Error loading languages:', error);
    }
  };

  const saveSettings = async (newSettings: typeof DEFAULT_SETTINGS) => {
    try {
      await AsyncStorage.setItem('ttsSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      // Preview the settings
      Speech.speak(t('settings', 'preview'), {
        rate: newSettings.rate,
        pitch: newSettings.pitch,
        language: newSettings.language,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const renderLanguageOptions = () => {
    const uniqueLanguages = Array.from(
      new Set(availableLanguages.map(voice => voice.language))
    );

    return uniqueLanguages.map(lang => (
      <TouchableOpacity
        key={lang}
        style={[
          styles.languageOption,
          settings.language === lang && styles.selectedLanguage,
        ]}
        onPress={() => saveSettings({ ...settings, language: lang })}
      >
        <Text style={[
          styles.languageText,
          settings.language === lang && styles.selectedLanguageText,
        ]}>
          {lang}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings', 'appLanguage')}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && styles.selectedLanguage,
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[
                styles.languageText,
                language === 'en' && styles.selectedLanguageText,
              ]}>
                {t('settings', 'english')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'tr' && styles.selectedLanguage,
              ]}
              onPress={() => setLanguage('tr')}
            >
              <Text style={[
                styles.languageText,
                language === 'tr' && styles.selectedLanguageText,
              ]}>
                {t('settings', 'turkish')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings', 'speechRate')}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            value={settings.rate}
            onValueChange={(value: number) => setSettings({ ...settings, rate: value })}
            onSlidingComplete={(value: number) =>
              saveSettings({ ...settings, rate: value })
            }
          />
          <Text style={styles.valueText}>{settings.rate.toFixed(2)}x</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings', 'pitch')}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2}
            value={settings.pitch}
            onValueChange={(value: number) => setSettings({ ...settings, pitch: value })}
            onSlidingComplete={(value: number) =>
              saveSettings({ ...settings, pitch: value })
            }
          />
          <Text style={styles.valueText}>{settings.pitch.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings', 'ttsLanguage')}</Text>
          <View style={styles.languageContainer}>
            {renderLanguageOptions()}
          </View>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => saveSettings(DEFAULT_SETTINGS)}
        >
          <Text style={styles.resetButtonText}>{t('common', 'reset')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  languageOption: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    color: '#007AFF',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  resetButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 