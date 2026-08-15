import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Card, Chip } from '../../src/components/Card';
import { color, font, skill } from '../../src/theme/tokens';
import { type } from '../../src/theme/type';
import { GAMES } from '../../src/data/games';
import { buildPlan, daySeed } from '../../src/lib/plan';
import { useSession } from '../../src/store/session';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Play() {
  const router = useRouter();
  const { name, streak, checks, concerns, premium, workoutsToday, lastWorkoutDay } = useSession();

  const latest = checks[checks.length - 1];
  const plan = useMemo(
    () => buildPlan({ skills: latest?.skills ?? {}, concerns, seed: daySeed() }),
    [latest, concerns],
  );

  const hardest = plan.find((p) => p.role === 'FOCUS ROUND');
  const doneToday = lastWorkoutDay === new Date().toISOString().slice(0, 10);
  const lockedOut = !premium && doneToday && workoutsToday >= 1;

  // Day one: nothing to summarise yet, so the screen says so rather than faking data.
  if (!checks.length && !streak) {
    return (
      <Screen footer={<Button label="Start the first one" onPress={() => router.push('/workout')} />}>
        <Text style={s.dayline}>{dayName()} · day 1</Text>
        <Text style={s.greeting}>Hello, {name}.</Text>
        <View style={s.emptyMiddle}>
          <View style={s.ghostBars}>
            {[40, 64, 52, 78, 46, 70].map((h, i) => (
              <View key={i} style={[s.ghostBar, { height: `${h}%` }]} />
            ))}
          </View>
          <View>
            <Text style={[type.title, { fontSize: 25 }]}>
              Nothing here yet.{'\n'}That's the correct{'\n'}amount of nothing.
            </Text>
            <Text style={[type.body, { marginTop: 10 }]}>
              Your first workout takes five minutes and fills this screen in. Progress shows up after three
              sessions.
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={s.topRow}>
        <View>
          <Text style={s.dayline}>
            {dayName()} · day {streak || 1}
          </Text>
          <Text style={s.greeting}>{greeting()}, {name}.</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/streak')} style={s.streakPill}>
          <Text style={s.streakText}>{streak} days</Text>
        </Pressable>
      </View>

      <Card style={{ marginTop: 12 }}>
        <View style={s.chips}>
          {plan.map((p) => {
            const k = GAMES[p.gameId].skill;
            return <Chip key={p.gameId} label={skill[k].label} fill={skill[k].fill} text={skill[k].text} />;
          })}
        </View>

        <Text style={[type.heading, { marginTop: 14 }]}>Today's workout</Text>
        <Text style={s.meta}>
          5 MIN · 3 GAMES{hardest ? ` · ${GAMES[hardest.gameId].name.toUpperCase()} IS THE HARD ONE` : ''}
        </Text>

        {lockedOut ? (
          <>
            <Button label="Unlock unlimited play" style={{ marginTop: 15 }} onPress={() => router.push('/paywall')} />
            <Text style={[type.small, { marginTop: 8, textAlign: 'center' }]}>
              That's today's workout done. Free plan is one a day.
            </Text>
          </>
        ) : (
          <>
            <Button label={doneToday ? 'Play again' : 'Start'} style={{ marginTop: 15 }} onPress={() => router.push('/workout')} />
            <Button
              label="Not today — give me the two-minute one"
              variant="quiet"
              onPress={() => router.push('/low-energy')}
            />
          </>
        )}
      </Card>

      <Card style={{ marginTop: 12, paddingVertical: 16 }}>
        <View style={s.betweenRow}>
          <Text style={s.cardLabel}>This week</Text>
          <Text style={s.mono}>{Math.min(streak, 7)} of 7</Text>
        </View>
        <View style={s.week}>
          {DAYS.map((d, i) => {
            const todayIdx = (new Date().getDay() + 6) % 7;
            const done = i < todayIdx && i >= todayIdx - Math.min(streak, todayIdx);
            const isToday = i === todayIdx;
            return (
              <View
                key={i}
                style={[
                  s.day,
                  done && { backgroundColor: color.ink, borderColor: color.ink },
                  isToday && { borderWidth: 1.5, borderColor: color.ink },
                ]}>
                <Text style={[s.dayLabel, done && { color: color.card }, isToday && { color: color.ink }]}>{d}</Text>
              </View>
            );
          })}
        </View>
      </Card>

      {latest ? (
        <Card style={{ marginTop: 12, paddingVertical: 16 }} onPress={() => router.push('/(tabs)/mindage')}>
          <View style={s.betweenRow}>
            <View>
              <Text style={s.cardLabel}>Mind Age</Text>
              <Text style={s.mindNumber}>{latest.mindAge}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.mono}>NEXT CHECK</Text>
              <Text style={s.nextCheck}>in {daysToNextCheck(latest.takenAt)} days</Text>
            </View>
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Morning' : h < 18 ? 'Afternoon' : 'Evening';
}
function dayName() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long' });
}
export function daysToNextCheck(takenAt: string): number {
  const due = new Date(takenAt).getTime() + 28 * 86_400_000;
  return Math.max(0, Math.ceil((due - Date.now()) / 86_400_000));
}

const s = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 8 },
  dayline: { fontFamily: font.sans, fontSize: 12.5, color: color.ink3 },
  greeting: { fontFamily: font.sansSemi, fontSize: 23, letterSpacing: -0.74, color: color.ink, marginTop: 3 },
  streakPill: {
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.card,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  streakText: { fontFamily: font.mono, fontSize: 11, color: color.ink2 },
  chips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  meta: { fontFamily: font.mono, fontSize: 11.5, color: color.ink3, marginTop: 5 },
  betweenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardLabel: { fontFamily: font.sansMedium, fontSize: 12.5, color: color.ink2 },
  mono: { fontFamily: font.mono, fontSize: 11, color: color.ink3 },
  week: { flexDirection: 'row', gap: 5, marginTop: 12 },
  day: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: { fontFamily: font.mono, fontSize: 10, color: color.ink3 },
  mindNumber: {
    fontFamily: font.sansSemi,
    fontSize: 36,
    letterSpacing: -1.6,
    lineHeight: 38,
    color: color.ink,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  nextCheck: { fontFamily: font.sansMedium, fontSize: 14, color: color.ink, marginTop: 4 },
  emptyMiddle: { flex: 1, justifyContent: 'center', gap: 16 },
  ghostBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 60, opacity: 0.35 },
  ghostBar: { flex: 1, borderRadius: 5, backgroundColor: color.line },
});
