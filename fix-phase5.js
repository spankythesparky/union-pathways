// fix-phase5.js — History pages body content redesign (Phase 5)
//
// 11 history pages share the same internal helper components.
// Replacing those helpers once-per-page (which finds them all) redesigns the bodies uniformly.
//
// What gets updated:
//   1. StatBlock — gradient coral→white numbers, Space Grotesk
//   2. ExpandableCard — transparent background, hairline border, Space Grotesk titles
//   3. Era component — Space Grotesk titles, lighter weight
//   4. Hardcoded #F5C518 → #FA8059 (legacy yellow references)
//   5. Common inline h2 patterns — Barlow Condensed → Space Grotesk
//   6. Quote/attribution font

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes("/* PHASE 5 HISTORY BODY */")) {
  console.error('ERROR: Phase 5 already applied. Aborting.');
  process.exit(1);
}

let editCount = 0;
const ranges = []; // for debug

// ============================================================
// 1. StatBlock — replace the inner JSX for value + label
// Pattern matches the StatBlock component template used across all history pages
// ============================================================
// value div with Barlow Condensed, size 56, color #F5C518
const sbValueOld = `              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:56, fontWeight:900, color:'#F5C518', lineHeight:1}}>`;
const sbValueNew = `              <div style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(36px, 5vw, 56px)', fontWeight:500, background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, letterSpacing:'-0.03em'}}>`;
while (src.includes(sbValueOld)) {
  src = src.replace(sbValueOld, () => sbValueNew);
  editCount++;
}

// label div under stat
const sbLabelOld = `              <div style={{fontSize:12, color:'rgba(160,180,196,0.85)', marginTop:8, textTransform:'uppercase', letterSpacing:1.5, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700}}>`;
const sbLabelNew = `              <div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:10, letterSpacing:'0.15em', textTransform:'uppercase'}}>`;
while (src.includes(sbLabelOld)) {
  src = src.replace(sbLabelOld, () => sbLabelNew);
  editCount++;
}

// ============================================================
// 2. ExpandableCard — softer styling
// ============================================================
const ecCardOld = `<div style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'24px 28px', marginBottom:16, transition:'all 0.3s', borderLeft:\`4px solid \${accent}\`}}>`;
const ecCardNew = `<div style={{background:'transparent', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'24px 28px', marginBottom:14, transition:'all 0.3s', borderLeft:\`2px solid \${accent}\`}}>`;
while (src.includes(ecCardOld)) {
  src = src.replace(ecCardOld, () => ecCardNew);
  editCount++;
}

// ExpandableCard year heading
const ecYearOld = `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:accent, letterSpacing:1, textTransform:'uppercase', marginBottom:6}}>`;
const ecYearNew = `<div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:accent, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:8}}>`;
while (src.includes(ecYearOld)) {
  src = src.replace(ecYearOld, () => ecYearNew);
  editCount++;
}

// ExpandableCard title
const ecTitleOld = `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, marginBottom:8}}>`;
const ecTitleNew = `<div style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:500, color:'#fff', lineHeight:1.25, marginBottom:10, letterSpacing:'-0.015em'}}>`;
while (src.includes(ecTitleOld)) {
  src = src.replace(ecTitleOld, () => ecTitleNew);
  editCount++;
}

// ============================================================
// 3. Era component — update title font
// ============================================================
const eraTitleOld = `<h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:900, color:'#fff', margin:'4px 0 0 0', lineHeight:1.1}}>`;
const eraTitleNew = `<h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(22px, 3vw, 28px)', fontWeight:500, color:'#fff', margin:'4px 0 0 0', lineHeight:1.2, letterSpacing:'-0.02em'}}>`;
while (src.includes(eraTitleOld)) {
  src = src.replace(eraTitleOld, () => eraTitleNew);
  editCount++;
}

// Era badge year label (the small "1891-1900" type label above title)
const eraYearOld = `<div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color, letterSpacing:2, textTransform:'uppercase'}}>`;
const eraYearNew = `<div style={{fontFamily:"'Space Mono',monospace", fontSize:10, color, letterSpacing:'0.22em', textTransform:'uppercase'}}>`;
while (src.includes(eraYearOld)) {
  src = src.replace(eraYearOld, () => eraYearNew);
  editCount++;
}

// Era badge tag (the colored circle/box with abbreviation)
const eraTagOld = `<div style={{width:48, height:48, borderRadius:12, background:color+'22', border:'2px solid '+color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color, flexShrink:0}}>`;
const eraTagNew = `<div style={{width:48, height:48, borderRadius:12, background:color+'15', border:'1px solid '+color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:600, color, flexShrink:0, letterSpacing:'-0.01em'}}>`;
while (src.includes(eraTagOld)) {
  src = src.replace(eraTagOld, () => eraTagNew);
  editCount++;
}

// ============================================================
// 4. Hardcoded legacy #F5C518 yellow → #FA8059 coral (only in history page section)
// We do this only between the start of history pages and after to avoid affecting other pages
// ============================================================
const historyStart = src.indexOf('{page === "history" && (() => {');
const historyEnd = src.indexOf('{page === "apprenticeship" && (() => {');
if (historyStart !== -1 && historyEnd !== -1 && historyEnd > historyStart) {
  let historySection = src.slice(historyStart, historyEnd);
  const before = historySection;
  // Replace #F5C518 with #FA8059 in this section only
  const yellowCount = (historySection.match(/#F5C518/g) || []).length;
  historySection = historySection.replace(/#F5C518/g, '#FA8059');
  if (historySection !== before) {
    src = src.slice(0, historyStart) + historySection + src.slice(historyEnd);
    editCount += yellowCount;
  }
}

// ============================================================
// 5. Common h2 patterns in history bodies — "The Movement in 2026", "What Endures", etc.
// ============================================================
// Big content heading: clamp(32px, 5vw, 48px)
const h2BigOld = `<h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(32px, 5vw, 48px)', fontWeight:900, color:'#fff', margin:'12px 0 0 0'}}>`;
const h2BigNew = `<h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(26px, 3.5vw, 36px)', fontWeight:500, color:'#fff', margin:'12px 0 0 0', letterSpacing:'-0.02em', lineHeight:1.15}}>`;
while (src.includes(h2BigOld)) {
  src = src.replace(h2BigOld, () => h2BigNew);
  editCount++;
}

// Medium content heading: clamp(28px, 4.5vw, 42px)
const h2MedOld = `<h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(28px, 4.5vw, 42px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15}}>`;
const h2MedNew = `<h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(24px, 3vw, 34px)', fontWeight:500, color:'#fff', margin:'0 0 24px 0', lineHeight:1.2, letterSpacing:'-0.02em'}}>`;
while (src.includes(h2MedOld)) {
  src = src.replace(h2MedOld, () => h2MedNew);
  editCount++;
}

// ============================================================
// 6. Attribution lines (the "— Source Name" lines on quotes)
// ============================================================
const attrOld = `<div style={{fontSize:13, color:'rgba(160,180,196,0.8)', marginTop:14, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase'}}>`;
const attrNew = `<div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:14, letterSpacing:'0.15em', textTransform:'uppercase'}}>`;
while (src.includes(attrOld)) {
  src = src.replace(attrOld, () => attrNew);
  editCount++;
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

// Insert a marker comment so idempotency check works next time
const markerInsertion = src.indexOf("/* PHASE 1 FOUNDATION */");
if (markerInsertion !== -1) {
  src = src.replace("/* PHASE 1 FOUNDATION */", "/* PHASE 1 FOUNDATION */\n        /* PHASE 5 HISTORY BODY */");
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Phase 5 applied: ' + editCount + ' edits across history pages.');
console.log('');
console.log('What changed:');
console.log('  - StatBlock values now gradient coral→white');
console.log('  - StatBlock labels: Space Mono uppercase');
console.log('  - ExpandableCard: transparent bg, thinner left accent stripe');
console.log('  - ExpandableCard titles: Space Grotesk');
console.log('  - Era titles + tags: Space Grotesk, lighter weight');
console.log('  - Legacy #F5C518 yellow → #FA8059 coral in history section');
console.log('  - Content h2s: Space Grotesk');
console.log('  - Attributions: Space Mono');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: phase 5 history pages body redesign" && git push');
console.log('');
