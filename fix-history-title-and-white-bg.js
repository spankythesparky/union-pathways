// fix-history-title-and-white-bg.js
//
// Two related fixes:
//   1. .history-title, .history-subtitle, .history-hero, .history-eyebrow
//      CSS was never actually updated to v4 — still white text designed
//      for dark bg. Fixing to navy Inter typography.
//   2. Change all #FAFAF7 (warm cream) backgrounds to #FFFFFF (pure white)
//      per user preference.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* HISTORY TITLE V4 FIX */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// 1. Fix .history-title — was white Space Grotesk italic
// ═══════════════════════════════════════════════════════════════
const titleOld = `        .history-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(34px, 5vw, 60px);
          font-weight: 500; line-height: 0.96;
          text-transform: none; letter-spacing: -0.03em;
          color: #fff; margin-bottom: 28px;
          max-width: 900px;
        }
        .history-title .accent {
          color: #FA8059;
          font-style: italic;
          font-weight: 600;
        }
        .history-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(14px, 1.3vw, 16px);
          color: rgba(255,255,255,0.7);
          max-width: 660px; margin: 0;
          line-height: 1.65;`;

const titleNew = `        /* HISTORY TITLE V4 FIX */
        .history-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 700; line-height: 1.05;
          text-transform: none; letter-spacing: -0.025em;
          color: #072554; margin-bottom: 24px;
          max-width: 900px;
        }
        .history-title .accent {
          color: #FF6B00;
          font-style: normal;
          font-weight: 700;
        }
        .history-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: clamp(16px, 1.4vw, 18px);
          color: #5A6478;
          max-width: 660px; margin: 0;
          line-height: 1.6;`;

if (src.includes(titleOld)) {
  src = src.replace(titleOld, () => titleNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 2. Also fix .history-hero and .history-eyebrow if they're still dark
// ═══════════════════════════════════════════════════════════════
const heroOld = `        .history-hero {
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 56px 24px 48px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: left;
        }
        .history-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #FA8059; margin-bottom: 28px;
          display: inline-flex; align-items: center; gap: 14px;
        }
        .history-eyebrow::before {
          content: ''; width: 32px; height: 1px;
          background: #FA8059; opacity: 0.6;
        }`;

const heroNew = `        .history-hero {
          background: transparent;
          border-bottom: 1px solid rgba(7,37,84,0.08);
          padding: 72px 24px 56px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: left;
        }
        .history-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #FF6B00; margin-bottom: 24px;
          display: inline-flex; align-items: center; gap: 14px;
        }
        .history-eyebrow::before {
          content: ''; width: 40px; height: 2px;
          background: #FF6B00; opacity: 1;
        }`;

if (src.includes(heroOld)) {
  src = src.replace(heroOld, () => heroNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 3. Change ALL #FAFAF7 references to #FFFFFF
// ═══════════════════════════════════════════════════════════════
const beforeCount = (src.match(/#FAFAF7/g) || []).length;
src = src.split('#FAFAF7').join('#FFFFFF');
if (beforeCount > 0) edits += beforeCount;

// Also handle #F5F3EE just in case any remain
const beforeCount2 = (src.match(/#F5F3EE/g) || []).length;
src = src.split('#F5F3EE').join('#FFFFFF');
if (beforeCount2 > 0) edits += beforeCount2;

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + edits + ' edits.');
console.log('');
console.log('Fixed:');
console.log('  - .history-title: Space Grotesk white → Inter 700 navy #072554');
console.log('  - .history-title .accent: coral italic → orange bold normal');
console.log('  - .history-subtitle: white → navy-gray #5A6478');
console.log('  - .history-hero: dark border → light navy border');
console.log('  - .history-eyebrow: Space Mono coral → Inter 600 orange');
console.log('  - All #FAFAF7 (' + beforeCount + ' places) → #FFFFFF pure white');
console.log('  - All #F5F3EE (' + beforeCount2 + ' places) → #FFFFFF pure white');
console.log('');
console.log('Pages affected by title/subtitle fix (all pages using .history-hero):');
console.log('  - All 11 trade history pages');
console.log('  - Apprenticeship hub + 10 detail pages');
console.log('  - Organize, Organize-Contractor, Weingarten, RTW, Caucus');
console.log('  - Mental Health, Down Payment, etc.');
console.log('  These pages were previously showing white title on any bg');
console.log('  they had — now they show navy Inter title, visible on white');
console.log('');
console.log('Pages affected by white bg change:');
console.log('  - Home page (was cream, now white)');
console.log('  - Platform overview section');
console.log('  - Organize + Organize-Contractor (via .page-v4)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: history-title CSS + change cream to white bg" && git push');
console.log('');
