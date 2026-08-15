import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { StepDots } from '../src/components/Numeral';
import { BackLink } from '../src/components/BackLink';
import { color, font, skill } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { useSession } from '../src/store/session';

const CONCERNS = [
  { id: 'names', label: 'Names go missing', tag: 'RECALL', key: 'recall' },
  { id: 'word', label: 'The word is right there', tag: 'WORDS', key: 'words' },
  { id: 'room', label: 'Why did I come in here', tag: 'MEMORY', key: 'memory' },
  { id: 'focus', label: "Can't sit with one thing", tag: 'FOCUS', key: 'focus' },
  { id: 'slow', label: 'Slower to switch gears', tag: 'FLEXIBILITY', key: 'flexibility' },
] as const;

export default function Slipping() {
  const router = useRouter();
  const concerns = useSession((s) => s.concerns);
  const toggle = useSession((s) => s.toggleConcern);

  return (
    <Screen
      footer={
        <View style={{ gap: 0 }}>
          <Button label="Continue" onPress={() => router.push('/check-intro')} />
          <Button
            label="None of these, I'm just curious"
            variant="quiet"
            onPress={() => router.push('/check-intro')}
          />
        </View>
      }>
      <BackLink onPress={() => router.back()} />
      <StepDots total={3} index={2} />

      <Text style={[type.title, { marginTop: 26 }]}>What's been{'\n'}annoying you?</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        Pick any that ring true. It shapes which games show up first — nothing else.
      </Text>

      <View style={{ gap: 9, marginTop: 22 }}>
        {CONCERNS.map((c) => {
          const on = concerns.includes(c.id);
          return (
            <Pressable
              key={c.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => toggle(c.id)}
              style={[s.option, on && s.optionOn]}>
              <View style={[s.dot, { backgroundColor: skill[c.key].fill }]} />
              <Text style={[type.label, { flex: 1, fontSize: 15 }]}>{c.label}</Text>
              <Text style={s.tag}>{c.tag}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: color.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: color.line,
  },
  optionOn: { borderWidth: 1.5, borderColor: color.ink },
  dot: { width: 9, height: 9, borderRadius: 5 },
  tag: { fontFamily: font.mono, fontSize: 10.5, color: color.ink3 },
});
