import { SkillKey } from '../theme/tokens';

export type EngineId = 'A' | 'B' | 'C';
export type GameId =
  | 'peripheral-pulse'
  | 'signal-stop'
  | 'color-clash'
  | 'switchboard'
  | 'memory-ladder'
  | 'pattern-path'
  | 'spatial-sequence'
  | 'name-face'
  | 'target-hunt'
  | 'mind-rotate'
  | 'word-vault'
  | 'word-connections'
  | 'plan-ahead'
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
  'peripheral-pulse': {
    id: 'peripheral-pulse', name: 'Peripheral Pulse', skill: 'processing', engine: 'A',
    paradigm: 'DIVIDED ATTENTION',
    measures: 'Targets move beyond the centre. Measures visual processing speed across locations.',
    brief: 'Keep your eyes near the middle and tap as soon as the amber target appears. It can arrive anywhere.',
    durationSec: 45,
  },
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
    skill: 'memory',
    engine: 'C',
    paradigm: 'CORSI BLOCKS',
    measures: 'Spatial sequences, repeated in order. Measures visuospatial short-term recall.',
    brief: 'Tiles light up one at a time. Tap them back in the same order.',
    durationSec: 40,
  },
  'spatial-sequence': {
    id: 'spatial-sequence', name: 'Spatial Sequence', skill: 'memory', engine: 'C',
    paradigm: 'CORSI BLOCKS',
    measures: 'Recreate a changing path through space. Measures visuospatial working memory.',
    brief: 'Tiles light up one at a time. Tap them back in the same order. The path grows when you get it right.',
    durationSec: 45,
  },
  'name-face': {
    id: 'name-face', name: 'Name & Face', skill: 'recall', engine: 'B',
    paradigm: 'ASSOCIATIVE MEMORY',
    measures: 'Bind a fictional face to a name, then retrieve the association.',
    brief: 'Meet four fictional people. Their names disappear, then you match each face back to the right one.',
    durationSec: 55,
  },
  'target-hunt': {
    id: 'target-hunt', name: 'Target Hunt', skill: 'processing', engine: 'B',
    paradigm: 'VISUAL SEARCH',
    measures: 'Find one target among similar distractors. Measures selective attention and search speed.',
    brief: 'Find the odd arrow in each field. Accuracy first—random tapping only makes the result worse.',
    durationSec: 45,
  },
  'mind-rotate': {
    id: 'mind-rotate', name: 'Mind Rotate', skill: 'reasoning', engine: 'B',
    paradigm: 'MENTAL ROTATION',
    measures: 'Judge rotated and mirrored forms. Measures visuospatial reasoning.',
    brief: 'Decide whether the second symbol is the same form rotated or a mirrored version.',
    durationSec: 50,
  },
  'word-vault': {
    id: 'word-vault', name: 'Word Vault', skill: 'recall', engine: 'B',
    paradigm: 'VERBAL LEARNING',
    measures: 'Encode unrelated words and recognize them after interference.',
    brief: 'Study the word list. After a short distraction, pick out only the words you actually saw.',
    durationSec: 60,
  },
  'word-connections': {
    id: 'word-connections', name: 'Word Connections', skill: 'words', engine: 'B',
    paradigm: 'SEMANTIC RELATIONSHIPS',
    measures: 'Choose the closest semantic relationship without relying on trivia.',
    brief: 'Choose the word most closely connected to the prompt. The alternatives get progressively closer.',
    durationSec: 45,
  },
  'plan-ahead': {
    id: 'plan-ahead', name: 'Plan Ahead', skill: 'reasoning', engine: 'B',
    paradigm: 'EXECUTIVE PLANNING',
    measures: 'Transform a start state into a goal efficiently. Measures planning depth and rule control.',
    brief: 'Reorder the tiles to match the goal. Only neighbouring tiles can swap, so think before the first move.',
    durationSec: 55,
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

export const CORE_GAME_IDS: GameId[] = [
  'peripheral-pulse', 'memory-ladder', 'signal-stop', 'word-rescue', 'sequence-detective',
  'switchboard', 'name-face', 'spatial-sequence', 'target-hunt', 'mind-rotate',
  'word-vault', 'word-connections', 'plan-ahead',
];

export const GAME_LIST = CORE_GAME_IDS.map((id) => GAMES[id]);

export type AssessmentStep = {
  gameId: GameId;
  phase?: 'immediate' | 'delayed';
};

/** Memory encoding happens early; delayed retrieval follows several unrelated tasks. */
export const CHECK_ORDER: AssessmentStep[] = [
  { gameId: 'peripheral-pulse' },
  { gameId: 'name-face', phase: 'immediate' },
  { gameId: 'signal-stop' },
  { gameId: 'memory-ladder' },
  { gameId: 'word-vault', phase: 'immediate' },
  { gameId: 'sequence-detective' },
  { gameId: 'switchboard' },
  { gameId: 'spatial-sequence' },
  { gameId: 'target-hunt' },
  { gameId: 'mind-rotate' },
  { gameId: 'word-rescue' },
  { gameId: 'word-connections' },
  { gameId: 'plan-ahead' },
  { gameId: 'name-face', phase: 'delayed' },
  { gameId: 'word-vault', phase: 'delayed' },
];
