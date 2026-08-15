# MindSpan Cognitive Game Expansion PRD

## 1. Overview

MindSpan currently has five core cognitive games:

1. **Peripheral Pulse** — Processing Speed / Divided Attention
2. **Memory Ladder** — Working Memory
3. **Signal Stop** — Inhibitory Control
4. **Word Rescue** — Verbal Retrieval
5. **Sequence Detective** — Reasoning

The next phase expands MindSpan from 5 to **13 core cognitive games**.

The purpose is not simply to create more content.

The purpose is to:

* Measure cognition more comprehensively.
* Reduce reliance on a single game for an entire cognitive domain.
* Capture cognitive abilities not adequately represented by the first five games.
* Increase gameplay variety and long-term engagement.
* Improve confidence in MindSpan's cognitive-domain scores.
* Continue feeding the existing Brain Score and Cognitive Performance Age algorithm.
* Allow individual games to vary while keeping the underlying cognitive model stable.

The expanded battery should broadly measure:

* Processing speed
* Attention
* Inhibitory control
* Working memory
* Episodic memory
* Verbal/language ability
* Reasoning
* Cognitive flexibility
* Visuospatial cognition
* Planning/executive function

MindSpan should describe this as measuring the **major dimensions of cognitive performance**, not as providing a comprehensive clinical neuropsychological evaluation.

Established cognitive batteries such as NIH Toolbox similarly separate cognition into areas such as executive function, attention, episodic memory, language, processing speed and working memory.

---

# 2. Product Principle

## Games are measurements, not the algorithm

A game should never directly determine Brain Age.

Each game produces standardized performance metrics.

Those metrics contribute to a cognitive domain.

Domains contribute to the overall MindSpan Cognitive Score.

Controlled assessment results contribute to Cognitive Performance Age.

The hierarchy is:

**Raw gameplay**
↓
**Game performance**
↓
**Normalized game score**
↓
**Cognitive domain score**
↓
**Overall Cognitive Score**
↓
**Cognitive Performance Age**

This structure must remain consistent across all 13 games.

---

# 3. Existing Algorithm

The current provisional cognitive model uses the following top-level domains:

| Domain                 | Current Weight |
| ---------------------- | -------------: |
| Processing Speed       |            20% |
| Attention / Inhibition |            15% |
| Working Memory         |            15% |
| Episodic Memory        |            15% |
| Verbal / Language      |            15% |
| Reasoning              |            10% |
| Cognitive Flexibility  |            10% |

Total: **100%**

These weights remain provisional until sufficient normative and validation data exists.

The expansion to 13 games does **not** require changing these top-level weights immediately.

Instead, additional games provide more evidence within each domain.

For example:

Processing Speed should not become more important merely because we happen to have two games measuring it.

Instead:

**Game measurements → domain score → weighted composite**

Games are therefore averaged or modeled **within their domain first**.

This prevents domains with more games from accidentally receiving more weight.

---

# 4. Complete 13-Game Battery

## Existing Games

### Game 1 — Peripheral Pulse

**Primary domain:** Processing Speed
**Secondary signal:** Attention

User responds rapidly to visual targets, including peripheral stimuli.

Capture:

* Median correct reaction time
* Accuracy
* Miss rate
* False-positive rate
* Reaction-time variability
* Performance by stimulus location
* Difficulty reached

Primary contribution:

**Processing Speed**

---

### Game 2 — Memory Ladder

**Primary domain:** Working Memory

User remembers and reproduces increasingly difficult sequences.

Capture:

* Maximum span
* Average successful span
* Accuracy
* Difficulty reached
* Sequence errors
* Response latency
* Performance consistency

Primary contribution:

**Working Memory**

---

### Game 3 — Signal Stop

**Primary domain:** Attention / Inhibition

User responds to permitted stimuli while withholding responses to prohibited stimuli.

Capture:

* Correct go responses
* Commission errors
* Omission errors
* Reaction time
* Reaction-time variability
* Accuracy under increasing speed

Primary contribution:

**Attention / Inhibition**

---

### Game 4 — Word Rescue

**Primary domain:** Verbal / Language

User retrieves words based on presented information or constraints.

Capture:

* Correct responses
* Retrieval latency
* Difficulty reached
* Error rate
* Semantic accuracy

Primary contribution:

**Verbal / Language**

---

### Game 5 — Sequence Detective

**Primary domain:** Reasoning

User determines the underlying relationship or rule in a sequence.

Capture:

* Accuracy
* Difficulty reached
* Time to solution
* Number of attempts
* Performance across complexity levels

Primary contribution:

**Reasoning**

---

# 5. New Games

## Game 6 — Switchboard

### Cognitive purpose

Measure **cognitive flexibility / task switching**.

Cognitive flexibility is one of the major components of executive function, alongside working memory and inhibitory control.

### Core interaction

The user sees objects with multiple attributes.

Example:

A shape can have:

* Color
* Shape
* Number
* Direction

The active rule changes during the game.

Example:

**Round 1:** Tap based on color.

Then:

**Rule changed: Tap based on shape.**

Then the rule switches again.

### Requirements

The game must:

* Include repeat trials and switch trials.
* Randomize stimuli.
* Clearly indicate the current rule.
* Increase difficulty gradually.
* Prevent memorization of fixed sequences.
* Measure performance immediately following rule switches.
* Compare switch trials against non-switch trials.

### Metrics

Capture:

* Accuracy
* Median reaction time
* Switch-trial reaction time
* Repeat-trial reaction time
* Switch cost
* Errors immediately after switching
* Reaction-time variability
* Difficulty reached

### Algorithm contribution

Primary:

**Cognitive Flexibility**

Key derived metric:

**Switch Cost**

This measures the performance penalty associated with changing rules.

### We will NOT

* Use obscure instructions.
* Require specialized knowledge.
* Make rule changes intentionally confusing.
* Score raw speed without considering accuracy.
* Treat training sessions as equivalent to controlled assessments.

---

# 6. Game 7 — Name & Face

### Cognitive purpose

Measure **episodic associative memory**.

The user must create and later retrieve an association between two pieces of information.

### Core interaction

Show the user several fictional people.

Example:

Image + first name:

**Sarah**

Later show the face again and ask:

**What was this person's name?**

Alternative forms can associate:

* Face → name
* Object → location
* Object → label

### Requirements

Assessment stimuli must be novel.

Include:

1. Encoding phase
2. Short interference activity
3. Immediate recall
4. Optional delayed recall later in the session

### Metrics

Capture:

* Immediate recall accuracy
* Delayed recall accuracy
* Recognition accuracy
* Incorrect associations
* Response latency
* Number of items successfully encoded
* Retention rate

### Algorithm contribution

Primary:

**Episodic Memory**

Delayed performance should receive additional analytical importance once normative data supports doing so.

### We will NOT

* Use celebrity faces.
* Require cultural knowledge.
* Reuse the same face/name combinations frequently.
* Tell the user exactly when delayed recall will occur.
* Treat recognition and free recall as identical measurements.

---

# 7. Game 8 — Spatial Sequence

### Cognitive purpose

Measure **visuospatial working memory**.

This is inspired by established Corsi-style spatial-sequence tasks, which are widely used to measure visuospatial working memory.

### Core interaction

Display a grid of locations.

Tiles illuminate sequentially.

The user recreates the sequence.

Example:

⬜ ⬜ ⬜
⬜ ⬜ ⬜
⬜ ⬜ ⬜

Three locations flash.

User taps them in the same order.

Sequence length progressively increases.

### Requirements

* Randomized spatial sequences
* Increasing sequence length
* No predictable visual patterns
* Responsive layout
* Consistent animation timing
* Support multiple difficulty levels

### Metrics

Capture:

* Maximum spatial span
* Correct sequence length
* Position errors
* Order errors
* Accuracy
* Response time
* Difficulty reached
* Performance consistency

### Algorithm contribution

Primary:

**Working Memory**

Internally tag:

**Visuospatial Working Memory**

Memory Ladder and Spatial Sequence therefore measure different manifestations of working memory.

The domain score may eventually combine both rather than relying upon one task.

### We will NOT

* Create a simple Simon clone purely for entertainment.
* Use animation speed as the primary difficulty mechanism.
* Introduce distracting graphics during controlled assessments.

---

# 8. Game 9 — Target Hunt

### Cognitive purpose

Measure:

**Selective Attention + Processing Speed**

### Core interaction

The user searches a field containing similar objects and identifies a target.

Example:

Find:

**↗**

among:

↖ ↑ ↘ → ↙ ↗ ↑ →

Difficulty increases through:

* More distractors
* Greater visual similarity
* Larger fields
* Shorter presentation periods

### Requirements

Generate layouts dynamically.

Stimuli must not consistently appear in predictable positions.

Difficulty should adjust based on:

* Distractor count
* Target/distractor similarity
* Search-field size

### Metrics

Capture:

* Search time
* Accuracy
* Miss rate
* False-selection rate
* Performance by distractor count
* Search-time slope as complexity increases
* Reaction-time variability

### Algorithm contribution

Primary:

**Processing Speed**

Secondary measurement:

**Attention / Inhibition**

For v1 scoring, assign the normalized game primarily to Processing Speed to avoid double-counting.

Attention-specific metrics may be stored for later model development.

### We will NOT

* Reward frantic random tapping.
* Use tiny targets where motor precision dominates cognition.
* Allow screen size to materially alter difficulty.
* Double-count the same game fully toward two domain scores.

---

# 9. Game 10 — Mind Rotate

### Cognitive purpose

Measure **visuospatial reasoning / mental rotation**.

### Core interaction

Display a target shape and another rotated shape.

Ask:

**Same object or different object?**

The user determines whether it is:

* The same object rotated
* A mirrored/different object

Difficulty increases with:

* Rotation angle
* Shape complexity
* Similarity between alternatives

### Requirements

* Procedurally varied shapes
* Multiple rotation angles
* Balanced same/different trials
* No recognizable real-world knowledge required
* Difficulty calibration

### Metrics

Capture:

* Accuracy
* Decision time
* Accuracy by rotation angle
* Reaction time by rotation angle
* Difficulty reached
* Error patterns

### Algorithm contribution

Primary:

**Reasoning**

Internal subtype:

**Visuospatial Reasoning**

Sequence Detective becomes primarily abstract/pattern reasoning.

Mind Rotate becomes spatial reasoning.

Together they create a broader reasoning score.

### We will NOT

* Create a separate top-level Spatial domain in v1.
* Require geometry knowledge.
* Score motor speed.
* Use complicated 3D controls.

---

# 10. Game 11 — Word Vault

### Cognitive purpose

Measure:

**Verbal learning + episodic memory + delayed retention**

This fills one of the most important remaining gaps in the battery.

### Core interaction

Present a set of unrelated words.

Example:

River
Glass
Tiger
Clock
Garden
Paper
Moon
Shoe

After encoding, ask the user to recognize or recall the words.

After several unrelated games, unexpectedly test the words again.

### Flow

**Encoding**
↓
**Immediate recall**
↓
Other MindSpan games
↓
**Delayed recall**

### Requirements

* Randomized word banks
* Age/language-appropriate vocabulary
* Equivalent alternate forms
* Immediate and delayed measurement
* Track interference between assessment phases
* Avoid semantically obvious word groups

### Metrics

Capture:

* Immediate recall
* Delayed recall
* Recognition accuracy
* False positives
* Retention percentage
* Response latency
* Learning performance

### Algorithm contribution

Primary:

**Episodic Memory**

Word Vault and Name & Face provide complementary episodic-memory measurements:

Name & Face → associative memory

Word Vault → verbal learning and retention

### We will NOT

* Use vocabulary difficulty to turn this into a vocabulary test.
* Show the same word list repeatedly.
* tell users exactly which words will return later.
* Equate training improvements automatically with long-term memory improvement.

---

# 11. Game 12 — Word Connections

### Cognitive purpose

Measure **semantic/verbal cognition** without simply duplicating Word Rescue.

### Core interaction

The user identifies semantic relationships.

Example:

**Bird is most closely related to:**

Nest
Truck
Glass
Clock

Difficulty increases through progressively closer semantic alternatives.

Other validated interaction patterns may eventually include category relationships or analogical verbal relationships.

### Requirements

* Large calibrated stimulus bank
* Avoid culturally specific trivia
* Avoid specialized education requirements
* Avoid ambiguous relationships
* Measure both accuracy and response latency
* Localize stimulus sets separately when additional languages launch

### Metrics

Capture:

* Accuracy
* Semantic difficulty reached
* Response latency
* Error patterns
* Consistency

### Algorithm contribution

Primary:

**Verbal / Language**

Word Rescue measures retrieval.

Word Connections measures semantic relationships.

Together they produce a broader Verbal / Language domain.

### We will NOT

* Make this a general-knowledge quiz.
* Reward obscure vocabulary.
* Use spelling as the primary measurement.
* Assume English scores transfer across languages.

---

# 12. Game 13 — Plan Ahead

### Cognitive purpose

Measure **planning and higher-order executive reasoning**.

Planning is considered a higher-order executive ability built partly upon working memory, inhibition, and cognitive flexibility.

Tower-of-London-style tasks are commonly used as planning measures, although performance can involve several cognitive processes.

### Core interaction

Display:

**Starting arrangement**

and

**Goal arrangement**

The user must transform the starting arrangement into the goal using as few moves as possible.

Rules constrain which moves are permitted.

### Requirements

Problems must have known optimal solutions.

Difficulty increases based on:

* Required move count
* Number of possible paths
* Number of objects
* Planning depth

### Metrics

Capture:

* Successful completion
* Moves taken
* Minimum possible moves
* Excess moves
* Time before first move
* Total completion time
* Rule violations
* Difficulty reached

### Algorithm contribution

Primary:

**Reasoning**

Internal subtype:

**Planning / Executive Reasoning**

For v1 we will NOT create a separate Planning domain.

This keeps the existing scoring architecture stable.

Planning data should nevertheless be stored independently so that future validation could justify creating a dedicated Executive Planning domain.

### We will NOT

* Require users to know Tower of London.
* Duplicate the exact proprietary implementation of an existing test.
* Make speed the main measure.
* Penalize thoughtful planning simply because the user waits before making the first move.

---

# 13. Final Cognitive Coverage

After all 13 games:

| Cognitive Area         | Games                                       |
| ---------------------- | ------------------------------------------- |
| Processing Speed       | Peripheral Pulse, Target Hunt               |
| Attention              | Peripheral Pulse, Signal Stop, Target Hunt  |
| Inhibition             | Signal Stop                                 |
| Working Memory         | Memory Ladder, Spatial Sequence             |
| Episodic Memory        | Name & Face, Word Vault                     |
| Verbal / Language      | Word Rescue, Word Connections               |
| Reasoning              | Sequence Detective, Mind Rotate, Plan Ahead |
| Cognitive Flexibility  | Switchboard                                 |
| Visuospatial Cognition | Spatial Sequence, Mind Rotate               |
| Planning               | Plan Ahead                                  |

This provides much broader cognitive coverage while still retaining the existing seven-domain scoring architecture.

---

# 14. Scoring Architecture

Every game must produce three layers of data.

## Layer 1 — Raw Metrics

Examples:

* Reaction time
* Accuracy
* Errors
* Span
* Difficulty
* Variability
* Delayed recall
* Planning efficiency

Never show all raw metrics directly to the user.

Store them for scoring, longitudinal analysis and future validation.

---

## Layer 2 — Normalized Game Score

Convert raw metrics into a normalized:

**0–100 Game Performance Score**

Initial scoring may follow the existing provisional model:

**50% accuracy-adjusted difficulty
30% standardized speed
20% consistency**

However, this formula is a framework rather than a universal formula.

It must be adapted by task.

For example:

Memory games should emphasize span/recall more than reaction time.

Planning should emphasize solution efficiency more than speed.

Signal Stop should emphasize inhibition errors.

Therefore each game requires its own raw-to-game-score transformation.

---

# 15. Domain Scoring

Individual games feed their primary cognitive domain.

Example:

### Working Memory

Memory Ladder normalized score
+
Spatial Sequence normalized score
↓
**Working Memory Domain Score**

Initially:

**Domain Score = weighted mean of valid assessment scores within the domain**

Do NOT simply average daily training games indefinitely.

Only qualified assessment observations contribute to Cognitive Performance Age.

Training performance may contribute to:

* Progress
* Streaks
* Personalization
* Recommended exercises
* Trend visualization

but does not directly overwrite Cognitive Performance Age.

---

# 16. Brain Score

Maintain the current provisional composite:

**Processing Speed — 20%**

**Attention / Inhibition — 15%**

**Working Memory — 15%**

**Episodic Memory — 15%**

**Verbal / Language — 15%**

**Reasoning — 10%**

**Cognitive Flexibility — 10%**

The addition of new games does not change those weights.

It improves the evidence used to calculate each domain.

Example:

Previously:

Working Memory = primarily Memory Ladder

Future:

Working Memory =
Memory Ladder evidence
+
Spatial Sequence evidence

This should make domain estimation more robust.

---

# 17. Cognitive Performance Age

Cognitive Performance Age must continue to be based on controlled assessment performance rather than ordinary daily gameplay.

It should eventually compare the user's performance vector against normative performance for comparable users.

Inputs should ultimately account for:

* Chronological age
* Domain scores
* Device/input conditions
* Assessment completeness
* Measurement consistency
* Practice effects
* Outliers
* Number of valid observations

Early versions should return broad age ranges rather than imply false precision.

Example:

**Cognitive Performance Age: 32–36**

not:

**33.4 years**

until the underlying validation supports that level of precision.

---

# 18. Assessment vs Training

This distinction is mandatory.

## Assessment Mode

Used for:

* Baseline
* Brain Score
* Domain scores
* Cognitive Performance Age
* Periodic reassessment

Assessment sessions must use:

* Controlled difficulty
* Controlled timing
* Comparable alternate forms
* Known scoring rules
* Device checks where relevant
* Limited retesting
* Practice-effect controls

## Training Mode

Used for:

* Daily engagement
* Improvement
* Adaptive difficulty
* Streaks
* Challenges
* Personalization

Training may:

* Become harder dynamically
* Offer different visual themes
* Create daily challenges
* Provide feedback
* Use increasingly difficult variations

Training scores do NOT automatically update Cognitive Performance Age.

---

# 19. Practice Effects

Repeated testing creates a major measurement problem.

Users can become better at a game simply because they have learned the game.

Therefore:

### Requirements

Maintain multiple equivalent stimulus sets.

Randomize stimuli.

Avoid repeating exact assessment sequences.

Track:

* Number of previous attempts
* Time since previous assessment
* Exposure to related training
* Historical performance

Controlled reassessment should generally occur periodically rather than every day.

Initial product target:

**Full reassessment approximately every 2–4 weeks.**

Exact intervals may change following validation.

---

# 20. Confidence Score

MindSpan should maintain an internal **measurement confidence** value.

Confidence should increase when:

* More domains have valid measurements
* Multiple games support the same domain
* Results are internally consistent
* Sufficient observations exist
* Device/input quality is acceptable

Confidence should decrease when:

* Assessment is incomplete
* Results are highly inconsistent
* Extreme outliers occur
* Device/input anomalies occur
* The user repeatedly interrupts assessments

Possible user-facing expression:

**Cognitive Profile Confidence: High**

rather than exposing a complicated statistical number.

---

# 21. Daily Experience

Users should NOT play all 13 games every day.

Recommended daily session:

**3–5 games**

approximately:

**5–10 minutes**

MindSpan should rotate games across cognitive domains.

Example:

### Monday

Peripheral Pulse
Memory Ladder
Name & Face
Sequence Detective

### Tuesday

Switchboard
Target Hunt
Spatial Sequence
Word Connections

### Wednesday

Signal Stop
Mind Rotate
Word Vault
Plan Ahead

The scheduling engine should prioritize:

1. Domain coverage
2. Weak domains
3. Time since last training
4. Variety
5. User performance
6. Fatigue avoidance

---

# 22. Cognitive Profile Completion

The expanded battery allows MindSpan to introduce a useful onboarding/retention mechanic.

Example:

**Your Cognitive Profile is 54% complete.**

As sufficient measurements are collected across domains:

**72% complete**

**89% complete**

**Full Cognitive Profile unlocked**

Completion must represent actual measurement coverage rather than arbitrary engagement.

A profile should not display high confidence until enough domains have been assessed.

---

# 23. Personalization

Once a baseline exists, the training engine can determine:

**Strongest Domains**

Example:

Processing Speed
Reasoning

**Opportunity Areas**

Example:

Working Memory
Cognitive Flexibility

MindSpan then adjusts the training mixture.

Example:

Normal allocation:

50% balanced cognition
50% personalized

Possible personalized allocation:

30% weak domains
20% strong domains
50% rotating general cognition

Exact percentages should be experimented with rather than hard-coded as scientific claims.

---

# 24. Required Game Data Model

Every completed game session should capture at minimum:

* user_id
* game_id
* game_version
* session_type
* assessment_version
* cognitive_domain
* cognitive_subdomain
* started_at
* completed_at
* device_type
* input_type
* difficulty_level
* raw_metrics
* normalized_game_score
* validity_status
* interruption_status
* practice_exposure_count

`session_type` must distinguish:

* assessment
* training

`validity_status` should support:

* valid
* questionable
* invalid

Game/version data is critical because changing timing, stimuli or difficulty can change the meaning of the score.

---

# 25. Algorithm Requirement for Every New Game

Engineering must not ship a cognitive game unless the following are defined:

1. Cognitive construct being measured
2. Primary scoring domain
3. Raw metrics
4. Difficulty model
5. Accuracy calculation
6. Speed calculation, if relevant
7. Error calculation
8. Consistency calculation
9. Normalization method
10. Assessment rules
11. Training rules
12. Invalid-session criteria
13. Practice-effect strategy
14. Minimum data needed for scoring
15. Game version

A game without these definitions is an engagement game, not a MindSpan cognitive measurement.

---

# 26. What We WILL Do

We will:

* Build 13 core cognitive games.
* Cover major cognitive-performance domains.
* Give every game a scientifically grounded cognitive purpose.
* Maintain separate assessment and training experiences.
* Normalize game measurements before combining them.
* Aggregate games into cognitive domains.
* Use domain scores for the overall Cognitive Score.
* Use controlled assessments for Cognitive Performance Age.
* Store granular raw measurements.
* Track practice exposure.
* Use alternate stimuli.
* Track assessment confidence.
* Adapt daily training to the individual.
* Version game logic and scoring algorithms.
* Build the system so future normative models can replace provisional scoring without rebuilding the games.

---

# 27. What We WILL NOT Do

We will not:

* Claim MindSpan diagnoses cognitive impairment.
* Claim the app replaces neuropsychological assessment.
* Describe Brain Age as biological brain age.
* Calculate Brain Age directly from daily game scores.
* Let the number of games in a domain determine that domain's importance.
* Reward speed while ignoring accuracy.
* use one universal scoring formula blindly across every game.
* Show all 13 games every day.
* repeatedly administer identical assessment stimuli.
* change scoring algorithms without versioning them.
* use engagement metrics such as streaks as cognitive measurements.
* infer cognitive decline from one poor session.
* claim that improvement in a trained game automatically means broad cognitive improvement.
* introduce more cognitive domains merely because a new game measures a slightly different ability.

---

# 28. Build Priority

Build the eight new games in this order:

### Phase 1 — Fill the largest measurement gaps

**6. Switchboard**
Cognitive Flexibility

**7. Name & Face**
Episodic Memory

**8. Spatial Sequence**
Visuospatial Working Memory

**9. Target Hunt**
Selective Attention / Processing Speed

These dramatically improve coverage.

### Phase 2 — Increase breadth

**10. Mind Rotate**
Visuospatial Reasoning

**11. Word Vault**
Verbal Learning + Delayed Memory

### Phase 3 — Complete broad cognitive profile

**12. Word Connections**
Semantic / Language

**13. Plan Ahead**
Planning / Executive Reasoning

---

# 29. Definition of Done

The 13-game cognitive battery is complete when:

* Every game measures a defined cognitive construct.
* Every game has a defined primary algorithm domain.
* Every game generates standardized raw metrics.
* Assessment and training modes are separated.
* All seven top-level cognitive domains receive measurement.
* Cognitive Profile identifies domain strengths and opportunities.
* Brain Score aggregates domains rather than individual games.
* Cognitive Performance Age uses controlled assessment data.
* Practice exposure is recorded.
* Game/scoring versions are recorded.
* Invalid sessions can be excluded.
* Multiple games provide evidence for the major domains.
* The system supports future age-based normative scoring without changing the game architecture.

---

# 30. Final Product Model

MindSpan should ultimately think of itself as having three layers:

### Layer 1 — 13 Cognitive Games

The experiences users interact with.

### Layer 2 — 7 Cognitive Scores

Processing Speed
Attention / Inhibition
Working Memory
Episodic Memory
Verbal / Language
Reasoning
Cognitive Flexibility

### Layer 3 — MindSpan Cognitive Profile

Overall Cognitive Score
Cognitive Performance Age
Domain strengths
Opportunity areas
Longitudinal change
Measurement confidence

The key architecture is:

**13 games → 7 cognitive domains → 1 cognitive profile**

That model should remain stable even if MindSpan eventually contains 20, 30 or 50 game variations.
