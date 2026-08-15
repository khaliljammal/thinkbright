import React from 'react';
import { View, Text, StyleSheet, Pressable, Share as RNShare } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { color, font } from '../src/theme/tokens';
import { useSession } from '../src/store/session';

export default function Share() {
  const router = useRouter();
  const checks = useSession((s) => s.checks);
  const age = useSession((s) => s.age);
  const mind = checks[checks.length - 1]?.mindAge ?? age;
  const gap = age - mind;

  const line =
    gap >= 3 ? `${gap} years younger than my driving licence.` : `Mind Age ${mind}. Working on it.`;

  const share = () =>
    RNShare.share({ message: `Mind Age ${mind}. ${line} How sharp are you today? — Mindspan` }).catch(() => {});

  return (
    <Screen>
      <View style={s.header}>
        <Text style={s.title}>Share card</Text>
        <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={10}>
          <Text style={s.close}>Close</Text>
        </Pressable>
      </View>

      <View style={s.center}>
        <View style={s.card}>
          <Text style={s.cardEyebrow}>MINDSPAN · MIND AGE</Text>
          <Text style={s.cardNumber}>{mind}</Text>
          <Text style={s.cardLine}>{line}</Text>
          <Text style={s.cardFoot}>How sharp are you today?</Text>
        </View>
      </View>

      <View style={s.actions}>
        <Button label="Save image" variant="secondary" style={{ flex: 1 }} onPress={share} />
        <Button label="Challenge a friend" style={{ flex: 1.4 }} onPress={share} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 },
  title: { fontFamily: font.sansSemi, fontSize: 15, letterSpacing: -0.3, color: color.ink },
  close: { fontFamily: font.sansMedium, fontSize: 14, color: color.ink3 },
  center: { flex: 1, justifyContent: 'center' },
  card: { backgroundColor: color.focus, borderRadius: 24, paddingVertical: 26, paddingHorizontal: 22 },
  cardEyebrow: { fontFamily: font.mono, fontSize: 10.5, letterSpacing: 1, color: color.ink3 },
  cardNumber: {
    fontFamily: font.sansSemi,
    fontSize: 96,
    lineHeight: 92,
    letterSpacing: -5.8,
    color: color.stim,
    marginTop: 16,
    fontVariant: ['tabular-nums'],
  },
  cardLine: {
    fontFamily: font.sansSemi,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.48,
    color: color.focusInk,
    marginTop: 14,
  },
  cardFoot: { fontFamily: font.sans, fontSize: 13, lineHeight: 20, color: color.focusInk2, marginTop: 14 },
  actions: { flexDirection: 'row', gap: 9, marginTop: 16 },
});
