# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
