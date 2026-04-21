const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD CSS FOR TRADE SELECTOR ───────────────────────────────────────────
const cssMarker = `        .search-card {`;
const tradeSelectorCss = `        .trade-selector {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
          margin-bottom: 20px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .trade-selector::-webkit-scrollbar { display: none; }
        .trade-pill {
          flex-shrink: 0;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 6px 14px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .trade-pill:hover {
          border-color: rgba(255,255,255,0.25);
          color: #fff;
        }
        .trade-pill.selected {
          color: #000;
          border-color: transparent;
        }

`;

if (!code.includes(tradeSelectorCss)) {
  code = code.replace(cssMarker, tradeSelectorCss + cssMarker);
  console.log('✅ Added trade selector CSS');
} else {
  console.log('ℹ️  CSS already exists');
}

// ─── 2. ADD TRADE SELECTOR JSX INSIDE SEARCH CARD ────────────────────────────
const oldSearchCard = `            {/* SEARCH CARD */}
            <div className="search-card">
              <span className="search-label">`;

const newSearchCard = `            {/* SEARCH CARD */}
            <div className="search-card">
              {/* INLINE TRADE SELECTOR */}
              <div className="trade-selector">
                {[
                  { abbr: "IBEW_I", label: "IBEW Inside",   color: "#F5C518" },
                  { abbr: "IBEW_L", label: "IBEW Lineman",  color: "#FFD700" },
                  { abbr: "UA",     label: "Plumbers & Pipefitters", color: "#3b9eff" },
                  { abbr: "SMART",  label: "Sheet Metal",   color: "#e05a2b" },
                  { abbr: "UBC",    label: "Carpenters",    color: "#a78bfa" },
                  { abbr: "BAC",    label: "Bricklayers",   color: "#f97316" },
                  { abbr: "IW",     label: "Ironworkers",   color: "#ef4444" },
                  { abbr: "LIUNA",  label: "Laborers",      color: "#fb923c" },
                  { abbr: "HFIAW",  label: "Insulators",    color: "#38bdf8" },
                ].map(trade => (
                  <button
                    key={trade.abbr}
                    className={\`trade-pill \${selectedTrade === trade.abbr ? "selected" : ""}\`}
                    style={selectedTrade === trade.abbr ? { background: trade.color, borderColor: trade.color, color: "#000" } : {}}
                    onClick={() => setSelectedTrade(trade.abbr)}
                  >
                    {trade.label}
                  </button>
                ))}
              </div>
              <span className="search-label">`;

if (!code.includes(oldSearchCard)) { console.error('ERROR: search card marker not found'); process.exit(1); }
code = code.replace(oldSearchCard, newSearchCard);
console.log('✅ Added inline trade selector to search card');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add inline trade selector pills to search card" && git push\n');
