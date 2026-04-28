const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ─── 1. Add map useEffect after last useState ─────────────────────────────────
const mapUseEffect = `

  // Interactive map initialization
  useEffect(() => {
    if (page !== "home" || results) return;
    const mapEl = document.getElementById("union-map");
    if (!mapEl || mapEl._leaflet_id) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    function initMap() {
      if (!window.L) { setTimeout(initMap, 200); return; }
      if (mapEl._leaflet_id) return;
      const loadingEl = document.getElementById("map-loading");
      if (loadingEl) loadingEl.style.display = "none";

      const map = window.L.map(mapEl, { center:[42,-95], zoom:4, minZoom:3, maxZoom:16 });
      window._map = map;

      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:"&copy; OpenStreetMap &copy; CARTO", subdomains:"abcd", maxZoom:19
      }).addTo(map);

      const TRADE_DATA = [
        { key:"IBEW_I", color:"#F5C518", locals: IBEW_INSIDE_LOCALS },
        { key:"IBEW_L", color:"#00E5FF", locals: IBEW_LINEMAN_LOCALS },
        { key:"UA",     color:"#69FF47", locals: UA_LOCALS },
        { key:"BAC",    color:"#FF6B6B", locals: BAC_LOCALS },
        { key:"IW",     color:"#FF8C00", locals: IW_LOCALS },
      ];
      const offsets = { IBEW_I:[0,0], IBEW_L:[0.03,0.03], UA:[-0.03,0.03], BAC:[0.03,-0.03], IW:[-0.03,-0.03] };
      window._mapLayers = {};

      TRADE_DATA.forEach(trade => {
        const cluster = window.L.markerClusterGroup({
          maxClusterRadius:35, spiderfyOnMaxZoom:true, showCoverageOnHover:false,
          zoomToBoundsOnClick:true, disableClusteringAtZoom:11,
          iconCreateFunction: (c) => {
            const n = c.getChildCount();
            const size = n < 10 ? 30 : n < 50 ? 36 : 42;
            return window.L.divIcon({
              html: "<div style='width:"+size+"px;height:"+size+"px;border-radius:50%;background:"+trade.color+"18;border:2px solid "+trade.color+"88;display:flex;align-items:center;justify-content:center;font-family:Barlow Condensed,sans-serif;font-size:12px;font-weight:900;color:"+trade.color+"'>"+n+"</div>",
              className:"", iconSize:[size,size], iconAnchor:[size/2,size/2]
            });
          }
        });
        const off = offsets[trade.key] || [0,0];
        trade.locals.forEach(local => {
          if (!local.lat || !local.lng) return;
          const icon = window.L.divIcon({
            html: "<div style='width:10px;height:10px;border-radius:50%;background:"+trade.color+";border:2px solid rgba(255,255,255,0.9);box-shadow:0 0 6px "+trade.color+"99'></div>",
            className:"", iconSize:[10,10], iconAnchor:[5,5], popupAnchor:[0,-6]
          });
          const m = window.L.marker([local.lat+off[0], local.lng+off[1]], {icon});
          const links = [];
          if (local.phone) links.push("<a href='tel:"+local.phone+"' style='font-size:11px;color:rgba(160,180,196,0.7);text-decoration:none'>"+local.phone+"</a>");
          if (local.website) links.push("<a href='https://"+local.website+"' target='_blank' style='font-size:11px;color:#FA8059;text-decoration:none'>Website</a>");
          m.bindPopup("<div style='background:#0a1628;color:#fff;padding:12px;min-width:180px'><div style='font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:"+trade.color+";margin-bottom:4px'>"+trade.key+"</div><div style='font-family:Barlow Condensed,sans-serif;font-size:18px;font-weight:900;margin-bottom:4px'>"+local.name+"</div><div style='font-size:12px;color:rgba(160,180,196,0.6);margin-bottom:8px'>"+local.city+", "+local.state+"</div><div style='display:flex;gap:8px'>"+links.join("")+"</div></div>", {maxWidth:260});
          cluster.addLayer(m);
        });
        window._mapLayers[trade.key] = cluster;
        map.addLayer(cluster);
      });
    }

    if (!window.L) {
      const s1 = document.createElement("script");
      s1.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s1.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
        s2.onload = initMap;
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    } else {
      initMap();
    }
  }, [page, results]);`;

const insertAfter = 'const [showResults, setShowResults] = useState(false);';
if (!code.includes(insertAfter)) { console.error('ERROR: showResults useState not found'); process.exit(1); }
if (code.includes('Interactive map initialization')) {
  console.log('ℹ️  useEffect already added');
} else {
  code = code.replace(insertAfter, insertAfter + mapUseEffect);
  console.log('✅ Added map useEffect');
}

// ─── 2. Add map section to home page ─────────────────────────────────────────
const marker = `            </div>

          </div>
        )}

        {/* FOOTER */}`;

const mapSection = `            </div>

            {/* INTERACTIVE MAP */}
            <div style={{marginBottom:"80px"}}>
              <div style={{textAlign:"center", marginBottom:"28px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FA8059", marginBottom:"10px"}}>
                  {lang==="es" ? "854 Locales en EE.UU. y Canadá" : lang==="pl" ? "854 Lokale w USA i Kanadzie" : "854 Locals Across the US & Canada"}
                </div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(28px,5vw,46px)", fontWeight:"900", textTransform:"uppercase", color:"#fff", lineHeight:"1", letterSpacing:"-0.02em"}}>
                  {lang==="es" ? <>"Every Union Local. "<span style={{color:"#FA8059"}}>One Map.</span></> : lang==="pl" ? <>"Every Union Local. "<span style={{color:"#FA8059"}}>One Map.</span></> : <>{"Every Union Local. "}<span style={{color:"#FA8059"}}>{"One Map."}</span></>}
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
                  <button key={t.key} id={"mf-"+t.key} data-active="1" onClick={() => {
                    const el = document.getElementById("mf-"+t.key);
                    const isActive = el.getAttribute("data-active") === "1";
                    el.setAttribute("data-active", isActive ? "0" : "1");
                    el.style.opacity = isActive ? "0.3" : "1";
                    if (window._mapLayers && window._mapLayers[t.key]) {
                      if (isActive) window._map.removeLayer(window._mapLayers[t.key]);
                      else window._map.addLayer(window._mapLayers[t.key]);
                    }
                  }} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", borderRadius:"50px", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"12px", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer"}}>
                    <span style={{width:"8px", height:"8px", borderRadius:"50%", background:t.color, display:"inline-block"}}></span>
                    {t.label}
                  </button>
                ))}
              </div>
              <div id="union-map" style={{width:"100%", height:"520px", borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(58,80,104,0.4)", position:"relative"}}>
                <div id="map-loading" style={{position:"absolute", inset:"0", background:"rgba(10,22,40,0.9)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:"1", color:"rgba(160,180,196,0.5)", fontSize:"13px", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.12em", textTransform:"uppercase"}}>
                  {lang==="es" ? "Cargando Mapa..." : lang==="pl" ? "Ladowanie Mapy..." : "Loading Map..."}
                </div>
              </div>
              <div style={{textAlign:"center", marginTop:"10px", fontSize:"11px", color:"rgba(160,180,196,0.35)", letterSpacing:"0.06em"}}>
                {lang==="es" ? "Haz clic en cualquier cluster para expandirlo." : lang==="pl" ? "Kliknij na klaster, aby go rozwinac." : "Click any cluster to expand. Zoom in to see individual pins."}
              </div>
            </div>

          </div>
        )}

        {/* FOOTER */}`;

if (!code.includes(marker)) { console.error('ERROR: footer marker not found'); process.exit(1); }
if (code.includes('union-map')) {
  console.log('ℹ️  Map section already added');
} else {
  code = code.replace(marker, mapSection);
  console.log('✅ Added map section to home page');
}

fs.writeFileSync('src/App.jsx', code);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add interactive map to home page" && git push\n');
