const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. NOTICE BANNER ────────────────────────────────────────────────────────
const oldHeroSub = '            <p className="hero-sub">{t.heroSub}</p>\n\n            {/* SEARCH CARD */}';
const newHeroSub = '            <p className="hero-sub">{t.heroSub}</p>\n\n            {/* NOTICE BANNER */}\n            <div style={{\n              display: "inline-flex", alignItems: "center", gap: 8,\n              background: "rgba(250,128,89,0.1)",\n              border: "1px solid rgba(250,128,89,0.25)",\n              borderRadius: 50, padding: "8px 18px",\n              marginBottom: 24, fontSize: 13, color: "var(--muted)"\n            }}>\n              <span style={{color: "#FA8059", fontSize: 16}}>🔄</span>\n              {lang === "es"\n                ? "Locales sindicales se agregan y actualizan continuamente."\n                : lang === "pl"\n                ? "Oddziały są stale dodawane i aktualizowane. Dziękujemy!"\n                : "Union locals are continuously being added & updated — thank you for your patience!"}\n            </div>\n\n            {/* SEARCH CARD */}';

if (!code.includes('            <p className="hero-sub">{t.heroSub}</p>')) {
  console.error('ERROR: hero-sub not found');
  process.exit(1);
}
code = code.replace('            <p className="hero-sub">{t.heroSub}</p>\n\n            {/* SEARCH CARD */}', newHeroSub);
console.log('✅ Notice banner added');

// ─── 2. SEO — update document title dynamically ──────────────────────────────
// Add a useEffect for SEO after the existing useEffects
const seoEffect = `
  useEffect(() => {
    document.title = lang === "es"
      ? "Union Pathways — Encuentra tu Local Sindical más Cercano"
      : lang === "pl"
      ? "Union Pathways — Znajdź Najbliższy Lokalny Związek"
      : "Union Pathways — Find Your Nearest Union Construction Local";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = "Find your nearest union construction local — IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators, Laborers and more. Free resource for tradespeople.";
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); ogTitle.setAttribute('property','og:title'); document.head.appendChild(ogTitle); }
    ogTitle.content = "Union Pathways — Find Your Nearest Union Local";
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); ogDesc.setAttribute('property','og:description'); document.head.appendChild(ogDesc); }
    ogDesc.content = "Free tool to find union construction locals near you. IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators and more.";
    let canon = document.querySelector('link[rel="canonical"]');
    if (!canon) { canon = document.createElement('link'); canon.rel = "canonical"; document.head.appendChild(canon); }
    canon.href = "https://unionpathways.com";
  }, [lang]);

`;

const useEffectMarker = '  useEffect(() => {\n    const handleClickOutside';
if (code.includes(useEffectMarker)) {
  code = code.replace(useEffectMarker, seoEffect + '  useEffect(() => {\n    const handleClickOutside');
  console.log('✅ SEO useEffect added');
} else {
  console.warn('WARNING: useEffect marker not found for SEO');
}

// ─── 3. MAP STATE ─────────────────────────────────────────────────────────────
const mapState = '  const [showMap, setShowMap] = useState(false);\n  const mapRef = React.useRef(null);\n';
const geoMarker = '  const [geoLoading, setGeoLoading] = useState(false);';
if (code.includes(geoMarker)) {
  code = code.replace(geoMarker, geoMarker + '\n' + mapState);
  console.log('✅ Map state added');
} else {
  console.warn('WARNING: geoLoading marker not found');
}

// ─── 4. MAP CSS ───────────────────────────────────────────────────────────────
const mapCss = `
        .map-toggle-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(250,128,89,0.08);
          border: 1px solid rgba(250,128,89,0.25);
          border-radius: 50px; padding: 7px 16px;
          color: var(--muted); font-size: 13px; font-weight: 700;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
        }
        .map-toggle-btn:hover, .map-toggle-btn.active {
          border-color: #FA8059; color: #FA8059;
          background: rgba(250,128,89,0.15);
        }
        .map-container {
          width: 100%; height: 420px; border-radius: 16px;
          overflow: hidden; margin-bottom: 24px;
          border: 1px solid rgba(250,128,89,0.2);
        }
`;

const cssMarker = '        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }';
if (code.includes(cssMarker)) {
  code = code.replace(cssMarker, mapCss + cssMarker);
  console.log('✅ Map CSS added');
} else {
  console.warn('WARNING: CSS marker not found');
}

// ─── 5. MAP TOGGLE BUTTON in results header ───────────────────────────────────
const oldResultsLoc = '              <div className="results-location">\uD83D\uDCCD {locationLabel}</div>';
const newResultsLoc = '              <div style={{display:"flex",alignItems:"center",gap:10}}>\n                <div className="results-location">\uD83D\uDCCD {locationLabel}</div>\n                <button\n                  className={"map-toggle-btn" + (showMap ? " active" : "")}\n                  onClick={() => setShowMap(v => !v)}\n                >\n                  {showMap ? "\uD83D\uDDBA\uFE0F List" : "\uD83D\uDDFA\uFE0F Map"}\n                </button>\n              </div>';

if (code.includes(oldResultsLoc)) {
  code = code.replace(oldResultsLoc, newResultsLoc);
  console.log('✅ Map toggle button added');
} else {
  console.warn('WARNING: results location marker not found');
}

// ─── 6. MAP DISPLAY — Leaflet via CDN ────────────────────────────────────────
const mapUseEffect = `
  useEffect(() => {
    if (!showMap || !results || results.length === 0) return;
    const initMap = () => {
      const L = window.L;
      if (!L || !document.getElementById('union-map')) return;
      if (window._unionMap) { window._unionMap.remove(); window._unionMap = null; }
      const map = L.map('union-map');
      window._unionMap = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://carto.com/">CARTO</a>', maxZoom: 18
      }).addTo(map);
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:14px;height:14px;background:#FA8059;border-radius:50%;border:2px solid white;box-shadow:0 0 10px rgba(250,128,89,0.9);"></div>',
        iconSize: [14,14], iconAnchor: [7,7]
      });
      const markers = results.map(local => {
        const m = L.marker([local.lat, local.lng], {icon}).addTo(map);
        m.bindPopup('<b>' + local.name + '</b><br/>' + local.city + ', ' + local.state + (local.phone ? '<br/>' + local.phone : '') + (local.address ? '<br/><small>' + local.address + '</small>' : ''));
        return m;
      });
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.3));
      }
    };
    if (window.L) {
      setTimeout(initMap, 100);
    } else {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setTimeout(initMap, 100);
      document.head.appendChild(script);
    }
    return () => {
      if (window._unionMap) { window._unionMap.remove(); window._unionMap = null; }
    };
  }, [showMap, results]);

`;

const mapMarker = '  const handleSearch = async (searchQuery) => {';
if (code.includes(mapMarker)) {
  code = code.replace(mapMarker, mapUseEffect + mapMarker);
  console.log('✅ Map useEffect added');
} else {
  console.warn('WARNING: handleSearch marker not found for map useEffect');
}

// ─── 7. MAP JSX — show map div before local cards ────────────────────────────
const oldLocalMap = '            {results.map((local, i) => (';
const newLocalMap = '            {showMap && (\n              <div id="union-map" className="map-container" />\n            )}\n            {!showMap && results.map((local, i) => (';

if (code.includes(oldLocalMap)) {
  code = code.replace(oldLocalMap, newLocalMap);
  // Also fix the closing - find the results.map closing and conditionally close
  console.log('✅ Map JSX added');
} else {
  console.warn('WARNING: results.map marker not found');
}

// Fix closing paren for the conditional list
const oldMapClose = '            ))}\n\n          </div>\n        )}\n\n        {/* CAREERS';
const newMapClose = '            ))}\n            }\n\n          </div>\n        )}\n\n        {/* CAREERS';
if (code.includes(oldMapClose)) {
  code = code.replace(oldMapClose, newMapClose);
  console.log('✅ Map JSX closing fixed');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: notice banner, SEO meta, map view" && git push\n');
