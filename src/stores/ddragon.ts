import { defineStore } from 'pinia'
import { ref } from 'vue'
import { championService, itemService, runeService } from '@/services'
import type { Champion, Item, RuneKeystone } from '@/types'

export const useDDragonStore = defineStore('ddragon', () => {
  const allChampions = ref<Champion[]>([])
  const allItems = ref<Item[]>([])
  const allRunes = ref<RuneKeystone[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadData = async () => {
    if (allChampions.value.length > 0) return // Already loaded

    isLoading.value = true
    error.value = null
    try {
      const [champs, items, runes] = await Promise.all([
        championService.getChampions(),
        itemService.getItems(),
        runeService.getRunes(),
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

  return {
    allChampions,
    allItems,
    allRunes,
    isLoading,
    error,
    loadData,
  }
})
