import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/LanguageContext';

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

export const HelpScreen = () => {
  const { t } = useLanguage();
  const sections = t('help', 'sections') as HelpSections;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {Object.entries(sections).map(([key, section]: [string, HelpStep]) => (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.steps.map((step: string, stepIndex: number) => (
              <View key={stepIndex} style={styles.stepContainer}>
                <Text style={styles.stepNumber}>{stepIndex + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#007AFF',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 10,
  },
  stepNumber: {
    width: 25,
    fontSize: 16,
    color: '#666',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
}); 