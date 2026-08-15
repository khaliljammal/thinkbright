import { SkillKey } from '../theme/tokens';

export type EngineId = 'A' | 'B' | 'C';
export type GameId =
  | 'signal-stop'
  | 'color-clash'
  | 'switchboard'
  | 'memory-ladder'
  | 'pattern-path'
  | 'word-rescue'
  | 'sequence-detective';

export type Game = {
  id: GameId;
  name: string;
  skill: SkillKey;
  engine: EngineId;
  paradigm: string;
  /** One plain sentence for the science page. */
  measures: string;
  /** Shown on the pre-game brief in focus mode. */
  brief: string;
  durationSec: number;
};

export const GAMES: Record<GameId, Game> = {
  'signal-stop': {
    id: 'signal-stop',
    name: 'Signal Stop',
    skill: 'focus',
    engine: 'A',
    paradigm: 'GO / NO-GO',
    measures: 'Respond fast, withhold faster. Measures sustained attention and response inhibition.',
    brief: "Tap the circle the instant you see it. When a square appears, don't tap. That's the whole game, and it's harder than it sounds.",
    durationSec: 45,
  },
  'color-clash': {
    id: 'color-clash',
    name: 'Color Clash',
    skill: 'focus',
    engine: 'A',
    paradigm: 'STROOP',
    measures: 'The word fights the ink. Measures how well you suppress the obvious answer.',
    brief: 'Go with the colour of the ink, not the word. Your eyes will read the word anyway. Ignore them.',
    durationSec: 45,
  },
  switchboard: {
    id: 'switchboard',
    name: 'Switchboard',
    skill: 'flexibility',
    engine: 'A',
    paradigm: 'TASK SWITCHING',
    measures: 'The sorting rule changes mid-round. Measures the cost of changing your mind.',
    brief: 'Sort by the rule at the top. It will change without warning, and you will keep using the old one for a beat.',
    durationSec: 40,
  },
  'memory-ladder': {
    id: 'memory-ladder',
    name: 'Memory Ladder',
    skill: 'memory',
    engine: 'C',
    paradigm: 'DIGIT SPAN',
    measures: 'Hold a sequence, hand it back backwards. Measures working memory capacity.',
    brief: 'Watch the digits, then tap them back in reverse. It gets one longer every time you get it right.',
    durationSec: 50,
  },
  'pattern-path': {
    id: 'pattern-path',
    name: 'Pattern Path',
    skill: 'recall',
    engine: 'C',
    paradigm: 'CORSI BLOCKS',
    measures: 'Spatial sequences, repeated in order. Measures visuospatial short-term recall.',
    brief: 'Tiles light up one at a time. Tap them back in the same order.',
    durationSec: 40,
  },
  'word-rescue': {
    id: 'word-rescue',
    name: 'Word Rescue',
    skill: 'words',
    engine: 'B',
    paradigm: 'VERBAL FLUENCY',
    measures: 'The word is in there somewhere. Measures semantic retrieval under time pressure.',
    brief: 'A clue, four words, one of them exact. The clock is the whole difficulty.',
    durationSec: 45,
  },
  'sequence-detective': {
    id: 'sequence-detective',
    name: 'Sequence Detective',
    skill: 'reasoning',
    engine: 'B',
    paradigm: 'MATRIX REASONING',
    measures: 'Find the rule, apply the rule. Measures inductive reasoning.',
    brief: 'Work out what the sequence is doing, then pick what comes next.',
    durationSec: 50,
  },
};

export const GAME_LIST = Object.values(GAMES);

/** The six tasks of a Mind Age check, one per scored skill. */
export const CHECK_ORDER: GameId[] = [
  'signal-stop',
  'memory-ladder',
  'pattern-path',
  'word-rescue',
  'sequence-detective',
  'switchboard',
];
