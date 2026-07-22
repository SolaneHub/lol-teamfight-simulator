/**
 * check-parsed-tooltips.cjs
 * 
 * Simulates the frontend tooltip interpolation for ALL champions and spells
 * to find any remaining '???', unparsed placeholders, or '0' values.
 * 
 * Usage: node scripts/check-parsed-tooltips.cjs [--all] [--champ=Aatrox] [--save]
 */

const fs = require('fs');
const path = require('path');

const DDRAGON_CHAMPS_DIR = path.join(__dirname, '..', 'public', 'ddragon', '16.14.1', 'data', 'en_US', 'champion');
const FORMULAS_FILE = path.join(__dirname, '..', 'public', 'data', 'spellFormulas.json');
const REPORT_FILE = path.join(__dirname, '..', 'parsed_tooltips_report.txt');

const spellFormulasData = fs.existsSync(FORMULAS_FILE)
  ? JSON.parse(fs.readFileSync(FORMULAS_FILE, 'utf8'))
  : {};

// Sample test stats (e.g. lvl 18 champ with 100 bonus AD, 100 AP)
const sampleStats = {
  ap: { total: 100 },
  ad: { bonus: 50, total: 150 },
  hp: { bonus: 500, total: 2000 },
  armor: { total: 100 },
  magicResist: { total: 50 },
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
    .replace(/<magicDamage>/gi, '')
    .replace(/<\/magicDamage>/gi, '')
    .replace(/<physicalDamage>/gi, '')
    .replace(/<\/physicalDamage>/gi, '')
    .replace(/<status>/gi, '')
    .replace(/<\/status>/gi, '')
    .replace(/<recast>/gi, '')
    .replace(/<\/recast>/gi, '')
    .replace(/<keywordStealth>/gi, '')
    .replace(/<\/keywordStealth>/gi, '')
    .replace(/<speed>/gi, '')
    .replace(/<\/speed>/gi, '')
    .replace(/<br\s*\/?>/gi, ' ');
}

function interpolateSpellTooltip(spell, champId, rank = 5) {
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

            const statValue = getStatValue(sampleStats, scale.stat);
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

  // System placeholders
  tooltip = tooltip.replace(/\{\{\s*(spellmodifierdescriptionappend|specialabilityoverride|spellmodifierdescription)\s*\}\}/gi, '');

  // Fallback for remaining unparsed
  tooltip = tooltip.replace(/\{\{\s*[^}]+\s*\}\}/g, '???');

  return formatTags(tooltip);
}

function main() {
  const args = process.argv.slice(2);
  const showAll = args.includes('--all');
  const saveFile = args.includes('--save');
  const champFilter = args.find(a => a.startsWith('--champ='))?.split('=')[1]?.toLowerCase();

  let files = fs.readdirSync(DDRAGON_CHAMPS_DIR).filter(f => f.endsWith('.json'));

  if (champFilter) {
    files = files.filter(f => f.toLowerCase() === `${champFilter}.json`);
  }

  let totalSpells = 0;
  let spellsWithQuestion = 0;
  let spellsWithZero = 0;
  let cleanSpells = 0;

  const report = [];
  let fileOutputLines = [];

  for (const file of files) {
    const champId = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join(DDRAGON_CHAMPS_DIR, file), 'utf8'));
    const champ = data.data[champId];
    if (!champ) continue;

    fileOutputLines.push(`=================================================`);
    fileOutputLines.push(`CHAMPION: ${champ.name} (${champ.id})`);
    fileOutputLines.push(`PASSIVE: ${champ.passive?.name}`);
    fileOutputLines.push(`  ${champ.passive?.description}`);
    fileOutputLines.push(`-------------------------------------------------`);

    champ.spells.forEach((spell, idx) => {
      totalSpells++;
      const letter = ['Q', 'W', 'E', 'R'][idx];
      const parsed = interpolateSpellTooltip(spell, champId);

      const hasQuestion = parsed.includes('???');
      const hasZero = /\b0\s*\+\s*0\b|\(0\)|0%/.test(parsed);

      const rawMatches = (spell.tooltip.match(/\{\{\s*[^}]+\s*\}\}/g) || [])
        .map(m => m.replace(/\{\{\s*|\s*\}\}/g, '').trim())
        .filter(p => !['spellmodifierdescriptionappend', 'specialabilityoverride', 'spellmodifierdescription'].includes(p.toLowerCase()));

      if (hasQuestion) spellsWithQuestion++;
      else if (hasZero) spellsWithZero++;
      else cleanSpells++;

      fileOutputLines.push(`[${letter}] ${spell.name} (${spell.id})`);
      if (rawMatches.length > 0) {
        fileOutputLines.push(`    Placeholders: ${rawMatches.join(', ')}`);
      }
      fileOutputLines.push(`    PARSED: ${parsed}`);
      if (hasQuestion) fileOutputLines.push(`    ⚠️ CONTAINS ???`);
      if (hasZero) fileOutputLines.push(`    ⚠️ CONTAINS SUSPICIOUS 0`);
      fileOutputLines.push('');
    });
  }

  const summaryHeader = [
    `=================================================`,
    `SUMMARY REPORT`,
    `TOTAL SPELLS ANALYZED: ${totalSpells}`,
    `  Clean parsed tooltips: ${cleanSpells} (${Math.round(cleanSpells/(totalSpells||1)*100)}%)`,
    `  Spells with '???' (missing formula): ${spellsWithQuestion}`,
    `  Spells with potential '0' / zero issues: ${spellsWithZero}`,
    `=================================================\n`
  ].join('\n');

  console.log(summaryHeader);

  if (saveFile) {
    const fullText = summaryHeader + fileOutputLines.join('\n');
    fs.writeFileSync(REPORT_FILE, fullText);
    console.log(`Full report saved to: ${REPORT_FILE}`);
  }

  if (champFilter) {
    console.log(fileOutputLines.join('\n'));
  }
}

main();
