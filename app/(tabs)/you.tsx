import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { Card, SettingRow } from '../../src/components/Card';
import { color, font } from '../../src/theme/tokens';
import { type } from '../../src/theme/type';
import { restorePurchases } from '../../src/lib/purchases';
import { useSession } from '../../src/store/session';

export default function You() {
  const router = useRouter();
  const { name, age, streak, premium, userId, signOut, refreshPremium } = useSession();

  const rows: { label: string; value: string; onPress?: () => void }[] = [
    { label: 'Daily reminder', value: '08:15' },
    { label: 'Sound', value: 'ON' },
    { label: 'Reduced motion', value: 'SYSTEM' },
    { label: 'Text size', value: 'SYSTEM' },
    { label: 'Data', value: 'EXPORT' },
    {
      label: 'Restore purchases',
      value: '',
      onPress: async () => {
        try {
          await restorePurchases();
          await refreshPremium();
          Alert.alert('Restored', 'Any active subscription is back on this device.');
        } catch {
          Alert.alert('Nothing to restore', 'We couldn’t find a purchase on this Apple ID.');
        }
      },
    },
  ];

  return (
    <Screen scroll>
      <Text style={[type.heading, { paddingTop: 8 }]}>You</Text>

      <Card style={{ marginTop: 12 }}>
        <View style={s.profile}>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={type.subhead}>{name}</Text>
            <Text style={[type.small, { marginTop: 2 }]}>
              {age} · {premium ? 'premium' : 'free plan'} · {streak} day streak
            </Text>
          </View>
        </View>
        {!premium ? (
          <Button label="Try Premium free for 7 days" style={{ marginTop: 15, paddingVertical: 13 }} onPress={() => router.push('/paywall')} />
        ) : null}
      </Card>

      <Card style={{ marginTop: 12, paddingVertical: 4, paddingHorizontal: 18 }}>
        {rows.map((r, i) => (
          <SettingRow key={r.label} {...r} last={i === rows.length - 1} />
        ))}
      </Card>

      <Card
        style={{ marginTop: 12, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        onPress={() => router.push('/science')}>
        <Text style={type.label}>The science, honestly</Text>
        <Text style={{ color: color.ink3 }}>→</Text>
      </Card>

      {userId ? (
        <Button
          label="Sign out"
          variant="quiet"
          onPress={() => {
            void signOut();
            router.replace('/');
          }}
        />
      ) : null}

      <Text style={[type.small, { marginTop: 8, marginBottom: 6 }]}>
        Export or delete everything under Data. No exit interview.
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: color.paper,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: { fontFamily: font.sansSemi, fontSize: 17, color: color.ink },
});
