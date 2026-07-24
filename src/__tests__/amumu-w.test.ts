import { describe, it, expect } from 'vitest'

// Per-tick calculation (0.5s tick)
export function calculateAmumuWDamageTick(wRank: number, totalAp: number, targetMaxHp: number) {
  const baseDmgTick = 5
  const baseHpPctTick = [0.5, 0.625, 0.75, 0.875, 1][wRank - 1] || 0.5
  const apBonusHpPctTick = totalAp * 0.0025 // +0.25% per 100 AP per tick
  const totalHpPctTick = baseHpPctTick + apBonusHpPctTick
  const hpDmgTick = (totalHpPctTick / 100) * targetMaxHp
  return {
    baseDmgTick,
    totalHpPctTick,
    hpDmgTick,
    totalRawDamageTick: baseDmgTick + hpDmgTick,
    totalRawDamageSec: (baseDmgTick + hpDmgTick) * 2,
  }
}

describe('Amumu W (Aura of Despair) Damage Calculations (Per Tick & Per Sec)', () => {
  it('should correctly calculate Rank 1 W per tick (5 base + 0.5% max HP)', () => {
    // Rank 1: 5 base/tick + 0.5% max HP/tick
    // Target HP = 2000 -> 0.5% of 2000 = 10 HP damage/tick
    // Total raw damage/tick = 5 + 10 = 15 (30/sec)
    const result = calculateAmumuWDamageTick(1, 0, 2000)
    expect(result.baseDmgTick).toBe(5)
    expect(result.totalHpPctTick).toBe(0.5)
    expect(result.hpDmgTick).toBe(10)
    expect(result.totalRawDamageTick).toBe(15)
    expect(result.totalRawDamageSec).toBe(30)
  })

  it('should correctly calculate Rank 2 W per tick (5 base + 0.625% max HP)', () => {
    // Rank 2: 5 base/tick + 0.625% max HP/tick
    // Target HP = 2000 -> 0.625% of 2000 = 12.5 HP damage/tick
    // Total raw damage/tick = 5 + 12.5 = 17.5 (35/sec)
    const result = calculateAmumuWDamageTick(2, 0, 2000)
    expect(result.totalHpPctTick).toBe(0.625)
    expect(result.hpDmgTick).toBe(12.5)
    expect(result.totalRawDamageTick).toBe(17.5)
    expect(result.totalRawDamageSec).toBe(35)
  })

  it('should correctly calculate Rank 5 W per tick with 200 AP (+0.5% AP bonus per tick)', () => {
    // Rank 5: 5 base/tick + 1.0% base HP/tick
    // 200 AP -> +0.5% max HP/tick -> Total 1.5% max HP/tick
    // Target HP = 4000 -> 1.5% of 4000 = 60 HP damage/tick
    // Total raw damage/tick = 5 + 60 = 65 (130/sec)
    const result = calculateAmumuWDamageTick(5, 200, 4000)
    expect(result.totalHpPctTick).toBe(1.5)
    expect(result.hpDmgTick).toBe(60)
    expect(result.totalRawDamageTick).toBe(65)
    expect(result.totalRawDamageSec).toBe(130)
  })
})
