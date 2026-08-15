import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { color } from '../src/theme/tokens';
import { type } from '../src/theme/type';

export default function Offline() {
  const router = useRouter();

  return (
    <Screen
      footer={
        <View style={{ gap: 9 }}>
          <Button label="Play offline" onPress={() => router.replace('/(tabs)/play')} />
          <Button label="Try again" variant="secondary" onPress={() => router.back()} />
        </View>
      }>
      <View style={s.middle}>
        <View style={s.icon} />
        <View>
          <Text style={[type.title, { fontSize: 26 }]}>No connection,{'\n'}so no check.</Text>
          <Text style={[type.body, { marginTop: 10 }]}>
            A Mind Age check needs to reach the scorer, and it won't half-save. Your daily games work offline — go
            do those instead.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  middle: { flex: 1, justifyContent: 'center', gap: 16 },
  icon: { width: 34, height: 34, borderRadius: 10, backgroundColor: color.paper, borderWidth: 1.5, borderColor: color.line },
});
