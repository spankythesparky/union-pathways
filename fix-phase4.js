// fix-phase4.js — Wages page + Job Board redesign (Phase 4)
//
// Strategy:
//   1. Update global .history-* CSS classes (used by 12 pages including JB and Wages)
//   2. Update Wages page labelStyle and inputStyle constants (form gets redesigned in one go)
//   3. Targeted inline edits for Job Board form elements (no shared constants — direct replacements)
//   4. Update CTA buttons on both pages
//
// As a side effect: all pages using .history-hero get their heroes upgraded.
// That includes the 8 history pages, RTW, and a few others — which is the Phase 5+ direction anyway.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('/* PHASE 4 HERO REDESIGN */')) {
  console.error('ERROR: Phase 4 already applied. Aborting.');
  process.exit(1);
}

let editCount = 0;

// ============================================================
// 1. Update the .history-* CSS classes (affects 12 pages' heroes)
// ============================================================
const heroClassesOld = `        .history-hero {
          background: linear-gradient(180deg, rgba(250,128,89,0.12) 0%, transparent 100%);
          border-bottom: 1px solid rgba(250,128,89,0.15);
          padding: 80px 24px 64px;
          text-align: center;
        }
        .history-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #FA8059; margin-bottom: 16px;
        }
        .history-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(42px, 8vw, 80px);
          font-weight: 900; line-height: 0.95;
          text-transform: uppercase; letter-spacing: -0.02em;
          color: #fff; margin-bottom: 24px;
        }
        .history-title .accent { color: #FA8059; }
        .history-subtitle {
          font-size: 18px; color: var(--muted);
          max-width: 600px; margin: 0 auto;
          line-height: 1.6;
        }`;

const heroClassesNew = `        /* PHASE 4 HERO REDESIGN */
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

if (!src.includes(heroClassesOld)) {
  console.error('ERROR: Could not find .history-* CSS class definitions.');
  process.exit(1);
}
src = src.replace(heroClassesOld, () => heroClassesNew);
editCount++;

// ============================================================
// 2. Update Wages page labelStyle and inputStyle constants
// ============================================================
const wageLabelOld = `          const labelStyle = {fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8};`;
const wageLabelNew = `          const labelStyle = {fontFamily:"'Space Mono',monospace", fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10};`;
if (src.includes(wageLabelOld)) {
  src = src.replace(wageLabelOld, () => wageLabelNew);
  editCount++;
}

const wageInputOld = `          const inputStyle = {width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", boxSizing:"border-box"};`;
const wageInputNew = `          const inputStyle = {width:"100%", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px", color:"#fff", fontSize:14, fontFamily:"'Inter',sans-serif", boxSizing:"border-box", transition:"border-color 0.18s"};`;
if (src.includes(wageInputOld)) {
  src = src.replace(wageInputOld, () => wageInputNew);
  editCount++;
}

// ============================================================
// 3. Job Board form labels (Barlow Condensed → Space Mono)
// They appear inline as: <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>
// ============================================================
const jbLabelOld = `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>`;
const jbLabelNew = `<div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10}}>`;
const jbLabelMatches = (src.match(new RegExp(jbLabelOld.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
while (src.includes(jbLabelOld)) {
  src = src.replace(jbLabelOld, () => jbLabelNew);
  editCount++;
}

// ============================================================
// 4. Job Board form inputs (heavier bg → transparent)
// Pattern: style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px"
// ============================================================
const jbInputOld = `style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px"`;
const jbInputNew = `style={{width:"100%", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 16px"`;
while (src.includes(jbInputOld)) {
  src = src.replace(jbInputOld, () => jbInputNew);
  editCount++;
}

// Also handle the variant with "10px 14px"
const jbInputOld2 = `style={{width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px"`;
const jbInputNew2 = `style={{width:"100%", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px"`;
while (src.includes(jbInputOld2)) {
  src = src.replace(jbInputOld2, () => jbInputNew2);
  editCount++;
}

// ============================================================
// 5. "Submit Another" button restyle on both pages
// Pattern: background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"10px 24px", color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer"
// ============================================================
const submitAgainOld = `background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"10px 24px", color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, cursor:"pointer"`;
const submitAgainNew = `background:"#FA8059", border:"none", borderRadius:50, padding:"12px 28px", color:"#000", fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:700, letterSpacing:"0.04em", cursor:"pointer"`;
while (src.includes(submitAgainOld)) {
  src = src.replace(submitAgainOld, () => submitAgainNew);
  editCount++;
}

// ============================================================
// 6. Hide the eyebrow ::before line for pages where it shouldn't render
// (the eyebrow now has a small dash before it via ::before — but for centered heroes
//  that may have multiple eyebrow lines we want consistent display)
// ============================================================
// (no edit needed — the new design is left-aligned by default)

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Phase 4 applied: ' + editCount + ' edits across Job Board, Wages, and shared hero classes.');
console.log('');
console.log('What changed:');
console.log('  - Hero CSS classes redesigned globally (affects 12 pages):');
console.log('    * Left-aligned instead of centered');
console.log('    * Space Grotesk title instead of Barlow Condensed');
console.log('    * Smaller, lighter weight, italic coral accent');
console.log('    * Space Mono eyebrow with leading dash');
console.log('  - Wages form labels + inputs redesigned via shared constants');
console.log('  - Job Board form labels + inputs redesigned via targeted edits');
console.log('  - "Submit Another" buttons → coral pill on both pages');
console.log('');
console.log('Bonus: history pages, RTW, and other pages using these classes also get the new hero.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: phase 4 wages + job board redesign" && git push');
console.log('');
