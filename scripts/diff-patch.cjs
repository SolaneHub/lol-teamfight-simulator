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
const https = require('https');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);

function getArg(flags, defaultValue = '') {
  for (const flag of (Array.isArray(flags) ? flags : [flags])) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
      return args[idx + 1];
    }
  }
  return defaultValue;
}

function parseSemver(v) {
  if (!v) return [0, 0, 0];
  const parts = v.split('.').map((n) => parseInt(n, 10) || 0);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

function compareSemver(a, b) {
  const [a1, a2, a3] = parseSemver(a);
  const [b1, b2, b3] = parseSemver(b);
  if (a1 !== b1) return a1 - b1;
  if (a2 !== b2) return a2 - b2;
  return a3 - b3;
}

const oldFileArg = getArg('--old');
const newFileArg = getArg('--new');
const outputFileArg = getArg('--output', path.join(__dirname, '..', 'patch-diff-report.md'));
let fromPatchArg = getArg(['--from-patch', '--from']);
let toPatchArg = getArg(['--to-patch', '--to']);

// Positional arguments fallback (e.g. `npm run diff:patch -- 16.16.1 16.17.1`)
const positional = args.filter((a) => /^\d+\.\d+\.\d+$/.test(a));
if (!fromPatchArg && positional.length >= 2) {
  const sortedPos = [positional[0], positional[1]].sort(compareSemver);
  fromPatchArg = sortedPos[0];
  toPatchArg = sortedPos[1];
} else if (!toPatchArg && positional.length === 1) {
  toPatchArg = positional[0];
}

function fetchJsonWithTimeout(url, timeoutMs = 3500) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'LoL-Simulator-Diff/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJsonWithTimeout(res.headers.location, timeoutMs));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    });
  });
}

function getLocalVersions() {
  const versions = new Set();
  const ddragonDir = path.join(__dirname, '..', 'public', 'ddragon');
  if (fs.existsSync(ddragonDir)) {
    for (const f of fs.readdirSync(ddragonDir)) {
      if (/^\d+\.\d+\.\d+$/.test(f)) {
        const full = path.join(ddragonDir, f);
        if (fs.statSync(full).isDirectory()) versions.add(f);
      }
    }
    const latestJson = path.join(ddragonDir, 'latest.json');
    if (fs.existsSync(latestJson)) {
      try {
        const p = JSON.parse(fs.readFileSync(latestJson, 'utf8')).patch;
        if (p && /^\d+\.\d+\.\d+$/.test(p)) versions.add(p);
      } catch {}
    }
  }

  const dataDir = path.join(__dirname, '..', 'public', 'data');
  if (fs.existsSync(dataDir)) {
    for (const f of fs.readdirSync(dataDir)) {
      const m = f.match(/^spellFormulas-(\d+\.\d+\.\d+)\.json$/);
      if (m && m[1]) versions.add(m[1]);
    }
  }

  return Array.from(versions).sort((a, b) => compareSemver(b, a));
}

async function resolvePatches(reqFrom, reqTo) {
  let toPatch = reqTo;
  let fromPatch = reqFrom;

  let onlineVersions = [];
  try {
    const raw = await fetchJsonWithTimeout('https://ddragon.leagueoflegends.com/api/versions.json');
    if (Array.isArray(raw)) {
      onlineVersions = raw.filter((v) => /^\d+\.\d+\.\d+$/.test(v));
    }
  } catch (err) {
    console.warn(`[Diff-Patch] Notice: Could not reach Riot versions API (${err.message}). Using local cache.`);
  }

  const localVersions = getLocalVersions();
  const allMap = new Map();
  for (const v of onlineVersions) allMap.set(v, true);
  for (const v of localVersions) allMap.set(v, true);
  const allVersions = Array.from(allMap.keys()).sort((a, b) => compareSemver(b, a));

  if (!toPatch || toPatch === 'latest') {
    toPatch = allVersions[0] || '16.18.1';
  }

  if (!fromPatch) {
    const toIndex = allVersions.indexOf(toPatch);
    if (toIndex !== -1 && toIndex + 1 < allVersions.length) {
      fromPatch = allVersions[toIndex + 1];
    } else if (allVersions.length >= 2) {
      fromPatch = allVersions[1];
    } else {
      fromPatch = toPatch;
    }
  }

  return { fromPatch, toPatch };
}

function ensureDDragonData(patch) {
  if (!patch) return;
  const champFile = path.join(__dirname, '..', 'public', 'ddragon', patch, 'championFull.json');
  const itemFile = path.join(__dirname, '..', 'public', 'ddragon', patch, 'item.json');
  if (!fs.existsSync(champFile) || !fs.existsSync(itemFile)) {
    console.log(`[Diff-Patch] 📥 Missing DDragon files for patch ${patch}. Downloading...`);
    const res = spawnSync(process.execPath, [path.join(__dirname, 'sync-ddragon.cjs'), '--patch', patch], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    if (res.status !== 0) {
      console.warn(`[Diff-Patch] ⚠️ sync-ddragon exited with code ${res.status}`);
    }
  }
}

function ensureSpellFormulas(patch) {
  if (!patch) return;
  const formulasFile = path.join(__dirname, '..', 'public', 'data', `spellFormulas-${patch}.json`);
  if (!fs.existsSync(formulasFile)) {
    console.log(`[Diff-Patch] ⚙️ Missing spell formulas for patch ${patch}. Generating...`);
    const res = spawnSync(process.execPath, [path.join(__dirname, 'generate-spell-formulas.cjs'), '--patch', patch], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    if (res.status !== 0) {
      console.warn(`[Diff-Patch] ⚠️ generate-spell-formulas exited with code ${res.status}`);
    }
  }
}

let resolvedFromPatch = '';
let resolvedToPatch = '';

async function main() {
  let oldFile = oldFileArg;
  let newFile = newFileArg;
  let outputFile = outputFileArg;
  resolvedFromPatch = fromPatchArg;
  resolvedToPatch = toPatchArg;

  const dataDir = path.join(__dirname, '..', 'public', 'data');

  if (oldFile && newFile) {
    // Explicit files supplied
    if (!resolvedFromPatch) {
      const m = path.basename(oldFile).match(/spellFormulas-(.+)\.json/);
      if (m) resolvedFromPatch = m[1];
    }
    if (!resolvedToPatch) {
      const m = path.basename(newFile).match(/spellFormulas-(.+)\.json/);
      if (m) resolvedToPatch = m[1];
    }
  } else {
    // Dynamic resolution: latest patch vs previous patch
    const patches = await resolvePatches(resolvedFromPatch, resolvedToPatch);
    resolvedFromPatch = patches.fromPatch;
    resolvedToPatch = patches.toPatch;

    console.log(`[Diff-Patch] 🔍 Auto-detected patches for comparison: ${resolvedFromPatch} ➔ ${resolvedToPatch} (Previous vs Latest)`);

    // Ensure assets and formulas are generated
    ensureDDragonData(resolvedFromPatch);
    ensureDDragonData(resolvedToPatch);
    ensureSpellFormulas(resolvedFromPatch);
    ensureSpellFormulas(resolvedToPatch);

    oldFile = path.join(dataDir, `spellFormulas-${resolvedFromPatch}.json`);
    newFile = path.join(dataDir, `spellFormulas-${resolvedToPatch}.json`);

    // Keep default spellFormulas.json updated to the latest target
    const defaultFormulas = path.join(dataDir, 'spellFormulas.json');
    if (fs.existsSync(newFile)) {
      try {
        fs.copyFileSync(newFile, defaultFormulas);
      } catch {}
    }

    const latestJsonPath = path.join(__dirname, '..', 'public', 'ddragon', 'latest.json');
    try {
      fs.writeFileSync(latestJsonPath, JSON.stringify({ patch: resolvedToPatch, syncedAt: new Date().toISOString() }, null, 2), 'utf8');
    } catch {}
  }

  if (!oldFile || !fs.existsSync(oldFile)) {
    console.warn(`[Diff-Patch] Notice: Baseline formulas file not found: ${oldFile}`);
    process.exit(0);
  }
  if (!newFile || !fs.existsSync(newFile)) {
    console.warn(`[Diff-Patch] Notice: Target formulas file not found: ${newFile}`);
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
}

main().catch((err) => {
  console.error('[Diff-Patch] Fatal error:', err);
  process.exit(1);
});
