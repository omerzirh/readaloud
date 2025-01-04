import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { formatVoiceLanguage } from '../utils/languageUtils';
import type { Voice } from 'expo-speech';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LanguageSelect'>;
  route: RouteProp<RootStackParamList, 'LanguageSelect'>;
};

export const LanguageSelectScreen = ({ navigation, route }: Props) => {
  const { voices, selectedLanguage, onSelect } = route.params;
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVoices = voices.filter(voice => {
    if (!searchQuery) return true; // Show all voices when no search query
    const displayName = formatVoiceLanguage(voice, language).toLowerCase();
    return displayName.includes(searchQuery.toLowerCase());
  });

  const handleSelect = (voice: Voice) => {
    onSelect(voice.language);
    navigation.goBack();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="language-outline" size={48} color="#666" />
      <Text style={styles.emptyStateText}>
        {searchQuery 
          ? t('settings', 'noLanguagesFound')
          : t('settings', 'noLanguagesAvailable')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings', 'ttsLanguage')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('settings', 'searchLanguages')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {filteredVoices.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.list}>
          {filteredVoices.map((voice) => (
            <TouchableOpacity
              key={voice.language}
              style={[
                styles.languageOption,
                selectedLanguage.split('-')[0] === voice.language.split('-')[0] && styles.selectedLanguage,
              ]}
              onPress={() => handleSelect(voice)}
            >
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage.split('-')[0] === voice.language.split('-')[0] && styles.selectedLanguageText,
                ]}
              >
                {formatVoiceLanguage(voice, language)}
              </Text>
              {selectedLanguage.split('-')[0] === voice.language.split('-')[0] && (
                <Ionicons name="checkmark" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34, // Same as closeButton width
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedLanguage: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    fontSize: 16,
    color: '#000',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
}); 