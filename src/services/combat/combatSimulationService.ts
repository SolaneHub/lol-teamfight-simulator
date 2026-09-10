import type { DraftSlot } from '@/types'
import { calculateStats } from '../draft/draftService'
import { calculateSpellDamage } from '../champions/spellCalculatorService'
import { detectItemPassives } from '../items/itemPassiveService'
import {
  calculateMonsterBuffStats,
  calculateRedBuffBurn,
  calculateElderBurn,
  type SideBuffs,
} from '../monsters/monsterService'

export interface CombatAction {
  id: string
  actorSlotId: number
  action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'
  targetSlotIds: number[]
  timestamp?: number // Scheduled time in seconds (e.g. 0.0, 1.0, etc.)
}

export type DoTType =
  | 'liandrys'
  | 'blackfire'
  | 'malignance'
  | 'deathfire_touch'
  | 'red_buff'
  | 'elder_buff'
  | 'sunfire'
  | 'hollow_radiance'
  | 'darius_bleed'
  | 'brand_blaze'
  | 'teemo_poison'
  | 'cassiopeia_poison'
  | 'twitch_venom'
  | 'malzahar_visions'
  | 'yun_tal'
  | 'zekes'

export interface ActiveDoT {
  id: string
  sourceSlotId: number
  sourceName: string
  sourceSide: 'blue' | 'red'
  type: DoTType
  name: string
  dmgType: 'physical' | 'magic' | 'true'
  remainingDuration: number
  tickInterval: number
  nextTickTime: number
  rawDamagePerTick: number
  stacks: number
  maxStacks: number
  continuousBurnTime?: number
}

export interface CombatLogEvent {
  timestamp: number
  actorSlotId: number
  actorName: string
  actorSide: 'blue' | 'red'
  action: string
  targetSlotId: number
  targetName: string
  targetSide: 'blue' | 'red'
  amount: number
  dmgType: 'physical' | 'magic' | 'true' | 'shield' | 'heal'
  shieldAmount?: number
  healAmount?: number
  isDot: boolean
  remainingHp: number
  remainingShield?: number
  isKo: boolean
  badges?: string[]
}

export interface ChampionCombatResult {
  slotId: number
  championName: string
  side: 'blue' | 'red'
  role: string
  initialHp: number
  currentHp: number
  currentShield: number
  maxHp: number
  hpPct: number
  isKo: boolean
  totalDamageDealt: number
  dps: number
  damageDealtByType: {
    physical: number
    magic: number
    true: number
    dot: number
  }
  damageTaken: number
  activeDoTs: ActiveDoT[]
  effectiveArmor: number
  effectiveMr: number
  blackCleaverStacks: number
  vileDecayStacks: number
  conquerorStacks: number
  lethalTempoStacks: number
}

export interface CombatSimulationInput {
  allSlots: DraftSlot[]
  activeBlueSlotIds: number[]
  activeRedSlotIds: number[]
  actions: CombatAction[]
  duration: number // Combat duration in seconds (e.g. 1 to 20)
  enableAutoAttacks?: boolean
  autoCastSpells?: boolean
  enforceCooldowns?: boolean
  attackerBuffs: SideBuffs
  defenderBuffs: SideBuffs
}

export function getSpellBaseCooldown(slot: DraftSlot, spellKey: 'Q' | 'W' | 'E' | 'R'): number {
  if (!slot || !slot.champion || !slot.champion.spells) {
    const defaults = { Q: 8, W: 10, E: 12, R: 90 }
    return defaults[spellKey]
  }
  const spellIndex = { Q: 0, W: 1, E: 2, R: 3 }[spellKey]
  const spell = slot.champion.spells[spellIndex]
  if (!spell || !spell.cooldown || !Array.isArray(spell.cooldown) || spell.cooldown.length === 0) {
    const defaults = { Q: 8, W: 10, E: 12, R: 90 }
    return defaults[spellKey]
  }
  const rankKey = spellKey.toLowerCase() as 'q' | 'w' | 'e' | 'r'
  const rank = slot.spellRanks?.[rankKey] ?? (spellKey === 'R' ? 3 : 5)
  const clampedRank = Math.max(1, Math.min(spell.cooldown.length, rank))
  return spell.cooldown[clampedRank - 1] ?? spell.cooldown[0] ?? 8
}

export function getSpellEffectiveCooldown(
  slot: DraftSlot,
  spellKey: 'Q' | 'W' | 'E' | 'R',
  abilityHaste: number = 0,
): number {
  const baseCd = getSpellBaseCooldown(slot, spellKey)
  const multiplier = 100 / (100 + Math.max(0, abilityHaste))
  return Math.max(0.5, Math.round(baseCd * multiplier * 10) / 10)
}

export interface CombatSimulationResult {
  duration: number
  timeToKill?: number | null
  terminationReason?: 'ko' | 'combo_complete' | 'timeout'
  blueTeamTotalDamage: number
  blueTeamDps: number
  redTeamTotalDamage: number
  redTeamDps: number
  championResults: Record<number, ChampionCombatResult>
  events: CombatLogEvent[]
}

interface InternalParticipantState {
  slot: DraftSlot
  side: 'blue' | 'red'
  slotId: number
  championName: string
  level: number
  role: string
  maxHp: number
  currentHp: number
  currentShield: number
  baseArmor: number
  baseMr: number
  blackCleaverStacks: number
  vileDecayStacks: number
  malignanceShredDuration: number
  conquerorStacks: number
  lethalTempoStacks: number
  hobAttacksLeft: number
  ptaStates: Record<number, { stacks: number; exposed: boolean }>
  electrocuteStates: Record<number, { hits: number; procced: boolean }>
  darkHarvestProcced: Record<number, boolean>
  activeDoTs: ActiveDoT[]
  nextAutoAttackTime: number
  nextSunfireTickTime: number
  sunfireRamp: number
  totalDamageDealt: number
  damageDealtByType: {
    physical: number
    magic: number
    true: number
    dot: number
  }
  damageTaken: number
  isKo: boolean
  aatroxQSeq: number
  aatroxPassiveCooldown: number
  jarvanPassiveCooldowns: Record<number, number>
  seraphineCastCounter: number
  seraphineNotes: number
  castCounter: number
  noxianMight: boolean
  spellCooldowns: Record<'Q' | 'W' | 'E' | 'R', number>
  lastSpellCastTime: number
  lifelineTriggered?: boolean
  bansheesActive?: boolean
  edgeOfNightActive?: boolean
  celestialOppositionActive?: boolean
  celestialOppositionEndTime?: number
  forceOfNatureStacks?: number
  hullbreakerHitCount?: Record<number, number>
  hexplateBuffEndTime?: number
  deathsDanceBleedPool?: number
  deadMansDischarged?: boolean
  stormrazorDischarged?: boolean
  alternatorDischarged?: boolean
  stridebreakerUsed?: boolean
  redemptionUsed?: boolean
  mikaelsUsed?: boolean
  grievousWoundsDuration?: number
  baseHp: number
  baseBonusArmor: number
  sunderedSkyCooldowns: Record<number, number>
  eclipseHitCount: Record<number, { count: number; windowEndTime: number; cooldownEndTime: number }>
  bloodsongActiveTargets: Record<number, number>
  bloodsongReady: boolean
  heartsteelReady: Record<number, boolean>
  nextUnendingDespairTime: number
  guardianAngelUsed: boolean
}

/**
 * Executes a full time-stepped combat exchange simulation supporting:
 * - Configurable duration (seconds) and dynamic Damage Per Second (DPS)
 * - Tick-by-tick continuous DoT / Burn propagation (Liandry, Blackfire, Malignance, Red/Elder, Sunfire, Passives)
 * - Dynamic two-way trading between Blue Team and Red Team champions
 */
export function runCombatSimulation(input: CombatSimulationInput): CombatSimulationResult {
  const {
    allSlots,
    activeBlueSlotIds,
    activeRedSlotIds,
    actions,
    duration = 5,
    enableAutoAttacks = false,
    autoCastSpells = false,
    enforceCooldowns = false,
    attackerBuffs = {
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
    },
    defenderBuffs = {
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
    },
  } = input

  const clampedDuration = Math.max(0.5, Math.min(600, duration))
  const timeStep = 0.1 // 100ms discrete time ticks

  let timeToKill: number | null = null
  let terminationReason: 'ko' | 'combo_complete' | 'timeout' = 'timeout'
  let lastDamageTime = 0.0
  let lastActionTime = 0.0
  let combatEndTime = clampedDuration

  // 1. Initialize participant combat states for both teams
  const participants: Record<number, InternalParticipantState> = {}

  const activeIds = [...activeBlueSlotIds, ...activeRedSlotIds]
  activeIds.forEach((slotId) => {
    const slot = allSlots.find((s) => s.id === slotId)
    if (!slot || !slot.champion) return

    const side = slot.side as 'blue' | 'red'
    const buffs = side === 'blue' ? attackerBuffs : defenderBuffs
    const mStats = calculateMonsterBuffStats(buffs)
    const baseStats = calculateStats(slot)

    const hp = Math.max(1, (baseStats?.hp?.total || 1000) + mStats.bonusShield)
    const armor = Math.round((baseStats?.armor?.total || 50) * mStats.armorMultiplier)
    const mr = Math.round((baseStats?.mr?.total || 40) * mStats.mrMultiplier)

    const keystoneName = (slot.primaryKeystone?.name || '').toLowerCase()
    const hasHob = keystoneName.includes('hail of blades') || keystoneName.includes('hailofblades')

    const initialPassives = detectItemPassives(slot.items)
    let initialShield = 0
    if (initialPassives.hasKaenicRookern) {
      initialShield += Math.round(hp * 0.18)
    }
    if (initialPassives.hasLocket) {
      initialShield += Math.round(200 + ((slot.level || 1) - 1) * (160 / 17))
    }

    participants[slotId] = {
      slot,
      side,
      slotId,
      championName: slot.champion.name,
      level: slot.level || 1,
      role: slot.role,
      maxHp: hp,
      currentHp: hp,
      currentShield: initialShield,
      baseArmor: armor,
      baseMr: mr,
      blackCleaverStacks: 0,
      vileDecayStacks: 0,
      malignanceShredDuration: 0,
      conquerorStacks: 0,
      lethalTempoStacks: 0,
      hobAttacksLeft: hasHob ? 3 : 0,
      ptaStates: {},
      electrocuteStates: {},
      darkHarvestProcced: {},
      activeDoTs: [],
      nextAutoAttackTime: 0.0, // Ready to attack at t=0
      nextSunfireTickTime: 1.0,
      sunfireRamp: 0,
      totalDamageDealt: 0,
      damageDealtByType: {
        physical: 0,
        magic: 0,
        true: 0,
        dot: 0,
      },
      damageTaken: 0,
      isKo: false,
      aatroxQSeq: 1,
      aatroxPassiveCooldown: 0.0,
      jarvanPassiveCooldowns: {},
      seraphineCastCounter: 0,
      seraphineNotes: 0,
      castCounter: 0,
      noxianMight: false,
      spellCooldowns: { Q: 0.0, W: 0.0, E: 0.0, R: 0.0 },
      lastSpellCastTime: -1.0,
      lifelineTriggered: false,
      bansheesActive: (slot.items || []).some(
        (i) => i && (i.name.toLowerCase().includes('banshee') || i.id === '3102'),
      ),
      edgeOfNightActive: initialPassives.hasEdgeOfNight,
      celestialOppositionActive: false,
      celestialOppositionEndTime: 0,
      forceOfNatureStacks: 0,
      hullbreakerHitCount: {},
      hexplateBuffEndTime: 0,
      deathsDanceBleedPool: 0,
      deadMansDischarged: false,
      stormrazorDischarged: false,
      alternatorDischarged: false,
      stridebreakerUsed: false,
      redemptionUsed: false,
      mikaelsUsed: false,
      grievousWoundsDuration: 0,
      baseHp: baseStats?.hp?.base || 600,
      baseBonusArmor: Math.max(0, armor - (slot.champion?.stats?.armor || 30)),
      sunderedSkyCooldowns: {},
      eclipseHitCount: {},
      bloodsongActiveTargets: {},
      bloodsongReady: false,
      heartsteelReady: {},
      nextUnendingDespairTime: 5.0,
      guardianAngelUsed: false,
    }
  })

  const events: CombatLogEvent[] = []

  // Helper: Get alive opposing targets for a participant
  const getOpposingAliveTargets = (attackerSlotId: number): InternalParticipantState[] => {
    const actor = participants[attackerSlotId]
    if (!actor) return []
    const oppSide = actor.side === 'blue' ? 'red' : 'blue'
    return Object.values(participants).filter((p) => p.side === oppSide && !p.isKo)
  }

  // Helper: Get live calculated stats for a participant
  const getLiveStats = (part: InternalParticipantState) => {
    const keystoneName = (part.slot.primaryKeystone?.name || '').toLowerCase()
    const isHobActive =
      (keystoneName.includes('hail of blades') || keystoneName.includes('hailofblades')) &&
      part.hobAttacksLeft > 0

    const dynamicStats = calculateStats({
      ...part.slot,
      conquerorStacks: part.conquerorStacks,
      lethalTempoStacks: part.lethalTempoStacks,
      hailOfBladesActive: isHobActive,
    })

    const buffs = part.side === 'blue' ? attackerBuffs : defenderBuffs
    const mStats = calculateMonsterBuffStats(buffs)

    const baseAd = Math.round((dynamicStats?.ad?.base || 70) * mStats.adMultiplier)
    const extraNoxianAd = part.noxianMight ? 30 + (part.level - 1) * (200 / 17) : 0
    const totalAd = Math.round(
      ((dynamicStats?.ad?.total || 70) + mStats.bonusAD + extraNoxianAd) * mStats.adMultiplier,
    )

    // Check Blackfire Torch active bonus AP (4% AP per burning enemy)
    const activeItems = detectItemPassives(part.slot.items)
    const oppTargets = getOpposingAliveTargets(part.slotId)
    let extraApPct = 0
    if (activeItems.hasBlackfireTorch) {
      const burningCount = oppTargets.filter((t) =>
        t.activeDoTs.some((d) => d.type === 'blackfire' && d.sourceSlotId === part.slotId),
      ).length
      extraApPct = Math.min(0.2, burningCount * 0.04)
    }

    const rawAp = (dynamicStats?.ap?.bonus || 0) + mStats.bonusAP
    const existingApMultiplier =
      (dynamicStats?.ap?.total || 0) > 0 && (dynamicStats?.ap?.bonus || 0) > 0
        ? dynamicStats!.ap.total / dynamicStats!.ap.bonus
        : 1.0
    // Blackfire multiplier stacks additively with other sources of % AP (Rabadon, Infernal Might)
    const totalApMultiplier = existingApMultiplier + (mStats.apMultiplier - 1) + extraApPct
    const totalAp = Math.round(rawAp * totalApMultiplier)

    // Frozen Heart aura reduces enemy AS by 20%
    const enemyHasFrozenHeart = oppTargets.some((t) => {
      const p = detectItemPassives(t.slot.items)
      return p.hasFrozenHeart
    })
    const asMult = enemyHasFrozenHeart ? 0.8 : 1.0
    const attackSpeed = Math.max(0.2, Math.min(3.5, (dynamicStats?.as?.total || 0.65) * asMult))

    return {
      ad: totalAd,
      baseAd,
      ap: totalAp,
      as: attackSpeed,
      hp: part.currentHp,
      maxHp: part.maxHp,
      crit: dynamicStats?.crit?.total || 0,
      lethality: dynamicStats?.lethality?.total || 0,
      armorPen: dynamicStats?.armorPen?.total || 0,
      magicPenFlat: dynamicStats?.magicPenFlat?.total || 0,
      magicPenPercent: dynamicStats?.magicPenPercent?.total || 0,
      mana: dynamicStats?.mp?.total || 600,
      bonusHp: dynamicStats?.hp?.bonus || 0,
      abilityHaste: Math.round((dynamicStats?.abilityHaste?.total || 0) + mStats.bonusAH),
      healShieldPower: dynamicStats?.healShieldPower?.total || 0,
      itemPassives: activeItems,
    }
  }

  // Helper: Apply direct damage and register to state (Shield absorbs damage first)
  const applyDamageToTarget = (
    actor: InternalParticipantState,
    target: InternalParticipantState,
    amount: number,
    dmgType: 'physical' | 'magic' | 'true',
    actionName: string,
    currentTime: number,
    isDot = false,
    badges: string[] = [],
  ) => {
    if (target.isKo || amount <= 0) return

    let effectiveDamage = amount
    let isBlocked = false

    const actorPassives = detectItemPassives(actor.slot.items)
    const targetPassives = detectItemPassives(target.slot.items)
    const isActorMelee = (actor.slot.champion?.stats?.attackrange || 125) <= 225

    // Serpent's Fang: cuts target shield before absorption
    if (actorPassives.hasSerpentsFang && target.currentShield > 0) {
      const shieldCutPct = isActorMelee ? 0.5 : 0.35
      const shieldCut = Math.round(target.currentShield * shieldCutPct)
      target.currentShield = Math.max(0, target.currentShield - shieldCut)
      badges.push(`Serpent's Fang (-${shieldCut})`)
    }

    // Banshee's Veil spell shield blocks first hostile magic spell
    if (target.bansheesActive && dmgType === 'magic' && !isDot) {
      target.bansheesActive = false
      badges.push('🛡️ Banshee Blocked')
      effectiveDamage = 0
      isBlocked = true
    }

    // Edge of Night spell shield blocks first hostile ability
    const isHostileAbility =
      actionName !== 'AA' &&
      !actionName.includes('Burn') &&
      !actionName.includes('Reflect') &&
      !actionName.includes('Immolate') &&
      !isDot
    if (target.edgeOfNightActive && isHostileAbility) {
      target.edgeOfNightActive = false
      badges.push('Edge of Night Blocked')
      effectiveDamage = 0
      isBlocked = true
    }

    // Celestial Opposition Exalted damage reduction
    if (targetPassives.hasCelestialOpposition && !isBlocked) {
      if (
        !target.celestialOppositionActive &&
        (!target.celestialOppositionEndTime || currentTime >= target.celestialOppositionEndTime)
      ) {
        target.celestialOppositionActive = true
        target.celestialOppositionEndTime = currentTime + 2.5
        badges.push('Celestial Exalted (-35%)')
      }
      if (
        target.celestialOppositionActive &&
        currentTime <= (target.celestialOppositionEndTime ?? 0)
      ) {
        const redPct = isActorMelee ? 0.35 : 0.25
        effectiveDamage = Math.round(effectiveDamage * (1 - redPct))
      }
    }

    // Warden's Mail / Rock Solid flat damage reduction on basic attacks
    if (targetPassives.hasWardensMail && actionName === 'AA' && effectiveDamage > 0) {
      const flatReduction = Math.min(effectiveDamage * 0.2, (target.maxHp / 1000) * 5)
      effectiveDamage = Math.max(1, Math.round(effectiveDamage - flatReduction))
    }

    // Force of Nature Steadfast (builds MR stacks upon taking magic damage)
    if (targetPassives.hasForceOfNature && dmgType === 'magic' && !isBlocked) {
      target.forceOfNatureStacks = Math.min(8, (target.forceOfNatureStacks || 0) + 1)
      if (target.forceOfNatureStacks === 8) {
        badges.push('Force of Nature (+70 MR)')
      }
    }

    // Knight's Vow damage redirection (12% redirected to partner)
    const alliesWithVow = Object.values(participants).filter(
      (p) =>
        p.side === target.side &&
        p.slotId !== target.slotId &&
        !p.isKo &&
        detectItemPassives(p.slot.items).hasKnightsVow,
    )
    if (alliesWithVow.length > 0 && effectiveDamage > 0) {
      const redirected = Math.round(effectiveDamage * 0.12)
      effectiveDamage -= redirected
      const partner = alliesWithVow[0]
      if (partner) {
        partner.currentHp = Math.max(1, partner.currentHp - redirected)
        partner.damageTaken += redirected
        badges.push(`Knight's Vow (-${redirected})`)
      }
    }

    // Death's Dance Ignore Pain (stores 30% melee / 10% ranged damage as true bleed)
    if (
      targetPassives.hasDeathsDance &&
      (dmgType === 'physical' || dmgType === 'magic') &&
      effectiveDamage > 0
    ) {
      const isTargetMelee = (target.slot.champion?.stats?.attackrange || 125) <= 225
      const storePct = isTargetMelee ? 0.3 : 0.1
      const storedDamage = Math.round(effectiveDamage * storePct)
      effectiveDamage -= storedDamage
      target.deathsDanceBleedPool = (target.deathsDanceBleedPool || 0) + storedDamage
      badges.push(`Ignore Pain (-${storedDamage})`)
    }

    if (target.currentShield > 0 && effectiveDamage > 0) {
      if (effectiveDamage <= target.currentShield) {
        target.currentShield -= effectiveDamage
        badges.push(`🛡️ Absorbed (${effectiveDamage})`)
        effectiveDamage = 0
      } else {
        const absorbed = target.currentShield
        effectiveDamage -= target.currentShield
        target.currentShield = 0
        badges.push(`🛡️ Shield Broken (-${absorbed})`)
      }
    }

    // Proactive Lifeline: Triggers when incoming damage would reduce health below 30% max HP
    const hasLifelineItem =
      targetPassives.hasSeraphs ||
      targetPassives.hasSteraksGage ||
      targetPassives.hasMawOfMalmortius ||
      targetPassives.hasImmortalShieldbow ||
      targetPassives.hasHexdrinker

    if (
      !target.lifelineTriggered &&
      hasLifelineItem &&
      effectiveDamage > 0 &&
      target.currentHp - effectiveDamage < target.maxHp * 0.3
    ) {
      target.lifelineTriggered = true
      const shieldMult = targetPassives.hasSpiritVisage ? 1.25 : 1.0
      let lifelineShield = 0
      let lifelineBadge = ''

      if (targetPassives.hasSeraphs) {
        lifelineShield = Math.round(
          (250 + (target.slot.champion?.stats?.mp || 1000) * 0.2) * shieldMult,
        )
        lifelineBadge = `Lifeline (+${lifelineShield})`
      } else if (targetPassives.hasSteraksGage) {
        const bonusHp = Math.max(0, target.maxHp - (target.slot.champion?.stats?.hp || 600))
        lifelineShield = Math.round(bonusHp * 0.8 * shieldMult)
        lifelineBadge = `Sterak's Shield (+${lifelineShield})`
      } else if (targetPassives.hasMawOfMalmortius) {
        const tStats = getLiveStats(target)
        const bonusAd = Math.max(0, tStats.ad - tStats.baseAd)
        lifelineShield = Math.round((200 + bonusAd * 2.25) * shieldMult)
        lifelineBadge = `Maw Shield (+${lifelineShield})`
      } else if (targetPassives.hasImmortalShieldbow) {
        lifelineShield = Math.round((320 + (target.level - 1) * (210 / 17)) * shieldMult)
        lifelineBadge = `Shieldbow (+${lifelineShield})`
      } else if (targetPassives.hasHexdrinker) {
        lifelineShield = Math.round((110 + ((target.level || 1) - 1) * (170 / 17)) * shieldMult)
        lifelineBadge = `Hexdrinker (+${lifelineShield})`
      }

      if (lifelineShield > 0) {
        target.currentShield += lifelineShield
        badges.push(lifelineBadge)

        if (effectiveDamage <= target.currentShield) {
          target.currentShield -= effectiveDamage
          badges.push(`Absorbed (${effectiveDamage})`)
          effectiveDamage = 0
        } else {
          const absorbed = target.currentShield
          effectiveDamage -= target.currentShield
          target.currentShield = 0
          badges.push(`Shield Broken (-${absorbed})`)
        }
      }
    }

    target.currentHp = Math.max(0, target.currentHp - effectiveDamage)
    const dealtDmg = isBlocked ? 0 : amount
    target.damageTaken += dealtDmg

    actor.totalDamageDealt += dealtDmg
    actor.damageDealtByType[dmgType] += dealtDmg
    if (isDot) {
      actor.damageDealtByType.dot += dealtDmg
    }

    lastDamageTime = Math.max(lastDamageTime, Math.round(currentTime * 10) / 10)

    // Grievous Wounds application (Morello on magic, Mortal Reminder / Chempunk on physical)
    if (
      (actorPassives.hasMorellonomicon && dmgType === 'magic') ||
      ((actorPassives.hasMortalReminder || actorPassives.hasChempunkChainsword) &&
        dmgType === 'physical')
    ) {
      target.grievousWoundsDuration = 3.0
      badges.push('🩸 Grievous Wounds')
    }

    if (target.currentHp === 0) {
      if (targetPassives.hasGuardianAngel && !target.guardianAngelUsed) {
        target.guardianAngelUsed = true
        target.currentHp = Math.round(target.baseHp * 0.5)
        target.isKo = false
        badges.push('Guardian Angel')
      } else {
        target.isKo = true
        if (actorPassives.hasCryptbloom) {
          const actorLive = getLiveStats(actor)
          const novaHeal = Math.round(50 + actorLive.ap * 0.5)
          const allies = Object.values(participants).filter((p) => p.side === actor.side && !p.isKo)
          allies.forEach((ally) => {
            const healMult =
              ally.grievousWoundsDuration && ally.grievousWoundsDuration > 0 ? 0.6 : 1.0
            ally.currentHp = Math.min(ally.maxHp, ally.currentHp + Math.round(novaHeal * healMult))
          })
          badges.push('Cryptbloom Nova')
        }
        if (actorPassives.hasDeathsDance) {
          actor.deathsDanceBleedPool = 0
          const aLive = getLiveStats(actor)
          const bonusAd = Math.max(0, aLive.ad - aLive.baseAd)
          const defyHeal = Math.round(bonusAd * 1.2)
          actor.currentHp = Math.min(actor.maxHp, actor.currentHp + defyHeal)
          badges.push(`DD Defy (+${defyHeal})`)
        }
        if (actorPassives.hasAxiomArc) {
          actor.spellCooldowns.R = 0
          badges.push('Axiom Arc (R Reset)')
        }
      }
    } else if (target.currentHp / target.maxHp < 0.3 && !target.lifelineTriggered) {
      const shieldMult = targetPassives.hasSpiritVisage ? 1.25 : 1.0
      if (targetPassives.hasSeraphs) {
        target.lifelineTriggered = true
        const lifelineShield = Math.round(
          (250 + (target.slot.champion?.stats?.mp || 1000) * 0.2) * shieldMult,
        )
        target.currentShield += lifelineShield
        badges.push(`Lifeline (+${lifelineShield})`)
      } else if (targetPassives.hasSteraksGage) {
        target.lifelineTriggered = true
        const bonusHp = Math.max(0, target.maxHp - (target.slot.champion?.stats?.hp || 600))
        const lifelineShield = Math.round(bonusHp * 0.8 * shieldMult)
        target.currentShield += lifelineShield
        badges.push(`Sterak's Shield (+${lifelineShield})`)
      } else if (targetPassives.hasMawOfMalmortius) {
        target.lifelineTriggered = true
        const tStats = getLiveStats(target)
        const bonusAd = Math.max(0, tStats.ad - tStats.baseAd)
        const lifelineShield = Math.round((200 + bonusAd * 2.25) * shieldMult)
        target.currentShield += lifelineShield
        badges.push(`Maw Shield (+${lifelineShield})`)
      } else if (targetPassives.hasImmortalShieldbow) {
        target.lifelineTriggered = true
        const lifelineShield = Math.round((320 + (target.level - 1) * (210 / 17)) * shieldMult)
        target.currentShield += lifelineShield
        badges.push(`Shieldbow (+${lifelineShield})`)
      }
    }

    events.push({
      timestamp: Math.round(currentTime * 10) / 10,
      actorSlotId: actor.slotId,
      actorName: actor.championName,
      actorSide: actor.side,
      action: actionName,
      targetSlotId: target.slotId,
      targetName: target.championName,
      targetSide: target.side,
      amount: isBlocked ? 0 : amount,
      dmgType,
      isDot,
      remainingHp: target.currentHp,
      remainingShield: target.currentShield,
      isKo: target.isKo,
      badges: badges.length > 0 ? badges : undefined,
    })

    // The Collector execute threshold (< 5% max HP or lethal blow)
    if (actorPassives.hasTheCollector && !target.guardianAngelUsed) {
      if (!target.isKo && target.currentHp > 0 && target.currentHp / target.maxHp < 0.05) {
        const execDmg = target.currentHp
        target.currentHp = 0
        target.currentShield = 0
        target.isKo = true
        actor.totalDamageDealt += execDmg
        actor.damageDealtByType.true += execDmg
        target.damageTaken += execDmg

        events.push({
          timestamp: Math.round(currentTime * 10) / 10,
          actorSlotId: actor.slotId,
          actorName: actor.championName,
          actorSide: actor.side,
          action: '💀 The Collector EXECUTE',
          targetSlotId: target.slotId,
          targetName: target.championName,
          targetSide: target.side,
          amount: execDmg,
          dmgType: 'true',
          isDot: false,
          remainingHp: 0,
          remainingShield: 0,
          isKo: true,
          badges: ['5% HP Execute'],
        })
      } else if (
        target.isKo &&
        target.currentHp === 0 &&
        !events.some(
          (e) => e.targetSlotId === target.slotId && e.action.includes('The Collector EXECUTE'),
        )
      ) {
        events.push({
          timestamp: Math.round(currentTime * 10) / 10,
          actorSlotId: actor.slotId,
          actorName: actor.championName,
          actorSide: actor.side,
          action: '💀 The Collector EXECUTE',
          targetSlotId: target.slotId,
          targetName: target.championName,
          targetSide: target.side,
          amount: 9999,
          dmgType: 'true',
          isDot: false,
          remainingHp: 0,
          remainingShield: 0,
          isKo: true,
          badges: ['5% HP Execute'],
        })
      }
    }

    // Thornmail / Bramble Vest reflect on basic attacks (AA)
    if (
      actionName === 'AA' &&
      (targetPassives.hasThornmail || targetPassives.hasBrambleVest) &&
      !actor.isKo &&
      !isDot
    ) {
      const thornBase = targetPassives.hasThornmail ? 15 : 6
      const thornRatio = targetPassives.hasThornmail ? 0.25 : 0.1
      const thornRaw = thornBase + target.baseBonusArmor * thornRatio
      const actorEffMr = Math.max(0, actor.baseMr - (getLiveStats(actor).magicPenFlat || 0))
      const actorMagicMult = 100 / (100 + actorEffMr)
      const thornDmg = Math.max(1, Math.round(thornRaw * actorMagicMult))
      actor.currentHp = Math.max(0, actor.currentHp - thornDmg)
      actor.damageTaken += thornDmg
      target.totalDamageDealt += thornDmg
      target.damageDealtByType.magic += thornDmg
      actor.grievousWoundsDuration = 3.0
      if (actor.currentHp === 0) actor.isKo = true
      events.push({
        timestamp: Math.round(currentTime * 10) / 10,
        actorSlotId: target.slotId,
        actorName: target.championName,
        actorSide: target.side,
        action: '🌵 Thornmail Reflect',
        targetSlotId: actor.slotId,
        targetName: actor.championName,
        targetSide: actor.side,
        amount: thornDmg,
        dmgType: 'magic',
        isDot: false,
        remainingHp: actor.currentHp,
        remainingShield: actor.currentShield,
        isKo: actor.isKo,
        badges: ['Thornmail Reflect', '🩸 Grievous Wounds'],
      })
    }

    // Elder Dragon execute threshold check: target below 20% max HP
    const buffs = actor.side === 'blue' ? attackerBuffs : defenderBuffs
    if (
      buffs?.elder &&
      !target.isKo &&
      target.currentHp > 0 &&
      target.currentHp / target.maxHp < 0.2
    ) {
      const executeDmg = target.currentHp
      target.currentHp = 0
      target.currentShield = 0
      target.isKo = true
      actor.totalDamageDealt += executeDmg
      actor.damageDealtByType.true += executeDmg
      target.damageTaken += executeDmg

      events.push({
        timestamp: Math.round(currentTime * 10) / 10,
        actorSlotId: actor.slotId,
        actorName: actor.championName,
        actorSide: actor.side,
        action: '🐉 Elder Dragon EXECUTE',
        targetSlotId: target.slotId,
        targetName: target.championName,
        targetSide: target.side,
        amount: executeDmg,
        dmgType: 'true',
        isDot: false,
        remainingHp: 0,
        remainingShield: 0,
        isKo: true,
        badges: ['20% HP Execute'],
      })
    }
  }

  // Helper: Apply or refresh DoT on a target
  const applyOrRefreshDoT = (
    actor: InternalParticipantState,
    target: InternalParticipantState,
    dotType: DoTType,
    name: string,
    dmgType: 'physical' | 'magic' | 'true',
    duration: number,
    tickInterval: number,
    rawDamagePerTick: number,
    currentTime: number,
    maxStacks = 1,
  ) => {
    if (target.isKo) return

    const existing = target.activeDoTs.find(
      (d) => d.type === dotType && d.sourceSlotId === actor.slotId,
    )

    if (existing) {
      existing.remainingDuration = Math.max(existing.remainingDuration, duration)
      existing.rawDamagePerTick = rawDamagePerTick
      if (existing.stacks < maxStacks) {
        existing.stacks++
      }
    } else {
      target.activeDoTs.push({
        id: `${dotType}_${actor.slotId}_${target.slotId}_${currentTime}`,
        sourceSlotId: actor.slotId,
        sourceName: actor.championName,
        sourceSide: actor.side,
        type: dotType,
        name,
        dmgType,
        remainingDuration: duration,
        tickInterval,
        nextTickTime: currentTime + tickInterval,
        rawDamagePerTick,
        stacks: 1,
        maxStacks,
        continuousBurnTime: 0,
      })
    }
  }

  // Helper: Execute a specific champion action (Spell or AA)
  const executeChampionAction = (
    actor: InternalParticipantState,
    action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA',
    targetSlotIds: number[],
    currentTime: number,
  ) => {
    if (actor.isKo) return

    const actorStats = getLiveStats(actor)
    const isAbility = ['Q', 'W', 'E', 'R', 'P'].includes(action)
    const isMelee = (actor.slot.champion?.stats?.attackrange || 125) <= 225

    // Track spell cooldown & cast time
    if (['Q', 'W', 'E', 'R'].includes(action)) {
      const spKey = action as 'Q' | 'W' | 'E' | 'R'
      const effCd = getSpellEffectiveCooldown(actor.slot, spKey, actorStats.abilityHaste)
      actor.spellCooldowns[spKey] = currentTime + effCd
      actor.lastSpellCastTime = currentTime
      actor.nextAutoAttackTime = Math.max(actor.nextAutoAttackTime, currentTime + 0.25)
    }

    // Update rune stacks for actor
    const keystoneName = (actor.slot.primaryKeystone?.name || '').toLowerCase()
    const hasConqueror = keystoneName.includes('conqueror')
    const hasLethalTempo = keystoneName.includes('lethal tempo')
    const hasPtA = keystoneName.includes('press the attack')
    const hasElectrocute = keystoneName.includes('electrocute')
    const hasDarkHarvest =
      keystoneName.includes('dark harvest') || keystoneName.includes('darkharvest')
    const hasDeathfireTouch =
      actor.slot.primaryKeystone?.id === 8992 ||
      keystoneName.includes('deathfire touch') ||
      keystoneName.includes('deathfiretouch') ||
      [
        actor.slot.primaryKeystone,
        actor.slot.primaryRune1,
        actor.slot.primaryRune2,
        actor.slot.primaryRune3,
        actor.slot.secondaryRune1,
        actor.slot.secondaryRune2,
        ...(actor.slot.runes || []),
      ].some((r) => {
        const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
        return r?.id === 8992 || str.includes('deathfire touch') || str.includes('deathfiretouch')
      })

    if (hasConqueror) {
      actor.conquerorStacks = Math.min(12, actor.conquerorStacks + (isMelee ? 2 : 1))
    }
    if (hasLethalTempo && action === 'AA') {
      actor.lethalTempoStacks = Math.min(6, actor.lethalTempoStacks + 1)
    }
    if (actor.hobAttacksLeft > 0 && action === 'AA') {
      actor.hobAttacksLeft--
    }

    // Aatrox sequence tracking & passive cooldown reduction on abilities
    let aatroxQSeq = 1
    if (actor.slot.champion?.id === 'Aatrox') {
      if (action === 'Q') {
        aatroxQSeq = actor.aatroxQSeq || 1
        actor.aatroxQSeq = (aatroxQSeq % 3) + 1
      }
      if (['Q', 'W', 'E', 'R'].includes(action)) {
        actor.aatroxPassiveCooldown = Math.max(0, (actor.aatroxPassiveCooldown || 0) - 2.0)
      }
    }

    // Seraphine Stage Presence (Every 3rd basic ability Q/W/E echoes and casts twice)
    const isSeraphine = actor.slot.champion?.id === 'Seraphine'
    let isEchoCast = false
    if (isSeraphine && ['Q', 'W', 'E'].includes(action)) {
      actor.seraphineCastCounter = (actor.seraphineCastCounter || 0) + 1
      if (actor.seraphineCastCounter % 3 === 0) {
        isEchoCast = true
      }
    }

    // Seraphine Harmony Notes generation on ability cast (Q, W, E, R)
    if (isSeraphine && ['Q', 'W', 'E', 'R'].includes(action)) {
      const sameSideAlive = Object.values(participants).filter(
        (p) => p.side === actor.side && !p.isKo,
      )
      const alliesCount = Math.max(1, sameSideAlive.length)
      actor.seraphineNotes = Math.min(
        20,
        (actor.seraphineNotes || 0) + alliesCount * (isEchoCast ? 2 : 1),
      )
    }

    // Seraphine W (Surround Sound): Team Shield + Missing HP Team Heal (single unified cast event)
    if (isSeraphine && action === 'W') {
      const allyTargets = Object.values(participants).filter(
        (p) => p.side === actor.side && !p.isKo,
      )
      const wRank =
        actor.slot.spellRanks?.w ||
        (actor.level >= 13 ? 5 : Math.max(1, Math.min(5, Math.ceil(actor.level / 3))))
      const healShieldMult = 1 + (actorStats.healShieldPower || 0) / 100
      const echoMult = isEchoCast ? 1.5 : 1.0

      // Shield: 60/80/100/120/140 + 20% AP
      const baseShield = (60 + (wRank - 1) * 20 + 0.2 * actorStats.ap) * healShieldMult
      const finalShield = Math.round(baseShield * echoMult)

      // Heal: 3%-5% (+0.4% per 100 AP) missing HP per ally + base 40-100 (+25% AP)
      const missingHpRate = 0.03 + (wRank - 1) * 0.005 + (actorStats.ap / 100) * 0.004

      // In LoL, Surround Sound heals if Seraphine already has a shield (e.g. pre-shielded by ally/item) or casts with Echo
      const hasPreExistingShield = (actor.currentShield || 0) > 0
      const shouldHeal = isEchoCast || hasPreExistingShield

      allyTargets.forEach((ally) => {
        // 1. Grant Shield
        ally.currentShield += finalShield

        // 2. Grant Heal if cast with Echo or if Seraphine already had a shield
        let finalHeal = 0
        if (shouldHeal) {
          const missingHp = Math.max(0, ally.maxHp - ally.currentHp)
          const allyCount = Math.min(5, allyTargets.length)
          const missingHeal = missingHp * missingHpRate * allyCount
          const baseHeal = 40 + (wRank - 1) * 15 + 0.25 * actorStats.ap
          finalHeal = Math.round(Math.max(baseHeal, missingHeal) * healShieldMult * echoMult)
          const actualHeal = Math.min(ally.maxHp - ally.currentHp, finalHeal)
          ally.currentHp += actualHeal
        }

        // Single combat log event for this cast
        events.push({
          timestamp: Math.round(currentTime * 10) / 10,
          actorSlotId: actor.slotId,
          actorName: actor.championName,
          actorSide: actor.side,
          action: 'W',
          targetSlotId: ally.slotId,
          targetName: ally.championName,
          targetSide: ally.side,
          amount: finalShield + finalHeal,
          dmgType: 'shield',
          shieldAmount: finalShield,
          healAmount: finalHeal > 0 ? finalHeal : undefined,
          isDot: false,
          remainingHp: ally.currentHp,
          remainingShield: ally.currentShield,
          isKo: false,
          badges: isEchoCast ? ['🎶 Echo'] : undefined,
        })
      })
      return
    }

    // Determine target participants
    const oppAlive = getOpposingAliveTargets(actor.slotId)
    const validTargets = oppAlive.filter((t) => targetSlotIds.includes(t.slotId))
    const finalTargets = validTargets.length > 0 ? validTargets : oppAlive.slice(0, 1)

    // Helper to execute single cast for all targets (Normal or Echo)
    const executeCastOnTargets = (isEcho: boolean) => {
      finalTargets.forEach((target) => {
        if (target.isKo) return

        const badges: string[] = []
        if (isEcho) {
          badges.push('🎶 Echo')
        }

        // Precision Runes detection
        const actorRunes = [
          actor.slot.primaryKeystone,
          actor.slot.primaryRune1,
          actor.slot.primaryRune2,
          actor.slot.primaryRune3,
          actor.slot.secondaryRune1,
          actor.slot.secondaryRune2,
          ...(actor.slot.runes || []),
        ]
        const hasCoupDeGrace = actorRunes.some((r) => {
          const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
          return str.includes('coup') || str.includes('grace')
        })
        const hasLastStand = actorRunes.some((r) => {
          const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
          return str.includes('last stand') || str.includes('laststand')
        })
        const hasCutDown = actorRunes.some((r) => {
          const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
          return str.includes('cut down') || str.includes('cutdown')
        })

        // Shred stacks (Black Cleaver & Vile Decay)
        if (
          !actor.slot.champion?.tags?.includes('Mage') &&
          actorStats.itemPassives.hasBlackCleaver
        ) {
          if (target.blackCleaverStacks < 6) {
            target.blackCleaverStacks++
            badges.push(`🪓 BC ${target.blackCleaverStacks}x`)
          }
        }
        if (actorStats.itemPassives.hasBloodletter) {
          if (target.vileDecayStacks < 4) {
            target.vileDecayStacks++
            badges.push(`🩸 VD ${target.vileDecayStacks}x`)
          }
        }

        // PtA Stacking & Exposure
        if (!target.ptaStates[actor.slotId]) {
          target.ptaStates[actor.slotId] = { stacks: 0, exposed: false }
        }
        const ptaState = target.ptaStates[actor.slotId]!
        let ptaProcDmg = 0

        if (hasPtA && action === 'AA' && !ptaState.exposed) {
          ptaState.stacks++
          if (ptaState.stacks >= 3) {
            ptaState.exposed = true
            ptaProcDmg = Math.round(40 + (actor.level - 1) * (140 / 17))
            badges.push('🎯 PtA EXPOSED')
          } else {
            badges.push(`🎯 PtA ${ptaState.stacks}/3`)
          }
        } else if (ptaState.exposed) {
          badges.push('🎯 PtA +8%')
        }

        const targetPassives = detectItemPassives(target.slot.items)
        const isSunderedSkyReady =
          action === 'AA' &&
          actorStats.itemPassives.hasSunderedSky &&
          (!actor.sunderedSkyCooldowns[target.slotId] ||
            currentTime >= (actor.sunderedSkyCooldowns[target.slotId] ?? 0))

        let shojinMultiplier = 1.0
        if (actorStats.itemPassives.hasSpearOfShojin) {
          const shojinIdx = (actor.slot.items || []).findIndex(
            (it) =>
              it &&
              (it.name.toLowerCase().includes('shojin') || it.id === '3161' || it.id === '223161'),
          )
          const currentStacks =
            shojinIdx !== -1 && actor.slot.itemStacks?.[shojinIdx] !== undefined
              ? actor.slot.itemStacks[shojinIdx]!
              : 4
          shojinMultiplier = 1 + currentStacks * 0.03
        }

        const isBloodsongActive = (actor.bloodsongActiveTargets[target.slotId] ?? 0) > currentTime

        // Calculate spell / attack damage via spellCalculatorService
        const spellRes = calculateSpellDamage({
          champion: actor.slot.champion,
          action,
          spellRanks: actor.slot.spellRanks,
          attacker: {
            ad: actorStats.ad,
            baseAd: actorStats.baseAd,
            ap: actorStats.ap,
            crit: actorStats.crit,
            level: actor.level,
            hp: actor.currentHp,
            maxHp: actor.maxHp,
            mana: actorStats.mana,
            armorPen: actorStats.armorPen,
            lethality: actorStats.lethality,
            magicPenPercent: actorStats.magicPenPercent,
            magicPenFlat: actorStats.magicPenFlat,
            adaptiveType:
              actorStats.ap > Math.max(0, actorStats.ad - actorStats.baseAd) ||
              actor.slot.champion?.tags?.includes('Mage')
                ? 'AP'
                : 'AD',
          },
          defender: {
            currentHp: target.currentHp,
            maxHp: target.maxHp,
            armor: target.baseArmor,
            mr: Math.max(0, target.baseMr - (target.malignanceShredDuration > 0 ? 10 : 0)),
            blackCleaverStacks: target.blackCleaverStacks,
            vileDecayStacks: target.vileDecayStacks,
          },
          options: {
            aatroxQSeq,
            hasAbyssalMask: actorStats.itemPassives.hasAbyssalMask,
            hasCoupDeGrace,
            hasLastStand,
            hasCutDown,
            hasInfinityEdge: actorStats.itemPassives.hasInfinityEdge,
            hasRanduins: targetPassives.hasRanduinsOmen,
            isGuaranteedCrit: isSunderedSkyReady,
            shojinMultiplier,
            hasBloodsong: Boolean(isBloodsongActive),
          },
        })

        if (isAbility && shojinMultiplier > 1) {
          badges.push(`Shojin (+${Math.round((shojinMultiplier - 1) * 100)}%)`)
        }
        if (isBloodsongActive) {
          badges.push('Bloodsong (+10%)')
        }

        if (spellRes.isCoupDeGraceProc) badges.push('🗡️ CdG (+8%)')
        if (spellRes.isCutDownProc) badges.push('🩸 Cut Down (+8%)')
        if (spellRes.lastStandBonusPct && spellRes.lastStandBonusPct > 0)
          badges.push(`🛡️ Last Stand (+${spellRes.lastStandBonusPct}%)`)

        let finalHitDmg = Math.round(spellRes.rawDmg * spellRes.hitMult)

        // PtA Exposure 8% amp
        if (ptaState.exposed) {
          finalHitDmg = Math.round(finalHitDmg * 1.08)
        }

        // Lethal Tempo Max-Stacks On-Hit Damage
        let ltOnHit = 0
        if (hasLethalTempo && action === 'AA' && actor.lethalTempoStacks >= 6) {
          const baseOnHit = 6 + (actor.level - 1) * (24 / 17)
          ltOnHit = Math.round(baseOnHit * spellRes.physMult)
          finalHitDmg += ltOnHit
          badges.push('⚡ LT Max')
        }

        // Blade of the Ruined King (Bork) On-Hit
        if (action === 'AA' && actorStats.itemPassives.hasBork) {
          const borkPct = isMelee ? 0.1 : 0.06
          const borkRaw = Math.max(15, target.currentHp * borkPct)
          const borkDmg = Math.round(borkRaw * spellRes.physMult)
          finalHitDmg += borkDmg
          badges.push('🗡️ Bork')
        }

        // Muramana Shock
        if (actorStats.itemPassives.hasMuramana) {
          let shockRaw = 0
          if (action === 'AA') {
            shockRaw = actorStats.mana * 0.015
          } else if (isAbility) {
            const manaPct = isMelee ? 0.035 : 0.027
            shockRaw = actorStats.mana * manaPct + actorStats.ad * 0.06
          }
          const shockDmg = Math.round(shockRaw * spellRes.physMult)
          finalHitDmg += shockDmg
          if (shockDmg > 0) badges.push('💧 Muramana')
        }

        // Luden's Echo Burst
        if (isAbility && actorStats.itemPassives.hasLudens) {
          const isPrimaryTarget = target.slotId === finalTargets[0]?.slotId
          const totalTargetsHit = Math.min(6, finalTargets.length)
          const secondaryTargetsHit = Math.max(0, totalTargetsHit - 1)
          let ludenRaw = 0
          if (isPrimaryTarget) {
            const unusedStacks = 5 - secondaryTargetsHit
            ludenRaw = 75 + unusedStacks * 15 + actorStats.ap * (0.05 + unusedStacks * 0.01)
          } else {
            ludenRaw = 75 + actorStats.ap * 0.05
          }
          const ludenDmg = Math.round(ludenRaw * spellRes.magicMult)
          finalHitDmg += ludenDmg
          badges.push("💥 Luden's")
        }

        // Nashor's Tooth On-Hit
        if (action === 'AA' && actorStats.itemPassives.hasNashors) {
          const nashorRaw = 15 + actorStats.ap * 0.15
          const nashorDmg = Math.round(nashorRaw * spellRes.magicMult)
          finalHitDmg += nashorDmg
          badges.push('🦷 Nashor')
        }

        // Guinsoo's Rageblade On-Hit
        if (action === 'AA' && actorStats.itemPassives.hasGuinsoo) {
          const guinsooRaw = 30
          const guinsooDmg = Math.round(guinsooRaw * spellRes.magicMult)
          finalHitDmg += guinsooDmg
          badges.push('⚔️ Guinsoo')
        }

        // Hextech Gunblade Lightning Bolt
        if (isAbility && actorStats.itemPassives.hasGunblade) {
          const gunbladeRaw = 150 + actor.level * 5 + actorStats.ap * 0.3
          const gunbladeDmg = Math.round(gunbladeRaw * spellRes.magicMult)
          finalHitDmg += gunbladeDmg
          badges.push('⚡ Gunblade')
        }

        // Hextech Rocketbelt Supersonic
        if (isAbility && actorStats.itemPassives.hasRocketbelt) {
          const rocketRaw = 125 + actorStats.ap * 0.15
          const rocketDmg = Math.round(rocketRaw * spellRes.magicMult)
          finalHitDmg += rocketDmg
          badges.push('🚀 Rocketbelt')
        }

        // Dusk and Dawn Spellblade
        if (action === 'AA' && actorStats.itemPassives.hasDuskAndDawn) {
          const ddRaw = actorStats.baseAd * 1.0 + actorStats.ap * 0.5
          const ddDmg = Math.round(ddRaw * spellRes.magicMult)
          finalHitDmg += ddDmg
          badges.push('🌅 Dusk & Dawn')
        }

        // Imperial Mandate Command
        if (isAbility && actorStats.itemPassives.hasImperialMandate) {
          const mandateRaw = 60 + actor.level * 3.5
          const mandateDmg = Math.round(mandateRaw * spellRes.magicMult)
          finalHitDmg += mandateDmg
          badges.push('👑 Mandate')
        }

        // Ardent Censer Sanctify On-Hit
        if (action === 'AA' && actorStats.itemPassives.hasArdentCenser) {
          const ardentRaw = 20
          const ardentDmg = Math.round(ardentRaw * spellRes.magicMult)
          finalHitDmg += ardentDmg
          badges.push('✨ Ardent')
        }

        // Echoes of Helia Soul Siphon
        if (isAbility && actorStats.itemPassives.hasEchoesOfHelia) {
          const heliaRaw = 60 + actor.level * 3
          const heliaDmg = Math.round(heliaRaw * spellRes.magicMult)
          finalHitDmg += heliaDmg
          badges.push('🌟 Helia')
        }

        // Horizon Focus +10% damage amplification
        if (actorStats.itemPassives.hasHorizonFocus) {
          finalHitDmg = Math.round(finalHitDmg * 1.1)
          badges.push('🎯 Horizon (+10%)')
        }

        // Actualizer +15% spell damage amplification
        if (isAbility && actorStats.itemPassives.hasActualizer) {
          finalHitDmg = Math.round(finalHitDmg * 1.15)
          badges.push('⚡ Actualizer (+15%)')
        }

        // Rylai's Crystal Scepter Slow
        if (isAbility && actorStats.itemPassives.hasRylais) {
          badges.push('❄️ Rylai Slow')
        }

        // Sundered Sky Critical Strike & Heal
        if (isSunderedSkyReady) {
          actor.sunderedSkyCooldowns[target.slotId] = currentTime + 6.0
          const healMult = targetPassives.hasSpiritVisage ? 1.25 : 1.0
          const healAmt = Math.round(
            (actorStats.baseAd * 1.4 + (actor.maxHp - actor.currentHp) * 0.06) * healMult,
          )
          actor.currentHp = Math.min(actor.maxHp, actor.currentHp + healAmt)
          badges.push('Sundered Sky')
        }

        // Heartsteel Colossus Strike
        if (
          action === 'AA' &&
          actorStats.itemPassives.hasHeartsteel &&
          !actor.heartsteelReady[target.slotId]
        ) {
          actor.heartsteelReady[target.slotId] = true
          const hsRaw = 80 + actorStats.bonusHp * 0.1
          const hsDmg = Math.round(hsRaw * spellRes.physMult)
          finalHitDmg += hsDmg
          badges.push(`Heartsteel (+${hsDmg})`)
        }

        // Titanic Hydra Cleave
        if (action === 'AA' && actorStats.itemPassives.hasTitanicHydra) {
          const titanicRaw = actorStats.maxHp * 0.015
          const titanicDmg = Math.round(titanicRaw * spellRes.physMult)
          finalHitDmg += titanicDmg
          badges.push('Titanic Hydra')
        }

        // Statikk Shiv Electrospark
        if (action === 'AA' && actorStats.itemPassives.hasStatikk) {
          const statikkDmg = Math.round(90 * spellRes.magicMult)
          finalHitDmg += statikkDmg
          badges.push('Statikk Shiv')
        }

        // Rapid Firecannon Energized
        if (action === 'AA' && actorStats.itemPassives.hasRapidFirecannon) {
          const rfcDmg = Math.round(60 * spellRes.magicMult)
          finalHitDmg += rfcDmg
          badges.push('Rapid Firecannon')
        }

        // Wit's End Fray
        if (action === 'AA' && actorStats.itemPassives.hasWitsEnd) {
          const witsDmg = Math.round(45 * spellRes.magicMult)
          finalHitDmg += witsDmg
          badges.push("Wit's End")
        }

        // Runaan's Hurricane Wind's Fury
        if (action === 'AA' && actorStats.itemPassives.hasRunaans) {
          const secTargets = oppAlive.filter((o) => o.slotId !== target.slotId).slice(0, 2)
          secTargets.forEach((sec) => {
            const secDmg = Math.round(actorStats.ad * 0.55 * spellRes.physMult)
            applyDamageToTarget(
              actor,
              sec,
              secDmg,
              'physical',
              "Runaan's Bolts",
              currentTime,
              false,
              ["Runaan's Bolts"],
            )
          })
        }

        // Navori Flickerblade Transcendence
        if (action === 'AA' && actorStats.itemPassives.hasNavori) {
          ;(['Q', 'W', 'E'] as const).forEach((spk) => {
            if (actor.spellCooldowns[spk] > currentTime) {
              const rem = actor.spellCooldowns[spk] - currentTime
              actor.spellCooldowns[spk] = currentTime + rem * 0.85
            }
          })
        }

        // Yun Tal Wildarrows Bleed on Crit
        if (
          action === 'AA' &&
          actorStats.itemPassives.hasYunTal &&
          (actorStats.crit > 0 || isSunderedSkyReady)
        ) {
          applyOrRefreshDoT(
            actor,
            target,
            'yun_tal',
            'Yun Tal Bleed',
            'physical',
            2.0,
            0.5,
            17.5,
            currentTime,
          )
        }

        // Eclipse Ever Rising Moon (2 hits within 1.5s)
        if (actorStats.itemPassives.hasEclipse) {
          if (!actor.eclipseHitCount[target.slotId]) {
            actor.eclipseHitCount[target.slotId] = {
              count: 0,
              windowEndTime: 0,
              cooldownEndTime: 0,
            }
          }
          const ecl = actor.eclipseHitCount[target.slotId]!
          if (currentTime >= ecl.cooldownEndTime) {
            if (currentTime > ecl.windowEndTime) {
              ecl.count = 1
              ecl.windowEndTime = currentTime + 1.5
            } else {
              ecl.count++
              if (ecl.count >= 2) {
                ecl.cooldownEndTime = currentTime + 6.0
                ecl.count = 0
                const eclRaw = target.maxHp * (isMelee ? 0.06 : 0.04)
                const eclDmg = Math.round(eclRaw * spellRes.physMult)
                finalHitDmg += eclDmg
                const bonusAd = Math.max(0, actorStats.ad - actorStats.baseAd)
                const shieldRaw = isMelee ? 160 + bonusAd * 0.4 : 80 + bonusAd * 0.2
                const shieldMult = actorStats.itemPassives.hasSpiritVisage ? 1.25 : 1.0
                const eclShield = Math.round(shieldRaw * shieldMult)
                actor.currentShield += eclShield
                badges.push(`Eclipse (+${eclShield})`)
              }
            }
          }
        }

        // Bloodsong Spellblade
        if (actorStats.itemPassives.hasBloodsong) {
          if (['Q', 'W', 'E', 'R'].includes(action)) {
            actor.bloodsongReady = true
          } else if (action === 'AA' && actor.bloodsongReady) {
            actor.bloodsongReady = false
            const bsRaw = actorStats.baseAd * 1.5
            const bsDmg = Math.round(bsRaw * spellRes.physMult)
            finalHitDmg += bsDmg
            actor.bloodsongActiveTargets[target.slotId] = currentTime + 6.0
            badges.push('Bloodsong')
          }
        }

        // Zaz'Zak's Realmspike Void Explosion
        if (isAbility && actorStats.itemPassives.hasZazZaks) {
          const zazRaw = 70 + actorStats.ap * 0.2 + target.maxHp * 0.04
          const zazDmg = Math.round(zazRaw * spellRes.magicMult)
          finalHitDmg += zazDmg
          badges.push("Zaz'Zak")
        }

        // Zeke's Convergence on Ultimate R
        if (action === 'R' && actorStats.itemPassives.hasZekes) {
          const zekePerSec = 50 + actorStats.bonusHp * 0.03
          applyOrRefreshDoT(
            actor,
            target,
            'zekes',
            "Zeke's Tempest",
            'magic',
            5.0,
            1.0,
            zekePerSec,
            currentTime,
          )
        }

        // Essence Reaver Mana Refund on AA
        if (action === 'AA' && actorStats.itemPassives.hasEssenceReaver) {
          const bonusAd = Math.max(0, actorStats.ad - actorStats.baseAd)
          const manaRefund = Math.round(15 + bonusAd * 0.1)
          actorStats.mana += manaRefund
          badges.push(`Essence Reaver (+${manaRefund})`)
        }

        // Hullbreaker Boarding Party (every 5th AA)
        if (action === 'AA' && actorStats.itemPassives.hasHullbreaker) {
          if (!actor.hullbreakerHitCount) actor.hullbreakerHitCount = {}
          actor.hullbreakerHitCount[target.slotId] =
            ((actor.hullbreakerHitCount[target.slotId] || 0) + 1) % 5
          if (actor.hullbreakerHitCount[target.slotId] === 0) {
            const bMult = isMelee ? 1.4 : 0.7
            const hpMult = isMelee ? 0.035 : 0.0175
            const hbRaw = actorStats.baseAd * bMult + actorStats.maxHp * hpMult
            const hbDmg = Math.round(hbRaw * spellRes.physMult)
            finalHitDmg += hbDmg
            badges.push(`⚓ Hullbreaker (+${hbDmg})`)
          }
        }

        // Dead Man's Plate Shipwrecker on AA
        if (
          action === 'AA' &&
          actorStats.itemPassives.hasDeadMansPlate &&
          !actor.deadMansDischarged
        ) {
          actor.deadMansDischarged = true
          const dmpRaw = 150 + actorStats.baseAd * 1.0
          const dmpDmg = Math.round(dmpRaw * spellRes.physMult)
          finalHitDmg += dmpDmg
          badges.push(`Shipwrecker (+${dmpDmg})`)
        }

        // Stormrazor Bolt on AA
        if (
          action === 'AA' &&
          actorStats.itemPassives.hasStormrazor &&
          !actor.stormrazorDischarged
        ) {
          actor.stormrazorDischarged = true
          const srDmg = Math.round(100 * spellRes.magicMult)
          finalHitDmg += srDmg
          badges.push(`Stormrazor (+${srDmg})`)
        }

        // Recurve Bow Steadfast on-hit
        if (action === 'AA' && actorStats.itemPassives.hasRecurveBow) {
          const rbDmg = Math.round(15 * spellRes.physMult)
          finalHitDmg += rbDmg
          badges.push('Recurve Bow (+15)')
        }

        // Hextech Alternator Revved on ability
        if (
          isAbility &&
          actorStats.itemPassives.hasHextechAlternator &&
          !actor.alternatorDischarged
        ) {
          actor.alternatorDischarged = true
          const altRaw = 50 + (actor.level - 1) * (75 / 17)
          const altDmg = Math.round(altRaw * spellRes.magicMult)
          finalHitDmg += altDmg
          badges.push(`Alternator (+${altDmg})`)
        }

        // Tiamat Cleave on AA
        if (action === 'AA' && actorStats.itemPassives.hasTiamat) {
          const cleaveMult = isMelee ? 0.4 : 0.2
          const tiamatDmg = Math.round(actorStats.ad * cleaveMult * spellRes.physMult)
          finalHitDmg += tiamatDmg
          badges.push(`Tiamat Cleave (+${tiamatDmg})`)
        }

        // Stridebreaker Breaking Shockwave
        if (
          action === 'AA' &&
          actorStats.itemPassives.hasStridebreaker &&
          !actor.stridebreakerUsed
        ) {
          actor.stridebreakerUsed = true
          const sbDmg = Math.round(actorStats.ad * 0.8 * spellRes.physMult)
          finalHitDmg += sbDmg
          badges.push(`Stridebreaker (+${sbDmg})`)
        }

        // Experimental Hexplate Overdrive on R
        if (action === 'R' && actorStats.itemPassives.hasExperimentalHexplate) {
          actor.hexplateBuffEndTime = currentTime + 8.0
          badges.push('Hexplate Overdrive')
        }

        // Haunting Guise Madness combat ramp
        if (actorStats.itemPassives.hasHauntingGuise) {
          const madnessBonus = Math.min(0.06, currentTime * 0.02)
          finalHitDmg = Math.round(finalHitDmg * (1 + madnessBonus))
          if (madnessBonus > 0) badges.push(`Madness (+${Math.round(madnessBonus * 100)}%)`)
        }

        // Redemption Intervention
        if (isAbility && actorStats.itemPassives.hasRedemption && !actor.redemptionUsed) {
          actor.redemptionUsed = true
          const sameSide = Object.values(participants).filter(
            (p) => p.side === actor.side && !p.isKo,
          )
          const rHeal = Math.round(200 + (actor.level - 1) * (200 / 17))
          sameSide.forEach((ally) => {
            ally.currentHp = Math.min(ally.maxHp, ally.currentHp + rHeal)
          })
          const rTrueDmg = Math.round(target.maxHp * 0.1)
          finalHitDmg += rTrueDmg
          badges.push(`Redemption (+${rHeal} Heal / ${rTrueDmg} True Dmg)`)
        }

        // Mikael's Blessing Cleanse & Heal
        if (isAbility && actorStats.itemPassives.hasMikaelsBlessing && !actor.mikaelsUsed) {
          actor.mikaelsUsed = true
          const sameSide = Object.values(participants).filter(
            (p) => p.side === actor.side && !p.isKo,
          )
          const lowestAlly = sameSide.sort(
            (a, b) => a.currentHp / a.maxHp - b.currentHp / b.maxHp,
          )[0]
          if (lowestAlly) {
            const mHeal = Math.round(100 + (actor.level - 1) * (100 / 17) + lowestAlly.maxHp * 0.1)
            lowestAlly.currentHp = Math.min(lowestAlly.maxHp, lowestAlly.currentHp + mHeal)
            lowestAlly.grievousWoundsDuration = 0
            badges.push(`Mikael's Cleanse (+${mHeal})`)
          }
        }

        // Solstice Sleigh
        if (isAbility && actorStats.itemPassives.hasSolsticeSleigh) {
          const sleighBonusHp = Math.round(50 + (actor.level - 1) * (180 / 17))
          actor.currentHp = Math.min(actor.maxHp, actor.currentHp + sleighBonusHp)
          badges.push(`Solstice Sleigh (+${sleighBonusHp} HP)`)
        }

        // Dream Maker
        if (isAbility && actorStats.itemPassives.hasDreamMaker) {
          const bubbleShield = Math.round(75 + (actor.level - 1) * (180 / 17))
          actor.currentShield += bubbleShield
          badges.push(`Dream Maker (+${bubbleShield} Shield)`)
        }

        // Trailblazer
        if (action === 'AA' && actorStats.itemPassives.hasTrailblazer) {
          badges.push('Lead the Way (Slow 50%)')
        }

        // Arena Items
        if (action === 'AA' && actorStats.itemPassives.hasEndlessHunger) {
          const hungerHeal = Math.round(actor.maxHp * 0.02)
          actor.currentHp = Math.min(actor.maxHp, actor.currentHp + hungerHeal)
          badges.push(`Endless Hunger (+${hungerHeal})`)
        }
        if (action === 'AA' && actorStats.itemPassives.hasBastionbreaker) {
          badges.push('Bastionbreaker')
        }
        if (action === 'AA' && actorStats.itemPassives.hasFiendhunterBolts) {
          finalHitDmg += Math.round(actorStats.ad * 0.3 * spellRes.physMult)
          badges.push('Fiendhunter Bolt')
        }
        if (action === 'AA' && actorStats.itemPassives.hasHexopticsC44) {
          finalHitDmg += Math.round(40 * spellRes.magicMult)
          badges.push('Hexoptics (+40)')
        }

        // Electrocute Proc
        if (hasElectrocute && ['Q', 'W', 'E', 'R', 'P', 'AA'].includes(action)) {
          if (!target.electrocuteStates[actor.slotId]) {
            target.electrocuteStates[actor.slotId] = { hits: 0, procced: false }
          }
          const eleState = target.electrocuteStates[actor.slotId]!
          if (!eleState.procced) {
            eleState.hits++
            if (eleState.hits >= 3) {
              eleState.procced = true
              const eleBase = 50 + (actor.level - 1) * (140 / 17)
              const isAp = actor.slot.champion?.tags?.includes('Mage')
              const eleDmg = Math.round(
                (eleBase + (isAp ? actorStats.ap * 0.25 : actorStats.ad * 0.4)) *
                  (isAp ? spellRes.magicMult : spellRes.physMult),
              )
              finalHitDmg += eleDmg
              badges.push('⚡ Electrocute')
            }
          }
        }

        // Dark Harvest Proc (< 50% HP)
        if (hasDarkHarvest && target.currentHp / target.maxHp <= 0.5) {
          if (!target.darkHarvestProcced[actor.slotId]) {
            target.darkHarvestProcced[actor.slotId] = true
            const dhBase = 20 + (actor.level - 1) * (40 / 17) + 5 * 9
            const isAp = actor.slot.champion?.tags?.includes('Mage')
            const dhDmg = Math.round(
              (dhBase + (isAp ? actorStats.ap * 0.05 : actorStats.ad * 0.1)) *
                (isAp ? spellRes.magicMult : spellRes.physMult),
            )
            finalHitDmg += dhDmg
            badges.push('💀 Dark Harvest')
          }
        }

        finalHitDmg += ptaProcDmg

        // Apply direct damage
        let actionLabel: string = action
        if (actor.slot.champion?.id === 'Aatrox' && action === 'Q') {
          actionLabel = `Q${aatroxQSeq} (Sweetspot)`
        }

        let totalHitDmg = finalHitDmg

        // Seraphine Stage Presence (Echo): second cast is combined into this single action
        if (isSeraphine && isEcho && ['Q', 'E'].includes(action)) {
          if (action === 'Q') {
            const remainingHpAfterHit1 = Math.max(1, target.currentHp - finalHitDmg)
            const echoSpellRes = calculateSpellDamage({
              champion: actor.slot.champion,
              action: 'Q',
              spellRanks: actor.slot.spellRanks,
              attacker: {
                ad: actorStats.ad,
                baseAd: actorStats.baseAd,
                ap: actorStats.ap,
                crit: actorStats.crit,
                level: actor.level,
                hp: actor.currentHp,
                maxHp: actor.maxHp,
                mana: actorStats.mana,
                armorPen: actorStats.armorPen,
                lethality: actorStats.lethality,
                magicPenPercent: actorStats.magicPenPercent,
                magicPenFlat: actorStats.magicPenFlat,
                adaptiveType: 'AP',
              },
              defender: {
                currentHp: remainingHpAfterHit1,
                maxHp: target.maxHp,
                armor: target.baseArmor,
                mr: Math.max(0, target.baseMr - (target.malignanceShredDuration > 0 ? 10 : 0)),
                blackCleaverStacks: target.blackCleaverStacks,
                vileDecayStacks: target.vileDecayStacks,
              },
            })
            totalHitDmg += Math.round(echoSpellRes.rawDmg * echoSpellRes.hitMult)
          } else if (action === 'E') {
            totalHitDmg += finalHitDmg
          }
        }

        applyDamageToTarget(
          actor,
          target,
          totalHitDmg,
          spellRes.dmgType,
          actionLabel,
          currentTime,
          false,
          badges,
        )

        // --- APPLY / REFRESH REAL-TIME CONTINUOUS DOT EFFECTS ---

        // 1. Liandry's Torment Burn (3s, 2% max HP / s, 1% per 0.5s tick)
        if (isAbility && actorStats.itemPassives.hasLiandrys) {
          const tickDmg = (target.maxHp * 0.02) / 2
          applyOrRefreshDoT(
            actor,
            target,
            'liandrys',
            "Liandry's Torment Burn",
            'magic',
            3.0,
            0.5,
            tickDmg,
            currentTime,
          )
        }

        // 2. Blackfire Torch Burn (Baleful Blaze: 60 + 6% AP total over 3s = 10 + 1% AP per 0.5s tick)
        // Multi-user: can stack on target when applied by different users.
        // Same user:
        // - Simultaneous casts (at the same time t) do not duplicate the burn or proc (stays 6 ticks).
        // - Recasting while already burning refreshes duration to 2.6s from recast time without duplicate proc,
        //   extending periodic ticks (e.g. 7 ticks if recast at 0.5s).
        if (isAbility && actorStats.itemPassives.hasBlackfireTorch) {
          const tickDmg = (60 + actorStats.ap * 0.06) / 6
          const existingDot = target.activeDoTs.find(
            (d) =>
              d.type === 'blackfire' && d.sourceSlotId === actor.slotId && d.remainingDuration > 0,
          )

          if (!existingDot) {
            const effMr = Math.max(
              0,
              (target.baseMr - (target.malignanceShredDuration > 0 ? 10 : 0)) *
                (1 - target.vileDecayStacks * 0.075) *
                (1 - actorStats.magicPenPercent / 100) -
                actorStats.magicPenFlat,
            )
            const magicMult = 100 / (100 + effMr)
            const firstTickMitigated = Math.max(1, Math.round(tickDmg * magicMult))

            // 1st tick applied immediately on initial application
            applyDamageToTarget(
              actor,
              target,
              firstTickMitigated,
              'magic',
              'Blackfire Torch Burn (Proc)',
              currentTime,
              true,
            )

            // Remaining 5 ticks over next 2.5s
            applyOrRefreshDoT(
              actor,
              target,
              'blackfire',
              'Blackfire Torch Burn',
              'magic',
              2.6,
              0.5,
              tickDmg,
              currentTime,
            )
          } else {
            // Recast while already burning:
            // If recast occurs after initial cast (currentTime > 0.05, e.g. 0.1s, 0.2s, 0.4s),
            // refresh duration to 3.0s from currentTime to extend the burn and ensure subsequent ticks fire
            if (currentTime > 0.05) {
              existingDot.remainingDuration = Math.max(existingDot.remainingDuration, 3.0)
            }
            existingDot.rawDamagePerTick = tickDmg
          }
        }

        // 3. Malignance Hatefog Pool (on Ultimate R, 3s, 60 + 5% AP per sec, ticks every 0.5s)
        if (action === 'R' && actorStats.itemPassives.hasMalignance) {
          const tickDmg = (60 + actorStats.ap * 0.05) / 2
          applyOrRefreshDoT(
            actor,
            target,
            'malignance',
            'Malignance Hatefog',
            'magic',
            3.0,
            0.5,
            tickDmg,
            currentTime,
          )
          target.malignanceShredDuration = 3.0
        }

        // 4. Deathfire Touch Keystone Burn
        // Damaging a champion with an ability burns them for 3 - 12 based on level (+2.5% AP) (+7% bonus AD) magic damage per second.
        // After burning for 3 seconds, the damage of the burn increases by 75% while they remain on fire.
        // Duration: Single Target: 4s | Area of Effect: 2s | Damage over Time: 1s
        if (isAbility && hasDeathfireTouch && !spellRes.isUtilityOrShield) {
          const bonusAd = Math.max(0, actorStats.ad - actorStats.baseAd)
          const dftBase = 3 + (actor.level - 1) * (9 / 17)
          const dftPerSec = dftBase + actorStats.ap * 0.025 + bonusAd * 0.07
          const isAoE =
            finalTargets.length > 1 ||
            (actor.slot.champion?.id === 'Seraphine' && ['Q', 'E', 'R'].includes(action))
          const dftDuration = isAoE ? 2.0 : 4.0
          const tickInterval = 0.5
          const tickDmg = dftPerSec * tickInterval
          applyOrRefreshDoT(
            actor,
            target,
            'deathfire_touch',
            'Deathfire Touch Burn',
            'magic',
            dftDuration,
            tickInterval,
            tickDmg,
            currentTime,
          )
        }

        // 4. Red Buff Burn (on AA, 3s true damage)
        const buffs = actor.side === 'blue' ? attackerBuffs : defenderBuffs
        if (action === 'AA' && buffs?.red) {
          const totalBurn = calculateRedBuffBurn(actor.level)
          const tickDmg = totalBurn / 3
          applyOrRefreshDoT(
            actor,
            target,
            'red_buff',
            'Red Buff Burn',
            'true',
            3.0,
            1.0,
            tickDmg,
            currentTime,
          )
        }

        // 5. Elder Dragon Burn (on any hit, 3s true damage)
        if (buffs?.elder) {
          const totalBurn = calculateElderBurn(actor.level)
          const tickDmg = totalBurn / 3
          applyOrRefreshDoT(
            actor,
            target,
            'elder_buff',
            'Elder Dragon Burn',
            'true',
            3.0,
            1.0,
            tickDmg,
            currentTime,
          )
        }

        // 6. Champion Specific Passives / DoTs
        // Darius Hemorrhage Bleed
        if (actor.slot.champion?.id === 'Darius' && ['Q', 'W', 'E', 'R', 'AA'].includes(action)) {
          const bonusAd = Math.max(0, actorStats.ad - actorStats.baseAd)
          const bleedPerSec = (13 + actor.level * 1.5 + 0.3 * bonusAd) / 5
          applyOrRefreshDoT(
            actor,
            target,
            'darius_bleed',
            'Darius Hemorrhage Bleed',
            'physical',
            5.0,
            1.0,
            bleedPerSec,
            currentTime,
            5,
          )
          // Check 5 stacks Noxian Might
          const dariusDot = target.activeDoTs.find(
            (d) => d.type === 'darius_bleed' && d.sourceSlotId === actor.slotId,
          )
          if (dariusDot && dariusDot.stacks >= 5 && !actor.noxianMight) {
            actor.noxianMight = true
          }
        }

        // Teemo Toxic Shot Poison
        if (actor.slot.champion?.id === 'Teemo' && action === 'AA') {
          const poisonPerSec = 6 + 0.1 * actorStats.ap
          applyOrRefreshDoT(
            actor,
            target,
            'teemo_poison',
            'Teemo Toxic Poison',
            'magic',
            4.0,
            1.0,
            poisonPerSec,
            currentTime,
          )
        }

        // Brand Blaze Burn (2% max HP over 4s = 0.5% max HP / s)
        if (actor.slot.champion?.id === 'Brand' && isAbility) {
          const blazePerSec = target.maxHp * 0.005
          applyOrRefreshDoT(
            actor,
            target,
            'brand_blaze',
            'Brand Blaze Burn',
            'magic',
            4.0,
            1.0,
            blazePerSec,
            currentTime,
            3,
          )
          // Brand 3-stack explosion
          const brandDot = target.activeDoTs.find(
            (d) => d.type === 'brand_blaze' && d.sourceSlotId === actor.slotId,
          )
          if (brandDot && brandDot.stacks >= 3) {
            brandDot.stacks = 0 // Detonates
            const boomDmg = Math.round(
              (target.maxHp * (0.09 + (actor.level - 1) * 0.002) + actorStats.ap * 0.02) *
                spellRes.magicMult,
            )
            applyDamageToTarget(
              actor,
              target,
              boomDmg,
              'magic',
              '💥 Brand Blaze Explosion',
              currentTime,
              false,
              ['3-Stack Blaze'],
            )
          }
        }

        // Cassiopeia Noxious Blast Poison
        if (actor.slot.champion?.id === 'Cassiopeia' && action === 'Q') {
          const qDmgPerSec = (75 + actorStats.ap * 0.9) / 3
          applyOrRefreshDoT(
            actor,
            target,
            'cassiopeia_poison',
            'Cassiopeia Noxious Poison',
            'magic',
            3.0,
            1.0,
            qDmgPerSec,
            currentTime,
          )
        }

        // Twitch Deadly Venom
        if (actor.slot.champion?.id === 'Twitch' && action === 'AA') {
          const venomPerSec = 1 + actor.level * 0.4 + 0.03 * actorStats.ap
          applyOrRefreshDoT(
            actor,
            target,
            'twitch_venom',
            'Twitch Deadly Venom',
            'true',
            6.0,
            1.0,
            venomPerSec,
            currentTime,
            6,
          )
        }

        // Malzahar Malefic Visions
        if (actor.slot.champion?.id === 'Malzahar') {
          if (action === 'E') {
            const visionsPerSec = (80 + actorStats.ap * 0.8) / 4
            applyOrRefreshDoT(
              actor,
              target,
              'malzahar_visions',
              'Malzahar Malefic Visions',
              'magic',
              4.0,
              0.5,
              visionsPerSec / 2,
              currentTime,
            )
          } else if (['Q', 'R'].includes(action)) {
            const existingE = target.activeDoTs.find(
              (d) => d.type === 'malzahar_visions' && d.sourceSlotId === actor.slotId,
            )
            if (existingE) {
              existingE.remainingDuration = 4.0 // Refreshes duration on Q or R
            }
          }
        }
      })
    }

    // Execute cast on targets (single unified action, handles Seraphine Echo amplification if isEchoCast)
    executeCastOnTargets(isEchoCast)

    // Seraphine Harmony Notes Discharge on AA
    if (isSeraphine && action === 'AA' && actor.seraphineNotes > 0) {
      const notesToUse = actor.seraphineNotes
      actor.seraphineNotes = 0
      const primaryTarget = finalTargets[0]
      if (primaryTarget && !primaryTarget.isKo) {
        const effMr = Math.max(
          0,
          primaryTarget.baseMr * (1 - primaryTarget.vileDecayStacks * 0.075) -
            actorStats.magicPenFlat,
        )
        const noteMagicMult = 100 / (100 + effMr)
        const noteBase = 4 + (actor.level - 1) * (21 / 17) + 0.04 * actorStats.ap
        const notesDmg = Math.round(notesToUse * noteBase * noteMagicMult)
        if (notesDmg > 0) {
          applyDamageToTarget(
            actor,
            primaryTarget,
            notesDmg,
            'magic',
            `🎶 Notes Volley (${notesToUse}x)`,
            currentTime,
            false,
            [`🎶 ${notesToUse} Notes`],
          )
        }
      }
    }

    // Jarvan IV Martial Cadence On-Hit on AA (8% current HP physical damage, 6s cooldown per target)
    if (actor.slot.champion?.id === 'JarvanIV' && action === 'AA') {
      const primaryTarget = finalTargets[0]
      if (primaryTarget && !primaryTarget.isKo) {
        actor.jarvanPassiveCooldowns = actor.jarvanPassiveCooldowns || {}
        const nextReady = actor.jarvanPassiveCooldowns[primaryTarget.slotId] || 0
        if (currentTime >= nextReady) {
          actor.jarvanPassiveCooldowns[primaryTarget.slotId] = currentTime + 6.0
          const effArmor = Math.max(
            0,
            primaryTarget.baseArmor *
              (1 - primaryTarget.blackCleaverStacks * 0.05) *
              (1 - actorStats.armorPen / 100) -
              actorStats.lethality,
          )
          const physMult = 100 / (100 + effArmor)
          const bonusRaw = Math.max(20, primaryTarget.currentHp * 0.08)
          const bonusDmg = Math.round(bonusRaw * physMult)
          if (bonusDmg > 0) {
            applyDamageToTarget(
              actor,
              primaryTarget,
              bonusDmg,
              'physical',
              '⚔️ Martial Cadence',
              currentTime,
              false,
              ['⚔️ 8% Current HP'],
            )
          }
        }
      }
    }

    // Aatrox Deathbringer Stance On-Hit on AA (4%-12% max HP physical damage + heal, 15s cooldown)
    if (actor.slot.champion?.id === 'Aatrox' && action === 'AA') {
      const primaryTarget = finalTargets[0]
      if (primaryTarget && !primaryTarget.isKo) {
        const nextReady = actor.aatroxPassiveCooldown || 0
        if (currentTime >= nextReady) {
          actor.aatroxPassiveCooldown = currentTime + 15.0
          const hpPct = 0.04 + (actor.level - 1) * 0.0047
          const bonusRaw = primaryTarget.maxHp * hpPct
          const effArmor = Math.max(
            0,
            primaryTarget.baseArmor *
              (1 - primaryTarget.blackCleaverStacks * 0.05) *
              (1 - actorStats.armorPen / 100) -
              actorStats.lethality,
          )
          const physMult = 100 / (100 + effArmor)
          const bonusDmg = Math.round(bonusRaw * physMult)
          if (bonusDmg > 0) {
            applyDamageToTarget(
              actor,
              primaryTarget,
              bonusDmg,
              'physical',
              '🗡️ Deathbringer Stance',
              currentTime,
              false,
              [`🗡️ ${Math.round(hpPct * 100)}% Max HP`],
            )
            const healAmt = Math.round(bonusDmg * 0.8)
            actor.currentHp = Math.min(actor.maxHp, actor.currentHp + healAmt)
          }
        }
      }
    }
  }

  // Pre-sort scheduled user actions by timestamp
  const sortedActions = [...actions].map((act, index) => ({
    ...act,
    timestamp: act.timestamp !== undefined ? act.timestamp : index * 0.6, // Default 0.6s spacing if omitted
  }))

  const executedActionIds = new Set<string>()

  // 2. Main Simulation Time Loop: t = 0.0 -> clampedDuration
  const totalTicks = Math.round(clampedDuration / timeStep)

  const hadBlue = activeBlueSlotIds.length > 0
  const hadRed = activeRedSlotIds.length > 0

  for (let step = 0; step <= totalTicks; step++) {
    const t = Math.round(step * timeStep * 10) / 10

    // Check if teamfight is already over before this tick (all members of one side are KO)
    const blueAlive = Object.values(participants).some((p) => p.side === 'blue' && !p.isKo)
    const redAlive = Object.values(participants).some((p) => p.side === 'red' && !p.isKo)
    if ((hadBlue && !blueAlive) || (hadRed && !redAlive)) {
      if (timeToKill === null) {
        timeToKill = Math.round(t * 10) / 10
      }
      terminationReason = 'ko'
      combatEndTime = Math.max(0.1, timeToKill)
      break
    }

    // A. Execute scheduled user actions occurring at time t
    sortedActions.forEach((act) => {
      if (executedActionIds.has(act.id)) return
      if (act.timestamp <= t + 0.05) {
        const actor = participants[act.actorSlotId]
        if (actor && !actor.isKo) {
          if (enforceCooldowns && ['Q', 'W', 'E', 'R'].includes(act.action)) {
            const spKey = act.action as 'Q' | 'W' | 'E' | 'R'
            if (t < actor.spellCooldowns[spKey] - 0.05) {
              return
            }
          }
          executedActionIds.add(act.id)
          lastActionTime = Math.max(lastActionTime, t)
          executeChampionAction(actor, act.action, act.targetSlotIds, t)
        }
      }
    })

    // B. Auto-Cast Available Abilities on Cooldown (Continuous Rotation)
    if (autoCastSpells) {
      Object.values(participants).forEach((actor) => {
        if (actor.isKo) return
        if (t < actor.lastSpellCastTime + 0.25 - 0.01) return

        const oppAlive = getOpposingAliveTargets(actor.slotId)
        if (oppAlive.length === 0) return

        // Priority order: R, then Q, then E, then W
        const priority: ('R' | 'Q' | 'E' | 'W')[] = ['R', 'Q', 'E', 'W']
        for (const sp of priority) {
          if (t >= actor.spellCooldowns[sp] - 0.01) {
            // Check if there is a pending manual action scheduled for this actor
            const hasPendingAction = sortedActions.some(
              (a) =>
                a.actorSlotId === actor.slotId &&
                !executedActionIds.has(a.id) &&
                a.timestamp <= t + 0.5,
            )
            if (hasPendingAction) break

            lastActionTime = Math.max(lastActionTime, t)
            executeChampionAction(
              actor,
              sp,
              oppAlive.map((o) => o.slotId),
              t,
            )
            break
          }
        }
      })
    }

    // B. Continuous Auto-Attacks (if enabled)
    if (enableAutoAttacks) {
      Object.values(participants).forEach((actor) => {
        if (actor.isKo) return
        if (t >= actor.nextAutoAttackTime - 0.01) {
          const oppAlive = getOpposingAliveTargets(actor.slotId)
          if (oppAlive.length > 0) {
            const target = oppAlive[0]! // Focus primary target
            lastActionTime = Math.max(lastActionTime, t)
            executeChampionAction(actor, 'AA', [target.slotId], t)
            const stats = getLiveStats(actor)
            const attackInterval = 1 / stats.as
            actor.nextAutoAttackTime = t + attackInterval
          }
        }
      })
    }

    // C. Sunfire Aegis & Hollow Radiance Aura Burns (ticks every 1.0s)
    Object.values(participants).forEach((actor) => {
      if (actor.isKo) return
      const stats = getLiveStats(actor)
      const hasSunfire = stats.itemPassives.hasSunfire
      const hasHollow = stats.itemPassives.hasHollowRadiance

      if ((hasSunfire || hasHollow) && t >= actor.nextSunfireTickTime - 0.01) {
        actor.nextSunfireTickTime = t + 1.0
        const oppAlive = getOpposingAliveTargets(actor.slotId)

        oppAlive.forEach((target) => {
          if (hasSunfire) {
            actor.sunfireRamp = Math.min(6, actor.sunfireRamp + 1)
            const rampMult = 1 + actor.sunfireRamp * 0.1
            const sunfireRaw = (15 + stats.bonusHp * 0.0175) * rampMult
            const effMr = Math.max(
              0,
              target.baseMr * (1 - target.vileDecayStacks * 0.075) - stats.magicPenFlat,
            )
            const magicMult = 100 / (100 + effMr)
            const sunfireDmg = Math.max(1, Math.round(sunfireRaw * magicMult))
            applyDamageToTarget(
              actor,
              target,
              sunfireDmg,
              'magic',
              `🔥 Sunfire Aura Burn (${actor.sunfireRamp}x)`,
              t,
              true,
              [`Ramp ${actor.sunfireRamp}/6`],
            )
          }

          if (hasHollow) {
            const hollowRaw = 10 + stats.bonusHp * 0.0175
            const effMr = Math.max(
              0,
              target.baseMr * (1 - target.vileDecayStacks * 0.075) - stats.magicPenFlat,
            )
            const magicMult = 100 / (100 + effMr)
            const hollowDmg = Math.max(1, Math.round(hollowRaw * magicMult))
            applyDamageToTarget(
              actor,
              target,
              hollowDmg,
              'magic',
              '✨ Hollow Radiance Aura',
              t,
              true,
            )
          }
        })
      }

      // Unending Despair Anguish pulse (every 5.0s)
      if (stats.itemPassives.hasUnendingDespair && t >= actor.nextUnendingDespairTime - 0.01) {
        actor.nextUnendingDespairTime = t + 5.0
        const oppAlive = getOpposingAliveTargets(actor.slotId)
        let totalHeal = 0
        oppAlive.forEach((target) => {
          const despairRaw = 20 + (actor.level - 1) * 1.5 + stats.bonusHp * 0.03
          const effMr = Math.max(
            0,
            target.baseMr * (1 - target.vileDecayStacks * 0.075) - stats.magicPenFlat,
          )
          const magicMult = 100 / (100 + effMr)
          const despairDmg = Math.max(1, Math.round(despairRaw * magicMult))
          applyDamageToTarget(
            actor,
            target,
            despairDmg,
            'magic',
            'Unending Despair (Anguish)',
            t,
            true,
            ['Anguish'],
          )
          totalHeal += Math.round(despairDmg * 2.5)
        })
        const healMult = stats.itemPassives.hasSpiritVisage ? 1.25 : 1.0
        const finalHeal = Math.round(totalHeal * healMult)
        actor.currentHp = Math.min(actor.maxHp, actor.currentHp + finalHeal)
      }
    })

    // D. Active DoT / Burn Ticks Processing
    Object.values(participants).forEach((target) => {
      if (target.isKo) return

      // Process Death's Dance stored true damage bleed
      if (target.deathsDanceBleedPool && target.deathsDanceBleedPool > 0) {
        const bleedTick = Math.max(1, Math.round(target.deathsDanceBleedPool * (timeStep / 3.0)))
        target.deathsDanceBleedPool = Math.max(0, target.deathsDanceBleedPool - bleedTick)
        target.currentHp = Math.max(0, target.currentHp - bleedTick)
        if (target.currentHp === 0) {
          target.isKo = true
        }
      }

      // Process Warmog's Armor Heart out-of-combat regeneration
      const targetStats = getLiveStats(target)
      if (
        targetStats.itemPassives.hasWarmogsArmor &&
        targetStats.bonusHp >= 1300 &&
        t - lastDamageTime >= 6.0 &&
        target.currentHp < target.maxHp
      ) {
        const warmogTick = Math.round(target.maxHp * 0.05 * timeStep)
        target.currentHp = Math.min(target.maxHp, target.currentHp + warmogTick)
      }

      // Update Malignance MR shred duration
      if (target.malignanceShredDuration > 0) {
        target.malignanceShredDuration = Math.max(0, target.malignanceShredDuration - timeStep)
      }

      // Process each active DoT on target
      target.activeDoTs.forEach((dot) => {
        if (dot.type === 'deathfire_touch') {
          dot.continuousBurnTime = (dot.continuousBurnTime || 0) + timeStep
        }

        if (t >= dot.nextTickTime - 0.01 && dot.remainingDuration > 0) {
          const actor = participants[dot.sourceSlotId]
          if (actor) {
            const stats = getLiveStats(actor)
            const effArmor = Math.max(
              0,
              target.baseArmor *
                (1 - target.blackCleaverStacks * 0.05) *
                (1 - stats.armorPen / 100) -
                stats.lethality,
            )
            const effMr = Math.max(
              0,
              (target.baseMr - (target.malignanceShredDuration > 0 ? 10 : 0)) *
                (1 - target.vileDecayStacks * 0.075) *
                (1 - stats.magicPenPercent / 100) -
                stats.magicPenFlat,
            )

            const mult =
              dot.dmgType === 'physical'
                ? 100 / (100 + effArmor)
                : dot.dmgType === 'magic'
                  ? 100 / (100 + effMr)
                  : 1.0

            let ampMultiplier = 1.0
            let isEmpowered = false
            if (dot.type === 'deathfire_touch' && (dot.continuousBurnTime || 0) >= 3.0 - 0.01) {
              ampMultiplier = 1.75
              isEmpowered = true
            }

            const totalRaw = dot.rawDamagePerTick * (dot.stacks || 1) * ampMultiplier
            const tickDmg = Math.max(1, Math.round(totalRaw * mult))

            const stackSuffix = dot.stacks > 1 ? ` (${dot.stacks}x)` : ''
            const actionName = isEmpowered
              ? `🔥 Deathfire Touch Burn (+75%)`
              : `${dot.name}${stackSuffix}`

            applyDamageToTarget(
              actor,
              target,
              tickDmg,
              dot.dmgType,
              actionName,
              t,
              true,
              isEmpowered ? ['🔥 DFT +75%'] : undefined,
            )
          }
          dot.nextTickTime = t + dot.tickInterval
        }

        dot.remainingDuration -= timeStep
      })

      // Clean up expired DoTs
      target.activeDoTs = target.activeDoTs.filter((d) => d.remainingDuration > 0)
    })

    // Check if teamfight concluded after actions/DoTs on this tick
    const blueAliveAfter = Object.values(participants).some((p) => p.side === 'blue' && !p.isKo)
    const redAliveAfter = Object.values(participants).some((p) => p.side === 'red' && !p.isKo)
    if ((hadBlue && !blueAliveAfter) || (hadRed && !redAliveAfter)) {
      timeToKill = Math.round(t * 10) / 10
      terminationReason = 'ko'
      combatEndTime = Math.max(0.1, timeToKill)
      break
    }

    // Check if all actions finished and all DoTs/auras expired (combo completion without auto-attacks)
    if (!autoCastSpells && !enableAutoAttacks) {
      const remainingActions = sortedActions.some((a) => !executedActionIds.has(a.id))
      const hasActiveDots = Object.values(participants).some(
        (p) => !p.isKo && p.activeDoTs.length > 0,
      )
      const hasOngoingAura = Object.values(participants).some((p) => {
        if (p.isKo) return false
        const st = getLiveStats(p)
        return (
          st.itemPassives.hasSunfire ||
          st.itemPassives.hasHollowRadiance ||
          (st.itemPassives.hasWarmogsArmor && st.bonusHp >= 1300 && p.currentHp < p.maxHp)
        )
      })
      if (!remainingActions && !hasActiveDots && !hasOngoingAura && t >= lastActionTime) {
        terminationReason = 'combo_complete'
        combatEndTime = Math.max(
          0.1,
          Math.round(Math.max(lastDamageTime, lastActionTime) * 10) / 10,
        )
        break
      }
    }
  }

  if (terminationReason === 'timeout') {
    combatEndTime = clampedDuration
  }

  const effectiveDuration = Math.max(0.1, Math.round(combatEndTime * 10) / 10)

  // 3. Compile Final Summary and Metrics
  let blueTeamTotalDamage = 0
  let redTeamTotalDamage = 0

  const championResults: Record<number, ChampionCombatResult> = {}

  Object.values(participants).forEach((part) => {
    const dps = Math.round((part.totalDamageDealt / effectiveDuration) * 10) / 10

    if (part.side === 'blue') {
      blueTeamTotalDamage += part.totalDamageDealt
    } else {
      redTeamTotalDamage += part.totalDamageDealt
    }

    const effArmor = Math.round(part.baseArmor * (1 - part.blackCleaverStacks * 0.05))
    const effMr = Math.round(part.baseMr * (1 - part.vileDecayStacks * 0.075))

    championResults[part.slotId] = {
      slotId: part.slotId,
      championName: part.championName,
      side: part.side,
      role: part.role,
      initialHp: part.maxHp,
      currentHp: part.currentHp,
      currentShield: part.currentShield,
      maxHp: part.maxHp,
      hpPct: Math.max(0, Math.round(((part.currentHp + part.currentShield) / part.maxHp) * 100)),
      isKo: part.isKo,
      totalDamageDealt: part.totalDamageDealt,
      dps,
      damageDealtByType: { ...part.damageDealtByType },
      damageTaken: part.damageTaken,
      activeDoTs: [...part.activeDoTs],
      effectiveArmor: effArmor,
      effectiveMr: effMr,
      blackCleaverStacks: part.blackCleaverStacks,
      vileDecayStacks: part.vileDecayStacks,
      conquerorStacks: part.conquerorStacks,
      lethalTempoStacks: part.lethalTempoStacks,
    }
  })

  const blueTeamDps = Math.round((blueTeamTotalDamage / effectiveDuration) * 10) / 10
  const redTeamDps = Math.round((redTeamTotalDamage / effectiveDuration) * 10) / 10

  return {
    duration: effectiveDuration,
    timeToKill,
    terminationReason,
    blueTeamTotalDamage,
    blueTeamDps,
    redTeamTotalDamage,
    redTeamDps,
    championResults,
    events,
  }
}
