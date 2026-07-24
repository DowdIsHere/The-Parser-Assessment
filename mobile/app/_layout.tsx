import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AuthProvider } from '../context/AuthContext';
import { colors } from '../constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.dark,
          headerTitleStyle: {
            fontFamily: 'CormorantGaramond_700Bold',
            fontSize: 20,
          },
          contentStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ title: 'Sign In' }} />
        <Stack.Screen name="assessment" options={{ title: 'Assessment', headerBackVisible: false }} />
        <Stack.Screen name="paywall" options={{ title: 'Subscribe', presentation: 'modal' }} />
        <Stack.Screen name="profile" options={{ title: 'Your Profile' }} />
        <Stack.Screen name="library" options={{ title: 'Library' }} />
        <Stack.Screen name="careers" options={{ title: 'Careers' }} />
      </Stack>
    </AuthProvider>
  );
}
