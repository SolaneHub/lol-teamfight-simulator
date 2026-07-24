<template>
  <div class="flex-1 flex flex-col gap-6 p-6 w-full max-w-none bg-[#0b0f17] text-slate-200 font-sans min-h-screen text-base">
    
    <!-- TOP TOOLBAR: SCENARIO PRESETS & VIEW MODE SWITCHER -->
    <div class="flex flex-wrap items-center justify-between gap-4 bg-[#131926] border border-slate-800 rounded-2xl p-5 shadow-xl">
      <!-- Scenario Presets -->
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-base font-mono uppercase font-bold text-slate-400 mr-2">Presets:</span>
        <button 
          v-for="p in presetOptions" 
          :key="p.id"
          @click="setPresetScenario(p.id)"
          class="px-4 py-2.5 rounded-lg font-mono text-base font-bold transition-all border cursor-pointer"
          :class="isPresetActive(p.id) ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- View Mode Switcher -->
      <div class="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button 
          @click="teamfightViewMode = 'split'"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-mono font-bold transition-all cursor-pointer"
          :class="teamfightViewMode === 'split' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'"
        >
          <span>📊</span>
          <span>3-Column Squad View</span>
        </button>
        <button 
          @click="teamfightViewMode = 'feed'"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-mono font-bold transition-all cursor-pointer"
          :class="teamfightViewMode === 'feed' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'"
        >
          <span>⏱️</span>
          <span>Chronological Feed View</span>
        </button>
      </div>
    </div>

    <!-- ROSTER SELECTORS (BLUE TEAM ATTACKERS & RED TEAM DEFENDERS) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <!-- Blue Team Attacker Selection -->
      <div class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-3 shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="h-3.5 w-3.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="text-base font-mono font-bold uppercase tracking-wider text-cyan-400">Attacker Squad (Blue Team)</span>
          </div>
          <span class="text-base font-mono text-slate-400 font-semibold">{{ selectedAttackerSlots.length }} Champions Participating</span>
        </div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <button 
            v-for="s in blueDraft" 
            :key="s.id"
            @click="toggleAttackerSlot(s.id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-base cursor-pointer transition-all"
            :class="selectedAttackerSlotIds.includes(s.id) ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/80 font-bold shadow' : 'bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-700'"
          >
            <span class="h-2.5 w-2.5 rounded-full" :class="selectedAttackerSlotIds.includes(s.id) ? 'bg-cyan-400' : 'bg-slate-600'"></span>
            <span>{{ s.role }}</span>
            <span v-if="s.champion" class="text-white font-semibold">{{ s.champion.name }}</span>
            <span v-else class="text-slate-500">Empty</span>
          </button>
        </div>
      </div>

      <!-- Red Team Defender Selection -->
      <div class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-3 shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="h-3.5 w-3.5 rounded-full bg-rose-400 animate-pulse"></span>
            <span class="text-base font-mono font-bold uppercase tracking-wider text-rose-400">Defender Squad (Red Team)</span>
          </div>
          <span class="text-base font-mono text-slate-400 font-semibold">{{ selectedDefenderSlots.length }} Champions Targetable</span>
        </div>
        <div class="flex items-center gap-2.5 flex-wrap">
          <button 
            v-for="s in redDraft" 
            :key="s.id"
            @click="toggleDefenderSlot(s.id)"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-base cursor-pointer transition-all"
            :class="selectedDefenderSlotIds.includes(s.id) ? 'bg-rose-950/80 text-rose-300 border-rose-500/80 font-bold shadow' : 'bg-slate-900 text-slate-400 border-slate-850 hover:border-slate-700'"
          >
            <span class="h-2.5 w-2.5 rounded-full" :class="selectedDefenderSlotIds.includes(s.id) ? 'bg-rose-400' : 'bg-slate-600'"></span>
            <span>{{ s.role }}</span>
            <span v-if="s.champion" class="text-white font-semibold">{{ s.champion.name }}</span>
            <span v-else class="text-slate-500">Empty</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ACTION CREATOR PANEL (SELECT ACTOR, ABILITY & TARGETS) -->
    <div class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-3">
          <span class="text-lg font-bold font-mono text-amber-400 uppercase tracking-wider">⚡ Teamfight Action Creator</span>
          <span class="text-base font-mono text-slate-300 bg-slate-900 px-3 py-1 rounded border border-slate-800">AOE & Multi-Target Ready</span>
        </div>
        <button @click="clearComboSequence" class="px-4 py-2 bg-rose-950/50 text-rose-300 hover:bg-rose-900 border border-rose-900/60 rounded-lg font-mono text-base font-bold transition-all cursor-pointer">
          🗑️ Clear Teamfight Timeline
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end font-mono">
        <!-- 1. Actor Selector -->
        <div class="md:col-span-3 flex flex-col gap-2">
          <label class="text-base font-bold text-slate-400 uppercase">1. Attacking Champion</label>
          <select v-model="actionCreatorActorId" class="w-full bg-slate-950 text-white text-base font-mono px-3.5 py-3 rounded-lg border border-slate-800 cursor-pointer focus:outline-none focus:border-cyan-500">
            <option v-for="s in selectedAttackerSlots" :key="s.id" :value="s.id">
              [{{ s.side.toUpperCase() }} {{ s.role }}] {{ s.champion ? s.champion.name : 'Empty' }} (Lvl {{ s.level }})
            </option>
          </select>
        </div>

        <!-- 2. Spell / AA Selector -->
        <div class="md:col-span-3 flex flex-col gap-2">
          <label class="text-base font-bold text-slate-400 uppercase">2. Action / Spell</label>
          <div class="flex items-center gap-1.5">
            <button 
              v-for="act in ['Q', 'W', 'E', 'R', 'P', 'AA']" 
              :key="act"
              @click="actionCreatorSpell = act as any"
              class="flex-1 py-2.5 rounded font-mono text-base font-bold transition-all border cursor-pointer"
              :class="actionCreatorSpell === act ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'"
            >
              {{ act }}
            </button>
          </div>
        </div>

        <!-- 3. Target Picker (AOE Checkboxes) -->
        <div class="md:col-span-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <label class="text-base font-bold text-slate-400 uppercase">3. Hit Targets (AOE Multi-Select)</label>
            <button @click="toggleSelectAllTargets" class="text-base text-cyan-400 hover:underline cursor-pointer font-bold">
              {{ isAllTargetsSelected ? 'Deselect All' : 'Select All Enemies (AOE)' }}
            </button>
          </div>
          <div class="flex items-center gap-2 flex-wrap bg-slate-950 p-2.5 rounded-lg border border-slate-800 min-h-[48px]">
            <label 
              v-for="s in selectedDefenderSlots" 
              :key="s.id"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded text-base border cursor-pointer transition-all"
              :class="actionCreatorTargetIds.includes(s.id) ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'"
            >
              <input type="checkbox" :value="s.id" v-model="actionCreatorTargetIds" class="hidden" />
              <span>{{ s.champion ? s.champion.name : s.role }}</span>
            </label>
          </div>
        </div>

        <!-- Add Button -->
        <div class="md:col-span-2">
          <button 
            @click="submitTeamfightAction"
            class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg font-mono text-base transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
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
          <span class="text-base font-mono uppercase font-bold text-cyan-400">Attacker Squad Roster</span>
          <span class="text-base font-mono text-slate-500 font-semibold">Live Stats</span>
        </div>

        <div v-for="slot in selectedAttackerSlots" :key="slot.id" class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg">
          <!-- Card Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="slot.champion" :src="getChampionIconUrl(slot.champion)" class="h-12 w-12 rounded-lg border border-cyan-500/50 object-cover" />
              <div>
                <h4 class="text-base font-bold text-white leading-tight">{{ slot.champion?.name || 'Unassigned' }}</h4>
                <span class="text-base font-mono text-cyan-400 font-semibold">{{ slot.side.toUpperCase() }} {{ slot.role }} • Lvl {{ slot.level }}</span>
              </div>
            </div>
            <button @click="openWorkbenchForSlot(slot.id)" class="text-base text-cyan-400 hover:text-white font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500 transition-all cursor-pointer">
              ⚙️
            </button>
          </div>

          <!-- Stats Grid -->
          <div v-if="getCalculatedStatsForSlot(slot)" class="grid grid-cols-3 gap-2 text-base font-mono bg-slate-950 p-3 rounded-lg border border-slate-850">
            <div><span class="text-slate-500 block text-base">AD</span><span class="text-orange-400 font-bold text-lg">{{ getCalculatedStatsForSlot(slot)?.ad }}</span></div>
            <div><span class="text-slate-500 block text-base">AP</span><span class="text-cyan-400 font-bold text-lg">{{ getCalculatedStatsForSlot(slot)?.ap }}</span></div>
            <div><span class="text-slate-500 block text-base">Crit</span><span class="text-amber-300 font-bold text-lg">{{ getCalculatedStatsForSlot(slot)?.crit }}%</span></div>
            <div><span class="text-slate-500 block text-base">Pen</span><span class="text-rose-400 font-bold text-base">{{ getCalculatedStatsForSlot(slot)?.lethality }}|{{ getCalculatedStatsForSlot(slot)?.armorPen }}%</span></div>
            <div><span class="text-slate-500 block text-base">MPen</span><span class="text-purple-400 font-bold text-base">{{ getCalculatedStatsForSlot(slot)?.magicPenFlat }}|{{ getCalculatedStatsForSlot(slot)?.magicPenPercent }}%</span></div>
            <div><span class="text-slate-500 block text-base">AH</span><span class="text-teal-400 font-bold text-lg">{{ getCalculatedStatsForSlot(slot)?.abilityHaste }}</span></div>
          </div>

          <!-- Items Row -->
          <div class="flex items-center gap-1.5">
            <div v-for="(item, idx) in slot.items" :key="idx" class="h-9 w-9 rounded bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              <img v-if="item" :src="getItemIconUrl(item)" class="h-full w-full object-cover" />
              <span v-else class="text-base text-slate-700">-</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTER COLUMN: COMBAT TIMELINE & LOGS -->
      <div class="lg:col-span-6 flex flex-col gap-5">
        <div class="bg-[#131926] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <span class="text-lg font-mono uppercase font-bold text-amber-400">Teamfight Combat Log</span>
            <span class="text-base font-mono text-slate-400">{{ teamfightSimulationResults.logSteps.length }} Steps Executed</span>
          </div>

          <!-- Action Steps Timeline -->
          <div v-if="teamfightSimulationResults.logSteps.length > 0" class="flex flex-col gap-4 font-mono text-base">
            <div 
              v-for="(step, idx) in teamfightSimulationResults.logSteps" 
              :key="idx" 
              class="bg-slate-950/80 p-4 rounded-xl border border-slate-850 flex flex-col gap-3 transition-all hover:border-slate-700"
            >
              <!-- Step Header -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 font-bold text-base">#{{ idx + 1 }}</span>
                  <span class="text-cyan-300 font-bold text-lg">{{ step.actorName }}</span>
                  <span class="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-base">{{ step.action }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-amber-400 font-extrabold text-lg">{{ step.totalStepDamage }} Total Dmg</span>
                  <button @click="removeTeamfightAction(idx)" class="text-rose-400 hover:text-rose-300 font-bold text-lg cursor-pointer">✕</button>
                </div>
              </div>

              <!-- Target Damage Breakdown Pills -->
              <div class="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                <div 
                  v-for="(res, tIdx) in step.targetResults" 
                  :key="tIdx"
                  class="flex items-center justify-between text-base"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-rose-300 font-semibold">➔ {{ res.targetName }}:</span>
                    <span 
                      class="font-bold px-2 py-0.5 rounded"
                      :class="res.type === 'physical' ? 'bg-orange-950/80 text-orange-400' : res.type === 'magic' ? 'bg-cyan-950/80 text-cyan-400' : 'bg-slate-950 text-slate-300'"
                    >
                      {{ res.amount }} {{ res.type.toUpperCase() }}
                    </span>
                    <span v-if="res.blackCleaverStacks > 0" class="text-base text-amber-400 font-semibold">[🪓 BC {{ res.blackCleaverStacks }}x]</span>
                    <span v-if="res.vileDecayStacks > 0" class="text-base text-purple-400 font-semibold">[🩸 Vile Decay {{ res.vileDecayStacks }}x]</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-base text-slate-400">HP: {{ res.remainingHp }}</span>
                    <span v-if="res.isKo" class="text-base bg-rose-500 text-slate-950 font-bold px-2 py-0.5 rounded animate-pulse">☠️ K.O.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="py-16 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 font-mono text-base">
            <span>No teamfight actions added yet.</span>
            <span class="text-slate-400 mt-2">Use the Action Creator above to build a teamfight scenario!</span>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: DEFENDER SQUAD ROSTER WITH LIVE HP BARS -->
      <div class="lg:col-span-3 flex flex-col gap-5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-base font-mono uppercase font-bold text-rose-400">Defender Squad Roster</span>
          <span class="text-base font-mono text-slate-500 font-semibold">Live Health & Shred</span>
        </div>

        <div v-for="slot in selectedDefenderSlots" :key="slot.id" class="bg-[#131926] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-lg">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="slot.champion" :src="getChampionIconUrl(slot.champion)" class="h-12 w-12 rounded-lg border border-rose-500/50 object-cover" />
              <div>
                <h4 class="text-base font-bold text-white leading-tight">{{ slot.champion?.name || 'Unassigned' }}</h4>
                <span class="text-base font-mono text-rose-400 font-semibold">{{ slot.side.toUpperCase() }} {{ slot.role }} • Lvl {{ slot.level }}</span>
              </div>
            </div>
            <button @click="openWorkbenchForSlot(slot.id)" class="text-base text-rose-400 hover:text-white font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-rose-500 transition-all cursor-pointer">
              ⚙️
            </button>
          </div>

          <!-- Live HP Bar -->
          <div class="flex flex-col gap-1.5 font-mono text-base bg-slate-950 p-3 rounded-lg border border-slate-850">
            <div class="flex items-center justify-between font-bold">
              <span class="text-slate-400">Health</span>
              <span :class="getDefenderEndState(slot.id).isKo ? 'text-rose-500 font-extrabold' : 'text-emerald-400'">
                {{ getDefenderEndState(slot.id).currentHp }} / {{ getDefenderEndState(slot.id).maxHp }}
                ({{ getDefenderEndState(slot.id).hpPct }}%)
              </span>
            </div>
            <div class="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
              <div 
                class="h-full transition-all duration-300"
                :class="getDefenderEndState(slot.id).hpPct > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : getDefenderEndState(slot.id).hpPct > 20 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-600 to-red-500'"
                :style="{ width: getDefenderEndState(slot.id).hpPct + '%' }"
              ></div>
            </div>
          </div>

          <!-- Live Effective Armor & MR after Shred -->
          <div class="grid grid-cols-2 gap-3 font-mono text-base bg-slate-950 p-3 rounded-lg border border-slate-850">
            <div class="flex flex-col">
              <span class="text-slate-500">Armor (Shred)</span>
              <span class="text-amber-400 font-bold text-lg">
                {{ getDefenderEndState(slot.id).effectiveArmor }}
                <span v-if="getDefenderEndState(slot.id).blackCleaverStacks > 0" class="text-rose-400 text-base">(-{{ getDefenderEndState(slot.id).blackCleaverStacks * 5 }}%)</span>
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-slate-500">MR (Shred)</span>
              <span class="text-purple-400 font-bold text-lg">
                {{ getDefenderEndState(slot.id).effectiveMr }}
                <span v-if="getDefenderEndState(slot.id).vileDecayStacks > 0" class="text-rose-400 text-base">(-{{ (getDefenderEndState(slot.id).vileDecayStacks * 7.5).toFixed(1) }}%)</span>
              </span>
            </div>
          </div>

          <!-- Status Badges -->
          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="getDefenderEndState(slot.id).isKo" class="bg-rose-500 text-slate-950 font-extrabold text-base px-2.5 py-1 rounded font-mono shadow animate-pulse">☠️ K.O. / ELIMINATED</span>
            <span v-if="getDefenderEndState(slot.id).blackCleaverStacks > 0" class="bg-amber-950/80 text-amber-300 border border-amber-800/60 text-base px-2.5 py-1 rounded font-mono font-bold">🪓 Black Cleaver {{ getDefenderEndState(slot.id).blackCleaverStacks }}x</span>
            <span v-if="getDefenderEndState(slot.id).vileDecayStacks > 0" class="bg-purple-950/80 text-purple-300 border border-purple-800/60 text-base px-2.5 py-1 rounded font-mono font-bold">🩸 Vile Decay {{ getDefenderEndState(slot.id).vileDecayStacks }}x</span>
          </div>
        </div>
      </div>

    </div>

    <!-- VIEW MODE 2: CHRONOLOGICAL FEED VIEW -->
    <div v-else class="flex flex-col gap-6 text-base font-mono">
      <!-- Sticky Team Health Summary Header -->
      <div class="bg-[#131926] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 sticky top-4 z-20">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <span class="text-base font-bold uppercase text-slate-300">Defender Squad Health Summary</span>
          <span class="text-base text-slate-400">Total Teamfight Damage Dealt: <strong class="text-amber-400 text-lg">{{ teamfightSimulationResults.totalTeamDamage }}</strong></span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="slot in selectedDefenderSlots" :key="slot.id" class="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-white text-base">{{ slot.champion?.name || slot.role }}</span>
              <span v-if="getDefenderEndState(slot.id).isKo" class="text-base text-rose-400 font-extrabold">K.O.</span>
            </div>
            <div class="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
              <div class="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-300" :style="{ width: getDefenderEndState(slot.id).hpPct + '%' }"></div>
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
              <span class="h-10 w-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-300 text-base">#{{ idx + 1 }}</span>
              <div class="flex items-center gap-3 text-lg">
                <span class="font-extrabold text-cyan-400">{{ step.actorName }}</span>
                <span class="text-base text-slate-400">casts</span>
                <span class="px-3.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-base">{{ step.action }}</span>
              </div>
            </div>

            <div class="flex items-center gap-5">
              <div class="flex flex-col items-end">
                <span class="text-base text-slate-400 uppercase font-semibold">AOE Step Damage</span>
                <span class="text-lg font-extrabold text-amber-400">{{ step.totalStepDamage }} Dmg</span>
              </div>
              <button @click="removeTeamfightAction(idx)" class="px-3 py-1.5 rounded bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-900/50 text-base cursor-pointer">
                Delete
              </button>
            </div>
          </div>

          <!-- Target Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div 
              v-for="(res, tIdx) in step.targetResults" 
              :key="tIdx"
              class="bg-slate-900/90 p-4 rounded-lg border border-slate-800 flex flex-col gap-2"
            >
              <div class="flex items-center justify-between text-base">
                <span class="text-rose-300 font-bold">➔ {{ res.targetName }}</span>
                <span v-if="res.isKo" class="text-base text-rose-400 font-bold">☠️ K.O.</span>
              </div>

              <div class="text-lg font-extrabold" :class="res.type === 'physical' ? 'text-orange-400' : res.type === 'magic' ? 'text-cyan-400' : 'text-slate-200'">
                +{{ res.amount }} {{ res.type.toUpperCase() }}
              </div>

              <div class="flex items-center gap-2 text-base text-slate-400 flex-wrap">
                <span>Rem. HP: {{ res.remainingHp }}</span>
                <span v-if="res.blackCleaverStacks > 0" class="text-amber-400 font-semibold">[BC {{ res.blackCleaverStacks }}x]</span>
                <span v-if="res.vileDecayStacks > 0" class="text-purple-400 font-semibold">[VD {{ res.vileDecayStacks }}x]</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="teamfightSimulationResults.logSteps.length === 0" class="py-20 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl text-slate-500 font-mono text-base">
          <span>No teamfight steps logged yet.</span>
          <span class="text-slate-400 mt-2">Use the Teamfight Action Creator to append actions step-by-step!</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDDragonStore } from '@/stores/ddragon'
import { useDraftStore } from '@/stores/draft'
import { storeToRefs } from 'pinia'
import { 
  getChampionSplashUrl, 
  getChampionIconUrl, 
  getItemIconUrl, 
  getRuneIconUrl, 
  calculateStats, 
  calculateMonsterBuffStats,
  getChampionDefaultAdaptiveType 
} from '@/services'
import type { DraftSlot } from '@/types'
import { useCalculatorStore } from '@/stores/calculator'

const router = useRouter()
const ddragonStore = useDDragonStore()
const draftStore = useDraftStore()
const calculatorStore = useCalculatorStore()

const { blueDraft, redDraft } = storeToRefs(draftStore)
const { selectCustomizerSlot } = draftStore

const {
  selectedAttackerSlotId,
  selectedDefenderSlotId,
  selectedAttackerSlotIds,
  selectedDefenderSlotIds,
  teamfightViewMode,
  teamfightActions,
  attackerBuffs,
  defenderBuffs,
} = storeToRefs(calculatorStore)

const {
  addTeamfightAction,
  removeTeamfightAction,
  clearComboSequence,
  setPresetScenario,
} = calculatorStore

// Preset Scenarios
const presetOptions = [
  { id: '1v1', label: '⚔️ 1v1 Dual' },
  { id: '1v2', label: '⚔️ 1v2 Gank' },
  { id: '2v2', label: '⚔️ 2v2 Skirmish' },
  { id: '3v3', label: '⚔️ 3v3 Dragon Fight' },
  { id: '5v5', label: '⚔️ 5v5 Full Teamfight' },
] as const

const isPresetActive = (presetId: string) => {
  if (presetId === '1v1') return selectedAttackerSlotIds.value.length === 1 && selectedDefenderSlotIds.value.length === 1
  if (presetId === '1v2') return selectedAttackerSlotIds.value.length === 1 && selectedDefenderSlotIds.value.length === 2
  if (presetId === '2v2') return selectedAttackerSlotIds.value.length === 2 && selectedDefenderSlotIds.value.length === 2
  if (presetId === '3v3') return selectedAttackerSlotIds.value.length === 3 && selectedDefenderSlotIds.value.length === 3
  if (presetId === '5v5') return selectedAttackerSlotIds.value.length === 5 && selectedDefenderSlotIds.value.length === 5
  return false
}

// Slot helpers
const selectedAttackerSlots = computed<DraftSlot[]>(() => {
  return blueDraft.value.filter(s => selectedAttackerSlotIds.value.includes(s.id))
})

const selectedDefenderSlots = computed<DraftSlot[]>(() => {
  return redDraft.value.filter(s => selectedDefenderSlotIds.value.includes(s.id))
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
  return selectedDefenderSlots.value.every(s => actionCreatorTargetIds.value.includes(s.id))
})

const toggleSelectAllTargets = () => {
  if (isAllTargetsSelected.value) {
    actionCreatorTargetIds.value = [selectedDefenderSlots.value[0]?.id || 6]
  } else {
    actionCreatorTargetIds.value = selectedDefenderSlots.value.map(s => s.id)
  }
}

const submitTeamfightAction = () => {
  addTeamfightAction(
    actionCreatorActorId.value,
    actionCreatorSpell.value,
    actionCreatorTargetIds.value
  )
}

const openWorkbenchForSlot = (slotId: number) => {
  const slot = [...blueDraft.value, ...redDraft.value].find(s => s.id === slotId)
  if (slot) selectCustomizerSlot(slot)
  router.push('/workbench')
}

// Calculated Base Stats for any slot
const getCalculatedStatsForSlot = (slot: DraftSlot) => {
  if (!slot || !slot.champion) return null
  const base = calculateStats(slot)
  if (!base) return null
  const isAttacker = blueDraft.value.some(b => b.id === slot.id)
  const mStats = calculateMonsterBuffStats(isAttacker ? attackerBuffs.value : defenderBuffs.value)

  return {
    ad: Math.round((base.ad.total + mStats.bonusAD) * mStats.adMultiplier),
    ap: Math.round((base.ap.total + mStats.bonusAP) * mStats.apMultiplier),
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
  }
}

// TEAMFIGHT SIMULATION ENGINE
const teamfightSimulationResults = computed(() => {
  const defenderStateMap: Record<number, {
    currentHp: number
    maxHp: number
    baseArmor: number
    baseMr: number
    blackCleaverStacks: number
    vileDecayStacks: number
    isKo: boolean
    name: string
  }> = {}

  const castCounters: Record<number, number> = {}

  // Initialize Defender States
  selectedDefenderSlots.value.forEach(slot => {
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
    targetResults: Array<{
      targetSlotId: number
      targetName: string
      amount: number
      type: 'physical' | 'magic' | 'true'
      effectiveArmor: number
      effectiveMr: number
      vileDecayStacks: number
      blackCleaverStacks: number
      isKo: boolean
      remainingHp: number
    }>
    totalStepDamage: number
  }> = []

  teamfightActions.value.forEach((actStep, idx) => {
    const actorSlot = blueDraft.value.find(b => b.id === actStep.actorSlotId) || selectedAttackerSlots.value[0]
    if (!actorSlot || !actorSlot.champion) return

    const att = getCalculatedStatsForSlot(actorSlot)
    if (!att) return

    const actorName = actorSlot.champion.name
    const action = actStep.action

    const hasBlackCleaver = actorSlot.items.some(i => i && (i.name.toLowerCase().includes("black cleaver") || i.id === '3071')) || false
    const hasBloodletter = actorSlot.items.some(i => i && (i.name.toLowerCase().includes("bloodletter's curse") || i.id === '8010' || i.id === '4010')) || false
    const hasAbyssalMask = actorSlot.items.some(i => i && (i.name.toLowerCase().includes("abyssal mask") || i.id === '8020' || i.id === '3001')) || false

    const isApAttacker = (att.ap > att.ad) || getChampionDefaultAdaptiveType(actorSlot.champion.id, actorSlot.champion.tags) === 'AP'

    // Seraphine Stage Presence: Every 3rd basic ability cast is echoed
    let isEchoCast = false
    if (actorSlot.champion.id === 'Seraphine' && ['Q', 'W', 'E'].includes(action)) {
      const currentVal = castCounters[actorSlot.id] || 0
      castCounters[actorSlot.id] = currentVal + 1
      if ((currentVal + 1) % 3 === 0) {
        isEchoCast = true
      }
    }

    let stepTotalDmg = 0
    const targetResults: any[] = []

    const executeActionForTargets = (isEcho: boolean) => {
      actStep.targetSlotIds.forEach(targetId => {
        const defState = defenderStateMap[targetId]
        if (!defState) return

        // Stack shred items on hit
        if (['Q', 'W', 'E', 'R', 'P', 'AA'].includes(action)) {
          if (!isApAttacker && hasBlackCleaver && defState.blackCleaverStacks < 6) defState.blackCleaverStacks++
          if (isApAttacker && hasBloodletter && defState.vileDecayStacks < 4) defState.vileDecayStacks++
        }

        // Calculate post-shred effective resists
        const effArmor = Math.max(0, defState.baseArmor * (1 - defState.blackCleaverStacks * 0.05) * (1 - att.armorPen / 100) - att.lethality)
        const physMult = 100 / (100 + effArmor)

        const effMr = Math.max(0, defState.baseMr * (1 - defState.vileDecayStacks * 0.075) * (1 - att.magicPenPercent / 100) - att.magicPenFlat)
        const magicMult = (100 / (100 + effMr)) * (hasAbyssalMask ? 1.12 : 1.0)

        let rawDmg = 0
        let dmgType: 'physical' | 'magic' | 'true' = isApAttacker ? 'magic' : 'physical'
        let hitMult = isApAttacker ? magicMult : physMult

        // Missing HP ratio for execution / Seraphine Q spells
        const missingHpPct = Math.max(0, Math.min(100, ((defState.maxHp - defState.currentHp) / defState.maxHp) * 100))

        if (actorSlot.champion?.id === 'Seraphine' && action === 'Q') {
          const missingAmp = (Math.min(75, missingHpPct) / 75) * 0.75
          rawDmg = (120 + att.ap * 0.60) * (1 + missingAmp)
          dmgType = 'magic'
          hitMult = magicMult
        } else if (actorSlot.champion?.id === 'Amumu' && action === 'W') {
          const wRank = actorSlot.spellRanks?.w || (actorSlot.level >= 9 ? 5 : Math.max(1, Math.min(5, Math.ceil(actorSlot.level / 2))))
          const baseDmgSec = 10 // 5 per 0.5s tick = 10 per sec
          const baseHpPctSec = [1, 1.25, 1.5, 1.75, 2][wRank - 1] || 1 // (0.5% .. 1% per 0.5s tick) * 2
          const apBonusHpPctSec = att.ap * 0.005 // +0.25% per 100 AP per 0.5s tick = +0.5% per 100 AP per sec
          const totalHpPctSec = baseHpPctSec + apBonusHpPctSec
          const hpDmgSec = (totalHpPctSec / 100) * defState.maxHp
          rawDmg = baseDmgSec + hpDmgSec
          dmgType = 'magic'
          hitMult = magicMult
        } else if (actorSlot.champion?.id === 'Amumu' && action === 'Q') {
          const qRank = actorSlot.spellRanks?.q || 5
          const baseDmg = [70, 95, 120, 145, 170][qRank - 1] || 70
          rawDmg = baseDmg + att.ap * 0.85
          dmgType = 'magic'
          hitMult = magicMult
        } else if (actorSlot.champion?.id === 'Amumu' && action === 'E') {
          const eRank = actorSlot.spellRanks?.e || 5
          const baseDmg = [65, 100, 135, 170, 205][eRank - 1] || 65
          rawDmg = baseDmg + att.ap * 0.50
          dmgType = 'magic'
          hitMult = magicMult
        } else if (actorSlot.champion?.id === 'Amumu' && action === 'R') {
          const rRank = actorSlot.spellRanks?.r || 3
          const baseDmg = [150, 250, 350][rRank - 1] || 150
          rawDmg = baseDmg + att.ap * 0.80
          dmgType = 'magic'
          hitMult = magicMult
        } else if (action === 'AA') {
          rawDmg = att.ad * (att.crit > 0 ? 1.75 : 1.0)
          dmgType = 'physical'
          hitMult = physMult
        } else {
          rawDmg = isApAttacker ? (180 + att.ap * 0.70) : (160 + att.ad * 0.75)
        }

        const finalDmg = Math.round(rawDmg * hitMult)
        defState.currentHp = Math.max(0, defState.currentHp - finalDmg)
        if (defState.currentHp === 0) defState.isKo = true

        stepTotalDmg += finalDmg
        totalTeamDamage += finalDmg

        targetResults.push({
          targetSlotId: targetId,
          targetName: isEcho ? `${defState.name} (Echo)` : defState.name,
          amount: finalDmg,
          type: dmgType,
          effectiveArmor: Math.round(effArmor),
          effectiveMr: Math.round(effMr),
          blackCleaverStacks: defState.blackCleaverStacks,
          vileDecayStacks: defState.vileDecayStacks,
          isKo: defState.isKo,
          remainingHp: defState.currentHp,
        })
      })
    }

    // First cast (Normal)
    executeActionForTargets(false)

    // Second cast (Echo)
    if (isEchoCast) {
      executeActionForTargets(true)
    }

    logSteps.push({
      stepIndex: idx + 1,
      actorSlotId: actStep.actorSlotId,
      actorName,
      action: isEchoCast ? `${action} + 🎶 Echo` : action,
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
    return { currentHp: 1000, maxHp: 1000, hpPct: 100, effectiveArmor: 50, effectiveMr: 40, blackCleaverStacks: 0, vileDecayStacks: 0, isKo: false }
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
