/**
 * sync-ddragon.cjs
 * 
 * Fetches and saves official Data Dragon JSON files (championFull, item, runesReforged)
 * for a specified patch to ensure offline stability, deterministic formula generation,
 * and semantic diff comparisons.
 * 
 * Usage:
 *   node scripts/sync-ddragon.cjs [--patch 14.20.1]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);
let targetPatch = 'latest';
const patchIdx = args.indexOf('--patch');
if (patchIdx !== -1 && args[patchIdx + 1]) {
  targetPatch = args[patchIdx + 1];
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LoL-Simulator-Sync' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJson(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to GET ${url} - Status ${res.statusCode}`));
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
    }).on('error', reject);
  });
}

async function main() {
  console.log(`[DDragon Sync] Resolving patch version (target: ${targetPatch})...`);

  let resolvedPatch = targetPatch;
  if (targetPatch === 'latest') {
    const versions = await fetchJson('https://ddragon.leagueoflegends.com/api/versions.json');
    resolvedPatch = versions[0];
    console.log(`[DDragon Sync] Latest patch identified as: ${resolvedPatch}`);
  }

  const ddragonBase = `https://ddragon.leagueoflegends.com/cdn/${resolvedPatch}/data/en_US`;
  const outDir = path.join(__dirname, '..', 'public', 'ddragon', resolvedPatch);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const endpoints = [
    { name: 'championFull.json', url: `${ddragonBase}/championFull.json` },
    { name: 'item.json', url: `${ddragonBase}/item.json` },
    { name: 'runesReforged.json', url: `${ddragonBase}/runesReforged.json` },
  ];

  for (const ep of endpoints) {
    const dest = path.join(outDir, ep.name);
    console.log(`[DDragon Sync] Downloading ${ep.name}...`);
    const data = await fetchJson(ep.url);
    fs.writeFileSync(dest, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[DDragon Sync] Saved to ${dest}`);
  }

  const metaPath = path.join(__dirname, '..', 'public', 'ddragon', 'latest.json');
  fs.writeFileSync(metaPath, JSON.stringify({ patch: resolvedPatch, syncedAt: new Date().toISOString() }, null, 2), 'utf8');

  console.log(`[DDragon Sync] Done! DDragon JSONs for patch ${resolvedPatch} are ready.`);
}

main().catch((err) => {
  console.error('[DDragon Sync] Error:', err);
  process.exit(1);
});
