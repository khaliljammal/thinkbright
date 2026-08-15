import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { color } from '../theme/tokens';

export function BackLink({ onPress, dark = false }: { onPress: () => void; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={s.hit}>
      <Text style={[s.label, dark && { color: color.focusInk2 }]}>← Back</Text>
    </Pressable>
  );
}

export function QuitLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={10}>
      <Text style={[s.label, { color: color.ink3 }]}>Quit</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  hit: { alignSelf: 'flex-start', paddingVertical: 6, marginBottom: 2 },
  label: { fontFamily: 'InstrumentSans_500Medium', fontSize: 14, color: color.ink3 },
});
