import { Platform } from 'react-native';

/**
 * SecureStore is native-only. On web (the preview build) fall back to
 * localStorage so the same persistence code path works everywhere.
 */
export const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return globalThis.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    }
    const SecureStore = require('expo-secure-store');
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        globalThis.localStorage?.setItem(key, value);
      } catch {
        // Private browsing or quota — non-fatal.
      }
      return;
    }
    const SecureStore = require('expo-secure-store');
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        globalThis.localStorage?.removeItem(key);
      } catch {
        // Non-fatal.
      }
      return;
    }
    const SecureStore = require('expo-secure-store');
    await SecureStore.deleteItemAsync(key);
  },
};
