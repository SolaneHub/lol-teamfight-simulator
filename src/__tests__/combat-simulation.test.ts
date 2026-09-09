import { describe, it, expect } from 'vitest'
import { runCombatSimulation, type CombatAction } from '../services/combat/combatSimulationService'
import type { DraftSlot, Champion } from '../types'

describe('Combat Simulation Engine (DPS, DoT, Two-way Trading)', () => {
  const dariusChamp: Champion = {
    id: 'Darius',
    key: '122',
    name: 'Darius',
    stats: {
      hp: 652,
      hpperlevel: 114,
      mp: 263,
      mpperlevel: 58,
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
      attackdamageperlevel: 5,
      attackspeedperlevel: 1,
      attackspeed: 0.625,
    },
    spells: [
      {
        id: 'DariusCleave',
        name: 'Decimate',
        description: 'deals physical damage',
        tooltip: '<physicalDamage>100</physicalDamage>',
        effect: [null, [100, 140, 180, 220, 260]],
        vars: [{ link: 'bonusattackdamage', coeff: [1.2] }],
      },
      {
        id: 'DariusNoxianTacticsWMK',
        name: 'Crippling Strike',
        description: 'empowered AA',
        tooltip: '<physicalDamage>140%</physicalDamage>',
      },
      {
        id: 'DariusAxeGrab',
        name: 'Apprehend',
        description: 'pulls enemies',
        tooltip: '<physicalDamage>0</physicalDamage>',
      },
      {
        id: 'DariusExecute',
        name: 'Noxian Guillotine',
        description: 'true damage execute',
        tooltip: '<trueDamage>300</trueDamage>',
        effect: [null, [125, 250, 375]],
        vars: [{ link: 'bonusattackdamage', coeff: [0.75] }],
      },
    ],
    passive: {
      name: 'Hemorrhage',
      description: 'deals bleed damage',
    },
    tags: ['Fighter', 'Tank'],
  }

  const garenChamp: Champion = {
    id: 'Garen',
    key: '86',
    name: 'Garen',
    stats: {
      hp: 690,
      hpperlevel: 98,
      mp: 0,
      mpperlevel: 0,
      movespeed: 340,
      armor: 38,
      armorperlevel: 4.2,
      spellblock: 32,
      spellblockperlevel: 1.55,
      attackrange: 175,
      hpregen: 8,
      hpregenperlevel: 0.5,
      mpregen: 0,
      mpregenperlevel: 0,
      crit: 0,
      critperlevel: 0,
      attackdamage: 69,
      attackdamageperlevel: 4.5,
      attackspeedperlevel: 3.65,
      attackspeed: 0.625,
    },
    spells: [
      {
        id: 'GarenQ',
        name: 'Decisive Strike',
        description: 'empowers attack',
        tooltip: '<physicalDamage>90</physicalDamage>',
        effect: [null, [30, 60, 90, 120, 150]],
        vars: [{ link: 'attackdamage', coeff: [0.5] }],
      },
      {
        id: 'GarenW',
        name: 'Courage',
        description: 'shield and defense',
        tooltip: '<shield>65</shield>',
      },
      {
        id: 'GarenE',
        name: 'Judgment',
        description: 'spins dealing damage',
        tooltip: '<physicalDamage>150</physicalDamage>',
        effect: [null, [4, 8, 12, 16, 20]],
      },
      {
        id: 'GarenR',
        name: 'Demacian Justice',
        description: 'true damage execute',
        tooltip: '<trueDamage>150 + 25% missing HP</trueDamage>',
        effect: [null, [150, 300, 450]],
      },
    ],
    passive: {
      name: 'Perseverance',
      description: 'health regen',
    },
    tags: ['Fighter', 'Tank'],
  }

  const defaultBuffs = {
    red: false,
    blue: false,
    baron: false,
    elder: false,
    infernal: 0,
    mountain: 0,
    ocean: 0,
    cloud: 0,
    hextech: 0,
    chemtech: 0,
    soul: 'none',
  }

  const blueDariusSlot: DraftSlot = {
    id: 1,
    side: 'blue',
    role: 'Top',
    champion: dariusChamp,
    level: 11,
    items: [
      { id: '3071', name: 'Black Cleaver', description: '<attention>+400</attention> Health <attention>+55</attention> Attack Damage' },
      null, null, null, null, null,
    ],
    primaryPath: null,
    primaryKeystone: { id: 8010, key: 'Conqueror', name: 'Conqueror' } as unknown as DraftSlot['primaryKeystone'],
    primaryRune1: null,
    primaryRune2: null,
    primaryRune3: null,
    secondaryPath: null,
    secondaryRune1: null,
    secondaryRune2: null,
    shardOffensive: null,
    shardFlex: null,
    shardDefensive: null,
  }

  const redGarenSlot: DraftSlot = {
    id: 6,
    side: 'red',
    role: 'Top',
    champion: garenChamp,
    level: 11,
    items: [
      { id: '3068', name: 'Sunfire Aegis', description: '<attention>+500</attention> Health <attention>+50</attention> Armor' },
      null, null, null, null, null,
    ],
    primaryPath: null,
    primaryKeystone: { id: 8010, key: 'Conqueror', name: 'Conqueror' } as unknown as DraftSlot['primaryKeystone'],
    primaryRune1: null,
    primaryRune2: null,
    primaryRune3: null,
    secondaryPath: null,
    secondaryRune1: null,
    secondaryRune2: null,
    shardOffensive: null,
    shardFlex: null,
    shardDefensive: null,
  }

  it('correctly simulates mutual trade and computes DPS for both champions', () => {
    const actions: CombatAction[] = [
      { id: 'a1', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
      { id: 'a2', actorSlotId: 6, action: 'Q', targetSlotIds: [1], timestamp: 0.5 },
    ]

    const result = runCombatSimulation({
      allSlots: [blueDariusSlot, redGarenSlot],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions,
      duration: 5.0,
      enableAutoAttacks: true,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    expect(result.duration).toBe(5.0)

    const dariusResult = result.championResults[1]
    const garenResult = result.championResults[6]

    expect(dariusResult).toBeDefined()
    expect(garenResult).toBeDefined()

    // Both champions should have dealt and received damage
    expect(dariusResult.totalDamageDealt).toBeGreaterThan(0)
    expect(dariusResult.damageTaken).toBeGreaterThan(0)
    expect(dariusResult.dps).toBeGreaterThan(0)
    expect(dariusResult.dps).toBe(Math.round((dariusResult.totalDamageDealt / 5.0) * 10) / 10)

    expect(garenResult.totalDamageDealt).toBeGreaterThan(0)
    expect(garenResult.damageTaken).toBeGreaterThan(0)
    expect(garenResult.dps).toBeGreaterThan(0)
    expect(garenResult.dps).toBe(Math.round((garenResult.totalDamageDealt / 5.0) * 10) / 10)

    // Team totals match
    expect(result.blueTeamTotalDamage).toBe(dariusResult.totalDamageDealt)
    expect(result.redTeamTotalDamage).toBe(garenResult.totalDamageDealt)
  })

  it('correctly propagates continuous DoT ticks (Darius Bleed & Sunfire Aura) over time', () => {
    const actions: CombatAction[] = [
      { id: 'a1', actorSlotId: 1, action: 'AA', targetSlotIds: [6], timestamp: 0.0 },
    ]

    const result = runCombatSimulation({
      allSlots: [blueDariusSlot, redGarenSlot],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions,
      duration: 4.0,
      enableAutoAttacks: false, // Only manual actions and DoTs
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    // Darius AA applied Hemorrhage DoT, which ticks multiple times over 4s
    const bleedEvents = result.events.filter((e) => e.action.includes('Hemorrhage Bleed'))
    expect(bleedEvents.length).toBeGreaterThanOrEqual(3)

    // Sunfire on Garen ticks magic burn aura every second
    const sunfireEvents = result.events.filter((e) => e.action.includes('Sunfire Aura'))
    expect(sunfireEvents.length).toBeGreaterThanOrEqual(3)

    // Verify timestamps are incremental and not all 0
    expect(bleedEvents[0].timestamp).toBeGreaterThan(0)
    expect(bleedEvents[1].timestamp).toBeGreaterThan(bleedEvents[0].timestamp)
  })

  it('correctly applies and refreshes Liandry and Blackfire burns', () => {
    const mageSlot: DraftSlot = {
      id: 2,
      side: 'blue',
      role: 'Mid',
      champion: dariusChamp, // using dummy champ stats
      level: 11,
      items: [
        { id: '3151', name: "Liandry's Torment", description: '<attention>+90</attention> Ability Power <attention>+300</attention> Health' },
        { id: '2503', name: 'Blackfire Torch', description: '<attention>+90</attention> Ability Power <attention>+600</attention> Mana' },
        null, null, null, null,
      ],
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const targetDummy: DraftSlot = {
      id: 7,
      side: 'red',
      role: 'Mid',
      champion: garenChamp,
      level: 11,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const result = runCombatSimulation({
      allSlots: [mageSlot, targetDummy],
      activeBlueSlotIds: [2],
      activeRedSlotIds: [7],
      actions: [
        { id: 'm1', actorSlotId: 2, action: 'Q', targetSlotIds: [7], timestamp: 0.0 },
      ],
      duration: 3.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const liandryEvents = result.events.filter((e) => e.action.includes("Liandry's Torment Burn"))
    const blackfireEvents = result.events.filter((e) => e.action.includes('Blackfire Torch Burn'))

    expect(liandryEvents.length).toBeGreaterThanOrEqual(4)
    expect(blackfireEvents.length).toBeGreaterThanOrEqual(4)
  })

  it('correctly executes Seraphine Stage Presence: Echo on 3rd basic ability and Notes on AA', () => {
    const seraChamp: Champion = {
      id: 'Seraphine',
      key: '147',
      name: 'Seraphine',
      stats: {
        hp: 600,
        hpperlevel: 104,
        mp: 440,
        mpperlevel: 40,
        movespeed: 325,
        armor: 26,
        armorperlevel: 4.2,
        spellblock: 30,
        spellblockperlevel: 1.3,
        attackrange: 525,
        hpregen: 6.5,
        hpregenperlevel: 0.6,
        mpregen: 8,
        mpregenperlevel: 1,
        crit: 0,
        critperlevel: 0,
        attackdamage: 55,
        attackdamageperlevel: 3,
        attackspeedperlevel: 1,
        attackspeed: 0.669,
      },
      spells: [
        {
          id: 'SeraphineQ',
          name: 'High Note',
          description: 'deals magic damage increasing with missing HP',
          tooltip: '<magicDamage>120</magicDamage>',
          effect: [null, [60, 85, 110, 135, 160]],
          vars: [{ link: 'spellpower', coeff: [0.5] }],
        },
        {
          id: 'SeraphineW',
          name: 'Surround Sound',
          description: 'shields allies',
          tooltip: '<shield>60</shield>',
        },
        {
          id: 'SeraphineE',
          name: 'Beat Drop',
          description: 'deals magic damage',
          tooltip: '<magicDamage>100</magicDamage>',
          effect: [null, [70, 100, 130, 160, 190]],
          vars: [{ link: 'spellpower', coeff: [0.5] }],
        },
        {
          id: 'SeraphineR',
          name: 'Encore',
          description: 'deals magic damage',
          tooltip: '<magicDamage>250</magicDamage>',
          effect: [null, [150, 200, 250]],
          vars: [{ link: 'spellpower', coeff: [0.6] }],
        },
      ],
      tags: ['Mage', 'Support'],
    }

    const seraSlot: DraftSlot = {
      id: 3,
      side: 'blue',
      role: 'Mid',
      champion: seraChamp,
      level: 11,
      items: [
        { id: '3089', name: "Rabadon's Deathcap", description: '<attention>+140</attention> Ability Power' },
        null, null, null, null, null,
      ],
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const dummyEnemy: DraftSlot = {
      id: 8,
      side: 'red',
      role: 'Mid',
      champion: garenChamp,
      level: 11,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    // Sequence: 1. Q, 2. E, 3. Q (3rd cast => ECHO!), 4. AA (consumes notes)
    const actions: CombatAction[] = [
      { id: 's1', actorSlotId: 3, action: 'Q', targetSlotIds: [8], timestamp: 0.0 },
      { id: 's2', actorSlotId: 3, action: 'E', targetSlotIds: [8], timestamp: 0.5 },
      { id: 's3', actorSlotId: 3, action: 'Q', targetSlotIds: [8], timestamp: 1.0 },
      { id: 's4', actorSlotId: 3, action: 'AA', targetSlotIds: [8], timestamp: 1.5 },
    ]

    const result = runCombatSimulation({
      allSlots: [seraSlot, dummyEnemy],
      activeBlueSlotIds: [3],
      activeRedSlotIds: [8],
      actions,
      duration: 3.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    // 1st cast: Q (1 hit)
    const firstQEvents = result.events.filter((e) => e.action === 'Q' && e.timestamp === 0.0)
    expect(firstQEvents.length).toBe(1)

    // 2nd cast: E (1 hit)
    const eEvents = result.events.filter((e) => e.action === 'E' && e.timestamp === 0.5)
    expect(eEvents.length).toBe(1)

    // 3rd cast: Q (Echo => 2 hits, normal + echo)
    const thirdQEvents = result.events.filter((e) => e.timestamp === 1.0)
    expect(thirdQEvents.length).toBe(2)
    expect(thirdQEvents[0].action).toBe('Q')
    expect(thirdQEvents[1].action).toContain('Echo')
    // The second Q hit must deal MORE damage than the first Q hit because the target's HP is lower (missing HP execute scaling!)
    expect(thirdQEvents[1].amount).toBeGreaterThan(thirdQEvents[0].amount)

    // 4th action: AA fires Notes Volley
    const noteEvents = result.events.filter((e) => e.action.includes('Notes') && e.timestamp === 1.5)
    expect(noteEvents.length).toBe(1)
    expect(noteEvents[0].amount).toBeGreaterThan(0)
  })

  it('calculates spell cooldowns and scales with Ability Haste', async () => {
    const slotWithHaste: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Top',
      champion: dariusChamp,
      level: 11,
      items: [
        { id: '3071', name: 'Black Cleaver', description: '+20 Ability Haste' },
        null, null, null, null, null,
      ],
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const { getSpellBaseCooldown, getSpellEffectiveCooldown } = await import('../services/combat/combatSimulationService')
    // Decimate base cooldown at max rank is 5s
    const baseCd = getSpellBaseCooldown(slotWithHaste, 'Q')
    expect(baseCd).toBeGreaterThan(0)

    // With 100 Ability Haste, cooldown is halved (50% reduction)
    const effectiveCd = getSpellEffectiveCooldown(slotWithHaste, 'Q', 100)
    expect(effectiveCd).toBeCloseTo(baseCd * 0.5, 1)
  })

  it('automatically rotates spells on cooldown and weaves auto-attacks when autoCastSpells is true', () => {
    const slotDarius: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Top',
      champion: dariusChamp,
      level: 11,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const slotGaren: DraftSlot = {
      id: 6,
      side: 'red',
      role: 'Top',
      champion: garenChamp,
      level: 11,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    // Run 6s simulation with autoCastSpells and autoAttacks enabled, without manual actions!
    const result = runCombatSimulation({
      allSlots: [slotDarius, slotGaren],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [],
      duration: 6.0,
      enableAutoAttacks: true,
      autoCastSpells: true,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    // Both sides should have cast abilities and performed auto attacks
    const dariusEvents = result.events.filter((e) => e.actorSlotId === 1)
    const garenEvents = result.events.filter((e) => e.actorSlotId === 6)

    expect(dariusEvents.length).toBeGreaterThan(2)
    expect(garenEvents.length).toBeGreaterThan(2)

    // Damage & DPS should be actively computed
    expect(result.blueTeamTotalDamage).toBeGreaterThan(0)
    expect(result.blueTeamDps).toBeGreaterThan(0)
    expect(result.redTeamTotalDamage).toBeGreaterThan(0)
    expect(result.redTeamDps).toBeGreaterThan(0)
  })

  it('terminates immediately when target reaches 0 HP (Time To Kill - TTK) and calculates true burst DPS', () => {
    const lowHpChamp: Champion = {
      ...garenChamp,
      stats: { ...garenChamp.stats, hp: 150 },
    }

    const fragileTarget: DraftSlot = {
      id: 6,
      side: 'red',
      role: 'Top',
      champion: lowHpChamp,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    // Darius casts Q at 0.0s (deals ~180 damage, instantly executing the 150 HP target)
    const result = runCombatSimulation({
      allSlots: [blueDariusSlot, fragileTarget],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'act1', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
      ],
      duration: 15.0, // Long safety ceiling
      enableAutoAttacks: false,
      autoCastSpells: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    // Target must be KO at t = 0.0s
    expect(result.championResults[6].isKo).toBe(true)
    expect(result.championResults[6].currentHp).toBe(0)
    expect(result.terminationReason).toBe('ko')
    expect(result.timeToKill).toBe(0.0)

    // Effective duration should be ~0.1s minimum to calculate true burst DPS (not diluted across 15 seconds!)
    expect(result.duration).toBe(0.1)
    expect(result.blueTeamDps).toBeGreaterThanOrEqual(1000)
  })

  it('terminates cleanly when combo sequence concludes without K.O. (combo_complete)', () => {
    const tankyChamp: Champion = {
      ...garenChamp,
      stats: { ...garenChamp.stats, hp: 20000 },
    }

    const giantTarget: DraftSlot = {
      id: 6,
      side: 'red',
      role: 'Top',
      champion: tankyChamp,
      level: 18,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    // Combo: Darius Q at 0.0s and W at 0.5s
    const result = runCombatSimulation({
      allSlots: [blueDariusSlot, giantTarget],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'c1', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
        { id: 'c2', actorSlotId: 1, action: 'W', targetSlotIds: [6], timestamp: 0.5 },
      ],
      duration: 30.0, // High ceiling
      enableAutoAttacks: false,
      autoCastSpells: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    expect(result.championResults[6].isKo).toBe(false)
    // Hemorrhage lasts 5s from 0.5s => ends at 5.5s
    expect(result.terminationReason).toBe('combo_complete')
    expect(result.timeToKill).toBeNull()
    expect(result.duration).toBeLessThanOrEqual(6.0)
    expect(result.duration).toBeGreaterThanOrEqual(5.0)
    expect(result.blueTeamDps).toBe(Math.round((result.blueTeamTotalDamage / result.duration) * 10) / 10)
  })
})


