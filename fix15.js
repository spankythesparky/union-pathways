const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const careerData = `
  const CAREER_DATA = {
    en: {
      title: "Career Path in the Union Trades",
      sub: "Every trade offers a structured path from apprentice to master — earning real wages the entire way. No student debt. No unpaid internships.",
      stages: [
        { stage: "Apprentice", years: "Years 1–5", pay: "$18–35/hr", icon: "📋", desc: "You're enrolled in a registered apprenticeship — working full-time on the job while attending trade school. Your wage increases every 6 months. You earn benefits from day one." },
        { stage: "Journeyman", years: "5+ Years", pay: "$35–75/hr", icon: "🔨", desc: "You've completed your apprenticeship and earned your journeyman card. You can work anywhere your union has jurisdiction. Full wages, full benefits, full pension contributions." },
        { stage: "Foreman", years: "8–15 Years", pay: "$45–90/hr", icon: "📐", desc: "Experienced journeymen step into foreman roles — leading crews, reading plans, coordinating materials. Foreman pay includes a premium on top of journeyman scale." },
        { stage: "General Foreman / Super", years: "15+ Years", pay: "$75–120k+/yr", icon: "🏗️", desc: "Managing multiple crews and subcontractors on major projects. Often salaried. Some move into project management, estimating, or inspection roles." },
        { stage: "Master / Business Owner", years: "Varies", pay: "Unlimited", icon: "⭐", desc: "With a master's license (where applicable) you can pull permits and run your own contracting company — while still enjoying union scale on public and prevailing wage work." },
      ],
      whyUnion: [
        { label: "Pension", icon: "💰", desc: "Defined benefit pensions that pay you for life after retirement — rare in today's economy." },
        { label: "Health Insurance", icon: "🏥", desc: "Full family health coverage, often with no premium for the worker. Dental and vision included." },
        { label: "Apprenticeship", icon: "🎓", desc: "Earn while you learn. No student loans. Training paid for by the industry." },
        { label: "Annuity / 401k", icon: "📈", desc: "Additional retirement savings on top of your pension, contributed by employers." },
        { label: "Paid Holidays", icon: "📅", desc: "Union contracts typically include paid holidays, vacation funds, and sick leave." },
        { label: "Safety", icon: "🦺", desc: "Union job sites have strict safety standards. Union members have the right to refuse unsafe work." },
      ],
      stats: [
        { num: "$63/hr", label: "Average journeyman wage in major metro markets" },
        { num: "$0", label: "Cost of apprenticeship training to the worker" },
        { num: "5 Years", label: "Typical apprenticeship length — shorter than a college degree" },
        { num: "300%+", label: "More likely to have employer-provided health insurance" },
      ]
    },
    es: {
      title: "Trayectoria Profesional en los Oficios Sindicales",
      sub: "Cada oficio ofrece un camino estructurado de aprendiz a maestro — ganando salarios reales durante todo el proceso. Sin deuda estudiantil. Sin pasantías sin pago.",
      stages: [
        { stage: "Aprendiz", years: "Años 1–5", pay: "$18–35/hr", icon: "📋", desc: "Estás inscrito en un aprendizaje registrado — trabajando a tiempo completo mientras asistes a la escuela de oficios. Tu salario aumenta cada 6 meses. Recibes beneficios desde el primer día." },
        { stage: "Oficial", years: "5+ Años", pay: "$35–75/hr", icon: "🔨", desc: "Completaste tu aprendizaje y obtuviste tu tarjeta de oficial. Puedes trabajar donde tu sindicato tenga jurisdicción. Salarios completos, beneficios completos, contribuciones completas de pensión." },
        { stage: "Capataz", years: "8–15 Años", pay: "$45–90/hr", icon: "📐", desc: "Los oficiales experimentados asumen roles de capataz — liderando cuadrillas, leyendo planos, coordinando materiales. El pago de capataz incluye una prima sobre la escala de oficial." },
        { stage: "Capataz General / Superintendent", years: "15+ Años", pay: "$75–120k+/año", icon: "🏗️", desc: "Gestionar múltiples cuadrillas y subcontratistas en proyectos importantes. A menudo asalariado." },
        { stage: "Maestro / Propietario", years: "Varía", pay: "Ilimitado", icon: "⭐", desc: "Con una licencia de maestro puedes sacar permisos y manejar tu propia empresa contratista." },
      ],
      whyUnion: [
        { label: "Pensión", icon: "💰", desc: "Pensiones de beneficio definido que te pagan de por vida después de la jubilación." },
        { label: "Seguro Médico", icon: "🏥", desc: "Cobertura médica familiar completa, a menudo sin prima para el trabajador." },
        { label: "Aprendizaje", icon: "🎓", desc: "Gana mientras aprendes. Sin préstamos estudiantiles. Capacitación pagada por la industria." },
        { label: "Anualidad / 401k", icon: "📈", desc: "Ahorros adicionales para la jubilación además de tu pensión, aportados por los empleadores." },
        { label: "Días Festivos Pagados", icon: "📅", desc: "Los contratos sindicales incluyen días festivos pagados, fondos de vacaciones y licencia por enfermedad." },
        { label: "Seguridad", icon: "🦺", desc: "Los sitios de trabajo sindicales tienen estrictas normas de seguridad." },
      ],
      stats: [
        { num: "$63/hr", label: "Salario promedio de oficial en grandes mercados metropolitanos" },
        { num: "$0", label: "Costo del aprendizaje para el trabajador" },
        { num: "5 Años", label: "Duración típica del aprendizaje — más corto que una carrera universitaria" },
        { num: "300%+", label: "Más probabilidades de tener seguro médico proporcionado por el empleador" },
      ]
    },
    pl: {
      title: "Ścieżka Kariery w Zawodach Związkowych",
      sub: "Każdy zawód oferuje ustrukturyzowaną ścieżkę od praktykanta do mistrza — zarabiając prawdziwe wynagrodzenie przez cały czas. Bez długu studenckiego. Bez bezpłatnych staży.",
      stages: [
        { stage: "Praktykant", years: "Lata 1–5", pay: "$18–35/hr", icon: "📋", desc: "Jesteś zapisany na zarejestrowaną praktykę — pracujesz w pełnym wymiarze godzin, jednocześnie uczęszczając do szkoły zawodowej. Twoje wynagrodzenie rośnie co 6 miesięcy. Otrzymujesz świadczenia od pierwszego dnia." },
        { stage: "Czeladnik", years: "5+ Lat", pay: "$35–75/hr", icon: "🔨", desc: "Ukończyłeś praktykę i zdobyłeś kartę czeladniczą. Możesz pracować wszędzie, gdzie Twój związek ma jurysdykcję. Pełne wynagrodzenie, pełne świadczenia, pełne składki emerytalne." },
        { stage: "Brygadzista", years: "8–15 Lat", pay: "$45–90/hr", icon: "📐", desc: "Doświadczeni czeladnicy przejmują role brygadzistów — kierując ekipami, czytając plany, koordynując materiały." },
        { stage: "Brygadzista Generalny / Superintendent", years: "15+ Lat", pay: "$75–120k+/rok", icon: "🏗️", desc: "Zarządzanie wieloma ekipami i podwykonawcami przy dużych projektach. Często na etacie." },
        { stage: "Mistrz / Właściciel firmy", years: "Różnie", pay: "Bez ograniczeń", icon: "⭐", desc: "Z licencją mistrzowską możesz wystawiać pozwolenia i prowadzić własną firmę wykonawczą." },
      ],
      whyUnion: [
        { label: "Emerytura", icon: "💰", desc: "Emerytury ze zdefiniowanym świadczeniem, które wypłacają Ci pieniądze przez całe życie po przejściu na emeryturę." },
        { label: "Ubezpieczenie zdrowotne", icon: "🏥", desc: "Pełne ubezpieczenie zdrowotne rodziny, często bez składki dla pracownika." },
        { label: "Praktyka zawodowa", icon: "🎓", desc: "Zarabiaj ucząc się. Bez pożyczek studenckich. Szkolenie opłacane przez branżę." },
        { label: "Renta / 401k", icon: "📈", desc: "Dodatkowe oszczędności emerytalne ponad Twoją emeryturę, wnoszone przez pracodawców." },
        { label: "Płatne święta", icon: "📅", desc: "Umowy związkowe zazwyczaj obejmują płatne święta, fundusze urlopowe i zwolnienia chorobowe." },
        { label: "Bezpieczeństwo", icon: "🦺", desc: "Place budowy związkowe mają rygorystyczne standardy bezpieczeństwa." },
      ],
      stats: [
        { num: "$63/hr", label: "Średnie wynagrodzenie czeladnika na głównych rynkach miejskich" },
        { num: "$0", label: "Koszt szkolenia praktycznego dla pracownika" },
        { num: "5 Lat", label: "Typowa długość praktyki — krótsza niż studia wyższe" },
        { num: "300%+", label: "Większe prawdopodobieństwo posiadania ubezpieczenia zdrowotnego od pracodawcy" },
      ]
    }
  };
`;

// Insert before useEffect
const marker = '  useEffect(() => {';
const idx = code.indexOf(marker);
if (idx === -1) { console.error('ERROR: useEffect marker not found'); process.exit(1); }
code = code.slice(0, idx) + careerData + '\n' + code.slice(idx);
console.log('✅ CAREER_DATA restored');

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: restore CAREER_DATA" && git push\n');
