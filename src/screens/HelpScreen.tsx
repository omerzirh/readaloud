import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HELP_SECTIONS = [
  {
    title: 'Using Text Selection',
    steps: [
      'Select any text in any app',
      'Tap the "Read Aloud" option in the floating toolbar',
      'The app will open and read the text automatically',
    ],
  },
  {
    title: 'Using Clipboard',
    steps: [
      'Copy any text from any app',
      'Open the WhatsApp Message Reader app',
      'Tap "Read Clipboard" to hear the text',
    ],
  },
  {
    title: 'Message History',
    steps: [
      'Previously read messages appear in the list',
      'Tap any message to hear it again',
      'Messages are sorted by most recent first',
    ],
  },
  {
    title: 'Customizing Speech',
    steps: [
      'Go to Settings',
      'Adjust speech rate and pitch',
      'Choose your preferred language',
      'Changes are saved automatically',
    ],
  },
];

export const HelpScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {HELP_SECTIONS.map((section, index) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.steps.map((step, stepIndex) => (
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