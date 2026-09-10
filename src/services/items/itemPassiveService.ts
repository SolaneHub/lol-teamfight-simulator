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
  hasInfinityEdge: boolean
  hasLordDominik: boolean
  hasMortalReminder: boolean
  hasTheCollector: boolean
  hasYunTal: boolean
  hasStatikk: boolean
  hasRapidFirecannon: boolean
  hasRunaans: boolean
  hasNavori: boolean
  hasSunderedSky: boolean
  hasSteraksGage: boolean
  hasEclipse: boolean
  hasTitanicHydra: boolean
  hasRavenousHydra: boolean
  hasProfaneHydra: boolean
  hasDeathsDance: boolean
  hasMawOfMalmortius: boolean
  hasImmortalShieldbow: boolean
  hasSpearOfShojin: boolean
  hasHeartsteel: boolean
  hasHubris: boolean
  hasHullbreaker: boolean
  hasVoltaicCyclosword: boolean
  hasWitsEnd: boolean
  hasGuardianAngel: boolean
  hasThornmail: boolean
  hasBrambleVest: boolean
  hasFrozenHeart: boolean
  hasRanduinsOmen: boolean
  hasSpiritVisage: boolean
  hasKaenicRookern: boolean
  hasUnendingDespair: boolean
  hasFimbulwinter: boolean
  hasLocket: boolean
  hasZekes: boolean
  hasBloodsong: boolean
  hasZazZaks: boolean
  hasCelestialOpposition: boolean
  hasDreamMaker: boolean
  hasSolsticeSleigh: boolean
  hasSerpentsFang: boolean
  hasChempunkChainsword: boolean
  hasKnightsVow: boolean
  hasRedemption: boolean
  hasMikaelsBlessing: boolean
  hasTrailblazer: boolean
  hasEssenceReaver: boolean
  hasStridebreaker: boolean
  hasAxiomArc: boolean
  hasEdgeOfNight: boolean
  hasExperimentalHexplate: boolean
  hasPhantomDancer: boolean
  hasStormrazor: boolean
  hasDeadMansPlate: boolean
  hasMercurialScimitar: boolean
  hasYoumuusGhostblade: boolean
  hasUmbralGlaive: boolean
  hasWarmogsArmor: boolean
  hasForceOfNature: boolean
  hasTiamat: boolean
  hasHexdrinker: boolean
  hasHextechAlternator: boolean
  hasHauntingGuise: boolean
  hasWardensMail: boolean
  hasRecurveBow: boolean
  hasBandlepipes: boolean
  hasBastionbreaker: boolean
  hasEndlessHunger: boolean
  hasProtoplasmHarness: boolean
  hasFiendhunterBolts: boolean
  hasHexopticsC44: boolean
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
    hasInfinityEdge: check(['infinity edge', "frammento dell'infinito"], ['3031', '223031']),
    hasLordDominik: check(['lord dominik', 'saluti di lord dominik'], ['3036', '223036']),
    hasMortalReminder: check(['mortal reminder', 'promemoria mortale'], ['3033', '223033']),
    hasTheCollector: check(['collector', 'il collezionista'], ['6676', '226676']),
    hasYunTal: check(
      ['yun tal', 'frecce selvagge di yun tal', 'yuntal'],
      ['6677', '226677', '3032', '223032'],
    ),
    hasStatikk: check(['statikk', 'pugnale di statikk'], ['3087', '223087']),
    hasRapidFirecannon: check(
      ['rapid firecannon', 'cannone a ripetizione', 'fuoco rapido'],
      ['3094', '223094'],
    ),
    hasRunaans: check(['runaan', 'uragano di runaan'], ['3085', '223085']),
    hasNavori: check(['navori', 'lame rapide dei navori', 'flickerblade'], ['6675', '226675']),
    hasSunderedSky: check(['sundered sky', 'cielo infranto'], ['6610', '226610']),
    hasSteraksGage: check(['sterak', 'furia di sterak', 'guanto di sterak'], ['3053', '223053']),
    hasEclipse: check(['eclipse', 'eclissi'], ['6692', '226692']),
    hasTitanicHydra: check(['titanic hydra', 'idra titanica'], ['3748', '223748']),
    hasRavenousHydra: check(['ravenous hydra', 'idra famelica'], ['3074', '223074']),
    hasProfaneHydra: check(['profane hydra', 'idra profana'], ['6698', '226698']),
    hasDeathsDance: check(
      ["death's dance", 'danza della morte'],
      ['3060', '223060', '6333', '226333'],
    ),
    hasMawOfMalmortius: check(['maw of malmortius', 'fauce di malmortius'], ['3156', '223156']),
    hasImmortalShieldbow: check(
      ['immortal shieldbow', 'arco scudo immortale', 'shieldbow'],
      ['6673', '226673'],
    ),
    hasSpearOfShojin: check(['spear of shojin', 'lancia di shojin', 'shojin'], ['3161', '223161']),
    hasHeartsteel: check(['heartsteel', "cuore d'acciaio"], ['3084', '223084']),
    hasHubris: check(['hubris', 'superbia'], ['6697', '226697']),
    hasHullbreaker: check(['hullbreaker', 'demolitore di scafi'], ['3181', '223181']),
    hasVoltaicCyclosword: check(
      ['voltaic cyclosword', 'ciclospada voltaica', 'cyclosword'],
      ['6699', '226699'],
    ),
    hasWitsEnd: check(["wit's end", 'fine del limite'], ['3091', '223091']),
    hasGuardianAngel: check(['guardian angel', 'angelo custode'], ['3026', '223026']),
    hasThornmail: check(['thornmail', 'corazza spinata'], ['3075', '223075']),
    hasBrambleVest: check(['bramble vest', 'gilet di rovi'], ['3076', '223076']),
    hasFrozenHeart: check(['frozen heart', 'cuore ghiacciato'], ['3110', '223110']),
    hasRanduinsOmen: check(
      ["randuin's omen", 'presagio di randuin', 'randuin'],
      ['3143', '223143'],
    ),
    hasSpiritVisage: check(['spirit visage', 'corazza spirituale'], ['3065', '223065']),
    hasKaenicRookern: check(
      ['kaenic rookern', 'rookern kaenico'],
      ['6701', '226701', '2504', '222504'],
    ),
    hasUnendingDespair: check(
      ['unending despair', 'disperazione infinita'],
      ['6664', '226664', '2502', '222502'],
    ),
    hasFimbulwinter: check(['fimbulwinter'], ['3121', '223121']),
    hasLocket: check(
      ['locket of the iron solari', 'medaglione dei solari di ferro', 'solari'],
      ['3190', '223190'],
    ),
    hasZekes: check(["zeke's convergence", 'convergenza di zeke', 'zeke'], ['3050', '223050']),
    hasBloodsong: check(['bloodsong', 'canto di sangue'], ['3877', '223877']),
    hasZazZaks: check(
      ["zaz'zak's realmspike", "puntaspina di zaz'zak", 'zazzak'],
      ['3871', '223871'],
    ),
    hasCelestialOpposition: check(
      ['celestial opposition', 'opposizione celeste'],
      ['3869', '223869'],
    ),
    hasDreamMaker: check(['dream maker', 'creatore di sogni'], ['3870', '223870']),
    hasSolsticeSleigh: check(['solstice sleigh', 'slitta del solstizio'], ['3876', '223876']),
    hasSerpentsFang: check(["serpent's fang", 'zanna del serpente'], ['6695', '226695']),
    hasChempunkChainsword: check(
      ['chempunk chainsword', 'spada a catena chempunk', 'chempunk'],
      ['6609', '226609'],
    ),
    hasKnightsVow: check(["knight's vow", 'promessa del cavaliere'], ['3109', '223109', '323109']),
    hasRedemption: check(['redemption', 'redenzione'], ['3107', '223107', '323107']),
    hasMikaelsBlessing: check(
      ["mikael's blessing", 'crogiolo di mikael', 'mikael'],
      ['3222', '223222', '323222', '773222'],
    ),
    hasTrailblazer: check(['trailblazer', 'pioniere'], ['3002', '223002', '323002']),
    hasEssenceReaver: check(['essence reaver', "predatore d'essenza"], ['3508', '223508']),
    hasStridebreaker: check(['stridebreaker', 'spezzapassi'], ['6631', '226631']),
    hasAxiomArc: check(['axiom arc', 'arco assiomatico'], ['6696', '226696']),
    hasEdgeOfNight: check(['edge of night', 'lama della notte'], ['3814', '223814']),
    hasExperimentalHexplate: check(
      ['experimental hexplate', 'corazza hextech sperimentale', 'hexplate'],
      ['3073', '223073'],
    ),
    hasPhantomDancer: check(['phantom dancer', 'danzatore fantasma'], ['3046', '223046', '773046']),
    hasStormrazor: check(['stormrazor', 'rasoio della tempesta'], ['3095', '223095']),
    hasDeadMansPlate: check(["dead man's plate", 'corazza del morto'], ['3742', '223742']),
    hasMercurialScimitar: check(
      ['mercurial scimitar', 'scimitarra di mercurio', 'quicksilver sash', "fascia d'argento vivo"],
      ['3139', '223139', '773139', '3140'],
    ),
    hasYoumuusGhostblade: check(
      ["youmuu's ghostblade", 'lama spettrale di youmuu', 'youmuu'],
      ['3142', '223142', '773142'],
    ),
    hasUmbralGlaive: check(['umbral glaive', 'falce oscura'], ['3179', '223179']),
    hasWarmogsArmor: check(
      ["warmog's armor", 'armatura di warmog', 'warmog'],
      ['3083', '443083', '773083'],
    ),
    hasForceOfNature: check(
      ['force of nature', 'forza della natura'],
      ['4401', '224401', '773064'],
    ),
    hasTiamat: check(['tiamat'], ['3077', '773077']),
    hasHexdrinker: check(['hexdrinker', 'bevitore di magia'], ['3155', '223155', '773155']),
    hasHextechAlternator: check(['hextech alternator', 'alternatore hextech'], ['3145', '223145']),
    hasHauntingGuise: check(['haunting guise', 'maschera stregata'], ['3147', '773136']),
    hasWardensMail: check(["warden's mail", 'maglia del custode'], ['3082', '773082']),
    hasRecurveBow: check(['recurve bow', 'arco ricurvo'], ['1043', '221043', '771043']),
    hasBandlepipes: check(['bandlepipes'], ['2524', '222524']),
    hasBastionbreaker: check(['bastionbreaker'], ['2520']),
    hasEndlessHunger: check(['endless hunger'], ['2517', '222517']),
    hasProtoplasmHarness: check(['protoplasm harness'], ['2525', '222525']),
    hasFiendhunterBolts: check(['fiendhunter bolts'], ['2512', '222512']),
    hasHexopticsC44: check(['hexoptics c44', 'hexoptics'], ['2523', '222523']),
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

  // 16. Heartsteel (Colossus: 80 + 10% bonus HP physical damage on AA)
  if (passives.hasHeartsteel && action === 'AA') {
    const bonusHp = Math.max(0, attacker.maxHp - 600)
    results.push({
      name: 'Heartsteel (Colossus)',
      rawDmg: 80 + bonusHp * 0.1,
      dmgType: 'physical',
    })
  }

  // 17. Titanic Hydra (Cleave: 1.5% max HP physical damage on AA)
  if (passives.hasTitanicHydra && action === 'AA') {
    results.push({
      name: 'Titanic Hydra (Cleave)',
      rawDmg: attacker.maxHp * 0.015,
      dmgType: 'physical',
    })
  }

  // 18. Statikk Shiv (Electrospark: 90 magic damage on AA)
  if (passives.hasStatikk && action === 'AA') {
    results.push({
      name: 'Statikk Shiv (Electrospark)',
      rawDmg: 90,
      dmgType: 'magic',
    })
  }

  // 19. Rapid Firecannon (Energized: 60 magic damage on AA)
  if (passives.hasRapidFirecannon && action === 'AA') {
    results.push({
      name: 'Rapid Firecannon (Energized)',
      rawDmg: 60,
      dmgType: 'magic',
    })
  }

  // 20. Wit's End (Fray: 45 magic damage on AA)
  if (passives.hasWitsEnd && action === 'AA') {
    results.push({
      name: "Wit's End (Fray)",
      rawDmg: 45,
      dmgType: 'magic',
    })
  }

  // 21. Voltaic Cyclosword (Energized: 100 physical damage on AA)
  if (passives.hasVoltaicCyclosword && action === 'AA') {
    results.push({
      name: 'Voltaic Cyclosword (Energized)',
      rawDmg: 100,
      dmgType: 'physical',
    })
  }

  // 22. Bloodsong (Spellblade: 150% base AD on AA)
  if (passives.hasBloodsong && action === 'AA') {
    results.push({
      name: 'Bloodsong (Spellblade)',
      rawDmg: attacker.baseAd * 1.5,
      dmgType: 'physical',
    })
  }

  // 23. Zaz'Zak's Realmspike (Void Explosion: 70 + 20% AP + 4% max HP magic damage on ability)
  if (passives.hasZazZaks && isAbility) {
    results.push({
      name: "Zaz'Zak's Realmspike (Void Explosion)",
      rawDmg: 70 + attacker.ap * 0.2 + defender.maxHp * 0.04,
      dmgType: 'magic',
    })
  }

  // 24. Profane Hydra (Heretic Cleave on spell cast)
  if (passives.hasProfaneHydra && isSpellCast) {
    const isLow = defender.currentHp / defender.maxHp < 0.5
    results.push({
      name: isLow ? 'Profane Hydra (Heretic Cleave Empowered)' : 'Profane Hydra (Heretic Cleave)',
      rawDmg: attacker.ad * (isLow ? 1.2 : 0.8),
      dmgType: 'physical',
    })
  }

  // 25. Ravenous Hydra (Crescent on spell cast)
  if (passives.hasRavenousHydra && isSpellCast) {
    results.push({
      name: 'Ravenous Hydra (Crescent)',
      rawDmg: attacker.ad * 1.0,
      dmgType: 'physical',
    })
  }

  // 26. Recurve Bow (Steadfast on-hit)
  if (passives.hasRecurveBow && action === 'AA') {
    results.push({
      name: 'Recurve Bow (On-Hit)',
      rawDmg: 15,
      dmgType: 'physical',
    })
  }

  // 27. Hextech Alternator (Revved on ability)
  if (passives.hasHextechAlternator && isAbility) {
    results.push({
      name: 'Hextech Alternator (Revved)',
      rawDmg: 50 + ((attacker.level || 1) - 1) * (75 / 17),
      dmgType: 'magic',
    })
  }

  // 28. Tiamat (Cleave on-hit)
  if (passives.hasTiamat && action === 'AA') {
    const cleaveMult = attacker.isRanged ? 0.2 : 0.4
    results.push({
      name: 'Tiamat (Cleave)',
      rawDmg: attacker.ad * cleaveMult,
      dmgType: 'physical',
    })
  }

  // 29. Stridebreaker (Breaking Shockwave on spell cast)
  if (passives.hasStridebreaker && isSpellCast) {
    results.push({
      name: 'Stridebreaker (Breaking Shockwave)',
      rawDmg: attacker.ad * 0.8,
      dmgType: 'physical',
    })
  }

  // 30. Dead Man's Plate (Shipwrecker on AA)
  if (passives.hasDeadMansPlate && action === 'AA') {
    results.push({
      name: "Dead Man's Plate (Shipwrecker)",
      rawDmg: 150 + attacker.baseAd * 1.0,
      dmgType: 'physical',
    })
  }

  // 31. Stormrazor (Bolt on AA)
  if (passives.hasStormrazor && action === 'AA') {
    results.push({
      name: 'Stormrazor (Bolt)',
      rawDmg: 100,
      dmgType: 'magic',
    })
  }

  // 32. Hullbreaker (Boarding Party on AA)
  if (passives.hasHullbreaker && action === 'AA') {
    const bMult = attacker.isRanged ? 0.7 : 1.4
    const hpMult = attacker.isRanged ? 0.0175 : 0.035
    results.push({
      name: 'Hullbreaker (Boarding Party)',
      rawDmg: attacker.baseAd * bMult + attacker.maxHp * hpMult,
      dmgType: 'physical',
    })
  }

  // 33. Redemption (Intervention on spell cast)
  if (passives.hasRedemption && isSpellCast) {
    results.push({
      name: 'Redemption (Intervention)',
      rawDmg: defender.maxHp * 0.1,
      dmgType: 'true',
    })
  }

  return results
}
