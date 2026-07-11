// fix125.js
// Combine the standalone "About" and "Contact" nav buttons into a single
// "Get in Touch" dropdown that opens to reveal both options.
//
// Changes:
//   1. Add a new dropdown-open state: getInTouchOpen
//   2. Update the existing three dropdown handlers (apprentice, learn, history)
//      to close getInTouchOpen when they open — matching the existing
//      mutual-close behavior between dropdowns.
//   3. Replace the standalone About and Contact buttons with a Get in Touch
//      dropdown styled identically to the Apprentice / Benefits / History
//      dropdowns.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

let changes = 0;

// ── 1. ADD getInTouchOpen STATE ─────────────────────────────────────────────
const stateAnchor = `  const [historyOpen, setHistoryOpen] = useState(false);\n`;
const stateReplacement =
`  const [historyOpen, setHistoryOpen] = useState(false);
  const [getInTouchOpen, setGetInTouchOpen] = useState(false);
`;

if (!code.includes(stateAnchor)) {
  console.error('ERROR: could not find historyOpen state declaration.');
  process.exit(1);
}
if (code.includes('getInTouchOpen, setGetInTouchOpen')) {
  console.log('Skipping state insert — getInTouchOpen already declared.');
} else {
  code = code.replace(stateAnchor, stateReplacement);
  console.log('✓ Added getInTouchOpen state');
  changes++;
}

// ── 2. UPDATE EXISTING DROPDOWN onClick HANDLERS TO CLOSE getInTouchOpen ────
const apprenticeOldClick = `                onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); }}`;
const apprenticeNewClick = `                onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}`;
if (code.includes(apprenticeOldClick)) {
  code = code.replace(apprenticeOldClick, apprenticeNewClick);
  console.log('✓ Updated Apprentice dropdown onClick');
  changes++;
} else if (code.includes(apprenticeNewClick)) {
  console.log('Skipping — Apprentice dropdown onClick already updated.');
} else {
  console.error('ERROR: Apprentice dropdown onClick pattern not found.');
  process.exit(1);
}

const learnOldClick = `                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); }}`;
const learnNewClick = `                onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}`;
if (code.includes(learnOldClick)) {
  code = code.replace(learnOldClick, learnNewClick);
  console.log('✓ Updated Benefits dropdown onClick');
  changes++;
} else if (code.includes(learnNewClick)) {
  console.log('Skipping — Benefits dropdown onClick already updated.');
} else {
  console.error('ERROR: Benefits dropdown onClick pattern not found.');
  process.exit(1);
}

const historyOldClick = `                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); }}`;
const historyNewClick = `                onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); setGetInTouchOpen(false); }}`;
if (code.includes(historyOldClick)) {
  code = code.replace(historyOldClick, historyNewClick);
  console.log('✓ Updated History dropdown onClick');
  changes++;
} else if (code.includes(historyNewClick)) {
  console.log('Skipping — History dropdown onClick already updated.');
} else {
  console.error('ERROR: History dropdown onClick pattern not found.');
  process.exit(1);
}

// ── 3. REPLACE STANDALONE About + Contact BUTTONS WITH DROPDOWN ─────────────
const oldButtons =
`            <button className={\`nav-link \${page==="about"?"active":""}\`} onClick={() => setPage("about")}>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</button>
            <button className={\`nav-link \${page==="contact"?"active":""}\`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>`;

const newDropdown =
`            {/* GET IN TOUCH DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="about"||page==="contact")?" active":""}\${getInTouchOpen?" open":""}\`}
                onClick={() => { setGetInTouchOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); }}
                onBlur={() => setTimeout(() => setGetInTouchOpen(false), 150)}
              >
                {lang==="es" ? "Contáctanos" : lang==="pl" ? "Kontakt" : "Get in Touch"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {getInTouchOpen && (
                <div className="nav-dropdown-menu">
                  <div className={\`nav-dropdown-item\${page==="about"?" active":""}\`} onMouseDown={() => { setPage("about"); setGetInTouchOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Quiénes somos y por qué" : lang==="pl" ? "Kim jesteśmy i dlaczego" : "Who we are and why"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="contact"?" active":""}\`} onMouseDown={() => { setPage("contact"); setContactSent(false); setGetInTouchOpen(false); }}>
                    <span className="nav-dropdown-label">{t.navContact}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Envíanos un mensaje" : lang==="pl" ? "Wyślij nam wiadomość" : "Send us a message"}</span>
                  </div>
                </div>
              )}
            </div>`;

if (code.includes(oldButtons)) {
  code = code.replace(oldButtons, newDropdown);
  console.log('✓ Replaced About + Contact buttons with Get in Touch dropdown');
  changes++;
} else if (code.includes('GET IN TOUCH DROPDOWN')) {
  console.log('Skipping — Get in Touch dropdown already in place.');
} else {
  console.error('ERROR: standalone About + Contact button pattern not found.');
  console.error('App.jsx may have been edited since fix125 was written.');
  process.exit(1);
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: combine About and Contact under Get in Touch dropdown" && git push');
console.log('');
