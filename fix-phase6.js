// fix-phase6.js — Global pattern pass for remaining content pages
//
// Strategy: hit the most common visual patterns that distinguish the old design
// (Barlow Condensed + legacy yellow + heavy card backgrounds) with replacements
// matching the new design language.
//
// Already-redesigned pages (home, apprenticeship, history, jobboard, wages)
// don't match these patterns so they're unaffected.
//
// Pages that benefit (all remaining content pages):
//   - About, Contact, Quiz, Careers, Checklist, Caucus, Mental Health
//   - Right to Work body, Weingarten, Down Payment, Benefits, Retirement
//   - Locals, Calculator, Resume, Veterans, Organize, Organize Contractor

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency check
if (src.includes("/* PHASE 6 GLOBAL */")) {
  console.error('ERROR: Phase 6 already applied. Aborting.');
  process.exit(1);
}

let editCount = 0;

// ============================================================
// 1. Hardcoded #F5C518 → #FA8059 (the legacy yellow → coral)
// 153 instances expected
// ============================================================
const yellowMatches = (src.match(/#F5C518/g) || []).length;
src = src.replace(/#F5C518/g, '#FA8059');
editCount += yellowMatches;

// ============================================================
// 2. Replace common h2 patterns
// ============================================================

// Pattern A: clamp(28px, 4.5vw, 42px) headings
const h2_28_old = /<h2 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(28px, 4\.5vw, 42px\)', fontWeight:900, color:'#fff', /g;
const h2_28_matches = (src.match(h2_28_old) || []).length;
src = src.replace(h2_28_old, () => `<h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(24px, 3vw, 34px)', fontWeight:500, color:'#fff', letterSpacing:'-0.02em', `);
editCount += h2_28_matches;

// Pattern B: clamp(32px, 5vw, 48px) headings
const h2_32_old = /<h2 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(32px, 5vw, 48px\)', fontWeight:900, color:'#fff', /g;
const h2_32_matches = (src.match(h2_32_old) || []).length;
src = src.replace(h2_32_old, () => `<h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(26px, 3.5vw, 36px)', fontWeight:500, color:'#fff', letterSpacing:'-0.02em', `);
editCount += h2_32_matches;

// Pattern C: clamp(36px, 5.5vw, 56px) headings
const h2_36_old = /<h2 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(36px, 5\.5vw, 56px\)', fontWeight:900, color:'#fff', /g;
const h2_36_matches = (src.match(h2_36_old) || []).length;
src = src.replace(h2_36_old, () => `<h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(28px, 4vw, 40px)', fontWeight:500, color:'#fff', letterSpacing:'-0.02em', `);
editCount += h2_36_matches;

// ============================================================
// 3. Replace common h3 patterns
// ============================================================

// Pattern: h3 with Barlow Condensed at fontSize 20-22
const h3Pattern = /<h3 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff'/g;
const h3Matches = (src.match(h3Pattern) || []).length;
src = src.replace(h3Pattern, () => `<h3 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:500, color:'#fff', letterSpacing:'-0.015em'`);
editCount += h3Matches;

const h3Pattern20 = /<h3 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, color:'#fff'/g;
const h3Matches20 = (src.match(h3Pattern20) || []).length;
src = src.replace(h3Pattern20, () => `<h3 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:500, color:'#fff', letterSpacing:'-0.015em'`);
editCount += h3Matches20;

const h3Pattern18 = /<h3 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:'#fff'/g;
const h3Matches18 = (src.match(h3Pattern18) || []).length;
src = src.replace(h3Pattern18, () => `<h3 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:500, color:'#fff', letterSpacing:'-0.015em'`);
editCount += h3Matches18;

// ============================================================
// 4. Replace eyebrow patterns (yellow Barlow Condensed letter-spaced uppercase)
// Common pattern across pages
// ============================================================
const eyebrowPattern1 = /<div style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#FA8059', letterSpacing:3, textTransform:'uppercase'/g;
const eyebrow1Matches = (src.match(eyebrowPattern1) || []).length;
src = src.replace(eyebrowPattern1, () => `<div style={{fontFamily:"'Space Mono',monospace", fontSize:12, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase'`);
editCount += eyebrow1Matches;

const eyebrowPattern2 = /<div style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:'#FA8059', letterSpacing:2\.5, textTransform:'uppercase'/g;
const eyebrow2Matches = (src.match(eyebrowPattern2) || []).length;
src = src.replace(eyebrowPattern2, () => `<div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'#FA8059', letterSpacing:'0.2em', textTransform:'uppercase'`);
editCount += eyebrow2Matches;

const eyebrowPattern3 = /<div style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:'#FA8059', letterSpacing:2, textTransform:'uppercase'/g;
const eyebrow3Matches = (src.match(eyebrowPattern3) || []).length;
src = src.replace(eyebrowPattern3, () => `<div style={{fontFamily:"'Space Mono',monospace", fontSize:10, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase'`);
editCount += eyebrow3Matches;

// ============================================================
// 5. Card pattern: rgba(255,255,255,0.04) background → transparent
// (Affects content cards on pages that haven't been redesigned)
// ============================================================
const cardBgPattern = /background:'rgba\(255,255,255,0\.04\)', border:'1px solid rgba\(255,255,255,0\.08\)'/g;
const cardBgMatches = (src.match(cardBgPattern) || []).length;
src = src.replace(cardBgPattern, () => `background:'transparent', border:'1px solid rgba(255,255,255,0.08)'`);
editCount += cardBgMatches;

const cardBgPattern2 = /background:'rgba\(255,255,255,0\.03\)', border:'1px solid rgba\(255,255,255,0\.08\)'/g;
const cardBgMatches2 = (src.match(cardBgPattern2) || []).length;
src = src.replace(cardBgPattern2, () => `background:'transparent', border:'1px solid rgba(255,255,255,0.08)'`);
editCount += cardBgMatches2;

// ============================================================
// 6. h1 patterns that might still be Barlow Condensed in remaining pages
// ============================================================
const h1_84_old = /<h1 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(40px, 7vw, 84px\)', fontWeight:900, color:'#fff', lineHeight:0\.95, margin:'0 0 24px 0'\}\}>/g;
const h1_84_matches = (src.match(h1_84_old) || []).length;
src = src.replace(h1_84_old, () => `<h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(34px, 5vw, 60px)', fontWeight:500, color:'#fff', lineHeight:0.96, margin:'0 0 24px 0', letterSpacing:'-0.03em'}}>`);
editCount += h1_84_matches;

// h1 with different size patterns
const h1_72_old = /<h1 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(36px, 6vw, 72px\)', fontWeight:900, color:'#fff'/g;
const h1_72_matches = (src.match(h1_72_old) || []).length;
src = src.replace(h1_72_old, () => `<h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(34px, 5vw, 60px)', fontWeight:500, color:'#fff', letterSpacing:'-0.03em'`);
editCount += h1_72_matches;

// ============================================================
// 7. Body text paragraph patterns that are too heavy
// fontSize:16 with color:'rgba(255,255,255,0.85)' (the common content paragraph)
// Make text slightly lighter for better hierarchy
// ============================================================
// Skipping — risk of changing layout-critical paragraphs. Phase 6 doesn't need to touch every paragraph.

// Insert marker for idempotency
const markerInsertion = src.indexOf("/* PHASE 1 FOUNDATION */");
if (markerInsertion !== -1) {
  src = src.replace("/* PHASE 1 FOUNDATION */", "/* PHASE 1 FOUNDATION */\n        /* PHASE 6 GLOBAL */");
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Phase 6 applied: ' + editCount + ' global pattern updates.');
console.log('');
console.log('Affected:');
console.log('  - All remaining content pages (About, Contact, Organize, RTW body, etc.)');
console.log('  - Legacy yellow → coral references in any non-redesigned location');
console.log('  - h1/h2/h3 Barlow Condensed → Space Grotesk');
console.log('  - Eyebrows → Space Mono');
console.log('  - Cards → transparent backgrounds');
console.log('');
console.log('Already-redesigned pages unaffected (their patterns are already Space Grotesk).');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: phase 6 global content pages redesign" && git push');
console.log('');
