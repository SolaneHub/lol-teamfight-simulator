import { describe, it, expect } from 'vitest'
import { calculateStats } from '../services/draft/draftService'
import { mapItem, getItemIconUrl } from '../services/items/itemService'
import { getEquippedStackableRunes, getRuneStackValue } from '../services/runes/runeStackService'
import { runCombatSimulation } from '../services/combat/combatSimulationService'
import type { DraftSlot, Champion, Rune } from '../types'

const mockChampionAP: Champion = {
  id: 'Ahri',
  key: '103',
  name: 'Ahri',
  title: 'the Nine-Tailed Fox',
  image: { full: 'Ahri.png', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
  tags: ['Mage', 'Assassin'],
  partype: 'Mana',
  stats: {
    hp: 590,
    hpperlevel: 96,
    mp: 418,
    mpperlevel: 25,
    movespeed: 330,
    armor: 21,
    armorperlevel: 4.7,
    spellblock: 30,
    spellblockperlevel: 1.3,
    attackrange: 550,
    hpregen: 2.5,
    hpregenperlevel: 0.6,
    mpregen: 8,
    mpregenperlevel: 0.8,
    crit: 0,
    critperlevel: 0,
    attackdamage: 53,
    attackdamageperlevel: 3,
    attackspeedperlevel: 2,
    attackspeed: 0.668,
  },
  spells: [],
}

const mockChampionAD: Champion = {
  id: 'Darius',
  key: '122',
  name: 'Darius',
  title: 'the Hand of Noxus',
  image: { full: 'Darius.png', sprite: '', group: '', x: 0, y: 0, w: 0, h: 0 },
  tags: ['Fighter', 'Tank'],
  partype: 'Mana',
  stats: {
    hp: 652,
    hpperlevel: 114,
    mp: 263,
    mpperlevel: 575,
    movespeed: 340,
    armor: 39,
    armorperlevel: 5.2,
    spellblock: 32,
    spellblockperlevel: 2.05,
    attackrange: 175,
    hpregen: 10,
    hpregenperlevel: 0.95,
    mpregen: 6.6,
    mpregenperlevel: 0.35,
    crit: 0,
    critperlevel: 0,
    attackdamage: 64,
    attackdamageperlevel: 4.5,
    attackspeedperlevel: 1,
    attackspeed: 0.625,
  },
  spells: [],
}

const createSlot = (
  champion: Champion,
  runes: Rune[],
  level = 1,
  extraProps: Partial<DraftSlot> = {},
): DraftSlot => ({
  id: 1,
  side: 'blue',
  role: 'Top',
  champion,
  level,
  items: [],
  primaryPath: null,
  primaryKeystone: runes[0] || null,
  primaryRune1: runes[1] || null,
  primaryRune2: runes[2] || null,
  primaryRune3: runes[3] || null,
  secondaryPath: null,
  secondaryRune1: runes[4] || null,
  secondaryRune2: runes[5] || null,
  ...extraProps,
})

describe('Precision Tree Runes', () => {
  it('should calculate Conqueror AD/AP stats and omnivamp based on stacks', () => {
    const conqueror: Rune = {
      id: 8010,
      key: 'Conqueror',
      icon: '',
      name: 'Conqueror',
      shortDesc: '',
      longDesc: '',
    }

    // Ahri (AP) at 12 stacks level 1
    const slotAP = createSlot(mockChampionAP, [conqueror], 1, { conquerorStacks: 12 })
    const statsAP = calculateStats(slotAP)
    expect(statsAP?.ap.total).toBe(22)
    expect(statsAP?.omnivamp.total).toBe(5) // Ranged

    // Darius (AD) at 12 stacks level 1 (Melee)
    const slotAD = createSlot(mockChampionAD, [conqueror], 1, { conquerorStacks: 12 })
    const statsAD = calculateStats(slotAD)
    expect(statsAD?.ad.total).toBe(64 + Math.round(12 * 1.8 * 0.6))
    expect(statsAD?.omnivamp.total).toBe(8) // Melee
  })

  it('should calculate Lethal Tempo Attack Speed stacks correctly', () => {
    const lethalTempo: Rune = {
      id: 8008,
      key: 'LethalTempo',
      icon: '',
      name: 'Lethal Tempo',
      shortDesc: '',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [lethalTempo], 1, { lethalTempoStacks: 6 })
    const stats = calculateStats(slot)
    const baseAs = 0.668
    const expectedAs = Math.round((baseAs + baseAs * 0.3) * 1000) / 1000
    expect(stats?.as.total).toBe(expectedAs)
  })

  it('should apply Legend: Haste basic ability haste', () => {
    const legendHaste: Rune = {
      id: 9104,
      key: 'LegendHaste',
      icon: '',
      name: 'Legend: Haste',
      shortDesc: '',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [null as unknown as Rune, legendHaste])
    const stats = calculateStats(slot)
    expect(stats?.abilityHaste.basicAbilityHaste).toBe(15)
  })

  it('should apply Legend: Alacrity attack speed bonus', () => {
    const legendAlacrity: Rune = {
      id: 9105,
      key: 'LegendAlacrity',
      icon: '',
      name: 'Legend: Alacrity',
      shortDesc: '',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [null as unknown as Rune, legendAlacrity])
    const stats = calculateStats(slot)
    const baseAs = 0.668
    const expectedAs = Math.round((baseAs + baseAs * 0.18) * 1000) / 1000
    expect(stats?.as.total).toBe(expectedAs)
  })

  it('should apply Legend: Bloodline life steal and bonus HP', () => {
    const legendBloodline: Rune = {
      id: 9103,
      key: 'LegendBloodline',
      icon: '',
      name: 'Legend: Bloodline',
      shortDesc: '',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [null as unknown as Rune, legendBloodline])
    const stats = calculateStats(slot)
    expect(stats?.lifeSteal.total).toBe(5)
    expect(stats?.hp.total).toBe(590 + 85)
  })

  it('should identify Press the Attack keystone for combat simulation procs', () => {
    const pta: Rune = {
      id: 8005,
      key: 'PressTheAttack',
      icon: '',
      name: 'Press the Attack',
      shortDesc: 'Hitting an enemy champion 3 times procs bonus damage.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAD, [pta])
    expect(slot.primaryKeystone?.name).toBe('Press the Attack')

    // PtA Proc Bonus Damage formula check at Level 1 (40 dmg) vs Level 18 (180 dmg)
    const getPtaProcDamage = (level: number) => Math.round(40 + (level - 1) * (140 / 17))
    expect(getPtaProcDamage(1)).toBe(40)
    expect(getPtaProcDamage(18)).toBe(180)
  })

  it('should calculate Coup de Grace damage multiplier when target HP < 40%', () => {
    const coupDeGrace: Rune = {
      id: 8014,
      key: 'CoupDeGrace',
      icon: '',
      name: 'Coup de Grace',
      shortDesc: 'Deal 8% more damage to champions below 40% health.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAD, [
      null as unknown as Rune,
      null as unknown as Rune,
      null as unknown as Rune,
      coupDeGrace,
    ])
    expect(slot.primaryRune3?.name).toBe('Coup de Grace')

    const getCoupDeGraceMultiplier = (targetHpPct: number) => (targetHpPct < 40 ? 1.08 : 1.0)
    expect(getCoupDeGraceMultiplier(35)).toBe(1.08)
    expect(getCoupDeGraceMultiplier(50)).toBe(1.0)
  })

  it('should calculate Cut Down damage multiplier when target HP > 60%', () => {
    const cutDown: Rune = {
      id: 8017,
      key: 'CutDown',
      icon: '',
      name: 'Cut Down',
      shortDesc: 'Deal 8% more damage to champions above 60% health.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAD, [
      null as unknown as Rune,
      null as unknown as Rune,
      null as unknown as Rune,
      cutDown,
    ])
    expect(slot.primaryRune3?.name).toBe('Cut Down')

    const getCutDownMultiplier = (targetHpPct: number) => (targetHpPct > 60 ? 1.08 : 1.0)
    expect(getCutDownMultiplier(75)).toBe(1.08)
    expect(getCutDownMultiplier(50)).toBe(1.0)
  })

  it('should calculate Last Stand damage multiplier scaling when attacker HP < 60%', () => {
    const lastStand: Rune = {
      id: 8299,
      key: 'LastStand',
      icon: '',
      name: 'Last Stand',
      shortDesc: 'Deal 5% to 11% more damage while low health.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAD, [
      null as unknown as Rune,
      null as unknown as Rune,
      null as unknown as Rune,
      lastStand,
    ])
    expect(slot.primaryRune3?.name).toBe('Last Stand')

    const getLastStandBonusPct = (attackerHpPct: number) => {
      if (attackerHpPct >= 60) return 0
      return Math.round(5 + Math.min(6, ((60 - attackerHpPct) / 30) * 6))
    }
    expect(getLastStandBonusPct(70)).toBe(0)
    expect(getLastStandBonusPct(59)).toBe(5)
    expect(getLastStandBonusPct(30)).toBe(11) // 5 + 6 = 11% max bonus at 30% HP
  })
})

describe('Domination Tree Runes', () => {
  it('should calculate Electrocute proc damage based on level, AP and bonus AD', () => {
    const electrocute: Rune = {
      id: 8112,
      key: 'Electrocute',
      icon: '',
      name: 'Electrocute',
      shortDesc:
        'Hitting a champion with 3 separate attacks or abilities within 3s deals bonus adaptive damage.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [electrocute])
    expect(slot.primaryKeystone?.name).toBe('Electrocute')

    const getElectrocuteRawDmg = (level: number, ap: number, bonusAd: number, isAp: boolean) => {
      const baseEleDmg = 50 + (level - 1) * (140 / 17)
      const bonusEleDmg = isAp ? ap * 0.25 : bonusAd * 0.4
      return Math.round(baseEleDmg + Math.max(0, bonusEleDmg))
    }

    // Level 1 Ahri (100 AP) => 50 + 25 = 75 raw damage
    expect(getElectrocuteRawDmg(1, 100, 0, true)).toBe(75)

    // Level 18 Darius (100 bonus AD) => 190 + 40 = 230 raw damage
    expect(getElectrocuteRawDmg(18, 0, 100, false)).toBe(230)
  })

  it('should calculate Dark Harvest proc damage based on level, stacks, AP and bonus AD', () => {
    const darkHarvest: Rune = {
      id: 8128,
      key: 'DarkHarvest',
      icon: '',
      name: 'Dark Harvest',
      shortDesc: 'Damaging a champion below 50% health deals adaptive damage and reaps their soul.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [darkHarvest], 1, { darkHarvestStacks: 10 })
    expect(slot.primaryKeystone?.name).toBe('Dark Harvest')

    const getDarkHarvestRawDmg = (
      level: number,
      stacks: number,
      ap: number,
      bonusAd: number,
      isAp: boolean,
    ) => {
      const baseDhDmg = 20 + (level - 1) * (40 / 17) + stacks * 9
      const bonusDhDmg = isAp ? ap * 0.05 : bonusAd * 0.1
      return Math.round(baseDhDmg + Math.max(0, bonusDhDmg))
    }

    // Level 1 Ahri (10 stacks, 100 AP) => 20 + (10 * 9) + (100 * 0.05) = 20 + 90 + 5 = 115 raw damage
    expect(getDarkHarvestRawDmg(1, 10, 100, 0, true)).toBe(115)

    // Level 18 Darius (20 stacks, 100 bonus AD) => 60 + (20 * 9) + (100 * 0.10) = 60 + 180 + 10 = 250 raw damage
    expect(getDarkHarvestRawDmg(18, 20, 0, 100, false)).toBe(250)
  })

  it('should apply Hail of Blades attack speed bonus (+110% melee / +80% ranged)', () => {
    const hailOfBlades: Rune = {
      id: 9923,
      key: 'HailOfBlades',
      icon: '',
      name: 'Hail of Blades',
      shortDesc: 'Gain 110% (80% for ranged) attack speed for the first 3 attacks.',
      longDesc: '',
    }

    // Melee (Darius) => +110% AS
    const slotMelee = createSlot(mockChampionAD, [hailOfBlades], 1, { hailOfBladesActive: true })
    const statsMelee = calculateStats(slotMelee)
    const baseAsMelee = 0.625
    const expectedAsMelee = Math.round((baseAsMelee + baseAsMelee * 1.1) * 1000) / 1000
    expect(statsMelee?.as.total).toBe(expectedAsMelee)

    // Ranged (Ahri) => +80% AS
    const slotRanged = createSlot(mockChampionAP, [hailOfBlades], 1, { hailOfBladesActive: true })
    const statsRanged = calculateStats(slotRanged)
    const baseAsRanged = 0.668
    const expectedAsRanged = Math.round((baseAsRanged + baseAsRanged * 0.8) * 1000) / 1000
    expect(statsRanged?.as.total).toBe(expectedAsRanged)
  })

  it('should apply Mid Lane Quest bonus (+8% Bonus AD and +8% AP) when completed', () => {
    // AP Champion (Ahri) with items
    const mockItemAP = {
      id: '3116',
      name: "Rylai's Crystal Scepter",
      description: '<stats><attention>75</attention> Ability Power</stats>',
      stats: { FlatMagicDamageMod: 100 },
      gold: { total: 2600, base: 2600, purchasable: true, sell: 1820 },
      tags: [],
    }

    const slotMidAP = createSlot(mockChampionAP, [], 1, {
      role: 'Mid',
      questCompleted: true,
      items: [mockItemAP],
    })

    const statsMidAP = calculateStats(slotMidAP)
    // 100 AP * 1.08 = 108 AP
    expect(statsMidAP?.ap.bonus).toBe(108)
    expect(statsMidAP?.ap.total).toBe(108)

    // AD Champion (Darius) with bonus AD items
    const mockItemAD = {
      id: '3071',
      name: 'Black Cleaver',
      description: '<stats><attention>55</attention> Attack Damage</stats>',
      stats: { FlatPhysicalDamageMod: 100 },
      gold: { total: 3000, base: 3000, purchasable: true, sell: 2100 },
      tags: [],
    }

    const slotMidAD = createSlot(mockChampionAD, [], 1, {
      role: 'Mid',
      questCompleted: true,
      items: [mockItemAD],
    })

    const statsMidAD = calculateStats(slotMidAD)
    // 100 Bonus AD * 1.08 = 108 Bonus AD
    expect(statsMidAD?.ad.bonus).toBe(108)
    expect(statsMidAD?.ad.total).toBe(64 + 108)
  })

  it('should calculate Heal and Shield Power correctly from items and passives', () => {
    // Redemption (+10% Heal & Shield Power)
    const redemption = {
      id: '3107',
      name: 'Redemption',
      description:
        '<stats><attention>30</attention> Ability Power<br><attention>15</attention> Ability Haste<br><attention>100%</attention> Base Mana Regen<br><attention>10%</attention> Heal and Shield Power</stats>',
      stats: { FlatMagicDamageMod: 30 },
      gold: { total: 2300, base: 2300, purchasable: true, sell: 1610 },
      tags: [],
    }

    // Dawncore (+20% base H&S Power + 2% per 100% Base Mana Regen)
    // Redemption gives 100% base mana regen, Dawncore gives 150% = 250% total -> floor(250/100) = 2 stacks = +4% H&S Power
    const dawncore = {
      id: '6620',
      name: 'Dawncore',
      description:
        '<stats><attention>50</attention> Ability Power<br><attention>20%</attention> Heal and Shield Power<br><attention>150%</attention> Base Mana Regen</stats>',
      stats: { FlatMagicDamageMod: 50 },
      gold: { total: 2700, base: 2700, purchasable: true, sell: 1890 },
      tags: [],
    }

    const slot = createSlot(mockChampionAP, [], 1, {
      items: [redemption, dawncore],
    })

    const stats = calculateStats(slot)
    // 10% (Redemption) + 20% (Dawncore base) + 4% (Dawncore passive: 2 stacks * 2%) = 34%
    expect(stats?.healShieldPower.total).toBe(34)
    expect(stats?.healShieldPower.bonus).toBe(34)
  })

  it('correctly maps a DDragon item structure and creates valid item icons', () => {
    const ddragonRawItem = {
      name: 'Infinity Edge',
      description:
        '<mainText><stats><attention>80</attention> Attack Damage<br><attention>25%</attention> Critical Strike Chance</stats><br><br></mainText>',
      colloq: ';ie',
      gold: {
        base: 625,
        purchasable: true,
        total: 3400,
        sell: 2380,
      },
      tags: ['Damage', 'CriticalStrike'],
      maps: {
        '11': true,
        '12': true,
      },
      image: {
        full: '3031.png',
        sprite: 'item0.png',
      },
    }

    const mapped = mapItem('3031', ddragonRawItem)

    expect(mapped.id).toBe('3031')
    expect(mapped.name).toBe('Infinity Edge')
    expect(mapped.gold.total).toBe(3400)
    expect(mapped.gold.purchasable).toBe(true)
    expect(mapped.inStore).toBe(true)
    expect(mapped.maps['11']).toBe(true)
    expect(mapped.stats.FlatPhysicalDamageMod).toBe(80)
    expect(mapped.stats.FlatCritChanceMod).toBe(0.25)
    expect(getItemIconUrl(mapped, '16.17.1')).toContain('3031_marksman_t3_infinityedge.png')
  })
})

describe('Stackable Runes Service & Detection', () => {
  it('detects equipped stackable runes on a slot', () => {
    const darkHarvest: Rune = { id: 8128, key: 'DarkHarvest', name: 'Dark Harvest', icon: '' }
    const grasp: Rune = {
      id: 8437,
      key: 'GraspOfTheUndying',
      name: 'Grasp of the Undying',
      icon: '',
    }
    const alacrity: Rune = { id: 9104, key: 'LegendAlacrity', name: 'Legend: Alacrity', icon: '' }
    const overgrowth: Rune = { id: 8451, key: 'Overgrowth', name: 'Overgrowth', icon: '' }

    const slot = createSlot(mockChampionAD, [darkHarvest, alacrity, overgrowth, grasp])
    const equipped = getEquippedStackableRunes(slot)
    const keys = equipped.map((e) => e.key)

    expect(keys).toContain('darkHarvest')
    expect(keys).toContain('legendAlacrity')
    expect(keys).toContain('overgrowth')
    expect(keys).toContain('grasp')
  })

  it('reads configured stack value with defaults fallback', () => {
    const slot = createSlot(mockChampionAD, [], 1, {
      runeStacks: {
        darkHarvest: 18,
        grasp: 30,
      },
    })
    expect(getRuneStackValue(slot, 'darkHarvest')).toBe(18)
    expect(getRuneStackValue(slot, 'grasp')).toBe(30)
    // Fallback to default
    expect(getRuneStackValue(slot, 'conqueror')).toBe(12)
    expect(getRuneStackValue(slot, 'legendAlacrity')).toBe(10)
  })
})

describe('Stackable Runes Dynamic Stats Scaling', () => {
  it('scales Grasp of the Undying HP with runeStacks (melee vs ranged)', () => {
    const grasp: Rune = {
      id: 8437,
      key: 'GraspOfTheUndying',
      name: 'Grasp of the Undying',
      icon: '',
    }

    // Darius is melee (attack range 175 <= 225) -> +7 HP per stack
    const slotMelee = createSlot(mockChampionAD, [grasp], 1, {
      runeStacks: { grasp: 10 },
    })
    const statsMelee = calculateStats(slotMelee)
    expect(statsMelee?.hp.bonus).toBe(70)

    // Ahri is ranged (attack range 550 > 225) -> +4 HP per stack
    const slotRanged = createSlot(mockChampionAP, [grasp], 1, {
      runeStacks: { grasp: 10 },
    })
    const statsRanged = calculateStats(slotRanged)
    expect(statsRanged?.hp.bonus).toBe(40)
  })

  it('scales Overgrowth HP and activates +3.5% max HP multiplier at >= 15 stacks', () => {
    const overgrowth: Rune = { id: 8451, key: 'Overgrowth', name: 'Overgrowth', icon: '' }

    // 10 stacks: +30 flat HP, no % bonus
    const slot10 = createSlot(mockChampionAD, [overgrowth], 1, {
      runeStacks: { overgrowth: 10 },
    })
    const stats10 = calculateStats(slot10)
    expect(stats10?.hp.bonus).toBe(30)
    expect(stats10?.hp.total).toBe(652 + 30)

    // 20 stacks: +60 flat HP, +3.5% max HP bonus
    const slot20 = createSlot(mockChampionAD, [overgrowth], 1, {
      runeStacks: { overgrowth: 20 },
    })
    const stats20 = calculateStats(slot20)
    const expected = Math.round((652 + 60) * 1.035)
    expect(stats20?.hp.total).toBe(expected)
  })

  it('scales Legend: Alacrity attack speed with runeStacks', () => {
    const alacrity: Rune = { id: 9104, key: 'LegendAlacrity', name: 'Legend: Alacrity', icon: '' }

    // 0 stacks: base 3% AS
    const slot0 = createSlot(mockChampionAD, [alacrity], 1, {
      runeStacks: { legendAlacrity: 0 },
    })
    const stats0 = calculateStats(slot0)

    // 10 stacks: 3% + 15% = 18% AS
    const slot10 = createSlot(mockChampionAD, [alacrity], 1, {
      runeStacks: { legendAlacrity: 10 },
    })
    const stats10 = calculateStats(slot10)
    expect(stats10!.as.total).toBeGreaterThan(stats0!.as.total)
    expect(stats10!.as.total).toBeCloseTo(0.738, 2)
  })

  it('scales Legend: Bloodline lifesteal and grants +85 HP at 15 stacks', () => {
    const bloodline: Rune = {
      id: 9103,
      key: 'LegendBloodline',
      name: 'Legend: Bloodline',
      icon: '',
    }

    const slot5 = createSlot(mockChampionAD, [bloodline], 1, {
      runeStacks: { legendBloodline: 5 },
    })
    const stats5 = calculateStats(slot5)
    expect(stats5?.lifeSteal.bonus).toBeCloseTo(1.75, 2)
    expect(stats5?.hp.bonus).toBe(0)

    const slot15 = createSlot(mockChampionAD, [bloodline], 1, {
      runeStacks: { legendBloodline: 15 },
    })
    const stats15 = calculateStats(slot15)
    expect(stats15?.lifeSteal.bonus).toBeCloseTo(5.25, 2)
    expect(stats15?.hp.bonus).toBe(85)
  })

  it('scales Jack of All Trades ability haste and adaptive force milestones', () => {
    const joat: Rune = { id: 8306, key: 'JackOfAllTrades', name: 'Jack of All Trades', icon: '' }

    // 4 stacks: +4 AH, 0 AP/AD
    const slot4 = createSlot(mockChampionAP, [joat], 1, {
      runeStacks: { jackOfAllTrades: 4 },
    })
    const stats4 = calculateStats(slot4)
    expect(stats4?.abilityHaste.total).toBe(4)
    expect(stats4?.ap.bonus).toBe(0)

    // 5 stacks: +5 AH, +10 AP (Mage adaptive)
    const slot5 = createSlot(mockChampionAP, [joat], 1, {
      runeStacks: { jackOfAllTrades: 5 },
    })
    const stats5 = calculateStats(slot5)
    expect(stats5?.abilityHaste.total).toBe(5)
    expect(stats5?.ap.bonus).toBe(10)

    // 10 stacks: +10 AH, +25 AP
    const slot10 = createSlot(mockChampionAP, [joat], 1, {
      runeStacks: { jackOfAllTrades: 10 },
    })
    const stats10 = calculateStats(slot10)
    expect(stats10?.abilityHaste.total).toBe(10)
    expect(stats10?.ap.bonus).toBe(25)
  })

  it('scales Gathering Storm adaptive stats across 10-minute intervals', () => {
    const gatheringStorm: Rune = {
      id: 8237,
      key: 'GatheringStorm',
      name: 'Gathering Storm',
      icon: '',
    }

    const slot20 = createSlot(mockChampionAP, [gatheringStorm], 1, {
      runeStacks: { gatheringStorm: 20 },
    })
    const stats20 = calculateStats(slot20)
    expect(stats20?.ap.bonus).toBe(24)

    const slot40 = createSlot(mockChampionAP, [gatheringStorm], 1, {
      runeStacks: { gatheringStorm: 40 },
    })
    const stats40 = calculateStats(slot40)
    expect(stats40?.ap.bonus).toBe(80)
  })
})

describe('Combat Simulation Rune Triggers & Badges', () => {
  it('triggers Arcane Comet on ability damage and records badge', () => {
    const comet: Rune = { id: 8229, key: 'ArcaneComet', name: 'Arcane Comet', icon: '' }
    const attacker = createSlot(mockChampionAP, [comet], 6, { id: 1, side: 'blue' })
    const defender = createSlot(mockChampionAD, [], 6, { id: 2, side: 'red' })

    const result = runCombatSimulation({
      allSlots: [attacker, defender],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [2],
      actions: [{ actorSlotId: 1, action: 'Q', timestamp: 0.1 }],
      duration: 2,
    })

    const cometEvent = result.events.find((e) => e.badges?.some((b) => b.includes('Arcane Comet')))
    expect(cometEvent).toBeDefined()
    expect(cometEvent?.badges).toContainEqual(expect.stringContaining('☄️ Arcane Comet'))
  })

  it('triggers Summon Aery on ability or attack and records badge', () => {
    const aery: Rune = { id: 8214, key: 'SummonAery', name: 'Summon Aery', icon: '' }
    const attacker = createSlot(mockChampionAP, [aery], 6, { id: 1, side: 'blue' })
    const defender = createSlot(mockChampionAD, [], 6, { id: 2, side: 'red' })

    const result = runCombatSimulation({
      allSlots: [attacker, defender],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [2],
      actions: [{ actorSlotId: 1, action: 'Q', timestamp: 0.1 }],
      duration: 2,
    })

    const aeryEvent = result.events.find((e) => e.badges?.some((b) => b.includes('Aery')))
    expect(aeryEvent).toBeDefined()
    expect(aeryEvent?.badges).toContainEqual(expect.stringContaining('🕊️ Aery'))
  })

  it('triggers Grasp of the Undying on basic attack and records badge with heal', () => {
    const grasp: Rune = {
      id: 8437,
      key: 'GraspOfTheUndying',
      name: 'Grasp of the Undying',
      icon: '',
    }
    const attacker = createSlot(mockChampionAD, [grasp], 6, { id: 1, side: 'blue' })
    const defender = createSlot(mockChampionAP, [], 6, { id: 2, side: 'red' })

    const result = runCombatSimulation({
      allSlots: [attacker, defender],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [2],
      actions: [{ actorSlotId: 1, action: 'AA', timestamp: 0.1 }],
      duration: 2,
    })

    const graspEvent = result.events.find((e) => e.badges?.some((b) => b.includes('Grasp')))
    expect(graspEvent).toBeDefined()
    expect(graspEvent?.badges).toContainEqual(expect.stringContaining('✊ Grasp'))
  })

  it('triggers Fleet Footwork on basic attack and records badge with heal', () => {
    const fleet: Rune = { id: 8021, key: 'FleetFootwork', name: 'Fleet Footwork', icon: '' }
    const attacker = createSlot(mockChampionAD, [fleet], 6, { id: 1, side: 'blue' })
    const defender = createSlot(mockChampionAP, [], 6, { id: 2, side: 'red' })

    const result = runCombatSimulation({
      allSlots: [attacker, defender],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [2],
      actions: [{ actorSlotId: 1, action: 'AA', timestamp: 0.1 }],
      duration: 2,
    })

    const fleetEvent = result.events.find((e) => e.badges?.some((b) => b.includes('Fleet')))
    expect(fleetEvent).toBeDefined()
    expect(fleetEvent?.badges).toContainEqual(expect.stringContaining('⚡ Fleet'))
  })

  it('triggers Dark Harvest scaling with user-configured stacks and records stack badge', () => {
    const darkHarvest: Rune = { id: 8128, key: 'DarkHarvest', name: 'Dark Harvest', icon: '' }
    const bfSword = {
      id: '1038',
      name: 'B.F. Sword',
      stats: { FlatPhysicalDamageMod: 500 },
      description: '',
      gold: { total: 1300, base: 1300, purchasable: true, sell: 910 },
      tags: [],
    }
    const attacker = createSlot(mockChampionAD, [darkHarvest], 1, {
      id: 1,
      side: 'blue',
      items: [bfSword],
      runeStacks: { darkHarvest: 15 },
    })
    const defender = createSlot(mockChampionAP, [], 1, { id: 2, side: 'red' })

    // First AA brings defender below 50% HP; second AA procs Dark Harvest
    const result = runCombatSimulation({
      allSlots: [attacker, defender],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [2],
      actions: [
        { actorSlotId: 1, action: 'AA', timestamp: 0.1 },
        { actorSlotId: 1, action: 'AA', timestamp: 2.0 },
      ],
      duration: 4,
    })

    const dhEvent = result.events.find((e) => e.badges?.some((b) => b.includes('Dark Harvest')))
    expect(dhEvent).toBeDefined()
    expect(dhEvent?.badges).toContainEqual(expect.stringContaining('15x'))
  })

  it('triggers Bone Plating on defender taking damage and blocks incoming damage', () => {
    const bonePlating: Rune = { id: 8473, key: 'BonePlating', name: 'Bone Plating', icon: '' }
    const attacker = createSlot(mockChampionAD, [], 6, { id: 1, side: 'blue' })
    const defender = createSlot(mockChampionAP, [bonePlating], 6, { id: 2, side: 'red' })

    const result = runCombatSimulation({
      allSlots: [attacker, defender],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [2],
      actions: [
        { actorSlotId: 1, action: 'AA', timestamp: 0.1 },
        { actorSlotId: 1, action: 'AA', timestamp: 1.0 },
      ],
      duration: 3,
    })

    const bpEvent = result.events.find((e) => e.badges?.some((b) => b.includes('Bone Plating')))
    expect(bpEvent).toBeDefined()
    expect(bpEvent?.badges).toContainEqual(expect.stringContaining('🦴 Bone Plating'))
  })
})
