// fix175.js — Add a top-level "Apprenticeship" dropdown
//
// What changes:
//   1. New top-level dropdown "Apprenticeship" inserted between Get Started
//      and Membership in the desktop nav. Contains All Trade Tests + 9
//      individual trade test pages (mirrors how History dropdown works).
//   2. "Apprenticeship Tests" item is removed from Get Started's dropdown,
//      since those pages now live in the new Apprenticeship dropdown.
//   3. Get Started's active-state check no longer includes the apprenticeship
//      pages (they belong to the new tab now).
//   4. New `apprenticeshipOpen` state added and threaded into all other
//      dropdown click handlers (so opening any dropdown closes this one and
//      vice versa).
//   5. Mobile drawer: a new "Apprenticeship" collapsible section is added
//      between Get Started and Membership. The previous sub-collapse for
//      "Apprenticeship Tests" inside Get Started is removed.
//
// State naming note:
//   The existing variable `apprenticeOpen` (without -ship) drives the GET
//   STARTED dropdown — that name predates the consolidation and we don't
//   rename it here to avoid touching unrelated code. The NEW state is
//   `apprenticeshipOpen` (with -ship).
//
// Idempotency: detects `apprenticeshipOpen` and exits cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('apprenticeshipOpen')) {
  console.log('Already applied — Apprenticeship top-level nav already in place.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — Add new state declaration
// ============================================================================
const stateAnchor = '  const [getInTouchOpen, setGetInTouchOpen] = useState(false);';
if (!src.includes(stateAnchor)) {
  console.error('ERROR: could not find state anchor');
  process.exit(1);
}
src = src.replace(stateAnchor, stateAnchor + '\n  const [apprenticeshipOpen, setApprenticeshipOpen] = useState(false);');

// ============================================================================
// EDIT 2 — DESKTOP NAV: Slim down Get Started + insert Apprenticeship dropdown
// ============================================================================
// 2a. Remove "Apprenticeship Tests" item from Get Started dropdown
const oldGSItem = `                  <div className={\`nav-dropdown-item\${page==="quiz"?" active":""}\`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Que Oficio?" : lang==="pl" ? "Ktory Zawod?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdz swoj idealny zawod" : "Find your perfect trade match"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="apprenticeship"||page.startsWith("apprenticeship-")?" active":""}\`} onMouseDown={() => { setPage("apprenticeship"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Pruebas de Aprendizaje" : lang==="pl" ? "Testy Praktyk" : "Apprenticeship Tests"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "NJATC, EIAT, GAN y mas" : lang==="pl" ? "NJATC, EIAT, GAN i wiecej" : "NJATC, EIAT, GAN, and more"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="calculator"?" active":""}\`}`;

const newGSItem = `                  <div className={\`nav-dropdown-item\${page==="quiz"?" active":""}\`} onMouseDown={() => { setPage("quiz"); setApprenticeOpen(false); resetQuiz(); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Que Oficio?" : lang==="pl" ? "Ktory Zawod?" : "Which Trade?"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Encuentra tu oficio ideal" : lang==="pl" ? "Znajdz swoj idealny zawod" : "Find your perfect trade match"}</span>
                  </div>
                  <div className={\`nav-dropdown-item\${page==="calculator"?" active":""}\`}`;

if (!src.includes(oldGSItem)) {
  console.error('ERROR: could not find Get Started Apprenticeship Tests item to remove');
  process.exit(1);
}
src = src.replace(oldGSItem, newGSItem);

// 2b. Update Get Started's active-state check (remove apprenticeship pages)
const oldGSActive = `(page==="checklist"||page==="careers"||page==="quiz"||page==="apprenticeship"||page.startsWith("apprenticeship-")||page==="calculator"||page==="resume")`;
const newGSActive = `(page==="checklist"||page==="careers"||page==="quiz"||page==="calculator"||page==="resume")`;
if (!src.includes(oldGSActive)) {
  console.error('ERROR: could not find Get Started active-state check');
  process.exit(1);
}
src = src.replace(oldGSActive, newGSActive);

// 2c. Insert the new Apprenticeship dropdown right after Get Started's closing </div>
// Anchor: the comment that opens the Membership dropdown.
const APPRENTICESHIP_DROPDOWN = `            {/* APPRENTICESHIP DROPDOWN (uses apprenticeshipOpen) */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={\`nav-dropdown-btn\${(page==="apprenticeship"||page.startsWith("apprenticeship-"))?" active":""}\${apprenticeshipOpen?" open":""}\`}
                onClick={() => { setApprenticeshipOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}
                onBlur={() => setTimeout(() => setApprenticeshipOpen(false), 150)}
              >
                {lang==="es" ? "Aprendizaje" : lang==="pl" ? "Praktyka" : "Apprenticeship"}
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {apprenticeshipOpen && (
                <div className="nav-dropdown-menu" style={{minWidth:240}}>
                  <div className={\`nav-dropdown-item\${page==="apprenticeship"?" active":""}\`} onMouseDown={() => { setPage("apprenticeship"); setApprenticeshipOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Todas las Pruebas" : lang==="pl" ? "Wszystkie Testy" : "All Trade Tests"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Vista general por oficio" : lang==="pl" ? "Przeglad wedlug zawodu" : "Overview of every trade test"}</span>
                  </div>
                  {[
                    {key:'ibew',  page:'apprenticeship-ibew',  name:'IBEW · NJATC'},
                    {key:'ua',    page:'apprenticeship-ua',    name:'UA · GAN'},
                    {key:'smart', page:'apprenticeship-smart', name:'SMART · Sheet Metal'},
                    {key:'iuec',  page:'apprenticeship-iuec',  name:'IUEC · EIAT'},
                    {key:'iw',    page:'apprenticeship-iw',    name:'Iron Workers'},
                    {key:'bac',   page:'apprenticeship-bac',   name:'BAC · Bricklayers'},
                    {key:'hfiaw', page:'apprenticeship-hfiaw', name:'HFIAW · Insulators'},
                    {key:'iuoe',  page:'apprenticeship-iuoe',  name:'IUOE · Operating Engineers'},
                    {key:'ubc',   page:'apprenticeship-ubc',   name:'UBC · Carpenters'},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { setPage(t.page); setApprenticeshipOpen(false); }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`}>
                      <span className="nav-dropdown-label">{t.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            `;

const memDropdownAnchor = '            {/* MEMBERSHIP DROPDOWN (uses learnOpen) */}';
if (!src.includes(memDropdownAnchor)) {
  console.error('ERROR: could not find Membership dropdown anchor for insertion');
  process.exit(1);
}
src = src.replace(memDropdownAnchor, APPRENTICESHIP_DROPDOWN + memDropdownAnchor);

// ============================================================================
// EDIT 3 — Thread the new state into other dropdowns' onClick handlers so they
//           close the new dropdown when opened (mutual exclusion).
// ============================================================================
// Each existing onClick handler currently looks like:
//   { setXOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }
// We want to add `setApprenticeshipOpen(false);` to the end of each one
// EXCEPT the new dropdown's own (which doesn't need to close itself).
//
// We do this by string replacement on the unique signatures.

const handlerUpdates = [
  // Get Started's own onClick (uses apprenticeOpen — keep, but add apprenticeshipOpen)
  {
    old: `onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}`,
    new: `onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); setApprenticeshipOpen(false); }}`
  },
  // Membership
  {
    old: `onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}`,
    new: `onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); setHistoryOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); setApprenticeshipOpen(false); }}`
  },
  // Resources
  {
    old: `onClick={() => { setResourcesOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); }}`,
    new: `onClick={() => { setResourcesOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setGetInTouchOpen(false); setApprenticeshipOpen(false); }}`
  },
  // History
  {
    old: `onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); }}`,
    new: `onClick={() => { setHistoryOpen(o => !o); setLearnOpen(false); setApprenticeOpen(false); setResourcesOpen(false); setGetInTouchOpen(false); setApprenticeshipOpen(false); }}`
  },
  // About (uses getInTouchOpen)
  {
    old: `onClick={() => { setGetInTouchOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); }}`,
    new: `onClick={() => { setGetInTouchOpen(o => !o); setApprenticeOpen(false); setLearnOpen(false); setHistoryOpen(false); setResourcesOpen(false); setApprenticeshipOpen(false); }}`
  }
];

for (const h of handlerUpdates) {
  if (!src.includes(h.old)) {
    console.error('ERROR: could not find onClick handler to update:');
    console.error('  ', h.old.slice(0, 80) + '...');
    process.exit(1);
  }
  src = src.replace(h.old, h.new);
}

// ============================================================================
// EDIT 4 — MOBILE DRAWER: remove Apprenticeship Tests sub-collapse from
//           Get Started AND add a new top-level Apprenticeship section
// ============================================================================
// 4a. Remove the entire Apprenticeship Tests sub-collapse block from inside
// Get Started in the mobile drawer. The block runs from the toggle button
// through the closing `)}` of the `{drawerTestsOpen && (...)}` fragment.
const mobileTestsBlock = `<button
              className={\`mobile-drawer-toggle\${page==="apprenticeship"||page.startsWith("apprenticeship-") ? " active" : ""}\${drawerTestsOpen ? " open" : ""}\`}
              onClick={() => setDrawerTestsOpen(o => !o)}
            >
              <span>{lang==="es" ? "Pruebas de Aprendizaje" : lang==="pl" ? "Testy Praktyk" : "Apprenticeship Tests"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerTestsOpen && (
              <>
                <button className={\`mobile-drawer-link\${page==="apprenticeship" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas las Pruebas" : lang==="pl" ? "Wszystkie Testy" : "All Trade Tests"}</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-ibew" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-ibew"); setMobileNavOpen(false); }}>· IBEW · NJATC</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-ua" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-ua"); setMobileNavOpen(false); }}>· UA · GAN</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-smart" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-smart"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-iuec"); setMobileNavOpen(false); }}>· IUEC · EIAT</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-iw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-iw"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-bac" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-bac"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-hfiaw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-hfiaw"); setMobileNavOpen(false); }}>· HFIAW · Insulators</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-iuoe" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-iuoe"); setMobileNavOpen(false); }}>· IUOE · Operating Engineers</button>
                <button className={\`mobile-drawer-link\${page==="apprenticeship-ubc" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("apprenticeship-ubc"); setMobileNavOpen(false); }}>· UBC · Carpenters</button>
              </>
            )}
            `;
if (!src.includes(mobileTestsBlock)) {
  console.error('ERROR: could not find mobile Apprenticeship Tests sub-collapse block');
  process.exit(1);
}
src = src.replace(mobileTestsBlock, '');

// 4b. Update Get Started's active-state check in the mobile drawer
const oldMobileGSActive = `(page==="checklist"||page==="careers"||page==="quiz"||page==="apprenticeship"||page.startsWith("apprenticeship-")||page==="calculator"||page==="resume")`;
const newMobileGSActive = `(page==="checklist"||page==="careers"||page==="quiz"||page==="calculator"||page==="resume")`;
// This same pattern exists in both desktop and mobile — desktop was replaced earlier (EDIT 2b).
// Now replace the remaining (mobile) one. If it's not found that means desktop's pass also covered mobile,
// which is fine — but we need to check.
if (src.includes(oldMobileGSActive)) {
  src = src.replace(oldMobileGSActive, newMobileGSActive);
}

// 4c. Insert new "Apprenticeship" mobile drawer section between Get Started and Membership
const newMobileSection = `<div className="mobile-drawer-section">
            <button
              className={\`mobile-drawer-section-toggle\${(page==="apprenticeship"||page.startsWith("apprenticeship-")) ? " active" : ""}\${drawerSecOpen.ap ? " open" : ""}\`}
              onClick={() => toggleDrawerSec("ap")}
            >
              <span>{lang==="es" ? "Aprendizaje" : lang==="pl" ? "Praktyka" : "Apprenticeship"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerSecOpen.ap && (<>
              <button className={\`mobile-drawer-link\${page==="apprenticeship" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas las Pruebas" : lang==="pl" ? "Wszystkie Testy" : "All Trade Tests"}</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-ibew" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-ibew"); setMobileNavOpen(false); }}>· IBEW · NJATC</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-ua" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-ua"); setMobileNavOpen(false); }}>· UA · GAN</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-smart" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-smart"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-iuec" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-iuec"); setMobileNavOpen(false); }}>· IUEC · EIAT</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-iw" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-iw"); setMobileNavOpen(false); }}>· Iron Workers</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-bac" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-bac"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-hfiaw" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-hfiaw"); setMobileNavOpen(false); }}>· HFIAW · Insulators</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-iuoe" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-iuoe"); setMobileNavOpen(false); }}>· IUOE · Operating Engineers</button>
              <button className={\`mobile-drawer-link\${page==="apprenticeship-ubc" ? " active" : ""}\`} onClick={() => { setPage("apprenticeship-ubc"); setMobileNavOpen(false); }}>· UBC · Carpenters</button>
            </>)}
          </div>

          `;

// Anchor: insert before the Membership mobile section. The toggle's button text is
// the unique anchor — insert immediately before the section's `<div>` opening.
const mobileMembershipAnchor = `<div className="mobile-drawer-section">
            <button
              className={\`mobile-drawer-section-toggle\${(page==="benefits"||page==="retirement"||page==="veterans"||page==="locals"||page==="wages"||page==="jobboard") ? " active" : ""}\${drawerSecOpen.mb ? " open" : ""}\`}`;

if (!src.includes(mobileMembershipAnchor)) {
  console.error('ERROR: could not find mobile Membership anchor for insertion');
  process.exit(1);
}
src = src.replace(mobileMembershipAnchor, newMobileSection + mobileMembershipAnchor);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes:');
console.log('  - Added apprenticeshipOpen state');
console.log('  - Removed Apprenticeship Tests from Get Started (desktop + mobile)');
console.log('  - Added top-level Apprenticeship dropdown (desktop)');
console.log('  - Added Apprenticeship collapsible section (mobile)');
console.log('  - Updated mutual-close logic in all 5 sibling dropdowns');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: split Apprenticeship into its own top-level nav" && git push');
console.log('');
