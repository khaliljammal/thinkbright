import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { BackLink } from '../src/components/BackLink';
import { color, font, radius } from '../src/theme/tokens';
import { type } from '../src/theme/type';
import { supabase } from '../src/lib/supabase';

/** Magic link keeps passwords out of the product entirely. */
export default function Email() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!supabase) {
      router.push('/age');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: 'mindspan://auth' },
      });
      if (error) throw error;
      setSent(true);
    } catch (e) {
      Alert.alert("Couldn't send that", (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen
      footer={
        sent ? (
          <Button label="I've tapped the link" onPress={() => router.push('/age')} />
        ) : (
          <Button
            label={busy ? 'Sending…' : 'Send me a link'}
            disabled={busy || !email.includes('@')}
            onPress={send}
          />
        )
      }>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <BackLink onPress={() => router.back()} />
        <Text style={[type.title, { marginTop: 20 }]}>
          {sent ? 'Check your inbox.' : 'What email\nshould we use?'}
        </Text>
        <Text style={[type.body, { marginTop: 10 }]}>
          {sent
            ? `We sent a link to ${email.trim()}. Tap it and you're in — no password to forget.`
            : "We'll send a link instead of making you invent another password."}
        </Text>

        {!sent ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={color.ink3}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            style={s.input}
          />
        ) : null}
        <View style={{ flex: 1 }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const s = StyleSheet.create({
  input: {
    marginTop: 22,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontFamily: font.sans,
    fontSize: 16,
    color: color.ink,
  },
});
