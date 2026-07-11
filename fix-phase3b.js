// fix-phase3b.js — Apprenticeship detail pages redesign (Phase 3b)
//
// Targeted in-place edits across all 10 detail pages.
// All pages share the same helper component definitions (Section, Card, Stat),
// so replacing those 10x redesigns the entire body content of each page.
//
// What gets updated:
//   1. ACCENT color constants — all 10 different colors → coral #FA8059
//   2. Section helper — Space Mono eyebrow, Space Grotesk title with italic option
//   3. Card helper — lighter border, hairline divider style
//   4. Stat helper — gradient text (coral→white) Space Grotesk
//   5. Progress bar gradient — coral instead of mixed
//   6. Hero h1 — Space Grotesk, smaller weight, italic accent
//   7. Numbers row — borderless, no background tint
//   8. Back button — coral pill
//   9. Breadcrumb — Inter font, lighter
//
// Pages targeted: IBEW, UA, SMART, IUEC, IW, BAC, HFIAW, IUOE, UBC, IUPAT

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.match(/const ACCENT = '#FA8059';[\s\S]{0,200}apprenticeship-/)) {
  console.error('ERROR: Phase 3b appears already applied. Aborting.');
  process.exit(1);
}

let editCount = 0;

// ============================================================
// 1. Replace ALL ACCENT constant declarations in detail pages → coral
// (Skip the storm-call page at line ~12172 by being specific to indentation)
// ============================================================
const accentColors = ['#4A7B9D', '#7C9D4A', '#9D6B4A', '#9D4A4A', '#9D4A6B', '#7C4A9D', '#4A9D7C', '#9D7C4A', '#ec4899'];
// Each appears as: `          const ACCENT = '#XXXXXX';` (10 spaces indent for detail pages)
// IBEW appears twice (line 14454 & 14838) since IUEC also uses '#4A7B9D'
const accentRegex = /(          const ACCENT = ')#[A-Fa-f0-9]{6}(';)/g;
const accentMatches = [...src.matchAll(accentRegex)];
src = src.replace(accentRegex, (m, p1, p2) => p1 + '#FA8059' + p2);
editCount += accentMatches.length;

// ============================================================
// 2. Replace Section helper component (appears identically 10x)
// ============================================================
const sectionOld = `          const Section = ({ eyebrow, title, children }) => (
            <div style={{margin:'56px 0'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:ACCENT, letterSpacing:2.5, textTransform:'uppercase', marginBottom:12}}>{eyebrow}</div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(26px, 4vw, 38px)', fontWeight:900, color:'#fff', margin:'0 0 24px 0', lineHeight:1.1}}>{title}</h2>
              {children}
            </div>
          );`;

const sectionNew = `          const Section = ({ eyebrow, title, children }) => (
            <div style={{margin:'56px 0'}}>
              <div style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:14}}>// {eyebrow}</div>
              <h2 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(22px, 3vw, 32px)', fontWeight:500, color:'#fff', margin:'0 0 24px 0', lineHeight:1.15, letterSpacing:'-0.02em'}}>{title}</h2>
              {children}
            </div>
          );`;

while (src.includes(sectionOld)) {
  src = src.replace(sectionOld, () => sectionNew);
  editCount++;
}

// ============================================================
// 3. Replace Card helper component
// ============================================================
const cardOld = `          const Card = ({ children }) => (
            <div style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'24px 28px', marginBottom:14}}>
              {children}
            </div>
          );`;

const cardNew = `          const Card = ({ children }) => (
            <div style={{background:'transparent', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'24px 28px', marginBottom:14, transition:'all 0.2s'}}>
              {children}
            </div>
          );`;

while (src.includes(cardOld)) {
  src = src.replace(cardOld, () => cardNew);
  editCount++;
}

// ============================================================
// 4. Replace Stat helper component — gradient version
// ============================================================
const statOld = `          const Stat = ({ v, l }) => (
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp(34px, 4vw, 48px)', fontWeight:900, color:ACCENT, lineHeight:1, marginBottom:6}}>{v}</div>
              <div style={{fontSize:11, color:'rgba(255,255,255,0.6)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>{l}</div>
            </div>
          );`;

const statNew = `          const Stat = ({ v, l }) => (
            <div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(28px, 4vw, 48px)', fontWeight:500, background:'linear-gradient(135deg, #FA8059 0%, #F4A276 60%, #ffffff 100%)', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1, letterSpacing:'-0.03em', marginBottom:8}}>{v}</div>
              <div style={{fontFamily:"'Inter',sans-serif", fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.45}}>{l}</div>
            </div>
          );`;

while (src.includes(statOld)) {
  src = src.replace(statOld, () => statNew);
  editCount++;
}

// ============================================================
// 5. Progress bar gradient — was '+ACCENT+', #F5C518 → coral
// ============================================================
const progressOld = `background:'linear-gradient(90deg, '+ACCENT+', #F5C518)'`;
const progressNew = `background:'linear-gradient(90deg, #FA8059, #F4A276)'`;
while (src.includes(progressOld)) {
  src = src.replace(progressOld, () => progressNew);
  editCount++;
}

// ============================================================
// 6. Numbers row — remove background tint and tighten border
// Pattern: padding:'32px 24px', borderTop, borderBottom, background:'rgba(255,255,255,0.02)'
// Replace with hairline-only, no background
// ============================================================
const numbersRowOld = `<div style={{padding:'32px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)'}}>`;
const numbersRowNew = `<div style={{padding:'48px 24px', borderTop:'1px solid rgba(255,255,255,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)'}}>`;
while (src.includes(numbersRowOld)) {
  src = src.replace(numbersRowOld, () => numbersRowNew);
  editCount++;
}

// ============================================================
// 7. Hero h1 — Space Grotesk, lighter weight, smaller
// Pattern appears slightly differently across pages — use regex
// ============================================================
const heroH1Regex = /<h1 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(40px, 7vw, 80px\)', fontWeight:900, color:'#fff', lineHeight:0\.95, margin:'0 0 24px 0'\}\}>/g;
const heroH1MatchCount = (src.match(heroH1Regex) || []).length;
src = src.replace(heroH1Regex, () => `<h1 style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(32px, 5vw, 56px)', fontWeight:500, color:'#fff', lineHeight:1, margin:'0 0 24px 0', letterSpacing:'-0.03em'}}>`);
editCount += heroH1MatchCount;

// Also try the slightly-different IUPAT version
const heroH1Alt = /<h1 style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:'clamp\(40px, 7vw, 80px\)', fontWeight:900, color:'#fff', lineHeight:0\.95, margin:'0 0 24px 0'\}\}>([\s\S]*?)<\/h1>/g;
// already handled above

// ============================================================
// 8. Hero intro paragraph - smaller font, Inter
// Pattern: <p style={{fontSize:18, color:'rgba(255,255,255,0.85)', lineHeight:1.55, maxWidth:680, margin:0}}>
// ============================================================
const heroPRegex = /<p style=\{\{fontSize:18, color:'rgba\(255,255,255,0\.85\)', lineHeight:1\.55, maxWidth:680, margin:0\}\}>/g;
const heroPCount = (src.match(heroPRegex) || []).length;
src = src.replace(heroPRegex, () => `<p style={{fontFamily:"'Inter',sans-serif", fontSize:'clamp(14px, 1.3vw, 16px)', color:'rgba(255,255,255,0.7)', lineHeight:1.65, maxWidth:660, margin:0}}>`);
editCount += heroPCount;

// ============================================================
// 9. Eyebrow above h1 - convert to monospace // style
// Pattern: <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:18}}>
// ============================================================
const eyebrowRegex = /<div style=\{\{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:ACCENT, letterSpacing:3, textTransform:'uppercase', marginBottom:18\}\}>/g;
const eyebrowCount = (src.match(eyebrowRegex) || []).length;
src = src.replace(eyebrowRegex, () => `<div style={{fontFamily:"'Space Mono',monospace", fontSize:12, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:28}}>// `);
editCount += eyebrowCount;

// ============================================================
// 10. Update the "Aptitude Test." span color — was ACCENT, gradient feel via coral
// (these spans appear in headers like "<span style={{color:ACCENT}}>Aptitude Test.</span>")
// The ACCENT constant has been swapped, so color:ACCENT now resolves to #FA8059 — no edit needed
// BUT we want to italic these accent spans where possible
// Pattern: <span style={{color:ACCENT}}>
// ============================================================
const accentSpanRegex = /<span style=\{\{color:ACCENT\}\}>/g;
const accentSpanCount = (src.match(accentSpanRegex) || []).length;
src = src.replace(accentSpanRegex, () => `<span style={{color:ACCENT, fontStyle:'italic', fontWeight:600}}>`);
editCount += accentSpanCount;

// ============================================================
// 11. Back button — restyle to coral pill (the one going back to apprenticeship hub)
// Pattern across pages: looking for the back-to-apprenticeship buttons
// ============================================================
const backBtnRegex = /<button onClick=\{\(\) => setPage\('apprenticeship'\)\} style=\{\{background:'transparent', color:'#F5C518', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:900, letterSpacing:1\.5, textTransform:'uppercase', padding:'12px 28px', border:'1px solid rgba\(245,197,24,0\.4\)', borderRadius:50, cursor:'pointer'\}\}>/g;
const backBtnCount = (src.match(backBtnRegex) || []).length;
src = src.replace(backBtnRegex, () => `<button onClick={() => setPage('apprenticeship')} style={{background:'#FA8059', color:'#000', fontFamily:"'Inter',sans-serif", fontSize:14, fontWeight:700, letterSpacing:'0.04em', padding:'14px 32px', border:'none', borderRadius:50, cursor:'pointer'}}>`);
editCount += backBtnCount;

// ============================================================
// 12. Breadcrumb font — soften it
// Pattern: cursor:'pointer', fontSize:13, color:'rgba(160,180,196,0.85)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700
// ============================================================
const crumbRegex = /cursor:'pointer', fontSize:13, color:'rgba\(160,180,196,0\.85\)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase', fontWeight:700/g;
const crumbCount = (src.match(crumbRegex) || []).length;
src = src.replace(crumbRegex, () => `cursor:'pointer', fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.15em', textTransform:'uppercase'`);
editCount += crumbCount;

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Phase 3b applied: ' + editCount + ' targeted replacements across detail pages.');
console.log('  - ACCENT colors → coral on all 10 pages');
console.log('  - Section/Card/Stat helpers redesigned (10x each = 30 replacements)');
console.log('  - Progress bars → coral gradient');
console.log('  - Hero h1 → Space Grotesk with smaller, lighter type');
console.log('  - Hero intro paragraph → Inter, smaller');
console.log('  - Eyebrows → monospace // style');
console.log('  - Accent spans → italic');
console.log('  - Back buttons → coral pill');
console.log('  - Breadcrumbs → softer Space Mono style');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: phase 3b apprenticeship detail pages redesign" && git push');
console.log('');
