import type { Item } from '../../types'

export interface ItemPassiveState {
  hasRabadon: boolean
  hasVoidStaff: boolean
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
  hasMalignance: boolean
  hasSunfire: boolean
  hasHollowRadiance: boolean
  hasNashors: boolean
  hasGuinsoo: boolean
  hasGunblade: boolean
  hasRocketbelt: boolean
  hasDuskAndDawn: boolean
  hasImperialMandate: boolean
  hasHorizonFocus: boolean
  hasRylais: boolean
  hasMorellonomicon: boolean
  hasArchangels: boolean
  hasSeraphs: boolean
  hasRodOfAges: boolean
  hasCosmicDrive: boolean
  hasCryptbloom: boolean
  hasBansheesVeil: boolean
  hasZhonyas: boolean
  hasActualizer: boolean
  hasArdentCenser: boolean
  hasStaffOfFlowingWater: boolean
  hasEchoesOfHelia: boolean
  hasMoonstone: boolean
  hasShurelyas: boolean
  hasDawncore: boolean
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
    hasVoidStaff: check(['void staff', 'bastone del vuoto'], ['3135', '223135', '773135']),
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
    hasMalignance: check(['malignance', 'malignità'], ['3118', '223118']),
    hasSunfire: check(['sunfire', 'egida del sole'], ['3068']),
    hasHollowRadiance: check(['hollow radiance', 'irradiazione vuota'], ['2502', '3002']),
    hasNashors: check(["nashor's tooth", 'dente di nashor', 'nashor'], ['3115', '223115']),
    hasGuinsoo: check(["guinsoo's rageblade", 'furia di guinsoo', 'rageblade'], ['3124', '223124']),
    hasGunblade: check(
      ['hextech gunblade', 'pistola a lame hextech', 'gunblade'],
      ['3146', '223146'],
    ),
    hasRocketbelt: check(
      ['hextech rocketbelt', 'cintura a razzo hextech', 'rocketbelt', 'protobelt'],
      ['3152', '223152'],
    ),
    hasDuskAndDawn: check(['dusk and dawn', 'crepuscolo e alba'], ['3123', '223123']),
    hasImperialMandate: check(['imperial mandate', 'mandato imperiale'], ['4005', '224005']),
    hasHorizonFocus: check(['horizon focus', "concentrazione dell'orizzonte"], ['4628', '224628']),
    hasRylais: check(
      ["rylai's crystal scepter", 'scettro di cristallo di rylai', 'rylai'],
      ['3116', '223116'],
    ),
    hasMorellonomicon: check(['morellonomicon'], ['3165', '223165']),
    hasArchangels: check(
      ["archangel's staff", "bastone dell'arcangelo", 'archangel'],
      ['3003', '223003'],
    ),
    hasSeraphs: check(["seraph's embrace", 'abbraccio serafico', 'seraph'], ['3040', '223040']),
    hasRodOfAges: check(['rod of ages', 'bastone delle ere'], ['6657', '226657']),
    hasCosmicDrive: check(['cosmic drive', 'impulso cosmico'], ['4629', '224629']),
    hasCryptbloom: check(['cryptbloom', 'fioritura tombale'], ['3137', '223137']),
    hasBansheesVeil: check(["banshee's veil", 'velo della banshee'], ['3102', '223102']),
    hasZhonyas: check(["zhonya's hourglass", 'clessidra di zhonya', 'zhonya'], ['3157', '223157']),
    hasActualizer: check(['actualizer', 'attuatore'], ['8008', '228008']),
    hasArdentCenser: check(['ardent censer', 'incensiere ardente'], ['3504', '223504']),
    hasStaffOfFlowingWater: check(
      ['staff of flowing water', "bastone dell'acqua fluente"],
      ['6616', '226616'],
    ),
    hasEchoesOfHelia: check(['echoes of helia', 'echi di helia'], ['6620', '226620']),
    hasMoonstone: check(
      ['moonstone renewer', 'rinnovatore della pietra di luna', 'moonstone'],
      ['6617', '226617'],
    ),
    hasShurelyas: check(
      ["shurelya's battlesong", 'canto di guerra di shurelya', 'shurelya'],
      ['2065', '222065'],
    ),
    hasDawncore: check(['dawncore', "nucleo dell'aurora"], ['6621', '226621']),
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

  // 8. Nashor's Tooth (Icathian Bite: 15 + 15% AP on-hit)
  if (passives.hasNashors && action === 'AA') {
    results.push({
      name: "Nashor's Tooth (Icathian Bite)",
      rawDmg: 15 + attacker.ap * 0.15,
      dmgType: 'magic',
    })
  }

  // 9. Guinsoo's Rageblade (Wrath: 30 magic damage on-hit)
  if (passives.hasGuinsoo && action === 'AA') {
    results.push({
      name: "Guinsoo's Rageblade (Wrath)",
      rawDmg: 30,
      dmgType: 'magic',
    })
  }

  // 10. Hextech Gunblade (Lightning Bolt: 150-250 + 30% AP on ability)
  if (passives.hasGunblade && isAbility) {
    results.push({
      name: 'Hextech Gunblade (Lightning Bolt)',
      rawDmg: 150 + attacker.level * 5 + attacker.ap * 0.3,
      dmgType: 'magic',
    })
  }

  // 11. Hextech Rocketbelt (Supersonic: 125 + 15% AP on ability)
  if (passives.hasRocketbelt && isAbility) {
    results.push({
      name: 'Hextech Rocketbelt (Supersonic)',
      rawDmg: 125 + attacker.ap * 0.15,
      dmgType: 'magic',
    })
  }

  // 12. Dusk and Dawn (Spellblade: 100% Base AD + 50% AP on spell cast)
  if (passives.hasDuskAndDawn && isSpellCast) {
    results.push({
      name: 'Dusk and Dawn (Spellblade)',
      rawDmg: attacker.baseAd * 1.0 + attacker.ap * 0.5,
      dmgType: 'magic',
    })
  }

  // 13. Imperial Mandate (Command: 60 + 3.5/lvl on ability)
  if (passives.hasImperialMandate && isAbility) {
    results.push({
      name: 'Imperial Mandate (Command)',
      rawDmg: 60 + attacker.level * 3.5,
      dmgType: 'magic',
    })
  }

  // 14. Echoes of Helia (Soul Siphon: 60 + 3/lvl on ability)
  if (passives.hasEchoesOfHelia && isAbility) {
    results.push({
      name: 'Echoes of Helia (Soul Siphon)',
      rawDmg: 60 + attacker.level * 3,
      dmgType: 'magic',
    })
  }

  // 15. Ardent Censer (Sanctify: 20 on-hit on AA)
  if (passives.hasArdentCenser && action === 'AA') {
    results.push({
      name: 'Ardent Censer (Sanctify)',
      rawDmg: 20,
      dmgType: 'magic',
    })
  }

  return results
}
