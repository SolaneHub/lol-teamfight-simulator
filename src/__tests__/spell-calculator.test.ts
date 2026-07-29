import { describe, it, expect } from 'vitest'
import { calculateSpellDamage } from '../services/champions/spellCalculatorService'
import type { Champion, ChampionStats, ChampionPassive } from '../types'

describe('Universal Spell Calculator Service', () => {
  const dummyAttacker = {
    ad: 100,
    baseAd: 60,
    ap: 0,
    crit: 0,
    level: 10,
    hp: 1500,
    maxHp: 1500,
    mana: 500,
    armorPen: 0,
    lethality: 0,
    magicPenPercent: 0,
    magicPenFlat: 0,
    adaptiveType: 'AD' as const,
  }

  const dummyDefender = {
    currentHp: 1000,
    maxHp: 1000,
    armor: 50,
    mr: 30,
    blackCleaverStacks: 0,
    vileDecayStacks: 0,
  }

  const jarvanChamp: Champion = {
    id: 'JarvanIV',
    key: '59',
    name: 'Jarvan IV',
    stats: {} as ChampionStats,
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

  it('calculates distinct Jarvan IV spell damage for Q, W, E, R, P', () => {
    // Passive: 8% of defender current HP (1000 HP * 0.08 = 80 physical dmg)
    const resP = calculateSpellDamage({
      champion: jarvanChamp,
      action: 'P',
      attacker: dummyAttacker,
      defender: dummyDefender,
    })
    expect(resP.rawDmg).toBe(80)
    expect(resP.dmgType).toBe('physical')

    // Q (Rank 5): 250 base + 140% bonus AD (40 bonus AD * 1.4 = 56) = 306
    const resQ = calculateSpellDamage({
      champion: jarvanChamp,
      action: 'Q',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })
    expect(resQ.rawDmg).toBe(306)
    expect(resQ.dmgType).toBe('physical')

    // W: Utility/Shield (0 damage)
    const resW = calculateSpellDamage({
      champion: jarvanChamp,
      action: 'W',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })
    expect(resW.rawDmg).toBe(0)
    expect(resW.isUtilityOrShield).toBe(true)

    // E: Magic damage 80 base + 0 AP = 80
    const resE = calculateSpellDamage({
      champion: jarvanChamp,
      action: 'E',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })
    expect(resE.rawDmg).toBe(80)
    expect(resE.dmgType).toBe('magic')

    // R: Physical damage 200 base + 1.8 * 40 bonus AD = 272
    const resR = calculateSpellDamage({
      champion: jarvanChamp,
      action: 'R',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })
    expect(resR.rawDmg).toBe(272)
    expect(resR.dmgType).toBe('physical')
  })

  it('calculates distinct damage for any unregistered champion via Universal Engine', () => {
    const genericChamp: Champion = {
      id: 'RandomChamp',
      key: '999',
      name: 'Random Champion',
      stats: {} as ChampionStats,
      spells: [
        {
          id: 'Q',
          name: 'Q Spell',
          description: 'deals physical damage',
          tooltip: '<physicalDamage>70</physicalDamage>',
        },
        {
          id: 'W',
          name: 'W Spell',
          description: 'deals physical damage',
          tooltip: '<physicalDamage>60</physicalDamage>',
        },
        {
          id: 'E',
          name: 'E Spell',
          description: 'deals physical damage',
          tooltip: '<physicalDamage>65</physicalDamage>',
        },
        {
          id: 'R',
          name: 'R Spell',
          description: 'deals physical damage',
          tooltip: '<physicalDamage>150</physicalDamage>',
        },
      ],
      passive: {} as ChampionPassive,
    }

    const resQ = calculateSpellDamage({
      champion: genericChamp,
      action: 'Q',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })

    const resW = calculateSpellDamage({
      champion: genericChamp,
      action: 'W',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })

    const resR = calculateSpellDamage({
      champion: genericChamp,
      action: 'R',
      spellRanks: { q: 5, w: 1, e: 1, r: 1 },
      attacker: dummyAttacker,
      defender: dummyDefender,
    })

    expect(resQ.rawDmg).not.toBe(resW.rawDmg)
    expect(resR.rawDmg).toBeGreaterThan(resQ.rawDmg)
  })
})
