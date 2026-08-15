import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Eyebrow } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { CountUp } from '../src/components/Numeral';
import { color, font, skill } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import {
  scoreSkills,
  mindAge,
  rollingMindAge,
  verdict,
  weakestSkill,
  strongestSkill,
  meanRt,
} from '../src/lib/scoring';
import { useSession } from '../src/store/session';

export default function Result() {
  const router = useRouter();
  const pending = useSession((s) => s.pending);
  const age = useSession((s) => s.age);
  const checks = useSession((s) => s.checks);
  const commitCheck = useSession((s) => s.commitCheck);
  const [saved, setSaved] = useState(false);

  /**
   * Scored once, on mount. Committing the check clears `pending`, so deriving
   * this from live store state would recompute against an empty array and
   * collapse the number to the clamped floor moments after the reveal.
   */
  const [{ skills, mind, rolling, rt, strong, weak }] = useState(() => {
    const previous = useSession.getState().checks;
    const results = useSession.getState().pending;
    // Falling back to the last saved check keeps a revisit from showing nonsense.
    const sk = results.length ? scoreSkills(results) : (previous[previous.length - 1]?.skills ?? {});
    const raw = results.length ? mindAge(sk) : (previous[previous.length - 1]?.mindAge ?? 0);
    const history = results.length ? [...previous.map((c) => c.mindAge), raw] : previous.map((c) => c.mindAge);
    return {
      skills: sk,
      mind: raw,
      rolling: rollingMindAge(history) ?? raw,
      rt: results.length
        ? meanRt(results.flatMap((p) => p.trials))
        : (previous[previous.length - 1]?.meanRtMs ?? null),
      strong: strongestSkill(sk),
      weak: weakestSkill(sk),
    };
  });

  useEffect(() => {
    if (saved || !pending.length) return;
    setSaved(true);
    void commitCheck({
      id: String(Date.now()),
      takenAt: new Date().toISOString(),
      mindAge: mind,
      skills,
      meanRtMs: rt,
    });
  }, [saved, pending.length, commitCheck, mind, skills, rt]);

  return (
    <Screen
      scroll
      footer={
        <View>
          <Button label="See the breakdown" onPress={() => router.push('/result-skills')} />
          <Button label="Share this" variant="quiet" onPress={() => router.push('/share')} />
        </View>
      }>
      <View style={{ paddingTop: 8 }}>
        <Eyebrow>
          CHECK COMPLETE ·{' '}
          {new Date()
            .toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
            .toUpperCase()}
        </Eyebrow>
      </View>

      <Card style={{ marginTop: 14, paddingVertical: 26, alignItems: 'center' }}>
        <Text style={s.cardLabel}>Your Mind Age</Text>
        <CountUp value={rolling} size={88} style={{ marginTop: 6 }} />
        <Text style={s.verdict}>{verdict(rolling, age)}</Text>
      </Card>

      <Card style={{ marginTop: 12, paddingVertical: 16 }}>
        <View style={s.betweenRow}>
          <Text style={s.smallLabel}>Where you sit</Text>
          <Text style={s.mono}>30 — 65</Text>
        </View>
        <Scale mind={rolling} actual={age} />
      </Card>

      <Text style={[type.body, { marginTop: 14 }]}>
        {strong ? `${skill[strong].label} carried you.` : 'A steady run.'}{' '}
        {weak ? `${skill[weak].label} let you down — you knew it at the time.` : ''}
      </Text>
    </Screen>
  );
}

/** Positions on a fixed 30–65 track, which is the range the copy quotes. */
function Scale({ mind, actual }: { mind: number; actual: number }) {
  const pos = (v: number): `${number}%` =>
    `${Math.max(0, Math.min(100, ((v - 30) / 35) * 100))}%`;
  return (
    <View style={s.scale}>
      <View style={s.scaleTrack} />
      <View style={[s.scaleTick, { left: pos(mind), backgroundColor: skill.focus.fill }]} />
      <View style={[s.scaleTick, { left: pos(actual), backgroundColor: color.ink3 }]} />
      <Text style={[s.scaleCap, { left: pos(mind), color: skill.focus.text }]}>mind {mind}</Text>
      <Text style={[s.scaleCap, { left: pos(actual) }]}>you {actual}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  cardLabel: { fontFamily: font.sansMedium, fontSize: 13.5, color: color.ink2 },
  verdict: { fontFamily: font.sans, fontSize: 16, color: color.ink2, marginTop: 10 },
  betweenRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  smallLabel: { fontFamily: font.sansMedium, fontSize: 12.5, color: color.ink2 },
  mono: { fontFamily: font.mono, fontSize: 11, color: color.ink3 },
  scale: { height: 34, marginTop: 12 },
  scaleTrack: { position: 'absolute', top: 11, left: 0, right: 0, height: 3, borderRadius: 2, backgroundColor: color.line },
  scaleTick: { position: 'absolute', top: 5, width: 3, height: 15, borderRadius: 2 },
  scaleCap: { position: 'absolute', top: 22, fontFamily: font.mono, fontSize: 9.5, color: color.ink3, marginLeft: -14 },
});
