import type { Champion } from '../../types'

export interface SpellDamageInput {
  champion?: Champion | null
  action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'
  spellRanks?: { q: number; w: number; e: number; r: number }
  attacker: {
    ad: number
    baseAd?: number
    ap: number
    crit: number
    level: number
    hp: number
    maxHp: number
    mana: number
    armorPen: number
    lethality: number
    magicPenPercent: number
    magicPenFlat: number
    adaptiveType: 'AD' | 'AP'
  }
  defender: {
    currentHp: number
    maxHp: number
    armor: number
    mr: number
    blackCleaverStacks: number
    vileDecayStacks: number
  }
  options?: {
    aatroxQSeq?: number
    hasAbyssalMask?: boolean
    hasCoupDeGrace?: boolean
    hasLastStand?: boolean
    hasCutDown?: boolean
  }
}

export interface SpellDamageResult {
  rawDmg: number
  dmgType: 'physical' | 'magic' | 'true'
  hitMult: number
  effArmor: number
  effMr: number
  physMult: number
  magicMult: number
  isUtilityOrShield?: boolean
  shieldAmount?: number
  isCoupDeGraceProc?: boolean
  isCutDownProc?: boolean
  lastStandBonusPct?: number
}

/**
 * Universal Champion Spell Damage Calculator.
 * Dynamically parses DDragon & CommunityDragon data with full support for:
 * - Dynamic Current HP & Missing HP (Execute) Scaling during teamfight combat
 * - Resistant Shredding & Penetration Multipliers
 * - Multi-target & Special Spell Modifiers
 */
export function calculateSpellDamage(input: SpellDamageInput): SpellDamageResult {
  const { champion, action, spellRanks, attacker, defender, options } = input
  const isApAttacker = attacker.adaptiveType === 'AP'

  const attAd = attacker.ad || 0
  const attAp = attacker.ap || 0
  const attLevel = attacker.level || 1
  const defArmor = defender.armor || 0
  const defMr = defender.mr || 0
  const defMaxHp = Math.max(1, defender.maxHp || 1000)
  const defCurrentHp = Math.max(0, defender.currentHp ?? defMaxHp)
  const missingHp = Math.max(0, defMaxHp - defCurrentHp)
  const missingHpPct = Math.max(0, Math.min(100, (missingHp / defMaxHp) * 100))

  // Precision Row Runes (Coup de Grace, Cut Down, Last Stand)
  let runeMultiplier = 1.0
  let isCoupDeGraceProc = false
  let isCutDownProc = false
  let lastStandBonusPct = 0

  const defHpPct = (defCurrentHp / defMaxHp) * 100
  if (options?.hasCoupDeGrace && defHpPct < 40) {
    runeMultiplier *= 1.08
    isCoupDeGraceProc = true
  }

  if (options?.hasCutDown && defHpPct > 60) {
    runeMultiplier *= 1.08
    isCutDownProc = true
  }

  const attHp = attacker.hp ?? attacker.maxHp
  const attMaxHp = Math.max(1, attacker.maxHp || 1000)
  const attHpPct = (attHp / attMaxHp) * 100
  if (options?.hasLastStand && attHpPct < 60) {
    const bonusPct = Math.round(5 + Math.min(6, ((60 - attHpPct) / 30) * 6))
    lastStandBonusPct = bonusPct
    runeMultiplier *= 1 + bonusPct / 100
  }

  // Calculate post-shred effective resists
  const effArmor = Math.max(
    0,
    defArmor *
      (1 - (defender.blackCleaverStacks || 0) * 0.05) *
      (1 - (attacker.armorPen || 0) / 100) -
      (attacker.lethality || 0),
  )
  const physMult = (100 / (100 + effArmor)) * runeMultiplier

  const effMr = Math.max(
    0,
    defMr *
      (1 - (defender.vileDecayStacks || 0) * 0.075) *
      (1 - (attacker.magicPenPercent || 0) / 100) -
      (attacker.magicPenFlat || 0),
  )
  const magicMult = (100 / (100 + effMr)) * (options?.hasAbyssalMask ? 1.12 : 1.0) * runeMultiplier

  // Default spell ranks
  const qRank =
    spellRanks?.q || (attLevel >= 9 ? 5 : Math.max(1, Math.min(5, Math.ceil(attLevel / 2))))
  const wRank =
    spellRanks?.w || (attLevel >= 13 ? 5 : Math.max(1, Math.min(5, Math.ceil(attLevel / 3))))
  const eRank =
    spellRanks?.e || (attLevel >= 18 ? 5 : Math.max(1, Math.min(5, Math.ceil(attLevel / 3))))
  const rRank = spellRanks?.r || (attLevel >= 16 ? 3 : attLevel >= 11 ? 2 : attLevel >= 6 ? 1 : 1)

  const attackerBaseAd = attacker.baseAd ?? attAd * 0.6
  const bonusAd = Math.max(0, attAd - attackerBaseAd)

  let rawDmg = 0
  let dmgType: 'physical' | 'magic' | 'true' = isApAttacker ? 'magic' : 'physical'
  let hitMult = isApAttacker ? magicMult : physMult
  let isUtilityOrShield = false
  const shieldAmount = 0

  // 1. Auto Attack
  if (action === 'AA') {
    rawDmg = attAd * (attacker.crit > 0 ? 1.75 : 1.0)
    dmgType = 'physical'
    hitMult = physMult
    return {
      rawDmg,
      dmgType,
      hitMult,
      effArmor,
      effMr,
      physMult,
      magicMult,
      isCoupDeGraceProc,
      isCutDownProc,
      lastStandBonusPct,
    }
  }

  // 2. Champion Passives (P) Dynamic HP Calculations
  if (action === 'P') {
    if (champion?.id === 'JarvanIV') {
      // Martello Marziale: 8% current HP physical damage
      rawDmg = Math.max(20, defCurrentHp * 0.08)
      dmgType = 'physical'
      hitMult = physMult
    } else if (champion?.id === 'Aatrox') {
      // Deathbringer Stance: 4-12% max HP physical damage
      const hpPct = 0.04 + (attLevel - 1) * 0.0047
      rawDmg = attAd + defMaxHp * hpPct
      dmgType = 'physical'
      hitMult = physMult
    } else {
      rawDmg = isApAttacker ? 20 + attLevel * 4 + attAp * 0.2 : 15 + attLevel * 3 + attAd * 0.15
      dmgType = isApAttacker ? 'magic' : 'physical'
      hitMult = isApAttacker ? magicMult : physMult
    }
    return {
      rawDmg,
      dmgType,
      hitMult,
      effArmor,
      effMr,
      physMult,
      magicMult,
      isUtilityOrShield,
      shieldAmount,
    }
  }

  // 3. Dynamic DDragon & CommunityDragon Data Engine (For ALL Champion Spells Q, W, E, R)
  const spellIndexMap = { Q: 0, W: 1, E: 2, R: 3, P: -1, AA: -2 }
  const sIdx = spellIndexMap[action]

  if (sIdx >= 0 && champion?.spells?.[sIdx]) {
    const spell = champion.spells[sIdx]
    const tooltip = (spell.tooltip || spell.description || '').toLowerCase()

    // Detect damage type from DDragon/CDragon tooltip tags
    if (tooltip.includes('truedamage') || tooltip.includes('true damage')) {
      dmgType = 'true'
      hitMult = 1.0
    } else if (
      tooltip.includes('magicdamage') ||
      tooltip.includes('magic damage') ||
      isApAttacker
    ) {
      dmgType = 'magic'
      hitMult = magicMult
    } else {
      dmgType = 'physical'
      hitMult = physMult
    }

    // Detect utility / shield spells
    if ((tooltip.includes('shield') || tooltip.includes('heal')) && !tooltip.includes('damage')) {
      isUtilityOrShield = true
      rawDmg = 0
    } else {
      let baseDmg = 0
      const currentRank =
        action === 'Q' ? qRank : action === 'W' ? wRank : action === 'E' ? eRank : rRank

      // Extract exact base damage array from DDragon spell.effect array
      if (spell.effect && Array.isArray(spell.effect)) {
        let chosenEff: number[] | null = null
        for (let i = 1; i < spell.effect.length; i++) {
          const effArr = spell.effect[i]
          if (effArr && Array.isArray(effArr)) {
            const maxVal = effArr[effArr.length - 1] || effArr[0] || 0
            if (maxVal >= 30) {
              chosenEff = effArr as number[]
              break
            }
          }
        }
        if (!chosenEff) {
          for (let i = 1; i < spell.effect.length; i++) {
            if (
              spell.effect[i] &&
              Array.isArray(spell.effect[i]) &&
              spell.effect[i]!.some((v) => typeof v === 'number' && v > 0)
            ) {
              chosenEff = spell.effect[i] as number[]
              break
            }
          }
        }
        if (chosenEff) {
          baseDmg = chosenEff[currentRank - 1] || chosenEff[0] || 0
        }
      }

      // Extract scaling from DDragon spell.vars array
      let scalingDmg = 0
      let hasParsedVars = false
      if (spell.vars && Array.isArray(spell.vars) && spell.vars.length > 0) {
        spell.vars.forEach((v: Record<string, unknown>) => {
          if (!v) return
          const rawCoeff = v.coeff
          const coeff = Array.isArray(rawCoeff)
            ? Number(rawCoeff[0])
            : typeof rawCoeff === 'number'
              ? rawCoeff
              : 0
          const link = String(v.link || '')
          if (link === 'bonusattackdamage') {
            scalingDmg += bonusAd * coeff
            hasParsedVars = true
          } else if (link === 'attackdamage') {
            scalingDmg += attAd * coeff
            hasParsedVars = true
          } else if (link === 'spellpower') {
            scalingDmg += attAp * coeff
            hasParsedVars = true
          } else if (link === 'health') {
            scalingDmg += (attacker.hp || 1500) * coeff
            hasParsedVars = true
          }
        })
      }

      // Fallback base and scaling if DDragon effect/vars are omitted for this spell slot
      if (baseDmg === 0) {
        baseDmg =
          action === 'Q'
            ? 70 + qRank * 35
            : action === 'W'
              ? 60 + wRank * 30
              : action === 'E'
                ? 65 + eRank * 30
                : 150 + rRank * 125
      }
      if (!hasParsedVars) {
        scalingDmg = isApAttacker
          ? attAp * (action === 'R' ? 0.95 : 0.65)
          : attAd * (action === 'R' ? 1.1 : 0.7)
      }

      rawDmg = baseDmg + scalingDmg

      // --- DYNAMIC HP & EXECUTION AMPLIFICATION MODIFIERS ---

      // Seraphine Q: Up to +75% bonus damage based on target missing HP
      if (champion?.id === 'Seraphine' && action === 'Q') {
        const missingAmp = (Math.min(75, missingHpPct) / 75) * 0.75
        rawDmg = rawDmg * (1 + missingAmp)
      }
      // Garen R: True damage base + missing HP execute scaling
      else if (champion?.id === 'Garen' && action === 'R') {
        const executePct = [0.25, 0.3, 0.35][rRank - 1] || 0.25
        rawDmg = baseDmg + missingHp * executePct
        dmgType = 'true'
        hitMult = 1.0
      }
      // Veigar R: Up to +100% bonus damage based on missing HP
      else if (champion?.id === 'Veigar' && action === 'R') {
        const amp = Math.min(1.0, missingHpPct / 66.7)
        rawDmg = rawDmg * (1 + amp)
      }
      // Jinx R: Base + 25-35% missing HP physical damage
      else if (champion?.id === 'Jinx' && action === 'R') {
        const executePct = [0.25, 0.3, 0.35][rRank - 1] || 0.25
        rawDmg = rawDmg + missingHp * executePct
      }
      // Akali R2: Up to +200% bonus damage based on missing HP
      else if (champion?.id === 'Akali' && action === 'R') {
        const amp = Math.min(2.0, (missingHpPct / 70) * 2.0)
        rawDmg = rawDmg * (1 + amp)
      }
      // Riven R2: Up to +200% bonus damage based on missing HP
      else if (champion?.id === 'Riven' && action === 'R') {
        const amp = Math.min(2.0, (missingHpPct / 75) * 2.0)
        rawDmg = rawDmg * (1 + amp)
      }
      // Aatrox Q: Sweetspot sequence multiplier
      else if (champion?.id === 'Aatrox' && action === 'Q' && options?.aatroxQSeq) {
        const seqMult = options.aatroxQSeq === 2 ? 1.25 : options.aatroxQSeq === 3 ? 1.5 : 1.0
        rawDmg = rawDmg * seqMult * 1.6
      }
      // Generic Dynamic Tooltip Missing HP Scaling
      else if (
        tooltip.includes('missing health') ||
        tooltip.includes('missing hp') ||
        tooltip.includes('health missing')
      ) {
        const dynamicAmp = (Math.min(75, missingHpPct) / 75) * 0.5
        rawDmg = rawDmg * (1 + dynamicAmp)
      }
    }
  } else {
    rawDmg = isApAttacker ? 140 + attAp * 0.6 : 130 + attAd * 0.65
    dmgType = isApAttacker ? 'magic' : 'physical'
    hitMult = isApAttacker ? magicMult : physMult
  }

  return {
    rawDmg,
    dmgType,
    hitMult,
    effArmor,
    effMr,
    physMult,
    magicMult,
    isUtilityOrShield,
    shieldAmount,
    isCoupDeGraceProc,
    isCutDownProc,
    lastStandBonusPct,
  }
}
