import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { MessageHistoryItem } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => {
  const [messageHistory, setMessageHistory] = useState<MessageHistoryItem[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const handleInitialText = async () => {
        // @ts-ignore - This is a custom native module
        const TextProcessor = require('expo-modules-core').NativeModulesProxy.TextProcessor;
        if (TextProcessor) {
          try {
            const initialText = await TextProcessor.getInitialText();
            if (initialText) {
              handleNewText(initialText);
            }
          } catch (error) {
            console.error('Error getting initial text:', error);
          }
        }
      };

      handleInitialText();
    }
  }, []);

  const handleNewText = (text: string) => {
    const newMessage: MessageHistoryItem = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now(),
    };
    setMessageHistory(prev => [newMessage, ...prev]);
    readText(text);
  };

  const readText = async (text: string) => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await Speech.speak(text, {
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error speaking:', error);
      setIsSpeaking(false);
    }
  };

  const getClipboardContent = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) {
      handleNewText(text);
    }
  };

  const renderItem = ({ item }: { item: MessageHistoryItem }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => readText(item.text)}
    >
      <Text style={styles.messageText} numberOfLines={2}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.clipboardButton}
        onPress={getClipboardContent}
      >
        <Text style={styles.buttonText}>Read Clipboard</Text>
      </TouchableOpacity>
      <FlatList
        data={messageHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  clipboardButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  messageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
}); 