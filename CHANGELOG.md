# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-22

### Added
- **Initial Release**: Comprehensive 5v5 teamfight simulator for League of Legends.
- **Vue 3 & TypeScript**: Core setup configured with Vite and Tailwind CSS.
- **Vue Router**: Client-side page navigation mapping the Draft Simulator (`/`) and Build Workbench (`/workbench`).
- **Pinia State Management**: Global stores (`ddragon` and `draft`) for loading Riot game data and handling draft slot configurations.
- **Modular Architecture**: Reorganized services and type definitions categorized into modular packages (`champions`, `items`, `runes`, `draft`).
- **Interactive Workbench**: Customizer view enabling levels selection, items selection (including Ornn masterworks), rune setups, and calculated stat overlays.
- **Unit Tests**: Full unit test coverage verifying champion stats overlays and inventory build logic.
