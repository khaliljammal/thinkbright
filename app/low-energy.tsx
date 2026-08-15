import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { BackLink } from '../src/components/BackLink';
import { color, font, skill } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { GAMES, GameId } from '../src/data/games';
import { useSession } from '../src/store/session';

const QUICK: { id: GameId; note: string }[] = [
  { id: 'signal-stop', note: 'FAST ONE' },
  { id: 'pattern-path', note: 'NO READING' },
  { id: 'word-rescue', note: 'THE HARD ONE' },
];

export default function LowEnergy() {
  const router = useRouter();
  const levelFor = useSession((s) => s.levelFor);

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <View style={s.middle}>
        <View>
          <Text style={[type.title, { fontSize: 28 }]}>Two minutes,{'\n'}one game.</Text>
          <Text style={[type.body, { marginTop: 10 }]}>
            Counts for the streak. Doesn't count for much else, and that's fine — showing up is the habit.
          </Text>
        </View>

        <View style={{ gap: 9 }}>
          {QUICK.map((q) => {
            const g = GAMES[q.id];
            return (
              <Pressable
                key={q.id}
                accessibilityRole="button"
                onPress={() => router.replace(`/workout?only=${q.id}`)}
                style={s.option}>
                <View style={[s.key, { backgroundColor: skill[g.skill].fill }]} />
                <Text style={[type.subhead, { flex: 1, fontSize: 15 }]}>{g.name}</Text>
                <Text style={s.note}>
                  {q.id === 'pattern-path' ? `LEVEL ${levelFor(q.id)}` : q.note}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  middle: { flex: 1, justifyContent: 'center', gap: 18 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: 14,
    padding: 15,
  },
  key: { width: 5, height: 24, borderRadius: 3 },
  note: { fontFamily: font.mono, fontSize: 10.5, color: color.ink3 },
});
