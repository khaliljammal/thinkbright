import { Item } from '../engines/EngineB';

/**
 * Seed bank. Production items are generated offline by the Claude API into a
 * reviewed table (PRD §9) — never at runtime, never during a check.
 */
export const WORD_RESCUE_ITEMS: Item[] = [
  { id: 'w1', prompt: 'Stubbornly refusing to change your mind', options: ['Intransigent', 'Intermittent', 'Introspective', 'Intrepid'], answer: 'Intransigent', difficulty: 6 },
  { id: 'w2', prompt: 'A short, clever saying that states a truth', options: ['Aphorism', 'Allegory', 'Anecdote', 'Analogy'], answer: 'Aphorism', difficulty: 5 },
  { id: 'w3', prompt: 'Pleasantly old-fashioned in an odd way', options: ['Quaint', 'Quiescent', 'Querulous', 'Quixotic'], answer: 'Quaint', difficulty: 3 },
  { id: 'w4', prompt: 'To make something worse than it already was', options: ['Exacerbate', 'Extrapolate', 'Exonerate', 'Excavate'], answer: 'Exacerbate', difficulty: 4 },
  { id: 'w5', prompt: 'Lasting for a very short time', options: ['Ephemeral', 'Empirical', 'Emphatic', 'Endemic'], answer: 'Ephemeral', difficulty: 5 },
  { id: 'w6', prompt: 'Using very few words', options: ['Laconic', 'Languid', 'Lucid', 'Latent'], answer: 'Laconic', difficulty: 7 },
  { id: 'w7', prompt: 'Present everywhere at once', options: ['Ubiquitous', 'Ambiguous', 'Ubiquity', 'Unanimous'], answer: 'Ubiquitous', difficulty: 4 },
  { id: 'w8', prompt: 'To formally give up a position or right', options: ['Abdicate', 'Adjudicate', 'Advocate', 'Abrogate'], answer: 'Abdicate', difficulty: 6 },
  { id: 'w9', prompt: 'Friendly and easy to talk to', options: ['Affable', 'Amenable', 'Ineffable', 'Malleable'], answer: 'Affable', difficulty: 3 },
  { id: 'w10', prompt: 'A person who knows a great deal about food', options: ['Gourmand', 'Gourmet', 'Glutton', 'Gastronome'], answer: 'Gourmet', difficulty: 8 },
];

export const SEQUENCE_ITEMS: Item[] = [
  { id: 's1', stem: '2 · 4 · 8 · 16 · ?', prompt: 'What comes next?', options: ['32', '24', '20', '64'], answer: '32', difficulty: 2 },
  { id: 's2', stem: '1 · 1 · 2 · 3 · 5 · ?', prompt: 'What comes next?', options: ['8', '7', '10', '6'], answer: '8', difficulty: 4 },
  { id: 's3', stem: 'A · C · F · J · ?', prompt: 'What comes next?', options: ['O', 'M', 'N', 'P'], answer: 'O', difficulty: 6 },
  { id: 's4', stem: '3 · 6 · 11 · 18 · ?', prompt: 'What comes next?', options: ['27', '25', '24', '29'], answer: '27', difficulty: 5 },
  { id: 's5', stem: '81 · 27 · 9 · ?', prompt: 'What comes next?', options: ['3', '6', '1', '4.5'], answer: '3', difficulty: 3 },
  { id: 's6', stem: '2 · 3 · 5 · 7 · 11 · ?', prompt: 'What comes next?', options: ['13', '12', '15', '14'], answer: '13', difficulty: 5 },
  { id: 's7', stem: '1 · 4 · 9 · 16 · ?', prompt: 'What comes next?', options: ['25', '20', '24', '36'], answer: '25', difficulty: 3 },
  { id: 's8', stem: 'Z · X · U · Q · ?', prompt: 'What comes next?', options: ['L', 'M', 'N', 'K'], answer: 'L', difficulty: 8 },
  { id: 's9', stem: '5 · 10 · 9 · 18 · 17 · ?', prompt: 'What comes next?', options: ['34', '33', '35', '26'], answer: '34', difficulty: 7 },
  { id: 's10', stem: '1 · 2 · 6 · 24 · ?', prompt: 'What comes next?', options: ['120', '96', '48', '72'], answer: '120', difficulty: 6 },
];

export function pickItems(bank: Item[], count: number, aroundDifficulty: number): Item[] {
  const sorted = [...bank].sort(
    (a, b) => Math.abs(a.difficulty - aroundDifficulty) - Math.abs(b.difficulty - aroundDifficulty),
  );
  return sorted.slice(0, count).sort((a, b) => a.difficulty - b.difficulty);
}
