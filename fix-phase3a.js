// fix-phase3a.js — Apprenticeship hub page redesign (Phase 3a)
//
// Replaces the existing apprenticeship hub block with new design language:
//   - Space Grotesk hero with italic coral accent
//   - Gradient stat numbers
//   - Borderless trade cards with coral hover glow
//   - Numbered advice rows (01-06) with hairline dividers
//   - Coral pill CTA
//
// Detail pages (apprenticeship-ibew, etc.) are untouched in this phase.

const fs = require('fs');
const FILE = 'src/App.jsx';
const BLOCK = 'apprenticeship_hub_v2_block.txt';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}
if (!fs.existsSync(BLOCK)) {
  console.error('ERROR: ' + BLOCK + ' not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('// Things nobody tells you')) {
  console.error('ERROR: Phase 3a already applied. Aborting.');
  process.exit(1);
}

const blockText = fs.readFileSync(BLOCK, 'utf8');

// Find the apprenticeship hub block boundaries
const anchorStart = '        {page === "apprenticeship" && (() => {';
const anchorEnd = '        })()}';

const startIdx = src.indexOf(anchorStart);
if (startIdx === -1) {
  console.error('ERROR: Could not find hub start anchor.');
  process.exit(1);
}

// Find the closing of THIS specific IIFE (must come after start)
const endIdx = src.indexOf(anchorEnd + '\n', startIdx);
if (endIdx === -1) {
  console.error('ERROR: Could not find hub end anchor.');
  process.exit(1);
}

const removeLength = (endIdx + anchorEnd.length + 1) - startIdx;
// Sanity check: hub should be 4000-10000 chars
if (removeLength < 3000 || removeLength > 15000) {
  console.error('ERROR: Suspect hub block size (' + removeLength + ' chars). Aborting.');
  process.exit(1);
}

src = src.slice(0, startIdx) + blockText + src.slice(endIdx + anchorEnd.length + 1);

// Add responsive CSS for the stats and advice on mobile
const cssOld = `        @media (max-width: 720px) {
          .home-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
        }`;
const cssNew = `        @media (max-width: 720px) {
          .home-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
          .appr-hub-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .appr-advice-row { grid-template-columns: 1fr !important; gap: 4px !important; }
        }`;

if (src.includes(cssOld)) {
  src = src.replace(cssOld, () => cssNew);
} else {
  console.error('WARN: Could not add responsive CSS rules');
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Apprenticeship hub redesigned (Phase 3a):');
console.log('  - Space Grotesk hero with italic "aptitude test." accent');
console.log('  - Gradient stat numbers ($0, 4-5 yr, 10,000+, $50+/hr)');
console.log('  - Borderless trade cards with coral hover glow');
console.log('  - "Every trade tests differently." italic accent');
console.log('  - Numbered advice rows (01-06) flowing borderless');
console.log('  - Coral pill back button');
console.log('  - All 10 trade clicks still navigate to detail pages');
console.log('  - Detail pages themselves untouched (Phase 3b)');
console.log('');
console.log('Now run:');
console.log('  rm apprenticeship_hub_v2_block.txt && git add src/App.jsx && git commit -m "feat: phase 3a apprenticeship hub redesign" && git push');
console.log('');
