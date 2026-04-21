const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Replace medal emojis and their container divs with clean numbered labels
c = c.replace(
  `                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"32px", fontWeight:"900", color:"#FA8059"}}>🥇</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FA8059", marginBottom:"4px"}}>{lang==="es" ? "Mejor Opción" : lang==="pl" ? "Najlepsza Opcja" : "Best Option"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Aprendizaje Directo" : lang==="pl" ? "Bezpośrednia Praktyka" : "Direct Apprenticeship"}</div>
                    </div>`,
  `                  <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FA8059", marginBottom:"6px"}}>{lang==="es" ? "01 — Mejor Opción" : lang==="pl" ? "01 — Najlepsza Opcja" : "01 — Best Option"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Aprendizaje Directo" : lang==="pl" ? "Bezpośrednia Praktyka" : "Direct Apprenticeship"}</div>
                    </div>`
);

c = c.replace(
  `                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"32px", fontWeight:"900", color:"#a0b4c4"}}>🥈</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"4px"}}>{lang==="es" ? "Buen Atajo" : lang==="pl" ? "Dobry Skrót" : "Good Shortcut"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Programas de Pre-Aprendizaje" : lang==="pl" ? "Programy Przed-Praktyczne" : "Pre-Apprenticeship Programs"}</div>
                    </div>`,
  `                  <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"6px"}}>{lang==="es" ? "02 — Buen Atajo" : lang==="pl" ? "02 — Dobry Skrót" : "02 — Good Shortcut"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Programas de Pre-Aprendizaje" : lang==="pl" ? "Programy Przed-Praktyczne" : "Pre-Apprenticeship Programs"}</div>
                    </div>`
);

c = c.replace(
  `                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"32px", fontWeight:"900", color:"#a0b4c4"}}>🥉</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"4px"}}>{lang==="es" ? "La Ruta Trasera" : lang==="pl" ? "Droga Tylnym Wejściem" : "The Backdoor Route"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "No Sindical → Sindical" : lang==="pl" ? "Niezwiązkowy → Związkowy" : "Non-Union → Union Flip"}</div>
                    </div>`,
  `                  <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"6px"}}>{lang==="es" ? "03 — La Ruta Alternativa" : lang==="pl" ? "03 — Droga Alternatywna" : "03 — The Alternative Route"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "No Sindical a Sindical" : lang==="pl" ? "Niezwiązkowy do Związkowego" : "Non-Union to Union"}</div>
                    </div>`
);

// Replace impact icons on the What Actually Matters section
c = c.replace(
  '<div className="impact-card" style={{borderColor:"rgba(250,128,89,0.2)"}}>\n                  <div className="impact-icon">✅</div>',
  '<div className="impact-card" style={{borderColor:"rgba(250,128,89,0.2)"}}>\n                  <div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"14px",textTransform:"uppercase"}}>01</div>'
);

c = c.replace(
  '<div className="impact-card">\n                  <div className="impact-icon">⏳</div>',
  '<div className="impact-card">\n                  <div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>02</div>'
);

c = c.replace(
  '<div className="impact-card">\n                  <div className="impact-icon">🎯</div>',
  '<div className="impact-card">\n                  <div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>03</div>'
);

// Also remove the hero eyebrow emoji on checklist page
c = c.replace(
  '<div className="history-eyebrow">🏗️ The Real Path Into the Trades</div>',
  '<div className="history-eyebrow">The Real Path Into the Trades</div>'
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
