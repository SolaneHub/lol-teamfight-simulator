/**
 * generate-hud-map.cjs
 * 
 * Inspects all 173 champions in out/champions/{champ}/data/{champ}.bin.json
 * and matches each passive & spell (Q, W, E, R) to its exact file in out/champions/{champ}/assets/hud/.
 * 
 * Outputs public/data/championHudMap.json
 */

const fs = require('fs');
const path = require('path');

const OUT_CHAMPS_DIR = fs.existsSync(path.join(__dirname, '..', 'public', 'cdragon', 'champions'))
  ? path.join(__dirname, '..', 'public', 'cdragon', 'champions')
  : path.join(__dirname, '..', 'public', 'out', 'champions');
const args = process.argv.slice(2);
let patchVersion = 'latest';
const patchIdx = args.indexOf('--patch');
if (patchIdx !== -1 && args[patchIdx + 1]) {
  patchVersion = args[patchIdx + 1];
}

const DDRAGON_BASE = path.join(__dirname, '..', 'public', 'ddragon');
let resolvedPatch = patchVersion;
if (resolvedPatch === 'latest') {
  const latestJson = path.join(DDRAGON_BASE, 'latest.json');
  if (fs.existsSync(latestJson)) {
    try {
      resolvedPatch = JSON.parse(fs.readFileSync(latestJson, 'utf8')).patch || 'latest';
    } catch {}
  }
}

const DDRAGON_FULL_FILE = path.join(DDRAGON_BASE, resolvedPatch, 'championFull.json');
const DDRAGON_CHAMPS_DIR = path.join(DDRAGON_BASE, resolvedPatch, 'data', 'en_US', 'champion');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'championHudMap.json');

function main() {
  const champs = fs.readdirSync(OUT_CHAMPS_DIR);
  const hudMap = {};
  let mappedCount = 0;

  let fullChampionsData = null;
  if (fs.existsSync(DDRAGON_FULL_FILE)) {
    try {
      fullChampionsData = JSON.parse(fs.readFileSync(DDRAGON_FULL_FILE, 'utf8')).data;
    } catch (e) {
      console.warn(`Failed to parse ${DDRAGON_FULL_FILE}:`, e.message);
    }
  }

  for (const c of champs) {
    const binPath = path.join(OUT_CHAMPS_DIR, c, 'data', `${c}.bin.json`);
    const hudDir = path.join(OUT_CHAMPS_DIR, c, 'assets', 'hud');

    if (!fs.existsSync(binPath) || !fs.existsSync(hudDir)) continue;

    let binData;
    try {
      binData = JSON.parse(fs.readFileSync(binPath, 'utf8'));
    } catch (e) {
      console.warn(`Failed to parse bin.json for ${c}`);
      continue;
    }

    const hudFiles = fs.readdirSync(hudDir);

    // Read DDragon spell list for spell IDs (e.g. DariusQ, DariusW...)
    let champData = null;
    if (fullChampionsData) {
      const champKey = Object.keys(fullChampionsData).find(k => k.toLowerCase() === c.toLowerCase());
      if (champKey) {
        champData = fullChampionsData[champKey];
      }
    }
    if (!champData && fs.existsSync(DDRAGON_CHAMPS_DIR)) {
      const ddFiles = fs.readdirSync(DDRAGON_CHAMPS_DIR);
      const actualDD = ddFiles.find(f => f.toLowerCase() === `${c.toLowerCase()}.json`);
      if (actualDD) {
        const ddData = JSON.parse(fs.readFileSync(path.join(DDRAGON_CHAMPS_DIR, actualDD), 'utf8'));
        champData = ddData.data[Object.keys(ddData.data)[0]];
      }
    }
    if (!champData) continue;

    const entry = { passive: '', spells: [] };

    // 1. Passive matching
    let passIconName = '';
    const rootKey = Object.keys(binData).find(k => k.endsWith('/CharacterRecords/Root'));
    if (rootKey && binData[rootKey]) {
      const root = binData[rootKey];
      if (root.passiveIcon) {
        passIconName = path.basename(root.passiveIcon).toLowerCase().replace(/\.dds$/, '.png');
      }
    }

    let passMatch = '';
    if (passIconName) {
      passMatch = hudFiles.find(f => f.toLowerCase() === passIconName);
    }
    if (!passMatch) {
      passMatch = hudFiles.find(f => 
        f.toLowerCase().includes('passive') || 
        f.toLowerCase().includes('_p.') || 
        f.toLowerCase().endsWith('p.png') || 
        f.toLowerCase().endsWith('p1.png')
      );
    }
    entry.passive = passMatch || hudFiles[0] || '';

    // 2. Q, W, E, R spell matching
    champData.spells.forEach((s, idx) => {
      const spellId = s.id;
      const letter = ['q', 'w', 'e', 'r'][idx];

      let iconName = '';
      const spellKeys = Object.keys(binData).filter(k => k.includes('/Spells/'));
      for (const k of spellKeys) {
        const parts = k.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart.toLowerCase() === spellId.toLowerCase()) {
          const mImg = binData[k]?.mSpell?.mImgIconName;
          if (mImg && mImg[0]) {
            iconName = path.basename(mImg[0]).toLowerCase().replace(/\.dds$/, '.png');
            break;
          }
        }
      }

      let spellMatch = '';
      if (iconName) {
        spellMatch = hudFiles.find(f => f.toLowerCase() === iconName);
      }
      if (!spellMatch) {
        const nonPassive = hudFiles.filter(f => f !== entry.passive);
        spellMatch = nonPassive.find(f => {
          const fl = f.toLowerCase();
          return fl.endsWith(`_${letter}.png`) || 
                 fl.endsWith(`${letter}.png`) || 
                 fl.endsWith(`${letter}1.png`) || 
                 fl.endsWith(`${letter}01.png`);
        });
        if (!spellMatch) {
          spellMatch = nonPassive[idx] || hudFiles[idx + 1] || hudFiles[0];
        }
      }
      entry.spells.push(spellMatch);
    });

    hudMap[c.toLowerCase()] = entry;
    mappedCount++;
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(hudMap, null, 2));

  console.log(`Successfully generated championHudMap.json for ${mappedCount} champions!`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main();
