// fix157.js — Mobile hamburger nav + desktop nav cleanup
//
// Three changes:
//   1. Add CSS for: hamburger button, mobile drawer, desktop/mobile breakpoints
//   2. Add mobileNavOpen state to App component
//   3. Restructure top-level nav:
//      - Replace standalone RTW + Apprenticeship buttons with a "Resources" dropdown
//      - Hide desktop nav-links container on mobile (<900px)
//      - Show hamburger button + slide-in drawer only on mobile
//
// The drawer mirrors the desktop nav with section headers and is full-height
// on the right side, slides in from the right with a 0.25s ease.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('mobileNavOpen') || src.includes('mobile-drawer')) {
  console.error('ERROR: Mobile nav already exists. Aborting.');
  process.exit(1);
}

// ============================================================
// EDIT 1: Add useState declaration for mobileNavOpen + resourcesOpen
// ============================================================
// We anchor on an existing dropdown state hook (apprenticeOpen has it)
const stateOld = `  const [apprenticeOpen, setApprenticeOpen] = useState(false);`;
const stateNew = `  const [apprenticeOpen, setApprenticeOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);`;

if (!src.includes(stateOld)) {
  console.error('ERROR: Could not find apprenticeOpen state declaration. Aborting.');
  process.exit(1);
}
src = src.replace(stateOld, () => stateNew);

// ============================================================
// EDIT 2: Add CSS for hamburger + mobile drawer + responsive nav
// We anchor on the existing mobile media query and add new rules
// ============================================================
const cssAnchor = `        /* ── NAV LINKS ── */
        .nav-links { display: flex; align-items: center; gap: 2px; }`;

const cssNew = `        /* ── NAV LINKS ── */
        .nav-links { display: flex; align-items: center; gap: 2px; }

        /* ── HAMBURGER + MOBILE DRAWER ── */
        .nav-hamburger {
          display: none;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          color: var(--text);
          align-items: center;
          justify-content: center;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); }
        .nav-hamburger svg { display: block; }

        .mobile-drawer-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .mobile-drawer-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-drawer {
          position: fixed;
          top: 0; right: 0;
          height: 100vh;
          width: min(360px, 88vw);
          background: var(--steel);
          border-left: 1px solid rgba(255,255,255,0.1);
          z-index: 999;
          transform: translateX(100%);
          transition: transform 0.25s ease;
          overflow-y: auto;
          box-shadow: -8px 0 24px rgba(0,0,0,0.4);
        }
        .mobile-drawer.open { transform: translateX(0); }
        .mobile-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .mobile-drawer-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          color: var(--yellow);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .mobile-drawer-close {
          background: transparent; border: none; cursor: pointer;
          color: var(--text); padding: 4px;
          display: flex; align-items: center;
        }
        .mobile-drawer-section {
          padding: 14px 0 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mobile-drawer-section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0 20px 8px;
        }
        .mobile-drawer-link {
          display: block;
          width: 100%;
          background: transparent; border: none;
          padding: 12px 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-drawer-link:hover { background: rgba(255,255,255,0.04); }
        .mobile-drawer-link.active { color: var(--yellow); background: rgba(245,197,24,0.06); }`;

if (!src.includes(cssAnchor)) {
  console.error('ERROR: Could not find nav-links CSS anchor. Aborting.');
  process.exit(1);
}
src = src.replace(cssAnchor, () => cssNew);

// ============================================================
// EDIT 3: Hide nav-links on mobile, show hamburger
// We add this inside the existing mobile media query
// ============================================================
const mobileCssOld = `          .nav-wordmark { font-size: 17px; }
          .nav-link { padding: 5px 7px; font-size: 10px; }`;

const mobileCssNew = `          .nav-wordmark { font-size: 17px; }
          .nav-link { padding: 5px 7px; font-size: 10px; }
          .nav-links { display: none; }
          .nav-hamburger { display: inline-flex; }`;

if (!src.includes(mobileCssOld)) {
  console.error('ERROR: Could not find mobile CSS anchor. Aborting.');
  process.exit(1);
}
src = src.replace(mobileCssOld, () => mobileCssNew);

// We also add a wider breakpoint (under 900px) so the desktop nav collapses earlier
// — our current desktop nav with 9+ items doesn't fit comfortably below ~900px
// We add a NEW media query block right after the existing 768px block.
const bpAnchor = `          .page { padding: 32px 16px 60px; }
        }`;

const bpNew = `          .page { padding: 32px 16px 60px; }
        }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-hamburger { display: inline-flex; }
        }`;

// Only do this once (the anchor appears in the 768px block)
const bpCount = src.split(bpAnchor).length - 1;
if (bpCount === 0) {
  console.error('ERROR: Could not find media-query anchor. Aborting.');
  process.exit(1);
}
// Replace only the FIRST occurrence
src = src.replace(bpAnchor, () => bpNew);

// ============================================================
// EDIT 4: Replace top-level RTW + Apprenticeship nav buttons with a "Resources" dropdown
// And add the hamburger button + drawer markup
// ============================================================
const navOld = `            <button className={\`nav-link \${page===\"rtw\"?\"active\":\"\"}\`} onClick={() => setPage(\"rtw\")}>{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</button>
            <button className={\`nav-link \${page===\"apprenticeship\"||page===\"apprenticeship-ibew\"||page===\"apprenticeship-ua\"||page===\"apprenticeship-smart\"||page===\"apprenticeship-iuec\"||page===\"apprenticeship-iw\"||page===\"apprenticeship-bac\"||page===\"apprenticeship-hfiaw\"||page===\"apprenticeship-iuoe\"||page===\"apprenticeship-ubc\"?\"active\":\"\"}\`} onClick={() => setPage(\"apprenticeship\")}>{lang===\"es\" ? \"Aprendizaje\" : lang===\"pl\" ? \"Praktyka\" : \"Apprenticeship\"}</button>`;

const navNew = `            {/* RESOURCES DROPDOWN — RTW + Apprenticeship */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page===\"rtw\"||page===\"apprenticeship\"||page===\"apprenticeship-ibew\"||page===\"apprenticeship-ua\"||page===\"apprenticeship-smart\"||page===\"apprenticeship-iuec\"||page===\"apprenticeship-iw\"||page===\"apprenticeship-bac\"||page===\"apprenticeship-hfiaw\"||page===\"apprenticeship-iuoe\"||page===\"apprenticeship-ubc\")?\" active\":\"\"}\${resourcesOpen?\" open\":\"\"}\`}
                onClick={() => { setResourcesOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); setOrganizeOpen(false); }}
                onBlur={() => setTimeout(() => setResourcesOpen(false), 150)}
              >
                {lang===\"es\" ? \"Recursos\" : lang===\"pl\" ? \"Zasoby\" : \"Resources\"}
                <svg width=\"8\" height=\"8\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"3\">
                  <polyline points=\"6 9 12 15 18 9\"/>
                </svg>
              </button>
              {resourcesOpen && (
                <div className=\"nav-dropdown-menu\">
                  <div className={\`nav-dropdown-item\${page===\"apprenticeship\"||page.startsWith(\"apprenticeship-\")?\" active\":\"\"}\`} onMouseDown={() => { setPage(\"apprenticeship\"); setResourcesOpen(false); }}>
                    <span className=\"nav-dropdown-label\">{lang===\"es\" ? \"Pruebas de Aprendizaje\" : lang===\"pl\" ? \"Testy Praktyk\" : \"Apprenticeship Tests\"}</span>
                    <span className=\"nav-dropdown-sub\">{lang===\"es\" ? \"Por oficio: NJATC, EIAT, GAN y mas\" : lang===\"pl\" ? \"Wedlug zawodu: NJATC, EIAT, GAN i wiecej\" : \"By trade: NJATC, EIAT, GAN, and more\"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page===\"rtw\"?\" active\":\"\"}\`} onMouseDown={() => { setPage(\"rtw\"); setResourcesOpen(false); }}>
                    <span className=\"nav-dropdown-label\">{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</span>
                    <span className=\"nav-dropdown-sub\">{lang===\"es\" ? \"Comparacion de los 50 estados\" : lang===\"pl\" ? \"Porownanie 50 stanow\" : \"All 50 states compared\"}</span>
                  </div>
                </div>
              )}
            </div>`;

if (!src.includes(navOld)) {
  console.error('ERROR: Could not find RTW + Apprenticeship nav buttons block. Aborting.');
  process.exit(1);
}
src = src.replace(navOld, () => navNew);

// ============================================================
// EDIT 5: Add hamburger button + drawer right after the nav-links closing div
// We anchor on the language switcher area (after the nav-links div closes)
// ============================================================
const drawerAnchor = `          <div className="nav-links">`;

// Add hamburger BEFORE the nav-links div opens (so it sits left of nav-links visually
// — but display:none on desktop, only shows on mobile)
const drawerNew = `          <button
            className=\"nav-hamburger\"
            onClick={() => setMobileNavOpen(true)}
            aria-label=\"Open menu\"
          >
            <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2.4\" strokeLinecap=\"round\">
              <line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/>
              <line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"/>
              <line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"/>
            </svg>
          </button>

          <div className="nav-links">`;

if (!src.includes(drawerAnchor)) {
  console.error('ERROR: Could not find nav-links opening div. Aborting.');
  process.exit(1);
}
const drawerAnchorCount = src.split(drawerAnchor).length - 1;
if (drawerAnchorCount !== 1) {
  console.error('ERROR: Expected 1 nav-links opening, found ' + drawerAnchorCount + '. Aborting.');
  process.exit(1);
}
src = src.replace(drawerAnchor, () => drawerNew);

// ============================================================
// EDIT 6: Add the mobile drawer markup right before the </nav> closing tag
// ============================================================
// The drawer needs to be inside <nav> so it's positioned correctly. We anchor on </nav>.
// Find the nav closing tag — there might be multiples in JSX, but we want the FIRST one
// that comes after the nav-links section. We use a more specific anchor.
const navCloseAnchor = `        </nav>`;

const drawerMarkup = `        {/* MOBILE DRAWER */}
        <div className={\`mobile-drawer-backdrop\${mobileNavOpen ? \" open\" : \"\"}\`} onClick={() => setMobileNavOpen(false)} />
        <aside className={\`mobile-drawer\${mobileNavOpen ? \" open\" : \"\"}\`}>
          <div className=\"mobile-drawer-header\">
            <span className=\"mobile-drawer-title\">{lang===\"es\" ? \"Menu\" : lang===\"pl\" ? \"Menu\" : \"Menu\"}</span>
            <button className=\"mobile-drawer-close\" onClick={() => setMobileNavOpen(false)} aria-label=\"Close menu\">
              <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2.4\" strokeLinecap=\"round\">
                <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"/>
                <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"/>
              </svg>
            </button>
          </div>

          <button className={\`mobile-drawer-link\${page===\"home\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"home\"); setMobileNavOpen(false); setResults(null); setQuery(\"\"); }}>{t.navHome}</button>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Aprendiz\" : lang===\"pl\" ? \"Praktykant\" : \"Apprentice\"}</div>
            <button className={\`mobile-drawer-link\${page===\"checklist\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"checklist\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Como Unirse\" : lang===\"pl\" ? \"Jak Dolaczyc\" : \"How to Join\"}</button>
            <button className={\`mobile-drawer-link\${page===\"locals\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"locals\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Entendiendo tu Local\" : lang===\"pl\" ? \"Rozumienie Oddzialu\" : \"Understanding Your Local\"}</button>
            <button className={\`mobile-drawer-link\${page===\"careers\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"careers\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Rutas de Carrera\" : lang===\"pl\" ? \"Sciezki Kariery\" : \"Career Paths\"}</button>
            <button className={\`mobile-drawer-link\${page===\"quiz\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"quiz\"); setMobileNavOpen(false); resetQuiz(); }}>{lang===\"es\" ? \"Que Oficio?\" : lang===\"pl\" ? \"Ktory Zawod?\" : \"Which Trade?\"}</button>
            <button className={\`mobile-drawer-link\${page===\"calculator\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"calculator\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Calculadora de Salarios\" : lang===\"pl\" ? \"Kalkulator Wynagrodzen\" : \"Wage Calculator\"}</button>
            <button className={\`mobile-drawer-link\${page===\"resume\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"resume\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Plantilla de Curriculum\" : lang===\"pl\" ? \"Szablon CV\" : \"Resume Template\"}</button>
          </div>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Aprender\" : lang===\"pl\" ? \"Ucz Sie\" : \"Learn\"}</div>
            <button className={\`mobile-drawer-link\${page===\"benefits\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"benefits\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Resumen de Beneficios\" : lang===\"pl\" ? \"Przeglad Swiadczen\" : \"Benefits Overview\"}</button>
            <button className={\`mobile-drawer-link\${page===\"retirement\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"retirement\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Jubilacion\" : lang===\"pl\" ? \"Emerytura\" : \"Retirement\"}</button>
            <button className={\`mobile-drawer-link\${page===\"veterans\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"veterans\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Veteranos\" : lang===\"pl\" ? \"Weterani\" : \"Veterans\"}</button>
          </div>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Recursos\" : lang===\"pl\" ? \"Zasoby\" : \"Resources\"}</div>
            <button className={\`mobile-drawer-link\${page===\"apprenticeship\"||page.startsWith(\"apprenticeship-\") ? \" active\" : \"\"}\`} onClick={() => { setPage(\"apprenticeship\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Pruebas de Aprendizaje\" : lang===\"pl\" ? \"Testy Praktyk\" : \"Apprenticeship Tests\"}</button>
            <button className={\`mobile-drawer-link\${page===\"rtw\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"rtw\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</button>
          </div>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Historia\" : lang===\"pl\" ? \"Historia\" : \"History\"}</div>
            <button className={\`mobile-drawer-link\${page===\"history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historia General\" : lang===\"pl\" ? \"Historia Ogolna\" : \"General Union History\"}</button>
            <button className={\`mobile-drawer-link\${page===\"trade-history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"trade-history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historias de Oficios\" : lang===\"pl\" ? \"Historie Zawodow\" : \"Trade Histories\"}</button>
          </div>

          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Herramientas\" : lang===\"pl\" ? \"Narzedzia\" : \"Tools\"}</div>
            <button className={\`mobile-drawer-link\${page===\"jobboard\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"jobboard\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Bolsa de Trabajo\" : lang===\"pl\" ? \"Gielda Pracy\" : \"Job Board\"}</button>
            <button className={\`mobile-drawer-link\${page===\"wages\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"wages\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Salarios\" : lang===\"pl\" ? \"Place\" : \"Wages\"}</button>
          </div>
        </aside>

        </nav>`;

const navCloseCount = src.split(navCloseAnchor).length - 1;
if (navCloseCount === 0) {
  console.error('ERROR: Could not find </nav> closing tag. Aborting.');
  process.exit(1);
}
// Replace ONLY the first occurrence (which is the main nav)
src = src.replace(navCloseAnchor, () => drawerMarkup);

// ============================================================
// Final
// ============================================================
if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Mobile-friendly nav installed:');
console.log('  - Desktop: RTW + Apprenticeship grouped under new "Resources" dropdown');
console.log('  - Below 900px: nav-links hides, hamburger appears');
console.log('  - Hamburger opens slide-in drawer from right with all nav organized by section');
console.log('  - Drawer has 5 sections: Home, Apprentice, Learn, Resources, History, Tools');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: mobile hamburger nav + Resources dropdown" && git push');
console.log('');
