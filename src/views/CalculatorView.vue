<template>
  <div
    class="flex-1 flex flex-col gap-6 p-4 sm:p-6 w-full max-w-none bg-[#0b0f17] text-slate-200 font-sans min-h-screen text-base"
  >
    <!-- TOP SLIM BAR: TITLE & PRESETS -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 bg-[#131926] border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-base"
    >
      <div class="flex items-center gap-3">
        <span class="text-2xl">⚔️</span>
        <div>
          <h1 class="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
            Damage Calculator & DPS Simulator
          </h1>
          <p class="text-base text-slate-400">
            Real-time combat exchange between Blue and Red squads with continuous spell cooldowns,
            Attack Speed pacing, and DoTs
          </p>
        </div>
      </div>

      <!-- Presets for fast setup -->
      <div class="flex items-center gap-2.5 flex-wrap text-base">
        <span class="text-base uppercase font-bold text-slate-400 mr-1">Presets:</span>
        <button
          v-for="p in presetOptions"
          :key="p.id"
          @click="setPresetScenario(p.id)"
          class="px-3.5 py-2 rounded-xl text-base font-bold transition-all border cursor-pointer"
          :class="
            isPresetActive(p.id)
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
          "
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- MAIN 3-COLUMN VERTICAL ARENA -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start text-base">
      <!-- ================================================================= -->
      <!-- LEFT COLUMN: BLUE SQUAD (Attackers / Allies)                      -->
      <!-- ================================================================= -->
      <div class="lg:col-span-3 flex flex-col gap-5 order-2 lg:order-1 text-base">
        <!-- Blue Squad Header & Roster Picker -->
        <div
          class="bg-[#131926] border border-cyan-900/40 rounded-2xl p-5 flex flex-col gap-3.5 shadow-xl"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="h-4 w-4 rounded-full bg-cyan-400 animate-pulse"></span>
              <span class="text-lg font-mono font-bold uppercase tracking-wider text-cyan-400">
                Blue Squad
              </span>
            </div>
            <span
              class="text-base font-mono text-cyan-300 font-bold bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800/60"
            >
              {{ selectedAttackerSlots.length }} Active
            </span>
          </div>

          <!-- Roster Slot Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="s in blueDraft"
              :key="s.id"
              @click="toggleAttackerSlot(s.id)"
              class="flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-base cursor-pointer transition-all"
              :class="
                selectedAttackerSlotIds.includes(s.id)
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              "
              :title="s.champion ? s.champion.name : s.role"
            >
              <img
                v-if="s.champion"
                :src="getChampionIconUrl(s.champion)"
                class="w-6 h-6 rounded-md object-cover"
              />
              <span>{{ s.role }}</span>
              <span v-if="s.champion" class="text-white font-semibold truncate max-w-[100px]">
                {{ s.champion.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- Blue Participating Champions Cards (Stacked Vertically) -->
        <div
          v-for="slot in selectedAttackerSlots"
          :key="slot.id"
          class="bg-[#131926] border border-slate-800 hover:border-cyan-800/60 rounded-2xl p-5 flex flex-col gap-4 shadow-lg transition-all text-base"
        >
          <!-- Champion Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="slot.champion"
                :src="getChampionIconUrl(slot.champion)"
                class="h-14 w-14 rounded-xl border border-cyan-500/50 object-cover shadow"
              />
              <div
                v-else
                class="h-14 w-14 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600 font-mono text-base"
              >
                Empty
              </div>
              <div>
                <h4 class="text-lg font-bold text-white leading-tight">
                  {{ slot.champion?.name || 'Unassigned' }}
                </h4>
                <span class="text-base font-mono text-cyan-400 font-semibold">
                  BLUE {{ slot.role }} • Lvl {{ slot.level }}
                </span>
              </div>
            </div>
            <button
              @click="openWorkbenchForSlot(slot.id)"
              class="text-base text-cyan-400 hover:text-white font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 transition-all cursor-pointer font-semibold"
              title="Edit build in Workbench"
            >
              ⚙️ Build
            </button>
          </div>

          <!-- Live HP Bar & Status -->
          <div
            class="flex flex-col gap-1.5 font-mono text-base bg-slate-950 p-3 rounded-xl border border-slate-800"
          >
            <div class="flex items-center justify-between font-bold">
              <span class="text-slate-400">Health</span>
              <span
                :class="
                  getChampionEndState(slot.id).isKo
                    ? 'text-rose-500 font-extrabold'
                    : getChampionEndState(slot.id).currentShield > 0
                      ? 'text-white font-extrabold'
                      : 'text-emerald-400'
                "
              >
                {{ getChampionEndState(slot.id).currentHp }}
                <span
                  v-if="getChampionEndState(slot.id).currentShield > 0"
                  class="text-white font-bold"
                >
                  (+{{ getChampionEndState(slot.id).currentShield }})
                </span>
                / {{ getChampionEndState(slot.id).maxHp }}
                <span
                  class="font-black"
                  :class="
                    getChampionEndState(slot.id).hpPct > 100
                      ? 'text-white font-extrabold'
                      : getChampionEndState(slot.id).currentShield > 0
                        ? 'text-slate-200'
                        : ''
                  "
                >
                  ({{ getChampionEndState(slot.id).hpPct }}%)
                </span>
              </span>
            </div>
            <div
              class="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative flex"
            >
              <!-- Base Health Bar (Green / Yellow / Red) -->
              <div
                class="h-full transition-all duration-300"
                :class="
                  getChampionEndState(slot.id).currentHp / getChampionEndState(slot.id).maxHp > 0.5
                    ? 'bg-linear-to-r from-emerald-500 to-green-400'
                    : getChampionEndState(slot.id).currentHp / getChampionEndState(slot.id).maxHp >
                        0.2
                      ? 'bg-linear-to-r from-amber-500 to-yellow-400'
                      : 'bg-linear-to-r from-rose-600 to-red-500'
                "
                :style="{
                  width:
                    Math.min(
                      100,
                      Math.round(
                        (getChampionEndState(slot.id).currentHp /
                          Math.max(
                            getChampionEndState(slot.id).maxHp,
                            getChampionEndState(slot.id).currentHp +
                              getChampionEndState(slot.id).currentShield,
                          )) *
                          100,
                      ),
                    ) + '%',
                }"
              ></div>
              <!-- Shield Bar (Silver / White / Platinum - NOT GREEN!) -->
              <div
                v-if="getChampionEndState(slot.id).currentShield > 0"
                class="h-full bg-linear-to-r from-slate-200 via-white to-slate-300 border-l border-white shadow-md transition-all duration-300"
                :title="getChampionEndState(slot.id).currentShield + ' Shield'"
                :style="{
                  width:
                    Math.min(
                      100,
                      Math.round(
                        (getChampionEndState(slot.id).currentShield /
                          Math.max(
                            getChampionEndState(slot.id).maxHp,
                            getChampionEndState(slot.id).currentHp +
                              getChampionEndState(slot.id).currentShield,
                          )) *
                          100,
                      ),
                    ) + '%',
                }"
              ></div>
            </div>
          </div>

          <!-- DPS & Total Damage Card -->
          <div
            class="flex flex-col gap-2 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-base"
          >
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-base uppercase">Damage Dealt</span>
              <span class="text-amber-400 font-extrabold text-lg">
                🔥 {{ getChampionEndState(slot.id).dps }} DPS
              </span>
            </div>
            <div class="flex items-center justify-between text-base">
              <span class="text-white font-bold">
                {{ getChampionEndState(slot.id).totalDamageDealt.toLocaleString() }} Total
              </span>
              <span class="text-slate-400">
                Taken: {{ getChampionEndState(slot.id).damageTaken.toLocaleString() }}
              </span>
            </div>

            <!-- Damage Breakdown Badges -->
            <div class="flex items-center gap-1.5 flex-wrap text-base font-bold font-mono pt-1">
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.physical > 0"
                class="bg-orange-950/80 text-orange-400 border border-orange-800/60 shadow-sm shadow-orange-950/50 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                {{ getChampionEndState(slot.id).damageDealtByType.physical }} Phys
              </span>
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.magic > 0"
                class="bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm shadow-cyan-950/50 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                {{ getChampionEndState(slot.id).damageDealtByType.magic }} Mag
              </span>
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.true > 0"
                class="bg-slate-950/90 text-slate-100 border border-slate-600/70 shadow-sm shadow-slate-500/20 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                {{ getChampionEndState(slot.id).damageDealtByType.true }} True
              </span>
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.dot > 0"
                class="bg-purple-950/80 text-purple-300 border border-purple-800/60 shadow-sm shadow-purple-950/50 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                🔥 {{ getChampionEndState(slot.id).damageDealtByType.dot }} DoT
              </span>
            </div>
          </div>

          <!-- Active DoTs on this champion -->
          <div
            v-if="getChampionEndState(slot.id).activeDoTs.length > 0"
            class="flex items-center gap-2 flex-wrap font-mono text-base"
          >
            <span
              v-for="dot in getChampionEndState(slot.id).activeDoTs"
              :key="dot.id"
              class="bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-sm shadow-rose-950/50 px-2.5 py-0.5 rounded-lg font-mono font-bold inline-flex items-center gap-1.5 animate-pulse"
            >
              <img
                v-if="getDoTIconUrl(dot)"
                :src="getDoTIconUrl(dot)!"
                :alt="dot.name"
                class="w-4 h-4 rounded object-cover shrink-0 border border-rose-500/40"
              />
              <span v-else>🩸</span>
              <span>{{ dot.name }} ({{ dot.remainingDuration.toFixed(1) }}s)</span>
            </span>
          </div>

          <!-- Stats Grid -->
          <div
            v-if="getCalculatedStatsForSlot(slot)"
            class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-base font-mono bg-slate-950 p-3 rounded-xl border border-slate-800"
          >
            <div>
              <span class="text-slate-400 block text-base font-semibold">AD</span>
              <span class="text-orange-400 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.ad }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">AP</span>
              <span class="text-cyan-400 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.ap }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">AS</span>
              <span class="text-emerald-400 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.as }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">Armor</span>
              <span class="text-amber-400 font-bold text-lg">
                {{ getChampionEndState(slot.id).effectiveArmor }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">MR</span>
              <span class="text-purple-400 font-bold text-lg">
                {{ getChampionEndState(slot.id).effectiveMr }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">Crit</span>
              <span class="text-amber-300 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.crit }}%
              </span>
            </div>
          </div>

          <!-- Items Row -->
          <div class="flex items-center gap-2 flex-wrap">
            <div
              v-for="(item, idx) in slot.items"
              :key="idx"
              class="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden"
            >
              <img v-if="item" :src="getItemIconUrl(item)" class="h-full w-full object-cover" />
              <span v-else class="text-base text-slate-700">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- CENTER COLUMN: ALL COMMON ELEMENTS BETWEEN BLUE & RED             -->
      <!-- ================================================================= -->
      <div class="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2 text-base">
        <!-- 1. MATCHUP & SIMULATION CONTROLS (COMMON IN CENTER) -->
        <div
          class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 font-mono text-base"
        >
          <!-- Header: Blue vs Red Scores -->
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- Blue Summary -->
            <div class="flex items-center gap-3">
              <div class="h-4 w-4 rounded-full bg-cyan-400 animate-pulse"></div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-cyan-400 font-bold text-lg uppercase">Blue Squad</span>
                  <span
                    class="text-base bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-800/60 font-bold"
                  >
                    {{ selectedAttackerSlots.length }} Champs
                  </span>
                </div>
                <div class="text-base mt-1">
                  <span class="text-slate-300 font-bold"
                    >Dmg:
                    <strong class="text-cyan-300 text-lg">{{
                      combatResults.blueTeamTotalDamage.toLocaleString()
                    }}</strong></span
                  >
                  <span class="mx-2 text-slate-600">•</span>
                  <span class="text-slate-300 font-bold"
                    >DPS:
                    <strong class="text-amber-400 text-lg"
                      >🔥 {{ combatResults.blueTeamDps.toFixed(1) }}</strong
                    ></span
                  >
                </div>
              </div>
            </div>

            <!-- VS Badge & Dynamic Outcome -->
            <div class="flex flex-col items-center justify-center">
              <span class="text-base text-slate-400 uppercase tracking-widest font-extrabold"
                >VS</span
              >
              <div
                v-if="combatResults.timeToKill !== null && combatResults.timeToKill !== undefined"
                class="flex items-center gap-1.5 text-base font-extrabold text-rose-300 bg-rose-950/90 px-3 py-1 rounded-xl border border-rose-800 shadow-lg shadow-rose-950/40 mt-1"
              >
                <span>💀 TTK:</span>
                <span class="text-white text-lg font-black"
                  >{{ combatResults.timeToKill.toFixed(1) }}s</span
                >
                <span
                  class="text-xs uppercase bg-rose-600 text-white font-black px-1.5 py-0.5 rounded"
                  >K.O.</span
                >
              </div>
              <div
                v-else-if="combatResults.terminationReason === 'combo_complete'"
                class="flex items-center gap-1.5 text-base font-extrabold text-cyan-300 bg-cyan-950/90 px-3 py-1 rounded-xl border border-cyan-800 shadow mt-1"
              >
                <span>⏱️ Combo:</span>
                <span class="text-white text-lg font-black"
                  >{{ combatResults.duration.toFixed(1) }}s</span
                >
              </div>
              <div
                v-else
                class="flex items-center gap-1.5 text-base font-extrabold text-amber-300 bg-amber-950/90 px-3 py-1 rounded-xl border border-amber-800 shadow mt-1"
              >
                <span>⏱️ Combat:</span>
                <span class="text-white text-lg font-black"
                  >{{ combatResults.duration.toFixed(1) }}s</span
                >
              </div>
            </div>

            <!-- Red Summary -->
            <div class="flex items-center gap-3 text-right">
              <div>
                <div class="flex items-center justify-end gap-2">
                  <span
                    class="text-base bg-rose-950 text-rose-300 px-2 py-0.5 rounded-md border border-rose-800/60 font-bold"
                  >
                    {{ selectedDefenderSlots.length }} Champs
                  </span>
                  <span class="text-rose-400 font-bold text-lg uppercase">Red Squad</span>
                </div>
                <div class="text-base mt-1">
                  <span class="text-slate-300 font-bold"
                    >DPS:
                    <strong class="text-amber-400 text-lg"
                      >🔥 {{ combatResults.redTeamDps.toFixed(1) }}</strong
                    ></span
                  >
                  <span class="mx-2 text-slate-600">•</span>
                  <span class="text-slate-300 font-bold"
                    >Dmg:
                    <strong class="text-rose-300 text-lg">{{
                      combatResults.redTeamTotalDamage.toLocaleString()
                    }}</strong></span
                  >
                </div>
              </div>
              <div class="h-4 w-4 rounded-full bg-rose-400 animate-pulse"></div>
            </div>
          </div>

          <!-- Damage Share Progress Bar -->
          <div
            class="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800"
          >
            <div
              class="h-full bg-cyan-500 transition-all duration-300"
              :style="{ width: blueDamageSharePct + '%' }"
            ></div>
            <div
              class="h-full bg-rose-500 transition-all duration-300"
              :style="{ width: 100 - blueDamageSharePct + '%' }"
            ></div>
          </div>
        </div>

        <!-- 2. ACTION & COMBO CREATOR (COOLDOWN-AWARE SCHEDULER) -->
        <div
          class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 font-mono text-base"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-lg font-bold text-amber-400 uppercase tracking-wider">
                ⚡ Action & Combo Scheduler
              </span>
            </div>

            <!-- Clear Actions Button -->
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-if="teamfightActions.length > 0"
                @click="clearActionsAndResetTime"
                class="px-3 py-1.5 bg-rose-950/40 text-rose-300 hover:bg-rose-900 border border-rose-900/60 rounded-xl text-base font-bold transition-all cursor-pointer"
              >
                🗑️ Clear ({{ teamfightActions.length }})
              </button>
            </div>
          </div>

          <!-- 1. 3-COLUMN ARENA: BLUE TEAM (LEFT) | ABILITIES VERTICAL (CENTER) | RED TEAM (RIGHT) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <!-- LEFT: BLUE TEAM -->
            <div class="flex flex-col gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-cyan-400"></span>
                  <span class="text-base font-extrabold text-cyan-400 uppercase tracking-wide">
                    Blue Team
                  </span>
                </div>
                <span class="text-base text-slate-400 font-bold">
                  {{ selectedAttackerSlots.length }} Active
                </span>
              </div>

              <!-- Blue Champions List -->
              <div class="flex flex-col gap-2">
                <button
                  v-for="s in selectedAttackerSlots"
                  :key="s.id"
                  @click="actionCreatorActorId = s.id"
                  class="flex items-center p-3 rounded-xl text-base font-bold border cursor-pointer transition-all text-left min-w-0"
                  :class="
                    actionCreatorActorId === s.id
                      ? 'bg-cyan-950/90 text-white border-cyan-400 shadow-lg shadow-cyan-950/50 ring-2 ring-cyan-400/80'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-cyan-700 hover:text-white'
                  "
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      v-if="s.champion"
                      :src="getChampionIconUrl(s.champion)"
                      class="w-11 h-11 rounded-lg object-cover border-2 shrink-0"
                      :class="
                        actionCreatorActorId === s.id ? 'border-cyan-400' : 'border-slate-800'
                      "
                    />
                    <div class="min-w-0 flex-1">
                      <div class="text-base font-extrabold text-white truncate">
                        {{ s.champion ? s.champion.name : s.role }}
                      </div>
                      <div class="text-base text-cyan-400 font-semibold truncate">
                        {{ s.role }} • Lvl {{ s.level }}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- CENTER: ABILITY / ACTION (VERTICAL ORDER FROM PASSIVE TO R, THEN AA) -->
            <div class="flex flex-col gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span class="text-base font-extrabold text-amber-400 uppercase tracking-wide">
                  ⚡ Ability / Action
                </span>
                <span v-if="selectedActorStats" class="text-base text-purple-400 font-bold">
                  {{ selectedActorStats.abilityHaste }} AH
                </span>
              </div>

              <!-- Innate Passive Card (Always active / innate, not manually castable) -->
              <div
                v-if="selectedActorSlot?.champion?.passive"
                class="flex items-center gap-2.5 p-2 px-3 rounded-xl bg-slate-900/90 border border-slate-800 text-base"
                :title="
                  selectedActorSlot.champion.passive.description ||
                  selectedActorSlot.champion.passive.name
                "
              >
                <span
                  class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 bg-purple-950 text-purple-300 border border-purple-800/60"
                >
                  P
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-1">
                    <span class="text-base font-extrabold text-white truncate">
                      {{ selectedActorSlot.champion.passive.name }}
                    </span>
                    <span class="text-xs font-bold text-purple-400 font-mono shrink-0">
                      Innate
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 truncate">
                    Triggers automatically on spells & attacks
                  </p>
                </div>
              </div>

              <!-- Vertical Abilities: Q ➔ W ➔ E ➔ R ➔ AA -->
              <div class="flex flex-col gap-2 flex-1">
                <button
                  v-for="act in ['Q', 'W', 'E', 'R', 'AA'] as const"
                  :key="act"
                  @click="selectSpellAction(act)"
                  :title="getAbilityFullTooltip(act)"
                  class="flex items-center justify-between p-2.5 px-3 rounded-xl text-base font-bold transition-all border cursor-pointer min-w-0 flex-1 min-h-[46px]"
                  :class="
                    actionCreatorSpell === act
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 font-black'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  "
                >
                  <div class="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <span
                      class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-base shrink-0"
                      :class="
                        actionCreatorSpell === act
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-800 text-slate-300'
                      "
                    >
                      {{ act }}
                    </span>
                    <span class="text-base font-extrabold truncate">
                      {{ getShortAbilityName(act) }}
                    </span>
                  </div>

                  <span
                    class="text-base font-bold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap"
                    :class="
                      actionCreatorSpell === act
                        ? 'bg-amber-600/30 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    "
                  >
                    {{ getSpellBadgeInfo(act) }}
                  </span>
                </button>
              </div>
            </div>

            <!-- RIGHT: RED TEAM -->
            <div class="flex flex-col gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span class="text-base font-extrabold text-rose-400 uppercase tracking-wide">
                    Red Team
                  </span>
                </div>
                <span class="text-base text-slate-400 font-bold">
                  {{ selectedDefenderSlots.length }} Active
                </span>
              </div>

              <!-- Red Champions List -->
              <div class="flex flex-col gap-2">
                <button
                  v-for="s in selectedDefenderSlots"
                  :key="s.id"
                  @click="actionCreatorActorId = s.id"
                  class="flex items-center p-3 rounded-xl text-base font-bold border cursor-pointer transition-all text-left min-w-0"
                  :class="
                    actionCreatorActorId === s.id
                      ? 'bg-rose-950/90 text-white border-rose-400 shadow-lg shadow-rose-950/50 ring-2 ring-rose-400/80'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-rose-700 hover:text-white'
                  "
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      v-if="s.champion"
                      :src="getChampionIconUrl(s.champion)"
                      class="w-11 h-11 rounded-lg object-cover border-2 shrink-0"
                      :class="
                        actionCreatorActorId === s.id ? 'border-rose-400' : 'border-slate-800'
                      "
                    />
                    <div class="min-w-0 flex-1">
                      <div class="text-base font-extrabold text-white truncate">
                        {{ s.champion ? s.champion.name : s.role }}
                      </div>
                      <div class="text-base text-rose-400 font-semibold truncate">
                        {{ s.role }} • Lvl {{ s.level }}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- 2. OPPOSING TARGET(S) SELECTION ROW -->
          <div class="flex flex-col gap-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div class="flex items-center justify-between">
              <label class="text-base font-bold text-slate-400 uppercase tracking-wide">
                🎯 Opposing Target(s) ({{ availableTargets.length }} Available):
              </label>
              <button
                @click="toggleSelectAllTargets"
                class="text-base text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer font-bold"
              >
                {{ isAllTargetsSelected ? 'Deselect All' : 'Select All (AOE)' }}
              </button>
            </div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <label
                v-for="s in availableTargets"
                :key="s.id"
                class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-base font-bold border cursor-pointer transition-all"
                :class="
                  actionCreatorTargetIds.includes(s.id)
                    ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold shadow-md shadow-amber-950/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
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
                  class="w-6 h-6 rounded-md object-cover"
                />
                <span>{{ s.champion ? s.champion.name : s.role }}</span>
              </label>
            </div>
          </div>

          <!-- Cooldown Warning / Status & Smart Snap -->
          <div
            v-if="isSelectedSpellOnCooldown"
            class="flex items-center justify-between gap-3 p-3 bg-rose-950/30 border border-rose-900/60 rounded-xl text-base text-rose-300 font-mono"
          >
            <div class="flex items-center gap-2">
              <span>⚠️</span>
              <span>
                <strong
                  >{{ actionCreatorSpell }} is on Cooldown at
                  {{ actionCreatorTime.toFixed(1) }}s!</strong
                >
                Ready at {{ nextReadyTimeForSelectedSpell.toFixed(1) }}s
              </span>
            </div>
            <button
              @click="snapToReadyTime"
              class="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-lg hover:bg-amber-400 transition-all cursor-pointer text-base"
            >
              ⏱️ Snap to {{ nextReadyTimeForSelectedSpell.toFixed(1) }}s
            </button>
          </div>

          <!-- Step 4: Timestamp & Submit -->
          <div
            class="flex items-center justify-between gap-4 pt-2 border-t border-slate-800/80 flex-wrap text-base"
          >
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="text-base font-bold text-slate-400 uppercase">Timestamp:</span>
              <input
                type="number"
                min="0"
                max="30"
                step="0.1"
                v-model.number="actionCreatorTime"
                class="h-11 w-24 bg-slate-950 text-white font-bold text-center rounded-xl border border-slate-800 text-base"
              />
              <button
                @click="actionCreatorTime = Math.round((actionCreatorTime + 0.5) * 10) / 10"
                class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-base text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
              >
                +0.5s
              </button>
              <button
                v-if="lastCombatEventTime > 0"
                @click="snapToLastEventTime"
                :title="
                  lastCombatEventAction
                    ? `Set to last damage/event (${lastCombatEventAction} at ${lastCombatEventTime.toFixed(1)}s)`
                    : `Set to last event (${lastCombatEventTime.toFixed(1)}s)`
                "
                class="px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-base text-cyan-300 hover:text-cyan-200 hover:bg-cyan-900/60 font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>⏱️ Last Damage ({{ lastCombatEventTime.toFixed(1) }}s)</span>
              </button>
            </div>

            <button
              @click="submitTeamfightAction"
              class="px-6 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl text-base transition-all shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-2"
            >
              <span>➕ Add Action to Sequence</span>
            </button>
          </div>
        </div>

        <!-- 3. TABS SELECTOR FOR CENTER BODY: ACTIONS SEQUENCE VS LOG -->
        <div
          class="flex items-center justify-between border-b border-slate-800 pb-2 font-mono text-base"
        >
          <div class="flex items-center gap-2.5 flex-wrap">
            <button
              @click="centerViewTab = 'all'"
              class="px-4 py-2 rounded-xl text-base font-bold border transition-all cursor-pointer"
              :class="
                centerViewTab === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              "
            >
              👁️ Full View (Actions + Log)
            </button>
            <button
              @click="centerViewTab = 'actions'"
              class="px-4 py-2 rounded-xl text-base font-bold border transition-all cursor-pointer"
              :class="
                centerViewTab === 'actions'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              "
            >
              ⚡ Action Sequence ({{ teamfightActions.length }})
            </button>
            <button
              @click="centerViewTab = 'log'"
              class="px-4 py-2 rounded-xl text-base font-bold border transition-all cursor-pointer"
              :class="
                centerViewTab === 'log'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              "
            >
              📜 Combat Log ({{ filteredEvents.length }})
            </button>
          </div>
        </div>

        <!-- 4. VERTICAL ACTIONS SEQUENCE (CHAMPION ACTIONS IN VERTICAL SEQUENCE) -->
        <div
          v-if="centerViewTab === 'all' || centerViewTab === 'actions'"
          class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 font-mono text-base"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="text-base font-bold text-amber-400 uppercase tracking-wider">
                ⚡ Champion Action Sequence
              </span>
              <span
                class="text-base text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800"
              >
                {{ teamfightActions.length }} Scheduled
              </span>
            </div>

            <span class="text-base text-slate-500 hidden sm:inline">
              Executed in chronological order during combat
            </span>
          </div>

          <!-- Vertical List of Actions -->
          <div v-if="teamfightActions.length > 0" class="flex flex-col gap-3">
            <div
              v-for="(act, aIdx) in teamfightActions"
              :key="act.id"
              class="p-4 rounded-xl border bg-slate-950 border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 flex-wrap"
            >
              <!-- Left: Step number & Time -->
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-base font-extrabold text-slate-400"
                >
                  #{{ aIdx + 1 }}
                </div>
                <span
                  class="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 font-extrabold text-base border border-slate-800"
                >
                  ⏱️ {{ (act.timestamp ?? 0).toFixed(1) }}s
                </span>
              </div>

              <!-- Center: Champion ➔ Spell ➔ Targets -->
              <div class="flex items-center gap-2.5 flex-wrap">
                <!-- Champion -->
                <div
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-base font-bold"
                  :class="
                    act.actorSlotId <= 5
                      ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800/70'
                      : 'bg-rose-950/70 text-rose-300 border-rose-800/70'
                  "
                >
                  <img
                    v-if="getSlotById(act.actorSlotId)?.champion"
                    :src="getChampionIconUrl(getSlotById(act.actorSlotId)!.champion!)"
                    class="w-5 h-5 rounded-md object-cover"
                  />
                  <span>
                    {{ act.actorSlotId <= 5 ? '🟦' : '🟥' }}
                    {{ getSlotById(act.actorSlotId)?.champion?.name || 'Champion' }}
                  </span>
                </div>

                <!-- Spell Badge -->
                <div
                  class="px-3 py-1 rounded-lg font-extrabold text-base border"
                  :class="
                    act.action === 'AA'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                      : act.action === 'P'
                        ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  "
                >
                  {{
                    act.action === 'AA'
                      ? 'Basic Attack (AA)'
                      : act.action === 'P'
                        ? 'Passive'
                        : 'Ability ' + act.action
                  }}
                </div>

                <span class="text-slate-500 text-base font-bold">➔</span>

                <!-- Targets -->
                <div class="flex items-center gap-1.5 flex-wrap">
                  <div
                    v-for="targetSlot in getTargetSlots(act.targetSlotIds)"
                    :key="targetSlot.id"
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-base"
                    :class="
                      targetSlot.id <= 5
                        ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40'
                        : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                    "
                  >
                    <img
                      v-if="targetSlot.champion"
                      :src="getChampionIconUrl(targetSlot.champion)"
                      class="w-4 h-4 rounded-md object-cover"
                    />
                    <span>{{ targetSlot.champion?.name || targetSlot.role }}</span>
                  </div>
                  <span
                    v-if="act.targetSlotIds.length > 1"
                    class="text-base font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-800/40"
                  >
                    AOE ({{ act.targetSlotIds.length }})
                  </span>
                </div>
              </div>

              <!-- Right: Reorder & Delete -->
              <div class="flex items-center gap-1.5">
                <button
                  @click="moveActionUp(aIdx)"
                  :disabled="aIdx === 0"
                  class="p-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-base font-bold"
                  title="Move earlier (up)"
                >
                  ▲
                </button>
                <button
                  @click="moveActionDown(aIdx)"
                  :disabled="aIdx === teamfightActions.length - 1"
                  class="p-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-base font-bold"
                  title="Move later (down)"
                >
                  ▼
                </button>
                <button
                  @click="removeTeamfightAction(aIdx)"
                  class="p-1.5 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-900/60 text-rose-300 hover:text-white cursor-pointer text-base font-bold ml-1"
                  title="Remove action"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Actions Placeholder -->
          <div
            v-else
            class="py-10 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-base text-center p-6 gap-2"
          >
            <span class="text-lg font-bold text-slate-300">⚡ No actions scheduled.</span>
            <span class="text-slate-400 max-w-lg text-base">
              Select a champion and ability above, then click
              <strong>Add Action to Sequence</strong> to start simulating combat!
            </span>
          </div>
        </div>

        <!-- 5. COMBAT EXCHANGE & DAMAGE LOG (DAMAGE & EVENT LOG IN CENTER) -->
        <div
          v-if="centerViewTab === 'all' || centerViewTab === 'log'"
          class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 font-mono text-base"
        >
          <div
            class="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-base font-bold text-amber-400 uppercase tracking-wider">
                📜 Combat Damage & Event Log
              </span>
              <span
                class="text-base text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800"
              >
                {{ filteredEvents.length }} Events
              </span>
            </div>

            <!-- Event Filters -->
            <div class="flex items-center gap-2 text-base font-mono flex-wrap">
              <button
                @click="eventFilter = 'all'"
                class="px-3 py-1 rounded-lg border cursor-pointer font-bold transition-all text-base shadow-sm"
                :class="
                  eventFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-amber-950/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                "
              >
                All ({{ combatResults.events.length }})
              </button>
              <button
                @click="eventFilter = 'blue'"
                class="px-3 py-1 rounded-lg border cursor-pointer font-bold transition-all text-base shadow-sm"
                :class="
                  eventFilter === 'blue'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-cyan-950/40'
                    : 'bg-slate-950 text-cyan-400/80 border-slate-800 hover:text-cyan-300 hover:border-cyan-800'
                "
              >
                🟦 Blue
              </button>
              <button
                @click="eventFilter = 'red'"
                class="px-3 py-1 rounded-lg border cursor-pointer font-bold transition-all text-base shadow-sm"
                :class="
                  eventFilter === 'red'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-rose-950/40'
                    : 'bg-slate-950 text-rose-400/80 border-slate-800 hover:text-rose-300 hover:border-rose-800'
                "
              >
                🟥 Red
              </button>
              <button
                @click="eventFilter = 'dot'"
                class="px-3 py-1 rounded-lg border cursor-pointer font-bold transition-all text-base shadow-sm"
                :class="
                  eventFilter === 'dot'
                    ? 'bg-purple-950/80 text-purple-300 border-purple-500 shadow-purple-950/40'
                    : 'bg-slate-950 text-purple-300/80 border-slate-800 hover:text-purple-300 hover:border-purple-800'
                "
              >
                🔥 DoTs
              </button>
            </div>
          </div>

          <!-- Chronological Combat Events Feed (Vertical Scrollable) -->
          <div
            v-if="filteredEvents.length > 0"
            class="flex flex-col gap-2.5 font-mono text-base max-h-[550px] overflow-y-auto pr-1"
          >
            <div
              v-for="(evt, idx) in filteredEvents"
              :key="idx"
              class="p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all flex-wrap"
              :class="
                evt.isDot
                  ? 'bg-purple-950/20 border-purple-900/40 hover:border-purple-800/60'
                  : evt.actorSide === 'blue'
                    ? 'bg-cyan-950/20 border-cyan-900/40 hover:border-cyan-800/60'
                    : 'bg-rose-950/20 border-rose-900/40 hover:border-rose-800/60'
              "
            >
              <!-- Left: Timestamp, Actor, Action, Target -->
              <div class="flex items-center gap-2.5 flex-wrap">
                <button
                  @click="actionCreatorTime = Math.round(evt.timestamp * 10) / 10"
                  title="Click to set this timestamp in the Action Creator"
                  class="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold text-base border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all"
                >
                  {{ evt.timestamp.toFixed(1) }}s
                </button>
                <span
                  class="font-bold text-base"
                  :class="evt.actorSide === 'blue' ? 'text-cyan-400' : 'text-rose-400'"
                >
                  {{ evt.actorName }}
                </span>
                <span
                  class="px-2.5 py-0.5 rounded-lg text-base font-bold font-mono border shadow-sm"
                  :class="
                    evt.isDot
                      ? 'bg-purple-950/80 text-purple-300 border-purple-700/60 shadow-purple-950/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/30'
                  "
                >
                  {{ evt.action }}
                </span>
                <span
                  v-if="evt.badges?.includes('🎶 Echo') && !evt.action.includes('Echo')"
                  class="px-2.5 py-0.5 rounded-lg text-base font-bold font-mono border bg-pink-950/80 text-pink-300 border-pink-700/60 shadow-sm shadow-pink-950/40 inline-flex items-center gap-1.5"
                >
                  <img
                    :src="getBadgeDisplay('🎶 Echo').iconUrl"
                    alt="Echo"
                    class="w-4 h-4 rounded object-cover shrink-0 border border-pink-500/40"
                  />
                  <span>Echo</span>
                </span>
                <span class="text-slate-500 text-base font-bold">➔</span>
                <span
                  class="font-bold text-base"
                  :class="evt.targetSide === 'blue' ? 'text-cyan-300' : 'text-rose-300'"
                >
                  {{ evt.targetName }}
                </span>
              </div>

              <!-- Right: Damage Amount, Target Rem. HP & Badges -->
              <div class="flex items-center gap-2.5 flex-wrap justify-end">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span
                    v-for="(badge, bIdx) in (evt.badges || []).filter((b) => b !== '🎶 Echo')"
                    :key="bIdx"
                    class="text-base bg-amber-950/60 text-amber-300 border border-amber-800/50 px-2 py-0.5 rounded-lg font-mono font-bold shadow-sm shadow-amber-950/30 inline-flex items-center gap-1.5"
                  >
                    <img
                      v-if="getBadgeDisplay(badge).iconUrl"
                      :src="getBadgeDisplay(badge).iconUrl"
                      :alt="getBadgeDisplay(badge).label"
                      class="w-4 h-4 rounded object-cover shrink-0 border border-amber-500/40"
                    />
                    <span>{{ getBadgeDisplay(badge).label }}</span>
                  </span>
                </div>
                <!-- Combined Shield & Heal for W cast -->
                <template v-if="evt.shieldAmount !== undefined || evt.healAmount !== undefined">
                  <span
                    v-if="evt.shieldAmount && evt.shieldAmount > 0"
                    class="text-base font-extrabold font-mono px-2.5 py-0.5 rounded-lg border bg-sky-950/80 text-sky-200 border-sky-600/60 shadow-sm shadow-sky-950/40"
                  >
                    +{{ evt.shieldAmount }} SHIELD
                  </span>
                  <span
                    v-if="evt.healAmount && evt.healAmount > 0"
                    class="text-base font-extrabold font-mono px-2.5 py-0.5 rounded-lg border bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-sm shadow-emerald-950/40"
                  >
                    +{{ evt.healAmount }} HP
                  </span>
                </template>

                <!-- Standard badge for damage or standalone events -->
                <span
                  v-else
                  class="text-base font-extrabold font-mono px-2.5 py-0.5 rounded-lg border shadow-sm"
                  :class="
                    evt.dmgType === 'physical'
                      ? 'bg-orange-950/80 text-orange-400 border-orange-800/60 shadow-orange-950/40'
                      : evt.dmgType === 'magic'
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60 shadow-cyan-950/40'
                        : evt.dmgType === 'shield'
                          ? 'bg-sky-950/80 text-sky-200 border-sky-600/60 shadow-sky-950/40'
                          : evt.dmgType === 'heal'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-emerald-950/40'
                            : 'bg-slate-950/90 text-slate-100 border-slate-600/70 shadow-slate-500/10'
                  "
                >
                  <template v-if="evt.dmgType === 'shield'"> +{{ evt.amount }} SHIELD </template>
                  <template v-else-if="evt.dmgType === 'heal'"> +{{ evt.amount }} HP </template>
                  <template v-else> {{ evt.amount }} {{ evt.dmgType.toUpperCase() }} </template>
                </span>
                <span class="text-base text-slate-400">
                  HP:
                  <strong :class="evt.remainingHp === 0 ? 'text-rose-500' : 'text-slate-200'">{{
                    evt.remainingHp
                  }}</strong>
                  <span
                    v-if="evt.remainingShield && evt.remainingShield > 0"
                    class="text-white font-bold ml-1"
                  >
                    (+{{ evt.remainingShield }})
                  </span>
                </span>
                <span
                  v-if="evt.isKo"
                  class="text-base bg-rose-950/90 text-rose-300 border border-rose-600/70 font-extrabold font-mono px-2.5 py-0.5 rounded-lg shadow-sm shadow-rose-950/40 animate-pulse"
                >
                  ☠️ K.O.
                </span>
              </div>
            </div>
          </div>

          <div
            v-else
            class="py-14 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-base font-mono"
          >
            <span class="text-slate-300 font-bold">No combat events recorded.</span>
            <span class="text-slate-400 mt-2 text-base">
              Add actions to the sequence above to start the simulation!
            </span>
          </div>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- RIGHT COLUMN: RED SQUAD (Defenders / Opponents)                   -->
      <!-- ================================================================= -->
      <div class="lg:col-span-3 flex flex-col gap-5 order-3 lg:order-3 text-base">
        <!-- Red Squad Header & Roster Picker -->
        <div
          class="bg-[#131926] border border-rose-900/40 rounded-2xl p-5 flex flex-col gap-3.5 shadow-xl"
        >
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="h-4 w-4 rounded-full bg-rose-400 animate-pulse"></span>
              <span class="text-lg font-mono font-bold uppercase tracking-wider text-rose-400">
                Red Squad
              </span>
            </div>
            <span
              class="text-base font-mono text-rose-300 font-bold bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-800/60"
            >
              {{ selectedDefenderSlots.length }} Active
            </span>
          </div>

          <!-- Roster Slot Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-for="s in redDraft"
              :key="s.id"
              @click="toggleDefenderSlot(s.id)"
              class="flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-base cursor-pointer transition-all"
              :class="
                selectedDefenderSlotIds.includes(s.id)
                  ? 'bg-rose-950 text-rose-300 border-rose-500 font-bold shadow'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
              "
              :title="s.champion ? s.champion.name : s.role"
            >
              <img
                v-if="s.champion"
                :src="getChampionIconUrl(s.champion)"
                class="w-6 h-6 rounded-md object-cover"
              />
              <span>{{ s.role }}</span>
              <span v-if="s.champion" class="text-white font-semibold truncate max-w-[100px]">
                {{ s.champion.name }}
              </span>
            </button>
          </div>
        </div>

        <!-- Red Participating Champions Cards (Stacked Vertically) -->
        <div
          v-for="slot in selectedDefenderSlots"
          :key="slot.id"
          class="bg-[#131926] border border-slate-800 hover:border-rose-800/60 rounded-2xl p-5 flex flex-col gap-4 shadow-lg transition-all text-base"
        >
          <!-- Champion Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="slot.champion"
                :src="getChampionIconUrl(slot.champion)"
                class="h-14 w-14 rounded-xl border border-rose-500/50 object-cover shadow"
              />
              <div
                v-else
                class="h-14 w-14 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600 font-mono text-base"
              >
                Empty
              </div>
              <div>
                <h4 class="text-lg font-bold text-white leading-tight">
                  {{ slot.champion?.name || 'Unassigned' }}
                </h4>
                <span class="text-base font-mono text-rose-400 font-semibold">
                  RED {{ slot.role }} • Lvl {{ slot.level }}
                </span>
              </div>
            </div>
            <button
              @click="openWorkbenchForSlot(slot.id)"
              class="text-base text-rose-400 hover:text-white font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 transition-all cursor-pointer font-semibold"
              title="Edit build in Workbench"
            >
              ⚙️ Build
            </button>
          </div>

          <!-- Live HP Bar & Status -->
          <div
            class="flex flex-col gap-1.5 font-mono text-base bg-slate-950 p-3 rounded-xl border border-slate-800"
          >
            <div class="flex items-center justify-between font-bold">
              <span class="text-slate-400">Health</span>
              <span
                :class="
                  getChampionEndState(slot.id).isKo
                    ? 'text-rose-500 font-extrabold'
                    : getChampionEndState(slot.id).currentShield > 0
                      ? 'text-white font-extrabold'
                      : 'text-emerald-400'
                "
              >
                {{ getChampionEndState(slot.id).currentHp }}
                <span
                  v-if="getChampionEndState(slot.id).currentShield > 0"
                  class="text-white font-bold"
                >
                  (+{{ getChampionEndState(slot.id).currentShield }})
                </span>
                / {{ getChampionEndState(slot.id).maxHp }}
                <span
                  class="font-black"
                  :class="
                    getChampionEndState(slot.id).hpPct > 100
                      ? 'text-white font-extrabold'
                      : getChampionEndState(slot.id).currentShield > 0
                        ? 'text-slate-200'
                        : ''
                  "
                >
                  ({{ getChampionEndState(slot.id).hpPct }}%)
                </span>
              </span>
            </div>
            <div
              class="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative flex"
            >
              <!-- Base Health Bar (Green / Yellow / Red) -->
              <div
                class="h-full transition-all duration-300"
                :class="
                  getChampionEndState(slot.id).currentHp / getChampionEndState(slot.id).maxHp > 0.5
                    ? 'bg-linear-to-r from-emerald-500 to-green-400'
                    : getChampionEndState(slot.id).currentHp / getChampionEndState(slot.id).maxHp >
                        0.2
                      ? 'bg-linear-to-r from-amber-500 to-yellow-400'
                      : 'bg-linear-to-r from-rose-600 to-red-500'
                "
                :style="{
                  width:
                    Math.min(
                      100,
                      Math.round(
                        (getChampionEndState(slot.id).currentHp /
                          Math.max(
                            getChampionEndState(slot.id).maxHp,
                            getChampionEndState(slot.id).currentHp +
                              getChampionEndState(slot.id).currentShield,
                          )) *
                          100,
                      ),
                    ) + '%',
                }"
              ></div>
              <!-- Shield Bar (Silver / White / Platinum - NOT GREEN!) -->
              <div
                v-if="getChampionEndState(slot.id).currentShield > 0"
                class="h-full bg-linear-to-r from-slate-200 via-white to-slate-300 border-l border-white shadow-md transition-all duration-300"
                :title="getChampionEndState(slot.id).currentShield + ' Shield'"
                :style="{
                  width:
                    Math.min(
                      100,
                      Math.round(
                        (getChampionEndState(slot.id).currentShield /
                          Math.max(
                            getChampionEndState(slot.id).maxHp,
                            getChampionEndState(slot.id).currentHp +
                              getChampionEndState(slot.id).currentShield,
                          )) *
                          100,
                      ),
                    ) + '%',
                }"
              ></div>
            </div>
          </div>

          <!-- DPS & Total Damage Card -->
          <div
            class="flex flex-col gap-2 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-base"
          >
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-base uppercase">Damage Dealt</span>
              <span class="text-amber-400 font-extrabold text-lg">
                🔥 {{ getChampionEndState(slot.id).dps }} DPS
              </span>
            </div>
            <div class="flex items-center justify-between text-base">
              <span class="text-white font-bold">
                {{ getChampionEndState(slot.id).totalDamageDealt.toLocaleString() }} Total
              </span>
              <span class="text-slate-400">
                Taken: {{ getChampionEndState(slot.id).damageTaken.toLocaleString() }}
              </span>
            </div>

            <!-- Damage Breakdown Badges -->
            <div class="flex items-center gap-1.5 flex-wrap text-base font-bold font-mono pt-1">
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.physical > 0"
                class="bg-orange-950/80 text-orange-400 border border-orange-800/60 shadow-sm shadow-orange-950/50 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                {{ getChampionEndState(slot.id).damageDealtByType.physical }} Phys
              </span>
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.magic > 0"
                class="bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm shadow-cyan-950/50 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                {{ getChampionEndState(slot.id).damageDealtByType.magic }} Mag
              </span>
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.true > 0"
                class="bg-slate-950/90 text-slate-100 border border-slate-600/70 shadow-sm shadow-slate-500/20 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                {{ getChampionEndState(slot.id).damageDealtByType.true }} True
              </span>
              <span
                v-if="getChampionEndState(slot.id).damageDealtByType.dot > 0"
                class="bg-purple-950/80 text-purple-300 border border-purple-800/60 shadow-sm shadow-purple-950/50 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1"
              >
                🔥 {{ getChampionEndState(slot.id).damageDealtByType.dot }} DoT
              </span>
            </div>
          </div>

          <!-- Active DoTs on this champion -->
          <div
            v-if="getChampionEndState(slot.id).activeDoTs.length > 0"
            class="flex items-center gap-2 flex-wrap font-mono text-base"
          >
            <span
              v-for="dot in getChampionEndState(slot.id).activeDoTs"
              :key="dot.id"
              class="bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-sm shadow-rose-950/50 px-2.5 py-0.5 rounded-lg font-mono font-bold inline-flex items-center gap-1.5 animate-pulse"
            >
              <img
                v-if="getDoTIconUrl(dot)"
                :src="getDoTIconUrl(dot)!"
                :alt="dot.name"
                class="w-4 h-4 rounded object-cover shrink-0 border border-rose-500/40"
              />
              <span v-else>🩸</span>
              <span>{{ dot.name }} ({{ dot.remainingDuration.toFixed(1) }}s)</span>
            </span>
          </div>

          <!-- Stats Grid -->
          <div
            v-if="getCalculatedStatsForSlot(slot)"
            class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-base font-mono bg-slate-950 p-3 rounded-xl border border-slate-800"
          >
            <div>
              <span class="text-slate-400 block text-base font-semibold">AD</span>
              <span class="text-orange-400 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.ad }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">AP</span>
              <span class="text-cyan-400 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.ap }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">AS</span>
              <span class="text-emerald-400 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.as }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">Armor</span>
              <span class="text-amber-400 font-bold text-lg">
                {{ getChampionEndState(slot.id).effectiveArmor }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">MR</span>
              <span class="text-purple-400 font-bold text-lg">
                {{ getChampionEndState(slot.id).effectiveMr }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-base font-semibold">Crit</span>
              <span class="text-amber-300 font-bold text-lg">
                {{ getCalculatedStatsForSlot(slot)?.crit }}%
              </span>
            </div>
          </div>

          <!-- Items Row -->
          <div class="flex items-center gap-2 flex-wrap">
            <div
              v-for="(item, idx) in slot.items"
              :key="idx"
              class="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden"
            >
              <img v-if="item" :src="getItemIconUrl(item)" class="h-full w-full object-cover" />
              <span v-else class="text-base text-slate-700">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDraftStore } from '@/stores/draft'
import { storeToRefs } from 'pinia'
import {
  getChampionIconUrl,
  getItemIconUrl,
  calculateStats,
  calculateMonsterBuffStats,
  getChampionDefaultAdaptiveType,
  detectItemPassives,
  runCombatSimulation,
  getSpellEffectiveCooldown,
} from '@/services'
import type { DraftSlot } from '@/types'
import { useCalculatorStore } from '@/stores/calculator'
import { useDDragonStore } from '@/stores/ddragon'

const router = useRouter()
const draftStore = useDraftStore()
const calculatorStore = useCalculatorStore()
const ddragonStore = useDDragonStore()

const { blueDraft, redDraft } = storeToRefs(draftStore)
const { selectCustomizerSlot } = draftStore

const {
  selectedAttackerSlotIds,
  selectedDefenderSlotIds,
  enforceCooldowns,
  teamfightActions,
  attackerBuffs,
  defenderBuffs,
} = storeToRefs(calculatorStore)

const { addTeamfightAction, removeTeamfightAction, clearComboSequence, setPresetScenario } =
  calculatorStore

// Presets
const presetOptions = [
  { id: '1v1', label: '⚔️ 1v1 Dual' },
  { id: '1v2', label: '⚔️ 1v2 Gank' },
  { id: '2v2', label: '⚔️ 2v2 Skirmish' },
  { id: '3v3', label: '⚔️ 3v3 Dragon' },
  { id: '5v5', label: '⚔️ 5v5 Teamfight' },
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

// Center view mode tab: 'all' (both actions sequence and log) | 'actions' | 'log'
const centerViewTab = ref<'all' | 'actions' | 'log'>('all')

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

const getSlotById = (slotId: number): DraftSlot | undefined => {
  return [...blueDraft.value, ...redDraft.value].find((s) => s.id === slotId)
}

const getTargetSlots = (targetIds: number[]): DraftSlot[] => {
  return targetIds.map((id) => getSlotById(id)).filter(Boolean) as DraftSlot[]
}

// Action Creator State
const actionCreatorActorId = ref<number>(1)
const actionCreatorSpell = ref<'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'>('Q')
const actionCreatorTime = ref<number>(0.0)

// Active Actor details & cooldown stats
const selectedActorSlot = computed(() => getSlotById(actionCreatorActorId.value))
const selectedActorStats = computed(() =>
  selectedActorSlot.value ? getCalculatedStatsForSlot(selectedActorSlot.value) : null,
)

const getSpellCd = (spellKey: 'Q' | 'W' | 'E' | 'R') => {
  if (!selectedActorSlot.value) return 8
  const ah = selectedActorStats.value?.abilityHaste ?? 0
  return getSpellEffectiveCooldown(selectedActorSlot.value, spellKey, ah)
}

const getSpellBadgeInfo = (act: 'Q' | 'W' | 'E' | 'R' | 'AA' | 'P') => {
  if (act === 'AA') {
    const as = selectedActorStats.value?.as || 0.65
    return `${(1 / as).toFixed(1)}s AS`
  }
  if (act === 'P') return 'Innate'
  const cd = getSpellCd(act)
  return `${cd}s CD`
}

const getBadgeDisplay = (badgeText: string): { label: string; iconUrl?: string } => {
  const clean = badgeText.trim()
  const base = import.meta.env.BASE_URL

  // 1. Seraph's Embrace / Lifeline
  if (clean.includes('Lifeline')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3048_mage_t3_seraphsembrace.png`,
    }
  }

  // 2. Cryptbloom Nova
  if (clean.includes('Cryptbloom')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3137_cryptbloom.png`,
    }
  }

  // 3. Banshee's Veil
  if (clean.includes('Banshee')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3102_mage_t3_bansheesveil.png`,
    }
  }

  // 4. Blade of the Ruined King (Bork)
  if (clean.includes('Bork')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3153_fighter_t3_bladeoftheruinedking.png`,
    }
  }

  // 5. Muramana
  if (clean.includes('Muramana')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3042_marksman_t3_muramana.png`,
    }
  }

  // 6. Luden's Companion / Tempest
  if (clean.includes("Luden's") || clean.includes('Ludens')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/6655_mage_t4_ludenstempest.png`,
    }
  }

  // 7. Nashor's Tooth
  if (clean.includes('Nashor')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3115_mage_t3_nashorstooth.png`,
    }
  }

  // 8. Guinsoo's Rageblade
  if (clean.includes('Guinsoo')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3124_marksman_t3_guinsoosrageblade.png`,
    }
  }

  // 9. Hextech Gunblade
  if (clean.includes('Gunblade')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3146_hextechgunblade.png`,
    }
  }

  // 10. Hextech Rocketbelt
  if (clean.includes('Rocketbelt')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3152_mage_t4_hextechrocketbelt.png`,
    }
  }

  // 11. Dusk and Dawn
  if (clean.includes('Dusk & Dawn') || clean.includes('Dusk and Dawn')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/6691_assassin_t4_duskbladeofdraktharr.png`,
    }
  }

  // 12. Imperial Mandate
  if (clean.includes('Mandate')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/4005_enchanter_t4_imperialmandate.png`,
    }
  }

  // 13. Ardent Censer
  if (clean.includes('Ardent')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3504_enchanter_t3_ardentcenser.png`,
    }
  }

  // 14. Echoes of Helia
  if (clean.includes('Helia')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/6620_echoes_of_helia.png`,
    }
  }

  // 15. Horizon Focus
  if (clean.includes('Horizon')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/4628_mage_t3_horizonfocus.png`,
    }
  }

  // 16. Malignance / Actualizer
  if (clean.includes('Actualizer') || clean.includes('Malignance')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3118_malignance.png`,
    }
  }

  // 17. Rylai's Crystal Scepter
  if (clean.includes('Rylai')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3116_mage_t3_rylajscrystalscepter.png`,
    }
  }

  // 18. Black Cleaver
  if (clean.includes('BC ')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3071_fighter_t3_blackcleaver.png`,
    }
  }

  // 19. Vile Decay (Sunfire / Hollow / Abyssal)
  if (clean.includes('VD ')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3068_tank_t4_sunfireaegis.png`,
    }
  }

  // 20. Grievous Wounds
  if (clean.includes('Grievous Wounds')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/3916_mage_t2_oblivionorb.png`,
    }
  }

  // 21. The Collector execute
  if (clean.includes('Execute')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/items/icons/6676_marksman_t3_thecollector.png`,
    }
  }

  // Runes
  // 22. Press the Attack
  if (clean.includes('PtA')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/precision/presstheattack/presstheattack.png`,
    }
  }

  // 23. Electrocute
  if (clean.includes('Electrocute')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/domination/electrocute/electrocute.png`,
    }
  }

  // 24. Dark Harvest
  if (clean.includes('Dark Harvest')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/domination/darkharvest/darkharvest.png`,
    }
  }

  // 25. Lethal Tempo
  if (clean.includes('LT Max')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/precision/lethaltempo/lethaltempotemp.png`,
    }
  }

  // 26. Coup de Grace
  if (clean.includes('CdG')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/precision/coupdegrace/coupdegrace.png`,
    }
  }

  // 27. Cut Down
  if (clean.includes('Cut Down')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/precision/cutdown/cutdown.png`,
    }
  }

  // 28. Last Stand
  if (clean.includes('Last Stand')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/sorcery/laststand/laststand.png`,
    }
  }

  // 29. Deathfire Touch
  if (clean.includes('DFT')) {
    return {
      label: clean.replace(/^[^\w\s+()%-&]+/, '').trim(),
      iconUrl: `${base}cdragon/runes/images/styles/sorcery/deathfiretouch/deathfire_touch_keystone.png`,
    }
  }

  // 30. Seraphine Echo
  if (clean.includes('Echo')) {
    const patch = ddragonStore.latestPatchVersion || '16.18.1'
    return {
      label: 'Echo',
      iconUrl: `https://ddragon.leagueoflegends.com/cdn/${patch}/img/passive/Seraphine_Passive.png`,
    }
  }

  const withoutEmoji = clean.replace(/^[^\w\s+()%-&]+/, '').trim()
  return { label: withoutEmoji || clean }
}

const getDoTIconUrl = (dot: { type?: string; name: string }): string | null => {
  const base = import.meta.env.BASE_URL
  const type = dot.type?.toLowerCase() || ''
  const name = dot.name?.toLowerCase() || ''

  if (type === 'blackfire' || name.includes('baleful') || name.includes('blackfire')) {
    return `${base}cdragon/items/icons/2503_blackfiretorch64.png`
  }
  if (type === 'liandry' || name.includes('torment') || name.includes('liandry')) {
    return `${base}cdragon/items/icons/6653_mage_t4_liandrysanguish.png`
  }
  if (type === 'sunfire' || name.includes('sunfire')) {
    return `${base}cdragon/items/icons/3068_tank_t4_sunfireaegis.png`
  }
  if (type === 'hollow' || name.includes('hollow')) {
    return `${base}cdragon/items/icons/6664_hollowradiance.png`
  }
  if (type === 'dft' || name.includes('deathfire')) {
    return `${base}cdragon/runes/images/styles/sorcery/deathfiretouch/deathfire_touch_keystone.png`
  }
  return null
}

const getShortAbilityName = (act: 'P' | 'Q' | 'W' | 'E' | 'R' | 'AA') => {
  if (act === 'P') return 'Passive'
  if (act === 'AA') return 'Attack'
  if (act === 'R') return 'Ultimate'
  return `Spell ${act}`
}

const getAbilityFullTooltip = (act: 'P' | 'Q' | 'W' | 'E' | 'R' | 'AA') => {
  if (!selectedActorSlot.value || !selectedActorSlot.value.champion) return ''
  const cName = selectedActorSlot.value.champion.name
  if (act === 'P') {
    const pName = selectedActorSlot.value.champion.passive?.name || 'Passive'
    return `${cName} Passive: ${pName}`
  }
  if (act === 'AA') {
    const as = (1 / (selectedActorStats.value?.as || 0.65)).toFixed(1)
    return `${cName} Basic Attack (${as}s AS)`
  }
  const idx = { Q: 0, W: 1, E: 2, R: 3 }[act]
  const sName = selectedActorSlot.value.champion.spells?.[idx]?.name || `Spell ${act}`
  const cd = getSpellCd(act)
  return `${cName} [${act}]: ${sName} (${cd}s CD)`
}

// Track when this spell was last scheduled for the actor
const lastCastTimeForSelectedSpell = computed(() => {
  const acts = teamfightActions.value.filter(
    (a) => a.actorSlotId === actionCreatorActorId.value && a.action === actionCreatorSpell.value,
  )
  if (acts.length === 0) return -1
  return Math.max(...acts.map((a) => a.timestamp ?? 0))
})

const nextReadyTimeForSelectedSpell = computed(() => {
  if (['AA', 'P'].includes(actionCreatorSpell.value)) return 0
  if (lastCastTimeForSelectedSpell.value < 0) return 0
  const cd = getSpellCd(actionCreatorSpell.value as 'Q' | 'W' | 'E' | 'R')
  return Math.round((lastCastTimeForSelectedSpell.value + cd) * 10) / 10
})

const isSelectedSpellOnCooldown = computed(() => {
  if (['AA', 'P'].includes(actionCreatorSpell.value)) return false
  if (lastCastTimeForSelectedSpell.value < 0) return false
  return actionCreatorTime.value < nextReadyTimeForSelectedSpell.value - 0.05
})

const snapToReadyTime = () => {
  actionCreatorTime.value = Math.min(30, nextReadyTimeForSelectedSpell.value)
}

const selectSpellAction = (act: 'Q' | 'W' | 'E' | 'R' | 'AA' | 'P') => {
  actionCreatorSpell.value = act
  // If this spell was already cast and would be on cooldown at current time, snap to ready
  if (['Q', 'W', 'E', 'R'].includes(act)) {
    const acts = teamfightActions.value.filter(
      (a) => a.actorSlotId === actionCreatorActorId.value && a.action === act,
    )
    if (acts.length > 0) {
      const lastT = Math.max(...acts.map((a) => a.timestamp ?? 0))
      const cd = getSpellCd(act as 'Q' | 'W' | 'E' | 'R')
      const readyAt = Math.round((lastT + cd) * 10) / 10
      if (actionCreatorTime.value < readyAt) {
        actionCreatorTime.value = Math.min(30, readyAt)
      }
    }
  }
}

// Opponents dynamically computed based on acting champion's side
const availableTargets = computed(() => {
  const isBlueActor = actionCreatorActorId.value <= 5
  return isBlueActor ? selectedDefenderSlots.value : selectedAttackerSlots.value
})

const actionCreatorTargetIds = ref<number[]>([6])

// Update default target when actor changes
watch(
  actionCreatorActorId,
  (newActorId) => {
    const isBlue = newActorId <= 5
    const oppSlots = isBlue ? selectedDefenderSlots.value : selectedAttackerSlots.value
    const firstId = oppSlots[0]?.id
    actionCreatorTargetIds.value = firstId !== undefined ? [firstId] : []
    if (actionCreatorSpell.value === 'P') {
      actionCreatorSpell.value = 'Q'
    }
  },
  { immediate: true },
)

const isAllTargetsSelected = computed(() => {
  return (
    availableTargets.value.length > 0 &&
    availableTargets.value.every((s) => actionCreatorTargetIds.value.includes(s.id))
  )
})

const toggleSelectAllTargets = () => {
  if (isAllTargetsSelected.value) {
    const firstId = availableTargets.value[0]?.id
    actionCreatorTargetIds.value = firstId !== undefined ? [firstId] : []
  } else {
    actionCreatorTargetIds.value = availableTargets.value.map((s) => s.id)
  }
}

const submitTeamfightAction = () => {
  addTeamfightAction(
    actionCreatorActorId.value,
    actionCreatorSpell.value,
    actionCreatorTargetIds.value,
    actionCreatorTime.value,
  )
  // Auto-advance timestamp by cast animation time (0.3s) for seamless combo queuing
  actionCreatorTime.value = Math.min(30, Math.round((actionCreatorTime.value + 0.3) * 10) / 10)
}

const clearActionsAndResetTime = () => {
  clearComboSequence()
  actionCreatorTime.value = 0.0
}

const moveActionUp = (index: number) => {
  if (index <= 0) return
  const current = teamfightActions.value[index]
  const prev = teamfightActions.value[index - 1]
  if (!current || !prev) return
  if (
    current.timestamp !== undefined &&
    prev.timestamp !== undefined &&
    current.timestamp !== prev.timestamp
  ) {
    const tempTime = current.timestamp
    current.timestamp = prev.timestamp
    prev.timestamp = tempTime
  }
  teamfightActions.value.splice(index - 1, 2, current, prev)
}

const moveActionDown = (index: number) => {
  if (index >= teamfightActions.value.length - 1) return
  const current = teamfightActions.value[index]
  const next = teamfightActions.value[index + 1]
  if (!current || !next) return
  if (
    current.timestamp !== undefined &&
    next.timestamp !== undefined &&
    current.timestamp !== next.timestamp
  ) {
    const tempTime = current.timestamp
    current.timestamp = next.timestamp
    next.timestamp = tempTime
  }
  teamfightActions.value.splice(index, 2, next, current)
}

const openWorkbenchForSlot = (slotId: number) => {
  const slot = [...blueDraft.value, ...redDraft.value].find((s) => s.id === slotId)
  if (slot) selectCustomizerSlot(slot)
  router.push('/')
}

// Stats helper
const getCalculatedStatsForSlot = (slot: DraftSlot) => {
  if (!slot || !slot.champion) return null
  const base = calculateStats(slot)
  if (!base) return null
  const isAttacker = blueDraft.value.some((b) => b.id === slot.id)
  const mStats = calculateMonsterBuffStats(isAttacker ? attackerBuffs.value : defenderBuffs.value)

  const itemPassives = detectItemPassives(slot.items)
  let blackfireBonusAp = 0
  const baseAp = Math.round((base.ap.total + mStats.bonusAP) * mStats.apMultiplier)
  const rawAp = (base.ap.bonus || 0) + mStats.bonusAP

  if (itemPassives.hasBlackfireTorch) {
    let maxTargetsHit = 0
    teamfightActions.value.forEach((actStep) => {
      if (actStep.actorSlotId === slot.id && ['Q', 'W', 'E', 'R', 'P'].includes(actStep.action)) {
        const count = Math.min(5, Math.max(1, actStep.targetSlotIds.length))
        if (count > maxTargetsHit) {
          maxTargetsHit = count
        }
      }
    })
    if (maxTargetsHit > 0) {
      const extraApPct = maxTargetsHit * 0.04
      // Stacks additively with other sources of % AP (Rabadon, Infernal Might)
      blackfireBonusAp = Math.round(rawAp * extraApPct)
    }
  }

  return {
    ad: Math.round((base.ad.total + mStats.bonusAD) * mStats.adMultiplier),
    baseAd: Math.round(base.ad.base * mStats.adMultiplier),
    ap: baseAp + blackfireBonusAp,
    as: Math.round((base.as?.total || 0.65) * 100) / 100,
    baseAp,
    blackfireBonusAp,
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

// MAIN COMBAT SIMULATION ENGINE CALL
const combatResults = computed(() => {
  return runCombatSimulation({
    allSlots: [...blueDraft.value, ...redDraft.value],
    activeBlueSlotIds: selectedAttackerSlotIds.value,
    activeRedSlotIds: selectedDefenderSlotIds.value,
    actions: teamfightActions.value,
    duration: 30.0,
    enableAutoAttacks: false,
    autoCastSpells: false,
    enforceCooldowns: enforceCooldowns.value,
    attackerBuffs: attackerBuffs.value,
    defenderBuffs: defenderBuffs.value,
  })
})

const blueDamageSharePct = computed(() => {
  const total = combatResults.value.blueTeamTotalDamage + combatResults.value.redTeamTotalDamage
  if (total <= 0) return 50
  return Math.round((combatResults.value.blueTeamTotalDamage / total) * 100)
})

// Last Combat Event Time & Action for smart combo queuing
const lastCombatEventTime = computed(() => {
  const evts = combatResults.value?.events || []
  if (evts.length === 0) return 0
  const maxTime = Math.max(...evts.map((e) => e.timestamp))
  return Math.round(maxTime * 10) / 10
})

const lastCombatEventAction = computed(() => {
  const evts = combatResults.value?.events || []
  if (evts.length === 0) return ''
  const maxTime = lastCombatEventTime.value
  const lastEvt = [...evts].reverse().find((e) => Math.abs(e.timestamp - maxTime) < 0.05)
  return lastEvt?.action || ''
})

const snapToLastEventTime = () => {
  if (lastCombatEventTime.value > 0) {
    actionCreatorTime.value = Math.min(30, lastCombatEventTime.value)
  }
}

// Event Filter State
const eventFilter = ref<'all' | 'blue' | 'red' | 'dot'>('all')

const filteredEvents = computed(() => {
  const evts = combatResults.value.events
  if (eventFilter.value === 'blue') return evts.filter((e) => e.actorSide === 'blue')
  if (eventFilter.value === 'red') return evts.filter((e) => e.actorSide === 'red')
  if (eventFilter.value === 'dot') return evts.filter((e) => e.isDot)
  return evts
})

// End State Helper for any participant slot (Blue or Red)
const getChampionEndState = (slotId: number) => {
  const res = combatResults.value.championResults[slotId]
  if (!res) {
    return {
      slotId,
      championName: 'Unassigned',
      side: (slotId <= 5 ? 'blue' : 'red') as 'blue' | 'red',
      role: '',
      initialHp: 1000,
      currentHp: 1000,
      currentShield: 0,
      maxHp: 1000,
      hpPct: 100,
      isKo: false,
      totalDamageDealt: 0,
      dps: 0,
      damageDealtByType: { physical: 0, magic: 0, true: 0, dot: 0 },
      damageTaken: 0,
      activeDoTs: [],
      effectiveArmor: 50,
      effectiveMr: 40,
      blackCleaverStacks: 0,
      vileDecayStacks: 0,
      conquerorStacks: 0,
      lethalTempoStacks: 0,
    }
  }
  return res
}
</script>
