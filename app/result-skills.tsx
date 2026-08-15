import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card, DomainRow } from '../src/components/Card';
import { color, font, skill, SKILLS } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { useSession } from '../src/store/session';
import { profileConfidence } from '../src/lib/scoring';

export default function ResultSkills() {
  const router = useRouter();
  const checks = useSession((s) => s.checks);
  const latest = checks[checks.length - 1];
  const confidence = profileConfidence(latest?.skills ?? {});

  const rows = useMemo(
    () => SKILLS.map((k) => ({ key: k, score: latest?.skills[k] })).filter((r) => r.score !== undefined),
    [latest],
  );

  return (
    <Screen scroll footer={<Button label="Start training" onPress={() => router.replace('/(tabs)/play')} />}>
      <Text style={[type.title, { marginTop: 8, fontSize: 26 }]}>Seven domains, one{'\n'}cognitive profile.</Text>

      <Card style={{ marginTop: 16, paddingVertical: 16 }}>
        <Text style={s.label}>Cognitive Profile Confidence</Text>
        <View style={s.rtRow}>
          <Text style={[s.rt, { fontSize: 28 }]}>{confidence.level}</Text>
          <Text style={s.rtUnit}>{Math.round(confidence.coverage * 100)}% measured</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12, paddingVertical: 6, paddingHorizontal: 18 }}>
        {rows.map((r, i) => (
          <DomainRow
            key={r.key}
            name={skill[r.key].label}
            fill={skill[r.key].fill}
            pct={r.score as number}
            value={String(r.score)}
            last={i === rows.length - 1}
          />
        ))}
      </Card>

      <Card style={{ marginTop: 12, paddingVertical: 16 }}>
        <Text style={s.label}>Fun stat, not a score</Text>
        <View style={s.rtRow}>
          <Text style={s.rt}>{latest?.meanRtMs ? Math.round(latest.meanRtMs) : '—'}</Text>
          <Text style={s.rtUnit}>ms mean response</Text>
        </View>
        <Text style={[type.small, { marginTop: 8 }]}>
          Phones differ enough that we don't score this. It's still satisfying to watch.
        </Text>
      </Card>

      <Text style={[type.small, { marginTop: 14 }]}>
        Daily games won't move this number. Only a fresh check does — that's the point of it.
      </Text>
      <View style={{ flex: 1, minHeight: 16 }} />
    </Screen>
  );
}

const s = StyleSheet.create({
  label: { fontFamily: font.sansMedium, fontSize: 12.5, color: color.ink2 },
  rtRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  rt: {
    fontFamily: font.sansSemi,
    fontSize: 34,
    letterSpacing: -1.4,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  rtUnit: { fontFamily: font.mono, fontSize: 11.5, color: color.ink3 },
});
