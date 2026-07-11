// fix-newsletter-black-bar-and-button.js
//
// Two fixes:
//   1. Remove the 60px marginTop on the newsletter navy block that was showing
//      the dark body background through as a "black bar"
//   2. Update the NewsletterForm's Subscribe button and related coral (#FA8059)
//      references to construction orange (#FF6B00) to match the site palette

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* NEWSLETTER FIX V4 */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// 1. Remove the marginTop that creates the black bar gap
// ═══════════════════════════════════════════════════════════════
const marginOld = `<div style={{background:'#072554', padding:'56px 24px', marginTop: 60}}>`;
const marginNew = `<div style={{background:'#072554', padding:'56px 24px'}}>{/* NEWSLETTER FIX V4 */}`;

if (src.includes(marginOld)) {
  src = src.replace(marginOld, () => marginNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 2. Update Subscribe button — coral #FA8059 → orange #FF6B00
// ═══════════════════════════════════════════════════════════════
const buttonOld = `      <button
        onClick={handleSubmit}
        style={{
          background:'#FA8059',
          color:'#000',
          fontFamily:"'Inter',sans-serif",
          fontSize:14, fontWeight:700, letterSpacing:'0.04em',
          padding: compact ? '0 28px' : '0 32px',
          border:'none', borderRadius:50,
          cursor:'pointer', transition:'all 0.18s',
          minHeight: compact ? 44 : 48,
          whiteSpace:'nowrap'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(250,128,89,0.35)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >`;

const buttonNew = `      <button
        onClick={handleSubmit}
        style={{
          background:'#FF6B00',
          color:'#ffffff',
          fontFamily:"'Inter',sans-serif",
          fontSize:14, fontWeight:700, letterSpacing:'0.02em',
          padding: compact ? '0 28px' : '0 32px',
          border:'none', borderRadius:10,
          cursor:'pointer', transition:'all 0.15s',
          minHeight: compact ? 44 : 48,
          whiteSpace:'nowrap'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#d95a00'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,0,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >`;

if (src.includes(buttonOld)) {
  src = src.replace(buttonOld, () => buttonNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 3. Update the email input focus color from coral to orange
// ═══════════════════════════════════════════════════════════════
const inputOld = `        onFocus={e => e.currentTarget.style.borderBottomColor = '#FA8059'}
        onBlur={e => e.currentTarget.style.borderBottomColor = error ? '#FA8059' : 'rgba(255,255,255,0.18)'}`;

const inputNew = `        onFocus={e => e.currentTarget.style.borderBottomColor = '#FF6B00'}
        onBlur={e => e.currentTarget.style.borderBottomColor = error ? '#FF6B00' : 'rgba(255,255,255,0.18)'}`;

if (src.includes(inputOld)) {
  src = src.replace(inputOld, () => inputNew);
  edits++;
}

// Fix the error border color as well
const errorBorderOld = `borderBottom: '1px solid ' + (error ? '#FA8059' : 'rgba(255,255,255,0.18)'),`;
const errorBorderNew = `borderBottom: '1px solid ' + (error ? '#FF6B00' : 'rgba(255,255,255,0.18)'),`;
if (src.includes(errorBorderOld)) {
  src = src.replace(errorBorderOld, () => errorBorderNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 4. Update the "check your email" success message coral → orange
// ═══════════════════════════════════════════════════════════════
const successOld = `        color:'#FA8059',
        display:'flex', alignItems:'center', gap:10
      }}>
        <span style={{width:18, height:18, borderRadius:'50%', background:'#FA8059', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700}}>✓</span>`;

const successNew = `        color:'#FF6B00',
        display:'flex', alignItems:'center', gap:10
      }}>
        <span style={{width:18, height:18, borderRadius:'50%', background:'#FF6B00', color:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700}}>✓</span>`;

if (src.includes(successOld)) {
  src = src.replace(successOld, () => successNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 5. Also update the input font — was Space Grotesk, should be Inter
// ═══════════════════════════════════════════════════════════════
const inputFontOld = `          fontFamily:"'Space Grotesk',sans-serif",`;
const inputFontNew = `          fontFamily:"'Inter',sans-serif",`;

// Only replace inside NewsletterForm (safely — first occurrence after 'function NewsletterForm')
const newsletterStart = src.indexOf('function NewsletterForm(');
const newsletterEnd = src.indexOf('export default function UnionPathway', newsletterStart);
if (newsletterStart !== -1 && newsletterEnd !== -1) {
  const before = src.slice(0, newsletterStart);
  const nlSection = src.slice(newsletterStart, newsletterEnd);
  const after = src.slice(newsletterEnd);
  if (nlSection.includes(inputFontOld)) {
    const nlSectionNew = nlSection.replace(inputFontOld, inputFontNew);
    src = before + nlSectionNew + after;
    edits++;
  }
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + edits + ' edits:');
console.log('  - Removed 60px marginTop on navy newsletter block (kills black bar)');
console.log('  - Subscribe button: coral #FA8059 → orange #FF6B00');
console.log('  - Button hover: darker orange #d95a00 with soft glow');
console.log('  - Button border-radius: 50px pill → 10px rounded (matches home CTA)');
console.log('  - Button text color: black → white (better contrast)');
console.log('  - Email input focus color: coral → orange');
console.log('  - Error state border: coral → orange');
console.log('  - Success message color: coral → orange');
console.log('  - Success checkmark background: coral → orange');
console.log('  - Input font: Space Grotesk → Inter');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: newsletter black bar + orange subscribe button" && git push');
console.log('');
