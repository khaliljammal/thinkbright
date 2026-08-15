import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font } from '../theme/tokens';

/**
 * Every screen is either porcelain or focus-mode dark. The inversion is
 * reserved for tasks being measured, so `dark` is never a user preference.
 */
export function Screen({
  children,
  dark = false,
  scroll = false,
  padded = true,
  footer,
}: {
  children: React.ReactNode;
  dark?: boolean;
  scroll?: boolean;
  padded?: boolean;
  footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const bg = dark ? color.focus : color.paper;
  const pad = padded ? { paddingHorizontal: 22 } : null;

  return (
    <View style={[s.root, { backgroundColor: bg, paddingTop: insets.top }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ flexGrow: 1, paddingBottom: 16 }, pad]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad]}>{children}</View>
      )}
      {footer ? <View style={[pad, { paddingBottom: 4 }]}>{footer}</View> : null}
      <View style={{ height: Math.max(insets.bottom, 10) }} />
    </View>
  );
}

export function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <Text style={[s.eyebrow, dark && { color: color.ink3 }]}>{children}</Text>;
}

const s = StyleSheet.create({
  root: { flex: 1 },
  eyebrow: { fontFamily: font.mono, fontSize: 11, color: color.ink3, letterSpacing: 0.44 },
});
