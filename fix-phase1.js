// fix-phase1.js — Foundation theme upgrade
//
// Atmospheric shift across the entire site. No page layouts touched.
// Anything explicitly using Barlow Condensed stays as-is.
// Body text defaults to Inter. Ember glows fixed in background.
//
// Changes:
//   1. Add Space Grotesk, Inter, Space Mono fonts (alongside existing Barlow)
//   2. Switch body font default from Barlow to Inter (Barlow Condensed everywhere it's explicit stays)
//   3. Add drifting ember glow background fixed across all pages
//   4. Add new CSS variables for the new design system
//   5. Smooth scroll behavior site-wide
//
// What this affects visually:
//   - Body text on all pages becomes Inter (more modern, more readable)
//   - Atmospheric coral glow drifts in background of every page
//   - Headings using Barlow Condensed stay as-is (still works fine with the new feel)
//   - Form inputs may look slightly different (inherit Inter now)
//   - All other layout, all colors, all cards stay the same in this phase

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('/* PHASE 1 FOUNDATION */') || src.includes('Space+Grotesk')) {
  console.error('ERROR: Phase 1 already applied. Aborting.');
  process.exit(1);
}

// ============================================================
// EDIT 1: Replace the font @import to include Space Grotesk, Inter, Space Mono
// ============================================================
const fontOld = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const fontNew = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');`;

if (!src.includes(fontOld)) {
  console.error('ERROR: Could not find font import line.');
  process.exit(1);
}
src = src.replace(fontOld, () => fontNew);

// ============================================================
// EDIT 2: Replace body styling to use Inter as default and add ember glow
// ============================================================
const bodyOld = `        body {
          font-family: 'Barlow', sans-serif;
          background: var(--steel);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }`;

const bodyNew = `        /* PHASE 1 FOUNDATION */
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
        }
        /* All page content sits above the embers */
        .app, nav, main, section, footer { position: relative; z-index: 1; }
        /* New design-language utility classes (available but not auto-applied) */
        .ds-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--yellow);
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .ds-display {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          letter-spacing: -0.025em;
        }
        .ds-body {
          font-family: 'Inter', sans-serif;
          line-height: 1.65;
        }`;

if (!src.includes(bodyOld)) {
  console.error('ERROR: Could not find body styling block.');
  process.exit(1);
}
src = src.replace(bodyOld, () => bodyNew);

// ============================================================
// EDIT 3: Add new variables to :root for the new design system
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
        }`;

const rootNew = `        :root {
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

if (!src.includes(rootOld)) {
  console.error('ERROR: Could not find :root block.');
  process.exit(1);
}
src = src.replace(rootOld, () => rootNew);

// ============================================================
// Final
// ============================================================
if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Phase 1 foundation applied:');
console.log('  - Inter is now the default body font (Barlow Condensed kept where explicitly set)');
console.log('  - Space Grotesk, Inter, Space Mono all loaded and available');
console.log('  - Drifting ember glows fixed in the background of every page');
console.log('  - Smooth scroll behavior site-wide');
console.log('  - New design-system tokens added to :root for future phases');
console.log('  - All existing page layouts and colors UNCHANGED');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: phase 1 foundation theme upgrade" && git push');
console.log('');
