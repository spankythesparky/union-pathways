const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const marker = `            {/* DIVIDER */}
            <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", marginBottom:"64px"}}/>`;

if (!code.includes(marker)) { console.error('ERROR: marker not found'); process.exit(1); }

const mapSection = `            {/* DIVIDER */}
            <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", marginBottom:"64px"}}/>

            {/* INTERACTIVE MAP */}
            <div style={{marginBottom:"80px"}}>
              <div style={{textAlign:"center", marginBottom:"28px"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FA8059", marginBottom:"10px"}}>
                  {lang==="es" ? "854 Locales en EE.UU. y Canada" : lang==="pl" ? "854 Lokale w USA i Kanadzie" : "854 Locals Across the US and Canada"}
                </div>
                <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(28px,5vw,46px)", fontWeight:"900", textTransform:"uppercase", color:"#fff", lineHeight:"1", letterSpacing:"-0.02em"}}>
                  {"Every Union Local. "}<span style={{color:"#FA8059"}}>{"One Map."}</span>
                </h2>
              </div>
              <div style={{width:"100%", height:"560px", borderRadius:"20px", overflow:"hidden", border:"1px solid rgba(58,80,104,0.4)"}}>
                <iframe src="/map.html" style={{width:"100%", height:"100%", border:"none", display:"block"}} title="Union Locals Map" loading="lazy" />
              </div>
              <div style={{textAlign:"center", marginTop:"10px", fontSize:"11px", color:"rgba(160,180,196,0.35)", letterSpacing:"0.06em"}}>
                {lang==="es" ? "Haz clic en cualquier cluster para expandirlo." : lang==="pl" ? "Kliknij na klaster, aby go rozwinac." : "Click any cluster to expand. Zoom in to see individual pins."}
              </div>
            </div>`;

code = code.replace(marker, mapSection);
fs.writeFileSync('src/App.jsx', code);
console.log('✅ Added map iframe to home page');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx public/map.html && git commit -m "feat: add interactive map iframe to home page" && git push\n');
