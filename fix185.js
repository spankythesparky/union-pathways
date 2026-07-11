// fix185.js — Promote Industrial Unions to its own sub-menu peer to Trade Histories
//
// Before:
//   History ▾
//     → General Union History
//     → Trade Histories ▾  (contains Construction + Industrial groups, divider between)
//
// After:
//   History ▾
//     → General Union History
//     → Trade Histories ▾  (Construction trades only; eyebrow label removed)
//     → Industrial Unions ▾  (NEW peer; UFCW only for now)
//
// Changes in this fix:
//   1. Mobile drawer — add new `drawerIndustrialOpen` state + setter, then
//      add a new sibling collapsible toggle for Industrial Unions right after
//      the closing of the Trade Histories sub-collapse. Move UFCW button
//      out of the Trade Histories block and into the new Industrial Unions
//      block. Remove the inline "Construction Trades" / "Industrial Unions"
//      eyebrow labels inside Trade Histories — no longer needed since each
//      group has its own dropdown.
//
//   2. Desktop History dropdown — keep it flat-style (the existing dropdown
//      can't easily nest sub-menus in this codebase, and the user goal here
//      is "split into its own sub-section under History," which on a
//      hover-style dropdown is best expressed as: keep the divider/eyebrow
//      structure introduced in fix184, but rename the eyebrow from
//      "Construction Trades" to "Trade Histories" so it pairs visually with
//      "Industrial Unions" as two peers under the History dropdown.
//
//   3. trade-history INDEX page — remove the second "Industrial Unions" group
//      since UFCW now has its own home; keep only Construction Trades visible
//      there. UFCW remains accessible by direct link and by the new
//      Industrial Unions sub-dropdown.
//
//   Note on (3): we don't delete the UFCW data — it stays in TRADES_INDUSTRIAL
//   in case we want to re-add it. We just stop rendering that block on the
//   index page so users go through the dedicated Industrial Unions menu.
//
// Idempotency: detects `drawerIndustrialOpen` and exits cleanly.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
let src = fs.readFileSync(FILE, 'utf8');

if (src.includes('drawerIndustrialOpen')) {
  console.log('Already applied — Industrial Unions sub-menu is already in place.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — Add drawerIndustrialOpen state next to drawerHistoryOpen
// ============================================================================
const stateOld = `  const [drawerHistoryOpen, setDrawerHistoryOpen] = useState(false);`;
const stateNew = `  const [drawerHistoryOpen, setDrawerHistoryOpen] = useState(false);
  const [drawerIndustrialOpen, setDrawerIndustrialOpen] = useState(false);`;
if (!src.includes(stateOld)) {
  console.error('ERROR: could not find drawerHistoryOpen state declaration');
  process.exit(1);
}
src = src.replace(stateOld, stateNew);

// ============================================================================
// EDIT 2 — Mobile drawer: rebuild Trade Histories + add Industrial Unions
// ============================================================================
// Replace the entire existing Trade Histories sub-collapse block with two
// separate sub-collapsibles: Trade Histories (construction only) and
// Industrial Unions (UFCW only).
const oldDrawerBlock = `            <button
              className={\`mobile-drawer-toggle\${page==="trade-history"||page.startsWith("history-") ? " active" : ""}\${drawerHistoryOpen ? " open" : ""}\`}
              onClick={() => setDrawerHistoryOpen(o => !o)}
            >
              <span>{lang==="es" ? "Historias por Oficio" : lang==="pl" ? "Historia Wedlug Zawodu" : "Trade Histories"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerHistoryOpen && (
              <>
                <button className={\`mobile-drawer-link\${page==="trade-history" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("trade-history"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas" : lang==="pl" ? "Wszystkie" : "All Trades"}</button>
                <div style={{padding:"10px 24px 4px 36px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#F5C518", letterSpacing:1.8, textTransform:"uppercase"}}>{lang==="es" ? "Oficios de Construcción" : lang==="pl" ? "Zawody Budowlane" : "Construction Trades"}</div>
                <button className={\`mobile-drawer-link\${page==="history-ibew" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ibew"); setMobileNavOpen(false); }}>· IBEW · Electricians</button>
                <button className={\`mobile-drawer-link\${page==="history-ua" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ua"); setMobileNavOpen(false); }}>· UA · Plumbers & Pipefitters</button>
                <button className={\`mobile-drawer-link\${page==="history-smart" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-smart"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page==="history-bac" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-bac"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page==="history-iron" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iron"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page==="history-insul" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-insul"); setMobileNavOpen(false); }}>· Insulators (HFIAW)</button>
                <button className={\`mobile-drawer-link\${page==="history-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iuec"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
                <button className={\`mobile-drawer-link\${page==="history-iupat" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iupat"); setMobileNavOpen(false); }}>· IUPAT · Painters & Allied Trades</button>
                <div style={{padding:"10px 24px 4px 36px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#10A37F", letterSpacing:1.8, textTransform:"uppercase", marginTop:4}}>{lang==="es" ? "Sindicatos Industriales" : lang==="pl" ? "Związki Przemysłowe" : "Industrial Unions"}</div>
                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
              </>
            )}`;

const newDrawerBlock = `            <button
              className={\`mobile-drawer-toggle\${page==="trade-history"||(page.startsWith("history-") && page !== "history-ufcw") ? " active" : ""}\${drawerHistoryOpen ? " open" : ""}\`}
              onClick={() => setDrawerHistoryOpen(o => !o)}
            >
              <span>{lang==="es" ? "Historias por Oficio" : lang==="pl" ? "Historia Wedlug Zawodu" : "Trade Histories"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerHistoryOpen && (
              <>
                <button className={\`mobile-drawer-link\${page==="trade-history" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("trade-history"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas" : lang==="pl" ? "Wszystkie" : "All Trades"}</button>
                <button className={\`mobile-drawer-link\${page==="history-ibew" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ibew"); setMobileNavOpen(false); }}>· IBEW · Electricians</button>
                <button className={\`mobile-drawer-link\${page==="history-ua" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ua"); setMobileNavOpen(false); }}>· UA · Plumbers & Pipefitters</button>
                <button className={\`mobile-drawer-link\${page==="history-smart" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-smart"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
                <button className={\`mobile-drawer-link\${page==="history-bac" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-bac"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
                <button className={\`mobile-drawer-link\${page==="history-iron" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iron"); setMobileNavOpen(false); }}>· Iron Workers</button>
                <button className={\`mobile-drawer-link\${page==="history-insul" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-insul"); setMobileNavOpen(false); }}>· Insulators (HFIAW)</button>
                <button className={\`mobile-drawer-link\${page==="history-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iuec"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
                <button className={\`mobile-drawer-link\${page==="history-iupat" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iupat"); setMobileNavOpen(false); }}>· IUPAT · Painters & Allied Trades</button>
              </>
            )}
            <button
              className={\`mobile-drawer-toggle\${page==="history-ufcw" ? " active" : ""}\${drawerIndustrialOpen ? " open" : ""}\`}
              onClick={() => setDrawerIndustrialOpen(o => !o)}
            >
              <span>{lang==="es" ? "Sindicatos Industriales" : lang==="pl" ? "Związki Przemysłowe" : "Industrial Unions"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {drawerIndustrialOpen && (
              <>
                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
              </>
            )}`;

if (!src.includes(oldDrawerBlock)) {
  console.error('ERROR: could not find mobile drawer Trade Histories block');
  process.exit(1);
}
src = src.replace(oldDrawerBlock, newDrawerBlock);

// ============================================================================
// EDIT 3 — Desktop dropdown: rename eyebrow + adjust to feel like sibling sections
// ============================================================================
// fix184 introduced a "CONSTRUCTION TRADES" eyebrow. Rename to "TRADE HISTORIES"
// so it reads as the sibling header to "INDUSTRIAL UNIONS" (rather than as a
// subgroup of Trade Histories). The dropdown stays a single panel (CSS limits
// here on hover dropdowns) but feels structurally cleaner.
const oldDesktopEyebrow = `                        <div style={{padding:"6px 14px 4px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#F5C518", letterSpacing:2, textTransform:"uppercase"}}>{lang==="es" ? "Oficios de Construcción" : lang==="pl" ? "Zawody Budowlane" : "Construction Trades"}</div>`;
const newDesktopEyebrow = `                        <div style={{padding:"6px 14px 4px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#F5C518", letterSpacing:2, textTransform:"uppercase"}}>{lang==="es" ? "Historias por Oficio" : lang==="pl" ? "Historia Wedlug Zawodu" : "Trade Histories"}</div>`;
if (!src.includes(oldDesktopEyebrow)) {
  console.error('ERROR: could not find desktop dropdown Construction Trades eyebrow');
  process.exit(1);
}
src = src.replace(oldDesktopEyebrow, newDesktopEyebrow);

// ============================================================================
// EDIT 4 — trade-history INDEX page: remove the Industrial Unions group
//          (it now lives in its own sub-menu)
// ============================================================================
// fix184 wrapped the index render in a <></> with two grouped sections. We
// remove the second section and clean up the eyebrow on the first so it just
// says "Trade Histories" again.
const oldIndexRender = `                return (
                  <>
                    {/* CONSTRUCTION TRADES GROUP */}
                    <div style={{padding:'40px 24px 16px', maxWidth:1100, margin:'0 auto'}}>
                      <div style={{display:'flex', alignItems:'baseline', gap:12, marginBottom:24, flexWrap:'wrap'}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2.5, textTransform:'uppercase'}}>{constructionLabel}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:1.5, textTransform:'uppercase'}}>· {TRADES_CONSTRUCTION.length} {lang==="es" ? "Disponibles" : lang==="pl" ? "Dostepne" : "Live"}</div>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16}}>
                        {TRADES_CONSTRUCTION.map(t => <TradeCard key={t.key} t={t} />)}
                      </div>
                    </div>

                    {/* INDUSTRIAL UNIONS GROUP */}
                    <div style={{padding:'40px 24px 16px', maxWidth:1100, margin:'0 auto'}}>
                      <div style={{display:'flex', alignItems:'baseline', gap:12, marginBottom:24, flexWrap:'wrap'}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#10A37F', letterSpacing:2.5, textTransform:'uppercase'}}>{industrialLabel}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:1.5, textTransform:'uppercase'}}>· {TRADES_INDUSTRIAL.length} {lang==="es" ? "Disponibles" : lang==="pl" ? "Dostepne" : "Live"}</div>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16}}>
                        {TRADES_INDUSTRIAL.map(t => <TradeCard key={t.key} t={t} />)}
                      </div>
                    </div>
                  </>
                );`;

const newIndexRender = `                return (
                  <>
                    {/* CONSTRUCTION TRADES GROUP — Industrial Unions moved to its own sub-menu (fix185) */}
                    <div style={{padding:'40px 24px 16px', maxWidth:1100, margin:'0 auto'}}>
                      <div style={{display:'flex', alignItems:'baseline', gap:12, marginBottom:24, flexWrap:'wrap'}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2.5, textTransform:'uppercase'}}>{constructionLabel}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:1.5, textTransform:'uppercase'}}>· {TRADES_CONSTRUCTION.length} {lang==="es" ? "Disponibles" : lang==="pl" ? "Dostepne" : "Live"}</div>
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16}}>
                        {TRADES_CONSTRUCTION.map(t => <TradeCard key={t.key} t={t} />)}
                      </div>
                    </div>
                  </>
                );`;

if (!src.includes(oldIndexRender)) {
  console.error('ERROR: could not find trade-history index render block');
  process.exit(1);
}
src = src.replace(oldIndexRender, newIndexRender);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - Added drawerIndustrialOpen state');
console.log('  - Mobile drawer: split Trade Histories + Industrial Unions into peer collapsibles');
console.log('  - Desktop dropdown: renamed Construction Trades eyebrow to Trade Histories');
console.log('  - trade-history index: removed Industrial Unions group (now lives in its own menu)');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: split Industrial Unions into its own History sub-menu" && git push');
console.log('');
