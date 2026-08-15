import { buildPlan } from '../src/lib/plan';
import { GAMES } from '../src/data/games';

describe('daily plan', () => {
  it('selects three distinct games across three domains', () => {
    const plan = buildPlan({ skills: {}, concerns: [], seed: 42 });
    expect(new Set(plan.map((slot) => slot.gameId)).size).toBe(3);
    expect(new Set(plan.map((slot) => GAMES[slot.gameId].skill)).size).toBe(3);
  });

  it('rotates games deterministically with the day seed', () => {
    const input = { skills: { processing: 80, focus: 45 }, concerns: ['focus'] };
    expect(buildPlan({ ...input, seed: 100 })).toEqual(buildPlan({ ...input, seed: 100 }));
    expect(buildPlan({ ...input, seed: 100 })).not.toEqual(buildPlan({ ...input, seed: 101 }));
  });
});
