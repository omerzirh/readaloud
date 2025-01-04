# ReadAloud (Sesli Oku)

A mobile application that reads your WhatsApp messages aloud using text-to-speech technology. Built with React Native and Expo.

## Features

- 🔊 Text-to-Speech: Reads messages aloud in multiple languages
- 📋 Clipboard Integration: Easily paste and read messages from WhatsApp
- 🌍 Multi-language Support: 
  - Application interface in English and Turkish
  - Text-to-speech support for 40+ languages
- ⚡ Quick Access: Android floating toolbar integration for instant reading
- 📱 User-friendly Interface:
  - Simple, intuitive design
  - Message history
  - Customizable speech settings

## Installation

1. Make sure you have Node.js and npm installed
2. Install Expo CLI:
```bash
npm install -g expo-cli
```

3. Clone the repository:
```bash
git clone [repository-url]
cd readaloud
```

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npx expo start
```

## Building APK Locally

### Prerequisites
- Install EAS CLI:
```bash
npm install -g eas-cli
```
- Log in to your Expo account:
```bash
eas login
```

### Build APK
1. Configure EAS Build for local development. Create or update `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {}
  }
}
```

2. Start the build:
```bash
eas build -p android --profile preview
```

3. Once the build is complete, you can download the APK from the link provided in the terminal or from your Expo account.

### Installing APK

#### Using ADB (Android Debug Bridge)
1. Enable Developer Options and USB Debugging on your Android device
2. Connect your device via USB
3. Install the APK:
```bash
adb install path/to/your/app.apk
```

#### Manual Installation
1. Transfer the APK to your Android device
2. Open the APK file on your device
3. Follow the installation prompts
   - Make sure to enable "Install from Unknown Sources" if prompted

Note: For development and testing, you can also use Expo Go app without building an APK.

## Usage

### Basic Usage
1. Copy any text from WhatsApp
2. Open the app
3. Tap "Read Clipboard" to hear the text

### Android Quick Access
1. Select text in WhatsApp
2. Use the floating toolbar's "Read Aloud" option
3. The app will automatically read the selected text

### Customization
In Settings, you can:
- Adjust speech rate
- Modify pitch
- Select preferred language
- Change app interface language (English/Turkish)

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Speech
- AsyncStorage
- React Native Safe Area Context

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/         # Main application screens
├── navigation/      # Navigation configuration
├── i18n/           # Internationalization
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── constants/      # App constants
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Requirements

- Node.js 14+
- Expo CLI
- iOS 13+ or Android 6.0+

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Expo team for their amazing text-to-speech library
- Icons provided by Ionicons
- All contributors who helped with translations and testing 