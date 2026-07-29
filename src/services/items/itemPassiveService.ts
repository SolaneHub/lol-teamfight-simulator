import type { Item } from '../../types'

export interface ItemPassiveState {
  hasRabadon: boolean
  hasBlackfireTorch: boolean
  hasLudens: boolean
  hasLiandrys: boolean
  hasMuramana: boolean
  hasBlackCleaver: boolean
  hasBloodletter: boolean
  hasAbyssalMask: boolean
  hasBork: boolean
  hasKraken: boolean
  hasLichBane: boolean
  hasTrinityForce: boolean
  hasIceborn: boolean
  hasStormsurge: boolean
  hasShadowflame: boolean
  hasRiftmaker: boolean
  hasJaksho: boolean
  hasTerminus: boolean
  hasOverlord: boolean
}

export interface ItemDamageResult {
  name: string
  rawDmg: number
  dmgType: 'physical' | 'magic' | 'true'
}

/**
 * Detects active item passives from an array of equipped items.
 */
export function detectItemPassives(items: (Item | null | undefined)[]): ItemPassiveState {
  const activeItems = (items || []).filter((i): i is Item => Boolean(i))

  const check = (keywords: string[], ids: string[]) =>
    activeItems.some((i) => {
      const name = (i.name || '').toLowerCase()
      return keywords.some((k) => name.includes(k)) || ids.includes(i.id)
    })

  return {
    hasRabadon: check(['rabadon'], ['3089']),
    hasBlackfireTorch: check(['blackfire', 'fuoco nero'], ['2503', '3009', '8021']),
    hasLudens: check(['luden'], ['6655', '3188', '226655']),
    hasLiandrys: check(['liandry'], ['3151']),
    hasMuramana: check(['muramana', 'manamune'], ['3004', '3042']),
    hasBlackCleaver: check(['black cleaver', 'mannaia nera'], ['3071']),
    hasBloodletter: check(["bloodletter's curse", 'maledizione del sanguisuga'], ['8010', '4010']),
    hasAbyssalMask: check(['abyssal mask', "maschera dell'abisso"], ['8020', '3001']),
    hasBork: check(['blade of the ruined king', 'lama del re in rovina', 'bork'], ['3153']),
    hasKraken: check(['kraken slayer', 'uccisore del kraken'], ['6672']),
    hasLichBane: check(['lich bane', 'flagello della liche'], ['3100']),
    hasTrinityForce: check(['trinity force', 'forza della trinità'], ['3078']),
    hasIceborn: check(['iceborn gauntlet', 'guanto del gelo'], ['6662']),
    hasStormsurge: check(['stormsurge', 'impeto della tempesta'], ['6653']),
    hasShadowflame: check(['shadowflame', "fiamma d'ombra"], ['4645']),
    hasRiftmaker: check(['riftmaker', 'creatore di fratture'], ['4633']),
    hasJaksho: check(["jak'sho"], ['6665']),
    hasTerminus: check(['terminus'], ['3302']),
    hasOverlord: check(["overlord's bloodmail"], ['6664']),
  }
}

/**
 * Calculates item-based bonus damage passives (on-hit or on-ability).
 */
export function calculateItemDamagePassives(input: {
  action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'
  passives: ItemPassiveState
  attacker: {
    ad: number
    baseAd: number
    ap: number
    level: number
    hp: number
    maxHp: number
    mana: number
    isRanged: boolean
  }
  defender: {
    currentHp: number
    maxHp: number
  }
}): ItemDamageResult[] {
  const { action, passives, attacker, defender } = input
  const results: ItemDamageResult[] = []

  const isAbility = ['Q', 'W', 'E', 'R', 'P'].includes(action)
  const isSpellCast = ['Q', 'W', 'E', 'R'].includes(action)

  // 1. Blackfire Torch (Baleful Blaze: 60 + 6% AP magic burn over 3s)
  if (passives.hasBlackfireTorch && isAbility) {
    results.push({
      name: 'Blackfire Torch Burn',
      rawDmg: 60 + attacker.ap * 0.06,
      dmgType: 'magic',
    })
  }

  // 2. Luden's Companion / Echo (Echo Shot: 75 + 5% AP magic burst)
  if (passives.hasLudens && isAbility) {
    results.push({
      name: "Luden's Echo Burst",
      rawDmg: 75 + attacker.ap * 0.05,
      dmgType: 'magic',
    })
  }

  // 3. Liandry's Torment (2% Max HP magic burn per sec over 3s)
  if (passives.hasLiandrys && isAbility) {
    results.push({
      name: "Liandry's Torment Burn",
      rawDmg: defender.maxHp * 0.02 * 3,
      dmgType: 'magic',
    })
  }

  // 4. Muramana (Shock: % max mana + AD on ability / % max mana on AA)
  if (passives.hasMuramana) {
    if (action === 'AA') {
      results.push({
        name: 'Muramana Shock (AA)',
        rawDmg: attacker.mana * 0.015,
        dmgType: 'physical',
      })
    } else if (isAbility) {
      const manaPct = attacker.isRanged ? 0.027 : 0.035
      results.push({
        name: 'Muramana Shock (Spell)',
        rawDmg: attacker.mana * manaPct + attacker.ad * 0.06,
        dmgType: 'physical',
      })
    }
  }

  // 5. Blade of the Ruined King (Bork: 10% melee / 6% ranged current HP on-hit)
  if (passives.hasBork && action === 'AA') {
    const hpPct = attacker.isRanged ? 0.06 : 0.1
    results.push({
      name: 'Blade of the Ruined King (On-Hit)',
      rawDmg: Math.max(15, defender.currentHp * hpPct),
      dmgType: 'physical',
    })
  }

  // 6. Spellblade (Lich Bane / Trinity Force / Iceborn Gauntlet) on Spell Cast
  if (isSpellCast) {
    if (passives.hasLichBane) {
      results.push({
        name: 'Lich Bane (Spellblade)',
        rawDmg: attacker.baseAd * 0.75 + attacker.ap * 0.45,
        dmgType: 'magic',
      })
    } else if (passives.hasTrinityForce) {
      results.push({
        name: 'Trinity Force (Spellblade)',
        rawDmg: attacker.baseAd * 2.0,
        dmgType: 'physical',
      })
    } else if (passives.hasIceborn) {
      results.push({
        name: 'Iceborn Gauntlet (Spellblade)',
        rawDmg: attacker.baseAd * 1.0,
        dmgType: 'physical',
      })
    }
  }

  // 7. Stormsurge (Squall: 140 + 20% AP magic burst)
  if (passives.hasStormsurge && isAbility) {
    results.push({
      name: 'Stormsurge Burst',
      rawDmg: 140 + attacker.ap * 0.2,
      dmgType: 'magic',
    })
  }

  return results
}
