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
| **Precision** | 4 / 4 (PtA, LT, Conqueror, Fleet) | 6 (CdG, Cut Down, Last Stand, Absorb Life, Triumph, PoM, Legends) | 10 |
| **Domination** | 3 / 4 (Electrocute, Dark Harvest, HoB) | 4 (Cheap Shot, Taste of Blood, Sudden Impact, Eyeball/Wards) | 7 |
| **Sorcery** | 4 / 4 (DFT, Comet, Aery, Phase Rush) | 5 (Scorch, Gathering Storm, Absolute Focus, Transcendence, Axiom) | 9 |
| **Inspiration** | 2 / 3 (First Strike, Glacial Augment) | 3 (Biscuit Delivery, Jack of All Trades, Magical Footwear) | 5 |
| **Resolve** | 3 / 3 (Grasp, Aftershock, Guardian) | 6 (Shield Bash, Bone Plating, Second Wind, Font of Life, Overgrowth, Conditioning) | 9 |
| **TOTAL** | **16 Keystones** | **24 Minor Runes** | **40** |

---

## 1. Keystones

### Precision
- [x] **Press the Attack (PtA)** (`8005`) — 3 basic attack stacks -> burst proc damage + 8% damage amplification exposure.
- [x] **Lethal Tempo** (`8008`) — Attack speed stacking on-hit (up to 6 stacks) + max-stacks on-hit bonus physical damage. Interactive stack input configurable in Customizer.
- [x] **Conqueror** (`8010`) — Adaptive force stacking on spell/attack hits (up to 12 stacks; 2 for melee, 1 for ranged) + 8% (melee) / 5% (ranged) omnivamp healing at max stacks (`⚔️ Conq Vamp`). Interactive stack input configurable in Customizer.
- [x] **Fleet Footwork** (`8021`) — Energized basic attack heal (`⚡ Fleet (+Heal)`) based on Level, AP, and bonus AD.

### Domination
- [x] **Electrocute** (`8112`) — 3 separate attacks or spells -> adaptive burst damage (`⚡ Electrocute`).
- [x] **Dark Harvest** (`8128`) — Damaging an enemy below 50% HP deals adaptive burst damage scaling with level, AP, bonus AD, and configurable soul stacks (`💀 Dark Harvest (Nx)`). Interactive stack input configurable in Customizer.
- [x] **Hail of Blades** (`9923`) — 3 rapid basic attacks at elevated attack speed.
- [ ] **Predator** (`8124`) — Removed in Patch 14.10.

### Sorcery
- [x] **Deathfire Touch** (`8992`) — Damaging abilities burn for 3-12 + 2.5% AP + 7% bAD magic damage/s (2s AoE / 4s Single Target). Amplified by **+75%** after 3 seconds of continuous burn.
- [x] **Arcane Comet** (`8229`) — Damaging an enemy with an ability hurls an adaptive comet burst (`☄️ Arcane Comet`), with cooldown reduced on subsequent ability hits.
- [x] **Summon Aery** (`8214`) — Damaging an enemy sends Aery dealing adaptive damage (`🕊️ Aery (+Dmg)`), or shielding/healing an ally shields them (`🕊️ Aery (+Shield)`).
- [x] **Phase Rush** (`8230`) — 3 separate attacks or spells within 4s grant movement speed burst (`💨 Phase Rush (+MS)`).

### Inspiration
- [x] **First Strike** (`8351`) — Initiating champion combat grants 7% bonus true damage during damage window.
- [x] **Glacial Augment** (`8358`) — Immobilizing an enemy champion triggers freezing rays reducing enemy damage dealt by 15% (`❄️ Glacial Augment (-15% Dmg)`).
- [ ] **Unsealed Spellbook** (`8360`) — Summoner spell swapping out of combat.

### Resolve
- [x] **Grasp of the Undying** (`8437`) — In combat, empowered basic attacks deal max HP magic damage and heal (`✊ Grasp (+Dmg)`). Permanent HP bonus scaling with user-configured stacks (`+7 HP` melee / `+4 HP` ranged per stack) active in stat calculations. Interactive stack input configurable in Customizer.
- [x] **Aftershock** (`8439`) — Immobilizing an enemy champion grants +35 (+80% bonus armor/MR) resistances (`💥 Aftershock (+Resist)`), followed by a delayed AoE explosion dealing magic damage (`💥 Aftershock Detonation`).
- [x] **Guardian** (`8465`) — Taking heavy damage or dropping below 70% HP grants a shield to champion and nearest ally (`🛡️ Guardian (+Shield)`).

---

## 2. Minor Runes Active in Simulation & Calculator

### Precision
- [x] **Coup de Grace** (`8014`) — +8% damage to champions below 40% HP (`🗡️ CdG (+8%)`).
- [x] **Cut Down** (`8017`) — +8% damage to champions with >60% max HP (`🩸 Cut Down (+8%)`).
- [x] **Last Stand** (`8299`) — +5% to +11% bonus damage while below 60% HP (`🛡️ Last Stand (+X%)`).
- [x] **Absorb Life** (`9101`) — Champion takedown heals for flat + level-scaling HP (`🩸 Absorb Life (+Heal)`).
- [x] **Triumph** (`9111`) — Champion takedown heals for 2.5% max HP + 20 flat HP (`🏆 Triumph (+Heal)`).
- [x] **Presence of Mind** (`8009`) — Damaging and killing enemy champions restores mana/energy (`⚡ PoM (+15% Mana)`).
- [x] **Legend: Alacrity** (`9104`) — Configurable stack input granting attack speed up to 18%.
- [x] **Legend: Bloodline** (`9103`) — Configurable stack input granting lifesteal + 85 HP at max stacks.
- [x] **Legend: Haste** (`9105`) — Configurable stack input granting basic ability haste up to 15 AH.

### Domination
- [x] **Cheap Shot** (`8126`) — Bonus true damage upon damaging movement-impaired enemies (`🎯 Cheap Shot`).
- [x] **Taste of Blood** (`8139`) — Damaging an enemy champion heals based on Level, AP, and bonus AD (`🩸 Taste of Blood (+Heal)`).
- [x] **Sudden Impact** (`8143`) — Damaging an enemy champion deals bonus true damage (`🗡️ Sudden Impact`).
- [x] **Eyeball Collection / Ghost Poro / Zombie Ward** — Configurable stack input granting adaptive force (+30 AP / +18 AD at 10 stacks).

### Sorcery
- [x] **Scorch** (`8237`) — Damaging abilities burn champion for bonus magic damage (`🔥 Scorch`).
- [x] **Gathering Storm** (`8237`) — Configurable game time in minutes granting escalating AP / AD every 10 minutes.
- [x] **Absolute Focus** (`8233`) — Grants bonus adaptive force while above 70% HP.
- [x] **Transcendence** (`8210`) — Grants ability haste at levels 5 and 8.
- [x] **Axiom Arcanist** — Ultimate cast empowerment badge (`🌌 Axiom Arcanist`).

### Inspiration
- [x] **Biscuit Delivery** (`8345`) — Consumes biscuit when dropping below 50% HP to restore 8% missing HP (`🍪 Biscuit (+Heal)`).
- [x] **Jack of All Trades** (`8306`) — Configurable stack input granting ability haste and adaptive force milestones at 5 and 10 stacks.
- [x] **Magical Footwear** (`8304`) — Grants +10 bonus movement speed.

### Resolve
- [x] **Shield Bash** (`8401`) — Gaining a shield empowers the next basic attack with bonus adaptive damage based on bonus HP and shield amount (`🛡️ Shield Bash`).
- [x] **Bone Plating** (`8473`) — Taking damage blocks 30-60 damage on the next 3 incoming attacks/spells within 1.5s (`🦴 Bone Plating (-Block)`).
- [x] **Second Wind** (`8444`) — Taking damage regenerates 3 + 4% missing HP over time (`🍃 Second Wind (+Heal)`).
- [x] **Font of Life** (`8463`) — Impairing movement of enemies heals allies when attacking (`🌿 Font of Life (+Heal)`).
- [x] **Overgrowth** (`8451`) — Configurable stack input granting flat HP + 3.5% max HP multiplier at >= 15 stacks.
- [x] **Conditioning** (`8429`) — Grants +8 Armor/MR + 3% bonus resistances at level 12+.

---

## 3. Interactive Rune Stacks Controls (Customizer UI)

The Customizer panel (`src/views/CustomizerView.vue`) includes dedicated numeric input controls for all active stackable runes:
1. **Dark Harvest** (0–99 stacks)
2. **Grasp of the Undying** (0–99 stacks)
3. **Conqueror** (0–12 stacks)
4. **Lethal Tempo** (0–6 stacks)
5. **Legend: Alacrity** (0–10 stacks)
6. **Legend: Bloodline** (0–15 stacks)
7. **Legend: Haste** (0–10 stacks)
8. **Eyeball Collection / Ghost Poro / Zombie Ward** (0–10 stacks)
9. **Overgrowth** (0–50 stacks)
10. **Jack of All Trades** (0–10 stacks)
11. **Gathering Storm** (0–60 minutes)
