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
  return `${import.meta.env.BASE_URL}out/${cleanPath}`
}

export const mapRune = (raw: Record<string, unknown> | null | undefined): Rune => ({
  id: (raw?.id as number) || 0,
  key: (raw?.key as string) || '',
  icon: (raw?.icon as string) || '',
  name: (raw?.name as string) || '',
  shortDesc: (raw?.shortDesc as string) || '',
  longDesc: (raw?.longDesc as string) || '',
})

export const mapRuneSlot = (raw: Record<string, unknown> | null | undefined): RuneSlot => ({
  runes: ((raw?.runes as Record<string, unknown>[]) || []).map(mapRune),
})

export const mapRuneKeystone = (raw: Record<string, unknown> | null | undefined): RuneKeystone => ({
  id: (raw?.id as number) || 0,
  key: (raw?.key as string) || '',
  icon: (raw?.icon as string) || '',
  name: (raw?.name as string) || '',
  slots: ((raw?.slots as Record<string, unknown>[]) || []).map(mapRuneSlot),
})

export const runeService = {
  async getRunes(patch?: string): Promise<RuneKeystone[]> {
    try {
      let perksData: unknown = null
      let perkstylesData: unknown = null

      if (patch) {
        try {
          const cdragonPatch = patch.split('.').slice(0, 2).join('.')
          const [perksRes, stylesRes] = await Promise.all([
            fetch(
              `https://raw.communitydragon.org/${cdragonPatch}/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`,
            ),
            fetch(
              `https://raw.communitydragon.org/${cdragonPatch}/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json`,
            ),
          ])
          if (perksRes.ok && stylesRes.ok) {
            perksData = await perksRes.json()
            perkstylesData = await stylesRes.json()
          }
        } catch {
          // Gracefully fallback to local JSON assets if remote CDragon CDN is unreachable
        }
      }

      if (!perksData || !perkstylesData) {
        const [perksRes, stylesRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}out/runes/perks.json`),
          fetch(`${import.meta.env.BASE_URL}out/runes/perkstyles.json`),
        ])
        perksData = await perksRes.json()
        perkstylesData = await stylesRes.json()
      }

      const perksMap = new Map<number, Record<string, unknown>>()
      ;(perksData as Record<string, unknown>[]).forEach((p) => {
        if (p.id) perksMap.set(p.id as number, p)
      })

      const styles = (perkstylesData as { styles?: Record<string, unknown>[] }).styles || []
      return styles.map((style: Record<string, unknown>) => {
        const slots: RuneSlot[] = ((style.slots as Record<string, unknown>[]) || [])
          .filter((slot) => slot.type === 'kKeyStone' || slot.type === 'kMixedRegularSplashable')
          .map((slot) => {
            const perkIds = (slot.perks as number[]) || []
            const runes: Rune[] = perkIds.map((perkId: number) => {
              const perk = perksMap.get(perkId)
              const perkIcon = (perk?.iconPath as string) || ''
              const perkName = (perk?.name as string) || ''
              const iconPathClean = perkIcon ? perkIcon.replace('/lol-game-data/assets/', '') : ''
              return {
                id: perkId,
                key: perkName ? perkName.replace(/[^a-zA-Z0-9]/g, '') : '',
                icon: iconPathClean,
                name: perkName,
                shortDesc: (perk?.shortDesc as string) || '',
                longDesc: (perk?.longDesc as string) || '',
              }
            })
            return { runes }
          })

        const styleIcon = (style.iconPath as string) || ''
        const styleIconClean = styleIcon ? styleIcon.replace('/lol-game-data/assets/', '') : ''

        return {
          id: (style.id as number) || 0,
          key: (style.name as string) ? (style.name as string).replace(/[^a-zA-Z0-9]/g, '') : '',
          icon: styleIconClean,
          name: (style.name as string) || '',
          slots,
        }
      })
    } catch (error) {
      console.error('Errore nel runeService (getRunes):', error)
      throw error
    }
  },
}
