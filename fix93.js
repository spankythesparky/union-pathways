// fix93.js — Add National Pension (optional) line to Wages page
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

// 1. Add wageNationalPension state variable
code = replaceOnce(code,
  `  const [wageDefinedPension, setWageDefinedPension] = useState('');
  const [wageContribPension, setWageContribPension] = useState('');`,
  `  const [wageDefinedPension, setWageDefinedPension] = useState('');
  const [wageNationalPension, setWageNationalPension] = useState('');
  const [wageContribPension, setWageContribPension] = useState('');`,
  '1: state var');
console.log('1/9 ✓ Added wageNationalPension state');

// 2. Include in total package calculation
code = replaceOnce(code,
  `const totalPackage = num(wageHourly) + num(wageHW) + num(wageDefinedPension) + num(wageContribPension) + num(wage401k) + (isIBEW ? num(wageNEBF) : 0) + (isIUOE ? num(wageCIPF) + num(wageIUOETraining) : 0);`,
  `const totalPackage = num(wageHourly) + num(wageHW) + num(wageDefinedPension) + num(wageNationalPension) + num(wageContribPension) + num(wage401k) + (isIBEW ? num(wageNEBF) : 0) + (isIUOE ? num(wageCIPF) + num(wageIUOETraining) : 0);`,
  '2: total package calc');
console.log('2/9 ✓ Added to total package calc');

// 3. DB insert
code = replaceOnce(code,
  `defined_pension: wageMethod === 'manual' ? num(wageDefinedPension) || null : null,
                contribution_pension: wageMethod === 'manual' ? num(wageContribPension) || null : null,`,
  `defined_pension: wageMethod === 'manual' ? num(wageDefinedPension) || null : null,
                national_pension: wageMethod === 'manual' ? num(wageNationalPension) || null : null,
                contribution_pension: wageMethod === 'manual' ? num(wageContribPension) || null : null,`,
  '3: DB insert');
console.log('3/9 ✓ Added to DB insert');

// 4. Manual form moneyField (after Defined Pension)
code = replaceOnce(code,
  `{moneyField(lang==="es" ? "Pension Definida" : lang==="pl" ? "Emerytura Definiowana" : "Defined Pension", wageDefinedPension, setWageDefinedPension, true)}
                          {moneyField(lang==="es" ? "Pension de Contribucion / Anualidad" : lang==="pl" ? "Emerytura Skladkowa / Renta" : "Contribution Pension / Annuity", wageContribPension, setWageContribPension, true)}`,
  `{moneyField(lang==="es" ? "Pension Definida" : lang==="pl" ? "Emerytura Definiowana" : "Defined Pension", wageDefinedPension, setWageDefinedPension, true)}
                          {moneyField(lang==="es" ? "Pension Nacional" : lang==="pl" ? "Emerytura Krajowa" : "National Pension", wageNationalPension, setWageNationalPension, true)}
                          {moneyField(lang==="es" ? "Pension de Contribucion / Anualidad" : lang==="pl" ? "Emerytura Skladkowa / Renta" : "Contribution Pension / Annuity", wageContribPension, setWageContribPension, true)}`,
  '4: manual form field');
console.log('4/9 ✓ Added input field to manual form');

// 5. resetWageForm
code = replaceOnce(code,
  `setWageImageFile(null); setWageHourly(''); setWageHW(''); setWageDefinedPension('');
            setWageContribPension(''); setWage401k(''); setWageNEBF(''); setWageCIPF('');`,
  `setWageImageFile(null); setWageHourly(''); setWageHW(''); setWageDefinedPension('');
            setWageNationalPension(''); setWageContribPension(''); setWage401k(''); setWageNEBF(''); setWageCIPF('');`,
  '5: resetWageForm');
console.log('5/9 ✓ Added to reset function');

// 6. ApprovedWageCard labels — add npension key in all 3 languages
code = replaceOnce(code,
  `en: { hourly:'Hourly', hw:'Health & Welfare', dpension:'Defined Pension', cpension:'Contribution Pension/Annuity', k401:'401(k)',`,
  `en: { hourly:'Hourly', hw:'Health & Welfare', dpension:'Defined Pension', npension:'National Pension', cpension:'Contribution Pension/Annuity', k401:'401(k)',`,
  '6a: en label');

code = replaceOnce(code,
  `es: { hourly:'Por Hora', hw:'Salud y Bienestar', dpension:'Pension Definida', cpension:'Pension de Contribucion/Anualidad', k401:'401(k)',`,
  `es: { hourly:'Por Hora', hw:'Salud y Bienestar', dpension:'Pension Definida', npension:'Pension Nacional', cpension:'Pension de Contribucion/Anualidad', k401:'401(k)',`,
  '6b: es label');

code = replaceOnce(code,
  `pl: { hourly:'Godzinowo', hw:'Zdrowie i Opieka', dpension:'Emerytura', cpension:'Emerytura Skladkowa', k401:'401(k)',`,
  `pl: { hourly:'Godzinowo', hw:'Zdrowie i Opieka', dpension:'Emerytura', npension:'Emerytura Krajowa', cpension:'Emerytura Skladkowa', k401:'401(k)',`,
  '6c: pl label');
console.log('6/9 ✓ Added labels in en/es/pl');

// 7. ApprovedWageCard breakdown array — insert npension after dpension
code = replaceOnce(code,
  `    { key:'dpension', val:r.defined_pension },
    { key:'cpension', val:r.contribution_pension },`,
  `    { key:'dpension', val:r.defined_pension },
    { key:'npension', val:r.national_pension },
    { key:'cpension', val:r.contribution_pension },`,
  '7: breakdown array');
console.log('7/9 ✓ Added to approved card breakdown');

// 8. Admin loadRows: include national_pension in editData defaults
code = replaceOnce(code,
  `hourly: r.hourly || '', health_welfare: r.health_welfare || '', defined_pension: r.defined_pension || '',
        contribution_pension: r.contribution_pension || '', k401: r.k401 || '', nebf: r.nebf || '',`,
  `hourly: r.hourly || '', health_welfare: r.health_welfare || '', defined_pension: r.defined_pension || '',
        national_pension: r.national_pension || '', contribution_pension: r.contribution_pension || '', k401: r.k401 || '', nebf: r.nebf || '',`,
  '8: admin loadRows defaults');
console.log('8/9 ✓ Added to admin edit defaults');

// 9. Admin wageFields — add national_pension entry
code = replaceOnce(code,
  `['defined_pension','Defined Pension'],['contribution_pension','Contribution Pension/Annuity']`,
  `['defined_pension','Defined Pension'],['national_pension','National Pension'],['contribution_pension','Contribution Pension/Annuity']`,
  '9: admin wageFields');
console.log('9/9 ✓ Added to admin edit form fields');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add National Pension optional field" && git push\n');
