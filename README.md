# ⚔️ LoL Teamfight Simulator

A **League of Legends Teamfight Simulator** built with Vue 3 + TypeScript + Vite.  
Simulate 5v5 teamfights using real champion data fetched from the Riot Data Dragon API.

> 🚀 **v1.0.0** — Reorganized stable release!

---

## ✨ Features

- 🧙 Pick champions for both teams (Blue & Red side)
- 📊 Simulate teamfights based on real champion stats (HP, armor, MR, AD, AP...)
- 🔁 Run multiple simulations and track win rates
- 🌐 Champion data fetched from the official Riot Data Dragon API
- 🎨 Modern dark UI with LoL-inspired aesthetic

---

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Pinia](https://pinia.vuejs.org/) (state management)
- [Vue Router](https://router.vuejs.org/)
- [Riot Data Dragon API](https://developer.riotgames.com/docs/lol#data-dragon)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)

### Install & Run

```sh
pnpm install
pnpm dev
```

### Build for Production

```sh
pnpm build
```

### Lint

```sh
pnpm lint
```

---

## 📁 Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Vue components
├── router/        # Vue Router config
├── services/      # Modular business logic & API services
├── stores/        # Pinia stores
├── types/         # TypeScript types
└── views/         # Page views
scripts/           # Utility scripts (e.g. data fetching)
public/            # Static public assets
out/               # Pre-fetched champion data
```

---

## 📋 Champion Progress Tracker

Use this checklist to track champion data validation, custom spell formulas, and simulation support status.

### Completed Champions
- [x] **Aatrox** — Spells parsed, dynamic E omnivamp healing scaling on bonus HP resolved, passive formatted.

### Pending Champions (Work in Progress / To Be Validated)
- [ ] Ahri
- [ ] Akali
- [ ] Amumu
- [ ] Annie
- [ ] Ashe
- [ ] *The remaining 160+ champions from Data Dragon*

---

## 🔮 Runes Implementation Status

Status tracker for rune mechanics, stats, proc logic, and combat log integration.

### 🟡 Precision Tree
- [x] **Press the Attack** — 3-hit proc bonus damage (40–180 scaling with level) + 8% Exposed damage multiplier on target & combat log badge (`🎯 PtA EXPOSED`).
- [x] **Lethal Tempo** — Attack Speed stacking per hit (+5% to +16% per stack at max 6 stacks) + bonus adaptive on-hit damage at max stacks & combat log badge (`⚡ Lethal Tempo`).
- [x] **Conqueror** — Adaptive Force (AD/AP) per stack (up to 12 stacks) + bonus Omnivamp at max stacks (5% ranged / 8% melee) & combat log badge (`⚡ Conqueror`).
- [x] **Legend: Haste** — Grants +15 Basic Ability Haste.
- [x] **Legend: Alacrity** — Grants +18% Attack Speed.
- [x] **Legend: Bloodline** — Grants +5% Life Steal & +85 max HP.
- [x] **Coup de Grace** — +8% damage bonus to targets below 40% HP & combat log badge (`🗡️ Coup de Grace`).
- [x] **Cut Down** — +8% damage bonus to targets above 60% HP & combat log badge (`🩸 Cut Down`).
- [x] **Last Stand** — Scaling damage bonus (5% to 11%) while attacker is below 60% HP & combat log badge (`🛡️ Last Stand`).
- [ ] *Fleet Footwork* — Not simulated / Pending
- [ ] *Presence of Mind* — Not simulated / Pending
- [ ] *Triumph* — Not simulated / Pending
- [ ] *Absorb Life* — Not simulated / Pending

### 🔴 Domination Tree
- [x] **Electrocute** — 3 unique hits within 3s trigger bonus adaptive damage (50–190 + 40% bonus AD / 25% AP) & combat log badge (`⚡ ELECTROCUTE PROC`).
- [x] **Dark Harvest** — Damaging champions below 50% HP triggers bonus adaptive damage (20–60 + 9 per soul stack + 10% bonus AD / 5% AP) & combat log badge (`💀 DARK HARVEST PROC`).
- [x] **Hail of Blades** — Grants +110% (Melee) / +80% (Ranged) bonus Attack Speed for the first 3 attacks & combat log badge (`🗡️ Hail of Blades`).
- [x] **Eyeball Collection / Zombie Ward / Ghost Poro** — Grants +30 AP or +18 AD adaptive force.
- [ ] *Predator* — Pending
- [ ] *Cheap Shot / Taste of Blood / Sudden Impact* — Pending
- [ ] *Treasure / Relentless / Ultimate Hunter* — Pending

### 🔵 Sorcery Tree
- [x] **Absolute Focus** — Adaptive Force scaling with level when above 70% HP (+1.8 to +18 AP / +1.08 to +10.8 AD).
- [x] **Gathering Storm** — Adaptive Force scaling at level thresholds (6, 11, 16).
- [x] **Celerity** — +1% Movement Speed bonus.
- [x] **Transcendence** — +10 Ability Haste at level 8+.
- [ ] *Arcane Comet / Phase Rush / Summon Aery* — Pending
- [ ] *Nullifying Orb / Manaflow Band / Nimbus Cloak* — Pending
- [ ] *Scorch / Waterwalking* — Pending

### 🟢 Resolve Tree
- [x] **Conditioning** — +8 flat Armor/MR + 3% bonus defense multiplier at level 12+.
- [x] **Overgrowth** — +3.5% total HP multiplier.
- [ ] *Grasp of the Undying / Aftershock / Guardian* — Pending
- [ ] *Demolish / Font of Life / Shield Bash* — Pending
- [ ] *Second Wind / Bone Plating / Revitalize / Unflinching* — Pending

### ⚪ Inspiration Tree
- [x] **Magical Footwear** — +10 flat Movement Speed.
- [ ] *Glacial Augment / First Strike* — Pending
- [ ] *Hextech Flashtraption / Magical Footwear / Triple Tonic* — Pending
- [ ] *Future's Market / Minion Dematerializer / Biscuit Delivery* — Pending
- [ ] *Cosmic Insight / Approach Velocity / Jack of all Trades* — Pending

---

## 📜 License

MIT — feel free to fork and experiment!
