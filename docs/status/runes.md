# 🔮 Runes & Keystones Implementation Tracking

This document tracks the implementation, active formulas, combat triggers, and status for Runes and Keystones in the **LoL Teamfight & Damage Simulator**.

---

## 🎯 Legend

| Checkbox | Status | Description |
| :---: | :--- | :--- |
| `- [x]` | **Implemented / Verified** | Full dynamic damage formulas, stacking buffs, or trigger conditions active in calculator and combat simulation engine. |
| `- [ ]` | **Pending / Backlog** | Rune stats baseline loaded from CDragon/DDragon; custom combat trigger logic pending. |

---

## 📊 Summary Progress

| Tree | Keystones Implemented | Minor Runes Implemented | Total Verified |
| :--- | :---: | :---: | :---: |
| **Precision** | 3 / 4 (PtA, LT, Conqueror) | 3 (Coup de Grace, Cut Down, Last Stand) | 6 |
| **Domination** | 3 / 4 (Electrocute, Dark Harvest, HoB) | 1 (Cheap Shot) | 4 |
| **Sorcery** | 1 / 4 (Deathfire Touch) | 0 | 1 |
| **Inspiration** | 1 / 3 (First Strike) | 0 | 1 |
| **Resolve** | 0 / 3 | 0 | 0 |
| **TOTAL** | **8 Keystones** | **4 Minor Runes** | **12** |

---

## 1. Keystones

### Precision
- [x] **Press the Attack (PtA)** (`8005`) — 3 basic attack stacks -> burst proc damage + 8% damage amplification exposure.
- [x] **Lethal Tempo** (`8008`) — Attack speed stacking on-hit (up to 6 stacks) + max-stacks on-hit bonus physical damage.
- [x] **Conqueror** (`8010`) — Adaptive force stacking on spell/attack hits (up to 12 stacks; 2 for melee, 1 for ranged).
- [ ] **Fleet Footwork** (`8021`) — Energized movement heal & MS pending.

### Domination
- [x] **Electrocute** (`8112`) — 3 separate attacks or spells -> adaptive burst damage (level + 40% bAD / 25% AP).
- [x] **Dark Harvest** (`8128`) — Damaging a champion below 50% HP -> adaptive burst damage.
- [x] **Hail of Blades** (`9923`) — 3 rapid basic attacks at elevated attack speed.
- [ ] **Predator** (`8124`) — Active boot enchantment burst pending.

### Sorcery
- [x] **Deathfire Touch** (`8992`) — Damaging abilities burn for 3-12 + 2.5% AP + 7% bAD magic damage/s (2s AoE / 4s Single Target). Amplified by **+75%** after 3 seconds of continuous burn.
- [ ] **Arcane Comet** (`8229`) — Skillshot comet projectile burst on ability hit pending.
- [ ] **Summon Aery** (`8214`) — Offensive damage / Defensive shielding pet pending.
- [ ] **Phase Rush** (`8230`) — 3 hit movement speed & slow resistance pending.

### Inspiration
- [x] **First Strike** (`8351`) — Initiating champion combat grants 7% bonus true damage.
- [ ] **Glacial Augment** (`8358`) — Immobilize slow beams & damage reduction pending.
- [ ] **Unsealed Spellbook** (`8360`) — Summoner spell swapping pending.

### Resolve
- [ ] **Grasp of the Undying** (`8437`) — In-combat empowered attack heal + max HP pending.
- [ ] **Aftershock** (`8439`) — CC resist burst + AoE explosion pending.
- [ ] **Guardian** (`8465`) — Ally protection shield threshold pending.

---

## 2. Minor Runes Active in Simulation

- [x] **Coup de Grace** (`8014`) — +8% damage to champions below 40% HP.
- [x] **Cut Down** (`8017`) — +8% damage to champions with >60% max HP.
- [x] **Last Stand** (`8299`) — +5% to +11% bonus damage while below 60% HP (max at 30% HP).
- [x] **Cheap Shot** (`8126`) — Bonus true damage upon damaging movement-impaired enemies.
