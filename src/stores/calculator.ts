import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface SideBuffState {
  red: boolean
  blue: boolean
  baron: boolean
  elder: boolean
  infernal: number
  mountain: number
  ocean: number
  cloud: number
  hextech: number
  chemtech: number
  soul: string
}

export interface TeamfightAction {
  id: string
  actorSlotId: number
  action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'
  targetSlotIds: number[]
}

export const useCalculatorStore = defineStore('calculator', () => {
  const selectedAttackerSlotId = ref<number>(1) // Default Blue Top
  const selectedDefenderSlotId = ref<number>(6) // Default Red Top

  // Multi-champion teamfight slot selections
  const selectedAttackerSlotIds = ref<number[]>([1])
  const selectedDefenderSlotIds = ref<number[]>([6])

  // UI view mode: 'split' (3-column) vs 'feed' (chronological timeline)
  const teamfightViewMode = ref<'split' | 'feed'>('split')

  const comboSequence = ref<string[]>([])
  const teamfightActions = ref<TeamfightAction[]>([])

  const attackerBuffs = ref<SideBuffState>({
    red: false,
    blue: false,
    baron: false,
    elder: false,
    infernal: 0,
    mountain: 0,
    ocean: 0,
    cloud: 0,
    hextech: 0,
    chemtech: 0,
    soul: 'none',
  })

  const defenderBuffs = ref<SideBuffState>({
    red: false,
    blue: false,
    baron: false,
    elder: false,
    infernal: 0,
    mountain: 0,
    ocean: 0,
    cloud: 0,
    hextech: 0,
    chemtech: 0,
    soul: 'none',
  })

  // LocalStorage Persistence
  const savedCalc = typeof localStorage !== 'undefined' ? localStorage.getItem('lol_sim_calculator') : null
  if (savedCalc) {
    try {
      const parsed = JSON.parse(savedCalc)
      if (parsed.selectedAttackerSlotId) selectedAttackerSlotId.value = parsed.selectedAttackerSlotId
      if (parsed.selectedDefenderSlotId) selectedDefenderSlotId.value = parsed.selectedDefenderSlotId
      if (parsed.selectedAttackerSlotIds && Array.isArray(parsed.selectedAttackerSlotIds)) selectedAttackerSlotIds.value = parsed.selectedAttackerSlotIds
      if (parsed.selectedDefenderSlotIds && Array.isArray(parsed.selectedDefenderSlotIds)) selectedDefenderSlotIds.value = parsed.selectedDefenderSlotIds
      if (parsed.teamfightActions && Array.isArray(parsed.teamfightActions)) teamfightActions.value = parsed.teamfightActions
      if (parsed.attackerBuffs) attackerBuffs.value = parsed.attackerBuffs
      if (parsed.defenderBuffs) defenderBuffs.value = parsed.defenderBuffs
    } catch (e) {
      console.error('Failed to restore calculator state', e)
    }
  }

  watch(
    [selectedAttackerSlotId, selectedDefenderSlotId, selectedAttackerSlotIds, selectedDefenderSlotIds, teamfightActions, attackerBuffs, defenderBuffs],
    () => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lol_sim_calculator', JSON.stringify({
          selectedAttackerSlotId: selectedAttackerSlotId.value,
          selectedDefenderSlotId: selectedDefenderSlotId.value,
          selectedAttackerSlotIds: selectedAttackerSlotIds.value,
          selectedDefenderSlotIds: selectedDefenderSlotIds.value,
          teamfightActions: teamfightActions.value,
          attackerBuffs: attackerBuffs.value,
          defenderBuffs: defenderBuffs.value,
        }))
      }
    },
    { deep: true, immediate: true }
  )

  const addActionToCombo = (action: string) => {
    comboSequence.value.push(action)
    // Also push to teamfightActions for active attacker -> active defender
    teamfightActions.value.push({
      id: Math.random().toString(36).substring(2, 9),
      actorSlotId: selectedAttackerSlotId.value,
      action: action as any,
      targetSlotIds: [...selectedDefenderSlotIds.value],
    })
  }

  const addTeamfightAction = (actorSlotId: number, action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA', targetSlotIds: number[]) => {
    teamfightActions.value.push({
      id: Math.random().toString(36).substring(2, 9),
      actorSlotId,
      action,
      targetSlotIds: targetSlotIds.length > 0 ? targetSlotIds : [...selectedDefenderSlotIds.value],
    })
  }

  const removeTeamfightAction = (index: number) => {
    if (index >= 0 && index < teamfightActions.value.length) {
      teamfightActions.value.splice(index, 1)
    }
  }

  const removeActionFromCombo = (index: number) => {
    comboSequence.value.splice(index, 1)
    if (index >= 0 && index < teamfightActions.value.length) {
      teamfightActions.value.splice(index, 1)
    }
  }

  const clearComboSequence = () => {
    comboSequence.value = []
    teamfightActions.value = []
  }

  const setPresetScenario = (scenario: '1v1' | '1v2' | '2v2' | '3v3' | '5v5') => {
    if (scenario === '1v1') {
      selectedAttackerSlotIds.value = [1]
      selectedDefenderSlotIds.value = [6]
    } else if (scenario === '1v2') {
      selectedAttackerSlotIds.value = [1]
      selectedDefenderSlotIds.value = [6, 7]
    } else if (scenario === '2v2') {
      selectedAttackerSlotIds.value = [1, 2]
      selectedDefenderSlotIds.value = [6, 7]
    } else if (scenario === '3v3') {
      selectedAttackerSlotIds.value = [1, 2, 3]
      selectedDefenderSlotIds.value = [6, 7, 8]
    } else if (scenario === '5v5') {
      selectedAttackerSlotIds.value = [1, 2, 3, 4, 5]
      selectedDefenderSlotIds.value = [6, 7, 8, 9, 10]
    }
    selectedAttackerSlotId.value = selectedAttackerSlotIds.value[0] || 1
    selectedDefenderSlotId.value = selectedDefenderSlotIds.value[0] || 6
  }

  return {
    selectedAttackerSlotId,
    selectedDefenderSlotId,
    selectedAttackerSlotIds,
    selectedDefenderSlotIds,
    teamfightViewMode,
    comboSequence,
    teamfightActions,
    attackerBuffs,
    defenderBuffs,
    addActionToCombo,
    addTeamfightAction,
    removeTeamfightAction,
    removeActionFromCombo,
    clearComboSequence,
    setPresetScenario,
  }
})
