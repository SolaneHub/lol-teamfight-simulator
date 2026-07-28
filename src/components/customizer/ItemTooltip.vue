<template>
  <Teleport to="body">
    <div
      v-if="item"
      ref="tooltipRef"
      :style="{
        top: `${computedPos.y}px`,
        left: `${computedPos.x}px`,
      }"
      class="fixed z-100 w-80 bg-[#131926] border border-slate-800 rounded-xl overflow-hidden shadow-xl pointer-events-none transition-opacity duration-150"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950/50">
        <!-- Item Icon -->
        <div
          class="h-11 w-11 rounded-lg bg-slate-950 border border-slate-800 p-0.5 shrink-0 flex items-center justify-center"
        >
          <img
            :src="getItemIconUrl(item)"
            class="h-full w-full object-contain select-none pointer-events-none"
          />
        </div>
        <div class="flex flex-col min-w-0">
          <h4 class="text-base font-bold text-white tracking-wide truncate leading-tight">
            {{ item.name }}
          </h4>
          <span
            class="text-base px-2 py-0.5 rounded font-mono border uppercase tracking-wider font-semibold mt-1 inline-block w-fit bg-amber-950/40 text-amber-400 border-amber-900/30"
          >
            💰 {{ item.gold?.total || 0 }} Gold
          </span>
        </div>
      </div>

      <!-- Description -->
      <div
        class="p-4 text-base text-slate-300 font-sans leading-relaxed max-h-[75vh] overflow-y-auto custom-scrollbar"
        v-html="formatTooltipTags(item.description || '')"
      ></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getItemIconUrl, formatTooltipTags } from '@/services'
import type { Item } from '@/types'

const props = defineProps<{
  item: Item | null
  mousePos: { x: number; y: number }
}>()

const tooltipRef = ref<HTMLElement | null>(null)

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 800)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

const computedPos = computed(() => {
  const cardWidth = tooltipRef.value?.offsetWidth || 320
  const cardHeight = tooltipRef.value?.offsetHeight || 240
  const padding = 20

  let x = props.mousePos.x + 15
  let y = props.mousePos.y + 15

  if (x + cardWidth > windowWidth.value - padding) {
    x = props.mousePos.x - cardWidth - 10
  }

  if (y + cardHeight > windowHeight.value - padding) {
    y = props.mousePos.y - cardHeight - 10
  }

  return {
    x: Math.max(padding, x),
    y: Math.max(padding, y),
  }
})
</script>
