<template>
  <div class="relative inline-flex items-center gap-2">
    <div
      class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 shadow-md backdrop-blur-md hover:border-cyan-500/50 transition-all group"
    >
      <!-- Icon / Status -->
      <span class="relative flex h-2 w-2">
        <span
          v-if="isPatchLoading"
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
        ></span>
        <span
          :class="isPatchLoading ? 'bg-cyan-500' : 'bg-emerald-500'"
          class="relative inline-flex rounded-full h-2 w-2"
        ></span>
      </span>

      <span
        class="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1"
      >
        <span>Patch:</span>
      </span>

      <!-- Select Dropdown -->
      <div class="relative flex items-center">
        <select
          :value="currentPatch"
          @change="onPatchChange"
          :disabled="isPatchLoading || isLoading"
          class="bg-transparent text-sm font-mono font-bold text-cyan-300 focus:outline-none cursor-pointer pr-5 py-0.5 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Select Game Patch"
        >
          <option
            v-for="(patch, idx) in availablePatches"
            :key="patch"
            :value="patch"
            class="bg-slate-900 text-slate-200 font-mono py-1"
          >
            {{ patch }} {{ idx === 0 ? '(Live)' : idx === 1 ? '(Proplay)' : '' }}
          </option>
        </select>
        <!-- Arrow Icon -->
        <svg
          class="w-3.5 h-3.5 text-cyan-400 absolute right-0 pointer-events-none transition-transform group-hover:translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- Badge / Status Tag -->
    <span
      v-if="isLivePatch"
      class="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest"
    >
      Live
    </span>
    <span
      v-else
      class="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest"
      title="Common competitive patch version"
    >
      Proplay
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDDragonStore } from '@/stores/ddragon'

const ddragonStore = useDDragonStore()
const { currentPatch, availablePatches, isLoading, isPatchLoading } = storeToRefs(ddragonStore)

const isLivePatch = computed(() => {
  return availablePatches.value.length > 0 && currentPatch.value === availablePatches.value[0]
})

const onPatchChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  if (select && select.value) {
    ddragonStore.setPatch(select.value)
  }
}
</script>
