import { describe, it, expect } from 'vitest'
import { calculateStats } from '../services/draft/draftService'
import type { DraftSlot, Champion, Rune } from '../types'

const mockChampion: Champion = {
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

describe('Rune & Stat Shard Calculations', () => {
  it('should apply stat shards to champion stats', () => {
    const slot: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Mid',
      champion: mockChampion,
      level: 1,
      items: [],
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: 'adaptive', // +9 AP (Ahri default AP)
      shardFlex: 'ms', // +2% MS
      shardDefensive: 'flat_hp', // +65 HP
    }

    const stats = calculateStats(slot)
    expect(stats).not.toBeNull()
    if (!stats) return

    expect(stats.ap.total).toBe(9) // Adaptive Force AP
    expect(stats.hp.total).toBe(590 + 65) // Base HP + Flat HP Shard
    expect(stats.ms.raw).toBe(Math.round(330 * 1.02)) // Movement speed with +2% shard
  })

  it('should apply rune stat bonuses like Legend: Haste and Conditioning', () => {
    const legendHaste: Rune = {
      id: 9104,
      key: 'LegendHaste',
      icon: '',
      name: 'Legend: Haste',
      shortDesc: '',
      longDesc: '',
    }

    const slot: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Mid',
      champion: mockChampion,
      level: 12,
      items: [],
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: legendHaste,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: 'haste', // +8 AH
      shardFlex: null,
      shardDefensive: null,
    }

    const stats = calculateStats(slot)
    expect(stats).not.toBeNull()
    if (!stats) return

    // 8 AH from shard (general AH) + 15 Basic AH from Legend: Haste
    expect(stats.abilityHaste.total).toBe(8)
    expect(stats.abilityHaste.basicAbilityHaste).toBe(15)
    expect(stats.abilityHaste.basicCdrPercent).toBe(Math.round((23 / (23 + 100)) * 100))
  })

  it('should calculate Conqueror AD/AP stats correctly based on stacks', () => {
    const conquerorRune: Rune = {
      id: 8010,
      key: 'Conqueror',
      icon: 'v1/perk-images/Styles/Precision/Conqueror/Conqueror.png',
      name: 'Conqueror',
      shortDesc: 'Gain stacks of adaptive force when attacking.',
      longDesc: 'Attacks or spells grant 2 stacks of Conqueror.',
    }

    const slotLvl1: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Mid',
      champion: mockChampion,
      level: 1,
      items: [],
      primaryPath: null,
      primaryKeystone: conquerorRune,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      conquerorStacks: 12,
    }

    const stats1 = calculateStats(slotLvl1)
    expect(stats1).not.toBeNull()
    if (!stats1) return
    // At level 1, 12 stacks = 21.6 AP for Ahri (AP adaptive)
    expect(stats1.ap.total).toBe(22)

    // At 6 stacks at level 1
    const stats6Stacks = calculateStats({ ...slotLvl1, conquerorStacks: 6 })
    expect(stats6Stacks?.ap.total).toBe(11)
  })
})
