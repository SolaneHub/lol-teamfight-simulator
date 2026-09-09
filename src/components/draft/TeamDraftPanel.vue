<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div
      :class="[
        'font-bold tracking-wide uppercase text-base border-b pb-2 flex items-center justify-between px-2.5',
        side === 'blue' ? 'text-sky-400 border-sky-900/50' : 'text-rose-400 border-rose-900/50',
      ]"
    >
      <div class="flex items-center gap-2">
        <span
          class="w-3 h-3 rounded-full"
          :class="side === 'blue' ? 'bg-sky-400' : 'bg-rose-400'"
        ></span>
        <span>{{ side === 'blue' ? 'Blue Team' : 'Red Team' }}</span>
      </div>
      <span
        :class="[
          'text-base px-2.5 py-0.5 rounded border font-mono font-bold',
          side === 'blue' ? 'bg-sky-950/50 text-sky-400 border-sky-900/30' : 'bg-rose-950/50 text-rose-400 border-rose-900/30',
        ]"
      >
        {{ side === 'blue' ? 'Team 1' : 'Team 2' }}
      </span>
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
              'absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-all duration-300',
              side === 'blue' ? '-scale-x-100' : '',
              isChampionImplemented(slot.champion.id) ? '' : 'grayscale contrast-125 brightness-90',
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

          <!-- Clear / Delete button (when champion is assigned) -->
          <button
            @click.stop="unassignSlot(slot)"
            :class="[
              'absolute top-3 h-8 w-8 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md shadow-black/40 cursor-pointer z-20 hover:scale-110 opacity-75 group-hover:opacity-100',
              side === 'blue' ? 'right-3' : 'left-3',
            ]"
            title="Remove champion"
          >
            <svg
              class="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
          >
            {{ slot.role }}
          </span>

          <template v-if="slot.champion">
            <span
              class="text-base font-semibold text-white tracking-wide truncate drop-shadow-md leading-tight"
            >
              {{ slot.champion.name }}
            </span>
            <div
              class="flex items-center gap-2 mt-0.5"
              :class="side === 'red' ? 'flex-row-reverse' : ''"
            >
              <span
                class="text-base font-mono leading-none font-bold"
                :class="side === 'blue' ? 'text-sky-400' : 'text-rose-400'"
              >
                Lvl {{ slot.level }}
              </span>
              <span
                v-if="!isChampionImplemented(slot.champion.id)"
                class="text-base font-mono font-bold bg-amber-950/60 text-amber-400/90 px-1.5 py-0.5 rounded border border-amber-800/50 leading-none text-[13px]"
                title="Generic fallback formulas only — no custom combat mechanics or tests yet"
              >
                Untested
              </span>
            </div>
          </template>
          <template v-else>
            <div
              class="flex items-center gap-2 mt-0.5"
              :class="side === 'red' ? 'flex-row-reverse' : ''"
            >
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0"
                :class="
                  selectedSlotId === slot.id
                    ? side === 'blue'
                      ? 'bg-sky-400 text-slate-950 shadow-sky-400/50'
                      : 'bg-rose-400 text-slate-950 shadow-rose-400/50'
                    : side === 'blue'
                      ? 'bg-sky-950 text-sky-400 border border-sky-800/60 group-hover:bg-sky-400 group-hover:text-slate-950'
                      : 'bg-rose-950 text-rose-400 border border-rose-800/60 group-hover:bg-rose-400 group-hover:text-slate-950'
                "
              >
                <svg
                  class="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
              <span
                class="text-base font-semibold tracking-wide transition-colors"
                :class="
                  selectedSlotId === slot.id
                    ? side === 'blue'
                      ? 'text-sky-300 font-bold'
                      : 'text-rose-300 font-bold'
                    : 'text-slate-300 group-hover:text-white'
                "
              >
                Select Champion
              </span>
            </div>
            <span
              class="text-base font-mono mt-0.5 block leading-none font-medium transition-colors"
              :class="
                selectedSlotId === slot.id
                  ? side === 'blue'
                    ? 'text-sky-400/90 font-bold'
                    : 'text-rose-400/90 font-bold'
                  : 'text-slate-500'
              "
            >
              {{ selectedSlotId === slot.id ? 'Picking champion...' : 'Empty Slot' }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraftStore } from '@/stores/draft'
import { getChampionPosition, getChampionSplashUrl, isChampionImplemented } from '@/services'
import type { DraftSlot } from '@/types'

const props = withDefaults(
  defineProps<{
    side: 'blue' | 'red'
    mode?: 'browser' | 'customizer' | 'workshop'
  }>(),
  {
    mode: 'workshop',
  },
)

const draftStore = useDraftStore()

const { blueDraft, redDraft, selectedSlotId } = storeToRefs(draftStore)
const { unassignSlot, selectCustomizerSlot } = draftStore

const slots = computed(() => {
  return props.side === 'blue' ? blueDraft.value : redDraft.value
})

const onSlotClick = (slot: DraftSlot) => {
  selectCustomizerSlot(slot)
}

const getSlotClass = (slot: DraftSlot) => {
  const baseClasses =
    'relative h-37.5 rounded-xl overflow-hidden flex items-center transition-all duration-200 select-none group cursor-pointer border-2 border-solid'
  const alignment = props.side === 'blue' ? 'justify-start' : 'justify-end'
  const isSelected = selectedSlotId.value === slot.id

  if (slot.champion) {
    if (isSelected) {
      return `${baseClasses} ${alignment} bg-slate-900 scale-[1.02] ${
        props.side === 'blue'
          ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-xl shadow-sky-500/25'
          : 'border-rose-400 ring-2 ring-rose-400/50 shadow-xl shadow-rose-500/25'
      }`
    } else {
      return `${baseClasses} ${alignment} bg-slate-900 border-slate-800 shadow-md shadow-black/30 hover:scale-[1.02] ${
        props.side === 'blue'
          ? 'hover:border-sky-400 hover:ring-2 hover:ring-sky-400/30 hover:shadow-xl hover:shadow-sky-500/20'
          : 'hover:border-rose-400 hover:ring-2 hover:ring-rose-400/30 hover:shadow-xl hover:shadow-rose-500/20'
      }`
    }
  } else {
    // Empty slot
    if (isSelected) {
      return `${baseClasses} ${alignment} scale-[1.02] ${
        props.side === 'blue'
          ? 'bg-sky-950/40 border-sky-400 ring-2 ring-sky-400/50 shadow-xl shadow-sky-500/25'
          : 'bg-rose-950/40 border-rose-400 ring-2 ring-rose-400/50 shadow-xl shadow-rose-500/25'
      }`
    } else {
      return `${baseClasses} ${alignment} bg-[#131926] border-slate-800 shadow-md shadow-black/30 hover:scale-[1.02] ${
        props.side === 'blue'
          ? 'hover:border-sky-400 hover:ring-2 hover:ring-sky-400/30 hover:shadow-xl hover:shadow-sky-500/20 hover:bg-sky-950/20'
          : 'hover:border-rose-400 hover:ring-2 hover:ring-rose-400/30 hover:shadow-xl hover:shadow-rose-500/20 hover:bg-rose-950/20'
      }`
    }
  }
}
</script>
