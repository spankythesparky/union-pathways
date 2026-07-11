// fix167b.js — Collapsible Apprenticeship Tests + History trades in mobile drawer
//
// Same as fix167, but the History anchor matches the user's actual file structure
// (which has an extra "Trade Histories" button from fix158 that I missed in v1).
//
// Result: the standalone "Trade Histories" button is removed and replaced by the
// collapsible toggle, since the toggle's "All Trades" sub-entry now routes there.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('drawerHistoryOpen') || src.includes('mobile-drawer-toggle')) {
  console.error('ERROR: Already applied. Aborting.');
  process.exit(1);
}

// ============================================================
// EDIT 1: Add 2 new state hooks
// ============================================================
const stateOld = `  const [mobileNavOpen, setMobileNavOpen] = useState(false);`;
const stateNew = `  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [drawerHistoryOpen, setDrawerHistoryOpen] = useState(false);
  const [drawerTestsOpen, setDrawerTestsOpen] = useState(false);`;

if (!src.includes(stateOld)) {
  console.error('ERROR: Could not find mobileNavOpen state. Aborting.');
  process.exit(1);
}
src = src.replace(stateOld, () => stateNew);

// ============================================================
// EDIT 2: Add CSS for the toggle row + chevron
// ============================================================
const cssOld = `        .mobile-drawer-link.active { color: var(--yellow); background: rgba(245,197,24,0.06); }`;

const cssNew = `        .mobile-drawer-link.active { color: var(--yellow); background: rgba(245,197,24,0.06); }
        .mobile-drawer-toggle {
          display: flex; align-items: center; justify-content: space-between;
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
        .mobile-drawer-toggle:hover { background: rgba(255,255,255,0.04); }
        .mobile-drawer-toggle.active { color: var(--yellow); }
        .mobile-drawer-toggle svg {
          flex-shrink: 0;
          transition: transform 0.2s ease;
          opacity: 0.6;
        }
        .mobile-drawer-toggle.open svg { transform: rotate(180deg); opacity: 1; }`;

if (!src.includes(cssOld)) {
  console.error('ERROR: Could not find .mobile-drawer-link.active CSS. Aborting.');
  process.exit(1);
}
src = src.replace(cssOld, () => cssNew);

// ============================================================
// EDIT 3: Replace Resources section's Apprenticeship Tests link
// (single flat link → collapsible toggle with 9 trade-test sub-links + All Tests)
// ============================================================
const testsOld = `          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Recursos\" : lang===\"pl\" ? \"Zasoby\" : \"Resources\"}</div>
            <button className={\`mobile-drawer-link\${page===\"apprenticeship\"||page.startsWith(\"apprenticeship-\") ? \" active\" : \"\"}\`} onClick={() => { setPage(\"apprenticeship\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Pruebas de Aprendizaje\" : lang===\"pl\" ? \"Testy Praktyk\" : \"Apprenticeship Tests\"}</button>
            <button className={\`mobile-drawer-link\${page===\"rtw\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"rtw\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</button>
          </div>`;

const testsNew = `          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Recursos\" : lang===\"pl\" ? \"Zasoby\" : \"Resources\"}</div>
            <button
              className={\`mobile-drawer-toggle\${page===\"apprenticeship\"||page.startsWith(\"apprenticeship-\") ? \" active\" : \"\"}\${drawerTestsOpen ? \" open\" : \"\"}\`}
              onClick={() => setDrawerTestsOpen(o => !o)}
            >
              <span>{lang===\"es\" ? \"Pruebas de Aprendizaje\" : lang===\"pl\" ? \"Testy Praktyk\" : \"Apprenticeship Tests\"}</span>
              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2.5\"><polyline points=\"6 9 12 15 18 9\"/></svg>
            </button>
            {drawerTestsOpen && (
              <>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Todas las Pruebas\" : lang===\"pl\" ? \"Wszystkie Testy\" : \"All Trade Tests\"}</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-ibew\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-ibew\"); setMobileNavOpen(false); }}>· IBEW · NJATC</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-ua\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-ua\"); setMobileNavOpen(false); }}>· UA · GAN</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-smart\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-smart\"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-iuec\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-iuec\"); setMobileNavOpen(false); }}>· IUEC · EIAT</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-iw\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-iw\"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-bac\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-bac\"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-hfiaw\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-hfiaw\"); setMobileNavOpen(false); }}>· HFIAW · Insulators</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-iuoe\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-iuoe\"); setMobileNavOpen(false); }}>· IUOE · Operating Engineers</button>
                <button className={\`mobile-drawer-link\${page===\"apprenticeship-ubc\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"apprenticeship-ubc\"); setMobileNavOpen(false); }}>· UBC · Carpenters</button>
              </>
            )}
            <button className={\`mobile-drawer-link\${page===\"rtw\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"rtw\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Derecho al Trabajo\" : lang===\"pl\" ? \"Prawo do Pracy\" : \"Right to Work\"}</button>
          </div>`;

if (!src.includes(testsOld)) {
  console.error('ERROR: Could not find Resources section anchor. Aborting.');
  process.exit(1);
}
src = src.replace(testsOld, () => testsNew);

// ============================================================
// EDIT 4: Replace History section
// (CORRECTED: includes the standalone "Trade Histories" button between General and the sub-links)
// ============================================================
const historyOld = `          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Historia\" : lang===\"pl\" ? \"Historia\" : \"History\"}</div>
            <button className={\`mobile-drawer-link\${page===\"history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historia General\" : lang===\"pl\" ? \"Historia Ogolna\" : \"General Union History\"}</button>
            <button className={\`mobile-drawer-link\${page===\"trade-history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"trade-history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historias de Oficios\" : lang===\"pl\" ? \"Historie Zawodow\" : \"Trade Histories\"}</button>
            <button className={\`mobile-drawer-link\${page===\"history-ibew\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ibew\"); setMobileNavOpen(false); }}>· IBEW · Electricians</button>
            <button className={\`mobile-drawer-link\${page===\"history-ua\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ua\"); setMobileNavOpen(false); }}>· UA · Plumbers & Pipefitters</button>
            <button className={\`mobile-drawer-link\${page===\"history-smart\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-smart\"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
            <button className={\`mobile-drawer-link\${page===\"history-bac\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-bac\"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
            <button className={\`mobile-drawer-link\${page===\"history-iron\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-iron\"); setMobileNavOpen(false); }}>· Iron Workers</button>
            <button className={\`mobile-drawer-link\${page===\"history-insul\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-insul\"); setMobileNavOpen(false); }}>· Insulators (HFIAW)</button>
            <button className={\`mobile-drawer-link\${page===\"history-iuec\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-iuec\"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
            <button className={\`mobile-drawer-link\${page===\"history-ufcw\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ufcw\"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
          </div>`;

const historyNew = `          <div className=\"mobile-drawer-section\">
            <div className=\"mobile-drawer-section-label\">{lang===\"es\" ? \"Historia\" : lang===\"pl\" ? \"Historia\" : \"History\"}</div>
            <button className={\`mobile-drawer-link\${page===\"history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historia General\" : lang===\"pl\" ? \"Historia Ogolna\" : \"General Union History\"}</button>
            <button
              className={\`mobile-drawer-toggle\${page===\"trade-history\"||page.startsWith(\"history-\") ? \" active\" : \"\"}\${drawerHistoryOpen ? \" open\" : \"\"}\`}
              onClick={() => setDrawerHistoryOpen(o => !o)}
            >
              <span>{lang===\"es\" ? \"Historias por Oficio\" : lang===\"pl\" ? \"Historia Wedlug Zawodu\" : \"Trade Histories\"}</span>
              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2.5\"><polyline points=\"6 9 12 15 18 9\"/></svg>
            </button>
            {drawerHistoryOpen && (
              <>
                <button className={\`mobile-drawer-link\${page===\"trade-history\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"trade-history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Todas\" : lang===\"pl\" ? \"Wszystkie\" : \"All Trades\"}</button>
                <button className={\`mobile-drawer-link\${page===\"history-ibew\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ibew\"); setMobileNavOpen(false); }}>· IBEW · Electricians</button>
                <button className={\`mobile-drawer-link\${page===\"history-ua\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ua\"); setMobileNavOpen(false); }}>· UA · Plumbers & Pipefitters</button>
                <button className={\`mobile-drawer-link\${page===\"history-smart\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-smart\"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page===\"history-bac\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-bac\"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page===\"history-iron\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-iron\"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page===\"history-insul\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-insul\"); setMobileNavOpen(false); }}>· Insulators (HFIAW)</button>
                <button className={\`mobile-drawer-link\${page===\"history-iuec\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-iuec\"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
                <button className={\`mobile-drawer-link\${page===\"history-ufcw\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ufcw\"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
              </>
            )}
          </div>`;

if (!src.includes(historyOld)) {
  console.error('ERROR: Could not find History section anchor. Aborting.');
  process.exit(1);
}
src = src.replace(historyOld, () => historyNew);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Mobile drawer now has collapsible sub-lists:');
console.log('  - "Apprenticeship Tests ▾" (collapsed by default, contains 10 entries when expanded)');
console.log('  - "Trade Histories ▾" (collapsed by default, contains 9 entries when expanded)');
console.log('  - Apprentice section stays flat');
console.log('  - Tools section stays flat');
console.log('  - General Union History stays as a top-level flat link');
console.log('  - Right to Work stays as a flat link in Resources');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: collapsible sub-lists in mobile drawer" && git push');
console.log('');
