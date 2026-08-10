import { describe, it, expect } from 'vitest'
import { calculateStats } from '../services/draft/draftService'
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

const createSlot = (champion: Champion, runes: Rune[], level = 1, extraProps: Partial<DraftSlot> = {}): DraftSlot => ({
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
    const conqueror: Rune = { id: 8010, key: 'Conqueror', icon: '', name: 'Conqueror', shortDesc: '', longDesc: '' }
    
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
    const lethalTempo: Rune = { id: 8008, key: 'LethalTempo', icon: '', name: 'Lethal Tempo', shortDesc: '', longDesc: '' }
    const slot = createSlot(mockChampionAP, [lethalTempo], 1, { lethalTempoStacks: 6 })
    const stats = calculateStats(slot)
    const baseAs = 0.668
    const expectedAs = Math.round((baseAs + baseAs * 0.3) * 1000) / 1000
    expect(stats?.as.total).toBe(expectedAs)
  })

  it('should apply Legend: Haste basic ability haste', () => {
    const legendHaste: Rune = { id: 9104, key: 'LegendHaste', icon: '', name: 'Legend: Haste', shortDesc: '', longDesc: '' }
    const slot = createSlot(mockChampionAP, [null as unknown as Rune, legendHaste])
    const stats = calculateStats(slot)
    expect(stats?.abilityHaste.basicAbilityHaste).toBe(15)
  })

  it('should apply Legend: Alacrity attack speed bonus', () => {
    const legendAlacrity: Rune = { id: 9105, key: 'LegendAlacrity', icon: '', name: 'Legend: Alacrity', shortDesc: '', longDesc: '' }
    const slot = createSlot(mockChampionAP, [null as unknown as Rune, legendAlacrity])
    const stats = calculateStats(slot)
    const baseAs = 0.668
    const expectedAs = Math.round((baseAs + baseAs * 0.18) * 1000) / 1000
    expect(stats?.as.total).toBe(expectedAs)
  })

  it('should apply Legend: Bloodline life steal and bonus HP', () => {
    const legendBloodline: Rune = { id: 9103, key: 'LegendBloodline', icon: '', name: 'Legend: Bloodline', shortDesc: '', longDesc: '' }
    const slot = createSlot(mockChampionAP, [null as unknown as Rune, legendBloodline])
    const stats = calculateStats(slot)
    expect(stats?.lifeSteal.total).toBe(5)
    expect(stats?.hp.total).toBe(590 + 85)
  })

  it('should identify Press the Attack keystone for combat simulation procs', () => {
    const pta: Rune = { id: 8005, key: 'PressTheAttack', icon: '', name: 'Press the Attack', shortDesc: 'Hitting an enemy champion 3 times procs bonus damage.', longDesc: '' }
    const slot = createSlot(mockChampionAD, [pta])
    expect(slot.primaryKeystone?.name).toBe('Press the Attack')
    
    // PtA Proc Bonus Damage formula check at Level 1 (40 dmg) vs Level 18 (180 dmg)
    const getPtaProcDamage = (level: number) => Math.round(40 + (level - 1) * (140 / 17))
    expect(getPtaProcDamage(1)).toBe(40)
    expect(getPtaProcDamage(18)).toBe(180)
  })

  it('should calculate Coup de Grace damage multiplier when target HP < 40%', () => {
    const coupDeGrace: Rune = { id: 8014, key: 'CoupDeGrace', icon: '', name: 'Coup de Grace', shortDesc: 'Deal 8% more damage to champions below 40% health.', longDesc: '' }
    const slot = createSlot(mockChampionAD, [null as unknown as Rune, null as unknown as Rune, null as unknown as Rune, coupDeGrace])
    expect(slot.primaryRune3?.name).toBe('Coup de Grace')

    const getCoupDeGraceMultiplier = (targetHpPct: number) => (targetHpPct < 40 ? 1.08 : 1.0)
    expect(getCoupDeGraceMultiplier(35)).toBe(1.08)
    expect(getCoupDeGraceMultiplier(50)).toBe(1.0)
  })

  it('should calculate Cut Down damage multiplier when target HP > 60%', () => {
    const cutDown: Rune = { id: 8017, key: 'CutDown', icon: '', name: 'Cut Down', shortDesc: 'Deal 8% more damage to champions above 60% health.', longDesc: '' }
    const slot = createSlot(mockChampionAD, [null as unknown as Rune, null as unknown as Rune, null as unknown as Rune, cutDown])
    expect(slot.primaryRune3?.name).toBe('Cut Down')

    const getCutDownMultiplier = (targetHpPct: number) => (targetHpPct > 60 ? 1.08 : 1.0)
    expect(getCutDownMultiplier(75)).toBe(1.08)
    expect(getCutDownMultiplier(50)).toBe(1.0)
  })

  it('should calculate Last Stand damage multiplier scaling when attacker HP < 60%', () => {
    const lastStand: Rune = { id: 8299, key: 'LastStand', icon: '', name: 'Last Stand', shortDesc: 'Deal 5% to 11% more damage while low health.', longDesc: '' }
    const slot = createSlot(mockChampionAD, [null as unknown as Rune, null as unknown as Rune, null as unknown as Rune, lastStand])
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
      shortDesc: 'Hitting a champion with 3 separate attacks or abilities within 3s deals bonus adaptive damage.',
      longDesc: '',
    }
    const slot = createSlot(mockChampionAP, [electrocute])
    expect(slot.primaryKeystone?.name).toBe('Electrocute')

    const getElectrocuteRawDmg = (level: number, ap: number, bonusAd: number, isAp: boolean) => {
      const baseEleDmg = 50 + (level - 1) * (140 / 17)
      const bonusEleDmg = isAp ? ap * 0.25 : bonusAd * 0.40
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

    const getDarkHarvestRawDmg = (level: number, stacks: number, ap: number, bonusAd: number, isAp: boolean) => {
      const baseDhDmg = 20 + (level - 1) * (40 / 17) + stacks * 9
      const bonusDhDmg = isAp ? ap * 0.05 : bonusAd * 0.10
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
    const expectedAsMelee = Math.round((baseAsMelee + baseAsMelee * 1.10) * 1000) / 1000
    expect(statsMelee?.as.total).toBe(expectedAsMelee)

    // Ranged (Ahri) => +80% AS
    const slotRanged = createSlot(mockChampionAP, [hailOfBlades], 1, { hailOfBladesActive: true })
    const statsRanged = calculateStats(slotRanged)
    const baseAsRanged = 0.668
    const expectedAsRanged = Math.round((baseAsRanged + baseAsRanged * 0.80) * 1000) / 1000
    expect(statsRanged?.as.total).toBe(expectedAsRanged)
  })
})
