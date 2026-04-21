const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD NAV LINK ─────────────────────────────────────────────────────────
const oldContact = `            <button className={\`nav-link \${page==="contact"?"active":""}\`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>`;
const newContact = `            <button className={\`nav-link \${page==="about"?"active":""}\`} onClick={() => setPage("about")}>{lang==="es" ? "Nosotros" : lang==="pl" ? "O Nas" : "About"}</button>
            <button className={\`nav-link \${page==="contact"?"active":""}\`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>`;

if (!code.includes(oldContact)) { console.error('ERROR: contact nav not found'); process.exit(1); }
code = code.replace(oldContact, newContact);
console.log('✅ Nav link added');

// ─── 2. ADD VALID PAGE ────────────────────────────────────────────────────────
code = code.replace(
  `const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','health','benefits','contact'];`,
  `const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','health','benefits','about','contact'];`
);
console.log('✅ Valid pages updated');

// ─── 3. ADD PAGE META ─────────────────────────────────────────────────────────
code = code.replace(
  `      contact:   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },`,
  `      about:    { title: "Union Pathways — About Us", desc: "Union Pathways was founded by Noah, an IBEW Journeyman and superintendent. Built for union tradespeople, by a union tradesperson." },
      contact:   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },`
);
console.log('✅ Page meta added');

// ─── 4. ADD ABOUT PAGE JSX ───────────────────────────────────────────────────
const pageMarker = `        {page === "contact" &&`;

const aboutPage = `        {page === "about" && (
          <div>
            {/* HERO */}
            <div className="history-hero" style={{paddingBottom:"80px"}}>
              <div className="history-eyebrow">⚡ Built by a Tradesperson, for Tradespeople</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"La Historia "}<span className="accent">Detrás de la Plataforma"</span></> : lang==="pl" ? <>{"Historia "}<span className="accent">Platformy"</span></> : <>{"The Story "}<span className="accent">Behind the Platform"</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Union Pathways no fue construida en una sala de juntas. Fue construida en una obra de construcción." : lang==="pl" ? "Union Pathways nie zostało zbudowane w sali konferencyjnej. Zostało zbudowane na placu budowy." : "Union Pathways wasn't built in a boardroom. It was built on a job site."}
              </p>

              {/* STATS ROW */}
              <div className="history-stats" style={{marginTop:48}}>
                {[
                  { num: "157K+", label: lang==="es" ? "Seguidores en Todas las Plataformas" : lang==="pl" ? "Obserwujących na Wszystkich Platformach" : "Followers Across All Platforms" },
                  { num: "400M+", label: lang==="es" ? "Visualizaciones desde Dic. 2024" : lang==="pl" ? "Wyświetleń od Grudnia 2024" : "Views Since December 2024" },
                  { num: "5+", label: lang==="es" ? "Años como Electricista IBEW" : lang==="pl" ? "Lat jako Elektryk IBEW" : "Years as an IBEW Electrician" },
                  { num: "1", label: lang==="es" ? "Misión — Todo Sindical. Un Lugar." : lang==="pl" ? "Misja — Wszystko Związkowe. Jedno Miejsce." : "Mission — Everything Union. One Place." },
                ].map((s, i) => (
                  <div key={i} className="history-stat">
                    <div className="history-stat-num">{s.num}</div>
                    <div className="history-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOUNDER STORY */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Conoce al "}<span className="accent">Fundador</span></> : lang==="pl" ? <>{"Poznaj "}<span className="accent">Założyciela</span></> : <>{"Meet the "}<span className="accent">Founder</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Noah — IBEW Electricista Oficial, Superintendente, y Creador de Spanky The Sparky." : lang==="pl" ? "Noah — Elektryk IBEW Czeladnik, Superintendent i Twórca Spanky The Sparky." : "Noah — IBEW Journeyman Electrician, Superintendent, and creator of Spanky The Sparky."}</div>

              {/* STORY TIMELINE */}
              <div className="timeline">

                <div className="timeline-item">
                  <div className="timeline-dot"/>
                  <div className="timeline-year">{lang==="es" ? "El Principio" : lang==="pl" ? "Początek" : "The Beginning"}</div>
                  <div className="timeline-event">{lang==="es" ? "Crecer con un Padre Sindicalista" : lang==="pl" ? "Dorastanie z Ojcem Związkowcem" : "Growing Up with a Union Dad"}</div>
                  <div className="timeline-desc">{lang==="es" ? "El padre de Noah era un miembro del sindicato. Cuando Noah tenía 16 años, su padre falleció de cáncer a los 54 años. Era una familia monoparental. Lo que quedó — el seguro de salud sindical y la jubilación — fue lo que ayudó a Noah, su hermano y su hermana a salir adelante durante uno de los momentos más difíciles de sus vidas. Ese legado nunca lo olvidó." : lang==="pl" ? "Ojciec Noaha był członkiem związku zawodowego. Gdy Noah miał 16 lat, jego ojciec zmarł na raka w wieku 54 lat. Była to rodzina z jednym rodzicem. To, co pozostało — związkowe ubezpieczenie zdrowotne i emerytura — pomogło Noahowi, jego bratu i siostrze przetrwać jeden z najtrudniejszych okresów w ich życiu. Tej spuścizny nigdy nie zapomniał." : "Noah grew up in Millfield, Ohio — a small coal mining town in the southern Ohio foothills with a population of 320-350 people on any given year. His father was a union member. When Noah was 16, his dad passed away from cancer at 54 years old. They were a single-parent household. What remained — the union health insurance and retirement benefits — is what helped Noah, his brother, and his sister get through one of the hardest times of their lives. That legacy never left him."}</div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot"/>
                  <div className="timeline-year">{lang==="es" ? "Universidad" : lang==="pl" ? "Studia" : "College"}</div>
                  <div className="timeline-event">{lang==="es" ? "Ohio University — Licenciatura y 2 Negocios" : lang==="pl" ? "Ohio University — Licencjat i 2 Firmy" : "Ohio University — Bachelor's Degree & 2 Businesses"}</div>
                  <div className="timeline-desc">{lang==="es" ? "Noah fue a la Universidad de Ohio, obtuvo una licenciatura, y mientras estaba en la universidad construyó y vendió 2 negocios. Pero después de graduarse, con un título en mano, no pudo encontrar trabajo. El mercado laboral no era lo que le habían prometido." : lang==="pl" ? "Noah poszedł na Ohio University, uzyskał tytuł licencjata i podczas studiów zbudował oraz sprzedał 2 firmy. Ale po ukończeniu studiów, z dyplomem w ręku, nie mógł znaleźć pracy. Rynek pracy nie był tym, co mu obiecano." : "Noah went to Ohio University, earned a bachelor's degree, and while in college built and exited 2 businesses. But after graduating — degree in hand — he couldn't find a job. The job market wasn't what he'd been promised."}</div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot"/>
                  <div className="timeline-year">{lang==="es" ? "El Giro" : lang==="pl" ? "Zwrot Akcji" : "The Turn"}</div>
                  <div className="timeline-event">{lang==="es" ? "De Agencia Temporal a No Sindical a IBEW" : lang==="pl" ? "Od Agencji Pracy Tymczasowej przez Niezwiązkowców do IBEW" : "Temp Agency to Non-Union to IBEW"}</div>
                  <div className="timeline-desc">{lang==="es" ? "Sin opciones, Noah fue a una agencia temporal que lo emparejó con una empresa eléctrica residencial no sindical. Después de 8 meses trabajando no sindical — viendo la diferencia en salarios, beneficios y condiciones de trabajo — dio el salto al IBEW. Comenzó como CW, se unió al aprendizaje, se convirtió en oficial y ahora trabaja como superintendente." : lang==="pl" ? "Bez opcji Noah poszedł do agencji pracy tymczasowej, która przydzieliła go do niezwiązkowej firmy elektrycznej zajmującej się budownictwem mieszkaniowym. Po 8 miesiącach pracy poza związkiem — widząc różnicę w wynagrodzeniach, świadczeniach i warunkach pracy — przeszedł do IBEW. Zaczął jako CW, dołączył do praktyki, został czeladnikiem i teraz pracuje jako superintendent." : "With no options, Noah went to a temp agency that paired him with a non-union residential electrical company. After 8 months working non-union — seeing the difference in wages, benefits, and working conditions — he made the jump to the IBEW. He started as a CW, joined the apprenticeship, became a journeyman, and now works as a superintendent."}</div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot"/>
                  <div className="timeline-year">{lang==="es" ? "Diciembre 2024" : lang==="pl" ? "Grudzień 2024" : "December 2024"}</div>
                  <div className="timeline-event">{lang==="es" ? "Spanky The Sparky — 400 Millones de Visualizaciones" : lang==="pl" ? "Spanky The Sparky — 400 Milionów Wyświetleń" : "Spanky The Sparky — 400 Million Views"}</div>
                  <div className="timeline-desc">{lang==="es" ? "Noah lanzó Spanky The Sparky para mostrar la vida real en el oficio — sin filtros, sin exageraciones. El contenido explotó. Más de 157,000 seguidores en todas las plataformas y más de 400 millones de visualizaciones desde diciembre de 2024. La gente estaba hambrienta de información real sobre los oficios." : lang==="pl" ? "Noah uruchomił Spanky The Sparky, aby pokazać prawdziwe życie w zawodzie — bez filtrów, bez przesady. Treści eksplodowały. Ponad 157 000 obserwujących na wszystkich platformach i ponad 400 milionów wyświetleń od grudnia 2024. Ludzie byli głodni prawdziwych informacji o zawodach budowlanych." : "Noah launched Spanky The Sparky to show real life in the trade — unfiltered, no hype. The content exploded. Over 157,000 followers across all platforms and over 400 million views since December 2024. The mission was simple: bridge the gap in the union construction industry in a modern way — bringing real, accessible information to the next generation of tradespeople. Follow along: linktr.ee/spankythesparky"}</div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot" style={{background:"#FA8059", boxShadow:"0 0 20px rgba(250,128,89,0.8)"}}/>
                  <div className="timeline-year">{lang==="es" ? "Hoy" : lang==="pl" ? "Dziś" : "Today"}</div>
                  <div className="timeline-event">{lang==="es" ? "Union Pathways — Todo Sindical. Un Lugar." : lang==="pl" ? "Union Pathways — Wszystko Związkowe. Jedno Miejsce." : "Union Pathways — Everything Union. One Place."}</div>
                  <div className="timeline-desc">{lang==="es" ? "Union Pathways nació de una necesidad real — un lugar único donde cualquiera pueda encontrar su local sindical, explorar rutas de carrera, entender sus beneficios y aprender la historia que lo hizo posible. Construido por un electricista. Para los trabajadores." : lang==="pl" ? "Union Pathways powstało z prawdziwej potrzeby — jednego miejsca, gdzie każdy może znaleźć swój lokalny związek, odkryć ścieżki kariery, zrozumieć swoje świadczenia i poznać historię, która to umożliwiła. Zbudowane przez elektryka. Dla pracowników." : "Union Pathways was born out of a real need — one place where anyone can find their union local, explore career paths, understand their benefits, and learn the history that made it all possible. Built by an electrician. For the workers. Follow Spanky The Sparky at linktr.ee/spankythesparky"}</div>
                </div>

              </div>
            </div>

            <hr className="divider-line"/>

            {/* MISSION */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"La "}<span className="accent">Misión</span></> : lang==="pl" ? <>{"Nasza "}<span className="accent">Misja</span></> : <>{"The "}<span className="accent">Mission</span></>}</div>
              <div className="impact-grid">
                <div className="impact-card">
                  <div className="impact-icon">⚡</div>
                  <div className="impact-title">{lang==="es" ? "Construido por un Trabajador" : lang==="pl" ? "Zbudowane przez Pracownika" : "Built by a Worker"}</div>
                  <div className="impact-desc">{lang==="es" ? "No somos una empresa de marketing que intenta capitalizar los oficios. Somos un electricista IBEW que ve la necesidad de una plataforma real para trabajadores reales." : lang==="pl" ? "Nie jesteśmy firmą marketingową próbującą zarabiać na zawodach budowlanych. Jesteśmy elektrykiem IBEW, który widzi potrzebę prawdziwej platformy dla prawdziwych pracowników." : "We're not a marketing company trying to capitalize on the trades. We're an IBEW electrician who sees the need for a real platform for real workers."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🤝</div>
                  <div className="impact-title">{lang==="es" ? "Todo en Un Lugar" : lang==="pl" ? "Wszystko w Jednym Miejscu" : "Everything in One Place"}</div>
                  <div className="impact-desc">{lang==="es" ? "Locales sindicales, rutas de carrera, beneficios, historia, recursos para veteranos — todo lo que alguien necesita saber sobre los oficios sindicales, en una sola plataforma." : lang==="pl" ? "Lokale związkowe, ścieżki kariery, świadczenia, historia, zasoby dla weteranów — wszystko, co ktoś musi wiedzieć o związkowych zawodach budowlanych, w jednej platformie." : "Union locals, career paths, benefits, history, veteran resources — everything someone needs to know about the union trades, in one platform."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">💪</div>
                  <div className="impact-title">{lang==="es" ? "Por los Trabajadores" : lang==="pl" ? "Dla Pracowników" : "For the Workers"}</div>
                  <div className="impact-desc">{lang==="es" ? "Ya sea que estés buscando unirte a los oficios, ya seas un aprendiz, un oficial o un veterano — este es tu recurso. Gratis. Siempre." : lang==="pl" ? "Niezależnie od tego, czy chcesz dołączyć do zawodów, czy jesteś już praktykantem, czeladnikiem lub weteranem — to jest Twój zasób. Bezpłatnie. Zawsze." : "Whether you're looking to join the trades, you're already an apprentice, a journeyman, or a veteran — this is your resource. Free. Always."}</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:40}}>
                <div className="quote-text">{lang==="es" ? '"Vi lo que los beneficios sindicales hicieron por mi familia cuando más los necesitábamos. Quiero asegurarme de que todos los demás también lo vean."' : lang==="pl" ? '"Widziałem, co świadczenia związkowe zrobiły dla mojej rodziny, gdy najbardziej ich potrzebowaliśmy. Chcę upewnić się, że wszyscy inni też to zobaczą."' : '"I saw what union benefits did for my family when we needed them most. I want to make sure everyone else sees it too."'}</div>
                <div className="quote-author">— Noah, {lang==="es" ? "Fundador de Union Pathways" : lang==="pl" ? "Założyciel Union Pathways" : "Founder of Union Pathways"}</div>
              </div>
            </div>
          </div>
        )}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: contact page marker not found'); process.exit(1); }
code = code.replace(pageMarker, aboutPage + pageMarker);
console.log('✅ About page added');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add About page with founder story" && git push\n');
