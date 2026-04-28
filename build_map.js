const fs = require('fs');

// Read the map data we just exported
const data = JSON.parse(fs.readFileSync('map_data.json', 'utf8'));

// Also extract full local details from App.jsx for popups
const code = fs.readFileSync('src/App.jsx', 'utf8');

function extractLocals(arrName) {
  const start = code.indexOf('const ' + arrName + ' = [');
  const end = code.indexOf('];', start) + 2;
  const section = code.slice(start, end);
  const locals = [];
  const regex = /\{ id: (\d+), name: "([^"]+)", city: "([^"]+)", state: "([^"]+)"(?:, phone: "([^"]*)")?(?:, website: "([^"]*)")?(?:, email: "([^"]*)")?(?:[^}]*)?lat: ([\d.-]+), lng: ([\d.-]+)/g;
  let m;
  while ((m = regex.exec(section)) !== null) {
    locals.push({
      id: m[1], name: m[2], city: m[3], state: m[4],
      phone: m[5] || '', website: m[6] || '', email: m[7] || '',
      lat: parseFloat(m[8]), lng: parseFloat(m[9])
    });
  }
  return locals;
}

const trades = [
  { key: 'IBEW_INSIDE_LOCALS', label: 'IBEW Inside', color: '#F5C518', locals: extractLocals('IBEW_INSIDE_LOCALS') },
  { key: 'IBEW_LINEMAN_LOCALS', label: 'IBEW Lineman', color: '#FFD700', locals: extractLocals('IBEW_LINEMAN_LOCALS') },
  { key: 'UA_LOCALS', label: 'UA Plumbers', color: '#3b9eff', locals: extractLocals('UA_LOCALS') },
  { key: 'BAC_LOCALS', label: 'BAC Bricklayers', color: '#f97316', locals: extractLocals('BAC_LOCALS') },
  { key: 'IW_LOCALS', label: 'Ironworkers', color: '#ef4444', locals: extractLocals('IW_LOCALS') },
];

const totalLocals = trades.reduce((sum, t) => sum + t.locals.length, 0);
console.log('Total locals with full data:', totalLocals);

// Build JS data for the HTML
const tradeDataJS = trades.map(t => ({
  key: t.key,
  label: t.label,
  color: t.color,
  locals: t.locals
}));

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
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; color: #fff; font-family: 'Inter', sans-serif; }

    .header {
      position: relative;
      z-index: 1000;
      background: rgba(0,0,0,0.95);
      border-bottom: 1px solid rgba(58,80,104,0.4);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .logo {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 22px;
      font-weight: 900;
      color: #fff;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .logo span { color: #FA8059; }

    .stats {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: rgba(160,180,196,0.6);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .stats strong { color: #FA8059; }

    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 7px 14px;
      border-radius: 50px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.6);
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn.active {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.3);
      color: #fff;
    }
    .filter-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .filter-count {
      font-size: 10px;
      opacity: 0.6;
    }

    #map {
      width: 100%;
      height: calc(100vh - 70px);
    }

    /* Custom cluster styles */
    .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
      background-clip: padding-box;
      border-radius: 50%;
    }
    .marker-cluster-small { background-color: rgba(250,128,89,0.15); }
    .marker-cluster-small div { background-color: rgba(250,128,89,0.5); }
    .marker-cluster-medium { background-color: rgba(250,128,89,0.2); }
    .marker-cluster-medium div { background-color: rgba(250,128,89,0.6); }
    .marker-cluster-large { background-color: rgba(250,128,89,0.25); }
    .marker-cluster-large div { background-color: rgba(250,128,89,0.7); }
    .marker-cluster div {
      width: 30px; height: 30px;
      margin-left: 5px; margin-top: 5px;
      text-align: center;
      border-radius: 50%;
      font: bold 12px 'Barlow Condensed', sans-serif;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Popup styles */
    .leaflet-popup-content-wrapper {
      background: #0d1b2a;
      border: 1px solid rgba(58,80,104,0.6);
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      color: #fff;
      padding: 0;
    }
    .leaflet-popup-tip { background: #0d1b2a; }
    .leaflet-popup-content { margin: 0; }

    .popup-inner {
      padding: 16px 18px;
      min-width: 220px;
    }
    .popup-trade {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .popup-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 20px;
      font-weight: 900;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    .popup-location {
      font-size: 12px;
      color: rgba(160,180,196,0.7);
      margin-bottom: 10px;
    }
    .popup-links {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .popup-link {
      font-size: 11px;
      font-weight: 600;
      padding: 5px 10px;
      border-radius: 6px;
      text-decoration: none;
      background: rgba(250,128,89,0.12);
      border: 1px solid rgba(250,128,89,0.3);
      color: #FA8059;
    }
    .popup-link.phone {
      background: rgba(34,48,61,0.6);
      border-color: rgba(58,80,104,0.4);
      color: rgba(160,180,196,0.8);
    }
  </style>
</head>
<body>

<div class="header">
  <div>
    <div class="logo">Union <span>Pathways</span></div>
    <div class="stats"><strong id="visible-count">${totalLocals}</strong> locals shown across <strong>5</strong> trades</div>
  </div>
  <div class="filters" id="filters"></div>
</div>

<div id="map"></div>

<script>
const TRADES = ${JSON.stringify(tradeDataJS, null, 2)};

// Init map
const map = L.map('map', {
  center: [39.5, -98.35],
  zoom: 4,
  minZoom: 3,
  maxZoom: 16,
  zoomControl: true,
});

// Dark tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// State: which trades are active
const activeTrades = new Set(TRADES.map(t => t.key));
const layerGroups = {};

function createIcon(color) {
  return L.divIcon({
    html: \`<div style="
      width: 12px; height: 12px;
      border-radius: 50%;
      background: \${color};
      border: 2px solid rgba(255,255,255,0.8);
      box-shadow: 0 0 8px \${color}88, 0 2px 4px rgba(0,0,0,0.5);
    "></div>\`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

let totalVisible = 0;

TRADES.forEach(trade => {
  const clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 40,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: (cluster) => {
      const count = cluster.getChildCount();
      const size = count < 10 ? 'small' : count < 50 ? 'medium' : 'large';
      return L.divIcon({
        html: \`<div style="
          width: 34px; height: 34px;
          border-radius: 50%;
          background: \${trade.color}22;
          border: 2px solid \${trade.color}88;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 900;
          color: \${trade.color};
        ">\${count}</div>\`,
        className: '',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
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
    \`, { maxWidth: 280 });

    clusterGroup.addLayer(marker);
    totalVisible++;
  });

  layerGroups[trade.key] = clusterGroup;
  map.addLayer(clusterGroup);
});

document.getElementById('visible-count').textContent = totalVisible;

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
    // Update count
    let vis = 0;
    activeTrades.forEach(k => {
      const t = TRADES.find(t => t.key === k);
      if (t) vis += t.locals.length;
    });
    document.getElementById('visible-count').textContent = vis;
  });
  filtersEl.appendChild(btn);
});
</script>
</body>
</html>`;

fs.writeFileSync('map_preview.html', html);
console.log('✅ Map preview created: map_preview.html');
console.log('Open it in your browser to see the preview!');
