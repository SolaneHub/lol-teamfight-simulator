/**
 * inspect-first-10.cjs
 * 
 * Deeply inspects the passive & spells Q, W, E, R for the first 10 champions:
 * Aatrox, Ahri, Akali, Akshan, Alistar, Ambessa, Amumu, Anivia, Annie, Aphelios.
 * 
 * Tests:
 * 1. Level 1 vs Level 18 stats
 * 2. Item scaling (0 AP / 0 AD vs 100 AP / 100 bonus AD)
 * 3. Color tag application for magicDamage, physicalDamage, speed, shield, healing, etc.
 * 
 * Usage: node scripts/inspect-first-10.cjs
 */

const fs = require('fs');
const path = require('path');

const DDRAGON_CHAMPS_DIR = path.join(__dirname, '..', 'public', 'ddragon', '16.14.1', 'data', 'en_US', 'champion');
const FORMULAS_FILE = path.join(__dirname, '..', 'public', 'data', 'spellFormulas.json');

const spellFormulasData = JSON.parse(fs.readFileSync(FORMULAS_FILE, 'utf8'));

const championsList = [
  'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar',
  'Ambessa', 'Amumu', 'Anivia', 'Annie', 'Aphelios'
];

// Test stat profiles
const statsNoItems = {
  ap: { total: 0 },
  ad: { bonus: 0, total: 100 },
  hp: { bonus: 0, total: 1500 },
  armor: { total: 80 },
  magicResist: { total: 40 },
  lifesteal: { total: 0 }
};

const statsWithItems = {
  ap: { total: 100 },
  ad: { bonus: 100, total: 200 },
  hp: { bonus: 500, total: 2000 },
  armor: { total: 120 },
  magicResist: { total: 80 },
  lifesteal: { total: 0.1 }
};

function getStatValue(stats, statKey) {
  if (!stats) return 0;
  switch (statKey) {
    case 'totalAp': return stats.ap?.total || 0;
    case 'bonusAd': return stats.ad?.bonus || 0;
    case 'totalAd': return stats.ad?.total || 0;
    case 'bonusHp': return stats.hp?.bonus || 0;
    case 'totalHp': return stats.hp?.total || 0;
    case 'lifesteal': return stats.lifesteal?.total || 0;
    default: return 0;
  }
}

function getStatLabel(statKey) {
  switch (statKey) {
    case 'totalAp': return 'AP';
    case 'bonusAd': return 'bonus AD';
    case 'totalAd': return 'total AD';
    case 'bonusHp': return 'bonus HP';
    case 'totalHp': return 'max HP';
    case 'lifesteal': return 'Life Steal';
    case 'abilityHaste': return 'AH';
    default: return '';
  }
}

function formatTags(text) {
  if (!text) return '';
  return text
    .replace(/%i:[a-zA-Z0-9_-]+%/gi, '')
    .replace(/<magicDamage>/gi, '[CYAN:magic]')
    .replace(/<\/magicDamage>/gi, '[/CYAN]')
    .replace(/<physicalDamage>/gi, '[ORANGE:phys]')
    .replace(/<\/physicalDamage>/gi, '[/ORANGE]')
    .replace(/<trueDamage>/gi, '[WHITE:true]')
    .replace(/<\/trueDamage>/gi, '[/WHITE]')
    .replace(/<shield>/gi, '[SHIELD:slate]')
    .replace(/<\/shield>/gi, '[/SHIELD]')
    .replace(/<(healing|lifeSteal|omnivamp)>/gi, '[GREEN:heal]')
    .replace(/<\/(healing|lifeSteal|omnivamp)>/gi, '[/GREEN]')
    .replace(/<(speed|attackSpeed)>/gi, '[TEAL:speed]')
    .replace(/<\/(speed|attackSpeed)>/gi, '[/TEAL]')
    .replace(/<(status|slow)>/gi, '[PURPLE:status]')
    .replace(/<\/(status|slow)>/gi, '[/PURPLE]')
    .replace(/<(recast|active|spellActive|spellPassive|spellName|passive|toggle|tap|hold|release|charge|evolve)>/gi, '[AMBER:action]')
    .replace(/<\/(recast|active|spellActive|spellPassive|spellName|passive|toggle|tap|hold|release|charge|evolve)>/gi, '[/AMBER]')
    .replace(/<(keyword|keywordMajor|keywordName|keywordStealth)>/gi, '[INDIGO:kw]')
    .replace(/<\/(keyword|keywordMajor|keywordName|keywordStealth)>/gi, '[/INDIGO]')
    .replace(/<br\s*\/?>/gi, ' ');
}

function parseSpell(spell, champId, rank, stats) {
  if (!spell) return '';
  let tooltip = spell.tooltip || spell.description || '';

  if (/^\{\{\s*Spell_/i.test(tooltip.trim())) {
    tooltip = spell.description || tooltip;
  }
  tooltip = tooltip.replace(/\{\{\s*Spell_[^}]+\}\}/gi, '');

  const champFormulas = spellFormulasData[champId];
  if (champFormulas && champFormulas[spell.id]) {
    const spellConfig = champFormulas[spell.id];

    for (const [placeholder, config] of Object.entries(spellConfig)) {
      let replacementValue = '';

      if (typeof config === 'string' || typeof config === 'number') {
        replacementValue = config.toString();
      } else if (config && typeof config === 'object') {
        const baseArr = config.base || [];
        const base = baseArr[rank - 1] ?? baseArr[baseArr.length - 1] ?? 0;
        const scalings = config.scalings || [];

        if (scalings.length === 0) {
          replacementValue = `${base}`;
        } else {
          let scalingBonus = 0;
          const scalingDetails = [];

          for (const scale of scalings) {
            const ratioVal = Array.isArray(scale.ratio)
              ? (scale.ratio[rank - 1] ?? scale.ratio[scale.ratio.length - 1] ?? 0)
              : (scale.ratio ?? 0);

            const statValue = getStatValue(stats, scale.stat);
            scalingBonus += statValue * ratioVal;

            const statLabel = getStatLabel(scale.stat);
            scalingDetails.push(`${Math.round(ratioVal * 100)}% ${statLabel}`);
          }

          const totalValue = Math.round((base + scalingBonus) * 100) / 100;
          let detailsText = `${base}`;
          if (scalingDetails.length > 0) {
            detailsText += ` + ${scalingDetails.join(' + ')}`;
          }

          replacementValue = `${totalValue} (${detailsText})`;
        }
      }

      const escaped = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      tooltip = tooltip.replace(new RegExp(`\\{\\{\\s*${escaped}\\s*\\}\\}`, 'g'), replacementValue);
    }
  }

  tooltip = tooltip.replace(/\{\{\s*(spellmodifierdescriptionappend|specialabilityoverride|spellmodifierdescription)\s*\}\}/gi, '');
  tooltip = tooltip.replace(/\{\{\s*[^}]+\s*\}\}/g, '???');

  return formatTags(tooltip);
}

function parsePassive(passive, champId, level, stats) {
  if (!passive) return '';
  let text = passive.description || '';
  text = formatTags(text);

  const champFormulas = spellFormulasData[champId];
  if (champFormulas && champFormulas.passive) {
    const passiveConfig = champFormulas.passive;
    const statItems = [];

    for (const [key, config] of Object.entries(passiveConfig)) {
      if (key.startsWith('{')) continue;

      const cleanKey = (key.startsWith('P') || key.startsWith('p')) && key.length > 2 && key[1] && key[1] === key[1].toUpperCase() ? key.substring(1) : key;
      const label = cleanKey.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');

      if (config && typeof config === 'object') {
        const baseArr = config.base || [];
        const base = baseArr[level - 1] ?? baseArr[baseArr.length - 1] ?? 0;
        const scalings = config.scalings || [];

        let scalingBonus = 0;
        const scalingDetails = [];

        for (const scale of scalings) {
          const ratioVal = Array.isArray(scale.ratio)
            ? (scale.ratio[level - 1] ?? scale.ratio[scale.ratio.length - 1] ?? 0)
            : (scale.ratio ?? 0);

          const statValue = getStatValue(stats, scale.stat);
          scalingBonus += statValue * ratioVal;

          const statLabel = getStatLabel(scale.stat);
          scalingDetails.push(`${Math.round(ratioVal * 100)}% ${statLabel}`);
        }

        const totalValue = Math.round((base + scalingBonus) * 100) / 100;
        const isPercent = config.type === 'status' || key.toLowerCase().includes('percent') || key.toLowerCase().includes('ratio');
        const isCooldown = key.toLowerCase().includes('cooldown');
        const unitSuffix = isPercent ? '%' : (isCooldown ? 's' : '');

        let valStr = `${totalValue}${unitSuffix}`;
        if (scalingDetails.length > 0) {
          valStr += ` (${base}${unitSuffix} + ${scalingDetails.join(' + ')})`;
        }

        statItems.push(`${label}: ${valStr}`);
      }
    }

    if (statItems.length > 0) {
      text += `\n    [Lv. ${level} Passive Stats: ${statItems.join(' | ')}]`;
    }
  }

  return text;
}

function main() {
  console.log(`================================================================`);
  console.log(`INSPECTING FIRST 10 CHAMPIONS (LEVEL 1 vs LEVEL 18 & ITEMS)`);
  console.log(`================================================================\n`);

  championsList.forEach((champId, index) => {
    const file = path.join(DDRAGON_CHAMPS_DIR, `${champId}.json`);
    if (!fs.existsSync(file)) return;

    const data = JSON.parse(fs.readFileSync(file, 'utf8')).data[champId];
    console.log(`----------------------------------------------------------------`);
    console.log(`${index + 1}. CHAMPION: ${data.name} (${data.id})`);
    console.log(`----------------------------------------------------------------`);

    // PASSIVE
    console.log(`PASSIVE: ${data.passive.name}`);
    console.log(`  Lv 1  (No Items):   ${parsePassive(data.passive, champId, 1, statsNoItems)}`);
    console.log(`  Lv 18 (+100 AD/AP): ${parsePassive(data.passive, champId, 18, statsWithItems)}`);
    console.log();

    // SPELLS
    data.spells.forEach((spell, idx) => {
      const letter = ['Q', 'W', 'E', 'R'][idx];
      const rankL1 = 1;
      const rankL18 = idx === 3 ? 3 : 5; // Rank 5 for QWE, Rank 3 for R

      const pNoItems = parseSpell(spell, champId, rankL1, statsNoItems);
      const pWithItems = parseSpell(spell, champId, rankL18, statsWithItems);

      console.log(`[${letter}] ${spell.name} (${spell.id})`);
      console.log(`  Lv 1  (Rank 1, 0 items):    ${pNoItems}`);
      console.log(`  Lv 18 (Rank Max, +100 AD/AP): ${pWithItems}`);
      console.log();
    });
  });
}

main();
