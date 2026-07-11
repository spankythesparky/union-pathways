// fix-pivot-phase1.js — Foundation pivot to white/navy/orange corporate-professional theme
//
// This flips the whole site from dark (black + coral) to light (white + navy + orange).
// It's the biggest single visual change we've made. Everything else in the site will
// look "transitional" until we get to their specific phases.
//
// Changes:
//   1. Font stack: Inter for everything, drop Space Grotesk / Space Mono / Barlow
//   2. Body: black → white background, white → navy text
//   3. Remove ember-glow effects (dark-theme only)
//   4. Update :root CSS variables to new palette
//   5. Update .history-hero global class (12 pages) to light aesthetic
//   6. Update .history-eyebrow and .history-title styling for navy/orange
//   7. Nav underlying styles for the new light theme

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('/* PIVOT PHASE 1 */')) {
  console.error('ERROR: Pivot Phase 1 already applied. Aborting.');
  process.exit(1);
}

// ============================================================
// 1. Font @import — simplify to Inter only (keep others just in case any inline styles reference them)
// ============================================================
const fontOld = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');`;

const fontNew = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');`;

if (!src.includes(fontOld)) {
  console.error('ERROR: Could not find font import.');
  process.exit(1);
}
src = src.replace(fontOld, () => fontNew);

// ============================================================
// 2. :root variables — new palette
// ============================================================
const rootOld = `        :root {
          --yellow: #FA8059;
          --yellow-dim: #d4634a;
          --steel: #000000;
          --steel-mid: #22303D;
          --steel-light: #2d3f4e;
          --plate: #1a2c3a;
          --wire: #3a5068;
          --text: #ffffff;
          --muted: #a0b4c4;
          --card-bg: #111111;
          /* PHASE 1 — new design system tokens */
          --coral: #FA8059;
          --coral-warm: #F4A276;
          --coral-deep: #d4634a;
          --whisper: rgba(255,255,255,0.4);
          --hairline: rgba(255,255,255,0.08);
          --display-font: 'Space Grotesk', 'Barlow Condensed', sans-serif;
          --body-font: 'Inter', 'Barlow', sans-serif;
          --mono-font: 'Space Mono', monospace;
        }`;

const rootNew = `        :root {
          /* PIVOT PHASE 1 — new light theme palette */
          --navy: #072554;
          --navy-deep: #051a3d;
          --navy-soft: #1a3568;
          --orange: #FF6B00;
          --orange-deep: #d95a00;
          --white: #ffffff;
          --charcoal: #1E252B;
          --gray-light: #E8EAED;
          --gray-med: #C4C9D0;
          --gray-text: #5A6478;
          /* Legacy vars — kept during transition so existing pages don't crash */
          --yellow: #FF6B00;
          --yellow-dim: #d95a00;
          --steel: #ffffff;
          --steel-mid: #E8EAED;
          --steel-light: #f5f6f8;
          --plate: #1a2c3a;
          --wire: #C4C9D0;
          --text: #072554;
          --muted: #5A6478;
          --card-bg: #ffffff;
          --coral: #FF6B00;
          --coral-warm: #FF8B33;
          --coral-deep: #d95a00;
          --whisper: rgba(7,37,84,0.4);
          --hairline: rgba(7,37,84,0.10);
          --display-font: 'Inter', system-ui, sans-serif;
          --body-font: 'Inter', system-ui, sans-serif;
          --mono-font: 'Inter', system-ui, sans-serif;
        }`;

if (!src.includes(rootOld)) {
  console.error('ERROR: Could not find :root block.');
  process.exit(1);
}
src = src.replace(rootOld, () => rootNew);

// ============================================================
// 3. Body + ember glow removal
// ============================================================
const bodyOld = `        /* PHASE 1 FOUNDATION */
        /* PHASE 6 GLOBAL */
        /* PHASE 5 HISTORY BODY */
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Inter', 'Barlow', system-ui, sans-serif;
          background: var(--steel);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
        }
        /* Drifting ember glows — atmospheric, fixed in viewport */
        body::before {
          content: '';
          position: fixed;
          top: -200px; left: -200px;
          width: 900px; height: 900px;
          background: radial-gradient(circle, rgba(250,128,89,0.16), rgba(250,128,89,0.05) 35%, transparent 65%);
          filter: blur(40px);
          pointer-events: none;
          z-index: 0;
          animation: ember-drift-1 22s ease-in-out infinite;
        }
        body::after {
          content: '';
          position: fixed;
          bottom: -300px; right: -300px;
          width: 1200px; height: 1200px;
          background: radial-gradient(circle, rgba(250,128,89,0.09), rgba(250,128,89,0.03) 40%, transparent 70%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
          animation: ember-drift-2 28s ease-in-out infinite;
        }
        @keyframes ember-drift-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(80px, 120px); }
        }
        @keyframes ember-drift-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-100px, -80px); }
        }`;

const bodyNew = `        /* PIVOT PHASE 1 */
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
        }
        /* Removed ember glow effects — dark-theme only */
        body::before { display: none !important; }
        body::after { display: none !important; }
        /* Selection styling for the new palette */
        ::selection { background: #FF6B00; color: #ffffff; }`;

if (!src.includes(bodyOld)) {
  console.error('ERROR: Could not find body block.');
  process.exit(1);
}
src = src.replace(bodyOld, () => bodyNew);

// ============================================================
// 4. .history-hero global class — new light aesthetic
// ============================================================
const heroClassesOld = `        /* PHASE 4 HERO REDESIGN */
        .history-hero {
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
        }
        .history-title {
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
          line-height: 1.65;
        }`;

const heroClassesNew = `        /* PIVOT PHASE 1 — light hero */
        .history-hero {
          background: transparent;
          border-bottom: 1px solid #E8EAED;
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
          display: inline-block;
        }
        .history-eyebrow::before { display: none; }
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
          line-height: 1.6;
          font-weight: 400;
        }`;

if (!src.includes(heroClassesOld)) {
  console.error('ERROR: Could not find .history-hero classes.');
  process.exit(1);
}
src = src.replace(heroClassesOld, () => heroClassesNew);

// ============================================================
// 5. Nav CSS updates — light theme
// ============================================================
// Find current nav bar rules and update background/border/text colors
const navRulesOld = `        /* ── NAV ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(0,0,0,0.97);
          border-bottom: 1px solid rgba(245,197,24,0.15);
          backdrop-filter: blur(12px);`;

const navRulesNew = `        /* ── NAV (light theme) ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(255,255,255,0.97);
          border-bottom: 1px solid #E8EAED;
          backdrop-filter: blur(12px);`;

if (src.includes(navRulesOld)) {
  src = src.replace(navRulesOld, () => navRulesNew);
}

// Update nav-link color from muted white → navy
const navLinkOld = `        .nav-link {
          background: transparent;
          border: none;
          padding: 6px 10px;
          color: rgba(255,255,255,0.6);
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.01em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }`;

const navLinkNew = `        .nav-link {
          background: transparent;
          border: none;
          padding: 8px 14px;
          color: #072554;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          letter-spacing: -0.005em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #FF6B00; background: rgba(255,107,0,0.05); }`;

if (src.includes(navLinkOld)) {
  src = src.replace(navLinkOld, () => navLinkNew);
}

// Update lang-btn styling for light theme
const langBtnOld = `        /* HEADER CLEANUP */
        .lang-btn {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 4px 6px;
          color: rgba(255,255,255,0.4);
          font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 400;
          letter-spacing: 0.15em; cursor: pointer;
          transition: color 0.18s;
          min-width: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover { color: rgba(255,255,255,0.8); }
        .lang-btn.active { background: transparent; color: #FA8059; border: none; }
        .lang-divider {
          color: rgba(255,255,255,0.2);
          font-size: 11px;
          font-family: 'Space Mono', monospace;
          user-select: none;
          pointer-events: none;
        }`;

const langBtnNew = `        /* HEADER CLEANUP (light theme) */
        .lang-btn {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 4px 6px;
          color: #5A6478;
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.05em; cursor: pointer;
          transition: color 0.18s;
          min-width: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover { color: #072554; }
        .lang-btn.active { background: transparent; color: #FF6B00; border: none; font-weight: 700; }
        .lang-divider {
          color: #C4C9D0;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          user-select: none;
          pointer-events: none;
        }`;

if (src.includes(langBtnOld)) {
  src = src.replace(langBtnOld, () => langBtnNew);
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Pivot Phase 1 applied:');
console.log('  - Body: white background, navy #072554 text');
console.log('  - Ember glows removed (dark-theme only)');
console.log('  - Fonts: Inter for everything');
console.log('  - CSS variables: legacy names redirected to new palette');
console.log('    (so pages using --yellow, --steel, etc. now use orange/white/navy)');
console.log('  - .history-hero and related classes redesigned for light theme');
console.log('  - Nav bar: white background, navy links, orange hover');
console.log('  - Lang switcher: navy text on light theme');
console.log('');
console.log('Expected outcome: whole site atmosphere flips to light corporate-professional.');
console.log('Many individual pages will look "in transition" until we redesign each.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: pivot phase 1 — white/navy/orange foundation" && git push');
console.log('');
