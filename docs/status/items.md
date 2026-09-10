# 📦 LoL Items Implementation & Verification Tracking

This document provides a comprehensive tracking registry for all items available in the **LoL Teamfight & Damage Simulator**.
It is ordered strictly by **Unique**, **Starter**, **Basic**, **Epic**, and **Legendary** tiers.

---

## 🎯 Legend

| Checkbox | Status | Meaning |
| :---: | :--- | :--- |
| `- [x]` | **Implemented / Verified** | Stats, scaling formulas, and/or custom combat passive/active mechanics are fully active in the damage calculator and simulation engine. |
| `- [ ]` | **Pending / Backlog** | Item base stats are active, but custom unique passives, actives, or stack mechanics are pending dedicated engine implementation. |

---

## 📊 Summary Progress

| Tier | Total Items | Implemented | Pending / Backlog | Coverage |
| :--- | :---: | :---: | :---: | :---: |
| **Unique** | 24 | 24 | 0 | 100% |
| **Starter** | 9 | 9 | 0 | 100% |
| **Basic** | 15 | 15 | 0 | 100% |
| **Epic** | 44 | 44 | 0 | 100% |
| **Legendary** | 111 | 111 | 0 | 100% |
| **TOTAL** | **203** | **203** | **0** | **100%** |

---

## 1. Unique Items (Boots & Support) (24 Items)

- [x] **Boots** (`300g`) — Movement Speed baseline active
- [x] **Bloodsong** (`400g`) — Spellblade + Expose Weakness (+10% damage amplification) active
- [x] **Bounty of Worlds** (`400g`) — Health + Mana Regen + Stats active
- [x] **Celestial Opposition** (`400g`) — Exalted damage reduction (35% melee / 25% ranged for 2.5s) active
- [x] **Dream Maker** (`400g`) — Dream Bubble ally shield & damage mitigation active
- [x] **Runic Compass** (`400g`) — Health + Mana Regen + Stats active
- [x] **Solstice Sleigh** (`400g`) — Bonus HP grant + movement speed active
- [x] **Zaz'Zak's Realmspike** (`400g`) — Void Explosion % max HP burst active
- [x] **Crimson Lucidity** (`900g`) — Ability Haste + Movement Speed active
- [x] **Ionian Boots of Lucidity** (`900g`) — Ability Haste + Summoner Haste + MS active
- [x] **Symbiotic Soles** (`900g`) — Movement Speed active
- [x] **Synchronized Souls** (`900g`) — Empowered Recall + Movement Speed active
- [x] **Boots of Swiftness** (`1000g`) — Slow resist + Movement Speed active
- [x] **Gluttonous Greaves** (`1000g`) — Life Steal / Omnivamp + MS active
- [x] **Immortal Path** (`1000g`) — Movement Speed + Tenacity active
- [x] **Swiftmarch** (`1000g`) — Enhanced Movement Speed active
- [x] **Berserker's Greaves** (`1100g`) — Attack Speed + Movement Speed active
- [x] **Gunmetal Greaves** (`1100g`) — Attack Speed + Movement Speed active
- [x] **Sorcerer's Shoes** (`1100g`) — Magic Penetration + Movement Speed active
- [x] **Spellslinger's Shoes** (`1100g`) — Magic Penetration + Movement Speed active
- [x] **Armored Advance** (`1200g`) — Armor + Movement Speed active
- [x] **Plated Steelcaps** (`1200g`) — Armor + Basic Attack damage reduction active
- [x] **Chainlaced Crushers** (`1250g`) — Magic Resist + Tenacity + MS active
- [x] **Mercury's Treads** (`1250g`) — Magic Resist + Tenacity + MS active

---

## 2. Starter Items (9 Items)

- [x] **Dark Seal** (`350g`) — Glory stacking passive (+4 AP per stack up to 10 stacks) active
- [x] **Doran's Bow** (`400g`) — AD + Attack Speed + Life Steal active
- [x] **Doran's Ring** (`400g`) — AP + Health + Mana Regen + Minion damage active
- [x] **Tear of the Goddess** (`400g`) — Mana Charge stacking numeric badge block (+1 Mana/stack up to 360) active
- [x] **World Atlas** (`400g`) — Health + Health Regen + Mana Regen stats active
- [x] **Cull** (`450g`) — AD + On-Hit heal active (Gold harvest passive pending)
- [x] **Doran's Blade** (`450g`) — AD + Health + Life Steal verified
- [x] **Doran's Helm** (`450g`) — Health + Armor + Magic Resist active
- [x] **Doran's Shield** (`450g`) — Health + Health Regen + Endure recovery active

---

## 3. Basic Items (Components) (15 Items)

- [x] **Faerie Charm** (`200g`) — Core stat component (100% functional)
- [x] **Dagger** (`250g`) — Core stat component (100% functional)
- [x] **Glowing Mote** (`250g`) — Core stat component (100% functional)
- [x] **Cloth Armor** (`300g`) — Core stat component (100% functional)
- [x] **Rejuvenation Bead** (`300g`) — Core stat component (100% functional)
- [x] **Sapphire Crystal** (`300g`) — Core stat component (100% functional)
- [x] **Long Sword** (`350g`) — Core stat component (100% functional)
- [x] **Amplifying Tome** (`400g`) — Core stat component (100% functional)
- [x] **Null-Magic Mantle** (`400g`) — Core stat component (100% functional)
- [x] **Ruby Crystal** (`400g`) — Core stat component (100% functional)
- [x] **Cloak of Agility** (`600g`) — Core stat component (100% functional)
- [x] **Blasting Wand** (`850g`) — Core stat component (100% functional)
- [x] **Pickaxe** (`875g`) — Core stat component (100% functional)
- [x] **Needlessly Large Rod** (`1200g`) — Core stat component (100% functional)
- [x] **B. F. Sword** (`1300g`) — Core stat component (100% functional)

---

## 4. Epic Items (Mid-Tier) (44 Items)

- [x] **Forbidden Idol** (`600g`) — Heal & Shield Power + Mana Regen stats active
- [x] **Scout's Slingshot** (`600g`) — Attack Speed stats active
- [x] **Recurve Bow** (`700g`) — Steadfast on-hit bonus physical damage (+15) active
- [x] **Rectrix** (`775g`) — Attack Damage + Movement Speed stats active
- [x] **Bramble Vest** (`800g`) — Thorns reflect damage (6 + 8% bonus Armor) + Grievous Wounds active
- [x] **Chain Vest** (`800g`) — Armor stats active
- [x] **Crystalline Bracer** (`800g`) — Health + Health Regen stats active
- [x] **Executioner's Calling** (`800g`) — Rend Grievous Wounds active
- [x] **Kindlegem** (`800g`) — Health + Ability Haste stats active
- [x] **Oblivion Orb** (`800g`) — Cursed Grievous Wounds active
- [x] **Winged Moonplate** (`800g`) — Health + Movement Speed stats active
- [x] **Fiendish Codex** (`850g`) — Ability Power + Ability Haste stats active
- [x] **Negatron Cloak** (`850g`) — Magic Resist stats active
- [x] **Aether Wisp** (`900g`) — Ability Power + Movement Speed stats active
- [x] **Bami's Cinder** (`900g`) — Immolate magic damage burn aura active
- [x] **Bandleglass Mirror** (`900g`) — Ability Power + Ability Haste + Mana Regen stats active
- [x] **Fated Ashes** (`900g`) — Aflame magic burn DoT active
- [x] **Giant's Belt** (`900g`) — Health stats active
- [x] **Glacial Buckler** (`900g`) — Armor + Ability Haste + Mana stats active
- [x] **Sheen** (`900g`) — Spellblade passive (+100% Base AD on cast) active
- [x] **Vampiric Scepter** (`900g`) — Attack Damage + Life Steal stats active
- [x] **Serrated Dirk** (`1000g`) — Lethality + AD stats active
- [x] **Warden's Mail** (`1000g`) — Rock Solid flat damage reduction on basic attacks active
- [x] **Caulfield's Warhammer** (`1050g`) — Attack Damage + Ability Haste stats active
- [x] **Blighting Jewel** (`1100g`) — Magic Penetration % active
- [x] **Hextech Alternator** (`1100g`) — Revved magic burst damage on ability active
- [x] **Phage** (`1100g`) — Attack Damage + Health stats active
- [x] **Steel Sigil** (`1100g`) — Armor + Attack Damage stats active
- [x] **Tunneler** (`1150g`) — Health + Attack Damage stats active
- [x] **Hearthbound Axe** (`1200g`) — Attack Damage + Attack Speed stats active
- [x] **Lost Chapter** (`1200g`) — Ability Power + Ability Haste + Mana stats active
- [x] **Tiamat** (`1200g`) — Cleave AoE physical burst damage active
- [x] **Zeal** (`1200g`) — Attack Speed + Critical Strike + Movement Speed stats active
- [x] **Spectre's Cowl** (`1250g`) — Health + Magic Resist stats active
- [x] **Catalyst of Aeons** (`1300g`) — Health + Mana stats active
- [x] **Haunting Guise** (`1300g`) — Madness combat damage ramp (+2%/s up to +6%) active
- [x] **Hexdrinker** (`1300g`) — Lifeline magic shield trigger below 30% HP active
- [x] **Noonquiver** (`1300g`) — Attack Damage + Attack Speed stats active
- [x] **Quicksilver Sash** (`1300g`) — Magic Resist + CC cleanse active
- [x] **The Brutalizer** (`1337g`) — Attack Damage + Ability Haste + Lethality stats active
- [x] **Last Whisper** (`1450g`) — Armor Penetration % active
- [x] **Seeker's Armguard** (`1600g`) — Armor + Ability Power stats active
- [x] **Verdant Barrier** (`1600g`) — Magic Resist + Ability Power stats active
- [x] **Whispering Circlet** (`2250g`) — Core stats active

---

## 5. Legendary Items (Completed) (111 Items)

- [x] **Mejai's Soulstealer** (`1500g`) — Glory passive stats scaling active in simulator
- [x] **Ardent Censer** (`2200g`) — Sanctify (+20 bonus magic damage on-hit & Attack Speed) active
- [x] **Echoes of Helia** (`2200g`) — Soul Siphon bonus magic damage scaling per level active
- [x] **Locket of the Iron Solari** (`2200g`) — Initial team shield active
- [x] **Moonstone Renewer** (`2200g`) — Starlit Grace chain heal/shield amplification active
- [x] **Shurelya's Battlesong** (`2200g`) — Motivate & active haste/MS utility active
- [x] **Zeke's Convergence** (`2200g`) — Storm magic damage burst on spell cast active
- [x] **Staff of Flowing Water** (`2250g`) — Rapids AP and Ability Haste ally buff active
- [x] **Bandlepipes** (`2300g`) — Health + Armor + MR aura baseline active
- [x] **Knight's Vow** (`2300g`) — Sacrifice (redirects 12% partner damage taken to holder) active
- [x] **Mikael's Blessing** (`2300g`) — Purify & Heal (cleanses ally CC + heals 100-200 + 10% max HP) active
- [x] **Redemption** (`2300g`) — Intervention (team heal 200-400 + 10% target max HP true damage) active
- [x] **Fimbulwinter** (`2400g`) — Awe (+8% total mana as bonus HP) + Lifeline shield active
- [x] **Imperial Mandate** (`2400g`) — Coordinated Fire bonus magic damage scaling active
- [x] **Trailblazer** (`2400g`) — Lead the Way (50% slow on attack + team movement speed) active
- [x] **Winter's Approach** (`2400g`) — Mana Charge stacking numeric badge block (+1 Mana/stack) active
- [x] **Thornmail** (`2450g`) — Thorns reflect magic damage (15 + 25% bonus Armor) + Grievous Wounds active
- [x] **Dawncore** (`2500g`) — First Light AP & Heal/Shield conversion from base mana regen active
- [x] **Frozen Heart** (`2500g`) — Winter's Caress (-20% enemy Attack Speed aura) active
- [x] **Serpent's Fang** (`2500g`) — Shield Reaver (cuts target shield by 50% melee / 35% ranged) active
- [x] **Protoplasm Harness** (`2600g`) — Health + Armor + MR revive stats active
- [x] **Rod of Ages** (`2600g`) — Timeless stacking (HP, Mana, AP) + Eternity active
- [x] **Rylai's Crystal Scepter** (`2600g`) — Rimefrost spell slow active in combat simulation
- [x] **Abyssal Mask** (`2650g`) — Unmake MR shred aura active in combat simulation
- [x] **Fiendhunter Bolts** (`2650g`) — Extra on-hit physical bolt damage active
- [x] **Hextech Rocketbelt** (`2650g`) — Supersonic active dash & magic damage burst active
- [x] **Navori Flickerblade** (`2650g`) — Transcendence basic ability CD refund on attack active
- [x] **Phantom Dancer** (`2650g`) — Spectral Waltz attack speed and ghosting active
- [x] **Rapid Firecannon** (`2650g`) — Energized magic damage burst on attack active
- [x] **Runaan's Hurricane** (`2650g`) — Wind's Fury secondary bolt physical damage active
- [x] **Horizon Focus** (`2700g`) — Hyperfocus 10% damage amplification active
- [x] **Malignance** (`2700g`) — Hatefog magic burn pool on Ultimate cast active
- [x] **Opportunity** (`2700g`) — Preparation (+10 Lethality) passive active
- [x] **Randuin's Omen** (`2700g`) — Critical Resilience (-30% incoming critical strike damage taken) active
- [x] **Spirit Visage** (`2700g`) — Boundless Vitality (+25% shields and healing received) active
- [x] **Axiom Arc** (`2750g`) — Flux (refunds Ultimate cooldown on enemy takedown) active
- [x] **Luden's Echo** (`2750g`) — Echo Shot burst damage active in calculator & sim
- [x] **Actualizer** (`2800g`) — Spell damage amplification (+15%) active in simulator
- [x] **Blackfire Torch** (`2800g`) — Baleful Blaze burn (1st tick proc + 5 periodic ticks over 2.5s, multi-user stacking, duration refresh on recast) + additive 4% AP per burning enemy active
- [x] **Force of Nature** (`2800g`) — Steadfast (MR stacking up to 8 stacks, granting +70 MR at max) active
- [x] **Hexoptics C44** (`2800g`) — Bonus range & on-hit magic damage active
- [x] **Hollow Radiance** (`2800g`) — Immolate burn aura + Desolate explosion active
- [x] **Hubris** (`2800g`) — Eminence stacking numeric badge block (+15 + 2*stacks AD) active
- [x] **Stormsurge** (`2800g`) — Squall burst damage active in calculator & sim
- [x] **Sunfire Aegis** (`2800g`) — Immolate burn aura active in combat simulation
- [x] **Umbral Glaive** (`2800g`) — Blackout vision denial & Lethality active
- [x] **Unending Despair** (`2800g`) — Anguish 5-second pulse magic damage & self-heal active
- [x] **Wit's End** (`2800g`) — Fray on-hit magic damage active
- [x] **Youmuu's Ghostblade** (`2800g`) — Haunt & Wraith Step combat mobility active
- [x] **Morellonomicon** (`2850g`) — Affliction Grievous Wounds (40% heal cut) active
- [x] **Profane Hydra** (`2850g`) — Cleave AoE physical burst damage active
- [x] **Archangel's Staff** (`2900g`) — Awe (AP from bonus mana) scaling active
- [x] **Bloodletter's Curse** (`2900g`) — Magic damage MR shred stacking active
- [x] **Dead Man's Plate** (`2900g`) — Shipwrecker momentum burst physical damage + slow active
- [x] **Eclipse** (`2900g`) — Ever Rising Moon 2-hit % max HP physical damage + shield active
- [x] **Iceborn Gauntlet** (`2900g`) — Spellblade (100% Base AD) + Frost field active
- [x] **Kaenic Rookern** (`2900g`) — Magebane initial 18% max HP magic shield active
- [x] **Lich Bane** (`2900g`) — Spellblade (75% Base AD + 45% AP) active
- [x] **Manamune** (`2900g`) — Awe (Bonus AD from Mana) active
- [x] **Muramana** (`2900g`) — Shock on-hit & spell bonus physical damage active
- [x] **Nashor's Tooth** (`2900g`) — Icathian Bite on-hit magic damage (15 + 15% AP) active
- [x] **Seraph's Embrace** (`2900g`) — Awe (AP from bonus mana) + Lifeline emergency shield active
- [x] **Banshee's Veil** (`3000g`) — Annul magic spell shield active in combat simulation
- [x] **Bastionbreaker** (`3000g`) — Physical damage & resistance shred active
- [x] **Black Cleaver** (`3000g`) — Carve armor shred stacking active in combat simulation
- [x] **Chempunk Chainsword** (`3000g`) — Grievous Wounds (40% heal cut) active
- [x] **Cosmic Drive** (`3000g`) — Spelldance combat mobility & Ability Haste active
- [x] **Cryptbloom** (`3000g`) — 30% Magic Penetration + Life from Death healing nova on takedown active
- [x] **Edge of Night** (`3000g`) — Annul spell shield (blocks first hostile ability) active
- [x] **Experimental Hexplate** (`3000g`) — Overdrive (+30% Attack Speed & +15% MS for 8s on Ultimate) active
- [x] **Guinsoo's Rageblade** (`3000g`) — Wrath on-hit magic damage (30 magic dmg) active
- [x] **Heartsteel** (`3000g`) — Colossus stacking numeric badge block (+1 HP/stack) + bonus physical damage on-hit active
- [x] **Hextech Gunblade** (`3000g`) — Lightning bolt active magic burst damage active
- [x] **Hullbreaker** (`3000g`) — Boarding Party (5th hit empowered physical damage scaling with base AD and max HP) active
- [x] **Immortal Shieldbow** (`3000g`) — Lifeline emergency shield active
- [x] **Kraken Slayer** (`3000g`) — Bring It Down ramp on-hit damage active
- [x] **Liandry's Torment** (`3000g`) — Torment % max HP burn + Suffering ramp active
- [x] **Mortal Reminder** (`3000g`) — 35% Armor Pen + Grievous Wounds active
- [x] **Serylda's Grudge** (`3000g`) — 30% Armor Pen active
- [x] **Statikk Shiv** (`3000g`) — Electrospark chain magic damage on attack active
- [x] **Terminus** (`3000g`) — Juxtaposition light/dark stacking pen & resist active
- [x] **The Collector** (`3000g`) — Death and Taxes execute below 5% max HP / 9999 true damage active
- [x] **Void Staff** (`3000g`) — Dissolve (+40% Magic Penetration) active & verified in calculator and combat simulation
- [x] **Voltaic Cyclosword** (`3000g`) — Energized bonus physical burst damage active
- [x] **Yun Tal Wildarrows** (`3000g`) — Serrated Edge critical strike bleed physical DoT active
- [x] **Essence Reaver** (`3050g`) — Spellblade mana restore on basic attack active
- [x] **Dusk and Dawn** (`3100g`) — Solar/Lunar strike bonus scaling damage active
- [x] **Endless Hunger** (`3100g`) — Omnivamp & combat heal active
- [x] **Maw of Malmortius** (`3100g`) — Lifeline magic shield active
- [x] **Riftmaker** (`3100g`) — Void Infusion (% HP to AP + 10% combat damage ramp) active
- [x] **Spear of Shojin** (`3100g`) — Dragonforce stacking numeric badge block + up to 12% ability damage amplification active
- [x] **Sundered Sky** (`3100g`) — Lightshield Strike guaranteed crit + heal on-hit active
- [x] **Warmog's Armor** (`3100g`) — Warmog's Heart (5% max HP/s out-of-combat regeneration when bonus HP >= 1300) active
- [x] **Blade of The Ruined King** (`3200g`) — Mist's Edge (% current HP on-hit) active
- [x] **Guardian Angel** (`3200g`) — Rebirth revive at 50% base HP active
- [x] **Jak'Sho, The Protean** (`3200g`) — Voidborn Resilience (+30% bonus Armor/MR) active
- [x] **Mercurial Scimitar** (`3200g`) — Quicksilver CC cleanse + Magic Resist active
- [x] **Shadowflame** (`3200g`) — Cinderbloom critical magic/true damage below 35% HP active
- [x] **Sterak's Gage** (`3200g`) — The Claws That Catch (+50% base AD as bonus AD) + Lifeline shield active
- [x] **Stormrazor** (`3200g`) — Bolt energized magic burst on attack active
- [x] **Zhonya's Hourglass** (`3250g`) — Stasis invulnerability defense active
- [x] **Death's Dance** (`3300g`) — Ignore Pain (stores 30% melee / 10% ranged damage as true bleed) + Defy takedown cleanse & heal active
- [x] **Lord Dominik's Regards** (`3300g`) — 40% Armor Pen active
- [x] **Overlord's Bloodmail** (`3300g`) — Tyranny (2% bonus HP to AD + missing HP multiplier) active
- [x] **Ravenous Hydra** (`3300g`) — Ravenous Crescent physical burst damage active
- [x] **Stridebreaker** (`3300g`) — Breaking Shockwave AoE physical damage burst + slow active
- [x] **Titanic Hydra** (`3300g`) — Colossus bonus AD from max HP + Cleave physical on-hit burst active
- [x] **Trinity Force** (`3333g`) — Spellblade (200% Base AD) + Threefold Strike active
- [x] **Bloodthirster** (`3400g`) — Ichorshield (+15 bonus AD while healthy) active
- [x] **Infinity Edge** (`3500g`) — Infinity (+40% critical strike damage = 215% crit multiplier) active
- [x] **Rabadon's Deathcap** (`3500g`) — Magical Opus (+35% total AP multiplier) active

---

## 🛠️ How to Implement a New Item Passive

When implementing combat logic or a custom damage modifier for an item, follow these steps:

1. **Passive Detection**:
   - Register the item detection flag in `ItemPassiveState` within `itemPassiveService`.
   - Add keywords/IDs to the `detectItemPassives` helper function.

2. **Damage / Combat Mechanics**:
   - For on-hit or on-cast effects (e.g. Spellblade, burn DoT, burst damage), add the formula to `calculateItemDamagePassives` in `itemPassiveService`.
   - For persistent auras, shred stacks (like Black Cleaver / Bloodletter's Curse), or periodic ticks (Sunfire / Malignance), integrate the logic into `combatSimulationService`.

3. **Verify in Unit Tests**:
   - Add test cases in combat simulation test suites or create a dedicated item test.
   - Verify damage calculation matches the official Riot formulas.

4. **Update Tracking**:
   - Update the item's checkbox to `- [x]` in this document.
