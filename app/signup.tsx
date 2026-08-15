import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';

import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { StepDots } from '../src/components/Numeral';
import { BackLink } from '../src/components/BackLink';
import { color } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { supabase } from '../src/lib/supabase';
import { useSession } from '../src/store/session';

export default function Signup() {
  const router = useRouter();
  const setUser = useSession((s) => s.setUser);
  const [busy, setBusy] = useState(false);
  const [appleReady, setAppleReady] = useState(false);

  // Sign in with Apple needs a development build; hide it where it can't work.
  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAppleReady)
      .catch(() => setAppleReady(false));
  }, []);

  const withApple = async () => {
    if (!supabase) {
      router.push('/age');
      return;
    }
    setBusy(true);
    try {
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
      });
      if (!cred.identityToken) throw new Error('Apple did not return an identity token.');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: cred.identityToken,
      });
      if (error) throw error;
      setUser(data.user?.id ?? null);
      router.push('/age');
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (err.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert("That didn't work", err.message ?? 'Try again, or skip for now.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <BackLink onPress={() => router.back()} />
      <StepDots total={3} index={0} />

      <Text style={[type.title, { marginTop: 26 }]}>Somewhere to keep{'\n'}your numbers.</Text>
      <Text style={[type.body, { marginTop: 10 }]}>
        One account so your Mind Age survives a new phone. No feed, no friends list, no email from us on a Tuesday.
      </Text>

      <View style={{ gap: 10, marginTop: 26 }}>
        {Platform.OS === 'ios' && appleReady ? (
          <Button label="Continue with Apple" onPress={withApple} disabled={busy} />
        ) : null}
        <Button label="Continue with email" variant="secondary" onPress={() => router.push('/email')} />
      </View>

      <View style={s.orRow}>
        <View style={s.rule} />
        <Text style={s.or}>OR</Text>
        <View style={s.rule} />
      </View>

      <Text accessibilityRole="button" style={s.skip} onPress={() => router.push('/age')}>
        Skip for now — I'll do this later
      </Text>

      <View style={{ flex: 1 }} />
      <Text style={[type.small, { marginBottom: 6 }]}>
        By continuing you agree to the terms. Your scores are yours; we don't sell them, and you can export or
        delete everything from You → Data.
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 22 },
  rule: { flex: 1, height: 1, backgroundColor: color.line },
  or: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10.5, color: color.ink3 },
  skip: { fontFamily: 'InstrumentSans_500Medium', fontSize: 14, color: color.ink2 },
});
