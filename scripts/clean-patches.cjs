/**
 * clean-patches.cjs
 * 
 * Automatically cleans up old DDragon version folders and old spell formula files,
 * retaining only the most recent N patches (default: 2 -> latest + previous baseline)
 * plus active simulator files.
 * 
 * Usage:
 *   npm run clean:patches
 *   node scripts/clean-patches.cjs
 *   node scripts/clean-patches.cjs --keep 3
 *   node scripts/clean-patches.cjs --dry-run
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function getArg(flags, defaultValue = null) {
  for (const flag of (Array.isArray(flags) ? flags : [flags])) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
      return args[idx + 1];
    }
  }
  return defaultValue;
}

const isDryRun = args.includes('--dry-run');
const keepCount = parseInt(getArg(['--keep', '-k'], '2'), 10) || 2;

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

function formatBytes(bytes) {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function getDirectorySize(dirPath) {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else {
      size += stats.size;
    }
  }
  return size;
}

function main() {
  console.log('====================================================');
  console.log(`🧹 LoL Teamfight Simulator - Patch Data Cleaner ${isDryRun ? '(DRY RUN)' : ''}`);
  console.log('====================================================');

  const ddragonDir = path.join(__dirname, '..', 'public', 'ddragon');
  const dataDir = path.join(__dirname, '..', 'public', 'data');

  // 1. Discover all patch versions
  const discoveredPatches = new Set();

  if (fs.existsSync(ddragonDir)) {
    for (const f of fs.readdirSync(ddragonDir)) {
      if (/^\d+\.\d+\.\d+$/.test(f)) {
        const full = path.join(ddragonDir, f);
        if (fs.statSync(full).isDirectory()) {
          discoveredPatches.add(f);
        }
      }
    }
  }

  if (fs.existsSync(dataDir)) {
    for (const f of fs.readdirSync(dataDir)) {
      const m = f.match(/^spellFormulas-(\d+\.\d+\.\d+)\.json$/);
      if (m && m[1]) {
        discoveredPatches.add(m[1]);
      }
    }
  }

  const sortedPatches = Array.from(discoveredPatches).sort((a, b) => compareSemver(b, a));

  if (sortedPatches.length === 0) {
    console.log('No versioned patches found.');
    return;
  }

  const keepPatches = sortedPatches.slice(0, keepCount);
  const prunePatches = sortedPatches.slice(keepCount);

  console.log(`\n📌 Retention Policy: Keeping ${keepCount} most recent patch(es)`);
  console.log(`   Retained Patches:`);
  keepPatches.forEach((p, idx) => {
    const label = idx === 0 ? ' (Latest)' : idx === 1 ? ' (Previous Baseline)' : '';
    console.log(`     ✓ ${p}${label}`);
  });

  let totalBytesFreed = 0;
  let totalItemsRemoved = 0;

  if (prunePatches.length > 0) {
    console.log(`\n🗑️  Pruning Obsolete Patches (${prunePatches.length}):`);

    for (const patch of prunePatches) {
      console.log(`\n   Patch ${patch}:`);

      // Prune public/ddragon/<patch>
      const patchDDragonDir = path.join(ddragonDir, patch);
      if (fs.existsSync(patchDDragonDir)) {
        const dirSize = getDirectorySize(patchDDragonDir);
        totalBytesFreed += dirSize;
        totalItemsRemoved++;
        console.log(`     - public/ddragon/${patch}/ (${formatBytes(dirSize)})`);
        if (!isDryRun) {
          fs.rmSync(patchDDragonDir, { recursive: true, force: true });
        }
      }

      // Prune public/data/spellFormulas-<patch>.json
      const patchFormulasFile = path.join(dataDir, `spellFormulas-${patch}.json`);
      if (fs.existsSync(patchFormulasFile)) {
        const fileSize = fs.statSync(patchFormulasFile).size;
        totalBytesFreed += fileSize;
        totalItemsRemoved++;
        console.log(`     - public/data/spellFormulas-${patch}.json (${formatBytes(fileSize)})`);
        if (!isDryRun) {
          fs.unlinkSync(patchFormulasFile);
        }
      }
    }
  } else {
    console.log('\n✨ No older patch folders or formula files exceed the retention count.');
  }

  // 2. Clean up redundant/legacy files
  const redundantFiles = [
    path.join(dataDir, 'spellFormulas-latest.json'),
    path.join(dataDir, 'spellFormulas-prev.json'),
  ];

  let foundRedundant = false;
  for (const rf of redundantFiles) {
    if (fs.existsSync(rf)) {
      if (!foundRedundant) {
        console.log('\n🧹 Cleaning redundant legacy files:');
        foundRedundant = true;
      }
      const fileSize = fs.statSync(rf).size;
      totalBytesFreed += fileSize;
      totalItemsRemoved++;
      console.log(`     - ${path.relative(path.join(__dirname, '..'), rf)} (${formatBytes(fileSize)})`);
      if (!isDryRun) {
        fs.unlinkSync(rf);
      }
    }
  }

  console.log('\n====================================================');
  if (totalItemsRemoved > 0) {
    console.log(`${isDryRun ? '🔍 [DRY RUN] Would remove' : '🎉 Cleaned'} ${totalItemsRemoved} item(s)`);
    console.log(`💾 Total space ${isDryRun ? 'recoverable' : 'freed'}: ${formatBytes(totalBytesFreed)}`);
  } else {
    console.log('🎉 Everything is already clean! No obsolete files found.');
  }
  console.log('====================================================\n');
}

main();
