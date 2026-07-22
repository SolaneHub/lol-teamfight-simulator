/**
 * generate-spell-formulas.cjs
 * 
 * Reads every champion's DDragon tooltip placeholders and CDragon bin.json
 * spell data (DataValues + mSpellCalculations + DDragon effect vectors)
 * to auto-generate spellFormulas.json for ALL champions (including Passive scaling stats).
 * 
 * Usage: node scripts/generate-spell-formulas.cjs
 */

const fs = require('fs');
const path = require('path');

const DDRAGON_DIR = path.join(__dirname, '..', 'public', 'ddragon', '16.14.1', 'data', 'en_US', 'champion');
const OUT_DIR = path.join(__dirname, '..', 'out', 'champions');
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'spellFormulas.json');

// Stat coefficient type mapping
const STAT_MAP = {
  0: 'totalAp',    // default AP
  1: 'bonusAd',
  2: 'totalAd',
  3: 'bonusHp',
  4: 'totalHp',
  5: 'armor',
  6: 'magicResist',
  7: 'attackSpeed',
  11: 'abilityHaste',
  12: 'critChance',
  15: 'totalAp',
  18: 'lifesteal',
  20: 'totalAd',
};

function getStatName(mStat) {
  if (mStat === undefined || mStat === null) return 'totalAp';
  return STAT_MAP[mStat] || `stat_${mStat}`;
}

function parseCalculation(calcName, calcDef, dataValuesMap, allCalcs) {
  if (!calcDef) return null;
  
  const result = { base: [], scalings: [], type: 'magic' };
  const isPercent = calcDef.mDisplayAsPercent === true;

  if (calcDef.__type === 'GameCalculationModified') {
    const refCalcName = calcDef.mModifiedGameCalculation;
    if (refCalcName && allCalcs[refCalcName]) {
      const baseCalc = parseCalculation(refCalcName, allCalcs[refCalcName], dataValuesMap, allCalcs);
      if (baseCalc && calcDef.mMultiplier) {
        let mult = 1;
        if (typeof calcDef.mMultiplier === 'number') {
          mult = calcDef.mMultiplier;
        } else if (calcDef.mMultiplier?.mDataValue) {
          const multiplierDV = calcDef.mMultiplier.mDataValue;
          const multValues = dataValuesMap[multiplierDV?.toLowerCase()];
          if (multValues && multValues.length > 0) {
            mult = multValues[0];
          }
        }
        baseCalc.base = baseCalc.base.map(v => roundVal(v * mult));
        baseCalc.scalings = baseCalc.scalings.map(s => ({
          ...s,
          ratio: Array.isArray(s.ratio)
            ? s.ratio.map(r => roundVal(r * mult))
            : roundVal(s.ratio * mult)
        }));
      }
      if (isPercent) {
        baseCalc.type = 'status';
        baseCalc.base = baseCalc.base.map(v => roundVal(v * (v > 1 ? 1 : 100)));
      }
      return baseCalc;
    }
    return null;
  }
  
  const parts = calcDef.mFormulaParts;
  if (!parts || !Array.isArray(parts)) return null;
  
  for (const part of parts) {
    switch (part.__type) {
      case 'ByCharLevelInterpolationCalculationPart': {
        const startVal = part.mStartValue || 0;
        const endVal = part.mEndValue || 0;
        const arr = [];
        const mult = isPercent ? 100 : 1;
        for (let l = 1; l <= 18; l++) {
          const val = startVal + (endVal - startVal) * ((l - 1) / 17);
          arr.push(roundVal(val * mult));
        }
        result.base = arr;
        break;
      }

      case 'ByCharLevelBreakpointsCalculationPart': {
        let val = part.mLevel1Value || 0;
        const breakpoints = part.mBreakpoints || [];
        const arr = [];
        const mult = isPercent ? 100 : 1;
        for (let l = 1; l <= 18; l++) {
          const bp = breakpoints.find(b => b.mLevel === l);
          if (bp) val += (bp.mAdditionalBonusAtThisLevel || 0);
          arr.push(roundVal(val * mult));
        }
        result.base = arr;
        break;
      }

      case 'NamedDataValueCalculationPart': {
        const dvName = part.mDataValue;
        if (dvName) {
          const vals = dataValuesMap[dvName.toLowerCase()];
          if (vals) {
            const rankVals = vals.slice(1, 6);
            if (rankVals.length > 0) {
              result.base = rankVals.map(v => roundVal(v * (isPercent ? (v > 1 ? 1 : 100) : 1)));
            }
          }
        }
        break;
      }
      
      case 'BuffCounterByNamedDataValueCalculationPart': {
        const dvName = part.mDataValue;
        if (dvName) {
          const vals = dataValuesMap[dvName.toLowerCase()];
          if (vals && vals.length > 0) {
            const rankVals = vals.slice(1, 6);
            result.base = rankVals.length > 0 ? rankVals.map(v => roundVal(v * (isPercent ? (v > 1 ? 1 : 100) : 1))) : [roundVal(vals[0])];
          }
        }
        break;
      }

      case 'BuffCounterByCoefficientCalculationPart': {
        if (part.mCoefficient) {
          result.base = [roundVal(part.mCoefficient * (isPercent ? 100 : 1))];
        }
        break;
      }

      case 'NumberCalculationPart': {
        if (part.mNumber !== undefined) {
          result.base = [roundVal(part.mNumber * (isPercent ? (part.mNumber > 1 ? 1 : 100) : 1))];
        }
        break;
      }

      case 'ByCharLevelFormulaCalculationPart': {
        const startVal = part.mStartValue || part.mLevel1Value || 0;
        const endVal = part.mEndValue || startVal;
        const arr = [];
        const mult = isPercent ? 100 : 1;
        for (let l = 1; l <= 18; l++) {
          const val = startVal + (endVal - startVal) * ((l - 1) / 17);
          arr.push(roundVal(val * mult));
        }
        result.base = arr;
        break;
      }

      case 'StatByCoefficientCalculationPart': {
        const ratio = part.mCoefficient || 0;
        const stat = getStatName(part.mStat);
        if (ratio !== 0) {
          result.scalings.push({ ratio: roundVal(ratio), stat });
        }
        break;
      }
      
      case 'StatByNamedDataValueCalculationPart': {
        const dvName = part.mDataValue;
        const stat = getStatName(part.mStat);
        if (dvName) {
          const vals = dataValuesMap[dvName.toLowerCase()];
          if (vals) {
            const rankVals = vals.slice(1, 6);
            const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
            if (allSame) {
              result.scalings.push({ ratio: roundVal(rankVals[0]), stat });
            } else {
              result.scalings.push({ ratio: rankVals.map(v => roundVal(v)), stat });
            }
          }
        }
        break;
      }
      
      case 'StatBySubPartCalculationPart': {
        const stat = getStatName(part.mStat);
        if (part.mSubpart) {
          const subDvName = part.mSubpart.mDataValue;
          if (subDvName) {
            const vals = dataValuesMap[subDvName.toLowerCase()];
            if (vals) {
              const rankVals = vals.slice(1, 6);
              const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
              result.scalings.push({
                ratio: allSame ? roundVal(rankVals[0]) : rankVals.map(v => roundVal(v)),
                stat
              });
            }
          }
        }
        break;
      }
      
      default:
        break;
    }
  }
  
  if (result.base.length > 0 || result.scalings.length > 0) {
    if (isPercent) {
      result.type = 'status';
    }
    return result;
  }
  return null;
}

function roundVal(v) {
  return Math.round(v * 100) / 100;
}

function processChampion(champId) {
  const champFormulas = {};
  const folderName = champId.toLowerCase();
  
  const ddragonFile = path.join(DDRAGON_DIR, `${champId}.json`);
  if (!fs.existsSync(ddragonFile)) return null;
  
  const ddragonData = JSON.parse(fs.readFileSync(ddragonFile, 'utf8'));
  const champData = ddragonData.data[champId];
  if (!champData) return null;
  
  const binFile = path.join(OUT_DIR, folderName, 'data', `${folderName}.bin.json`);
  let binData = null;
  if (fs.existsSync(binFile)) {
    try {
      binData = JSON.parse(fs.readFileSync(binFile, 'utf8'));
    } catch (e) {}
  }
  
  // Collect champion-wide DataValues & Calculations across all spells
  const globalDvMap = {};
  const globalCalcsMap = {};
  if (binData) {
    for (const [k, obj] of Object.entries(binData)) {
      const spell = obj?.mSpell || (obj?.DataValues ? obj : null);
      if (!spell) continue;

      if (spell.DataValues) {
        for (const dv of spell.DataValues) {
          if (dv.name && dv.values) {
            globalDvMap[dv.name.toLowerCase()] = dv.values;
          }
        }
      }
      if (spell.mSpellCalculations) {
        for (const [calcName, calcDef] of Object.entries(spell.mSpellCalculations)) {
          globalCalcsMap[calcName.toLowerCase()] = calcDef;
        }
      }
    }
  }

  if (binData) {
    // Extract PASSIVE formulas (check key, ObjectName, and mImgIconName)
    const passiveFormulas = {};

    for (const [k, obj] of Object.entries(binData)) {
      const spell = obj?.mSpell || (obj?.DataValues ? obj : null);
      if (!spell) continue;

      const objName = (obj.ObjectName || '').toLowerCase();
      const iconName = (spell.mImgIconName ? spell.mImgIconName[0] : '').toLowerCase();
      const keyLower = k.toLowerCase();

      const isPassiveObj = keyLower.includes('passive') || keyLower.endsWith('p') || 
                          objName.includes('passive') || objName.endsWith('p') || 
                          iconName.includes('passive') || iconName.includes('_p.');

      if (isPassiveObj) {
        const dataValues = spell.DataValues || [];
        const calculations = spell.mSpellCalculations || {};

        const dvMap = {};
        for (const dv of dataValues) {
          if (dv.name && dv.values) {
            dvMap[dv.name.toLowerCase()] = dv.values;
          }
        }

        for (const [calcName, calcDef] of Object.entries(calculations)) {
          const parsed = parseCalculation(calcName, calcDef, dvMap, calculations);
          if (parsed && (parsed.base.length > 0 || parsed.scalings.length > 0)) {
            passiveFormulas[calcName] = parsed;
          }
        }
      }
    }

    if (Object.keys(passiveFormulas).length > 0) {
      champFormulas['passive'] = passiveFormulas;
    }
  }

  // Extract ACTIVE SPELLS (Q, W, E, R)
  for (let i = 0; i < champData.spells.length; i++) {
    const ddSpell = champData.spells[i];
    const spellId = ddSpell.id;
    
    const placeholderMatches = ddSpell.tooltip.match(/\{\{\s*([^}]+?)\s*\}\}/g);
    if (!placeholderMatches || placeholderMatches.length === 0) continue;
    
    const placeholders = placeholderMatches
      .map(m => m.replace(/\{\{\s*|\s*\}\}/g, '').trim())
      .filter(p => !['spellmodifierdescriptionappend', 'specialabilityoverride', 'spellmodifierdescription'].includes(p.toLowerCase()));
    
    if (placeholders.length === 0) continue;
    
    let mSpell = null;
    let dataValues = [];
    let calculations = {};
    const dvMap = {};

    if (binData) {
      const spellKey = Object.keys(binData).find(k => {
        const parts = k.split('/');
        return parts.length >= 4 && 
               parts[0] === 'Characters' &&
               parts[2] === 'Spells' &&
               parts[parts.length - 1].toLowerCase() === spellId.toLowerCase();
      });
      
      if (spellKey && binData[spellKey]?.mSpell) {
        mSpell = binData[spellKey].mSpell;
        dataValues = mSpell.DataValues || [];
        calculations = mSpell.mSpellCalculations || {};
        
        for (const dv of dataValues) {
          if (dv.name && dv.values) {
            dvMap[dv.name.toLowerCase()] = dv.values;
          }
        }
      }
    }
    
    const spellFormula = {};
    
    for (const placeholder of placeholders) {
      let cleanName = placeholder.replace(/\*[\d.-]+/g, '').trim();
      cleanName = cleanName.replace(/\.\d+$/g, '').trim();

      const hasMultiplier = placeholder.includes('*');
      let multiplier = 1;
      if (hasMultiplier) {
        const multMatch = placeholder.match(/\*([\d.-]+)/);
        if (multMatch) multiplier = parseFloat(multMatch[1]);
      }
      
      if (spellFormula[placeholder]) continue;

      // Extract target sub-name if prefix exists (e.g. spell.glacialstorm:slowamount -> slowamount)
      let targetName = cleanName;
      if (cleanName.includes(':')) {
        targetName = cleanName.split(':').pop().trim();
      } else if (cleanName.includes('.')) {
        targetName = cleanName.split('.').pop().trim();
      }

      const candidateKeys = [
        cleanName.toLowerCase(),
        targetName.toLowerCase(),
        `calc_${cleanName.toLowerCase()}`,
        `calc_${targetName.toLowerCase()}`,
        cleanName.toLowerCase().replace(/^calc_/, ''),
        targetName.toLowerCase().replace(/^calc_/, '')
      ];
      
      // 1. Check mSpellCalculations in local spell or global map
      const calcKey = Object.keys(calculations).find(k => candidateKeys.includes(k.toLowerCase())) ||
                     Object.keys(globalCalcsMap).find(k => candidateKeys.includes(k.toLowerCase()));
      
      const calcObj = calcKey ? (calculations[calcKey] || globalCalcsMap[calcKey]) : null;
      if (calcKey && calcObj) {
        const parsed = parseCalculation(calcKey, calcObj, { ...globalDvMap, ...dvMap }, calculations);
        if (parsed) {
          if (multiplier !== 1) {
            parsed.base = parsed.base.map(v => roundVal(v * multiplier));
            parsed.scalings = parsed.scalings.map(s => ({
              ...s,
              ratio: Array.isArray(s.ratio)
                ? s.ratio.map(r => roundVal(r * multiplier))
                : roundVal(s.ratio * multiplier)
            }));
          }
          if (parsed.scalings.length === 0) delete parsed.scalings;
          spellFormula[placeholder] = parsed;
          continue;
        }
      }
      
      // 2. Check DataValues in local spell or global map
      const dvKey = Object.keys(dvMap).find(k => candidateKeys.includes(k.toLowerCase())) ||
                    Object.keys(globalDvMap).find(k => candidateKeys.includes(k.toLowerCase()));
      if (dvKey) {
        const vals = dvMap[dvKey] || globalDvMap[dvKey];
        let rankVals = vals.slice(1, 6);
        rankVals = rankVals.map(v => roundVal(v * multiplier));
        
        const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
        const formula = {
          base: allSame ? [rankVals[0]] : rankVals,
          type: 'status'
        };
        spellFormula[placeholder] = formula;
        continue;
      }

      // 3. Check mMaxAmmo & mAmmoRechargeTime in mSpell
      if (mSpell) {
        const isMaxAmmoKey = /^(maxammo|maximumcharges|maxpacks|maximumtraps|maximumammo|maxcharges|maxstacks)$/i.test(cleanName);
        const isRechargeKey = /^(ammorechargetime|ammorechargeratetooltip|chargecooldown|ammorecharge)$/i.test(cleanName);

        if (isMaxAmmoKey && mSpell.mMaxAmmo && Array.isArray(mSpell.mMaxAmmo)) {
          let rankVals = mSpell.mMaxAmmo.slice(0, 5).map(v => roundVal(v * multiplier));
          const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
          spellFormula[placeholder] = {
            base: allSame ? [rankVals[0]] : rankVals,
            type: 'status'
          };
          continue;
        }

        if (isRechargeKey && mSpell.mAmmoRechargeTime && Array.isArray(mSpell.mAmmoRechargeTime)) {
          let rankVals = mSpell.mAmmoRechargeTime.slice(0, 5).filter(v => v > 0).map(v => roundVal(v * multiplier));
          if (rankVals.length === 0) rankVals = mSpell.mAmmoRechargeTime.slice(1, 6).map(v => roundVal(v * multiplier));
          const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
          spellFormula[placeholder] = {
            base: allSame ? [rankVals[0]] : rankVals,
            type: 'status'
          };
          continue;
        }
      }

      // 3. Fallback: DDragon effect[N] vector (e.g. e1, e2, e3...)
      const eMatch = cleanName.match(/^e([0-9]+)$/i);
      if (eMatch) {
        const effIndex = parseInt(eMatch[1], 10);
        if (ddSpell.effect && ddSpell.effect[effIndex]) {
          const effArr = ddSpell.effect[effIndex];
          if (Array.isArray(effArr) && effArr.length > 0) {
            let rankVals = effArr.slice(0, 5).map(v => roundVal(v * multiplier));
            const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
            
            const scalings = [];
            if (ddSpell.vars) {
              ddSpell.vars.forEach(v => {
                let stat = 'totalAp';
                if (v.link === 'bonusattackdamage') stat = 'bonusAd';
                else if (v.link === 'attackdamage') stat = 'totalAd';
                else if (v.link === 'bonushealth') stat = 'bonusHp';
                else if (v.link === 'health') stat = 'totalHp';
                else if (v.link === 'spelldamage') stat = 'totalAp';
                
                const coeff = Array.isArray(v.coeff) ? v.coeff[0] : v.coeff;
                if (coeff) {
                  scalings.push({ ratio: roundVal(coeff * multiplier), stat });
                }
              });
            }

            const formula = {
              base: allSame ? [rankVals[0]] : rankVals,
              type: 'magic'
            };
            if (scalings.length > 0) formula.scalings = scalings;
            spellFormula[placeholder] = formula;
            continue;
          }
        }
      }

      // 4. Fallback: DDragon vars (e.g. {{ a1 }}, {{ f1 }})
      if (ddSpell.vars) {
        const varMatch = ddSpell.vars.find(v => v.key && v.key.toLowerCase() === cleanName.toLowerCase());
        if (varMatch) {
          let stat = 'totalAp';
          if (varMatch.link === 'bonusattackdamage') stat = 'bonusAd';
          else if (varMatch.link === 'attackdamage') stat = 'totalAd';
          else if (varMatch.link === 'bonushealth') stat = 'bonusHp';
          else if (varMatch.link === 'health') stat = 'totalHp';

          const coeff = Array.isArray(varMatch.coeff) ? varMatch.coeff[0] : varMatch.coeff;
          spellFormula[placeholder] = {
            base: [0],
            scalings: [{ ratio: roundVal((coeff || 0) * multiplier), stat }],
            type: 'magic'
          };
          continue;
        }
      }

      // 5. Fallback: f1, f2, f3 DataValues index fallback (e.g. f1 -> 1st DataValue, f2 -> 2nd DataValue)
      const fMatch = cleanName.match(/^f([0-9]+)$/i);
      if (fMatch && dataValues.length > 0) {
        const fIndex = parseInt(fMatch[1], 10) - 1;
        if (dataValues[fIndex] && dataValues[fIndex].values) {
          let rankVals = dataValues[fIndex].values.slice(1, 6).map(v => roundVal(v * multiplier));
          const allSame = rankVals.every(v => Math.abs(v - rankVals[0]) < 0.0001);
          spellFormula[placeholder] = {
            base: allSame ? [rankVals[0]] : rankVals,
            type: 'status'
          };
          continue;
        }
      }
    }
    
    if (Object.keys(spellFormula).length > 0) {
      champFormulas[spellId] = spellFormula;
    }
  }
  
  if (Object.keys(champFormulas).length > 0) {
    return champFormulas;
  }
  return null;
}

function main() {
  console.log('Generating spellFormulas.json for all champions (spells + passive)...\n');
  
  const champFiles = fs.readdirSync(DDRAGON_DIR).filter(f => f.endsWith('.json'));
  const allFormulas = {};
  let successCount = 0;
  let failCount = 0;
  let totalSpells = 0;
  let totalPassives = 0;
  
  for (const file of champFiles) {
    const champId = file.replace('.json', '');
    try {
      const formulas = processChampion(champId);
      if (formulas) {
        allFormulas[champId] = formulas;
        const spellCount = Object.keys(formulas).filter(k => k !== 'passive').length;
        totalSpells += spellCount;
        if (formulas['passive']) totalPassives++;
        successCount++;
      } else {
        failCount++;
      }
    } catch (e) {
      failCount++;
    }
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allFormulas, null, 2));
  console.log(`========================================`);
  console.log(`Champions mapped: ${successCount}`);
  console.log(`Total spells mapped: ${totalSpells}`);
  console.log(`Total passives mapped: ${totalPassives}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main();
