export interface SpellCalculationResult {
  details: Record<string, string>;
}

export type SpellCalculator = (stats: any, rank: number) => SpellCalculationResult;

export const spellFormulas: Record<string, Record<string, SpellCalculator>> = {
  Akali: {
    AkaliQ: (stats, rank) => {
      const base = [30, 55, 80, 105, 130][rank - 1] || 30
      const bonusAd = stats?.ad?.bonus || 0
      const totalAp = stats?.ap?.total || 0
      const totalDmg = Math.round(base + (bonusAd * 0.65) + (totalAp * 0.60))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${totalDmg}</span> <span class="text-slate-400 text-xs">(${base} + 65% bonus AD + 60% AP)</span>`,
          slowpercentage: '50',
          slowduration: '0.5',
        }
      }
    },
    AkaliW: (stats, rank) => {
      const duration = [4, 4.5, 5, 5.5, 6][rank - 1] || 4
      const ms = [30, 35, 40, 45, 50][rank - 1] || 30
      return {
        details: {
          baseduration: duration.toString(),
          movementspeed: ms.toString(),
          movementspeedduration: '2',
          energyrestore: '80',
        }
      }
    },
    AkaliE: (stats, rank) => {
      const e1Base = [30, 56.25, 82.5, 108.75, 135][rank - 1] || 30
      const e2Base = [70, 131.25, 192.5, 253.75, 315][rank - 1] || 70
      const bonusAd = stats?.ad?.bonus || 0
      const totalAp = stats?.ap?.total || 0
      const e1Total = Math.round(e1Base + (bonusAd * 0.25) + (totalAp * 0.30))
      const e2Total = Math.round(e2Base + (bonusAd * 0.5833) + (totalAp * 0.70))
      return {
        details: {
          e1damage: `<span class="text-cyan-400 font-semibold">${e1Total}</span> <span class="text-slate-400 text-xs">(${e1Base} + 25% bonus AD + 30% AP)</span>`,
          e2damagecalc: `<span class="text-cyan-400 font-semibold">${e2Total}</span> <span class="text-slate-400 text-xs">(${e2Base} + 58.3% bonus AD + 70% AP)</span>`,
        }
      }
    },
    AkaliR: (stats, rank) => {
      const r1Base = [80, 220, 360][rank - 1] || 80
      const r2BaseMin = [60, 130, 200][rank - 1] || 60
      const r2BaseMax = r2BaseMin * 3
      const bonusAd = stats?.ad?.bonus || 0
      const totalAp = stats?.ap?.total || 0
      const r1Total = Math.round(r1Base + (bonusAd * 0.50) + (totalAp * 0.30))
      const r2TotalMin = Math.round(r2BaseMin + (totalAp * 0.30))
      const r2TotalMax = Math.round(r2BaseMax + (totalAp * 0.90))
      return {
        details: {
          cast1damage: `<span class="text-cyan-400 font-semibold">${r1Total}</span> <span class="text-slate-400 text-xs">(${r1Base} + 50% bonus AD + 30% AP)</span>`,
          cooldownbetweencasts: '2.5',
          cast2damagemin: `<span class="text-cyan-400 font-semibold">${r2TotalMin}</span> <span class="text-slate-400 text-xs">(${r2BaseMin} + 30% AP)</span>`,
          cast2damagemax: `<span class="text-cyan-400 font-semibold">${r2TotalMax}</span> <span class="text-slate-400 text-xs">(${r2BaseMax} + 90% AP)</span>`,
        }
      }
    }
  },
  Aatrox: {
    AatroxQ: (stats, rank) => {
      const base = [10, 30, 50, 70, 90][rank - 1] || 10
      const ratio = [0.60, 0.65, 0.70, 0.75, 0.80][rank - 1] || 0.60
      const totalAd = stats?.ad?.total || 0
      const q1Dmg = Math.round(base + (totalAd * ratio))
      const qEdgeDmg = Math.round(q1Dmg * 1.5)
      return {
        details: {
          qdamage: `<span class="text-orange-400 font-semibold">${q1Dmg}</span> <span class="text-slate-400 text-xs">(${base} + ${Math.round(ratio * 100)}% total AD)</span>`,
          qedgedamage: `<span class="text-orange-400 font-semibold">${qEdgeDmg}</span> <span class="text-slate-400 text-xs">(Edge: +50%)</span>`,
        }
      }
    },
    AatroxW: (stats, rank) => {
      const base = [30, 60, 90, 120, 150][rank - 1] || 30
      const totalAd = stats?.ad?.total || 0
      const wDmg = Math.round(base + (totalAd * 0.40))
      return {
        details: {
          wdamage: `<span class="text-orange-400 font-semibold">${wDmg}</span> <span class="text-slate-400 text-xs">(${base} + 40% total AD)</span>`,
          wslowpercentage: '25',
          wslowduration: '1.5',
        }
      }
    },
    AatroxE: (stats, rank) => {
      const heal = [20, 24, 28, 32, 36][rank - 1] || 20
      return {
        details: {
          healingpercent: heal.toString(),
        }
      }
    },
    AatroxR: (stats, rank) => {
      const adMultiplier = [0.20, 0.325, 0.45][rank - 1] || 0.20
      const bonusHealing = [0.25, 0.35, 0.45][rank - 1] || 0.25
      return {
        details: {
          healingincrease: Math.round(bonusHealing * 100).toString(),
          totaladincrease: Math.round(adMultiplier * 100).toString(),
        }
      }
    }
  },
  Ahri: {
    AhriQ: (stats, rank) => {
      const base = [40, 65, 90, 115, 140][rank - 1] || 40
      const totalAp = stats?.ap?.total || 0
      const magicDmg = Math.round(base + (totalAp * 0.50))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${magicDmg}</span> <span class="text-slate-400 text-xs">(${base} + 50% AP)</span>`,
        }
      }
    },
    AhriW: (stats, rank) => {
      const base = [50, 75, 100, 125, 150][rank - 1] || 50
      const totalAp = stats?.ap?.total || 0
      const dmg = Math.round(base + (totalAp * 0.30))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${dmg}</span> <span class="text-slate-400 text-xs">(${base} + 30% AP)</span>`,
          movementspeed: '40',
        }
      }
    },
    AhriE: (stats, rank) => {
      const base = [80, 110, 140, 170, 200][rank - 1] || 80
      const totalAp = stats?.ap?.total || 0
      const dmg = Math.round(base + (totalAp * 0.60))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${dmg}</span> <span class="text-slate-400 text-xs">(${base} + 60% AP)</span>`,
          duration: '1.4',
        }
      }
    },
    AhriR: (stats, rank) => {
      const base = [60, 90, 120][rank - 1] || 60
      const totalAp = stats?.ap?.total || 0
      const dmg = Math.round(base + (totalAp * 0.35))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${dmg}</span> <span class="text-slate-400 text-xs">(${base} + 35% AP)</span>`,
        }
      }
    }
  },
  Annie: {
    AnnieQ: (stats, rank) => {
      const base = [70, 105, 140, 175, 210][rank - 1] || 70
      const totalAp = stats?.ap?.total || 0
      const dmg = Math.round(base + (totalAp * 0.75))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${dmg}</span> <span class="text-slate-400 text-xs">(${base} + 75% AP)</span>`,
        }
      }
    },
    AnnieW: (stats, rank) => {
      const base = [70, 115, 160, 205, 250][rank - 1] || 70
      const totalAp = stats?.ap?.total || 0
      const dmg = Math.round(base + (totalAp * 0.85))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${dmg}</span> <span class="text-slate-400 text-xs">(${base} + 85% AP)</span>`,
        }
      }
    },
    AnnieE: (stats, rank) => {
      const base = [60, 95, 130, 165, 200][rank - 1] || 60
      const totalAp = stats?.ap?.total || 0
      const shield = Math.round(base + (totalAp * 0.40))
      return {
        details: {
          shieldamount: `<span class="text-green-400 font-semibold">${shield}</span> <span class="text-slate-400 text-xs">(${base} + 40% AP)</span>`,
        }
      }
    },
    AnnieR: (stats, rank) => {
      const base = [150, 275, 400][rank - 1] || 150
      const totalAp = stats?.ap?.total || 0
      const dmg = Math.round(base + (totalAp * 0.75))
      return {
        details: {
          damage: `<span class="text-cyan-400 font-semibold">${dmg}</span> <span class="text-slate-400 text-xs">(${base} + 75% AP)</span>`,
        }
      }
    }
  }
};
