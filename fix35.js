const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. UPDATE HERO TEXT ──────────────────────────────────────────────────────
// EN
code = code.replace(
  'heroTitle1: "Built by",\n      heroAccent: "Tradespeople",\n      heroTitle2: "For the Trades",\n      heroSub: "Enter your location to find the union construction local nearest you — and take the first step toward a career in the skilled trades.",',
  'heroTitle1: "Everything",\n      heroAccent: "Union Trades.",\n      heroTitle2: "One Place.",\n      heroSub: "Find union locals, explore career paths, understand your benefits, and learn the history of the labor movement — all in one platform.",');

// ES
code = code.replace(
  'heroTitle1: "Construido por",\n      heroAccent: "Trabajadores",\n      heroTitle2: "Para los Oficios",\n      heroSub: "Ingresa tu ubicación para encontrar el local sindical más cercano — y da el primer paso hacia una carrera en los oficios calificados.",',
  'heroTitle1: "Todo sobre",\n      heroAccent: "Oficios Sindicales.",\n      heroTitle2: "Un Solo Lugar.",\n      heroSub: "Encuentra locales sindicales, explora rutas de carrera, comprende tus beneficios y aprende la historia del movimiento laboral — todo en una sola plataforma.",');

// PL
code = code.replace(
  'heroTitle1: "Zbudowane przez",\n      heroAccent: "Rzemieślników",\n      heroTitle2: "Dla Branży Budowlanej",\n      heroSub: "Wpisz swoją lokalizację, aby znaleźć najbliższy lokalny związek zawodowy — i zrób pierwszy krok w kierunku kariery w wykwalifikowanych zawodach budowlanych.",',
  'heroTitle1: "Wszystko o",\n      heroAccent: "Zawodach Związkowych.",\n      heroTitle2: "W Jednym Miejscu.",\n      heroSub: "Znajdź lokale związkowe, odkryj ścieżki kariery, poznaj swoje świadczenia i historię ruchu pracowniczego — wszystko w jednej platformie.",');

console.log('✅ Updated hero text');

// ─── 2. ADD QUICK NAV BUTTONS BETWEEN SUBTITLE AND NOTICE BANNER ─────────────
const oldHeroSub = `            <p className="hero-sub">{t.heroSub}</p>

            {/* NOTICE BANNER */}`;

const newHeroSub = `            <p className="hero-sub">{t.heroSub}</p>

            {/* QUICK NAV PILLS */}
            <div style={{display:"flex", flexWrap:"wrap", gap:"10px", justifyContent:"center", margin:"28px 0 8px"}}>
              {[
                { label: lang==="es" ? "Encuentra tu Local" : lang==="pl" ? "Znajdź Oddział" : "Find a Local", page: "home", anchor: true },
                { label: lang==="es" ? "¿Qué Oficio?" : lang==="pl" ? "Który Zawód?" : "Which Trade?", page: "quiz" },
                { label: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Ścieżki Kariery" : "Career Paths", page: "careers" },
                { label: lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Swiadczenia" : "Union Benefits", page: "benefits" },
                { label: lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia" : "Union History", page: "history" },
                { label: lang==="es" ? "Veteranos" : lang==="pl" ? "Weterani" : "Veterans", page: "veterans" },
              ].map((item, i) => (
                <button key={i} onClick={() => setPage(item.page)} style={{
                  background: i === 0 ? "rgba(250,128,89,0.15)" : "rgba(255,255,255,0.04)",
                  border: i === 0 ? "1px solid rgba(250,128,89,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50px", padding: "8px 18px",
                  color: i === 0 ? "#FA8059" : "var(--muted)",
                  fontSize: "13px", fontWeight: "600",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                  {item.label}
                </button>
              ))}
            </div>

            {/* NOTICE BANNER */}`;

if (!code.includes(oldHeroSub)) { console.error('ERROR: hero-sub marker not found'); process.exit(1); }
code = code.replace(oldHeroSub, newHeroSub);
console.log('✅ Added quick nav pills');

// ─── 3. CLEAN UP FEATURE CARDS — remove emojis, sleek minimal design ─────────
const oldCards = `            {/* FEATURE CARDS */}
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
            </div>`;

const newCards = `            {/* FEATURE CARDS */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"16px"}}>
              {[
                { num:"01", title: lang==="es" ? "Encuentra tu Local" : lang==="pl" ? "Znajdz Swoj Oddzial" : "Find Your Local", desc: lang==="es" ? "Busca locales sindicales de IBEW, UA, BAC, Ironworkers, UBC y mas — cerca de ti." : lang==="pl" ? "Znajdz lokale zwiazkowe IBEW, UA, BAC, Ironworkers i innych — w poblizu Ciebie." : "Search union locals from IBEW, UA, BAC, Ironworkers, UBC, and more — near you.", page: "home" },
                { num:"02", title: lang==="es" ? "Cual Oficio es para Ti?" : lang==="pl" ? "Ktory Zawod Jest dla Ciebie?" : "Which Trade Is Right For You?", desc: lang==="es" ? "Haz nuestro cuestionario gratuito y descubre que oficio sindical se adapta mejor a tus habilidades." : lang==="pl" ? "Weź udzial w naszym darmowym quizie i odkryj, ktory zawod najlepiej odpowiada Twoim umiejetnosciom." : "Take our free quiz and find out which union trade best matches your skills and goals.", page: "quiz" },
                { num:"03", title: lang==="es" ? "Rutas de Carrera" : lang==="pl" ? "Sciezki Kariery" : "Career Paths", desc: lang==="es" ? "Aprende sobre los salarios de aprendiz a oficial, los tiempos de progresion y beneficios de cada oficio." : lang==="pl" ? "Dowiedz sie o wynagrodzeniach od praktykanta do czeladnika i swiadczeniach w kazdym zawodzie." : "Learn about apprentice-to-journeyman wages, progression timelines, and benefits for each trade.", page: "careers" },
                { num:"04", title: lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Swiadczenia Zwiazowe" : "Union Benefits", desc: lang==="es" ? "Pensiones, seguros de salud, anualidades — todo pagado por el contratista. Aprende lo que vale un trabajo sindical." : lang==="pl" ? "Emerytury, ubezpieczenia zdrowotne, renty — wszystko placone przez wykonawce." : "Pensions, health insurance, annuities — all paid by your contractor. Learn what a union job is really worth.", page: "benefits" },
                { num:"05", title: lang==="es" ? "Historia Sindical" : lang==="pl" ? "Historia Zwiazowa" : "Union History", desc: lang==="es" ? "El fin de semana, la jornada de 8 horas, el seguro medico — todo fue luchado y ganado por trabajadores sindicalizados." : lang==="pl" ? "Weekend, 8-godzinny dzien pracy, ubezpieczenie zdrowotne — o wszystko to walczyli zwiazkowcy." : "The weekend, the 8-hour day, health insurance — all fought for and won by union workers.", page: "history" },
                { num:"06", title: lang==="es" ? "Veteranos y los Oficios" : lang==="pl" ? "Weterani i Zawody" : "Veterans & the Trades", desc: lang==="es" ? "Los veteranos militares son perfectos para los aprendizajes sindicales. Descubre Helmets to Hardhats y mas." : lang==="pl" ? "Weterani wojskowi sa doskonalymi kandydatami do zwiazowych praktyk. Poznaj Helmets to Hardhats." : "Military veterans are a natural fit for union apprenticeships. Learn about Helmets to Hardhats and more.", page: "veterans" },
              ].map((card, i) => (
                <div key={i} onClick={() => setPage(card.page)} style={{
                  background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:"16px", padding:"28px 24px",
                  cursor:"pointer", transition:"all 0.2s",
                  position:"relative", overflow:"hidden"
                }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(250,128,89,0.05)"; e.currentTarget.style.borderColor="rgba(250,128,89,0.25)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.15em", color:"rgba(250,128,89,0.5)", marginBottom:"12px"}}>{card.num}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:"800", color:"#fff", marginBottom:"10px", lineHeight:"1.2"}}>{card.title} <span style={{color:"#FA8059"}}>→</span></div>
                  <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.65"}}>{card.desc}</div>
                </div>
              ))}
            </div>`;

if (!code.includes(oldCards)) { console.error('ERROR: feature cards not found'); process.exit(1); }
code = code.replace(oldCards, newCards);
console.log('✅ Updated feature cards to clean minimal design');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: modernize home page hero and feature cards" && git push\n');
