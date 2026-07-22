import type { Rune, RuneSlot, RuneKeystone } from '@/types'

export const getRuneIconUrl = (iconPath: string): string => {
  if (!iconPath) return ''
  let path = iconPath.toLowerCase()
  if (path.startsWith('/lol-game-data/assets/')) {
    path = path.replace('/lol-game-data/assets/', '')
  }
  const cleanPath = path
    .replace('v1/perk-images/', 'runes/images/')
    .replace('perk-images/', 'runes/images/')
  return `/out/${cleanPath}`
}

export const mapRune = (raw: any): Rune => ({
  id: raw?.id || 0,
  key: raw?.key || '',
  icon: raw?.icon || '',
  name: raw?.name || '',
  shortDesc: raw?.shortDesc || '',
  longDesc: raw?.longDesc || '',
})

export const mapRuneSlot = (raw: any): RuneSlot => ({
  runes: (raw?.runes || []).map(mapRune),
})

export const mapRuneKeystone = (raw: any): RuneKeystone => ({
  id: raw?.id || 0,
  key: raw?.key || '',
  icon: raw?.icon || '',
  name: raw?.name || '',
  slots: (raw?.slots || []).map(mapRuneSlot),
})

export const runeService = {
  async getRunes(): Promise<RuneKeystone[]> {
    try {
      const [perksRes, stylesRes] = await Promise.all([
        fetch('/out/runes/perks.json'),
        fetch('/out/runes/perkstyles.json')
      ])
      const perksData = await perksRes.json()
      const perkstylesData = await stylesRes.json()

      const perksMap = new Map<number, any>()
      ;(perksData as any[]).forEach((p) => {
        perksMap.set(p.id, p)
      })

      const styles = (perkstylesData as any).styles || []
      return styles.map((style: any) => {
        const slots: RuneSlot[] = (style.slots || [])
          .filter((slot: any) => slot.type === 'kKeyStone' || slot.type === 'kMixedRegularSplashable')
          .map((slot: any) => {
            const runes: Rune[] = (slot.perks || [])
              .map((perkId: number) => {
                const perk = perksMap.get(perkId)
                const iconPathClean = perk?.iconPath 
                  ? perk.iconPath.replace('/lol-game-data/assets/', '') 
                  : ''
                return {
                  id: perkId,
                  key: perk?.name ? perk.name.replace(/\s+/g, '') : '',
                  icon: iconPathClean,
                  name: perk?.name || '',
                  shortDesc: perk?.shortDesc || '',
                  longDesc: perk?.longDesc || '',
                }
              })
            return { runes }
          })

        const styleIconClean = style.iconPath 
          ? style.iconPath.replace('/lol-game-data/assets/', '') 
          : ''

        return {
          id: style.id,
          key: style.name,
          icon: styleIconClean,
          name: style.name,
          slots,
        }
      })
    } catch (error) {
      console.error('Errore nel runeService (getRunes):', error)
      throw error
    }
  }
}
