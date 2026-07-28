/**
 * Monster & Objective Buff Service
 *
 * Provides official League of Legends formulas and stat modifiers for:
 * - 6 Elemental Dragons (Infernal, Mountain, Ocean, Cloud, Hextech, Chemtech)
 * - 6 Dragon Souls
 * - Elder Dragon (Aspect of the Dragon burn + 20% Execute)
 * - Baron Nashor (Hand of Baron +40 AD / +80 AP)
 * - Red Buff (Crest of Cinders burn & slow)
 * - Blue Buff (Crest of Insight +10 AH & Mana Regen)
 *
 * Sources: Authentic Riot Game Data in `out/monsters/`
 */

export interface SideBuffs {
  red: boolean
  blue: boolean
  baron: boolean
  elder: boolean
  infernal: number // 0 to 4
  mountain: number // 0 to 4
  ocean: number // 0 to 4
  cloud: number // 0 to 4
  hextech: number // 0 to 4
  chemtech: number // 0 to 4
  soul: string // 'none' | 'infernal' | 'mountain' | 'ocean' | 'cloud' | 'hextech' | 'chemtech'
}

export interface CalculatedMonsterBuffStats {
  bonusAD: number
  bonusAP: number
  adMultiplier: number
  apMultiplier: number
  armorMultiplier: number
  mrMultiplier: number
  bonusAH: number
  bonusTenacity: number
  bonusShield: number
}

/**
 * Calculates raw stat bonuses and percentage multipliers from active monster buffs
 */
export function calculateMonsterBuffStats(buffs: SideBuffs): CalculatedMonsterBuffStats {
  let bonusAD = 0
  let bonusAP = 0
  let adMultiplier = 1.0
  let apMultiplier = 1.0
  let armorMultiplier = 1.0
  let mrMultiplier = 1.0
  let bonusAH = 0
  let bonusTenacity = 0
  let bonusShield = 0

  // Baron Nashor: +40 AD, +80 AP
  if (buffs.baron) {
    bonusAD += 40
    bonusAP += 80
  }

  // Blue Buff: +10 Ability Haste
  if (buffs.blue) {
    bonusAH += 10
  }

  // Infernal Drake: +5% AD & AP per stack
  if (buffs.infernal > 0) {
    const inc = 0.05 * Math.min(4, buffs.infernal)
    adMultiplier += inc
    apMultiplier += inc
  }

  // Mountain Drake: +8% Armor & MR per stack
  if (buffs.mountain > 0) {
    const inc = 0.08 * Math.min(4, buffs.mountain)
    armorMultiplier += inc
    mrMultiplier += inc
  }

  // Hextech Drake: +7.5 Ability Haste per stack
  if (buffs.hextech > 0) {
    bonusAH += 7.5 * Math.min(4, buffs.hextech)
  }

  // Chemtech Drake: +6% Tenacity per stack
  if (buffs.chemtech > 0) {
    bonusTenacity += 6 * Math.min(4, buffs.chemtech)
  }

  // Mountain Soul: +200 Shield
  if (buffs.soul === 'mountain') {
    bonusShield += 200
  }

  return {
    bonusAD,
    bonusAP,
    adMultiplier,
    apMultiplier,
    armorMultiplier,
    mrMultiplier,
    bonusAH,
    bonusTenacity,
    bonusShield,
  }
}

/**
 * Calculates Red Buff (Crest of Cinders) True Damage Burn based on champion level
 * Level scaling: 12 + 6 * (Level - 1)
 */
export function calculateRedBuffBurn(level: number): number {
  return 12 + 6 * (Math.max(1, level) - 1)
}

/**
 * Calculates Dragon Soul damage or shield effect
 */
export function calculateDragonSoulEffect(
  soulType: string,
  attackerStats: { ad: number; ap: number; bonusHp?: number },
): {
  name: string
  amount: number
  type: 'physical' | 'magic' | 'true' | 'shield' | 'adaptive'
} | null {
  const ad = attackerStats.ad || 0
  const ap = attackerStats.ap || 0
  const bonusHp = attackerStats.bonusHp || 0

  switch (soulType) {
    case 'infernal':
      // 80 (+22.5% bonus AD) (+13.5% AP) (+2.75% bonus HP) Adaptive Damage
      const infDmg = Math.round(80 + ad * 0.225 + ap * 0.135 + bonusHp * 0.0275)
      return { name: '🔥 Infernal Soul Explosion', amount: infDmg, type: 'adaptive' as const }

    case 'mountain':
      // 200 (+18% bonus AD) (+13.5% AP) (+13.5% bonus HP) Shield
      const mntShield = Math.round(200 + ad * 0.18 + ap * 0.135 + bonusHp * 0.135)
      return { name: '⛰️ Mountain Soul Shield', amount: mntShield, type: 'shield' }

    case 'ocean':
      // Restores 160 (+36% bonus AD) (+22.5% AP) (+9% bonus HP) Health
      const ocnHeal = Math.round(160 + ad * 0.36 + ap * 0.225 + bonusHp * 0.09)
      return { name: '🌊 Ocean Soul Restoration', amount: ocnHeal, type: 'shield' }

    case 'hextech':
      // 50 (+15% bonus AD) (+10% AP) True Damage chain lightning
      const hexDmg = Math.round(50 + ad * 0.15 + ap * 0.1)
      return { name: '⚡ Hextech Soul Lightning', amount: hexDmg, type: 'true' }

    case 'chemtech':
      // +11% damage while below 50% HP
      return { name: '☣️ Chemtech Soul (+11% Low HP Dmg)', amount: 11, type: 'true' }

    default:
      return null
  }
}

/**
 * Calculates Elder Dragon Aspect of the Dragon burn (75-225 True Damage over 3s)
 */
export function calculateElderBurn(level: number): number {
  return Math.round(75 + (150 / 17) * (Math.max(1, level) - 1))
}
