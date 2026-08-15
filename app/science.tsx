import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Card } from '../src/components/Card';
import { BackLink } from '../src/components/BackLink';
import { color, font, skill } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { GAME_LIST } from '../src/data/games';

export default function Science() {
  const router = useRouter();

  return (
    <Screen scroll>
      <BackLink onPress={() => router.back()} />
      <Text style={[type.title, { marginTop: 12, fontSize: 27 }]}>What we can and{'\n'}can't claim.</Text>

      <Card dark style={{ marginTop: 14 }}>
        <Text style={s.leadDark}>
          Practising a skill reliably improves that skill. Whether it carries over into everyday life is less
          certain. We're not going to pretend otherwise.
        </Text>
      </Card>

      <Text style={[type.body, { marginTop: 16, fontSize: 14.5, lineHeight: 22 }]}>
        Every game here is built on a task researchers have used for decades. That's the honest version of
        "scientifically designed" — the paradigm is real, the transfer claim isn't ours to make.
      </Text>

      <Card style={{ marginTop: 14, paddingVertical: 4, paddingHorizontal: 18 }}>
        {GAME_LIST.map((g, i) => (
          <View key={g.id} style={[s.row, i === GAME_LIST.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={s.rowHead}>
              <View style={[s.key, { backgroundColor: skill[g.skill].fill }]} />
              <Text style={[type.subhead, { flex: 1, fontSize: 14.5 }]}>{g.name}</Text>
              <Text style={s.paradigm}>{g.paradigm}</Text>
            </View>
            <Text style={s.desc}>{g.measures}</Text>
          </View>
        ))}
      </Card>

      <Text style={[type.small, { marginTop: 14, marginBottom: 6 }]}>
        Mindspan is not a medical device and doesn't diagnose anything. If you're worried about your memory,
        that's a conversation for a doctor, not an app.
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  leadDark: { fontFamily: font.sans, fontSize: 15.5, lineHeight: 23, color: color.focusInk },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: color.lineSoft },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  key: { width: 5, height: 18, borderRadius: 3 },
  paradigm: { fontFamily: font.mono, fontSize: 10, color: color.ink3 },
  desc: { fontFamily: font.sans, fontSize: 13.5, lineHeight: 20, color: color.ink2, marginTop: 7, marginLeft: 15 },
});
