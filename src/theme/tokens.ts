export const color = {
  paper: '#EFF0F6',
  card: '#FFFFFF',
  line: '#E3E5F0',
  lineSoft: '#EDEEF5',

  ink: '#14162B',
  ink2: '#4A4F6B',
  ink3: '#8189A6',

  focus: '#14162B',
  focus2: '#1F2240',
  focusLine: '#2E3252',
  focusInk: '#F4F5FA',
  focusInk2: '#A8AFCC',
  stim: '#FFB238',
  stimStop: '#3FCFA3',
} as const;

export const radius = { sm: 8, md: 16, lg: 24, pill: 999 } as const;

export const font = {
  sans: 'InstrumentSans_400Regular',
  sansMedium: 'InstrumentSans_500Medium',
  sansSemi: 'InstrumentSans_600SemiBold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
} as const;

/**
 * PRD v2 renames the design system's domains to six scored skills and drops
 * processing speed from scoring. The freed `--spd` red is reassigned to
 * Flexibility, and the design system's magenta becomes Recall.
 */
export const SKILLS = ['focus', 'memory', 'recall', 'words', 'reasoning', 'flexibility'] as const;
export type SkillKey = (typeof SKILLS)[number];

export const skill: Record<SkillKey, { label: string; fill: string; text: string; weight: number }> = {
  focus: { label: 'Focus', fill: '#E08A00', text: '#A85C00', weight: 0.2 },
  memory: { label: 'Memory', fill: '#6355E0', text: '#4F3FC9', weight: 0.2 },
  recall: { label: 'Recall', fill: '#C4359C', text: '#AF2C8A', weight: 0.15 },
  words: { label: 'Words', fill: '#0E9384', text: '#076B60', weight: 0.2 },
  reasoning: { label: 'Reasoning', fill: '#1D6FE0', text: '#1A5FC4', weight: 0.15 },
  flexibility: { label: 'Flexibility', fill: '#E1483C', text: '#C13126', weight: 0.1 },
};

export const motion = {
  tapScale: 0.965,
  tapMs: 140,
  countUpMs: 680,
  trendDrawMs: 380,
} as const;
