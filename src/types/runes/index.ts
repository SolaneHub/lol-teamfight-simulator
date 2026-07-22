export interface Rune {
  id: number
  key: string
  icon: string
  name: string
  shortDesc: string
  longDesc: string
}

export interface RuneSlot {
  runes: Rune[]
}

export interface RuneKeystone {
  id: number
  key: string
  icon: string
  name: string
  slots: RuneSlot[]
}

export interface StatShard {
  id: string
  name: string
  icon: string
  value: number
  type: 'adaptive' | 'attackspeed' | 'ah' | 'armor' | 'mr' | 'health_scaling' | 'health_flat' | 'ms'
}
