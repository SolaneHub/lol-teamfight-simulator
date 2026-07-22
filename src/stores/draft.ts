import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Champion, Item, RuneKeystone, Rune, DraftSlot } from '@/types'

export const useDraftStore = defineStore('draft', () => {
  const blueDraft = ref<DraftSlot[]>([
    {
      id: 1,
      side: 'blue',
      role: 'Top',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 2,
      side: 'blue',
      role: 'Jungle',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 3,
      side: 'blue',
      role: 'Mid',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 4,
      side: 'blue',
      role: 'Bot',
      champion: null,
      level: 1,
      items: Array(7).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 5,
      side: 'blue',
      role: 'Support',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
  ])

  const redDraft = ref<DraftSlot[]>([
    {
      id: 6,
      side: 'red',
      role: 'Top',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 7,
      side: 'red',
      role: 'Jungle',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 8,
      side: 'red',
      role: 'Mid',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 9,
      side: 'red',
      role: 'Bot',
      champion: null,
      level: 1,
      items: Array(7).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
    {
      id: 10,
      side: 'red',
      role: 'Support',
      champion: null,
      level: 1,
      items: Array(6).fill(null),
      primaryPath: null,
      primaryKeystone: null,
      primaryRune1: null,
      primaryRune2: null,
      primaryRune3: null,
      secondaryPath: null,
      secondaryRune1: null,
      secondaryRune2: null,
      shardOffensive: null,
      shardFlex: null,
      shardDefensive: null,
    },
  ])

  const selectedSlotId = ref<number | null>(1)
  const activeCustomizerSlot = ref<DraftSlot | null>(null)

  const autoAdvance = () => {
    const nextBlue = blueDraft.value.find((s) => s.champion === null)
    if (nextBlue) {
      selectedSlotId.value = nextBlue.id
      return
    }
    const nextRed = redDraft.value.find((s) => s.champion === null)
    if (nextRed) {
      selectedSlotId.value = nextRed.id
      return
    }
    selectedSlotId.value = null
  }

  const assignChampion = (champ: Champion) => {
    if (selectedSlotId.value === null) return

    // Prevent duplicates
    const isAlreadySelected =
      blueDraft.value.some((s) => s.champion?.id === champ.id) ||
      redDraft.value.some((s) => s.champion?.id === champ.id)

    if (isAlreadySelected) return

    const blueSlot = blueDraft.value.find((s) => s.id === selectedSlotId.value)
    if (blueSlot) {
      blueSlot.champion = champ
      autoAdvance()
      return
    }

    const redSlot = redDraft.value.find((s) => s.id === selectedSlotId.value)
    if (redSlot) {
      redSlot.champion = champ
      autoAdvance()
    }
  }

  const unassignSlot = (slot: DraftSlot) => {
    slot.champion = null
    slot.level = 1
    slot.items = Array(slot.role === 'Bot' ? 7 : 6).fill(null)
    slot.masterworkItems = Array(slot.role === 'Bot' ? 7 : 6).fill(false)
    slot.primaryPath = null
    slot.primaryKeystone = null
    slot.primaryRune1 = null
    slot.primaryRune2 = null
    slot.primaryRune3 = null
    slot.secondaryPath = null
    slot.secondaryRune1 = null
    slot.secondaryRune2 = null
    slot.shardOffensive = null
    slot.shardFlex = null
    slot.shardDefensive = null
    
    // Sync customized slot
    if (activeCustomizerSlot.value?.id === slot.id) {
      activeCustomizerSlot.value = null
    }

    selectedSlotId.value = slot.id
  }

  const selectCustomizerSlot = (slot: DraftSlot) => {
    if (slot.champion) {
      activeCustomizerSlot.value = slot
    }
  }

  const resetDraft = () => {
    blueDraft.value.forEach(slot => {
      slot.champion = null
      slot.level = 1
      slot.items = Array(slot.role === 'Bot' ? 7 : 6).fill(null)
      slot.masterworkItems = Array(slot.role === 'Bot' ? 7 : 6).fill(false)
      slot.primaryPath = null
      slot.primaryKeystone = null
      slot.primaryRune1 = null
      slot.primaryRune2 = null
      slot.primaryRune3 = null
      slot.secondaryPath = null
      slot.secondaryRune1 = null
      slot.secondaryRune2 = null
      slot.shardOffensive = null
      slot.shardFlex = null
      slot.shardDefensive = null
    })

    redDraft.value.forEach(slot => {
      slot.champion = null
      slot.level = 1
      slot.items = Array(slot.role === 'Bot' ? 7 : 6).fill(null)
      slot.masterworkItems = Array(slot.role === 'Bot' ? 7 : 6).fill(false)
      slot.primaryPath = null
      slot.primaryKeystone = null
      slot.primaryRune1 = null
      slot.primaryRune2 = null
      slot.primaryRune3 = null
      slot.secondaryPath = null
      slot.secondaryRune1 = null
      slot.secondaryRune2 = null
      slot.shardOffensive = null
      slot.shardFlex = null
      slot.shardDefensive = null
    })

    selectedSlotId.value = 1
    activeCustomizerSlot.value = null
  }

  const toggleMasterwork = (itemIndex: number) => {
    if (!activeCustomizerSlot.value) return
    if (!activeCustomizerSlot.value.masterworkItems) {
      activeCustomizerSlot.value.masterworkItems = Array(activeCustomizerSlot.value.items.length).fill(false)
    }
    activeCustomizerSlot.value.masterworkItems[itemIndex] = !activeCustomizerSlot.value.masterworkItems[itemIndex]
  }

  const setSpellRank = (spellIdx: number, rank: number) => {
    if (!activeCustomizerSlot.value) return
    if (!activeCustomizerSlot.value.spellRanks) {
      activeCustomizerSlot.value.spellRanks = { q: 1, w: 1, e: 1, r: 1 }
    }
    const keys: ('q' | 'w' | 'e' | 'r')[] = ['q', 'w', 'e', 'r']
    const key = keys[spellIdx] || 'q'
    activeCustomizerSlot.value.spellRanks[key] = rank
  }

  // Rune Builder Operations
  const selectPrimaryPath = (tree: RuneKeystone) => {
    if (!activeCustomizerSlot.value) return
    activeCustomizerSlot.value.primaryPath = tree
    activeCustomizerSlot.value.primaryKeystone = null
    activeCustomizerSlot.value.primaryRune1 = null
    activeCustomizerSlot.value.primaryRune2 = null
    activeCustomizerSlot.value.primaryRune3 = null

    if (activeCustomizerSlot.value.secondaryPath?.id === tree.id) {
      activeCustomizerSlot.value.secondaryPath = null
      activeCustomizerSlot.value.secondaryRune1 = null
      activeCustomizerSlot.value.secondaryRune2 = null
    }
  }

  const selectSecondaryPath = (tree: RuneKeystone) => {
    if (!activeCustomizerSlot.value) return
    activeCustomizerSlot.value.secondaryPath = tree
    activeCustomizerSlot.value.secondaryRune1 = null
    activeCustomizerSlot.value.secondaryRune2 = null
  }

  const selectPrimaryRune = (slotIdx: number, rune: Rune) => {
    if (!activeCustomizerSlot.value) return
    if (slotIdx === 0) activeCustomizerSlot.value.primaryKeystone = rune
    else if (slotIdx === 1) activeCustomizerSlot.value.primaryRune1 = rune
    else if (slotIdx === 2) activeCustomizerSlot.value.primaryRune2 = rune
    else if (slotIdx === 3) activeCustomizerSlot.value.primaryRune3 = rune
  }

  const toggleSecondaryRune = (rune: Rune) => {
    if (!activeCustomizerSlot.value) return
    const slot = activeCustomizerSlot.value
    if (slot.secondaryRune1?.id === rune.id) {
      slot.secondaryRune1 = null
    } else if (slot.secondaryRune2?.id === rune.id) {
      slot.secondaryRune2 = null
    } else {
      if (!slot.secondaryRune1) {
        slot.secondaryRune1 = rune
      } else if (!slot.secondaryRune2) {
        slot.secondaryRune2 = rune
      } else {
        slot.secondaryRune2 = rune
      }
    }
  }

  const removeRunePage = () => {
    if (!activeCustomizerSlot.value) return
    activeCustomizerSlot.value.primaryPath = null
    activeCustomizerSlot.value.primaryKeystone = null
    activeCustomizerSlot.value.primaryRune1 = null
    activeCustomizerSlot.value.primaryRune2 = null
    activeCustomizerSlot.value.primaryRune3 = null
    activeCustomizerSlot.value.secondaryPath = null
    activeCustomizerSlot.value.secondaryRune1 = null
    activeCustomizerSlot.value.secondaryRune2 = null
    activeCustomizerSlot.value.shardOffensive = null
    activeCustomizerSlot.value.shardFlex = null
    activeCustomizerSlot.value.shardDefensive = null
  }

  const setShardOffensive = (val: 'adaptive' | 'as' | 'haste') => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.shardOffensive = val
    }
  }

  const setShardFlex = (val: 'adaptive' | 'ms' | 'scaling_hp') => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.shardFlex = val
    }
  }

  const setShardDefensive = (val: 'scaling_hp' | 'tenacity' | 'flat_hp') => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.shardDefensive = val
    }
  }

  // Item customizer operations
  const selectItemForSlot = (idx: number, item: Item) => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.items[idx] = item
    }
  }

  const removeItemFromSlot = (idx: number) => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.items[idx] = null
    }
  }

  return {
    blueDraft,
    redDraft,
    selectedSlotId,
    activeCustomizerSlot,
    assignChampion,
    unassignSlot,
    selectCustomizerSlot,
    autoAdvance,
    resetDraft,

    // Runes
    selectPrimaryPath,
    selectSecondaryPath,
    selectPrimaryRune,
    toggleSecondaryRune,
    removeRunePage,

    // Shards
    setShardOffensive,
    setShardFlex,
    setShardDefensive,

    // Items
    selectItemForSlot,
    removeItemFromSlot,
    toggleMasterwork,
    setSpellRank,
  }
})
