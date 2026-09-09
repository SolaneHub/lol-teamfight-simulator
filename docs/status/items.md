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
| **Unique** | 24 | 19 | 5 | 79% |
| **Starter** | 9 | 6 | 3 | 67% |
| **Basic** | 15 | 15 | 0 | 100% |
| **Epic** | 44 | 6 | 38 | 14% |
| **Legendary** | 111 | 23 | 88 | 21% |
| **TOTAL** | **203** | **69** | **134** | **34%** |

---

## 1. Unique Items (Boots & Support) (24 Items)

- [x] **Boots** (`300g`) — Movement Speed baseline active
- [ ] **Bloodsong** (`400g`) — Spellblade + Expose Weakness damage amplification pending
- [x] **Bounty of Worlds** (`400g`) — Health + Mana Regen + Stats active
- [ ] **Celestial Opposition** (`400g`) — Exalted damage reduction + Slow pending
- [ ] **Dream Maker** (`400g`) — Dream Bubble ally buff/damage mitigation pending
- [x] **Runic Compass** (`400g`) — Health + Mana Regen + Stats active
- [ ] **Solstice Sleigh** (`400g`) — CC movement speed + ally heal pending
- [ ] **Zaz'Zak's Realmspike** (`400g`) — Void Explosion % max HP burst pending
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

- [ ] **Dark Seal** (`350g`) — Glory stacking passive (Dread AP per kill/assist) pending
- [x] **Doran's Bow** (`400g`) — AD + Attack Speed + Life Steal active
- [x] **Doran's Ring** (`400g`) — AP + Health + Mana Regen + Minion damage active
- [ ] **Tear of the Goddess** (`400g`) — Mana Charge stacking passive pending
- [ ] **World Atlas** (`400g`) — Support gold quest passive pending
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

- [ ] **Forbidden Idol** (`600g`) — Stats baseline active; passive in backlog
- [ ] **Scout's Slingshot** (`600g`) — Stats baseline active; passive in backlog
- [ ] **Recurve Bow** (`700g`) — Stats baseline active; passive in backlog
- [ ] **Rectrix** (`775g`) — Stats baseline active; passive in backlog
- [ ] **Bramble Vest** (`800g`) — Thorns reflect damage + Grievous Wounds pending
- [ ] **Chain Vest** (`800g`) — Stats baseline active; passive in backlog
- [ ] **Crystalline Bracer** (`800g`) — Stats baseline active; passive in backlog
- [ ] **Executioner's Calling** (`800g`) — Rend Grievous Wounds pending
- [ ] **Kindlegem** (`800g`) — Stats baseline active; passive in backlog
- [ ] **Oblivion Orb** (`800g`) — Cursed Grievous Wounds pending
- [ ] **Winged Moonplate** (`800g`) — Stats baseline active; passive in backlog
- [ ] **Fiendish Codex** (`850g`) — Stats baseline active; passive in backlog
- [ ] **Negatron Cloak** (`850g`) — Stats baseline active; passive in backlog
- [ ] **Aether Wisp** (`900g`) — Stats baseline active; passive in backlog
- [x] **Bami's Cinder** (`900g`) — Immolate magic damage burn aura active
- [ ] **Bandleglass Mirror** (`900g`) — Stats baseline active; passive in backlog
- [x] **Fated Ashes** (`900g`) — Aflame magic burn DoT active
- [ ] **Giant's Belt** (`900g`) — Stats baseline active; passive in backlog
- [ ] **Glacial Buckler** (`900g`) — Stats baseline active; passive in backlog
- [x] **Sheen** (`900g`) — Spellblade passive (+100% Base AD on cast) active
- [ ] **Vampiric Scepter** (`900g`) — Stats baseline active; passive in backlog
- [x] **Serrated Dirk** (`1000g`) — Lethality + AD stats active
- [ ] **Warden's Mail** (`1000g`) — Stats baseline active; passive in backlog
- [ ] **Caulfield's Warhammer** (`1050g`) — Stats baseline active; passive in backlog
- [x] **Blighting Jewel** (`1100g`) — Magic Penetration % active
- [ ] **Hextech Alternator** (`1100g`) — Stats baseline active; passive in backlog
- [ ] **Phage** (`1100g`) — Stats baseline active; passive in backlog
- [ ] **Steel Sigil** (`1100g`) — Stats baseline active; passive in backlog
- [ ] **Tunneler** (`1150g`) — Stats baseline active; passive in backlog
- [ ] **Hearthbound Axe** (`1200g`) — Stats baseline active; passive in backlog
- [ ] **Lost Chapter** (`1200g`) — Stats baseline active; passive in backlog
- [ ] **Tiamat** (`1200g`) — Cleave AoE passive / Crescent active pending
- [ ] **Zeal** (`1200g`) — Stats baseline active; passive in backlog
- [ ] **Spectre's Cowl** (`1250g`) — Incorporeal HP regeneration trigger pending
- [ ] **Catalyst of Aeons** (`1300g`) — Eternity mana/health conversion pending
- [ ] **Haunting Guise** (`1300g`) — Madness combat damage ramp pending
- [ ] **Hexdrinker** (`1300g`) — Lifeline magic shield trigger pending
- [ ] **Noonquiver** (`1300g`) — Stats baseline active; passive in backlog
- [ ] **Quicksilver Sash** (`1300g`) — Quicksilver CC cleanse active pending
- [ ] **The Brutalizer** (`1337g`) — Stats baseline active; passive in backlog
- [x] **Last Whisper** (`1450g`) — Armor Penetration % active
- [ ] **Seeker's Armguard** (`1600g`) — Stasis active (one-time Zhonya) pending
- [ ] **Verdant Barrier** (`1600g`) — Spell shield passive pending
- [ ] **Whispering Circlet** (`2250g`) — Stats baseline active; passive in backlog

---

## 5. Legendary Items (Completed) (111 Items)

- [ ] **Mejai's Soulstealer** (`1500g`) — Stats baseline active; passive in backlog
- [ ] **Ardent Censer** (`2200g`) — Stats baseline active; passive in backlog
- [ ] **Echoes of Helia** (`2200g`) — Stats baseline active; passive in backlog
- [ ] **Locket of the Iron Solari** (`2200g`) — Stats baseline active; passive in backlog
- [ ] **Moonstone Renewer** (`2200g`) — Stats baseline active; passive in backlog
- [ ] **Shurelya's Battlesong** (`2200g`) — Stats baseline active; passive in backlog
- [ ] **Zeke's Convergence** (`2200g`) — Stats baseline active; passive in backlog
- [ ] **Staff of Flowing Water** (`2250g`) — Stats baseline active; passive in backlog
- [ ] **Bandlepipes** (`2300g`) — Stats baseline active; passive in backlog
- [ ] **Knight's Vow** (`2300g`) — Stats baseline active; passive in backlog
- [ ] **Mikael's Blessing** (`2300g`) — Stats baseline active; passive in backlog
- [ ] **Redemption** (`2300g`) — Stats baseline active; passive in backlog
- [ ] **Fimbulwinter** (`2400g`) — Stats baseline active; passive in backlog
- [ ] **Imperial Mandate** (`2400g`) — Stats baseline active; passive in backlog
- [ ] **Trailblazer** (`2400g`) — Stats baseline active; passive in backlog
- [ ] **Winter's Approach** (`2400g`) — Stats baseline active; passive in backlog
- [ ] **Thornmail** (`2450g`) — Stats baseline active; passive in backlog
- [ ] **Dawncore** (`2500g`) — Stats baseline active; passive in backlog
- [ ] **Frozen Heart** (`2500g`) — Stats baseline active; passive in backlog
- [ ] **Serpent's Fang** (`2500g`) — Stats baseline active; passive in backlog
- [ ] **Protoplasm Harness** (`2600g`) — Stats baseline active; passive in backlog
- [ ] **Rod of Ages** (`2600g`) — Stats baseline active; passive in backlog
- [ ] **Rylai's Crystal Scepter** (`2600g`) — Stats baseline active; passive in backlog
- [x] **Abyssal Mask** (`2650g`) — Unmake MR shred aura active in combat simulation
- [ ] **Fiendhunter Bolts** (`2650g`) — Stats baseline active; passive in backlog
- [ ] **Hextech Rocketbelt** (`2650g`) — Stats baseline active; passive in backlog
- [ ] **Navori Flickerblade** (`2650g`) — Stats baseline active; passive in backlog
- [ ] **Phantom Dancer** (`2650g`) — Stats baseline active; passive in backlog
- [ ] **Rapid Firecannon** (`2650g`) — Stats baseline active; passive in backlog
- [ ] **Runaan's Hurricane** (`2650g`) — Stats baseline active; passive in backlog
- [ ] **Horizon Focus** (`2700g`) — Stats baseline active; passive in backlog
- [x] **Malignance** (`2700g`) — Hatefog magic burn pool on Ultimate cast active
- [ ] **Opportunity** (`2700g`) — Stats baseline active; passive in backlog
- [ ] **Randuin's Omen** (`2700g`) — Stats baseline active; passive in backlog
- [ ] **Spirit Visage** (`2700g`) — Stats baseline active; passive in backlog
- [ ] **Axiom Arc** (`2750g`) — Stats baseline active; passive in backlog
- [x] **Luden's Echo** (`2750g`) — Echo Shot burst damage active in calculator & sim
- [ ] **Actualizer** (`2800g`) — Stats baseline active; passive in backlog
- [x] **Blackfire Torch** (`2800g`) — Baleful Blaze burn (1st tick proc + 5 periodic ticks over 2.5s, multi-user stacking, duration refresh on recast) + additive 4% AP per burning enemy active
- [ ] **Force of Nature** (`2800g`) — Stats baseline active; passive in backlog
- [ ] **Hexoptics C44** (`2800g`) — Stats baseline active; passive in backlog
- [x] **Hollow Radiance** (`2800g`) — Immolate burn aura + Desolate explosion active
- [ ] **Hubris** (`2800g`) — Stats baseline active; passive in backlog
- [x] **Stormsurge** (`2800g`) — Squall burst damage active in calculator & sim
- [x] **Sunfire Aegis** (`2800g`) — Immolate burn aura active in combat simulation
- [ ] **Umbral Glaive** (`2800g`) — Stats baseline active; passive in backlog
- [ ] **Unending Despair** (`2800g`) — Stats baseline active; passive in backlog
- [ ] **Wit's End** (`2800g`) — Stats baseline active; passive in backlog
- [ ] **Youmuu's Ghostblade** (`2800g`) — Stats baseline active; passive in backlog
- [ ] **Morellonomicon** (`2850g`) — Stats baseline active; passive in backlog
- [ ] **Profane Hydra** (`2850g`) — Stats baseline active; passive in backlog
- [ ] **Archangel's Staff** (`2900g`) — Stats baseline active; passive in backlog
- [x] **Bloodletter's Curse** (`2900g`) — Magic damage MR shred stacking active
- [ ] **Dead Man's Plate** (`2900g`) — Stats baseline active; passive in backlog
- [ ] **Eclipse** (`2900g`) — Stats baseline active; passive in backlog
- [x] **Iceborn Gauntlet** (`2900g`) — Spellblade (100% Base AD) + Frost field active
- [ ] **Kaenic Rookern** (`2900g`) — Stats baseline active; passive in backlog
- [x] **Lich Bane** (`2900g`) — Spellblade (75% Base AD + 45% AP) active
- [x] **Manamune** (`2900g`) — Awe (Bonus AD from Mana) active
- [x] **Muramana** (`2900g`) — Shock on-hit & spell bonus physical damage active
- [ ] **Nashor's Tooth** (`2900g`) — Stats baseline active; passive in backlog
- [ ] **Seraph's Embrace** (`2900g`) — Stats baseline active; passive in backlog
- [ ] **Banshee's Veil** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Bastionbreaker** (`3000g`) — Stats baseline active; passive in backlog
- [x] **Black Cleaver** (`3000g`) — Carve armor shred stacking active in combat simulation
- [ ] **Chempunk Chainsword** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Cosmic Drive** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Cryptbloom** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Edge of Night** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Experimental Hexplate** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Guinsoo's Rageblade** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Heartsteel** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Hextech Gunblade** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Hullbreaker** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Immortal Shieldbow** (`3000g`) — Stats baseline active; passive in backlog
- [x] **Kraken Slayer** (`3000g`) — Bring It Down ramp on-hit damage active
- [x] **Liandry's Torment** (`3000g`) — Torment % max HP burn + Suffering ramp active
- [ ] **Mortal Reminder** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Serylda's Grudge** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Statikk Shiv** (`3000g`) — Stats baseline active; passive in backlog
- [x] **Terminus** (`3000g`) — Juxtaposition light/dark stacking pen & resist active
- [ ] **The Collector** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Void Staff** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Voltaic Cyclosword** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Yun Tal Wildarrows** (`3000g`) — Stats baseline active; passive in backlog
- [ ] **Essence Reaver** (`3050g`) — Stats baseline active; passive in backlog
- [ ] **Dusk and Dawn** (`3100g`) — Stats baseline active; passive in backlog
- [ ] **Endless Hunger** (`3100g`) — Stats baseline active; passive in backlog
- [ ] **Maw of Malmortius** (`3100g`) — Stats baseline active; passive in backlog
- [x] **Riftmaker** (`3100g`) — Void Infusion (% HP to AP + 10% combat damage ramp) active
- [ ] **Spear of Shojin** (`3100g`) — Stats baseline active; passive in backlog
- [ ] **Sundered Sky** (`3100g`) — Stats baseline active; passive in backlog
- [ ] **Warmog's Armor** (`3100g`) — Stats baseline active; passive in backlog
- [x] **Blade of The Ruined King** (`3200g`) — Mist's Edge (% current HP on-hit) active
- [ ] **Guardian Angel** (`3200g`) — Stats baseline active; passive in backlog
- [x] **Jak'Sho, The Protean** (`3200g`) — Voidborn Resilience (+30% bonus Armor/MR) active
- [ ] **Mercurial Scimitar** (`3200g`) — Stats baseline active; passive in backlog
- [x] **Shadowflame** (`3200g`) — Cinderbloom critical magic/true damage below 35% HP active
- [ ] **Sterak's Gage** (`3200g`) — Stats baseline active; passive in backlog
- [ ] **Stormrazor** (`3200g`) — Stats baseline active; passive in backlog
- [ ] **Zhonya's Hourglass** (`3250g`) — Stats baseline active; passive in backlog
- [ ] **Death's Dance** (`3300g`) — Stats baseline active; passive in backlog
- [ ] **Lord Dominik's Regards** (`3300g`) — Stats baseline active; passive in backlog
- [x] **Overlord's Bloodmail** (`3300g`) — Tyranny (2% bonus HP to AD + missing HP multiplier) active
- [ ] **Ravenous Hydra** (`3300g`) — Stats baseline active; passive in backlog
- [ ] **Stridebreaker** (`3300g`) — Stats baseline active; passive in backlog
- [ ] **Titanic Hydra** (`3300g`) — Stats baseline active; passive in backlog
- [x] **Trinity Force** (`3333g`) — Spellblade (200% Base AD) + Threefold Strike active
- [ ] **Bloodthirster** (`3400g`) — Stats baseline active; passive in backlog
- [ ] **Infinity Edge** (`3500g`) — Stats baseline active; passive in backlog
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
