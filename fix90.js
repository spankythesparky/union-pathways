// fix90.js — Add note about smaller contributions to honor system disclaimer
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// Wrap honor system content + add note about smaller contributions
const oldDisclaimer = `<><strong style={{color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1}}>{lang==="es" ? "SISTEMA DE HONOR — " : lang==="pl" ? "SYSTEM HONOROWY — " : "HONOR SYSTEM — "}</strong>{lang==="es" ? "Todos los salarios son enviados por miembros del sindicato y NO son verificados por Union Pathways. Para tarifas finales y 100% precisas, siempre contacte directamente con su local sindical." : lang==="pl" ? "Wszystkie stawki sa przesylane przez czlonkow zwiazku i NIE sa weryfikowane przez Union Pathways. Aby uzyskac koncowe i w 100% dokladne stawki, zawsze skontaktuj sie bezposrednio ze swoim lokalem zwiazkowym." : "All wage data is submitted by union members and is NOT verified by Union Pathways. For final and 100% accurate rates, always contact your local hall directly."}</>`;

const newDisclaimer = `<><div><strong style={{color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1}}>{lang==="es" ? "SISTEMA DE HONOR — " : lang==="pl" ? "SYSTEM HONOROWY — " : "HONOR SYSTEM — "}</strong>{lang==="es" ? "Todos los salarios son enviados por miembros del sindicato y NO son verificados por Union Pathways. Para tarifas finales y 100% precisas, siempre contacte directamente con su local sindical." : lang==="pl" ? "Wszystkie stawki sa przesylane przez czlonkow zwiazku i NIE sa weryfikowane przez Union Pathways. Aby uzyskac koncowe i w 100% dokladne stawki, zawsze skontaktuj sie bezposrednio ze swoim lokalem zwiazkowym." : "All wage data is submitted by union members and is NOT verified by Union Pathways. For final and 100% accurate rates, always contact your local hall directly."}</div><div style={{marginTop:12, fontSize:12, opacity:0.85, paddingTop:12, borderTop:"1px solid rgba(250,128,89,0.15)"}}><strong style={{color:"#FA8059", fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5}}>{lang==="es" ? "NOTA — " : lang==="pl" ? "UWAGA — " : "NOTE — "}</strong>{lang==="es" ? "Los envios cubren los rubros principales: hora, salud y bienestar, pension, anualidad, NEBF/CIPF y cuotas. Las contribuciones pequenas (JATC, fondos suplementarios, etc.) varian mucho de local a local y no se rastrean aqui." : lang==="pl" ? "Zgloszenia obejmuja glowne pozycje: godzinowo, swiadczenia zdrowotne, emerytura, renta, NEBF/CIPF i skladki. Mniejsze skladki (JATC, fundusze dodatkowe itp.) bardzo sie roznia miedzy lokalami i nie sa tu wymienione." : "Submissions cover the major line items: hourly, health & welfare, pension, annuity, NEBF/CIPF, and dues. Smaller contributions like JATC and other supplemental funds vary so much from one local to the next that they aren't tracked here."}</div></>`;

code = replaceOnce(code, oldDisclaimer, newDisclaimer, 'honor system disclaimer');
console.log('1/1 ✓ Added note about smaller contributions');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add note about smaller contributions to honor system" && git push\n');
