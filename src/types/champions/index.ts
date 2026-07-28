export interface ChampionImage {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

export interface ChampionStats {
  hp: number
  hpperlevel: number
  mp: number
  mpperlevel: number
  movespeed: number
  armor: number
  armorperlevel: number
  spellblock?: number
  spellblockperlevel?: number
  magicResist?: number
  magicResistPerLevel?: number
  attackrange: number
  hpregen: number
  hpregenperlevel: number
  mpregen: number
  mpregenperlevel: number
  crit: number
  critperlevel: number
  attackdamage: number
  attackdamageperlevel: number
  attackspeedperlevel: number
  attackspeed: number
  attackspeedratio?: number
}

export interface ChampionSpells {
  id: string
  name: string
  description: string
  tooltip?: string
  icon?: string
  cooldown?: number[]
  cooldownBurn?: string
  cost?: number[]
  costBurn?: string
  image?: ChampionImage
  maxrank?: number
  effect?: (number[] | null)[]
  vars?: Record<string, unknown>[]
}

export interface ChampionPassive {
  name: string
  description: string
  icon?: string
  image?: ChampionImage
}

export interface Champion {
  id: string
  key: string
  name: string
  title?: string
  icon?: string
  image?: ChampionImage
  stats: ChampionStats
  spells: ChampionSpells[]
  passive: ChampionPassive
  tags?: string[]
  partype?: string
}
