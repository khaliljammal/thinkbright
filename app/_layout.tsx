import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from '@expo-google-fonts/instrument-sans';
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { color } from '../src/theme/tokens';
import { initPurchases } from '../src/lib/purchases';
import { useSession } from '../src/store/session';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const hydrate = useSession((st) => st.hydrate);
  const [fontsLoaded, fontError] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  useEffect(() => {
    initPurchases();
    hydrate();
  }, [hydrate]);

  const fontsSettled = fontsLoaded || !!fontError;

  useEffect(() => {
    if (fontsSettled) SplashScreen.hideAsync().catch(() => {});
  }, [fontsSettled]);

  // Never hold the app hostage to a font that failed to load.
  if (!fontsSettled) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: color.paper },
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="check" options={{ animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="workout" options={{ animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="paywall" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="share" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
