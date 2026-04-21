const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD SPACING BELOW SEARCH CARD ────────────────────────────────────────
const oldResults = `.results-section {
          width: 100%; max-width: 760px;
          margin: 48px auto 0; padding: 0 24px 80px;
        }`;
const newResults = `.results-section {
          width: 100%; max-width: 760px;
          margin: 32px auto 0; padding: 0 24px 80px;
        }`;

if (!code.includes(oldResults)) { console.error('ERROR: results-section not found'); process.exit(1); }
code = code.replace(oldResults, newResults);
console.log('✅ Search → results spacing fixed');

// ─── 2. FIX DROPDOWN MOBILE SHIFT (second open) ──────────────────────────────
const oldMobileDropdown = `.trades-dropdown { width: calc(100vw - 32px); right: -8px; }`;
const newMobileDropdown = `.trades-dropdown { width: calc(100vw - 32px); right: 0; left: auto; position: absolute; }`;

if (!code.includes(oldMobileDropdown)) { console.error('ERROR: mobile dropdown CSS not found'); process.exit(1); }
code = code.replace(oldMobileDropdown, newMobileDropdown);
console.log('✅ Dropdown mobile shift fixed');

// ─── WRITE ────────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: search spacing and mobile dropdown shift" && git push\n');
