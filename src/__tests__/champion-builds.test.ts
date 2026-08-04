import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { calculateStats, parseItemStatsFromDescription } from '../services'
import type { DraftSlot, Item } from '../types'

describe('Champion Build Stat Computations', () => {
  it('should compute builds for standard champions and verify stats', () => {
    // Resolve paths
    const champPath = path.resolve(__dirname, './fixtures/championFull.json')
    const itemsPath = path.resolve(__dirname, '../../out/items/items.json')

    const championsData = JSON.parse(fs.readFileSync(champPath, 'utf8')).data
    const itemsData: Record<string, unknown>[] = JSON.parse(fs.readFileSync(itemsPath, 'utf8'))

    // Map items by ID, and process their descriptions to set stats
    const itemsMap = new Map<string, Item>()
    itemsData.forEach((rawItem) => {
      const item: Item = {
        id: String(rawItem.id),
        name: (rawItem.name as string) || '',
        description: (rawItem.description as string) || '',
        colloq: '',
        image: {
          full: (rawItem.iconPath as string)?.split('/').pop()?.toLowerCase() || '',
          sprite: '',
          group: 'item',
          x: 0,
          y: 0,
          w: 48,
          h: 48,
        },
        gold: {
          base: (rawItem.price as number) || 0,
          total: (rawItem.priceTotal as number) || 0,
          sell: (rawItem.price as number) || 0,
          purchasable: (rawItem.inStore as boolean) ?? false,
        },
        tags: (rawItem.categories as string[]) || [],
        stats: parseItemStatsFromDescription((rawItem.description as string) || ''),
        maps: {},
        inStore: rawItem.inStore as boolean,
        from: ((rawItem.from as (string | number)[]) || []).map((x) => x.toString()),
        into: ((rawItem.to as (string | number)[]) || []).map((x) => x.toString()),
      }
      itemsMap.set(item.id, item)
    })

    // Test builds
    const testBuilds = [
      { champ: 'Jinx', level: 18, items: ['3006', '3031', '3094', '3072', '3036', '3071'] },
      { champ: 'Ahri', level: 18, items: ['3020', '3089', '3157', '3135', '4645', '3118'] },
      { champ: 'Malphite', level: 18, items: ['3047', '3068', '3075', '3110', '3083', '2504'] },
      { champ: 'Zed', level: 18, items: ['3158', '3142', '6698', '3814', '6694', '3156'] },
      { champ: 'Thresh', level: 18, items: ['3158', '3869', '3190', '3050', '3109', '3107'] },
      { champ: 'Aatrox', level: 18, items: ['3047', '6610', '3071', '3053', '6333', '3065'] },
    ]

    testBuilds.forEach((t) => {
      const rawChamp = championsData[t.champ]
      expect(rawChamp).toBeDefined()

      // Map raw champion structure to what DraftSlot expects
      const slotItems = t.items.map((id) => itemsMap.get(id)).filter((item): item is Item => !!item)

      const mockSlot: DraftSlot = {
        champion: {
          id: rawChamp.id,
          key: rawChamp.key,
          name: rawChamp.name,
          title: rawChamp.title,
          image: rawChamp.image,
          tags: rawChamp.tags,
          partype: rawChamp.partype,
          stats: {
            hp: rawChamp.stats.hp,
            hpperlevel: rawChamp.stats.hpperlevel,
            mp: rawChamp.stats.mp,
            mpperlevel: rawChamp.stats.mpperlevel,
            movespeed: rawChamp.stats.movespeed,
            armor: rawChamp.stats.armor,
            armorperlevel: rawChamp.stats.armorperlevel,
            magicResist: rawChamp.stats.spellblock,
            magicResistPerLevel: rawChamp.stats.spellblockperlevel,
            attackrange: rawChamp.stats.attackrange,
            hpregen: rawChamp.stats.hpregen,
            hpregenperlevel: rawChamp.stats.hpregenperlevel,
            mpregen: rawChamp.stats.mpregen,
            mpregenperlevel: rawChamp.stats.mpregenperlevel,
            crit: rawChamp.stats.crit,
            critperlevel: rawChamp.stats.critperlevel,
            attackdamage: rawChamp.stats.attackdamage,
            attackdamageperlevel: rawChamp.stats.attackdamageperlevel,
            attackspeedperlevel: rawChamp.stats.attackspeedperlevel,
            attackspeed: rawChamp.stats.attackspeed,
            attackspeedratio: rawChamp.stats.attackspeedratio || rawChamp.stats.attackspeed,
          },
          spells: [],
        },
        level: t.level,
        items: slotItems,
        masterworkItems: slotItems.map(() => false),
        shardOffensive: 'adaptive',
        shardFlex: 'adaptive',
        shardDefensive: 'flat_hp',
        primaryKeystone: null,
        primaryRune1: null,
        primaryRune2: null,
        primaryRune3: null,
        secondaryRune1: null,
        secondaryRune2: null,
      }

      const totalStats = calculateStats(mockSlot)
      expect(totalStats).not.toBeNull()
      if (totalStats) {
        expect(totalStats.hp.total).toBeGreaterThan(mockSlot.champion!.stats.hp)
        expect(totalStats.armor.total).toBeGreaterThan(mockSlot.champion!.stats.armor)
        expect(totalStats.ad.total).toBeGreaterThan(mockSlot.champion!.stats.attackdamage)
      }
    })
  })
})
