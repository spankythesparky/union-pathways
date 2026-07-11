// fix94.js — Add Other Funds (misc_funds) optional field + update disclaimer
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// 1. Add wageMiscFunds state var
code = replaceOnce(code,
  `  const [wageIUOETraining, setWageIUOETraining] = useState('');
  const [wageWorkingDues, setWageWorkingDues] = useState('');`,
  `  const [wageIUOETraining, setWageIUOETraining] = useState('');
  const [wageMiscFunds, setWageMiscFunds] = useState('');
  const [wageWorkingDues, setWageWorkingDues] = useState('');`,
  '1: state var');
console.log('1/10 ✓ Added wageMiscFunds state');

// 2. Total package calc — add num(wageMiscFunds)
code = replaceOnce(code,
  `const totalPackage = num(wageHourly) + num(wageHW) + num(wageDefinedPension) + num(wageNationalPension) + num(wageContribPension) + num(wage401k) + (isIBEW ? num(wageNEBF) : 0) + (isIUOE ? num(wageCIPF) + num(wageIUOETraining) : 0);`,
  `const totalPackage = num(wageHourly) + num(wageHW) + num(wageDefinedPension) + num(wageNationalPension) + num(wageContribPension) + num(wage401k) + num(wageMiscFunds) + (isIBEW ? num(wageNEBF) : 0) + (isIUOE ? num(wageCIPF) + num(wageIUOETraining) : 0);`,
  '2: total package calc');
console.log('2/10 ✓ Added to total package calc');

// 3. DB insert
code = replaceOnce(code,
  `iuoe_training: wageMethod === 'manual' && isIUOE ? num(wageIUOETraining) || null : null,`,
  `iuoe_training: wageMethod === 'manual' && isIUOE ? num(wageIUOETraining) || null : null,
                misc_funds: wageMethod === 'manual' ? num(wageMiscFunds) || null : null,`,
  '3: DB insert');
console.log('3/10 ✓ Added to DB insert');

// 4. Manual form moneyField (after IUOE Training)
code = replaceOnce(code,
  `{isIUOE && moneyField(lang==="es" ? "Entrenamiento IUOE" : lang==="pl" ? "Szkolenie IUOE" : "IUOE National Training Fund", wageIUOETraining, setWageIUOETraining, true)}`,
  `{isIUOE && moneyField(lang==="es" ? "Entrenamiento IUOE" : lang==="pl" ? "Szkolenie IUOE" : "IUOE National Training Fund", wageIUOETraining, setWageIUOETraining, true)}
                          {moneyField(lang==="es" ? "Otros Fondos" : lang==="pl" ? "Inne Fundusze" : "Other Funds", wageMiscFunds, setWageMiscFunds, true)}`,
  '4: manual form field');
console.log('4/10 ✓ Added input field to manual form');

// 5. resetWageForm
code = replaceOnce(code,
  `setWageIUOETraining(''); setWageWorkingDues(''); setWageEffectiveDate('');`,
  `setWageIUOETraining(''); setWageMiscFunds(''); setWageWorkingDues(''); setWageEffectiveDate('');`,
  '5: resetWageForm');
console.log('5/10 ✓ Added to reset function');

// 6. ApprovedWageCard labels — add 'misc' key in all 3 languages
code = replaceOnce(code,
  `iuoe:'IUOE Training', dues:'Working Dues',`,
  `iuoe:'IUOE Training', misc:'Other Funds', dues:'Working Dues',`,
  '6a: en label');

code = replaceOnce(code,
  `iuoe:'Entrenamiento IUOE', dues:'Cuotas de Trabajo',`,
  `iuoe:'Entrenamiento IUOE', misc:'Otros Fondos', dues:'Cuotas de Trabajo',`,
  '6b: es label');

code = replaceOnce(code,
  `iuoe:'Szkolenie IUOE', dues:'Skladki',`,
  `iuoe:'Szkolenie IUOE', misc:'Inne Fundusze', dues:'Skladki',`,
  '6c: pl label');
console.log('6/10 ✓ Added labels in en/es/pl');

// 7. ApprovedWageCard breakdown — insert misc after iuoe
code = replaceOnce(code,
  `    { key:'iuoe', val:r.iuoe_training },
    { key:'dues', val:r.working_dues, pct:true },`,
  `    { key:'iuoe', val:r.iuoe_training },
    { key:'misc', val:r.misc_funds },
    { key:'dues', val:r.working_dues, pct:true },`,
  '7: breakdown array');
console.log('7/10 ✓ Added to approved card breakdown');

// 8. Admin loadRows: include misc_funds in editData defaults
code = replaceOnce(code,
  `cipf: r.cipf || '', iuoe_training: r.iuoe_training || '', working_dues: r.working_dues || '',`,
  `cipf: r.cipf || '', iuoe_training: r.iuoe_training || '', misc_funds: r.misc_funds || '', working_dues: r.working_dues || '',`,
  '8: admin loadRows defaults');
console.log('8/10 ✓ Added to admin edit defaults');

// 9. Admin wageFields — add misc_funds entry
code = replaceOnce(code,
  `['iuoe_training','IUOE Training (IUOE only)'],['working_dues','Working Dues']`,
  `['iuoe_training','IUOE Training (IUOE only)'],['misc_funds','Other Funds'],['working_dues','Working Dues']`,
  '9: admin wageFields');
console.log('9/10 ✓ Added to admin edit form fields');

// 10. Update honor system NOTE
code = replaceOnce(code,
  `{lang==="es" ? "Los envios cubren los rubros principales: hora, salud y bienestar, pension, anualidad, NEBF/CIPF y cuotas. Las contribuciones pequenas (JATC, fondos suplementarios, etc.) varian mucho de local a local y no se rastrean aqui." : lang==="pl" ? "Zgloszenia obejmuja glowne pozycje: godzinowo, swiadczenia zdrowotne, emerytura, renta, NEBF/CIPF i skladki. Mniejsze skladki (JATC, fundusze dodatkowe itp.) bardzo sie roznia miedzy lokalami i nie sa tu wymienione." : "Submissions cover the major line items: hourly, health & welfare, pension, annuity, NEBF/CIPF, and dues. Smaller contributions like JATC and other supplemental funds vary so much from one local to the next that they aren't tracked here."}`,
  `{lang==="es" ? "Los envios cubren los rubros principales: hora, salud y bienestar, pensiones, anualidad, NEBF/CIPF y cuotas. Las contribuciones pequenas que varian de local a local (JATC, fondos suplementarios, etc.) se pueden agrupar en el campo Otros Fondos." : lang==="pl" ? "Zgloszenia obejmuja glowne pozycje: godzinowo, swiadczenia zdrowotne, emerytury, renta, NEBF/CIPF i skladki. Mniejsze skladki ktore roznia sie miedzy lokalami (JATC, fundusze dodatkowe itp.) mozna zlaczyc w polu Inne Fundusze." : "Submissions cover the major line items: hourly, health & welfare, pensions, annuity, NEBF/CIPF, and dues. Smaller contributions that vary local to local (JATC, supplemental funds, etc.) can be rolled into the Other Funds field."}`,
  '10: disclaimer text');
console.log('10/10 ✓ Updated disclaimer to mention Other Funds');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Other Funds optional field" && git push\n');
