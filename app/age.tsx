import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { StepDots } from '../src/components/Numeral';
import { BackLink } from '../src/components/BackLink';
import { Card } from '../src/components/Card';
import { color, radius, font } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { useSession } from '../src/store/session';

export default function Age() {
  const router = useRouter();
  const age = useSession((s) => s.age);
  const setAge = useSession((s) => s.setAge);

  return (
    <Screen footer={<Button label="Continue" onPress={() => router.push('/slipping')} />}>
      <BackLink onPress={() => router.back()} />
      <StepDots total={3} index={1} />

      <Text style={[type.title, { marginTop: 26 }]}>How old are you,{'\n'}actually?</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        Mind Age only means something next to a real one. This is the only personal thing we ask for.
      </Text>

      <Card style={{ marginTop: 24, padding: 20 }}>
        <View style={s.readout}>
          <Text style={s.number} accessibilityLabel={`${age} years old`}>
            {age}
          </Text>
          <Text style={s.unit}>years</Text>
        </View>
        <View style={s.stepper}>
          <Stepper label="−" onPress={() => setAge(age - 1)} accessibilityLabel="Decrease age" />
          <Stepper label="+" onPress={() => setAge(age + 1)} accessibilityLabel="Increase age" />
        </View>
      </Card>
    </Screen>
  );
}

function Stepper({
  label,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={s.step}>
      <Text style={s.stepLabel}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  readout: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8 },
  number: {
    fontFamily: font.sansSemi,
    fontSize: 56,
    letterSpacing: -2.8,
    lineHeight: 58,
    color: color.ink,
    fontVariant: ['tabular-nums'],
  },
  unit: { fontFamily: font.mono, fontSize: 12, color: color.ink3 },
  stepper: { flexDirection: 'row', gap: 8, marginTop: 18 },
  step: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.paper,
    borderRadius: radius.pill,
    paddingVertical: 11,
    alignItems: 'center',
  },
  stepLabel: { fontFamily: font.sansSemi, fontSize: 16, color: color.ink },
});
