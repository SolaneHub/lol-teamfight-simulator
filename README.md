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

## 📜 License

MIT — feel free to fork and experiment!
