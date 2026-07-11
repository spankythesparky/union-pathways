// fix174.js — Make mobile drawer sections collapsible
//
// What changes:
//   The 5 main drawer sections (Get Started, Membership, Resources, History,
//   About) become tappable accordion headers with a chevron. All collapsed
//   by default; multiple can be open at once.
//
// What stays the same:
//   - "Find a Local" (Home) remains a single tap-to-go button at the top
//   - The existing internal sub-collapses (Apprenticeship Tests inside
//     Get Started, Trade Histories inside History) keep working as nested
//     sub-accordions when their parent section is open
//
// Implementation approach:
//   1. Add a single state object `drawerSecOpen` + toggle helper inside the
//      App component. This keeps state minimal vs 5 separate booleans.
//   2. Add a new CSS class `.mobile-drawer-section-toggle` styled like a
//      section header (uppercase, letter-spaced, muted color) but as a
//      tappable button with a chevron.
//   3. For each of the 5 sections, convert the static `<div className=
//      "mobile-drawer-section-label">` into a `<button>` that toggles its
//      key, and wrap the section's body content in `{drawerSecOpen.X && ...}`.
//
// Idempotency: detects the new state variable and exits cleanly.
//
// Reads:  src/App.jsx
// Writes: src/App.jsx (in place)

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');

// ----------------------------------------------------------------------------
// Idempotency check
// ----------------------------------------------------------------------------
if (src.includes('drawerSecOpen') && src.includes('mobile-drawer-section-toggle')) {
  console.log('Already applied — collapsible drawer sections are already in place.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — Add state declaration
// ============================================================================
const stateAnchor = '  const [drawerTestsOpen, setDrawerTestsOpen] = useState(false);';
const stateNew = stateAnchor + `
  const [drawerSecOpen, setDrawerSecOpen] = useState({});
  const toggleDrawerSec = (k) => setDrawerSecOpen(s => ({ ...s, [k]: !s[k] }));`;
if (!src.includes(stateAnchor)) {
  console.error('ERROR: could not find drawer state anchor');
  process.exit(1);
}
src = src.replace(stateAnchor, stateNew);

// ============================================================================
// EDIT 2 — Add new CSS class for section-level toggle
// ============================================================================
const cssAnchor = `        .mobile-drawer-toggle.open svg { transform: rotate(180deg); opacity: 1; }`;
const cssNew = cssAnchor + `
        .mobile-drawer-section-toggle {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%;
          background: transparent; border: none;
          padding: 16px 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-drawer-section-toggle:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.85); }
        .mobile-drawer-section-toggle.active { color: var(--yellow); }
        .mobile-drawer-section-toggle svg {
          flex-shrink: 0;
          transition: transform 0.2s ease;
          opacity: 0.6;
        }
        .mobile-drawer-section-toggle.open svg { transform: rotate(180deg); opacity: 1; }
        .mobile-drawer-section-toggle.open { color: rgba(255,255,255,0.95); }`;
if (!src.includes(cssAnchor)) {
  console.error('ERROR: could not find drawer toggle CSS anchor');
  process.exit(1);
}
src = src.replace(cssAnchor, cssNew);

// ============================================================================
// EDIT 3 — Convert each section to collapsible
// ============================================================================
// For each section, we replace:
//   <div className="mobile-drawer-section">
//     <div className="mobile-drawer-section-label">{...label...}</div>
//     ...body buttons...
//   </div>
// With:
//   <div className="mobile-drawer-section">
//     <button className={`mobile-drawer-section-toggle${activeCheck ? " active" : ""}${drawerSecOpen.K ? " open" : ""}`} onClick={() => toggleDrawerSec("K")}>
//       <span>{...label...}</span>
//       <svg ...chevron... />
//     </button>
//     {drawerSecOpen.K && (
//       <>
//         ...body buttons...
//       </>
//     )}
//   </div>
//
// Anchored by the unique label text in each section.

const chevronSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;

// ---- SECTION 1: GET STARTED ------------------------------------------------
{
  const oldLabel = `<div className="mobile-drawer-section-label">{lang==="es" ? "Empezar" : lang==="pl" ? "Zacznij" : "Get Started"}</div>`;
  const activeCheck = `page==="checklist"||page==="careers"||page==="quiz"||page==="apprenticeship"||page.startsWith("apprenticeship-")||page==="calculator"||page==="resume"`;
  const newToggle = `<button
              className={\`mobile-drawer-section-toggle\${(${activeCheck}) ? " active" : ""}\${drawerSecOpen.gs ? " open" : ""}\`}
              onClick={() => toggleDrawerSec("gs")}
            >
              <span>{lang==="es" ? "Empezar" : lang==="pl" ? "Zacznij" : "Get Started"}</span>
              ${chevronSvg}
            </button>
            {drawerSecOpen.gs && (<>`;
  // The closing </> must go after this section's last button. Section ends at: `</div>\n\n          <div className="mobile-drawer-section">` (next section opens)
  if (!src.includes(oldLabel)) {
    console.error('ERROR: could not find Get Started label');
    process.exit(1);
  }
  src = src.replace(oldLabel, newToggle);
  // Insert closing fragment before next section's opening div. Anchor is the Resume Template button which is the last item, followed by `</div>` then a blank line and the next section's opening.
  const closeAnchor = `<button className={\`mobile-drawer-link\${page==="resume" ? " active" : ""}\`} onClick={() => { setPage("resume"); setMobileNavOpen(false); }}>{lang==="es" ? "Plantilla de Curriculum" : lang==="pl" ? "Szablon CV" : "Resume Template"}</button>\n          </div>`;
  if (!src.includes(closeAnchor)) {
    console.error('ERROR: could not find Get Started closing anchor');
    process.exit(1);
  }
  const closeNew = `<button className={\`mobile-drawer-link\${page==="resume" ? " active" : ""}\`} onClick={() => { setPage("resume"); setMobileNavOpen(false); }}>{lang==="es" ? "Plantilla de Curriculum" : lang==="pl" ? "Szablon CV" : "Resume Template"}</button>
            </>)}
          </div>`;
  src = src.replace(closeAnchor, closeNew);
}

// ---- SECTION 2: MEMBERSHIP -------------------------------------------------
{
  const oldLabel = `<div className="mobile-drawer-section-label">{lang==="es" ? "Membresia" : lang==="pl" ? "Czlonkostwo" : "Membership"}</div>`;
  const activeCheck = `page==="benefits"||page==="retirement"||page==="veterans"||page==="locals"||page==="wages"||page==="jobboard"`;
  const newToggle = `<button
              className={\`mobile-drawer-section-toggle\${(${activeCheck}) ? " active" : ""}\${drawerSecOpen.mb ? " open" : ""}\`}
              onClick={() => toggleDrawerSec("mb")}
            >
              <span>{lang==="es" ? "Membresia" : lang==="pl" ? "Czlonkostwo" : "Membership"}</span>
              ${chevronSvg}
            </button>
            {drawerSecOpen.mb && (<>`;
  if (!src.includes(oldLabel)) {
    console.error('ERROR: could not find Membership label');
    process.exit(1);
  }
  src = src.replace(oldLabel, newToggle);
  const closeAnchor = `<button className={\`mobile-drawer-link\${page==="jobboard" ? " active" : ""}\`} onClick={() => { setPage("jobboard"); setMobileNavOpen(false); }}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>\n          </div>`;
  if (!src.includes(closeAnchor)) {
    console.error('ERROR: could not find Membership closing anchor');
    process.exit(1);
  }
  const closeNew = `<button className={\`mobile-drawer-link\${page==="jobboard" ? " active" : ""}\`} onClick={() => { setPage("jobboard"); setMobileNavOpen(false); }}>{lang==="es" ? "Bolsa de Trabajo" : lang==="pl" ? "Gielda Pracy" : "Job Board"}</button>
            </>)}
          </div>`;
  src = src.replace(closeAnchor, closeNew);
}

// ---- SECTION 3: RESOURCES --------------------------------------------------
{
  const oldLabel = `<div className="mobile-drawer-section-label">{lang==="es" ? "Recursos" : lang==="pl" ? "Zasoby" : "Resources"}</div>`;
  const activeCheck = `page==="rtw"||page==="weingarten"||page==="organize"||page==="organize-contractor"`;
  const newToggle = `<button
              className={\`mobile-drawer-section-toggle\${(${activeCheck}) ? " active" : ""}\${drawerSecOpen.rs ? " open" : ""}\`}
              onClick={() => toggleDrawerSec("rs")}
            >
              <span>{lang==="es" ? "Recursos" : lang==="pl" ? "Zasoby" : "Resources"}</span>
              ${chevronSvg}
            </button>
            {drawerSecOpen.rs && (<>`;
  if (!src.includes(oldLabel)) {
    console.error('ERROR: could not find Resources label');
    process.exit(1);
  }
  src = src.replace(oldLabel, newToggle);
  const closeAnchor = `<button className={\`mobile-drawer-link\${page==="organize-contractor" ? " active" : ""}\`} onClick={() => { setPage("organize-contractor"); setMobileNavOpen(false); }}>{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</button>\n          </div>`;
  if (!src.includes(closeAnchor)) {
    console.error('ERROR: could not find Resources closing anchor');
    process.exit(1);
  }
  const closeNew = `<button className={\`mobile-drawer-link\${page==="organize-contractor" ? " active" : ""}\`} onClick={() => { setPage("organize-contractor"); setMobileNavOpen(false); }}>{lang==="es" ? "Organizar un Contratista" : lang==="pl" ? "Organizowanie Wykonawcy" : "Organizing a Contractor"}</button>
            </>)}
          </div>`;
  src = src.replace(closeAnchor, closeNew);
}

// ---- SECTION 4: HISTORY ----------------------------------------------------
// History is special: it has an inner sub-collapse (Trade Histories). When
// the History section is collapsed, both the General History link AND the
// Trade Histories sub-toggle should be hidden.
{
  const oldLabel = `<div className="mobile-drawer-section-label">{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</div>`;
  const activeCheck = `page==="history"||page==="trade-history"||page.startsWith("history-")`;
  const newToggle = `<button
              className={\`mobile-drawer-section-toggle\${(${activeCheck}) ? " active" : ""}\${drawerSecOpen.hi ? " open" : ""}\`}
              onClick={() => toggleDrawerSec("hi")}
            >
              <span>{lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "History"}</span>
              ${chevronSvg}
            </button>
            {drawerSecOpen.hi && (<>`;
  if (!src.includes(oldLabel)) {
    console.error('ERROR: could not find History label');
    process.exit(1);
  }
  src = src.replace(oldLabel, newToggle);
  // History section closes after the Trade Histories sub-collapse fragment.
  // The fragment ends with `)}\n          </div>`.
  const closeAnchor = `<button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
              </>
            )}
          </div>`;
  if (!src.includes(closeAnchor)) {
    console.error('ERROR: could not find History closing anchor');
    process.exit(1);
  }
  const closeNew = `<button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
              </>
            )}
            </>)}
          </div>`;
  src = src.replace(closeAnchor, closeNew);
}

// ---- SECTION 5: ABOUT ------------------------------------------------------
{
  const oldLabel = `<div className="mobile-drawer-section-label">{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</div>`;
  const activeCheck = `page==="about"||page==="contact"`;
  const newToggle = `<button
              className={\`mobile-drawer-section-toggle\${(${activeCheck}) ? " active" : ""}\${drawerSecOpen.ab ? " open" : ""}\`}
              onClick={() => toggleDrawerSec("ab")}
            >
              <span>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</span>
              ${chevronSvg}
            </button>
            {drawerSecOpen.ab && (<>`;
  if (!src.includes(oldLabel)) {
    console.error('ERROR: could not find About label');
    process.exit(1);
  }
  src = src.replace(oldLabel, newToggle);
  // About is the last section before </aside>
  const closeAnchor = `<button className={\`mobile-drawer-link\${page==="contact" ? " active" : ""}\`} onClick={() => { setPage("contact"); setContactSent(false); setMobileNavOpen(false); }}>{t.navContact}</button>\n          </div>`;
  if (!src.includes(closeAnchor)) {
    console.error('ERROR: could not find About closing anchor');
    process.exit(1);
  }
  const closeNew = `<button className={\`mobile-drawer-link\${page==="contact" ? " active" : ""}\`} onClick={() => { setPage("contact"); setContactSent(false); setMobileNavOpen(false); }}>{t.navContact}</button>
            </>)}
          </div>`;
  src = src.replace(closeAnchor, closeNew);
}

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Inserted:');
console.log('  - drawerSecOpen state + toggleDrawerSec helper');
console.log('  - .mobile-drawer-section-toggle CSS class');
console.log('  - 5 collapsible section toggles (Get Started, Membership, Resources, History, About)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: collapsible main sections in mobile drawer" && git push');
console.log('');
