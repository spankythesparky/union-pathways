// fix158.js — Add individual trade history links to the mobile drawer
//
// The mobile drawer's "History" section currently only has:
//   - General Union History
//   - Trade Histories (the picker page)
//
// This fix adds the 8 live individual trade history pages right after
// "Trade Histories" so mobile users can jump directly to any of them
// without having to go through the picker.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency: check that we haven't already added these
if (src.includes('mobile-drawer-link${page===\"history-ibew\"')) {
  console.error('ERROR: Trade history links already in mobile drawer. Aborting.');
  process.exit(1);
}

// Anchor: the History section's "Trade Histories" link
// Replace it with itself + the 8 trade-specific links
const anchorOld = `            <button className={\`mobile-drawer-link\${page===\"trade-history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"trade-history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historias de Oficios\" : lang===\"pl\" ? \"Historie Zawodow\" : \"Trade Histories\"}</button>
          </div>`;

const anchorNew = `            <button className={\`mobile-drawer-link\${page===\"trade-history\" ? \" active\" : \"\"}\`} onClick={() => { setPage(\"trade-history\"); setMobileNavOpen(false); }}>{lang===\"es\" ? \"Historias de Oficios\" : lang===\"pl\" ? \"Historie Zawodow\" : \"Trade Histories\"}</button>
            <button className={\`mobile-drawer-link\${page===\"history-ibew\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ibew\"); setMobileNavOpen(false); }}>· IBEW · Electricians</button>
            <button className={\`mobile-drawer-link\${page===\"history-ua\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ua\"); setMobileNavOpen(false); }}>· UA · Plumbers & Pipefitters</button>
            <button className={\`mobile-drawer-link\${page===\"history-smart\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-smart\"); setMobileNavOpen(false); }}>· SMART · Sheet Metal</button>
            <button className={\`mobile-drawer-link\${page===\"history-bac\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-bac\"); setMobileNavOpen(false); }}>· BAC · Bricklayers</button>
            <button className={\`mobile-drawer-link\${page===\"history-iron\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-iron\"); setMobileNavOpen(false); }}>· Iron Workers</button>
            <button className={\`mobile-drawer-link\${page===\"history-insul\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-insul\"); setMobileNavOpen(false); }}>· Insulators (HFIAW)</button>
            <button className={\`mobile-drawer-link\${page===\"history-iuec\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-iuec\"); setMobileNavOpen(false); }}>· IUEC · Elevator Constructors</button>
            <button className={\`mobile-drawer-link\${page===\"history-ufcw\" ? \" active\" : \"\"}\`} style={{paddingLeft:36, fontSize:14}} onClick={() => { setPage(\"history-ufcw\"); setMobileNavOpen(false); }}>· UFCW · Food & Commercial</button>
          </div>`;

if (!src.includes(anchorOld)) {
  console.error('ERROR: Could not find Trade Histories drawer link anchor. Aborting.');
  process.exit(1);
}
src = src.replace(anchorOld, () => anchorNew);

if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Added 8 individual trade history links to mobile drawer:');
console.log('  · IBEW · Electricians');
console.log('  · UA · Plumbers & Pipefitters');
console.log('  · SMART · Sheet Metal');
console.log('  · BAC · Bricklayers');
console.log('  · Iron Workers');
console.log('  · Insulators (HFIAW)');
console.log('  · IUEC · Elevator Constructors');
console.log('  · UFCW · Food & Commercial');
console.log('');
console.log('They appear indented under "Trade Histories" with a · prefix,');
console.log('like a sub-list, so the hierarchy reads naturally.');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: add trade history sub-links to mobile drawer" && git push');
console.log('');
