import { CHECK_ORDER, CORE_GAME_IDS } from '../src/data/games';

describe('assessment battery', () => {
  it('exposes exactly 13 unique core games', () => {
    expect(CORE_GAME_IDS).toHaveLength(13);
    expect(new Set(CORE_GAME_IDS).size).toBe(13);
    expect(CORE_GAME_IDS).not.toContain('color-clash');
    expect(CORE_GAME_IDS).not.toContain('pattern-path');
  });

  it.each(['name-face', 'word-vault'] as const)('%s separates immediate and delayed recall', (gameId) => {
    const immediate = CHECK_ORDER.findIndex((step) => step.gameId === gameId && step.phase === 'immediate');
    const delayed = CHECK_ORDER.findIndex((step) => step.gameId === gameId && step.phase === 'delayed');
    expect(immediate).toBeGreaterThanOrEqual(0);
    expect(delayed - immediate).toBeGreaterThanOrEqual(4);
  });
});
