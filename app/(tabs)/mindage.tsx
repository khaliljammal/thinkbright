import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { color, font, skill } from '../../src/theme/tokens';
import { type } from '../../src/theme/type';
import { verdict } from '../../src/lib/scoring';
import { useSession } from '../../src/store/session';

export default function MindAge() {
  const router = useRouter();
  const { checks, age, premium, startCheck } = useSession();
  const latest = checks[checks.length - 1];

  const recheck = () => {
    // Free plan is one check a month; the paywall is the natural gate here.
    if (!premium && latest && daysUntil(latest.takenAt) > 0) {
      router.push('/paywall');
      return;
    }
    startCheck();
    router.push('/check/0');
  };

  if (!latest) {
    return (
      <Screen footer={<Button label="Take the check" onPress={recheck} />}>
        <Text style={[type.heading, { paddingTop: 8 }]}>Mind Age</Text>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[type.title, { fontSize: 25 }]}>No number yet.{'\n'}Four minutes fixes that.</Text>
          <Text style={[type.body, { marginTop: 10 }]}>
            Six short tasks in the dark, and you get something worth comparing against next month.
          </Text>
        </View>
      </Screen>
    );
  }

  const days = daysUntil(latest.takenAt);
  const history = checks.slice(-4);
  const values = history.map((c) => c.mindAge);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <Screen scroll>
      <Text style={[type.heading, { paddingTop: 8 }]}>Mind Age</Text>

      <Card style={{ marginTop: 12, paddingVertical: 20 }}>
        <View style={s.headline}>
          <Text style={s.big}>{latest.mindAge}</Text>
          <Text style={[type.body, { fontSize: 15 }]}>{verdict(latest.mindAge, age)}</Text>
        </View>

        <View style={s.chart}>
          {history.map((c, i) => {
            const span = Math.max(1, max - min);
            const h = 26 + ((max - c.mindAge) / span) * 44;
            const isLast = i === history.length - 1;
            return (
              <View key={c.id} style={s.col}>
                <Text style={s.colValue}>{c.mindAge}</Text>
                <View style={s.colTrack}>
                  <View
                    style={[s.colBar, { height: h, backgroundColor: isLast ? skill.focus.fill : '#D6D9E6' }]}
                  />
                </View>
                <Text style={s.colLabel}>
                  {new Date(c.takenAt).toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={[type.small, { marginTop: 16 }]}>
          Rolling average of your last three checks, so one bad night doesn't tank it.
        </Text>
      </Card>

      <Card dark style={{ marginTop: 12, paddingVertical: 20 }}>
        <Text style={s.darkEyebrow}>{days > 0 ? `NEXT CHECK IN ${days} DAYS` : 'A CHECK IS DUE'}</Text>
        <Text style={s.darkTitle}>
          {days > 0 ? 'Impatient? A fresh check is four minutes.' : 'Four weeks up. Ready for a fresh one?'}
        </Text>
        <View style={s.darkActions}>
          <Button label="Check now" variant="onDark" style={{ flex: 1, paddingVertical: 13 }} onPress={recheck} />
          <Button
            label={`Share ${latest.mindAge}`}
            variant="onDarkOutline"
            style={{ flex: 1, paddingVertical: 13 }}
            onPress={() => router.push('/share')}
          />
        </View>
        {!premium ? <Text style={s.darkFoot}>Free plan: one check a month.</Text> : null}
      </Card>

      <Card
        style={{ marginTop: 12, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        onPress={() => router.push('/science')}>
        <Text style={type.label}>What this number actually is</Text>
        <Text style={{ color: color.ink3 }}>→</Text>
      </Card>
    </Screen>
  );
}

function daysUntil(takenAt: string) {
  return Math.max(0, Math.ceil((new Date(takenAt).getTime() + 28 * 86_400_000 - Date.now()) / 86_400_000));
}

const s = StyleSheet.create({
  headline: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  big: {
    fontFamily: font.sansSemi,
    fontSize: 64,
    lineHeight: 61,
    letterSpacing: -3.5,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 86, marginTop: 20 },
  col: { flex: 1, height: '100%', alignItems: 'center', gap: 7 },
  colValue: { fontFamily: font.mono, fontSize: 10, color: color.ink2 },
  colTrack: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  colBar: { width: '100%', borderRadius: 6 },
  colLabel: { fontFamily: font.mono, fontSize: 9.5, color: color.ink3 },
  darkEyebrow: { fontFamily: font.mono, fontSize: 10.5, letterSpacing: 0.84, color: color.ink3 },
  darkTitle: {
    fontFamily: font.sansSemi,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.53,
    color: color.focusInk,
    marginTop: 10,
  },
  darkActions: { flexDirection: 'row', gap: 9, marginTop: 16 },
  darkFoot: { fontFamily: font.sans, fontSize: 11.5, color: color.ink3, marginTop: 12 },
});
