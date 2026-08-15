import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Eyebrow } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { color, font, skill } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { CHECK_ORDER, GAMES } from '../src/data/games';
import { useSession } from '../src/store/session';

export default function CheckIntro() {
  const router = useRouter();
  const startCheck = useSession((s) => s.startCheck);

  const begin = () => {
    startCheck();
    router.push('/check/0');
  };

  return (
    <Screen
      footer={
        <View>
          <Text style={[type.small, { marginBottom: 14 }]}>
            Mind Age compares your play to other Mindspan players in different age groups. It's a fitness score,
            not a medical measurement.
          </Text>
          <Button label="Start the check" onPress={begin} />
        </View>
      }>
      <View style={{ paddingTop: 8 }}>
        <Eyebrow>FIRST CHECK</Eyebrow>
      </View>
      <Text style={[type.title, { marginTop: 10, fontSize: 30 }]}>About twelve minutes{'\n'}for the full{'\n'}profile.</Text>
      <Text style={[type.body, { marginTop: 12, fontSize: 15.5 }]}>
        Thirteen short tasks. The screen goes dark so nothing competes with them. Do it somewhere you won't be
        interrupted — that's most of it.
      </Text>

      <Card style={{ marginTop: 20, paddingVertical: 6, paddingHorizontal: 16 }}>
        {CHECK_ORDER.map((id, i) => {
          const g = GAMES[id];
          return (
            <View key={id} style={[s.row, i === CHECK_ORDER.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[s.key, { backgroundColor: skill[g.skill].fill }]} />
              <Text style={[type.label, { flex: 1 }]}>{g.name}</Text>
              <Text style={s.dur}>{g.durationSec}s</Text>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  key: { width: 5, height: 20, borderRadius: 3 },
  dur: { fontFamily: font.mono, fontSize: 11, color: color.ink3 },
});
