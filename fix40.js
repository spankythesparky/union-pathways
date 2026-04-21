const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Find the checklist page start and end
const start = code.indexOf('        {page === "checklist" && (');
const end = code.indexOf('        {page === "history" && (');

if (start === -1 || end === -1) {
  console.error('ERROR: Could not find checklist or history page markers');
  process.exit(1);
}

const newChecklist = `        {page === "checklist" && (
          <div>
            {/* HERO */}
            <div className="history-hero">
              <div className="history-eyebrow">🏗️ The Real Path Into the Trades</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Cómo Unirse a un "}<span className="accent">Oficio Sindical</span></> : lang==="pl" ? <>{"Jak Dołączyć do "}<span className="accent">Zawodu Związkowego</span></> : <>{"How to Join a "}<span className="accent">Union Trade</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "Sin cursos, sin intermediarios, sin relleno. Así es como la gente realmente entra a los oficios sindicales." : lang==="pl" ? "Bez kursów, bez pośredników, bez lania wody. Oto jak ludzie naprawdę wchodzą do związkowych zawodów budowlanych." : "No courses, no funnels, no fluff. This is how people actually get into the union trades."}
              </p>
            </div>

            {/* 3 ROUTES */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Las 3 Rutas "}<span className="accent">Reales</span>{" de Entrada"}</> : lang==="pl" ? <>{"3 Prawdziwe "}<span className="accent">Drogi</span>{" Wejścia"}</> : <>{"The 3 "}<span className="accent">Real</span>{" Entry Routes"}</>}</div>
              <div className="history-section-sub">{lang==="es" ? "Clasificadas por efectividad — así es como la gente realmente entra." : lang==="pl" ? "Uszeregowane według skuteczności — tak ludzie naprawdę wchodzą do zawodów." : "Ranked by effectiveness — this is how people actually get in."}</div>

              <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
                {/* ROUTE 1 */}
                <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:"20px", padding:"28px 32px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"32px", fontWeight:"900", color:"#FA8059"}}>🥇</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#FA8059", marginBottom:"4px"}}>{lang==="es" ? "Mejor Opción" : lang==="pl" ? "Najlepsza Opcja" : "Best Option"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Aprendizaje Directo" : lang==="pl" ? "Bezpośrednia Praktyka" : "Direct Apprenticeship"}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"15px", color:"var(--muted)", lineHeight:"1.7", marginBottom:"16px"}}>
                    {lang==="es" ? "Este es el estándar de oro. Aplicas directamente al programa de formación de un sindicato. Ganas mientras aprendes — sin deuda estudiantil. Sin intermediarios." : lang==="pl" ? "To złoty standard. Aplikujesz bezpośrednio do programu szkoleniowego związku. Zarabiasz ucząc się — bez długu studenckiego. Bez pośredników." : "This is the gold standard. You apply straight to a union's training program. You earn while you learn — no student debt. No middleman."}
                  </p>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"12px"}}>
                    {[
                      { label: lang==="es" ? "Proceso" : lang==="pl" ? "Proces" : "Process", val: lang==="es" ? "Solicitud → Prueba → Entrevista → Lista de espera → Empezar" : lang==="pl" ? "Wniosek → Test → Rozmowa → Lista oczekujących → Start" : "Apply → Aptitude Test → Interview → Waitlist → Start Working" },
                      { label: lang==="es" ? "Salario Inicial" : lang==="pl" ? "Wynagrodzenie Startowe" : "Starting Pay", val: "$18–$25/hr" },
                      { label: lang==="es" ? "Salario Oficial" : lang==="pl" ? "Wynagrodzenie Czeladnika" : "Journeyman Pay", val: "$35–$75/hr+" },
                      { label: lang==="es" ? "Por qué es #1" : lang==="pl" ? "Dlaczego #1" : "Why It's #1", val: lang==="es" ? "Es el pipeline real. Sin intermediarios." : lang==="pl" ? "To prawdziwy pipeline. Bez pośredników." : "It's the actual pipeline. No middleman." },
                    ].map((item, i) => (
                      <div key={i} style={{background:"rgba(0,0,0,0.2)", borderRadius:"10px", padding:"12px 16px"}}>
                        <div style={{fontSize:"11px", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", color:"#FA8059", marginBottom:"4px"}}>{item.label}</div>
                        <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.5"}}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROUTE 2 */}
                <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"28px 32px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"32px", fontWeight:"900", color:"#a0b4c4"}}>🥈</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"4px"}}>{lang==="es" ? "Buen Atajo" : lang==="pl" ? "Dobry Skrót" : "Good Shortcut"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "Programas de Pre-Aprendizaje" : lang==="pl" ? "Programy Przed-Praktyczne" : "Pre-Apprenticeship Programs"}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"15px", color:"var(--muted)", lineHeight:"1.7", marginBottom:"16px"}}>
                    {lang==="es" ? "Programas legítimos que te ayudan a entrar más rápido a los sindicatos. A menudo dirigidos por colegios comunitarios, organizaciones sin fines de lucro y asociaciones sindicales." : lang==="pl" ? "Legalne programy, które pomagają szybciej wejść do związków. Często prowadzone przez community college, organizacje non-profit i partnerstwa związkowe." : "Legit programs that help you get into unions faster. Often run by community colleges, nonprofits, and union partnerships."}
                  </p>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"12px"}}>
                    {[
                      { label: lang==="es" ? "Qué Hacen" : lang==="pl" ? "Co Robią" : "What They Do", val: lang==="es" ? "Enseñan habilidades básicas, ayudan a pasar pruebas de ingreso, a veces dan entrada directa" : lang==="pl" ? "Uczą podstawowych umiejętności, pomagają zdać testy wstępne, czasem dają bezpośrednie wejście" : "Teach basic skills, help you pass entry tests, sometimes give direct entry or priority" },
                      { label: lang==="es" ? "Quién las Ofrece" : lang==="pl" ? "Kto Je Oferuje" : "Who Offers Them", val: lang==="es" ? "Colegios comunitarios, organizaciones sin fines de lucro, centros de formación sindicales" : lang==="pl" ? "Community college, organizacje non-profit, związkowe centra szkoleniowe" : "Community colleges, nonprofits, union training centers" },
                    ].map((item, i) => (
                      <div key={i} style={{background:"rgba(0,0,0,0.2)", borderRadius:"10px", padding:"12px 16px"}}>
                        <div style={{fontSize:"11px", fontWeight:"700", letterSpacing:"0.08em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"4px"}}>{item.label}</div>
                        <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.5"}}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ROUTE 3 */}
                <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"20px", padding:"28px 32px"}}>
                  <div style={{display:"flex", alignItems:"center", gap:"14px", marginBottom:"16px"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"32px", fontWeight:"900", color:"#a0b4c4"}}>🥉</div>
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:"700", letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:"4px"}}>{lang==="es" ? "La Ruta Trasera" : lang==="pl" ? "Droga Tylnym Wejściem" : "The Backdoor Route"}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:"900", color:"#fff"}}>{lang==="es" ? "No Sindical → Sindical" : lang==="pl" ? "Niezwiązkowy → Związkowy" : "Non-Union → Union Flip"}</div>
                    </div>
                  </div>
                  <p style={{fontSize:"15px", color:"var(--muted)", lineHeight:"1.7", marginBottom:"16px"}}>
                    {lang==="es" ? "Empieza con una empresa no sindical, gana 6-18 meses de experiencia, y luego aplica al sindicato con esa experiencia — una gran ventaja. Esta es la ruta que tomó el fundador de Union Pathways." : lang==="pl" ? "Zacznij w firmie niezwiązkowej, zdobądź 6-18 miesięcy doświadczenia, a następnie aplikuj do związku z tym doświadczeniem — ogromna przewaga. To droga, którą obrał założyciel Union Pathways." : "Start with a non-union company, gain 6–18 months of experience, then apply to the union with that experience — a huge advantage. This is the route Union Pathways' founder took."}
                  </p>
                  <div style={{fontSize:"13px", color:"var(--muted)", lineHeight:"1.7"}}>
                    {lang==="es" ? "Funciona especialmente bien en: carpintería, obreros, concreto, techos, electricidad residencial." : lang==="pl" ? "Działa szczególnie dobrze w: ciesielstwie, robotnikach, betonie, pokryciach dachowych, elektryce mieszkaniowej." : "Works especially well in: carpentry, laborers, concrete, roofing, residential electrical."}
                  </div>
                </div>
              </div>
            </div>

            <hr className="divider-line"/>

            {/* STEP BY STEP */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Guía Paso a Paso — "}<span className="accent">Este Mes</span></> : lang==="pl" ? <>{"Przewodnik Krok po Kroku — "}<span className="accent">W Tym Miesiącu</span></> : <>{"Step-by-Step — "}<span className="accent">Start This Month</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "Si quisieras empezar este mes, esto es exactamente lo que debes hacer." : lang==="pl" ? "Jeśli chcesz zacząć w tym miesiącu, oto dokładnie co powinieneś zrobić." : "If you wanted to start this month, here's exactly what to do."}</div>

              <div className="timeline">
                {[
                  {
                    year: lang==="es" ? "Paso 1" : lang==="pl" ? "Krok 1" : "Step 1",
                    event: lang==="es" ? "Elige un Oficio — No te Lo Saltes" : lang==="pl" ? "Wybierz Zawód — Nie Pomijaj Tego" : "Pick a Trade — Don't Skip This",
                    desc: lang==="es" ? "Los oficios de mayor demanda: Electricista (IBEW), Plomero/Pipefitter (UA), HVAC, Carpintero, Obrero. Usa el quiz de Union Pathways si no estás seguro." : lang==="pl" ? "Zawody o największym popycie: Elektryk (IBEW), Hydraulik/Instalator (UA), HVAC, Cieśla, Robotnik. Użyj quizu Union Pathways, jeśli nie jesteś pewien." : "Top high-demand trades: Electrician (IBEW), Plumber/Pipefitter (UA), HVAC, Carpenter, Laborer. Use the Union Pathways quiz if you're unsure."
                  },
                  {
                    year: lang==="es" ? "Paso 2" : lang==="pl" ? "Krok 2" : "Step 2",
                    event: lang==="es" ? "Aplica Directamente al Aprendizaje" : lang==="pl" ? "Aplikuj Bezpośrednio do Praktyki" : "Apply Directly to Apprenticeship",
                    desc: lang==="es" ? "Busca: \"[tu ciudad] + aprendizaje sindical\" o ve directamente a los centros de formación sindical. Usa la función de búsqueda de Union Pathways para encontrar tu local más cercano." : lang==="pl" ? "Szukaj: \"[twoje miasto] + praktyka związkowa\" lub idź bezpośrednio do związkowych centrów szkoleniowych. Użyj funkcji wyszukiwania Union Pathways, aby znaleźć najbliższy lokal." : "Search: \"[your city] + union apprenticeship\" or go straight to union training centers. Use Union Pathways search to find your nearest local."
                  },
                  {
                    year: lang==="es" ? "Paso 3" : lang==="pl" ? "Krok 3" : "Step 3",
                    event: lang==="es" ? "Prepárate para la Prueba de Aptitud y Entrevista" : lang==="pl" ? "Przygotuj się na Test Predyspozycji i Rozmowę" : "Prepare for the Aptitude Test & Interview",
                    desc: lang==="es" ? "La mayoría requiere: matemáticas básicas, comprensión lectora, y confiabilidad (factor enorme). Practica álgebra básica y fracciones — eso es lo que más importa en la prueba." : lang==="pl" ? "Większość wymaga: podstawowej matematyki, rozumienia czytanego tekstu i niezawodności (ogromny czynnik). Ćwicz podstawową algebrę i ułamki — to jest najważniejsze w teście." : "Most require: basic math, reading comprehension, and reliability (huge factor). Practice basic algebra and fractions — that's what matters most on the test."
                  },
                  {
                    year: lang==="es" ? "Paso 4" : lang==="pl" ? "Krok 4" : "Step 4",
                    event: lang==="es" ? "Aplica a MÚLTIPLES Sindicatos" : lang==="pl" ? "Aplikuj do WIELU Związków" : "Apply to MULTIPLE Unions",
                    desc: lang==="es" ? "No esperes en uno solo — aplica a 3-5 al mismo tiempo. Esto solo puede reducir el tiempo de espera por meses o incluso años. Algunos sindicatos tienen listas de espera más cortas que otros." : lang==="pl" ? "Nie czekaj na jeden — aplikuj do 3-5 jednocześnie. Sam ten krok może skrócić czas oczekiwania o miesiące lub nawet lata. Niektóre związki mają krótsze listy oczekujących niż inne." : "Don't wait on one — apply to 3–5 at once. This alone can cut your wait time by months or years. Some unions have shorter waitlists than others."
                  },
                  {
                    year: lang==="es" ? "Paso 5" : lang==="pl" ? "Krok 5" : "Step 5 (Optional but Powerful)",
                    event: lang==="es" ? "Trabaja en Construcción Mientras Esperas" : lang==="pl" ? "Pracuj w Budownictwie Podczas Oczekiwania" : "Work Construction While You Wait",
                    desc: lang==="es" ? "Mientras esperas: consigue un trabajo de obrero. Construye experiencia y conexiones. Cuando apliques con experiencia, tienes una gran ventaja sobre alguien que nunca ha tocado una herramienta." : lang==="pl" ? "Podczas oczekiwania: zdobądź pracę robotnika. Buduj doświadczenie i kontakty. Gdy aplikujesz z doświadczeniem, masz ogromną przewagę nad kimś, kto nigdy nie dotknął narzędzia." : "While waiting: get a laborer job. Build experience and connections. When you apply with experience, you have a huge advantage over someone who has never touched a tool."
                  },
                ].map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"/>
                    <div className="timeline-year">{item.year}</div>
                    <div className="timeline-event">{item.event}</div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="divider-line"/>

            {/* WHAT ACTUALLY MATTERS */}
            <div className="history-section">
              <div className="history-section-title">{lang==="es" ? <>{"Lo que "}<span className="accent">Realmente Importa</span></> : lang==="pl" ? <>{"Co "}<span className="accent">Naprawdę Ma Znaczenie</span></> : <>{"What "}<span className="accent">Actually Matters</span></>}</div>
              <div className="history-section-sub">{lang==="es" ? "La verdad que la mayoría de la gente no sabe." : lang==="pl" ? "Prawda, której większość ludzi nie zna." : "The truth most people miss."}</div>

              <div className="impact-grid">
                <div className="impact-card" style={{borderColor:"rgba(250,128,89,0.2)"}}>
                  <div className="impact-icon">✅</div>
                  <div className="impact-title">{lang==="es" ? "Lo que les Importa a los Sindicatos" : lang==="pl" ? "Co Interesuje Związki" : "What Unions Actually Care About"}</div>
                  <div className="impact-desc">{lang==="es" ? "Presentarse — pasar las pruebas — disposición para trabajar — a veces conocer a alguien. Los sindicatos no se preocupan si tomaste un curso en línea o viste videos de entrenamiento." : lang==="pl" ? "Pojawianie się — zdawanie testów — gotowość do pracy — czasem znajomość kogoś. Związki nie dbają o to, czy wziąłeś kurs online lub oglądałeś filmy szkoleniowe." : "Showing up — passing tests — willingness to work — sometimes knowing someone. Unions don't care if you took an online course or watched training videos."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">⏳</div>
                  <div className="impact-title">{lang==="es" ? "La Realidad de las Listas de Espera" : lang==="pl" ? "Rzeczywistość List Oczekujących" : "The Waitlist Reality"}</div>
                  <div className="impact-desc">{lang==="es" ? "Los pipelines sindicales pueden ser competitivos, lentos y dependientes del momento y las conexiones. Aplica pronto. Aplica a múltiples. Y trabaja mientras esperas." : lang==="pl" ? "Związkowe pipeline mogą być konkurencyjne, powolne i zależne od czasu i kontaktów. Aplikuj wcześnie. Aplikuj do wielu. I pracuj podczas oczekiwania." : "Union pipelines can be competitive, slow, and dependent on timing and connections. Apply early. Apply to multiple. And work while you wait."}</div>
                </div>
                <div className="impact-card">
                  <div className="impact-icon">🎯</div>
                  <div className="impact-title">{lang==="es" ? "Ve Directamente a la Fuente" : lang==="pl" ? "Idź Bezpośrednio do Źródła" : "Go Straight to the Source"}</div>
                  <div className="impact-desc">{lang==="es" ? "Las plataformas solo de información — incluyendo esta — pueden enseñarte sobre el sistema. Pero los verdaderos guardianes son los locales sindicales, los centros de aprendizaje y los contratistas. Ve a verlos en persona." : lang==="pl" ? "Platformy tylko informacyjne — w tym ta — mogą nauczyć Cię o systemie. Ale prawdziwymi strażnikami są lokale związkowe, centra praktyk i wykonawcy. Idź do nich osobiście." : "Info-only platforms — including this one — can teach you about the system. But the real gatekeepers are union locals, apprenticeship centers, and contractors. Go see them in person."}</div>
                </div>
              </div>

              <div className="quote-block" style={{marginTop:32}}>
                <div className="quote-text">{lang==="es" ? '"Fui a una agencia temporal que me emparejó con una empresa eléctrica residencial no sindical. Después de 8 meses viendo la diferencia, di el salto al IBEW. Empecé como CW, completé el aprendizaje, me convertí en oficial y ahora soy superintendente. El mejor movimiento que hice."' : lang==="pl" ? '"Poszedłem do agencji pracy tymczasowej, która przydzieliła mnie do niezwiązkowej firmy elektrycznej. Po 8 miesiącach widzenia różnicy przeszedłem do IBEW. Zacząłem jako CW, ukończyłem praktykę, zostałem czeladnikiem i teraz jestem superintendentem. Najlepszy ruch, jaki zrobiłem."' : '"I went to a temp agency that paired me with a non-union residential electrical company. After 8 months seeing the difference, I made the jump to the IBEW. Started as a CW, completed the apprenticeship, became a journeyman, and now I work as a superintendent. Best move I ever made."'}</div>
                <div className="quote-author">— Noah, {lang==="es" ? "Fundador de Union Pathways" : lang==="pl" ? "Założyciel Union Pathways" : "Founder of Union Pathways"}</div>
              </div>

              <div style={{textAlign:"center", marginTop:48}}>
                <button className="btn-primary" onClick={() => setPage("home")}>
                  {lang==="es" ? "Encuentra tu Local Sindical →" : lang==="pl" ? "Znajdź Swój Lokalny Związek →" : "Find Your Union Local →"}
                </button>
              </div>
            </div>
          </div>
        )}

`;

code = code.slice(0, start) + newChecklist + code.slice(end);
fs.writeFileSync(filePath, code, 'utf8');
console.log('✅ Checklist page replaced with comprehensive How to Join guide');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: replace checklist with comprehensive How to Join guide" && git push\n');
