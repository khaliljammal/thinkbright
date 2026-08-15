import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { QuitLink } from '../src/components/BackLink';
import { Card } from '../src/components/Card';
import { color, font, skill } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { GAMES, GameId } from '../src/data/games';
import { GAME_COMPONENTS } from '../src/games';
import { buildPlan, daySeed, PlanSlot } from '../src/lib/plan';
import { GameResult, accuracy, deriveGameMetrics } from '../src/lib/scoring';
import { useSession } from '../src/store/session';

type Stage = 'brief' | 'play' | 'feedback' | 'summary';

export default function Workout() {
  const router = useRouter();
  const { only } = useLocalSearchParams<{ only?: string }>();
  const { concerns, checks, levelFor, completeWorkout, streak } = useSession();

  const latest = checks[checks.length - 1];
  const plan: PlanSlot[] = useMemo(() => {
    if (only && only in GAMES) return [{ gameId: only as GameId, role: 'WILDCARD' }];
    return buildPlan({ skills: latest?.skills ?? {}, concerns, seed: daySeed() });
  }, [only, latest, concerns]);

  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>('brief');
  const [results, setResults] = useState<GameResult[]>([]);

  const slot = plan[index];
  const game = slot ? GAMES[slot.gameId] : null;
  const Game = slot ? GAME_COMPONENTS[slot.gameId] : null;
  const startedAt = useMemo(() => Date.now(), []);

  const onFinish = (result: GameResult) => {
    const complete = { ...result, mode: 'training' as const, metrics: deriveGameMetrics(result) };
    setResults((r) => [...r, complete]);
    setStage('feedback');
  };

  const next = async () => {
    if (index + 1 >= plan.length) {
      await completeWorkout(results);
      setStage('summary');
      return;
    }
    setIndex((i) => i + 1);
    setStage('brief');
  };

  if (stage === 'summary') {
    const mins = Math.floor((Date.now() - startedAt) / 60000);
    const secs = Math.floor(((Date.now() - startedAt) % 60000) / 1000);
    return (
      <Screen scroll footer={<Button label="Done" onPress={() => router.replace('/(tabs)/play')} />}>
        <Text style={s.eyebrow}>
          DAY {streak} · {mins} MIN {secs} S
        </Text>
        <Text style={[type.title, { marginTop: 10 }]}>Done. That's{'\n'}today handled.</Text>

        <Card style={{ marginTop: 16, paddingVertical: 6, paddingHorizontal: 18 }}>
          {results.map((r, i) => {
            const g = GAMES[r.gameId];
            return (
              <View key={r.gameId} style={[s.row, i === results.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[s.key, { backgroundColor: skill[g.skill].fill }]} />
                <Text style={[type.label, { flex: 1 }]}>{g.name}</Text>
                <Text style={s.stat}>
                  {r.levelReached ? `SPAN ${r.levelReached}` : `${Math.round(accuracy(r.trials) * 100)}%`}
                </Text>
              </View>
            );
          })}
        </Card>

        <Card style={{ marginTop: 12, paddingVertical: 16 }}>
          <Text style={s.cardLabel}>Tomorrow</Text>
          <Text style={[type.body, { marginTop: 6, color: color.ink, fontSize: 15 }]}>
            Switchboard. The rule changes halfway through and nobody enjoys that.
          </Text>
        </Card>

        <Text style={[type.small, { marginTop: 14 }]}>
          Today's play doesn't move your Mind Age.
          {latest ? ` Your next check is in ${daysUntil(latest.takenAt)} days.` : ''}
        </Text>
        <View style={{ flex: 1, minHeight: 14 }} />
      </Screen>
    );
  }

  if (stage === 'feedback') {
    const r = results[results.length - 1];
    const acc = Math.round(accuracy(r.trials) * 100);
    const upcoming = plan[index + 1];
    return (
      <Screen
        footer={
          <Button label={upcoming ? `Next: ${GAMES[upcoming.gameId].name}` : 'Finish'} onPress={next} />
        }>
        <Text style={s.eyebrow}>
          GAME {index + 1} OF {plan.length} DONE
        </Text>
        <View style={s.middle}>
          <View>
            <Text style={[type.title, { fontSize: 29 }]}>
              {r.levelReached ? `${r.levelReached} in a row.` : acc >= 85 ? 'Sharp today.' : 'Got through it.'}
            </Text>
            <Text style={[type.body, { marginTop: 10 }]}>
              {r.levelReached
                ? `Level ${r.levelReached} reached, which you'll regret tomorrow.`
                : 'Accuracy is what counts here, not speed.'}
            </Text>
          </View>
          <View style={s.stats}>
            <StatCard value={r.levelReached ? String(r.levelReached) : `${acc}%`} label={r.levelReached ? 'SPAN REACHED' : 'ACCURACY'} />
            <StatCard value={`${acc}%`} label="ACCURACY" />
          </View>
        </View>
      </Screen>
    );
  }

  if (stage === 'play' && Game && slot) {
    return (
      <Screen dark padded={false}>
        <Game gameId={slot.gameId} startLevel={levelFor(slot.gameId)} onFinish={onFinish} />
      </Screen>
    );
  }

  if (!game || !slot) return null;

  return (
    <Screen dark footer={<Button label="I'm ready" variant="onDark" onPress={() => setStage('play')} />}>
      <View style={s.header}>
        <Text style={s.eyebrowDark}>
          GAME {index + 1} OF {plan.length} · {slot.role}
        </Text>
        <QuitLink onPress={() => router.replace('/(tabs)/play')} />
      </View>
      <View style={s.middle}>
        <View>
          <View style={s.chip}>
            <View style={[s.chipDot, { backgroundColor: skill[game.skill].fill }]} />
            <Text style={s.chipLabel}>
              {skill[game.skill].label} · level {levelFor(slot.gameId)}
            </Text>
          </View>
          <Text style={s.darkTitle}>{game.name}</Text>
          <Text style={s.darkBody}>{game.brief}</Text>
        </View>
      </View>
    </Screen>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card style={{ flex: 1, padding: 14 }}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Card>
  );
}

function daysUntil(takenAt: string) {
  return Math.max(0, Math.ceil((new Date(takenAt).getTime() + 28 * 86_400_000 - Date.now()) / 86_400_000));
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 },
  eyebrow: { fontFamily: font.mono, fontSize: 11, color: color.ink3, paddingTop: 8 },
  eyebrowDark: { fontFamily: font.mono, fontSize: 11, color: color.ink3 },
  middle: { flex: 1, justifyContent: 'center', gap: 20 },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: color.focusLine,
    borderRadius: 999,
    paddingVertical: 5,
    paddingLeft: 9,
    paddingRight: 12,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipLabel: { fontFamily: font.sans, fontSize: 12.5, color: color.focusInk },
  darkTitle: {
    fontFamily: font.sansSemi,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -1.2,
    color: color.focusInk,
    marginTop: 14,
  },
  darkBody: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, color: color.focusInk2, marginTop: 10 },
  stats: { flexDirection: 'row', gap: 10 },
  statValue: {
    fontFamily: font.sansSemi,
    fontSize: 28,
    letterSpacing: -1.1,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  statLabel: { fontFamily: font.mono, fontSize: 10.5, color: color.ink3, marginTop: 3 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  key: { width: 5, height: 22, borderRadius: 3 },
  stat: { fontFamily: font.mono, fontSize: 12, color: color.ink2 },
  cardLabel: { fontFamily: font.sansMedium, fontSize: 12.5, color: color.ink2 },
});
