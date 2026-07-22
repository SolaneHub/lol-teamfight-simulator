import type { DraftSlot } from '@/types'
import { getChampionDefaultAdaptiveType } from '../champions/championService'
import { parseStatsFromDescription } from '../items/itemService'

/**
 * Formula ufficiale di Riot Games per il calcolo delle statistiche in base al livello.
 */
export const calculateStatForLevel = (base: number, growth: number, level: number): number => {
  if (level === 1) return base
  const modifier = (level - 1) * (0.7025 + 0.0175 * (level - 1))
  return Math.round((base + growth * modifier) * 100) / 100
}

/**
 * Calcola l'Attack Speed totale al livello specificato secondo la formula di Riot Games.
 */
export const calculateAttackSpeedForLevel = (
  base: number,
  ratio: number,
  growth: number,
  level: number,
  bonus: number = 0,
): number => {
  if (level === 1) {
    return Math.round((base + bonus * ratio) * 1000) / 1000
  }
  const modifier = (level - 1) * (0.7025 + 0.0175 * (level - 1))
  const growthBonus = (growth / 100) * modifier
  const totalAs = base + (bonus + growthBonus) * ratio
  return Math.round(totalAs * 1000) / 1000
}

/**
 * Calcola l'incremento di una statistica ottenuto salendo a un determinato livello (es. da 9 a 10).
 */
export const calculateStatIncreaseForLevel = (growth: number, level: number): number => {
  if (level < 2) return 0
  const coef = 0.65 + 0.035 * level
  return Math.round(growth * coef * 100) / 100
}

/**
 * Calcola le statistiche totali per un DraftSlot.
 */
export const calculateStats = (slot: DraftSlot) => {
  if (!slot.champion) return null

  const champ = slot.champion
  const stats = champ.stats
  const lvl = slot.level

  const usesMana = champ.partype === 'Mana'

  // Calculate Base Stats at Level L using the custom formulas
  const baseHp = calculateStatForLevel(stats.hp, stats.hpperlevel, lvl)
  const baseMp = usesMana ? calculateStatForLevel(stats.mp, stats.mpperlevel, lvl) : (stats.mp || 0)
  const baseArmor = calculateStatForLevel(stats.armor, stats.armorperlevel, lvl)
  const baseMr = calculateStatForLevel(stats.magicResist, stats.magicResistPerLevel, lvl)
  const baseAd = calculateStatForLevel(stats.attackdamage, stats.attackdamageperlevel, lvl)
  const baseAs = calculateAttackSpeedForLevel(
    stats.attackspeed,
    stats.attackspeedratio,
    stats.attackspeedperlevel,
    lvl,
    0,
  )
  const baseMs = stats.movespeed
  const baseRange = stats.attackrange

  // Sum Item Bonuses
  let bonusHp = 0
  let bonusMp = 0
  let bonusArmor = 0
  let bonusMr = 0
  let bonusAd = 0
  let bonusAp = 0
  let bonusAsPercent = 0
  let bonusMsFlat = 0
  let bonusMsPercent = 0

  // Advanced Stats
  let bonusCrit = 0
  let bonusLethality = 0
  let bonusArmorPen = 0
  let bonusMagicPenFlat = 0
  let bonusMagicPenPercent = 0
  let bonusHaste = 0
  let bonusLifeSteal = 0
  let bonusOmnivamp = 0
  let bonusTenacity = 0

  for (let i = 0; i < slot.items.length; i++) {
    const item = slot.items[i]
    if (!item) continue
    const isMasterwork = slot.masterworkItems && slot.masterworkItems[i] === true
    const s = item.stats

    if (s.FlatHPPoolMod) bonusHp += s.FlatHPPoolMod + (isMasterwork ? 150 : 0)
    if (usesMana && s.FlatMPPoolMod) bonusMp += s.FlatMPPoolMod
    if (s.FlatArmorMod) bonusArmor += s.FlatArmorMod + (isMasterwork ? 15 : 0)
    if (s.FlatSpellBlockMod) bonusMr += s.FlatSpellBlockMod + (isMasterwork ? 15 : 0)
    if (s.FlatPhysicalDamageMod) bonusAd += s.FlatPhysicalDamageMod + (isMasterwork ? 15 : 0)
    if (s.FlatMagicDamageMod) bonusAp += s.FlatMagicDamageMod + (isMasterwork ? 25 : 0)
    if (s.PercentAttackSpeedMod) {
      const asVal = s.PercentAttackSpeedMod
      bonusAsPercent += (asVal > 1 ? asVal / 100 : asVal) + (isMasterwork ? 0.15 : 0)
    }
    if (s.FlatMovementSpeedMod) bonusMsFlat += s.FlatMovementSpeedMod
    if (s.PercentMovementSpeedMod) {
      const msVal = s.PercentMovementSpeedMod
      bonusMsPercent += msVal > 1 ? msVal / 100 : msVal
    }

    // Parse advanced stats from description
    const parsed = parseStatsFromDescription(item.description)
    bonusCrit += s.FlatCritChanceMod ? (s.FlatCritChanceMod * 100) : parsed.critChance
    bonusLethality += parsed.lethality
    bonusArmorPen += parsed.armorPenPercent
    bonusMagicPenFlat += parsed.magicPenFlat
    bonusMagicPenPercent += parsed.magicPenPercent
    bonusHaste += parsed.abilityHaste + (isMasterwork && parsed.abilityHaste > 0 ? 10 : 0)
    bonusLifeSteal += s.PercentLifeStealMod ? (s.PercentLifeStealMod * 100) : parsed.lifeSteal
    bonusOmnivamp += parsed.omnivamp
  }

  // Sum Shards
  let shardHp = 0
  let shardArmor = 0
  let shardMr = 0
  let shardAd = 0
  let shardAp = 0
  let shardAsPercent = 0
  let shardHaste = 0
  let shardTenacity = 0

  let isApAdaptive = false
  if (bonusAp > 0 || bonusAd > 0) {
    isApAdaptive = bonusAp > bonusAd
  } else if (slot.champion) {
    isApAdaptive = getChampionDefaultAdaptiveType(slot.champion.id, slot.champion.tags) === 'AP'
  }

  // Row 1: Offensive
  if (slot.shardOffensive === 'as') {
    shardAsPercent += 0.1
  } else if (slot.shardOffensive === 'adaptive') {
    if (isApAdaptive) shardAp += 9
    else shardAd += 5.4
  } else if (slot.shardOffensive === 'haste') {
    shardHaste += 8
  }

  // Row 2: Flex
  if (slot.shardFlex === 'adaptive') {
    if (isApAdaptive) shardAp += 9
    else shardAd += 5.4
  } else if (slot.shardFlex === 'ms') {
    bonusMsPercent += 0.02
  } else if (slot.shardFlex === 'scaling_hp') {
    shardHp += Math.round(10 + (170 * (lvl - 1)) / 17)
  }

  // Row 3: Defensive
  if (slot.shardDefensive === 'scaling_hp') {
    shardHp += Math.round(10 + (170 * (lvl - 1)) / 17)
  } else if (slot.shardDefensive === 'tenacity') {
    shardTenacity += 10
  } else if (slot.shardDefensive === 'flat_hp') {
    shardHp += 65
  }

  // Apply shards to totals
  bonusHp += shardHp
  bonusArmor += shardArmor
  bonusMr += shardMr
  bonusAd += shardAd
  bonusAp += shardAp
  bonusAsPercent += shardAsPercent
  bonusHaste += shardHaste
  bonusTenacity += shardTenacity

  // --- APPLY RUNE PASSIVES (Full stacks assumed for stacking runes) ---
  let basicAbilityHaste = 0
  let hasConditioning = false
  let hasOvergrowth = false
  const allSelectedRunes = [
    slot.primaryKeystone,
    slot.primaryRune1,
    slot.primaryRune2,
    slot.primaryRune3,
    slot.secondaryRune1,
    slot.secondaryRune2,
  ]

  for (const rune of allSelectedRunes) {
    if (!rune) continue
    const key = rune.key

    // --- PRECISION ---
    // Legend: Alacrity — 3% AS base + 1.5% per stack (max 10) = 18% AS
    if (key === 'LegendAlacrity') {
      bonusAsPercent += 0.03 + (0.015 * 10)
    }

    // Legend: Haste — 1.5 AH per stack (max 10) = 15 basic AH (only basic abilities)
    if (key === 'LegendHaste') {
      basicAbilityHaste += 1.5 * 10
    }

    // Legend: Bloodline — 0.45% LS per stack (max 15) = 6.75% LS + 85 HP at full
    if (key === 'LegendBloodline') {
      bonusLifeSteal += 0.45 * 15
      bonusHp += 85
    }

    // --- SORCERY ---
    // Transcendence — +5 AH at level 5, +5 AH at level 8
    if (key === 'Transcendence') {
      if (lvl >= 5) bonusHaste += 5
      if (lvl >= 8) bonusHaste += 5
    }

    // Celerity — +1% MS + 7% amplification of MS bonuses
    if (key === 'Celerity') {
      bonusMsPercent += 0.01
    }

    // Absolute Focus — up to 18 AD or 30 AP (based on level, assume >70% HP active)
    if (key === 'AbsoluteFocus') {
      const adBonus = 1.8 + (16.2 * (lvl - 1)) / 17
      const apBonus = 3 + (27 * (lvl - 1)) / 17
      if (isApAdaptive) bonusAp += apBonus
      else bonusAd += adBonus
    }

    // Manaflow Band — +250 max mana at full stacks (only for Mana champions)
    if (key === 'ManaflowBand' && slot.champion?.partype === 'Mana') {
      bonusMp += 250
    }

    // --- RESOLVE ---
    // Conditioning — +8 Armor, +8 MR, +3% both (after 12 min, assume active)
    if (key === 'Conditioning') {
      bonusArmor += 8
      bonusMr += 8
      hasConditioning = true
    }

    // Overgrowth — +3 HP per 8 absorbed, max 120 = 45 HP + 3.5% max HP at full
    if (key === 'Overgrowth') {
      bonusHp += 45
      hasOvergrowth = true
    }

    // --- INSPIRATION ---
    // Magical Footwear — +10 MS (only if wearing boots)
    if (key === 'MagicalFootwear') {
      const hasBoot = slot.items.some(item => item && item.tags.includes('Boots'))
      if (hasBoot) bonusMsFlat += 10
    }

    // Biscuit Delivery — +30 HP per biscuit consumed, 3 biscuits = +90 HP
    if (key === 'BiscuitDelivery') {
      bonusHp += 90
    }

    // Jack Of All Trades — 1 AH per unique item stat, +10 AF at 5 stacks, +25 AF at 10 stacks
    if (key === 'JackOfAllTrades') {
      const uniqueStats = new Set<string>()
      for (const item of slot.items) {
        if (!item) continue
        const s = item.stats
        if (s.FlatHPPoolMod) uniqueStats.add('hp')
        if (s.FlatMPPoolMod) uniqueStats.add('mp')
        if (s.FlatArmorMod) uniqueStats.add('armor')
        if (s.FlatSpellBlockMod) uniqueStats.add('mr')
        if (s.FlatPhysicalDamageMod) uniqueStats.add('ad')
        if (s.FlatMagicDamageMod) uniqueStats.add('ap')
        if (s.PercentAttackSpeedMod) uniqueStats.add('as')
        if (s.FlatMovementSpeedMod) uniqueStats.add('ms')
        if (s.FlatCritChanceMod) uniqueStats.add('crit')
        if (s.PercentMovementSpeedMod) uniqueStats.add('ms%')
      }
      const stacks = uniqueStats.size
      bonusHaste += stacks // 1 AH per stack
      if (stacks >= 10) {
        if (isApAdaptive) bonusAp += 25
        else bonusAd += 25 * 0.6
      } else if (stacks >= 5) {
        if (isApAdaptive) bonusAp += 10
        else bonusAd += 10 * 0.6
      }
    }
  }

  // Apply Conditioning 3% multiplier
  if (hasConditioning) {
    bonusArmor = bonusArmor * 1.03
    bonusMr = bonusMr * 1.03
  }

  // --- APPLY ITEM PASSIVES (Parsed from DDragon descriptions) ---
  let apMultiplier = 1.0
  let bonusApFromMana = 0
  let bonusAdFromMana = 0
  let bonusApFromHp = 0
  let bonusAdFromHp = 0

  for (const item of slot.items) {
    if (!item) continue
    const name = item.name.toLowerCase()
    const desc = item.description.toLowerCase()

    // 1. Rabadon's Deathcap: Increases AP by X%
    if (name.includes("rabadon's deathcap")) {
      const match = desc.match(/ability power by (\d+)%/i)
      const percent = match ? parseInt(match[1] || '30') : 30
      apMultiplier += percent / 100
    }

    // 2. Seraph's Embrace / Archangel's Staff: AP from bonus mana
    if (usesMana && (name.includes("seraph's embrace") || name.includes("archangel's staff"))) {
      const match = desc.match(/(\d+)%\s*(?:of\s*)?bonus\s*mana/i)
      const pct = match ? parseInt(match[1] || '0') : (name.includes("seraph") ? 2 : 1)
      bonusApFromMana += bonusMp * (pct / 100)
    }

    // 3. Muramana / Manamune: AD from max mana
    if (usesMana && (name.includes("muramana") || name.includes("manamune"))) {
      const match = desc.match(/(\d+(?:\.\d+)?)%\s*(?:of\s*)?(?:max\s*|total\s*)?mana/i)
      const pct = match ? parseFloat(match[1] || '2.5') : 2.5
      const maxMana = baseMp + bonusMp
      bonusAdFromMana += maxMana * (pct / 100)
    }

    // 4. Overlord's Bloodmail (Tyranny): AD from bonus health
    if (name.includes("overlord's bloodmail")) {
      const match = desc.match(/(\d+)%\s*(?:of\s*)?bonus\s*health/i)
      const pct = match ? parseInt(match[1] || '2') : 2
      bonusAdFromHp += bonusHp * (pct / 100)
    }

    // 5. Riftmaker: AP from bonus health
    if (name.includes("riftmaker")) {
      const match = desc.match(/(\d+)%\s*(?:of\s*)?bonus\s*health/i)
      const pct = match ? parseInt(match[1] || '2') : 2
      bonusApFromHp += bonusHp * (pct / 100)
    }

    // 6. Titanic Hydra: AD from max health
    if (name.includes("titanic hydra")) {
      const maxHp = baseHp + bonusHp
      bonusAdFromHp += maxHp * 0.015
    }
  }

  bonusAp += bonusApFromMana + bonusApFromHp
  bonusAd += bonusAdFromMana + bonusAdFromHp

  // Calculate HP/MP Regen
  const baseHpRegen = calculateStatForLevel(stats.hpregen, stats.hpregenperlevel, lvl)
  const baseMpRegen = usesMana ? calculateStatForLevel(stats.mpregen, stats.mpregenperlevel, lvl) : 0
  let bonusHpRegenPct = 0
  let bonusMpRegenPct = 0

  for (const item of slot.items) {
    if (!item) continue
    const parsed = parseStatsFromDescription(item.description)
    bonusHpRegenPct += parsed.hpRegenPercent
    if (usesMana) bonusMpRegenPct += parsed.manaRegenPercent
  }

  const totalHpRegen = Math.round((baseHpRegen * (1 + bonusHpRegenPct / 100)) * 10) / 10
  const totalMpRegen = usesMana ? Math.round((baseMpRegen * (1 + bonusMpRegenPct / 100)) * 10) / 10 : 0

  // Calculate Totals
  let totalHp = Math.round(baseHp + bonusHp)
  if (hasOvergrowth) totalHp = Math.round(totalHp * 1.035)
  const totalMp = Math.round(baseMp + bonusMp)
  const totalArmor = Math.round(baseArmor + bonusArmor)
  const totalMr = Math.round(baseMr + bonusMr)
  const totalAd = Math.round(baseAd + bonusAd)
  const totalAp = Math.round((0 + bonusAp) * apMultiplier)
  const totalAs = calculateAttackSpeedForLevel(
    stats.attackspeed,
    stats.attackspeedratio,
    stats.attackspeedperlevel,
    lvl,
    bonusAsPercent,
  )

  // Move Speed soft caps (LoL mechanics: >415 = 80%, >490 = 50%)
  const rawMs = (baseMs + bonusMsFlat) * (1 + bonusMsPercent)
  let totalMs = Math.round(rawMs)
  if (rawMs > 490) {
    totalMs = Math.round(rawMs * 0.5 + 230)
  } else if (rawMs > 415) {
    totalMs = Math.round(rawMs * 0.8 + 83)
  }

  const totalRange = baseRange
  const totalCrit = Math.min(100, Math.round(bonusCrit))
  const totalLethality = Math.round(bonusLethality)
  const totalArmorPen = Math.round(bonusArmorPen)
  const totalMagicPenFlat = Math.round(bonusMagicPenFlat)
  const totalMagicPenPercent = Math.round(bonusMagicPenPercent)
  const totalHaste = Math.round(bonusHaste)
  const cdrPercent = Math.round((totalHaste / (totalHaste + 100)) * 100)
  const totalLifeSteal = Math.round(bonusLifeSteal)
  const totalOmnivamp = Math.round(bonusOmnivamp)
  const totalTenacity = Math.round(bonusTenacity)

  return {
    partype: champ.partype,
    hp: { base: baseHp, bonus: bonusHp, total: totalHp },
    mp: { base: baseMp, bonus: bonusMp, total: totalMp },
    armor: { base: baseArmor, bonus: bonusArmor, total: totalArmor },
    mr: { base: baseMr, bonus: bonusMr, total: totalMr },
    ad: { base: baseAd, bonus: bonusAd, total: totalAd },
    ap: { base: 0, bonus: bonusAp, total: totalAp },
    as: { base: baseAs, bonus: totalAs - baseAs, total: totalAs },
    ms: { base: baseMs, bonus: totalMs - baseMs, total: totalMs, raw: Math.round(rawMs) },
    range: { base: baseRange, bonus: 0, total: totalRange },
    crit: { base: 0, bonus: bonusCrit, total: totalCrit },
    lethality: { base: 0, bonus: bonusLethality, total: totalLethality },
    armorPen: { base: 0, bonus: bonusArmorPen, total: totalArmorPen },
    magicPenFlat: { base: 0, bonus: bonusMagicPenFlat, total: totalMagicPenFlat },
    magicPenPercent: { base: 0, bonus: bonusMagicPenPercent, total: totalMagicPenPercent },
    abilityHaste: { base: 0, bonus: bonusHaste, total: totalHaste, cdrPercent },
    basicAbilityHaste,
    lifeSteal: { base: 0, bonus: bonusLifeSteal, total: totalLifeSteal },
    omnivamp: { base: 0, bonus: bonusOmnivamp, total: totalOmnivamp },
    tenacity: { base: 0, bonus: bonusTenacity, total: totalTenacity },
    hpRegen: { base: baseHpRegen, bonus: Math.round((totalHpRegen - baseHpRegen) * 10) / 10, total: totalHpRegen },
    mpRegen: { base: baseMpRegen, bonus: Math.round((totalMpRegen - baseMpRegen) * 10) / 10, total: totalMpRegen },
  }
}
