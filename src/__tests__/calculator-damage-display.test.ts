import { describe, it, expect } from 'vitest'
import { calculateSpellDamage } from '../services/champions/spellCalculatorService'
import type { Champion } from '../types'

describe('Calculator Damage Display & Timeline Integration', () => {
  const jarvan: Champion = {
    id: 'JarvanIV',
    key: '59',
    name: 'Jarvan IV',
    stats: {
      hp: 640,
      hpperlevel: 104,
      mp: 300,
      mpperlevel: 55,
      movespeed: 340,
      armor: 36,
      armorperlevel: 4.8,
      spellblock: 32,
      spellblockperlevel: 2.05,
      attackrange: 175,
      hpregen: 8,
      hpregenperlevel: 0.7,
      mpregen: 6.5,
      mpregenperlevel: 0.45,
      crit: 0,
      critperlevel: 0,
      attackdamage: 64,
      attackdamageperlevel: 3,
      attackspeedperlevel: 2.5,
      attackspeed: 0.658,
    },
    spells: [
      {
        id: 'JarvanIVDragonStrike',
        name: 'Dragon Strike',
        description: 'deals physical damage',
        tooltip: '<physicalDamage>90</physicalDamage>',
        effect: [null, [90, 130, 170, 210, 250]],
        vars: [{ link: 'bonusattackdamage', coeff: [1.4] }],
      },
      {
        id: 'JarvanIVGoldenAegis',
        name: 'Golden Aegis',
        description: 'grants shield',
        tooltip: '<shield>60</shield>',
        effect: [null, [60, 80, 100, 120, 140]],
      },
      {
        id: 'JarvanIVDemacianStandard',
        name: 'Demacian Standard',
        description: 'deals magic damage',
        tooltip: '<magicDamage>80</magicDamage>',
        effect: [null, [10, 13, 16, 19, 22], [80, 120, 160, 200, 240]],
        vars: [{ link: 'spellpower', coeff: [0.8] }],
      },
      {
        id: 'JarvanIVCataclysm',
        name: 'Cataclysm',
        description: 'deals physical damage',
        tooltip: '<physicalDamage>200</physicalDamage>',
        effect: [null, [200, 325, 450]],
        vars: [{ link: 'bonusattackdamage', coeff: [1.8] }],
      },
    ],
    passive: {
      name: 'Martello Marziale',
      description: 'deals bonus physical damage based on current hp',
    },
    tags: ['Fighter', 'Tank'],
  }

  const dummyAttackerStats = {
    ad: 150,
    baseAd: 100,
    ap: 0,
    crit: 0,
    level: 11,
    hp: 1800,
    maxHp: 1800,
    mana: 600,
    armorPen: 0,
    lethality: 0,
    magicPenPercent: 0,
    magicPenFlat: 0,
    adaptiveType: 'AD' as const,
  }

  const defenderState = {
    currentHp: 2000,
    maxHp: 2000,
    armor: 100,
    mr: 50,
    blackCleaverStacks: 0,
    vileDecayStacks: 0,
  }

  it('correctly calculates step-by-step combo damage for Jarvan IV (E -> Q -> AA -> R)', () => {
    // Defender armor mult: 100 / (100 + 100) = 0.5
    // Defender MR mult: 100 / (100 + 50) = 0.6667

    // Step 1: E (Demacian Standard) Rank 1 -> 80 base + 0 AP = 80 magic dmg -> 80 * 0.6667 = 53 dmg
    const stepE = calculateSpellDamage({
      champion: jarvan,
      action: 'E',
      spellRanks: { q: 5, w: 1, e: 1, r: 2 },
      attacker: dummyAttackerStats,
      defender: defenderState,
    })
    const dmgE = Math.round(stepE.rawDmg * stepE.hitMult)
    expect(stepE.rawDmg).toBe(80)
    expect(stepE.dmgType).toBe('magic')
    expect(dmgE).toBe(53)

    // Step 2: Q (Dragon Strike) Rank 5 -> 250 base + 140% bonus AD (50 bonus AD * 1.4 = 70) = 320 raw -> 320 * 0.5 = 160 dmg
    const stepQ = calculateSpellDamage({
      champion: jarvan,
      action: 'Q',
      spellRanks: { q: 5, w: 1, e: 1, r: 2 },
      attacker: dummyAttackerStats,
      defender: defenderState,
    })
    const dmgQ = Math.round(stepQ.rawDmg * stepQ.hitMult)
    expect(stepQ.rawDmg).toBe(320)
    expect(stepQ.dmgType).toBe('physical')
    expect(dmgQ).toBe(160)

    // Step 3: AA (Auto Attack) -> 150 AD -> 150 * 0.5 = 75 dmg
    const stepAA = calculateSpellDamage({
      champion: jarvan,
      action: 'AA',
      spellRanks: { q: 5, w: 1, e: 1, r: 2 },
      attacker: dummyAttackerStats,
      defender: defenderState,
    })
    const dmgAA = Math.round(stepAA.rawDmg * stepAA.hitMult)
    expect(stepAA.rawDmg).toBe(150)
    expect(stepAA.dmgType).toBe('physical')
    expect(dmgAA).toBe(75)

    // Step 4: R (Cataclysm) Rank 2 -> 325 base + 180% bonus AD (50 * 1.8 = 90) = 415 raw -> 415 * 0.5 = 208 dmg
    const stepR = calculateSpellDamage({
      champion: jarvan,
      action: 'R',
      spellRanks: { q: 5, w: 1, e: 1, r: 2 },
      attacker: dummyAttackerStats,
      defender: defenderState,
    })
    const dmgR = Math.round(stepR.rawDmg * stepR.hitMult)
    expect(stepR.rawDmg).toBe(415)
    expect(stepR.dmgType).toBe('physical')
    expect(dmgR).toBe(208)

    // Total combo damage calculation
    const totalComboDmg = dmgE + dmgQ + dmgAA + dmgR
    expect(totalComboDmg).toBe(53 + 160 + 75 + 208) // 496 total damage
  })

  it('verifies that W shield does not deal damage to defender', () => {
    const stepW = calculateSpellDamage({
      champion: jarvan,
      action: 'W',
      spellRanks: { q: 5, w: 1, e: 1, r: 2 },
      attacker: dummyAttackerStats,
      defender: defenderState,
    })

    expect(stepW.isUtilityOrShield).toBe(true)
    expect(stepW.rawDmg).toBe(0)
    expect(Math.round(stepW.rawDmg * stepW.hitMult)).toBe(0)
  })

  it('never produces NaN when baseAd or other stats are undefined', () => {
    const incompleteAttacker = {
      ad: 150,
      baseAd: undefined as unknown as number,
      ap: 0,
      crit: 0,
      level: 11,
      hp: 1800,
      maxHp: 1800,
      mana: 600,
      armorPen: 0,
      lethality: 0,
      magicPenPercent: 0,
      magicPenFlat: 0,
      adaptiveType: 'AD' as const,
    }

    const stepQ = calculateSpellDamage({
      champion: jarvan,
      action: 'Q',
      spellRanks: { q: 5, w: 1, e: 1, r: 2 },
      attacker: incompleteAttacker,
      defender: defenderState,
    })

    expect(Number.isNaN(stepQ.rawDmg)).toBe(false)
    expect(Number.isNaN(stepQ.hitMult)).toBe(false)
    expect(stepQ.rawDmg).toBeGreaterThan(0)
  })
})
