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
docs/              # Project tracking & status matrices
└── status/        # Champions (173) & Items (203) implementation matrices
src/
├── assets/        # Static assets
├── components/    # Vue components
├── router/        # Vue Router config
├── services/      # Modular business logic, damage & simulation services
├── stores/        # Pinia stores
├── types/         # TypeScript types
└── views/         # Page views
scripts/           # Utility scripts
public/            # Static public assets (DDragon & CDragon data)
```

---

## 📊 Implementation & Tracking Dashboard

We maintain exhaustive implementation registries for champions, abilities, items, and runes:

| Category | Coverage | Detailed Tracking Registry |
| :--- | :---: | :--- |
| 🏆 **Champions & Abilities** | **18 / 173** (865 abilities tracked) | [docs/status/champions.md](docs/status/champions.md) |
| 📦 **Items Implementation** | **69 / 203** (Unique, Starter, Basic, Epic, Legendary) | [docs/status/items.md](docs/status/items.md) |
| 🔮 **Runes & Keystones** | **12 Verified** (Keystones & Combat Modifiers) | [docs/status/runes.md](docs/status/runes.md) |

> 🎨 **UI Rule**: Implemented champions appear in **full vibrant color** in the draft and builder grids; untested champions in the backlog are rendered in **grayscale** (`grayscale opacity-60`).


---

## 📜 License

MIT — feel free to fork and experiment!
