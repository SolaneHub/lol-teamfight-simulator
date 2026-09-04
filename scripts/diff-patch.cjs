/**
 * diff-patch.cjs
 * 
 * Compares two versions of spellFormulas (and optionally DDragon items/champions)
 * to categorize changes into:
 *  1. SAFE_NUMERIC: Only base values, CD, or existing ratio numbers changed. (Auto-handled)
 *  2. REWORK_OR_MECHANIC_CHANGE: New/removed spells, changed stat scaling types,
 *     new formula placeholder keys, or item changes. (REQUIRES MANUAL REVIEW)
 * 
 * Usage:
 *   node scripts/diff-patch.cjs --old public/data/spellFormulas-prev.json --new public/data/spellFormulas.json
 *   node scripts/diff-patch.cjs --auto   (compares public/data/spellFormulas.json against a backup/git HEAD)
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let oldFile = '';
let newFile = path.join(__dirname, '..', 'public', 'data', 'spellFormulas.json');
let outputFile = path.join(__dirname, '..', 'patch-diff-report.md');

const oldIdx = args.indexOf('--old');
if (oldIdx !== -1 && args[oldIdx + 1]) oldFile = args[oldIdx + 1];

const newIdx = args.indexOf('--new');
if (newIdx !== -1 && args[newIdx + 1]) newFile = args[newIdx + 1];

const outIdx = args.indexOf('--output');
if (outIdx !== -1 && args[outIdx + 1]) outputFile = args[outIdx + 1];

if (!oldFile) {
  // Check if a backup or previous patch file exists
  const candidateOld = path.join(__dirname, '..', 'public', 'data', 'spellFormulas-prev.json');
  if (fs.existsSync(candidateOld)) {
    oldFile = candidateOld;
  }
}

if (!oldFile || !fs.existsSync(oldFile)) {
  console.log('[Diff-Patch] Notice: No previous spellFormulas file found to compare against.');
  console.log(`[Diff-Patch] Saving current file as baseline for next run: ${newFile} -> spellFormulas-prev.json`);
  if (fs.existsSync(newFile)) {
    fs.copyFileSync(newFile, path.join(__dirname, '..', 'public', 'data', 'spellFormulas-prev.json'));
  }
  process.exit(0);
}

const oldData = JSON.parse(fs.readFileSync(oldFile, 'utf8'));
const newData = JSON.parse(fs.readFileSync(newFile, 'utf8'));

const changes = {
  reworks: [], // Critical: needs manual developer review
  numericOnly: [], // Safe: base damage, cooldowns, numeric ratios
  unchanged: 0
};

const allChamps = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)])).sort();

for (const champ of allChamps) {
  if (!oldData[champ]) {
    changes.reworks.push({
      champion: champ,
      reason: 'NEW_CHAMPION',
      details: [`Champion ${champ} was added to the game.`]
    });
    continue;
  }
  if (!newData[champ]) {
    changes.reworks.push({
      champion: champ,
      reason: 'REMOVED_CHAMPION',
      details: [`Champion ${champ} was removed.`]
    });
    continue;
  }

  const oldSpells = oldData[champ];
  const newSpells = newData[champ];
  const spellKeys = Array.from(new Set([...Object.keys(oldSpells), ...Object.keys(newSpells)]));

  const champReworks = [];
  const champNumerics = [];

  for (const sKey of spellKeys) {
    if (!oldSpells[sKey]) {
      champReworks.push(`Spell/Passive section '${sKey}' added.`);
      continue;
    }
    if (!newSpells[sKey]) {
      champReworks.push(`Spell/Passive section '${sKey}' removed.`);
      continue;
    }

    const oldFormulas = oldSpells[sKey];
    const newFormulas = newSpells[sKey];
    const formulaKeys = Array.from(new Set([...Object.keys(oldFormulas), ...Object.keys(newFormulas)]));

    for (const fKey of formulaKeys) {
      if (!oldFormulas[fKey]) {
        champReworks.push(`Formula '${sKey}.${fKey}' newly added.`);
        continue;
      }
      if (!newFormulas[fKey]) {
        champReworks.push(`Formula '${sKey}.${fKey}' removed.`);
        continue;
      }

      const oF = oldFormulas[fKey];
      const nF = newFormulas[fKey];

      // Check damage/stat type change
      if (oF.type !== nF.type) {
        champReworks.push(`Formula '${sKey}.${fKey}' changed damage/stat type from '${oF.type}' to '${nF.type}'.`);
        continue;
      }

      // Check scalings
      const oScalings = oF.scalings || [];
      const nScalings = nF.scalings || [];

      // If scaling stats changed (e.g. was AP, now HP or Armor)
      const oStats = oScalings.map(s => s.stat).sort().join(',');
      const nStats = nScalings.map(s => s.stat).sort().join(',');
      if (oStats !== nStats) {
        champReworks.push(`Formula '${sKey}.${fKey}' scaling stats changed from [${oStats}] to [${nStats}].`);
        continue;
      }

      // Compare base arrays
      const baseDiff = JSON.stringify(oF.base) !== JSON.stringify(nF.base);
      const scalingsDiff = JSON.stringify(oScalings) !== JSON.stringify(nScalings);

      if (baseDiff || scalingsDiff) {
        champNumerics.push({
          formula: `${sKey}.${fKey}`,
          baseChanged: baseDiff,
          scalingsChanged: scalingsDiff,
          oldBase: oF.base,
          newBase: nF.base
        });
      }
    }
  }

  if (champReworks.length > 0) {
    changes.reworks.push({
      champion: champ,
      reason: 'MECHANIC_CHANGE_OR_REWORK',
      details: champReworks
    });
  } else if (champNumerics.length > 0) {
    changes.numericOnly.push({
      champion: champ,
      details: champNumerics
    });
  } else {
    changes.unchanged++;
  }
}

// Generate Markdown Report
let md = `# 📊 Patch Semantic Diff Report\n\n`;
md += `**Date:** ${new Date().toISOString()}\n`;
md += `**Baseline:** \`${path.basename(oldFile)}\` | **Target:** \`${path.basename(newFile)}\`\n\n`;

md += `### Summary\n`;
md += `- ⚠️ **Champions needing manual review (Rework/Mechanic):** ${changes.reworks.length}\n`;
md += `- ✅ **Champions with numeric-only changes (Safe):** ${changes.numericOnly.length}\n`;
md += `- ⏸️ **Unchanged champions:** ${changes.unchanged}\n\n`;

if (changes.reworks.length > 0) {
  md += `## ⚠️ REWORK / HUMAN REVIEW REQUIRED\n`;
  md += `*These champions experienced additions, removals, or scaling stat modifications:*\n\n`;
  for (const item of changes.reworks) {
    md += `### 🔴 ${item.champion} (${item.reason})\n`;
    for (const d of item.details) {
      md += `- ${d}\n`;
    }
    md += `\n`;
  }
}

if (changes.numericOnly.length > 0) {
  md += `## ✅ SAFE NUMERIC UPDATES (Auto-Calculated)\n`;
  md += `*Only base values or existing ratio percentages modified:*\n\n`;
  for (const item of changes.numericOnly) {
    md += `### 🟢 ${item.champion}\n`;
    for (const d of item.details) {
      md += `- **${d.formula}**: ${d.baseChanged ? 'Base values updated' : ''} ${d.scalingsChanged ? 'Ratio values updated' : ''}\n`;
    }
    md += `\n`;
  }
}

fs.writeFileSync(outputFile, md, 'utf8');
console.log(`[Diff-Patch] Report written to ${outputFile}`);
console.log(`[Diff-Patch] Reworks detected: ${changes.reworks.length} | Numeric updates: ${changes.numericOnly.length}`);

// Output summary for GitHub Actions
if (process.env.GITHUB_OUTPUT) {
  const needsReview = changes.reworks.length > 0 ? 'true' : 'false';
  const hasChanges = (changes.reworks.length > 0 || changes.numericOnly.length > 0) ? 'true' : 'false';
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `needs_review=${needsReview}\nrework_count=${changes.reworks.length}\nnumeric_count=${changes.numericOnly.length}\nhas_changes=${hasChanges}\n`
  );
}
