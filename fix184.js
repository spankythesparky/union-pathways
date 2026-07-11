// fix184.js — Split Trade Histories into "Construction Trades" and
//              "Industrial Unions" groups
//
// What this changes:
//   1. trade-history INDEX page — splits the single TRADES array into two
//      arrays (TRADES_CONSTRUCTION and TRADES_INDUSTRIAL) and renders them
//      as two visually-grouped sections, each with its own eyebrow header.
//
//   2. Desktop History dropdown — adds a small visual divider between the
//      construction-trades entries (IBEW through IUPAT) and the
//      industrial-unions entries (UFCW). Each group gets a tiny eyebrow
//      label.
//
//   3. Mobile drawer Trade Histories sub-collapse — same divider/eyebrow
//      treatment.
//
// Idempotency: detects the new variable name "TRADES_CONSTRUCTION" and exits
// cleanly if already applied.
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

if (src.includes('TRADES_CONSTRUCTION')) {
  console.log('Already applied — Trade Histories grouping is already in place.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — trade-history index page: split TRADES + render two groups
// ============================================================================
// Old block: defines `const TRADES = [...]` with all 9 unions in one array,
// then renders a single grid with a "Live · 9" eyebrow.
const oldArrayBlock = `          // REBUILT TRADE HISTORY INDEX — fix165
          const TRADES = [
            { key:'ibew',  name:'IBEW',         full:'International Brotherhood of Electrical Workers',                                          page:'history-ibew',  founded:1891, members:'887K+', color:'#F5C518', sub:'Henry Miller, the Reid-Murphy split, and the Council on Industrial Relations.' },
            { key:'ua',    name:'UA',           full:'United Association of Plumbers, Pipefitters, Steamfitters & HVACR',                        page:'history-ua',    founded:1889, members:'365K+', color:'#3B9EFF', sub:'The Steamfitters War, the Veterans in Piping program, and an industrial pipeline at full speed.' },
            { key:'smart', name:'SMART',        full:'Sheet Metal, Air, Rail and Transportation Workers',                                        page:'history-smart', founded:1888, members:'200K+', color:'#B0BEC5', sub:'From Toledo tinsmiths to a 2014 merger that joined sheet metal with the railroads.' },
            { key:'bac',   name:'BAC',          full:'International Union of Bricklayers and Allied Craftworkers',                               page:'history-bac',   founded:1865, members:'70K+',  color:'#C04A36', sub:'The oldest building trades union in North America. Stonecutters, masons, and tile.' },
            { key:'iron',  name:'Iron Workers', full:'International Association of Bridge, Structural, Ornamental & Reinforcing Iron Workers',   page:'history-iron',  founded:1896, members:'130K+', color:'#D85F2E', sub:'High steel, the Bonus Marchers, and the trade with the highest fatality rate in construction.' },
            { key:'insul', name:'AWIU',         full:'Heat & Frost Insulators and Allied Workers',                                               page:'history-insul', founded:1903, members:'30K+',  color:'#A8623A', sub:'Founded in St. Louis. Pearl Harbor reconstruction, asbestos, and the energy-conservation specialists.' },
            { key:'iuec',  name:'IUEC',         full:'International Union of Elevator Constructors',                                             page:'history-iuec',  founded:1901, members:'30K+',  color:'#4A7B9D', sub:'Going up. From Otis at the Crystal Palace to the highest-paid building trade in the United States.' },
            { key:'ufcw',  name:'UFCW',         full:'United Food and Commercial Workers International Union',                                   page:'history-ufcw',  founded:1979, members:'1.2M+', color:'#10A37F', sub:'Grocery, retail, and meatpacking. Strike Twenty-Six, Smithfield, and the largest private-sector union.' },
            { key:'iupat', name:'IUPAT',        full:'International Union of Painters and Allied Trades',                                        page:'history-iupat', founded:1887, members:'140K+', color:'#ec4899', sub:'A Baltimore meeting hall, the East-West split, and the modern Hanover campus.' },
          ];
          const COMING = [`;

const newArrayBlock = `          // REBUILT TRADE HISTORY INDEX — fix165 / split fix184
          const TRADES_CONSTRUCTION = [
            { key:'ibew',  name:'IBEW',         full:'International Brotherhood of Electrical Workers',                                          page:'history-ibew',  founded:1891, members:'887K+', color:'#F5C518', sub:'Henry Miller, the Reid-Murphy split, and the Council on Industrial Relations.' },
            { key:'ua',    name:'UA',           full:'United Association of Plumbers, Pipefitters, Steamfitters & HVACR',                        page:'history-ua',    founded:1889, members:'365K+', color:'#3B9EFF', sub:'The Steamfitters War, the Veterans in Piping program, and an industrial pipeline at full speed.' },
            { key:'smart', name:'SMART',        full:'Sheet Metal, Air, Rail and Transportation Workers',                                        page:'history-smart', founded:1888, members:'200K+', color:'#B0BEC5', sub:'From Toledo tinsmiths to a 2014 merger that joined sheet metal with the railroads.' },
            { key:'bac',   name:'BAC',          full:'International Union of Bricklayers and Allied Craftworkers',                               page:'history-bac',   founded:1865, members:'70K+',  color:'#C04A36', sub:'The oldest building trades union in North America. Stonecutters, masons, and tile.' },
            { key:'iron',  name:'Iron Workers', full:'International Association of Bridge, Structural, Ornamental & Reinforcing Iron Workers',   page:'history-iron',  founded:1896, members:'130K+', color:'#D85F2E', sub:'High steel, the Bonus Marchers, and the trade with the highest fatality rate in construction.' },
            { key:'insul', name:'AWIU',         full:'Heat & Frost Insulators and Allied Workers',                                               page:'history-insul', founded:1903, members:'30K+',  color:'#A8623A', sub:'Founded in St. Louis. Pearl Harbor reconstruction, asbestos, and the energy-conservation specialists.' },
            { key:'iuec',  name:'IUEC',         full:'International Union of Elevator Constructors',                                             page:'history-iuec',  founded:1901, members:'30K+',  color:'#4A7B9D', sub:'Going up. From Otis at the Crystal Palace to the highest-paid building trade in the United States.' },
            { key:'iupat', name:'IUPAT',        full:'International Union of Painters and Allied Trades',                                        page:'history-iupat', founded:1887, members:'140K+', color:'#ec4899', sub:'A Baltimore meeting hall, the East-West split, and the modern Hanover campus.' },
          ];
          const TRADES_INDUSTRIAL = [
            { key:'ufcw',  name:'UFCW',         full:'United Food and Commercial Workers International Union',                                   page:'history-ufcw',  founded:1979, members:'1.2M+', color:'#10A37F', sub:'Grocery, retail, and meatpacking. Strike Twenty-Six, Smithfield, and the largest private-sector union.' },
          ];
          const COMING = [`;

if (!src.includes(oldArrayBlock)) {
  console.error('ERROR: could not find trade-history TRADES array block');
  process.exit(1);
}
src = src.replace(oldArrayBlock, newArrayBlock);

// Old render block — single eyebrow + grid
const oldRenderBlock = `              <div style={{padding:'40px 24px', maxWidth:1100, margin:'0 auto'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:'#F5C518', letterSpacing:2.5, textTransform:'uppercase', marginBottom:24}}>{lang==="es" ? "Disponibles" : lang==="pl" ? "Dostepne" : "Live"} · {TRADES.length}</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:16}}>
                  {TRADES.map(t => (
                    <div
                      key={t.key}
                      onClick={() => setPage(t.page)}
                      style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', borderLeft:'4px solid '+t.color, borderRadius:14, padding:'22px 24px', cursor:'pointer', transition:'all 0.2s'}}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}
                    >
                      <div>
                        <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:'#fff', margin:0, lineHeight:1.1}}>{t.name}</h3>
                        <div style={{fontSize:11, color:t.color, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700, marginTop:4}}>{t.full}</div>
                      </div>
                      <div style={{display:'flex', gap:16, marginTop:12, marginBottom:12, fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>
                        <span><span style={{color:'#fff'}}>{t.founded}</span> · {lang==="es" ? "Fundado" : lang==="pl" ? "Zalozony" : "Founded"}</span>
                        <span><span style={{color:'#fff'}}>{t.members}</span> · {lang==="es" ? "Miembros" : lang==="pl" ? "Czlonkowie" : "Members"}</span>
                      </div>
                      <p style={{fontSize:13.5, color:'rgba(255,255,255,0.75)', lineHeight:1.55, margin:'8px 0 0 0', fontStyle:'italic'}}>{t.sub}</p>
                    </div>
                  ))}
                </div>
              </div>`;

const newRenderBlock = `              {/* Reusable card renderer — keeps the two groups visually identical */}
              {(() => {
                const TradeCard = ({ t }) => (
                  <div
                    onClick={() => setPage(t.page)}
                    style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.10)', borderLeft:'4px solid '+t.color, borderRadius:14, padding:'22px 24px', cursor:'pointer', transition:'all 0.2s'}}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}
                  >
                    <div>
                      <h3 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:900, color:'#fff', margin:0, lineHeight:1.1}}>{t.name}</h3>
                      <div style={{fontSize:11, color:t.color, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700, marginTop:4}}>{t.full}</div>
                    </div>
                    <div style={{display:'flex', gap:16, marginTop:12, marginBottom:12, fontSize:11, color:'rgba(255,255,255,0.55)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1.5, textTransform:'uppercase', fontWeight:700}}>
                      <span><span style={{color:'#fff'}}>{t.founded}</span> · {lang==="es" ? "Fundado" : lang==="pl" ? "Zalozony" : "Founded"}</span>
                      <span><span style={{color:'#fff'}}>{t.members}</span> · {lang==="es" ? "Miembros" : lang==="pl" ? "Czlonkowie" : "Members"}</span>
                    </div>
                    <p style={{fontSize:13.5, color:'rgba(255,255,255,0.75)', lineHeight:1.55, margin:'8px 0 0 0', fontStyle:'italic'}}>{t.sub}</p>
                  </div>
                );

                const constructionLabel = lang==="es" ? "Oficios de Construcción" : lang==="pl" ? "Zawody Budowlane" : "Construction Trades";
                const industrialLabel   = lang==="es" ? "Sindicatos Industriales" : lang==="pl" ? "Związki Przemysłowe" : "Industrial Unions";

                return (
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
                );
              })()}`;

if (!src.includes(oldRenderBlock)) {
  console.error('ERROR: could not find trade-history render block');
  process.exit(1);
}
src = src.replace(oldRenderBlock, newRenderBlock);

// ============================================================================
// EDIT 2 — Desktop History dropdown: insert dividers between groups
// ============================================================================
// The dropdown maps over an inline array. We replace it with a JSX block that
// renders the construction items, a divider, then the industrial items.

const oldNavBlock = `                  {[
                    {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                    {key:'UA', name:'UA — Plumbers & Pipefitters', page:'history-ua', live:true},
                    {key:'SMART', name:'SMART — Sheet Metal, Air, Rail & Transportation', page:'history-smart', live:true},
                    {key:'BAC', name:'BAC — Bricklayers & Allied Craftworkers', page:'history-bac', live:true},
                    {key:'IW', name:'Iron Workers — Bridge & Structural', page:'history-iron', live:true},
                    {key:'HFIAW', name:'AWIU — Heat & Frost Insulators', page:'history-insul', live:true},
                    {key:'IUEC', name:'IUEC — Elevator Constructors', page:'history-iuec', live:true},
                    {key:'IUOE', name:'IUOE — Operating Engineers'},
                    {key:'UBC', name:'UBC — Carpenters'},
                    {key:'LIUNA', name:'LIUNA — Laborers'},
                    {key:'UFCW', name:'UFCW — Food & Commercial Workers', page:'history-ufcw', live:true},
                    {key:'IUPAT', name:'IUPAT — Painters & Allied Trades', page:'history-iupat', live:true},
                  ].map(t => (
                    <div key={t.key} onMouseDown={() => { if (t.live) { setPage(t.page); setHistoryOpen(false); } }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`} style={{opacity: t.live ? 1 : 0.55, cursor: t.live ? "pointer" : "not-allowed"}}>
                      <span className="nav-dropdown-label" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                        <span>{t.name}</span>
                        {!t.live && <span style={{fontSize:9, fontWeight:700, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", background:"rgba(250,128,89,0.12)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"2px 8px", whiteSpace:"nowrap"}}>{lang==="es" ? "Pronto" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</span>}
                      </span>
                    </div>
                  ))}`;

const newNavBlock = `                  {(() => {
                    const construction = [
                      {key:'IBEW_I', name:'IBEW Inside', page:'history-ibew', live:true},
                      {key:'UA', name:'UA — Plumbers & Pipefitters', page:'history-ua', live:true},
                      {key:'SMART', name:'SMART — Sheet Metal, Air, Rail & Transportation', page:'history-smart', live:true},
                      {key:'BAC', name:'BAC — Bricklayers & Allied Craftworkers', page:'history-bac', live:true},
                      {key:'IW', name:'Iron Workers — Bridge & Structural', page:'history-iron', live:true},
                      {key:'HFIAW', name:'AWIU — Heat & Frost Insulators', page:'history-insul', live:true},
                      {key:'IUEC', name:'IUEC — Elevator Constructors', page:'history-iuec', live:true},
                      {key:'IUPAT', name:'IUPAT — Painters & Allied Trades', page:'history-iupat', live:true},
                      {key:'IUOE', name:'IUOE — Operating Engineers'},
                      {key:'UBC', name:'UBC — Carpenters'},
                      {key:'LIUNA', name:'LIUNA — Laborers'},
                    ];
                    const industrial = [
                      {key:'UFCW', name:'UFCW — Food & Commercial Workers', page:'history-ufcw', live:true},
                    ];
                    const renderItem = t => (
                      <div key={t.key} onMouseDown={() => { if (t.live) { setPage(t.page); setHistoryOpen(false); } }} className={\`nav-dropdown-item\${page===t.page?" active":""}\`} style={{opacity: t.live ? 1 : 0.55, cursor: t.live ? "pointer" : "not-allowed"}}>
                        <span className="nav-dropdown-label" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8}}>
                          <span>{t.name}</span>
                          {!t.live && <span style={{fontSize:9, fontWeight:700, color:"#FA8059", letterSpacing:1, textTransform:"uppercase", background:"rgba(250,128,89,0.12)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:50, padding:"2px 8px", whiteSpace:"nowrap"}}>{lang==="es" ? "Pronto" : lang==="pl" ? "Wkrotce" : "Coming Soon"}</span>}
                        </span>
                      </div>
                    );
                    return (
                      <>
                        <div style={{padding:"6px 14px 4px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#F5C518", letterSpacing:2, textTransform:"uppercase"}}>{lang==="es" ? "Oficios de Construcción" : lang==="pl" ? "Zawody Budowlane" : "Construction Trades"}</div>
                        {construction.map(renderItem)}
                        <div style={{margin:"6px 14px", height:1, background:"rgba(255,255,255,0.08)"}} />
                        <div style={{padding:"6px 14px 4px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#10A37F", letterSpacing:2, textTransform:"uppercase"}}>{lang==="es" ? "Sindicatos Industriales" : lang==="pl" ? "Związki Przemysłowe" : "Industrial Unions"}</div>
                        {industrial.map(renderItem)}
                      </>
                    );
                  })()}`;

if (!src.includes(oldNavBlock)) {
  console.error('ERROR: could not find desktop History dropdown block');
  process.exit(1);
}
src = src.replace(oldNavBlock, newNavBlock);

// ============================================================================
// EDIT 3 — Mobile drawer Trade Histories: add eyebrows
// ============================================================================
// The mobile drawer renders trade history links inline. We add a small section
// header before the construction trades and another before the industrial ones,
// and reorder so UFCW is in its own section (UFCW currently sits between IUEC
// and IUPAT in the drawer).

// Find the existing mobile drawer Trade Histories block
const oldMobileBlock = `                <button className={\`mobile-drawer-link\${page==="history-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iuec"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
                <button className={\`mobile-drawer-link\${page==="history-iupat" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iupat"); setMobileNavOpen(false); }}>· IUPAT · Painters & Allied Trades</button>`;

const newMobileBlock = `                <button className={\`mobile-drawer-link\${page==="history-iuec" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iuec"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
                <button className={\`mobile-drawer-link\${page==="history-iupat" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-iupat"); setMobileNavOpen(false); }}>· IUPAT · Painters & Allied Trades</button>
                <div style={{padding:"10px 24px 4px 36px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#10A37F", letterSpacing:1.8, textTransform:"uppercase", marginTop:4}}>{lang==="es" ? "Sindicatos Industriales" : lang==="pl" ? "Związki Przemysłowe" : "Industrial Unions"}</div>
                <button className={\`mobile-drawer-link\${page==="history-ufcw" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("history-ufcw"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>`;

if (!src.includes(oldMobileBlock)) {
  console.error('ERROR: could not find mobile drawer Trade Histories block');
  process.exit(1);
}
src = src.replace(oldMobileBlock, newMobileBlock);

// Also add a "Construction Trades" eyebrow before the IBEW entry in the mobile drawer
const oldMobileFirst = `              <button className={\`mobile-drawer-link\${page==="trade-history" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("trade-history"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas" : lang==="pl" ? "Wszystkie" : "All Trades"}</button>
                <button className={\`mobile-drawer-link\${page==="history-ibew" ? " active" : ""}\`}`;

const newMobileFirst = `              <button className={\`mobile-drawer-link\${page==="trade-history" ? " active" : ""}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage("trade-history"); setMobileNavOpen(false); }}>{lang==="es" ? "Todas" : lang==="pl" ? "Wszystkie" : "All Trades"}</button>
                <div style={{padding:"10px 24px 4px 36px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:"#F5C518", letterSpacing:1.8, textTransform:"uppercase"}}>{lang==="es" ? "Oficios de Construcción" : lang==="pl" ? "Zawody Budowlane" : "Construction Trades"}</div>
                <button className={\`mobile-drawer-link\${page==="history-ibew" ? " active" : ""}\`}`;

if (!src.includes(oldMobileFirst)) {
  console.error('ERROR: could not find mobile drawer first-entry anchor');
  process.exit(1);
}
src = src.replace(oldMobileFirst, newMobileFirst);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - trade-history index: split TRADES into Construction + Industrial groups');
console.log('  - Desktop History dropdown: added group eyebrows + divider');
console.log('  - Mobile drawer: added group eyebrows, moved UFCW after IUPAT');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: split trade histories into Construction Trades and Industrial Unions" && git push');
console.log('');
