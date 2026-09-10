import type { DraftSlot, Rune } from '@/types'

export interface StackableRuneInfo {
  key: string
  name: string
  icon: string
  min: number
  max: number
  default: number
  unit?: string
  description: (stacks: number, isMelee?: boolean) => string
}

export const STACKABLE_RUNES: Record<string, Omit<StackableRuneInfo, 'key'>> = {
  darkHarvest: {
    name: 'Dark Harvest',
    icon: 'cdragon/runes/images/styles/domination/darkharvest/darkharvest.png',
    min: 0,
    max: 99,
    default: 0,
    description: (s) => `+${s * 9} Soul Dmg`,
  },
  grasp: {
    name: 'Grasp of the Undying',
    icon: 'cdragon/runes/images/styles/resolve/graspoftheundying/graspoftheundying.png',
    min: 0,
    max: 99,
    default: 0,
    description: (s, isMelee) => `+${s * (isMelee ? 7 : 4)} Max HP`,
  },
  conqueror: {
    name: 'Conqueror',
    icon: 'cdragon/runes/images/styles/precision/conqueror/conqueror.png',
    min: 0,
    max: 12,
    default: 12,
    description: (s) => `${s} Stacks${s === 12 ? ' (Max Vamp)' : ''}`,
  },
  lethalTempo: {
    name: 'Lethal Tempo',
    icon: 'cdragon/runes/images/styles/precision/lethaltempo/lethaltempotemp.png',
    min: 0,
    max: 6,
    default: 6,
    description: (s) => `${s} Stacks${s === 6 ? ' (On-Hit Active)' : ''}`,
  },
  legendAlacrity: {
    name: 'Legend: Alacrity',
    icon: 'cdragon/runes/images/styles/precision/legendalacrity/legendalacrity.png',
    min: 0,
    max: 10,
    default: 10,
    description: (s) => `+${(3 + s * 1.5).toFixed(1)}% AS`,
  },
  legendBloodline: {
    name: 'Legend: Bloodline',
    icon: 'cdragon/runes/images/styles/precision/legendbloodline/legendbloodline.png',
    min: 0,
    max: 15,
    default: 15,
    description: (s) => `+${(s * 0.35).toFixed(2)}% LS${s >= 15 ? ' (+85 HP)' : ''}`,
  },
  legendHaste: {
    name: 'Legend: Haste',
    icon: 'cdragon/runes/images/styles/precision/legendhaste/legendhaste.png',
    min: 0,
    max: 10,
    default: 10,
    description: (s) => `+${(s * 1.5).toFixed(1)} Basic AH`,
  },
  eyeball: {
    name: 'Eyeball / Ward Bounty',
    icon: 'cdragon/runes/images/styles/domination/eyeballcollection/eyeballcollection.png',
    min: 0,
    max: 10,
    default: 10,
    description: (s) => `${s} Stacks (${s === 10 ? '+30 AP / 18 AD' : `+${s * 2} AP`})`,
  },
  overgrowth: {
    name: 'Overgrowth',
    icon: 'cdragon/runes/images/styles/resolve/overgrowth/overgrowth.png',
    min: 0,
    max: 50,
    default: 15,
    description: (s) => `+${s * 3} HP${s >= 15 ? ' (+3.5% Max HP)' : ''}`,
  },
  jackOfAllTrades: {
    name: 'Jack of All Trades',
    icon: 'cdragon/runes/images/styles/inspiration/jackofalltrades/jackofalltrades2.png',
    min: 0,
    max: 10,
    default: 5,
    description: (s) => `+${s} AH${s >= 10 ? ' (+25 AP / 15 AD)' : s >= 5 ? ' (+10 AP / 6 AD)' : ''}`,
  },
  gatheringStorm: {
    name: 'Gathering Storm',
    icon: 'cdragon/runes/images/styles/sorcery/gatheringstorm/gatheringstorm.png',
    min: 0,
    max: 60,
    default: 20,
    unit: 'm',
    description: (s) => `${s} min`,
  },
}

export function detectRuneKey(rune: Rune | null | undefined): string | null {
  if (!rune) return null
  const name = (rune.name || '').toLowerCase()
  const key = (rune.key || '').toLowerCase()
  const id = rune.id

  if (name.includes('dark harvest') || key.includes('darkharvest') || id === 8128) return 'darkHarvest'
  if (name.includes('grasp of the undying') || key.includes('graspoftheundying') || id === 8437) return 'grasp'
  if (name.includes('conqueror') || id === 8010) return 'conqueror'
  if (name.includes('lethal tempo') || id === 8008) return 'lethalTempo'
  if (name.includes('legend: alacrity') || name.includes('alacrity') || id === 9104) return 'legendAlacrity'
  if (name.includes('legend: bloodline') || name.includes('bloodline') || id === 9103) return 'legendBloodline'
  if (name.includes('legend: haste') || (name.includes('haste') && name.includes('legend')) || id === 9105) return 'legendHaste'
  if (name.includes('eyeball collection') || name.includes('ghost poro') || name.includes('zombie ward') || [8138, 8120, 8136].includes(id)) return 'eyeball'
  if (name.includes('overgrowth') || id === 8451) return 'overgrowth'
  if (name.includes('jack of all trades') || key.includes('jackofalltrades') || id === 8306) return 'jackOfAllTrades'
  if (name.includes('gathering storm') || id === 8237) return 'gatheringStorm'

  return null
}

export function getEquippedStackableRunes(slot: DraftSlot): StackableRuneInfo[] {
  const activeRunes: (Rune | null | undefined)[] = [
    slot.primaryKeystone,
    slot.primaryRune1,
    slot.primaryRune2,
    slot.primaryRune3,
    slot.secondaryRune1,
    slot.secondaryRune2,
    ...(slot.runes || []),
  ]

  const detectedKeys = new Set<string>()
  const result: StackableRuneInfo[] = []

  for (const rune of activeRunes) {
    const key = detectRuneKey(rune)
    if (key && !detectedKeys.has(key) && STACKABLE_RUNES[key]) {
      detectedKeys.add(key)
      result.push({
        key,
        ...STACKABLE_RUNES[key]!,
      })
    }
  }

  return result
}

export function getRuneStackValue(slot: DraftSlot, key: string): number {
  if (slot.runeStacks?.[key] !== undefined) {
    return slot.runeStacks[key]!
  }
  // Backwards compatibility with dedicated fields if present
  if (key === 'conqueror' && slot.conquerorStacks !== undefined) return slot.conquerorStacks
  if (key === 'lethalTempo' && slot.lethalTempoStacks !== undefined) return slot.lethalTempoStacks
  if (key === 'darkHarvest' && slot.darkHarvestStacks !== undefined) return slot.darkHarvestStacks

  const def = STACKABLE_RUNES[key]
  return def ? def.default : 0
}
