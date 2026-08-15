# Mindspan

A daily five-minute brain workout built with Expo, React Native, and TypeScript.
The product requirements and design-system reference live at the repository root.

The product hangs off one separation: **daily play never moves your Mind Age —
only a check does.** The app is porcelain all day and inverts to focus-mode dark
the moment a task is being measured.

## Run it on your phone

Install **Expo Go** from the App Store, then on your computer:

```bash
npm ci
npx expo start
```

Scan the QR code with the iPhone Camera app. Phone and computer need to be on the
same Wi-Fi; if they aren't, use `npx expo start --tunnel`.

No `.env` and no accounts needed to play. Everything runs local — all seven games,
the full Mind Age check, scoring, the reveal, streaks, the four tabs — and scores
persist to the phone.

The two things Expo Go can't do are Sign in with Apple and real purchases, both
being native modules. The app detects this: the Apple button hides itself and the
paywall explains rather than crashing. Use **Continue with email** or **Skip for
now** to get through onboarding. Those two paths need a development build
(`npx expo run:ios`, Mac + Xcode).

### Fastest route to the interesting part

**Get started → Skip for now → Continue → Continue → Start the check.** That drops
you into focus mode for the six-task check; the Mind Age reveal at the end is the
moment the whole product hangs off.

Run the complete validation suite with `npm run check`, or run `npm test` and
`npm run typecheck` separately.

## Configuration

Nothing here is required to play. Without keys the app runs fully local: scores
persist to the device and the paywall explains it isn't wired up.

| Variable | Where it comes from |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | same page, the `anon` publishable key |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat → Project → API keys → Apple App Store |
| `EXPO_PUBLIC_POSTHOG_KEY` | PostHog → Project settings (optional) |

### Supabase

1. Create a project, then run `supabase/migrations/0001_init.sql` in the SQL editor.
   It creates `profiles`, `sessions` and `checks`, turns on row level security so a
   user can only ever touch their own rows, and adds a trigger that gives every new
   auth user a profile row.
2. Deploy the scoring function: `supabase functions deploy score-check`.
   It's deterministic and versioned — no LLM in the path — and it's the authority
   on a Mind Age. The client scores locally too, for the instant reveal.
3. For Sign in with Apple, enable the Apple provider under Authentication →
   Providers and add your bundle ID (`com.mindspan.app`).

### RevenueCat

Create an offering with two packages, `annual` ($59.99) and `monthly` ($9.99),
both on a 7-day trial, and an entitlement with the identifier **`premium`** —
`src/lib/purchases.ts` looks for exactly that string. The paywall reads live
prices from the offering and falls back to the PRD's prices if it can't reach
RevenueCat.

## Layout

```
app/                    expo-router routes, one file per screen
  (tabs)/               Play · Progress · Mind Age · You
  check/[step].tsx      the six-task Mind Age check
  workout.tsx           the daily loop: warm-up, focus round, wildcard
src/
  engines/              A stimulus/response · B item/prompt · C sequence/recall
  games/                the seven games, built on those three engines
  lib/scoring.ts        skills → composite → Mind Age (mirrors the edge function)
  lib/plan.ts           picks today's three games
  theme/tokens.ts       design system v2, 1:1
supabase/               schema and the scoring edge function
```

## Project status

This is an early product build. Local play is functional, but the Mind Age
reference curve in `src/lib/scoring.ts` still uses placeholder constants and
must be calibrated before the score is presented as validated. Authentication,
cloud sync, and purchases require their respective service configuration and a
native development build.

## Timing

Reaction times are stamped on the UI thread at both ends — the stimulus onset via
a Reanimated worklet, the touch via a gesture-handler worklet — using the
worklet runtime's native monotonic `performance.now()`. Neither crosses the JS
bridge before being timed, so a busy JS thread can't inflate a measurement.
Nothing animates during a trial, and stimuli appear with zero transition.

Raw milliseconds are never scored. Skills come from accuracy, level reached and
consistency (a coefficient of variation, so a slower phone isn't penalised).
Mean response time is shown on the result screen as a fun stat only.

## Claims discipline

Copy is bound by PRD §8. Fine: *keeps your mind active*, *exercises memory and
attention*, *built on established cognitive tasks*. Never: *improves cognitive
health*, *protects against decline*, *clinically proven*. The science page leads
with the honest sentence rather than burying it.

## Not built

Per PRD §12: Odd One Out, Peripheral Pulse, Name and Face, weekly recap, friend
challenges, leaderboards, Android, web. The reference panel that would make Mind
Age mean something hasn't been run either — `expectedComposite()` in
`src/lib/scoring.ts` is a placeholder curve with the right shape and unearned
constants, and it's the one thing to replace before shipping a number to anyone.
