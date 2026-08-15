import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { color, radius, font } from '../theme/tokens';
import { type } from '../theme/type';

export function Card({
  children,
  style,
  dark = false,
  dashed = false,
  onPress,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
  dashed?: boolean;
  onPress?: () => void;
}) {
  const body = (
    <View
      style={[
        s.card,
        dark && { backgroundColor: color.focus, borderColor: color.focus },
        dashed && { borderStyle: 'dashed' },
        style,
      ]}>
      {children}
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {body}
    </Pressable>
  ) : (
    body
  );
}

/** Domain chip: white ground, hairline border, coloured dot and label. */
export function Chip({ label, fill, text }: { label: string; fill: string; text: string }) {
  return (
    <View style={s.chip}>
      <View style={[s.chipDot, { backgroundColor: fill }]} />
      <Text style={[s.chipLabel, { color: text }]}>{label}</Text>
    </View>
  );
}

/** Domain row: key bar, name, track, value. */
export function DomainRow({
  name,
  fill,
  pct,
  value,
  last = false,
}: {
  name: string;
  fill: string;
  pct: number;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[s.row, last && { borderBottomWidth: 0 }]}>
      <View style={[s.rowKey, { backgroundColor: fill }]} />
      <Text style={[type.label, { flex: 1 }]}>{name}</Text>
      <View style={s.track}>
        <View style={[s.trackFill, { width: `${Math.max(0, Math.min(100, pct))}%`, backgroundColor: fill }]} />
      </View>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

/** Settings row: label left, mono value right, optional tap target. */
export function SettingRow({
  label,
  value,
  onPress,
  last = false,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
}) {
  const body = (
    <View style={[s.settingRow, last && { borderBottomWidth: 0 }]}>
      <Text style={[type.label, { flex: 1 }]}>{label}</Text>
      <Text style={s.settingValue}>{value}</Text>
    </View>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {body}
    </Pressable>
  ) : (
    body
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: color.card, borderWidth: 1, borderColor: color.line, borderRadius: radius.md, padding: 18 },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  settingValue: { fontFamily: font.mono, fontSize: 11.5, color: color.ink3 },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: color.card,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 10,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipLabel: { fontFamily: font.sansMedium, fontSize: 11.5 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  rowKey: { width: 5, height: 22, borderRadius: 3 },
  track: { flexBasis: 70, height: 5, borderRadius: 3, backgroundColor: color.line, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 3 },
  rowValue: {
    fontFamily: font.mono,
    fontSize: 12.5,
    color: color.ink2,
    width: 30,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
