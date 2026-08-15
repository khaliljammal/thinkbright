import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { color, font } from '../theme/tokens';
import { TrialRecord } from '../lib/scoring';

type Phase = 'watch' | 'recall' | 'between';

type Props = {
  /** Cells the player can tap. Corsi uses a 3x3 grid; digit span uses 0–9. */
  cells: { id: string; label?: string }[];
  columns: number;
  /** True for Memory Ladder: the sequence must come back reversed. */
  reverse?: boolean;
  startLevel: number;
  maxLevel?: number;
  /** Two failures at the same length ends the run. */
  onFinish: (trials: TrialRecord[], levelReached: number) => void;
};

const SHOW_MS = 620;
const BLANK_MS = 230;

export function EngineC({ cells, columns, reverse = false, startLevel, maxLevel = 9, onFinish }: Props) {
  const [level, setLevel] = useState(startLevel);
  const [sequence, setSequence] = useState<string[]>([]);
  const [litIndex, setLitIndex] = useState(-1);
  const [phase, setPhase] = useState<Phase>('watch');
  const [entered, setEntered] = useState<string[]>([]);
  const recorded = useRef<TrialRecord[]>([]);
  const strikes = useRef(0);
  const best = useRef(startLevel - 1);
  const started = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const buildSequence = useCallback(
    (n: number) => {
      const out: string[] = [];
      let last = '';
      for (let i = 0; i < n; i += 1) {
        const pool = cells.filter((c) => c.id !== last);
        const pick = pool[Math.floor(Math.random() * pool.length)].id;
        out.push(pick);
        last = pick;
      }
      return out;
    },
    [cells],
  );

  // Present the sequence one cell at a time, then hand control back.
  useEffect(() => {
    if (phase !== 'watch') return;
    const seq = buildSequence(level);
    setSequence(seq);
    setEntered([]);

    seq.forEach((_, i) => {
      timers.current.push(setTimeout(() => setLitIndex(i), i * (SHOW_MS + BLANK_MS)));
      timers.current.push(setTimeout(() => setLitIndex(-1), i * (SHOW_MS + BLANK_MS) + SHOW_MS));
    });
    timers.current.push(
      setTimeout(() => {
        started.current = Date.now();
        setPhase('recall');
      }, seq.length * (SHOW_MS + BLANK_MS) + 120),
    );

    return clearTimers;
  }, [phase, level, buildSequence]);

  const finishRound = useCallback(
    (correct: boolean) => {
      recorded.current.push({ rtMs: Date.now() - started.current, correct });
      if (correct) {
        best.current = Math.max(best.current, level);
        strikes.current = 0;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        if (level >= maxLevel) {
          onFinish(recorded.current, best.current);
          return;
        }
        setLevel((l) => l + 1);
      } else {
        strikes.current += 1;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        if (strikes.current >= 2) {
          onFinish(recorded.current, Math.max(best.current, 0));
          return;
        }
      }
      setPhase('watch');
    },
    [level, maxLevel, onFinish],
  );

  const target = reverse ? [...sequence].reverse() : sequence;

  const tapCell = (id: string) => {
    if (phase !== 'recall') return;
    const next = [...entered, id];
    setEntered(next);
    const i = next.length - 1;
    if (next[i] !== target[i]) {
      finishRound(false);
      return;
    }
    if (next.length === target.length) finishRound(true);
  };

  const prompt =
    phase === 'watch'
      ? `WATCH · ${Math.min(litIndex + 1, level)} OF ${level}`
      : reverse
        ? `BACKWARDS · ${entered.length} OF ${level}`
        : `REPEAT · ${entered.length} OF ${level}`;

  return (
    <View style={s.root}>
      <View style={[s.grid, { maxWidth: columns * 92 }]}>
        {cells.map((c, i) => {
          const lit = phase === 'watch' && litIndex >= 0 && sequence[litIndex] === c.id;
          const pressed = phase === 'recall' && entered[entered.length - 1] === c.id;
          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={c.label ?? `Tile ${i + 1}`}
              onPress={() => tapCell(c.id)}
              style={[
                s.cell,
                { width: `${100 / columns - 4}%` },
                lit && s.cellLit,
                pressed && !lit && s.cellPressed,
              ]}>
              {c.label ? <Text style={[s.cellLabel, lit && { color: color.focus }]}>{c.label}</Text> : null}
            </Pressable>
          );
        })}
      </View>
      <Text style={s.prompt}>{prompt}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11, justifyContent: 'center', width: '100%' },
  cell: {
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: color.focus2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellLit: { backgroundColor: color.stim },
  cellPressed: { backgroundColor: color.focusLine },
  cellLabel: { fontFamily: font.sansSemi, fontSize: 22, color: color.focusInk },
  prompt: { fontFamily: font.mono, fontSize: 11.5, letterSpacing: 1, color: color.focusInk2 },
});
