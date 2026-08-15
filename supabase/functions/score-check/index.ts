// Deterministic, versioned scoring. No LLM in this path (PRD §9).
// The client previews a score locally; this function is the authority.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SCORING_VERSION = 'ms-scoring-2';

const WEIGHTS: Record<string, number> = {
  focus: 0.2,
  memory: 0.2,
  recall: 0.15,
  words: 0.2,
  reasoning: 0.15,
  flexibility: 0.1,
};

const GAME_SKILL: Record<string, string> = {
  'signal-stop': 'focus',
  'color-clash': 'focus',
  switchboard: 'flexibility',
  'memory-ladder': 'memory',
  'pattern-path': 'recall',
  'word-rescue': 'words',
  'sequence-detective': 'reasoning',
};

const GAME_ENGINE: Record<string, 'A' | 'B' | 'C'> = {
  'signal-stop': 'A',
  'color-clash': 'A',
  switchboard: 'A',
  'memory-ladder': 'C',
  'pattern-path': 'C',
  'word-rescue': 'B',
  'sequence-detective': 'B',
};

type Trial = { rtMs: number | null; correct: boolean; isNoGo?: boolean };
type GameResult = { gameId: string; trials: Trial[]; levelReached?: number };

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function accuracy(trials: Trial[]) {
  const scored = trials.filter((t) => t.rtMs !== null || t.isNoGo);
  if (!scored.length) return 0;
  return scored.filter((t) => t.correct).length / scored.length;
}

function consistency(trials: Trial[]) {
  const rts = trials.filter((t) => t.correct && t.rtMs !== null).map((t) => t.rtMs as number);
  if (rts.length < 3) return 0.5;
  const mean = rts.reduce((a, b) => a + b, 0) / rts.length;
  if (mean <= 0) return 0.5;
  const variance = rts.reduce((a, b) => a + (b - mean) ** 2, 0) / rts.length;
  return clamp(1 - Math.sqrt(variance) / mean, 0, 1);
}

function scoreGame(r: GameResult) {
  const engine = GAME_ENGINE[r.gameId];
  const acc = accuracy(r.trials);
  const con = consistency(r.trials);
  if (engine === 'C') {
    const span = clamp((r.levelReached ?? 0) / 9, 0, 1);
    return Math.round(100 * clamp(0.6 * span + 0.3 * acc + 0.1 * con, 0, 1));
  }
  if (engine === 'B') {
    const level = clamp((r.levelReached ?? 0) / 12, 0, 1);
    return Math.round(100 * clamp(0.65 * acc + 0.25 * level + 0.1 * con, 0, 1));
  }
  return Math.round(100 * clamp(0.7 * acc + 0.3 * con, 0, 1));
}

function meanRt(trials: Trial[]) {
  const rts = trials.filter((t) => t.correct && t.rtMs !== null).map((t) => t.rtMs as number);
  return rts.length ? rts.reduce((a, b) => a + b, 0) / rts.length : null;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const auth = req.headers.get('Authorization');
  if (!auth) return new Response('Unauthorized', { status: 401 });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: auth } } },
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return new Response('Unauthorized', { status: 401 });

  const body = (await req.json()) as { results: GameResult[]; age: number; device?: Record<string, string> };
  const results = (body.results ?? []).filter((r) => GAME_SKILL[r.gameId]);
  if (!results.length) return new Response('No results', { status: 400 });

  const buckets: Record<string, number[]> = {};
  for (const r of results) {
    const key = GAME_SKILL[r.gameId];
    (buckets[key] ??= []).push(scoreGame(r));
  }
  const skills: Record<string, number> = {};
  for (const [k, list] of Object.entries(buckets)) {
    skills[k] = Math.round(list.reduce((a, b) => a + b, 0) / list.length);
  }

  let sum = 0;
  let weight = 0;
  for (const [k, v] of Object.entries(skills)) {
    sum += v * WEIGHTS[k];
    weight += WEIGHTS[k];
  }
  const composite = weight ? sum / weight : 0;
  const mindAge = Math.round(clamp(30 + (78 - composite) / 0.7, 18, 90));
  const rt = meanRt(results.flatMap((r) => r.trials));

  const { error } = await supabase.from('checks').insert({
    user_id: userData.user.id,
    mind_age: mindAge,
    skills,
    mean_rt_ms: rt,
    scoring_version: SCORING_VERSION,
    device_model: body.device?.model ?? null,
    os_version: body.device?.osVersion ?? null,
    app_version: body.device?.appVersion ?? null,
  });
  if (error) return new Response(error.message, { status: 500 });

  return new Response(JSON.stringify({ mindAge, skills, meanRtMs: rt, scoringVersion: SCORING_VERSION }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
