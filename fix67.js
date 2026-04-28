const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ─── Update useEffect to use new unique ID ────────────────────────────────────
code = code.replace(
  'const mapEl = document.getElementById("union-map");',
  'const mapEl = document.getElementById("home-union-map");'
);
code = code.replace(
  'document.getElementById("map-loading")',
  'document.getElementById("home-map-loading")'
);
console.log('✅ Fixed map element IDs in useEffect');

// ─── Find correct insertion point ────────────────────────────────────────────
// Look for the SECTION TITLE block closing which is right before the platform overview closes
const marker = `            {/* DIVIDER */}
            <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", marginBottom:"64px"}}/>`;

if (!code.includes(marker)) {
  console.error('ERROR: divider marker not found');
  // Try alternate
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('DIVIDER') && lines[i].includes('SECTION')) {
      console.log('Found at line:', i, lines[i]);
    }
  }
  process.exit(1);
}

const mapJSX = `            {/* DIVIDER */}
            <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", marginBottom:"64px"}}/>

            {/* INTERACTIVE MAP — 854 LOCALS */}
            <div style={{marginBottom:"80px"}}>
              <div style={{textAlign:"center", marginBottom:"28px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FA8059", marginBottom:"10px"}}>
                  {lang==="es" ? "854 Locales en EE.UU. y Canada" : lang==="pl" ? "854 Lokale w USA i Kanadzie" : "854 Locals Across the US and Canada"}
                </div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(28px,5vw,46px)", fontWeight:"900", textTransform:"uppercase", color:"#fff", lineHeight:"1", letterSpacing:"-0.02em"}}>
                  {lang==="es" ? <span>{"Every Union Local. "}<span style={{color:"#FA8059"}}>{"One Map."}</span></span> : lang==="pl" ? <span>{"Every Union Local. "}<span style={{color:"#FA8059"}}>{"One Map."}</span></span> : <span>{"Every Union Local. "}<span style={{color:"#FA8059"}}>{"One Map."}</span></span>}
                </h2>
              </div>
              <div style={{display:"flex", gap:"8px", flexWrap:"wrap", justifyContent:"center", marginBottom:"16px"}}>
                {[
                  {key:"IBEW_I", label:"IBEW Inside", color:"#F5C518"},
                  {key:"IBEW_L", label:"IBEW Lineman", color:"#00E5FF"},
                  {key:"UA", label:"UA Plumbers", color:"#69FF47"},
                  {key:"BAC", label:"BAC Bricklayers", color:"#FF6B6B"},
                  {key:"IW", label:"Ironworkers", color:"#FF8C00"},
                ].map(t => (
                  <button key={t.key} id={"hmf-"+t.key} data-active="1" onClick={() => {
                    const el = document.getElementById("hmf-"+t.key);
                    const isActive = el.getAttribute("data-active") === "1";
                    el.setAttribute("data-active", isActive ? "0" : "1");
                    el.style.opacity = isActive ? "0.3" : "1";
                    if (window._homeMapLayers && window._homeMapLayers[t.key]) {
                      if (isActive) window._homeMap.removeLayer(window._homeMapLayers[t.key]);
                      else window._homeMap.addLayer(window._homeMapLayers[t.key]);
                    }
                  }} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", borderRadius:"50px", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"12px", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer"}}>
                    <span style={{width:"8px", height:"8px", borderRadius:"50%", background:t.color, display:"inline-block"}}></span>
                    {t.label}
                  </button>
                ))}
              </div>
              <div id="home-union-map" style={{width:"100%", height:"520px", borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(58,80,104,0.4)", position:"relative"}}>
                <div id="home-map-loading" style={{position:"absolute", inset:"0", background:"rgba(10,22,40,0.9)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:"1", color:"rgba(160,180,196,0.5)", fontSize:"13px", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.12em", textTransform:"uppercase"}}>
                  {lang==="es" ? "Cargando Mapa..." : lang==="pl" ? "Ladowanie Mapy..." : "Loading Map..."}
                </div>
              </div>
              <div style={{textAlign:"center", marginTop:"10px", fontSize:"11px", color:"rgba(160,180,196,0.35)", letterSpacing:"0.06em"}}>
                {lang==="es" ? "Haz clic en cualquier cluster para expandirlo." : lang==="pl" ? "Kliknij na klaster, aby go rozwinac." : "Click any cluster to expand. Zoom in to see individual pins."}
              </div>
            </div>`;

code = code.replace(marker, mapJSX);
console.log('✅ Inserted map section into home page');

// ─── Update useEffect to use correct variable names ───────────────────────────
code = code.replace('window._map = map;', 'window._homeMap = map;');
code = code.replace(/window\._mapLayers/g, 'window._homeMapLayers');
code = code.replace('window._map.removeLayer', 'window._homeMap.removeLayer');
code = code.replace('window._map.addLayer', 'window._homeMap.addLayer');

fs.writeFileSync('src/App.jsx', code);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: home page map with correct IDs" && git push\n');
