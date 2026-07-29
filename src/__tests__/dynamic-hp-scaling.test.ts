import { describe, it, expect } from 'vitest'
import { calculateSpellDamage } from '../services/champions/spellCalculatorService'
import type { Champion, ChampionStats, ChampionPassive } from '../types'

describe('Dynamic HP Scaling & Execute Damage Tests', () => {
  const seraphine: Champion = {
    id: 'Seraphine',
    key: '145',
    name: 'Seraphine',
    stats: {} as ChampionStats,
    spells: [
      {
        id: 'SeraphineQ',
        name: 'High Note',
        description: 'deals magic damage increased by missing health',
        tooltip: '<magicDamage>60 magic damage</magicDamage> increased by missing health',
        effect: [null, [60, 85, 110, 135, 160]],
        vars: [{ link: 'spellpower', coeff: [0.6] }],
      },
    ],
    passive: {} as ChampionPassive,
  }

  const jarvan: Champion = {
    id: 'JarvanIV',
    key: '59',
    name: 'Jarvan IV',
    stats: {} as ChampionStats,
    spells: [],
    passive: {
      name: 'Martello Marziale',
      description: 'deals current health physical damage',
    },
  }

  const garen: Champion = {
    id: 'Garen',
    key: '86',
    name: 'Garen',
    stats: {} as ChampionStats,
    spells: [
      { id: 'Q', name: 'Q', description: '', tooltip: '' },
      { id: 'W', name: 'W', description: '', tooltip: '' },
      { id: 'E', name: 'E', description: '', tooltip: '' },
      {
        id: 'GarenR',
        name: 'Demacian Justice',
        description: 'deals true damage plus missing health',
        tooltip: '<trueDamage>150 true damage</trueDamage> plus missing health',
        effect: [null, [150, 300, 450]],
      },
    ],
    passive: {} as ChampionPassive,
  }

  const attackerAP = {
    ad: 60,
    baseAd: 60,
    ap: 200,
    crit: 0,
    level: 11,
    hp: 1500,
    maxHp: 1500,
    mana: 500,
    armorPen: 0,
    lethality: 0,
    magicPenPercent: 0,
    magicPenFlat: 0,
    adaptiveType: 'AP' as const,
  }

  const defenderFullHp = {
    currentHp: 2000,
    maxHp: 2000,
    armor: 50,
    mr: 50,
    blackCleaverStacks: 0,
    vileDecayStacks: 0,
  }

  const defenderLowHp = {
    currentHp: 500, // 75% missing HP
    maxHp: 2000,
    armor: 50,
    mr: 50,
    blackCleaverStacks: 0,
    vileDecayStacks: 0,
  }

  it('verifies that Seraphine Q damage increases dynamically as target HP drops', () => {
    // Cast 1: Target at 100% HP (0% missing HP)
    // Raw Dmg = (60 + 200 * 0.6) * (1 + 0) = 180
    const resFull = calculateSpellDamage({
      champion: seraphine,
      action: 'Q',
      spellRanks: { q: 1, w: 1, e: 1, r: 1 },
      attacker: attackerAP,
      defender: defenderFullHp,
    })

    // Cast 2: Target at 25% HP (75% missing HP -> +75% max bonus damage)
    // Raw Dmg = (60 + 200 * 0.6) * (1 + 0.75) = 180 * 1.75 = 315
    const resLow = calculateSpellDamage({
      champion: seraphine,
      action: 'Q',
      spellRanks: { q: 1, w: 1, e: 1, r: 1 },
      attacker: attackerAP,
      defender: defenderLowHp,
    })

    expect(resFull.rawDmg).toBe(180)
    expect(resLow.rawDmg).toBe(315)
    expect(resLow.rawDmg).toBeGreaterThan(resFull.rawDmg)
  })

  it('verifies that Jarvan IV Passive damage decreases dynamically as target HP drops', () => {
    // Hit 1: Target at 2000 HP -> 8% of 2000 = 160
    const hit1 = calculateSpellDamage({
      champion: jarvan,
      action: 'P',
      attacker: attackerAP,
      defender: defenderFullHp,
    })

    // Hit 2: Target at 500 HP -> 8% of 500 = 40
    const hit2 = calculateSpellDamage({
      champion: jarvan,
      action: 'P',
      attacker: attackerAP,
      defender: defenderLowHp,
    })

    expect(hit1.rawDmg).toBe(160)
    expect(hit2.rawDmg).toBe(40)
    expect(hit1.rawDmg).toBeGreaterThan(hit2.rawDmg)
  })

  it('verifies that Garen R execute damage scales dynamically with missing HP', () => {
    // Cast at Full HP: 150 + 0 missing HP = 150 true damage
    const resFull = calculateSpellDamage({
      champion: garen,
      action: 'R',
      spellRanks: { q: 1, w: 1, e: 1, r: 1 },
      attacker: attackerAP,
      defender: defenderFullHp,
    })

    // Cast at 500 HP (1500 missing HP): 150 + 25% of 1500 = 150 + 375 = 525 true damage
    const resLow = calculateSpellDamage({
      champion: garen,
      action: 'R',
      spellRanks: { q: 1, w: 1, e: 1, r: 1 },
      attacker: attackerAP,
      defender: defenderLowHp,
    })

    expect(resFull.rawDmg).toBe(150)
    expect(resFull.dmgType).toBe('true')
    expect(resLow.rawDmg).toBe(525)
    expect(resLow.dmgType).toBe('true')
  })
})
