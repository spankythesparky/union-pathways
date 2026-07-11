// fix177.js — Wire IUPAT into the site
//
// What this does:
//   1. Flips IUPAT in UNION_TRADES from `status: "coming"` to `status: "active"`
//      and assigns it a distinctive color (#ec4899 — fuchsia for painters).
//
//   2. Inserts a new const IUPAT_LOCALS = [...] array (263 locals) immediately
//      AFTER the existing const UBC_LOCALS = [...] array. The array's data is
//      kept in a sibling file `iupat_locals.js` so this fix script stays
//      focused on edit logic.
//
//   3. Updates two `database = selectedTrade === ...` ternaries (the "Find a
//      Local" search and the trades grid) to include IUPAT.
//
//   4. Updates `ALL_LOCALS` (used by global search) to include IUPAT_LOCALS.
//
//   5. Adds an `iupatLabel` translation key to all 3 language packs (en/es/pl).
//
//   6. Updates the trades-page header label ternary to use the new label.
//
//   7. Adds IUPAT to the JOB_TRADES array (job board page).
//
//   8. Adds IUPAT to the WAGE_TRADES array (wages page).
//
//   9. Adds an optional `tradeType` chip to the local-card render so IUPAT
//      locals display their painter/glazier/etc. specialty when present.
//      The chip only renders when `local.tradeType` is non-empty, so existing
//      locals without that field render unchanged.
//
// Reads:
//   - src/App.jsx (in current working dir)
//   - iupat_locals.js (must sit next to fix177.js — contains the array)
//
// Writes:
//   - src/App.jsx (in place)
//
// Idempotency:
//   - Detects `const IUPAT_LOCALS = [` and exits if already present.

const fs = require('fs');
const FILE = 'src/App.jsx';
const LOCALS_FILE = 'iupat_locals.js';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found. Run from project root.');
  process.exit(1);
}
if (!fs.existsSync(LOCALS_FILE)) {
  console.error('ERROR: iupat_locals.js not found in current dir. Place it next to fix177.js.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const iupatArrayCode = fs.readFileSync(LOCALS_FILE, 'utf8').trim();

// ----------------------------------------------------------------------------
// Idempotency check
// ----------------------------------------------------------------------------
if (src.includes('const IUPAT_LOCALS = [')) {
  console.log('Already applied — IUPAT integration is already in place.');
  process.exit(0);
}

// ============================================================================
// EDIT 1 — Flip IUPAT in UNION_TRADES to active + color
// ============================================================================
const oldIupatTrade = `      { abbr: "IUPAT", name: "Painters & Allied Trades", full: "Int'l Union of Painters & Allied Trades", website: "www.iupat.org", status: "coming" },`;
const newIupatTrade = `      { abbr: "IUPAT", name: "Painters & Allied Trades", full: "Int'l Union of Painters & Allied Trades", website: "www.iupat.org", status: "active", color: "#ec4899" },`;
if (!src.includes(oldIupatTrade)) {
  console.error('ERROR: could not find IUPAT row in UNION_TRADES');
  process.exit(1);
}
src = src.replace(oldIupatTrade, newIupatTrade);

// ============================================================================
// EDIT 2 — Insert IUPAT_LOCALS array after UBC_LOCALS
// ============================================================================
// UBC_LOCALS array ends right before `const STATE_CENTERS = {`. We insert
// IUPAT_LOCALS between them.
const ubcEndAnchor = '\nconst STATE_CENTERS = {';
if (!src.includes(ubcEndAnchor)) {
  console.error('ERROR: could not find STATE_CENTERS anchor');
  process.exit(1);
}
src = src.replace(ubcEndAnchor, '\n' + iupatArrayCode + '\n' + ubcEndAnchor);

// ============================================================================
// EDIT 3 — Add IUPAT to the two `database = selectedTrade === ...` ternaries
// ============================================================================
// Both ternaries follow the same pattern. We insert `selectedTrade === "IUPAT" ? IUPAT_LOCALS : ` right before `selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS`.
// This makes IUPAT a recognized branch.
const dbOldFragment1 = `selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS`;
const dbNewFragment1 = `selectedTrade === "LIUNA" ? LIUNA_LOCALS : selectedTrade === "IUPAT" ? IUPAT_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS`;
const occurrences = (src.match(new RegExp(dbOldFragment1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
if (occurrences === 0) {
  console.error('ERROR: could not find database ternary anchor');
  process.exit(1);
}
// Replace ALL occurrences (there are 2 — find a local and trades grid)
src = src.split(dbOldFragment1).join(dbNewFragment1);
console.log('  Replaced', occurrences, 'instance(s) of database ternary');

// ============================================================================
// EDIT 4 — ALL_LOCALS includes IUPAT_LOCALS
// ============================================================================
const allLocalsOld = `const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...IUOE_LOCALS, ...UBC_LOCALS];`;
const allLocalsNew = `const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS, ...HFIAW_LOCALS, ...IUEC_LOCALS, ...IUOE_LOCALS, ...UBC_LOCALS, ...IUPAT_LOCALS];`;
if (!src.includes(allLocalsOld)) {
  console.error('ERROR: could not find ALL_LOCALS anchor');
  process.exit(1);
}
src = src.replace(allLocalsOld, allLocalsNew);

// ============================================================================
// EDIT 5 — Add iupatLabel to all 3 language packs
// ============================================================================
// Note: Polish uses the SAME English HFIAW string ("🔥 Insulators —") so we
// can't distinguish English from Polish by anchor text. Strategy: do a global
// replace on the English text (catches both English and Polish) plus a single
// Spanish-specific replace.
const labelGlobalAnchor = `      hfiawLabel: "🔥 Insulators —",`;
const labelGlobalNew = `      hfiawLabel: "🔥 Insulators —",\n      iupatLabel: "🎨 IUPAT Painters & Allied Trades —",`;
const globalCount = src.split(labelGlobalAnchor).length - 1;
src = src.split(labelGlobalAnchor).join(labelGlobalNew);
console.log('  Inserted iupatLabel into', globalCount, 'pack(s) using English HFIAW anchor');

const labelSpanishOld = `      hfiawLabel: "🔥 Aisladores —",`;
const labelSpanishNew = `      hfiawLabel: "🔥 Aisladores —",\n      iupatLabel: "🎨 IUPAT Pintores y Oficios Aliados —",`;
if (src.includes(labelSpanishOld)) {
  src = src.replace(labelSpanishOld, labelSpanishNew);
  console.log('  Inserted iupatLabel into Spanish pack');
}

// ============================================================================
// EDIT 6 — Update the trades-page header label ternary to handle IUPAT
// ============================================================================
const headerLabelOld = `selectedTrade === "HFIAW" ? t.hfiawLabel : selectedTrade === "SF" ? t.sfLabel : t.ibewLabel`;
const headerLabelNew = `selectedTrade === "HFIAW" ? t.hfiawLabel : selectedTrade === "IUPAT" ? t.iupatLabel : selectedTrade === "SF" ? t.sfLabel : t.ibewLabel`;
if (!src.includes(headerLabelOld)) {
  console.error('ERROR: could not find header label ternary anchor');
  process.exit(1);
}
src = src.replace(headerLabelOld, headerLabelNew);

// ============================================================================
// EDIT 7 — Add IUPAT to JOB_TRADES (job board page)
// ============================================================================
const jobTradesOld = `            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
          ];

          const selectedTradeLocals = JOB_TRADES.find(t => t.key === jobTrade)?.locals || [];`;
const jobTradesNew = `            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
            { key: 'IUPAT', label: 'IUPAT Painters & Allied Trades', locals: IUPAT_LOCALS },
          ];

          const selectedTradeLocals = JOB_TRADES.find(t => t.key === jobTrade)?.locals || [];`;
if (!src.includes(jobTradesOld)) {
  console.error('ERROR: could not find JOB_TRADES anchor');
  process.exit(1);
}
src = src.replace(jobTradesOld, jobTradesNew);

// ============================================================================
// EDIT 8 — Add IUPAT to WAGE_TRADES (wages page)
// ============================================================================
const wageTradesOld = `            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
          ];
          const isIBEW = wageTrade === 'IBEW_I' || wageTrade === 'IBEW_L';`;
const wageTradesNew = `            { key: 'UBC', label: 'UBC Carpenters', locals: UBC_LOCALS },
            { key: 'IUPAT', label: 'IUPAT Painters & Allied Trades', locals: IUPAT_LOCALS },
          ];
          const isIBEW = wageTrade === 'IBEW_I' || wageTrade === 'IBEW_L';`;
if (!src.includes(wageTradesOld)) {
  console.error('ERROR: could not find WAGE_TRADES anchor');
  process.exit(1);
}
src = src.replace(wageTradesOld, wageTradesNew);

// ============================================================================
// EDIT 9 — Add tradeType chip to local-card render
// ============================================================================
// Insert a new line BELOW <div className="card-location"> that conditionally
// renders the tradeType. This appears for IUPAT locals (they're the only ones
// with the field set) and is a no-op for every other local.
const cardLocOld = `                  <div className="card-location">{local.city}, {local.state}</div>
                  <div className="card-info">`;
const cardLocNew = `                  <div className="card-location">{local.city}, {local.state}</div>
                  {local.tradeType && (
                    <div style={{display:"inline-block", marginTop:6, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"#ec4899", background:"rgba(236,72,153,0.08)", border:"1px solid rgba(236,72,153,0.3)", borderRadius:50, padding:"3px 10px"}}>{local.tradeType}</div>
                  )}
                  <div className="card-info">`;
if (!src.includes(cardLocOld)) {
  console.error('ERROR: could not find local-card location anchor');
  process.exit(1);
}
src = src.replace(cardLocOld, cardLocNew);

// ============================================================================
// WRITE
// ============================================================================
fs.writeFileSync(FILE, src);

console.log('');
console.log('  ✓ src/App.jsx updated');
console.log('');
console.log('Changes applied:');
console.log('  - IUPAT flipped to active in UNION_TRADES (color: #ec4899)');
console.log('  - Inserted IUPAT_LOCALS array (263 locals)');
console.log('  - Updated database ternary in 2 places');
console.log('  - Added IUPAT to ALL_LOCALS (global search)');
console.log('  - Added iupatLabel translations (en/es/pl)');
console.log('  - Updated header label ternary');
console.log('  - Added IUPAT to JOB_TRADES (job board)');
console.log('  - Added IUPAT to WAGE_TRADES (wages page)');
console.log('  - Added tradeType chip to local card');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add IUPAT — 263 locals, trades directory, map, wages, job board" && git push');
console.log('');
