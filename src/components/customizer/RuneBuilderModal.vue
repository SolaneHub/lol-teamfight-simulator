<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
  >
    <div
      class="bg-[#0f1422] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl"
    >
      <!-- Header with Champion Splash background -->
      <div class="relative h-28 flex items-end p-5 border-b border-slate-800 shrink-0">
        <img
          v-if="activeCustomizerSlot?.champion"
          :src="getChampionSplashUrl(activeCustomizerSlot.champion.id)"
          :class="[
            'absolute inset-0 w-full h-full object-cover select-none pointer-events-none brightness-[0.35]',
            activeCustomizerSlot.side === 'blue' ? '-scale-x-100' : '',
          ]"
          :style="{ objectPosition: getChampionPosition(activeCustomizerSlot.champion.id) }"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-[#0f1422] via-[#0f1422]/20 to-transparent"
        ></div>

        <div class="relative z-10 flex items-center justify-between w-full">
          <div class="flex items-center gap-3.5">
            <!-- Portrait -->
            <img
              v-if="activeCustomizerSlot?.champion"
              :src="getChampionIconUrl(activeCustomizerSlot.champion)"
              class="h-12 w-12 rounded-lg border border-slate-700 shadow-md object-cover select-none"
            />
            <div>
              <h3 class="text-lg font-bold text-white tracking-wide leading-none mb-1">
                Rune Page Customizer
              </h3>
              <p class="text-base text-slate-400 font-mono">
                Customizing: {{ activeCustomizerSlot?.champion?.name }}
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-slate-400 hover:text-white text-2xl cursor-pointer leading-none px-2 py-1"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="grow overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        <!-- MAIN RUNES SECTION (Grid with Primary and Secondary path columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:min-h-[440px]">
          <!-- PRIMARY PATH COLUMN -->
          <div class="flex flex-col gap-4 h-full">
            <span
              class="text-base text-cyan-400 font-bold uppercase tracking-widest font-mono text-center"
              >Primary Path</span
            >

            <!-- Path Selectors as Beautiful Cards -->
            <div class="flex flex-row items-center gap-2.5 justify-center w-full mx-auto">
              <div
                v-for="tree in orderedRunes"
                :key="tree.id"
                @click="selectPrimaryPath(tree)"
                :title="tree.name"
                :class="[
                  'group h-14 w-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] shrink-0',
                  activeCustomizerSlot?.primaryPath?.id === tree.id
                    ? `border-2 ${getPathTheme(tree.id).activeBorder} bg-slate-950/40 p-2 shadow-lg ${getPathTheme(tree.id).glow}`
                    : 'opacity-40 hover:opacity-100 p-2',
                ]"
              >
                <img
                  :src="getRuneIconUrl(tree.icon)"
                  class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                />
              </div>
            </div>

            <!-- Runes List inside Selected Primary Path -->
            <div
              v-if="activeCustomizerSlot?.primaryPath"
              class="grow flex flex-col justify-between w-64 mx-auto relative py-3"
            >
              <!-- Render 4 slots (Keystone, Slot 1, Slot 2, Slot 3) -->
              <div
                v-for="(slot, slotIdx) in activeCustomizerSlot.primaryPath.slots"
                :key="slotIdx"
                class="flex flex-col gap-2 relative z-10"
              >
                <!-- List of Rune Choices in a Row (Distributed) -->
                <div class="flex flex-row items-center justify-between w-full py-0.5">
                  <div
                    v-for="rune in slot.runes"
                    :key="rune.id"
                    @click="selectPrimaryRune(slotIdx, rune)"
                    @mouseenter="
                      showRuneTooltip(rune, slotIdx === 0 ? 'Primary Keystone' : 'Primary Rune')
                    "
                    @mouseleave="hideRuneTooltip"
                    @mousemove="onMouseMove"
                    :title="rune.name"
                    :class="[
                      'group rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] shrink-0 relative z-10 h-11 w-11',
                      (slotIdx === 0 && activeCustomizerSlot.primaryKeystone?.id === rune.id) ||
                      (slotIdx === 1 && activeCustomizerSlot.primaryRune1?.id === rune.id) ||
                      (slotIdx === 2 && activeCustomizerSlot.primaryRune2?.id === rune.id) ||
                      (slotIdx === 3 && activeCustomizerSlot.primaryRune3?.id === rune.id)
                        ? `border-2 ${getPathTheme(activeCustomizerSlot.primaryPath?.id).activeBorder} bg-slate-950/30 p-0.5 shadow-lg ${getPathTheme(activeCustomizerSlot.primaryPath?.id).glow}`
                        : 'opacity-25 grayscale hover:opacity-100 hover:grayscale-0',
                    ]"
                  >
                    <img
                      :src="getRuneIconUrl(rune.icon)"
                      class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="grow flex items-center justify-center p-12 text-slate-550 italic text-base border border-dashed border-slate-900 rounded-xl bg-slate-900/5"
            >
              Select primary path above
            </div>
          </div>

          <!-- SECONDARY PATH COLUMN -->
          <div class="flex flex-col gap-4 lg:border-l lg:border-slate-900/60 lg:pl-4 h-full">
            <span
              class="text-base text-cyan-400 font-bold uppercase tracking-widest font-mono text-center"
              >Secondary Path</span
            >

            <!-- Path Selectors (excludes selected primary path) -->
            <div class="flex flex-row items-center gap-2.5 justify-center w-full mx-auto">
              <template v-for="tree in orderedRunes" :key="tree.id">
                <div
                  v-if="activeCustomizerSlot?.primaryPath?.id !== tree.id"
                  @click="selectSecondaryPath(tree)"
                  :title="tree.name"
                  :class="[
                    'group h-14 w-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] shrink-0',
                    activeCustomizerSlot?.secondaryPath?.id === tree.id
                      ? `border-2 ${getPathTheme(tree.id).activeBorder} bg-slate-950/40 p-2 shadow-lg ${getPathTheme(tree.id).glow}`
                      : 'opacity-40 hover:opacity-100 p-2',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl(tree.icon)"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </div>
              </template>
            </div>

            <!-- Runes list inside Selected Secondary Path (Pick 2) + Stat Shards (merged) -->
            <div
              v-if="activeCustomizerSlot?.secondaryPath"
              class="grow flex flex-col justify-between w-64 mx-auto relative py-3"
            >
              <!-- Render the 3 normal slots for secondary path -->
              <div
                v-for="(slot, slotIdx) in activeCustomizerSlot.secondaryPath.slots.slice(1)"
                :key="slotIdx"
                class="flex flex-col gap-2 relative z-10"
              >
                <!-- List of Rune Choices in a Row (Distributed) -->
                <div class="flex flex-row items-center justify-between w-full py-0.5">
                  <div
                    v-for="rune in slot.runes"
                    :key="rune.id"
                    @click="toggleSecondaryRune(rune)"
                    @mouseenter="showRuneTooltip(rune, 'Secondary Rune')"
                    @mouseleave="hideRuneTooltip"
                    @mousemove="onMouseMove"
                    :title="rune.name"
                    :class="[
                      'group h-11 w-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] shrink-0 relative z-10',
                      activeCustomizerSlot.secondaryRune1?.id === rune.id ||
                      activeCustomizerSlot.secondaryRune2?.id === rune.id
                        ? `border-2 ${getPathTheme(activeCustomizerSlot.secondaryPath?.id).activeBorder} bg-slate-950/30 p-0.5 shadow-lg ${getPathTheme(activeCustomizerSlot.secondaryPath?.id).glow}`
                        : 'opacity-25 grayscale hover:opacity-100 hover:grayscale-0',
                    ]"
                  >
                    <img
                      :src="getRuneIconUrl(rune.icon)"
                      class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Stat Shards Row 1: Offensive (Centered) -->
              <div class="flex flex-row items-center justify-center gap-3.5 py-0.5 relative z-10">
                <!-- Adaptive Force -->
                <button
                  @click="setShardOffensive('adaptive')"
                  @mouseenter="showRuneTooltip('adaptive', 'Offensive Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Adaptive Force (+9)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardOffensive === 'adaptive'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsAdaptiveForceIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
                <!-- Attack Speed -->
                <button
                  @click="setShardOffensive('as')"
                  @mouseenter="showRuneTooltip('as', 'Offensive Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Attack Speed (+10%)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardOffensive === 'as'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsAttackSpeedIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
                <!-- Ability Haste -->
                <button
                  @click="setShardOffensive('haste')"
                  @mouseenter="showRuneTooltip('haste', 'Offensive Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Ability Haste (+8)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardOffensive === 'haste'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsCDRScalingIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
              </div>

              <!-- Stat Shards Row 2: Flex (Centered) -->
              <div class="flex flex-row items-center justify-center gap-3.5 py-0.5 relative z-10">
                <!-- Adaptive Force -->
                <button
                  @click="setShardFlex('adaptive')"
                  @mouseenter="showRuneTooltip('adaptive', 'Flex Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Adaptive Force (+9)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardFlex === 'adaptive'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsAdaptiveForceIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
                <!-- Movement Speed -->
                <button
                  @click="setShardFlex('ms')"
                  @mouseenter="showRuneTooltip('ms', 'Flex Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Movement Speed (+2%)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardFlex === 'ms'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsMovementSpeedIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
                <!-- Scaling Health -->
                <button
                  @click="setShardFlex('scaling_hp')"
                  @mouseenter="showRuneTooltip('scaling_hp', 'Flex Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Scaling Health (+10-180)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardFlex === 'scaling_hp'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsHealthScalingIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
              </div>

              <!-- Stat Shards Row 3: Defensive (Centered) -->
              <div class="flex flex-row items-center justify-center gap-3.5 py-0.5 relative z-10">
                <!-- Scaling Health -->
                <button
                  @click="setShardDefensive('scaling_hp')"
                  @mouseenter="showRuneTooltip('scaling_hp', 'Defensive Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Scaling Health (+10-180)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardDefensive === 'scaling_hp'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsHealthScalingIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
                <!-- Tenacity and Slow Resist -->
                <button
                  @click="setShardDefensive('tenacity')"
                  @mouseenter="showRuneTooltip('tenacity', 'Defensive Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Tenacity & Slow Resist (+10%)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardDefensive === 'tenacity'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsTenacityIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
                <!-- Flat Health -->
                <button
                  @click="setShardDefensive('flat_hp')"
                  @mouseenter="showRuneTooltip('flat_hp', 'Defensive Shard')"
                  @mouseleave="hideRuneTooltip"
                  @mousemove="onMouseMove"
                  title="Health (+65 Flat)"
                  :class="[
                    'group h-9 w-9 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.1] p-1 shadow-sm shrink-0 bg-[#0b0e17] relative z-10',
                    activeCustomizerSlot?.shardDefensive === 'flat_hp'
                      ? 'bg-amber-500/20 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[#0b0e17] border-slate-900 opacity-30 grayscale hover:opacity-100 hover:grayscale-0',
                  ]"
                >
                  <img
                    :src="getRuneIconUrl('v1/perk-images/StatMods/StatModsHealthPlusIcon.png')"
                    class="h-full w-full object-contain transition-transform group-hover:scale-110 select-none pointer-events-none"
                  />
                </button>
              </div>
            </div>

            <div
              v-else
              class="grow flex items-center justify-center p-12 text-slate-500 italic text-base border border-dashed border-slate-900 rounded-xl bg-slate-900/5"
            >
              {{
                activeCustomizerSlot?.primaryPath
                  ? 'Select secondary path above'
                  : 'Select primary path first'
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/40 shrink-0">
        <button
          @click="removeRunePage"
          class="px-4 py-2 rounded-xl border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:bg-rose-500/5 text-base font-bold transition-all cursor-pointer"
        >
          Reset Page
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-base font-bold text-white shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
    <RuneTooltip :rune="hoveredRune" :mouse-pos="mousePos" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraftStore } from '@/stores/draft'
import { useDDragonStore } from '@/stores/ddragon'
import {
  getChampionPosition,
  getRuneIconUrl,
  getChampionSplashUrl,
  getChampionIconUrl,
} from '@/services'
import type { RuneKeystone, Rune } from '@/types'
import RuneTooltip from './RuneTooltip.vue'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()

const draftStore = useDraftStore()
const ddragonStore = useDDragonStore()

const { activeCustomizerSlot } = storeToRefs(draftStore)
const {
  selectPrimaryPath,
  selectSecondaryPath,
  selectPrimaryRune,
  toggleSecondaryRune,
  removeRunePage,
  setShardOffensive,
  setShardFlex,
  setShardDefensive,
} = draftStore

const { allRunes } = storeToRefs(ddragonStore)

const hoveredRune = ref<Rune | RuneKeystone | Record<string, unknown> | null>(null)
const mousePos = ref({ x: 0, y: 0 })

const shardInfoMap: Record<string, { name: string; icon: string; category: string; desc: string }> =
  {
    adaptive: {
      name: 'Adaptive Force Shard',
      icon: 'v1/perk-images/StatMods/StatModsAdaptiveForceIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +9 Adaptive Force (5.4 AD or 9 AP based on your champion).',
    },
    as: {
      name: 'Attack Speed Shard',
      icon: 'v1/perk-images/StatMods/StatModsAttackSpeedIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +10% Attack Speed.',
    },
    haste: {
      name: 'Ability Haste Shard',
      icon: 'v1/perk-images/StatMods/StatModsCDRScalingIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +8 Ability Haste.',
    },
    ms: {
      name: 'Movement Speed Shard',
      icon: 'v1/perk-images/StatMods/StatModsMovementSpeedIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +2% Movement Speed.',
    },
    scaling_hp: {
      name: 'Scaling Health Shard',
      icon: 'v1/perk-images/StatMods/StatModsHealthScalingIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +10 - 180 Health (based on champion level).',
    },
    flat_hp: {
      name: 'Flat Health Shard',
      icon: 'v1/perk-images/StatMods/StatModsHealthScalingIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +65 Health.',
    },
    tenacity: {
      name: 'Tenacity Shard',
      icon: 'v1/perk-images/StatMods/StatModsTenacityIcon.png',
      category: 'Stat Shard',
      desc: 'Grants +10% Tenacity and Slow Resist.',
    },
  }

const onMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

const showRuneTooltip = (rune: Rune | RuneKeystone | string | null, category: string) => {
  if (!rune) return
  if (typeof rune === 'string' && shardInfoMap[rune]) {
    hoveredRune.value = shardInfoMap[rune]
    return
  }
  if (typeof rune !== 'string') {
    hoveredRune.value = {
      ...rune,
      category:
        category || ((rune as unknown as Record<string, unknown>).category as string) || 'Rune',
    }
  }
}

const hideRuneTooltip = () => {
  hoveredRune.value = null
}

const orderedRunes = computed(() => {
  const order = [8000, 8100, 8200, 8400, 8300] // Precision, Domination, Sorcery, Resolve, Inspiration
  return [...allRunes.value].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
})

interface PathTheme {
  border: string
  text: string
  activeBg: string
  activeBorder: string
  hoverBorder: string
  glow: string
  dotBg: string
  pillsBg: string
}

const pathThemes: Record<number, PathTheme> = {
  8000: {
    // Precision
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    activeBg: 'bg-amber-950/15',
    activeBorder: 'border-amber-500 shadow-amber-500/25',
    hoverBorder: 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/10',
    glow: 'shadow-amber-500/20',
    dotBg: 'bg-amber-500',
    pillsBg: 'bg-amber-500/10 text-amber-300',
  },
  8100: {
    // Domination
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    activeBg: 'bg-rose-950/15',
    activeBorder: 'border-rose-500 shadow-rose-500/25',
    hoverBorder: 'hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/10',
    glow: 'shadow-rose-500/20',
    dotBg: 'bg-rose-500',
    pillsBg: 'bg-rose-500/10 text-rose-300',
  },
  8200: {
    // Sorcery
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    activeBg: 'bg-purple-950/15',
    activeBorder: 'border-purple-500 shadow-purple-500/25',
    hoverBorder: 'hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/10',
    glow: 'shadow-purple-500/20',
    dotBg: 'bg-purple-500',
    pillsBg: 'bg-purple-500/10 text-purple-300',
  },
  8300: {
    // Inspiration
    border: 'border-sky-500/20',
    text: 'text-sky-400',
    activeBg: 'bg-sky-950/15',
    activeBorder: 'border-sky-500 shadow-sky-500/25',
    hoverBorder: 'hover:border-sky-400 hover:shadow-md hover:shadow-sky-500/10',
    glow: 'shadow-sky-500/20',
    dotBg: 'bg-sky-500',
    pillsBg: 'bg-sky-500/10 text-sky-300',
  },
  8400: {
    // Resolve
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    activeBg: 'bg-emerald-950/15',
    activeBorder: 'border-emerald-500 shadow-emerald-500/25',
    hoverBorder: 'hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10',
    glow: 'shadow-emerald-500/20',
    dotBg: 'bg-emerald-500',
    pillsBg: 'bg-emerald-500/10 text-emerald-300',
  },
}

const getPathTheme = (pathId?: number): PathTheme => {
  if (!pathId || !pathThemes[pathId]) {
    return {
      border: 'border-slate-800',
      text: 'text-slate-400',
      activeBg: 'bg-[#131926]/40',
      activeBorder: 'border-slate-700 shadow-black/30',
      hoverBorder: 'hover:border-slate-650 hover:shadow-md',
      glow: 'shadow-black/20',
      dotBg: 'bg-slate-500',
      pillsBg: 'bg-slate-900 text-slate-400',
    }
  }
  return pathThemes[pathId]
}
</script>
