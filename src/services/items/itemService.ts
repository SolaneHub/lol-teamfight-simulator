import type { Item, ItemStats } from '@/types'

export const parseItemStatsFromDescription = (description: string): ItemStats => {
  const stats: ItemStats = {}
  if (!description) return stats

  const statsMatch = description.match(/<stats>([\s\S]*?)<\/stats>/i)
  const textToParse = statsMatch && statsMatch[1] ? statsMatch[1] : description

  const regex = /<attention>\s*([+-\d%.]+)\s*%?<\/attention>\s*([^<]+)/gi
  let match
  while ((match = regex.exec(textToParse)) !== null) {
    if (!match[1] || !match[2]) continue
    const valStr = match[1].trim()
    const nameStr = match[2].trim().toLowerCase()
    const isPercent = valStr.includes('%')
    const val = parseFloat(valStr.replace('%', ''))
    if (isNaN(val)) continue

    if (nameStr.includes('ability power')) {
      stats.FlatMagicDamageMod = val
    } else if (nameStr.includes('attack damage')) {
      stats.FlatPhysicalDamageMod = val
    } else if (nameStr.includes('armor') && !nameStr.includes('penetration')) {
      stats.FlatArmorMod = val
    } else if (nameStr.includes('magic resist')) {
      stats.FlatSpellBlockMod = val
    } else if (
      nameStr.includes('health') &&
      !nameStr.includes('regen') &&
      !nameStr.includes('shield')
    ) {
      stats.FlatHPPoolMod = val
    } else if (nameStr.includes('mana') && !nameStr.includes('regen')) {
      stats.FlatMPPoolMod = val
    } else if (nameStr.includes('attack speed')) {
      stats.PercentAttackSpeedMod = isPercent ? val / 100 : val / 100
    } else if (nameStr.includes('move speed')) {
      if (isPercent) {
        stats.PercentMovementSpeedMod = val / 100
      } else {
        stats.FlatMovementSpeedMod = val
      }
    } else if (nameStr.includes('critical strike chance')) {
      stats.FlatCritChanceMod = val / 100
    } else if (nameStr.includes('life steal')) {
      stats.PercentLifeStealMod = val / 100
    }
  }

  return stats
}

export const parseStatsFromDescription = (description: string) => {
  const result = {
    lethality: 0,
    armorPenPercent: 0,
    magicPenFlat: 0,
    magicPenPercent: 0,
    abilityHaste: 0,
    critChance: 0,
    critDamage: 0,
    lifeSteal: 0,
    omnivamp: 0,
    hpRegenPercent: 0,
    manaRegenPercent: 0,
  }
  if (!description) return result

  const regex = /<attention>\s*([+-\d%.]+)\s*%?<\/attention>\s*([^<]+)/gi
  let match
  while ((match = regex.exec(description)) !== null) {
    const valStr = match[1]
    const nameStr = match[2]
    if (!valStr || !nameStr) continue

    const name = nameStr.trim().toLowerCase()
    const isPercent = valStr.includes('%')
    const val = parseFloat(valStr.replace('%', ''))
    if (isNaN(val)) continue

    if (name.includes('lethality')) {
      result.lethality += val
    } else if (name.includes('armor penetration')) {
      result.armorPenPercent += val
    } else if (name.includes('magic penetration')) {
      if (isPercent) result.magicPenPercent += val
      else result.magicPenFlat += val
    } else if (name.includes('ability haste')) {
      result.abilityHaste += val
    } else if (name.includes('critical strike chance')) {
      result.critChance += val
    } else if (name.includes('critical strike damage')) {
      result.critDamage += val
    } else if (name.includes('life steal')) {
      result.lifeSteal += val
    } else if (name.includes('omnivamp')) {
      result.omnivamp += val
    } else if (name.includes('base health regen')) {
      result.hpRegenPercent += val
    } else if (name.includes('base mana regen')) {
      result.manaRegenPercent += val
    }
  }
  return result
}

export const mapItem = (id: string, raw: Record<string, unknown> | null | undefined): Item => {
  const iconPath = (raw?.iconPath as string) || ''
  const filename = iconPath.split('/').pop()?.toLowerCase() || ''

  return {
    id,
    name: (raw?.name as string) || '',
    description: (raw?.description as string) || '',
    colloq: '',
    image: {
      full: filename,
      sprite: '',
      group: 'item',
      x: 0,
      y: 0,
      w: 48,
      h: 48,
    },
    gold: {
      base: (raw?.price as number) || 0,
      total: (raw?.priceTotal as number) || 0,
      sell: (raw?.price as number) || 0,
      purchasable: (raw?.inStore as boolean) ?? false,
    },
    tags: (raw?.categories as string[]) || [],
    stats: parseItemStatsFromDescription((raw?.description as string) || ''),
    maps: {},
    inStore: raw?.inStore as boolean,
    requiredChampion: raw?.requiredChampion as string,
    requiredAlly: raw?.requiredAlly as string,
    from: ((raw?.from as (string | number)[]) || []).map((x) => x.toString()),
    into: ((raw?.to as (string | number)[]) || []).map((x) => x.toString()),
    iconPath,
  }
}

export const getItemIconUrl = (item: Item, patch?: string): string => {
  if (!item) return ''
  if (item.iconPath) {
    const filename = item.iconPath.split('/').pop()?.toLowerCase() || ''
    if (patch) {
      return `https://raw.communitydragon.org/${patch}/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${filename}`
    }
    return `${import.meta.env.BASE_URL}out/items/icons/${filename}`
  }
  if (item.image?.full) {
    return `${import.meta.env.BASE_URL}out/items/icons/${item.image.full.toLowerCase()}`
  }
  return ''
}

export const itemClassMap: Record<string, string[]> = {
  // Starter items
  "Doran's Blade": ['Fighter', 'Marksman'],
  "Doran's Ring": ['Mage'],
  "Doran's Shield": ['Tank'],
  'Tear of the Goddess': ['Mage', 'Marksman'],

  // Fighter
  'Black Cleaver': ['Fighter'],
  'Trinity Force': ['Fighter'],
  "Sterak's Gage": ['Fighter'],
  'Ravenous Hydra': ['Fighter'],
  'Titanic Hydra': ['Fighter'],
  Stridebreaker: ['Fighter'],
  "Death's Dance": ['Fighter'],

  // Marksman
  'Infinity Edge': ['Marksman'],
  'Kraken Slayer': ['Marksman'],
  "Lord Dominik's Regards": ['Marksman'],
  Bloodthirster: ['Marksman'],
  'Rapid Firecannon': ['Marksman'],
  "Runaan's Hurricane": ['Marksman'],
  'Statikk Shiv': ['Marksman'],

  // Assassin
  "Youmuu's Ghostblade": ['Assassin'],
  Hubris: ['Assassin'],
  "Serylda's Grudge": ['Assassin'],
  Opportunity: ['Assassin'],
  'Edge of Night': ['Assassin'],
  'Profane Hydra': ['Assassin'],

  // Mage
  "Rabadon's Deathcap": ['Mage'],
  "Luden's Companion": ['Mage'],
  "Zhonya's Hourglass": ['Mage'],
  "Banshee's Veil": ['Mage'],
  Shadowflame: ['Mage'],
  Stormsurge: ['Mage'],
  "Liandry's Torment": ['Mage', 'Fighter'],
  Riftmaker: ['Mage', 'Fighter'],
  "Seraph's Embrace": ['Mage'],

  // Tank
  Thornmail: ['Tank'],
  "Warmog's Armor": ['Tank'],
  'Sunfire Aegis': ['Tank'],
  "Jak'Sho, The Protean": ['Tank'],
  'Kaenic Rookern': ['Tank'],
  Heartsteel: ['Tank'],
  "Randuin's Omen": ['Tank'],

  // Support
  'World Atlas': ['Support'],
  'Celestial Opposition': ['Support'],
  'Dream Maker': ['Support'],
  "Zaz'Zak's Realmspike": ['Support'],
  'Solstice Sleigh': ['Support'],
  Bloodsong: ['Support'],
  'Runic Compass': ['Support'],
  'Bounty of Worlds': ['Support'],
  Redemption: ['Support'],
  'Locket of the Iron Solari': ['Support'],
  'Ardent Censer': ['Support'],
  'Staff of Flowing Water': ['Support'],
  'Imperial Mandate': ['Support'],
  'Moonstone Renewer': ['Support'],
  "Shurelya's Battlesong": ['Support'],
}

export const getItemClass = (item: Item): string[] => {
  return itemClassMap[item.name] || []
}

export const itemTierMap: Record<
  string,
  'starter' | 'boots' | 'basic' | 'epic' | 'legendary' | 'unique'
> = {
  "Doran's Blade": 'starter',
  "Doran's Ring": 'starter',
  "Doran's Shield": 'starter',
  Cull: 'starter',
  'Dark Seal': 'starter',
  'Tear of the Goddess': 'starter',
  'World Atlas': 'starter',
  'Runic Compass': 'legendary',
  'Bounty of Worlds': 'legendary',
  'Celestial Opposition': 'legendary',
  'Dream Maker': 'legendary',
  "Zaz'Zak's Realmspike": 'legendary',
  'Solstice Sleigh': 'legendary',
  Bloodsong: 'legendary',
  'Boots of Speed': 'boots',
  Boots: 'boots',
  "Seraph's Embrace": 'legendary',
  Muramana: 'legendary',
  Fimbulwinter: 'legendary',
}

export const isTier3Item = (item: Item): boolean => {
  const idNum = parseInt(item.id, 10)
  const tier3BootIds = [3168, 3170, 3171, 3172, 3173, 3174, 3175, 3013, 3176]
  const tier2BootIds = [3005, 3006, 3008, 3009, 3010, 3020, 3047, 3111, 3158]

  if (tier3BootIds.includes(idNum)) return true
  if (idNum >= 7000 && idNum <= 7050) return true
  if (item.from && item.from.some((fromId) => tier2BootIds.includes(parseInt(fromId, 10))))
    return true

  const name = item.name.toLowerCase()
  if (
    name === 'immortal path' ||
    name === 'swiftmarch' ||
    name === 'crimson lucidity' ||
    name === 'gunmetal greaves' ||
    name === 'chainlaced crushers' ||
    name === 'armored advance' ||
    name === "spellslinger's shoes" ||
    name === 'synchronized souls' ||
    name === 'forever forward'
  ) {
    return true
  }

  return false
}

export const isBootsItem = (item: Item): boolean => {
  const name = item.name.toLowerCase()
  const tags = item.tags || []
  if (tags.includes('Boots')) return true
  if (
    name.includes('boots') ||
    name.includes('greaves') ||
    name.includes('shoes') ||
    name.includes('treads') ||
    name.includes('steelcaps') ||
    name.includes('soles') ||
    name.includes('swiftmarch')
  ) {
    return true
  }
  return false
}

export const getItemTier = (
  item: Item,
): 'starter' | 'boots' | 'basic' | 'epic' | 'legendary' | 'unique' => {
  const manualTier = itemTierMap[item.name]
  if (manualTier) return manualTier

  if (isTier3Item(item)) {
    return 'unique'
  }

  if (isBootsItem(item)) {
    return 'boots'
  }

  const name = item.name.toLowerCase()

  if (
    name.includes("doran's") ||
    name === 'cull' ||
    name === 'dark seal' ||
    name === 'tear of the goddess' ||
    name === 'world atlas'
  ) {
    return 'starter'
  }

  if (
    name.includes('celestial opposition') ||
    name.includes('dream maker') ||
    name.includes('realmspike') ||
    name.includes('solstice sleigh') ||
    name.includes('bloodsong') ||
    name.includes('runic compass') ||
    name.includes('bounty of worlds')
  ) {
    return 'legendary'
  }

  if (!item.from || item.from.length === 0) {
    return 'basic'
  }

  if (item.into && item.into.length > 0) {
    return 'epic'
  }

  return 'legendary'
}

export const isJungleItem = (item: Item | Record<string, unknown>): boolean => {
  const itemObj = item as { name?: string; tags?: string[]; categories?: string[] }
  const name = (itemObj.name || '').toLowerCase()
  if (
    name.includes('scorchclaw') ||
    name.includes('gustwalker') ||
    name.includes('mosstomper') ||
    name.includes('emberknife') ||
    name.includes('hailblade') ||
    name.includes('obsidian edge') ||
    name.includes('jungle')
  ) {
    return true
  }
  const cats = itemObj.tags || itemObj.categories || []
  if (
    cats.includes('Jungle') &&
    !cats.includes('Consumable') &&
    !cats.includes('Lane') &&
    !cats.includes('Vision')
  ) {
    return true
  }
  return false
}

export const itemService = {
  async getItems(patch?: string): Promise<Item[]> {
    try {
      let itemData: unknown = null
      if (patch) {
        try {
          const cdragonPatch = patch.split('.').slice(0, 2).join('.')
          const cdragonRes = await fetch(
            `https://raw.communitydragon.org/${cdragonPatch}/plugins/rcp-be-lol-game-data/global/default/v1/items.json`,
          )
          if (cdragonRes.ok) {
            itemData = await cdragonRes.json()
          }
        } catch {
          // Gracefully fallback to local JSON assets if remote CDragon CDN is unreachable
        }
      }

      if (!itemData) {
        const res = await fetch(`${import.meta.env.BASE_URL}out/items/items.json`)
        itemData = await res.json()
      }

      const upgradedItemIds = [
        3040, 3042, 3121, 3002, 6701, 3010, 3013, 3866, 3867, 3168, 3170, 3171, 3172, 3173, 3174,
        3175,
      ]

      const filteredItems = (itemData as Record<string, unknown>[]).filter((item) => {
        const itemId = Number(item.id) || 0
        const isUpgraded = upgradedItemIds.includes(itemId) || (itemId >= 7000 && itemId <= 7050)

        if (!isUpgraded) {
          if (!item.inStore || (item.priceTotal as number) <= 0 || item.displayInItemSets === false)
            return false
          if (itemId >= 10000) return false
        }

        const name = ((item.name as string) || '').toLowerCase()
        if (name.includes("guardian's") || name.includes('poro') || name.includes('snowball'))
          return false
        if (
          name.includes('juice') ||
          name.includes('anvil') ||
          name.includes('flesheater') ||
          name.includes('prismatic')
        )
          return false
        if (name.includes('swarm') || name.includes('golden spatula')) return false
        if (
          name.includes('gangplank') ||
          name.includes('silver serpents') ||
          name.includes('deprecated item')
        )
          return false
        if (
          name.includes('potion') ||
          name.includes('control ward') ||
          name.includes('elixir') ||
          name.includes('augment level')
        )
          return false

        if (isJungleItem(item)) return false

        return true
      })

      const items = filteredItems.map((item) => mapItem(String(item.id), item))

      return items.sort((a, b) => {
        if (a.gold.total !== b.gold.total) {
          return a.gold.total - b.gold.total
        }
        return a.name.localeCompare(b.name)
      })
    } catch (error) {
      console.error('Errore nel itemService (getItems):', error)
      throw error
    }
  },
}
