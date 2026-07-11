// fix-orange-sweep.js — Union Pathways Phase A
//
// Brings the whole site onto the home page's white / navy / orange palette
// and ships the new share card + favicon.
//
// Touches 4 files:
//   src/App.jsx                   — tokens, forms, dropdown, ~517 coral refs
//   index.html                    — og:image, favicons, Instagram banner
//   middleware.js                 — DEFAULT_IMAGE
//   scripts/generate-og-pages.mjs — publisher logo + Article JSON-LD image
//
// PALETTE
//   navy    #072554     orange      #FF6B00    hover orange #FF7E1F
//   white   #FFFFFF     off-white   #F8FAFC    borders      #E5E7EB
//   slate   #64748B
//
// Safe to re-run: aborts if already applied.

const fs = require('fs');

const APP = 'src/App.jsx';
const HTML = 'index.html';
const MW = 'middleware.js';
const OG = 'scripts/generate-og-pages.mjs';

if (!fs.existsSync(APP)) {
  console.error('ERROR: src/App.jsx not found. Run this from the project root.');
  process.exit(1);
}

let app = fs.readFileSync(APP, 'utf8');

if (app.includes('/* ORANGE SWEEP */')) {
  console.error('ERROR: orange sweep already applied. Aborting.');
  process.exit(1);
}

let structural = 0;
function swap(label, from, to) {
  if (!app.includes(from)) {
    console.log('  ! MISS  — ' + label);
    return;
  }
  app = app.replace(from, to);
  structural++;
  console.log('  ok      — ' + label);
}

console.log('\nStructural fixes (src/App.jsx)');
console.log('------------------------------');

// ── 1. Design tokens: dark-theme values → light ──────────────────────────
swap('design tokens → light palette',
`        :root {
          --yellow: #FA8059;
          --yellow-dim: #d4634a;
          --steel: #000000;
          --steel-mid: #22303D;
          --steel-light: #2d3f4e;
          --plate: #1a2c3a;
          --wire: #3a5068;
          --text: #ffffff;
          --muted: #a0b4c4;
          --card-bg: #111111;`,
`        /* ORANGE SWEEP */
        :root {
          --yellow: #FF6B00;
          --yellow-dim: #FF7E1F;
          --steel: #FFFFFF;
          --steel-mid: #FFFFFF;
          --steel-light: #F8FAFC;
          --plate: #F8FAFC;
          --wire: #E5E7EB;
          --text: #072554;
          --muted: #64748B;
          --card-bg: #FFFFFF;`);

// ── 2. Native form controls: dark scheme → light ─────────────────────────
swap('native <select> color-scheme → light',
`        /* fix192 — dark color scheme for native form controls (fixes white-out <select> dropdowns) */
        html, body { color-scheme: dark; }
        select, option, optgroup {
          background-color: #1a1a1a;
          color: #072554;
        }
        select option:hover,
        select option:checked,
        select option:focus {
          background-color: #FF6B00;
          color: #0F1620;
        }`,
`        /* ORANGE SWEEP — light color scheme for native form controls */
        html, body { color-scheme: light; }
        select, option, optgroup {
          background-color: #FFFFFF;
          color: #072554;
        }
        select option:hover,
        select option:checked,
        select option:focus {
          background-color: #FF6B00;
          color: #FFFFFF;
        }`);

// ── 3. Nav dropdown: dark panel + navy text → readable light panel ───────
swap('nav dropdown panel → light surface',
`        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--steel-mid);
          border: 1px solid rgba(7,37,84,0.08);
          border-radius: 10px; overflow: hidden;
          min-width: 180px; z-index: 200;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: fadeIn 0.15s ease;
        }`,
`        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 10px; overflow: hidden;
          min-width: 220px; z-index: 200;
          box-shadow: 0 12px 32px rgba(7,37,84,0.14);
          animation: fadeIn 0.15s ease;
        }`);

swap('nav dropdown items → visible divider + hover',
`        .nav-dropdown-item {
          display: flex; flex-direction: column;
          padding: 12px 16px; cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          text-align: left;
        }
        .nav-dropdown-item:last-child { border-bottom: none; }
        .nav-dropdown-item:hover { background: #ffffff; }`,
`        .nav-dropdown-item {
          display: flex; flex-direction: column;
          padding: 12px 16px; cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #F1F5F9;
          text-align: left;
          border-left: 3px solid transparent;
        }
        .nav-dropdown-item:last-child { border-bottom: none; }
        .nav-dropdown-item:hover { background: #F8FAFC; border-left-color: #FF6B00; }`);

swap('nav dropdown sub-label → slate',
`        .nav-dropdown-sub {
          font-size: 11px; color: #5A6478; margin-top: 2px;
        }`,
`        .nav-dropdown-sub {
          font-size: 11px; color: #64748B; margin-top: 2px;
        }`);

// ── 4. Ember glows: coral haze → soft orange + navy depth ────────────────
swap('ember glow 1 → soft orange',
`          background: radial-gradient(circle, rgba(250,128,89,0.16), rgba(250,128,89,0.05) 35%, transparent 65%);`,
`          background: radial-gradient(circle, rgba(255,107,0,0.07), rgba(255,107,0,0.02) 35%, transparent 65%);`);

const glow2 = app.match(/background: radial-gradient\(circle, rgba\(250,128,89,0\.09\)[^;]*;/);
if (glow2) {
  swap('ember glow 2 → soft navy',
    glow2[0],
    `background: radial-gradient(circle, rgba(7,37,84,0.05), rgba(7,37,84,0.02) 40%, transparent 65%);`);
}

// ── 5. Global color replacement ──────────────────────────────────────────
console.log('\nGlobal color replacement');
console.log('------------------------');

const COLORS = [
  ['#FA8059',            '#FF6B00', 'coral → safety orange'],
  ['#fa8059',            '#FF6B00', 'coral (lowercase)'],
  ['#F4A276',            '#FF8A33', 'peach → light orange'],
  ['#f4a276',            '#FF8A33', 'peach (lowercase)'],
  ['#d4634a',            '#E55F00', 'coral-deep → deep orange'],
  ['#a0b4c4',            '#64748B', 'steel-blue text → slate'],
  ['rgba(250,128,89,',   'rgba(255,107,0,', 'coral rgba → orange rgba'],
  ['rgba(245,197,24,',   'rgba(255,107,0,', 'legacy yellow rgba → orange rgba'],
];

let colorCount = 0;
for (const [from, to, label] of COLORS) {
  const n = app.split(from).length - 1;
  if (n === 0) continue;
  app = app.split(from).join(to);
  colorCount += n;
  console.log(`  ${String(n).padStart(4)}  ${label}`);
}
console.log(`  ----`);
console.log(`  ${String(colorCount).padStart(4)}  total`);

fs.writeFileSync(APP, app);

// ── 6. index.html ────────────────────────────────────────────────────────
console.log('\nAsset + meta fixes');
console.log('------------------');

if (fs.existsSync(HTML)) {
  let html = fs.readFileSync(HTML, 'utf8');

  html = html.split('/social-preview.png').join('/social-preview-v2.png');

  html = html.replace(
    `    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`,
    `    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
    <link rel="shortcut icon" href="/favicon.ico?v=2" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />`);

  // Instagram in-app-browser banner → new palette
  html = html.replace(
    `        background: linear-gradient(90deg, #FA8059 0%, #F5A878 100%);
        color: #000;`,
    `        background: linear-gradient(90deg, #FF6B00 0%, #FF8A33 100%);
        color: #FFFFFF;`);
  html = html.replace(
    `        background: #000;
        color: #FA8059;`,
    `        background: #072554;
        color: #FFFFFF;`);
  html = html.replace(
    `        border: 1px solid rgba(0,0,0,0.4);
        color: #000;`,
    `        border: 1px solid rgba(255,255,255,0.6);
        color: #FFFFFF;`);

  fs.writeFileSync(HTML, html);
  console.log('  ok      — index.html: og:image, favicons, IG banner');
} else {
  console.log('  ! MISS  — index.html not found');
}

// ── 7. middleware.js ─────────────────────────────────────────────────────
if (fs.existsSync(MW)) {
  let mw = fs.readFileSync(MW, 'utf8');
  mw = mw.split('/social-preview.png').join('/social-preview-v2.png');
  fs.writeFileSync(MW, mw);
  console.log('  ok      — middleware.js: DEFAULT_IMAGE');
} else {
  console.log('  ! MISS  — middleware.js not found');
}

// ── 8. scripts/generate-og-pages.mjs ─────────────────────────────────────
if (fs.existsSync(OG)) {
  let og = fs.readFileSync(OG, 'utf8');
  og = og.split("/social-preview.png").join("/social-preview-v2.png");
  fs.writeFileSync(OG, og);
  console.log('  ok      — generate-og-pages.mjs: publisher + article image');
} else {
  console.log('  ! MISS  — scripts/generate-og-pages.mjs not found');
}

console.log('\n================================');
console.log(`Done. ${structural} structural fixes, ${colorCount} color replacements.`);
console.log('================================\n');
console.log('Fixed:');
console.log('  - Every button/accent: coral -> safety orange');
console.log('  - Nav dropdown: readable light panel (was navy-on-charcoal)');
console.log('  - Every form input + native <select>: white, not dark');
console.log('  - Share card: new white/navy/orange, cache-busting filename');
console.log('  - Favicon: added .ico + cache-bust');
console.log('  - Instagram banner: new palette\n');
