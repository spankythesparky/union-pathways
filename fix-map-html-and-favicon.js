// fix-map-html-and-favicon.js
//
// Updates public/map.html to use the light corporate theme.
// Also updates the favicon reference in index.html to include apple-touch-icon.
//
// The favicon PNG files themselves need to be dropped into public/ separately —
// this fix ONLY updates the HTML/JSX. The user must manually place the favicon files.

const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
// 1. UPDATE public/map.html — swap dark styles to light
// ═══════════════════════════════════════════════════════════════
const MAP_FILE = 'public/map.html';

if (!fs.existsSync(MAP_FILE)) {
  console.error('ERROR: public/map.html not found.');
  process.exit(1);
}

let map = fs.readFileSync(MAP_FILE, 'utf8');
const mapOriginal = map;

if (map.includes('/* MAP V4 CORPORATE */')) {
  console.error('ERROR: map.html already updated. Aborting.');
  process.exit(1);
}

// Replace the entire <style> block — everything from <style> to </style>
const styleOld = `  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#000; color:#fff; font-family:'Inter',sans-serif; height:100vh; display:flex; flex-direction:column; }
    .header {
      z-index:1000; background:rgba(0,0,0,0.97);
      border-bottom:1px solid rgba(58,80,104,0.5);
      padding:12px 20px; display:flex; align-items:center;
      justify-content:space-between; flex-wrap:wrap; gap:10px; flex-shrink:0;
    }
    .logo { font-family:'Barlow Condensed',sans-serif; font-size:20px; font-weight:900; color:#fff; letter-spacing:0.05em; text-transform:uppercase; }
    .logo span { color:#FA8059; }
    .stats { font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700; color:rgba(160,180,196,0.5); letter-spacing:0.08em; text-transform:uppercase; }
    .stats strong { color:#FA8059; }
    .filters { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
    .filter-btn {
      display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:50px;
      border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.03);
      color:rgba(255,255,255,0.4); font-family:'Barlow Condensed',sans-serif;
      font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
      cursor:pointer; transition:all 0.2s;
    }
    .filter-btn.active { background:rgba(255,255,255,0.07); border-color:rgba(255,255,255,0.25); color:#fff; }
    .filter-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; transition:opacity 0.2s; }
    .filter-btn:not(.active) .filter-dot { opacity:0.25; }
    .filter-count { font-size:9px; opacity:0.5; }
    #map { flex:1; width:100%; }
    .leaflet-popup-content-wrapper {
      background:#0a1628; border:1px solid rgba(58,80,104,0.7);
      border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,0.7); color:#fff; padding:0;
    }
    .leaflet-popup-tip { background:#0a1628; }
    .leaflet-popup-content { margin:0; }
    .popup-inner { padding:14px 16px; min-width:200px; }
    .popup-trade { font-family:'Barlow Condensed',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:5px; }
    .popup-name { font-family:'Barlow Condensed',sans-serif; font-size:19px; font-weight:900; color:#fff; line-height:1.1; margin-bottom:6px; }
    .popup-location { font-size:12px; color:rgba(160,180,196,0.6); margin-bottom:10px; }
    .popup-links { display:flex; gap:6px; flex-wrap:wrap; }
    .popup-link { font-size:11px; font-weight:600; padding:4px 10px; border-radius:6px; text-decoration:none; background:rgba(250,128,89,0.1); border:1px solid rgba(250,128,89,0.25); color:#FA8059; }
    .popup-link.phone { background:rgba(34,48,61,0.6); border-color:rgba(58,80,104,0.4); color:rgba(160,180,196,0.7); }
    .legend {
      position:absolute; bottom:30px; right:10px; z-index:1000;
      background:rgba(0,0,0,0.88); border:1px solid rgba(58,80,104,0.4);
      border-radius:12px; padding:12px 16px; font-family:'Barlow Condensed',sans-serif; min-width:200px;
    }
    .legend-title { font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:rgba(160,180,196,0.5); margin-bottom:10px; }
    .legend-item { display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:13px; font-weight:700; color:#fff; }
    .legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .legend-count { margin-left:auto; font-size:11px; color:rgba(160,180,196,0.5); }
    .hint { position:absolute; bottom:30px; left:10px; z-index:1000; background:rgba(0,0,0,0.7); border:1px solid rgba(58,80,104,0.3); border-radius:8px; padding:8px 12px; font-size:11px; color:rgba(160,180,196,0.6); font-family:'Barlow Condensed',sans-serif; letter-spacing:0.05em; }
  </style>`;

const styleNew = `  <style>
    /* MAP V4 CORPORATE */
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#ffffff; color:#072554; font-family:'Inter',sans-serif; height:100vh; display:flex; flex-direction:column; }
    .header {
      z-index:1000; background:#ffffff;
      border-bottom:1px solid rgba(7,37,84,0.08);
      padding:14px 20px; display:flex; align-items:center;
      justify-content:space-between; flex-wrap:wrap; gap:10px; flex-shrink:0;
      box-shadow:0 1px 3px rgba(7,37,84,0.03);
    }
    .logo { font-family:'Inter',sans-serif; font-size:16px; font-weight:700; color:#072554; letter-spacing:-0.01em; }
    .logo span { color:#FF6B00; font-weight:800; }
    .stats { font-family:'Inter',sans-serif; font-size:12px; font-weight:500; color:#5A6478; letter-spacing:0.02em; }
    .stats strong { color:#072554; font-weight:700; }
    .filters { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
    .filter-btn {
      display:flex; align-items:center; gap:6px; padding:6px 12px; border-radius:50px;
      border:1px solid rgba(7,37,84,0.10); background:#ffffff;
      color:#5A6478; font-family:'Inter',sans-serif;
      font-size:12px; font-weight:500; letter-spacing:0.01em;
      cursor:pointer; transition:all 0.2s;
    }
    .filter-btn:hover { border-color:rgba(7,37,84,0.25); color:#072554; }
    .filter-btn.active { background:#072554; border-color:#072554; color:#ffffff; font-weight:600; }
    .filter-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; transition:opacity 0.2s; }
    .filter-btn:not(.active) .filter-dot { opacity:0.5; }
    .filter-count { font-size:10px; opacity:0.7; }
    #map { flex:1; width:100%; background:#F5F3EE; }
    .leaflet-popup-content-wrapper {
      background:#ffffff; border:1px solid rgba(7,37,84,0.10);
      border-radius:12px; box-shadow:0 8px 24px rgba(7,37,84,0.12); color:#072554; padding:0;
    }
    .leaflet-popup-tip { background:#ffffff; box-shadow:0 4px 8px rgba(7,37,84,0.06); }
    .leaflet-popup-content { margin:0; }
    .popup-inner { padding:14px 16px; min-width:200px; }
    .popup-trade { font-family:'Inter',sans-serif; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:6px; }
    .popup-name { font-family:'Inter',sans-serif; font-size:17px; font-weight:700; color:#072554; line-height:1.15; margin-bottom:6px; letter-spacing:-0.01em; }
    .popup-location { font-size:13px; color:#5A6478; margin-bottom:12px; }
    .popup-links { display:flex; gap:6px; flex-wrap:wrap; }
    .popup-link { font-size:11px; font-weight:600; padding:5px 12px; border-radius:6px; text-decoration:none; background:#FF6B00; color:#ffffff; }
    .popup-link:hover { background:#d95a00; }
    .popup-link.phone { background:#ffffff; border:1px solid rgba(7,37,84,0.15); color:#072554; }
    .legend {
      position:absolute; bottom:30px; right:10px; z-index:1000;
      background:#ffffff; border:1px solid rgba(7,37,84,0.10);
      border-radius:12px; padding:14px 18px; font-family:'Inter',sans-serif; min-width:200px;
      box-shadow:0 4px 16px rgba(7,37,84,0.08);
    }
    .legend-title { font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:#5A6478; margin-bottom:10px; }
    .legend-item { display:flex; align-items:center; gap:8px; margin-bottom:6px; font-size:13px; font-weight:500; color:#072554; }
    .legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .legend-count { margin-left:auto; font-size:11px; color:#5A6478; font-weight:400; }
    .hint { position:absolute; bottom:30px; left:10px; z-index:1000; background:#ffffff; border:1px solid rgba(7,37,84,0.10); border-radius:8px; padding:8px 12px; font-size:11px; color:#5A6478; font-family:'Inter',sans-serif; letter-spacing:0.01em; box-shadow:0 2px 8px rgba(7,37,84,0.04); }
  </style>`;

if (!map.includes(styleOld)) {
  console.error('ERROR: Could not find map.html style block. File may already be modified.');
  process.exit(1);
}
map = map.replace(styleOld, () => styleNew);

if (map === mapOriginal) {
  console.error('ERROR: map.html not changed.');
  process.exit(1);
}

fs.writeFileSync(MAP_FILE, map);

// ═══════════════════════════════════════════════════════════════
// 2. UPDATE index.html — add apple-touch-icon reference
// ═══════════════════════════════════════════════════════════════
const INDEX = 'index.html';
if (!fs.existsSync(INDEX)) {
  console.error('WARN: index.html not found — skipping apple-touch-icon addition.');
} else {
  let idx = fs.readFileSync(INDEX, 'utf8');
  if (!idx.includes('apple-touch-icon')) {
    const shortcutOld = `    <link rel="shortcut icon" href="/favicon-32x32.png" />`;
    const shortcutNew = `    <link rel="shortcut icon" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`;
    if (idx.includes(shortcutOld)) {
      idx = idx.replace(shortcutOld, () => shortcutNew);
      fs.writeFileSync(INDEX, idx);
      console.log('  - index.html: added apple-touch-icon reference');
    }
  }
}

console.log('');
console.log('Done. Map.html + favicon reference updated:');
console.log('  - Map background: black → white');
console.log('  - Map header: white with subtle shadow');
console.log('  - Logo font: Barlow Condensed → Inter');
console.log('  - Filter buttons: light theme, navy active state');
console.log('  - Marker popups: white with navy text, orange CTAs');
console.log('  - Legend: white card with soft shadow');
console.log('  - Text hint: white pill');
console.log('');
console.log('IMPORTANT — you also need to replace the favicon files manually.');
console.log('  Download the three files from the /favicons folder and put them in public/:');
console.log('    - favicon-32x32.png');
console.log('    - favicon-16x16.png');
console.log('    - apple-touch-icon.png');
console.log('');
console.log('Now run:');
console.log('  git add public/map.html index.html public/favicon-32x32.png public/favicon-16x16.png public/apple-touch-icon.png && git commit -m "feat: light theme map + new favicons" && git push');
console.log('');
