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
    if (selectedSlotId.value === null) {
      const firstEmpty = [...blueDraft.value, ...redDraft.value].find((s) => s.champion === null)
      if (firstEmpty) {
        selectedSlotId.value = firstEmpty.id
      } else {
        return
      }
    }

    // Prevent duplicates
    const isAlreadySelected =
      blueDraft.value.some((s) => s.champion?.id === champ.id) ||
      redDraft.value.some((s) => s.champion?.id === champ.id)

    if (isAlreadySelected) return

    const blueSlot = blueDraft.value.find((s) => s.id === selectedSlotId.value)
    if (blueSlot) {
      blueSlot.champion = champ
      activeCustomizerSlot.value = blueSlot
      return
    }

    const redSlot = redDraft.value.find((s) => s.id === selectedSlotId.value)
    if (redSlot) {
      redSlot.champion = champ
      activeCustomizerSlot.value = redSlot
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

    // Sync customized slot to null and keep this slot selected
    selectedSlotId.value = slot.id
    activeCustomizerSlot.value = null
  }

  const selectCustomizerSlot = (slot: DraftSlot) => {
    selectedSlotId.value = slot.id
    if (slot.champion) {
      activeCustomizerSlot.value = slot
    } else {
      activeCustomizerSlot.value = null
    }
  }

  const resetDraft = () => {
    blueDraft.value.forEach((slot) => {
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

    redDraft.value.forEach((slot) => {
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
      activeCustomizerSlot.value.masterworkItems = Array(
        activeCustomizerSlot.value.items.length,
      ).fill(false)
    }
    activeCustomizerSlot.value.masterworkItems[itemIndex] =
      !activeCustomizerSlot.value.masterworkItems[itemIndex]
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

  const toggleSecondaryRune = (rune: Rune, rowRunes?: Rune[]) => {
    if (!activeCustomizerSlot.value) return
    const slot = activeCustomizerSlot.value
    if (slot.secondaryRune1?.id === rune.id) {
      slot.secondaryRune1 = null
      return
    }
    if (slot.secondaryRune2?.id === rune.id) {
      slot.secondaryRune2 = null
      return
    }

    let currentLineRunes: Rune[] = rowRunes || []
    if (!currentLineRunes.length && slot.secondaryPath?.slots) {
      const parentSlot = slot.secondaryPath.slots.find((s) => s.runes.some((r) => r.id === rune.id))
      if (parentSlot) {
        currentLineRunes = parentSlot.runes
      }
    }

    const isRune1InSameRow = currentLineRunes.some((r) => r.id === slot.secondaryRune1?.id)
    const isRune2InSameRow = currentLineRunes.some((r) => r.id === slot.secondaryRune2?.id)

    if (isRune1InSameRow) {
      slot.secondaryRune1 = rune
    } else if (isRune2InSameRow) {
      slot.secondaryRune2 = rune
    } else if (!slot.secondaryRune1) {
      slot.secondaryRune1 = rune
    } else if (!slot.secondaryRune2) {
      slot.secondaryRune2 = rune
    } else {
      slot.secondaryRune2 = rune
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

  const setItemStack = (itemIndex: number, stacks: number) => {
    if (!activeCustomizerSlot.value) return
    if (!activeCustomizerSlot.value.itemStacks) {
      activeCustomizerSlot.value.itemStacks = Array(activeCustomizerSlot.value.items.length).fill(
        undefined,
      )
    }
    const item = activeCustomizerSlot.value.items[itemIndex]
    const name = item?.name.toLowerCase() || ''
    const itemId = String(item?.id || '')
    const isMejai = name.includes('mejai') || itemId === '3041' || itemId === '223041'
    const isDarkSeal =
      name.includes('dark seal') ||
      name.includes('sigillo oscuro') ||
      itemId === '1082' ||
      itemId === '221082'
    const isRoA =
      name.includes('rod of ages') ||
      name.includes('bastone delle ere') ||
      itemId === '6657' ||
      itemId === '226657'
    const isHeartsteel =
      name.includes('heartsteel') ||
      name.includes("cuore d'acciaio") ||
      itemId === '3084' ||
      itemId === '223084'
    const isHubris =
      name.includes('hubris') ||
      name.includes('superbia') ||
      itemId === '6697' ||
      itemId === '226697'
    const isShojin = name.includes('shojin') || itemId === '3161' || itemId === '223161'
    const isTear =
      name.includes('tear of the goddess') ||
      name.includes('lacrima della dea') ||
      name.includes("winter's approach") ||
      name.includes("approccio dell'inverno") ||
      itemId === '3070' ||
      itemId === '3119'

    let maxStacks = 0
    if (isHeartsteel) maxStacks = 2000
    else if (isTear) maxStacks = 360
    else if (isHubris) maxStacks = 50
    else if (isMejai) maxStacks = 25
    else if (isDarkSeal || isRoA) maxStacks = 10
    else if (isShojin) maxStacks = 4

    const clamped = Math.min(maxStacks, Math.max(0, isNaN(stacks) ? 0 : stacks))
    activeCustomizerSlot.value.itemStacks[itemIndex] = clamped
  }

  const setRuneStack = (runeKey: string, stacks: number) => {
    if (!activeCustomizerSlot.value) return
    if (!activeCustomizerSlot.value.runeStacks) {
      activeCustomizerSlot.value.runeStacks = {}
    }
    const val = Math.max(0, isNaN(stacks) ? 0 : stacks)
    activeCustomizerSlot.value.runeStacks[runeKey] = val
    if (runeKey === 'conqueror') activeCustomizerSlot.value.conquerorStacks = val
    if (runeKey === 'lethalTempo') activeCustomizerSlot.value.lethalTempoStacks = val
    if (runeKey === 'darkHarvest') activeCustomizerSlot.value.darkHarvestStacks = val
  }

  const selectItemForSlot = (idx: number, item: Item) => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.items[idx] = item
      if (!activeCustomizerSlot.value.itemStacks) {
        activeCustomizerSlot.value.itemStacks = Array(activeCustomizerSlot.value.items.length).fill(
          undefined,
        )
      }
      const name = item.name.toLowerCase()
      const itemId = String(item.id || '')
      const isMejai = name.includes('mejai') || itemId === '3041' || itemId === '223041'
      const isDarkSeal =
        name.includes('dark seal') ||
        name.includes('sigillo oscuro') ||
        itemId === '1082' ||
        itemId === '221082'
      const isRoA =
        name.includes('rod of ages') ||
        name.includes('bastone delle ere') ||
        itemId === '6657' ||
        itemId === '226657'
      const isHeartsteel =
        name.includes('heartsteel') ||
        name.includes("cuore d'acciaio") ||
        itemId === '3084' ||
        itemId === '223084'
      const isHubris =
        name.includes('hubris') ||
        name.includes('superbia') ||
        itemId === '6697' ||
        itemId === '226697'
      const isShojin = name.includes('shojin') || itemId === '3161' || itemId === '223161'
      const isTear =
        name.includes('tear of the goddess') ||
        name.includes('lacrima della dea') ||
        name.includes("winter's approach") ||
        name.includes("approccio dell'inverno") ||
        itemId === '3070' ||
        itemId === '3119'

      if (isHeartsteel) {
        activeCustomizerSlot.value.itemStacks[idx] = 300
      } else if (isTear) {
        activeCustomizerSlot.value.itemStacks[idx] = 360
      } else if (isHubris) {
        activeCustomizerSlot.value.itemStacks[idx] = 5
      } else if (isMejai) {
        activeCustomizerSlot.value.itemStacks[idx] = 25
      } else if (isDarkSeal || isRoA) {
        activeCustomizerSlot.value.itemStacks[idx] = 10
      } else if (isShojin) {
        activeCustomizerSlot.value.itemStacks[idx] = 4
      } else {
        activeCustomizerSlot.value.itemStacks[idx] = undefined
      }
    }
  }

  const removeItemFromSlot = (idx: number) => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.items[idx] = null
      if (activeCustomizerSlot.value.itemStacks) {
        activeCustomizerSlot.value.itemStacks[idx] = undefined
      }
    }
  }

  const toggleQuestCompleted = () => {
    if (activeCustomizerSlot.value) {
      activeCustomizerSlot.value.questCompleted = !activeCustomizerSlot.value.questCompleted
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
    setRuneStack,

    // Shards
    setShardOffensive,
    setShardFlex,
    setShardDefensive,

    // Items
    selectItemForSlot,
    removeItemFromSlot,
    toggleMasterwork,
    setItemStack,
    setSpellRank,
    toggleQuestCompleted,
  }
})
