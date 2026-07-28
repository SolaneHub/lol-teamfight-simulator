<template>
  <div v-if="activeCustomizerStats" class="flex flex-col gap-2 border-t border-slate-800/80 pt-5">
    <slot name="label">
      <label class="text-base text-slate-400 uppercase tracking-widest font-mono font-bold"
        >Computed Custom Stats</label
      >
    </slot>

    <div class="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden">
      <table class="w-full text-left text-base font-mono">
        <thead class="bg-slate-900/60 text-slate-400 border-b border-slate-900">
          <tr>
            <th class="px-4 py-2 text-slate-400">Stat</th>
            <th class="px-4 py-2 text-slate-400 text-right">Base</th>
            <th class="px-4 py-2 text-slate-400 text-right">Bonus (Items)</th>
            <th class="px-4 py-2 text-slate-300 text-right">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-900/40">
          <!-- HP -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Health (HP)</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.hp.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{ activeCustomizerStats.hp.bonus > 0 ? '+' + activeCustomizerStats.hp.bonus : '-' }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.hp.total }}
            </td>
          </tr>

          <!-- MP -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">
              {{ activeCustomizerStats.partype || 'Mana' }}
            </td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.mp.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{ activeCustomizerStats.mp.bonus > 0 ? '+' + activeCustomizerStats.mp.bonus : '-' }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.mp.total }}
            </td>
          </tr>

          <!-- AD -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Attack Damage (AD)</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.ad.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{ activeCustomizerStats.ad.bonus > 0 ? '+' + activeCustomizerStats.ad.bonus : '-' }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.ad.total }}
            </td>
          </tr>

          <!-- AP -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Ability Power (AP)</td>
            <td class="px-4 py-2 text-right text-slate-400">-</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{ activeCustomizerStats.ap.bonus > 0 ? '+' + activeCustomizerStats.ap.bonus : '-' }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.ap.total }}
            </td>
          </tr>

          <!-- Armor -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Armor</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.armor.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.armor.bonus > 0
                  ? '+' + activeCustomizerStats.armor.bonus
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.armor.total }}
            </td>
          </tr>

          <!-- MR -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Magic Resist (MR)</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.mr.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{ activeCustomizerStats.mr.bonus > 0 ? '+' + activeCustomizerStats.mr.bonus : '-' }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.mr.total }}
            </td>
          </tr>

          <!-- AS -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Attack Speed (AS)</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.as.base.toFixed(3) }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.as.bonus > 0
                  ? '+' + activeCustomizerStats.as.bonus.toFixed(3)
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.as.total.toFixed(3) }}
            </td>
          </tr>

          <!-- MS -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Move Speed (MS)</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.ms.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{ activeCustomizerStats.ms.bonus > 0 ? '+' + activeCustomizerStats.ms.bonus : '-' }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.ms.total }}
            </td>
          </tr>

          <!-- AH -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Ability Haste (AH)</td>
            <td class="px-4 py-2 text-right text-slate-400">0</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.abilityHaste.bonus > 0
                  ? '+' + activeCustomizerStats.abilityHaste.bonus
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.abilityHaste.total }}
              <span
                v-if="activeCustomizerStats.abilityHaste.total > 0"
                class="text-slate-400 text-base font-normal ml-1"
              >
                ({{
                  Math.round((1 - 100 / (100 + activeCustomizerStats.abilityHaste.total)) * 100)
                }}% CDR)
              </span>
            </td>
          </tr>

          <!-- Crit -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Critical Strike Chance</td>
            <td class="px-4 py-2 text-right text-slate-400">0%</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.crit.bonus > 0
                  ? '+' + activeCustomizerStats.crit.bonus + '%'
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.crit.total }}%
            </td>
          </tr>

          <!-- Lethality -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Lethality</td>
            <td class="px-4 py-2 text-right text-slate-400">0</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.lethality.bonus > 0
                  ? '+' + activeCustomizerStats.lethality.bonus
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.lethality.total }}
            </td>
          </tr>

          <!-- Armor Pen -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Armor Penetration (%)</td>
            <td class="px-4 py-2 text-right text-slate-400">0%</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.armorPen.bonus > 0
                  ? '+' + activeCustomizerStats.armorPen.bonus + '%'
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.armorPen.total }}%
            </td>
          </tr>

          <!-- Magic Pen Flat -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Magic Penetration (Flat)</td>
            <td class="px-4 py-2 text-right text-slate-400">0</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.magicPenFlat.bonus > 0
                  ? '+' + activeCustomizerStats.magicPenFlat.bonus
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.magicPenFlat.total }}
            </td>
          </tr>

          <!-- Magic Pen % -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Magic Penetration (%)</td>
            <td class="px-4 py-2 text-right text-slate-400">0%</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.magicPenPercent.bonus > 0
                  ? '+' + activeCustomizerStats.magicPenPercent.bonus + '%'
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.magicPenPercent.total }}%
            </td>
          </tr>

          <!-- Life Steal -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Life Steal</td>
            <td class="px-4 py-2 text-right text-slate-400">0%</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.lifeSteal.bonus > 0
                  ? '+' + activeCustomizerStats.lifeSteal.bonus + '%'
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.lifeSteal.total }}%
            </td>
          </tr>

          <!-- Omnivamp -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Omnivamp</td>
            <td class="px-4 py-2 text-right text-slate-400">0%</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.omnivamp.bonus > 0
                  ? '+' + activeCustomizerStats.omnivamp.bonus + '%'
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.omnivamp.total }}%
            </td>
          </tr>

          <!-- Tenacity -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Tenacity & Slow Res.</td>
            <td class="px-4 py-2 text-right text-slate-400">0%</td>
            <td class="px-4 py-2 text-right text-emerald-500">
              {{
                activeCustomizerStats.tenacity.bonus > 0
                  ? '+' + activeCustomizerStats.tenacity.bonus + '%'
                  : '-'
              }}
            </td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.tenacity.total }}%
            </td>
          </tr>

          <!-- Range -->
          <tr>
            <td class="px-4 py-2 font-semibold text-slate-300">Attack Range</td>
            <td class="px-4 py-2 text-right text-slate-400">
              {{ activeCustomizerStats.range.base }}
            </td>
            <td class="px-4 py-2 text-right text-emerald-500">-</td>
            <td class="px-4 py-2 text-right font-bold text-white">
              {{ activeCustomizerStats.range.total }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { calculateStats } from '@/services'

defineProps<{
  activeCustomizerStats: ReturnType<typeof calculateStats> | null
}>()
</script>
