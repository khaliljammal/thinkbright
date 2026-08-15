import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Button } from '../components/Button';
import { TrialTicks } from '../components/Numeral';
import { GameProps } from '../engines/types';
import { TrialRecord } from '../lib/scoring';
import { color, font, radius } from '../theme/tokens';

type RecallItem = { cue: string; value: string };

const PEOPLE: RecallItem[] = [
  { cue: '🙂', value: 'Maya' }, { cue: '🧑🏽', value: 'Jonah' },
  { cue: '👩🏻', value: 'Lena' }, { cue: '👨🏿', value: 'Owen' },
];
const WORDS = ['River', 'Glass', 'Tiger', 'Clock', 'Garden', 'Paper'];
const FOILS = ['Lantern', 'Bottle', 'Falcon', 'Window', 'Forest', 'Canvas'];

export function NameFace({ gameId, onFinish }: GameProps) {
  return <RecallMatch gameId={gameId} items={PEOPLE} onFinish={onFinish} />;
}

export function WordVault({ gameId, onFinish }: GameProps) {
  const items = useMemo(() => WORDS.map((word) => ({ cue: 'WORD', value: word })), []);
  return <RecallMatch gameId={gameId} items={items} foils={FOILS} onFinish={onFinish} />;
}

function RecallMatch({
  gameId,
  items,
  foils = [],
  onFinish,
}: Pick<GameProps, 'gameId' | 'onFinish'> & { items: RecallItem[]; foils?: string[] }) {
  const [phase, setPhase] = useState<'encode' | 'interference' | 'recall'>('encode');
  const [index, setIndex] = useState(0);
  const [parity, setParity] = useState(0);
  const trials = useRef<TrialRecord[]>([]);
  const shownAt = useRef(Date.now());

  const choices = useMemo(() => {
    if (foils.length) return [...items.map((item) => item.value), ...foils].sort(() => Math.random() - 0.5);
    return items.map((item) => item.value).sort(() => Math.random() - 0.5);
  }, [foils, items]);

  const beginRecall = () => {
    shownAt.current = Date.now();
    setIndex(0);
    setPhase('recall');
  };

  const answer = (value: string) => {
    const target = items[index].value;
    const correct = value === target;
    trials.current.push({
      correct,
      rtMs: Date.now() - shownAt.current,
      metadata: { phase: 'immediate', cue: items[index].cue, selected: value },
    });
    Haptics.impactAsync(correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Rigid).catch(() => {});
    if (index + 1 >= items.length) {
      const hits = trials.current.filter((trial) => trial.correct).length;
      onFinish({
        gameId,
        trials: trials.current,
        levelReached: hits,
        metrics: { immediateRecall: hits / items.length, itemsEncoded: items.length },
      });
      return;
    }
    setIndex((current) => current + 1);
    shownAt.current = Date.now();
  };

  if (phase === 'encode') {
    return (
      <View style={s.root}>
        <Text style={s.kicker}>STUDY THESE</Text>
        <View style={s.encodingGrid}>
          {items.map((item) => (
            <View key={`${item.cue}-${item.value}`} style={s.encodingCard}>
              <Text style={s.cue}>{item.cue}</Text>
              <Text style={s.value}>{item.value}</Text>
            </View>
          ))}
        </View>
        <Button label="I've got them" variant="onDark" onPress={() => setPhase('interference')} />
      </View>
    );
  }

  if (phase === 'interference') {
    const number = 17 + parity;
    return (
      <View style={s.root}>
        <Text style={s.kicker}>QUICK RESET</Text>
        <Text style={s.question}>Is {number} odd or even?</Text>
        <View style={s.row}>
          {['Odd', 'Even'].map((label) => (
            <Pressable
              key={label}
              style={s.option}
              onPress={() => (parity >= 2 ? beginRecall() : setParity((current) => current + 1))}>
              <Text style={s.optionText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  const item = items[index];
  return (
    <View style={s.root}>
      <TrialTicks total={items.length} done={index} />
      <Text style={s.cue}>{item.cue}</Text>
      <Text style={s.question}>{foils.length ? 'Was this word in the vault?' : 'What was this person’s name?'}</Text>
      <View style={s.options}>
        {(foils.length ? [item.value, foils[index]].sort(() => Math.random() - 0.5) : choices).map((choice) => (
          <Pressable key={choice} style={s.option} onPress={() => answer(choice)}>
            <Text style={s.optionText}>{choice}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', gap: 22, paddingHorizontal: 20 },
  kicker: { fontFamily: font.mono, color: color.focusInk2, textAlign: 'center', fontSize: 11, letterSpacing: 1 },
  encodingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  encodingCard: { width: '45%', padding: 16, gap: 6, alignItems: 'center', borderRadius: radius.md, backgroundColor: color.focus2 },
  cue: { color: color.focusInk, fontSize: 46, textAlign: 'center' },
  value: { color: color.focusInk, fontFamily: font.sansSemi, fontSize: 18 },
  question: { color: color.focusInk, fontFamily: font.sansSemi, fontSize: 24, lineHeight: 30, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  options: { gap: 10 },
  option: { flex: 1, minWidth: 110, padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: color.focusLine, backgroundColor: color.focus2, alignItems: 'center' },
  optionText: { color: color.focusInk, fontFamily: font.sansMedium, fontSize: 16 },
});
