import { defineStore } from 'pinia'
import { ref } from 'vue'
import { championService, itemService, runeService, setActivePatch } from '@/services'
import type { Champion, Item, RuneKeystone } from '@/types'

export const useDDragonStore = defineStore('ddragon', () => {
  const allChampions = ref<Champion[]>([])
  const allItems = ref<Item[]>([])
  const allRunes = ref<RuneKeystone[]>([])
  const spellFormulasData = ref<Record<string, Record<string, unknown>>>({})
  const availablePatches = ref<string[]>([])
  const latestPatchVersion = ref<string>('')
  const currentPatch = ref<string>(localStorage.getItem('selectedPatch') || 'latest')
  const isLoading = ref(false)
  const isPatchLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAvailablePatches = async (): Promise<string[]> => {
    try {
      const res = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const versions: string[] = await res.json()

      // Filter out PBE/special builds (only standard X.Y.Z version strings)
      const validVersions = versions.filter((v) => /^\d+\.\d+\.\d+$/.test(v))
      if (validVersions.length > 0 && validVersions[0]) {
        latestPatchVersion.value = validVersions[0]
      }

      // Take top 4 patches (latest + 3 previous)
      const topPatches = ['latest', ...validVersions.slice(1, 4)]
      availablePatches.value = topPatches

      if (currentPatch.value === 'latest' || !topPatches.includes(currentPatch.value)) {
        currentPatch.value = 'latest'
        localStorage.setItem('selectedPatch', currentPatch.value)
      }
      return topPatches
    } catch (err) {
      console.warn('Failed to fetch Riot patch versions, using fallback patches:', err)
      availablePatches.value = ['latest']
      return availablePatches.value
    }
  }

  const loadSpellFormulas = async (patch: string) => {
    try {
      let loadedData: Record<string, Record<string, unknown>> | null = null

      // Try patch-specific formulas file first
      try {
        const patchRes = await fetch(`${import.meta.env.BASE_URL}data/spellFormulas-${patch}.json`)
        const contentType = patchRes.headers.get('content-type') || ''
        if (patchRes.ok && !contentType.includes('text/html')) {
          loadedData = await patchRes.json()
        }
      } catch {
        // Fallback to default
      }

      // Fallback to default spellFormulas.json
      if (!loadedData) {
        const defaultRes = await fetch(`${import.meta.env.BASE_URL}data/spellFormulas.json`)
        const contentType = defaultRes.headers.get('content-type') || ''
        if (defaultRes.ok && !contentType.includes('text/html')) {
          loadedData = await defaultRes.json()
        }
      }

      if (loadedData) {
        spellFormulasData.value = loadedData
      }
    } catch (err) {
      console.warn('Failed to load spell formulas:', err)
    }
  }

  const loadData = async (forcePatch?: string) => {
    if (availablePatches.value.length === 0) {
      await fetchAvailablePatches()
    }

    const targetPatch = forcePatch || currentPatch.value
    let cdnPatch = targetPatch
    if (targetPatch === 'latest') {
      cdnPatch = latestPatchVersion.value || 'latest'
    }
    setActivePatch(cdnPatch)

    isLoading.value = true
    error.value = null
    try {
      const [champs, items, runes] = await Promise.all([
        championService.getChampions(cdnPatch),
        itemService.getItems(cdnPatch),
        runeService.getRunes(cdnPatch),
        loadSpellFormulas(targetPatch),
      ])
      allChampions.value = champs
      allItems.value = items
      allRunes.value = runes
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to load DDragon assets'
      console.error('DDragon loader error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const setPatch = async (newPatch: string) => {
    if (newPatch === currentPatch.value && allChampions.value.length > 0) return
    currentPatch.value = newPatch
    localStorage.setItem('selectedPatch', newPatch)
    isPatchLoading.value = true
    try {
      await loadData(newPatch)
    } finally {
      isPatchLoading.value = false
    }
  }

  return {
    allChampions,
    allItems,
    allRunes,
    spellFormulasData,
    availablePatches,
    currentPatch,
    isLoading,
    isPatchLoading,
    error,
    fetchAvailablePatches,
    loadData,
    setPatch,
  }
})
