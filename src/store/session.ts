import { create } from 'zustand';
import { storage } from '../lib/storage';
import { GameId } from '../data/games';
import { SkillKey } from '../theme/tokens';
import { GameResult } from '../lib/scoring';
import { supabase } from '../lib/supabase';
import { getCustomerInfo, hasPremium, identify, logOutPurchases } from '../lib/purchases';

export type CheckRecord = {
  id: string;
  takenAt: string;
  mindAge: number;
  skills: Partial<Record<SkillKey, number>>;
  meanRtMs: number | null;
};

type State = {
  ready: boolean;
  userId: string | null;
  premium: boolean;

  age: number;
  concerns: string[];
  name: string;

  streak: number;
  lastWorkoutDay: string | null;
  workoutsToday: number;
  levels: Partial<Record<GameId, number>>;
  checks: CheckRecord[];
  /** Results collected during the check currently in progress. */
  pending: GameResult[];

  hydrate: () => Promise<void>;
  setAge: (n: number) => void;
  toggleConcern: (id: string) => void;
  setName: (n: string) => void;
  setUser: (id: string | null) => void;
  refreshPremium: () => Promise<void>;
  signOut: () => Promise<void>;

  startCheck: () => void;
  pushResult: (r: GameResult) => void;
  commitCheck: (rec: CheckRecord) => Promise<void>;
  completeWorkout: (results: GameResult[]) => Promise<void>;
  levelFor: (id: GameId) => number;
};

const KEY = 'mindspan.local.v1';

const today = () => new Date().toISOString().slice(0, 10);

const persisted = (s: State) => ({
  age: s.age,
  concerns: s.concerns,
  name: s.name,
  streak: s.streak,
  lastWorkoutDay: s.lastWorkoutDay,
  workoutsToday: s.workoutsToday,
  levels: s.levels,
  checks: s.checks,
});

export const useSession = create<State>((set, get) => ({
  ready: false,
  userId: null,
  premium: false,

  age: 51,
  concerns: [],
  name: 'there',

  streak: 0,
  lastWorkoutDay: null,
  workoutsToday: 0,
  levels: {},
  checks: [],
  pending: [],

  hydrate: async () => {
    try {
      const raw = await storage.get(KEY);
      if (raw) set({ ...JSON.parse(raw) });
    } catch {
      // A corrupt cache is not worth blocking launch over.
    }
    const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
    const uid = data.session?.user.id ?? null;
    set({ userId: uid, ready: true });
    if (uid) await get().refreshPremium();
  },

  setAge: (n) => {
    set({ age: Math.min(90, Math.max(18, n)) });
    void save(get());
  },
  toggleConcern: (id) => {
    const has = get().concerns.includes(id);
    set({ concerns: has ? get().concerns.filter((c) => c !== id) : [...get().concerns, id] });
    void save(get());
  },
  setName: (n) => {
    set({ name: n });
    void save(get());
  },

  setUser: (id) => {
    set({ userId: id });
    if (id) void identify(id);
  },

  refreshPremium: async () => {
    try {
      set({ premium: hasPremium(await getCustomerInfo()) });
    } catch {
      set({ premium: false });
    }
  },

  signOut: async () => {
    await supabase?.auth.signOut();
    await logOutPurchases().catch(() => {});
    set({ userId: null, premium: false });
  },

  startCheck: () => set({ pending: [] }),
  pushResult: (r) => set({ pending: [...get().pending, r] }),

  commitCheck: async (rec) => {
    const observations = get().pending;
    set({ checks: [...get().checks, rec], pending: [] });
    void save(get());
    const uid = get().userId;
    if (!supabase || !uid) return;
    const { data: check } = await supabase.from('checks').insert({
      user_id: uid,
      taken_at: rec.takenAt,
      mind_age: rec.mindAge,
      skills: rec.skills,
      mean_rt_ms: rec.meanRtMs,
    }).select('id').single();
    if (!check || !observations.length) return;
    await supabase.from('assessment_observations').insert(observations.map((result) => ({
      user_id: uid,
      check_id: check.id,
      game_id: result.gameId,
      mode: result.mode ?? 'assessment',
      level_reached: result.levelReached ?? null,
      trials: result.trials,
      metrics: result.metrics ?? {},
    })));
  },

  completeWorkout: async (results) => {
    const day = today();
    const prev = get().lastWorkoutDay;
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    const streak = prev === day ? get().streak : prev === yesterday ? get().streak + 1 : 1;

    // Levels ratchet up only on the games that actually got further.
    const levels = { ...get().levels };
    for (const r of results) {
      if (r.levelReached !== undefined) {
        levels[r.gameId] = Math.max(levels[r.gameId] ?? 0, r.levelReached);
      }
    }

    set({
      streak,
      lastWorkoutDay: day,
      workoutsToday: prev === day ? get().workoutsToday + 1 : 1,
      levels,
    });
    void save(get());

    const uid = get().userId;
    if (!supabase || !uid) return;
    await supabase.from('sessions').insert({
      user_id: uid,
      played_at: new Date().toISOString(),
      games: results.map((r) => ({
        game_id: r.gameId,
        level: r.levelReached ?? null,
        mode: r.mode ?? 'training',
        metrics: r.metrics ?? {},
      })),
    });
  },

  levelFor: (id) => get().levels[id] ?? 3,
}));

async function save(state: State) {
  try {
    await storage.set(KEY, JSON.stringify(persisted(state)));
  } catch {
    // Non-fatal: the server copy is authoritative once signed in.
  }
}
