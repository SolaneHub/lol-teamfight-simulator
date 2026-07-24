<template>
  <div
    class="bg-[#0b0f17] text-[#f1f5f9] min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
    <!-- HEADER -->
    <header
      class="border-b border-slate-800 bg-[#0f1422]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex flex-col md:grid md:grid-cols-3 items-center gap-4 md:gap-0">
      <!-- Brand Logo / Title -->
      <div class="flex items-center gap-3 justify-start w-full md:w-auto">
        <div
          class="h-10 w-10 rounded-lg bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg tracking-wider shadow-lg shadow-cyan-500/20 text-white">
          LoL
        </div>
        <div>
          <h1 class="text-lg font-semibold tracking-wide text-white">
            Simulator Sandbox & Browser
          </h1>
          <p class="text-base text-cyan-400 font-mono">Vite + Vue 3 + Tailwind v4</p>
        </div>
      </div>

      <!-- Center: Tab Navigation -->
      <div class="flex justify-center w-full md:w-auto">
        <div class="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <router-link to="/" v-slot="{ isActive, navigate }">
            <button @click="navigate" :class="isActive
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              " class="px-4 py-1.5 rounded-md text-base font-semibold transition-all cursor-pointer">
              🏆 Draft Simulator
            </button>
          </router-link>
          <router-link to="/workbench" v-slot="{ isActive, navigate }">
            <button @click="navigate" :class="isActive
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              " class="px-4 py-1.5 rounded-md text-base font-semibold transition-all cursor-pointer">
              ⚙️ Build Workbench
            </button>
          </router-link>
          <router-link to="/calculator" v-slot="{ isActive, navigate }">
            <button @click="navigate" :class="isActive
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
              " class="px-4 py-1.5 rounded-md text-base font-semibold transition-all cursor-pointer">
              ⚔️ Damage Calculator
            </button>
          </router-link>
        </div>
      </div>

      <!-- Right Spacer to balance the grid -->
      <div class="hidden md:block"></div>
    </header>

    <!-- CONTENT PANELS -->
    <main class="grow flex flex-col min-h-0 w-full">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDDragonStore } from '@/stores/ddragon'

const ddragonStore = useDDragonStore()

onMounted(() => {
  ddragonStore.loadData()
})
</script>
