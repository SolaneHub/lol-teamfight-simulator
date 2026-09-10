import { describe, it, expect } from 'vitest'
import {
  parseItemStatsFromDescription,
  detectItemPassives,
  calculateStats,
  calculateItemDamagePassives,
  calculateSpellDamage,
  runCombatSimulation,
} from '../services'
import type { DraftSlot, Item, Champion } from '../types'

// Mock base champion (Seraphine)
const mockMageChampion: Champion = {
  id: 'Seraphine',
  name: 'Seraphine',
  key: '147',
  title: 'the Starry-Eyed Songstress',
  tags: ['Mage', 'Support'],
  partype: 'Mana',
  stats: {
    hp: 600,
    hpperlevel: 100,
    mp: 500,
    mpperlevel: 40,
    movespeed: 325,
    armor: 30,
    armorperlevel: 4,
    spellblock: 30,
    spellblockperlevel: 1.3,
    attackrange: 525,
    hpregen: 6.5,
    hpregenperlevel: 0.6,
    mpregen: 8,
    mpregenperlevel: 1,
    crit: 0,
    critperlevel: 0,
    attackdamage: 55,
    attackdamageperlevel: 3,
    attackspeedperlevel: 1.5,
    attackspeed: 0.669,
  },
  image: { full: 'Seraphine.png', sprite: '', group: 'champion', x: 0, y: 0, w: 48, h: 48 },
}

const mockEnemyChampion: Champion = {
  id: 'Jinx',
  name: 'Jinx',
  key: '222',
  title: 'the Loose Cannon',
  tags: ['Marksman'],
  partype: 'Mana',
  stats: {
    hp: 650,
    hpperlevel: 105,
    mp: 300,
    mpperlevel: 45,
    movespeed: 325,
    armor: 26,
    armorperlevel: 4.2,
    spellblock: 30,
    spellblockperlevel: 1.3,
    attackrange: 525,
    hpregen: 3.75,
    hpregenperlevel: 0.5,
    mpregen: 6.7,
    mpregenperlevel: 1,
    crit: 0,
    critperlevel: 0,
    attackdamage: 59,
    attackdamageperlevel: 3.15,
    attackspeedperlevel: 1,
    attackspeed: 0.625,
  },
  image: { full: 'Jinx.png', sprite: '', group: 'champion', x: 0, y: 0, w: 48, h: 48 },
}

const makeItem = (
  name: string,
  id: string,
  desc: string,
  stats: Record<string, number> = {},
): Item => ({
  id,
  name,
  description: desc,
  colloq: ';',
  image: { full: `${id}.png`, sprite: '', group: 'item', x: 0, y: 0, w: 48, h: 48 },
  gold: { base: 1000, total: 3000, sell: 2100, purchasable: true },
  tags: ['SpellDamage', 'Mage'],
  stats,
})

const createTestSlot = (
  id: number,
  side: 'blue' | 'red',
  champ: Champion,
  items: (Item | null)[],
  level = 10,
  itemStacks?: (number | undefined)[],
): DraftSlot => ({
  id,
  side,
  role: 'Mid',
  champion: champ,
  level,
  items,
  itemStacks,
  masterworkItems: items.map(() => false),
  shardOffensive: null,
  shardFlex: null,
  shardDefensive: null,
  primaryPath: null,
  primaryKeystone: null,
  primaryRune1: null,
  primaryRune2: null,
  primaryRune3: null,
  secondaryPath: null,
  secondaryRune1: null,
  secondaryRune2: null,
})

function runTestSimulation({
  blueSlots,
  redSlots,
  actions,
}: {
  blueSlots: DraftSlot[]
  redSlots: DraftSlot[]
  actions: {
    actorSlotId: number
    action: 'Q' | 'W' | 'E' | 'R' | 'P' | 'AA'
    targetSlotIds: number[]
    timestamp: number
  }[]
}) {
  return runCombatSimulation({
    allSlots: [...blueSlots, ...redSlots],
    activeBlueSlotIds: blueSlots.map((s) => s.id),
    activeRedSlotIds: redSlots.map((s) => s.id),
    actions: actions.map((a, idx) => ({ id: `act-${idx}`, ...a })),
    duration: 3,
    attackerBuffs: {
      baron: false,
      elder: false,
      redBuff: false,
      blueBuff: false,
      dragons: { infernal: 0, mountain: 0, ocean: 0, cloud: 0, hextech: 0, chemtech: 0 },
    },
    defenderBuffs: {
      baron: false,
      elder: false,
      redBuff: false,
      blueBuff: false,
      dragons: { infernal: 0, mountain: 0, ocean: 0, cloud: 0, hextech: 0, chemtech: 0 },
    },
  })
}

describe('AP Legendary Items Full Implementation', () => {
  describe('Passive Detection for All 24 AP Legendaries', () => {
    it('should correctly detect passive flags for all AP legendaries', () => {
      const items: Item[] = [
        makeItem("Nashor's Tooth", '3115', 'Icathian Bite'),
        makeItem("Guinsoo's Rageblade", '3124', 'Wrath'),
        makeItem('Hextech Gunblade', '3146', 'Lightning Bolt active'),
        makeItem('Hextech Rocketbelt', '3152', 'Supersonic active'),
        makeItem('Dusk and Dawn', '3100', 'Solar strike'),
        makeItem('Imperial Mandate', '4005', 'Coordinated Fire'),
        makeItem('Horizon Focus', '4628', 'Hyperfocus'),
        makeItem("Rylai's Crystal Scepter", '3116', 'Rimefrost slow'),
        makeItem('Morellonomicon', '3165', 'Affliction Grievous Wounds'),
        makeItem("Archangel's Staff", '3003', 'Awe bonus mana to AP'),
        makeItem("Seraph's Embrace", '3040', 'Lifeline shield'),
        makeItem('Rod of Ages', '6657', 'Timeless stacking'),
        makeItem('Cosmic Drive', '4629', 'Spelldance haste'),
        makeItem('Cryptbloom', '3118', 'Life from Death heal nova'),
        makeItem("Banshee's Veil", '3102', 'Annul spell shield'),
        makeItem("Zhonya's Hourglass", '3157', 'Stasis active'),
        makeItem('Actualizer', '2800', '15% spell damage amp'),
        makeItem('Ardent Censer', '3504', 'Sanctify on-hit magic damage'),
        makeItem('Staff of Flowing Water', '2301', 'Rapids AP buff'),
        makeItem('Echoes of Helia', '6620', 'Soul Siphon'),
        makeItem('Moonstone Renewer', '6617', 'Starlit Grace'),
        makeItem("Shurelya's Battlesong", '2065', 'Motivate haste'),
        makeItem('Dawncore', '6621', 'First Light conversion'),
      ]

      const passives = detectItemPassives(items)
      expect(passives.hasNashors).toBe(true)
      expect(passives.hasGuinsoo).toBe(true)
      expect(passives.hasGunblade).toBe(true)
      expect(passives.hasRocketbelt).toBe(true)
      expect(passives.hasDuskAndDawn).toBe(true)
      expect(passives.hasImperialMandate).toBe(true)
      expect(passives.hasHorizonFocus).toBe(true)
      expect(passives.hasRylais).toBe(true)
      expect(passives.hasMorellonomicon).toBe(true)
      expect(passives.hasArchangels).toBe(true)
      expect(passives.hasSeraphs).toBe(true)
      expect(passives.hasRodOfAges).toBe(true)
      expect(passives.hasCosmicDrive).toBe(true)
      expect(passives.hasCryptbloom).toBe(true)
      expect(passives.hasBansheesVeil).toBe(true)
      expect(passives.hasZhonyas).toBe(true)
      expect(passives.hasActualizer).toBe(true)
      expect(passives.hasArdentCenser).toBe(true)
      expect(passives.hasStaffOfFlowingWater).toBe(true)
      expect(passives.hasEchoesOfHelia).toBe(true)
      expect(passives.hasMoonstone).toBe(true)
      expect(passives.hasShurelyas).toBe(true)
      expect(passives.hasDawncore).toBe(true)
    })
  })

  describe("Nashor's Tooth", () => {
    it('should compute on-hit magic damage scaling: 15 + 15% AP', () => {
      const passives = detectItemPassives([makeItem("Nashor's Tooth", '3115', 'Icathian Bite')])
      // 100 AP -> 15 + 15 = 30 magic on-hit
      const results = calculateItemDamagePassives({
        action: 'AA',
        passives,
        attacker: {
          ad: 100,
          baseAd: 60,
          ap: 100,
          level: 10,
          hp: 2000,
          maxHp: 2000,
          mana: 500,
          isRanged: true,
        },
        defender: {
          currentHp: 2000,
          maxHp: 2000,
        },
      })
      const nashorDmg = results.find((r) => r.name.includes("Nashor's Tooth"))
      expect(nashorDmg).toBeDefined()
      expect(nashorDmg?.rawDmg).toBe(30)
    })

    it('should apply Nashors on-hit damage and badge in combat simulation', () => {
      const attackerSlot = createTestSlot(1, 'blue', mockMageChampion, [
        makeItem("Nashor's Tooth", '3115', 'Icathian Bite', { FlatMagicDamageMod: 90 }),
      ])
      const defenderSlot = createTestSlot(6, 'red', mockEnemyChampion, [])

      const result = runTestSimulation({
        blueSlots: [attackerSlot],
        redSlots: [defenderSlot],
        actions: [{ actorSlotId: 1, action: 'AA', targetSlotIds: [6], timestamp: 0.0 }],
      })
      const aaEvent = result.events.find((e) => e.actorSlotId === 1 && e.action === 'AA')
      expect(aaEvent).toBeDefined()
      expect(aaEvent?.badges).toContain('🦷 Nashor')
    })
  })

  describe("Archangel's Staff & Seraph's Embrace", () => {
    it("should grant bonus AP from bonus mana via Awe passive (Archangel's Staff 1%)", () => {
      const archangel = makeItem(
        "Archangel's Staff",
        '3003',
        '<mainText>Grants Ability Power equal to 1% bonus mana.<stats><attention>80</attention> Ability Power<br><attention>1000</attention> Mana</stats></mainText>',
        { FlatMagicDamageMod: 80, FlatMPPoolMod: 1000 },
      )
      const slot = createTestSlot(1, 'blue', mockMageChampion, [archangel])
      const stats = calculateStats(slot)
      // Base AP: 80 from item. Bonus MP: 1000. 1% of 1000 = 10 AP. Total AP: 90.
      expect(stats.ap.total).toBe(90)
    })

    it("should grant bonus AP from bonus mana via Awe passive (Seraph's Embrace 2%)", () => {
      const seraph = makeItem(
        "Seraph's Embrace",
        '3040',
        '<mainText>Grants Ability Power equal to 2% bonus mana.<stats><attention>80</attention> Ability Power<br><attention>1000</attention> Mana</stats></mainText>',
        { FlatMagicDamageMod: 80, FlatMPPoolMod: 1000 },
      )
      const slot = createTestSlot(1, 'blue', mockMageChampion, [seraph])
      const stats = calculateStats(slot)
      // Base AP: 80 from item. Bonus MP: 1000. 2% of 1000 = 20 AP. Total AP: 100.
      expect(stats.ap.total).toBe(100)
    })

    it("should trigger Lifeline shield when dropping below 30% HP with Seraph's Embrace", () => {
      const seraph = makeItem(
        "Seraph's Embrace",
        '3040',
        'Lifeline shield upon falling below 30% HP',
        { FlatMagicDamageMod: 80, FlatMPPoolMod: 1000 },
      )
      // Defender with Seraph's
      const defender = createTestSlot(6, 'red', mockMageChampion, [seraph], 1)
      // Attacker deals huge damage
      const attacker = createTestSlot(
        1,
        'blue',
        mockEnemyChampion,
        [makeItem('Infinity Edge', '3031', '', { FlatPhysicalDamageMod: 500 })],
        18,
      )

      const result = runTestSimulation({
        blueSlots: [attacker],
        redSlots: [defender],
        actions: [
          { actorSlotId: 1, action: 'AA', targetSlotIds: [6], timestamp: 0.0 },
          { actorSlotId: 1, action: 'AA', targetSlotIds: [6], timestamp: 0.5 },
        ],
      })
      const lifelineTriggered = result.events.some((e) =>
        e.badges?.some((b) => b.includes('Lifeline')),
      )
      expect(lifelineTriggered).toBe(true)
    })
  })

  describe('Rod of Ages', () => {
    it('should grant Timeless stacking stats: +10 HP, +30 Mana, +3 AP per stack (10 stacks default)', () => {
      const roa = makeItem('Rod of Ages', '6657', 'Timeless stacking', {
        FlatHPPoolMod: 400,
        FlatMPPoolMod: 400,
        FlatMagicDamageMod: 50,
      })
      const slot = createTestSlot(1, 'blue', mockMageChampion, [roa], 1)
      const stats = calculateStats(slot)
      // Base champ lvl 1: HP 600, MP 500, AP 0
      // Item base: HP 400, MP 400, AP 50
      // 10 stacks default: +100 HP, +300 MP, +30 AP
      // Total HP: 600 + 400 + 100 = 1100
      // Total MP: 500 + 400 + 300 = 1200
      // Total AP: 50 + 30 = 80
      expect(stats.hp.total).toBe(1100)
      expect(stats.mp.total).toBe(1200)
      expect(stats.ap.total).toBe(80)
    })

    it('should scale dynamically when itemStacks is customized', () => {
      const roa = makeItem('Rod of Ages', '6657', 'Timeless stacking', {
        FlatHPPoolMod: 400,
        FlatMPPoolMod: 400,
        FlatMagicDamageMod: 50,
      })
      const slot = createTestSlot(1, 'blue', mockMageChampion, [roa], 1, [5])
      const stats = calculateStats(slot)
      // 5 stacks: +50 HP, +150 MP, +15 AP
      expect(stats.hp.total).toBe(600 + 400 + 50)
      expect(stats.mp.total).toBe(500 + 400 + 150)
      expect(stats.ap.total).toBe(50 + 15)
    })
  })

  describe("Mejai's Soulstealer", () => {
    it('should scale AP with Glory stacks and grant 10% MS at >= 10 stacks', () => {
      const mejai = makeItem("Mejai's Soulstealer", '3041', 'Glory stacks', {
        FlatMagicDamageMod: 20,
        FlatHPPoolMod: 100,
      })
      const slotMax = createTestSlot(1, 'blue', mockMageChampion, [mejai], 1, [25])
      const statsMax = calculateStats(slotMax)
      expect(statsMax.ap.total).toBe(20 + 125) // 145 AP
      expect(statsMax.ms.total).toBeGreaterThan(mockMageChampion.stats.movespeed) // +10% MS
    })

    it('should clamp stacks to a maximum limit of 25 for Mejai', () => {
      const mejai = makeItem("Mejai's Soulstealer", '3041', 'Glory stacks', {
        FlatMagicDamageMod: 20,
      })
      // If user inputs 99, clamp should limit to 25 -> 25 * 5 = +125 AP
      const slotOver = createTestSlot(1, 'blue', mockMageChampion, [mejai], 1, [99])
      const statsOver = calculateStats(slotOver)
      expect(statsOver.ap.total).toBe(20 + 125)
    })
  })

  describe('Dark Seal', () => {
    it('should scale AP by 4 per Glory stack up to a maximum limit of 10', () => {
      const darkSeal = makeItem('Dark Seal', '1082', 'Glory stacks', {
        FlatMagicDamageMod: 15,
        FlatHPPoolMod: 40,
      })
      // 10 stacks (default / max) -> 10 * 4 = +40 AP -> 15 + 40 = 55 AP
      const slotDefault = createTestSlot(1, 'blue', mockMageChampion, [darkSeal], 1)
      const statsDefault = calculateStats(slotDefault)
      expect(statsDefault.ap.total).toBe(15 + 40)

      // Custom 5 stacks -> 5 * 4 = +20 AP -> 15 + 20 = 35 AP
      const slot5 = createTestSlot(1, 'blue', mockMageChampion, [darkSeal], 1, [5])
      const stats5 = calculateStats(slot5)
      expect(stats5.ap.total).toBe(15 + 20)

      // Clamp limit to 10 stacks even if 50 is provided
      const slotOver = createTestSlot(1, 'blue', mockMageChampion, [darkSeal], 1, [50])
      const statsOver = calculateStats(slotOver)
      expect(statsOver.ap.total).toBe(15 + 40)

      // 0 stacks -> 15 AP
      const slotZero = createTestSlot(1, 'blue', mockMageChampion, [darkSeal], 1, [0])
      const statsZero = calculateStats(slotZero)
      expect(statsZero.ap.total).toBe(15)
    })

    it('should recognize Italian localized name Sigillo Oscuro', () => {
      const darkSealIt = makeItem('Sigillo oscuro', '1082', 'Glory stacks', {
        FlatMagicDamageMod: 15,
      })
      const slot = createTestSlot(1, 'blue', mockMageChampion, [darkSealIt], 1, [8])
      const stats = calculateStats(slot)
      expect(stats.ap.total).toBe(15 + 8 * 4)
    })
  })

  describe('Cryptbloom', () => {
    it('should detect Cryptbloom and parse 30% Magic Penetration', () => {
      const desc =
        '<mainText><stats><attention>60</attention> Ability Power<br><attention>30%</attention> Magic Penetration</stats><br>Life from Death</mainText>'
      const parsed = parseItemStatsFromDescription(desc)
      expect(parsed.rPercentMagicPenetrationMod).toBe(0.3)

      const cryptbloom = makeItem('Cryptbloom', '3118', desc, { FlatMagicDamageMod: 60 })
      const passives = detectItemPassives([cryptbloom])
      expect(passives.hasCryptbloom).toBe(true)
    })

    it('should emit Life from Death healing nova on champion takedown in combat simulation', () => {
      const cryptbloom = makeItem('Cryptbloom', '3118', 'Life from Death heal on takedown', {
        FlatMagicDamageMod: 100,
      })
      const killer = createTestSlot(1, 'blue', mockMageChampion, [
        cryptbloom,
        makeItem('Rabadon', '3089', '', { FlatMagicDamageMod: 500 }),
      ])
      const woundedAlly = createTestSlot(2, 'blue', mockMageChampion, [])
      const enemy = createTestSlot(6, 'red', mockEnemyChampion, [], 1) // Squishy 650 HP

      const result = runTestSimulation({
        blueSlots: [killer, woundedAlly],
        redSlots: [enemy],
        actions: [
          { actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
          { actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.5 },
        ],
      })
      const cryptbloomEvents = result.events.filter((e) =>
        e.badges?.some((b) => b.includes('Cryptbloom Nova')),
      )
      expect(cryptbloomEvents.length).toBeGreaterThan(0)
    })
  })

  describe("Banshee's Veil", () => {
    it('should block the first hostile magic damage spell via Annul shield', () => {
      const banshees = makeItem("Banshee's Veil", '3102', 'Annul spell shield', {
        FlatMagicDamageMod: 120,
        FlatSpellBlockMod: 50,
      })
      const defender = createTestSlot(6, 'red', mockEnemyChampion, [banshees])
      const attacker = createTestSlot(1, 'blue', mockMageChampion, [
        makeItem('AP item', '100', '', { FlatMagicDamageMod: 200 }),
      ])

      const result = runTestSimulation({
        blueSlots: [attacker],
        redSlots: [defender],
        actions: [
          { actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 },
          { actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.5 },
        ],
      })
      const magicHits = result.events.filter((e) => e.actorSlotId === 1 && e.action === 'Q')
      expect(magicHits.length).toBeGreaterThanOrEqual(2)

      const firstHit = magicHits[0]
      expect(firstHit.amount).toBe(0)
      expect(firstHit.badges).toContain('🛡️ Banshee Blocked')

      const secondHit = magicHits[1]
      expect(secondHit.amount).toBeGreaterThan(0)
      expect(secondHit.badges || []).not.toContain('🛡️ Banshee Blocked')
    })
  })

  describe('Morellonomicon', () => {
    it('should apply Grievous Wounds on magic ability hit', () => {
      const morello = makeItem('Morellonomicon', '3165', 'Affliction Grievous Wounds', {
        FlatMagicDamageMod: 90,
      })
      const attacker = createTestSlot(1, 'blue', mockMageChampion, [morello])
      const defender = createTestSlot(6, 'red', mockEnemyChampion, [])

      const result = runTestSimulation({
        blueSlots: [attacker],
        redSlots: [defender],
        actions: [{ actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 }],
      })
      const qHit = result.events.find((e) => e.actorSlotId === 1 && e.action === 'Q')
      expect(qHit).toBeDefined()
      expect(qHit?.badges).toContain('🩸 Grievous Wounds')
    })
  })

  describe('Horizon Focus & Actualizer', () => {
    it('should amplify damage by 10% via Horizon Focus in calculateSpellDamage', () => {
      const withoutHorizon = calculateSpellDamage({
        attacker: { ad: 50, ap: 200, level: 10, crit: 0, hp: 1000, maxHp: 1000 },
        defender: {
          armor: 40,
          mr: 40,
          maxHp: 1500,
          currentHp: 1500,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
        action: 'Q',
        options: { hasHorizonFocus: false },
      })

      const withHorizon = calculateSpellDamage({
        attacker: { ad: 50, ap: 200, level: 10, crit: 0, hp: 1000, maxHp: 1000 },
        defender: {
          armor: 40,
          mr: 40,
          maxHp: 1500,
          currentHp: 1500,
          blackCleaverStacks: 0,
          vileDecayStacks: 0,
        },
        action: 'Q',
        options: { hasHorizonFocus: true },
      })

      expect(withHorizon.hitMult).toBeCloseTo(withoutHorizon.hitMult * 1.1, 3)
    })

    it('should apply Horizon Focus +10% amp badge and Actualizer +15% spell amp badge in combat simulation', () => {
      const slotWithHorizon = createTestSlot(1, 'blue', mockMageChampion, [
        makeItem('Horizon Focus', '4628', 'Hyperfocus 10% damage amp', { FlatMagicDamageMod: 90 }),
        makeItem('Actualizer', '2800', '15% spell damage amp', { FlatMagicDamageMod: 80 }),
      ])
      const defender = createTestSlot(6, 'red', mockEnemyChampion, [])

      const result = runTestSimulation({
        blueSlots: [slotWithHorizon],
        redSlots: [defender],
        actions: [{ actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 }],
      })
      const hit = result.events.find((e) => e.actorSlotId === 1 && e.action === 'Q')
      expect(hit?.badges).toContain('🎯 Horizon (+10%)')
      expect(hit?.badges).toContain('⚡ Actualizer (+15%)')
    })
  })

  describe('Utility & Hybrid AP Legendaries: Guinsoo, Gunblade, Rocketbelt, Mandate, Helia, Dawncore, Rylai, Ardent', () => {
    it("should calculate Guinsoo's Wrath on-hit damage (30)", () => {
      const passives = detectItemPassives([makeItem("Guinsoo's Rageblade", '3124', 'Wrath on-hit')])
      const results = calculateItemDamagePassives({
        action: 'AA',
        passives,
        attacker: {
          ad: 100,
          baseAd: 60,
          ap: 50,
          level: 10,
          hp: 1500,
          maxHp: 1500,
          mana: 500,
          isRanged: true,
        },
        defender: {
          currentHp: 1500,
          maxHp: 1500,
        },
      })
      const guinsooDmg = results.find((r) => r.name.includes("Guinsoo's Rageblade"))
      expect(guinsooDmg).toBeDefined()
      expect(guinsooDmg?.rawDmg).toBe(30)
    })

    it('should calculate Gunblade active burst (150 + 30% AP at level 10)', () => {
      const passives = detectItemPassives([makeItem('Hextech Gunblade', '3146', 'Lightning bolt')])
      const results = calculateItemDamagePassives({
        action: 'Q',
        passives,
        attacker: {
          ad: 100,
          baseAd: 60,
          ap: 200,
          level: 10,
          hp: 1500,
          maxHp: 1500,
          mana: 500,
          isRanged: true,
        },
        defender: {
          currentHp: 1500,
          maxHp: 1500,
        },
      })
      const gunblade = results.find((r) => r.name.includes('Hextech Gunblade'))
      expect(gunblade).toBeDefined()
      // 150 + 10 * 5 + 200 * 0.3 = 150 + 50 + 60 = 260
      expect(gunblade?.rawDmg).toBe(260)
    })

    it('should calculate Rocketbelt active burst (125 + 15% AP)', () => {
      const passives = detectItemPassives([
        makeItem('Hextech Rocketbelt', '3152', 'Supersonic active'),
      ])
      const results = calculateItemDamagePassives({
        action: 'Q',
        passives,
        attacker: {
          ad: 100,
          baseAd: 60,
          ap: 200,
          level: 10,
          hp: 1500,
          maxHp: 1500,
          mana: 500,
          isRanged: true,
        },
        defender: {
          currentHp: 1500,
          maxHp: 1500,
        },
      })
      const rocketbelt = results.find((r) => r.name.includes('Hextech Rocketbelt'))
      expect(rocketbelt).toBeDefined()
      // 125 + 15% of 200 (30) = 155
      expect(rocketbelt?.rawDmg).toBe(155)
    })

    it('should calculate Imperial Mandate & Echoes of Helia ability procs in combat simulation', () => {
      const slot = createTestSlot(1, 'blue', mockMageChampion, [
        makeItem('Imperial Mandate', '4005', 'Coordinated Fire'),
        makeItem('Echoes of Helia', '6620', 'Soul Siphon'),
        makeItem("Rylai's Crystal Scepter", '3116', 'Rimefrost slow'),
      ])
      const defender = createTestSlot(6, 'red', mockEnemyChampion, [])

      const result = runTestSimulation({
        blueSlots: [slot],
        redSlots: [defender],
        actions: [{ actorSlotId: 1, action: 'Q', targetSlotIds: [6], timestamp: 0.0 }],
      })
      const qEvent = result.events.find((e) => e.actorSlotId === 1 && e.action === 'Q')
      expect(qEvent?.badges).toContain('👑 Mandate')
      expect(qEvent?.badges).toContain('🌟 Helia')
      expect(qEvent?.badges).toContain('❄️ Rylai Slow')
    })

    it('should calculate Dawncore First Light conversion in calculateStats', () => {
      const dawncore = makeItem(
        'Dawncore',
        '6621',
        '<mainText>First Light: Gain 10 Ability Power and 2% Heal and Shield Power per 100% base mana regen.<stats><attention>60</attention> Ability Power<br><attention>100%</attention> Base Mana Regen</stats></mainText>',
        { FlatMagicDamageMod: 60 },
      )
      const otherManaRegenItem = makeItem(
        'Mana Item',
        '9999',
        '<mainText><stats><attention>100%</attention> Base Mana Regen</stats></mainText>',
      )

      const slot = createTestSlot(1, 'blue', mockMageChampion, [dawncore, otherManaRegenItem]) // 200% mana regen total -> 2 stacks
      const stats = calculateStats(slot)
      // Base item AP = 60. Stacks = 2 -> +20 AP. Total AP = 80.
      expect(stats.ap.total).toBe(80)
      expect(stats.healShieldPower.total).toBe(4) // 2 stacks * 2% = 4%
    })

    it('should add Ardent Censer Sanctify on-hit magic damage', () => {
      const passives = detectItemPassives([makeItem('Ardent Censer', '3504', 'Sanctify')])
      const results = calculateItemDamagePassives({
        action: 'AA',
        passives,
        attacker: {
          ad: 60,
          baseAd: 60,
          ap: 100,
          level: 10,
          hp: 1500,
          maxHp: 1500,
          mana: 500,
          isRanged: true,
        },
        defender: {
          currentHp: 1500,
          maxHp: 1500,
        },
      })
      const ardent = results.find((r) => r.name.includes('Ardent Censer'))
      expect(ardent).toBeDefined()
      expect(ardent?.rawDmg).toBe(20)
    })
  })

  describe('Draft Store itemStacks clamping & reactive state', () => {
    it('should clamp item stacks to 10 for Dark Seal, 25 for Mejai, and 10 for Rod of Ages', async () => {
      const { setActivePinia, createPinia } = await import('pinia')
      const { useDraftStore } = await import('../stores/draft')
      setActivePinia(createPinia())
      const store = useDraftStore()

      // Set active customizer slot
      store.activeCustomizerSlot = store.blueDraft[0]

      const darkSeal = makeItem('Dark Seal', '1082', 'Glory', { FlatMagicDamageMod: 15 })
      const mejai = makeItem("Mejai's Soulstealer", '3041', 'Glory', { FlatMagicDamageMod: 20 })
      const roa = makeItem('Rod of Ages', '6657', 'Timeless', { FlatMagicDamageMod: 50 })

      store.selectItemForSlot(0, darkSeal)
      store.selectItemForSlot(1, mejai)
      store.selectItemForSlot(2, roa)

      // Initial defaults
      expect(store.activeCustomizerSlot?.itemStacks?.[0]).toBe(10)
      expect(store.activeCustomizerSlot?.itemStacks?.[1]).toBe(25)
      expect(store.activeCustomizerSlot?.itemStacks?.[2]).toBe(10)

      // Clamping limits
      store.setItemStack(0, 100) // Dark Seal limit is 10
      expect(store.activeCustomizerSlot?.itemStacks?.[0]).toBe(10)

      store.setItemStack(0, 6)
      expect(store.activeCustomizerSlot?.itemStacks?.[0]).toBe(6)

      store.setItemStack(1, 999) // Mejai limit is 25
      expect(store.activeCustomizerSlot?.itemStacks?.[1]).toBe(25)

      store.setItemStack(1, 14)
      expect(store.activeCustomizerSlot?.itemStacks?.[1]).toBe(14)

      store.setItemStack(2, 50) // Rod of Ages limit is 10
      expect(store.activeCustomizerSlot?.itemStacks?.[2]).toBe(10)

      store.setItemStack(2, 0)
      expect(store.activeCustomizerSlot?.itemStacks?.[2]).toBe(0)
    })
  })
})
