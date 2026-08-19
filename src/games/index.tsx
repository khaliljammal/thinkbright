import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EngineA, StimulusSpec } from '../engines/EngineA';
import { EngineB } from '../engines/EngineB';
import { EngineC } from '../engines/EngineC';
import { GameProps } from '../engines/types';
import { color, font } from '../theme/tokens';
import {
  MIND_ROTATE_ITEMS,
  SEQUENCE_ITEMS,
  TARGET_HUNT_ITEMS,
  WORD_CONNECTION_ITEMS,
  WORD_RESCUE_ITEMS,
  pickItems,
} from '../data/items';
import { GameId } from '../data/games';
import { NameFace, WordVault } from './recall-match';
import { PlanAhead } from './plan-ahead';

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

type PulseStim = { x: number; y: number; location: string };

export function PeripheralPulse({ onFinish, gameId }: GameProps) {
  const points = [
    { x: -58, y: -40, location: 'top-left' }, { x: 58, y: -40, location: 'top-right' },
    { x: -72, y: 28, location: 'bottom-left' }, { x: 72, y: 28, location: 'bottom-right' },
    { x: 0, y: 0, location: 'centre' },
  ];
  const trials: StimulusSpec<PulseStim>[] = React.useMemo(
    () => Array.from({ length: 18 }, (_, index) => {
      const point = points[Math.floor(Math.random() * points.length)];
      return { stim: point, expected: 'go', metadata: { location: point.location, trial: index } };
    }),
    [],
  );
  return (
    <EngineA
      trials={trials}
      responseWindowMs={1100}
      renderStimulus={({ x, y }) => (
        <View style={{ width: 190, height: 140, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.focusInk2 }} />
          <View style={[s.pulse, { transform: [{ translateX: x }, { translateY: y }] }]} />
        </View>
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
      const switchTrial = i > 0 && i % 4 === 0;
      if (switchTrial) rule = rule === 'colour' ? 'shape' : 'colour';
      const shape: Shape = Math.random() < 0.5 ? 'circle' : 'square';
      const hue: SwitchStim['hue'] = Math.random() < 0.5 ? 'amber' : 'teal';
      const expected = rule === 'colour' ? (hue === 'amber' ? 'left' : 'right') : shape === 'circle' ? 'left' : 'right';
      return { stim: { shape, hue, rule }, expected, metadata: { switchTrial, rule } };
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

export const SpatialSequence = PatternPath;

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

function ItemGame({ bank, gameId, startLevel, onFinish }: GameProps & { bank: typeof SEQUENCE_ITEMS }) {
  const items = React.useMemo(
    () => pickItems(bank, Math.min(6, bank.length), startLevel).map((item) => ({ ...item, options: shuffled(item.options) })),
    [bank, startLevel],
  );
  return <EngineB items={items} perItemMs={10000} onFinish={(trials, levelReached) => onFinish({ gameId, trials, levelReached })} />;
}

export const TargetHunt = (props: GameProps) => <ItemGame {...props} bank={TARGET_HUNT_ITEMS} />;
export const MindRotate = (props: GameProps) => <ItemGame {...props} bank={MIND_ROTATE_ITEMS} />;
export const WordConnections = (props: GameProps) => <ItemGame {...props} bank={WORD_CONNECTION_ITEMS} />;

export const GAME_COMPONENTS: Record<GameId, React.ComponentType<GameProps>> = {
  'peripheral-pulse': PeripheralPulse,
  'signal-stop': SignalStop,
  'color-clash': ColorClash,
  switchboard: Switchboard,
  'pattern-path': PatternPath,
  'spatial-sequence': SpatialSequence,
  'name-face': NameFace,
  'target-hunt': TargetHunt,
  'mind-rotate': MindRotate,
  'word-vault': WordVault,
  'word-connections': WordConnections,
  'plan-ahead': PlanAhead,
  'memory-ladder': MemoryLadder,
  'word-rescue': WordRescue,
  'sequence-detective': SequenceDetective,
};

const s = StyleSheet.create({
  stim: { width: 120, height: 120 },
  pulse: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: color.stim },
  word: { fontFamily: font.sansSemi, fontSize: 52, letterSpacing: -1.5 },
});
