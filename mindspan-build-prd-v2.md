# Mindspan — Build PRD v2

**Status:** Locked for build
**Platform:** iOS, Expo + TypeScript
**Team:** 1 developer, AI-assisted, ~5–10 hrs/week
**Goal:** $10k MRR

**This version replaces v1.** v1 drifted into psychometrics — device calibration, confidence intervals, validation phases. That was solving for clinical defensibility you don't need. This is a game built on real cognitive paradigms. Fun first, honest throughout.

---

## 1. What this is

A daily five-minute brain workout for adults who feel their attention and recall slipping while AI quietly takes over their thinking.

**Positioning:** AI is doing more of your thinking. Keep yours sharp.

Not fear-based. The tone is confident and slightly cheeky, never anxious. Technology getting better is good — it just makes deliberately exercising your own mind more worth doing, the same way cars made going for a run worth doing.

**Marketing lines:**
- AI can do it for you. Do it yourself for five minutes.
- Train the thinking you don't want to outsource.
- Use it or lose it. Five minutes a day.
- How sharp are you today?

**Audience:** adults 35–65, longevity-curious, wearable-owning, comfortable with quantified-self products. Not people with diagnosed cognitive impairment — that's a different product with real clinical duties.

**Tone rules:** playful, direct, adult. No mascots, no infantilising, no medical register. It should feel like a well-made game, not a test.

---

## 2. The hook: Mind Age

**Renamed from "Cognitive Performance Age."** That phrase sounds like a measurement, which drags the whole product toward rigor it doesn't need. **Mind Age** is short, shareable, and obviously a game score — Nintendo's Brain Age sold tens of millions on exactly this mechanic and nobody mistook it for a diagnosis, because the tone made it clear.

(Don't use "Brain Age" — it's Nintendo's trademark.)

**How it works:**
- Complete the 4-minute check → get a Mind Age
- Displayed as a single number with a light touch: *"Mind Age 44. Not bad for 51."*
- Recalculated every 4 weeks, or any time the user asks for a fresh check
- Rolling average of the last 3 checks so one bad night doesn't tank it

**What's gone from v1:** percentiles on every screen, confidence intervals, reference bands, device-stratified norms, alternate assessment forms. All of it made the product feel like a clinic.

**What stays, because it's product quality not science:** daily games don't directly move Mind Age. Only the check does. If daily play pumped the number, users would watch it inflate and conclude it's fake — that's the single most common complaint in competitor reviews. The separation is free to implement and it's the reason people will trust the number.

**The honest line, shown once on the result screen and on the science page:** *Mind Age compares your play to other Mindspan players in different age groups. It's a fitness score, not a medical measurement.*

---

## 3. The lineup: 7 games, 3 engines

More games than v1, same build cost — because they share engines. Each is built on a paradigm researchers have used for decades.

| Game | What you do | Paradigm | Engine |
|---|---|---|---|
| **Signal Stop** | Tap the go signal, freeze on the stop signal | Go/no-go, stop-signal | A |
| **Color Clash** | The word says red, the ink is blue — go with the ink | Stroop interference | A |
| **Switchboard** | Sort by colour, then the rule changes mid-round | Task-switching | A |
| **Memory Ladder** | Hold a sequence, repeat it backwards | Digit span forward/backward | C |
| **Pattern Path** | Watch tiles light up, tap them back in order | Corsi block-tapping | C |
| **Word Rescue** | Find the exact word from a clue, against the clock | Verbal fluency, semantic retrieval | B |
| **Sequence Detective** | Work out the rule, apply it | Inductive reasoning, matrix problems | B |
| **Odd One Out** | Four items, one doesn't belong — why? | Concept formation, categorisation | B |

That's 8 games listed; ship 7 and hold **Odd One Out** as your first post-launch addition, so there's something in the tank for week six.

**Engines:**
- **A — Stimulus/Response:** show something, apply a rule, measure taps. Build first, hardest.
- **B — Item/Prompt:** serve an item from a bank, take an answer, score it. Content-driven.
- **C — Sequence/Recall:** present a sequence, take it back, extend the span.

Two or three variants per game gives roughly 18 distinct-feeling activities. That's the answer to week-six boredom.

**Still deferred:** Peripheral Pulse (needs native timing work) and Name and Face (needs a licensed face library).

### Making them games, not tests

- Levels that ramp because ramping is satisfying, not because an algorithm decided
- Personal bests, plainly stated
- Streaks with an automatic weekly recovery token — no guilt mechanics
- A 2-minute session option for low-energy days
- Rotating variants so the same domain doesn't feel like the same task

---

## 4. Scoring, kept light

Six skill areas, each fed by its games:

| Skill | Games | Weight |
|---|---|---|
| Focus | Signal Stop, Color Clash | 20% |
| Memory | Memory Ladder | 20% |
| Recall | Pattern Path | 15% |
| Words | Word Rescue | 20% |
| Reasoning | Sequence Detective | 15% |
| Flexibility | Switchboard | 10% |

**Processing speed is dropped from the score.** Reaction timing varies enough across phone hardware that a raw-millisecond domain would be comparing devices as much as people. Show mean response time as a fun stat on the result screen — never as a scored skill.

Everything above is accuracy-, span- or difficulty-based, which is robust to device differences. Where timing does contribute, use *difference* scores — switch cost, interference cost — since a device's constant offset cancels out when you subtract two conditions measured on the same phone.

Each skill scores 0–100 from accuracy, level reached and consistency. Weights are a product decision, not a scientific claim, and every stored score records which version produced it.

---

## 5. The daily loop

Open the app, one thing to do:

1. **Warm-up** — 45 seconds, a game you're good at
2. **Focus round** — your weakest skill, at the level you've reached
3. **Wildcard** — a game you've told us you like

Ends with one line of feedback and tomorrow's preview. Four tabs: **Play · Progress · Mind Age · You**.

Every 4 weeks: *"Ready for a fresh Mind Age check?"* — the strongest retention event in the product, and the natural moment to prompt a share.

---

## 6. Free vs paid

Restructured around **how much you play**, not how much of your own data you can see. Paywalling someone's results feels hostile; limiting session volume is normal for a game.

**Free**
- All 7 games
- One workout a day
- Mind Age check once a month
- Last 7 days of progress
- Share cards and friend challenges

**Premium**
- Unlimited play
- Mind Age check whenever you want
- All difficulty modes and variants
- Full history and trends
- Weekly recap
- Personalised plan targeting your weakest skills

**Pricing:** $9.99/month · $59.99/year · 7-day trial with a reminder before it converts · founding lifetime $99 for the first 500 users.

Lead with annual — it removes the churn treadmill entirely.

### The math, corrected

v1 assumed a 30% App Store cut. As a solo developer under $1M/year you qualify for Apple's Small Business Program at **15%**, which materially improves the picture:

| | Net per year |
|---|---|
| Annual at $59.99 | ~$51 |
| Monthly at $9.99 × 12 | ~$102 |

At a blended ~$6/month net, **$10k MRR ≈ 1,670 subscribers ≈ ~40,000 activated users** at 4% conversion.

---

## 7. The science page

One screen, an afternoon's writing, and it's the thing competitors can't copy.

A paragraph per game: which paradigm it's based on, what that paradigm measures, and one plain sentence — **practising a skill reliably improves that skill; whether it carries over into everyday life is less certain.**

Every competitor with a science page either omits that last sentence or buries it. Yours leads with it. Counter-intuitively that reads as *more* credible, not less, and it's the tone your whole brand runs on.

**Leave out the ACTIVE study.** The speed-of-processing/dementia finding is the most tempting citation in this category and the fastest route to a regulatory problem. It also relates to Peripheral Pulse, which isn't shipping.

---

## 8. Claims discipline

In 2016 Lumosity paid a $2M FTC settlement over marketing that claimed its games improved real-world performance and reduced cognitive decline. Staying clear costs nothing.

**Fine:** keeps your mind active · exercises memory and attention · train the skills AI is taking over · built on established cognitive tasks

**Never:** improves your cognitive health · protects against decline · prevents dementia · makes you smarter · raises IQ · clinically proven

The difference is between describing what the games *exercise* and promising what they *deliver*.

---

## 9. Tech

**App:** Expo (managed) · TypeScript · expo-router · Skia for timed stimuli · Reanimated · Zustand · TanStack Query

**Backend:** Supabase — Postgres, Auth, Edge Functions, Storage in one service

**Scoring:** one versioned Edge Function. Deterministic, unit-tested, no LLM in the path.

**Subscriptions:** RevenueCat + App Store · **Analytics:** PostHog · **Errors:** Sentry

**AI:** Claude API offline only, generating word and reasoning items into a reviewed bank. Never at runtime, never during a check.

**Timing hygiene** — cheap, do it anyway:
- Take response times from native touch events, not `Date.now()` in a JS handler
- Use `react-native-gesture-handler` so touches are captured on the UI thread
- Render stimuli with Skia; nothing else animates during a trial
- Store device model, OS version and app version with every session — one line, and you can't backfill it

**Design:** tokens in `src/theme/tokens.ts`. Light porcelain app, dark focus mode during trials.

---

## 10. Build order

| Weeks | Deliverable |
|---|---|
| 1 | Scaffold, Supabase, PostHog, timing sanity check on 2 real devices |
| 2–3 | Engine A + Signal Stop, end to end with scoring |
| 4 | Color Clash + Switchboard (Engine A reskins) |
| 5 | Engine C + Memory Ladder + Pattern Path |
| 6 | Engine B + Word Rescue + Sequence Detective, seed item banks |
| 7 | Mind Age check flow, result reveal, share card |
| 8 | Daily loop, streaks, progress, levels |
| 9 | Auth, RevenueCat, paywall |
| 10 | Weekly recap, friend challenge, 4-week re-check |
| 11 | Science page, accessibility, privacy, App Review prep |
| 12 | TestFlight with 30–50 testers, fix, submit |

**Reference data:** you need enough players across age bands for Mind Age to mean anything. A ~$500 panel of 300–400 people across six age bands, over-recruiting 55+, run during weeks 7–10. Not a validation study — just enough data that the number isn't invented.

---

## 11. Gates

| Metric | Target |
|---|---|
| Check completion | ≥ 70% |
| Result → account created | ≥ 40% |
| Day-7 retention | ≥ 25% |
| Trial → paid | ≥ 25% |
| 4-week re-check completion | ≥ 20% |

Day-7 retention and trial→paid decide whether this reaches $10k. Everything else is secondary.

---

## 12. Not building

Peripheral Pulse · Name and Face · lifestyle modules · group challenges · leaderboards · family plans · AI chatbot · social feed · Android · web app · wearables · device calibration rigs · confidence intervals · alternate assessment forms · percentile displays · multi-tier referrals · anything clinical.

This list is a contract. New ideas go in a v3 file, not the current sprint.
