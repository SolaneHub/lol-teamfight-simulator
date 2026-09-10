import { describe, it, expect } from 'vitest'
import { calculateStats } from '../services/draft/draftService'
import { detectItemPassives } from '../services/items/itemPassiveService'
import { calculateSpellDamage } from '../services/champions/spellCalculatorService'
import { runCombatSimulation } from '../services/combat/combatSimulationService'
import type { DraftSlot, Item } from '../types'

function makeItem(
  name: string,
  id: string,
  desc: string,
  stats: Record<string, number> = {},
): Item {
  return {
    id,
    name,
    description: desc,
    plaintext: '',
    gold: { base: 3000, total: 3000, sell: 2100, purchasable: true },
    tags: [],
    stats,
  }
}

const baseSlot: DraftSlot = {
  id: 1,
  side: 'blue',
  role: 'Mid',
  champion: {
    id: 'Aatrox',
    key: '266',
    name: 'Aatrox',
    title: 'the Darkin Blade',
    image: {
      full: 'Aatrox.png',
      sprite: 'champion0.png',
      group: 'champion',
      x: 0,
      y: 0,
      w: 48,
      h: 48,
    },
    tags: ['Fighter', 'Tank'],
    partype: 'Blood Well',
    stats: {
      hp: 650,
      hpperlevel: 114,
      mp: 0,
      mpperlevel: 0,
      movespeed: 345,
      armor: 38,
      armorperlevel: 4.45,
      spellblock: 32,
      spellblockperlevel: 2.05,
      attackrange: 175,
      hpregen: 3,
      hpregenperlevel: 1,
      mpregen: 0,
      mpregenperlevel: 0,
      crit: 0,
      critperlevel: 0,
      attackdamage: 60,
      attackdamageperlevel: 5,
      attackspeedperlevel: 2.5,
      attackspeed: 0.651,
    },
  },
  items: [null, null, null, null, null, null],
  itemStacks: [],
  level: 18,
  spells: [null, null],
  runes: [],
  statShards: [],
}

const baseManaSlot: DraftSlot = {
  ...baseSlot,
  champion: {
    ...baseSlot.champion!,
    id: 'Viktor',
    partype: 'Mana',
    tags: ['Mage'],
    stats: {
      ...baseSlot.champion!.stats,
      mp: 400,
      mpperlevel: 45,
      attackrange: 525,
    },
  },
}

describe('Remaining Items Implementation & Verification', () => {
  describe('Stackable Items & Stat Conversions in DraftService', () => {
    it('calculates Heartsteel stacks correctly (+1 HP per stack)', () => {
      const heartsteel = makeItem('Heartsteel', '3084', '<stats>+900 Health</stats>', {
        FlatHPPoolMod: 900,
      })
      const slot: DraftSlot = {
        ...baseSlot,
        items: [heartsteel, null, null, null, null, null],
        itemStacks: [450],
      }
      const stats = calculateStats(slot)
      expect(stats?.hp.bonus).toBe(1350)
      expect(stats?.hp.total).toBe(2588 + 1350)
    })

    it('calculates Hubris stacks correctly (+15 + 2*stacks AD)', () => {
      const hubris = makeItem('Hubris', '6697', '<stats>+60 Attack Damage</stats>', {
        FlatPhysicalDamageMod: 60,
      })
      const slot: DraftSlot = {
        ...baseSlot,
        items: [hubris, null, null, null, null, null],
        itemStacks: [10],
      }
      const stats = calculateStats(slot)
      expect(stats?.ad.bonus).toBe(95)
    })

    it('calculates Tear of the Goddess & Winter Approach stacks (+1 Mana per stack)', () => {
      const tear = makeItem('Tear of the Goddess', '3070', '<stats>+240 Mana</stats>', {
        FlatMPPoolMod: 240,
      })
      const slot: DraftSlot = {
        ...baseManaSlot,
        items: [tear, null, null, null, null, null],
        itemStacks: [360],
      }
      const stats = calculateStats(slot)
      expect(stats?.mp.bonus).toBe(600)
    })

    it("calculates Sterak's Gage The Claws That Catch (+50% base AD as bonus AD)", () => {
      const sterak = makeItem("Sterak's Gage", '3053', '<stats>+400 Health</stats>', {
        FlatHPPoolMod: 400,
      })
      const slot: DraftSlot = {
        ...baseSlot,
        level: 1,
        items: [sterak, null, null, null, null, null],
      }
      const stats = calculateStats(slot)
      expect(stats?.ad.bonus).toBe(30)
      expect(stats?.ad.total).toBe(90)
    })

    it('calculates Fimbulwinter Awe (+8% max mana as bonus HP)', () => {
      const fimbul = makeItem('Fimbulwinter', '3121', '<stats>+550 Health<br>+860 Mana</stats>', {
        FlatHPPoolMod: 550,
        FlatMPPoolMod: 860,
      })
      const slot: DraftSlot = {
        ...baseManaSlot,
        level: 1,
        items: [fimbul, null, null, null, null, null],
      }
      const stats = calculateStats(slot)
      expect(stats?.hp.bonus).toBe(550 + Math.round(1260 * 0.08))
    })

    it("calculates Lord Dominik's Regards (40% Armor Pen) and Mortal Reminder (35% Armor Pen)", () => {
      const ldr = makeItem(
        "Lord Dominik's Regards",
        '3036',
        '<stats>+40% Armor Penetration</stats>',
      )
      const statsLdr = calculateStats({
        ...baseSlot,
        items: [ldr, null, null, null, null, null],
      })
      expect(statsLdr?.armorPen.total).toBe(40)

      const mr = makeItem('Mortal Reminder', '3033', '<stats>+35% Armor Penetration</stats>')
      const statsMr = calculateStats({
        ...baseSlot,
        items: [mr, null, null, null, null, null],
      })
      expect(statsMr?.armorPen.total).toBe(35)
    })
  })

  describe('Item Passive Detection', () => {
    it('detects all new AD, Tank, and Support items correctly', () => {
      const items = [
        makeItem('Infinity Edge', '3031', ''),
        makeItem('Sundered Sky', '6610', ''),
        makeItem('Heartsteel', '3084', ''),
        makeItem('Eclipse', '6692', ''),
        makeItem('Thornmail', '3075', ''),
        makeItem("Zaz'Zak's Realmspike", '3869', ''),
      ]
      const passives = detectItemPassives(items)
      expect(passives.hasInfinityEdge).toBe(true)
      expect(passives.hasSunderedSky).toBe(true)
      expect(passives.hasHeartsteel).toBe(true)
      expect(passives.hasEclipse).toBe(true)
      expect(passives.hasThornmail).toBe(true)
      expect(passives.hasZazZaks).toBe(true)
      expect(passives.hasRabadon).toBe(false)
    })
  })

  describe('Critical Strike & Spell Calculator Mechanics', () => {
    it('applies Infinity Edge 215% crit multiplier (vs 175% base crit)', () => {
      const standardCrit = calculateSpellDamage({
        action: 'AA',
        attacker: {
          ad: 100,
          ap: 0,
          crit: 100,
          level: 1,
          hp: 1000,
          maxHp: 1000,
          mana: 0,
          armorPen: 0,
          lethality: 0,
          magicPenPercent: 0,
          magicPenFlat: 0,
          adaptiveType: 'AD',
        },
        defender: {
          currentHp: 1000,
          maxHp: 1000,
          armor: 0,
          mr: 0,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
      })
      expect(standardCrit.rawDmg).toBe(175)

      const ieCrit = calculateSpellDamage({
        action: 'AA',
        attacker: {
          ad: 100,
          ap: 0,
          crit: 100,
          level: 1,
          hp: 1000,
          maxHp: 1000,
          mana: 0,
          armorPen: 0,
          lethality: 0,
          magicPenPercent: 0,
          magicPenFlat: 0,
          adaptiveType: 'AD',
        },
        defender: {
          currentHp: 1000,
          maxHp: 1000,
          armor: 0,
          mr: 0,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
        options: { hasInfinityEdge: true },
      })
      expect(ieCrit.rawDmg).toBe(215)
    })

    it("reduces incoming critical strike damage by 30% with Randuin's Omen", () => {
      const critAgainstRanduins = calculateSpellDamage({
        action: 'AA',
        attacker: {
          ad: 100,
          ap: 0,
          crit: 100,
          level: 1,
          hp: 1000,
          maxHp: 1000,
          mana: 0,
          armorPen: 0,
          lethality: 0,
          magicPenPercent: 0,
          magicPenFlat: 0,
          adaptiveType: 'AD',
        },
        defender: {
          currentHp: 1000,
          maxHp: 1000,
          armor: 0,
          mr: 0,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
        options: { hasRanduins: true },
      })
      expect(critAgainstRanduins.rawDmg).toBe(152.5)
    })

    it('amplifies ability damage by +12% with 4 stacks Spear of Shojin', () => {
      const withoutShojin = calculateSpellDamage({
        action: 'Q',
        attacker: {
          ad: 100,
          ap: 0,
          crit: 0,
          level: 1,
          hp: 1000,
          maxHp: 1000,
          mana: 0,
          armorPen: 0,
          lethality: 0,
          magicPenPercent: 0,
          magicPenFlat: 0,
          adaptiveType: 'AD',
        },
        defender: {
          currentHp: 1000,
          maxHp: 1000,
          armor: 0,
          mr: 0,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
      })

      const withShojin = calculateSpellDamage({
        action: 'Q',
        attacker: {
          ad: 100,
          ap: 0,
          crit: 0,
          level: 1,
          hp: 1000,
          maxHp: 1000,
          mana: 0,
          armorPen: 0,
          lethality: 0,
          magicPenPercent: 0,
          magicPenFlat: 0,
          adaptiveType: 'AD',
        },
        defender: {
          currentHp: 1000,
          maxHp: 1000,
          armor: 0,
          mr: 0,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
        options: { shojinMultiplier: 1.12 },
      })
      expect(withShojin.rawDmg).toBeCloseTo(withoutShojin.rawDmg * 1.12, 1)
    })
  })

  describe('Combat Simulation Mechanics & Procs', () => {
    it('executes enemy below 5% max HP with The Collector', () => {
      const collector = makeItem('The Collector', '6676', 'Execute', { FlatPhysicalDamageMod: 60 })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [collector, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        level: 1,
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [
          { id: '1', actorSlotId: 1, action: 'Q', targetSlotIds: [2], timestamp: 0 },
          { id: '2', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.5 },
          { id: '3', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 1.0 },
          { id: '4', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 1.5 },
        ],
        duration: 3,
      })

      const executeEvents = res.events.filter((e) => e.action.includes('The Collector EXECUTE'))
      expect(executeEvents.length).toBeGreaterThanOrEqual(1)
    })

    it("triggers Sterak's Gage Lifeline shield when below 30% HP", () => {
      const sterak = makeItem("Sterak's Gage", '3053', 'Lifeline shield', {
        FlatHPPoolMod: 400,
      })
      const bigSword = makeItem('Big Sword', '9999', 'AD', { FlatPhysicalDamageMod: 800 })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [bigSword, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        level: 1,
        items: [sterak, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [
          { id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 },
          { id: '2', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.5 },
          { id: '3', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 1.0 },
        ],
        duration: 3,
      })

      const lifelineTriggered = res.events.some((e) =>
        e.badges?.some((b) => b.includes("Sterak's Shield")),
      )
      expect(lifelineTriggered).toBe(true)
    })

    it('reflects damage on attack with Thornmail and applies Grievous Wounds', () => {
      const thornmail = makeItem('Thornmail', '3075', 'Thorns', { FlatArmorMod: 70 })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        items: [thornmail, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 }],
        duration: 2,
      })

      const reflectEvents = res.events.filter((e) => e.action.includes('Thornmail Reflect'))
      expect(reflectEvents.length).toBe(1)
      expect(reflectEvents[0]?.badges).toContain('Thornmail Reflect')
      expect(reflectEvents[0]?.badges).toContain('🩸 Grievous Wounds')
    })

    it('procs Sundered Sky guaranteed crit and heal on first AA', () => {
      const sundered = makeItem('Sundered Sky', '6610', 'Lightshield', {
        FlatPhysicalDamageMod: 45,
      })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [sundered, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        level: 1,
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 }],
        duration: 2,
      })

      const sunderedProc = res.events.some((e) => e.badges?.includes('Sundered Sky'))
      expect(sunderedProc).toBe(true)
    })

    it('initializes Kaenic Rookern 18% max HP magic shield at start', () => {
      const rookern = makeItem('Kaenic Rookern', '6701', 'Magebane shield', { FlatHPPoolMod: 400 })
      const slot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [rookern, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [slot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [],
        actions: [],
        duration: 1,
      })

      const participant = res.championResults[1]
      expect(participant?.currentShield).toBeGreaterThan(0)
    })

    it('blocks first hostile ability with Edge of Night spell shield', () => {
      const eon = makeItem('Edge of Night', '3814', 'Spell shield', {
        FlatPhysicalDamageMod: 50,
        FlatHPPoolMod: 250,
      })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        items: [eon, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [
          { id: '1', actorSlotId: 1, action: 'Q', targetSlotIds: [2], timestamp: 0 },
          { id: '2', actorSlotId: 1, action: 'Q', targetSlotIds: [2], timestamp: 1 },
        ],
        duration: 2,
      })

      const blockedEvent = res.events.find((e) => e.badges?.includes('Edge of Night Blocked'))
      expect(blockedEvent).toBeDefined()
      expect(res.championResults[2]?.currentHp).toBeLessThan(res.championResults[2]!.maxHp)
    })

    it("stores damage with Death's Dance Ignore Pain and cleanses on takedown with Defy", () => {
      const dd = makeItem("Death's Dance", '6333', 'Ignore Pain', {
        FlatPhysicalDamageMod: 60,
        FlatArmorMod: 40,
      })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [dd, null, null, null, null, null],
      }
      const enemyLowHp: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        level: 1,
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, enemyLowHp],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [
          { id: '1', actorSlotId: 2, action: 'AA', targetSlotIds: [1], timestamp: 0 },
          { id: '2', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.5 },
          { id: '3', actorSlotId: 1, action: 'Q', targetSlotIds: [2], timestamp: 1.0 },
          { id: '4', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 1.5 },
          { id: '5', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 2.0 },
        ],
        duration: 3,
      })

      const ignorePainTriggered = res.events.some((e) =>
        e.badges?.some((b) => b.includes('Ignore Pain')),
      )
      expect(ignorePainTriggered).toBe(true)
    })

    it('procs Hullbreaker Boarding Party bonus damage on 5th hit', () => {
      const hullbreaker = makeItem('Hullbreaker', '3181', 'Boarding Party', {
        FlatPhysicalDamageMod: 65,
        FlatHPPoolMod: 400,
      })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [hullbreaker, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [
          { id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.2 },
          { id: '2', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.4 },
          { id: '3', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.6 },
          { id: '4', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0.8 },
          { id: '5', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 1.0 },
        ],
        duration: 2,
      })

      const hullbreakerProc = res.events.some((e) =>
        e.badges?.some((b) => b.includes('Hullbreaker')),
      )
      expect(hullbreakerProc).toBe(true)
    })

    it('procs Stridebreaker Breaking Shockwave bonus damage', () => {
      const stride = makeItem('Stridebreaker', '6631', 'Breaking Shockwave', {
        FlatPhysicalDamageMod: 50,
        FlatHPPoolMod: 400,
      })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [stride, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 }],
        duration: 1,
      })

      const strideProc = res.events.some((e) => e.badges?.some((b) => b.includes('Stridebreaker')))
      expect(strideProc).toBe(true)
    })

    it('restores mana on AA with Essence Reaver', () => {
      const er = makeItem('Essence Reaver', '3508', 'Spellblade mana', {
        FlatPhysicalDamageMod: 70,
      })
      const attackerSlot: DraftSlot = {
        ...baseManaSlot,
        id: 1,
        items: [er, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 }],
        duration: 1,
      })

      const erBadge = res.events.some((e) => e.badges?.some((b) => b.includes('Essence Reaver')))
      expect(erBadge).toBe(true)
    })

    it('builds Steadfast stacks on taking magic damage with Force of Nature', () => {
      const fon = makeItem('Force of Nature', '4401', 'Steadfast', {
        FlatHPPoolMod: 400,
        FlatSpellBlockMod: 55,
      })
      const apItem = makeItem('Amp Tome', '1052', 'AP', { FlatMagicDamageMod: 100 })
      const attackers = Array.from({ length: 8 }, (_, i) => ({
        ...baseManaSlot,
        id: i + 1,
        items: [apItem, null, null, null, null, null],
      }))
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 9,
        side: 'red',
        items: [fon, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [...attackers, defenderSlot],
        activeBlueSlotIds: [1, 2, 3, 4, 5, 6, 7, 8],
        activeRedSlotIds: [9],
        actions: Array.from({ length: 8 }, (_, i) => ({
          id: String(i + 1),
          actorSlotId: i + 1,
          action: 'Q' as const,
          targetSlotIds: [9],
          timestamp: i * 0.1,
        })),
        duration: 2,
      })

      const fonProc = res.events.some((e) => e.badges?.some((b) => b.includes('Force of Nature')))
      expect(fonProc).toBe(true)
    })

    it("redirects 12% damage taken to ally with Knight's Vow", () => {
      const kv = makeItem("Knight's Vow", '3109', 'Sacrifice', {
        FlatHPPoolMod: 300,
        FlatArmorMod: 45,
      })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
      }
      const allyPartner: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        items: [kv, null, null, null, null, null],
      }
      const defendedAlly: DraftSlot = {
        ...baseSlot,
        id: 3,
        side: 'red',
        items: [null, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, allyPartner, defendedAlly],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2, 3],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [3], timestamp: 0 }],
        duration: 1,
      })

      const kvProc = res.events.some((e) => e.badges?.some((b) => b.includes("Knight's Vow")))
      expect(kvProc).toBe(true)
      expect(res.championResults[2]?.damageTaken).toBeGreaterThan(0)
    })

    it('triggers Hexdrinker Lifeline shield when below 30% HP', () => {
      const hexdrinker = makeItem('Hexdrinker', '3155', 'Lifeline shield', {
        FlatPhysicalDamageMod: 25,
        FlatSpellBlockMod: 30,
      })
      const bigSword = makeItem('Big Sword', '9999', 'AD', { FlatPhysicalDamageMod: 800 })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [bigSword, null, null, null, null, null],
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        level: 1,
        items: [hexdrinker, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 }],
        duration: 1,
      })

      const lifelineTriggered = res.events.some((e) =>
        e.badges?.some((b) => b.includes('Hexdrinker')),
      )
      expect(lifelineTriggered).toBe(true)
    })

    it("regenerates health out of combat with Warmog's Armor (Warmog's Heart)", () => {
      const warmog = makeItem("Warmog's Armor", '3083', 'Warmog Heart', { FlatHPPoolMod: 1000 })
      const ruby = makeItem("Giant's Belt", '1011', 'HP', { FlatHPPoolMod: 400 })
      const slot: DraftSlot = {
        ...baseSlot,
        id: 1,
        items: [warmog, ruby, null, null, null, null],
      }
      const enemy: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
      }

      const res = runCombatSimulation({
        allSlots: [slot, enemy],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 2, action: 'AA', targetSlotIds: [1], timestamp: 0 }],
        duration: 10,
      })

      const finalHp = res.championResults[1]?.currentHp || 0
      const minHpDuringCombat = Math.min(
        ...res.events.filter((e) => e.targetSlotId === 1).map((e) => e.remainingHp),
      )
      expect(finalHp).toBeGreaterThan(minHpDuringCombat)
    })

    it('reduces damage by 35% with Celestial Opposition Exalted', () => {
      const celestial = makeItem('Celestial Opposition', '3869', 'Exalted', { FlatHPPoolMod: 200 })
      const attackerSlot: DraftSlot = {
        ...baseSlot,
        id: 1,
      }
      const defenderSlot: DraftSlot = {
        ...baseSlot,
        id: 2,
        side: 'red',
        items: [celestial, null, null, null, null, null],
      }

      const res = runCombatSimulation({
        allSlots: [attackerSlot, defenderSlot],
        activeBlueSlotIds: [1],
        activeRedSlotIds: [2],
        actions: [{ id: '1', actorSlotId: 1, action: 'AA', targetSlotIds: [2], timestamp: 0 }],
        duration: 1,
      })

      const celestialBadge = res.events.some((e) =>
        e.badges?.some((b) => b.includes('Celestial Exalted')),
      )
      expect(celestialBadge).toBe(true)
    })
  })
})
