<template>
  <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
    <button
      @click="selectPatch(true)"
      :disabled="isPatchLoading || isLoading"
      :class="isLive ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
      class="px-4 py-1.5 rounded-md text-base font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      🟢 Live
    </button>
    <button
      @click="selectPatch(false)"
      :disabled="isPatchLoading || isLoading || !precedingPatch"
      :class="!isLive ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'"
      class="px-4 py-1.5 rounded-md text-base font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      🌐 Proplay
      <span v-if="precedingPatch" class="text-sm font-mono opacity-80">
        ({{ precedingPatch }})
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDDragonStore } from '@/stores/ddragon'

const ddragonStore = useDDragonStore()
const { currentPatch, availablePatches, isLoading, isPatchLoading } = storeToRefs(ddragonStore)

const isLive = computed(() => currentPatch.value === 'latest')
const precedingPatch = computed(() => {
  return availablePatches.value.length > 1 ? availablePatches.value[1] : ''
})

const selectPatch = (live: boolean) => {
  if (live) {
    ddragonStore.setPatch('latest')
  } else if (precedingPatch.value) {
    ddragonStore.setPatch(precedingPatch.value)
  }
}
</script>
