import React, { useEffect, useState } from 'react';
import { Text, TextStyle, AccessibilityInfo, View, StyleSheet } from 'react-native';
import { color, motion, font } from '../theme/tokens';
import { type } from '../theme/type';

/** Scores count up in 680ms, unless the user has asked for reduced motion. */
export function CountUp({ value, size, style }: { value: number; size: number; style?: TextStyle }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return;
      if (reduced) {
        setShown(value);
        return;
      }
      const start = Date.now();
      const step = () => {
        const p = Math.min(1, (Date.now() - start) / motion.countUpMs);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(Math.round(value * eased));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <Text
      accessibilityLabel={String(value)}
      style={[type.numeral, { fontSize: size, lineHeight: size * 0.98, letterSpacing: -size * 0.055 }, style]}>
      {shown}
    </Text>
  );
}

/** Trial progress ticks — amber for done, focus-line for pending. */
export function TrialTicks({ total, done }: { total: number; done: number }) {
  return (
    <View style={s.ticks}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[s.tick, { backgroundColor: i < done ? color.stim : color.focusLine }]} />
      ))}
    </View>
  );
}

/** Onboarding step dots. */
export function StepDots({ total, index }: { total: number; index: number }) {
  return (
    <View style={s.steps}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[s.step, { backgroundColor: i <= index ? color.ink : color.line }]} />
      ))}
    </View>
  );
}

export function Mono({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontFamily: font.mono, fontSize: 11, color: color.ink3 }, style]}>{children}</Text>;
}

const s = StyleSheet.create({
  ticks: { flexDirection: 'row', gap: 3 },
  tick: { flex: 1, height: 3, borderRadius: 2 },
  steps: { flexDirection: 'row', gap: 5 },
  step: { flex: 1, height: 3, borderRadius: 2 },
});
