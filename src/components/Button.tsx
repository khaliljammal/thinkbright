import React from 'react';
import { Pressable, Text, ViewStyle, StyleSheet, AccessibilityRole } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, radius, motion } from '../theme/tokens';
import { type } from '../theme/type';

type Variant = 'primary' | 'secondary' | 'quiet' | 'onDark' | 'onDarkOutline';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
  accessibilityRole = 'button',
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityRole?: AccessibilityRole;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={() => (scale.value = withTiming(motion.tapScale, { duration: motion.tapMs }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: motion.tapMs }))}
      onPress={onPress}
      style={[s.base, s[variant], anim, disabled && s.disabled, style]}>
      <Text style={[type.button, s[`${variant}Text`]]}>{label}</Text>
    </AnimatedPressable>
  );
}

const s = StyleSheet.create({
  base: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  disabled: { opacity: 0.4 },

  primary: { backgroundColor: color.ink },
  primaryText: { color: color.card },

  secondary: { backgroundColor: color.card, borderWidth: 1, borderColor: color.line },
  secondaryText: { color: color.ink },

  quiet: { backgroundColor: 'transparent', paddingVertical: 12 },
  quietText: { color: color.ink2, fontFamily: 'InstrumentSans_500Medium', fontSize: 14 },

  onDark: { backgroundColor: color.focusInk },
  onDarkText: { color: color.ink },

  onDarkOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.focusLine },
  onDarkOutlineText: { color: color.focusInk },
});
