const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// ─── 1. REMOVE EMOJIS FROM ABOUT PAGE ────────────────────────────────────────
// Hero eyebrow
c = c.replace(
  '<div className="history-eyebrow">⚡ Built by a Tradesperson, for Tradespeople</div>',
  '<div className="history-eyebrow">Built by a Tradesperson, for Tradespeople</div>'
);

// Mission cards icons
c = c.replace('<div className="impact-icon">⚡</div>\n                  <div className="impact-title">{lang==="es" ? "Construido por un Trabajador"', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"14px",textTransform:"uppercase"}}>01</div>\n                  <div className="impact-title">{lang==="es" ? "Construido por un Trabajador"');
c = c.replace('<div className="impact-icon">🤝</div>\n                  <div className="impact-title">{lang==="es" ? "Todo en Un Lugar"', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>02</div>\n                  <div className="impact-title">{lang==="es" ? "Todo en Un Lugar"');
c = c.replace('<div className="impact-icon">💪</div>\n                  <div className="impact-title">{lang==="es" ? "Por los Trabajadores"', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"14px",textTransform:"uppercase"}}>03</div>\n                  <div className="impact-title">{lang==="es" ? "Por los Trabajadores"');

console.log('✅ Removed emojis from about page');

// ─── 2. ADD LINKTREE BUTTON after Spanky desc ────────────────────────────────
c = c.replace(
  'Follow along: linktr.ee/spankythesparky"}</div>\n                </div>',
  'Follow along: linktr.ee/spankythesparky"}</div>\n                  <a href="https://linktr.ee/spankythesparky" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex", alignItems:"center", gap:"8px", marginTop:"16px", background:"rgba(250,128,89,0.1)", border:"1px solid rgba(250,128,89,0.3)", borderRadius:"50px", padding:"8px 20px", color:"#FA8059", fontSize:"13px", fontWeight:"700", fontFamily:"\'Barlow Condensed\',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", textDecoration:"none", transition:"all 0.2s"}}>\n                    linktr.ee/spankythesparky →\n                  </a>\n                </div>'
);

console.log('✅ Added Linktree button');

// ─── 3. REMOVE EMOJIS FROM ALL OTHER PAGES ───────────────────────────────────
// History page eyebrow
c = c.replace(
  '<div className="history-eyebrow">🏗️ The Foundation of the American Middle Class</div>',
  '<div className="history-eyebrow">The Foundation of the American Middle Class</div>'
);
c = c.replace(
  '<div className="history-eyebrow">{lang==="es" ? "🏗️ La Base de la Clase Media Americana" : lang==="pl" ? "🏗️ Fundament Amerykańskiej Klasy Średniej" : "🏗️ The Foundation of the American Middle Class"}</div>',
  '<div className="history-eyebrow">{lang==="es" ? "La Base de la Clase Media Americana" : lang==="pl" ? "Fundament Amerykańskiej Klasy Średniej" : "The Foundation of the American Middle Class"}</div>'
);

// Retirement page eyebrow
c = c.replace(
  '<div className="history-eyebrow">{lang==="es" ? "💰 Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "💰 Twoja Przyszłość, Zbudowana w Pracy" : "💰 Your Future, Built on the Job"}</div>',
  '<div className="history-eyebrow">{lang==="es" ? "Tu Futuro, Construido en el Trabajo" : lang==="pl" ? "Twoja Przyszłość, Zbudowana w Pracy" : "Your Future, Built on the Job"}</div>'
);

// Health page eyebrow
c = c.replace(
  '<div className="history-eyebrow">{lang==="es" ? "🏥 No Sale de Tu Cheque" : lang==="pl" ? "🏥 Nie Potrącane z Twojej Wypłaty" : "🏥 Never Deducted From Your Paycheck"}</div>',
  '<div className="history-eyebrow">{lang==="es" ? "No Sale de Tu Cheque" : lang==="pl" ? "Nie Potrącane z Twojej Wypłaty" : "Never Deducted From Your Paycheck"}</div>'
);

// Benefits page eyebrow
c = c.replace(
  '<div className="history-eyebrow">💼 More Than Just a Paycheck</div>',
  '<div className="history-eyebrow">More Than Just a Paycheck</div>'
);

// Union Benefits mission card icons
c = c.replace('<div className="impact-icon">⚡</div>\n                  <div className="impact-title">{lang==="es" ? "Construido por un Electricista"', '<div style={{fontFamily:"\'Barlow Condensed\',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"14px",textTransform:"uppercase"}}>01</div>\n                  <div className="impact-title">{lang==="es" ? "Construido por un Electricista"');

// Remove remaining impact-icon emojis on benefits/health pages
const emojiIcons = ['💡','💵','👨‍👩‍👧‍👦','🦷','📋','🔢','⭐','🔄','💰','🏥','🎓','📈','🦺','💼','🏗️','🤝','🌎','💵','🛡️'];
emojiIcons.forEach(emoji => {
  c = c.split(`<div className="impact-icon">${emoji}</div>`).join('');
});

console.log('✅ Removed emojis from all pages');

fs.writeFileSync('src/App.jsx', c);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Linktree button to about page, remove all emojis site-wide" && git push\n');
