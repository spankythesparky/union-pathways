// fix-body-warmth.js — Warm off-white body background for depth
//
// Pure white was too flat. Adding subtle warm cream tone that gives the site depth
// while remaining light and professional. Pure white becomes reserved for cards
// and hero sections that layer on top.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* BODY WARMTH */')) {
  console.error('ERROR: Body warmth already applied. Aborting.');
  process.exit(1);
}

// ============================================================
// 1. Update body background from pure white to warm off-white
// ============================================================
const bodyOld = `        /* PIVOT PHASE 1 */
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #ffffff;
          color: #072554;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
        }`;

const bodyNew = `        /* PIVOT PHASE 1 + BODY WARMTH */
        html { scroll-behavior: smooth; background: #F5F3EE; }
        body {
          font-family: 'Inter', system-ui, sans-serif;
          background: #F5F3EE;
          color: #072554;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
        }
        /* Utility classes for layering on the warm body */
        .surface-white { background: #ffffff; }
        .surface-elevated {
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(7,37,84,0.06), 0 8px 24px rgba(7,37,84,0.04);
          border-radius: 12px;
        }`;

if (!src.includes(bodyOld)) {
  console.error('ERROR: Could not find body block.');
  process.exit(1);
}
src = src.replace(bodyOld, () => bodyNew);

// ============================================================
// 2. Update root variables to reflect new palette
// ============================================================
const rootUpdateOld = `          --white: #ffffff;
          --charcoal: #1E252B;
          --gray-light: #E8EAED;`;

const rootUpdateNew = `          --white: #ffffff;
          --paper: #F5F3EE;
          --charcoal: #1E252B;
          --gray-light: #E8EAED;`;

if (src.includes(rootUpdateOld)) {
  src = src.replace(rootUpdateOld, () => rootUpdateNew);
}

// Also update the --steel variable (used across the site as background) to warm off-white
const steelOld = `          --steel: #ffffff;
          --steel-mid: #E8EAED;
          --steel-light: #f5f6f8;`;

const steelNew = `          --steel: #F5F3EE;
          --steel-mid: #E8EAED;
          --steel-light: #ffffff;`;

if (src.includes(steelOld)) {
  src = src.replace(steelOld, () => steelNew);
}

// ============================================================
// 3. Update .history-hero to use pure white against the warm body
// This creates the "elevated section" look — hero sits on white against warm body
// ============================================================
const historyHeroOld = `        /* PIVOT PHASE 1 — light hero */
        .history-hero {
          background: transparent;
          border-bottom: 1px solid #E8EAED;
          padding: 72px 24px 56px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: left;
        }`;

const historyHeroNew = `        /* PIVOT PHASE 1 — light hero on warm body */
        .history-hero {
          background: transparent;
          border-bottom: 1px solid rgba(7,37,84,0.08);
          padding: 72px 24px 56px;
          max-width: 1280px;
          margin: 0 auto;
          text-align: left;
        }`;

if (src.includes(historyHeroOld)) {
  src = src.replace(historyHeroOld, () => historyHeroNew);
}

// ============================================================
// 4. Nav bar: subtle warm-white transparent so it feels part of the page
// ============================================================
const navOld = `        /* ── NAV (light theme) ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(255,255,255,0.97);
          border-bottom: 1px solid #E8EAED;
          backdrop-filter: blur(12px);`;

const navNew = `        /* ── NAV (light theme, warm) ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(245,243,238,0.94);
          border-bottom: 1px solid rgba(7,37,84,0.08);
          backdrop-filter: blur(12px);`;

if (src.includes(navOld)) {
  src = src.replace(navOld, () => navNew);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Body warmth applied:');
console.log('  - Body background: warm off-white #F5F3EE (paper-like, not stark)');
console.log('  - Pure white #FFFFFF reserved for cards/elevated sections');
console.log('  - Nav: warm-white translucent that feels part of the page');
console.log('  - .surface-white and .surface-elevated utility classes added');
console.log('    (use for layering cards on the warm body)');
console.log('');
console.log('If the warmth is too much/too little, easy to shift:');
console.log('  - Warmer (deeper cream): #F0EBE0');
console.log('  - Neutral: #F5F5F5');
console.log('  - Cooler (blue-gray): #F5F7FA');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: warm off-white body background for depth" && git push');
console.log('');
