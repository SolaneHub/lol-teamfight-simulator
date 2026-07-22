<template>
  <div v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div
      class="bg-[#0f1422] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
      <!-- Header -->
      <div class="p-4 border-b border-slate-900 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-white">
            Select Item for Slot {{ slotIdx + 1 }}
          </h3>
          <p class="text-base text-slate-450 font-mono">
            Customizing: {{ activeCustomizerSlot?.champion?.name }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white text-lg cursor-pointer">
          ×
        </button>
      </div>

      <!-- Search bar -->
      <div class="p-4 bg-slate-950/40 border-b border-slate-900">
        <input type="text" v-model="itemSearchQuery" placeholder="Search items by name..."
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
      </div>

      <!-- Filters chips (Horizontal Classes) -->
      <div
        class="px-4 py-2 border-b border-slate-900 bg-slate-950/20 flex gap-2 overflow-x-auto custom-scrollbar select-none">
        <button v-for="filter in classFilters" :key="filter.value" @click="selectedClassFilter = filter.value" :class="[
          'px-3 py-1 text-base rounded-lg border font-semibold shrink-0 cursor-pointer transition-all duration-200',
          selectedClassFilter === filter.value
            ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
        ]">
          {{ filter.label }}
        </button>
      </div>

      <!-- Main Layout (Sidebar Stats + Grid Items) -->
      <div class="grow flex overflow-hidden min-h-[50vh]">
        <!-- Left Sidebar (Vertical Stat Filters) -->
        <div
          class="w-48 border-r border-slate-900 bg-slate-950/45 flex flex-col overflow-y-auto p-3 gap-1.5 custom-scrollbar shrink-0 select-none">
          <span
            class="text-xs text-slate-500 uppercase tracking-widest font-mono font-bold mb-1.5 px-1.5">Stats</span>
          <button v-for="stat in statFilters" :key="stat.value" @click="selectedStatFilter = stat.value" :class="[
            'w-full text-left px-3 py-2 text-base rounded-xl border transition-all duration-200 cursor-pointer font-semibold leading-tight',
            selectedStatFilter === stat.value
              ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow shadow-cyan-500/10'
              : 'bg-slate-900/40 border-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-800'
          ]">
            {{ stat.label }}
          </button>
        </div>

        <!-- Items Lists Grouped by Tier -->
        <div class="grow overflow-y-auto p-4 flex flex-col gap-6 max-h-[50vh] custom-scrollbar">
          <div
            v-for="tierName in ['starter', 'basic', 'epic', 'legendary'] as const"
            :key="tierName"
            v-show="filteredPickerItemsGrouped[tierName].length > 0"
            class="flex flex-col gap-3"
          >
            <!-- Tier Title -->
            <h4 class="text-base font-bold text-slate-400 capitalize tracking-wider border-b border-slate-800 pb-1.5 font-mono">
              {{ tierName }} Items ({{ filteredPickerItemsGrouped[tierName].length }})
            </h4>
            <!-- Grid -->
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <div
                v-for="item in filteredPickerItemsGrouped[tierName]"
                :key="item.id"
                @click="onSelectItem(item)"
                class="group bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105"
              >
                <img
                  :src="getItemIconUrl(item)"
                  class="h-10 w-10 object-contain rounded mb-1 select-none pointer-events-none"
                />
                <span
                  class="text-base font-semibold text-slate-300 text-center truncate w-full leading-tight"
                  >{{ item.name }}</span>
                <span class="text-base font-mono text-amber-500 mt-0.5 font-bold"
                  >{{ item.gold.total }} G</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraftStore } from '@/stores/draft'
import { useDDragonStore } from '@/stores/ddragon'
import { getItemClass, getItemTier, getItemIconUrl } from '@/services'
import type { Item } from '@/types'

const props = defineProps<{
  isOpen: boolean
  slotIdx: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const draftStore = useDraftStore()
const ddragonStore = useDDragonStore()

const { activeCustomizerSlot } = storeToRefs(draftStore)
const { selectItemForSlot } = draftStore
const { allItems } = storeToRefs(ddragonStore)

const itemSearchQuery = ref('')
const selectedClassFilter = ref('All')
const selectedStatFilter = ref('All')

watch(() => props.isOpen, (open) => {
  if (open) {
    itemSearchQuery.value = ''
    selectedClassFilter.value = 'All'
    selectedStatFilter.value = 'All'
  }
})

const classFilters = [
  { label: 'All Classes', value: 'All' },
  { label: 'Fighter', value: 'Fighter' },
  { label: 'Marksman', value: 'Marksman' },
  { label: 'Assassin', value: 'Assassin' },
  { label: 'Mage', value: 'Mage' },
  { label: 'Tank', value: 'Tank' },
  { label: 'Support', value: 'Support' },
]

const statFilters = [
  { label: 'All Stats', value: 'All' },
  { label: 'Attack Damage', value: 'Damage' },
  { label: 'Ability Power', value: 'SpellDamage' },
  { label: 'Health', value: 'Health' },
  { label: 'Armor', value: 'Armor' },
  { label: 'Magic Resist', value: 'SpellBlock' },
  { label: 'Attack Speed', value: 'AttackSpeed' },
  { label: 'Critical Strike', value: 'CriticalStrike' },
  { label: 'Ability Haste', value: 'AbilityHaste' },
  { label: 'Life Steal', value: 'LifeSteal' },
]

const purchasableItems = computed(() => {
  const seenNames = new Set<string>()
  return allItems.value.filter((item) => {
    if (item.id.length !== 4) return false
    if (item.name.startsWith("Guardian's ")) return false
    const isTearUpgrade = ['3040', '3042', '3121'].includes(item.id)
    const isPurchasable = item.gold.purchasable || isTearUpgrade
    if (!isPurchasable || item.gold.total <= 0) return false
    const isOnSR = item.iconPath ? true : (item.maps?.['11'] === true || isTearUpgrade)
    if (!isOnSR) return false
    if (item.requiredAlly === 'Ornn') return false
    if (item.requiredChampion && activeCustomizerSlot.value) {
      if (item.requiredChampion !== activeCustomizerSlot.value.champion?.name) {
        return false
      }
    }
    const isInStore = item.inStore !== false || isTearUpgrade
    if (!isInStore) return false
    if (seenNames.has(item.name)) return false
    seenNames.add(item.name)
    return true
  })
})

const filteredPickerItems = computed(() => {
  if (!activeCustomizerSlot.value) return []

  const role = activeCustomizerSlot.value.role
  let list = [...purchasableItems.value]

  // 1. Filter by Class
  if (selectedClassFilter.value !== 'All') {
    list = list.filter((item) => {
      const classes = getItemClass(item)
      return classes.includes(selectedClassFilter.value)
    })
  }

  // 2. Filter by Stat
  if (selectedStatFilter.value !== 'All') {
    list = list.filter((item) => {
      const tags = item.tags
      const desc = item.description.toLowerCase()
      
      switch (selectedStatFilter.value) {
        case 'Damage':
          return item.stats.FlatPhysicalDamageMod || tags.includes('Damage')
        case 'SpellDamage':
          return item.stats.FlatMagicDamageMod || tags.includes('SpellDamage')
        case 'Health':
          return item.stats.FlatHPPoolMod || tags.includes('Health')
        case 'Armor':
          return item.stats.FlatArmorMod || tags.includes('Armor')
        case 'SpellBlock':
          return item.stats.FlatSpellBlockMod || tags.includes('SpellBlock')
        case 'AttackSpeed':
          return item.stats.PercentAttackSpeedMod || tags.includes('AttackSpeed')
        case 'CriticalStrike':
          return tags.includes('CriticalStrike')
        case 'AbilityHaste':
          return desc.includes('ability haste')
        case 'LifeSteal':
          return desc.includes('life steal') || desc.includes('omnivamp')
        default:
          return true
      }
    })
  }

  // 3. Search query
  if (!itemSearchQuery.value.trim()) return list
  const q = itemSearchQuery.value.toLowerCase().trim()
  return list.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(q)
    const matchesColloq = item.colloq.toLowerCase().includes(q)
    const matchesTags = item.tags.some(tag => tag.toLowerCase() === q)
    return matchesName || matchesColloq || matchesTags
  })
})

const filteredPickerItemsGrouped = computed(() => {
  const groups = {
    starter: [] as Item[],
    basic: [] as Item[],
    epic: [] as Item[],
    legendary: [] as Item[],
  }

  filteredPickerItems.value.forEach((item) => {
    const tier = getItemTier(item)
    groups[tier].push(item)
  })

  return groups
})

const onSelectItem = (item: Item) => {
  selectItemForSlot(props.slotIdx, item)
  emit('close')
}
</script>
