// fix-header-cleanup.js — Remove "All Trades" dropdown + compact language switcher

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* HEADER CLEANUP */')) {
  console.error('ERROR: Header cleanup already applied. Aborting.');
  process.exit(1);
}

// 1. Remove All Trades block
const blockStart = `          {/* TRADES DROPDOWN — only on home */}
          {page === "home" && (
          <div className="nav-right" ref={dropdownRef}>`;

const startIdx = src.indexOf(blockStart);
if (startIdx === -1) {
  console.error('ERROR: Could not find All Trades start anchor.');
  process.exit(1);
}

const endPattern = `          </div>
          )}
        {/* MOBILE DRAWER */}`;

const endPatternIdx = src.indexOf(endPattern, startIdx);
if (endPatternIdx === -1) {
  console.error('ERROR: Could not find end pattern.');
  process.exit(1);
}

const endOfRemoval = endPatternIdx + `          </div>
          )}
`.length;

const removeLength = endOfRemoval - startIdx;
if (removeLength < 1500 || removeLength > 6000) {
  console.error('ERROR: Suspect removal size (' + removeLength + ' chars). Aborting.');
  process.exit(1);
}

src = src.slice(0, startIdx) + src.slice(endOfRemoval);

// 2. Language CSS
const langCssOld = `        .lang-btn {
          background: transparent;
          border: 1.5px solid var(--wire);
          border-radius: 6px;
          padding: 8px 14px;
          color: var(--muted);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.08em; cursor: pointer;
          transition: all 0.2s; min-width: 40px;
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover { border-color: var(--yellow); color: var(--yellow); }
        .lang-btn.active { background: var(--yellow); color: var(--steel); border-color: var(--yellow); }`;

const langCssNew = `        /* HEADER CLEANUP */
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

if (!src.includes(langCssOld)) {
  console.error('ERROR: Could not find lang-btn CSS.');
  process.exit(1);
}
src = src.replace(langCssOld, () => langCssNew);

// 3. Language JSX
const langJsxOld = `          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
            <button className={\`lang-btn \${lang==="en"?"active":""}\`} onClick={() => setLang("en")}>EN</button>
            <button className={\`lang-btn \${lang==="es"?"active":""}\`} onClick={() => setLang("es")}>ES</button>
            <button className={\`lang-btn \${lang==="pl"?"active":""}\`} onClick={() => setLang("pl")}>PL</button>`;

const langJsxNew = `          <div style={{display:"flex", alignItems:"center", gap:"2px"}}>
            <button className={\`lang-btn \${lang==="en"?"active":""}\`} onClick={() => setLang("en")}>EN</button>
            <span className="lang-divider">·</span>
            <button className={\`lang-btn \${lang==="es"?"active":""}\`} onClick={() => setLang("es")}>ES</button>
            <span className="lang-divider">·</span>
            <button className={\`lang-btn \${lang==="pl"?"active":""}\`} onClick={() => setLang("pl")}>PL</button>`;

if (!src.includes(langJsxOld)) {
  console.error('ERROR: Could not find lang JSX.');
  process.exit(1);
}
src = src.replace(langJsxOld, () => langJsxNew);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Header cleaned up:');
console.log('  - Removed "All Trades" dropdown from top-right');
console.log('  - Compacted EN · ES · PL language switcher');
console.log('  - Header has more room for nav tabs');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: clean up header — remove All Trades, compact language switcher" && git push');
console.log('');
