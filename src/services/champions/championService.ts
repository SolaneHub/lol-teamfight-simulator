import type { Champion, ChampionImage, ChampionStats } from '@/types'
import championData from '../../../public/ddragon/16.14.1/data/en_US/championFull.json'
import championHudMap from '../../../public/data/championHudMap.json'

export const championSplashPositions: Record<string, string> = {
  Aatrox: 'object-[50%_15%]',
  Ahri: 'object-[50%_20%]',
  Akali: 'object-[50%_10%]',
  Akshan: 'object-[50%_15%]',
  Alistar: 'object-[50%_15%]',
  Amumu: 'object-[50%_20%]',
  Anivia: 'object-[50%_20%]',
  Annie: 'object-[55%_25%]',
  Aphelios: 'object-[50%_15%]',
  Ashe: 'object-[50%_20%]',
  AurelionSol: 'object-[50%_25%]',
  Aurora: 'object-[50%_15%]',
  Azir: 'object-[50%_15%]',
  Bard: 'object-[50%_20%]',
  Belveth: 'object-[50%_15%]',
  Blitzcrank: 'object-[50%_15%]',
  Brand: 'object-[50%_15%]',
  Braum: 'object-[50%_10%]',
  Briar: 'object-[50%_15%]',
  Caitlyn: 'object-[50%_20%]',
  Camille: 'object-[50%_15%]',
  Cassiopeia: 'object-[50%_15%]',
  ChoGath: 'object-[50%_20%]',
  Corki: 'object-[50%_20%]',
  Darius: 'object-[50%_10%]',
  Diana: 'object-[50%_15%]',
  DrMundo: 'object-[50%_10%]',
  Draven: 'object-[55%_12%]',
  Ekko: 'object-[50%_15%]',
  Elise: 'object-[50%_20%]',
  Evelynn: 'object-[55%_20%]',
  Ezreal: 'object-[50%_15%]',
  Fiddlesticks: 'object-[50%_10%]',
  Fiora: 'object-[50%_15%]',
  Fizz: 'object-[50%_20%]',
  Galio: 'object-[50%_10%]',
  Gangplank: 'object-[50%_15%]',
  Garen: 'object-[50%_12%]',
  Gnar: 'object-[50%_20%]',
  Gragas: 'object-[50%_15%]',
  Graves: 'object-[50%_15%]',
  Gwen: 'object-[50%_15%]',
  Hecarim: 'object-[50%_20%]',
  Heimerdinger: 'object-[50%_20%]',
  Hwei: 'object-[50%_15%]',
  Illaoi: 'object-[50%_15%]',
  Irelia: 'object-[50%_15%]',
  Ivern: 'object-[50%_20%]',
  Janna: 'object-[50%_15%]',
  JarvanIV: 'object-[50%_15%]',
  Jax: 'object-[50%_20%]',
  Jayce: 'object-[50%_15%]',
  Jhin: 'object-[50%_10%]',
  Jinx: 'object-[50%_15%]',
  Kaisa: 'object-[50%_15%]',
  Kalista: 'object-[50%_15%]',
  Karma: 'object-[50%_15%]',
  Karthus: 'object-[50%_15%]',
  Kassadin: 'object-[50%_15%]',
  Katarina: 'object-[50%_15%]',
  Kayle: 'object-[50%_15%]',
  Kayn: 'object-[50%_15%]',
  Kennen: 'object-[50%_20%]',
  KhaZix: 'object-[50%_15%]',
  Kindred: 'object-[50%_20%]',
  KindredLine: 'object-[50%_20%]',
  Kled: 'object-[50%_20%]',
  KogMaw: 'object-[50%_25%]',
  Leblanc: 'object-[50%_15%]',
  LeeSin: 'object-[50%_15%]',
  Leona: 'object-[50%_15%]',
  Lillia: 'object-[55%_18%]',
  Lissandra: 'object-[50%_15%]',
  Lucian: 'object-[50%_15%]',
  Lulu: 'object-[50%_20%]',
  Lux: 'object-[50%_15%]',
  Malphite: 'object-[50%_20%]',
  Malzahar: 'object-[50%_15%]',
  Maokai: 'object-[50%_20%]',
  MasterYi: 'object-[50%_15%]',
  Milio: 'object-[50%_15%]',
  MissFortune: 'object-[50%_15%]',
  Mordekaiser: 'object-[50%_15%]',
  Morgana: 'object-[50%_15%]',
  Naafiri: 'object-[50%_15%]',
  Nami: 'object-[50%_15%]',
  Nasus: 'object-[50%_15%]',
  Nautilus: 'object-[50%_15%]',
  Neeko: 'object-[50%_15%]',
  Nidalee: 'object-[50%_15%]',
  Nilah: 'object-[50%_15%]',
  Nocturne: 'object-[50%_15%]',
  Nunu: 'object-[50%_20%]',
  Olaf: 'object-[50%_15%]',
  Orianna: 'object-[55%_15%]',
  Ornn: 'object-[50%_15%]',
  Pantheon: 'object-[50%_15%]',
  Poppy: 'object-[50%_15%]',
  Pyke: 'object-[50%_15%]',
  Qiyana: 'object-[50%_15%]',
  Quinn: 'object-[50%_15%]',
  Rakan: 'object-[50%_15%]',
  Rammus: 'object-[50%_20%]',
  RekSai: 'object-[50%_20%]',
  Rell: 'object-[50%_15%]',
  Renata: 'object-[50%_15%]',
  Renekton: 'object-[50%_15%]',
  Rengar: 'object-[50%_15%]',
  Riven: 'object-[55%_15%]',
  Rumble: 'object-[50%_20%]',
  Ryze: 'object-[50%_15%]',
  Samira: 'object-[50%_15%]',
  Sejuani: 'object-[50%_15%]',
  Senna: 'object-[50%_15%]',
  Seraphine: 'object-[50%_15%]',
  Sett: 'object-[50%_10%]',
  Shaco: 'object-[50%_15%]',
  Shen: 'object-[50%_15%]',
  Shyvana: 'object-[50%_15%]',
  Singed: 'object-[55%_15%]',
  Sion: 'object-[50%_15%]',
  Sivir: 'object-[50%_15%]',
  Skarner: 'object-[50%_15%]',
  Smolder: 'object-[50%_15%]',
  Sona: 'object-[50%_15%]',
  Soraka: 'object-[50%_15%]',
  Swain: 'object-[50%_12%]',
  Sylas: 'object-[50%_12%]',
  Syndra: 'object-[50%_15%]',
  TahmKench: 'object-[50%_20%]',
  Taliyah: 'object-[50%_15%]',
  Talon: 'object-[55%_12%]',
  Taric: 'object-[50%_15%]',
  Teemo: 'object-[50%_20%]',
  Thresh: 'object-[50%_15%]',
  Tristana: 'object-[50%_20%]',
  Trundle: 'object-[55%_15%]',
  Tryndamere: 'object-[55%_12%]',
  TwistedFate: 'object-[50%_15%]',
  Twitch: 'object-[50%_20%]',
  Udyr: 'object-[50%_15%]',
  Urgot: 'object-[50%_15%]',
  Varus: 'object-[55%_15%]',
  Vayne: 'object-[50%_15%]',
  Veigar: 'object-[50%_20%]',
  Velkoz: 'object-[50%_20%]',
  Vex: 'object-[50%_15%]',
  Vi: 'object-[50%_12%]',
  Viego: 'object-[50%_12%]',
  Viktor: 'object-[50%_15%]',
  Vladimir: 'object-[55%_15%]',
  Volibear: 'object-[50%_15%]',
  Warwick: 'object-[50%_15%]',
  Xayah: 'object-[50%_15%]',
  Xerath: 'object-[55%_15%]',
  XinZhao: 'object-[50%_15%]',
  Yasuo: 'object-[50%_12%]',
  Yone: 'object-[50%_12%]',
  Yorick: 'object-[50%_15%]',
  Yuumi: 'object-[50%_20%]',
  Zac: 'object-[50%_20%]',
  Zed: 'object-[50%_12%]',
  Zeri: 'object-[50%_15%]',
  Ziggs: 'object-[50%_20%]',
  Zilean: 'object-[50%_20%]',
  Zoe: 'object-[50%_15%]',
  Zyra: 'object-[50%_15%]',
}

export const getChampionSplashUrl = (champId: string): string => {
  if (!champId) return ''
  const folder = champId.toLowerCase()
  const fileName = folder === 'xinzhao' ? 'xinzhaorework' : folder
  return `/out/champions/${folder}/assets/${fileName}_splash_centered_0.jpg`
}

export const getChampionIconUrl = (champ: any): string => {
  if (!champ) return ''
  const folder = (champ.id || '').toLowerCase()
  return `/out/champions/${folder}/assets/icon.png`
}

export const getChampionPassiveUrl = (champId: string): string => {
  if (!champId) return ''
  const folder = champId.toLowerCase()
  const hud = (championHudMap as Record<string, any>)[folder]
  if (hud?.passive) {
    return `/out/champions/${folder}/assets/hud/${hud.passive}`
  }
  return `/out/champions/${folder}/assets/hud/${folder}_passive.png`
}

export const getChampionSpellUrl = (champId: string, spellIndex: number): string => {
  if (!champId) return ''
  const folder = champId.toLowerCase()
  const hud = (championHudMap as Record<string, any>)[folder]
  if (hud?.spells?.[spellIndex]) {
    return `/out/champions/${folder}/assets/hud/${hud.spells[spellIndex]}`
  }
  const letters = ['q', 'w', 'e', 'r']
  return `/out/champions/${folder}/assets/hud/${folder}_${letters[spellIndex]}.png`
}

export const getChampionPosition = (champId: string): string => {
  return championSplashPositions[champId] || 'object-center'
}

export const getChampionDefaultAdaptiveType = (champId: string, tags: string[]): 'AD' | 'AP' => {
  const apChamps = ['Mage', 'Support']
  if (tags.some(t => apChamps.includes(t))) return 'AP'
  return 'AD'
}

export const mapChampionImage = (img: any): ChampionImage => ({
  full: img?.full || '',
  sprite: img?.sprite || '',
  group: img?.group || '',
  x: img?.x || 0,
  y: img?.y || 0,
  w: img?.w || 0,
  h: img?.h || 0,
})

export const mapChampionStats = (stats: any): ChampionStats => ({
  hp: stats?.hp || 0,
  hpperlevel: stats?.hpperlevel || 0,
  mp: stats?.mp || 0,
  mpperlevel: stats?.mpperlevel || 0,
  movespeed: stats?.movespeed || 0,
  armor: stats?.armor || 0,
  armorperlevel: stats?.armorperlevel || 0,
  magicResist: stats?.spellblock || 0,
  magicResistPerLevel: stats?.spellblockperlevel || 0,
  attackrange: stats?.attackrange || 0,
  hpregen: stats?.hpregen || 0,
  hpregenperlevel: stats?.hpregenperlevel || 0,
  mpregen: stats?.mpregen || 0,
  mpregenperlevel: stats?.mpregenperlevel || 0,
  crit: stats?.crit || 0,
  critperlevel: stats?.critperlevel || 0,
  attackdamage: stats?.attackdamage || 0,
  attackdamageperlevel: stats?.attackdamageperlevel || 0,
  attackspeedperlevel: stats?.attackspeedperlevel || 0,
  attackspeed: stats?.attackspeed || 0,
  attackspeedratio: stats?.attackspeedratio || stats?.attackspeed || 0,
})

export const mapChampion = (raw: any): Champion => ({
  id: raw?.id || '',
  key: raw?.key || '',
  name: raw?.name || '',
  image: mapChampionImage(raw?.image),
  stats: mapChampionStats(raw?.stats),
  spells: (raw?.spells || []).map((spell: any) => ({
    id: spell?.id || '',
    name: spell?.name || '',
    description: spell?.description || '',
    tooltip: spell?.tooltip || '',
    cooldown: spell?.cooldown || [],
    cooldownBurn: spell?.cooldownBurn || '',
    cost: spell?.cost || [],
    costBurn: spell?.costBurn || '',
    image: mapChampionImage(spell?.image),
  })),
  passive: {
    name: raw?.passive?.name || '',
    description: raw?.passive?.description || '',
    image: mapChampionImage(raw?.passive?.image),
  },
  tags: raw?.tags || [],
  partype: raw?.partype || 'Mana',
})

export const formatTooltipTags = (text: string): string => {
  if (!text) return ''
  return text
    .replace(/%i:[a-zA-Z0-9_-]+%/gi, '')
    // Riot LoL UIKit tags
    .replace(/<lol-uikit-tooltipped-keyword[^>]*>/gi, '<span class="text-cyan-300 font-semibold underline decoration-cyan-500/40">')
    .replace(/<\/lol-uikit-tooltipped-keyword>/gi, '</span>')
    .replace(/<font color=['"]?([^'"]+)['"]?>/gi, '<span style="color: $1" class="font-semibold">')
    .replace(/<\/font>/gi, '</span>')
    .replace(/<scaleLevel>/gi, '<span class="text-amber-400 font-semibold">')
    .replace(/<\/scaleLevel>/gi, '</span>')
    .replace(/<gold>/gi, '<span class="text-amber-300 font-semibold">')
    .replace(/<\/gold>/gi, '</span>')
    .replace(/<rules>/gi, '<span class="block mt-2 text-slate-400 text-xs italic font-mono border-t border-slate-800/80 pt-1.5">')
    .replace(/<\/rules>/gi, '</span>')
    .replace(/<i>/gi, '<span class="text-amber-300/80 italic">')
    .replace(/<\/i>/gi, '</span>')
    .replace(/<\/?(pathBonus|pathResolve|pathSorcery|pathPrecision|pathDomination|pathInspiration)>/gi, '')
    // Damage & Stat tags
    .replace(/<magicDamage>/gi, '<span class="text-cyan-400 font-semibold">')
    .replace(/<\/magicDamage>/gi, '</span>')
    .replace(/<physicalDamage>/gi, '<span class="text-orange-400 font-semibold">')
    .replace(/<\/physicalDamage>/gi, '</span>')
    .replace(/<trueDamage>/gi, '<span class="text-white font-bold underline decoration-amber-300">')
    .replace(/<\/trueDamage>/gi, '</span>')
    .replace(/<shield>/gi, '<span class="text-slate-100 font-semibold bg-slate-800/60 px-1 rounded border border-slate-700">')
    .replace(/<\/shield>/gi, '</span>')
    .replace(/<(healing|lifeSteal|omnivamp)>/gi, '<span class="text-emerald-400 font-semibold">')
    .replace(/<\/(healing|lifeSteal|omnivamp)>/gi, '</span>')
    .replace(/<(speed|attackSpeed)>/gi, '<span class="text-teal-300 font-semibold">')
    .replace(/<\/(speed|attackSpeed)>/gi, '</span>')
    .replace(/<(status|slow)>/gi, '<span class="text-purple-400 font-semibold">')
    .replace(/<\/(status|slow)>/gi, '</span>')
    .replace(/<(recast|active|spellActive|spellPassive|spellName|passive|toggle|tap|hold|release|charge|evolve)>/gi, '<span class="text-amber-400 font-bold">')
    .replace(/<\/(recast|active|spellActive|spellPassive|spellName|passive|toggle|tap|hold|release|charge|evolve)>/gi, '</span>')
    .replace(/<scaleAD>/gi, '<span class="text-orange-400 font-semibold">')
    .replace(/<\/scaleAD>/gi, '</span>')
    .replace(/<scaleAP>/gi, '<span class="text-cyan-400 font-semibold">')
    .replace(/<\/scaleAP>/gi, '</span>')
    .replace(/<(scaleHealth|scaleArmor|scaleMR|scaleMana)>/gi, '<span class="text-emerald-400 font-semibold">')
    .replace(/<\/(scaleHealth|scaleArmor|scaleMR|scaleMana)>/gi, '</span>')
    .replace(/<(keyword|keywordMajor|keywordName|keywordStealth)>/gi, '<span class="text-indigo-300 font-semibold underline decoration-indigo-500">')
    .replace(/<\/(keyword|keywordMajor|keywordName|keywordStealth)>/gi, '</span>')
    .replace(/<(attention|danger)>/gi, '<span class="text-rose-400 font-bold uppercase">')
    .replace(/<\/(attention|danger)>/gi, '</span>')
    .replace(/<armorPen>/gi, '<span class="text-red-400 font-semibold">')
    .replace(/<\/armorPen>/gi, '</span>')
    .replace(/<OnHit>/gi, '<span class="text-yellow-300 font-semibold">')
    .replace(/<\/OnHit>/gi, '</span>')
    .replace(/<br\s*\/?>/gi, '<br />')
}

export const championService = {
  async getChampions(): Promise<Champion[]> {
    try {
      return Object.values(championData.data)
        .map(mapChampion)
        .sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Errore nel championService (getChampions):', error)
      throw error
    }
  },

  async getChampionDetails(championId: string): Promise<Champion> {
    try {
      const module = await import(
        `../../../public/ddragon/16.14.1/data/en_US/champion/${championId}.json`
      )
      const champion = mapChampion(module.default.data[championId])

      try {
        const folder = championId.toLowerCase()
        const res = await fetch(`/out/champions/${folder}/data/${folder}.bin.json`)
        if (res.ok) {
          const binData = await res.json()
          const rootKey = Object.keys(binData).find(k => k.endsWith('/CharacterRecords/Root'))
          if (rootKey) {
            const root = binData[rootKey]
            champion.stats = {
              hp: root.baseHPModifiable?.baseValue ?? champion.stats.hp,
              hpperlevel: root.hpPerLevelModifiable?.baseValue ?? champion.stats.hpperlevel,
              mp: root.primaryAbilityResource?.['{726ee5cd}']?.baseValue ?? champion.stats.mp,
              mpperlevel: root.primaryAbilityResource?.['{c4ab3550}']?.baseValue ?? champion.stats.mpperlevel,
              movespeed: root.baseMoveSpeedModifiable?.baseValue ?? champion.stats.movespeed,
              armor: root.baseArmorModifiable?.baseValue ?? champion.stats.armor,
              armorperlevel: root.armorPerLevelModifiable?.baseValue ?? champion.stats.armorperlevel,
              magicResist: root.baseMR?.baseValue ?? champion.stats.magicResist,
              magicResistPerLevel: root['{01262a25}']?.baseValue ?? champion.stats.magicResistPerLevel,
              attackrange: root.attackRangeModifiable?.baseValue ?? champion.stats.attackrange,
              hpregen: root.baseStaticHPRegenModifiable?.baseValue != null
                ? root.baseStaticHPRegenModifiable.baseValue * 5
                : champion.stats.hpregen,
              hpregenperlevel: root.hpRegenPerLevelModifiable?.baseValue ?? champion.stats.hpregenperlevel,
              mpregen: champion.stats.mpregen,
              mpregenperlevel: champion.stats.mpregenperlevel,
              crit: champion.stats.crit,
              critperlevel: champion.stats.critperlevel,
              attackdamage: root.baseDamageModifiable?.baseValue ?? champion.stats.attackdamage,
              attackdamageperlevel: root.damagePerLevelModifiable?.baseValue ?? champion.stats.attackdamageperlevel,
              attackspeed: root.attackSpeedModifiable?.baseValue ?? champion.stats.attackspeed,
              attackspeedperlevel: root.attackSpeedPerLevelModifiable?.baseValue ?? champion.stats.attackspeedperlevel,
              attackspeedratio: root.attackSpeedRatioModifiable?.baseValue ?? champion.stats.attackspeedratio,
            }
          }
        }
      } catch (binErr) {
        console.warn(`bin.json stats overlay failed for ${championId}, using DDragon fallback`)
      }

      return champion
    } catch (error) {
      console.error('Errore nel championService (getChampionDetails):', error)
      throw error
    }
  }
}
