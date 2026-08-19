import { GameId, GAMES, GAME_LIST } from '../data/games';
import { SkillKey } from '../theme/tokens';

export type PlanSlot = { gameId: GameId; role: 'WARM-UP' | 'FOCUS ROUND' | 'WILDCARD' };

const CONCERN_SKILL: Record<string, SkillKey> = {
  names: 'recall',
  word: 'words',
  room: 'memory',
  focus: 'focus',
  slow: 'flexibility',
};

/**
 * Warm-up on a strength, grind through the weakest skill, finish on something
 * they've said they like. Deterministic per day so the card doesn't reshuffle
 * every time the screen mounts.
 */
export function buildPlan({
  skills,
  concerns,
  seed,
}: {
  skills: Partial<Record<SkillKey, number>>;
  concerns: string[];
  seed: number;
}): PlanSlot[] {
  const scored = GAME_LIST.map((g) => ({ g, score: skills[g.skill] ?? 50 }));
  const gameForSkill = (key: SkillKey, offset: number) => {
    const games = GAME_LIST.filter((game) => game.skill === key);
    return games[(seed + offset) % games.length];
  };

  const strongestSkill = [...scored].sort((a, b) => b.score - a.score)[0].g.skill;
  const strongest = gameForSkill(strongestSkill, 0).id;

  const concernSkills = concerns.map((c) => CONCERN_SKILL[c]).filter(Boolean);
  const weakestPool = concernSkills.length
    ? scored.filter((x) => concernSkills.includes(GAMES[x.g.id].skill))
    : scored;
  const preferredFocus = [...weakestPool]
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.g.skill)
    .find((key) => key !== strongestSkill);
  const focusSkill = preferredFocus ?? [...scored]
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.g.skill)
    .find((key) => key !== strongestSkill) ?? strongestSkill;
  const focus = gameForSkill(focusSkill, 1).id;

  const rest = GAME_LIST.filter(
    (game) => game.id !== strongest && game.id !== focus && game.skill !== strongestSkill && game.skill !== focusSkill,
  );
  const wildcard = rest[seed % rest.length].id;

  return [
    { gameId: strongest, role: 'WARM-UP' },
    { gameId: focus, role: 'FOCUS ROUND' },
    { gameId: wildcard, role: 'WILDCARD' },
  ];
}

export function daySeed(d = new Date()): number {
  return Math.floor(d.getTime() / 86_400_000);
}
