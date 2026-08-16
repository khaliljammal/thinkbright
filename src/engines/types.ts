import { GameId } from '../data/games';
import { GameResult } from '../lib/scoring';

export type GameProps = {
  gameId: GameId;
  /** Difficulty the player has reached; engines ramp from here. */
  startLevel: number;
  assessmentPhase?: 'full' | 'immediate' | 'delayed';
  onFinish: (result: GameResult) => void;
};

export type Phase = 'idle' | 'stimulus' | 'feedback' | 'done';
