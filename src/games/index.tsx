import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EngineA, StimulusSpec } from '../engines/EngineA';
import { EngineB } from '../engines/EngineB';
import { EngineC } from '../engines/EngineC';
import { GameProps } from '../engines/types';
import { color, font } from '../theme/tokens';
import { WORD_RESCUE_ITEMS, SEQUENCE_ITEMS, pickItems } from '../data/items';
import { GameId } from '../data/games';

const shuffled = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

/* ── Engine A ─────────────────────────────────────────────────────── */

type Shape = 'circle' | 'square';

export function SignalStop({ onFinish, gameId }: GameProps) {
  // 70% go trials — the no-go has to be rare enough that withholding is hard.
  const trials: StimulusSpec<Shape>[] = React.useMemo(
    () =>
      Array.from({ length: 18 }, () => {
        const go = Math.random() < 0.7;
        return { stim: (go ? 'circle' : 'square') as Shape, expected: go ? 'go' : null };
      }),
    [],
  );

  return (
    <EngineA
      trials={trials}
      responseWindowMs={1200}
      renderStimulus={(shape) => (
        <View
          style={[
            s.stim,
            shape === 'circle'
              ? { borderRadius: 60, backgroundColor: color.stim }
              : { borderRadius: 12, backgroundColor: color.stimStop },
          ]}
        />
      )}
      onFinish={(trials) => onFinish({ gameId, trials })}
    />
  );
}

const CLASH = [
  { word: 'RED', ink: '#E1483C', id: 'red' },
  { word: 'BLUE', ink: '#1D6FE0', id: 'blue' },
  { word: 'GREEN', ink: '#0E9384', id: 'green' },
  { word: 'AMBER', ink: '#E08A00', id: 'amber' },
];

export function ColorClash({ onFinish, gameId }: GameProps) {
  const trials: StimulusSpec<{ word: string; ink: string }>[] = React.useMemo(
    () =>
      Array.from({ length: 16 }, () => {
        const word = CLASH[Math.floor(Math.random() * CLASH.length)];
        // Mostly incongruent — the interference is the measurement.
        const ink = Math.random() < 0.75
          ? CLASH.filter((c) => c.id !== word.id)[Math.floor(Math.random() * 3)]
          : word;
        return { stim: { word: word.word, ink: ink.ink }, expected: ink.id };
      }),
    [],
  );

  return (
    <EngineA
      trials={trials}
      responseWindowMs={2600}
      options={CLASH.map((c) => ({ id: c.id, label: c.word[0] + c.word.slice(1).toLowerCase(), fill: c.ink }))}
      renderStimulus={({ word, ink }) => <Text style={[s.word, { color: ink }]}>{word}</Text>}
      onFinish={(trials) => onFinish({ gameId, trials })}
    />
  );
}

type SwitchStim = { shape: Shape; hue: 'amber' | 'teal'; rule: 'colour' | 'shape' };

export function Switchboard({ onFinish, gameId }: GameProps) {
  const trials: StimulusSpec<SwitchStim>[] = React.useMemo(() => {
    let rule: SwitchStim['rule'] = 'colour';
    return Array.from({ length: 18 }, (_, i) => {
      // The rule flips every few trials without warning — that's the cost being measured.
      if (i > 0 && i % 4 === 0) rule = rule === 'colour' ? 'shape' : 'colour';
      const shape: Shape = Math.random() < 0.5 ? 'circle' : 'square';
      const hue: SwitchStim['hue'] = Math.random() < 0.5 ? 'amber' : 'teal';
      const expected = rule === 'colour' ? (hue === 'amber' ? 'left' : 'right') : shape === 'circle' ? 'left' : 'right';
      return { stim: { shape, hue, rule }, expected };
    });
  }, []);

  return (
    <EngineA
      trials={trials}
      responseWindowMs={2400}
      rule={(st) => (st.rule === 'colour' ? 'SORT BY COLOUR' : 'SORT BY SHAPE')}
      options={[
        { id: 'left', label: 'Amber / Circle' },
        { id: 'right', label: 'Teal / Square' },
      ]}
      renderStimulus={({ shape, hue }) => (
        <View
          style={[
            s.stim,
            {
              borderRadius: shape === 'circle' ? 60 : 12,
              backgroundColor: hue === 'amber' ? color.stim : color.stimStop,
            },
          ]}
        />
      )}
      onFinish={(trials) => onFinish({ gameId, trials })}
    />
  );
}

/* ── Engine C ─────────────────────────────────────────────────────── */

export function PatternPath({ onFinish, gameId, startLevel }: GameProps) {
  const cells = React.useMemo(() => Array.from({ length: 9 }, (_, i) => ({ id: `c${i}` })), []);
  return (
    <EngineC
      cells={cells}
      columns={3}
      startLevel={Math.max(3, startLevel)}
      onFinish={(trials, levelReached) => onFinish({ gameId, trials, levelReached })}
    />
  );
}

export function MemoryLadder({ onFinish, gameId, startLevel }: GameProps) {
  const cells = React.useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ id: `d${i + 1}`, label: String(i + 1) })),
    [],
  );
  return (
    <EngineC
      cells={cells}
      columns={3}
      reverse
      startLevel={Math.max(3, startLevel)}
      onFinish={(trials, levelReached) => onFinish({ gameId, trials, levelReached })}
    />
  );
}

/* ── Engine B ─────────────────────────────────────────────────────── */

export function WordRescue({ onFinish, gameId, startLevel }: GameProps) {
  const items = React.useMemo(
    () => pickItems(WORD_RESCUE_ITEMS, 6, startLevel).map((it) => ({ ...it, options: shuffled(it.options) })),
    [startLevel],
  );
  return (
    <EngineB
      items={items}
      perItemMs={8000}
      onFinish={(trials, levelReached) => onFinish({ gameId, trials, levelReached })}
    />
  );
}

export function SequenceDetective({ onFinish, gameId, startLevel }: GameProps) {
  const items = React.useMemo(
    () => pickItems(SEQUENCE_ITEMS, 6, startLevel).map((it) => ({ ...it, options: shuffled(it.options) })),
    [startLevel],
  );
  return (
    <EngineB
      items={items}
      perItemMs={12000}
      onFinish={(trials, levelReached) => onFinish({ gameId, trials, levelReached })}
    />
  );
}

export const GAME_COMPONENTS: Record<GameId, React.ComponentType<GameProps>> = {
  'signal-stop': SignalStop,
  'color-clash': ColorClash,
  switchboard: Switchboard,
  'pattern-path': PatternPath,
  'memory-ladder': MemoryLadder,
  'word-rescue': WordRescue,
  'sequence-detective': SequenceDetective,
};

const s = StyleSheet.create({
  stim: { width: 120, height: 120 },
  word: { fontFamily: font.sansSemi, fontSize: 52, letterSpacing: -1.5 },
});
