/**
 * pipeline.cjs
 * 
 * Unified pipeline orchestrator for LoL Teamfight Simulator:
 * 1. Synchronize Data Dragon assets for target patches (--from and --to / latest)
 * 2. Optionally trigger or verify Community Dragon download
 * 3. Generate champion HUD icons map (public/data/championHudMap.json)
 * 4. Generate spellFormulas for both patches (spellFormulas-<patch>.json and default spellFormulas.json)
 * 5. Run semantic diff comparing --from and --to patch formulas and write patch-diff-report.md
 * 
 * Usage:
 *   node scripts/pipeline.cjs
 *   node scripts/pipeline.cjs --from 16.16.1 --to 16.17.1
 *   node scripts/pipeline.cjs --to latest
 *   node scripts/pipeline.cjs --skip-cdragon
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const https = require('https');

const args = process.argv.slice(2);

function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return defaultValue;
}

const hasFlag = (flag) => args.includes(flag);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'LoL-Simulator-Pipeline' } }, (res) => {
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

function runScript(scriptPath, scriptArgs = []) {
  console.log(`\n▶ Running node ${path.basename(scriptPath)} ${scriptArgs.join(' ')}`);
  const res = spawnSync(process.execPath, [scriptPath, ...scriptArgs], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
  if (res.status !== 0) {
    throw new Error(`Execution failed for ${path.basename(scriptPath)} (exit code ${res.status})`);
  }
}

async function main() {
  console.log('====================================================');
  console.log('⚡ LoL Teamfight Simulator - Data Pipeline');
  console.log('====================================================');

  // 1. Resolve patches
  console.log('\n🔍 [Step 1/5] Resolving patch versions...');
  const versions = await fetchJson('https://ddragon.leagueoflegends.com/api/versions.json');
  const validVersions = versions.filter((v) => /^\d+\.\d+\.\d+$/.test(v));

  let targetTo = getArg('--to', 'latest');
  if (targetTo === 'latest') {
    targetTo = validVersions[0];
  }

  let targetFrom = getArg('--from', null);
  if (!targetFrom) {
    const toIndex = validVersions.indexOf(targetTo);
    if (toIndex !== -1 && toIndex + 1 < validVersions.length) {
      targetFrom = validVersions[toIndex + 1];
    } else {
      targetFrom = validVersions[1] || targetTo;
    }
  }

  console.log(`   Baseline patch (--from): ${targetFrom}`);
  console.log(`   Target patch   (--to):   ${targetTo}`);

  // 2. Synchronize DDragon files
  console.log('\n📥 [Step 2/5] Checking Data Dragon files...');
  const syncDDragonScript = path.join(__dirname, 'sync-ddragon.cjs');
  const checkPatchDDragon = (patch) => {
    const p = path.join(__dirname, '..', 'public', 'ddragon', patch, 'championFull.json');
    return fs.existsSync(p);
  };

  if (!checkPatchDDragon(targetFrom)) {
    console.log(`   Fetching missing DDragon data for ${targetFrom}...`);
    runScript(syncDDragonScript, ['--patch', targetFrom]);
  } else {
    console.log(`   ✓ DDragon cache valid for ${targetFrom}`);
  }

  if (!checkPatchDDragon(targetTo)) {
    console.log(`   Fetching missing DDragon data for ${targetTo}...`);
    runScript(syncDDragonScript, ['--patch', targetTo]);
  } else {
    console.log(`   ✓ DDragon cache valid for ${targetTo}`);
  }

  // Always make sure latest.json matches targetTo
  const latestJsonPath = path.join(__dirname, '..', 'public', 'ddragon', 'latest.json');
  fs.writeFileSync(latestJsonPath, JSON.stringify({ patch: targetTo, syncedAt: new Date().toISOString() }, null, 2), 'utf8');

  // 3. Check CDragon assets
  console.log('\n🐉 [Step 3/5] Checking Community Dragon assets...');
  const cdragonDir = path.join(__dirname, '..', 'public', 'cdragon');
  const cdragonChamps = path.join(cdragonDir, 'champions');
  const hasCDragon = fs.existsSync(cdragonChamps) && fs.readdirSync(cdragonChamps).length > 50;

  if (!hasCDragon) {
    if (hasFlag('--skip-cdragon')) {
      console.warn('   ⚠️ Community Dragon directory missing or incomplete, but --skip-cdragon was passed.');
    } else {
      console.log('   CDragon data not found. Running download-cdragon.ps1...');
      const pwshRes = spawnSync('pwsh', ['./scripts/download-cdragon.ps1'], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });
      if (pwshRes.status !== 0) {
        console.warn('   ⚠️ CDragon download finished with warnings or non-zero exit code.');
      }
    }
  } else {
    console.log(`   ✓ Community Dragon assets present (${fs.readdirSync(cdragonChamps).length} champions cached)`);
  }

  // 4. Generate HUD Map & Spell Formulas
  console.log('\n⚙️ [Step 4/5] Generating HUD Map and Spell Formulas...');
  
  // 4.1 HUD Map
  const hudScript = path.join(__dirname, 'generate-hud-map.cjs');
  runScript(hudScript, ['--patch', targetTo]);

  // 4.2 Formulas for targetFrom (baseline)
  const formulasScript = path.join(__dirname, 'generate-spell-formulas.cjs');
  const fromFormulasFile = path.join(__dirname, '..', 'public', 'data', `spellFormulas-${targetFrom}.json`);
  if (!fs.existsSync(fromFormulasFile) || hasFlag('--force-recalc')) {
    console.log(`   Calculating spell formulas for baseline ${targetFrom}...`);
    runScript(formulasScript, ['--patch', targetFrom]);
  } else {
    console.log(`   ✓ Baseline formulas for ${targetFrom} already exist`);
  }

  // 4.3 Formulas for targetTo (target)
  console.log(`   Calculating spell formulas for target ${targetTo}...`);
  runScript(formulasScript, ['--patch', targetTo]);

  // Keep active default spellFormulas.json updated to targetTo
  const targetFormulasFile = path.join(__dirname, '..', 'public', 'data', `spellFormulas-${targetTo}.json`);
  const defaultFormulasFile = path.join(__dirname, '..', 'public', 'data', 'spellFormulas.json');
  if (fs.existsSync(targetFormulasFile)) {
    fs.copyFileSync(targetFormulasFile, defaultFormulasFile);
    console.log(`   ✓ Synced default spellFormulas.json to patch ${targetTo}`);
  }

  // 5. Semantic Diff Report
  console.log('\n📊 [Step 5/5] Performing Semantic Diff Analysis...');
  const diffScript = path.join(__dirname, 'diff-patch.cjs');
  runScript(diffScript, [
    '--old', path.join(__dirname, '..', 'public', 'data', `spellFormulas-${targetFrom}.json`),
    '--new', path.join(__dirname, '..', 'public', 'data', `spellFormulas-${targetTo}.json`),
    '--from-patch', targetFrom,
    '--to-patch', targetTo
  ]);

  console.log('\n====================================================');
  console.log(`🎉 Pipeline completed successfully!`);
  console.log(`   From:   ${targetFrom}`);
  console.log(`   To:     ${targetTo}`);
  console.log(`   Report: patch-diff-report.md`);
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Pipeline failed:', err.message);
  process.exit(1);
});
