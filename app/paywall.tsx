import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { PurchasesOffering } from '../src/lib/purchases';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { color, font } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { getOffering, purchasePackageId } from '../src/lib/purchases';
import { purchasesAvailable } from '../src/lib/purchases';
import { useSession } from '../src/store/session';

const PERKS = [
  'Unlimited workouts, not one a day',
  'A fresh Mind Age check whenever you want',
  'Every difficulty mode and game variant',
  'Your full history, not the last seven days',
  'A weekly recap and a plan aimed at your worst skill',
];

export default function Paywall() {
  const router = useRouter();
  const refreshPremium = useSession((s) => s.refreshPremium);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getOffering().then(setOffering).catch(() => setOffering(null));
  }, []);

  const priceFor = (id: 'annual' | 'monthly') => {
    const pkg = offering?.availablePackages.find((p) => p.packageType.toLowerCase() === id);
    return pkg?.product.priceString ?? (id === 'annual' ? '$59.99' : '$9.99');
  };

  const buy = async () => {
    if (!purchasesAvailable()) {
      Alert.alert(
        'Not wired up yet',
        'Purchases need a development build and a RevenueCat key. Everything else in the app works without one.',
      );
      return;
    }
    setBusy(true);
    try {
      const pkg = offering?.availablePackages.find((p) => p.packageType.toLowerCase() === plan);
      if (!pkg) throw new Error('That plan is not available right now.');
      await purchasePackageId(pkg.identifier);
      await refreshPremium();
      router.back();
    } catch (e) {
      const err = e as { userCancelled?: boolean; message?: string };
      if (!err.userCancelled) Alert.alert("That didn't go through", err.message ?? 'Try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      scroll
      footer={
        <View>
          <Button label={busy ? 'One moment…' : 'Start 7-day trial'} disabled={busy} onPress={buy} />
          <Text style={[type.small, { marginTop: 10, textAlign: 'center' }]}>
            We'll remind you two days before it converts. Founding lifetime $99 while the first 500 spots last.
          </Text>
        </View>
      }>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={s.close} hitSlop={10}>
        <Text style={s.closeLabel}>Close</Text>
      </Pressable>

      <Text style={[type.title, { marginTop: 6 }]}>Play as much{'\n'}as you like.</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        Your scores stay yours either way — we'd never charge you to look at your own numbers. Premium is about
        volume.
      </Text>

      <Card style={{ marginTop: 16, paddingVertical: 6, paddingHorizontal: 18 }}>
        {PERKS.map((p, i) => (
          <View key={p} style={[s.perk, i === PERKS.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={s.bullet} />
            <Text style={[type.label, { flex: 1, fontFamily: font.sans }]}>{p}</Text>
          </View>
        ))}
      </Card>

      <View style={s.plans}>
        <PlanCard
          title="Yearly"
          price={priceFor('annual')}
          note="BEST VALUE"
          sub="$5.00 / MO"
          selected={plan === 'annual'}
          onPress={() => setPlan('annual')}
        />
        <PlanCard
          title="Monthly"
          price={priceFor('monthly')}
          sub="CANCEL ANYTIME"
          selected={plan === 'monthly'}
          onPress={() => setPlan('monthly')}
        />
      </View>

      {!offering && purchasesAvailable() ? (
        <ActivityIndicator style={{ marginTop: 14 }} color={color.ink3} />
      ) : null}
    </Screen>
  );
}

function PlanCard({
  title,
  price,
  sub,
  note,
  selected,
  onPress,
}: {
  title: string;
  price: string;
  sub: string;
  note?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[s.plan, selected && s.planOn]}>
      {note ? (
        <View style={s.badge}>
          <Text style={s.badgeLabel}>{note}</Text>
        </View>
      ) : null}
      <Text style={s.planTitle}>{title}</Text>
      <Text style={s.planPrice}>{price}</Text>
      <Text style={s.planSub}>{sub}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  close: { alignSelf: 'flex-end', paddingTop: 6, paddingHorizontal: 4 },
  closeLabel: { fontFamily: font.sansMedium, fontSize: 14, color: color.ink3 },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  bullet: { width: 7, height: 7, borderRadius: 2, backgroundColor: color.ink },
  plans: { flexDirection: 'row', gap: 9, marginTop: 18 },
  plan: {
    flex: 1,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 14,
  },
  planOn: { borderWidth: 1.5, borderColor: color.ink },
  badge: {
    position: 'absolute',
    top: -9,
    left: 14,
    backgroundColor: color.ink,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeLabel: { fontFamily: font.mono, fontSize: 9.5, letterSpacing: 0.57, color: color.card },
  planTitle: { fontFamily: font.sansMedium, fontSize: 13, color: color.ink2 },
  planPrice: {
    fontFamily: font.sansSemi,
    fontSize: 24,
    letterSpacing: -0.84,
    color: color.ink,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  planSub: { fontFamily: font.mono, fontSize: 10.5, color: color.ink3, marginTop: 3 },
});
