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
  magicResist: number
  magicResistPerLevel: number
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
  attackspeedratio: number
}

export interface ChampionSpells {
  id: string
  name: string
  description: string
  tooltip: string
  cooldown: number[]
  cooldownBurn: string
  cost: number[]
  costBurn: string
  image: ChampionImage
}

export interface ChampionPassive {
  name: string
  description: string
  image: ChampionImage
}

export interface Champion {
  id: string
  key: string
  name: string
  image: ChampionImage
  stats: ChampionStats
  spells: ChampionSpells[]
  passive: ChampionPassive
  tags: string[]
  partype: string
}
