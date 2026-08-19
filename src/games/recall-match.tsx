import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Button } from '../components/Button';
import { TrialTicks } from '../components/Numeral';
import { GameProps } from '../engines/types';
import { TrialRecord } from '../lib/scoring';
import { color, font, radius } from '../theme/tokens';
import { useSession } from '../store/session';

type RecallItem = { cue: string; value: string };

const PEOPLE: RecallItem[] = [
  { cue: '🙂', value: 'Maya' }, { cue: '🧑🏽', value: 'Jonah' },
  { cue: '👩🏻', value: 'Lena' }, { cue: '👨🏿', value: 'Owen' },
];
const WORDS = ['River', 'Glass', 'Tiger', 'Clock', 'Garden', 'Paper'];
const FOILS = ['Lantern', 'Bottle', 'Falcon', 'Window', 'Forest', 'Canvas'];

export function NameFace({ gameId, assessmentPhase = 'full', onFinish }: GameProps) {
  return <RecallMatch gameId={gameId} items={PEOPLE} assessmentPhase={assessmentPhase} onFinish={onFinish} />;
}

export function WordVault({ gameId, assessmentPhase = 'full', onFinish }: GameProps) {
  const items = useMemo(() => WORDS.map((word) => ({ cue: 'WORD', value: word })), []);
  return <RecallMatch gameId={gameId} items={items} foils={FOILS} assessmentPhase={assessmentPhase} onFinish={onFinish} />;
}

function RecallMatch({
  gameId,
  items,
  foils = [],
  assessmentPhase,
  onFinish,
}: Pick<GameProps, 'gameId' | 'assessmentPhase' | 'onFinish'> & { items: RecallItem[]; foils?: string[] }) {
  const recallId = gameId as 'name-face' | 'word-vault';
  const delayedPayload = useSession((state) => state.delayedRecall[recallId]);
  const setDelayedRecall = useSession((state) => state.setDelayedRecall);
  const delayed = assessmentPhase === 'delayed';
  const activeItems = delayedPayload?.items ?? items;
  const activeFoils = delayedPayload?.foils ?? foils;
  const [phase, setPhase] = useState<'encode' | 'interference' | 'recall'>(delayed ? 'recall' : 'encode');
  const [index, setIndex] = useState(0);
  const [parity, setParity] = useState(0);
  const trials = useRef<TrialRecord[]>([]);
  const shownAt = useRef(Date.now());

  const choices = useMemo(() => {
    if (activeFoils.length) return [...activeItems.map((item) => item.value), ...activeFoils].sort(() => Math.random() - 0.5);
    return activeItems.map((item) => item.value).sort(() => Math.random() - 0.5);
  }, [activeFoils, activeItems]);

  const beginRecall = () => {
    shownAt.current = Date.now();
    setIndex(0);
    setPhase('recall');
  };

  const answer = (value: string) => {
    const target = activeItems[index].value;
    const correct = value === target;
    trials.current.push({
      correct,
      rtMs: Date.now() - shownAt.current,
      metadata: { phase: delayed ? 'delayed' : 'immediate', cue: activeItems[index].cue, selected: value },
    });
    Haptics.impactAsync(correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Rigid).catch(() => {});
    if (index + 1 >= activeItems.length) {
      const hits = trials.current.filter((trial) => trial.correct).length;
      const recallAccuracy = hits / activeItems.length;
      if (assessmentPhase === 'immediate') {
        setDelayedRecall(recallId, {
          items: activeItems,
          foils: activeFoils,
          immediateAccuracy: recallAccuracy,
          encodedAt: new Date().toISOString(),
        });
      }
      onFinish({
        gameId,
        trials: trials.current,
        levelReached: hits,
        metrics: delayed
          ? {
              delayedRecall: recallAccuracy,
              retentionRate: delayedPayload && delayedPayload.immediateAccuracy > 0
                ? recallAccuracy / delayedPayload.immediateAccuracy
                : null,
              delayMs: delayedPayload ? Date.now() - new Date(delayedPayload.encodedAt).getTime() : null,
            }
          : { immediateRecall: recallAccuracy, itemsEncoded: activeItems.length },
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
          {activeItems.map((item) => (
            <View key={`${item.cue}-${item.value}`} style={s.encodingCard}>
              <Text style={s.cue}>{item.cue}</Text>
              <Text style={s.value}>{item.value}</Text>
            </View>
          ))}
        </View>
        <Button
          label="I've got them"
          variant="onDark"
          onPress={() => setPhase(assessmentPhase === 'immediate' ? 'recall' : 'interference')}
        />
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

  const item = activeItems[index];
  if (!item) {
    return (
      <View style={s.root}>
        <Text style={s.question}>The earlier memory set is unavailable. Restart the assessment to continue.</Text>
      </View>
    );
  }
  return (
    <View style={s.root}>
      <TrialTicks total={activeItems.length} done={index} />
      <Text style={s.cue}>{item.cue}</Text>
      <Text style={s.question}>{activeFoils.length ? 'Which word was in the vault?' : 'What was this person’s name?'}</Text>
      <View style={s.options}>
        {(activeFoils.length ? [item.value, activeFoils[index]].sort(() => Math.random() - 0.5) : choices).map((choice) => (
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
