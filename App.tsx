import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from './src/screens/HomeScreen';
import { TutorialScreen } from './src/screens/TutorialScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HelpScreen } from './src/screens/HelpScreen';
import { LanguageSelectScreen } from './src/screens/LanguageSelectScreen';
import { RootStackParamList } from './src/types';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { useShareIntent } from 'expo-share-intent';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function TabNavigator() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          color: '#000',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: t('common', 'messageReader') }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: t('common', 'settings') }}
      />
      <Tab.Screen 
        name="Help" 
        component={HelpScreen}
        options={{ title: t('common', 'help') }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [tutorialShown, setTutorialShown] = useState(false);
  const navigation = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const { hasShareIntent, shareIntent, resetShareIntent, error } = useShareIntent();

  useEffect(() => {
    checkTutorialStatus();
  }, []);

  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      // Handle the shared content
      if (shareIntent.text) {
        handleSharedText(shareIntent.text);
      }
      // Reset the share intent after handling
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

  const checkTutorialStatus = async () => {
    try {
      const shown = await AsyncStorage.getItem('tutorialShown');
      setTutorialShown(shown === 'true');
    } catch (error) {
      console.error('Error checking tutorial status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharedText = async (sharedText: string) => {
    // Navigate to Home screen if not already there
    navigation.current?.navigate('Home', {
      sharedText: sharedText
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer ref={navigation}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!tutorialShown && (
          <Stack.Screen name="Tutorial" component={TutorialScreen} />
        )}
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen 
          name="LanguageSelect" 
          component={LanguageSelectScreen}
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

