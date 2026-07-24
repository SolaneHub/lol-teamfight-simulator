import type { Item, ItemStats } from '@/types'

export const parseItemStatsFromDescription = (description: string): ItemStats => {
  const stats: ItemStats = {}
  if (!description) return stats

  const statsMatch = description.match(/<stats>([\s\S]*?)<\/stats>/i)
  const textToParse = (statsMatch && statsMatch[1]) ? statsMatch[1] : description

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
    } else if (nameStr.includes('health') && !nameStr.includes('regen') && !nameStr.includes('shield')) {
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

export const mapItem = (id: string, raw: any): Item => {
  const iconPath = raw?.iconPath || ''
  const filename = iconPath.split('/').pop()?.toLowerCase() || ''

  return {
    id,
    name: raw?.name || '',
    description: raw?.description || '',
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
      base: raw?.price || 0,
      total: raw?.priceTotal || 0,
      sell: raw?.price || 0,
      purchasable: raw?.inStore ?? false,
    },
    tags: raw?.categories || [],
    stats: parseItemStatsFromDescription(raw?.description),
    maps: {},
    inStore: raw?.inStore,
    requiredChampion: raw?.requiredChampion,
    requiredAlly: raw?.requiredAlly,
    from: (raw?.from || []).map((x: any) => x.toString()),
    into: (raw?.to || []).map((x: any) => x.toString()),
    iconPath,
  }
}

export const getItemIconUrl = (item: Item): string => {
  if (!item) return ''
  if (item.iconPath) {
    const filename = item.iconPath.split('/').pop()?.toLowerCase() || ''
    return `${import.meta.env.BASE_URL}out/items/icons/${filename}`
  }
  if (item.image?.full) {
    return `${import.meta.env.BASE_URL}out/items/icons/${item.image.full.toLowerCase()}`
  }
  return ''
}

export const itemClassMap: Record<string, string[]> = {
  // Starter items
  "Doran's Blade": ["Fighter", "Marksman"],
  "Doran's Ring": ["Mage"],
  "Doran's Shield": ["Tank"],
  "Tear of the Goddess": ["Mage", "Marksman"],

  // Fighter
  "Black Cleaver": ["Fighter"],
  "Trinity Force": ["Fighter"],
  "Sterak's Gage": ["Fighter"],
  "Ravenous Hydra": ["Fighter"],
  "Titanic Hydra": ["Fighter"],
  "Stridebreaker": ["Fighter"],
  "Death's Dance": ["Fighter"],

  // Marksman
  "Infinity Edge": ["Marksman"],
  "Kraken Slayer": ["Marksman"],
  "Lord Dominik's Regards": ["Marksman"],
  "Bloodthirster": ["Marksman"],
  "Rapid Firecannon": ["Marksman"],
  "Runaan's Hurricane": ["Marksman"],
  "Statikk Shiv": ["Marksman"],

  // Assassin
  "Youmuu's Ghostblade": ["Assassin"],
  "Hubris": ["Assassin"],
  "Serylda's Grudge": ["Assassin"],
  "Opportunity": ["Assassin"],
  "Edge of Night": ["Assassin"],
  "Profane Hydra": ["Assassin"],

  // Mage
  "Rabadon's Deathcap": ["Mage"],
  "Luden's Companion": ["Mage"],
  "Zhonya's Hourglass": ["Mage"],
  "Banshee's Veil": ["Mage"],
  "Shadowflame": ["Mage"],
  "Stormsurge": ["Mage"],
  "Liandry's Torment": ["Mage", "Fighter"],
  "Riftmaker": ["Mage", "Fighter"],
  "Seraph's Embrace": ["Mage"],

  // Tank
  "Thornmail": ["Tank"],
  "Warmog's Armor": ["Tank"],
  "Sunfire Aegis": ["Tank"],
  "Jak'Sho, The Protean": ["Tank"],
  "Kaenic Rookern": ["Tank"],
  "Heartsteel": ["Tank"],
  "Randuin's Omen": ["Tank"],

  // Support
  "Redemption": ["Support"],
  "Locket of the Iron Solari": ["Support"],
  "Ardent Censer": ["Support"],
  "Staff of Flowing Water": ["Support"],
  "Imperial Mandate": ["Support"],
  "Moonstone Renewer": ["Support"],
  "Shurelya's Battlesong": ["Support"],
}

export const getItemClass = (item: Item): string[] => {
  return itemClassMap[item.name] || []
}

export const itemTierMap: Record<string, 'starter' | 'basic' | 'epic' | 'legendary'> = {
  "Doran's Blade": "starter",
  "Doran's Ring": "starter",
  "Doran's Shield": "starter",
  "Cull": "starter",
  "Dark Seal": "starter",
  "Tear of the Goddess": "starter",
  "Boots of Speed": "basic",
  "Seraph's Embrace": "legendary",
  "Muramana": "legendary",
  "Fimbulwinter": "legendary",
}

export const getItemTier = (item: Item): 'starter' | 'basic' | 'epic' | 'legendary' => {
  const manualTier = itemTierMap[item.name]
  if (manualTier) return manualTier

  const name = item.name.toLowerCase()
  
  if (
    name.includes("doran's") ||
    name === 'cull' ||
    name === 'dark seal' ||
    name === 'tear of the goddess' ||
    name.includes('scorchclaw') ||
    name.includes('gustwalker') ||
    name.includes('mosstomper') ||
    item.tags.includes('GoldInflow')
  ) {
    return 'starter'
  }

  if (!item.from || item.from.length === 0) {
    return 'basic'
  }

  if (item.into && item.into.length > 0) {
    return 'epic'
  }

  return 'legendary'
}

export const itemService = {
  async getItems(): Promise<Item[]> {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}out/items/items.json`)
      const itemData = await res.json()

      const upgradedItemIds = [3040, 3042, 3121, 3002, 6701, 3010, 3013, 3866, 3867, 3168, 3170, 3171, 3172, 3173, 3174, 3175]

      const filteredItems = (itemData as any[]).filter((item) => {
        const isUpgraded = upgradedItemIds.includes(item.id) || (item.id >= 7000 && item.id <= 7050)
        
        if (!isUpgraded) {
          if (!item.inStore || item.priceTotal <= 0 || item.displayInItemSets === false) return false
          if (item.id >= 10000) return false
        }

        const name = (item.name || '').toLowerCase()
        if (name.includes('guardian\'s') || name.includes('poro') || name.includes('snowball')) return false
        if (name.includes('juice') || name.includes('anvil') || name.includes('flesheater') || name.includes('prismatic')) return false
        if (name.includes('swarm') || name.includes('golden spatula')) return false
        if (name.includes('gangplank') || name.includes('silver serpents') || name.includes('deprecated item')) return false

        return true
      })

      return filteredItems.map((item) =>
        mapItem(item.id.toString(), item),
      )
    } catch (error) {
      console.error('Errore nel itemService (getItems):', error)
      throw error
    }
  }
}
