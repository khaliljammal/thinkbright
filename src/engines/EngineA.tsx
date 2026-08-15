import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { color, radius, font } from '../theme/tokens';
import { TrialTicks } from '../components/Numeral';
import { TrialRecord } from '../lib/scoring';
import { useTrialClock, useLatest } from './clock';

export type StimulusSpec<S> = {
  stim: S;
  /** Null means this is a no-go trial: the correct response is no response. */
  expected: string | null;
};

type Props<S> = {
  trials: StimulusSpec<S>[];
  /** Rendered with zero transition — easing on onset corrupts the measurement. */
  renderStimulus: (stim: S) => React.ReactNode;
  /** Omit for single-response go/no-go; provide for choice tasks. */
  options?: { id: string; label: string; fill?: string }[];
  /** Shown above the stimulus, e.g. the current sorting rule in Switchboard. */
  rule?: (stim: S) => string | null;
  responseWindowMs?: number;
  onFinish: (trials: TrialRecord[]) => void;
};

const GAP_MIN = 450;
const GAP_JITTER = 500;

export function EngineA<S>({
  trials,
  renderStimulus,
  options,
  rule,
  responseWindowMs = 1500,
  onFinish,
}: Props<S>) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [flash, setFlash] = useState<'none' | 'hit' | 'miss'>('none');
  const recorded = useRef<TrialRecord[]>([]);
  const answered = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { onsetAt, markOnset, clearOnset } = useTrialClock();

  const current = trials[index];

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const advance = useCallback(() => {
    setVisible(false);
    clearOnset();
    setFlash('none');
    if (index + 1 >= trials.length) {
      onFinish(recorded.current);
      return;
    }
    setIndex((i) => i + 1);
  }, [index, trials.length, onFinish, clearOnset]);

  const commit = useCallback(
    (record: TrialRecord) => {
      if (answered.current) return;
      answered.current = true;
      clearTimers();
      recorded.current.push(record);
      setFlash(record.correct ? 'hit' : 'miss');
      Haptics.impactAsync(
        record.correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Rigid,
      ).catch(() => {});
      timers.current.push(setTimeout(advance, 260));
    },
    [advance],
  );

  const respond = useCallback(
    (rtMs: number, choice: string | null) => {
      if (!current || answered.current) return;
      const expected = current.expected;
      // A response on a no-go trial is always wrong; on a go trial the choice must match.
      const correct = expected !== null && (options ? choice === expected : true);
      commit({ rtMs, correct, isNoGo: expected === null });
    },
    [current, options, commit],
  );

  // Trial lifecycle: blank gap, then stimulus with no transition, then a window.
  // Depends on the trial index alone — anything else here would tear the trial
  // down and restart it on every render, and it would never complete.
  const commitRef = useLatest(commit);
  const expectedRef = useLatest(current?.expected ?? null);

  useEffect(() => {
    if (!current) return;
    answered.current = false;
    const gap = GAP_MIN + Math.random() * GAP_JITTER;

    timers.current.push(
      setTimeout(() => {
        markOnset();
        setVisible(true);
        timers.current.push(
          setTimeout(() => {
            if (answered.current) return;
            // Timed out: correct only if withholding was the right call.
            const isNoGo = expectedRef.current === null;
            commitRef.current({ rtMs: null, correct: isNoGo, isNoGo });
          }, responseWindowMs),
        );
      }, gap),
    );

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const tap = Gesture.Tap()
    .maxDuration(10_000)
    .onBegin(() => {
      'worklet';
      if (onsetAt.value === 0) return;
      runOnJS(respond)(performance.now() - onsetAt.value, null);
    });

  const body = (
    <View style={s.stage}>
      {rule && current ? <Text style={s.rule}>{rule(current.stim)}</Text> : null}
      <View style={s.stimWrap}>{visible && current ? renderStimulus(current.stim) : null}</View>
      {options ? (
        <View style={s.options}>
          {options.map((o) => (
            <ChoiceButton
              key={o.id}
              label={o.label}
              fill={o.fill}
              onPress={(rt) => respond(rt, o.id)}
              onsetAt={onsetAt}
            />
          ))}
        </View>
      ) : (
        // Only ever cue on a go trial. Prompting "TAP NOW" under a stop signal
        // instructs the wrong response and invalidates the no-go measurement.
        <Text style={s.hint}>{visible && current?.expected !== null ? 'TAP NOW' : ' '}</Text>
      )}
    </View>
  );

  return (
    <View style={s.root}>
      <TrialTicks total={trials.length} done={index} />
      {options ? body : <GestureDetector gesture={tap}>{body}</GestureDetector>}
      <View
        style={[
          s.flash,
          flash === 'hit' && { backgroundColor: color.stimStop },
          flash === 'miss' && { backgroundColor: '#E1483C' },
        ]}
      />
    </View>
  );
}

function ChoiceButton({
  label,
  fill,
  onPress,
  onsetAt,
}: {
  label: string;
  fill?: string;
  onPress: (rtMs: number) => void;
  onsetAt: { value: number };
}) {
  const tap = Gesture.Tap()
    .maxDuration(10_000)
    .onBegin(() => {
      'worklet';
      if (onsetAt.value === 0) return;
      runOnJS(onPress)(performance.now() - onsetAt.value);
    });

  return (
    <GestureDetector gesture={tap}>
      <View style={[s.choice, fill ? { backgroundColor: fill, borderColor: fill } : null]}>
        <Text style={[s.choiceLabel, fill ? { color: color.focus } : null]}>{label}</Text>
      </View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  stimWrap: { height: 190, alignItems: 'center', justifyContent: 'center' },
  rule: { fontFamily: font.mono, fontSize: 11.5, letterSpacing: 1, color: color.focusInk2 },
  hint: { fontFamily: font.mono, fontSize: 11.5, letterSpacing: 1, color: color.focusInk2, height: 16 },
  options: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  choice: {
    minWidth: 96,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.focusLine,
    backgroundColor: color.focus2,
    alignItems: 'center',
  },
  choiceLabel: { fontFamily: font.sansSemi, fontSize: 16, color: color.focusInk },
  flash: { height: 3, borderRadius: 2, backgroundColor: 'transparent', marginBottom: 4 },
});
