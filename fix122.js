// fix122.js — Replace emoji tags on /benefits sections with Roman numerals; restyle badge to match history pages
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

// 1. Restyle Section badge — emoji-sized 28px → Barlow Condensed 18px 900-weight (matches history pages)
code = replaceOnce(code,
  `<div style={{width:56, height:56, borderRadius:14, background:\`\${color}22\`, border:\`2px solid \${color}\`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28}}>{tag}</div>`,
  `<div style={{width:48, height:48, borderRadius:12, background:\`\${color}22\`, border:\`2px solid \${color}\`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color}}>{tag}</div>`,
  '1: Section badge styling');
console.log('1/7 ✓ Restyled Section badge');

// 2-7. Replace emoji tags with Roman numerals
const tagSwaps = [
  ['🏛️', 'I',   'Pension'],
  ['📊', 'II',  'Annuity'],
  ['🏥', 'III', 'Health Insurance'],
  ['🎓', 'IV',  'Apprenticeship'],
  ['🛡️', 'V',   'Beyond the Pension'],
  ['🎖️', 'VI',  'Veterans'],
];

let n = 1;
for (const [emoji, numeral, name] of tagSwaps) {
  n++;
  code = replaceOnce(code, `tag="${emoji}"`, `tag="${numeral}"`, `${n}: ${name} (${emoji} → ${numeral})`);
  console.log(`${n}/7 ✓ ${name}: ${emoji} → ${numeral}`);
}

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: replace emoji section tags with Roman numerals on /benefits" && git push\n');
