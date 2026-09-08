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

const fromPatchIdx = args.indexOf('--from-patch');
const fromPatch = fromPatchIdx !== -1 ? args[fromPatchIdx + 1] : '';

const toPatchIdx = args.indexOf('--to-patch');
const toPatch = toPatchIdx !== -1 ? args[toPatchIdx + 1] : '';

let resolvedFromPatch = fromPatch;
let resolvedToPatch = toPatch;

if (!oldFile && fromPatch && toPatch) {
  const candidateOld = path.join(__dirname, '..', 'public', 'data', `spellFormulas-${fromPatch}.json`);
  const candidateNew = path.join(__dirname, '..', 'public', 'data', `spellFormulas-${toPatch}.json`);
  if (fs.existsSync(candidateOld)) oldFile = candidateOld;
  if (fs.existsSync(candidateNew)) newFile = candidateNew;
}

if (!oldFile) {
  // Try to find the two most recent patch formula files (e.g. spellFormulas-16.16.1.json vs spellFormulas-16.17.1.json)
  const dataDir = path.join(__dirname, '..', 'public', 'data');
  if (fs.existsSync(dataDir)) {
    const patchFiles = fs.readdirSync(dataDir)
      .filter(f => /^spellFormulas-\d+\.\d+\.\d+\.json$/.test(f))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' }));

    if (patchFiles.length >= 2) {
      newFile = path.join(dataDir, patchFiles[0]);
      oldFile = path.join(dataDir, patchFiles[1]);
      const mTo = patchFiles[0].match(/spellFormulas-(.+)\.json/);
      const mFrom = patchFiles[1].match(/spellFormulas-(.+)\.json/);
      if (mTo) resolvedToPatch = mTo[1];
      if (mFrom) resolvedFromPatch = mFrom[1];
      console.log(`[Diff-Patch] Auto-detected patches for comparison: ${patchFiles[1]} ➔ ${patchFiles[0]}`);
    } else if (patchFiles.length === 1) {
      newFile = path.join(dataDir, patchFiles[0]);
    }
  }
}

if (!oldFile) {
  const candidateOld = path.join(__dirname, '..', 'public', 'data', 'spellFormulas-prev.json');
  if (fs.existsSync(candidateOld)) {
    oldFile = candidateOld;
  }
}

if (!oldFile || !fs.existsSync(oldFile)) {
  console.log('[Diff-Patch] Notice: No previous spellFormulas file found to compare against.');
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


// ==============================================================================
// ITEM COMPARISON (DDragon item.json)
// ==============================================================================
const itemChanges = {
  added: [],
  removed: [],
  modified: []
};

// Filter strictly for Summoner's Rift items (Map 11) matching simulator standard
function isSummonersRiftItem(id, item) {
  if (!item || !item.name) return false;
  if (!item.maps || item.maps['11'] !== true) return false;
  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum >= 10000) return false;

  const price = item.gold ? item.gold.total : 0;
  const inStore = item.inStore ?? (item.gold ? item.gold.purchasable !== false && price > 0 : false);
  const upgradedItemIds = [
    3040, 3042, 3121, 3002, 6701, 3010, 3013, 3866, 3867,
    3168, 3170, 3171, 3172, 3173, 3174, 3175
  ];
  if (!upgradedItemIds.includes(idNum) && (idNum < 7000 || idNum > 7050)) {
    if (!inStore || price <= 0) return false;
  }

  const name = item.name.toLowerCase();
  if (name.includes('guardian') || name.includes('poro') || name.includes('snowball')) return false;
  if (name.includes('juice') || name.includes('anvil') || name.includes('swarm') || name.includes('gangplank')) return false;
  if (name.includes('silver serpents') || name.includes('deprecated item')) return false;
  return true;
}

if (resolvedFromPatch && resolvedToPatch) {
  const oldItemPath = path.join(__dirname, '..', 'public', 'ddragon', resolvedFromPatch, 'item.json');
  const newItemPath = path.join(__dirname, '..', 'public', 'ddragon', resolvedToPatch, 'item.json');

  if (fs.existsSync(oldItemPath) && fs.existsSync(newItemPath)) {
    try {
      const oldItems = JSON.parse(fs.readFileSync(oldItemPath, 'utf8')).data || {};
      const newItems = JSON.parse(fs.readFileSync(newItemPath, 'utf8')).data || {};

      for (const [id, item] of Object.entries(newItems)) {
        if (!isSummonersRiftItem(id, item)) continue;
        const oldIt = oldItems[id];
        if (!oldIt || !isSummonersRiftItem(id, oldIt)) {
          itemChanges.added.push({ id, name: item.name });
        }
      }

      for (const [id, item] of Object.entries(oldItems)) {
        if (!isSummonersRiftItem(id, item)) continue;
        const newIt = newItems[id];
        if (!newIt || !isSummonersRiftItem(id, newIt)) {
          itemChanges.removed.push({ id, name: item.name });
        }
      }

      for (const [id, nItem] of Object.entries(newItems)) {
        if (!isSummonersRiftItem(id, nItem)) continue;
        const oItem = oldItems[id];
        if (!oItem || !isSummonersRiftItem(id, oItem)) continue;

        const diffs = [];
        const oGold = oItem.gold ? oItem.gold.total : 0;
        const nGold = nItem.gold ? nItem.gold.total : 0;
        if (oGold !== nGold) {
          diffs.push(`Gold: ${oGold} ➔ ${nGold}`);
        }

        const oStats = oItem.stats || {};
        const nStats = nItem.stats || {};
        const allStatKeys = Array.from(new Set([...Object.keys(oStats), ...Object.keys(nStats)]));
        for (const sk of allStatKeys) {
          const ov = oStats[sk] !== undefined ? oStats[sk] : 0;
          const nv = nStats[sk] !== undefined ? nStats[sk] : 0;
          if (ov !== nv) {
            const cleanStat = sk.replace(/^Flat/, '').replace(/^Percent/, '').replace(/Mod$/, '');
            diffs.push(`${cleanStat}: ${ov} ➔ ${nv}`);
          }
        }

        if (diffs.length > 0) {
          itemChanges.modified.push({
            id,
            name: nItem.name || `Item ${id}`,
            details: diffs
          });
        }
      }
    } catch (e) {
      console.warn('[Diff-Patch] Could not compare item.json:', e.message);
    }
  }
}

// ==============================================================================
// RUNE COMPARISON (DDragon runesReforged.json)
// ==============================================================================
const runeChanges = {
  added: [],
  removed: [],
  modified: []
};

if (resolvedFromPatch && resolvedToPatch) {
  const oldRunesPath = path.join(__dirname, '..', 'public', 'ddragon', resolvedFromPatch, 'runesReforged.json');
  const newRunesPath = path.join(__dirname, '..', 'public', 'ddragon', resolvedToPatch, 'runesReforged.json');

  if (fs.existsSync(oldRunesPath) && fs.existsSync(newRunesPath)) {
    try {
      const flattenRunes = (styles) => {
        const map = {};
        for (const style of styles) {
          for (const slot of (style.slots || [])) {
            for (const r of (slot.runes || [])) {
              map[r.id] = { ...r, styleName: style.name };
            }
          }
        }
        return map;
      };

      const oldRunes = flattenRunes(JSON.parse(fs.readFileSync(oldRunesPath, 'utf8')));
      const newRunes = flattenRunes(JSON.parse(fs.readFileSync(newRunesPath, 'utf8')));

      for (const [id, r] of Object.entries(newRunes)) {
        if (!oldRunes[id]) {
          runeChanges.added.push({ id, name: r.name, tree: r.styleName });
        }
      }

      for (const [id, r] of Object.entries(oldRunes)) {
        if (!newRunes[id]) {
          runeChanges.removed.push({ id, name: r.name, tree: r.styleName });
        }
      }

      for (const [id, nRune] of Object.entries(newRunes)) {
        const oRune = oldRunes[id];
        if (!oRune) continue;

        const diffs = [];
        if (oRune.name !== nRune.name) {
          diffs.push(`Name: '${oRune.name}' ➔ '${nRune.name}'`);
        }
        if (oRune.shortDesc !== nRune.shortDesc) {
          diffs.push(`Tooltip/Mechanic updated`);
        }

        if (diffs.length > 0) {
          runeChanges.modified.push({
            id,
            name: nRune.name,
            tree: nRune.styleName,
            details: diffs
          });
        }
      }
    } catch (e) {
      console.warn('[Diff-Patch] Could not compare runesReforged.json:', e.message);
    }
  }
}

// Generate Markdown Report
let md = `# 📊 Patch Semantic Diff Report\n\n`;
md += `**Date:** ${new Date().toISOString()}\n`;
if (resolvedFromPatch && resolvedToPatch) {
  md += `**Patch Comparison:** \`${resolvedFromPatch}\` ➔ \`${resolvedToPatch}\`\n`;
}
md += `**Baseline File:** \`${path.basename(oldFile)}\` | **Target File:** \`${path.basename(newFile)}\`\n\n`;

md += `### Summary\n`;
md += `- ⚠️ **Champions needing manual review (Rework/Mechanic):** ${changes.reworks.length}\n`;
md += `- ✅ **Champions with numeric-only changes (Safe):** ${changes.numericOnly.length}\n`;
md += `- ⏸️ **Unchanged champions:** ${changes.unchanged}\n`;
if (resolvedFromPatch && resolvedToPatch) {
  md += `- 🛡️ **Items modified:** ${itemChanges.modified.length} | **Added:** ${itemChanges.added.length} | **Removed:** ${itemChanges.removed.length}\n`;
  md += `- 🔮 **Runes modified:** ${runeChanges.modified.length} | **Added:** ${runeChanges.added.length} | **Removed:** ${runeChanges.removed.length}\n`;
}
md += `\n`;

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

// Add Item Changes Section
if (itemChanges.added.length > 0 || itemChanges.removed.length > 0 || itemChanges.modified.length > 0) {
  md += `## 🛡️ ITEM BALANCE & REWORKS\n`;
  md += `*Official Data Dragon item adjustments between patch ${resolvedFromPatch} and ${resolvedToPatch}:*\n\n`;

  if (itemChanges.added.length > 0) {
    md += `### 🆕 Added Items (${itemChanges.added.length})\n`;
    for (const it of itemChanges.added) {
      md += `- **${it.name}** (ID: ${it.id})\n`;
    }
    md += `\n`;
  }

  if (itemChanges.removed.length > 0) {
    md += `### 🗑️ Removed Items (${itemChanges.removed.length})\n`;
    for (const it of itemChanges.removed) {
      md += `- **${it.name}** (ID: ${it.id})\n`;
    }
    md += `\n`;
  }

  if (itemChanges.modified.length > 0) {
    md += `### ⚖️ Modified Items (${itemChanges.modified.length})\n`;
    for (const it of itemChanges.modified) {
      md += `- **${it.name}** (ID: ${it.id}): ${it.details.join(', ')}\n`;
    }
    md += `\n`;
  }
}

// Add Rune Changes Section
if (runeChanges.added.length > 0 || runeChanges.removed.length > 0 || runeChanges.modified.length > 0) {
  md += `## 🔮 RUNE BALANCE & ADJUSTMENTS\n`;
  md += `*Official Data Dragon rune adjustments between patch ${resolvedFromPatch} and ${resolvedToPatch}:*\n\n`;

  if (runeChanges.added.length > 0) {
    md += `### 🆕 Added Runes (${runeChanges.added.length})\n`;
    for (const r of runeChanges.added) {
      md += `- **${r.name}** [Tree: ${r.tree}] (ID: ${r.id})\n`;
    }
    md += `\n`;
  }

  if (runeChanges.removed.length > 0) {
    md += `### 🗑️ Removed Runes (${runeChanges.removed.length})\n`;
    for (const r of runeChanges.removed) {
      md += `- **${r.name}** [Tree: ${r.tree}] (ID: ${r.id})\n`;
    }
    md += `\n`;
  }

  if (runeChanges.modified.length > 0) {
    md += `### ⚖️ Modified Runes (${runeChanges.modified.length})\n`;
    for (const r of runeChanges.modified) {
      md += `- **${r.name}** [Tree: ${r.tree}] (ID: ${r.id}): ${r.details.join(', ')}\n`;
    }
    md += `\n`;
  }
}

fs.writeFileSync(outputFile, md, 'utf8');
console.log(`[Diff-Patch] Report written to ${outputFile}`);
console.log(`[Diff-Patch] Champions: ${changes.reworks.length} reworks, ${changes.numericOnly.length} numeric | Items: ${itemChanges.modified.length} modified, ${itemChanges.added.length} added | Runes: ${runeChanges.modified.length} modified, ${runeChanges.added.length} added`);

// Output summary for GitHub Actions
if (process.env.GITHUB_OUTPUT) {
  const needsReview = (changes.reworks.length > 0 || runeChanges.added.length > 0 || runeChanges.removed.length > 0) ? 'true' : 'false';
  const hasChanges = (
    changes.reworks.length > 0 ||
    changes.numericOnly.length > 0 ||
    itemChanges.modified.length > 0 ||
    itemChanges.added.length > 0 ||
    itemChanges.removed.length > 0 ||
    runeChanges.modified.length > 0 ||
    runeChanges.added.length > 0 ||
    runeChanges.removed.length > 0
  ) ? 'true' : 'false';

  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `needs_review=${needsReview}\nrework_count=${changes.reworks.length}\nnumeric_count=${changes.numericOnly.length}\nitem_changes_count=${itemChanges.modified.length + itemChanges.added.length}\nrune_changes_count=${runeChanges.modified.length + runeChanges.added.length}\nhas_changes=${hasChanges}\n`
  );
}
