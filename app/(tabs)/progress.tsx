import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Card, DomainRow } from '../../src/components/Card';
import { color, font, skill, SKILLS } from '../../src/theme/tokens';
import { type } from '../../src/theme/type';
import { useSession } from '../../src/store/session';

export default function Progress() {
  const router = useRouter();
  const { checks, premium } = useSession();
  const latest = checks[checks.length - 1];
  const previous = checks[checks.length - 2];

  const rows = SKILLS.map((k) => {
    const now = latest?.skills[k];
    const before = previous?.skills[k];
    const delta = now !== undefined && before !== undefined ? now - before : null;
    return { key: k, score: now, delta };
  }).filter((r) => r.score !== undefined);

  const weakest = rows.length ? rows.reduce((a, b) => ((a.score as number) < (b.score as number) ? a : b)) : null;

  if (!checks.length) {
    return (
      <Screen>
        <Text style={[type.heading, { paddingTop: 8 }]}>Progress</Text>
        <View style={s.empty}>
          <Text style={[type.title, { fontSize: 24 }]}>Nothing to plot{'\n'}from one day.</Text>
          <Text style={[type.body, { marginTop: 10 }]}>
            Trends need three sessions before they mean anything. Anything less is just noise with a line through
            it.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={s.topRow}>
        <Text style={type.heading}>Progress</Text>
        <Text style={s.mono}>LAST 7 DAYS</Text>
      </View>

      {weakest ? (
        <Card style={{ marginTop: 12, paddingVertical: 16 }}>
          <View style={s.betweenRow}>
            <Text style={s.cardLabel}>{skill[weakest.key].label} · your weak spot</Text>
            {weakest.delta !== null ? (
              <Text style={[s.mono, { color: skill[weakest.key].text }]}>
                {weakest.delta >= 0 ? '+' : ''}
                {weakest.delta}
              </Text>
            ) : null}
          </View>
          <Trend fill={skill[weakest.key].fill} history={checks.map((c) => c.skills[weakest.key] ?? 50)} />
        </Card>
      ) : null}

      <Card style={{ marginTop: 12, paddingVertical: 6, paddingHorizontal: 18 }}>
        {rows.map((r, i) => (
          <DomainRow
            key={r.key}
            name={skill[r.key].label}
            fill={skill[r.key].fill}
            pct={r.score as number}
            value={r.delta === null ? '—' : `${r.delta > 0 ? '+' : ''}${r.delta}`}
            last={i === rows.length - 1}
          />
        ))}
      </Card>

      {!premium ? (
        <Card dashed style={{ marginTop: 12, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={type.subhead}>Everything before this week</Text>
            <Text style={[type.small, { marginTop: 3 }]}>Free keeps a week. Premium keeps the lot.</Text>
          </View>
          <Button label="Unlock" variant="secondary" style={{ paddingVertical: 9, paddingHorizontal: 15 }} onPress={() => router.push('/paywall')} />
        </Card>
      ) : null}

      <Text style={[type.small, { marginTop: 12, marginBottom: 4 }]}>
        These are training gains on these exercises. Your Mind Age is measured separately, on tasks you haven't
        been practising.
      </Text>
    </Screen>
  );
}

/** Trend line drawn left to right; the last point gets a dot. */
function Trend({ fill, history }: { fill: string; history: number[] }) {
  const pts = history.length > 1 ? history : [history[0] ?? 50, history[0] ?? 50];
  const max = Math.max(...pts, 1);
  const min = Math.min(...pts, 0);
  const span = Math.max(1, max - min);
  const coords = pts.map((v, i) => {
    const x = 2 + (i / (pts.length - 1)) * 216;
    const y = 46 - ((v - min) / span) * 38;
    return { x, y };
  });
  const last = coords[coords.length - 1];

  return (
    <Svg viewBox="0 0 220 54" width="100%" height={54} style={{ marginTop: 10 }}>
      <Polyline
        points={coords.map((c) => `${c.x},${c.y}`).join(' ')}
        fill="none"
        stroke={fill}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={last.x} cy={last.y} r={3.6} fill={fill} />
    </Svg>
  );
}

const s = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
  mono: { fontFamily: font.mono, fontSize: 11, color: color.ink3 },
  betweenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardLabel: { fontFamily: font.sansMedium, fontSize: 12.5, color: color.ink2 },
  empty: { flex: 1, justifyContent: 'center' },
});
