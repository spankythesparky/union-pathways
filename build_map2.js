const fs = require('fs');

const data = JSON.parse(fs.readFileSync('map_data2.json', 'utf8'));

const trades = [
  { key: 'IBEW_INSIDE_LOCALS', label: 'IBEW Inside', color: '#F5C518', locals: data.IBEW_INSIDE_LOCALS },
  { key: 'IBEW_LINEMAN_LOCALS', label: 'IBEW Lineman', color: '#00E5FF', locals: data.IBEW_LINEMAN_LOCALS },
  { key: 'UA_LOCALS', label: 'UA Plumbers & Pipefitters', color: '#69FF47', locals: data.UA_LOCALS },
  { key: 'BAC_LOCALS', label: 'BAC Bricklayers', color: '#FF6B6B', locals: data.BAC_LOCALS },
  { key: 'IW_LOCALS', label: 'Ironworkers', color: '#FF8C00', locals: data.IW_LOCALS },
];

const totalLocals = trades.reduce((sum, t) => sum + t.locals.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Union Pathways — Interactive Trade Map</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Inter:wght@400;600&display=swap" rel="stylesheet"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#000; color:#fff; font-family:'Inter',sans-serif; height:100vh; display:flex; flex-direction:column; }

    .header {
      z-index:1000;
      background:rgba(0,0,0,0.97);
      border-bottom:1px solid rgba(58,80,104,0.5);
      padding:12px 20px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      flex-wrap:wrap;
      gap:10px;
      flex-shrink:0;
    }

    .logo {
      font-family:'Barlow Condensed',sans-serif;
      font-size:20px; font-weight:900;
      color:#fff; letter-spacing:0.05em; text-transform:uppercase;
    }
    .logo span { color:#FA8059; }

    .stats {
      font-family:'Barlow Condensed',sans-serif;
      font-size:12px; font-weight:700;
      color:rgba(160,180,196,0.5);
      letter-spacing:0.08em; text-transform:uppercase;
    }
    .stats strong { color:#FA8059; }

    .filters {
      display:flex; gap:6px; flex-wrap:wrap; align-items:center;
    }

    .filter-btn {
      display:flex; align-items:center; gap:6px;
      padding:6px 12px; border-radius:50px;
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.03);
      color:rgba(255,255,255,0.4);
      font-family:'Barlow Condensed',sans-serif;
      font-size:11px; font-weight:700;
      letter-spacing:0.08em; text-transform:uppercase;
      cursor:pointer; transition:all 0.2s;
    }
    .filter-btn.active {
      background:rgba(255,255,255,0.06);
      border-color:rgba(255,255,255,0.2);
      color:#fff;
    }
    .filter-dot {
      width:9px; height:9px; border-radius:50%; flex-shrink:0;
      transition:opacity 0.2s;
    }
    .filter-btn:not(.active) .filter-dot { opacity:0.3; }
    .filter-count { font-size:9px; opacity:0.5; }

    #map { flex:1; width:100%; }

    /* Popup */
    .leaflet-popup-content-wrapper {
      background:#0a1628;
      border:1px solid rgba(58,80,104,0.7);
      border-radius:14px;
      box-shadow:0 12px 40px rgba(0,0,0,0.7);
      color:#fff; padding:0;
    }
    .leaflet-popup-tip { background:#0a1628; }
    .leaflet-popup-content { margin:0; }
    .popup-inner { padding:14px 16px; min-width:200px; }
    .popup-trade {
      font-family:'Barlow Condensed',sans-serif;
      font-size:10px; font-weight:700;
      letter-spacing:0.12em; text-transform:uppercase;
      margin-bottom:5px;
    }
    .popup-name {
      font-family:'Barlow Condensed',sans-serif;
      font-size:19px; font-weight:900;
      color:#fff; line-height:1.1; margin-bottom:6px;
    }
    .popup-location { font-size:12px; color:rgba(160,180,196,0.6); margin-bottom:10px; }
    .popup-links { display:flex; gap:6px; flex-wrap:wrap; }
    .popup-link {
      font-size:11px; font-weight:600; padding:4px 10px;
      border-radius:6px; text-decoration:none;
      background:rgba(250,128,89,0.1);
      border:1px solid rgba(250,128,89,0.25); color:#FA8059;
    }
    .popup-link.phone {
      background:rgba(34,48,61,0.6);
      border-color:rgba(58,80,104,0.4);
      color:rgba(160,180,196,0.7);
    }

    /* Legend */
    .legend {
      position:absolute; bottom:30px; right:10px;
      z-index:1000; background:rgba(0,0,0,0.88);
      border:1px solid rgba(58,80,104,0.4);
      border-radius:12px; padding:12px 16px;
      font-family:'Barlow Condensed',sans-serif;
      min-width:180px;
    }
    .legend-title {
      font-size:10px; font-weight:700; letter-spacing:0.12em;
      text-transform:uppercase; color:rgba(160,180,196,0.5);
      margin-bottom:10px;
    }
    .legend-item {
      display:flex; align-items:center; gap:8px;
      margin-bottom:6px; font-size:13px; font-weight:700; color:#fff;
    }
    .legend-dot {
      width:10px; height:10px; border-radius:50%; flex-shrink:0;
    }
    .legend-count { margin-left:auto; font-size:11px; color:rgba(160,180,196,0.5); }
  </style>
</head>
<body>

<div class="header">
  <div>
    <div class="logo">Union <span>Pathways</span></div>
    <div class="stats"><strong id="visible-count">${totalLocals}</strong> union locals — US &amp; Canada</div>
  </div>
  <div class="filters" id="filters"></div>
</div>

<div id="map"></div>

<script>
const TRADES = ${JSON.stringify(trades, null, 2)};

const map = L.map('map', {
  center: [42, -95],
  zoom: 4,
  minZoom: 3,
  maxZoom: 16,
  zoomControl: true,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd', maxZoom: 19
}).addTo(map);

const activeTrades = new Set(TRADES.map(t => t.key));
const layerGroups = {};
let totalCounts = {};

function createIcon(color, size) {
  const s = size || 12;
  return L.divIcon({
    html: \`<div style="
      width:\${s}px;height:\${s}px;border-radius:50%;
      background:\${color};
      border:2px solid rgba(255,255,255,0.9);
      box-shadow:0 0 10px \${color}99,0 2px 6px rgba(0,0,0,0.6);
    "></div>\`,
    className:'', iconSize:[s,s], iconAnchor:[s/2,s/2], popupAnchor:[0,-s/2],
  });
}

TRADES.forEach(trade => {
  totalCounts[trade.key] = trade.locals.length;

  const cluster = L.markerClusterGroup({
    maxClusterRadius: 45,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: (c) => {
      const count = c.getChildCount();
      const size = count < 10 ? 32 : count < 50 ? 38 : 44;
      return L.divIcon({
        html: \`<div style="
          width:\${size}px;height:\${size}px;border-radius:50%;
          background:\${trade.color}18;
          border:2px solid \${trade.color}88;
          display:flex;align-items:center;justify-content:center;
          font-family:'Barlow Condensed',sans-serif;
          font-size:\${count > 99 ? 11 : 13}px;font-weight:900;
          color:\${trade.color};
          box-shadow:0 0 12px \${trade.color}33;
        ">\${count}</div>\`,
        className:'', iconSize:[size,size], iconAnchor:[size/2,size/2],
      });
    }
  });

  trade.locals.forEach(local => {
    if (!local.lat || !local.lng) return;
    const marker = L.marker([local.lat, local.lng], { icon: createIcon(trade.color) });

    const links = [];
    if (local.phone) links.push(\`<a href="tel:\${local.phone}" class="popup-link phone">\${local.phone}</a>\`);
    if (local.website) links.push(\`<a href="https://\${local.website}" target="_blank" class="popup-link">Website →</a>\`);

    marker.bindPopup(\`
      <div class="popup-inner">
        <div class="popup-trade" style="color:\${trade.color}">\${trade.label}</div>
        <div class="popup-name">\${local.name}</div>
        <div class="popup-location">\${local.city}, \${local.state}</div>
        \${links.length ? \`<div class="popup-links">\${links.join('')}</div>\` : ''}
      </div>
    \`, { maxWidth:280 });

    cluster.addLayer(marker);
  });

  layerGroups[trade.key] = cluster;
  map.addLayer(cluster);
});

// Build filter buttons
const filtersEl = document.getElementById('filters');
TRADES.forEach(trade => {
  const btn = document.createElement('button');
  btn.className = 'filter-btn active';
  btn.innerHTML = \`
    <span class="filter-dot" style="background:\${trade.color}"></span>
    \${trade.label}
    <span class="filter-count">(\${trade.locals.length})</span>
  \`;
  btn.addEventListener('click', () => {
    if (activeTrades.has(trade.key)) {
      activeTrades.delete(trade.key);
      map.removeLayer(layerGroups[trade.key]);
      btn.classList.remove('active');
    } else {
      activeTrades.add(trade.key);
      map.addLayer(layerGroups[trade.key]);
      btn.classList.add('active');
    }
    let vis = 0;
    activeTrades.forEach(k => { vis += totalCounts[k] || 0; });
    document.getElementById('visible-count').textContent = vis;
  });
  filtersEl.appendChild(btn);
});

// Legend
const legend = document.createElement('div');
legend.className = 'legend';
legend.innerHTML = \`
  <div class="legend-title">Union Trades</div>
  \${TRADES.map(t => \`
    <div class="legend-item">
      <span class="legend-dot" style="background:\${t.color}"></span>
      \${t.label}
      <span class="legend-count">\${t.locals.length}</span>
    </div>
  \`).join('')}
\`;
document.getElementById('map').appendChild(legend);
</script>
</body>
</html>`;

fs.writeFileSync('map_preview.html', html);
console.log('✅ Map preview created: map_preview.html');
console.log(`Total locals: ${totalLocals}`);
console.log('Run: open map_preview.html');
