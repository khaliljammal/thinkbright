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

export const WORD_CONNECTION_ITEMS: Item[] = [
  { id: 'c1', prompt: 'Bird is most closely related to…', options: ['Nest', 'Truck', 'Glass', 'Clock'], answer: 'Nest', difficulty: 2 },
  { id: 'c2', prompt: 'Thermometer is most closely related to…', options: ['Temperature', 'Distance', 'Weight', 'Direction'], answer: 'Temperature', difficulty: 3 },
  { id: 'c3', prompt: 'Blueprint is most closely related to…', options: ['Building', 'Novel', 'Concert', 'Recipe'], answer: 'Building', difficulty: 4 },
  { id: 'c4', prompt: 'Orbit is most closely related to…', options: ['Planet', 'Ocean', 'Forest', 'Engine'], answer: 'Planet', difficulty: 4 },
  { id: 'c5', prompt: 'Cautious is closest in meaning to…', options: ['Prudent', 'Restless', 'Cheerful', 'Fragile'], answer: 'Prudent', difficulty: 5 },
  { id: 'c6', prompt: 'Glove relates to hand as sock relates to…', options: ['Foot', 'Shoe', 'Wool', 'Pair'], answer: 'Foot', difficulty: 6 },
  { id: 'c7', prompt: 'Chapter relates to book as movement relates to…', options: ['Symphony', 'Dance', 'Travel', 'Clock'], answer: 'Symphony', difficulty: 7 },
  { id: 'c8', prompt: 'Erode is most closely related to…', options: ['Wear away', 'Build up', 'Turn over', 'Hold still'], answer: 'Wear away', difficulty: 5 },
];

export const MIND_ROTATE_ITEMS: Item[] = [
  { id: 'r1', stem: '└  →  ┌', prompt: 'Same form rotated, or mirrored?', options: ['Same', 'Mirrored'], answer: 'Same', difficulty: 2, metadata: { angle: 90 } },
  { id: 'r2', stem: '└  →  ┘', prompt: 'Same form rotated, or mirrored?', options: ['Same', 'Mirrored'], answer: 'Mirrored', difficulty: 3, metadata: { angle: 90 } },
  { id: 'r3', stem: '┬  →  ┴', prompt: 'Same form rotated, or mirrored?', options: ['Same', 'Mirrored'], answer: 'Same', difficulty: 4, metadata: { angle: 180 } },
  { id: 'r4', stem: '◢  →  ◣', prompt: 'Same form rotated, or mirrored?', options: ['Same', 'Mirrored'], answer: 'Mirrored', difficulty: 5, metadata: { angle: 90 } },
  { id: 'r5', stem: '↱  →  ↳', prompt: 'Same form rotated, or mirrored?', options: ['Same', 'Mirrored'], answer: 'Same', difficulty: 6, metadata: { angle: 180 } },
  { id: 'r6', stem: '◤  →  ◢', prompt: 'Same form rotated, or mirrored?', options: ['Same', 'Mirrored'], answer: 'Same', difficulty: 7, metadata: { angle: 180 } },
];

export const TARGET_HUNT_ITEMS: Item[] = [
  { id: 'h1', stem: '↖  ↖  ↗  ↖\n↖  ↖  ↖  ↖', prompt: 'Where is ↗?', options: ['Top left', 'Top right', 'Bottom left', 'Bottom right'], answer: 'Top right', difficulty: 2, metadata: { distractors: 7 } },
  { id: 'h2', stem: '→  →  →  →\n→  →  ←  →\n→  →  →  →', prompt: 'Where is ←?', options: ['Top', 'Middle', 'Bottom'], answer: 'Middle', difficulty: 3, metadata: { distractors: 11 } },
  { id: 'h3', stem: '↗  ↗  ↗  ↗\n↗  ↗  ↗  ↗\n↗  ↖  ↗  ↗', prompt: 'Where is ↖?', options: ['Top', 'Middle', 'Bottom'], answer: 'Bottom', difficulty: 4, metadata: { distractors: 11 } },
  { id: 'h4', stem: '↑  ↑  ↑  ↑  ↑\n↑  ↑  ↑  ↑  ↑\n↑  ↑  ↓  ↑  ↑\n↑  ↑  ↑  ↑  ↑', prompt: 'Where is ↓?', options: ['Top half', 'Bottom half'], answer: 'Bottom half', difficulty: 6, metadata: { distractors: 19 } },
  { id: 'h5', stem: '↘  ↘  ↘  ↘  ↘\n↘  ↘  ↘  ↘  ↘\n↘  ↘  ↘  ↘  ↘\n↘  ↙  ↘  ↘  ↘', prompt: 'Where is ↙?', options: ['Top half', 'Bottom half'], answer: 'Bottom half', difficulty: 7, metadata: { distractors: 19 } },
];

export function pickItems(bank: Item[], count: number, aroundDifficulty: number): Item[] {
  const sorted = [...bank].sort(
    (a, b) => Math.abs(a.difficulty - aroundDifficulty) - Math.abs(b.difficulty - aroundDifficulty),
  );
  return sorted.slice(0, count).sort((a, b) => a.difficulty - b.difficulty);
}
