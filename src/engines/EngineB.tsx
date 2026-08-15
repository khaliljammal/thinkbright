import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { color, radius, font } from '../theme/tokens';
import { TrialTicks } from '../components/Numeral';
import { TrialRecord } from '../lib/scoring';
import { useLatest } from './clock';

export type Item = {
  id: string;
  prompt: string;
  /** Rendered above the prompt when the item needs a visual stem. */
  stem?: string;
  options: string[];
  answer: string;
  difficulty: number;
  metadata?: TrialRecord['metadata'];
};

type Props = {
  items: Item[];
  perItemMs?: number;
  onFinish: (trials: TrialRecord[], levelReached: number) => void;
};

export function EngineB({ items, perItemMs = 9000, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(perItemMs);
  const recorded = useRef<TrialRecord[]>([]);
  const hardest = useRef(0);
  const shownAt = useRef(Date.now());
  const answered = useRef(false);

  const item = items[index];

  const advance = useCallback(
    (correct: boolean, rtMs: number | null) => {
      if (answered.current) return;
      answered.current = true;
      recorded.current.push({ rtMs, correct, metadata: item.metadata });
      if (correct) hardest.current = Math.max(hardest.current, item.difficulty);
      Haptics.impactAsync(
        correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Rigid,
      ).catch(() => {});

      setTimeout(() => {
        if (index + 1 >= items.length) {
          onFinish(recorded.current, hardest.current);
          return;
        }
        setChosen(null);
        setIndex((i) => i + 1);
      }, 420);
    },
    [index, item, items.length, onFinish],
  );

  // Keyed on the item index alone; depending on `advance` would restart the
  // countdown on every render and the item could never time out.
  const advanceRef = useLatest(advance);

  useEffect(() => {
    answered.current = false;
    shownAt.current = Date.now();
    setRemaining(perItemMs);

    const tick = setInterval(() => {
      const left = perItemMs - (Date.now() - shownAt.current);
      setRemaining(Math.max(0, left));
      if (left <= 0) advanceRef.current(false, null);
    }, 100);

    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, perItemMs]);

  if (!item) return null;

  const choose = (opt: string) => {
    if (answered.current) return;
    setChosen(opt);
    advance(opt === item.answer, Date.now() - shownAt.current);
  };

  return (
    <View style={s.root}>
      <TrialTicks total={items.length} done={index} />
      <View style={s.body}>
        {item.stem ? <Text style={s.stem}>{item.stem}</Text> : null}
        <Text style={s.prompt}>{item.prompt}</Text>
        <View style={s.options}>
          {item.options.map((o) => {
            const isChosen = chosen === o;
            const reveal = chosen !== null;
            const right = o === item.answer;
            return (
              <Pressable
                key={o}
                accessibilityRole="button"
                onPress={() => choose(o)}
                style={[
                  s.option,
                  isChosen && !right && s.optionWrong,
                  reveal && right && s.optionRight,
                ]}>
                <Text style={[s.optionLabel, reveal && right && { color: color.focus }]}>{o}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={s.timerTrack}>
        <View style={[s.timerFill, { width: `${(remaining / perItemMs) * 100}%` }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20, gap: 18 },
  body: { flex: 1, justifyContent: 'center', gap: 22 },
  stem: { fontFamily: font.mono, fontSize: 24, letterSpacing: 3, color: color.stim, textAlign: 'center' },
  prompt: {
    fontFamily: font.sansSemi,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.7,
    color: color.focusInk,
    textAlign: 'center',
  },
  options: { gap: 10 },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.focusLine,
    backgroundColor: color.focus2,
    alignItems: 'center',
  },
  optionRight: { backgroundColor: color.stimStop, borderColor: color.stimStop },
  optionWrong: { borderColor: '#E1483C' },
  optionLabel: { fontFamily: font.sansMedium, fontSize: 16.5, color: color.focusInk },
  timerTrack: { height: 3, borderRadius: 2, backgroundColor: color.focusLine, overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: color.stim, borderRadius: 2 },
});
