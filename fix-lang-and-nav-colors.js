// fix-lang-and-nav-colors.js
//
// Fixes THREE things missed by the earlier nav fix:
//   1. .nav-link, .nav-link:hover, .nav-link.active — currently coral/dark-theme
//   2. .lang-btn (and dividers) — currently white/40% opacity on white bg = invisible
//   3. Search icon button (top right) — inline coral hover color

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* NAV COLORS V4 FINAL */')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

let edits = 0;

// ═══════════════════════════════════════════════════════════════
// 1. .nav-link CSS block — was dark theme, coral hover, coral active
// ═══════════════════════════════════════════════════════════════
const navLinkOld = `        .nav-link {
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;`;

const navLinkNew = `        /* NAV COLORS V4 FINAL */
        .nav-link {
          background: transparent; border: none;
          color: #072554; cursor: pointer;
          font-family: 'Inter', sans-serif;`;

if (src.includes(navLinkOld)) {
  src = src.replace(navLinkOld, () => navLinkNew);
  edits++;
}

// Update .nav-link:hover
const navLinkHoverOld = `.nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }`;
const navLinkHoverNew = `.nav-link:hover { color: #FF6B00; background: rgba(255,107,0,0.05); }`;

if (src.includes(navLinkHoverOld)) {
  src = src.replace(navLinkHoverOld, () => navLinkHoverNew);
  edits++;
}

// Update .nav-link.active — this was coral via var(--yellow)
const navLinkActiveOld = `.nav-link.active { color: var(--yellow); }`;
const navLinkActiveNew = `.nav-link.active { color: #FF6B00; font-weight: 600; }`;

if (src.includes(navLinkActiveOld)) {
  src = src.replace(navLinkActiveOld, () => navLinkActiveNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 2. .lang-btn CSS block — was dark theme white-on-white
// ═══════════════════════════════════════════════════════════════
const langBtnOld = `        /* ── LANGUAGE TOGGLE ── */
        /* HEADER CLEANUP */
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

const langBtnNew = `        /* ── LANGUAGE TOGGLE (v4) ── */
        .lang-btn {
          background: transparent;
          border: none;
          border-radius: 4px;
          padding: 6px 8px;
          color: #5A6478;
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.04em; cursor: pointer;
          transition: color 0.18s, background 0.18s;
          min-width: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover { color: #072554; background: rgba(7,37,84,0.05); }
        .lang-btn.active { background: transparent; color: #FF6B00; border: none; font-weight: 700; }
        .lang-divider {
          color: #C4C9D0;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          user-select: none;
          pointer-events: none;
        }`;

if (src.includes(langBtnOld)) {
  src = src.replace(langBtnOld, () => langBtnNew);
  edits++;
}

// ═══════════════════════════════════════════════════════════════
// 3. Search icon button — inline hover color from coral to orange
// ═══════════════════════════════════════════════════════════════
const searchIconOld = `            <button onClick={() => { setSearchOpen(true); setGlobalQuery(\"\"); }} style={{background:\"rgba(255,255,255,0.06)\", border:\"1px solid rgba(255,255,255,0.1)\", borderRadius:\"8px\", width:32, height:32, display:\"flex\", alignItems:\"center\", justifyContent:\"center\", cursor:\"pointer\", color:\"var(--muted)\", transition:\"all 0.2s\"}} onMouseEnter={e=>e.currentTarget.style.color=\"#FA8059\"} onMouseLeave={e=>e.currentTarget.style.color=\"var(--muted)\"}>`;

const searchIconNew = `            <button onClick={() => { setSearchOpen(true); setGlobalQuery(\"\"); }} style={{background:\"rgba(7,37,84,0.04)\", border:\"1px solid rgba(7,37,84,0.10)\", borderRadius:\"8px\", width:34, height:34, display:\"flex\", alignItems:\"center\", justifyContent:\"center\", cursor:\"pointer\", color:\"#5A6478\", transition:\"all 0.15s\", marginLeft: 8}} onMouseEnter={e=>{e.currentTarget.style.color=\"#FF6B00\"; e.currentTarget.style.borderColor=\"#FF6B00\";}} onMouseLeave={e=>{e.currentTarget.style.color=\"#5A6478\"; e.currentTarget.style.borderColor=\"rgba(7,37,84,0.10)\";}}>`;

if (src.includes(searchIconOld)) {
  src = src.replace(searchIconOld, () => searchIconNew);
  edits++;
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Applied ' + edits + ' edits:');
console.log('  - .nav-link: navy text on white, Inter font');
console.log('  - .nav-link:hover: orange with soft orange tint');
console.log('  - .nav-link.active: orange bold (kills the coral "FIND A LOCAL" issue)');
console.log('  - .lang-btn: navy-gray text visible on white background');
console.log('  - .lang-btn:hover: navy on light navy tint');
console.log('  - .lang-btn.active: bright orange bold');
console.log('  - .lang-divider: light gray, visible on white');
console.log('  - Search icon button: navy-gray on subtle bg, orange hover');
console.log('  - All fonts unified to Inter');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "fix: nav link + language switcher colors to v4" && git push');
console.log('');
