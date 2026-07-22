import type { Champion } from '../champions'
import type { Item } from '../items'
import type { RuneKeystone, Rune } from '../runes'

export interface DraftSlot {
  id: number
  side: 'blue' | 'red'
  role: 'Top' | 'Jungle' | 'Mid' | 'Bot' | 'Support'
  champion: Champion | null
  level: number
  items: (Item | null)[]
  masterworkItems?: boolean[]
  spellRanks?: { q: number; w: number; e: number; r: number }

  // Runes Setup
  primaryPath: RuneKeystone | null
  primaryKeystone: Rune | null
  primaryRune1: Rune | null
  primaryRune2: Rune | null
  primaryRune3: Rune | null

  secondaryPath: RuneKeystone | null
  secondaryRune1: Rune | null
  secondaryRune2: Rune | null

  // Stat Shards
  shardOffensive: 'adaptive' | 'as' | 'haste' | null
  shardFlex: 'adaptive' | 'ms' | 'scaling_hp' | null
  shardDefensive: 'scaling_hp' | 'tenacity' | 'flat_hp' | null
}

export interface SummonerSlot {
  id: string
  champion: Champion | null
  level: number
  items: (Item | null)[]
  primaryPath: RuneKeystone | null
  primaryRunes: (Rune | null)[]
  secondaryPath: RuneKeystone | null
  secondaryRunes: (Rune | null)[]
  shards: (any | null)[]
}
