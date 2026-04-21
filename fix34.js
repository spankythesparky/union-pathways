const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Insert platform sections before footer
const marker = `        {/* FOOTER */}
        <footer>`;

const platformSections = `        {/* PLATFORM OVERVIEW — show on home page when no results */}
        {page === "home" && !results && (
          <div style={{maxWidth:"1000px", margin:"0 auto", padding:"0 24px 80px"}}>

            {/* STATS ROW */}
            <div style={{display:"flex", justifyContent:"center", gap:"16px", flexWrap:"wrap", margin:"60px 0 64px"}}>
              {[
                { num: "16M+", label: lang==="es" ? "Miembros Sindicales en EE.UU." : lang==="pl" ? "Członków Związków w USA" : "Union Members in the US" },
                { num: "18%", label: lang==="es" ? "Salarios Más Altos que No Sindicales" : lang==="pl" ? "Wyższe Płace niż Niezwiązkowcy" : "Higher Wages Than Non-Union" },
                { num: "500K+", label: lang==="es" ? "Trabajadores de Construcción Necesarios" : lang==="pl" ? "Potrzebnych Pracowników Budowlanych" : "Construction Workers Needed Now" },
                { num: "$0", label: lang==="es" ? "Costo del Aprendizaje Sindical" : lang==="pl" ? "Koszt Praktyki Związkowej" : "Cost to Join an Apprenticeship" },
              ].map((s, i) => (
                <div key={i} style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.18)", borderRadius:"16px", padding:"20px 28px", textAlign:"center", minWidth:"160px", flex:"1"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"38px", fontWeight:"900", color:"#FA8059", lineHeight:"1"}}>{s.num}</div>
                  <div style={{fontSize:"12px", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:"6px", fontWeight:"600"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* DIVIDER */}
            <div style={{borderTop:"1px solid rgba(58,80,104,0.4)", marginBottom:"64px"}}/>

            {/* SECTION TITLE */}
            <div style={{textAlign:"center", marginBottom:"40px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", color:"#FA8059", marginBottom:"12px"}}>
                {lang==="es" ? "Todo en un Solo Lugar" : lang==="pl" ? "Wszystko w Jednym Miejscu" : "Everything You Need. One Platform."}
              </div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(32px,6vw,52px)", fontWeight:"900", textTransform:"uppercase", color:"#fff", lineHeight:"1", letterSpacing:"-0.02em"}}>
                {lang==="es" ? <>{"Más que un "}<span style={{color:"#FA8059"}}>{"Buscador"}</span></> : lang==="pl" ? <>{"Więcej niż "}<span style={{color:"#FA8059"}}>{"Wyszukiwarka"}</span></> : <>{"More Than a "}<span style={{color:"#FA8059"}}>{"Local Finder"}</span></>}
              </h2>
              <p style={{fontSize:"16px", color:"var(--muted)", maxWidth:"560px", margin:"16px auto 0", lineHeight:"1.6"}}>
                {lang==="es" ? "Union Pathways es la plataforma completa para todo lo relacionado con los oficios sindicales." : lang==="pl" ? "Union Pathways to kompletna platforma dla wszystkiego związanego ze związkowymi zawodami budowlanymi." : "Union Pathways is the all-in-one platform for everything union construction trades."}
              </p>
            </div>

            {/* FEATURE CARDS */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"20px"}}>
              {[
                { icon:"📍", title: lang==="es" ? "Encuentra tu Local" : lang==="pl" ? "Znajdź Swój Oddział" : "Find Your Local", desc: lang==="es" ? "Busca locales sindicales de IBEW, UA, BAC, Ironworkers, UBC y más — cerca de ti." : lang==="pl" ? "Znajdź lokale związkowe IBEW, UA, BAC, Ironworkers, UBC i innych — w pobliżu Ciebie." : "Search union locals from IBEW, UA, BAC, Ironworkers, UBC, and more — near you.", page: "home" },
                { icon:"🔍", title: lang==="es" ? "¿Qué Oficio es para Ti?" : lang==="pl" ? "Który Zawód Jest dla Ciebie?" : "Which Trade Is Right For You?", desc: lang==="es" ? "Haz nuestro cuestionario gratuito y descubre qué oficio sindical se adapta mejor a tus habilidades e intereses." : lang==="pl" ? "Weź udział w naszym darmowym quizie i odkryj, który związkowy zawód najlepiej odpowiada Twoim umiejętnościom i zainteresowaniom." : "Take our free quiz and find out which union trade best matches your skills, interests, and goals.", page: "quiz" },
                { icon:"🎓", title: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Ścieżki Kariery" : "Career Paths", desc: lang==="es" ? "Aprende sobre los salarios de aprendiz a oficial, los tiempos de progresión y los beneficios de cada oficio." : lang==="pl" ? "Dowiedz się o wynagrodzeniach od praktykanta do czeladnika, czasie awansu i świadczeniach w każdym zawodzie." : "Learn about apprentice-to-journeyman wages, progression timelines, and benefits for each trade.", page: "careers" },
                { icon:"💰", title: lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Świadczenia Związkowe" : "Union Benefits", desc: lang==="es" ? "Pensiones, seguros de salud, anualidades — todo pagado por el contratista. Aprende lo que realmente vale un trabajo sindical." : lang==="pl" ? "Emerytury, ubezpieczenia zdrowotne, renty annuitetowe — wszystko płacone przez wykonawcę. Dowiedz się, co naprawdę warta jest praca związkowa." : "Pensions, health insurance, annuities — all paid by your contractor. Learn what a union job is really worth.", page: "benefits" },
                { icon:"🏛️", title: lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia Związkowa" : "Union History", desc: lang==="es" ? "El fin de semana, la jornada de 8 horas, el seguro médico — todo fue luchado y ganado por trabajadores sindicalizados." : lang==="pl" ? "Weekend, 8-godzinny dzień pracy, ubezpieczenie zdrowotne — o wszystko to walczyli i wywalczyli związkowcy." : "The weekend, the 8-hour day, health insurance — all fought for and won by union workers. Learn the history.", page: "history" },
                { icon:"🎖️", title: lang==="es" ? "Veteranos y los Oficios" : lang==="pl" ? "Weterani i Zawody Budowlane" : "Veterans & the Trades", desc: lang==="es" ? "Los veteranos militares son perfectos para los aprendizajes sindicales. Descubre Helmets to Hardhats y otros programas." : lang==="pl" ? "Weterani wojskowi są doskonałymi kandydatami do związkowych praktyk zawodowych. Poznaj Helmets to Hardhats i inne programy." : "Military veterans are a natural fit for union apprenticeships. Learn about Helmets to Hardhats and more.", page: "veterans" },
              ].map((card, i) => (
                <div key={i} onClick={() => setPage(card.page)} style={{background:"rgba(34,48,61,0.5)", backdropFilter:"blur(10px)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:"20px", padding:"28px 24px", cursor:"pointer", transition:"border-color 0.2s, transform 0.2s"}}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(250,128,89,0.4)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(58,80,104,0.4)"; e.currentTarget.style.transform="translateY(0)"; }}>
                  <div style={{fontSize:"36px", marginBottom:"14px"}}>{card.icon}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:"800", color:"#fff", marginBottom:"8px"}}>{card.title} <span style={{color:"#FA8059", fontSize:"16px"}}>→</span></div>
                  <div style={{fontSize:"14px", color:"var(--muted)", lineHeight:"1.6"}}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer>`;

if (!code.includes(marker)) {
  console.error('ERROR: footer marker not found');
  process.exit(1);
}

code = code.replace(marker, platformSections);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Added platform overview sections to home page');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add platform overview stats and feature cards to home page" && git push\n');
