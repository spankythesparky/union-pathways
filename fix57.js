const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ADD localSection state ────────────────────────────────────────────────
if (!code.includes('const [localSection, setLocalSection]')) {
  code = code.replace(
    'const [partnerSection, setPartnerSection] = useState(null);',
    'const [partnerSection, setPartnerSection] = useState(null);\n  const [localSection, setLocalSection] = useState(null);'
  );
  console.log('✅ Added localSection state');
}

// ─── 2. ADD to valid pages ────────────────────────────────────────────────────
code = code.replace(
  "const validPages = ['home','quiz','careers','checklist','veterans','history','retirement','health','benefits','about','contact'];",
  "const validPages = ['home','quiz','careers','checklist','locals','veterans','history','retirement','health','benefits','about','contact'];"
);
console.log('✅ Added locals to valid pages');

// ─── 3. ADD page meta ─────────────────────────────────────────────────────────
code = code.replace(
  `      about:    { title: "Union Pathways — About Us"`,
  `      locals:   { title: "Union Pathways — Understanding Your Local", desc: "Learn about union jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models." },\n      about:    { title: "Union Pathways — About Us"`
);
console.log('✅ Added page meta');

// ─── 4. ADD nav link to Apprentice dropdown ───────────────────────────────────
const oldItem = `                  <div className={\`nav-dropdown-item\${page==="checklist"?" active":""}\`} onMouseDown={() => { setPage("checklist"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Cómo Unirse" : lang==="pl" ? "Jak Dołączyć" : "How to Join"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Las 3 rutas reales de entrada" : lang==="pl" ? "3 prawdziwe drogi wejścia" : "The 3 real entry routes"}</span>
                  </div>`;

const newItem = oldItem + `
                  <div className={\`nav-dropdown-item\${page==="locals"?" active":""}\`} onMouseDown={() => { setPage("locals"); setApprenticeOpen(false); }}>
                    <span className="nav-dropdown-label">{lang==="es" ? "Entendiendo tu Local" : lang==="pl" ? "Rozumienie Oddziału" : "Understanding Your Local"}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Jurisdicción, Libro 1 vs 2, trabajo de viaje" : lang==="pl" ? "Jurysdykcja, Księga 1 vs 2, praca w trasie" : "Jurisdiction, Book 1 vs 2, travel work & school"}</span>
                  </div>`;

if (!code.includes(oldItem)) { console.error('ERROR: checklist nav item not found'); process.exit(1); }
code = code.replace(oldItem, newItem);
console.log('✅ Added nav link');

// ─── 5. ADD THE PAGE before veterans ─────────────────────────────────────────
const pageMarker = '        {page === "veterans" && (';

const localsPage = `        {page === "locals" && (
          <div>
            <div className="history-hero">
              <div className="history-eyebrow">{lang==="es" ? "Lo que Nadie te Explica" : lang==="pl" ? "Czego Nikt Ci Nie Wyjasnil" : "What Nobody Explains to You"}</div>
              <h1 className="history-title">
                {lang==="es" ? <>{"Entendiendo "}<span className="accent">{"tu Local"}</span></> : lang==="pl" ? <>{"Rozumienie "}<span className="accent">{"Twojego Oddzialu"}</span></> : <>{"Understanding "}<span className="accent">{"Your Local"}</span></>}
              </h1>
              <p className="history-subtitle">
                {lang==="es" ? "La jurisdiccion, los libros de trabajo, los locales de origen y como funciona realmente el trabajo de viaje." : lang==="pl" ? "Jurysdykcja, ksiegi pracy, lokale macierzyste i jak naprawde dziala praca w trasie." : "Jurisdiction, work books, home locals, and how travel work and apprenticeship school actually functions — explained clearly by people who live it every day."}
              </p>
            </div>

            <div style={{maxWidth:900, margin:"0 auto", padding:"40px 24px 80px"}}>
              {[
                {
                  id:"jurisdiction",
                  title: lang==="es" ? "Jurisdiccion — El Territorio de tu Local" : lang==="pl" ? "Jurysdykcja — Terytorium Twojego Oddzialu" : "Jurisdiction — Your Local's Territory",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Cada local sindical tiene una jurisdiccion geografica definida — un territorio especifico donde tiene autoridad para representar a los trabajadores. Si vives o trabajas dentro de ese territorio, ese es el local al que deberias solicitar el ingreso." : lang==="pl" ? "Kazdy lokalny zwiazek zawodowy ma okreslona jurysdykcje geograficzna — specyficzne terytorium, na ktorym ma uprawnienia do reprezentowania pracownikow. Jesli mieszkasz lub pracujesz na tym terytorium, to do tego lokalnego oddzialu powinienes sie zglosic." : "Every union local has a defined geographic jurisdiction — a specific territory where it has authority to represent workers. Think of it like a district. If you live or work within that territory, that is the local you should be applying to."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Por Que Importa" : lang==="pl" ? "Dlaczego To Ma Znaczenie" : "Why It Matters", desc: lang==="es" ? "Solicitar al local incorrecto puede resultar en ser redirigido o en tiempos de espera mas largos. Los locales solo representan a trabajadores dentro de su jurisdiccion. Siempre verifica que el local cubra el area donde vives o donde planeas trabajar antes de aplicar." : lang==="pl" ? "Zlozenie wniosku do niewlasciwego lokalnego oddzialu moze skutkowac przekierowaniem lub dluzszym czasem oczekiwania. Zawsze sprawdz, czy lokalny oddział obejmuje obszar, w ktorym mieszkasz lub planujesz pracowac." : "Applying to the wrong local can result in being redirected or longer wait times. Locals only represent workers within their jurisdiction. Always verify the local covers the area where you live or plan to work before applying." },
                          { num:"02", title: lang==="es" ? "Como Encontrar el Tuyo" : lang==="pl" ? "Jak Znalezc Swoj" : "How to Find Yours", desc: lang==="es" ? "Usa la funcion de busqueda de Union Pathways para encontrar locales cercanos a tu codigo postal o ciudad. Cuando encuentres un local candidato, llama directamente o visita su sitio web para confirmar que tu direccion esta dentro de su jurisdiccion." : lang==="pl" ? "Uzyj funkcji wyszukiwania Union Pathways, aby znalezc lokale w poblizu swojego kodu pocztowego lub miasta. Gdy znajdziesz kandydujacego lokalnego, zadzwon bezposrednio lub odwiedz jego strone internetowa." : "Use the Union Pathways search to find locals near your ZIP code or city. When you find a candidate local, call them directly or visit their website to confirm your address falls within their jurisdiction before applying." },
                          { num:"03", title: lang==="es" ? "Las Fronteras Pueden Superponerse" : lang==="pl" ? "Granice Moga Sie Nakladac" : "Boundaries Can Overlap", desc: lang==="es" ? "En algunas areas metropolitanas, multiples locales pueden operar cerca entre si con territorios adyacentes. Si estas cerca de una linea de frontera, podrias tener opciones. Pregunta a ambos locales sobre cobertura de trabajo, listas de espera y condiciones actuales del mercado laboral antes de decidir." : lang==="pl" ? "W niektorych obszarach metropolitalnych wiele lokalnych oddzialow moze dzialac blisko siebie z przyleglymi terytoriami. Jesli jestes blisko linii granicznej, mozesz miec opcje. Zapytaj oba lokale o pokrycie pracy, listy oczekujacych i aktualne warunki rynku pracy." : "In some metro areas, multiple locals may operate near each other with adjacent territories. If you are near a boundary line, you may have options. Ask both locals about work coverage, wait lists, and current market conditions before deciding where to apply." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"books",
                  title: lang==="es" ? "Libro 1 vs Libro 2 — La Lista de Trabajo" : lang==="pl" ? "Ksiega 1 vs Ksiega 2 — Lista Pracy" : "Book 1 vs Book 2 — The Out-of-Work List",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:24}}>
                        {lang==="es" ? "Cuando un trabajador sindical esta desempleado y busca trabajo, se inscribe en la lista de desempleo de su local — comnmente llamada el libro. El local llama a los trabajadores de esta lista en orden cuando los contratistas solicitan mano de obra." : lang==="pl" ? "Kiedy pracownik zwiazowy jest bezrobotny i szuka pracy, rejestruje sie na liscie bezrobocia swojego lokalu — powszechnie nazywanej ksiega. Lokalny oddział dzwoni do pracownikow z tej listy w kolejnosci, gdy wykonawcy prosza o sile robocza." : "When a union worker is out of work and looking for a job, they sign the out-of-work list at their local — commonly called the book. The local calls workers from this list in order when contractors request labor. Your position on the book determines when you get dispatched."}
                      </p>
                      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16, marginBottom:24}}>
                        <div style={{background:"rgba(250,128,89,0.06)", border:"1px solid rgba(250,128,89,0.25)", borderRadius:16, padding:"24px"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#FA8059", marginBottom:8}}>{lang==="es" ? "Libro 1" : lang==="pl" ? "Ksiega 1" : "Book 1"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:12}}>{lang==="es" ? "Miembros del Local" : lang==="pl" ? "Czlonkowie Lokalnego" : "Home Local Members"}</div>
                          <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "La lista de trabajo primaria. Reservada para miembros en regla del local. Tienes prioridad sobre los viajeros. Cuando hay trabajo, el Libro 1 se llama primero. Estar en el Libro 1 significa que este es tu local de origen." : lang==="pl" ? "Podstawowa lista pracy. Zarezerwowana dla czlonkow lokalnego oddzialu w dobrej pozycji. Masz pierwszenstwo przed pracownikami w trasie. Ksiega 1 jest wywoływana pierwsza." : "The primary out-of-work list. Reserved for members in good standing of the local. You have priority over travelers. When work is available, Book 1 gets called first. Being on Book 1 means this is your home local."}</div>
                        </div>
                        <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"24px"}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#a0b4c4", marginBottom:8}}>{lang==="es" ? "Libro 2" : lang==="pl" ? "Ksiega 2" : "Book 2"}</div>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, color:"#fff", marginBottom:12}}>{lang==="es" ? "Viajeros" : lang==="pl" ? "Podrozownicy" : "Travelers"}</div>
                          <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "Para miembros de OTROS locales que buscan trabajo fuera de su territorio. El Libro 2 solo se llama cuando el Libro 1 esta agotado. Eres un visitante — el trabajo es secundario y tus beneficios siguen yendo a tu local de origen." : lang==="pl" ? "Dla czlonkow INNYCH lokalnych oddzialow szukajacych pracy poza swoim terytorium. Ksiega 2 jest wywoływana tylko gdy Ksiega 1 jest wyczerpana. Jestes goscie — Twoje swiadczenia nadal trafiaja do Twojego lokalnego macierzystego." : "For members from OTHER locals looking for work outside their home territory. Book 2 only gets called when Book 1 is exhausted. You are a visitor — work is secondary, and your benefits still go back to your home local."}</div>
                        </div>
                      </div>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:12, padding:"20px 24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8}}>{lang==="es" ? "La Regla Clave" : lang==="pl" ? "Kluczowa Zasada" : "The Key Rule"}</div>
                        <div style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "Si eres del Local A y viajas para trabajar en el territorio del Local B, te registras en el Libro 2 del Local B. Tienes trabajo — pero el Local B te llama despues de sus propios miembros del Libro 1. Cuando el trabajo termina, vuelves a casa." : lang==="pl" ? "Jesli jestes z Lokalu A i jedziesz do pracy na terytorium Lokalu B, rejestrujesz sie w Ksiedze 2 Lokalu B. Masz prace — ale Lokal B dzwoni do Ciebie po wlasnych czlonkach Ksiegi 1. Kiedy praca sie konczy, wracasz do domu." : "If you are from Local A and travel to work in Local B territory, you sign Book 2 at Local B. You get work — but Local B calls you after their own Book 1 members. When the job ends, you go home."}</div>
                      </div>
                    </div>
                  )
                },
                {
                  id:"homelocal",
                  title: lang==="es" ? "Tu Local de Origen — Elige con Cuidado" : lang==="pl" ? "Twoj Lokalny Macierzysty — Wybieraj Ostrozenie" : "Your Home Local — Choose Carefully",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Tu local de origen es el local donde eres miembro de pleno derecho. Es donde estan tus beneficios, tu pension, tu anualidad y tu representacion. Cuando te aceptan en un aprendizaje, el local que te acepta se convierte en tu local de origen. Esta es una decision de largo plazo." : lang==="pl" ? "Twoj lokalny macierzysty to lokalny oddział, w ktorym jestes pelnoletnim czlonkiem. To tutaj sa Twoje swiadczenia, emerytura, renta annuitetowa i reprezentacja. Gdy zostajesz przyjety do praktyki, lokalny, ktory Cie przyjmuje, staje sie Twoim macierzystym." : "Your home local is the local where you are a full dues-paying member. It is where your benefits live — pension, annuity, health insurance, and representation. When you get accepted into an apprenticeship, the local that accepts you becomes your home local. This is a long-term decision, not just a short-term one."}
                      </p>
                      <div className="impact-grid">
                        {[
                          { num:"01", title: lang==="es" ? "Tus Beneficios van Aqui" : lang==="pl" ? "Twoje Swiadczenia Trafiaja Tutaj" : "Your Benefits Live Here", desc: lang==="es" ? "No importa donde estes trabajando — tu pension, anualidad, seguro de salud y cuotas sindicales van a tu local de origen. Si estas viajando, el contratista alli aun contribuye a los fondos de beneficios, pero tu local de origen los gestiona." : lang==="pl" ? "Bez wzgledu na to, gdzie pracujesz — Twoja emerytura, renta annuitetowa, ubezpieczenie zdrowotne i skladki zwiazowe trafiaja do Twojego lokalnego macierzystego. Jesli jestes w trasie, wykonawca nadal wnosci wklad do funduszy swiadczen." : "No matter where you are working — your pension, annuity, health insurance, and union dues go to your home local. If you are traveling and working away from home, the contractor there still contributes to benefit funds, but your home local manages them." },
                          { num:"02", title: lang==="es" ? "Perspectiva de Trabajo y Geografia" : lang==="pl" ? "Perspektywy Pracy i Geografia" : "Work Outlook and Geography", desc: lang==="es" ? "Antes de solicitar, investiga cuanto trabajo hay disponible en el territorio del local. Un local en un mercado en crecimiento significa mas horas, mejores salarios y una carrera mas estable. Un local en un area con poco trabajo podria significar que viajas frecuentemente para mantenerte ocupado." : lang==="pl" ? "Przed zlozeniem wniosku zbadaj, ile pracy jest dostepne na terytorium lokalnego oddzialu. Lokalny oddział na rosnacym rynku oznacza wiecej godzin, lepsze wynagrodzenie i stabilniejsza kariere." : "Before applying, research how much work is available in the local territory. A local in a growing market means more hours, better wages, and a more stable career. A local in an area with little construction work might mean you frequently travel on Book 2 to stay busy." },
                          { num:"03", title: lang==="es" ? "Una Vez Dentro, Eres Miembro" : lang==="pl" ? "Raz Wewnatrz, Jestes Czlonkiem" : "Once In, You Are a Member", desc: lang==="es" ? "Una vez que te aceptan, ese local se convierte en tu hogar. Puedes transferirte mas tarde — pero no es simple y tiene implicaciones en tus beneficios. Es mucho mas facil elegir el local correcto desde el principio investigando geografia, perspectivas de trabajo y reputacion del local antes de aplicar." : lang==="pl" ? "Gdy zostaniesz przyjety do praktyki, ten lokalny oddział staje sie Twoim domem. Mozesz przeniesc sie pozniej — ale nie jest to proste i ma konsekwencje dla Twoich swiadczen." : "Once you are accepted, that local becomes your home. You can transfer later — but it is not simple and has benefit implications. It is much easier to choose the right local upfront by researching geography, work outlook, and the local reputation before applying." },
                        ].map((item, i) => (
                          <div key={i} className="impact-card">
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:"11px",fontWeight:"700",letterSpacing:"0.1em",color:"#FA8059",marginBottom:"12px",textTransform:"uppercase"}}>{item.num}</div>
                            <div className="impact-title">{item.title}</div>
                            <div className="impact-desc">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"travel",
                  title: lang==="es" ? "Trabajo de Viaje — Como Funciona Realmente" : lang==="pl" ? "Praca w Trasie — Jak To Naprawde Dziala" : "Travel Work — How It Actually Works",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Una de las ventajas mas poderosas de ser miembro sindical es la capacidad de viajar — tomar trabajo en otros locales cuando tu mercado local esta lento. Aqui esta como funciona en la practica." : lang==="pl" ? "Jedna z najpotezniejszych zalet bycia czlonkiem zwiazku jest mozliwosc podrozowania — przyjmowania pracy w innych lokalnych oddzialach, gdy Twoj lokalny rynek jest powolny." : "One of the most powerful advantages of being a union member is the ability to travel — taking work in other locals when your home market is slow. Here is how it works in practice."}
                      </p>
                      <div style={{display:"flex", flexDirection:"column", gap:12}}>
                        {[
                          { n:"01", title: lang==="es" ? "Verificar si el Local esta Llamando al Libro 2" : lang==="pl" ? "Sprawdz czy Lokalny Wywoluje Ksiege 2" : "Check if the Local Is Calling Book 2", desc: lang==="es" ? "Antes de viajar, llama al local en el area donde quieres trabajar. Pregunta si estan llamando al Libro 2 y cuanto tiempo podria ser la espera. Algunos locales tienen trabajo constante para viajeros — otros raramente llegan al Libro 2." : lang==="pl" ? "Przed podrozą zadzwon do lokalnego oddzialu w obszarze, w ktorym chcesz pracowac. Zapytaj, czy wywoluja Ksiege 2 i jak dlugo moze trwac oczekiwanie." : "Before traveling, call the local in the area where you want to work. Ask if they are calling Book 2 and how long the wait might be. Some locals have consistent work available for travelers — others rarely reach Book 2." },
                          { n:"02", title: lang==="es" ? "Registrarse en el Libro 2" : lang==="pl" ? "Zarejestruj sie w Ksiedze 2" : "Sign the Book 2", desc: lang==="es" ? "Cuando llegas, te presentas en la sala sindical con tu tarjeta de membresia y te registras en el Libro 2. El local te llama cuando un contratista solicita mano de obra y estas al frente de la linea del Libro 2." : lang==="pl" ? "Gdy przyjeżdżasz, zgłaszasz sie do sali zwiazowej z karta czlonkowska i rejestrujesz sie w Ksiedze 2. Lokalny oddzial dzwoni do Ciebie, gdy wykonawca prosi o sile robocza." : "When you arrive, you show up at the union hall with your membership card and sign Book 2. The local calls you when a contractor requests labor and you are at the front of the Book 2 line." },
                          { n:"03", title: lang==="es" ? "Tus Beneficios Siguen Yendo a Casa" : lang==="pl" ? "Twoje Swiadczenia Nadal Trafiaja do Domu" : "Your Benefits Still Go Home", desc: lang==="es" ? "Cuando trabajas fuera de tu local, el contratista local sigue contribuyendo a los fondos de beneficios — pero esas contribuciones se envian de vuelta a tu local de origen. Tu pension, anualidad y seguro de salud continuan acumulandose en tu local de origen." : lang==="pl" ? "Kiedy pracujesz poza swoim lokalnym oddzialem, lokalny wykonawca nadal wnosci wklad do funduszy swiadczen — ale te skladki sa odsylane z powrotem do Twojego lokalnego macierzystego." : "When you work outside your local, the contractor there still contributes to benefit funds — but those contributions get sent back to your home local. Your pension, annuity, and health insurance continue building at your home local as if you were working there." },
                          { n:"04", title: lang==="es" ? "Cuando Tiene Sentido Viajar" : lang==="pl" ? "Kiedy Podrozowanie Ma Sens" : "When Traveling Makes Sense", desc: lang==="es" ? "Viajar tiene mas sentido cuando tu mercado local esta lento. Tambien es una excelente manera de acumular horas de pension, ganar experiencia en diferentes tipos de trabajo y construir tu reputacion en multiples mercados. Algunos trabajadores construyen carreras enteras viajando de proyecto en proyecto." : lang==="pl" ? "Podrozowanie ma najwiekszy sens, gdy Twoj lokalny rynek jest powolny. To takze swietny sposob na gromadzenie godzin emerytalnych i zdobywanie doswiadczenia w roznych rodzajach pracy." : "Traveling makes the most sense when your local market is slow and you have fixed expenses to cover. It is also a great way to accumulate pension hours, gain experience on different job types, and build your reputation across multiple markets. Some workers build entire careers traveling from project to project." },
                        ].map((s, i) => (
                          <div key={i} style={{display:"flex", gap:16, alignItems:"flex-start", padding:"16px 20px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12}}>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:"#FA8059", minWidth:28}}>{s.n}</div>
                            <div>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:"#fff", marginBottom:4}}>{s.title}</div>
                              <div style={{fontSize:13, color:"var(--muted)", lineHeight:1.6}}>{s.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                },
                {
                  id:"school",
                  title: lang==="es" ? "Modelos de Escuela de Aprendizaje" : lang==="pl" ? "Modele Szkoly Praktycznej" : "Apprenticeship School Models — Not All Are the Same",
                  content: (
                    <div style={{marginTop:16}}>
                      <p style={{fontSize:15, color:"var(--muted)", lineHeight:1.7, marginBottom:20}}>
                        {lang==="es" ? "Uno de los aspectos menos entendidos del aprendizaje sindical es como funciona la escuela — especificamente, cuando vas y si te pagan por estar alli. La respuesta varia significativamente segun el local." : lang==="pl" ? "Jednym z najmniej rozumianych aspektow praktyki zwiazowej jest to, jak dziala szkola — konkretnie, kiedy chodzisz i czy placza ci za to. Odpowiedz rozni sie znacznie w zaleznosci od lokalnego oddzialu." : "One of the least understood aspects of the union apprenticeship is how school works — specifically, when you go and whether you get paid for being there. The answer varies significantly by local. Here is what you need to ask before applying."}
                      </p>
                      <div style={{display:"flex", flexDirection:"column", gap:16, marginBottom:24}}>
                        {[
                          { model: lang==="es" ? "Modelo 1 — Escuela Diurna Pagada" : lang==="pl" ? "Model 1 — Platna Szkola Dzienna" : "Model 1 — Paid Daytime School", highlight:true, tag: lang==="es" ? "Ejemplo: IBEW Local 38, Cleveland OH" : lang==="pl" ? "Przyklad: IBEW Local 38, Cleveland OH" : "Example: IBEW Local 38 — Cleveland, OH", desc: lang==="es" ? "En algunos locales — como el Local 38 de Cleveland — los aprendices van a la escuela durante el dia y el contratista paga por ese tiempo. Recibes tu salario de aprendiz incluso mientras estas en el aula. Es el mejor escenario posible. Tu tiempo de escuela cuenta como horas de trabajo para beneficios y progresion." : lang==="pl" ? "W niektorych lokalnych oddzialach — takich jak Local 38 w Cleveland — praktykanci chodza do szkoly w ciagu dnia, a wykonawca placi za ten czas. Otrzymujesz wynagrodzenie praktykanta nawet podczas przebywania w sali lekcyjnej. To najlepszy mozliwy scenariusz." : "In some locals — like Local 38 in Cleveland — apprentices go to school during the day and the contractor pays for that time. You receive your apprentice wage even while sitting in the classroom. It is the best possible scenario. Your school time counts as work hours for benefit and progression purposes." },
                          { model: lang==="es" ? "Modelo 2 — Escuela Diurna Sin Pago" : lang==="pl" ? "Model 2 — Szkola Dzienna Bez Wynagrodzenia" : "Model 2 — Unpaid Daytime School", highlight:false, tag: lang==="es" ? "Varia segun el local" : lang==="pl" ? "Rozni sie w zaleznosci od lokalu" : "Varies by local", desc: lang==="es" ? "Algunos locales envian a los aprendices a la escuela durante el dia, pero sin compensacion por el tiempo en el aula. Pierdes un dia de trabajo por semana para asistir a clase. Esto puede ser dificil financieramente al principio, especialmente para aprendices de primer ano con salarios mas bajos." : lang==="pl" ? "Niektore lokalne oddzialy wysylaja praktykantow do szkoly w ciagu dnia, ale nie ma wynagrodzenia za czas w sali lekcyjnej. Zasadniczo tracisz dzien pracy w tygodniu, aby chodzic na zajecia." : "Some locals send apprentices to school during the day, but there is no compensation for classroom time. You essentially lose a day of work per week to attend class. This can be financially tough early on, especially for first-year apprentices on lower wages." },
                          { model: lang==="es" ? "Modelo 3 — Escuela Nocturna Sin Pago" : lang==="pl" ? "Model 3 — Szkola Wieczorowa Bez Wynagrodzenia" : "Model 3 — Unpaid Evening School", highlight:false, tag: lang==="es" ? "El modelo mas comun en EE.UU." : lang==="pl" ? "Najpopularniejszy model w USA" : "Most common model across the US", desc: lang==="es" ? "El modelo mas prevalente. Los aprendices trabajan sus horas regulares durante el dia y luego van a la escuela por las noches — tipicamente una o dos noches por semana. Son dias largos, especialmente en invierno, pero permite mantener ingresos completos mientras se obtiene educacion." : lang==="pl" ? "Najbardziej rozpowszechniony model. Praktykanci pracuja swoje regularne godziny w ciagu dnia, a nastepnie chodza do szkoly wieczorami — zazwyczaj jedną lub dwie noce w tygodniu. To dlugie dni, szczegolnie zima." : "The most prevalent model. Apprentices work their regular hours during the day, then go to school in the evenings — typically one or two nights per week. There is no additional pay for school time. These are long days, especially in winter, but it allows you to maintain full work income while getting your education." },
                        ].map((m, i) => (
                          <div key={i} style={{background: m.highlight ? "rgba(250,128,89,0.06)" : "rgba(255,255,255,0.02)", border: m.highlight ? "1px solid rgba(250,128,89,0.25)" : "1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"24px"}}>
                            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, flexWrap:"wrap", gap:8}}>
                              <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: m.highlight ? "#FA8059" : "#fff"}}>{m.model}</div>
                              <div style={{fontSize:12, fontWeight:700, color: m.highlight ? "#FA8059" : "var(--muted)", background: m.highlight ? "rgba(250,128,89,0.1)" : "rgba(255,255,255,0.06)", borderRadius:50, padding:"4px 12px", letterSpacing:"0.06em", textTransform:"uppercase"}}>{m.tag}</div>
                            </div>
                            <div style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>{m.desc}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{background:"rgba(34,48,61,0.5)", border:"1px solid rgba(58,80,104,0.4)", borderRadius:12, padding:"20px 24px"}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#FA8059", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8}}>{lang==="es" ? "Siempre Pregunta Antes de Aplicar" : lang==="pl" ? "Zawsze Pytaj Przed Zlozeniem Wniosku" : "Always Ask Before You Apply"}</div>
                        <div style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>{lang==="es" ? "El modelo de escuela no siempre esta anunciado en linea. Llama directamente al coordinador del aprendizaje y pregunta: Como funciona la escuela? Es durante el dia o por la noche? Los aprendices reciben compensacion por el tiempo escolar? Esta informacion podria afectar significativamente tu planificacion financiera." : lang==="pl" ? "Model szkoly nie zawsze jest oglaszany online. Zadzwon bezposrednio do koordynatora praktyki i zapytaj: Jak dziala szkola? Czy odbywa sie w ciagu dnia czy wieczorem? Czy praktykanci otrzymuja wynagrodzenie za czas szkolny?" : "The school model is not always advertised online. Call the local apprenticeship coordinator directly and ask: How does school work? Is it held during the day or in the evening? Do apprentices receive compensation for school time? This information could significantly affect your financial planning."}</div>
                      </div>
                    </div>
                  )
                },
              ].map((section) => (
                <div key={section.id} style={{marginBottom:12, border: localSection===section.id ? "1px solid rgba(250,128,89,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden"}}>
                  <button
                    onClick={() => setLocalSection(localSection===section.id ? null : section.id)}
                    style={{width:"100%", background:"rgba(255,255,255,0.02)", border:"none", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left"}}
                  >
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color: localSection===section.id ? "#FA8059" : "#fff"}}>{section.title}</span>
                    <span style={{color:"#FA8059", fontSize:22, fontWeight:700, lineHeight:1, transform: localSection===section.id ? "rotate(45deg)" : "rotate(0deg)", display:"inline-block", transition:"transform 0.2s"}}>+</span>
                  </button>
                  {localSection===section.id && (
                    <div style={{padding:"0 24px 24px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

`;

if (!code.includes(pageMarker)) { console.error('ERROR: veterans marker not found'); process.exit(1); }
code = code.replace(pageMarker, localsPage + pageMarker);
console.log('✅ Added Understanding Your Local page');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add Understanding Your Local page" && git push\n');
