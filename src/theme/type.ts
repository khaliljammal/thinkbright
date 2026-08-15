import { TextStyle } from 'react-native';
import { color, font } from './tokens';

const t = (s: TextStyle) => s;

export const type = {
  display: t({ fontFamily: font.sansSemi, fontSize: 40, letterSpacing: -1.7, lineHeight: 42, color: color.ink }),
  title: t({ fontFamily: font.sansSemi, fontSize: 28, letterSpacing: -1, lineHeight: 31, color: color.ink }),
  heading: t({ fontFamily: font.sansSemi, fontSize: 21, letterSpacing: -0.63, lineHeight: 24, color: color.ink }),
  subhead: t({ fontFamily: font.sansSemi, fontSize: 16, letterSpacing: -0.32, color: color.ink }),
  body: t({ fontFamily: font.sans, fontSize: 15, lineHeight: 22.5, color: color.ink2 }),
  bodyLg: t({ fontFamily: font.sans, fontSize: 16.5, lineHeight: 25, color: color.ink2 }),
  small: t({ fontFamily: font.sans, fontSize: 12.5, lineHeight: 19, color: color.ink3 }),
  label: t({ fontFamily: font.sansMedium, fontSize: 14.5, color: color.ink }),
  button: t({ fontFamily: font.sansSemi, fontSize: 15, color: color.card }),

  mono: t({ fontFamily: font.mono, fontSize: 11.5, color: color.ink3 }),
  monoSm: t({ fontFamily: font.mono, fontSize: 10.5, color: color.ink3, letterSpacing: 0.4 }),
  /** Big readouts. Always tabular so counting numbers don't jitter. */
  numeral: t({
    fontFamily: font.sansSemi,
    fontVariant: ['tabular-nums'],
    color: color.ink,
  }),
} as const;
