import type { Champion, ChampionImage, ChampionPassive, ChampionSpells } from '../../types'

const BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/data/en_US'
const CHAMP_FULL_URL = `${BASE_URL}/championFull.json`

const CHAMP_IMG_URL = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/champion'
const PASSIVE_IMG_URL = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/passive'
const SPELL_IMG_URL = 'https://ddragon.leagueoflegends.com/cdn/16.14.1/img/spell'

export function formatTooltipTags(text: string): string {
  if (!text) return ''
  return (
    text
      // Replace legacy Riot <font color="..."> tags for keywords like Curse (#9b0f5f) to match keywordMajor styling
      .replace(
        /<font color=['"]#9b0f5f['"]>(.*?)<\/font>/gi,
        '<span class="text-indigo-300 font-semibold underline decoration-indigo-500">$1</span>',
      )
      .replace(
        /<font color=['"]#([\da-f]{3,6})['"]>(.*?)<\/font>/gi,
        '<span style="color: #$1">$2</span>',
      )
      .replace(/<magicDamage>/gi, '<span class="text-cyan-400 font-semibold">')
      .replace(/<\/magicDamage>/gi, '</span>')
      .replace(/<physicalDamage>/gi, '<span class="text-orange-400 font-semibold">')
      .replace(/<\/physicalDamage>/gi, '</span>')
      .replace(/<trueDamage>/gi, '<span class="text-white font-bold">')
      .replace(/<\/trueDamage>/gi, '</span>')
      .replace(
        /<shield>/gi,
        '<span class="text-slate-100 font-semibold bg-slate-800/60 px-1 rounded border border-slate-700">',
      )
      .replace(/<\/shield>/gi, '</span>')
      .replace(/<(healing|lifeSteal|omnivamp)>/gi, '<span class="text-emerald-400 font-semibold">')
      .replace(/<\/(healing|lifeSteal|omnivamp)>/gi, '</span>')
      .replace(/<(speed|attackSpeed)>/gi, '<span class="text-teal-300 font-semibold">')
      .replace(/<\/(speed|attackSpeed)>/gi, '</span>')
      .replace(/<(status|slow)>/gi, '<span class="text-purple-400 font-semibold">')
      .replace(/<\/(status|slow)>/gi, '</span>')
      .replace(
        /<(recast|active|spellActive|spellPassive|spellName|passive|toggle|tap|hold|release|charge|evolve)>/gi,
        '<span class="text-amber-400 font-bold">',
      )
      .replace(
        /<\/(recast|active|spellActive|spellPassive|spellName|passive|toggle|tap|hold|release|charge|evolve)>/gi,
        '</span>',
      )
      .replace(/<scaleAD>/gi, '<span class="text-orange-400 font-semibold">')
      .replace(/<\/scaleAD>/gi, '</span>')
      .replace(/<scaleAP>/gi, '<span class="text-cyan-400 font-semibold">')
      .replace(/<\/scaleAP>/gi, '</span>')
      .replace(
        /<(scaleHealth|scaleArmor|scaleMR|scaleMana)>/gi,
        '<span class="text-emerald-400 font-semibold">',
      )
      .replace(/<\/(scaleHealth|scaleArmor|scaleMR|scaleMana)>/gi, '</span>')
      .replace(
        /<(keyword|keywordMajor|keywordName|keywordStealth)>/gi,
        '<span class="text-indigo-300 font-semibold underline decoration-indigo-500">',
      )
      .replace(/<\/(keyword|keywordMajor|keywordName|keywordStealth)>/gi, '</span>')
      .replace(/<(attention|danger)>/gi, '<span class="text-rose-400 font-bold uppercase">')
      .replace(/<\/(attention|danger)>/gi, '</span>')
      .replace(/<armorPen>/gi, '<span class="text-red-400 font-semibold">')
      .replace(/<\/armorPen>/gi, '</span>')
      .replace(/<OnHit>/gi, '<span class="text-yellow-300 font-semibold">')
      .replace(/<\/OnHit>/gi, '</span>')
      .replace(/<br\s*\/?>/gi, '<br />')
  )
}

export const getChampionDefaultAdaptiveType = (
  champId: string,
  tags: string[] = [],
): 'AP' | 'AD' => {
  const apChamps = ['Mage', 'Support']
  if (tags && Array.isArray(tags) && tags.some((t) => apChamps.includes(t))) return 'AP'
  return 'AD'
}

export const getChampionSplashUrl = (champId: string, skinNum: number = 0): string => {
  if (!champId) return ''
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_${skinNum}.jpg`
}

export const getChampionIconUrl = (
  champ?: string | Champion | { id?: string; key?: string } | null,
): string => {
  if (!champ) return ''
  const champId = typeof champ === 'string' ? champ : champ.id || champ.key || ''
  if (!champId) return ''
  return `${CHAMP_IMG_URL}/${champId}.png`
}

export const getChampionPassiveUrl = (champ?: Champion | string | null): string => {
  if (!champ) return ''
  if (typeof champ !== 'string' && champ.passive?.icon) {
    return champ.passive.icon
  }
  return ''
}

export const getChampionSpellUrl = (
  champ?: Champion | string | null,
  spellIndex?: number,
): string => {
  if (!champ || spellIndex === undefined) return ''
  if (typeof champ !== 'string' && champ.spells?.[spellIndex]?.icon) {
    return champ.spells[spellIndex].icon
  }
  return ''
}

export const getChampionPosition = (champId: string): string => {
  if (!champId) return 'center top'
  const positions: Record<string, string> = {
    Aatrox: 'center 15%',
    Ahri: 'center 20%',
    Akali: 'center 20%',
    Alistar: 'center 25%',
    Amumu: 'center 20%',
    Anivia: 'center 15%',
    Annie: 'center 20%',
    Aphelios: 'center 20%',
    Ashe: 'center 20%',
    AurelionSol: 'center 20%',
    Azir: 'center 20%',
    Bard: 'center 20%',
    Belveth: 'center 20%',
    Blitzcrank: 'center 20%',
    Brand: 'center 20%',
    Braum: 'center 20%',
    Briar: 'center 20%',
    Caitlyn: 'center 20%',
    Camille: 'center 20%',
    Cassiopeia: 'center 20%',
    Chogath: 'center 20%',
    Corki: 'center 20%',
    Darius: 'center 20%',
    Diana: 'center 20%',
    Draven: 'center 20%',
    DrMundo: 'center 20%',
    Ekko: 'center 20%',
    Elise: 'center 20%',
    Evelynn: 'center 20%',
    Ezreal: 'center 20%',
    Fiddlesticks: 'center 20%',
    Fiora: 'center 20%',
    Fizz: 'center 20%',
    Galio: 'center 20%',
    Gangplank: 'center 20%',
    Garen: 'center 20%',
    Gnar: 'center 20%',
    Gragas: 'center 20%',
    Graves: 'center 20%',
    Gwen: 'center 20%',
    Hecarim: 'center 20%',
    Heimerdinger: 'center 20%',
    Hwei: 'center 20%',
    Illaoi: 'center 20%',
    Irelia: 'center 20%',
    Ivern: 'center 20%',
    Janna: 'center 20%',
    JarvanIV: 'center 20%',
    Jax: 'center 20%',
    Jayce: 'center 20%',
    Jhin: 'center 20%',
    Jinx: 'center 20%',
    Ksante: 'center 20%',
    Kaisa: 'center 20%',
    Kalista: 'center 20%',
    Karma: 'center 20%',
    Karthus: 'center 20%',
    Kassadin: 'center 20%',
    Katarina: 'center 20%',
    Kayle: 'center 20%',
    Kayn: 'center 20%',
    Kennen: 'center 20%',
    Khazix: 'center 20%',
    Kindred: 'center 20%',
    Kled: 'center 20%',
    KogMaw: 'center 20%',
    Leblanc: 'center 20%',
    LeeSin: 'center 20%',
    Leona: 'center 20%',
    Lillia: 'center 20%',
    Lissandra: 'center 20%',
    Lucian: 'center 20%',
    Lulu: 'center 20%',
    Lux: 'center 20%',
    Malphite: 'center 20%',
    Malzahar: 'center 20%',
    Maokai: 'center 20%',
    MasterYi: 'center 20%',
    Milio: 'center 20%',
    MissFortune: 'center 20%',
    Mordekaiser: 'center 20%',
    Morgana: 'center 20%',
    Naafiri: 'center 20%',
    Nami: 'center 20%',
    Nasus: 'center 20%',
    Nautilus: 'center 20%',
    Neeko: 'center 20%',
    Nidalee: 'center 20%',
    Nilah: 'center 20%',
    Nocturne: 'center 20%',
    Nunu: 'center 20%',
    Olaf: 'center 20%',
    Orianna: 'center 20%',
    Ornn: 'center 20%',
    Pantheon: 'center 20%',
    Poppy: 'center 20%',
    Pyke: 'center 20%',
    Qiyana: 'center 20%',
    Quinn: 'center 20%',
    Rakan: 'center 20%',
    Rammus: 'center 20%',
    RekSai: 'center 20%',
    Rell: 'center 20%',
    Renata: 'center 20%',
    Renekton: 'center 20%',
    Rengar: 'center 20%',
    Riven: 'center 20%',
    Rumble: 'center 20%',
    Ryze: 'center 20%',
    Samira: 'center 20%',
    Sejuani: 'center 20%',
    Senna: 'center 20%',
    Seraphine: 'center 20%',
    Sett: 'center 20%',
    Shaco: 'center 20%',
    Shen: 'center 20%',
    Shyvana: 'center 20%',
    Singed: 'center 20%',
    Sion: 'center 20%',
    Sivir: 'center 20%',
    Skarner: 'center 20%',
    Smolder: 'center 20%',
    Sona: 'center 20%',
    Soraka: 'center 20%',
    Swain: 'center 20%',
    Sylas: 'center 20%',
    Syndra: 'center 20%',
    TahmKench: 'center 20%',
    Taliyah: 'center 20%',
    Talon: 'center 20%',
    Taric: 'center 20%',
    Teemo: 'center 20%',
    Thresh: 'center 20%',
    Tristana: 'center 20%',
    Trundle: 'center 20%',
    Tryndamere: 'center 20%',
    TwistedFate: 'center 20%',
    Twitch: 'center 20%',
    Udyr: 'center 20%',
    Urgot: 'center 20%',
    Varus: 'center 20%',
    Vayne: 'center 20%',
    Veigar: 'center 20%',
    Velkoz: 'center 20%',
    Vex: 'center 20%',
    Vi: 'center 20%',
    Viego: 'center 20%',
    Viktor: 'center 20%',
    Vladimir: 'center 20%',
    Volibear: 'center 20%',
    Warwick: 'center 20%',
    Wukong: 'center 20%',
    Xayah: 'center 20%',
    Xerath: 'center 20%',
    XinZhao: 'center 20%',
    Yasuo: 'center 20%',
    Yone: 'center 20%',
    Yorick: 'center 20%',
    Yuumi: 'center 20%',
    Zac: 'center 20%',
    Zed: 'center 20%',
    Zeri: 'center 20%',
    Ziggs: 'center 20%',
    Zilean: 'center 20%',
    Zoe: 'center 20%',
    Zyra: 'center 20%',
  }
  return positions[champId] || 'center 20%'
}

export const championService = {
  async getChampions(): Promise<Champion[]> {
    try {
      const response = await fetch(CHAMP_FULL_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch champions: ${response.statusText}`)
      }
      const data = await response.json()
      const rawData: Record<string, unknown> = data.data || {}

      return Object.values(rawData || {}).map((champObj: unknown) => {
        const champ = champObj as Record<string, unknown>
        const stats = (champ.stats as Record<string, number>) || {}
        const passive = (champ.passive as Record<string, unknown>) || {}
        const passiveImg = (passive.image as Record<string, string>) || {}
        const spells = (champ.spells as Record<string, unknown>[]) || []
        const champImg = (champ.image as Record<string, string>) || {}

        return {
          id: champ.id as string,
          key: champ.key as string,
          name: champ.name as string,
          title: champ.title as string,
          icon: `${CHAMP_IMG_URL}/${champImg.full || (champ.id as string) + '.png'}`,
          image: champ.image as ChampionImage,
          tags: (champ.tags as string[]) || [],
          partype: (champ.partype as string) || 'Mana',
          stats: {
            hp: stats.hp ?? 500,
            hpperlevel: stats.hpperlevel ?? 0,
            mp: stats.mp ?? 300,
            mpperlevel: stats.mpperlevel ?? 0,
            movespeed: stats.movespeed ?? 330,
            armor: stats.armor ?? 30,
            armorperlevel: stats.armorperlevel ?? 0,
            spellblock: stats.spellblock ?? 30,
            spellblockperlevel: stats.spellblockperlevel ?? 0,
            magicResist: stats.spellblock ?? stats.magicResist ?? 30,
            magicResistPerLevel: stats.spellblockperlevel ?? stats.magicResistPerLevel ?? 0,
            attackrange: stats.attackrange ?? 125,
            hpregen: stats.hpregen ?? 6,
            hpregenperlevel: stats.hpregenperlevel ?? 0,
            mpregen: stats.mpregen ?? 6,
            mpregenperlevel: stats.mpregenperlevel ?? 0,
            crit: stats.crit ?? 0,
            critperlevel: stats.critperlevel ?? 0,
            attackdamage: stats.attackdamage ?? 60,
            attackdamageperlevel: stats.attackdamageperlevel ?? 0,
            attackspeedperlevel: stats.attackspeedperlevel ?? 0,
            attackspeed: stats.attackspeed ?? 0.625,
            attackspeedratio: stats.attackspeedratio || stats.attackspeed || 0.625,
          },
          passive: {
            name: (passive.name as string) || '',
            description: (passive.description as string) || '',
            icon: `${PASSIVE_IMG_URL}/${passiveImg.full}`,
            image: champ.passive as ChampionPassive['image'],
          },
          spells: spells.map((spell) => {
            const spellImg = (spell.image as Record<string, string>) || {}
            return {
              id: spell.id as string,
              name: spell.name as string,
              description: spell.description as string,
              tooltip: spell.tooltip as string,
              icon: `${SPELL_IMG_URL}/${spellImg.full}`,
              image: spell.image as ChampionSpells['image'],
              cooldown: spell.cooldown as number[],
              cost: spell.cost as number[],
              costType: spell.costType as string,
              maxrank: spell.maxrank as number,
              effect: spell.effect as (number[] | null)[],
              vars: spell.vars as Record<string, unknown>[],
            }
          }),
        }
      })
    } catch (error) {
      console.error('Error fetching champion data:', error)
      throw error
    }
  },

  async getChampionById(id: string): Promise<Champion | null> {
    const champions = await this.getChampions()
    return champions.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null
  },
}
