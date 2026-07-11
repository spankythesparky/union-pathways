// fix115.js — Sweep & fix website/email field swaps
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

// Each fix swaps website ↔ email or moves a misplaced URL to website
// We use the full website+email portion of each block as the anchor — narrow but unique.

const fixes = [
  // --- BOTH SWAPPED (website=email, email=website) ---
  {
    label: 'UBC Local 2103 (Calgary)',
    find:  'website: "nrichter@ubcja.ca", email: "http://www.albertacarpenters.com"',
    replace: 'website: "http://www.albertacarpenters.com", email: "nrichter@ubcja.ca"',
  },
  {
    label: 'UBC Local 527 (Nanaimo)',
    find:  'website: "rsnyder@ubcja.ca", email: "http://www.bcrcc.ca"',
    replace: 'website: "http://www.bcrcc.ca", email: "rsnyder@ubcja.ca"',
  },
  {
    label: 'UBC Local 2404 (Delta, BC)',
    find:  'website: "piledrivers@ubcja.ca", email: "www.piledrivers2404.ca"',
    replace: 'website: "https://www.piledrivers2404.ca", email: "piledrivers@ubcja.ca"',
  },
  {
    label: 'UBC Local 594 (Stellarton, NS)',
    find:  'website: "shenley@acrc.ca", email: "www.acrc.ca"',
    replace: 'website: "https://www.acrc.ca", email: "shenley@acrc.ca"',
  },
  {
    label: 'UBC Local 83 (Lwr Sackville, NS)',
    find:  'website: "office@acrc.ca", email: "www.acrc.ca"',
    replace: 'website: "https://www.acrc.ca", email: "office@acrc.ca"',
  },
  {
    label: 'UBC Local 2004 (Lwr Sackville, NS)',
    find:  'website: "office@carpentersunion.ca", email: "http://www.carpentersunion.ca"',
    replace: 'website: "http://www.carpentersunion.ca", email: "office@carpentersunion.ca"',
  },

  // --- EMAIL FIELD HAS A URL (no website set) — move URL to website, clear email ---
  {
    label: 'UBC Local 276 (Cheektowaga, NY) — move URL to website',
    find:  ', email: "https://carpenterslocalunion276.com/"',
    replace: ', website: "https://carpenterslocalunion276.com/"',
  },
  {
    label: 'UBC Local 1121 (Boston, MA) — move URL to website',
    find:  ', email: "https://www.nasrcc.org/"',
    replace: ', website: "https://www.nasrcc.org/"',
  },
];

let applied = 0;
let failed = 0;

for (const fix of fixes) {
  if (!code.includes(fix.find)) {
    console.log('  ✗ NOT FOUND: ' + fix.label);
    failed++;
    continue;
  }
  if (code.split(fix.find).length > 2) {
    console.log('  ✗ MULTIPLE MATCHES (skipped): ' + fix.label);
    failed++;
    continue;
  }
  code = code.replace(fix.find, fix.replace);
  console.log('  ✓ ' + fix.label);
  applied++;
}

fs.writeFileSync(FILE, code);

console.log('\n' + applied + '/' + fixes.length + ' fixes applied');
if (failed > 0) console.error('⚠ ' + failed + ' fixes need manual review.');
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: correct website/email field swaps for ' + applied + ' locals" && git push\n');
