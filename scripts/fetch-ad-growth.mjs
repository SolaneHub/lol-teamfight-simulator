import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '../public/ddragon/16.14.1/data/en_US');
const CHAMPION_JSON_PATH = resolve(DATA_DIR, 'champion.json');
const CHAMPION_FULL_JSON_PATH = resolve(DATA_DIR, 'championFull.json');
const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/game/data/characters';

async function fetchAdGrowth(champId) {
  const url = `${CDRAGON_BASE}/${champId.toLowerCase()}/${champId.toLowerCase()}.bin.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠ ${champId}: HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();

    // Find the CharacterRecord key
    const recordKey = Object.keys(data).find(k =>
      k.toLowerCase().includes('characterrecords/root')
    );
    if (!recordKey) {
      console.warn(`  ⚠ ${champId}: No CharacterRecord found`);
      return null;
    }

    const record = data[recordKey];
    const adGrowth = record?.damagePerLevelModifiable?.baseValue;
    if (adGrowth === undefined || adGrowth === null) {
      console.warn(`  ⚠ ${champId}: No damagePerLevelModifiable`);
      return null;
    }

    return Math.round(adGrowth * 1000) / 1000; // clean float
  } catch (err) {
    console.warn(`  ⚠ ${champId}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('Reading local champion.json and championFull.json...');
  const championRaw = readFileSync(CHAMPION_JSON_PATH, 'utf8');
  const championData = JSON.parse(championRaw);

  const championFullRaw = readFileSync(CHAMPION_FULL_JSON_PATH, 'utf8');
  const championFullData = JSON.parse(championFullRaw);

  const champions = Object.keys(championData.data);
  console.log(`Found ${champions.length} champions. Fetching AD growth from Community Dragon...\n`);

  let patched = 0;
  let failed = 0;

  // Process in batches of 10 to avoid overwhelming the server
  for (let i = 0; i < champions.length; i += 10) {
    const batch = champions.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(async (champId) => {
        const adGrowth = await fetchAdGrowth(champId);
        return { champId, adGrowth };
      })
    );

    for (const { champId, adGrowth } of results) {
      if (adGrowth !== null) {
        // Patch champion.json
        if (championData.data[champId]) {
          championData.data[champId].stats.attackdamageperlevel = adGrowth;
        }
        
        // Patch championFull.json
        if (championFullData.data[champId]) {
          championFullData.data[champId].stats.attackdamageperlevel = adGrowth;
        }

        // Patch individual champion file (e.g. champion/Ahri.json)
        const individualPath = resolve(DATA_DIR, 'champion', `${champId}.json`);
        if (existsSync(individualPath)) {
          try {
            const indRaw = readFileSync(individualPath, 'utf8');
            const indData = JSON.parse(indRaw);
            if (indData.data[champId]) {
              indData.data[champId].stats.attackdamageperlevel = adGrowth;
              writeFileSync(individualPath, JSON.stringify(indData), 'utf8');
            }
          } catch (err) {
            console.warn(`  ⚠ Failed to patch individual file for ${champId}: ${err.message}`);
          }
        }

        console.log(`  ✓ ${champId}: ${adGrowth}`);
        patched++;
      } else {
        failed++;
      }
    }
  }

  console.log(`\nPatched: ${patched}, Failed: ${failed}`);
  console.log('Writing patched champion.json and championFull.json...');
  writeFileSync(CHAMPION_JSON_PATH, JSON.stringify(championData), 'utf8');
  writeFileSync(CHAMPION_FULL_JSON_PATH, JSON.stringify(championFullData), 'utf8');
  console.log('Done!');
}

main();
