import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import {
  mapItem,
  parseItemStatsFromDescription,
  parseStatsFromDescription,
  detectItemPassives,
  calculateStats,
  calculateSpellDamage,
  runCombatSimulation,
} from '../services'
import type { DraftSlot, Item } from '../types'

describe('Void Staff Item Implementation', () => {
  it('should parse stats and magic penetration from Void Staff description', () => {
    const desc =
      '<mainText><stats><attention>95</attention> Ability Power<br><attention>40%</attention> Magic Penetration</stats><br><br></mainText>'
    const itemStats = parseItemStatsFromDescription(desc)
    expect(itemStats.FlatMagicDamageMod).toBe(95)
    expect(itemStats.rPercentMagicPenetrationMod).toBe(0.4)

    const advStats = parseStatsFromDescription(desc)
    expect(advStats.magicPenPercent).toBe(40)
  })

  it('should map Void Staff correctly with both base stats and percent penetration', () => {
    const rawVoidStaff = {
      id: 3135,
      name: 'Void Staff',
      description:
        '<mainText><stats><attention>95</attention> Ability Power<br><attention>40%</attention> Magic Penetration</stats><br><br></mainText>',
      priceTotal: 3000,
      price: 1050,
      iconPath: '/lol-game-data/assets/ASSETS/Items/Icons2D/3135_Mage_T3_VoidStaff.png',
      categories: ['MagicPenetration', 'SpellDamage'],
      stats: {
        FlatMagicDamageMod: 95,
      },
    }

    const mapped = mapItem('3135', rawVoidStaff)
    expect(mapped.id).toBe('3135')
    expect(mapped.name).toBe('Void Staff')
    expect(mapped.gold.total).toBe(3000)
    expect(mapped.stats.FlatMagicDamageMod).toBe(95)
    expect(mapped.stats.rPercentMagicPenetrationMod).toBe(0.4)
    expect(mapped.tags).toContain('MagicPenetration')
  })

  it('should detect Void Staff in detectItemPassives', () => {
    const voidStaff: Item = {
      id: '3135',
      name: 'Void Staff',
      description: '40% Magic Penetration',
      colloq: ';',
      image: { full: '3135.png', sprite: '', group: 'item', x: 0, y: 0, w: 48, h: 48 },
      gold: { base: 1050, total: 3000, sell: 2100, purchasable: true },
      tags: ['MagicPenetration', 'SpellDamage'],
      stats: { FlatMagicDamageMod: 95, rPercentMagicPenetrationMod: 0.4 },
      maps: {},
    }

    const passives = detectItemPassives([voidStaff])
    expect(passives.hasVoidStaff).toBe(true)

    const withoutVoid = detectItemPassives([])
    expect(withoutVoid.hasVoidStaff).toBe(false)
  })

  it('should calculate champion stats with 40% magic penetration when Void Staff is equipped', () => {
    const champPath = path.resolve(__dirname, './fixtures/championFull.json')
    const championsData = JSON.parse(fs.readFileSync(champPath, 'utf8')).data
    const ahri = championsData['Ahri']
    expect(ahri).toBeDefined()

    const voidStaff: Item = {
      id: '3135',
      name: 'Void Staff',
      description:
        '<mainText><stats><attention>95</attention> Ability Power<br><attention>40%</attention> Magic Penetration</stats><br><br></mainText>',
      colloq: ';',
      image: { full: '3135.png', sprite: '', group: 'item', x: 0, y: 0, w: 48, h: 48 },
      gold: { base: 1050, total: 3000, sell: 2100, purchasable: true },
      tags: ['MagicPenetration', 'SpellDamage'],
      stats: { FlatMagicDamageMod: 95, rPercentMagicPenetrationMod: 0.4 },
      maps: {},
    }

    const slot: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Mid',
      champion: {
        id: ahri.id,
        key: ahri.key,
        name: ahri.name,
        title: ahri.title,
        image: ahri.image,
        tags: ahri.tags,
        partype: ahri.partype,
        stats: {
          hp: ahri.stats.hp,
          hpperlevel: ahri.stats.hpperlevel,
          mp: ahri.stats.mp,
          mpperlevel: ahri.stats.mpperlevel,
          movespeed: ahri.stats.movespeed,
          armor: ahri.stats.armor,
          armorperlevel: ahri.stats.armorperlevel,
          magicResist: ahri.stats.spellblock,
          magicResistPerLevel: ahri.stats.spellblockperlevel,
          attackrange: ahri.stats.attackrange,
          hpregen: ahri.stats.hpregen,
          hpregenperlevel: ahri.stats.hpregenperlevel,
          mpregen: ahri.stats.mpregen,
          mpregenperlevel: ahri.stats.mpregenperlevel,
          crit: ahri.stats.crit,
          critperlevel: ahri.stats.critperlevel,
          attackdamage: ahri.stats.attackdamage,
          attackdamageperlevel: ahri.stats.attackdamageperlevel,
          attackspeedperlevel: ahri.stats.attackspeedperlevel,
          attackspeed: ahri.stats.attackspeed,
          attackspeedratio: ahri.stats.attackspeedratio || ahri.stats.attackspeed,
        },
        spells: [],
      },
      level: 18,
      items: [voidStaff, null, null, null, null, null],
      masterworkItems: [false, false, false, false, false, false],
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
    }

    const calculated = calculateStats(slot)
    expect(calculated).not.toBeNull()
    if (calculated) {
      expect(calculated.ap.total).toBe(95)
      expect(calculated.magicPenPercent.total).toBe(40)
      expect(calculated.magicPenPercent.bonus).toBe(40)
    }
  })

  it('should apply 40% magic penetration to target magic resistance in spell calculations', () => {
    // 100 Magic Resist target
    // Without penetration: effective MR = 100 -> multiplier = 100 / (100 + 100) = 0.50 (50%)
    // With 40% Magic Penetration: effective MR = 100 * (1 - 0.40) = 60 -> multiplier = 100 / (100 + 60) = 0.625 (62.5%)

    const withoutPen = calculateSpellDamage({
      attacker: {
        ad: 100,
        ap: 500,
        level: 18,
        crit: 0,
        armorPen: 0,
        lethality: 0,
        magicPenFlat: 0,
        magicPenPercent: 0,
        adaptiveType: 'AP',
      },
      defender: {
        armor: 100,
        mr: 100,
        currentHp: 2000,
        maxHp: 2000,
      },
      action: 'Q',
    })

    expect(withoutPen.effMr).toBe(100)
    expect(withoutPen.magicMult).toBe(0.5)

    const withVoidStaff = calculateSpellDamage({
      attacker: {
        ad: 100,
        ap: 500,
        level: 18,
        crit: 0,
        armorPen: 0,
        lethality: 0,
        magicPenFlat: 0,
        magicPenPercent: 40,
        adaptiveType: 'AP',
      },
      defender: {
        armor: 100,
        mr: 100,
        currentHp: 2000,
        maxHp: 2000,
      },
      action: 'Q',
    })

    expect(withVoidStaff.effMr).toBe(60)
    expect(withVoidStaff.magicMult).toBe(0.625)

    // Damage multiplier comparison: 0.625 / 0.50 = 1.25 (+25% damage increase against 100 MR)
    expect(withVoidStaff.magicMult / withoutPen.magicMult).toBeCloseTo(1.25, 2)
  })

  it('should correctly stack 40% magic penetration with flat magic penetration (order: % then flat)', () => {
    // In LoL: Effective MR = MR * (1 - % pen) - flat pen
    // 100 MR, 40% pen, 18 flat pen:
    // MR after % pen = 100 * 0.60 = 60
    // MR after flat pen = 60 - 18 = 42
    // Multiplier = 100 / (100 + 42) = 100 / 142 = ~0.704225

    const withVoidAndSorcs = calculateSpellDamage({
      attacker: {
        ad: 100,
        ap: 500,
        level: 18,
        crit: 0,
        armorPen: 0,
        lethality: 0,
        magicPenFlat: 18,
        magicPenPercent: 40,
        adaptiveType: 'AP',
      },
      defender: {
        armor: 100,
        mr: 100,
        currentHp: 2000,
        maxHp: 2000,
      },
      action: 'Q',
    })

    expect(withVoidAndSorcs.effMr).toBe(42)
    expect(withVoidAndSorcs.magicMult).toBeCloseTo(100 / 142, 4)
  })

  it('should verify Void Staff impact in combat simulation', () => {
    const champPath = path.resolve(__dirname, './fixtures/championFull.json')
    const championsData = JSON.parse(fs.readFileSync(champPath, 'utf8')).data
    const ahri = championsData['Ahri']
    const malphite = championsData['Malphite']

    const voidStaff: Item = {
      id: '3135',
      name: 'Void Staff',
      description:
        '<mainText><stats><attention>95</attention> Ability Power<br><attention>40%</attention> Magic Penetration</stats><br><br></mainText>',
      colloq: ';',
      image: { full: '3135.png', sprite: '', group: 'item', x: 0, y: 0, w: 48, h: 48 },
      gold: { base: 1050, total: 3000, sell: 2100, purchasable: true },
      tags: ['MagicPenetration', 'SpellDamage'],
      stats: { FlatMagicDamageMod: 95, rPercentMagicPenetrationMod: 0.4 },
      maps: {},
    }

    const createSlot = (
      id: number,
      side: 'blue' | 'red',
      champ: typeof ahri,
      items: (Item | null)[],
    ) => ({
      id,
      side,
      role: 'Mid',
      champion: {
        id: champ.id,
        key: champ.key,
        name: champ.name,
        title: champ.title,
        image: champ.image,
        tags: champ.tags,
        partype: champ.partype,
        stats: {
          hp: 2500,
          hpperlevel: 100,
          mp: 1000,
          mpperlevel: 50,
          movespeed: 330,
          armor: 100,
          armorperlevel: 4,
          magicResist: 100,
          magicResistPerLevel: 0,
          attackrange: 550,
          hpregen: 7,
          hpregenperlevel: 0.6,
          mpregen: 8,
          mpregenperlevel: 0.8,
          crit: 0,
          critperlevel: 0,
          attackdamage: 100,
          attackdamageperlevel: 3,
          attackspeedperlevel: 2,
          attackspeed: 0.65,
          attackspeedratio: 0.65,
        },
        spells: [],
      },
      level: 18,
      items,
      masterworkItems: items.map(() => false),
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
    })

    const slotBlueWithVoid = createSlot(1, 'blue', ahri, [voidStaff, null, null, null, null, null])
    const slotBlueWithoutVoid = createSlot(1, 'blue', ahri, [null, null, null, null, null, null])
    const slotRed = createSlot(6, 'red', malphite, [null, null, null, null, null, null])

    const simResultWithVoid = runCombatSimulation({
      allSlots: [slotBlueWithVoid, slotRed] as unknown as DraftSlot[],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        {
          id: 'action-1',
          actorSlotId: 1,
          action: 'Q',
          targetSlotIds: [6],
          timestamp: 0.0,
        },
      ],
      duration: 3,
      attackerBuffs: {
        baron: false,
        elder: false,
        redBuff: false,
        blueBuff: false,
        dragons: { infernal: 0, mountain: 0, ocean: 0, cloud: 0, hextech: 0, chemtech: 0 },
      },
      defenderBuffs: {
        baron: false,
        elder: false,
        redBuff: false,
        blueBuff: false,
        dragons: { infernal: 0, mountain: 0, ocean: 0, cloud: 0, hextech: 0, chemtech: 0 },
      },
    })

    const simResultWithoutVoid = runCombatSimulation({
      allSlots: [slotBlueWithoutVoid, slotRed] as unknown as DraftSlot[],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        {
          id: 'action-1',
          actorSlotId: 1,
          action: 'Q',
          targetSlotIds: [6],
          timestamp: 0.0,
        },
      ],
      duration: 3,
      attackerBuffs: {
        baron: false,
        elder: false,
        redBuff: false,
        blueBuff: false,
        dragons: { infernal: 0, mountain: 0, ocean: 0, cloud: 0, hextech: 0, chemtech: 0 },
      },
      defenderBuffs: {
        baron: false,
        elder: false,
        redBuff: false,
        blueBuff: false,
        dragons: { infernal: 0, mountain: 0, ocean: 0, cloud: 0, hextech: 0, chemtech: 0 },
      },
    })

    expect(simResultWithVoid.blueTeamTotalDamage).toBeGreaterThan(0)
    expect(simResultWithoutVoid.blueTeamTotalDamage).toBeGreaterThan(0)
    // Ahri deals significantly more damage with Void Staff (+95 AP and +40% Magic Penetration)
    expect(simResultWithVoid.blueTeamTotalDamage).toBeGreaterThan(
      simResultWithoutVoid.blueTeamTotalDamage,
    )
    expect(simResultWithVoid.events.length).toBeGreaterThan(0)
  })
})
