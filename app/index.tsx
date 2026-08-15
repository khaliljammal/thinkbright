import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { color, skill, SKILLS } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { useSession } from '../src/store/session';

const BARS = [44, 72, 56, 88, 64, 36];

export default function Welcome() {
  const router = useRouter();
  const ready = useSession((s) => s.ready);
  const userId = useSession((s) => s.userId);
  const checks = useSession((s) => s.checks);

  // Returning players skip straight to the loop.
  useEffect(() => {
    if (ready && userId && checks.length) router.replace('/(tabs)/play');
  }, [ready, userId, checks.length, router]);

  return (
    <Screen
      footer={
        <View style={{ gap: 4 }}>
          <Button label="Get started" onPress={() => router.push('/signup')} />
          <Button label="I already have an account" variant="quiet" onPress={() => router.push('/signup')} />
        </View>
      }>
      <View style={s.brandRow}>
        <View style={s.mark} />
        <Text style={s.brand}>Mindspan</Text>
      </View>

      <View style={s.center}>
        <View style={s.bars}>
          {SKILLS.map((k, i) => (
            <View key={k} style={[s.bar, { height: `${BARS[i]}%`, backgroundColor: skill[k].fill }]} />
          ))}
        </View>
        <Text style={type.display}>AI is doing more{'\n'}of your thinking.{'\n'}Keep yours sharp.</Text>
        <Text style={[type.bodyLg, { maxWidth: 320 }]}>
          Five minutes a day of the thinking you'd rather not outsource. It's a game. It's also the only workout
          that fits in a lift.
        </Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6 },
  mark: { width: 11, height: 11, borderRadius: 3, backgroundColor: color.ink },
  brand: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 14, letterSpacing: -0.28, color: color.ink },
  center: { flex: 1, justifyContent: 'center', gap: 18 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, height: 96 },
  bar: { width: 26, borderRadius: 6 },
});
