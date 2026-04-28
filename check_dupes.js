const xlsx = require('xlsx');
const wb = xlsx.readFile(process.env.HOME + '/Downloads/All_ Operators Union Locals.xlsx');
const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
const seen = {};
rows.forEach(r => {
  const num = Math.floor(parseFloat(String(r['Local']||0)));
  if (!seen[num]) seen[num] = [];
  seen[num].push(r['City / State']);
});
const dupes = Object.entries(seen).filter(([k,v]) => v.length > 1);
console.log('Duplicate local numbers:', dupes.length);
dupes.forEach(([k,v]) => console.log('  Local', k, '-', v.join(' | ')));
console.log('Total rows:', rows.length);
