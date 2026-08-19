import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TrialTicks } from '../components/Numeral';
import { GameProps } from '../engines/types';
import { color, font, radius } from '../theme/tokens';

const GOAL = ['1', '2', '3', '4'];
const STARTS = [
  ['2', '1', '4', '3'],
  ['3', '1', '2', '4'],
  ['2', '4', '1', '3'],
];

const minimumMoves = (values: string[]) => values.reduce(
  (total, value, index) => total + values.slice(index + 1).filter((next) => Number(next) < Number(value)).length,
  0,
);

export function PlanAhead({ gameId, onFinish }: GameProps) {
  const starts = useMemo(() => STARTS.map((start) => [...start]), []);
  const [round, setRound] = useState(0);
  const [tiles, setTiles] = useState(starts[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const moves = useRef(0);
  const startedAt = useRef(Date.now());
  const firstMoveAt = useRef<number | null>(null);
  const trials = useRef<Parameters<GameProps['onFinish']>[0]['trials']>([]);

  const tap = (index: number) => {
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (Math.abs(selected - index) !== 1) {
      setSelected(index);
      return;
    }
    if (firstMoveAt.current === null) firstMoveAt.current = Date.now();
    moves.current += 1;
    const next = [...tiles];
    [next[selected], next[index]] = [next[index], next[selected]];
    setSelected(null);
    setTiles(next);
    if (next.join('') !== GOAL.join('')) return;

    const optimal = minimumMoves(starts[round]);
    trials.current.push({
      correct: true,
      rtMs: Date.now() - startedAt.current,
      metadata: {
        moves: moves.current,
        optimalMoves: optimal,
        excessMoves: Math.max(0, moves.current - optimal),
        planningMs: (firstMoveAt.current ?? Date.now()) - startedAt.current,
      },
    });
    if (round + 1 >= starts.length) {
      const efficiency = trials.current.reduce((sum, trial) => {
        const used = Number(trial.metadata?.moves ?? 1);
        return sum + Number(trial.metadata?.optimalMoves ?? 0) / used;
      }, 0) / trials.current.length;
      onFinish({ gameId, trials: trials.current, levelReached: starts.length, metrics: { planningEfficiency: efficiency } });
      return;
    }
    const nextRound = round + 1;
    setRound(nextRound);
    setTiles(starts[nextRound]);
    moves.current = 0;
    firstMoveAt.current = null;
    startedAt.current = Date.now();
  };

  return (
    <View style={s.root}>
      <TrialTicks total={starts.length} done={round} />
      <View style={s.block}>
        <Text style={s.label}>GOAL</Text>
        <View style={s.row}>{GOAL.map((tile) => <Tile key={tile} tile={tile} />)}</View>
      </View>
      <View style={s.block}>
        <Text style={s.label}>YOUR MOVES · TAP NEIGHBOURS TO SWAP</Text>
        <View style={s.row}>
          {tiles.map((tile, index) => (
            <Pressable key={tile} onPress={() => tap(index)} style={[s.tile, selected === index && s.selected]}>
              <Text style={s.tileText}>{tile}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Text style={s.moves}>{moves.current} MOVES</Text>
    </View>
  );
}

function Tile({ tile }: { tile: string }) {
  return <View style={s.tile}><Text style={s.tileText}>{tile}</Text></View>;
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', gap: 28, paddingHorizontal: 20 },
  block: { gap: 10 },
  label: { fontFamily: font.mono, fontSize: 10.5, color: color.focusInk2, textAlign: 'center', letterSpacing: 0.8 },
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  tile: { width: 58, height: 68, borderRadius: radius.md, backgroundColor: color.focus2, borderWidth: 1, borderColor: color.focusLine, alignItems: 'center', justifyContent: 'center' },
  selected: { borderColor: color.stim, borderWidth: 2 },
  tileText: { fontFamily: font.sansSemi, color: color.focusInk, fontSize: 24 },
  moves: { fontFamily: font.mono, color: color.focusInk2, fontSize: 11, textAlign: 'center' },
});
