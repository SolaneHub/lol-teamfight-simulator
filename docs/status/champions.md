# 🏆 Champions Implementation & Abilities Tracking

This document tracks the implementation, custom combat mechanics, spell formulas, and verification status for all champions in the **LoL Teamfight & Damage Simulator**.
Every champion is broken down by their **Passive (P)** and each individual ability (**Q**, **W**, **E**, **R**).

---

## 🎨 UI Display Rules

- **Color (Vibrant Portraits)**: Champions that are **Tested / Implemented** (`- [x]` fully verified, partially implemented, or baseline tested in test suites).
- **Black & White (Grayscale `grayscale opacity-60`)**: Champions that are **Untested / In Backlog (`- [ ]`)** with no custom mechanics or verified test suites.

---

## 🎯 Legend

| Checkbox | Status | Description |
| :---: | :--- | :--- |
| `- [x]` | **Implemented / Verified** | Custom spell formula, dynamic HP/execute scaling, passive logic, or DoT mechanics fully active in simulation and calculator. |
| `- [ ]` | **Pending / Backlog** | Standard generic DDragon formula fallback; custom mechanics, execute amplifiers, or triggers in backlog. |

---

## 📊 Summary Progress

| Category | Champions Count | Implemented Abilities / Passives | Backlog Abilities / Passives | Total Monitored |
| :--- | :---: | :---: | :---: | :---: |
| **Implemented / Tested Roster** | 18 | 25 | 65 | 90 |
| **Untested / Backlog Roster** | 155 | 0 | 775 | 775 |
| **TOTAL** | **173** | **25** | **840** | **865** |

---

## 📋 Section 1: Active Implemented Champions (18 Champions)

### **Seraphine** (Mid / Support) — 🟢 Fully Implemented
*Test Suite: seraphine-complete-loadouts.test.ts, seraphine-optimizer.test.ts*

- [x] **Passive: Stage Presence** — Echo double-cast logic & Notes bonus damage
- [x] **Q: High Note** — Missing HP execution scaling (up to +75% bonus damage)
- [x] **W: Surround Sound** — Scaling shield & missing HP percentage heal
- [x] **E: Beat Drop** — Slow / Root / Stun CC progression
- [x] **R: Encore** — Charm CC & projectile hit extension

### **Aatrox** (Top) — 🟢 Fully Implemented
*Test Suite: champion-builds.test.ts, spell-calculator.test.ts, combat-simulation.test.ts*

- [x] **Passive: Deathbringer Stance** — 4%–12% target maximum HP bonus physical damage on-hit
- [x] **Q: The Darkin Blade** — 3-cast sequence with sweetspot 1.6x multiplier & progressive scaling
- [ ] **W: Infernal Chains** — Slow tether pull effect pending
- [ ] **E: Umbral Dash** — Passive omnivamp & dash reset pending
- [ ] **R: World Ender** — Bonus AD & increased healing self-buff pending

### **Jarvan IV** (Jungle) — 🟢 Fully Implemented
*Test Suite: spell-calculator.test.ts, combat-simulation.test.ts*

- [x] **Passive: Martial Cadence** — 8% target current HP on-hit bonus physical damage
- [x] **Q: Dragon Strike** — Armor shred calculation
- [x] **W: Golden Aegis** — Dynamic multi-enemy scaling shield
- [x] **E: Demacian Standard** — Attack speed aura & burst combo calculation
- [x] **R: Cataclysm** — Full physical burst damage calculation

### **Darius** (Top) — 🟢 Fully Implemented
*Test Suite: combat-simulation.test.ts*

- [x] **Passive: Hemorrhage** — 1–5 stack physical bleed DoT & Noxian Might (+bonus AD)
- [x] **Q: Decimate** — Outer blade hit amplification & healing logic
- [ ] **W: Crippling Strike** — Empowered auto-attack reset pending
- [ ] **E: Apprehend** — Passive armor penetration scaling pending
- [x] **R: Noxian Guillotine** — True damage execute scaling per Hemorrhage stack

### **Garen** (Top) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts, combat-simulation.test.ts*

- [ ] **Passive: Perseverance** — Out-of-combat HP regeneration passive pending
- [ ] **Q: Decisive Strike** — Movement speed & silence auto-attack pending
- [ ] **W: Courage** — Passive resists & damage reduction shield pending
- [ ] **E: Judgment** — Armor shred spin tick scaling pending
- [x] **R: Demacian Justice** — True damage execute scaling with 25% / 30% / 35% target missing HP

### **Veigar** (Mid) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts*

- [ ] **Passive: Phenomenal Evil Power** — Phenomenal Evil AP stacking passive pending
- [ ] **Q: Baleful Strike** — Double-hit skillshot pending
- [ ] **W: Dark Matter** — Cooldown reduction based on AP pending
- [ ] **E: Event Horizon** — Stun cage CC duration pending
- [x] **R: Primordial Burst** — Dynamic missing HP scaling (up to +100% bonus damage below 33% HP)

### **Jinx** (ADC) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts, champion-builds.test.ts*

- [ ] **Passive: Get Excited!** — Attack speed & movement speed steroid on takedown pending
- [ ] **Q: Switcheroo!** — Minigun attack speed ramp / Fishbones AoE mana cost pending
- [ ] **W: Zap!** — Zap physical damage & slow pending
- [ ] **E: Flame Chompers!** — Flame Chompers root traps pending
- [x] **R: Super Mega Death Rocket!** — Base damage + 25% / 30% / 35% missing HP physical execute damage

### **Akali** (Mid / Top) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts*

- [ ] **Passive: Assassin's Mark** — Ring passage & empowered auto-attack pending
- [ ] **Q: Five Point Strike** — Kunai throw slow at tip pending
- [ ] **W: Twilight Shroud** — Shroud stealth & energy restore pending
- [ ] **E: Shuriken Flip** — Shuriken flip dash & recast pending
- [x] **R: Perfect Execution** — R2 missing HP execute amplification (up to +200% bonus below 30% HP)

### **Riven** (Top) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts*

- [ ] **Passive: Runic Blade** — Runic Blade passive charge auto-attack scaling pending
- [ ] **Q: Broken Wings** — 3-cast sequence knockup pending
- [ ] **W: Ki Burst** — AoE stun burst pending
- [ ] **E: Valor** — AD-scaling dash shield pending
- [x] **R: Blade of the Exile** — Wind Slash (R2) execute amplification (up to +200% bonus below 25% HP)

### **Brand** (Support / Mid) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- [x] **Passive: Blaze** — Stacking magic DoT and 3-stack explosive AoE detonation in combat engine
- [ ] **Q: Sear** — Stun combo when ablaze pending
- [ ] **W: Pillar of Flame** — 25% bonus damage when ablaze pending
- [ ] **E: Conflagration** — Spread bounce when ablaze pending
- [ ] **R: Pyroclasm** — Multi-target bounce priority pending

### **Teemo** (Top) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- [ ] **Passive: Guerrilla Warfare** — Invisibility attack speed buff pending
- [ ] **Q: Blinding Dart** — Blind status duration pending
- [ ] **W: Move Quick** — Passive & active movement speed pending
- [x] **E: Toxic Shot** — On-hit poison magic damage DoT with continuous tick interval in combat engine
- [ ] **R: Noxious Trap** — Noxious Trap shroom mushroom bounce & explosion pending

### **Cassiopeia** (Mid) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- [ ] **Passive: Serpentine Grace** — Movement speed per level (no boots) passive pending
- [x] **Q: Noxious Blast** — Ticking poison magic damage DoT in combat simulation engine
- [ ] **W: Miasma** — Grounded zone & slow pending
- [ ] **E: Twin Fang** — Twin Fang amplified damage & heal on poisoned targets pending
- [ ] **R: Petrifying Gaze** — Petrifying Gaze stun/slow cone pending

### **Twitch** (ADC) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- [x] **Passive: Deadly Venom** — Stacking true damage DoT per auto-attack in combat simulation engine
- [ ] **Q: Ambush** — Camouflage stealth & attack speed pending
- [ ] **W: Venom Cask** — Venom Cask slow zone pending
- [ ] **E: Contaminate** — Contaminate physical/magic damage per stack pending
- [ ] **R: Spray and Pray** — Piercing bolt range & AD steroid pending

### **Malzahar** (Mid) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- [ ] **Passive: Void Shift** — Void Shift spell shield & CC immunity pending
- [ ] **Q: Call of the Void** — Silence beam dual portal pending
- [ ] **W: Void Swarm** — Voidling minion swarm summons pending
- [x] **E: Malefic Visions** — Continuous ticking magic damage DoT in combat simulation engine
- [ ] **R: Nether Grasp** — Nether Grasp suppression tether & null zone pending

### **Ahri** (Mid) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- [ ] **Passive: Essence Theft** — Essence Theft heal on takedown pending
- [ ] **Q: Orb of Deception** — Orb return true damage pending
- [ ] **W: Fox-Fire** — Fox-Fire homing flames pending
- [ ] **E: Charm** — Charm CC & damage amplifier pending
- [ ] **R: Spirit Rush** — Spirit Rush multi-dash recast pending

### **Malphite** (Top) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- [ ] **Passive: Granite Shield** — Granite Shield % max HP passive pending
- [ ] **Q: Seismic Shard** — Movement speed steal pending
- [ ] **W: Thunderclap** — Passive armor multiplier & thunderclap cone pending
- [ ] **E: Ground Slam** — Armor-scaling slam & attack speed slow pending
- [ ] **R: Unstoppable Force** — Unstoppable Force knockup burst pending

### **Zed** (Mid) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- [ ] **Passive: Contempt for the Weak** — Contempt for the Weak % max HP magic damage execute on low HP pending
- [ ] **Q: Razor Shuriken** — Razor Shuriken multi-hit reduction pending
- [ ] **W: Living Shadow** — Living Shadow swap & mimic pending
- [ ] **E: Shadow Slash** — Shadow Slash slow pending
- [ ] **R: Death Mark** — Death Mark pop delayed damage stored percentage pending

### **Thresh** (Support) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- [ ] **Passive: Damnation** — Damnation soul harvesting armor/AP stacking pending
- [ ] **Q: Death Sentence** — Death Sentence hook CC pending
- [ ] **W: Dark Passage** — Dark Passage lantern shield & ally pull pending
- [ ] **E: Flay** — Flay passive on-hit charge & knockback active pending
- [ ] **R: The Box** — The Box wall damage & 99% slow pending

---

## 🎯 Section 2: Upcoming Priority Roadmap Candidates

### **Vayne** (ADC) — ⚪ Prioritized Candidate
*Focus: W (Silver Bolts): % max HP true damage on every 3rd consecutive attack.*

- [ ] **Passive: Night Hunter** — Backlog
- [ ] **Q: Tumble** — Backlog
- [ ] **W: Silver Bolts** — Backlog
- [ ] **E: Condemn** — Backlog
- [ ] **R: Final Hour** — Backlog

### **Kog'Maw** (ADC) — ⚪ Prioritized Candidate
*Focus: W (Bio-Arcane Barrage): % max HP magic damage on-hit with bonus attack range.*

- [ ] **Passive: Icathian Surprise** — Backlog
- [ ] **Q: Caustic Spittle** — Backlog
- [ ] **W: Bio-Arcane Barrage** — Backlog
- [ ] **E: Void Ooze** — Backlog
- [ ] **R: Living Artillery** — Backlog

### **Syndra** (Mid) — ⚪ Prioritized Candidate
*Focus: Passive (Transcendent) splinters & R (Unleashed Power) dynamic sphere stacking damage.*

- [ ] **Passive: Transcendent** — Backlog
- [ ] **Q: Dark Sphere** — Backlog
- [ ] **W: Force of Will** — Backlog
- [ ] **E: Scatter the Weak** — Backlog
- [ ] **R: Unleashed Power** — Backlog

### **Fiora** (Top) — ⚪ Prioritized Candidate
*Focus: Passive (Duelist's Dance) & R (Grand Challenge): % max HP true damage vitals.*

- [ ] **Passive: Duelist's Dance** — Backlog
- [ ] **Q: Lunge** — Backlog
- [ ] **W: Riposte** — Backlog
- [ ] **E: Bladework** — Backlog
- [ ] **R: Grand Challenge** — Backlog

### **Kha'Zix** (Jungle) — ⚪ Prioritized Candidate
*Focus: Passive (Unseen Threat) & Q (Taste Their Fear) isolation multiplier.*

- [ ] **Passive: Unseen Threat** — Backlog
- [ ] **Q: Taste Their Fear** — Backlog
- [ ] **W: Void Spike** — Backlog
- [ ] **E: Leap** — Backlog
- [ ] **R: Void Assault** — Backlog

### **Kai'Sa** (ADC) — ⚪ Prioritized Candidate
*Focus: Passive (Second Skin): % missing HP plasma rupture on 5th hit & ability evolution thresholds.*

- [ ] **Passive: Second Skin** — Backlog
- [ ] **Q: Icathian Rain** — Backlog
- [ ] **W: Void Seeker** — Backlog
- [ ] **E: Supercharge** — Backlog
- [ ] **R: Killer Instinct** — Backlog

---

## 📋 Section 3: Full Champion Roster & Abilities Directory (173 Champions)

### **Aatrox** (Top) — 🟢 Fully Implemented
- [x] **Passive: Deathbringer Stance** — 4%–12% target maximum HP bonus physical damage on-hit
- [x] **Q: The Darkin Blade** — 3-cast sequence with sweetspot 1.6x multiplier & progressive scaling
- [ ] **W: Infernal Chains** — Slow tether pull effect pending
- [ ] **E: Umbral Dash** — Passive omnivamp & dash reset pending
- [ ] **R: World Ender** — Bonus AD & increased healing self-buff pending

### **Ahri** (Mid) — 🔵 Baseline Tested
- [ ] **Passive: Essence Theft** — Essence Theft heal on takedown pending
- [ ] **Q: Orb of Deception** — Orb return true damage pending
- [ ] **W: Fox-Fire** — Fox-Fire homing flames pending
- [ ] **E: Charm** — Charm CC & damage amplifier pending
- [ ] **R: Spirit Rush** — Spirit Rush multi-dash recast pending

### **Akali** (Mid / Top) — 🟡 Partially Implemented
- [ ] **Passive: Assassin's Mark** — Ring passage & empowered auto-attack pending
- [ ] **Q: Five Point Strike** — Kunai throw slow at tip pending
- [ ] **W: Twilight Shroud** — Shroud stealth & energy restore pending
- [ ] **E: Shuriken Flip** — Shuriken flip dash & recast pending
- [x] **R: Perfect Execution** — R2 missing HP execute amplification (up to +200% bonus below 30% HP)

### **Akshan** (Marksman / Assassin) — ⚪ In Backlog
- [ ] **Passive: Dirty Fighting** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Avengerang** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Going Rogue** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Heroic Swing** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Comeuppance** — Standard formula fallback; custom mechanics in backlog

### **Alistar** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Triumphant Roar** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Pulverize** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Headbutt** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Trample** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Unbreakable Will** — Standard formula fallback; custom mechanics in backlog

### **Ambessa** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Drakehound's Step** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Cunning Sweep / Sundering Slam** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Repudiation** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Lacerate** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Public Execution** — Standard formula fallback; custom mechanics in backlog

### **Amumu** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Cursed Touch** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bandage Toss** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Despair** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Tantrum** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Curse of the Sad Mummy** — Standard formula fallback; custom mechanics in backlog

### **Anivia** (Mage) — ⚪ In Backlog
- [ ] **Passive: Rebirth** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Flash Frost** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Crystallize** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Frostbite** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Glacial Storm** — Standard formula fallback; custom mechanics in backlog

### **Annie** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Pyromania** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Disintegrate** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Incinerate** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Molten Shield** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Summon: Tibbers** — Standard formula fallback; custom mechanics in backlog

### **Aphelios** (Marksman) — ⚪ In Backlog
- [ ] **Passive: The Hitman and the Seer** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Weapon Abilites** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Phase** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Weapon Queue System** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Moonlight Vigil** — Standard formula fallback; custom mechanics in backlog

### **Ashe** (Marksman / Support) — ⚪ In Backlog
- [ ] **Passive: Frost Shot** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Ranger's Focus** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Volley** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Hawkshot** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Enchanted Crystal Arrow** — Standard formula fallback; custom mechanics in backlog

### **Aurelion Sol** (Mage) — ⚪ In Backlog
- [ ] **Passive: Cosmic Creator** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Breath of Light** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Astral Flight** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Singularity** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Falling Star / The Skies Descend** — Standard formula fallback; custom mechanics in backlog

### **Aurora** (Mage / Assassin) — ⚪ In Backlog
- [ ] **Passive: Spirit Abjuration** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Twofold Hex** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Across the Veil** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: The Weirding** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Between Worlds** — Standard formula fallback; custom mechanics in backlog

### **Azir** (Mage / Marksman) — ⚪ In Backlog
- [ ] **Passive: Shurima's Legacy** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Conquering Sands** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Arise!** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Shifting Sands** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Emperor's Divide** — Standard formula fallback; custom mechanics in backlog

### **Bard** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Traveler's Call** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Cosmic Binding** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Caretaker's Shrine** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Magical Journey** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Tempered Fate** — Standard formula fallback; custom mechanics in backlog

### **Bel'Veth** (Fighter) — ⚪ In Backlog
- [ ] **Passive: Death in Lavender ** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Void Surge** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Above and Below** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Royal Maelstrom** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Endless Banquet** — Standard formula fallback; custom mechanics in backlog

### **Blitzcrank** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Mana Barrier** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Rocket Grab** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Overdrive** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Power Fist** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Static Field** — Standard formula fallback; custom mechanics in backlog

### **Brand** (Support / Mid) — 🟡 Partially Implemented
- [x] **Passive: Blaze** — Stacking magic DoT and 3-stack explosive AoE detonation in combat engine
- [ ] **Q: Sear** — Stun combo when ablaze pending
- [ ] **W: Pillar of Flame** — 25% bonus damage when ablaze pending
- [ ] **E: Conflagration** — Spread bounce when ablaze pending
- [ ] **R: Pyroclasm** — Multi-target bounce priority pending

### **Braum** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Concussive Blows** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Winter's Bite** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Stand Behind Me** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Unbreakable** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Glacial Fissure** — Standard formula fallback; custom mechanics in backlog

### **Briar** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Crimson Curse** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Head Rush** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Blood Frenzy / Snack Attack** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Chilling Scream** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Certain Death** — Standard formula fallback; custom mechanics in backlog

### **Caitlyn** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Headshot** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Piltover Peacemaker** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Yordle Snap Trap** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: 90 Caliber Net** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Ace in the Hole** — Standard formula fallback; custom mechanics in backlog

### **Camille** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Adaptive Defenses** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Precision Protocol** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Tactical Sweep** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Hookshot** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: The Hextech Ultimatum** — Standard formula fallback; custom mechanics in backlog

### **Cassiopeia** (Mid) — 🟡 Partially Implemented
- [ ] **Passive: Serpentine Grace** — Movement speed per level (no boots) passive pending
- [x] **Q: Noxious Blast** — Ticking poison magic damage DoT in combat simulation engine
- [ ] **W: Miasma** — Grounded zone & slow pending
- [ ] **E: Twin Fang** — Twin Fang amplified damage & heal on poisoned targets pending
- [ ] **R: Petrifying Gaze** — Petrifying Gaze stun/slow cone pending

### **Cho'Gath** (Tank / Mage) — ⚪ In Backlog
- [ ] **Passive: Carnivore** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Rupture** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Feral Scream** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Vorpal Spikes** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Feast** — Standard formula fallback; custom mechanics in backlog

### **Corki** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Hextech Munitions** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Phosphorus Bomb** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Valkyrie** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Gatling Gun** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Missile Barrage** — Standard formula fallback; custom mechanics in backlog

### **Darius** (Top) — 🟢 Fully Implemented
- [x] **Passive: Hemorrhage** — 1–5 stack physical bleed DoT & Noxian Might (+bonus AD)
- [x] **Q: Decimate** — Outer blade hit amplification & healing logic
- [ ] **W: Crippling Strike** — Empowered auto-attack reset pending
- [ ] **E: Apprehend** — Passive armor penetration scaling pending
- [x] **R: Noxian Guillotine** — True damage execute scaling per Hemorrhage stack

### **Diana** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Moonsilver Blade** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Crescent Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Pale Cascade** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Lunar Rush** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Moonfall** — Standard formula fallback; custom mechanics in backlog

### **Dr. Mundo** (Tank / Fighter) — ⚪ In Backlog
- [ ] **Passive: Goes Where He Pleases** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Infected Bonesaw** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Heart Zapper** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Blunt Force Trauma** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Maximum Dosage** — Standard formula fallback; custom mechanics in backlog

### **Draven** (Marksman) — ⚪ In Backlog
- [ ] **Passive: League of Draven** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Spinning Axe** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Blood Rush** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Stand Aside** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Whirling Death** — Standard formula fallback; custom mechanics in backlog

### **Ekko** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Z-Drive Resonance** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Timewinder** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Parallel Convergence** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Phase Dive** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Chronobreak** — Standard formula fallback; custom mechanics in backlog

### **Elise** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Spider Queen** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Neurotoxin / Venomous Bite** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Volatile Spiderling / Skittering Frenzy** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Cocoon / Rappel** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Spider Form** — Standard formula fallback; custom mechanics in backlog

### **Evelynn** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Demon Shade** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Hate Spike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Allure** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Whiplash** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Last Caress** — Standard formula fallback; custom mechanics in backlog

### **Ezreal** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Rising Spell Force** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Mystic Shot** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Essence Flux** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Arcane Shift** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Trueshot Barrage** — Standard formula fallback; custom mechanics in backlog

### **Fiddlesticks** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: A Harmless Scarecrow** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Terrify** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Bountiful Harvest** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Reap** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Crowstorm** — Standard formula fallback; custom mechanics in backlog

### **Fiora** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Duelist's Dance** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Lunge** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Riposte** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Bladework** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Grand Challenge** — Standard formula fallback; custom mechanics in backlog

### **Fizz** (Assassin / Fighter) — ⚪ In Backlog
- [ ] **Passive: Nimble Fighter** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Urchin Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Seastone Trident** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Playful / Trickster** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Chum the Waters** — Standard formula fallback; custom mechanics in backlog

### **Galio** (Tank / Mage) — ⚪ In Backlog
- [ ] **Passive: Colossal Smash** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Winds of War** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Shield of Durand** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Justice Punch** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Hero's Entrance** — Standard formula fallback; custom mechanics in backlog

### **Gangplank** (Fighter) — ⚪ In Backlog
- [ ] **Passive: Trial by Fire** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Parrrley** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Remove Scurvy** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Powder Keg** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Cannon Barrage** — Standard formula fallback; custom mechanics in backlog

### **Garen** (Top) — 🟡 Partially Implemented
- [ ] **Passive: Perseverance** — Out-of-combat HP regeneration passive pending
- [ ] **Q: Decisive Strike** — Movement speed & silence auto-attack pending
- [ ] **W: Courage** — Passive resists & damage reduction shield pending
- [ ] **E: Judgment** — Armor shred spin tick scaling pending
- [x] **R: Demacian Justice** — True damage execute scaling with 25% / 30% / 35% target missing HP

### **Gnar** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Rage Gene** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Boomerang Throw / Boulder Toss** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Hyper / Wallop** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Hop / Crunch** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: GNAR!** — Standard formula fallback; custom mechanics in backlog

### **Gragas** (Fighter / Mage) — ⚪ In Backlog
- [ ] **Passive: Happy Hour** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Barrel Roll** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Drunken Rage** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Body Slam** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Explosive Cask** — Standard formula fallback; custom mechanics in backlog

### **Graves** (Marksman) — ⚪ In Backlog
- [ ] **Passive: New Destiny** — Standard formula fallback; custom passive in backlog
- [ ] **Q: End of the Line** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Smoke Screen** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Quickdraw** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Collateral Damage** — Standard formula fallback; custom mechanics in backlog

### **Gwen** (Fighter) — ⚪ In Backlog
- [ ] **Passive: A Thousand Cuts** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Snip Snip!** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Hallowed Mist** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Skip 'n Slash** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Needlework** — Standard formula fallback; custom mechanics in backlog

### **Hecarim** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Warpath** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Rampage** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Spirit of Dread** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Devastating Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Onslaught of Shadows** — Standard formula fallback; custom mechanics in backlog

### **Heimerdinger** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Hextech Affinity** — Standard formula fallback; custom passive in backlog
- [ ] **Q: H-28 G Evolution Turret** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Hextech Micro-Rockets** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: CH-2 Electron Storm Grenade** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: UPGRADE!!!** — Standard formula fallback; custom mechanics in backlog

### **Hwei** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Signature of the Visionary** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Subject: Disaster** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Subject: Serenity** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Subject: Torment** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Spiraling Despair** — Standard formula fallback; custom mechanics in backlog

### **Illaoi** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Prophet of an Elder God** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Tentacle Smash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Harsh Lesson** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Test of Spirit** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Leap of Faith** — Standard formula fallback; custom mechanics in backlog

### **Irelia** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Ionian Fervor** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bladesurge** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Defiant Dance** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Flawless Duet** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Vanguard's Edge** — Standard formula fallback; custom mechanics in backlog

### **Ivern** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Friend of the Forest** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Rootcaller** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Brushmaker** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Triggerseed** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Daisy!** — Standard formula fallback; custom mechanics in backlog

### **Janna** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Tailwind** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Howling Gale** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Zephyr** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Eye Of The Storm** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Monsoon** — Standard formula fallback; custom mechanics in backlog

### **Jarvan IV** (Jungle) — 🟢 Fully Implemented
- [x] **Passive: Martial Cadence** — 8% target current HP on-hit bonus physical damage
- [x] **Q: Dragon Strike** — Armor shred calculation
- [x] **W: Golden Aegis** — Dynamic multi-enemy scaling shield
- [x] **E: Demacian Standard** — Attack speed aura & burst combo calculation
- [x] **R: Cataclysm** — Full physical burst damage calculation

### **Jax** (Fighter) — ⚪ In Backlog
- [ ] **Passive: Relentless Assault** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Leap Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Empower** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Counter Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Grandmaster-at-Arms** — Standard formula fallback; custom mechanics in backlog

### **Jayce** (Fighter / Marksman) — ⚪ In Backlog
- [ ] **Passive: Hextech Capacitor** — Standard formula fallback; custom passive in backlog
- [ ] **Q: To the Skies! / Shock Blast** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Lightning Field / Hyper Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Thundering Blow / Acceleration Gate** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Mercury Cannon / Mercury Hammer** — Standard formula fallback; custom mechanics in backlog

### **Jhin** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Whisper** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Dancing Grenade** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Deadly Flourish** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Captive Audience** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Curtain Call** — Standard formula fallback; custom mechanics in backlog

### **Jinx** (ADC) — 🟡 Partially Implemented
- [ ] **Passive: Get Excited!** — Attack speed & movement speed steroid on takedown pending
- [ ] **Q: Switcheroo!** — Minigun attack speed ramp / Fishbones AoE mana cost pending
- [ ] **W: Zap!** — Zap physical damage & slow pending
- [ ] **E: Flame Chompers!** — Flame Chompers root traps pending
- [x] **R: Super Mega Death Rocket!** — Base damage + 25% / 30% / 35% missing HP physical execute damage

### **K'Sante** (Tank / Fighter) — ⚪ In Backlog
- [ ] **Passive: Dauntless Instinct** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Ntofo Strikes** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Path Maker** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Footwork** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: All Out** — Standard formula fallback; custom mechanics in backlog

### **Kai'Sa** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Second Skin** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Icathian Rain** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Void Seeker** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Supercharge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Killer Instinct** — Standard formula fallback; custom mechanics in backlog

### **Kalista** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Martial Poise** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Pierce** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Sentinel** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Rend** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Fate's Call** — Standard formula fallback; custom mechanics in backlog

### **Karma** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Gathering Fire** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Inner Flame** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Focused Resolve** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Inspire** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Mantra** — Standard formula fallback; custom mechanics in backlog

### **Karthus** (Mage) — ⚪ In Backlog
- [ ] **Passive: Death Defied** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Lay Waste** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Wall of Pain** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Defile** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Requiem** — Standard formula fallback; custom mechanics in backlog

### **Kassadin** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Void Stone** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Null Sphere** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Nether Blade** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Force Pulse** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Riftwalk** — Standard formula fallback; custom mechanics in backlog

### **Katarina** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Voracity** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bouncing Blade** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Preparation** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Shunpo** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Death Lotus** — Standard formula fallback; custom mechanics in backlog

### **Kayle** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Divine Ascent** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Radiant Blast** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Celestial Blessing** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Starfire Spellblade** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Divine Judgment** — Standard formula fallback; custom mechanics in backlog

### **Kayn** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: The Darkin Scythe** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Reaping Slash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Blade's Reach** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Shadow Step** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Umbral Trespass** — Standard formula fallback; custom mechanics in backlog

### **Kennen** (Mage) — ⚪ In Backlog
- [ ] **Passive: Mark of the Storm** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Thundering Shuriken** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Electrical Surge** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Lightning Rush** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Slicing Maelstrom** — Standard formula fallback; custom mechanics in backlog

### **Kha'Zix** (Assassin) — ⚪ In Backlog
- [ ] **Passive: Unseen Threat** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Taste Their Fear** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Void Spike** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Leap** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Void Assault** — Standard formula fallback; custom mechanics in backlog

### **Kindred** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Mark of the Kindred** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Dance of Arrows** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Wolf's Frenzy** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Mounting Dread** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Lamb's Respite** — Standard formula fallback; custom mechanics in backlog

### **Kled** (Fighter) — ⚪ In Backlog
- [ ] **Passive: Skaarl, the Cowardly Lizard** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bear Trap on a Rope** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Violent Tendencies** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Jousting** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Chaaaaaaaarge!!!** — Standard formula fallback; custom mechanics in backlog

### **Kog'Maw** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Icathian Surprise** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Caustic Spittle** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Bio-Arcane Barrage** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Void Ooze** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Living Artillery** — Standard formula fallback; custom mechanics in backlog

### **LeBlanc** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Mirror Image** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Sigil of Malice** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Distortion** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Ethereal Chains** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Mimic** — Standard formula fallback; custom mechanics in backlog

### **Lee Sin** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Flurry** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Sonic Wave / Resonating Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Safeguard / Iron Will** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Tempest / Cripple** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Dragon's Rage** — Standard formula fallback; custom mechanics in backlog

### **Leona** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Sunlight** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Shield of Daybreak** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Eclipse** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Zenith Blade** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Solar Flare** — Standard formula fallback; custom mechanics in backlog

### **Lillia** (Fighter / Mage) — ⚪ In Backlog
- [ ] **Passive: Dream-Laden Bough** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Blooming Blows** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Watch Out! Eep!** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Swirlseed** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Lilting Lullaby** — Standard formula fallback; custom mechanics in backlog

### **Lissandra** (Mage) — ⚪ In Backlog
- [ ] **Passive: Iceborn Subjugation** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Ice Shard** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ring of Frost** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Glacial Path** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Frozen Tomb** — Standard formula fallback; custom mechanics in backlog

### **Locke** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Silver Stake** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Ritual Nails** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Soul Ignition** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Ashen Pursuit** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Purgatory** — Standard formula fallback; custom mechanics in backlog

### **Lucian** (Marksman / Assassin) — ⚪ In Backlog
- [ ] **Passive: Lightslinger** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Piercing Light** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ardent Blaze** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Relentless Pursuit** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: The Culling** — Standard formula fallback; custom mechanics in backlog

### **Lulu** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Pix, Faerie Companion** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Glitterlance** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Whimsy** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Help, Pix!** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Wild Growth** — Standard formula fallback; custom mechanics in backlog

### **Lux** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Illumination** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Light Binding** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Prismatic Barrier** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Lucent Singularity** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Final Spark** — Standard formula fallback; custom mechanics in backlog

### **Malphite** (Top) — 🔵 Baseline Tested
- [ ] **Passive: Granite Shield** — Granite Shield % max HP passive pending
- [ ] **Q: Seismic Shard** — Movement speed steal pending
- [ ] **W: Thunderclap** — Passive armor multiplier & thunderclap cone pending
- [ ] **E: Ground Slam** — Armor-scaling slam & attack speed slow pending
- [ ] **R: Unstoppable Force** — Unstoppable Force knockup burst pending

### **Malzahar** (Mid) — 🟡 Partially Implemented
- [ ] **Passive: Void Shift** — Void Shift spell shield & CC immunity pending
- [ ] **Q: Call of the Void** — Silence beam dual portal pending
- [ ] **W: Void Swarm** — Voidling minion swarm summons pending
- [x] **E: Malefic Visions** — Continuous ticking magic damage DoT in combat simulation engine
- [ ] **R: Nether Grasp** — Nether Grasp suppression tether & null zone pending

### **Maokai** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Sap Magic** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bramble Smash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Twisted Advance** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Sapling Toss** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Nature's Grasp** — Standard formula fallback; custom mechanics in backlog

### **Master Yi** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Double Strike** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Alpha Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Meditate** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Wuju Style** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Highlander** — Standard formula fallback; custom mechanics in backlog

### **Mel** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Searing Brilliance** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Radiant Volley** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Rebuttal** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Solar Snare** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Golden Eclipse** — Standard formula fallback; custom mechanics in backlog

### **Milio** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Fired Up!** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Ultra Mega Fire Kick** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Cozy Campfire** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Warm Hugs** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Breath of Life** — Standard formula fallback; custom mechanics in backlog

### **Miss Fortune** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Love Tap** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Double Up** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Strut** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Make It Rain** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Bullet Time** — Standard formula fallback; custom mechanics in backlog

### **Mordekaiser** (Fighter / Mage) — ⚪ In Backlog
- [ ] **Passive: Darkness Rise** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Obliterate** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Indestructible** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Death's Grasp** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Realm of Death** — Standard formula fallback; custom mechanics in backlog

### **Morgana** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Soul Siphon** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Dark Binding** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Tormented Shadow** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Black Shield** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Soul Shackles** — Standard formula fallback; custom mechanics in backlog

### **Naafiri** (Assassin / Fighter) — ⚪ In Backlog
- [ ] **Passive: We Are More** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Darkin Daggers** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: The Call of the Pack** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Eviscerate** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Hounds' Pursuit** — Standard formula fallback; custom mechanics in backlog

### **Nami** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Surging Tides** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Aqua Prison** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ebb and Flow** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Tidecaller's Blessing** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Tidal Wave** — Standard formula fallback; custom mechanics in backlog

### **Nasus** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Soul Eater** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Siphoning Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Wither** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Spirit Fire** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Fury of the Sands** — Standard formula fallback; custom mechanics in backlog

### **Nautilus** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Staggering Blow** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Dredge Line** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Titan's Wrath** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Riptide** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Depth Charge** — Standard formula fallback; custom mechanics in backlog

### **Neeko** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Inherent Glamour** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Blooming Burst** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Shapesplitter** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Tangle-Barbs** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Pop Blossom** — Standard formula fallback; custom mechanics in backlog

### **Nidalee** (Assassin / Mage) — ⚪ In Backlog
- [ ] **Passive: Prowl** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Javelin Toss / Takedown** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Bushwhack / Pounce** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Primal Surge / Swipe** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Aspect Of The Cougar** — Standard formula fallback; custom mechanics in backlog

### **Nilah** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Joy Unending** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Formless Blade** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Jubilant Veil** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Slipstream** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Apotheosis** — Standard formula fallback; custom mechanics in backlog

### **Nocturne** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Umbra Blades** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Duskbringer** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Shroud of Darkness** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Unspeakable Horror** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Paranoia** — Standard formula fallback; custom mechanics in backlog

### **Nunu & Willump** (Tank / Mage) — ⚪ In Backlog
- [ ] **Passive: Call of the Freljord** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Consume** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Biggest Snowball Ever!** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Snowball Barrage** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Absolute Zero** — Standard formula fallback; custom mechanics in backlog

### **Olaf** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Berserker Rage** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Undertow** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Tough It Out** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Reckless Swing** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Ragnarok** — Standard formula fallback; custom mechanics in backlog

### **Orianna** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Clockwork Windup** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Command: Attack** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Command: Dissonance** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Command: Protect** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Command: Shockwave** — Standard formula fallback; custom mechanics in backlog

### **Ornn** (Tank) — ⚪ In Backlog
- [ ] **Passive: Living Forge** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Volcanic Rupture** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Bellows Breath** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Searing Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Call of the Forge God** — Standard formula fallback; custom mechanics in backlog

### **Pantheon** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Mortal Will** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Comet Spear** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Shield Vault** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Aegis Assault** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Grand Starfall** — Standard formula fallback; custom mechanics in backlog

### **Poppy** (Tank / Fighter) — ⚪ In Backlog
- [ ] **Passive: Iron Ambassador** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Hammer Shock** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Steadfast Presence** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Heroic Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Keeper's Verdict** — Standard formula fallback; custom mechanics in backlog

### **Pyke** (Support / Assassin) — ⚪ In Backlog
- [ ] **Passive: Gift of the Drowned Ones** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bone Skewer** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ghostwater Dive** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Phantom Undertow** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Death From Below** — Standard formula fallback; custom mechanics in backlog

### **Qiyana** (Assassin) — ⚪ In Backlog
- [ ] **Passive: Royal Privilege** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Elemental Wrath / Edge of Ixtal** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Terrashape** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Audacity** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Supreme Display of Talent** — Standard formula fallback; custom mechanics in backlog

### **Quinn** (Marksman / Assassin) — ⚪ In Backlog
- [ ] **Passive: Harrier** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Blinding Assault** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Heightened Senses** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Vault** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Behind Enemy Lines** — Standard formula fallback; custom mechanics in backlog

### **Rakan** (Support) — ⚪ In Backlog
- [ ] **Passive: Fey Feathers** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Gleaming Quill** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Grand Entrance** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Battle Dance** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: The Quickness** — Standard formula fallback; custom mechanics in backlog

### **Rammus** (Tank) — ⚪ In Backlog
- [ ] **Passive: Spiked Shell** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Powerball** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Defensive Ball Curl** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Frenzying Taunt** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Soaring Slam** — Standard formula fallback; custom mechanics in backlog

### **Rek'Sai** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Fury of the Xer'Sai** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Queen's Wrath / Prey Seeker** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Burrow / Un-burrow** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Furious Bite / Tunnel** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Void Rush** — Standard formula fallback; custom mechanics in backlog

### **Rell** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: Break the Mold** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Shattering Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ferromancy: Crash Down** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Full Tilt** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Magnet Storm** — Standard formula fallback; custom mechanics in backlog

### **Renata Glasc** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Leverage** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Handshake** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Bailout** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Loyalty Program** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Hostile Takeover** — Standard formula fallback; custom mechanics in backlog

### **Renekton** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Reign of Anger** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Cull the Meek** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ruthless Predator** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Slice and Dice** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Dominus** — Standard formula fallback; custom mechanics in backlog

### **Rengar** (Assassin / Fighter) — ⚪ In Backlog
- [ ] **Passive: Unseen Predator** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Savagery** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Battle Roar** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Bola Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Thrill of the Hunt** — Standard formula fallback; custom mechanics in backlog

### **Riven** (Top) — 🟡 Partially Implemented
- [ ] **Passive: Runic Blade** — Runic Blade passive charge auto-attack scaling pending
- [ ] **Q: Broken Wings** — 3-cast sequence knockup pending
- [ ] **W: Ki Burst** — AoE stun burst pending
- [ ] **E: Valor** — AD-scaling dash shield pending
- [x] **R: Blade of the Exile** — Wind Slash (R2) execute amplification (up to +200% bonus below 25% HP)

### **Rumble** (Fighter / Mage) — ⚪ In Backlog
- [ ] **Passive: Junkyard Titan** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Flamespitter** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Scrap Shield** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Electro Harpoon** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: The Equalizer** — Standard formula fallback; custom mechanics in backlog

### **Ryze** (Mage) — ⚪ In Backlog
- [ ] **Passive: Arcane Mastery** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Overload** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Rune Prison** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Spell Flux** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Realm Warp** — Standard formula fallback; custom mechanics in backlog

### **Samira** (Marksman / Assassin) — ⚪ In Backlog
- [ ] **Passive: Daredevil Impulse** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Flair** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Blade Whirl** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Wild Rush** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Inferno Trigger** — Standard formula fallback; custom mechanics in backlog

### **Sejuani** (Tank) — ⚪ In Backlog
- [ ] **Passive: Fury of the North** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Arctic Assault** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Winter's Wrath** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Permafrost** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Glacial Prison** — Standard formula fallback; custom mechanics in backlog

### **Senna** (Support / Marksman) — ⚪ In Backlog
- [ ] **Passive: Absolution** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Piercing Darkness** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Last Embrace** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Curse of the Black Mist** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Dawning Shadow** — Standard formula fallback; custom mechanics in backlog

### **Seraphine** (Mid / Support) — 🟢 Fully Implemented
- [x] **Passive: Stage Presence** — Echo double-cast logic & Notes bonus damage
- [x] **Q: High Note** — Missing HP execution scaling (up to +75% bonus damage)
- [x] **W: Surround Sound** — Scaling shield & missing HP percentage heal
- [x] **E: Beat Drop** — Slow / Root / Stun CC progression
- [x] **R: Encore** — Charm CC & projectile hit extension

### **Sett** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Pit Grit** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Knuckle Down** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Haymaker** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Facebreaker** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: The Show Stopper** — Standard formula fallback; custom mechanics in backlog

### **Shaco** (Assassin) — ⚪ In Backlog
- [ ] **Passive: Backstab** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Deceive** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Jack In The Box** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Two-Shiv Poison** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Hallucinate** — Standard formula fallback; custom mechanics in backlog

### **Shen** (Tank) — ⚪ In Backlog
- [ ] **Passive: Ki Barrier** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Twilight Assault** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Spirit's Refuge** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Shadow Dash** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Stand United** — Standard formula fallback; custom mechanics in backlog

### **Shyvana** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Scalemail** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Emberstrike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Inferno Aegis** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Molten Burst** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Dragon's Descent** — Standard formula fallback; custom mechanics in backlog

### **Singed** (Tank / Mage) — ⚪ In Backlog
- [ ] **Passive: Noxious Slipstream** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Poison Trail** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Mega Adhesive** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Fling** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Insanity Potion** — Standard formula fallback; custom mechanics in backlog

### **Sion** (Tank / Fighter) — ⚪ In Backlog
- [ ] **Passive: Glory in Death** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Decimating Smash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Soul Furnace** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Roar of the Slayer** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Unstoppable Onslaught** — Standard formula fallback; custom mechanics in backlog

### **Sivir** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Fleet of Foot** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Boomerang Blade** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ricochet** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Spell Shield** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: On The Hunt** — Standard formula fallback; custom mechanics in backlog

### **Skarner** (Tank / Fighter) — ⚪ In Backlog
- [ ] **Passive: Threads of Vibration** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Shattered Earth / Upheaval** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Seismic Bastion** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Ixtal's Impact** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Impale** — Standard formula fallback; custom mechanics in backlog

### **Smolder** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Dragon Practice** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Super Scorcher Breath** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Achooo!** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Flap, Flap, Flap** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: MMOOOMMMM!** — Standard formula fallback; custom mechanics in backlog

### **Sona** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Power Chord** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Hymn of Valor** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Aria of Perseverance** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Song of Celerity** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Crescendo** — Standard formula fallback; custom mechanics in backlog

### **Soraka** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Salvation** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Starcall** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Astral Infusion** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Equinox** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Wish** — Standard formula fallback; custom mechanics in backlog

### **Swain** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Ravenous Flock** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Death's Hand** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Vision of Empire** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Nevermove** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Demonic Ascension** — Standard formula fallback; custom mechanics in backlog

### **Sylas** (Mage / Assassin) — ⚪ In Backlog
- [ ] **Passive: Petricite Burst** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Chain Lash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Kingslayer** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Abscond / Abduct** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Hijack** — Standard formula fallback; custom mechanics in backlog

### **Syndra** (Mage) — ⚪ In Backlog
- [ ] **Passive: Transcendent** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Dark Sphere** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Force of Will** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Scatter the Weak** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Unleashed Power** — Standard formula fallback; custom mechanics in backlog

### **Tahm Kench** (Tank / Support) — ⚪ In Backlog
- [ ] **Passive: An Acquired Taste** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Tongue Lash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Abyssal Dive** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Thick Skin** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Devour** — Standard formula fallback; custom mechanics in backlog

### **Taliyah** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Rock Surfing** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Threaded Volley** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Seismic Shove** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Unraveled Earth** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Weaver's Wall** — Standard formula fallback; custom mechanics in backlog

### **Talon** (Assassin) — ⚪ In Backlog
- [ ] **Passive: Blade's End** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Noxian Diplomacy** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Rake** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Assassin's Path** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Shadow Assault** — Standard formula fallback; custom mechanics in backlog

### **Taric** (Support / Tank) — ⚪ In Backlog
- [ ] **Passive: Bravado** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Starlight's Touch** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Bastion** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Dazzle** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Cosmic Radiance** — Standard formula fallback; custom mechanics in backlog

### **Teemo** (Top) — 🟡 Partially Implemented
- [ ] **Passive: Guerrilla Warfare** — Invisibility attack speed buff pending
- [ ] **Q: Blinding Dart** — Blind status duration pending
- [ ] **W: Move Quick** — Passive & active movement speed pending
- [x] **E: Toxic Shot** — On-hit poison magic damage DoT with continuous tick interval in combat engine
- [ ] **R: Noxious Trap** — Noxious Trap shroom mushroom bounce & explosion pending

### **Thresh** (Support) — 🔵 Baseline Tested
- [ ] **Passive: Damnation** — Damnation soul harvesting armor/AP stacking pending
- [ ] **Q: Death Sentence** — Death Sentence hook CC pending
- [ ] **W: Dark Passage** — Dark Passage lantern shield & ally pull pending
- [ ] **E: Flay** — Flay passive on-hit charge & knockback active pending
- [ ] **R: The Box** — The Box wall damage & 99% slow pending

### **Tristana** (Marksman / Assassin) — ⚪ In Backlog
- [ ] **Passive: Draw a Bead** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Rapid Fire** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Rocket Jump** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Explosive Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Buster Shot** — Standard formula fallback; custom mechanics in backlog

### **Trundle** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: King's Tribute** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Chomp** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Frozen Domain** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Pillar of Ice** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Subjugate** — Standard formula fallback; custom mechanics in backlog

### **Tryndamere** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Battle Fury** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bloodlust** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Mocking Shout** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Spinning Slash** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Undying Rage** — Standard formula fallback; custom mechanics in backlog

### **Twisted Fate** (Mage / Marksman) — ⚪ In Backlog
- [ ] **Passive: Loaded Dice** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Wild Cards** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Pick a Card** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Stacked Deck** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Destiny** — Standard formula fallback; custom mechanics in backlog

### **Twitch** (ADC) — 🟡 Partially Implemented
- [x] **Passive: Deadly Venom** — Stacking true damage DoT per auto-attack in combat simulation engine
- [ ] **Q: Ambush** — Camouflage stealth & attack speed pending
- [ ] **W: Venom Cask** — Venom Cask slow zone pending
- [ ] **E: Contaminate** — Contaminate physical/magic damage per stack pending
- [ ] **R: Spray and Pray** — Piercing bolt range & AD steroid pending

### **Udyr** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Bridge Between** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Wilding Claw** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Iron Mantle** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Blazing Stampede** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Wingborne Storm** — Standard formula fallback; custom mechanics in backlog

### **Urgot** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Echoing Flames** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Corrosive Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Purge** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Disdain** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Fear Beyond Death** — Standard formula fallback; custom mechanics in backlog

### **Varus** (Marksman / Mage) — ⚪ In Backlog
- [ ] **Passive: Living Vengeance** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Piercing Arrow** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Blighted Quiver** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Hail of Arrows** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Chain of Corruption** — Standard formula fallback; custom mechanics in backlog

### **Vayne** (Marksman / Assassin) — ⚪ In Backlog
- [ ] **Passive: Night Hunter** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Tumble** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Silver Bolts** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Condemn** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Final Hour** — Standard formula fallback; custom mechanics in backlog

### **Veigar** (Mid) — 🟡 Partially Implemented
- [ ] **Passive: Phenomenal Evil Power** — Phenomenal Evil AP stacking passive pending
- [ ] **Q: Baleful Strike** — Double-hit skillshot pending
- [ ] **W: Dark Matter** — Cooldown reduction based on AP pending
- [ ] **E: Event Horizon** — Stun cage CC duration pending
- [x] **R: Primordial Burst** — Dynamic missing HP scaling (up to +100% bonus damage below 33% HP)

### **Vel'Koz** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Organic Deconstruction** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Plasma Fission** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Void Rift** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Tectonic Disruption** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Life Form Disintegration Ray** — Standard formula fallback; custom mechanics in backlog

### **Vex** (Mage) — ⚪ In Backlog
- [ ] **Passive: Doom 'n Gloom** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Mistral Bolt** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Personal Space** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Looming Darkness** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Shadow Surge** — Standard formula fallback; custom mechanics in backlog

### **Vi** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Blast Shield** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Vault Breaker** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Denting Blows** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Relentless Force** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Cease and Desist** — Standard formula fallback; custom mechanics in backlog

### **Viego** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Sovereign's Domination** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Blade of the Ruined King** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Spectral Maw** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Harrowed Path** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Heartbreaker** — Standard formula fallback; custom mechanics in backlog

### **Viktor** (Mage) — ⚪ In Backlog
- [ ] **Passive: Glorious Evolution** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Siphon Power** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Gravity Field** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Hextech Ray** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Arcane Storm** — Standard formula fallback; custom mechanics in backlog

### **Vladimir** (Mage / Fighter) — ⚪ In Backlog
- [ ] **Passive: Crimson Pact** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Transfusion** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Sanguine Pool** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Tides of Blood** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Hemoplague** — Standard formula fallback; custom mechanics in backlog

### **Volibear** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: The Relentless Storm** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Thundering Smash** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Frenzied Maul** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Sky Splitter** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Stormbringer** — Standard formula fallback; custom mechanics in backlog

### **Warwick** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Eternal Hunger** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Jaws of the Beast** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Blood Hunt** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Primal Howl** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Infinite Duress** — Standard formula fallback; custom mechanics in backlog

### **Wukong** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Stone Skin** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Crushing Blow** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Warrior Trickster** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Nimbus Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Cyclone** — Standard formula fallback; custom mechanics in backlog

### **Xayah** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Clean Cuts** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Double Daggers** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Deadly Plumage** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Bladecaller** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Featherstorm** — Standard formula fallback; custom mechanics in backlog

### **Xerath** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Mana Surge** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Arcanopulse** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Eye of Destruction** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Shocking Orb** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Rite of the Arcane** — Standard formula fallback; custom mechanics in backlog

### **Xin Zhao** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Determination** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Three Talon Strike** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Wind Becomes Lightning** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Audacious Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Crescent Guard** — Standard formula fallback; custom mechanics in backlog

### **Yasuo** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Way of the Wanderer** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Steel Tempest** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Wind Wall** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Sweeping Blade** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Last Breath** — Standard formula fallback; custom mechanics in backlog

### **Yone** (Fighter / Assassin) — ⚪ In Backlog
- [ ] **Passive: Way of the Hunter** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Mortal Steel** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Spirit Cleave** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Soul Unbound** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Fate Sealed** — Standard formula fallback; custom mechanics in backlog

### **Yorick** (Fighter / Tank) — ⚪ In Backlog
- [ ] **Passive: Shepherd of Souls** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Last Rites** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Dark Procession** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Mourning Mist** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Eulogy of the Isles** — Standard formula fallback; custom mechanics in backlog

### **Yunara** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Vow of the First Lands** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Cultivation of Spirit** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Arc of Judgment | Arc of Ruin** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Kanmei's Steps | Untouchable Shadow** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Transcend One's Self** — Standard formula fallback; custom mechanics in backlog

### **Yuumi** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Feline Friendship** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Prowling Projectile** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: You and Me!** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Zoomies** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Final Chapter** — Standard formula fallback; custom mechanics in backlog

### **Zaahen** (Fighter) — ⚪ In Backlog
- [ ] **Passive: Cultivation of War** — Standard formula fallback; custom passive in backlog
- [ ] **Q: The Darkin Glaive** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Dreaded Return** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Aureate Rush** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Grim Deliverance** — Standard formula fallback; custom mechanics in backlog

### **Zac** (Tank / Fighter) — ⚪ In Backlog
- [ ] **Passive: Cell Division** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Stretching Strikes** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Unstable Matter** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Elastic Slingshot** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Let's Bounce!** — Standard formula fallback; custom mechanics in backlog

### **Zed** (Mid) — 🔵 Baseline Tested
- [ ] **Passive: Contempt for the Weak** — Contempt for the Weak % max HP magic damage execute on low HP pending
- [ ] **Q: Razor Shuriken** — Razor Shuriken multi-hit reduction pending
- [ ] **W: Living Shadow** — Living Shadow swap & mimic pending
- [ ] **E: Shadow Slash** — Shadow Slash slow pending
- [ ] **R: Death Mark** — Death Mark pop delayed damage stored percentage pending

### **Zeri** (Marksman) — ⚪ In Backlog
- [ ] **Passive: Living Battery** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Burst Fire** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Ultrashock Laser** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Spark Surge** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Lightning Crash** — Standard formula fallback; custom mechanics in backlog

### **Ziggs** (Mage) — ⚪ In Backlog
- [ ] **Passive: Short Fuse** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Bouncing Bomb** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Satchel Charge** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Hexplosive Minefield** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Mega Inferno Bomb** — Standard formula fallback; custom mechanics in backlog

### **Zilean** (Support / Mage) — ⚪ In Backlog
- [ ] **Passive: Time In A Bottle** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Time Bomb** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Rewind** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Time Warp** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Chronoshift** — Standard formula fallback; custom mechanics in backlog

### **Zoe** (Mage) — ⚪ In Backlog
- [ ] **Passive: More Sparkles!** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Paddle Star!** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Spell Thief** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Sleepy Trouble Bubble** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Portal Jump** — Standard formula fallback; custom mechanics in backlog

### **Zyra** (Mage / Support) — ⚪ In Backlog
- [ ] **Passive: Garden of Thorns** — Standard formula fallback; custom passive in backlog
- [ ] **Q: Deadly Spines** — Standard formula fallback; custom mechanics in backlog
- [ ] **W: Rampant Growth** — Standard formula fallback; custom mechanics in backlog
- [ ] **E: Grasping Roots** — Standard formula fallback; custom mechanics in backlog
- [ ] **R: Stranglethorns** — Standard formula fallback; custom mechanics in backlog

---

## 🛠️ How to Implement and Test a New Champion

When adding combat logic, custom abilities, or passive scaling for a champion, follow these steps:

1. **Add Custom Damage / Mechanics**:
   - In `spellCalculatorService`, add the champion's unique passive or spell modifiers (e.g. sweetspots, % HP scaling, missing HP amplification, true damage executes).
   - If the champion applies a continuous status or DoT, register the DoT type in `combatSimulationService`.

2. **Add Unit Tests**:
   - Create or update a test in the `__tests__` test directory validating:
     - Spell damage at multiple levels and AP/AD values.
     - Execute amplification at different enemy HP percentages.
     - Two-way combat exchange and DPS calculation.

3. **Register in Status Registry**:
   - Add the champion entry to `IMPLEMENTED_CHAMPIONS` in `championStatusService`.
   - Update the champion's ability checkboxes to `- [x]` in this document.
   - The champion portrait in the simulator will automatically switch from black & white (grayscale) to full color!
