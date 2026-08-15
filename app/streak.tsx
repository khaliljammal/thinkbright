import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { color, font } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { useSession } from '../src/store/session';

/**
 * Everyone gets one automatic recovery a week. No gems, nothing to buy —
 * the PRD rules out guilt mechanics.
 */
export default function StreakRecovery() {
  const router = useRouter();
  const streak = useSession((s) => s.streak);

  return (
    <Screen footer={<Button label="Fair enough" onPress={() => router.back()} />}>
      <View style={s.middle}>
        <View style={s.blocks}>
          {[true, true, false, true, true].map((filled, i) => (
            <View key={i} style={[s.block, filled ? s.blockOn : s.blockGap]} />
          ))}
        </View>

        <View>
          <Text style={[type.title, { fontSize: 28 }]}>You missed{'\n'}a day.</Text>
          <Text style={[type.body, { marginTop: 10, fontSize: 15.5 }]}>
            So we filled it in. Everyone gets one of these a week, automatically. No guilt, no gems, nothing to
            buy.
          </Text>
        </View>

        <Card style={{ paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={type.label}>Streak restored</Text>
          <Text style={s.count}>{streak} DAYS</Text>
        </Card>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  middle: { flex: 1, justifyContent: 'center', gap: 20 },
  blocks: { flexDirection: 'row', gap: 5 },
  block: { flex: 1, height: 38, borderRadius: 8 },
  blockOn: { backgroundColor: color.ink },
  blockGap: { backgroundColor: color.paper, borderWidth: 1.5, borderColor: color.line, borderStyle: 'dashed' },
  count: { fontFamily: font.mono, fontSize: 13, color: color.ink },
});
