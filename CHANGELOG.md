# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-09-09

### Added
- **Unified Draft & Workshop View**: Merged the Draft Simulator and Build Workbench into a unified, seamless "Draft & Workshop" experience with slot assignment, picking mode, and quick unassignment.
- **Search Bar Clear Button**: Added an instant `✕` button to clear champion search filters in workshop and browser views.
- **Champion Name Marquee Animation**: Implemented continuous horizontal marquee scrolling on hover for champion portraits with names longer than 6 characters.
- **Untested Champion Grayscale Indicator**: Added visual status differentiation rendering untested champions in grayscale (`grayscale contrast-125 brightness-90`) and tested champions in vibrant full color.
- **Champion Implementation Registry**: Created `championStatusService` centralizing verification status and test suites for all champions.
- **Real-Time Combat Simulation Engine**: Implemented simulation engine (`combatSimulationService`) with customizable test durations (1–20s), spell cooldown enforcement, ticking DoTs, armor/MR shred stacking, and item passives.
- **Item Passives Expansion**: Added combat simulation support for Immolate auras (Sunfire Aegis, Hollow Radiance), Hatefog pool (Malignance), and burn DoTs (Fated Ashes).
- **Comprehensive Documentation Matrices**: Added complete tracking registries under `docs/status/`:
  - `docs/status/champions.md`: Tracks all 173 champions broken down by Passive, Q, W, E, R with native HTML checkboxes.
  - `docs/status/items.md`: Tracks all 203 items categorized into Unique, Starter, Basic, Epic, and Legendary tiers.
- **Modernized README Dashboard**: Updated `README.md` with an overview table linking directly to documentation matrices.

### Fixed & Styled
- **Slot Card Interaction & Selection Styling**: Harmonized draft slot card borders, eliminated dashed borders and opacity jumps, and centered vector SVG `+` and `✕` icons.
- **Rune Selection Circle Animations**: Fixed visual jumping in `RuneBuilderModal.vue` by keeping constant 2px borders and adding glowing concentric rings per rune tree.

---

## [1.2.1] - 2026-09-08

### Added
- **Patch 16.17.1 Assets**: Updated Data Dragon and Community Dragon game assets for patch 16.17.1.
- **Customizer Enhancements**: Added Mid quest toggle, level 19–20 stats extrapolation, and Heal/Shield power scaling.
- **Unified Pipeline Script**: Added `scripts/pipeline.cjs` for automated patch data fetching and semantic diff analysis.

### CI / CD
- **Decoupled Workflows**: Split patch updates into `patch-update.yml` and dedicated GitHub Pages deployment into `deploy.yml`.
- **Fast Deployments**: Optimized GitHub Pages deployment to run on Ubuntu with `pnpm 10` and frozen lockfiles.

---

## [1.2.0] - 2026-09-04

### Added
- **Automated Patch Pipeline & Semantic Diff**: Added `diff-patch.cjs` to categorize patch updates into safe numeric changes vs reworks/mechanic changes.
- **GitHub Action Automation**: Integrated complete patch update & deploy workflow (`deploy.yml`) with automated test runs, artifact upload, and automated Pull Requests on safe diff reports.
- **DDragon Offline Sync Utility**: Added `sync-ddragon.cjs` downloading deterministic, frozen JSON files (`championFull`, `item`, `runesReforged`).
- **Headless CDragon Downloader**: Replaced manual binaries with `scripts/download-cdragon.ps1` that automatically downloads and manages `snip-snip` without committing executables.
- **Blackfire Torch Stack Calculations**: Integrated dynamic AP escalation based on maximum ability targets hit in `CalculatorView.vue`.

### Changed / Refactored
- **Public Directory Reorganization**: Centralized static assets cleanly under `public/`:
  - `public/cdragon/`: Community Dragon game data and 2D assets.
  - `public/ddragon/`: Frozen Data Dragon JSON assets per patch version.
  - `public/data/`: Generated spell formulas and HUD mappings.
- **Vite Configuration Streamlining**: Removed manual stream file-serving and directory copy plugins in `vite.config.ts`, delegating asset serving natively to Vite.
- **Repository Cleanup**: Removed deprecated `snip-snip-win-x64/` directory and obsolete `update-patches.yml` workflow.

### Fixed
- **Patch Selector Version Format**: Resolved 404 network failure on patch switching by transmitting valid semantic patch versions (`16.16.1`) while displaying short labels (`16.16`).
- **Offline Patch Switching**: Enabled instant fallback to local `public/ddragon/{patch}` assets for champions and items.

---

## [1.1.0] - 2026-08-04

### Added
- **Dynamic Multi-Patch Selection**: Dynamic loading of the latest patch and top 3 previous versions from Riot's API in a clean dropdown.
- **Auto-Updater Patch Workflow**: Automated weekly GitHub Actions patch workflow for regenerating spell formulas.
- **Improved Formula Parser**: Summation support for composite formula parts in `generate-spell-formulas.cjs`.
- **Aatrox E Omnivamp Scaling**: Full support for Aatrox E healing scaling dynamically on bonus HP.
- **Dynamic Formatting**: Smart health-scaling ratios formatting as `per 100 health` to match official LoL descriptions.

---

## [1.0.5] - 2026-07-31

### Added
- **Dynamic Spell Damage Engine**: Implemented spell calculator executing formulas from CDragon and DDragon data.
- **Dynamic Execute Scaling**: Integrated target HP execute scaling (e.g. Amumu W) and stats-based modifiers in simulation.
- **Modular Item Passives Service**: Added `itemPassiveService` resolving stats, burns (Liandry/Blackfire), and resistance shreds.

### Tested
- **Level Scaling Test Suite**: Added a comprehensive test suite verifying base stats scaling up to Level 18 for all 173 champions.

---

## [1.0.4] - 2026-07-28

### Added
- **Vite PWA Plugin**: Integrated Vite PWA plugin with runtime caching strategies for Riot Data Dragon and Community Dragon CDN resources.

### Refactored
- **CDN Migration**: Migrated all local Data Dragon JSON and image folders to fetch directly from Riot and Community Dragon CDNs to reduce project size.
- **Cleanup**: Removed unused local ddragon assets replaced by CDN.

---

## [1.0.3] - 2026-07-26

### Fixed
- **NaN Stats**: Resolved NaN calculations for armor, magic resistance, and attack speed on Level/Item customizer changes.
- **Item Procs**: Fixed Luden's Companion and Blackfire Torch interaction calculations.
- **ESLint Compliance**: Enforced strict ESLint rules and fixed Vite public imports.
- **UI Artifacts**: Removed white border artifacts by replacing invalid `border-slate-850` with `border-slate-800`.

### Refactored
- **Strict TypeScript Types**: Eliminated multiple `any` occurrences across data stores and services for type safety.

---

## [1.0.2] - 2026-07-24

### Added
- **Seraphine Passive double-cast**: Implemented Echo passive double cast logic in combat simulation.
- **Aatrox Specific Mechanics**: Added Q sequence escalation (Q1, Q2, Q3) with sweetspot multipliers.
- **Muramana Shock**: Added shock on-hit physical damage scaling on Mana in calculation.

### Style
- **Team Splash Arts**: Flipped Blue Team splash images to face right and Red Team to face left.
- **Adaptive Containers**: Equalized containers height in Teamfight Action Creator.
- **Navbar Layout**: Centered desktop navigation links in the header.
- **Responsive Draft Grid**: Configured draft slots to fit dynamically with flex-wrap and responsive font sizes.

---

## [1.0.1] - 2026-07-23

### Fixed
- **GitHub Pages Routing**: Switched to Vue Router Hash Mode and prepended `BASE_URL` to public assets fetching.

### Added
- **CI/CD Deployment**: Setup GitHub Pages CI/CD deploy workflow.

---

## [1.0.0] - 2026-07-22

### Added
- **Initial Release**: Comprehensive 5v5 teamfight simulator for League of Legends.
- **Vue 3 & TypeScript**: Core setup configured with Vite and Tailwind CSS.
- **Vue Router**: Client-side page navigation mapping the Draft Simulator (`/`) and Build Workbench (`/workbench`).
- **Pinia State Management**: Global stores (`ddragon` and `draft`) for loading Riot game data and handling draft slot configurations.
- **Modular Architecture**: Reorganized services and type definitions categorized into modular packages (`champions`, `items`, `runes`, `draft`).
- **Interactive Workbench**: Customizer view enabling levels selection, items selection (including Ornn masterworks), rune setups, and calculated stat overlays.
- **Unit Tests**: Full unit test coverage verifying champion stats overlays and inventory build logic.
