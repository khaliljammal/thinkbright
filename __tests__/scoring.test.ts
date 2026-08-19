import {
  accuracy,
  consistency,
  meanRt,
  scoreGame,
  scoreSkills,
  composite,
  mindAge,
  rollingMindAge,
  weakestSkill,
  strongestSkill,
  profileConfidence,
  TrialRecord,
  GameResult,
} from '../src/lib/scoring';

const hit = (rt: number): TrialRecord => ({ rtMs: rt, correct: true });
const miss = (rt: number): TrialRecord => ({ rtMs: rt, correct: false });
const withheld = (): TrialRecord => ({ rtMs: null, correct: true, isNoGo: true });
const falseAlarm = (rt: number): TrialRecord => ({ rtMs: rt, correct: false, isNoGo: true });

describe('accuracy', () => {
  it('counts withheld no-go trials as scored', () => {
    expect(accuracy([hit(300), withheld(), falseAlarm(250)])).toBeCloseTo(2 / 3);
  });

  it('is zero with nothing to score', () => {
    expect(accuracy([])).toBe(0);
  });
});

describe('meanRt', () => {
  it('ignores incorrect and withheld trials', () => {
    expect(meanRt([hit(300), hit(500), miss(900), withheld()])).toBe(400);
  });

  it('returns null when no correct response has a time', () => {
    expect(meanRt([withheld(), miss(400)])).toBeNull();
  });
});

describe('consistency', () => {
  it('rewards steady responding over erratic responding', () => {
    const steady = [hit(400), hit(405), hit(395), hit(400)];
    const erratic = [hit(200), hit(800), hit(300), hit(900)];
    expect(consistency(steady)).toBeGreaterThan(consistency(erratic));
  });

  it('is scale-invariant, so a slower phone is not penalised', () => {
    const fast = [hit(200), hit(220), hit(240)];
    const slow = fast.map((t) => hit((t.rtMs as number) * 2));
    expect(consistency(fast)).toBeCloseTo(consistency(slow), 10);
  });
});

describe('scoreGame', () => {
  it('scores a span game mostly on the level reached', () => {
    const trials = [hit(1000), hit(1100), hit(1050)];
    const low: GameResult = { gameId: 'pattern-path', trials, levelReached: 3 };
    const high: GameResult = { gameId: 'pattern-path', trials, levelReached: 8 };
    expect(scoreGame(high)).toBeGreaterThan(scoreGame(low) + 25);
  });

  it('never leaves the 0–100 range', () => {
    const perfect: GameResult = {
      gameId: 'memory-ladder',
      trials: [hit(500), hit(500), hit(500)],
      levelReached: 99,
    };
    const awful: GameResult = { gameId: 'signal-stop', trials: [miss(900), miss(100), miss(500)] };
    expect(scoreGame(perfect)).toBeLessThanOrEqual(100);
    expect(scoreGame(awful)).toBeGreaterThanOrEqual(0);
  });

  it('is deterministic for identical input', () => {
    const r: GameResult = { gameId: 'word-rescue', trials: [hit(1200), miss(3000), hit(900)], levelReached: 6 };
    expect(scoreGame(r)).toBe(scoreGame(r));
  });
});

describe('scoreSkills', () => {
  it('averages the two games that both feed Focus', () => {
    const results: GameResult[] = [
      { gameId: 'signal-stop', trials: [hit(300), hit(310), hit(305), hit(300)] },
      { gameId: 'color-clash', trials: [miss(800), miss(200), miss(600), miss(400)] },
    ];
    const skills = scoreSkills(results);
    const a = scoreGame(results[0]);
    const b = scoreGame(results[1]);
    expect(skills.focus).toBe(Math.round((a + b) / 2));
  });

  it('leaves unmeasured skills undefined rather than guessing zero', () => {
    const skills = scoreSkills([{ gameId: 'pattern-path', trials: [hit(900)], levelReached: 5 }]);
    expect(skills.memory).toBeDefined();
    expect(skills.words).toBeUndefined();
  });
});

describe('composite', () => {
  it('reweights over only the skills present', () => {
    expect(composite({ focus: 60 })).toBe(60);
  });

  it('weights Focus above Flexibility, per the PRD table', () => {
    const focusHeavy = composite({ focus: 100, flexibility: 0 });
    const flexHeavy = composite({ focus: 0, flexibility: 100 });
    expect(focusHeavy).toBeGreaterThan(flexHeavy);
  });
});

describe('profileConfidence', () => {
  it('uses measured domain coverage rather than engagement', () => {
    expect(profileConfidence({ processing: 70, focus: 72 }).level).toBe('Low');
    expect(profileConfidence({ processing: 70, focus: 72, memory: 68, recall: 71 }).level).toBe('Building');
    expect(profileConfidence({ processing: 70, focus: 72, memory: 68, recall: 71, words: 75, reasoning: 66, flexibility: 73 }).level).toBe('High');
  });
});

describe('mindAge', () => {
  it('gives a younger mind age for a stronger composite', () => {
    const strong = mindAge({ focus: 90, memory: 90, recall: 90, words: 90, reasoning: 90, flexibility: 90 });
    const weak = mindAge({ focus: 30, memory: 30, recall: 30, words: 30, reasoning: 30, flexibility: 30 });
    expect(strong).toBeLessThan(weak);
  });

  it('stays inside the plausible 18–90 band even at the extremes', () => {
    const all = (v: number) => ({ focus: v, memory: v, recall: v, words: v, reasoning: v, flexibility: v });
    expect(mindAge(all(100))).toBeGreaterThanOrEqual(18);
    expect(mindAge(all(0))).toBeLessThanOrEqual(90);
  });
});

describe('rollingMindAge', () => {
  it('averages only the last three checks', () => {
    expect(rollingMindAge([60, 50, 40, 30])).toBe(40);
  });

  it('is null with no history', () => {
    expect(rollingMindAge([])).toBeNull();
  });

  it('keeps one bad night from dominating', () => {
    expect(rollingMindAge([44, 44, 62])).toBe(50);
  });
});

describe('weakest and strongest', () => {
  it('finds each end of the spread', () => {
    const s = { focus: 71, memory: 66, words: 48, reasoning: 83 };
    expect(weakestSkill(s)).toBe('words');
    expect(strongestSkill(s)).toBe('reasoning');
  });

  it('returns null when nothing was measured', () => {
    expect(weakestSkill({})).toBeNull();
  });
});
