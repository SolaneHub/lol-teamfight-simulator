import type { DraftSlot } from '@/types'
import { getChampionDefaultAdaptiveType } from '../champions/championService'
import { parseStatsFromDescription } from '../items/itemService'

/**
 * Formula ufficiale di Riot Games per il calcolo delle statistiche in base al livello.
 */
export const calculateStatForLevel = (
  base?: number,
  growth?: number,
  level: number = 1,
): number => {
  const safeBase = typeof base === 'number' && !isNaN(base) ? base : 0
  const safeGrowth = typeof growth === 'number' && !isNaN(growth) ? growth : 0
  if (level === 1) return safeBase
  const modifier = (level - 1) * (0.7025 + 0.0175 * (level - 1))
  return Math.round((safeBase + safeGrowth * modifier) * 100) / 100
}

/**
 * Calcola l'Attack Speed totale al livello specificato secondo la formula di Riot Games.
 */
export const calculateAttackSpeedForLevel = (
  base?: number,
  ratio?: number,
  growth?: number,
  level: number = 1,
  bonus: number = 0,
): number => {
  const safeBase = typeof base === 'number' && !isNaN(base) ? base : 0.625
  const safeRatio = typeof ratio === 'number' && !isNaN(ratio) ? ratio : safeBase
  const safeGrowth = typeof growth === 'number' && !isNaN(growth) ? growth : 0
  const safeBonus = typeof bonus === 'number' && !isNaN(bonus) ? bonus : 0

  if (level === 1) {
    return Math.round((safeBase + safeBonus * safeRatio) * 1000) / 1000
  }
  const modifier = (level - 1) * (0.7025 + 0.0175 * (level - 1))
  const growthBonus = (safeGrowth / 100) * modifier
  const totalAs = safeBase + (safeBonus + growthBonus) * safeRatio
  return Math.round(totalAs * 1000) / 1000
}

/**
 * Calcola l'incremento di una statistica ottenuto salendo a un determinato livello (es. da 9 a 10).
 */
export const calculateStatIncreaseForLevel = (growth?: number, level: number = 1): number => {
  if (level < 2) return 0
  const safeGrowth = typeof growth === 'number' && !isNaN(growth) ? growth : 0
  const coef = 0.65 + 0.035 * level
  return Math.round(safeGrowth * coef * 100) / 100
}

/**
 * Calcola le statistiche totali per un DraftSlot.
 */
export const calculateStats = (slot: DraftSlot) => {
  if (!slot || !slot.champion) return null

  const champ = slot.champion
  const stats = champ.stats || {}
  const lvl = slot.level || 1

  const usesMana = champ.partype === 'Mana'

  // Calculate Base Stats at Level L using the custom formulas
  const baseHp = calculateStatForLevel(stats.hp, stats.hpperlevel, lvl)
  const baseMp = usesMana ? calculateStatForLevel(stats.mp, stats.mpperlevel, lvl) : stats.mp || 0
  const baseArmor = calculateStatForLevel(stats.armor, stats.armorperlevel, lvl)
  const baseMr = calculateStatForLevel(
    stats.spellblock ?? stats.magicResist,
    stats.spellblockperlevel ?? stats.magicResistPerLevel,
    lvl,
  )
  const baseAd = calculateStatForLevel(stats.attackdamage, stats.attackdamageperlevel, lvl)
  const baseAs = calculateAttackSpeedForLevel(
    stats.attackspeed,
    stats.attackspeedratio ?? stats.attackspeed,
    stats.attackspeedperlevel,
    lvl,
    0,
  )
  const baseMs = stats.movespeed || 330
  const baseRange = stats.attackrange || 125

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

  for (let i = 0; i < (slot.items || []).length; i++) {
    const item = slot.items[i]
    if (!item) continue
    const isMasterwork = slot.masterworkItems && slot.masterworkItems[i] === true
    const s = item.stats || {}

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
    bonusCrit += s.FlatCritChanceMod ? s.FlatCritChanceMod * 100 : parsed.critChance
    bonusLethality += parsed.lethality
    bonusArmorPen += parsed.armorPenPercent
    bonusMagicPenFlat += parsed.magicPenFlat
    bonusMagicPenPercent += parsed.magicPenPercent
    bonusHaste += parsed.abilityHaste + (isMasterwork && parsed.abilityHaste > 0 ? 10 : 0)
    bonusLifeSteal += s.PercentLifeStealMod ? s.PercentLifeStealMod * 100 : parsed.lifeSteal
    bonusOmnivamp += parsed.omnivamp
  }

  // Sum Shards
  let shardHp = 0
  let shardArmor = 0
  let shardMr = 0
  let shardAd = 0
  let shardAp = 0
  let shardHaste = 0
  let shardMsPct = 0
  let shardTenacity = 0

  if (slot.statShards && Array.isArray(slot.statShards)) {
    for (const shard of slot.statShards) {
      if (!shard) continue
      if (shard === 'health') shardHp += 65
      else if (shard === 'scalingHealth') shardHp += 10 + (lvl - 1) * 9
      else if (shard === 'armor') shardArmor += 6
      else if (shard === 'magicResist') shardMr += 8
      else if (shard === 'adaptive') {
        shardAd += 5.4
        shardAp += 9
      } else if (shard === 'attackSpeed') bonusAsPercent += 0.1
      else if (shard === 'abilityHaste') shardHaste += 8
      else if (shard === 'moveSpeed') shardMsPct += 0.02
      else if (shard === 'tenacity') shardTenacity += 10
    }
  }

  bonusHp += shardHp
  bonusArmor += shardArmor
  bonusMr += shardMr
  bonusHaste += shardHaste
  bonusMsPercent += shardMsPct
  bonusTenacity += shardTenacity

  // Determine Adaptive Type (AP vs AD)
  let isApAdaptive = false
  if (bonusAp > bonusAd) {
    isApAdaptive = true
  } else if (bonusAd > bonusAp) {
    isApAdaptive = false
  } else if (slot.champion) {
    isApAdaptive = getChampionDefaultAdaptiveType(slot.champion.id, slot.champion.tags) === 'AP'
  }

  if (isApAdaptive) {
    bonusAp += shardAp
  } else {
    bonusAd += shardAd
  }

  // Sum Rune Passives
  let hasOvergrowth = false
  if (slot.runes && Array.isArray(slot.runes)) {
    for (const rune of slot.runes) {
      if (!rune) continue
      const runeName = (rune.name || '').toLowerCase()
      if (runeName.includes('overgrowth')) {
        hasOvergrowth = true
      } else if (runeName.includes('conditioning') && lvl >= 12) {
        bonusArmor += 8
        bonusMr += 8
        bonusArmor = bonusArmor * 1.03
        bonusMr = bonusMr * 1.03
      } else if (runeName.includes('legend: alacrity')) {
        bonusAsPercent += 0.18
      } else if (runeName.includes('legend: bloodline')) {
        bonusLifeSteal += 5.35
      } else if (runeName.includes('legend: haste')) {
        bonusHaste += 15
      }
    }
  }

  // --- APPLY ITEM PASSIVES (Parsed from DDragon descriptions) ---
  let apMultiplier = 1.0
  let bonusApFromMana = 0
  let bonusAdFromMana = 0
  let bonusApFromHp = 0
  let bonusAdFromHp = 0

  for (const item of slot.items || []) {
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
      const pct = match ? parseInt(match[1] || '0') : name.includes('seraph') ? 2 : 1
      bonusApFromMana += bonusMp * (pct / 100)
    }

    // 3. Muramana / Manamune: AD from max mana
    if (usesMana && (name.includes('muramana') || name.includes('manamune'))) {
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
    if (name.includes('riftmaker')) {
      const match = desc.match(/(\d+)%\s*(?:of\s*)?bonus\s*health/i)
      const pct = match ? parseInt(match[1] || '2') : 2
      bonusApFromHp += bonusHp * (pct / 100)
    }

    // 6. Titanic Hydra: AD from max health
    if (name.includes('titanic hydra')) {
      const maxHp = baseHp + bonusHp
      bonusAdFromHp += maxHp * 0.015
    }

    // 7. Dawncore: AP from Base Mana Regen (10 AP per 100% Base Mana Regen)
    if (name.includes('dawncore')) {
      let totalManaRegenPct = 0
      for (const it of slot.items) {
        if (!it) continue
        const p = parseStatsFromDescription(it.description)
        totalManaRegenPct += p.manaRegenPercent
      }
      const stacks = Math.floor(totalManaRegenPct / 100)
      bonusAp += stacks * 10
    }

    // 8. Jak'Sho, The Protean: +30% bonus Armor & MR
    if (name.includes("jak'sho")) {
      bonusArmor = bonusArmor * 1.3
      bonusMr = bonusMr * 1.3
    }

    // Blackfire Torch AP bonus is applied dynamically in combat (CalculatorView) per target affected
  }

  bonusAp += bonusApFromMana + bonusApFromHp
  bonusAd += bonusAdFromMana + bonusAdFromHp

  // Calculate HP/MP Regen
  const baseHpRegen = calculateStatForLevel(stats.hpregen, stats.hpregenperlevel, lvl)
  const baseMpRegen = usesMana
    ? calculateStatForLevel(stats.mpregen, stats.mpregenperlevel, lvl)
    : 0
  let bonusHpRegenPct = 0
  let bonusMpRegenPct = 0

  for (const item of slot.items || []) {
    if (!item) continue
    const parsed = parseStatsFromDescription(item.description)
    bonusHpRegenPct += parsed.hpRegenPercent
    if (usesMana) bonusMpRegenPct += parsed.manaRegenPercent
  }

  const totalHpRegen = Math.round(baseHpRegen * (1 + bonusHpRegenPct / 100) * 10) / 10
  const totalMpRegen = usesMana
    ? Math.round(baseMpRegen * (1 + bonusMpRegenPct / 100) * 10) / 10
    : 0

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
    stats.attackspeedratio ?? stats.attackspeed,
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
    hpRegen: { base: baseHpRegen, bonusPercent: bonusHpRegenPct, total: totalHpRegen },
    mpRegen: { base: baseMpRegen, bonusPercent: bonusMpRegenPct, total: totalMpRegen },
    lifeSteal: { base: 0, bonus: bonusLifeSteal, total: totalLifeSteal },
    omnivamp: { base: 0, bonus: bonusOmnivamp, total: totalOmnivamp },
    tenacity: { base: 0, bonus: bonusTenacity, total: totalTenacity },
  }
}
