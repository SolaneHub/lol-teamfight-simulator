/**
 * Champion Implementation & Verification Registry.
 * Tracks which champions have verified combat mechanics, custom spell formulas,
 * specific dynamic HP/execute scaling, or dedicated test suites.
 */

export type ChampionStatus = 'fully_implemented' | 'partially_implemented' | 'testing'

export interface ChampionImplementationEntry {
  id: string
  name: string
  status: ChampionStatus
  role: string
  hasCustomSpells: boolean
  hasDoT: boolean
  hasCustomPassive: boolean
  hasTests: boolean
  description: string
  testFiles: string[]
}

export const IMPLEMENTED_CHAMPIONS: Record<string, ChampionImplementationEntry> = {
  Seraphine: {
    id: 'Seraphine',
    name: 'Seraphine',
    status: 'fully_implemented',
    role: 'Mid / Support',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Full custom suite: Q missing HP amp (+75%), Echo passive casting, W shield/heal, E CC, R charm, optimizer and rune solvers.',
    testFiles: [
      'src/__tests__/seraphine-complete-loadouts.test.ts',
      'src/__tests__/seraphine-optimizer.test.ts',
      'src/__tests__/seraphine-real-champions.test.ts',
      'src/__tests__/seraphine-runes.test.ts',
      'src/__tests__/recommend-loadout.test.ts',
    ],
  },
  Aatrox: {
    id: 'Aatrox',
    name: 'Aatrox',
    status: 'fully_implemented',
    role: 'Top',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Deathbringer Stance max HP % passive, Q1/Q2/Q3 sweetspot sequence multipliers (1.6x), build stats verification.',
    testFiles: [
      'src/__tests__/champion-builds.test.ts',
      'src/__tests__/spell-calculator.test.ts',
      'src/__tests__/combat-simulation.test.ts',
    ],
  },
  JarvanIV: {
    id: 'JarvanIV',
    name: 'Jarvan IV',
    status: 'fully_implemented',
    role: 'Jungle',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Martial Cadence % current HP on-hit passive, full spell damage scaling (Q/W/E/R) and shield calculations.',
    testFiles: [
      'src/__tests__/spell-calculator.test.ts',
      'src/__tests__/calculator-damage-display.test.ts',
      'src/__tests__/combat-simulation.test.ts',
    ],
  },
  Darius: {
    id: 'Darius',
    name: 'Darius',
    status: 'fully_implemented',
    role: 'Top',
    hasCustomSpells: true,
    hasDoT: true,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Hemorrhage 5-stack bleed DoT with physical damage ticking, Noxian Might, Q Decimate blade hit detection, combat DPS simulation.',
    testFiles: ['src/__tests__/combat-simulation.test.ts'],
  },
  Garen: {
    id: 'Garen',
    name: 'Garen',
    status: 'partially_implemented',
    role: 'Top',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description:
      'Demacian Justice R true damage execute scaling with 25-35% missing HP, combat damage verified.',
    testFiles: [
      'src/__tests__/spell-calculator.test.ts',
      'src/__tests__/combat-simulation.test.ts',
    ],
  },
  Veigar: {
    id: 'Veigar',
    name: 'Veigar',
    status: 'partially_implemented',
    role: 'Mid',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description:
      'Primordial Burst R dynamic missing HP amplification scaling (up to +100% damage below 33% HP).',
    testFiles: ['src/__tests__/spell-calculator.test.ts'],
  },
  Jinx: {
    id: 'Jinx',
    name: 'Jinx',
    status: 'partially_implemented',
    role: 'ADC',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description:
      'Super Mega Death Rocket! R missing HP execute physical damage (25-35%), ADC item builds verified.',
    testFiles: ['src/__tests__/spell-calculator.test.ts', 'src/__tests__/champion-builds.test.ts'],
  },
  Akali: {
    id: 'Akali',
    name: 'Akali',
    status: 'partially_implemented',
    role: 'Mid / Top',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description:
      'Perfect Execution R2 missing HP execute damage amplification (up to +200% bonus below 30% HP).',
    testFiles: ['src/__tests__/spell-calculator.test.ts'],
  },
  Riven: {
    id: 'Riven',
    name: 'Riven',
    status: 'partially_implemented',
    role: 'Top',
    hasCustomSpells: true,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description:
      'Wind Slash R2 missing HP execute damage amplification (up to +200% bonus below 25% HP).',
    testFiles: ['src/__tests__/spell-calculator.test.ts'],
  },
  Brand: {
    id: 'Brand',
    name: 'Brand',
    status: 'partially_implemented',
    role: 'Support / Mid',
    hasCustomSpells: true,
    hasDoT: true,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Blaze passive 3-stack ticking magic DoT and explosive area detonation in combat simulation engine.',
    testFiles: ['src/__tests__/combat-simulation.test.ts'],
  },
  Teemo: {
    id: 'Teemo',
    name: 'Teemo',
    status: 'partially_implemented',
    role: 'Top',
    hasCustomSpells: true,
    hasDoT: true,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Toxic Shot on-hit poison magic damage DoT with continuous tick interval in combat simulation engine.',
    testFiles: ['src/__tests__/combat-simulation.test.ts'],
  },
  Cassiopeia: {
    id: 'Cassiopeia',
    name: 'Cassiopeia',
    status: 'partially_implemented',
    role: 'Mid',
    hasCustomSpells: true,
    hasDoT: true,
    hasCustomPassive: true,
    hasTests: true,
    description: 'Noxious Blast Q ticking poison magic damage DoT in combat simulation engine.',
    testFiles: ['src/__tests__/combat-simulation.test.ts'],
  },
  Twitch: {
    id: 'Twitch',
    name: 'Twitch',
    status: 'partially_implemented',
    role: 'ADC',
    hasCustomSpells: true,
    hasDoT: true,
    hasCustomPassive: true,
    hasTests: true,
    description:
      'Deadly Venom stacking true damage DoT per auto-attack in combat simulation engine.',
    testFiles: ['src/__tests__/combat-simulation.test.ts'],
  },
  Malzahar: {
    id: 'Malzahar',
    name: 'Malzahar',
    status: 'partially_implemented',
    role: 'Mid',
    hasCustomSpells: true,
    hasDoT: true,
    hasCustomPassive: true,
    hasTests: true,
    description: 'Malefic Visions E ticking magic damage DoT in combat simulation engine.',
    testFiles: ['src/__tests__/combat-simulation.test.ts'],
  },
  Ahri: {
    id: 'Ahri',
    name: 'Ahri',
    status: 'testing',
    role: 'Mid',
    hasCustomSpells: false,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description:
      'Baseline AP mage stat scaling and full legendary build verification tested in test suite.',
    testFiles: ['src/__tests__/champion-builds.test.ts'],
  },
  Malphite: {
    id: 'Malphite',
    name: 'Malphite',
    status: 'testing',
    role: 'Top',
    hasCustomSpells: false,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description: 'Baseline tank armor scaling and tank itemization stats verified in test suite.',
    testFiles: ['src/__tests__/champion-builds.test.ts'],
  },
  Zed: {
    id: 'Zed',
    name: 'Zed',
    status: 'testing',
    role: 'Mid',
    hasCustomSpells: false,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description: 'Baseline AD assassin lethality and ability haste scaling verified in test suite.',
    testFiles: ['src/__tests__/champion-builds.test.ts'],
  },
  Thresh: {
    id: 'Thresh',
    name: 'Thresh',
    status: 'testing',
    role: 'Support',
    hasCustomSpells: false,
    hasDoT: false,
    hasCustomPassive: false,
    hasTests: true,
    description: 'Baseline support tank itemization and ability haste verification in test suite.',
    testFiles: ['src/__tests__/champion-builds.test.ts'],
  },
}

/**
 * Check if a champion has custom combat logic, verified spell formulas or test coverage.
 */
export function isChampionImplemented(champId?: string | null): boolean {
  if (!champId) return false
  return Boolean(IMPLEMENTED_CHAMPIONS[champId])
}

/**
 * Get implementation entry details for a champion, if available.
 */
export function getChampionImplementation(
  champId?: string | null,
): ChampionImplementationEntry | null {
  if (!champId) return null
  return IMPLEMENTED_CHAMPIONS[champId] || null
}
