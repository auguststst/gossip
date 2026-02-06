import i18n from './i18n';
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import Navigation from './navigation';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect  } from 'react';
import { I18nextProvider } from 'react-i18next';
import HelveticaFont from './font/Helvetica.ttf';
import { AuthProvider } from './context/AuthContext';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const loadFonts = async () => {
    await Font.loadAsync({
      'Helvetica': HelveticaFont,
    });
  };

  loadFonts();

  useEffect(() => {
    const getDeviceLanguage = async () => {
      try {
        let deviceLanguage = '';

        if (Platform.OS === 'ios') {
          const { SettingsManager } = NativeModules;
          const { AppleLanguages } = SettingsManager.settings || {};
          if (AppleLanguages && Array.isArray(AppleLanguages) && AppleLanguages.length > 0) {
            deviceLanguage = AppleLanguages[0].substring(0, 2); // Extract language code (e.g., 'en', 'uk')
          }
        } else if (Platform.OS === 'android') {
          const { I18nManager } = NativeModules;
          deviceLanguage = I18nManager.localeIdentifier.substring(0, 2); // Extract language code (e.g., 'en', 'uk')
        }
        
        if (deviceLanguage) {
          i18n.changeLanguage(deviceLanguage);
          AsyncStorage.setItem('language',deviceLanguage);
        } else {
          console.warn('Failed to retrieve device language. Defaulting to fallback language.');
          // Set a fallback language if device language cannot be determined
          i18n.changeLanguage('en'); // Default fallback language (e.g., English)
        }
      } catch (error) {
        console.warn('Error setting device language:', error);
        // Handle error, set fallback language
        i18n.changeLanguage('en'); // Default fallback language (e.g., English)
      }
    };

    getDeviceLanguage();
  }, []);

  return (
   
    <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <StatusBar style="black"/>
          <Navigation />
        </AuthProvider>
    </I18nextProvider>
  );
  
}

