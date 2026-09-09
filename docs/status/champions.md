# 🏆 Champions Implementation & Abilities Tracking

This document tracks the implementation, custom combat mechanics, spell formulas, and verification status for all champions in the **LoL Teamfight & Damage Simulator**.
Every champion is broken down by their **Passive (P)** and each individual ability (**Q**, **W**, **E**, **R**).

---

## 🎨 UI Display Rules

- **Color (Vibrant Portraits)**: Champions that are **Tested / Implemented** (<input type="checkbox" checked /> fully verified, partially implemented, or baseline tested in test suites).
- **Black & White (Grayscale `grayscale opacity-60`)**: Champions that are **Untested / In Backlog (<input type="checkbox" />)** with no custom mechanics or verified test suites.

---

## 🎯 Legend

| Checkbox | Status | Description |
| :---: | :--- | :--- |
| <input type="checkbox" checked /> | **Implemented / Verified** | Custom spell formula, dynamic HP/execute scaling, passive logic, or DoT mechanics fully active in simulation and calculator. |
| <input type="checkbox" /> | **Pending / Backlog** | Standard generic DDragon formula fallback; custom mechanics, execute amplifiers, or triggers in backlog. |

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

- <input type="checkbox" checked /> **Passive: Stage Presence** — Echo double-cast logic & Notes bonus damage
- <input type="checkbox" checked /> **Q: High Note** — Missing HP execution scaling (up to +75% bonus damage)
- <input type="checkbox" checked /> **W: Surround Sound** — Scaling shield & missing HP percentage heal
- <input type="checkbox" checked /> **E: Beat Drop** — Slow / Root / Stun CC progression
- <input type="checkbox" checked /> **R: Encore** — Charm CC & projectile hit extension

### **Aatrox** (Top) — 🟢 Fully Implemented
*Test Suite: champion-builds.test.ts, spell-calculator.test.ts, combat-simulation.test.ts*

- <input type="checkbox" checked /> **Passive: Deathbringer Stance** — 4%–12% target maximum HP bonus physical damage on-hit
- <input type="checkbox" checked /> **Q: The Darkin Blade** — 3-cast sequence with sweetspot 1.6x multiplier & progressive scaling
- <input type="checkbox" /> **W: Infernal Chains** — Slow tether pull effect pending
- <input type="checkbox" /> **E: Umbral Dash** — Passive omnivamp & dash reset pending
- <input type="checkbox" /> **R: World Ender** — Bonus AD & increased healing self-buff pending

### **Jarvan IV** (Jungle) — 🟢 Fully Implemented
*Test Suite: spell-calculator.test.ts, combat-simulation.test.ts*

- <input type="checkbox" checked /> **Passive: Martial Cadence** — 8% target current HP on-hit bonus physical damage
- <input type="checkbox" checked /> **Q: Dragon Strike** — Armor shred calculation
- <input type="checkbox" checked /> **W: Golden Aegis** — Dynamic multi-enemy scaling shield
- <input type="checkbox" checked /> **E: Demacian Standard** — Attack speed aura & burst combo calculation
- <input type="checkbox" checked /> **R: Cataclysm** — Full physical burst damage calculation

### **Darius** (Top) — 🟢 Fully Implemented
*Test Suite: combat-simulation.test.ts*

- <input type="checkbox" checked /> **Passive: Hemorrhage** — 1–5 stack physical bleed DoT & Noxian Might (+bonus AD)
- <input type="checkbox" checked /> **Q: Decimate** — Outer blade hit amplification & healing logic
- <input type="checkbox" /> **W: Crippling Strike** — Empowered auto-attack reset pending
- <input type="checkbox" /> **E: Apprehend** — Passive armor penetration scaling pending
- <input type="checkbox" checked /> **R: Noxian Guillotine** — True damage execute scaling per Hemorrhage stack

### **Garen** (Top) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts, combat-simulation.test.ts*

- <input type="checkbox" /> **Passive: Perseverance** — Out-of-combat HP regeneration passive pending
- <input type="checkbox" /> **Q: Decisive Strike** — Movement speed & silence auto-attack pending
- <input type="checkbox" /> **W: Courage** — Passive resists & damage reduction shield pending
- <input type="checkbox" /> **E: Judgment** — Armor shred spin tick scaling pending
- <input type="checkbox" checked /> **R: Demacian Justice** — True damage execute scaling with 25% / 30% / 35% target missing HP

### **Veigar** (Mid) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts*

- <input type="checkbox" /> **Passive: Phenomenal Evil Power** — Phenomenal Evil AP stacking passive pending
- <input type="checkbox" /> **Q: Baleful Strike** — Double-hit skillshot pending
- <input type="checkbox" /> **W: Dark Matter** — Cooldown reduction based on AP pending
- <input type="checkbox" /> **E: Event Horizon** — Stun cage CC duration pending
- <input type="checkbox" checked /> **R: Primordial Burst** — Dynamic missing HP scaling (up to +100% bonus damage below 33% HP)

### **Jinx** (ADC) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts, champion-builds.test.ts*

- <input type="checkbox" /> **Passive: Get Excited!** — Attack speed & movement speed steroid on takedown pending
- <input type="checkbox" /> **Q: Switcheroo!** — Minigun attack speed ramp / Fishbones AoE mana cost pending
- <input type="checkbox" /> **W: Zap!** — Zap physical damage & slow pending
- <input type="checkbox" /> **E: Flame Chompers!** — Flame Chompers root traps pending
- <input type="checkbox" checked /> **R: Super Mega Death Rocket!** — Base damage + 25% / 30% / 35% missing HP physical execute damage

### **Akali** (Mid / Top) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts*

- <input type="checkbox" /> **Passive: Assassin's Mark** — Ring passage & empowered auto-attack pending
- <input type="checkbox" /> **Q: Five Point Strike** — Kunai throw slow at tip pending
- <input type="checkbox" /> **W: Twilight Shroud** — Shroud stealth & energy restore pending
- <input type="checkbox" /> **E: Shuriken Flip** — Shuriken flip dash & recast pending
- <input type="checkbox" checked /> **R: Perfect Execution** — R2 missing HP execute amplification (up to +200% bonus below 30% HP)

### **Riven** (Top) — 🟡 Partially Implemented
*Test Suite: spell-calculator.test.ts*

- <input type="checkbox" /> **Passive: Runic Blade** — Runic Blade passive charge auto-attack scaling pending
- <input type="checkbox" /> **Q: Broken Wings** — 3-cast sequence knockup pending
- <input type="checkbox" /> **W: Ki Burst** — AoE stun burst pending
- <input type="checkbox" /> **E: Valor** — AD-scaling dash shield pending
- <input type="checkbox" checked /> **R: Blade of the Exile** — Wind Slash (R2) execute amplification (up to +200% bonus below 25% HP)

### **Brand** (Support / Mid) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- <input type="checkbox" checked /> **Passive: Blaze** — Stacking magic DoT and 3-stack explosive AoE detonation in combat engine
- <input type="checkbox" /> **Q: Sear** — Stun combo when ablaze pending
- <input type="checkbox" /> **W: Pillar of Flame** — 25% bonus damage when ablaze pending
- <input type="checkbox" /> **E: Conflagration** — Spread bounce when ablaze pending
- <input type="checkbox" /> **R: Pyroclasm** — Multi-target bounce priority pending

### **Teemo** (Top) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- <input type="checkbox" /> **Passive: Guerrilla Warfare** — Invisibility attack speed buff pending
- <input type="checkbox" /> **Q: Blinding Dart** — Blind status duration pending
- <input type="checkbox" /> **W: Move Quick** — Passive & active movement speed pending
- <input type="checkbox" checked /> **E: Toxic Shot** — On-hit poison magic damage DoT with continuous tick interval in combat engine
- <input type="checkbox" /> **R: Noxious Trap** — Noxious Trap shroom mushroom bounce & explosion pending

### **Cassiopeia** (Mid) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- <input type="checkbox" /> **Passive: Serpentine Grace** — Movement speed per level (no boots) passive pending
- <input type="checkbox" checked /> **Q: Noxious Blast** — Ticking poison magic damage DoT in combat simulation engine
- <input type="checkbox" /> **W: Miasma** — Grounded zone & slow pending
- <input type="checkbox" /> **E: Twin Fang** — Twin Fang amplified damage & heal on poisoned targets pending
- <input type="checkbox" /> **R: Petrifying Gaze** — Petrifying Gaze stun/slow cone pending

### **Twitch** (ADC) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- <input type="checkbox" checked /> **Passive: Deadly Venom** — Stacking true damage DoT per auto-attack in combat simulation engine
- <input type="checkbox" /> **Q: Ambush** — Camouflage stealth & attack speed pending
- <input type="checkbox" /> **W: Venom Cask** — Venom Cask slow zone pending
- <input type="checkbox" /> **E: Contaminate** — Contaminate physical/magic damage per stack pending
- <input type="checkbox" /> **R: Spray and Pray** — Piercing bolt range & AD steroid pending

### **Malzahar** (Mid) — 🟡 Partially Implemented
*Test Suite: combat-simulation.test.ts*

- <input type="checkbox" /> **Passive: Void Shift** — Void Shift spell shield & CC immunity pending
- <input type="checkbox" /> **Q: Call of the Void** — Silence beam dual portal pending
- <input type="checkbox" /> **W: Void Swarm** — Voidling minion swarm summons pending
- <input type="checkbox" checked /> **E: Malefic Visions** — Continuous ticking magic damage DoT in combat simulation engine
- <input type="checkbox" /> **R: Nether Grasp** — Nether Grasp suppression tether & null zone pending

### **Ahri** (Mid) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- <input type="checkbox" /> **Passive: Essence Theft** — Essence Theft heal on takedown pending
- <input type="checkbox" /> **Q: Orb of Deception** — Orb return true damage pending
- <input type="checkbox" /> **W: Fox-Fire** — Fox-Fire homing flames pending
- <input type="checkbox" /> **E: Charm** — Charm CC & damage amplifier pending
- <input type="checkbox" /> **R: Spirit Rush** — Spirit Rush multi-dash recast pending

### **Malphite** (Top) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- <input type="checkbox" /> **Passive: Granite Shield** — Granite Shield % max HP passive pending
- <input type="checkbox" /> **Q: Seismic Shard** — Movement speed steal pending
- <input type="checkbox" /> **W: Thunderclap** — Passive armor multiplier & thunderclap cone pending
- <input type="checkbox" /> **E: Ground Slam** — Armor-scaling slam & attack speed slow pending
- <input type="checkbox" /> **R: Unstoppable Force** — Unstoppable Force knockup burst pending

### **Zed** (Mid) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- <input type="checkbox" /> **Passive: Contempt for the Weak** — Contempt for the Weak % max HP magic damage execute on low HP pending
- <input type="checkbox" /> **Q: Razor Shuriken** — Razor Shuriken multi-hit reduction pending
- <input type="checkbox" /> **W: Living Shadow** — Living Shadow swap & mimic pending
- <input type="checkbox" /> **E: Shadow Slash** — Shadow Slash slow pending
- <input type="checkbox" /> **R: Death Mark** — Death Mark pop delayed damage stored percentage pending

### **Thresh** (Support) — 🔵 Baseline Tested
*Test Suite: champion-builds.test.ts*

- <input type="checkbox" /> **Passive: Damnation** — Damnation soul harvesting armor/AP stacking pending
- <input type="checkbox" /> **Q: Death Sentence** — Death Sentence hook CC pending
- <input type="checkbox" /> **W: Dark Passage** — Dark Passage lantern shield & ally pull pending
- <input type="checkbox" /> **E: Flay** — Flay passive on-hit charge & knockback active pending
- <input type="checkbox" /> **R: The Box** — The Box wall damage & 99% slow pending

---

## 🎯 Section 2: Upcoming Priority Roadmap Candidates

### **Vayne** (ADC) — ⚪ Prioritized Candidate
*Focus: W (Silver Bolts): % max HP true damage on every 3rd consecutive attack.*

- <input type="checkbox" /> **Passive: Night Hunter** — Backlog
- <input type="checkbox" /> **Q: Tumble** — Backlog
- <input type="checkbox" /> **W: Silver Bolts** — Backlog
- <input type="checkbox" /> **E: Condemn** — Backlog
- <input type="checkbox" /> **R: Final Hour** — Backlog

### **Kog'Maw** (ADC) — ⚪ Prioritized Candidate
*Focus: W (Bio-Arcane Barrage): % max HP magic damage on-hit with bonus attack range.*

- <input type="checkbox" /> **Passive: Icathian Surprise** — Backlog
- <input type="checkbox" /> **Q: Caustic Spittle** — Backlog
- <input type="checkbox" /> **W: Bio-Arcane Barrage** — Backlog
- <input type="checkbox" /> **E: Void Ooze** — Backlog
- <input type="checkbox" /> **R: Living Artillery** — Backlog

### **Syndra** (Mid) — ⚪ Prioritized Candidate
*Focus: Passive (Transcendent) splinters & R (Unleashed Power) dynamic sphere stacking damage.*

- <input type="checkbox" /> **Passive: Transcendent** — Backlog
- <input type="checkbox" /> **Q: Dark Sphere** — Backlog
- <input type="checkbox" /> **W: Force of Will** — Backlog
- <input type="checkbox" /> **E: Scatter the Weak** — Backlog
- <input type="checkbox" /> **R: Unleashed Power** — Backlog

### **Fiora** (Top) — ⚪ Prioritized Candidate
*Focus: Passive (Duelist's Dance) & R (Grand Challenge): % max HP true damage vitals.*

- <input type="checkbox" /> **Passive: Duelist's Dance** — Backlog
- <input type="checkbox" /> **Q: Lunge** — Backlog
- <input type="checkbox" /> **W: Riposte** — Backlog
- <input type="checkbox" /> **E: Bladework** — Backlog
- <input type="checkbox" /> **R: Grand Challenge** — Backlog

### **Kha'Zix** (Jungle) — ⚪ Prioritized Candidate
*Focus: Passive (Unseen Threat) & Q (Taste Their Fear) isolation multiplier.*

- <input type="checkbox" /> **Passive: Unseen Threat** — Backlog
- <input type="checkbox" /> **Q: Taste Their Fear** — Backlog
- <input type="checkbox" /> **W: Void Spike** — Backlog
- <input type="checkbox" /> **E: Leap** — Backlog
- <input type="checkbox" /> **R: Void Assault** — Backlog

### **Kai'Sa** (ADC) — ⚪ Prioritized Candidate
*Focus: Passive (Second Skin): % missing HP plasma rupture on 5th hit & ability evolution thresholds.*

- <input type="checkbox" /> **Passive: Second Skin** — Backlog
- <input type="checkbox" /> **Q: Icathian Rain** — Backlog
- <input type="checkbox" /> **W: Void Seeker** — Backlog
- <input type="checkbox" /> **E: Supercharge** — Backlog
- <input type="checkbox" /> **R: Killer Instinct** — Backlog

---

## 📋 Section 3: Full Champion Roster & Abilities Directory (173 Champions)

### **Aatrox** (Top) — 🟢 Fully Implemented
- <input type="checkbox" checked /> **Passive: Deathbringer Stance** — 4%–12% target maximum HP bonus physical damage on-hit
- <input type="checkbox" checked /> **Q: The Darkin Blade** — 3-cast sequence with sweetspot 1.6x multiplier & progressive scaling
- <input type="checkbox" /> **W: Infernal Chains** — Slow tether pull effect pending
- <input type="checkbox" /> **E: Umbral Dash** — Passive omnivamp & dash reset pending
- <input type="checkbox" /> **R: World Ender** — Bonus AD & increased healing self-buff pending

### **Ahri** (Mid) — 🔵 Baseline Tested
- <input type="checkbox" /> **Passive: Essence Theft** — Essence Theft heal on takedown pending
- <input type="checkbox" /> **Q: Orb of Deception** — Orb return true damage pending
- <input type="checkbox" /> **W: Fox-Fire** — Fox-Fire homing flames pending
- <input type="checkbox" /> **E: Charm** — Charm CC & damage amplifier pending
- <input type="checkbox" /> **R: Spirit Rush** — Spirit Rush multi-dash recast pending

### **Akali** (Mid / Top) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Assassin's Mark** — Ring passage & empowered auto-attack pending
- <input type="checkbox" /> **Q: Five Point Strike** — Kunai throw slow at tip pending
- <input type="checkbox" /> **W: Twilight Shroud** — Shroud stealth & energy restore pending
- <input type="checkbox" /> **E: Shuriken Flip** — Shuriken flip dash & recast pending
- <input type="checkbox" checked /> **R: Perfect Execution** — R2 missing HP execute amplification (up to +200% bonus below 30% HP)

### **Akshan** (Marksman / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Dirty Fighting** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Avengerang** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Going Rogue** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Heroic Swing** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Comeuppance** — Standard formula fallback; custom mechanics in backlog

### **Alistar** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Triumphant Roar** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Pulverize** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Headbutt** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Trample** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Unbreakable Will** — Standard formula fallback; custom mechanics in backlog

### **Ambessa** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Drakehound's Step** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Cunning Sweep / Sundering Slam** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Repudiation** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Lacerate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Public Execution** — Standard formula fallback; custom mechanics in backlog

### **Amumu** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Cursed Touch** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bandage Toss** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Despair** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Tantrum** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Curse of the Sad Mummy** — Standard formula fallback; custom mechanics in backlog

### **Anivia** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Rebirth** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Flash Frost** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Crystallize** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Frostbite** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Glacial Storm** — Standard formula fallback; custom mechanics in backlog

### **Annie** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Pyromania** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Disintegrate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Incinerate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Molten Shield** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Summon: Tibbers** — Standard formula fallback; custom mechanics in backlog

### **Aphelios** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: The Hitman and the Seer** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Weapon Abilites** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Phase** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Weapon Queue System** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Moonlight Vigil** — Standard formula fallback; custom mechanics in backlog

### **Ashe** (Marksman / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Frost Shot** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Ranger's Focus** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Volley** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Hawkshot** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Enchanted Crystal Arrow** — Standard formula fallback; custom mechanics in backlog

### **Aurelion Sol** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Cosmic Creator** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Breath of Light** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Astral Flight** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Singularity** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Falling Star / The Skies Descend** — Standard formula fallback; custom mechanics in backlog

### **Aurora** (Mage / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Spirit Abjuration** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Twofold Hex** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Across the Veil** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: The Weirding** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Between Worlds** — Standard formula fallback; custom mechanics in backlog

### **Azir** (Mage / Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Shurima's Legacy** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Conquering Sands** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Arise!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Shifting Sands** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Emperor's Divide** — Standard formula fallback; custom mechanics in backlog

### **Bard** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Traveler's Call** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Cosmic Binding** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Caretaker's Shrine** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Magical Journey** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Tempered Fate** — Standard formula fallback; custom mechanics in backlog

### **Bel'Veth** (Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Death in Lavender ** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Void Surge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Above and Below** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Royal Maelstrom** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Endless Banquet** — Standard formula fallback; custom mechanics in backlog

### **Blitzcrank** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Mana Barrier** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Rocket Grab** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Overdrive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Power Fist** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Static Field** — Standard formula fallback; custom mechanics in backlog

### **Brand** (Support / Mid) — 🟡 Partially Implemented
- <input type="checkbox" checked /> **Passive: Blaze** — Stacking magic DoT and 3-stack explosive AoE detonation in combat engine
- <input type="checkbox" /> **Q: Sear** — Stun combo when ablaze pending
- <input type="checkbox" /> **W: Pillar of Flame** — 25% bonus damage when ablaze pending
- <input type="checkbox" /> **E: Conflagration** — Spread bounce when ablaze pending
- <input type="checkbox" /> **R: Pyroclasm** — Multi-target bounce priority pending

### **Braum** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Concussive Blows** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Winter's Bite** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Stand Behind Me** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Unbreakable** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Glacial Fissure** — Standard formula fallback; custom mechanics in backlog

### **Briar** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Crimson Curse** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Head Rush** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Blood Frenzy / Snack Attack** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Chilling Scream** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Certain Death** — Standard formula fallback; custom mechanics in backlog

### **Caitlyn** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Headshot** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Piltover Peacemaker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Yordle Snap Trap** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: 90 Caliber Net** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Ace in the Hole** — Standard formula fallback; custom mechanics in backlog

### **Camille** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Adaptive Defenses** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Precision Protocol** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Tactical Sweep** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Hookshot** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: The Hextech Ultimatum** — Standard formula fallback; custom mechanics in backlog

### **Cassiopeia** (Mid) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Serpentine Grace** — Movement speed per level (no boots) passive pending
- <input type="checkbox" checked /> **Q: Noxious Blast** — Ticking poison magic damage DoT in combat simulation engine
- <input type="checkbox" /> **W: Miasma** — Grounded zone & slow pending
- <input type="checkbox" /> **E: Twin Fang** — Twin Fang amplified damage & heal on poisoned targets pending
- <input type="checkbox" /> **R: Petrifying Gaze** — Petrifying Gaze stun/slow cone pending

### **Cho'Gath** (Tank / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Carnivore** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Rupture** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Feral Scream** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Vorpal Spikes** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Feast** — Standard formula fallback; custom mechanics in backlog

### **Corki** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Hextech Munitions** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Phosphorus Bomb** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Valkyrie** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Gatling Gun** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Missile Barrage** — Standard formula fallback; custom mechanics in backlog

### **Darius** (Top) — 🟢 Fully Implemented
- <input type="checkbox" checked /> **Passive: Hemorrhage** — 1–5 stack physical bleed DoT & Noxian Might (+bonus AD)
- <input type="checkbox" checked /> **Q: Decimate** — Outer blade hit amplification & healing logic
- <input type="checkbox" /> **W: Crippling Strike** — Empowered auto-attack reset pending
- <input type="checkbox" /> **E: Apprehend** — Passive armor penetration scaling pending
- <input type="checkbox" checked /> **R: Noxian Guillotine** — True damage execute scaling per Hemorrhage stack

### **Diana** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Moonsilver Blade** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Crescent Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Pale Cascade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Lunar Rush** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Moonfall** — Standard formula fallback; custom mechanics in backlog

### **Dr. Mundo** (Tank / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Goes Where He Pleases** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Infected Bonesaw** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Heart Zapper** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Blunt Force Trauma** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Maximum Dosage** — Standard formula fallback; custom mechanics in backlog

### **Draven** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: League of Draven** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Spinning Axe** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Blood Rush** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Stand Aside** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Whirling Death** — Standard formula fallback; custom mechanics in backlog

### **Ekko** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Z-Drive Resonance** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Timewinder** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Parallel Convergence** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Phase Dive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Chronobreak** — Standard formula fallback; custom mechanics in backlog

### **Elise** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Spider Queen** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Neurotoxin / Venomous Bite** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Volatile Spiderling / Skittering Frenzy** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Cocoon / Rappel** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Spider Form** — Standard formula fallback; custom mechanics in backlog

### **Evelynn** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Demon Shade** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Hate Spike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Allure** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Whiplash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Last Caress** — Standard formula fallback; custom mechanics in backlog

### **Ezreal** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Rising Spell Force** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Mystic Shot** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Essence Flux** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Arcane Shift** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Trueshot Barrage** — Standard formula fallback; custom mechanics in backlog

### **Fiddlesticks** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: A Harmless Scarecrow** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Terrify** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Bountiful Harvest** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Reap** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Crowstorm** — Standard formula fallback; custom mechanics in backlog

### **Fiora** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Duelist's Dance** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Lunge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Riposte** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Bladework** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Grand Challenge** — Standard formula fallback; custom mechanics in backlog

### **Fizz** (Assassin / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Nimble Fighter** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Urchin Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Seastone Trident** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Playful / Trickster** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Chum the Waters** — Standard formula fallback; custom mechanics in backlog

### **Galio** (Tank / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Colossal Smash** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Winds of War** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Shield of Durand** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Justice Punch** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Hero's Entrance** — Standard formula fallback; custom mechanics in backlog

### **Gangplank** (Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Trial by Fire** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Parrrley** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Remove Scurvy** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Powder Keg** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Cannon Barrage** — Standard formula fallback; custom mechanics in backlog

### **Garen** (Top) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Perseverance** — Out-of-combat HP regeneration passive pending
- <input type="checkbox" /> **Q: Decisive Strike** — Movement speed & silence auto-attack pending
- <input type="checkbox" /> **W: Courage** — Passive resists & damage reduction shield pending
- <input type="checkbox" /> **E: Judgment** — Armor shred spin tick scaling pending
- <input type="checkbox" checked /> **R: Demacian Justice** — True damage execute scaling with 25% / 30% / 35% target missing HP

### **Gnar** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Rage Gene** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Boomerang Throw / Boulder Toss** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Hyper / Wallop** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Hop / Crunch** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: GNAR!** — Standard formula fallback; custom mechanics in backlog

### **Gragas** (Fighter / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Happy Hour** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Barrel Roll** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Drunken Rage** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Body Slam** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Explosive Cask** — Standard formula fallback; custom mechanics in backlog

### **Graves** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: New Destiny** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: End of the Line** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Smoke Screen** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Quickdraw** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Collateral Damage** — Standard formula fallback; custom mechanics in backlog

### **Gwen** (Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: A Thousand Cuts** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Snip Snip!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Hallowed Mist** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Skip 'n Slash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Needlework** — Standard formula fallback; custom mechanics in backlog

### **Hecarim** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Warpath** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Rampage** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Spirit of Dread** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Devastating Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Onslaught of Shadows** — Standard formula fallback; custom mechanics in backlog

### **Heimerdinger** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Hextech Affinity** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: H-28 G Evolution Turret** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Hextech Micro-Rockets** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: CH-2 Electron Storm Grenade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: UPGRADE!!!** — Standard formula fallback; custom mechanics in backlog

### **Hwei** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Signature of the Visionary** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Subject: Disaster** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Subject: Serenity** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Subject: Torment** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Spiraling Despair** — Standard formula fallback; custom mechanics in backlog

### **Illaoi** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Prophet of an Elder God** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Tentacle Smash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Harsh Lesson** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Test of Spirit** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Leap of Faith** — Standard formula fallback; custom mechanics in backlog

### **Irelia** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Ionian Fervor** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bladesurge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Defiant Dance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Flawless Duet** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Vanguard's Edge** — Standard formula fallback; custom mechanics in backlog

### **Ivern** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Friend of the Forest** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Rootcaller** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Brushmaker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Triggerseed** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Daisy!** — Standard formula fallback; custom mechanics in backlog

### **Janna** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Tailwind** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Howling Gale** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Zephyr** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Eye Of The Storm** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Monsoon** — Standard formula fallback; custom mechanics in backlog

### **Jarvan IV** (Jungle) — 🟢 Fully Implemented
- <input type="checkbox" checked /> **Passive: Martial Cadence** — 8% target current HP on-hit bonus physical damage
- <input type="checkbox" checked /> **Q: Dragon Strike** — Armor shred calculation
- <input type="checkbox" checked /> **W: Golden Aegis** — Dynamic multi-enemy scaling shield
- <input type="checkbox" checked /> **E: Demacian Standard** — Attack speed aura & burst combo calculation
- <input type="checkbox" checked /> **R: Cataclysm** — Full physical burst damage calculation

### **Jax** (Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Relentless Assault** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Leap Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Empower** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Counter Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Grandmaster-at-Arms** — Standard formula fallback; custom mechanics in backlog

### **Jayce** (Fighter / Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Hextech Capacitor** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: To the Skies! / Shock Blast** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Lightning Field / Hyper Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Thundering Blow / Acceleration Gate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Mercury Cannon / Mercury Hammer** — Standard formula fallback; custom mechanics in backlog

### **Jhin** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Whisper** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Dancing Grenade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Deadly Flourish** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Captive Audience** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Curtain Call** — Standard formula fallback; custom mechanics in backlog

### **Jinx** (ADC) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Get Excited!** — Attack speed & movement speed steroid on takedown pending
- <input type="checkbox" /> **Q: Switcheroo!** — Minigun attack speed ramp / Fishbones AoE mana cost pending
- <input type="checkbox" /> **W: Zap!** — Zap physical damage & slow pending
- <input type="checkbox" /> **E: Flame Chompers!** — Flame Chompers root traps pending
- <input type="checkbox" checked /> **R: Super Mega Death Rocket!** — Base damage + 25% / 30% / 35% missing HP physical execute damage

### **K'Sante** (Tank / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Dauntless Instinct** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Ntofo Strikes** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Path Maker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Footwork** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: All Out** — Standard formula fallback; custom mechanics in backlog

### **Kai'Sa** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Second Skin** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Icathian Rain** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Void Seeker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Supercharge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Killer Instinct** — Standard formula fallback; custom mechanics in backlog

### **Kalista** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Martial Poise** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Pierce** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Sentinel** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Rend** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Fate's Call** — Standard formula fallback; custom mechanics in backlog

### **Karma** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Gathering Fire** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Inner Flame** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Focused Resolve** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Inspire** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Mantra** — Standard formula fallback; custom mechanics in backlog

### **Karthus** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Death Defied** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Lay Waste** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Wall of Pain** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Defile** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Requiem** — Standard formula fallback; custom mechanics in backlog

### **Kassadin** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Void Stone** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Null Sphere** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Nether Blade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Force Pulse** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Riftwalk** — Standard formula fallback; custom mechanics in backlog

### **Katarina** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Voracity** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bouncing Blade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Preparation** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Shunpo** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Death Lotus** — Standard formula fallback; custom mechanics in backlog

### **Kayle** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Divine Ascent** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Radiant Blast** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Celestial Blessing** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Starfire Spellblade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Divine Judgment** — Standard formula fallback; custom mechanics in backlog

### **Kayn** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: The Darkin Scythe** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Reaping Slash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Blade's Reach** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Shadow Step** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Umbral Trespass** — Standard formula fallback; custom mechanics in backlog

### **Kennen** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Mark of the Storm** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Thundering Shuriken** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Electrical Surge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Lightning Rush** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Slicing Maelstrom** — Standard formula fallback; custom mechanics in backlog

### **Kha'Zix** (Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Unseen Threat** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Taste Their Fear** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Void Spike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Leap** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Void Assault** — Standard formula fallback; custom mechanics in backlog

### **Kindred** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Mark of the Kindred** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Dance of Arrows** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Wolf's Frenzy** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Mounting Dread** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Lamb's Respite** — Standard formula fallback; custom mechanics in backlog

### **Kled** (Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Skaarl, the Cowardly Lizard** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bear Trap on a Rope** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Violent Tendencies** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Jousting** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Chaaaaaaaarge!!!** — Standard formula fallback; custom mechanics in backlog

### **Kog'Maw** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Icathian Surprise** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Caustic Spittle** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Bio-Arcane Barrage** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Void Ooze** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Living Artillery** — Standard formula fallback; custom mechanics in backlog

### **LeBlanc** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Mirror Image** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Sigil of Malice** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Distortion** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Ethereal Chains** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Mimic** — Standard formula fallback; custom mechanics in backlog

### **Lee Sin** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Flurry** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Sonic Wave / Resonating Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Safeguard / Iron Will** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Tempest / Cripple** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Dragon's Rage** — Standard formula fallback; custom mechanics in backlog

### **Leona** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Sunlight** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Shield of Daybreak** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Eclipse** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Zenith Blade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Solar Flare** — Standard formula fallback; custom mechanics in backlog

### **Lillia** (Fighter / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Dream-Laden Bough** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Blooming Blows** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Watch Out! Eep!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Swirlseed** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Lilting Lullaby** — Standard formula fallback; custom mechanics in backlog

### **Lissandra** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Iceborn Subjugation** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Ice Shard** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ring of Frost** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Glacial Path** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Frozen Tomb** — Standard formula fallback; custom mechanics in backlog

### **Locke** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Silver Stake** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Ritual Nails** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Soul Ignition** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Ashen Pursuit** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Purgatory** — Standard formula fallback; custom mechanics in backlog

### **Lucian** (Marksman / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Lightslinger** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Piercing Light** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ardent Blaze** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Relentless Pursuit** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: The Culling** — Standard formula fallback; custom mechanics in backlog

### **Lulu** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Pix, Faerie Companion** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Glitterlance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Whimsy** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Help, Pix!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Wild Growth** — Standard formula fallback; custom mechanics in backlog

### **Lux** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Illumination** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Light Binding** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Prismatic Barrier** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Lucent Singularity** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Final Spark** — Standard formula fallback; custom mechanics in backlog

### **Malphite** (Top) — 🔵 Baseline Tested
- <input type="checkbox" /> **Passive: Granite Shield** — Granite Shield % max HP passive pending
- <input type="checkbox" /> **Q: Seismic Shard** — Movement speed steal pending
- <input type="checkbox" /> **W: Thunderclap** — Passive armor multiplier & thunderclap cone pending
- <input type="checkbox" /> **E: Ground Slam** — Armor-scaling slam & attack speed slow pending
- <input type="checkbox" /> **R: Unstoppable Force** — Unstoppable Force knockup burst pending

### **Malzahar** (Mid) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Void Shift** — Void Shift spell shield & CC immunity pending
- <input type="checkbox" /> **Q: Call of the Void** — Silence beam dual portal pending
- <input type="checkbox" /> **W: Void Swarm** — Voidling minion swarm summons pending
- <input type="checkbox" checked /> **E: Malefic Visions** — Continuous ticking magic damage DoT in combat simulation engine
- <input type="checkbox" /> **R: Nether Grasp** — Nether Grasp suppression tether & null zone pending

### **Maokai** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Sap Magic** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bramble Smash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Twisted Advance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Sapling Toss** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Nature's Grasp** — Standard formula fallback; custom mechanics in backlog

### **Master Yi** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Double Strike** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Alpha Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Meditate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Wuju Style** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Highlander** — Standard formula fallback; custom mechanics in backlog

### **Mel** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Searing Brilliance** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Radiant Volley** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Rebuttal** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Solar Snare** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Golden Eclipse** — Standard formula fallback; custom mechanics in backlog

### **Milio** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Fired Up!** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Ultra Mega Fire Kick** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Cozy Campfire** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Warm Hugs** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Breath of Life** — Standard formula fallback; custom mechanics in backlog

### **Miss Fortune** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Love Tap** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Double Up** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Strut** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Make It Rain** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Bullet Time** — Standard formula fallback; custom mechanics in backlog

### **Mordekaiser** (Fighter / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Darkness Rise** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Obliterate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Indestructible** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Death's Grasp** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Realm of Death** — Standard formula fallback; custom mechanics in backlog

### **Morgana** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Soul Siphon** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Dark Binding** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Tormented Shadow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Black Shield** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Soul Shackles** — Standard formula fallback; custom mechanics in backlog

### **Naafiri** (Assassin / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: We Are More** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Darkin Daggers** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: The Call of the Pack** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Eviscerate** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Hounds' Pursuit** — Standard formula fallback; custom mechanics in backlog

### **Nami** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Surging Tides** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Aqua Prison** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ebb and Flow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Tidecaller's Blessing** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Tidal Wave** — Standard formula fallback; custom mechanics in backlog

### **Nasus** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Soul Eater** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Siphoning Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Wither** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Spirit Fire** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Fury of the Sands** — Standard formula fallback; custom mechanics in backlog

### **Nautilus** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Staggering Blow** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Dredge Line** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Titan's Wrath** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Riptide** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Depth Charge** — Standard formula fallback; custom mechanics in backlog

### **Neeko** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Inherent Glamour** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Blooming Burst** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Shapesplitter** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Tangle-Barbs** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Pop Blossom** — Standard formula fallback; custom mechanics in backlog

### **Nidalee** (Assassin / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Prowl** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Javelin Toss / Takedown** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Bushwhack / Pounce** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Primal Surge / Swipe** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Aspect Of The Cougar** — Standard formula fallback; custom mechanics in backlog

### **Nilah** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Joy Unending** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Formless Blade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Jubilant Veil** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Slipstream** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Apotheosis** — Standard formula fallback; custom mechanics in backlog

### **Nocturne** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Umbra Blades** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Duskbringer** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Shroud of Darkness** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Unspeakable Horror** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Paranoia** — Standard formula fallback; custom mechanics in backlog

### **Nunu & Willump** (Tank / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Call of the Freljord** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Consume** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Biggest Snowball Ever!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Snowball Barrage** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Absolute Zero** — Standard formula fallback; custom mechanics in backlog

### **Olaf** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Berserker Rage** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Undertow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Tough It Out** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Reckless Swing** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Ragnarok** — Standard formula fallback; custom mechanics in backlog

### **Orianna** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Clockwork Windup** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Command: Attack** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Command: Dissonance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Command: Protect** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Command: Shockwave** — Standard formula fallback; custom mechanics in backlog

### **Ornn** (Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Living Forge** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Volcanic Rupture** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Bellows Breath** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Searing Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Call of the Forge God** — Standard formula fallback; custom mechanics in backlog

### **Pantheon** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Mortal Will** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Comet Spear** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Shield Vault** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Aegis Assault** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Grand Starfall** — Standard formula fallback; custom mechanics in backlog

### **Poppy** (Tank / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Iron Ambassador** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Hammer Shock** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Steadfast Presence** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Heroic Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Keeper's Verdict** — Standard formula fallback; custom mechanics in backlog

### **Pyke** (Support / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Gift of the Drowned Ones** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bone Skewer** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ghostwater Dive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Phantom Undertow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Death From Below** — Standard formula fallback; custom mechanics in backlog

### **Qiyana** (Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Royal Privilege** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Elemental Wrath / Edge of Ixtal** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Terrashape** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Audacity** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Supreme Display of Talent** — Standard formula fallback; custom mechanics in backlog

### **Quinn** (Marksman / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Harrier** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Blinding Assault** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Heightened Senses** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Vault** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Behind Enemy Lines** — Standard formula fallback; custom mechanics in backlog

### **Rakan** (Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Fey Feathers** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Gleaming Quill** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Grand Entrance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Battle Dance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: The Quickness** — Standard formula fallback; custom mechanics in backlog

### **Rammus** (Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Spiked Shell** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Powerball** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Defensive Ball Curl** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Frenzying Taunt** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Soaring Slam** — Standard formula fallback; custom mechanics in backlog

### **Rek'Sai** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Fury of the Xer'Sai** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Queen's Wrath / Prey Seeker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Burrow / Un-burrow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Furious Bite / Tunnel** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Void Rush** — Standard formula fallback; custom mechanics in backlog

### **Rell** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Break the Mold** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Shattering Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ferromancy: Crash Down** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Full Tilt** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Magnet Storm** — Standard formula fallback; custom mechanics in backlog

### **Renata Glasc** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Leverage** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Handshake** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Bailout** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Loyalty Program** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Hostile Takeover** — Standard formula fallback; custom mechanics in backlog

### **Renekton** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Reign of Anger** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Cull the Meek** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ruthless Predator** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Slice and Dice** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Dominus** — Standard formula fallback; custom mechanics in backlog

### **Rengar** (Assassin / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Unseen Predator** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Savagery** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Battle Roar** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Bola Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Thrill of the Hunt** — Standard formula fallback; custom mechanics in backlog

### **Riven** (Top) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Runic Blade** — Runic Blade passive charge auto-attack scaling pending
- <input type="checkbox" /> **Q: Broken Wings** — 3-cast sequence knockup pending
- <input type="checkbox" /> **W: Ki Burst** — AoE stun burst pending
- <input type="checkbox" /> **E: Valor** — AD-scaling dash shield pending
- <input type="checkbox" checked /> **R: Blade of the Exile** — Wind Slash (R2) execute amplification (up to +200% bonus below 25% HP)

### **Rumble** (Fighter / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Junkyard Titan** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Flamespitter** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Scrap Shield** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Electro Harpoon** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: The Equalizer** — Standard formula fallback; custom mechanics in backlog

### **Ryze** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Arcane Mastery** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Overload** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Rune Prison** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Spell Flux** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Realm Warp** — Standard formula fallback; custom mechanics in backlog

### **Samira** (Marksman / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Daredevil Impulse** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Flair** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Blade Whirl** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Wild Rush** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Inferno Trigger** — Standard formula fallback; custom mechanics in backlog

### **Sejuani** (Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Fury of the North** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Arctic Assault** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Winter's Wrath** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Permafrost** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Glacial Prison** — Standard formula fallback; custom mechanics in backlog

### **Senna** (Support / Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Absolution** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Piercing Darkness** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Last Embrace** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Curse of the Black Mist** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Dawning Shadow** — Standard formula fallback; custom mechanics in backlog

### **Seraphine** (Mid / Support) — 🟢 Fully Implemented
- <input type="checkbox" checked /> **Passive: Stage Presence** — Echo double-cast logic & Notes bonus damage
- <input type="checkbox" checked /> **Q: High Note** — Missing HP execution scaling (up to +75% bonus damage)
- <input type="checkbox" checked /> **W: Surround Sound** — Scaling shield & missing HP percentage heal
- <input type="checkbox" checked /> **E: Beat Drop** — Slow / Root / Stun CC progression
- <input type="checkbox" checked /> **R: Encore** — Charm CC & projectile hit extension

### **Sett** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Pit Grit** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Knuckle Down** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Haymaker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Facebreaker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: The Show Stopper** — Standard formula fallback; custom mechanics in backlog

### **Shaco** (Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Backstab** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Deceive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Jack In The Box** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Two-Shiv Poison** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Hallucinate** — Standard formula fallback; custom mechanics in backlog

### **Shen** (Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Ki Barrier** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Twilight Assault** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Spirit's Refuge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Shadow Dash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Stand United** — Standard formula fallback; custom mechanics in backlog

### **Shyvana** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Scalemail** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Emberstrike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Inferno Aegis** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Molten Burst** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Dragon's Descent** — Standard formula fallback; custom mechanics in backlog

### **Singed** (Tank / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Noxious Slipstream** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Poison Trail** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Mega Adhesive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Fling** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Insanity Potion** — Standard formula fallback; custom mechanics in backlog

### **Sion** (Tank / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Glory in Death** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Decimating Smash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Soul Furnace** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Roar of the Slayer** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Unstoppable Onslaught** — Standard formula fallback; custom mechanics in backlog

### **Sivir** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Fleet of Foot** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Boomerang Blade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ricochet** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Spell Shield** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: On The Hunt** — Standard formula fallback; custom mechanics in backlog

### **Skarner** (Tank / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Threads of Vibration** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Shattered Earth / Upheaval** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Seismic Bastion** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Ixtal's Impact** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Impale** — Standard formula fallback; custom mechanics in backlog

### **Smolder** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Dragon Practice** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Super Scorcher Breath** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Achooo!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Flap, Flap, Flap** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: MMOOOMMMM!** — Standard formula fallback; custom mechanics in backlog

### **Sona** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Power Chord** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Hymn of Valor** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Aria of Perseverance** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Song of Celerity** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Crescendo** — Standard formula fallback; custom mechanics in backlog

### **Soraka** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Salvation** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Starcall** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Astral Infusion** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Equinox** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Wish** — Standard formula fallback; custom mechanics in backlog

### **Swain** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Ravenous Flock** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Death's Hand** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Vision of Empire** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Nevermove** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Demonic Ascension** — Standard formula fallback; custom mechanics in backlog

### **Sylas** (Mage / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Petricite Burst** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Chain Lash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Kingslayer** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Abscond / Abduct** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Hijack** — Standard formula fallback; custom mechanics in backlog

### **Syndra** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Transcendent** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Dark Sphere** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Force of Will** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Scatter the Weak** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Unleashed Power** — Standard formula fallback; custom mechanics in backlog

### **Tahm Kench** (Tank / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: An Acquired Taste** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Tongue Lash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Abyssal Dive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Thick Skin** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Devour** — Standard formula fallback; custom mechanics in backlog

### **Taliyah** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Rock Surfing** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Threaded Volley** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Seismic Shove** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Unraveled Earth** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Weaver's Wall** — Standard formula fallback; custom mechanics in backlog

### **Talon** (Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Blade's End** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Noxian Diplomacy** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Rake** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Assassin's Path** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Shadow Assault** — Standard formula fallback; custom mechanics in backlog

### **Taric** (Support / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Bravado** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Starlight's Touch** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Bastion** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Dazzle** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Cosmic Radiance** — Standard formula fallback; custom mechanics in backlog

### **Teemo** (Top) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Guerrilla Warfare** — Invisibility attack speed buff pending
- <input type="checkbox" /> **Q: Blinding Dart** — Blind status duration pending
- <input type="checkbox" /> **W: Move Quick** — Passive & active movement speed pending
- <input type="checkbox" checked /> **E: Toxic Shot** — On-hit poison magic damage DoT with continuous tick interval in combat engine
- <input type="checkbox" /> **R: Noxious Trap** — Noxious Trap shroom mushroom bounce & explosion pending

### **Thresh** (Support) — 🔵 Baseline Tested
- <input type="checkbox" /> **Passive: Damnation** — Damnation soul harvesting armor/AP stacking pending
- <input type="checkbox" /> **Q: Death Sentence** — Death Sentence hook CC pending
- <input type="checkbox" /> **W: Dark Passage** — Dark Passage lantern shield & ally pull pending
- <input type="checkbox" /> **E: Flay** — Flay passive on-hit charge & knockback active pending
- <input type="checkbox" /> **R: The Box** — The Box wall damage & 99% slow pending

### **Tristana** (Marksman / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Draw a Bead** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Rapid Fire** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Rocket Jump** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Explosive Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Buster Shot** — Standard formula fallback; custom mechanics in backlog

### **Trundle** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: King's Tribute** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Chomp** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Frozen Domain** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Pillar of Ice** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Subjugate** — Standard formula fallback; custom mechanics in backlog

### **Tryndamere** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Battle Fury** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bloodlust** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Mocking Shout** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Spinning Slash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Undying Rage** — Standard formula fallback; custom mechanics in backlog

### **Twisted Fate** (Mage / Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Loaded Dice** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Wild Cards** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Pick a Card** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Stacked Deck** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Destiny** — Standard formula fallback; custom mechanics in backlog

### **Twitch** (ADC) — 🟡 Partially Implemented
- <input type="checkbox" checked /> **Passive: Deadly Venom** — Stacking true damage DoT per auto-attack in combat simulation engine
- <input type="checkbox" /> **Q: Ambush** — Camouflage stealth & attack speed pending
- <input type="checkbox" /> **W: Venom Cask** — Venom Cask slow zone pending
- <input type="checkbox" /> **E: Contaminate** — Contaminate physical/magic damage per stack pending
- <input type="checkbox" /> **R: Spray and Pray** — Piercing bolt range & AD steroid pending

### **Udyr** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Bridge Between** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Wilding Claw** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Iron Mantle** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Blazing Stampede** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Wingborne Storm** — Standard formula fallback; custom mechanics in backlog

### **Urgot** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Echoing Flames** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Corrosive Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Purge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Disdain** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Fear Beyond Death** — Standard formula fallback; custom mechanics in backlog

### **Varus** (Marksman / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Living Vengeance** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Piercing Arrow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Blighted Quiver** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Hail of Arrows** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Chain of Corruption** — Standard formula fallback; custom mechanics in backlog

### **Vayne** (Marksman / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Night Hunter** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Tumble** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Silver Bolts** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Condemn** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Final Hour** — Standard formula fallback; custom mechanics in backlog

### **Veigar** (Mid) — 🟡 Partially Implemented
- <input type="checkbox" /> **Passive: Phenomenal Evil Power** — Phenomenal Evil AP stacking passive pending
- <input type="checkbox" /> **Q: Baleful Strike** — Double-hit skillshot pending
- <input type="checkbox" /> **W: Dark Matter** — Cooldown reduction based on AP pending
- <input type="checkbox" /> **E: Event Horizon** — Stun cage CC duration pending
- <input type="checkbox" checked /> **R: Primordial Burst** — Dynamic missing HP scaling (up to +100% bonus damage below 33% HP)

### **Vel'Koz** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Organic Deconstruction** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Plasma Fission** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Void Rift** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Tectonic Disruption** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Life Form Disintegration Ray** — Standard formula fallback; custom mechanics in backlog

### **Vex** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Doom 'n Gloom** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Mistral Bolt** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Personal Space** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Looming Darkness** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Shadow Surge** — Standard formula fallback; custom mechanics in backlog

### **Vi** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Blast Shield** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Vault Breaker** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Denting Blows** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Relentless Force** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Cease and Desist** — Standard formula fallback; custom mechanics in backlog

### **Viego** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Sovereign's Domination** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Blade of the Ruined King** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Spectral Maw** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Harrowed Path** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Heartbreaker** — Standard formula fallback; custom mechanics in backlog

### **Viktor** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Glorious Evolution** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Siphon Power** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Gravity Field** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Hextech Ray** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Arcane Storm** — Standard formula fallback; custom mechanics in backlog

### **Vladimir** (Mage / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Crimson Pact** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Transfusion** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Sanguine Pool** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Tides of Blood** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Hemoplague** — Standard formula fallback; custom mechanics in backlog

### **Volibear** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: The Relentless Storm** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Thundering Smash** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Frenzied Maul** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Sky Splitter** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Stormbringer** — Standard formula fallback; custom mechanics in backlog

### **Warwick** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Eternal Hunger** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Jaws of the Beast** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Blood Hunt** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Primal Howl** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Infinite Duress** — Standard formula fallback; custom mechanics in backlog

### **Wukong** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Stone Skin** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Crushing Blow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Warrior Trickster** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Nimbus Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Cyclone** — Standard formula fallback; custom mechanics in backlog

### **Xayah** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Clean Cuts** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Double Daggers** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Deadly Plumage** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Bladecaller** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Featherstorm** — Standard formula fallback; custom mechanics in backlog

### **Xerath** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Mana Surge** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Arcanopulse** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Eye of Destruction** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Shocking Orb** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Rite of the Arcane** — Standard formula fallback; custom mechanics in backlog

### **Xin Zhao** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Determination** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Three Talon Strike** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Wind Becomes Lightning** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Audacious Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Crescent Guard** — Standard formula fallback; custom mechanics in backlog

### **Yasuo** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Way of the Wanderer** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Steel Tempest** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Wind Wall** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Sweeping Blade** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Last Breath** — Standard formula fallback; custom mechanics in backlog

### **Yone** (Fighter / Assassin) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Way of the Hunter** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Mortal Steel** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Spirit Cleave** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Soul Unbound** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Fate Sealed** — Standard formula fallback; custom mechanics in backlog

### **Yorick** (Fighter / Tank) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Shepherd of Souls** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Last Rites** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Dark Procession** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Mourning Mist** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Eulogy of the Isles** — Standard formula fallback; custom mechanics in backlog

### **Yunara** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Vow of the First Lands** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Cultivation of Spirit** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Arc of Judgment | Arc of Ruin** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Kanmei's Steps | Untouchable Shadow** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Transcend One's Self** — Standard formula fallback; custom mechanics in backlog

### **Yuumi** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Feline Friendship** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Prowling Projectile** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: You and Me!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Zoomies** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Final Chapter** — Standard formula fallback; custom mechanics in backlog

### **Zaahen** (Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Cultivation of War** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: The Darkin Glaive** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Dreaded Return** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Aureate Rush** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Grim Deliverance** — Standard formula fallback; custom mechanics in backlog

### **Zac** (Tank / Fighter) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Cell Division** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Stretching Strikes** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Unstable Matter** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Elastic Slingshot** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Let's Bounce!** — Standard formula fallback; custom mechanics in backlog

### **Zed** (Mid) — 🔵 Baseline Tested
- <input type="checkbox" /> **Passive: Contempt for the Weak** — Contempt for the Weak % max HP magic damage execute on low HP pending
- <input type="checkbox" /> **Q: Razor Shuriken** — Razor Shuriken multi-hit reduction pending
- <input type="checkbox" /> **W: Living Shadow** — Living Shadow swap & mimic pending
- <input type="checkbox" /> **E: Shadow Slash** — Shadow Slash slow pending
- <input type="checkbox" /> **R: Death Mark** — Death Mark pop delayed damage stored percentage pending

### **Zeri** (Marksman) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Living Battery** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Burst Fire** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Ultrashock Laser** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Spark Surge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Lightning Crash** — Standard formula fallback; custom mechanics in backlog

### **Ziggs** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Short Fuse** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Bouncing Bomb** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Satchel Charge** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Hexplosive Minefield** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Mega Inferno Bomb** — Standard formula fallback; custom mechanics in backlog

### **Zilean** (Support / Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Time In A Bottle** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Time Bomb** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Rewind** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Time Warp** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Chronoshift** — Standard formula fallback; custom mechanics in backlog

### **Zoe** (Mage) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: More Sparkles!** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Paddle Star!** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Spell Thief** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Sleepy Trouble Bubble** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Portal Jump** — Standard formula fallback; custom mechanics in backlog

### **Zyra** (Mage / Support) — ⚪ In Backlog
- <input type="checkbox" /> **Passive: Garden of Thorns** — Standard formula fallback; custom passive in backlog
- <input type="checkbox" /> **Q: Deadly Spines** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **W: Rampant Growth** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **E: Grasping Roots** — Standard formula fallback; custom mechanics in backlog
- <input type="checkbox" /> **R: Stranglethorns** — Standard formula fallback; custom mechanics in backlog

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
   - Update the champion's ability checkboxes to `<input type="checkbox" checked />` in this document.
   - The champion portrait in the simulator will automatically switch from black & white (grayscale) to full color!
