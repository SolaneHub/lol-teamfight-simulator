<template>
  <div
    class="flex-1 flex flex-col gap-6 p-6 w-full max-w-none bg-[#0b0f17] text-slate-200 font-sans min-h-screen text-base"
  >
    <!-- TOP TOOLBAR: SCENARIO PRESETS & VIEW MODE SWITCHER -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 bg-[#131926] border border-slate-800 rounded-2xl p-5 shadow-xl"
    >
      <!-- Scenario Presets -->
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-base font-mono uppercase font-bold text-slate-400 mr-2">Presets:</span>
        <button
          v-for="p in presetOptions"
          :key="p.id"
          @click="setPresetScenario(p.id)"
          class="px-4 py-2.5 rounded-lg font-mono text-base font-bold transition-all border cursor-pointer"
          :class="
            isPresetActive(p.id)
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
          "
        >
          {{ p.label }}
        </button>
      </div>

      <!-- View Mode Switcher -->
      <div class="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          @click="teamfightViewMode = 'split'"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-mono font-bold transition-all cursor-pointer"
          :class="
            teamfightViewMode === 'split'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          "
        >
          <span>📊</span>
          <span>3-Column Squad View</span>
        </button>
        <button
          @click="teamfightViewMode = 'feed'"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-mono font-bold transition-all cursor-pointer"
          :class="
            teamfightViewMode === 'feed'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          "
        >
          <span>⏱️</span>
          <span>Chronological Feed View</span>
        </button>
      </div>
    </div>

    <!-- ROSTER SELECTORS (BLUE TEAM ATTACKERS & RED TEAM DEFENDERS) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Blue Team Attacker Selection -->
      <div
        class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-3 shadow-md"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="h-3.5 w-3.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="text-base font-mono font-bold uppercase tracking-wider text-cyan-400"
              >Attacker Squad (Blue Team)</span
            >
          </div>
          <span class="text-base font-mono text-slate-400 font-semibold"
            >{{ selectedAttackerSlots.length }} Champions Participating</span
          >
        </div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <button
            v-for="s in blueDraft"
            :key="s.id"
            @click="toggleAttackerSlot(s.id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-base cursor-pointer transition-all"
            :class="
              selectedAttackerSlotIds.includes(s.id)
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/80 font-bold shadow'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            "
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="selectedAttackerSlotIds.includes(s.id) ? 'bg-cyan-400' : 'bg-slate-600'"
            ></span>
            <span>{{ s.role }}</span>
            <span v-if="s.champion" class="text-white font-semibold">{{ s.champion.name }}</span>
            <span v-else class="text-slate-500">Empty</span>
          </button>
        </div>
      </div>

      <!-- Red Team Defender Selection -->
      <div
        class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-3 shadow-md"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="h-3.5 w-3.5 rounded-full bg-rose-400 animate-pulse"></span>
            <span class="text-base font-mono font-bold uppercase tracking-wider text-rose-400"
              >Defender Squad (Red Team)</span
            >
          </div>
          <span class="text-base font-mono text-slate-400 font-semibold"
            >{{ selectedDefenderSlots.length }} Champions Targetable</span
          >
        </div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <button
            v-for="s in redDraft"
            :key="s.id"
            @click="toggleDefenderSlot(s.id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-base cursor-pointer transition-all"
            :class="
              selectedDefenderSlotIds.includes(s.id)
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/80 font-bold shadow'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            "
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              :class="selectedDefenderSlotIds.includes(s.id) ? 'bg-rose-400' : 'bg-slate-600'"
            ></span>
            <span>{{ s.role }}</span>
            <span v-if="s.champion" class="text-white font-semibold">{{ s.champion.name }}</span>
            <span v-else class="text-slate-500">Empty</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ACTION CREATOR PANEL (SELECT ACTOR, ABILITY & TARGETS) -->
    <div
      class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5"
    >
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold font-mono text-amber-400 uppercase tracking-wider"
            >⚡ Teamfight Action Creator</span
          >
          <span
            class="text-base font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded border border-slate-800"
            >AOE & Multi-Target Ready</span
          >
        </div>
        <button
          @click="clearComboSequence"
          class="px-4 py-2 bg-rose-950/50 text-rose-300 hover:bg-rose-900 border border-rose-900/60 rounded-lg font-mono text-base font-bold transition-all cursor-pointer"
        >
          🗑️ Clear Teamfight Timeline
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end font-mono">
        <!-- 1. Actor Selector -->
        <div class="md:col-span-3 flex flex-col gap-2">
          <label class="text-base font-bold text-slate-400 uppercase tracking-wide"
            >1. Attacking Champion</label
          >
          <div
            class="min-h-14 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1.5"
          >
            <button
              v-for="s in selectedAttackerSlots"
              :key="s.id"
              @click="actionCreatorActorId = s.id"
              class="h-10 flex items-center gap-1.5 px-2.5 rounded-lg text-base font-bold font-mono border cursor-pointer transition-all"
              :class="
                actionCreatorActorId === s.id
                  ? 'bg-cyan-600 text-white border-cyan-400 font-extrabold shadow-md shadow-cyan-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              "
            >
              <img
                v-if="s.champion"
                :src="getChampionIconUrl(s.champion)"
                class="w-6 h-6 rounded-md object-cover border border-cyan-500/30"
              />
              <span>{{ s.champion ? s.champion.name : s.role }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Spell / AA Selector -->
        <div class="md:col-span-3 flex flex-col gap-2">
          <label class="text-base font-bold text-slate-400 uppercase tracking-wide"
            >2. Action / Spell</label
          >
          <div
            class="h-14 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5"
          >
            <button
              v-for="act in ['Q', 'W', 'E', 'R', 'P', 'AA']"
              :key="act"
              @click="actionCreatorSpell = act as any"
              class="flex-1 h-full flex items-center justify-center rounded-lg font-mono text-base font-extrabold transition-all border cursor-pointer"
              :class="
                actionCreatorSpell === act
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              "
            >
              {{ act }}
            </button>
          </div>
        </div>

        <!-- 3. Target Picker (AOE Checkboxes) -->
        <div class="md:col-span-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-base font-bold text-slate-400 uppercase tracking-wide"
              >3. Hit Targets (AOE Multi-Select)</label
            >
            <button
              @click="toggleSelectAllTargets"
              class="text-base text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer font-bold"
            >
              {{ isAllTargetsSelected ? 'Deselect All' : 'Select All Enemies (AOE)' }}
            </button>
          </div>
          <div
            class="min-h-14 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex flex-wrap items-center gap-1.5"
          >
            <label
              v-for="s in selectedDefenderSlots"
              :key="s.id"
              class="h-10 flex items-center gap-1.5 px-2.5 rounded-lg text-base font-bold border cursor-pointer transition-all"
              :class="
                actionCreatorTargetIds.includes(s.id)
                  ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold shadow-md shadow-rose-900/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              "
            >
              <input
                type="checkbox"
                :value="s.id"
                v-model="actionCreatorTargetIds"
                class="hidden"
              />
              <img
                v-if="s.champion"
                :src="getChampionIconUrl(s.champion)"
                class="w-6 h-6 rounded-md object-cover border border-rose-500/30"
              />
              <span>{{ s.champion ? s.champion.name : s.role }}</span>
            </label>
          </div>
        </div>

        <!-- Add Button -->
        <div class="md:col-span-2 flex flex-col gap-2">
          <label class="text-base font-bold text-transparent uppercase select-none">&nbsp;</label>
          <button
            @click="submitTeamfightAction"
            class="h-14 w-full px-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl font-mono text-base transition-all shadow-lg shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>➕ Add Action</span>
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 1: 3-COLUMN SQUAD VIEW -->
    <div v-if="teamfightViewMode === 'split'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- LEFT COLUMN: ATTACKER SQUAD ROSTER -->
      <div class="lg:col-span-3 flex flex-col gap-5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-base font-mono uppercase font-bold text-cyan-400"
            >Attacker Squad Roster</span
          >
          <span class="text-base font-mono text-slate-500 font-semibold">Live Stats</span>
        </div>

        <div
          v-for="slot in selectedAttackerSlots"
          :key="slot.id"
          class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg"
        >
          <!-- Card Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="slot.champion"
                :src="getChampionIconUrl(slot.champion)"
                class="h-12 w-12 rounded-lg border border-cyan-500/50 object-cover"
              />
              <div>
                <h4 class="text-base font-bold text-white leading-tight">
                  {{ slot.champion?.name || 'Unassigned' }}
                </h4>
                <span class="text-base font-mono text-cyan-400 font-semibold"
                  >{{ slot.side.toUpperCase() }} {{ slot.role }} • Lvl {{ slot.level }}</span
                >
              </div>
            </div>
            <button
              @click="openWorkbenchForSlot(slot.id)"
              class="text-base text-cyan-400 hover:text-white font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 transition-all cursor-pointer"
            >
              ⚙️
            </button>
          </div>

          <!-- Keystone & Rune Row -->
          <div
            v-if="slot.primaryKeystone"
            class="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-lg border border-slate-800"
          >
            <div
              class="flex items-center gap-2 cursor-pointer group"
              @mouseenter="showRuneTooltip(slot.primaryKeystone, 'Primary Keystone')"
              @mouseleave="hideRuneTooltip"
              @mousemove="onMouseMove"
            >
              <div
                class="h-8 w-8 rounded-full bg-slate-900 border border-amber-500/50 p-0.5 flex items-center justify-center shrink-0 group-hover:border-amber-400 transition-all"
              >
                <img
                  :src="getRuneIconUrl(slot.primaryKeystone.icon)"
                  class="h-full w-full object-contain"
                />
              </div>
              <span class="text-base font-bold text-amber-300 group-hover:underline">{{
                slot.primaryKeystone.name
              }}</span>
            </div>
          </div>

          <!-- Stats Grid -->
          <div
            v-if="getCalculatedStatsForSlot(slot)"
            class="grid grid-cols-3 gap-2 text-base font-mono bg-slate-950 p-3 rounded-lg border border-slate-800"
          >
            <div>
              <span class="text-slate-500 block text-base">AD</span
              ><span class="text-orange-400 font-bold text-lg">{{
                getCalculatedStatsForSlot(slot)?.ad
              }}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-base">AP</span
              ><span class="text-cyan-400 font-bold text-lg">{{
                getCalculatedStatsForSlot(slot)?.ap
              }}</span>
            </div>
            <div>
              <span class="text-slate-500 block text-base">Crit</span
              ><span class="text-amber-300 font-bold text-lg"
                >{{ getCalculatedStatsForSlot(slot)?.crit }}%</span
              >
            </div>
            <div>
              <span class="text-slate-500 block text-base">Pen</span
              ><span class="text-rose-400 font-bold text-base"
                >{{ getCalculatedStatsForSlot(slot)?.lethality }}|{{
                  getCalculatedStatsForSlot(slot)?.armorPen
                }}%</span
              >
            </div>
            <div>
              <span class="text-slate-500 block text-base">MPen</span
              ><span class="text-purple-400 font-bold text-base"
                >{{ getCalculatedStatsForSlot(slot)?.magicPenFlat }}|{{
                  getCalculatedStatsForSlot(slot)?.magicPenPercent
                }}%</span
              >
            </div>
            <div>
              <span class="text-slate-500 block text-base">AH</span
              ><span class="text-teal-400 font-bold text-lg">{{
                getCalculatedStatsForSlot(slot)?.abilityHaste
              }}</span>
            </div>
          </div>

          <!-- Items Row -->
          <div class="flex items-center gap-1.5">
            <div
              v-for="(item, idx) in slot.items"
              :key="idx"
              class="h-9 w-9 rounded bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden"
            >
              <img v-if="item" :src="getItemIconUrl(item)" class="h-full w-full object-cover" />
              <span v-else class="text-base text-slate-700">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTER COLUMN: COMBAT TIMELINE & LOGS -->
      <div class="lg:col-span-6 flex flex-col gap-5">
        <div
          class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-lg font-mono uppercase font-bold text-amber-400"
              >Teamfight Combat Log</span
            >
            <span class="text-base font-mono text-slate-400"
              >{{ teamfightSimulationResults.logSteps.length }} Steps Executed</span
            >
          </div>

          <!-- Action Steps Timeline -->
          <div
            v-if="teamfightSimulationResults.logSteps.length > 0"
            class="flex flex-col gap-4 font-mono text-base"
          >
            <div
              v-for="(step, idx) in teamfightSimulationResults.logSteps"
              :key="idx"
              class="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 transition-all hover:border-slate-700"
            >
              <!-- Step Header -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span
                    class="px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold text-base"
                    >#{{ idx + 1 }}</span
                  >
                  <span class="text-cyan-300 font-bold text-lg">{{ step.actorName }}</span>
                  <span
                    class="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-base"
                    >{{ step.action }}</span
                  >
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-amber-400 font-extrabold text-lg"
                    >{{ step.totalStepDamage }} Total Dmg</span
                  >
                  <button
                    @click="removeTeamfightAction(idx)"
                    class="text-rose-400 hover:text-rose-300 font-bold text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Target Damage Breakdown Pills -->
              <div
                class="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800"
              >
                <div
                  v-for="(res, tIdx) in step.targetResults"
                  :key="tIdx"
                  class="flex items-center justify-between text-base"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-rose-300 font-semibold">➔ {{ res.targetName }}:</span>
                    <span
                      class="font-bold px-2 py-0.5 rounded"
                      :class="
                        res.type === 'physical'
                          ? 'bg-orange-950/80 text-orange-400'
                          : res.type === 'magic'
                            ? 'bg-cyan-950/80 text-cyan-400'
                            : 'bg-slate-950 text-slate-300'
                      "
                    >
                      {{ res.amount }} {{ res.type.toUpperCase() }}
                    </span>
                    <span
                      v-if="res.blackCleaverStacks > 0"
                      class="text-base text-amber-400 font-semibold"
                      >[🪓 BC {{ res.blackCleaverStacks }}x]</span
                    >
                    <span
                      v-if="res.vileDecayStacks > 0"
                      class="text-base text-purple-400 font-semibold"
                      >[🩸 Vile Decay {{ res.vileDecayStacks }}x]</span
                    >
                    <span
                      v-if="res.conquerorStacks > 0"
                      class="text-base text-amber-300 font-semibold"
                      >[⚡ Conqueror {{ res.conquerorStacks }}x{{
                        res.conquerorStacks === 12 ? ' (MAX)' : ''
                      }}]</span
                    >
                    <span
                      v-if="res.lethalTempoStacks > 0"
                      class="text-base text-cyan-300 font-semibold"
                      >[⚡ Lethal Tempo {{ res.lethalTempoStacks }}x{{
                        res.lethalTempoStacks === 6
                          ? ` (MAX +${res.lethalTempoOnHitDmg || 0} Dmg)`
                          : ''
                      }}]</span
                    >
                    <span
                      v-if="res.ptaExposed"
                      class="text-base text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50"
                      >🎯 PtA EXPOSED (+8% Dmg)</span
                    >
                    <span
                      v-else-if="res.ptaStacks > 0"
                      class="text-base text-amber-300 font-semibold"
                      >[🎯 PtA {{ res.ptaStacks }}/3]</span
                    >
                    <span v-if="res.coupDeGrace" class="text-base text-rose-300 font-semibold"
                      >[🗡️ Coup de Grace (+8%)]</span
                    >
                    <span v-if="res.cutDown" class="text-base text-amber-300 font-semibold"
                      >[🩸 Cut Down (+8%)]</span
                    >
                    <span
                      v-if="res.lastStandBonusPct && res.lastStandBonusPct > 0"
                      class="text-base text-red-400 font-semibold"
                      >[🛡️ Last Stand (+{{ res.lastStandBonusPct }}%)]</span
                    >
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-base text-slate-400">HP: {{ res.remainingHp }}</span>
                    <span
                      v-if="res.isKo"
                      class="text-base bg-rose-500 text-slate-950 font-bold px-2 py-0.5 rounded animate-pulse"
                      >☠️ K.O.</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="py-16 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 font-mono text-base"
          >
            <span>No teamfight actions added yet.</span>
            <span class="text-slate-400 mt-2"
              >Use the Action Creator above to build a teamfight scenario!</span
            >
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: DEFENDER SQUAD ROSTER WITH LIVE HP BARS -->
      <div class="lg:col-span-3 flex flex-col gap-5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-base font-mono uppercase font-bold text-rose-400"
            >Defender Squad Roster</span
          >
          <span class="text-base font-mono text-slate-500 font-semibold">Live Health & Shred</span>
        </div>

        <div
          v-for="slot in selectedDefenderSlots"
          :key="slot.id"
          class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg"
        >
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="slot.champion"
                :src="getChampionIconUrl(slot.champion)"
                class="h-12 w-12 rounded-lg border border-rose-500/50 object-cover"
              />
              <div>
                <h4 class="text-base font-bold text-white leading-tight">
                  {{ slot.champion?.name || 'Unassigned' }}
                </h4>
                <span class="text-base font-mono text-rose-400 font-semibold"
                  >{{ slot.side.toUpperCase() }} {{ slot.role }} • Lvl {{ slot.level }}</span
                >
              </div>
            </div>
            <button
              @click="openWorkbenchForSlot(slot.id)"
              class="text-base text-rose-400 hover:text-white font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-rose-500 transition-all cursor-pointer"
            >
              ⚙️
            </button>
          </div>

          <!-- Keystone & Rune Row -->
          <div
            v-if="slot.primaryKeystone"
            class="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-lg border border-slate-800"
          >
            <div
              class="flex items-center gap-2 cursor-pointer group"
              @mouseenter="showRuneTooltip(slot.primaryKeystone, 'Primary Keystone')"
              @mouseleave="hideRuneTooltip"
              @mousemove="onMouseMove"
            >
              <div
                class="h-8 w-8 rounded-full bg-slate-900 border border-amber-500/50 p-0.5 flex items-center justify-center shrink-0 group-hover:border-amber-400 transition-all"
              >
                <img
                  :src="getRuneIconUrl(slot.primaryKeystone.icon)"
                  class="h-full w-full object-contain"
                />
              </div>
              <span class="text-base font-bold text-amber-300 group-hover:underline">{{
                slot.primaryKeystone.name
              }}</span>
            </div>
          </div>

          <!-- Live HP Bar -->
          <div
            class="flex flex-col gap-1.5 font-mono text-base bg-slate-950 p-3 rounded-lg border border-slate-800"
          >
            <div class="flex items-center justify-between font-bold">
              <span class="text-slate-400">Health</span>
              <span
                :class="
                  getDefenderEndState(slot.id).isKo
                    ? 'text-rose-500 font-extrabold'
                    : 'text-emerald-400'
                "
              >
                {{ getDefenderEndState(slot.id).currentHp }} /
                {{ getDefenderEndState(slot.id).maxHp }} ({{ getDefenderEndState(slot.id).hpPct }}%)
              </span>
            </div>
            <div
              class="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative"
            >
              <div
                class="h-full transition-all duration-300"
                :class="
                  getDefenderEndState(slot.id).hpPct > 50
                    ? 'bg-linear-to-r from-emerald-500 to-green-400'
                    : getDefenderEndState(slot.id).hpPct > 20
                      ? 'bg-linear-to-r from-amber-500 to-yellow-400'
                      : 'bg-linear-to-r from-rose-600 to-red-500'
                "
                :style="{ width: getDefenderEndState(slot.id).hpPct + '%' }"
              ></div>
            </div>
          </div>

          <!-- Live Effective Armor & MR after Shred -->
          <div
            class="grid grid-cols-2 gap-3 font-mono text-base bg-slate-950 p-3 rounded-lg border border-slate-800"
          >
            <div class="flex flex-col">
              <span class="text-slate-500">Armor (Shred)</span>
              <span class="text-amber-400 font-bold text-lg">
                {{ getDefenderEndState(slot.id).effectiveArmor }}
                <span
                  v-if="getDefenderEndState(slot.id).blackCleaverStacks > 0"
                  class="text-rose-400 text-base"
                  >(-{{ getDefenderEndState(slot.id).blackCleaverStacks * 5 }}%)</span
                >
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-500">MR (Shred)</span>
              <span class="text-purple-400 font-bold text-lg">
                {{ getDefenderEndState(slot.id).effectiveMr }}
                <span
                  v-if="getDefenderEndState(slot.id).vileDecayStacks > 0"
                  class="text-rose-400 text-base"
                  >(-{{ (getDefenderEndState(slot.id).vileDecayStacks * 7.5).toFixed(1) }}%)</span
                >
              </span>
            </div>
          </div>

          <!-- Status Badges -->
          <div class="flex items-center gap-2 flex-wrap">
            <span
              v-if="getDefenderEndState(slot.id).isKo"
              class="bg-rose-500 text-slate-950 font-extrabold text-base px-2.5 py-1 rounded font-mono shadow animate-pulse"
              >☠️ K.O. / ELIMINATED</span
            >
            <span
              v-if="getDefenderEndState(slot.id).blackCleaverStacks > 0"
              class="bg-amber-950/80 text-amber-300 border border-amber-800/60 text-base px-2.5 py-1 rounded font-mono font-bold"
              >🪓 Black Cleaver {{ getDefenderEndState(slot.id).blackCleaverStacks }}x</span
            >
            <span
              v-if="getDefenderEndState(slot.id).vileDecayStacks > 0"
              class="bg-purple-950/80 text-purple-300 border border-purple-800/60 text-base px-2.5 py-1 rounded font-mono font-bold"
              >🩸 Vile Decay {{ getDefenderEndState(slot.id).vileDecayStacks }}x</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW MODE 2: CHRONOLOGICAL FEED VIEW -->
    <div v-else class="flex flex-col gap-6 text-base font-mono">
      <!-- Sticky Team Health Summary Header -->
      <div
        class="bg-[#131926] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 sticky top-4 z-20"
      >
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-base font-bold uppercase text-slate-300"
            >Defender Squad Health Summary</span
          >
          <span class="text-base text-slate-400"
            >Total Teamfight Damage Dealt:
            <strong class="text-amber-400 text-lg">{{
              teamfightSimulationResults.totalTeamDamage
            }}</strong></span
          >
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div
            v-for="slot in selectedDefenderSlots"
            :key="slot.id"
            class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-white text-base">{{
                slot.champion?.name || slot.role
              }}</span>
              <span
                v-if="getDefenderEndState(slot.id).isKo"
                class="text-base text-rose-400 font-extrabold"
                >K.O.</span
              >
            </div>
            <div
              class="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative"
            >
              <div
                class="h-full bg-linear-to-r from-emerald-500 to-rose-500 transition-all duration-300"
                :style="{ width: getDefenderEndState(slot.id).hpPct + '%' }"
              ></div>
            </div>
            <div class="flex items-center justify-between text-base text-slate-400">
              <span>HP: {{ getDefenderEndState(slot.id).currentHp }}</span>
              <span>Armor: {{ getDefenderEndState(slot.id).effectiveArmor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chronological Action Cards Feed -->
      <div class="flex flex-col gap-5">
        <div
          v-for="(step, idx) in teamfightSimulationResults.logSteps"
          :key="idx"
          class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4 font-mono transition-all hover:border-slate-700"
        >
          <!-- Step Top Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span
                class="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-300 text-base"
                >#{{ idx + 1 }}</span
              >
              <div class="flex items-center gap-3 text-lg">
                <span class="font-extrabold text-cyan-400">{{ step.actorName }}</span>
                <span class="text-base text-slate-400">casts</span>
                <span
                  class="px-3.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-base"
                  >{{ step.action }}</span
                >
              </div>
            </div>

            <div class="flex items-center gap-5">
              <div class="flex flex-col items-end">
                <span class="text-base text-slate-400 uppercase font-semibold"
                  >AOE Step Damage</span
                >
                <span class="text-lg font-extrabold text-amber-400"
                  >{{ step.totalStepDamage }} Dmg</span
                >
              </div>
              <button
                @click="removeTeamfightAction(idx)"
                class="px-3 py-1.5 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-900/50 text-base cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Target Cards Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800"
          >
            <div
              v-for="(res, tIdx) in step.targetResults"
              :key="tIdx"
              class="bg-slate-900/90 p-4 rounded-lg border border-slate-800 flex flex-col gap-2"
            >
              <div class="flex items-center justify-between text-base">
                <span class="text-rose-300 font-bold">➔ {{ res.targetName }}</span>
                <span v-if="res.isKo" class="text-base text-rose-400 font-bold">☠️ K.O.</span>
              </div>

              <div
                class="text-lg font-extrabold"
                :class="
                  res.type === 'physical'
                    ? 'text-orange-400'
                    : res.type === 'magic'
                      ? 'text-cyan-400'
                      : 'text-slate-200'
                "
              >
                +{{ res.amount }} {{ res.type.toUpperCase() }}
              </div>

              <div class="flex items-center gap-2 text-base text-slate-400 flex-wrap">
                <span>Rem. HP: {{ res.remainingHp }}</span>
                <span v-if="res.blackCleaverStacks > 0" class="text-amber-400 font-semibold"
                  >[BC {{ res.blackCleaverStacks }}x]</span
                >
                <span v-if="res.vileDecayStacks > 0" class="text-purple-400 font-semibold"
                  >[VD {{ res.vileDecayStacks }}x]</span
                >
                <span v-if="res.conquerorStacks > 0" class="text-amber-300 font-semibold"
                  >[⚡ Conq {{ res.conquerorStacks }}x{{
                    res.conquerorStacks === 12 ? ' (MAX)' : ''
                  }}]</span
                >
                <span v-if="res.lethalTempoStacks > 0" class="text-cyan-300 font-semibold"
                  >[⚡ LT {{ res.lethalTempoStacks }}x{{
                    res.lethalTempoStacks === 6
                      ? ` (MAX +${res.lethalTempoOnHitDmg || 0} Dmg)`
                      : ''
                  }}]</span
                >
                <span v-if="res.ptaExposed" class="text-amber-400 font-bold"
                  >[🎯 PtA EXPOSED (+8%)]</span
                >
                <span v-else-if="res.ptaStacks > 0" class="text-amber-300 font-semibold"
                  >[🎯 PtA {{ res.ptaStacks }}/3]</span
                >
                <span v-if="res.coupDeGrace" class="text-rose-300 font-semibold"
                  >[🗡️ CdG (+8%)]</span
                >
                <span v-if="res.cutDown" class="text-amber-300 font-semibold"
                  >[🩸 Cut Down (+8%)]</span
                >
                <span
                  v-if="res.lastStandBonusPct && res.lastStandBonusPct > 0"
                  class="text-red-400 font-semibold"
                  >[🛡️ Last Stand (+{{ res.lastStandBonusPct }}%)]</span
                >
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="teamfightSimulationResults.logSteps.length === 0"
          class="py-20 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 font-mono text-base"
        >
          <span>No teamfight steps logged yet.</span>
          <span class="text-slate-400 mt-2"
            >Use the Teamfight Action Creator to append actions step-by-step!</span
          >
        </div>
      </div>
    </div>
    <!-- Rune Tooltip Popup -->
    <RuneTooltip :rune="hoveredRune" :mouse-pos="mousePos" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDraftStore } from '@/stores/draft'
import { storeToRefs } from 'pinia'
import {
  getChampionIconUrl,
  getItemIconUrl,
  getRuneIconUrl,
  calculateStats,
  calculateMonsterBuffStats,
  getChampionDefaultAdaptiveType,
  calculateSpellDamage,
  detectItemPassives,
} from '@/services'
import type { DraftSlot, Rune } from '@/types'
import { useCalculatorStore } from '@/stores/calculator'
import RuneTooltip, { type RuneTooltipData } from '@/components/customizer/RuneTooltip.vue'

const hoveredRune = ref<RuneTooltipData | null>(null)
const mousePos = ref({ x: 0, y: 0 })

const onMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

const showRuneTooltip = (rune: Rune | RuneTooltipData | null | undefined, category: string) => {
  if (!rune) return
  hoveredRune.value = {
    ...rune,
    category: category || 'Primary Keystone',
  }
}

const hideRuneTooltip = () => {
  hoveredRune.value = null
}

const router = useRouter()
const draftStore = useDraftStore()
const calculatorStore = useCalculatorStore()

const { blueDraft, redDraft } = storeToRefs(draftStore)
const { selectCustomizerSlot } = draftStore

const {
  selectedAttackerSlotIds,
  selectedDefenderSlotIds,
  teamfightViewMode,
  teamfightActions,
  attackerBuffs,
  defenderBuffs,
} = storeToRefs(calculatorStore)

const { addTeamfightAction, removeTeamfightAction, clearComboSequence, setPresetScenario } =
  calculatorStore

// Preset Scenarios
const presetOptions = [
  { id: '1v1', label: '⚔️ 1v1 Dual' },
  { id: '1v2', label: '⚔️ 1v2 Gank' },
  { id: '2v2', label: '⚔️ 2v2 Skirmish' },
  { id: '3v3', label: '⚔️ 3v3 Dragon Fight' },
  { id: '5v5', label: '⚔️ 5v5 Full Teamfight' },
] as const

const isPresetActive = (presetId: string) => {
  if (presetId === '1v1')
    return selectedAttackerSlotIds.value.length === 1 && selectedDefenderSlotIds.value.length === 1
  if (presetId === '1v2')
    return selectedAttackerSlotIds.value.length === 1 && selectedDefenderSlotIds.value.length === 2
  if (presetId === '2v2')
    return selectedAttackerSlotIds.value.length === 2 && selectedDefenderSlotIds.value.length === 2
  if (presetId === '3v3')
    return selectedAttackerSlotIds.value.length === 3 && selectedDefenderSlotIds.value.length === 3
  if (presetId === '5v5')
    return selectedAttackerSlotIds.value.length === 5 && selectedDefenderSlotIds.value.length === 5
  return false
}

// Slot helpers
const selectedAttackerSlots = computed<DraftSlot[]>(() => {
  return blueDraft.value.filter((s) => selectedAttackerSlotIds.value.includes(s.id))
})

const selectedDefenderSlots = computed<DraftSlot[]>(() => {
  return redDraft.value.filter((s) => selectedDefenderSlotIds.value.includes(s.id))
})

const toggleAttackerSlot = (slotId: number) => {
  const idx = selectedAttackerSlotIds.value.indexOf(slotId)
  if (idx > -1) {
    if (selectedAttackerSlotIds.value.length > 1) {
      selectedAttackerSlotIds.value.splice(idx, 1)
    }
  } else {
    selectedAttackerSlotIds.value.push(slotId)
  }
}

const toggleDefenderSlot = (slotId: number) => {
  const idx = selectedDefenderSlotIds.value.indexOf(slotId)
  if (idx > -1) {
    if (selectedDefenderSlotIds.value.length > 1) {
      selectedDefenderSlotIds.value.splice(idx, 1)
    }
  } else {
    selectedDefenderSlotIds.value.push(slotId)
  }
}

// Action Creator State
const actionCreatorActorId = ref<number>(1)
const actionCreatorSpell = ref<'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'>('Q')
const actionCreatorTargetIds = ref<number[]>([6])

const isAllTargetsSelected = computed(() => {
  return selectedDefenderSlots.value.every((s) => actionCreatorTargetIds.value.includes(s.id))
})

const toggleSelectAllTargets = () => {
  if (isAllTargetsSelected.value) {
    actionCreatorTargetIds.value = [selectedDefenderSlots.value[0]?.id || 6]
  } else {
    actionCreatorTargetIds.value = selectedDefenderSlots.value.map((s) => s.id)
  }
}

const submitTeamfightAction = () => {
  addTeamfightAction(
    actionCreatorActorId.value,
    actionCreatorSpell.value,
    actionCreatorTargetIds.value,
  )
}

const openWorkbenchForSlot = (slotId: number) => {
  const slot = [...blueDraft.value, ...redDraft.value].find((s) => s.id === slotId)
  if (slot) selectCustomizerSlot(slot)
  router.push('/workbench')
}

// Calculated Base Stats for any slot
const getCalculatedStatsForSlot = (slot: DraftSlot) => {
  if (!slot || !slot.champion) return null
  const base = calculateStats(slot)
  if (!base) return null
  const isAttacker = blueDraft.value.some((b) => b.id === slot.id)
  const mStats = calculateMonsterBuffStats(isAttacker ? attackerBuffs.value : defenderBuffs.value)

  return {
    ad: Math.round((base.ad.total + mStats.bonusAD) * mStats.adMultiplier),
    baseAd: Math.round(base.ad.base * mStats.adMultiplier),
    ap: Math.round((base.ap.total + mStats.bonusAP) * mStats.apMultiplier),
    mana: base.mp.total,
    hp: base.hp.total + mStats.bonusShield,
    armor: Math.round(base.armor.total * mStats.armorMultiplier),
    mr: Math.round(base.mr.total * mStats.mrMultiplier),
    crit: base.crit.total,
    lethality: base.lethality.total,
    armorPen: base.armorPen.total,
    magicPenFlat: base.magicPenFlat.total,
    magicPenPercent: base.magicPenPercent.total,
    abilityHaste: Math.round(base.abilityHaste.total + mStats.bonusAH),
    tenacity: Math.round(base.tenacity.total + mStats.bonusTenacity),
    adaptiveType: getChampionDefaultAdaptiveType(slot.champion.id, slot.champion.tags),
  }
}

interface TargetResult {
  targetSlotId: number
  targetName: string
  amount: number
  type: 'physical' | 'magic' | 'true'
  effectiveArmor: number
  effectiveMr: number
  blackCleaverStacks: number
  vileDecayStacks: number
  conquerorStacks: number
  lethalTempoStacks: number
  lethalTempoOnHitDmg?: number
  ptaStacks: number
  ptaExposed: boolean
  coupDeGrace?: boolean
  cutDown?: boolean
  lastStandBonusPct?: number
  isKo: boolean
  remainingHp: number
}

// TEAMFIGHT SIMULATION ENGINE
const teamfightSimulationResults = computed(() => {
  const defenderStateMap: Record<
    number,
    {
      currentHp: number
      maxHp: number
      baseArmor: number
      baseMr: number
      blackCleaverStacks: number
      vileDecayStacks: number
      isKo: boolean
      name: string
    }
  > = {}

  const castCounters: Record<number, number> = {}
  const aatroxQSeqMap: Record<number, number> = {}
  const attackerConquerorMap: Record<number, number> = {}
  const attackerLethalTempoMap: Record<number, number> = {}
  const targetPtaMap: Record<string, { stacks: number; exposed: boolean }> = {}

  // Initialize Defender States
  selectedDefenderSlots.value.forEach((slot) => {
    const stats = getCalculatedStatsForSlot(slot)
    const hp = stats?.hp || 1000
    defenderStateMap[slot.id] = {
      currentHp: hp,
      maxHp: hp,
      baseArmor: stats?.armor || 50,
      baseMr: stats?.mr || 40,
      blackCleaverStacks: 0,
      vileDecayStacks: 0,
      isKo: false,
      name: slot.champion ? slot.champion.name : `Red ${slot.role}`,
    }
  })

  let totalTeamDamage = 0
  const logSteps: Array<{
    stepIndex: number
    actorSlotId: number
    actorName: string
    action: string
    targetResults: TargetResult[]
    totalStepDamage: number
  }> = []

  teamfightActions.value.forEach((actStep, idx) => {
    const actorSlot =
      blueDraft.value.find((b) => b.id === actStep.actorSlotId) || selectedAttackerSlots.value[0]
    if (!actorSlot || !actorSlot.champion) return

    const keystoneName = (actorSlot.primaryKeystone?.name || '').toLowerCase()
    const hasConqueror = keystoneName.includes('conqueror')
    const hasLethalTempo = keystoneName.includes('lethal tempo')
    const hasPtA = keystoneName.includes('press the attack')

    let currentConquerorStacks = attackerConquerorMap[actorSlot.id] || 0
    let currentLethalTempoStacks = attackerLethalTempoMap[actorSlot.id] || 0

    if (['Q', 'W', 'E', 'R', 'P', 'AA'].includes(actStep.action)) {
      const isMelee = (actorSlot.champion.stats.attackrange || 125) <= 225
      if (hasConqueror) {
        currentConquerorStacks = Math.min(12, currentConquerorStacks + (isMelee ? 2 : 1))
        attackerConquerorMap[actorSlot.id] = currentConquerorStacks
      }
      if (hasLethalTempo && actStep.action === 'AA') {
        currentLethalTempoStacks = Math.min(6, currentLethalTempoStacks + 1)
        attackerLethalTempoMap[actorSlot.id] = currentLethalTempoStacks
      }
    }

    // Get actor stats dynamically updated with current keystone stacks
    const baseStats = calculateStats({
      ...actorSlot,
      conquerorStacks: currentConquerorStacks,
      lethalTempoStacks: currentLethalTempoStacks,
    })
    if (!baseStats) return
    const isAttacker = blueDraft.value.some((b) => b.id === actorSlot.id)
    const mStats = calculateMonsterBuffStats(isAttacker ? attackerBuffs.value : defenderBuffs.value)

    const att = {
      ad: Math.round((baseStats.ad.total + mStats.bonusAD) * mStats.adMultiplier),
      baseAd: Math.round(baseStats.ad.base * mStats.adMultiplier),
      ap: Math.round((baseStats.ap.total + mStats.bonusAP) * mStats.apMultiplier),
      as: Math.round(baseStats.as.total * 100) / 100,
      mana: baseStats.mp.total,
      hp: baseStats.hp.total + mStats.bonusShield,
      armor: Math.round(baseStats.armor.total * mStats.armorMultiplier),
      mr: Math.round(baseStats.mr.total * mStats.mrMultiplier),
      crit: baseStats.crit.total,
      lethality: baseStats.lethality.total,
      armorPen: baseStats.armorPen.total,
      magicPenFlat: baseStats.magicPenFlat.total,
      magicPenPercent: baseStats.magicPenPercent.total,
      abilityHaste: Math.round(baseStats.abilityHaste.total + mStats.bonusAH),
      tenacity: Math.round(baseStats.tenacity.total + mStats.bonusTenacity),
      adaptiveType: getChampionDefaultAdaptiveType(actorSlot.champion.id, actorSlot.champion.tags),
    }

    const actorName = actorSlot.champion.name
    const action = actStep.action

    const itemPassives = detectItemPassives(actorSlot.items)
    const hasMuramana = itemPassives.hasMuramana
    const hasBlackCleaver = itemPassives.hasBlackCleaver
    const hasBloodletter = itemPassives.hasBloodletter
    const hasAbyssalMask = itemPassives.hasAbyssalMask
    const hasBlackfireTorch = itemPassives.hasBlackfireTorch
    const hasLudensEcho = itemPassives.hasLudens

    // Blackfire Torch dynamic AP scaling (+4% AP per enemy champion hit, max 5 = 20%)
    if (hasBlackfireTorch && ['Q', 'W', 'E', 'R', 'P'].includes(action)) {
      const targetCount = Math.min(5, Math.max(1, actStep.targetSlotIds.length))
      const extraApPct = targetCount * 0.04
      att.ap = Math.round(att.ap * (1 + extraApPct))
    }

    const isApAttacker =
      att.ap > att.ad ||
      getChampionDefaultAdaptiveType(actorSlot.champion.id, actorSlot.champion.tags) === 'AP'

    // Seraphine Stage Presence: Every 3rd basic ability cast is echoed
    let isEchoCast = false
    if (actorSlot.champion.id === 'Seraphine' && ['Q', 'W', 'E'].includes(action)) {
      const currentVal = castCounters[actorSlot.id] || 0
      castCounters[actorSlot.id] = currentVal + 1
      if ((currentVal + 1) % 3 === 0) {
        isEchoCast = true
      }
    }

    // Aatrox Q sequence (Q1 -> Q2 -> Q3)
    let aatroxQSeq = 1
    if (actorSlot.champion.id === 'Aatrox' && action === 'Q') {
      const prev = aatroxQSeqMap[actorSlot.id] || 0
      aatroxQSeq = (prev % 3) + 1
      aatroxQSeqMap[actorSlot.id] = aatroxQSeq
    }

    let stepTotalDmg = 0
    const targetResults: TargetResult[] = []

    const executeActionForTargets = (isEcho: boolean) => {
      actStep.targetSlotIds.forEach((targetId) => {
        const defState = defenderStateMap[targetId]
        if (!defState) return

        // Press the Attack Stacking
        const ptaKey = `${actorSlot.id}_${targetId}`
        if (!targetPtaMap[ptaKey]) {
          targetPtaMap[ptaKey] = { stacks: 0, exposed: false }
        }
        const ptaState = targetPtaMap[ptaKey]
        let ptaProcDmg = 0

        if (hasPtA && action === 'AA') {
          if (!ptaState.exposed) {
            ptaState.stacks++
            if (ptaState.stacks >= 3) {
              ptaState.exposed = true
              const lvl = actorSlot.level || 1
              ptaProcDmg = Math.round(40 + (lvl - 1) * (140 / 17))
            }
          }
        }

        // Stack shred items on hit
        if (['Q', 'W', 'E', 'R', 'P', 'AA'].includes(action)) {
          if (!isApAttacker && hasBlackCleaver && defState.blackCleaverStacks < 6)
            defState.blackCleaverStacks++
          if (isApAttacker && hasBloodletter && defState.vileDecayStacks < 4)
            defState.vileDecayStacks++
        }

        const actorRunes = [
          actorSlot.primaryKeystone,
          actorSlot.primaryRune1,
          actorSlot.primaryRune2,
          actorSlot.primaryRune3,
          actorSlot.secondaryRune1,
          actorSlot.secondaryRune2,
          ...(actorSlot.runes || []),
        ]
        const hasCoupDeGrace = actorRunes.some((r) => {
          const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
          return str.includes('coup') || str.includes('grace')
        })
        const hasLastStand = actorRunes.some((r) => {
          const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
          return str.includes('last stand') || str.includes('laststand')
        })
        const hasCutDown = actorRunes.some((r) => {
          const str = `${r?.name || ''} ${r?.key || ''}`.toLowerCase()
          return str.includes('cut down') || str.includes('cutdown')
        })

        const spellRes = calculateSpellDamage({
          champion: actorSlot.champion,
          action,
          spellRanks: actorSlot.spellRanks,
          attacker: {
            ad: att.ad,
            baseAd: att.baseAd,
            ap: att.ap,
            crit: att.crit,
            level: actorSlot.level,
            hp: att.hp,
            maxHp: att.hp,
            mana: att.mana,
            armorPen: att.armorPen,
            lethality: att.lethality,
            magicPenPercent: att.magicPenPercent,
            magicPenFlat: att.magicPenFlat,
            adaptiveType: att.adaptiveType,
          },
          defender: {
            currentHp: defState.currentHp,
            maxHp: defState.maxHp,
            armor: defState.baseArmor,
            mr: defState.baseMr,
            blackCleaverStacks: defState.blackCleaverStacks,
            vileDecayStacks: defState.vileDecayStacks,
          },
          options: {
            aatroxQSeq,
            hasAbyssalMask,
            hasCoupDeGrace,
            hasLastStand,
            hasCutDown,
          },
        })

        const rawDmg = spellRes.rawDmg
        const dmgType = spellRes.dmgType
        const hitMult = spellRes.hitMult
        const effArmor = spellRes.effArmor
        const effMr = spellRes.effMr

        // Lethal Tempo Max-Stack (6x) Bonus Adaptive On-Hit Damage
        let ltOnHitProcDmg = 0
        if (hasLethalTempo && action === 'AA' && currentLethalTempoStacks >= 6) {
          const lvl = actorSlot.level || 1
          const baseOnHit = 6 + (lvl - 1) * (24 / 17)
          const champBaseAs = actorSlot.champion?.stats?.attackspeed || 0.65
          const bonusAsPct = Math.max(0, ((att.as || 0.65) - champBaseAs) / champBaseAs) * 100
          const physMult = spellRes.physMult
          const magicMult = spellRes.magicMult
          const rawLtDmg = baseOnHit * (1 + bonusAsPct / 100)
          ltOnHitProcDmg = Math.round(rawLtDmg * (isApAttacker ? magicMult : physMult))
        }

        let finalDmg = Math.round(rawDmg * hitMult)

        // Apply PtA Exposed 8% damage bonus if exposed
        if (ptaState.exposed) {
          finalDmg = Math.round(finalDmg * 1.08)
        }

        finalDmg += ptaProcDmg + ltOnHitProcDmg

        defState.currentHp = Math.max(0, defState.currentHp - finalDmg)
        if (defState.currentHp === 0) defState.isKo = true

        stepTotalDmg += finalDmg
        totalTeamDamage += finalDmg

        let nameSuffix = ''
        if (ptaProcDmg > 0 && ltOnHitProcDmg > 0) nameSuffix = ' (PtA + LT Proc)'
        else if (ptaProcDmg > 0) nameSuffix = ' (PtA Proc)'
        else if (ltOnHitProcDmg > 0) nameSuffix = ' (LT Proc)'
        else if (isEcho) nameSuffix = ' (Echo)'

        targetResults.push({
          targetSlotId: targetId,
          targetName: `${defState.name}${nameSuffix}`,
          amount: finalDmg,
          type: dmgType,
          effectiveArmor: Math.round(effArmor),
          effectiveMr: Math.round(effMr),
          blackCleaverStacks: defState.blackCleaverStacks,
          vileDecayStacks: defState.vileDecayStacks,
          conquerorStacks: hasConqueror ? currentConquerorStacks : 0,
          lethalTempoStacks: hasLethalTempo ? currentLethalTempoStacks : 0,
          lethalTempoOnHitDmg: ltOnHitProcDmg,
          ptaStacks: hasPtA ? ptaState.stacks : 0,
          ptaExposed: ptaState.exposed,
          coupDeGrace: spellRes.isCoupDeGraceProc,
          cutDown: spellRes.isCutDownProc,
          lastStandBonusPct: spellRes.lastStandBonusPct,
          isKo: defState.isKo,
          remainingHp: defState.currentHp,
        })

        // Muramana Shock Passive
        if (hasMuramana && ['Q', 'W', 'E', 'R', 'AA'].includes(action) && !defState.isKo) {
          const maxMana = att.mana || 0
          let shockRawDmg = 0
          if (action === 'AA') {
            shockRawDmg = maxMana * 0.015
          } else {
            const isRanged = (actorSlot.champion?.stats?.attackrange ?? 125) > 300
            const manaPct = isRanged ? 0.027 : 0.035
            shockRawDmg = maxMana * manaPct + att.ad * 0.06
          }

          const shockFinalDmg = Math.round(shockRawDmg * spellRes.physMult)
          if (shockFinalDmg > 0) {
            defState.currentHp = Math.max(0, defState.currentHp - shockFinalDmg)
            if (defState.currentHp === 0) defState.isKo = true

            stepTotalDmg += shockFinalDmg
            totalTeamDamage += shockFinalDmg

            targetResults.push({
              targetSlotId: targetId,
              targetName: isEcho
                ? `${defState.name} (Echo + Muramana)`
                : `${defState.name} (Muramana)`,
              amount: shockFinalDmg,
              type: 'physical',
              effectiveArmor: Math.round(spellRes.effArmor),
              effectiveMr: Math.round(spellRes.effMr),
              blackCleaverStacks: defState.blackCleaverStacks,
              vileDecayStacks: defState.vileDecayStacks,
              conquerorStacks: hasConqueror ? currentConquerorStacks : 0,
              lethalTempoStacks: hasLethalTempo ? currentLethalTempoStacks : 0,
              ptaStacks: hasPtA ? ptaState.stacks : 0,
              ptaExposed: ptaState.exposed,
              isKo: defState.isKo,
              remainingHp: defState.currentHp,
            })
          }
        }

        // Blackfire Torch (Baleful Blaze Burn: 60 + 6% AP over 3s)
        if (hasBlackfireTorch && ['Q', 'W', 'E', 'R', 'P'].includes(action) && !defState.isKo) {
          const burnRawDmg = 60 + att.ap * 0.06
          const burnFinalDmg = Math.round(burnRawDmg * spellRes.magicMult)
          if (burnFinalDmg > 0) {
            defState.currentHp = Math.max(0, defState.currentHp - burnFinalDmg)
            if (defState.currentHp === 0) defState.isKo = true

            stepTotalDmg += burnFinalDmg
            totalTeamDamage += burnFinalDmg

            targetResults.push({
              targetSlotId: targetId,
              targetName: isEcho
                ? `${defState.name} (Echo + Blackfire Burn)`
                : `${defState.name} (Blackfire Burn)`,
              amount: burnFinalDmg,
              type: 'magic',
              effectiveArmor: Math.round(spellRes.effArmor),
              effectiveMr: Math.round(spellRes.effMr),
              blackCleaverStacks: defState.blackCleaverStacks,
              vileDecayStacks: defState.vileDecayStacks,
              conquerorStacks: hasConqueror ? currentConquerorStacks : 0,
              lethalTempoStacks: hasLethalTempo ? currentLethalTempoStacks : 0,
              ptaStacks: hasPtA ? ptaState.stacks : 0,
              ptaExposed: ptaState.exposed,
              isKo: defState.isKo,
              remainingHp: defState.currentHp,
            })
          }
        }

        // Luden's Echo Passive (Echo Shot)
        if (hasLudensEcho && ['Q', 'W', 'E', 'R', 'P'].includes(action) && !defState.isKo) {
          const isPrimaryTarget = targetId === actStep.targetSlotIds[0]
          const totalTargetsHit = Math.min(6, actStep.targetSlotIds.length)
          const secondaryTargetsHit = Math.max(0, totalTargetsHit - 1)

          let ludenRawDmg = 0
          if (isPrimaryTarget) {
            // Primary target: 75 (+5% AP) base + 15 (+1% AP) for each unused stack beyond 1st (max 150 + 10% AP if single target)
            const unusedStacks = 5 - secondaryTargetsHit
            ludenRawDmg = 75 + unusedStacks * 15 + att.ap * (0.05 + unusedStacks * 0.01)
          } else {
            // Secondary targets: 75 (+5% AP) each
            ludenRawDmg = 75 + att.ap * 0.05
          }

          const ludenFinalDmg = Math.round(ludenRawDmg * spellRes.magicMult)

          if (ludenFinalDmg > 0) {
            defState.currentHp = Math.max(0, defState.currentHp - ludenFinalDmg)
            if (defState.currentHp === 0) defState.isKo = true

            stepTotalDmg += ludenFinalDmg
            totalTeamDamage += ludenFinalDmg

            targetResults.push({
              targetSlotId: targetId,
              targetName: isEcho
                ? `${defState.name} (Echo + Luden Proc)`
                : `${defState.name} (Luden Proc)`,
              amount: ludenFinalDmg,
              type: 'magic',
              effectiveArmor: Math.round(spellRes.effArmor),
              effectiveMr: Math.round(spellRes.effMr),
              blackCleaverStacks: defState.blackCleaverStacks,
              vileDecayStacks: defState.vileDecayStacks,
              conquerorStacks: hasConqueror ? currentConquerorStacks : 0,
              lethalTempoStacks: hasLethalTempo ? currentLethalTempoStacks : 0,
              ptaStacks: hasPtA ? ptaState.stacks : 0,
              ptaExposed: ptaState.exposed,
              isKo: defState.isKo,
              remainingHp: defState.currentHp,
            })
          }
        }
      })
    }

    // First cast (Normal)
    executeActionForTargets(false)

    // Second cast (Echo)
    if (isEchoCast) {
      executeActionForTargets(true)
    }

    let stepActionName: string = action
    if (actorSlot.champion.id === 'Aatrox' && action === 'Q') {
      stepActionName = `Q${aatroxQSeq} (Sweetspot)`
    } else if (isEchoCast) {
      stepActionName = `${action} + 🎶 Echo`
    }

    logSteps.push({
      stepIndex: idx + 1,
      actorSlotId: actStep.actorSlotId,
      actorName,
      action: stepActionName,
      targetResults,
      totalStepDamage: stepTotalDmg,
    })
  })

  return {
    defenderStateMap,
    logSteps,
    totalTeamDamage,
  }
})

const getDefenderEndState = (slotId: number) => {
  const def = teamfightSimulationResults.value.defenderStateMap[slotId]
  if (!def) {
    return {
      currentHp: 1000,
      maxHp: 1000,
      hpPct: 100,
      effectiveArmor: 50,
      effectiveMr: 40,
      blackCleaverStacks: 0,
      vileDecayStacks: 0,
      isKo: false,
    }
  }
  const hpPct = Math.max(0, Math.round((def.currentHp / def.maxHp) * 100))
  return {
    currentHp: def.currentHp,
    maxHp: def.maxHp,
    hpPct,
    effectiveArmor: Math.round(def.baseArmor * (1 - def.blackCleaverStacks * 0.05)),
    effectiveMr: Math.round(def.baseMr * (1 - def.vileDecayStacks * 0.075)),
    blackCleaverStacks: def.blackCleaverStacks,
    vileDecayStacks: def.vileDecayStacks,
    isKo: def.isKo,
  }
}
</script>
