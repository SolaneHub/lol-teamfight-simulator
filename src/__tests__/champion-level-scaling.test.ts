import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { calculateStats } from '../services'

describe('Full 173 Champions Level & Rank Scaling Unit Test Suite', () => {
  const formulasPath = path.resolve(__dirname, '../../public/data/spellFormulas.json')
  const spellFormulasData = JSON.parse(fs.readFileSync(formulasPath, 'utf8'))

  const ddragonPath = path.resolve(
    __dirname,
    '../../public/ddragon/16.14.1/data/en_US/championFull.json',
  )
  const championsData = JSON.parse(fs.readFileSync(ddragonPath, 'utf8')).data
  const allChampionIds = Object.keys(spellFormulasData)

  it('should verify level scaling (Level 1 to 18) for ALL 173 champions passives', () => {
    expect(allChampionIds.length).toBe(173)

    let checkedPassives = 0

    allChampionIds.forEach((champId) => {
      const champFormulas = (spellFormulasData as Record<string, Record<string, unknown>>)[champId]
      if (!champFormulas || !champFormulas.passive) return

      const passiveConfig = champFormulas.passive as Record<string, unknown>
      checkedPassives++

      for (const [key, config] of Object.entries(passiveConfig)) {
        if (key.startsWith('{')) continue
        if (!config || typeof config !== 'object') continue

        const baseArr = ((config as Record<string, unknown>).base as number[]) || []
        const scalings =
          ((config as Record<string, unknown>).scalings as Array<{
            stat: string
            ratio: number | number[]
          }>) || []

        if (baseArr.length > 0) {
          // Level 1, Level 9, Level 18
          const valLvl1 = baseArr[0]
          const valLvl9 = baseArr[Math.min(8, baseArr.length - 1)]
          const valLvl18 = baseArr[baseArr.length - 1]

          expect(typeof valLvl1).toBe('number')
          expect(Number.isNaN(valLvl1)).toBe(false)
          expect(typeof valLvl9).toBe('number')
          expect(Number.isNaN(valLvl9)).toBe(false)
          expect(typeof valLvl18).toBe('number')
          expect(Number.isNaN(valLvl18)).toBe(false)
        }

        scalings.forEach((scale) => {
          expect(scale.stat).toBeDefined()
          if (Array.isArray(scale.ratio)) {
            const r1 = scale.ratio[0]
            const r18 = scale.ratio[scale.ratio.length - 1]
            expect(typeof r1).toBe('number')
            expect(Number.isNaN(r1)).toBe(false)
            expect(typeof r18).toBe('number')
            expect(Number.isNaN(r18)).toBe(false)
          } else if (typeof scale.ratio === 'number') {
            expect(Number.isNaN(scale.ratio)).toBe(false)
          }
        })
      }
    })

    expect(checkedPassives).toBeGreaterThanOrEqual(150)
  })

  it('should verify active spell rank scaling (Rank 1 to 5) for ALL 173 champions', () => {
    let checkedSpells = 0

    allChampionIds.forEach((champId) => {
      const champFormulas = (spellFormulasData as Record<string, Record<string, unknown>>)[champId]
      if (!champFormulas) return

      const spellKeys = Object.keys(champFormulas).filter((k) => k !== 'passive')

      spellKeys.forEach((spellKey) => {
        const spellObj = champFormulas[spellKey] as Record<string, unknown>
        checkedSpells++

        for (const [, config] of Object.entries(spellObj)) {
          if (!config || typeof config !== 'object') continue

          const baseArr = ((config as Record<string, unknown>).base as number[]) || []
          const scalings =
            ((config as Record<string, unknown>).scalings as Array<{
              stat: string
              ratio: number | number[]
            }>) || []

          if (baseArr.length > 0) {
            const valRank1 = baseArr[0]
            const valMaxRank = baseArr[baseArr.length - 1]

            expect(typeof valRank1).toBe('number')
            expect(Number.isNaN(valRank1)).toBe(false)
            expect(typeof valMaxRank).toBe('number')
            expect(Number.isNaN(valMaxRank)).toBe(false)
          }

          scalings.forEach((scale) => {
            expect(scale.stat).toBeDefined()
            if (Array.isArray(scale.ratio)) {
              const r1 = scale.ratio[0]
              const rMax = scale.ratio[scale.ratio.length - 1]
              expect(typeof r1).toBe('number')
              expect(Number.isNaN(r1)).toBe(false)
              expect(typeof rMax).toBe('number')
              expect(Number.isNaN(rMax)).toBe(false)
            } else if (typeof scale.ratio === 'number') {
              expect(Number.isNaN(scale.ratio)).toBe(false)
            }
          })
        }
      })
    })

    expect(checkedSpells).toBeGreaterThanOrEqual(670)
  })

  it('should verify stat calculation level scaling (Level 1 to 18) for ALL 173 champions', () => {
    allChampionIds.forEach((champId) => {
      const rawChamp = championsData[champId]
      if (!rawChamp) return

      const champStats = {
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
      }

      const mockSlotLvl1: DraftSlot = {
        id: 1,
        side: 'blue',
        role: 'Mid',
        primaryPath: null,
        primaryKeystone: null,
        primaryRune1: null,
        primaryRune2: null,
        primaryRune3: null,
        secondaryPath: null,
        secondaryRune1: null,
        secondaryRune2: null,
        champion: {
          id: champId,
          key: champId,
          name: champId,
          tags: rawChamp.tags || [],
          stats: champStats,
          spells: [],
          passive: { name: '', description: '' },
        },
        level: 1,
        items: [],
        runes: [],
      }
      const mockSlotLvl18: DraftSlot = {
        id: 1,
        side: 'blue',
        role: 'Mid',
        primaryPath: null,
        primaryKeystone: null,
        primaryRune1: null,
        primaryRune2: null,
        primaryRune3: null,
        secondaryPath: null,
        secondaryRune1: null,
        secondaryRune2: null,
        champion: {
          id: champId,
          key: champId,
          name: champId,
          tags: rawChamp.tags || [],
          stats: champStats,
          spells: [],
          passive: { name: '', description: '' },
        },
        level: 18,
        items: [],
        runes: [],
      }

      const statsLvl1 = calculateStats(mockSlotLvl1)
      const statsLvl18 = calculateStats(mockSlotLvl18)

      // HP, AD, Armor, MR must be >= at level 18 than at level 1
      expect(statsLvl18.hp.total).toBeGreaterThan(statsLvl1.hp.total)
      expect(statsLvl18.ad.total).toBeGreaterThanOrEqual(statsLvl1.ad.total)
      expect(statsLvl18.armor.total).toBeGreaterThanOrEqual(statsLvl1.armor.total)
      expect((statsLvl18.mr || statsLvl18.magicResist).total).toBeGreaterThanOrEqual(
        (statsLvl1.mr || statsLvl1.magicResist).total,
      )
    })
  })
})
