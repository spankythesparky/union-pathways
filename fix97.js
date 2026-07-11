// fix97.js — Make location search accept "City, ST", "City State", "City, State" formats
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

// Replace the city/state lookup section in resolveLocation with a smarter parser
const oldBlock = `    // Check known city lookup table FIRST before Nominatim
    const qLow = q.toLowerCase();
    if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };`;

const newBlock = `    // Check known city lookup table FIRST before Nominatim
    const qLow = q.toLowerCase();
    if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };

    // Try parsing "City, State" / "City State" / "City, ST" / "City ST" / "City, ST 12345"
    // Strip any trailing 5-digit ZIP first
    const qNoZip = qLow.replace(/\\b\\d{5}(?:-\\d{4})?\\b\\s*$/, '').trim();
    // Split on comma if present, else on last whitespace
    let cityPart = null;
    let statePart = null;
    if (qNoZip.includes(',')) {
      const parts = qNoZip.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        cityPart = parts[0];
        statePart = parts.slice(1).join(' ').trim();
      }
    } else {
      // No comma — try matching trailing 2-letter state abbrev or full state name
      const tokens = qNoZip.split(/\\s+/);
      if (tokens.length >= 2) {
        // Try last 1, 2, or 3 tokens as state (handles "new york", "north carolina", etc.)
        for (let take = 3; take >= 1; take--) {
          if (tokens.length <= take) continue;
          const tail = tokens.slice(-take).join(' ');
          if (STATE_NAMES[tail] || STATE_CENTERS[tail.toUpperCase()]) {
            cityPart = tokens.slice(0, tokens.length - take).join(' ');
            statePart = tail;
            break;
          }
        }
      }
    }
    if (cityPart && statePart) {
      // Normalize state to abbreviation
      const stateAbbr = STATE_NAMES[statePart] || (STATE_CENTERS[statePart.toUpperCase()] ? statePart.toUpperCase() : null);
      // First: try full key like "phoenix az" or "phoenix arizona" in CITY_COORDS as-is
      if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };
      // Then: try just the city portion
      if (CITY_COORDS[cityPart]) {
        const [clat, clng] = CITY_COORDS[cityPart];
        const stateLabel = stateAbbr || statePart.toUpperCase();
        return { lat: clat, lng: clng, display: cityPart.replace(/\\b\\w/g, c => c.toUpperCase()) + (stateAbbr ? ', ' + stateAbbr : '') };
      }
      // Then: search local databases for matching city in matching state
      if (stateAbbr) {
        const ALL2 = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...LIUNA_LOCALS];
        const hit = ALL2.find(l => l.city.toLowerCase() === cityPart && l.state.toUpperCase() === stateAbbr)
          || ALL2.find(l => l.city.toLowerCase().includes(cityPart) && l.state.toUpperCase() === stateAbbr);
        if (hit) return { lat: hit.lat, lng: hit.lng, display: hit.city + ', ' + hit.state };
      }
    }`;

code = replaceOnce(code, oldBlock, newBlock, 'resolveLocation city/state parser');
console.log('1/1 ✓ Added smart city+state parser to location search');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: search supports City State / City, ST / City Statename formats" && git push\n');
