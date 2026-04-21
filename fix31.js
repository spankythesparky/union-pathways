const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. FIX FALLBACK — show empty results instead of 5 closest globally ──────
// This prevents showing random far-away locals when nothing is within 50 miles
code = code.split(
  'const within150 = withDist.filter(l => l.distance <= 50);\n    setResults(within150.length > 0 ? within150 : withDist.slice(0, 5));'
).join(
  'const within50 = withDist.filter(l => l.distance <= 50);\n    setResults(within50);'
);

code = code.split(
  'const within150 = withDist.filter(l => l.distance <= 50);\n        setResults(within150.length > 0 ? within150 : withDist.slice(0, 5));'
).join(
  'const within50 = withDist.filter(l => l.distance <= 50);\n        setResults(within50);'
);

console.log('✅ Fixed geofencing fallback — no more random far-away results');

// ─── 2. REMOVE Find Your Union Local buttons from History and Retirement ──────
// Remove from history page
code = code.replace(
  `              <div style={{textAlign:"center", marginTop:48}}>
                <button className="btn-primary" onClick={() => { setPage("home"); setSelectedTrade("ALL"); window.scrollTo(0,0); }}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {page === "veterans"`,
  `            </div>
          </div>
        )}

        {page === "veterans"`
);

// Remove from retirement page (the one at the bottom)
code = code.replace(
  `              <div style={{textAlign:"center", marginTop:48}}>
                <button className="btn-primary" onClick={() => { setPage("home"); setSelectedTrade("ALL"); window.scrollTo(0,0); }}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>
              </div>`,
  ''
);

console.log('✅ Removed Find Your Local buttons from History and Retirement pages');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: accurate geofencing + remove find local buttons" && git push\n');
