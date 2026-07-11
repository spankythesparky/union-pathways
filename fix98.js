// fix98.js — State-only search returns ALL locals in state; show 50mi radius hint for ZIP/city
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// 1. Tag the state-only result with isStateSearch + the matched state abbreviation
code = replaceOnce(code,
  `    // Fallback: state name only
    const stateAbbr2 = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbr2 && STATE_CENTERS[stateAbbr2]) {
      const sc2 = STATE_CENTERS[stateAbbr2];
      return { lat: sc2.lat, lng: sc2.lng, display: q };
    }`,
  `    // Fallback: state name only — return marker so we can show ALL locals in that state
    const stateAbbr2 = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbr2 && STATE_CENTERS[stateAbbr2]) {
      const sc2 = STATE_CENTERS[stateAbbr2];
      return { lat: sc2.lat, lng: sc2.lng, display: q, isStateSearch: true, stateAbbr: stateAbbr2 };
    }`,
  '1: tag state-only result');
console.log('1/4 ✓ Tagged state-only resolveLocation result');

// 2. Move state-only check BEFORE Nominatim so it doesn't try to geocode "AZ" as an address
code = replaceOnce(code,
  `    // Check known city lookup table FIRST before Nominatim
    const qLow = q.toLowerCase();
    if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };`,
  `    // Check known city lookup table FIRST before Nominatim
    const qLow = q.toLowerCase();
    if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };

    // State-only check BEFORE Nominatim — return marker for full-state search
    const stateAbbrEarly = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbrEarly && STATE_CENTERS[stateAbbrEarly]) {
      const scEarly = STATE_CENTERS[stateAbbrEarly];
      return { lat: scEarly.lat, lng: scEarly.lng, display: q, isStateSearch: true, stateAbbr: stateAbbrEarly };
    }`,
  '2: state check before Nominatim');
console.log('2/4 ✓ Moved state-only check before Nominatim');

// 3. handleSearch: branch on isStateSearch — no radius filter for state, sorted by distance from state center
code = replaceOnce(code,
  `    setLocationLabel(loc.display);
    const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IUEC" ? IUEC_LOCALS : selectedTrade === "IUOE" ? IUOE_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
    const withDist = database
      .map(l => ({ ...l, distance: getDistanceMiles(loc.lat, loc.lng, l.lat, l.lng) }))
      .sort((a, b) => a.distance - b.distance);
    const within150 = withDist.filter(l => l.distance <= 50);
    setResults(within150);
    setLoading(false);
  };`,
  `    setLocationLabel(loc.display);
    const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IUEC" ? IUEC_LOCALS : selectedTrade === "IUOE" ? IUOE_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "IW" ? IW_LOCALS : selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
    const withDist = database
      .map(l => ({ ...l, distance: getDistanceMiles(loc.lat, loc.lng, l.lat, l.lng) }))
      .sort((a, b) => a.distance - b.distance);
    let filtered;
    if (loc.isStateSearch && loc.stateAbbr) {
      // State-only search: return ALL locals in that state, ignore radius
      filtered = withDist.filter(l => (l.state || '').toUpperCase() === loc.stateAbbr);
    } else {
      // ZIP/city/address: 50-mile radius
      filtered = withDist.filter(l => l.distance <= 50);
    }
    setSearchMode(loc.isStateSearch ? 'state' : 'radius');
    setResults(filtered);
    setLoading(false);
  };`,
  '3: handleSearch state branch');
console.log('3/4 ✓ handleSearch returns all-state for state searches');

// 4. Add searchMode state + display radius hint in results header
code = replaceOnce(code,
  `  const [showMap, setShowMap] = useState(false);`,
  `  const [showMap, setShowMap] = useState(false);
  const [searchMode, setSearchMode] = useState('radius');`,
  '4a: searchMode state');

// Update results header to show context-aware count + hint
code = replaceOnce(code,
  `              <div className="results-title"><span>{results.length}</span> {t.nearYou}</div>`,
  `              <div className="results-title">
                <span>{results.length}</span>{' '}
                {searchMode === 'state'
                  ? (lang==="es" ? "Locales en este Estado" : lang==="pl" ? "Lokali w Tym Stanie" : "Locals in This State")
                  : t.nearYou}
                {searchMode === 'radius' && results.length > 0 && (
                  <div style={{fontSize:11, fontWeight:400, color:"rgba(160,180,196,0.7)", marginTop:4, letterSpacing:0.3}}>
                    {lang==="es" ? "Mostrando locales dentro de 50 millas. Busque por estado para ver mas." : lang==="pl" ? "Pokazuje lokale w promieniu 50 mil. Szukaj po stanie aby zobaczyc wiecej." : "Showing locals within a 50-mile radius. Search by state to see more."}
                  </div>
                )}
              </div>`,
  '4b: results-title with hint');
console.log('4/4 ✓ Added searchMode state + radius hint in results header');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: state-only search returns all in-state locals + radius hint" && git push\n');
