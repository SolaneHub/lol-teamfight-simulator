<template>
  <div
    class="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 xl:grid-cols-12 gap-6 py-6 px-4 xl:px-3 w-full max-w-none"
  >
    <!-- LEFT COLUMN: Blue Team (5 slots) -->
    <div class="xl:col-span-3">
      <TeamDraftPanel side="blue" mode="browser" />
    </div>

    <!-- CENTER COLUMN: Champion Grid (6 cols) -->
    <div class="xl:col-span-6 flex flex-col gap-6 px-2">
      <!-- Search and filter section -->
      <div
        class="bg-[#131926] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 class="text-base font-semibold text-white">Champion Selection</h2>
          <p class="text-base text-slate-400">
            Click a portrait to draft. Already picked champions are hidden.
          </p>
        </div>
        <div class="relative w-full md:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search champion..."
            class="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-10 py-2 text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Clear search"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div
          class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"
        ></div>
        <p class="font-mono text-base">Loading champion images...</p>
      </div>

      <!-- Champion Grid -->
      <div
        v-else
        class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-8 gap-2 auto-rows-max max-h-184 overflow-y-auto p-3 custom-scrollbar rounded-xl bg-slate-950/20"
      >
        <div
          v-for="champ in filteredChampions"
          :key="champ.id"
          @click="assignChampion(champ)"
          :class="[
            'group relative z-0 hover:z-10 w-full aspect-square bg-slate-900 border-2 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer',
            isChampionImplemented(champ.id)
              ? 'border-slate-800 hover:scale-105 hover:border-cyan-400 hover:ring-2 hover:ring-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/25'
              : 'border-slate-800/50 opacity-60 hover:opacity-100 hover:scale-105 hover:border-slate-600 hover:shadow-lg'
          ]"
          :title="isChampionImplemented(champ.id) ? champ.name : `${champ.name} (Untested / No custom logic)`"
        >
          <!-- Image -->
          <img
            :src="getChampionIconUrl(champ)"
            :alt="champ.name"
            :class="[
              'w-full h-full object-cover select-none transition-all duration-500 group-hover:scale-110',
              isChampionImplemented(champ.id) ? '' : 'grayscale contrast-125 brightness-90'
            ]"
            loading="lazy"
          />
          <!-- Name overlay on hover with marquee animation for long names -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5 overflow-hidden pointer-events-none"
          >
            <!-- Short names: centered -->
            <span
              v-if="champ.name.length <= 6"
              class="text-base font-bold tracking-tight text-white text-center font-mono w-full truncate drop-shadow"
            >
              {{ champ.name }}
            </span>

            <!-- Long names: animated horizontal marquee on hover so full name is readable -->
            <div
              v-else
              class="w-full overflow-hidden whitespace-nowrap flex items-center"
            >
              <div class="champion-name-marquee inline-flex items-center gap-3 text-base font-bold font-mono text-white drop-shadow">
                <span>{{ champ.name }}</span>
                <span class="text-cyan-400 font-bold">•</span>
                <span>{{ champ.name }}</span>
                <span class="text-cyan-400 font-bold">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="!isLoading && filteredChampions.length === 0"
        class="text-center py-20 text-slate-550 border border-dashed border-slate-800 rounded-xl bg-slate-900/10"
      >
        <p class="text-base font-mono">No champions found matching "{{ searchQuery }}"</p>
      </div>
    </div>

    <!-- RIGHT COLUMN: Red Team (5 slots) -->
    <div class="xl:col-span-3">
      <TeamDraftPanel side="red" mode="browser" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraftStore } from '@/stores/draft'
import { useDDragonStore } from '@/stores/ddragon'
import TeamDraftPanel from '@/components/draft/TeamDraftPanel.vue'
import { getChampionIconUrl, isChampionImplemented } from '@/services'

const draftStore = useDraftStore()
const ddragonStore = useDDragonStore()

const { blueDraft, redDraft } = storeToRefs(draftStore)
const { assignChampion } = draftStore

const { allChampions, isLoading } = storeToRefs(ddragonStore)

const searchQuery = ref('')

const filteredChampions = computed(() => {
  const pickedIds = new Set([
    ...blueDraft.value.map((s) => s.champion?.id).filter(Boolean),
    ...redDraft.value.map((s) => s.champion?.id).filter(Boolean),
  ])

  const list = allChampions.value.filter((c) => !pickedIds.has(c.id))

  if (!searchQuery.value.trim()) return list
  const q = searchQuery.value.toLowerCase().trim()
  return list.filter((c) => c.name.toLowerCase().includes(q))
})
</script>

<style scoped>
@keyframes champion-name-scroll {
  0%,
  15% {
    transform: translateX(0%);
  }
  85%,
  100% {
    transform: translateX(-50%);
  }
}

.champion-name-marquee {
  display: inline-flex;
  white-space: nowrap;
  will-change: transform;
}

.group:hover .champion-name-marquee {
  animation: champion-name-scroll 3.5s linear infinite;
}
</style>
