const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD searchOpen state ──────────────────────────────────────────────────
code = code.replace(
  'const [retSection, setRetSection] = useState(null);',
  'const [retSection, setRetSection] = useState(null);\n  const [searchOpen, setSearchOpen] = useState(false);\n  const [globalQuery, setGlobalQuery] = useState("");'
);
console.log('✅ Added search states');

// ─── 2. ADD search icon button to nav (after lang buttons) ───────────────────
const oldLangDiv = `          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
            <button className={\`lang-btn \${lang==="en"?"active":""}\`} onClick={() => setLang("en")}>EN</button>
            <button className={\`lang-btn \${lang==="es"?"active":""}\`} onClick={() => setLang("es")}>ES</button>
            <button className={\`lang-btn \${lang==="pl"?"active":""}\`} onClick={() => setLang("pl")}>PL</button>
          </div>`;

const newLangDiv = `          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
            <button className={\`lang-btn \${lang==="en"?"active":""}\`} onClick={() => setLang("en")}>EN</button>
            <button className={\`lang-btn \${lang==="es"?"active":""}\`} onClick={() => setLang("es")}>ES</button>
            <button className={\`lang-btn \${lang==="pl"?"active":""}\`} onClick={() => setLang("pl")}>PL</button>
            <button onClick={() => { setSearchOpen(true); setGlobalQuery(""); }} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--muted)", transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color="#FA8059"} onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>`;

if (!code.includes(oldLangDiv)) { console.error('ERROR: lang div not found'); process.exit(1); }
code = code.replace(oldLangDiv, newLangDiv);
console.log('✅ Added search icon to nav');

// ─── 3. ADD SEARCH OVERLAY before closing </> ─────────────────────────────────
const closingTag = `    </>
  );
}`;

const searchOverlay = `
        {/* GLOBAL SEARCH OVERLAY */}
        {searchOpen && (
          <div style={{position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", alignItems:"center", padding:"80px 24px 24px"}} onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}>
            {/* Close button */}
            <button onClick={() => setSearchOpen(false)} style={{position:"absolute", top:24, right:24, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"var(--muted)", fontSize:20}}>×</button>

            {/* Search input */}
            <div style={{width:"100%", maxWidth:640, marginBottom:32}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#FA8059", marginBottom:16, textAlign:"center"}}>
                {lang==="es" ? "Buscar en Union Pathways" : lang==="pl" ? "Szukaj w Union Pathways" : "Search Union Pathways"}
              </div>
              <div style={{position:"relative"}}>
                <svg style={{position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"var(--muted)"}} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  autoFocus
                  value={globalQuery}
                  onChange={e => setGlobalQuery(e.target.value)}
                  placeholder={lang==="es" ? "Buscar locales, oficios, paginas..." : lang==="pl" ? "Szukaj lokali, zawodow, stron..." : "Search locals, trades, pages..."}
                  style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, padding:"16px 16px 16px 48px", fontSize:18, color:"white", outline:"none", boxSizing:"border-box"}}
                  onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                />
              </div>
            </div>

            {/* Results */}
            {(() => {
              if (!globalQuery.trim()) {
                // Show quick links when no query
                return (
                  <div style={{width:"100%", maxWidth:640}}>
                    <div style={{fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:12}}>
                      {lang==="es" ? "Acceso Rapido" : lang==="pl" ? "Szybki Dostep" : "Quick Access"}
                    </div>
                    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                      {[
                        { label: lang==="es" ? "Encontrar Local" : lang==="pl" ? "Znajdz Oddzial" : "Find a Local", page:"home" },
                        { label: lang==="es" ? "Como Unirse" : lang==="pl" ? "Jak Dolaczc" : "How to Join", page:"checklist" },
                        { label: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Sciezki Kariery" : "Career Paths", page:"careers" },
                        { label: lang==="es" ? "Beneficios" : lang==="pl" ? "Swiadczenia" : "Union Benefits", page:"benefits" },
                        { label: lang==="es" ? "Historia" : lang==="pl" ? "Historia" : "Union History", page:"history" },
                        { label: lang==="es" ? "Jubilacion" : lang==="pl" ? "Emerytura" : "Retirement", page:"retirement" },
                        { label: lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans", page:"veterans" },
                        { label: lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About", page:"about" },
                      ].map((item, i) => (
                        <button key={i} onClick={() => { setPage(item.page); setSearchOpen(false); }} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", textAlign:"left", cursor:"pointer", color:"var(--muted)", fontSize:14, fontWeight:600, transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(250,128,89,0.3)";e.currentTarget.style.color="#fff"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.color="var(--muted)"}}>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              const q = globalQuery.toLowerCase().trim();

              // Search pages
              const pages = [
                { label: "Find a Local", desc: "Search union locals near you by ZIP or city", page:"home", keywords:["local","find","search","ibew","ua","ironworkers","bac","union","near"] },
                { label: "How to Join", desc: "The 3 real entry routes into the union trades", page:"checklist", keywords:["join","apprenticeship","how","entry","apply","get in","route"] },
                { label: "Career Paths", desc: "Apprentice to journeyman wages and stages", page:"careers", keywords:["career","wages","salary","apprentice","journeyman","foreman","pay"] },
                { label: "Union Benefits", desc: "Pension, health insurance, annuity overview", page:"benefits", keywords:["benefits","pension","health","annuity","insurance","retirement"] },
                { label: "Retirement", desc: "401k vs Annuity vs Pension explained", page:"retirement", keywords:["retirement","401k","pension","annuity","401","retire"] },
                { label: "Health Insurance", desc: "How contractor-paid health insurance works", page:"health", keywords:["health","insurance","medical","dental","vision","contractor"] },
                { label: "Union History", desc: "How unions built America", page:"history", keywords:["history","weekend","8 hour","wagner","osha","labor","movement"] },
                { label: "Veterans", desc: "Helmets to Hardhats and veteran resources", page:"veterans", keywords:["veteran","military","helmets","hardhats","h2h","service","army","navy"] },
                { label: "About", desc: "The story behind Union Pathways", page:"about", keywords:["about","noah","founder","spanky","sparky","story","ibew","ohio"] },
                { label: "Quiz — Which Trade?", desc: "Find out which trade matches your skills", page:"quiz", keywords:["quiz","which","trade","match","skills","test"] },
                { label: "Contact", desc: "Get in touch with Union Pathways", page:"contact", keywords:["contact","email","message","feedback","correction"] },
              ].filter(p => p.keywords.some(k => k.includes(q) || q.includes(k) || p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)));

              // Search locals
              const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS];
              const localResults = ALL_LOCALS.filter(l =>
                l.name.toLowerCase().includes(q) ||
                l.city.toLowerCase().includes(q) ||
                l.state.toLowerCase().includes(q) ||
                (l.address && l.address.toLowerCase().includes(q))
              ).slice(0, 8);

              if (pages.length === 0 && localResults.length === 0) {
                return (
                  <div style={{color:"var(--muted)", fontSize:15, textAlign:"center"}}>
                    {lang==="es" ? "No se encontraron resultados para" : lang==="pl" ? "Nie znaleziono wynikow dla" : "No results found for"} "{globalQuery}"
                  </div>
                );
              }

              return (
                <div style={{width:"100%", maxWidth:640, display:"flex", flexDirection:"column", gap:16}}>
                  {pages.length > 0 && (
                    <div>
                      <div style={{fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>
                        {lang==="es" ? "Paginas" : lang==="pl" ? "Strony" : "Pages"}
                      </div>
                      <div style={{display:"flex", flexDirection:"column", gap:6}}>
                        {pages.map((p, i) => (
                          <button key={i} onClick={() => { setPage(p.page); setSearchOpen(false); }} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px", textAlign:"left", cursor:"pointer", transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(250,128,89,0.3)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:800, color:"#fff", marginBottom:2}}>{p.label}</div>
                            <div style={{fontSize:13, color:"var(--muted)"}}>{p.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {localResults.length > 0 && (
                    <div>
                      <div style={{fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--muted)", marginBottom:8}}>
                        {lang==="es" ? "Locales Sindicales" : lang==="pl" ? "Lokale Zwiazowe" : "Union Locals"}
                      </div>
                      <div style={{display:"flex", flexDirection:"column", gap:6}}>
                        {localResults.map((l, i) => (
                          <div key={i} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"12px 16px"}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:800, color:"#fff", marginBottom:2}}>{l.name}</div>
                            <div style={{fontSize:13, color:"var(--muted)"}}>{l.city}, {l.state}{l.phone ? " · " + l.phone : ""}</div>
                            {l.website && <a href={"https://"+l.website} target="_blank" rel="noopener noreferrer" style={{fontSize:12, color:"#FA8059", textDecoration:"none"}}>{l.website}</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

    </>
  );
}`;

code = code.replace(closingTag, searchOverlay);
console.log('✅ Added global search overlay');

// ─── 4. ADD keyboard shortcut (Cmd+K / Ctrl+K) ───────────────────────────────
const popstateEffect = `  // Handle browser back/forward
  useEffect(() => {
    const handlePop = (e) => {
      const p = e.state?.page || getPageFromUrl();
      setPageState(p);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);`;

const withShortcut = `  // Handle browser back/forward
  useEffect(() => {
    const handlePop = (e) => {
      const p = e.state?.page || getPageFromUrl();
      setPageState(p);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
        setGlobalQuery("");
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);`;

code = code.replace(popstateEffect, withShortcut);
console.log('✅ Added Cmd+K keyboard shortcut');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add global search overlay with Cmd+K shortcut" && git push\n');
