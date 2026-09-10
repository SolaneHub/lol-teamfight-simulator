import type { Item, ItemStats } from '@/types'
import itemIconMap from './itemIconMap.json'

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
    } else if (nameStr.includes('magic penetration')) {
      if (isPercent) {
        stats.rPercentMagicPenetrationMod = val / 100
      } else {
        stats.rFlatMagicPenetrationMod = val
      }
    } else if (nameStr.includes('armor penetration')) {
      stats.rPercentArmorPenetrationMod = isPercent ? val / 100 : val
    } else if (nameStr.includes('lethality')) {
      stats.rFlatArmorPenetrationMod = val
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
    healShieldPower: 0,
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
    } else if (name.includes('heal and shield power') || name.includes('heal & shield power')) {
      result.healShieldPower += val
    }
  }
  return result
}

export const mapItem = (id: string, raw: Record<string, unknown> | null | undefined): Item => {
  const iconPath = (raw?.iconPath as string) || ''
  const filename = iconPath.split('/').pop()?.toLowerCase() || ''
  const rawGold = (raw?.gold as Record<string, unknown>) || {}
  const rawImage = (raw?.image as Record<string, unknown>) || {}

  const priceTotal = (raw?.priceTotal as number) ?? (rawGold.total as number) ?? 0
  const priceBase = (raw?.price as number) ?? (rawGold.base as number) ?? 0
  const priceSell = (raw?.price as number) ?? (rawGold.sell as number) ?? 0
  const inStore =
    (raw?.inStore as boolean) ??
    (raw?.inStore !== false && (rawGold.purchasable as boolean) !== false)

  const imageFull = (rawImage.full as string) || filename

  return {
    id,
    name: (raw?.name as string) || '',
    description: (raw?.description as string) || '',
    colloq: (raw?.colloq as string) || '',
    image: {
      full: imageFull,
      sprite: (rawImage.sprite as string) || '',
      group: (rawImage.group as string) || 'item',
      x: (rawImage.x as number) || 0,
      y: (rawImage.y as number) || 0,
      w: (rawImage.w as number) || 48,
      h: (rawImage.h as number) || 48,
    },
    gold: {
      base: priceBase,
      total: priceTotal,
      sell: priceSell,
      purchasable: (rawGold.purchasable as boolean) ?? (inStore && priceTotal > 0),
    },
    tags: (raw?.categories as string[]) || (raw?.tags as string[]) || [],
    stats: {
      ...parseItemStatsFromDescription((raw?.description as string) || ''),
      ...Object.fromEntries(
        Object.entries((raw?.stats as Record<string, number>) || {}).filter(([, val]) => val !== 0),
      ),
    },
    maps: (raw?.maps as Record<string, boolean>) || {},
    inStore,
    requiredChampion: (raw?.requiredChampion as string) || '',
    requiredAlly: (raw?.requiredAlly as string) || '',
    from: ((raw?.from as (string | number)[]) || []).map((x) => x.toString()),
    into: ((raw?.to as (string | number)[]) || (raw?.into as (string | number)[]) || []).map((x) =>
      x.toString(),
    ),
    iconPath,
  }
}

export const getItemIconUrl = (item: Item): string => {
  if (!item) return ''
  const mappedFilename = itemIconMap[item.id as keyof typeof itemIconMap]
  if (mappedFilename) {
    return `${import.meta.env.BASE_URL}cdragon/items/icons/${mappedFilename}`
  }
  if (item.iconPath) {
    const filename = item.iconPath.split('/').pop()?.toLowerCase() || ''
    return `${import.meta.env.BASE_URL}cdragon/items/icons/${filename}`
  }
  if (item.image?.full) {
    const filename = item.image.full.toLowerCase()
    return `${import.meta.env.BASE_URL}cdragon/items/icons/${filename}`
  }
  return ''
}

export const itemClassMap: Record<string, string[]> = {
  // Starter items
  'Dark Seal': ['Mage'],
  'Tear of the Goddess': ['Fighter', 'Marksman', 'Assassin', 'Mage', 'Tank', 'Support'],
  "Doran's Ring": ['Mage'],
  "Doran's Bow": ['Marksman'],
  "Doran's Blade": ['Fighter', 'Marksman', 'Assassin'],
  Cull: ['Fighter', 'Marksman', 'Assassin'],
  "Doran's Helm": ['Tank'],
  "Doran's Shield": ['Fighter', 'Marksman', 'Assassin', 'Mage', 'Tank'],

  // Basic
  'Faerie Charm': ['Mage', 'Tank', 'Support'],
  Dagger: ['Fighter', 'Assassin'],
  'Glowing Mote': ['Fighter', 'Assassin', 'Support'],
  'Sapphire Crystal': ['Mage', 'Tank'],
  'Cloth Armor': ['Fighter', 'Assassin', 'Mage', 'Tank', 'Support'],
  'Rejuvenation Bead': ['Tank'],
  'Long Sword': ['Fighter', 'Assassin'],
  'Amplifying Tome': ['Mage', 'Support'],
  'Null-Magic Mantle': ['Fighter', 'Assassin', 'Mage', 'Tank', 'Support'],
  'Ruby Crystal': ['Fighter', 'Assassin', 'Mage', 'Tank', 'Support'],
  'Cloak of Agility': ['Marksman'],
  'Blasting Wand': ['Mage'],
  Pickaxe: ['Fighter', 'Assassin'],
  'Needlessly Large Rod': ['Mage'],
  'B. F. Sword': ['Fighter', 'Assassin'],

  // Epic
  'Forbidden Idol': ['Support'],
  "Scout's Slingshot": ['Marksman'],
  'Recurve Bow': ['Fighter', 'Marksman'],
  Rectrix: ['Fighter', 'Marksman', 'Assassin'],
  'Oblivion Orb': ['Mage', 'Support'],
  "Executioner's Calling": ['Fighter', 'Marksman', 'Assassin'],
  Kindlegem: ['Fighter', 'Mage', 'Tank', 'Support'],
  'Chain Vest': ['Fighter', 'Tank'],
  'Bramble Vest': ['Tank', 'Support'],
  'Crystalline Bracer': ['Tank'],
  'Winged Moonplate': ['Fighter', 'Tank', 'Support'],
  'Fiendish Codex': ['Mage', 'Support'],
  'Negatron Cloak': ['Fighter', 'Tank', 'Support'],
  'Glacial Buckler': ['Tank', 'Support'],
  'Aether Wisp': ['Mage', 'Support'],
  'Fated Ashes': ['Mage'],
  'Bandleglass Mirror': ['Support'],
  'Vampiric Scepter': ['Fighter', 'Marksman'],
  Sheen: ['Fighter', 'Marskman', 'Mage', 'Tank'],
  "Bami's Cinder": ['Tank'],
  "Giant's Belt": ['Mage', 'Tank', 'Support'],
  'Serrated Dirk': ['Marksman', 'Assassin'],
  "Warden's Mail": ['Tank', 'Support'],
  "Caulfield's Warhammer": ['Fighter', 'Marskman', 'Assassin'],
  'Hextech Alternator': ['Mage'],
  'Blightning Jewel': ['Mage'],
  'Steel Sigil': ['Fighter', 'Marksman', 'Assassin'],
  Phage: ['Fighter'],
  Tunneler: ['Fighter', 'Assassin', 'Tank'],
  'Lost Chapter': ['Mage'],
  Zeal: ['Marskman'],
  'Hearthbound Axe': ['Fighter', 'Marskman'],
  Tiamat: ['Fighter', 'Assassin', 'Tank'],
  "Spectre's Cowl": ['Tank'],
  'Catalyst of Aeons': ['Mage', 'Tank'],
  'Haunting Guise': ['Mage'],
  Noonquiver: ['Marskman'],
  Hexdrinker: ['Fighter', 'Marskman', 'Assassin'],
  'Quicksilver Sash': ['Marksman'],
  'The Brutalizer': ['Assassin'],
  'Last Whisper': ['Marksman', 'Assassin'],
  'Verdant Barrier': ['Mage'],
  "Seeker's Armguard": ['Mage'],

  //Legendary
  "Mejai's Soulstealer": ['Mage'],
  "Shurelya's Battlesong": ['Support'],
  'Ardent Censer': ['Support'],
  'Echoes of Helia': ['Support'],
  'Moonstone Renewer': ['Support'],
  'Locket of the Iron Solari': ['Tank', 'Support'],
  "Zeke's Convergence": ['Tank'],
  'Whispering Circlet': ['Support'],
  'Diadem of Songs': ['Support'],
  'Staff of Flowing Water': ['Support'],
  Redemption: ['Support'],
  "Mikael's Blessing": ['Support'],
  Bandlepipes: ['Tank', 'Support'],
  "Knight's Vow": ['Tank', 'Support'],
  "Winter's Approach": ['Tank'],
  Fimbulwinter: ['Tank'],
  'Imperial Mandate': ['Mage', 'Support'],
  Thornmail: ['Tank', 'Support'],
  'Frozen Heart': ['Tank', 'Support'],
  Dawncore: ['Support'],
  "Serpent's Fang": ['Assassin'],
  'Rod of Ages': ['Mage'],
  "Rylai's Crystal Scepter": ['Mage'],
  'Protoplasm Harness': ['Tank'],
  'Hextech Rocketbelt': ['Mage'],
  'Phantom Dancer': ['Marksman'],
  'Fiendhunter Bolts': ['Marksman'],
  'Navori Flickerblade': ['Marksman'],
  "Runaan's Hurricane": ['Marksman'],
  'Rapid Firecannon': ['Marksman'],
  'Abyssal Mask': ['Tank', 'Support'],
  Malignance: ['Mage'],
  'Horizon Focus': ['Mage'],
  'Spirit Visage': ['Tank'],
  "Randuin's Omen": ['Tank'],
  "Luden's Echo": ['Mage'],
  'Axiom Arc': ['Assassin'],
  'Blackfire Torch': [],
  Actualizer: ['Mage'],
  Stormsurge: ['Mage'],
  'Umbral Glaive': ['Assassin'],
  Hubris: ['Assassin'],
  "Youmuu's Ghostblade": ['Assassin'],
  'Hexoptics C44': ['Marksman'],
  "Wit's End": ['Fighter', 'Marksman'],
  'Unending Despair': ['Tank'],
  'Hollow Radiance': ['Tank'],
  'Sunfire Aegis': ['Tank'],
  'Force of Nature': ['Tank'],
  Morellonomicon: ['Mage', 'Support'],
  'Profane Hydra': ['Assassin'],
  "Archangel's Staff": ['Mage'],
  "Seraph's Embrace": ['Mage'],
  Manamune: ['Fighter', 'Marksman', 'Assassin'],
  Muramana: ['Fighter', 'Marksman', 'Assassin'],
  'Lich Bane': ['Mage'],
  "Nashor's Tooth": ['Marksman', 'Mage'],
  "Bloodletter's Curse": ['Mage'],
  Eclipse: ['Fighter'],
  'Iceborn Gauntlet': ['Fighter', 'Tank'],
  'Kaenic Rookern': ['Tank'],
  "Dead Man's Plate": ['Fighter', 'Tank'],
  "Banshee's Veil": ['Mage'],
  'Void Staff': ['Mage'],
  'Hextech Gunblade': ['Assassin', 'Mage'],
  Cryptbloom: ['Mage'],
  'Cosmic Drive': ['Mage'],
  "Liandry's Torment": ['Mage'],
  'Statikk Shiv': ['Marksman'],
  "Guinsoo's Rageblade": [],
  Bastionbreaker: ['Assassin'],
  'Edge of Night': ['Assassin'],
  'The Collector': ['Marksman', 'Assassin'],
  'Voltaic Cyclosword': ['Assassin'],
  'Immortal Shieldbow': ['Marksman'],
  'Mortal Reminder': ['Marksman'],
  'Yun Tal Wildarrows': ['Marksman'],
  'Kraken Slayer': ['Marksman'],
  Terminus: ['Fighter', 'Marksman'],
  'Experimental Hexplate': ['Fighter'],
  'Black Cleaver': ['Fighter'],
  'Chempunk Chainsword': ['Fighter', 'Assassin'],
  "Serylda's Grudge": ['Assassin'],
  Hullbreaker: ['Fighter'],
  Heartsteel: ['Tank'],
  'Essence Reaver': ['Marksman'],
  Riftmaker: ['Mage'],
  'Dusk and Dawn': ['Mage'],
  'Endless Hunger': ['Fighter'],
  'Maw of Malmortius': ['Fighter', 'Marksman', 'Assassin'],
  'Spear of Shojin': ['Fighter'],
  'Sundered Sky': ['Fighter'],
  "Warmog's Armor": ['Tank'],
  Shadowflame: ['Mage'],
  Stormrazor: ['Marksman'],
  'Blade of The Ruined King': ['Fighter', 'Marksman'],
  'Guardian Angel': ['Fighter', 'Marksman', 'Assassin'],
  'Mercurial Scimitar': ['Fighter', 'Marksman'],
  "Jak'Sho, The Protean": ['Tank'],
  "Sterak's Gage": ['Fighter'],
  "Zhonya's Hourglass": ['Mage'],
  "Lord Dominik's Regards": ['Marksman'],
  Stridebreaker: ['Fighter'],
  'Ravenous Hydra': ['Fighter'],
  "Death's Dance": ['Fighter'],
  'Titanic Hydra': ['Fighter', 'Tank'],
  "Overlord's Bloodmail": ['Fighter', 'Tank'],
  'Trinity Force': ['Fighter'],
  Bloodthirster: ['Fighter', 'Marksman'],
  'Infinity Edge': ['Marksman'],
  "Rabadon's Deathcap": ['Mage'],
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
          // Try local frozen DDragon items first
          const localRes = await fetch(`${import.meta.env.BASE_URL}ddragon/${patch}/item.json`)
          if (localRes.ok) {
            const json = await localRes.json()
            if (json && json.data) {
              itemData = Object.entries(json.data).map(([id, item]) => ({
                id,
                ...(item as Record<string, unknown>),
              }))
            }
          }
        } catch {
          // Fallback to local cdragon
        }
      }

      // Strictly fallback to local cdragon item file (no external CDN calls)
      if (!itemData) {
        const res = await fetch(`${import.meta.env.BASE_URL}cdragon/items/items.json`)
        itemData = await res.json()
      }

      const upgradedItemIds = [
        3040, 3042, 3121, 3002, 6701, 3010, 3013, 3866, 3867, 3168, 3170, 3171, 3172, 3173, 3174,
        3175,
      ]

      const filteredItems = (itemData as Record<string, unknown>[]).filter((item) => {
        const itemId = Number(item.id) || 0
        const isUpgraded = upgradedItemIds.includes(itemId) || (itemId >= 7000 && itemId <= 7050)

        const rawGold = (item.gold as Record<string, unknown>) || {}
        const priceTotal = (item.priceTotal as number) ?? (rawGold.total as number) ?? 0
        const inStore =
          (item.inStore as boolean) ?? (rawGold.purchasable !== false && priceTotal > 0)

        if (!isUpgraded) {
          if (!inStore || priceTotal <= 0 || item.displayInItemSets === false) return false
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
