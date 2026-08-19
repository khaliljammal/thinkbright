import { SKILLS, SkillKey, skill as SKILL_META } from '../theme/tokens';
import { GameId, GAMES } from '../data/games';

export const SCORING_VERSION = 'ms-scoring-2';

export type TrialRecord = {
  /** Milliseconds from stimulus onset to touch, taken from the native event. */
  rtMs: number | null;
  correct: boolean;
  /** True where withholding was the correct response (no-go trials). */
  isNoGo?: boolean;
  /** Task-specific raw measurements retained for analysis and future normalization. */
  metadata?: Record<string, string | number | boolean | null>;
};

export type GameResult = {
  gameId: GameId;
  trials: TrialRecord[];
  /** Highest sequence length or difficulty level reached, for span games. */
  levelReached?: number;
  /** Only controlled assessment observations can update Cognitive Performance Age. */
  mode?: 'assessment' | 'training';
  metrics?: Record<string, number | null>;
};

export type SkillScores = Record<SkillKey, number>;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function accuracy(trials: TrialRecord[]): number {
  const scored = trials.filter((t) => t.rtMs !== null || t.isNoGo);
  if (!scored.length) return 0;
  return scored.filter((t) => t.correct).length / scored.length;
}

export function meanRt(trials: TrialRecord[]): number | null {
  const rts = trials.filter((t) => t.correct && t.rtMs !== null).map((t) => t.rtMs as number);
  if (!rts.length) return null;
  return rts.reduce((a, b) => a + b, 0) / rts.length;
}

const median = (values: number[]): number | null => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** Common raw metrics retained for every game, plus task-specific metrics when available. */
export function deriveGameMetrics(result: GameResult): Record<string, number | null> {
  const correctTimes = result.trials
    .filter((trial) => trial.correct && trial.rtMs !== null)
    .map((trial) => trial.rtMs as number);
  const average = correctTimes.length ? correctTimes.reduce((sum, value) => sum + value, 0) / correctTimes.length : null;
  const variability = average && correctTimes.length > 1
    ? Math.sqrt(correctTimes.reduce((sum, value) => sum + (value - average) ** 2, 0) / correctTimes.length)
    : null;
  const switchTimes = result.trials.filter((trial) => trial.correct && trial.metadata?.switchTrial === true && trial.rtMs !== null).map((trial) => trial.rtMs as number);
  const repeatTimes = result.trials.filter((trial) => trial.correct && trial.metadata?.switchTrial === false && trial.rtMs !== null).map((trial) => trial.rtMs as number);
  const switchMedian = median(switchTimes);
  const repeatMedian = median(repeatTimes);

  return {
    accuracy: accuracy(result.trials),
    medianRtMs: median(correctTimes),
    rtVariabilityMs: variability,
    missRate: result.trials.length ? result.trials.filter((trial) => trial.rtMs === null && !trial.correct).length / result.trials.length : 0,
    falsePositiveRate: result.trials.length ? result.trials.filter((trial) => trial.isNoGo && !trial.correct).length / result.trials.length : 0,
    difficultyReached: result.levelReached ?? null,
    switchCostMs: switchMedian !== null && repeatMedian !== null ? switchMedian - repeatMedian : null,
    ...result.metrics,
  };
}

/**
 * Consistency rewards steady responding. Uses coefficient of variation so it
 * stays comparable across phones — a device's constant offset scales both the
 * mean and the SD, which mostly cancels in the ratio.
 */
export function consistency(trials: TrialRecord[]): number {
  const rts = trials.filter((t) => t.correct && t.rtMs !== null).map((t) => t.rtMs as number);
  if (rts.length < 3) return 0.5;
  const mean = rts.reduce((a, b) => a + b, 0) / rts.length;
  if (mean <= 0) return 0.5;
  const variance = rts.reduce((a, b) => a + (b - mean) ** 2, 0) / rts.length;
  const cv = Math.sqrt(variance) / mean;
  return clamp(1 - cv, 0, 1);
}

/** Span games earn most of their score from the level reached. */
function spanComponent(levelReached: number | undefined, ceiling: number): number {
  if (levelReached === undefined) return 0;
  return clamp(levelReached / ceiling, 0, 1);
}

/**
 * One game to a 0–100 skill score from accuracy, level reached and consistency.
 * No raw milliseconds contribute, so a fast phone can't buy a better score.
 */
export function scoreGame(result: GameResult): number {
  const game = GAMES[result.gameId];
  const acc = accuracy(result.trials);
  const con = consistency(result.trials);

  if (result.gameId === 'name-face' || result.gameId === 'word-vault') {
    return Math.round(100 * clamp(0.8 * acc + 0.2 * con, 0, 1));
  }
  if (result.gameId === 'plan-ahead') {
    const efficiency = clamp(result.metrics?.planningEfficiency ?? 0, 0, 1);
    return Math.round(100 * clamp(0.8 * efficiency + 0.2 * acc, 0, 1));
  }
  if (result.gameId === 'target-hunt') {
    return Math.round(100 * clamp(0.75 * acc + 0.25 * con, 0, 1));
  }
  if (game.engine === 'C') {
    const span = spanComponent(result.levelReached, 9);
    return Math.round(100 * clamp(0.6 * span + 0.3 * acc + 0.1 * con, 0, 1));
  }
  if (game.engine === 'B') {
    const level = spanComponent(result.levelReached, 12);
    return Math.round(100 * clamp(0.65 * acc + 0.25 * level + 0.1 * con, 0, 1));
  }
  return Math.round(100 * clamp(0.7 * acc + 0.3 * con, 0, 1));
}

/** Coverage-based confidence is deliberately separate from the performance score. */
export function profileConfidence(scores: Partial<SkillScores>): {
  coverage: number;
  level: 'Low' | 'Building' | 'High';
} {
  const measured = SKILLS.filter((key) => scores[key] !== undefined).length;
  const coverage = measured / SKILLS.length;
  return { coverage, level: coverage >= 0.85 ? 'High' : coverage >= 0.5 ? 'Building' : 'Low' };
}

/** Averages every game feeding a skill; skills with no data stay null. */
export function scoreSkills(results: GameResult[]): Partial<SkillScores> {
  const buckets = new Map<SkillKey, number[]>();
  for (const r of results) {
    const key = GAMES[r.gameId].skill;
    const list = buckets.get(key) ?? [];
    list.push(scoreGame(r));
    buckets.set(key, list);
  }
  const out: Partial<SkillScores> = {};
  for (const [key, list] of buckets) {
    out[key] = Math.round(list.reduce((a, b) => a + b, 0) / list.length);
  }
  return out;
}

/** Weighted composite over whichever skills were measured. */
export function composite(scores: Partial<SkillScores>): number {
  let sum = 0;
  let weight = 0;
  for (const key of SKILLS) {
    const v = scores[key];
    if (v === undefined) continue;
    sum += v * SKILL_META[key].weight;
    weight += SKILL_META[key].weight;
  }
  if (!weight) return 0;
  return sum / weight;
}

/**
 * Expected composite for a chronological age, from the reference panel.
 * Placeholder curve until panel data lands (PRD §10) — the shape is right,
 * the constants are not yet earned.
 */
export function expectedComposite(age: number): number {
  return 78 - (clamp(age, 18, 90) - 30) * 0.7;
}

/**
 * Mind Age: the chronological age whose expected composite matches yours.
 * A fitness score, not a medical measurement.
 */
export function mindAge(scores: Partial<SkillScores>): number {
  const c = composite(scores);
  return Math.round(clamp(30 + (78 - c) / 0.7, 18, 90));
}

/** Rolling average of the last three checks, so one bad night doesn't tank it. */
export function rollingMindAge(history: number[]): number | null {
  const last3 = history.slice(-3);
  if (!last3.length) return null;
  return Math.round(last3.reduce((a, b) => a + b, 0) / last3.length);
}

export function verdict(mind: number, actual: number): string {
  const diff = actual - mind;
  if (diff >= 8) return `Not bad for ${actual}.`;
  if (diff >= 3) return `A little ahead of ${actual}.`;
  if (diff >= -2) return `Right about where ${actual} should be.`;
  if (diff >= -7) return `A bit behind ${actual}. Fixable.`;
  return `Rough one. Try again on a night you've slept.`;
}

export function weakestSkill(scores: Partial<SkillScores>): SkillKey | null {
  let worst: SkillKey | null = null;
  for (const key of SKILLS) {
    const v = scores[key];
    if (v === undefined) continue;
    if (worst === null || v < (scores[worst] as number)) worst = key;
  }
  return worst;
}

export function strongestSkill(scores: Partial<SkillScores>): SkillKey | null {
  let best: SkillKey | null = null;
  for (const key of SKILLS) {
    const v = scores[key];
    if (v === undefined) continue;
    if (best === null || v > (scores[best] as number)) best = key;
  }
  return best;
}
