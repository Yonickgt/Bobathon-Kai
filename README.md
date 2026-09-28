# GitBattle ??

> **Learn Git by fighting bosses.** Answer Git questions correctly to deal damage. Wrong answers let the enemy hit back.

Built at **Bobathon** — a hackathon powered by [IBM Bob](https://www.ibm.com/products/bob), an AI coding assistant.

---

## What is GitBattle?

GitBattle is a browser-based learning game that teaches the entire Git ecosystem through a Pokemon-style battle system. Three difficulty tiers, three question formats, and a weakness tracker that remembers what you get wrong and trains you on it.

### How to play

1. Open `index.html` in any browser — no server, no install, no dependencies
2. Pick a tier
3. Answer Git questions before the 15-second timer runs out
4. Deal damage to the boss with correct answers — the faster you answer, the more damage you deal
5. Wrong answers or timeouts let the boss attack you back
6. Defeat the boss to win

---

## Tiers

| Tier | Boss | Question format | Topics |
|---|---|---|---|
| **Beginner** | ?? Noob Ghost | Type the answer | git init, clone, add, commit, push, .gitignore |
| **Intermediate** | ?? Merge Demon | Match scenario to command | Branches, merging, history, stash, remotes |
| **Experienced** | ?? Rebase Overlord | Type the exact command | Rebase, upstream, cherry-pick, reset --hard, tags |

---

## Battle Mechanics

### Damage scales with answer speed

| Answer window | Beginner | Intermediate | Experienced |
|---|---|---|---|
| 0 – 5 sec | 30 dmg + 15 HP | 40 dmg + 12 HP | 50 dmg + 10 HP |
| 5 – 10 sec | 20 dmg + 10 HP | 28 dmg + 8 HP | 35 dmg + 6 HP |
| 10 – 15 sec | 10 dmg + 5 HP | 15 dmg + 4 HP | 20 dmg + 3 HP |
| Timeout / Wrong | Boss attacks you | Boss attacks you | Boss attacks you |

### Combo system
3 correct answers in a row activates **COMBO ×2** — your next attack deals double damage.

### Weakness tracker
Every wrong answer is recorded by category in `localStorage`. The home screen shows your weakest areas. Hit **Train Weak Areas** to start an adaptive battle that only pulls questions from the categories you struggle with most.

---

## How Bob Built This

This project was built end-to-end during a Bobathon session using **IBM Bob**, an AI coding assistant embedded in the IDE. Here is exactly how Bob contributed:

### 1. Planning and architecture
Bob designed the full system architecture before writing a single line of code — breaking the project into 5 sub-tasks, defining the data shapes for questions and matching sets, designing the tier scaling table, and writing the full plan to `git-learning-game-plan.md`.

### 2. Parallel subagent builds
Bob used its **subagent** system to build two files simultaneously in isolated contexts:
- One subagent wrote the entire `questions.js` — 60 questions across 3 tiers and 15 Git categories
- Another subagent wrote the full `app.js` — every function in the battle engine, timer, HP system, matching logic, and localStorage tracker

While both subagents ran in parallel, Bob (as orchestrator) wrote `style.css` — the full dark terminal battle arena theme.

### 3. Bug audit
After the parallel build, Bob read all three files end-to-end and identified **8 bugs** before any code ran:
- Invalid CSS animation class names (`flash-green-self` ? `flash-green`)
- `animateSprite` called on an `<input>` element instead of a sprite
- Wrong CSS class name on a button (`btn-wrong` ? `btn-wrong-mark`)
- Double animation calls causing conflicting effects
- End-screen breakdown showing only question counts instead of correct/wrong split
- `state._resolving` and `state.perQResult` not reset between battles
- Timer ring had no colour feedback as time ran low

### 4. UX iteration
Based on feedback ("let me answer the question"), Bob refactored the beginner mode from a self-marking flashcard flip into a proper type-in answer box — matching the feel of the intermediate and experienced modes.

### 5. Git and deployment
Bob initialised the repo, wrote the `.gitignore` to only track the Bobathon folder, committed, and pushed to GitHub — all from natural language instructions.

---

## File structure

```
Bobathon/
+-- index.html      — game shell: home, battle arena, end screen
+-- style.css       — dark terminal theme, HP bars, animations
+-- questions.js    — 60 questions: QUESTIONS[] + MATCHING_SETS[]
+-- app.js          — battle engine, timer, damage calc, localStorage
```

---

## Skills used in Bob

Bob activated two skills during this session:

- **`design-taste-frontend`** — enforced anti-generic design decisions: dark terminal palette, no AI-purple gradients, proper typography contrast, consistent border-radius, and game-appropriate motion
- **`playwright-cli`** — used for browser automation and smoke-testing

---

## Built with

- **IBM Bob** — AI coding assistant (orchestrator + subagents)
- Vanilla HTML / CSS / JS — zero dependencies, zero build step
- `localStorage` — persistence for weakness tracking
- Bobathon 2025
