<template>
  <div class="flex-1 min-h-0 overflow-y-auto grid grid-cols-1 xl:grid-cols-12 gap-6 py-6 px-4 xl:px-3 w-full max-w-none">
    <!-- LEFT COLUMN: Blue Team (5 slots) -->
    <div class="xl:col-span-3">
      <TeamDraftPanel side="blue" mode="browser" />
    </div>

    <!-- CENTER COLUMN: Champion Grid (6 cols) -->
    <div class="xl:col-span-6 flex flex-col gap-6 px-2">
      <!-- Search and filter section -->
      <div
        class="bg-[#131926] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-base font-semibold text-white">Champion Selection</h2>
          <p class="text-base text-slate-400">
            Click a portrait to draft. Already picked champions are hidden.
          </p>
        </div>
        <div class="relative w-full md:w-80">
          <input v-model="searchQuery" type="text" placeholder="Search champion..."
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono" />
          <span class="absolute right-3 top-2.5 text-slate-500 text-base font-mono select-none pointer-events-none">
            {{ filteredChampions.length }} / {{ allChampions.length }}
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div class="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <p class="font-mono text-base">Loading champion images...</p>
      </div>

      <!-- Champion Grid -->
      <div v-else
        class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 xl:grid-cols-8 gap-2 auto-rows-max max-h-184 overflow-y-auto p-3 custom-scrollbar rounded-xl bg-slate-950/20">
        <div v-for="champ in filteredChampions" :key="champ.id" @click="assignChampion(champ)"
          class="group relative z-0 hover:z-10 w-full aspect-square bg-slate-900 border border-slate-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer">
          <!-- Image -->
          <img :src="getChampionIconUrl(champ)" :alt="champ.name"
            class="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-110"
            loading="lazy" />
          <!-- Name overlay on hover -->
          <div
            class="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-1.5">
            <span class="text-base font-bold tracking-tight text-white text-center font-mono truncate w-full">
              {{ champ.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!isLoading && filteredChampions.length === 0"
        class="text-center py-20 text-slate-550 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
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
import { getChampionIconUrl } from '@/services'

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

  let list = allChampions.value.filter((c) => !pickedIds.has(c.id))

  if (!searchQuery.value.trim()) return list
  const q = searchQuery.value.toLowerCase().trim()
  return list.filter((c) => c.name.toLowerCase().includes(q))
})
</script>
