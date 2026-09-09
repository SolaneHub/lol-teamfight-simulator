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
      {
        id: '3071',
        name: 'Black Cleaver',
        description: '<attention>+400</attention> Health <attention>+55</attention> Attack Damage',
      },
      null,
      null,
      null,
      null,
      null,
    ],
    primaryPath: null,
    primaryKeystone: {
      id: 8010,
      key: 'Conqueror',
      name: 'Conqueror',
    } as unknown as DraftSlot['primaryKeystone'],
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
      {
        id: '3068',
        name: 'Sunfire Aegis',
        description: '<attention>+500</attention> Health <attention>+50</attention> Armor',
      },
      null,
      null,
      null,
      null,
      null,
    ],
    primaryPath: null,
    primaryKeystone: {
      id: 8010,
      key: 'Conqueror',
      name: 'Conqueror',
    } as unknown as DraftSlot['primaryKeystone'],
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
        {
          id: '3151',
          name: "Liandry's Torment",
          description:
            '<attention>+90</attention> Ability Power <attention>+300</attention> Health',
        },
        {
          id: '2503',
          name: 'Blackfire Torch',
          description: '<attention>+90</attention> Ability Power <attention>+600</attention> Mana',
        },
        null,
        null,
        null,
        null,
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
      actions: [{ id: 'm1', actorSlotId: 2, action: 'Q', targetSlotIds: [7], timestamp: 0.0 }],
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
        {
          id: '3089',
          name: "Rabadon's Deathcap",
          description: '<attention>+140</attention> Ability Power',
        },
        null,
        null,
        null,
        null,
        null,
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

    // 3rd cast: Q (Echo => single unified action with Echo badge and amplified double damage)
    const thirdQEvents = result.events.filter((e) => e.timestamp === 1.0 && e.action === 'Q')
    expect(thirdQEvents.length).toBe(1)
    expect(thirdQEvents[0].action).toBe('Q')
    expect(thirdQEvents[0].badges).toContain('🎶 Echo')
    // The Echo Q must deal MORE than 2x the first Q hit because the second soundwave scales with missing HP execute!
    expect(thirdQEvents[0].amount).toBeGreaterThan(firstQEvents[0].amount * 2)

    // 4th action: AA fires Notes Volley
    const noteEvents = result.events.filter(
      (e) => e.action.includes('Notes') && e.timestamp === 1.5,
    )
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
        null,
        null,
        null,
        null,
        null,
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

    const { getSpellBaseCooldown, getSpellEffectiveCooldown } =
      await import('../services/combat/combatSimulationService')
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
      actions: [{ id: 'act1', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 }],
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
    expect(result.blueTeamDps).toBe(
      Math.round((result.blueTeamTotalDamage / result.duration) * 10) / 10,
    )
  })

  it('automatically triggers champion on-hit passives (Jarvan Martial Cadence & Aatrox Deathbringer) on basic attacks', () => {
    const jarvanChamp: Champion = {
      id: 'JarvanIV',
      key: '59',
      name: 'Jarvan IV',
      stats: { ...dariusChamp.stats, attackdamage: 100 },
      spells: [],
      passive: { name: 'Martial Cadence', description: 'bonus % current hp physical damage' },
      tags: ['Fighter', 'Tank'],
    }

    const jarvanSlot: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Jungle',
      champion: jarvanChamp,
      level: 10,
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

    const targetSlot: DraftSlot = {
      id: 6,
      side: 'red',
      role: 'Top',
      champion: garenChamp,
      level: 10,
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

    const res = runCombatSimulation({
      allSlots: [jarvanSlot, targetSlot],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [{ id: 'aa1', actorSlotId: 1, action: 'AA', targetSlotIds: [6], timestamp: 0.0 }],
      duration: 3.0,
      enableAutoAttacks: false,
      autoCastSpells: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const martialCadenceEvent = res.events.find(
      (e) =>
        e.action.includes('Martial Cadence') ||
        (e.badges && e.badges.some((b) => b.includes('8% Current HP'))),
    )
    expect(martialCadenceEvent).toBeDefined()
    expect(martialCadenceEvent?.amount).toBeGreaterThan(0)
  })

  it('implements Seraphine W (Surround Sound) to heal and grant shield, with hpPct exceeding 100%', () => {
    const seraphineChamp: Champion = {
      id: 'Seraphine',
      key: '147',
      name: 'Seraphine',
      stats: { ...dariusChamp.stats, hp: 1000 },
      spells: [
        { id: 'SeraphineQ', name: 'High Note', description: 'execute', tooltip: '' },
        {
          id: 'SeraphineW',
          name: 'Surround Sound',
          description: 'shield and heal',
          tooltip: '<shield>60</shield><heal>5%</heal>',
        },
        { id: 'SeraphineE', name: 'Beat Drop', description: 'slow', tooltip: '' },
        { id: 'SeraphineR', name: 'Encore', description: 'charm', tooltip: '' },
      ],
      passive: { name: 'Stage Presence', description: 'echo' },
      tags: ['Mage', 'Support'],
    }

    const seraSlot: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'Support',
      champion: seraphineChamp,
      level: 10,
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

    const dummyEnemy: DraftSlot = {
      id: 6,
      side: 'red',
      role: 'Top',
      champion: garenChamp,
      level: 10,
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

    const res = runCombatSimulation({
      allSlots: [seraSlot, dummyEnemy],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [{ id: 'w1', actorSlotId: 1, action: 'W', targetSlotIds: [1], timestamp: 0.0 }],
      duration: 3.0,
      enableAutoAttacks: false,
      autoCastSpells: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const wEventNormal = res.events.find((e) => e.action === 'W')

    expect(wEventNormal).toBeDefined()
    expect(wEventNormal?.shieldAmount).toBeGreaterThan(50)
    // Without echo, W does NOT heal
    expect(wEventNormal?.healAmount).toBeUndefined()
    expect(wEventNormal?.badges).toBeUndefined()

    const seraResult = res.championResults[1]
    expect(seraResult.currentShield).toBeGreaterThan(50)
    // When at full HP and gaining shield, total effective health percentage exceeds 100%!
    expect(seraResult.hpPct).toBeGreaterThan(100)

    // Now verify that 3rd ability cast as W (Echo W) both shields AND heals!
    const resEcho = runCombatSimulation({
      allSlots: [seraSlot, dummyEnemy],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'q1', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
        { id: 'e1', actorSlotId: 1, action: 'E', targetSlotIds: [6], timestamp: 0.5 },
        { id: 'w1', actorSlotId: 1, action: 'W', targetSlotIds: [1], timestamp: 1.0 },
      ],
      duration: 3.0,
      enableAutoAttacks: false,
      autoCastSpells: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const wEventEcho = resEcho.events.find((e) => e.action === 'W')
    expect(wEventEcho).toBeDefined()
    expect(wEventEcho?.shieldAmount).toBeGreaterThan(50)
    expect(wEventEcho?.healAmount).toBeGreaterThan(0)
    expect(wEventEcho?.badges).toEqual(['🎶 Echo'])
  })

  it('correctly applies and amplifies Deathfire Touch keystone burn on ability damage', () => {
    const dftMage: DraftSlot = {
      id: 2,
      side: 'blue',
      role: 'MID',
      champion: {
        id: 'Lux',
        key: '99',
        name: 'Lux',
        stats: {
          hp: 580,
          hpperlevel: 99,
          mp: 480,
          mpperlevel: 23.5,
          movespeed: 330,
          armor: 21,
          armorperlevel: 5.2,
          spellblock: 30,
          spellblockperlevel: 1.3,
          attackrange: 550,
          hpregen: 5.5,
          hpregenperlevel: 0.55,
          mpregen: 8,
          mpregenperlevel: 0.8,
          crit: 0,
          critperlevel: 0,
          attackdamage: 54,
          attackdamageperlevel: 3.3,
          attackspeedperlevel: 2,
          attackspeed: 0.669,
        },
        tags: ['Mage'],
      } as Champion,
      level: 13,
      items: [
        {
          id: '3089',
          name: "Rabadon's Deathcap",
          description: '<attention>+140</attention> Ability Power',
        },
      ],
      primaryKeystone: {
        id: 8992,
        name: 'Deathfire Touch',
        icon: 'perk-images/Styles/Sorcery/DeathfireTouch/DEATHFIRE_TOUCH_KEYSTONE.png',
      },
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const dummyEnemy: DraftSlot = {
      id: 7,
      side: 'red',
      role: 'MID',
      champion: {
        id: 'TargetDummy',
        key: '999',
        name: 'Target Dummy',
        stats: {
          hp: 5000,
          hpperlevel: 0,
          mp: 0,
          mpperlevel: 0,
          movespeed: 0,
          armor: 50,
          armorperlevel: 0,
          spellblock: 50,
          spellblockperlevel: 0,
          attackrange: 100,
          hpregen: 0,
          hpregenperlevel: 0,
          mpregen: 0,
          mpregenperlevel: 0,
          crit: 0,
          critperlevel: 0,
          attackdamage: 0,
          attackdamageperlevel: 0,
          attackspeedperlevel: 0,
          attackspeed: 0.625,
        },
        tags: ['Tank'],
      } as Champion,
      level: 13,
      items: [],
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    // Lux casts single target spell at t=0.0 (duration 4s). After 3s of burn, it should amplify by 75%!
    const res = runCombatSimulation({
      allSlots: [dftMage, dummyEnemy],
      activeBlueSlotIds: [2],
      activeRedSlotIds: [7],
      actions: [{ id: 'q1', actorSlotId: 2, action: 'Q', targetSlotIds: [7], timestamp: 0.0 }],
      duration: 5.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const dftEvents = res.events.filter((e) => e.action.includes('Deathfire Touch'))
    expect(dftEvents.length).toBeGreaterThanOrEqual(6)

    // Check normal burn ticks (< 3s)
    const normalTicks = dftEvents.filter((e) => e.timestamp < 3.0)
    expect(normalTicks.length).toBeGreaterThan(0)

    // Check empowered burn ticks (>= 3s)
    const empoweredTicks = dftEvents.filter((e) => e.badges?.includes('🔥 DFT +75%'))
    expect(empoweredTicks.length).toBeGreaterThan(0)

    // Empowered tick damage should be significantly higher (~1.75x)
    const normalDmg = normalTicks[0]!.amount
    const empDmg = empoweredTicks[0]!.amount
    expect(empDmg).toBeGreaterThan(normalDmg * 1.5)
  })

  it('ensures Blackfire Torch does not re-proc or stack on same user rapid casts (e.g. Q at 0s, E at 0.3s)', () => {
    const mageSlot: DraftSlot = {
      id: 1,
      side: 'blue',
      role: 'MID',
      champion: {
        id: 'Lux',
        key: '99',
        name: 'Lux',
        stats: {
          hp: 580,
          hpperlevel: 99,
          mp: 480,
          mpperlevel: 23.5,
          movespeed: 330,
          armor: 21,
          armorperlevel: 5.2,
          spellblock: 30,
          spellblockperlevel: 1.3,
          attackrange: 550,
          hpregen: 5.5,
          hpregenperlevel: 0.55,
          mpregen: 8,
          mpregenperlevel: 0.8,
          crit: 0,
          critperlevel: 0,
          attackdamage: 54,
          attackdamageperlevel: 3.3,
          attackspeedperlevel: 2,
          attackspeed: 0.669,
        },
        tags: ['Mage'],
      } as Champion,
      level: 11,
      items: [
        {
          id: '2503',
          name: 'Blackfire Torch',
          description: '<attention>+90</attention> Ability Power <attention>+600</attention> Mana',
        },
      ],
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    const dummyEnemy: DraftSlot = {
      id: 6,
      side: 'red',
      role: 'MID',
      champion: {
        id: 'TargetDummy',
        key: '999',
        name: 'Target Dummy',
        stats: {
          hp: 5000,
          hpperlevel: 0,
          mp: 0,
          mpperlevel: 0,
          movespeed: 0,
          armor: 50,
          armorperlevel: 0,
          spellblock: 50,
          spellblockperlevel: 0,
          attackrange: 100,
          hpregen: 0,
          hpregenperlevel: 0,
          mpregen: 0,
          mpregenperlevel: 0,
          crit: 0,
          critperlevel: 0,
          attackdamage: 0,
          attackdamageperlevel: 0,
          attackspeedperlevel: 0,
          attackspeed: 0.625,
        },
        tags: ['Tank'],
      } as Champion,
      level: 11,
      items: [],
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    }

    // Test Case 1: Lux casts Q at 0.0s and E at 0.0s simultaneously -> exactly 6 ticks (no double proc)
    const resSimultaneous = runCombatSimulation({
      allSlots: [mageSlot, dummyEnemy],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'q0', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
        { id: 'e0', actorSlotId: 1, action: 'E', targetSlotIds: [6], timestamp: 0.0 },
      ],
      duration: 4.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const simBlackfireEvents = resSimultaneous.events.filter((ev) =>
      ev.action.includes('Blackfire Torch Burn'),
    )
    const simProcEvents = resSimultaneous.events.filter((ev) =>
      ev.action.includes('Blackfire Torch Burn (Proc)'),
    )
    expect(simProcEvents.length).toBe(1)
    expect(simBlackfireEvents.length).toBe(6)

    // Test Case 2: Lux casts Q at 0.0s and E at 0.5s -> duration is refreshed, extending ticks to 7!
    const resExtended = runCombatSimulation({
      allSlots: [mageSlot, dummyEnemy],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'q1', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
        { id: 'e1', actorSlotId: 1, action: 'E', targetSlotIds: [6], timestamp: 0.5 },
      ],
      duration: 4.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })

    const extBlackfireEvents = resExtended.events.filter((ev) =>
      ev.action.includes('Blackfire Torch Burn'),
    )
    const extProcEvents = resExtended.events.filter((ev) =>
      ev.action.includes('Blackfire Torch Burn (Proc)'),
    )
    // Only 1 initial proc at 0.0s (no double proc at 0.5s)
    expect(extProcEvents.length).toBe(1)
    // Ticks at: 0.0s (proc), 0.5s, 1.0s, 1.5s, 2.0s, 2.5s, 3.0s = 7 ticks!
    expect(extBlackfireEvents.length).toBe(7)

    // Test Case 3: Lux casts Q at 0.0s and E at 0.1s (or 0.4s) -> also refreshes and yields 7 ticks!
    const resRapid01 = runCombatSimulation({
      allSlots: [mageSlot, dummyEnemy],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'q01', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
        { id: 'e01', actorSlotId: 1, action: 'E', targetSlotIds: [6], timestamp: 0.1 },
      ],
      duration: 4.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })
    const rapid01Events = resRapid01.events.filter((ev) =>
      ev.action.includes('Blackfire Torch Burn'),
    )
    expect(rapid01Events.length).toBe(7)

    const resRapid04 = runCombatSimulation({
      allSlots: [mageSlot, dummyEnemy],
      activeBlueSlotIds: [1],
      activeRedSlotIds: [6],
      actions: [
        { id: 'q04', actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
        { id: 'e04', actorSlotId: 1, action: 'E', targetSlotIds: [6], timestamp: 0.4 },
      ],
      duration: 4.0,
      enableAutoAttacks: false,
      attackerBuffs: defaultBuffs,
      defenderBuffs: defaultBuffs,
    })
    const rapid04Events = resRapid04.events.filter((ev) =>
      ev.action.includes('Blackfire Torch Burn'),
    )
    expect(rapid04Events.length).toBe(7)
  })
})
