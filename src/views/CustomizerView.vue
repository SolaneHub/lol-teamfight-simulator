<template>
  <div class="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 py-6 px-4 xl:px-3 w-full max-w-none">
    <!-- LEFT COLUMN: Blue Team (5 slots) -->
    <div class="xl:col-span-3">
      <TeamDraftPanel side="blue" mode="customizer" />
    </div>

    <!-- CENTER COLUMN: Active Workbench (6 cols) -->
    <div class="xl:col-span-6 flex flex-col gap-6 px-2">
      <!-- Workbench Card -->
      <div
        v-if="activeCustomizerSlot"
        class="bg-[#131926] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col"
      >
        <!-- Workbench Header with Champion Splash -->
        <div class="relative h-44 flex items-end p-6 border-b border-slate-800">
          <img
            :src="getChampionSplashUrl(activeCustomizerSlot.champion?.id || '')"
            :class="[
              'absolute inset-0 w-full h-full object-cover select-none pointer-events-none brightness-50',
              activeCustomizerSlot.side === 'blue' ? '-scale-x-100' : '',
            ]"
            :style="{
              objectPosition: getChampionPosition(activeCustomizerSlot.champion?.id || ''),
            }"
          />
          <div
            class="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent"
          ></div>

          <div class="relative z-10 flex items-center gap-4 w-full">
            <!-- Square Portrait -->
            <img
              :src="getChampionIconUrl(activeCustomizerSlot.champion)"
              class="h-16 w-16 rounded-lg border border-slate-700 shadow-md object-cover select-none"
            />
            <div>
              <h2 class="text-2xl font-bold text-white tracking-wide leading-none mb-1.5">
                {{ activeCustomizerSlot.champion?.name }}
              </h2>
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'text-base px-2 py-0.5 rounded font-mono border uppercase tracking-wider font-semibold',
                    activeCustomizerSlot.side === 'blue'
                      ? 'bg-sky-950 text-sky-400 border-sky-900/30'
                      : 'bg-rose-950 text-rose-400 border-rose-900/30',
                  ]"
                >
                  {{ activeCustomizerSlot.side === 'blue' ? 'Blue Team' : 'Red Team' }} -
                  {{ activeCustomizerSlot.role }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Workbench Control Board -->
        <div class="p-6 flex flex-col gap-6">
          <!-- Level Selector & Keystone -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Level Slider -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <label
                  class="text-base text-slate-400 uppercase tracking-widest font-mono font-bold"
                  >Champion Level</label
                >
                <span
                  class="text-base text-cyan-400 font-mono font-bold bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-900/30"
                >
                  Lvl {{ activeCustomizerSlot.level }}
                </span>
              </div>
              <input
                type="range"
                min="1"
                :max="activeCustomizerSlot.role === 'Top' ? 20 : 18"
                v-model.number="activeCustomizerSlot.level"
                class="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
              />
              <div class="relative w-full h-5 text-base text-slate-500 font-mono mt-1">
                <span
                  v-for="val in [1, 6, 11, 16, activeCustomizerSlot.role === 'Top' ? 20 : 18]"
                  :key="val"
                  class="absolute top-0"
                  :style="
                    val === 1
                      ? { left: '0%' }
                      : val === (activeCustomizerSlot.role === 'Top' ? 20 : 18)
                        ? { right: '0%' }
                        : {
                            left: `${((val - 1) / ((activeCustomizerSlot.role === 'Top' ? 20 : 18) - 1)) * 100}%`,
                            transform: 'translateX(-50%)',
                          }
                  "
                >
                  {{ val }}
                </span>
              </div>
            </div>

            <!-- Rune Configuration Panel -->
            <div class="flex flex-col gap-2">
              <label class="text-base text-slate-400 uppercase tracking-widest font-mono font-bold"
                >Rune Page Setup</label
              >
              <div
                @click="openRuneBuilder()"
                class="flex flex-col gap-3 p-3.5 bg-slate-950 border border-slate-900 rounded-xl hover:border-slate-800 transition-all cursor-pointer select-none"
              >
                <!-- If not configured -->
                <div v-if="!activeCustomizerSlot.primaryPath" class="flex items-center gap-3 py-1">
                  <div
                    class="h-9 w-9 rounded-full bg-slate-900 border border-dashed border-slate-800 flex items-center justify-center text-slate-500 text-lg shrink-0 font-bold"
                  >
                    +
                  </div>
                  <div class="grow">
                    <span class="text-base font-semibold text-slate-450 block leading-tight"
                      >Configure Rune Page</span
                    >
                    <span class="text-base text-slate-655 block mt-0.5"
                      >Select Primary and Secondary paths & runes</span
                    >
                  </div>
                </div>

                <!-- If configured -->
                <div v-else class="flex items-center justify-between gap-4">
                  <div
                    @mouseenter="
                      showRuneTooltip(activeCustomizerSlot.primaryKeystone, 'Primary Keystone')
                    "
                    @mouseleave="hideRuneTooltip"
                    @mousemove="onMouseMove"
                    class="flex items-center gap-4 min-w-0 cursor-pointer group/keystone"
                  >
                    <!-- Primary Keystone Icon -->
                    <div
                      class="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 group-hover/keystone:border-amber-400 p-1 flex items-center justify-center shrink-0 transition-all"
                    >
                      <img
                        v-if="activeCustomizerSlot.primaryKeystone"
                        :src="getRuneIconUrl(activeCustomizerSlot.primaryKeystone.icon)"
                        class="h-full w-full object-contain select-none pointer-events-none"
                      />
                      <img
                        v-else
                        :src="getRuneIconUrl(activeCustomizerSlot.primaryPath.icon)"
                        class="h-full w-full object-contain select-none pointer-events-none brightness-50"
                      />
                    </div>
                    <div class="min-w-0 flex flex-col justify-center">
                      <span class="text-base font-semibold text-white block truncate">
                        {{ activeCustomizerSlot.primaryKeystone?.name || 'Keystone Not Selected' }}
                      </span>
                      <span class="text-base text-slate-500 block truncate leading-none mt-1">
                        {{ activeCustomizerSlot.primaryPath.name }} +
                        {{ activeCustomizerSlot.secondaryPath?.name || '?' }}
                      </span>
                    </div>
                  </div>

                  <button
                    @click.stop="removeRunePage()"
                    class="text-base text-rose-500 hover:text-rose-400 px-2 py-1 font-mono font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Workbench Grid -->
          <div class="flex flex-col gap-2">
            <label class="text-base text-slate-400 uppercase tracking-widest font-mono font-bold"
              >ITEM INVENTORY ({{ activeCustomizerSlot.items.length }} SLOTS)</label
            >
            <div
              :class="[
                'grid gap-3',
                activeCustomizerSlot.items.length === 7 ? 'grid-cols-7' : 'grid-cols-6',
              ]"
            >
              <div
                v-for="(item, idx) in activeCustomizerSlot.items"
                :key="idx"
                @click="!item ? openItemPicker(idx) : null"
                :class="[
                  'relative aspect-square rounded-xl bg-slate-950 flex flex-col items-center justify-center group overflow-hidden select-none border transition-all duration-200',
                  item
                    ? isMasterwork(idx)
                      ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                      : 'border-slate-900'
                    : 'border-dashed border-slate-900 hover:border-cyan-500 cursor-pointer',
                ]"
              >
                <!-- If item slot is occupied -->
                <div
                  v-if="item"
                  class="w-full h-full flex items-center justify-center relative cursor-pointer"
                  @click="openItemPicker(idx)"
                  @mouseenter="showItemTooltip(item)"
                  @mouseleave="hideItemTooltip"
                  @mousemove="onMouseMove"
                >
                  <img
                    :src="getItemIconUrl(item)"
                    :alt="item.name"
                    class="w-full h-full object-cover shrink-0"
                  />

                  <!-- Ornn Masterwork Badge & Toggle Button -->
                  <button
                    v-if="item.gold.total >= 2200 && !item.name.includes('Ornn')"
                    @click.stop="toggleMasterwork(idx)"
                    :title="
                      isMasterwork(idx)
                        ? 'Ornn Masterwork Upgrade Active (Click to remove)'
                        : 'Click to add Ornn Masterwork Upgrade'
                    "
                    :class="[
                      'absolute bottom-1 left-1 h-7 px-2 rounded-md font-bold font-mono text-base backdrop-blur-md transition-all z-10 flex items-center gap-1.5 cursor-pointer border',
                      isMasterwork(idx)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.4)] opacity-100 hover:bg-amber-500/30 hover:border-amber-300'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 opacity-0 group-hover:opacity-100 hover:border-amber-400/60 hover:text-amber-300 hover:bg-slate-900/90',
                    ]"
                  >
                    <span>🔨</span>
                    <span>Ornn</span>
                  </button>

                  <!-- Delete floating button -->
                  <button
                    @click.stop="handleRemoveItem(idx)"
                    title="Remove item"
                    class="absolute top-1 right-1 h-7 w-7 bg-slate-950/90 border border-rose-900/60 text-rose-400 hover:text-white hover:bg-rose-600 hover:border-rose-500 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer shadow-md"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- If slot is empty -->
                <template v-else>
                  <span class="text-lg font-bold text-white pointer-events-none">+</span>
                  <span
                    class="text-base font-mono tracking-wider text-slate-400 mt-1 pointer-events-none"
                    >Slot {{ idx + 1 }}</span
                  >
                </template>
              </div>
            </div>
          </div>

          <!-- Champion Ability Kit -->
          <div
            v-if="activeChampion"
            class="flex flex-col gap-3 mt-6 border-t border-slate-800/80 pt-6"
          >
            <label class="text-base text-slate-400 uppercase tracking-widest font-mono font-bold"
              >Champion Ability Kit</label
            >
            <div
              class="bg-slate-950/60 border border-slate-900 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-12 gap-5"
            >
              <!-- LEFT COLUMN: Vertical Spells & Passive List (5 cols) -->
              <div
                class="lg:col-span-5 flex flex-col gap-3 border-b lg:border-b-0 lg:border-r border-slate-900/80 pb-4 lg:pb-0 lg:pr-5"
              >
                <!-- Passive Button/Row -->
                <div
                  @click="selectedSpellIndex = 'passive'"
                  :class="[
                    'group relative p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3',
                    selectedSpellIndex === 'passive'
                      ? 'bg-slate-900/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50',
                  ]"
                >
                  <div
                    class="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-800 shrink-0"
                  >
                    <img
                      :src="getChampionPassiveUrl(activeCustomizerSlot?.champion)"
                      class="h-full w-full object-cover select-none pointer-events-none"
                    />
                    <span
                      class="absolute bottom-0 right-0 bg-slate-950/90 text-base text-amber-400 font-bold px-1.5 font-mono rounded-tl border-t border-l border-slate-800 leading-none py-0.5"
                      >P</span
                    >
                  </div>

                  <div class="flex flex-col min-w-0 grow">
                    <div class="flex items-center justify-between gap-1">
                      <h4 class="text-base font-bold text-white truncate leading-snug">
                        {{ activeChampion!.passive.name }}
                      </h4>
                      <span class="text-base font-mono font-bold text-amber-400">P</span>
                    </div>
                    <span class="text-base text-slate-500 font-mono mt-0.5">Innate Passive</span>
                  </div>
                </div>

                <!-- Spells Buttons/Rows (Q, W, E, R) -->
                <div
                  v-for="(spell, idx) in activeChampion!.spells"
                  :key="spell.id"
                  @click="selectedSpellIndex = idx"
                  :class="[
                    'group relative p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2.5',
                    selectedSpellIndex === idx
                      ? 'bg-slate-900/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50',
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <!-- Icon + Key Badge -->
                    <div
                      class="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-800 shrink-0"
                    >
                      <img
                        :src="getChampionSpellUrl(activeCustomizerSlot?.champion, idx)"
                        class="h-full w-full object-cover select-none pointer-events-none"
                      />
                      <span
                        class="absolute bottom-0 right-0 bg-slate-950/90 text-base text-cyan-400 font-bold px-1.5 font-mono rounded-tl border-t border-l border-slate-800 leading-none py-0.5"
                      >
                        {{ ['Q', 'W', 'E', 'R'][idx] }}
                      </span>
                    </div>

                    <!-- Spell Name, CD & Cost -->
                    <div class="flex flex-col min-w-0 grow">
                      <div class="flex items-center justify-between gap-1">
                        <h4 class="text-base font-bold text-white truncate leading-snug">
                          {{ spell.name }}
                        </h4>
                        <span class="text-base font-mono font-bold text-cyan-400">
                          {{ ['Q', 'W', 'E', 'R'][idx] }}
                        </span>
                      </div>

                      <!-- Cooldown & Cost -->
                      <div
                        class="flex items-center gap-2 text-base font-mono text-slate-400 mt-0.5"
                      >
                        <span
                          >CD:
                          <strong class="text-rose-400 font-semibold"
                            >{{ spell.cooldown?.[getSpellRank(idx) - 1] ?? '?' }}s</strong
                          ></span
                        >
                        <span class="text-slate-700">•</span>
                        <span
                          >Cost:
                          <strong class="text-sky-300 font-semibold">{{
                            spell.cost?.[getSpellRank(idx) - 1] ?? 0
                          }}</strong></span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Rank Control Buttons (1-5 for Q/W/E, 1-3 for R) -->
                  <div
                    class="flex items-center justify-between border-t border-slate-900/80 pt-2 mt-0.5"
                    @click.stop
                  >
                    <span
                      class="text-base uppercase tracking-wider text-slate-400 font-mono font-bold"
                      >Rank</span
                    >
                    <div class="flex items-center gap-1.5">
                      <button
                        v-for="r in idx === 3 ? 3 : 5"
                        :key="r"
                        @click.stop="setSpellRank(idx, r)"
                        :class="[
                          'h-6 w-7 rounded text-base font-bold font-mono transition-all flex items-center justify-center cursor-pointer',
                          getSpellRank(idx) === r
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-sm scale-105'
                            : r <= getSpellRank(idx)
                              ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                              : 'bg-slate-900/80 text-slate-600 hover:bg-slate-800',
                        ]"
                      >
                        {{ r }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- RIGHT COLUMN: Detailed Ability Card (7 cols) -->
              <div class="lg:col-span-7 flex flex-col justify-start">
                <!-- If Passive is selected -->
                <template v-if="selectedSpellIndex === 'passive'">
                  <div class="flex flex-col gap-2.5">
                    <div class="flex items-center gap-2 border-b border-slate-900/50 pb-2">
                      <span
                        class="text-base text-amber-500 font-mono font-bold uppercase tracking-wider"
                        >Passive</span
                      >
                      <h4 class="text-lg font-bold text-white leading-tight">
                        {{ activeChampion!.passive.name }}
                      </h4>
                    </div>
                    <p
                      class="text-base text-slate-350 leading-relaxed max-w-2xl font-mono text-justify"
                      v-html="
                        interpolatePassiveDescription(
                          activeChampion!.passive,
                          activeLevel,
                          activeCustomizerStats,
                          activeChampion!.id,
                        )
                      "
                    ></p>
                  </div>
                </template>

                <!-- If active spell is selected -->
                <template
                  v-else-if="
                    typeof selectedSpellIndex === 'number' &&
                    activeChampion!.spells[selectedSpellIndex]
                  "
                >
                  <div class="flex flex-col gap-3">
                    <div
                      class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-900/50 pb-2.5"
                    >
                      <div class="flex items-center gap-2">
                        <span
                          class="text-base text-cyan-400 font-mono font-bold uppercase tracking-wider"
                        >
                          {{ ['Q', 'W', 'E', 'R'][selectedSpellIndex] }}
                        </span>
                        <h4 class="text-lg font-bold text-white leading-tight">
                          {{ activeChampion!.spells[selectedSpellIndex]?.name }}
                        </h4>
                      </div>

                      <!-- Cooldown & Cost Details -->
                      <div
                        class="flex flex-wrap items-center gap-3 text-base text-slate-450 font-mono"
                      >
                        <span v-if="activeChampion!.spells[selectedSpellIndex]?.cooldown">
                          CD:
                          <span class="text-rose-400 font-semibold">
                            {{
                              activeChampion!.spells[selectedSpellIndex]?.cooldown?.[
                                getSpellRank(selectedSpellIndex) - 1
                              ]
                            }}s
                          </span>
                          <span v-if="getSpellHaste(selectedSpellIndex) > 0" class="text-slate-400">
                            →
                            <span class="text-cyan-400 font-semibold">
                              {{
                                Math.round(
                                  (activeChampion!.spells[selectedSpellIndex]?.cooldown?.[
                                    getSpellRank(selectedSpellIndex) - 1
                                  ] ?? 0) *
                                    (100 / (100 + getSpellHaste(selectedSpellIndex))) *
                                    10,
                                ) / 10
                              }}s
                            </span>
                            <span class="text-base">
                              ({{ getSpellHaste(selectedSpellIndex) }} AH)</span
                            >
                          </span>
                        </span>

                        <span v-if="activeChampion!.spells[selectedSpellIndex]?.cost">
                          Cost:
                          <span class="text-cyan-300 font-semibold">
                            {{
                              activeChampion!.spells[selectedSpellIndex]?.cost?.[
                                getSpellRank(selectedSpellIndex) - 1
                              ]
                            }}
                          </span>
                          {{ activeChampion!.partype || 'Mana' }}
                        </span>

                        <span
                          class="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-base px-2.5 py-0.5 rounded font-mono font-bold"
                        >
                          Rank {{ getSpellRank(selectedSpellIndex) }}/{{
                            selectedSpellIndex === 3 ? 3 : 5
                          }}
                        </span>
                      </div>
                    </div>

                    <p
                      class="text-base text-slate-350 leading-relaxed max-w-2xl font-mono text-justify"
                      v-html="
                        interpolateSpellTooltip(
                          activeChampion!.spells[selectedSpellIndex],
                          activeLevel,
                          activeCustomizerStats,
                          activeChampion!.id,
                        )
                      "
                    ></p>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Real-Time Computed Stats Table -->
          <StatsTable :active-customizer-stats="activeCustomizerStats" />
        </div>
      </div>

      <!-- Workbench Empty State -->
      <div v-else class="flex-1 flex flex-col items-center justify-center py-32 text-center px-6">
        <div
          class="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-550 text-2xl mb-4"
        >
          🔧
        </div>
        <h3 class="text-lg font-bold text-white mb-2">Build Workbench Empty</h3>
        <p class="text-base text-slate-400 max-w-sm">
          To customize items, levels, or runes, select a draft slot on either team that has an
          assigned champion first.
        </p>
      </div>
    </div>

    <!-- RIGHT COLUMN: Red Team (5 slots) -->
    <div class="xl:col-span-3">
      <TeamDraftPanel side="red" mode="customizer" />
    </div>

    <!-- RUNE BUILDER INTERACTIVE MODAL -->
    <RuneBuilderModal
      v-if="isRuneBuilderOpen"
      :isOpen="isRuneBuilderOpen"
      @close="isRuneBuilderOpen = false"
    />

    <!-- ITEM SELECTOR MODAL -->
    <ItemSelectorModal
      v-if="isItemPickerOpen"
      :isOpen="isItemPickerOpen"
      :slotIdx="itemPickerSlotIndex"
      @close="isItemPickerOpen = false"
    />

    <!-- FLOATING RUNE TOOLTIP -->
    <RuneTooltip :rune="hoveredRune" :mousePos="mousePos" />

    <!-- FLOATING ITEM TOOLTIP -->
    <ItemTooltip :item="hoveredItem" :mousePos="mousePos" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraftStore } from '@/stores/draft'
import { useDDragonStore } from '@/stores/ddragon'
import {
  getChampionPosition,
  calculateStats,
  getRuneIconUrl,
  getItemIconUrl,
  getChampionSplashUrl,
  getChampionIconUrl,
  getChampionPassiveUrl,
  getChampionSpellUrl,
  formatTooltipTags,
} from '@/services'
import type { ChampionPassive, ChampionSpells, Item, Rune, RuneKeystone } from '@/types'
import TeamDraftPanel from '@/components/draft/TeamDraftPanel.vue'
import StatsTable from '@/components/customizer/StatsTable.vue'
import ItemSelectorModal from '@/components/customizer/ItemSelectorModal.vue'
import RuneBuilderModal from '@/components/customizer/RuneBuilderModal.vue'
import RuneTooltip from '@/components/customizer/RuneTooltip.vue'
import ItemTooltip from '@/components/customizer/ItemTooltip.vue'

const draftStore = useDraftStore()

const { activeCustomizerSlot } = storeToRefs(draftStore)
const { removeRunePage, removeItemFromSlot, toggleMasterwork, setSpellRank } = draftStore

const ddragonStore = useDDragonStore()
const { spellFormulasData } = storeToRefs(ddragonStore)

const hoveredRune = ref<Rune | RuneKeystone | Record<string, unknown> | null>(null)
const hoveredItem = ref<Item | null>(null)
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

const showItemTooltip = (item: Item | null) => {
  if (!item) return
  hoveredItem.value = item
}

const hideItemTooltip = () => {
  hoveredItem.value = null
}

const isMasterwork = (idx: number): boolean => {
  if (!activeCustomizerSlot.value || !activeCustomizerSlot.value.masterworkItems) return false
  return !!activeCustomizerSlot.value.masterworkItems[idx]
}

const activeCustomizerStats = computed(() => {
  if (!activeCustomizerSlot.value) return null
  return calculateStats(activeCustomizerSlot.value)
})

const activeLevel = computed(() => activeCustomizerSlot.value?.level ?? 1)
const activeChampion = computed(() => activeCustomizerSlot.value?.champion || null)

const isItemPickerOpen = ref(false)
const itemPickerSlotIndex = ref(0)
const isRuneBuilderOpen = ref(false)
const selectedSpellIndex = ref<number | 'passive'>('passive')

watch(
  () => activeCustomizerSlot.value?.champion?.id,
  () => {
    selectedSpellIndex.value = 'passive'
  },
)

const handleRemoveItem = (idx: number) => {
  removeItemFromSlot(idx)
  hideItemTooltip()
}

const openItemPicker = (slotIdx: number) => {
  hideItemTooltip()
  itemPickerSlotIndex.value = slotIdx
  isItemPickerOpen.value = true
}

const openRuneBuilder = () => {
  hideRuneTooltip()
  isRuneBuilderOpen.value = true
}

const getSpellRank = (spellIdx: number): number => {
  if (!activeCustomizerSlot.value) return 1
  if (!activeCustomizerSlot.value.spellRanks) {
    activeCustomizerSlot.value.spellRanks = { q: 1, w: 1, e: 1, r: 1 }
  }
  const ranks = activeCustomizerSlot.value.spellRanks
  const keys: ('q' | 'w' | 'e' | 'r')[] = ['q', 'w', 'e', 'r']
  const key = keys[spellIdx] || 'q'
  return ranks[key] ?? 1
}

const getSpellHaste = (spellIdx: number): number => {
  if (!activeCustomizerStats.value) return 0
  const baseHaste = activeCustomizerStats.value.abilityHaste.total || 0
  const basicHaste = activeCustomizerStats.value.abilityHaste.basicAbilityHaste || 0
  if (spellIdx === 3) {
    const hasUltimateHunter = [
      activeCustomizerSlot.value?.primaryRune1,
      activeCustomizerSlot.value?.primaryRune2,
      activeCustomizerSlot.value?.primaryRune3,
      activeCustomizerSlot.value?.secondaryRune1,
      activeCustomizerSlot.value?.secondaryRune2,
    ].some((r) => r?.key === 'UltimateHunter')
    return baseHaste + (hasUltimateHunter ? 31 : 0)
  }
  return baseHaste + basicHaste
}

const getStatValue = (
  stats: ReturnType<typeof calculateStats> | null | undefined,
  statKey: string,
): number => {
  if (!stats) return 0
  switch (statKey) {
    case 'totalAp':
      return stats.ap?.total || 0
    case 'bonusAd':
      return stats.ad?.bonus || 0
    case 'totalAd':
      return stats.ad?.total || 0
    case 'bonusHp':
      return stats.hp?.bonus || 0
    case 'totalHp':
      return stats.hp?.total || 0
    default:
      return 0
  }
}

const getStatLabel = (statKey: string): string => {
  switch (statKey) {
    case 'totalAp':
      return 'AP'
    case 'bonusAd':
      return 'bonus AD'
    case 'totalAd':
      return 'total AD'
    case 'bonusHp':
      return 'bonus HP'
    case 'totalHp':
      return 'max HP'
    case 'lifesteal':
      return 'LS'
    case 'abilityHaste':
      return 'AH'
    default:
      return ''
  }
}

const getStatColorClass = (statKey: string): string => {
  switch (statKey) {
    case 'totalAp':
      return 'text-cyan-400 font-semibold'
    case 'bonusAd':
    case 'totalAd':
      return 'text-orange-400 font-semibold'
    case 'bonusHp':
    case 'totalHp':
      return 'text-emerald-400 font-semibold'
    case 'armor':
      return 'text-yellow-400 font-semibold'
    case 'magicResist':
      return 'text-teal-300 font-semibold'
    case 'abilityHaste':
      return 'text-teal-300 font-semibold'
    default:
      return 'text-slate-300 font-semibold'
  }
}

const interpolateSpellTooltip = (
  spell: ChampionSpells | Record<string, unknown> | undefined | null,
  _lvl: number,
  stats: ReturnType<typeof calculateStats> | null | undefined,
  champId: string,
): string => {
  if (!spell) return ''
  const sp = spell as ChampionSpells
  let tooltip = sp.tooltip || sp.description || ''

  // Fallback to description if tooltip is a raw nested localization key
  if (/^\{\{\s*Spell_/i.test(tooltip.trim())) {
    tooltip = sp.description || tooltip
  }
  tooltip = tooltip.replace(/\{\{\s*Spell_[^}]+\}\}/gi, '')

  // Format all Riot HTML tags with vibrant Tailwind classes
  tooltip = formatTooltipTags(tooltip)

  const spellIdx =
    activeCustomizerSlot.value?.champion?.spells.findIndex((s) => s.id === sp.id) ?? 0
  const rank = getSpellRank(spellIdx)

  const champFormulas =
    spellFormulasData.value[champId] || spellFormulasData.value[champId.toLowerCase()]
  const spellConfig = (champFormulas ? champFormulas[sp.id] : null) as Record<
    string,
    unknown
  > | null

  // Find all {{ placeholder }} occurrences in the tooltip
  const placeholdersInTooltip = Array.from(tooltip.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g))

  for (const match of placeholdersInTooltip) {
    const rawPlaceholder = match[1]?.trim()
    if (!rawPlaceholder) continue

    // Skip known empty system placeholders
    if (
      [
        'spellmodifierdescriptionappend',
        'specialabilityoverride',
        'spellmodifierdescription',
      ].includes(rawPlaceholder.toLowerCase())
    ) {
      continue
    }

    let multiplier = 1
    let cleanName = rawPlaceholder
    let isNegativeMultiplier = false

    // Check for multiplier (e.g. {{ wslowpercentage * -100 }} or {{ e1*100 }})
    if (cleanName.includes('*')) {
      const parts = cleanName.split('*')
      cleanName = parts[0]?.trim() || cleanName
      const multVal = parseFloat(parts[1]?.trim() || '1')
      if (!isNaN(multVal)) {
        multiplier = multVal
        if (multVal < 0) isNegativeMultiplier = true
      }
    }

    const calcEffectiveMultiplier = (val: number): number => {
      let m = multiplier
      // Avoid double 100x multiplication if val is already scaled (>= 1 or <= -1)
      if (Math.abs(multiplier) === 100 && Math.abs(val) >= 1) {
        m = multiplier < 0 ? -1 : 1
      }
      return m
    }

    let replacementValue: string | null = null

    // 1. Search in spellFormulas.json config
    if (spellConfig) {
      const candidateKeys = [
        rawPlaceholder,
        cleanName,
        cleanName.toLowerCase(),
        `calc_${cleanName.toLowerCase()}`,
        cleanName.toLowerCase().replace(/^calc_/, ''),
      ]

      let matchedKey = Object.keys(spellConfig).find(
        (k) => candidateKeys.includes(k) || candidateKeys.includes(k.toLowerCase()),
      )

      // Positional fallback: e1 / f1 maps to 1st calc, e2 / f2 maps to 2nd calc in spellConfig
      if (!matchedKey) {
        const efMatch = cleanName.match(/^[ef]([0-9]+)$/i)
        if (efMatch) {
          const posIdx = parseInt(efMatch[1] || '1', 10) - 1
          const keys = Object.keys(spellConfig)
          if (keys[posIdx]) {
            matchedKey = keys[posIdx]
          }
        }
      }

      if (matchedKey && spellConfig[matchedKey]) {
        const config = spellConfig[matchedKey]
        if (typeof config === 'string' || typeof config === 'number') {
          const num = parseFloat(config.toString())
          const effM = calcEffectiveMultiplier(num)
          let val = Math.round(num * effM * 100) / 100
          if (isNegativeMultiplier) val = Math.abs(val)
          replacementValue = val.toString()
        } else if (config && typeof config === 'object') {
          const baseArr = ((config as Record<string, unknown>).base as number[]) || []
          const baseRaw = baseArr[rank - 1] ?? baseArr[baseArr.length - 1] ?? 0
          const effM = calcEffectiveMultiplier(baseRaw)

          const keyLower = cleanName.toLowerCase()
          const isRatio =
            keyLower.includes('vamp') ||
            keyLower.includes('lifesteal') ||
            keyLower.includes('ratio') ||
            keyLower.includes('percent') ||
            keyLower.includes('pct') ||
            (Math.abs(baseRaw) > 0 && Math.abs(baseRaw) < 1.0)

          let base = baseRaw * effM
          let suffix = ''
          if (isRatio && Math.abs(baseRaw) < 1.0 && Math.abs(effM) === 1) {
            base = base * 100
            suffix = '%'
          }
          base = Math.round(base)
          if (isNegativeMultiplier) base = Math.abs(base)

          const scalings =
            ((config as Record<string, unknown>).scalings as Array<{
              ratio: number | number[]
              stat: string
            }>) || []
          const dmgType = ((config as Record<string, unknown>).type as string) || ''

          let colorClass = 'text-slate-200'
          if (dmgType === 'magic') colorClass = 'text-cyan-400'
          else if (dmgType === 'physical') colorClass = 'text-orange-400'
          else if (dmgType === 'true') colorClass = 'text-white font-bold'
          else if (dmgType === 'cc' || dmgType === 'status') colorClass = 'text-purple-400'

          if (scalings.length === 0) {
            replacementValue = `<span class="${colorClass} font-semibold">${base}${suffix}</span>`
          } else {
            let scalingBonus = 0
            const scalingDetails: string[] = []

            for (const scale of scalings) {
              const rawRatio = Array.isArray(scale.ratio)
                ? (scale.ratio[rank - 1] ?? scale.ratio[scale.ratio.length - 1] ?? 0)
                : (scale.ratio ?? 0)
              const ratioVal = rawRatio * effM

              const statValue = getStatValue(stats, scale.stat)
              scalingBonus += statValue * ratioVal

              let statLabel = getStatLabel(scale.stat)
              const statColor = getStatColorClass(scale.stat)
              let ratioPct = Math.round(ratioVal * 10000) / 100
              if (isNegativeMultiplier) ratioPct = Math.abs(ratioPct)

              if (
                (scale.stat === 'bonusHp' || scale.stat === 'totalHp') &&
                ratioVal > 0 &&
                ratioVal < 0.005
              ) {
                ratioPct = Math.round(ratioVal * 1000000) / 100
                statLabel = `per 100 ${statLabel}`
              }

              scalingDetails.push(`<span class="${statColor}">${ratioPct}% ${statLabel}</span>`)
            }

            const rawTotal = baseRaw * effM + scalingBonus
            let totalValue = Math.round(
              rawTotal * (isRatio && Math.abs(baseRaw) < 1.0 && Math.abs(effM) === 1 ? 100 : 1),
            )
            if (isNegativeMultiplier) totalValue = Math.abs(totalValue)

            const primaryStatColor = scalings[0] ? getStatColorClass(scalings[0].stat) : colorClass
            let detailsText =
              base > 0 ? `<span class="${primaryStatColor}">${base}${suffix}</span>` : ''
            if (scalingDetails.length > 0) {
              detailsText += (detailsText ? ' + ' : '') + scalingDetails.join(' + ')
            }

            replacementValue = `<span class="${colorClass} font-semibold">${totalValue}${suffix}</span>`
            if (detailsText) {
              replacementValue += ` <span class="text-slate-400 font-normal text-base">(${detailsText})</span>`
            }
          }
        }
      }
    }

    // 2. Fallback: DDragon Native effect / vars / effectBurn vectors
    if (!replacementValue) {
      const rawSp = sp as unknown as Record<string, unknown>
      const efMatch = cleanName.match(/^[ef]([0-9]+)$/i)
      if (efMatch) {
        const effIndex = parseInt(efMatch[1] || '0', 10)
        const effArr = sp.effect ? sp.effect[effIndex] : null
        const effectBurn = rawSp.effectBurn as string[] | undefined

        if (Array.isArray(effArr) && effArr.length > 0) {
          const rawVal = effArr[rank - 1] ?? effArr[0] ?? 0
          const effM = calcEffectiveMultiplier(rawVal)
          let val = Math.round(rawVal * effM * 100) / 100
          if (isNegativeMultiplier) val = Math.abs(val)
          replacementValue = `<span class="text-cyan-400 font-semibold">${val}</span>`
        } else if (effectBurn && effectBurn[effIndex]) {
          const burnParts = effectBurn[effIndex].split('/')
          const burnVal = burnParts[rank - 1] ?? burnParts[0] ?? effectBurn[effIndex]
          const numVal = parseFloat(burnVal)
          if (!isNaN(numVal)) {
            const effM = calcEffectiveMultiplier(numVal)
            let val = Math.round(numVal * effM * 100) / 100
            if (isNegativeMultiplier) val = Math.abs(val)
            replacementValue = `<span class="text-cyan-400 font-semibold">${val}</span>`
          } else {
            replacementValue = `<span class="text-cyan-400 font-semibold">${burnVal}</span>`
          }
        }
      }

      if (!replacementValue && sp.vars) {
        const varMatch = sp.vars.find(
          (v) => typeof v.key === 'string' && v.key.toLowerCase() === cleanName.toLowerCase(),
        )
        if (varMatch) {
          let stat = 'totalAp'
          if (varMatch.link === 'bonusattackdamage') stat = 'bonusAd'
          else if (varMatch.link === 'attackdamage') stat = 'totalAd'
          else if (varMatch.link === 'bonushealth') stat = 'bonusHp'

          const rawCoeff = Array.isArray(varMatch.coeff)
            ? (varMatch.coeff[rank - 1] ?? varMatch.coeff[0] ?? 0)
            : (varMatch.coeff ?? 0)
          const ratioVal = rawCoeff * multiplier

          const baseArr = sp.effect ? sp.effect[1] : null
          const baseRaw = baseArr ? (baseArr[rank - 1] ?? baseArr[0] ?? 0) : 0

          const keyLower = cleanName.toLowerCase()
          const isRatio =
            keyLower.includes('vamp') ||
            keyLower.includes('lifesteal') ||
            keyLower.includes('ratio') ||
            keyLower.includes('percent') ||
            keyLower.includes('pct') ||
            (Math.abs(baseRaw) > 0 && Math.abs(baseRaw) < 1.0)

          let base = baseRaw * multiplier
          let suffix = ''
          if (isRatio && Math.abs(baseRaw) < 1.0 && Math.abs(multiplier) === 1) {
            base = base * 100
            suffix = '%'
          }
          base = Math.round(base)

          const statValue = getStatValue(stats, stat)
          const bonusVal = statValue * ratioVal
          const totalVal = Math.round(
            (baseRaw * multiplier + bonusVal) *
              (isRatio && Math.abs(baseRaw) < 1.0 && Math.abs(multiplier) === 1 ? 100 : 1),
          )
          const statLabel = getStatLabel(stat)
          const statColor = getStatColorClass(stat)
          const ratioPct = Math.round(ratioVal * 10000) / 100

          let detailsText = base > 0 ? `<span class="${statColor}">${base}${suffix}</span>` : ''
          if (ratioPct > 0) {
            detailsText +=
              (detailsText ? ' + ' : '') +
              `<span class="${statColor}">${ratioPct}% ${statLabel}</span>`
          }

          replacementValue = `<span class="text-cyan-400 font-semibold">${totalVal}${suffix}</span>`
          if (detailsText) {
            replacementValue += ` <span class="text-slate-400 font-normal text-base">(${detailsText})</span>`
          }
        }
      }

      // 3. Fallback to first effectBurn array value if still not replaced
      if (!replacementValue) {
        const rawSp = sp as unknown as Record<string, unknown>
        const effectBurn = rawSp.effectBurn as string[] | undefined
        if (effectBurn && effectBurn[1]) {
          const burnParts = effectBurn[1].split('/')
          const burnVal = burnParts[rank - 1] ?? burnParts[0] ?? effectBurn[1]
          replacementValue = `<span class="text-cyan-400 font-semibold">${burnVal}</span>`
        }
      }
    }

    if (replacementValue) {
      tooltip = tooltip.split(match[0]).join(replacementValue)
    }
  }

  // Clean up remaining empty system placeholders
  tooltip = tooltip.replace(
    /\{\{\s*(spellmodifierdescriptionappend|specialabilityoverride|spellmodifierdescription)\s*\}\}/gi,
    '',
  )

  // Final safety fallback: try extracting from effectBurn before stripping
  tooltip = tooltip.replace(/\{\{\s*([ef])([0-9]+)\s*\}\}/gi, (_match, _p1, p2) => {
    const rawSp = sp as unknown as Record<string, unknown>
    const effectBurn = rawSp.effectBurn as string[] | undefined
    const idx = parseInt(p2, 10)
    if (effectBurn && effectBurn[idx]) {
      const parts = effectBurn[idx].split('/')
      return `<span class="text-cyan-400 font-semibold">${parts[rank - 1] ?? parts[0]}</span>`
    }
    return ''
  })

  return tooltip
}

const interpolatePassiveDescription = (
  passive: ChampionPassive | Record<string, unknown>,
  lvl: number,
  stats: ReturnType<typeof calculateStats> | null,
  champId: string,
): string => {
  if (!passive) return ''
  let text = (passive as { description?: string })?.description || ''

  // Format all Riot HTML tags with vibrant Tailwind classes
  text = formatTooltipTags(text)

  const champFormulas = spellFormulasData.value[champId]
  if (champFormulas && champFormulas.passive) {
    const passiveConfig = champFormulas.passive as Record<string, unknown>
    const statItems: string[] = []

    for (const [key, config] of Object.entries(passiveConfig)) {
      if (key.startsWith('{')) continue

      const cleanKey =
        (key.startsWith('P') || key.startsWith('p')) &&
        key.length > 2 &&
        key[1] &&
        key[1] === key[1].toUpperCase()
          ? key.substring(1)
          : key
      const label = cleanKey.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')

      if (config && typeof config === 'object') {
        const baseArr = ((config as Record<string, unknown>).base as number[]) || []
        const base = baseArr[lvl - 1] ?? baseArr[baseArr.length - 1] ?? 0
        const scalings =
          ((config as Record<string, unknown>).scalings as Array<{
            ratio: number | number[]
            stat: string
          }>) || []
        const dmgType = ((config as Record<string, unknown>).type as string) || ''

        let scalingBonus = 0
        const scalingDetails: string[] = []

        for (const scale of scalings) {
          const ratioVal = Array.isArray(scale.ratio)
            ? (scale.ratio[lvl - 1] ?? scale.ratio[scale.ratio.length - 1] ?? 0)
            : (scale.ratio ?? 0)

          const statValue = getStatValue(stats, scale.stat)
          scalingBonus += statValue * ratioVal

          let statLabel = getStatLabel(scale.stat)
          let ratioPct = Math.round(ratioVal * 100)

          if (
            (scale.stat === 'bonusHp' || scale.stat === 'totalHp') &&
            ratioVal > 0 &&
            ratioVal < 0.05
          ) {
            ratioPct = Math.round(ratioVal * 10000) / 100
            statLabel = `per 100 ${statLabel}`
          }

          scalingDetails.push(`${ratioPct}% ${statLabel}`)
        }

        const keyLower = key.toLowerCase()
        const isRatio =
          keyLower.includes('ratio') ||
          keyLower.includes('percent') ||
          keyLower.includes('pct') ||
          keyLower.includes('chance') ||
          keyLower.includes('mod') ||
          keyLower.includes('bonus') ||
          keyLower.includes('reduction') ||
          keyLower.includes('pdamage') ||
          (base > 0 && base < 1)
        const isCooldown = keyLower.includes('cooldown') || keyLower.includes('duration')

        const rawVal = base + scalingBonus
        let displayVal = rawVal
        let unitSuffix = ''

        if (isRatio) {
          unitSuffix = '%'
          if (displayVal <= 1.05 && displayVal > 0) {
            displayVal = displayVal * 100
          }
        } else if (isCooldown) {
          unitSuffix = 's'
        }

        displayVal = Math.round(displayVal)
        const formattedBase = Math.round(isRatio && base <= 1.05 && base > 0 ? base * 100 : base)

        let colorClass = 'text-cyan-400'
        if (dmgType === 'physical') colorClass = 'text-orange-400'
        else if (dmgType === 'true') colorClass = 'text-white font-bold'
        else if (dmgType === 'cc' || dmgType === 'status') colorClass = 'text-purple-400'

        let valHtml = `<span class="${colorClass} font-semibold">${displayVal}${unitSuffix}</span>`
        const skipRangeKeys = ['damage', 'pdamage', 'cooldown', 'monsterdamagecap']
        const cleanKeyLower = cleanKey.toLowerCase()

        if (
          baseArr.length > 1 &&
          !skipRangeKeys.includes(cleanKeyLower) &&
          !skipRangeKeys.includes(keyLower)
        ) {
          const firstVal = baseArr[0] ?? 0
          const lastVal = baseArr[baseArr.length - 1] ?? 0
          if (Math.abs(firstVal - lastVal) > 0.0001) {
            let formFirst = firstVal
            let formLast = lastVal
            if (isRatio) {
              formFirst = firstVal <= 1.05 && firstVal > 0 ? firstVal * 100 : firstVal
              formLast = lastVal <= 1.05 && lastVal > 0 ? lastVal * 100 : lastVal
            }
            formFirst = Math.round(formFirst)
            formLast = Math.round(formLast)
            valHtml += ` <span class="text-slate-500 font-normal">(${formFirst}${unitSuffix} - ${formLast}${unitSuffix})</span>`
          }
        }

        if (scalingDetails.length > 0) {
          valHtml += ` <span class="text-slate-500 text-base">(${formattedBase}${unitSuffix} + ${scalingDetails.join(' + ')})</span>`
        }

        statItems.push(`<span class="text-slate-400">${label}:</span> ${valHtml}`)
      }
    }

    if (statItems.length > 0) {
      text += `<br /><div class="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-base font-mono"><span class="text-amber-400/90 font-bold">Lv. ${lvl}:</span> ${statItems.join(' <span class="text-slate-700">|</span> ')}</div>`
    }
  }

  return text
}
</script>
