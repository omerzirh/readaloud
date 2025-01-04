import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tutorial'>;
};

const TUTORIAL_STEPS = [
  {
    title: 'Copy Text from WhatsApp',
    description: 'Long press on any message in WhatsApp and tap "Copy"',
  },
  {
    title: 'Open Quick Settings',
    description: 'Swipe down from the top of your screen to open Quick Settings',
  },
  {
    title: 'Use Read Text',
    description: 'Tap the "Read Text" button to hear the copied message',
  },
];

export const TutorialScreen = ({ navigation }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleNext = async () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (dontShowAgain) {
        await AsyncStorage.setItem('tutorialShown', 'true');
      }
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{TUTORIAL_STEPS[currentStep].title}</Text>
        <Text style={styles.description}>
          {TUTORIAL_STEPS[currentStep].description}
        </Text>
      </View>

      <View style={styles.footer}>
        {currentStep === TUTORIAL_STEPS.length - 1 && (
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setDontShowAgain(!dontShowAgain)}
          >
            <View style={[styles.checkboxBox, dontShowAgain && styles.checked]}>
              {dontShowAgain && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Don't show again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  footer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#666',
  },
}); 