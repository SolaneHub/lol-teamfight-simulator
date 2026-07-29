<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div
      :class="[
        'font-bold tracking-wide uppercase text-base border-b pb-2 flex items-center justify-between px-2.5',
        side === 'blue' ? 'text-sky-400 border-sky-955' : 'text-red-400 border-red-955',
      ]"
    >
      <span>{{
        side === 'blue'
          ? mode === 'customizer'
            ? 'Blue Team Builds'
            : 'Blue Team'
          : mode === 'customizer'
            ? 'Red Team Builds'
            : 'Red Team'
      }}</span>
      <span
        :class="[
          'text-base px-2.5 py-0.5 rounded border',
          side === 'blue' ? 'bg-sky-950/50 border-sky-900/30' : 'bg-red-950/50 border-red-900/30',
        ]"
        >{{ side === 'blue' ? 'Team 1' : 'Team 2' }}</span
      >
    </div>

    <!-- Slots List -->
    <div class="flex flex-col gap-3 px-2.5">
      <div
        v-for="slot in slots"
        :key="slot.id"
        @click="onSlotClick(slot)"
        :class="getSlotClass(slot)"
      >
        <!-- Background Image if champion is selected -->
        <template v-if="slot.champion">
          <img
            :src="getChampionSplashUrl(slot.champion.id)"
            :class="[
              'absolute inset-0 w-full h-full object-cover select-none pointer-events-none',
              side === 'blue' ? '-scale-x-100' : '',
            ]"
            :style="{ objectPosition: getChampionPosition(slot.champion.id) }"
          />

          <!-- Dark overlay to ensure text readability -->
          <div
            :class="[
              'absolute inset-0',
              side === 'blue'
                ? 'bg-linear-to-r from-black/95 via-black/40 to-transparent'
                : 'bg-linear-to-l from-black/95 via-black/40 to-transparent',
            ]"
          ></div>

          <!-- Clear button (only in browser mode) -->
          <button
            v-if="mode === 'browser'"
            @click.stop="unassignSlot(slot)"
            :class="[
              'absolute top-3 h-7 w-7 bg-red-600 text-white rounded-full flex items-center justify-center text-base font-bold hover:bg-red-500 transition-all duration-200 opacity-0 pointer-events-none scale-75 group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto shadow-md shadow-black/30 cursor-pointer z-20',
              side === 'blue' ? 'right-3' : 'left-3',
            ]"
          >
            <span class="leading-none -mt-0.5">×</span>
          </button>
        </template>

        <!-- Slot description / Info -->
        <div
          :class="[
            'relative z-10 px-4 py-2 flex flex-col justify-center min-w-0',
            side === 'red' ? 'items-end text-right' : '',
          ]"
        >
          <span
            class="text-base text-slate-400 uppercase tracking-widest font-mono font-bold mb-0.5"
            >{{ slot.role }}</span
          >

          <template v-if="slot.champion">
            <span
              class="text-base font-semibold text-white tracking-wide truncate drop-shadow-md leading-tight"
            >
              {{ slot.champion.name }}
            </span>
            <span
              v-if="mode === 'customizer'"
              class="text-base font-mono mt-0.5 block leading-none"
              :class="side === 'blue' ? 'text-sky-400' : 'text-red-400'"
            >
              Lvl {{ slot.level }}
            </span>
          </template>
          <span v-else class="text-base text-slate-655 italic">
            {{ mode === 'customizer' ? 'Empty Slot...' : 'Select Champion...' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraftStore } from '@/stores/draft'
import { getChampionPosition, getChampionSplashUrl } from '@/services'
import type { DraftSlot } from '@/types'

const props = defineProps<{
  side: 'blue' | 'red'
  mode: 'browser' | 'customizer'
}>()

const draftStore = useDraftStore()

const { blueDraft, redDraft, selectedSlotId, activeCustomizerSlot } = storeToRefs(draftStore)

const { unassignSlot, selectCustomizerSlot } = draftStore

const slots = computed(() => {
  return props.side === 'blue' ? blueDraft.value : redDraft.value
})

const onSlotClick = (slot: DraftSlot) => {
  if (props.mode === 'browser') {
    selectedSlotId.value = slot.id
  } else {
    selectCustomizerSlot(slot)
  }
}

const getSlotClass = (slot: DraftSlot) => {
  const baseClasses =
    'relative h-37.5 rounded-xl overflow-hidden flex items-center transition-all duration-300 select-none group cursor-pointer'
  const alignment = props.side === 'blue' ? 'justify-start' : 'justify-end'

  if (props.mode === 'browser') {
    const isSelected = selectedSlotId.value === slot.id
    if (slot.champion) {
      if (isSelected) {
        return `${baseClasses} ${alignment} bg-slate-900 border border-solid ${
          props.side === 'blue'
            ? 'border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.02]'
            : 'border-red-400 shadow-lg shadow-red-500/20 scale-[1.02]'
        }`
      } else {
        return `${baseClasses} ${alignment} bg-slate-900 border border-solid border-slate-800 hover:scale-[1.02] ${
          props.side === 'blue'
            ? 'hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20'
            : 'hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20'
        }`
      }
    } else {
      // Empty slot in browser
      if (isSelected) {
        return `${baseClasses} ${alignment} bg-sky-950/20 border border-dashed opacity-100 scale-[1.02] ${
          props.side === 'blue'
            ? 'border-sky-400 shadow-lg shadow-sky-500/20'
            : 'border-red-400 shadow-lg shadow-red-500/20'
        }`
      } else {
        return `${baseClasses} ${alignment} bg-slate-950/20 border border-dashed border-slate-800 opacity-40 hover:opacity-100 hover:scale-[1.02] ${
          props.side === 'blue'
            ? 'hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20'
            : 'hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20'
        }`
      }
    }
  } else {
    // Customizer mode
    if (slot.champion) {
      const isSelected = activeCustomizerSlot.value?.id === slot.id
      if (isSelected) {
        return `${baseClasses} ${alignment} bg-slate-900 border border-solid ${
          props.side === 'blue'
            ? 'border-sky-400 shadow-lg shadow-sky-500/20 scale-[1.02]'
            : 'border-red-400 shadow-lg shadow-red-500/20 scale-[1.02]'
        }`
      } else {
        return `${baseClasses} ${alignment} bg-slate-900 border border-solid border-slate-800 hover:scale-[1.02] ${
          props.side === 'blue'
            ? 'hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10'
            : 'hover:border-red-400 hover:shadow-lg hover:shadow-red-500/20'
        }`
      }
    } else {
      return `${baseClasses} ${alignment} bg-slate-950/20 border border-dashed border-slate-800 opacity-40 cursor-not-allowed`
    }
  }
}
</script>
