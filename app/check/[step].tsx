import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { QuitLink } from '../../src/components/BackLink';
import { color, font, skill } from '../../src/theme/tokens';

import { CHECK_ORDER, GAMES } from '../../src/data/games';
import { GAME_COMPONENTS } from '../../src/games';
import { GameResult, accuracy, meanRt } from '../../src/lib/scoring';
import { useSession } from '../../src/store/session';

type Stage = 'brief' | 'play' | 'between';

export default function CheckStep() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const index = Math.max(0, Math.min(CHECK_ORDER.length - 1, parseInt(step ?? '0', 10) || 0));
  const gameId = CHECK_ORDER[index];
  const game = GAMES[gameId];
  const Game = GAME_COMPONENTS[gameId];

  const pushResult = useSession((s) => s.pushResult);
  const levelFor = useSession((s) => s.levelFor);

  const [stage, setStage] = useState<Stage>('brief');
  const [last, setLast] = useState<GameResult | null>(null);

  const finish = (result: GameResult) => {
    pushResult(result);
    setLast(result);
    setStage('between');
  };

  const next = () => {
    if (index + 1 >= CHECK_ORDER.length) router.replace('/result');
    else router.replace(`/check/${index + 1}`);
  };

  if (stage === 'play') {
    return (
      <Screen dark padded={false}>
        <Game gameId={gameId} startLevel={levelFor(gameId)} onFinish={finish} />
      </Screen>
    );
  }

  if (stage === 'between' && last) {
    const acc = Math.round(accuracy(last.trials) * 100);
    const rt = meanRt(last.trials);
    const upcoming = CHECK_ORDER[index + 1];

    return (
      <Screen dark footer={<Button label={upcoming ? 'Keep going' : 'See the number'} variant="onDark" onPress={next} />}>
        <Text style={s.taskCount}>
          TASK {index + 1} OF {CHECK_ORDER.length} DONE
        </Text>
        <View style={s.middle}>
          <View>
            <Text style={s.doneLine}>{game.name}, done.</Text>
            <Text style={s.darkTitle}>
              {acc >= 85 ? 'Held together\nnicely.' : acc >= 65 ? 'Solid enough\nfor now.' : 'That one bit\nback.'}
            </Text>
          </View>

          <View style={s.stats}>
            <Stat value={`${acc}%`} label="ACCURACY" />
            <Stat value={rt ? String(Math.round(rt)) : '—'} label="MEAN MS" />
          </View>

          {upcoming ? (
            <Text style={s.nextLine}>
              Next up: <Text style={{ color: color.focusInk }}>{GAMES[upcoming].name}</Text>.{' '}
              {GAMES[upcoming].paradigm === 'DIGIT SPAN' ? 'Sequences, backwards. Take a breath first.' : 'Take a breath first.'}
            </Text>
          ) : (
            <Text style={s.nextLine}>That's all six. Let's see what they add up to.</Text>
          )}
        </View>
      </Screen>
    );
  }

  return (
    <Screen dark footer={<Button label="I'm ready" variant="onDark" onPress={() => setStage('play')} />}>
      <View style={s.header}>
        <Text style={s.taskCount}>
          TASK {index + 1} OF {CHECK_ORDER.length}
        </Text>
        <QuitLink onPress={() => router.replace('/(tabs)/play')} />
      </View>

      <View style={s.middle}>
        <View>
          <View style={s.chip}>
            <View style={[s.chipDot, { backgroundColor: skill[game.skill].fill }]} />
            <Text style={s.chipLabel}>{skill[game.skill].label}</Text>
          </View>
          <Text style={[s.darkTitle, { marginTop: 14, fontSize: 32 }]}>{game.name}</Text>
          <Text style={s.darkBody}>{game.brief}</Text>
        </View>
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 },
  taskCount: { fontFamily: font.mono, fontSize: 11, color: color.ink3, paddingTop: 6 },
  middle: { flex: 1, justifyContent: 'center', gap: 24 },
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
  darkTitle: { fontFamily: font.sansSemi, fontSize: 30, lineHeight: 33, letterSpacing: -1.1, color: color.focusInk },
  darkBody: { fontFamily: font.sans, fontSize: 16, lineHeight: 24, color: color.focusInk2, marginTop: 10 },
  doneLine: { fontFamily: font.sans, fontSize: 13.5, color: color.focusInk2 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, borderWidth: 1, borderColor: color.focusLine, borderRadius: 14, padding: 14 },
  statValue: {
    fontFamily: font.sansSemi,
    fontSize: 26,
    letterSpacing: -1,
    color: color.focusInk,
    fontVariant: ['tabular-nums'],
  },
  statLabel: { fontFamily: font.mono, fontSize: 10.5, color: color.ink3, marginTop: 3 },
  nextLine: { fontFamily: font.sans, fontSize: 14, lineHeight: 21, color: color.focusInk2 },
});
