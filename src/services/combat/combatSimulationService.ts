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
  dmgType: 'physical' | 'magic' | 'true'
  isDot: boolean
  remainingHp: number
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
  seraphineCastCounter: number
  seraphineNotes: number
  castCounter: number
  noxianMight: boolean
  spellCooldowns: Record<'Q' | 'W' | 'E' | 'R', number>
  lastSpellCastTime: number
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
    attackerBuffs,
    defenderBuffs,
  } = input

  const clampedDuration = Math.max(0.5, Math.min(30, duration))
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

    participants[slotId] = {
      slot,
      side,
      slotId,
      championName: slot.champion.name,
      level: slot.level || 1,
      role: slot.role,
      maxHp: hp,
      currentHp: hp,
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
      seraphineCastCounter: 0,
      seraphineNotes: 0,
      castCounter: 0,
      noxianMight: false,
      spellCooldowns: { Q: 0.0, W: 0.0, E: 0.0, R: 0.0 },
      lastSpellCastTime: -1.0,
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
    const totalAd =
      Math.round(((dynamicStats?.ad?.total || 70) + mStats.bonusAD + extraNoxianAd) * mStats.adMultiplier)

    // Check Blackfire Torch active bonus AP (4% AP per burning enemy)
    const activeItems = detectItemPassives(part.slot.items)
    let extraApPct = 0
    if (activeItems.hasBlackfireTorch) {
      const oppTargets = getOpposingAliveTargets(part.slotId)
      const burningCount = oppTargets.filter((t) =>
        t.activeDoTs.some((d) => d.type === 'blackfire' && d.sourceSlotId === part.slotId),
      ).length
      extraApPct = Math.min(0.2, burningCount * 0.04)
    }

    const baseAp = Math.round(((dynamicStats?.ap?.total || 0) + mStats.bonusAP) * mStats.apMultiplier)
    const totalAp = Math.round(baseAp * (1 + extraApPct))

    const attackSpeed = Math.max(0.2, Math.min(3.5, dynamicStats?.as?.total || 0.65))

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
      bonusHp: Math.max(0, part.maxHp - (part.slot.champion?.stats?.hp || 600)),
      abilityHaste: Math.round((dynamicStats?.abilityHaste?.total || 0) + mStats.bonusAH),
      itemPassives: activeItems,
    }
  }

  // Helper: Apply direct damage and register to state
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

    target.currentHp = Math.max(0, target.currentHp - amount)
    target.damageTaken += amount

    actor.totalDamageDealt += amount
    actor.damageDealtByType[dmgType] += amount
    if (isDot) {
      actor.damageDealtByType.dot += amount
    }

    lastDamageTime = Math.max(lastDamageTime, Math.round(currentTime * 10) / 10)

    if (target.currentHp === 0) {
      target.isKo = true
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
      amount,
      dmgType,
      isDot,
      remainingHp: target.currentHp,
      isKo: target.isKo,
      badges: badges.length > 0 ? badges : undefined,
    })

    // Elder Dragon execute threshold check: target below 20% max HP
    const buffs = actor.side === 'blue' ? attackerBuffs : defenderBuffs
    if (buffs.elder && !target.isKo && target.currentHp > 0 && target.currentHp / target.maxHp < 0.2) {
      const executeDmg = target.currentHp
      target.currentHp = 0
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
      existing.remainingDuration = duration
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

    if (hasConqueror) {
      actor.conquerorStacks = Math.min(12, actor.conquerorStacks + (isMelee ? 2 : 1))
    }
    if (hasLethalTempo && action === 'AA') {
      actor.lethalTempoStacks = Math.min(6, actor.lethalTempoStacks + 1)
    }
    if (actor.hobAttacksLeft > 0 && action === 'AA') {
      actor.hobAttacksLeft--
    }

    // Aatrox sequence tracking
    let aatroxQSeq = 1
    if (actor.slot.champion?.id === 'Aatrox' && action === 'Q') {
      aatroxQSeq = actor.aatroxQSeq || 1
      actor.aatroxQSeq = (aatroxQSeq % 3) + 1
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
      actor.seraphineNotes = Math.min(20, (actor.seraphineNotes || 0) + alliesCount * (isEchoCast ? 2 : 1))
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
        if (!actor.slot.champion?.tags?.includes('Mage') && actorStats.itemPassives.hasBlackCleaver) {
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
            adaptiveType: actor.slot.champion?.tags?.includes('Mage') ? 'AP' : 'AD',
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
          },
        })

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
        if (isEcho) {
          actionLabel = `${actionLabel} + 🎶 Echo`
        }

        applyDamageToTarget(
          actor,
          target,
          finalHitDmg,
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

        // 2. Blackfire Torch Burn (3s, 60 + 6% AP total over 3s = 10 + 1% AP per 0.5s tick)
        if (isAbility && actorStats.itemPassives.hasBlackfireTorch) {
          const tickDmg = (60 + actorStats.ap * 0.06) / 6
          applyOrRefreshDoT(
            actor,
            target,
            'blackfire',
            'Blackfire Torch Burn',
            'magic',
            3.0,
            0.5,
            tickDmg,
            currentTime,
          )
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

        // 4. Red Buff Burn (on AA, 3s true damage)
        const buffs = actor.side === 'blue' ? attackerBuffs : defenderBuffs
        if (action === 'AA' && buffs.red) {
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
        if (buffs.elder) {
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

    // First cast (Normal)
    executeCastOnTargets(false)

    // Second cast (Echo) for Seraphine Stage Presence
    if (isEchoCast) {
      executeCastOnTargets(true)
    }

    // Seraphine Harmony Notes Discharge on AA
    if (isSeraphine && action === 'AA' && actor.seraphineNotes > 0) {
      const notesToUse = actor.seraphineNotes
      actor.seraphineNotes = 0
      const primaryTarget = finalTargets[0]
      if (primaryTarget && !primaryTarget.isKo) {
        const effMr = Math.max(
          0,
          primaryTarget.baseMr * (1 - primaryTarget.vileDecayStacks * 0.075) - actorStats.magicPenFlat,
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
            executeChampionAction(actor, sp, oppAlive.map((o) => o.slotId), t)
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
    })

    // D. Active DoT / Burn Ticks Processing
    Object.values(participants).forEach((target) => {
      if (target.isKo) return

      // Update Malignance MR shred duration
      if (target.malignanceShredDuration > 0) {
        target.malignanceShredDuration = Math.max(0, target.malignanceShredDuration - timeStep)
      }

      // Process each active DoT on target
      target.activeDoTs.forEach((dot) => {
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

            const totalRaw = dot.rawDamagePerTick * (dot.stacks || 1)
            const tickDmg = Math.max(1, Math.round(totalRaw * mult))

            const stackSuffix = dot.stacks > 1 ? ` (${dot.stacks}x)` : ''
            applyDamageToTarget(
              actor,
              target,
              tickDmg,
              dot.dmgType,
              `${dot.name}${stackSuffix}`,
              t,
              true,
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
        return st.itemPassives.hasSunfire || st.itemPassives.hasHollowRadiance
      })
      if (!remainingActions && !hasActiveDots && !hasOngoingAura && t >= lastActionTime) {
        terminationReason = 'combo_complete'
        combatEndTime = Math.max(0.1, Math.round(Math.max(lastDamageTime, lastActionTime) * 10) / 10)
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
      maxHp: part.maxHp,
      hpPct: Math.max(0, Math.round((part.currentHp / part.maxHp) * 100)),
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
