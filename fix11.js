const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── NEW QUIZ DATA ─────────────────────────────────────────────────────────────
// Uses 'scores' arrays: each answer is an object mapping trade abbr to points
// Higher points = stronger match for that trade

const newQuiz = `  // ── QUIZ DATA ───────────────────────────────────────────────────────────────
  const QUIZ = {
    en: [
      {
        q: "What type of work appeals to you most?",
        options: [
          "Electrical systems — wiring, power, controls, and technology",
          "Power lines and utility infrastructure — working outdoors on the grid",
          "Pipes, plumbing, gas lines, and heating/cooling systems",
          "Sheet metal, ductwork, and HVAC systems",
          "Structural steel — building the skeleton of bridges and skyscrapers",
          "Brick, stone, tile, and masonry construction",
          "Wood framing, finish carpentry, and millwork",
          "Painting, coatings, and surface finishing",
          "Insulation and protecting industrial equipment",
          "Operating heavy equipment — cranes, bulldozers, excavators",
          "General construction labor — site prep, demolition, concrete",
          "Fire protection and sprinkler systems",
          "Elevators, escalators, and vertical transportation",
          "Boilers, pressure vessels, and industrial steam systems",
          "Hauling materials and driving heavy trucks on job sites",
        ],
        scores: [
          { IBEW_I: 3 },
          { IBEW_L: 3 },
          { UA: 3 },
          { SMART: 3 },
          { IW: 3 },
          { BAC: 3 },
          { UBC: 3 },
          { IUPAT: 3 },
          { HFIAW: 3 },
          { IUOE: 3 },
          { LIUNA: 3 },
          { SF: 3 },
          { IUEC: 3 },
          { IABSORIW: 3 },
          { IBT: 3 },
        ]
      },
      {
        q: "Which work environment sounds most exciting to you?",
        options: [
          "Inside commercial buildings — offices, hospitals, data centers",
          "Outdoors on power lines, substations, and utility infrastructure",
          "On large industrial sites — refineries, power plants, factories",
          "High in the air — on bridges, high-rises, or transmission towers",
          "Underground — tunnels, excavations, and below-grade work",
          "On residential job sites — homes and apartment buildings",
          "Moving between many types of job sites — variety every day",
        ],
        scores: [
          { IBEW_I: 2, SMART: 1, UA: 1, HFIAW: 1, IUPAT: 1, UBC: 1 },
          { IBEW_L: 2, IW: 1 },
          { HFIAW: 2, UA: 2, IABSORIW: 2, LIUNA: 1, IUOE: 1 },
          { IW: 2, IBEW_L: 2, IUEC: 1 },
          { LIUNA: 2, UA: 1, IBT: 1 },
          { UBC: 2, BAC: 1, IUPAT: 1, UA: 1 },
          { LIUNA: 1, IBT: 1, IUOE: 1, UBC: 1, IUPAT: 1 },
        ]
      },
      {
        q: "How do you feel about working at significant heights?",
        options: [
          "I love it — the higher the better",
          "I'm comfortable at heights when needed",
          "Somewhat comfortable — I can handle it",
          "I prefer to stay close to the ground",
        ],
        scores: [
          { IBEW_L: 2, IW: 2, IUEC: 1 },
          { IBEW_I: 1, SMART: 1, UBC: 1, IUEC: 1 },
          { UA: 1, BAC: 1, HFIAW: 1, IUPAT: 1 },
          { LIUNA: 1, BAC: 1, OPCMIA: 1, UA: 1, IABSORIW: 1 },
        ]
      },
      {
        q: "Which best describes your working style?",
        options: [
          "Precision technical work — reading plans, problem solving",
          "Heavy physical labor — building, lifting, pouring",
          "Operating machinery and equipment",
          "Artistic and detail-oriented finishing work",
          "Safety-critical work with specialized systems",
        ],
        scores: [
          { IBEW_I: 2, UA: 2, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IW: 2, LIUNA: 2, BAC: 1, OPCMIA: 1, UBC: 1 },
          { IUOE: 2, IBT: 2, IW: 1 },
          { IUPAT: 2, BAC: 1, UBC: 1 },
          { SF: 2, IABSORIW: 2, HFIAW: 1, UA: 1 },
        ]
      },
      {
        q: "What kind of projects do you want to work on?",
        options: [
          "Massive infrastructure — dams, highways, bridges, stadiums",
          "Large commercial construction — hospitals, airports, office towers",
          "Industrial — power plants, refineries, chemical facilities",
          "Residential — homes, apartments, neighborhoods",
          "Specialty systems — fire protection, elevators, escalators",
        ],
        scores: [
          { IW: 2, LIUNA: 2, IUOE: 2, IBT: 1 },
          { IBEW_I: 2, UA: 1, SMART: 1, BAC: 1, HFIAW: 1 },
          { HFIAW: 2, IABSORIW: 2, UA: 2, LIUNA: 1 },
          { UBC: 2, IUPAT: 2, BAC: 1, UA: 1 },
          { SF: 2, IUEC: 2, IBEW_I: 1 },
        ]
      },
      {
        q: "What matters most to you in a career?",
        options: [
          "Top pay and overtime potential",
          "Learning advanced technical skills and becoming a specialist",
          "Physical outdoor work and variety every day",
          "Being part of a tight-knit skilled crew",
          "A clear path to supervision, management, or owning a business",
          "Job stability, strong benefits, and a solid pension",
        ],
        scores: [
          { IBEW_I: 1, IBEW_L: 1, IW: 1, IUEC: 1 },
          { IBEW_I: 1, UA: 1, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IBEW_L: 1, IW: 1, IUOE: 1, LIUNA: 1 },
          { IW: 1, BAC: 1, UBC: 1, HFIAW: 1, IABSORIW: 1 },
          { UBC: 1, UA: 1, IBEW_I: 1 },
          { UA: 1, SMART: 1, BAC: 1, LIUNA: 1 },
        ]
      },
    ],
    es: [
      {
        q: "¿Qué tipo de trabajo te atrae más?",
        options: [
          "Sistemas eléctricos — cableado, energía, controles y tecnología",
          "Líneas eléctricas e infraestructura de servicios — trabajo al aire libre",
          "Tuberías, plomería, gas y sistemas de calefacción/refrigeración",
          "Chapa metálica, conductos y sistemas HVAC",
          "Acero estructural — construyendo puentes y rascacielos",
          "Ladrillo, piedra, azulejo y mampostería",
          "Marcos de madera, carpintería y ebanistería",
          "Pintura, recubrimientos y acabados superficiales",
          "Aislamiento y protección de equipos industriales",
          "Operar maquinaria pesada — grúas, bulldozers, excavadoras",
          "Trabajo general de construcción — preparación, demolición, concreto",
          "Protección contra incendios y sistemas de rociadores",
          "Ascensores, escaleras mecánicas y transporte vertical",
          "Calderas, recipientes a presión y sistemas de vapor industrial",
          "Transportar materiales y conducir camiones pesados en obras",
        ],
        scores: [
          { IBEW_I: 3 }, { IBEW_L: 3 }, { UA: 3 }, { SMART: 3 }, { IW: 3 },
          { BAC: 3 }, { UBC: 3 }, { IUPAT: 3 }, { HFIAW: 3 }, { IUOE: 3 },
          { LIUNA: 3 }, { SF: 3 }, { IUEC: 3 }, { IABSORIW: 3 }, { IBT: 3 },
        ]
      },
      {
        q: "¿Qué ambiente de trabajo te parece más emocionante?",
        options: [
          "Dentro de edificios comerciales — oficinas, hospitales, centros de datos",
          "Al aire libre en líneas eléctricas y subestaciones",
          "En grandes sitios industriales — refinerías, plantas de energía",
          "En las alturas — puentes, rascacielos o torres de transmisión",
          "Bajo tierra — túneles, excavaciones y trabajo subterráneo",
          "En obras residenciales — casas y edificios de apartamentos",
          "Moviéndome entre muchos tipos de obras — variedad todos los días",
        ],
        scores: [
          { IBEW_I: 2, SMART: 1, UA: 1, HFIAW: 1, IUPAT: 1, UBC: 1 },
          { IBEW_L: 2, IW: 1 },
          { HFIAW: 2, UA: 2, IABSORIW: 2, LIUNA: 1, IUOE: 1 },
          { IW: 2, IBEW_L: 2, IUEC: 1 },
          { LIUNA: 2, UA: 1, IBT: 1 },
          { UBC: 2, BAC: 1, IUPAT: 1, UA: 1 },
          { LIUNA: 1, IBT: 1, IUOE: 1, UBC: 1, IUPAT: 1 },
        ]
      },
      {
        q: "¿Cómo te sientes trabajando a gran altura?",
        options: [
          "Me encanta — cuanto más alto, mejor",
          "Cómodo cuando es necesario",
          "Algo cómodo — puedo manejarlo",
          "Prefiero quedarme cerca del suelo",
        ],
        scores: [
          { IBEW_L: 2, IW: 2, IUEC: 1 },
          { IBEW_I: 1, SMART: 1, UBC: 1, IUEC: 1 },
          { UA: 1, BAC: 1, HFIAW: 1, IUPAT: 1 },
          { LIUNA: 1, BAC: 1, OPCMIA: 1, UA: 1, IABSORIW: 1 },
        ]
      },
      {
        q: "¿Cuál describe mejor tu estilo de trabajo?",
        options: [
          "Trabajo técnico de precisión — leer planos, resolver problemas",
          "Trabajo físico intenso — construir, levantar, verter concreto",
          "Operar maquinaria y equipos",
          "Trabajo artístico y de acabado detallado",
          "Trabajo crítico de seguridad con sistemas especializados",
        ],
        scores: [
          { IBEW_I: 2, UA: 2, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IW: 2, LIUNA: 2, BAC: 1, OPCMIA: 1, UBC: 1 },
          { IUOE: 2, IBT: 2, IW: 1 },
          { IUPAT: 2, BAC: 1, UBC: 1 },
          { SF: 2, IABSORIW: 2, HFIAW: 1, UA: 1 },
        ]
      },
      {
        q: "¿En qué tipo de proyectos quieres trabajar?",
        options: [
          "Infraestructura masiva — presas, carreteras, puentes, estadios",
          "Construcción comercial grande — hospitales, aeropuertos, torres",
          "Industrial — plantas de energía, refinerías, instalaciones químicas",
          "Residencial — casas, apartamentos, vecindarios",
          "Sistemas especiales — protección contra incendios, ascensores",
        ],
        scores: [
          { IW: 2, LIUNA: 2, IUOE: 2, IBT: 1 },
          { IBEW_I: 2, UA: 1, SMART: 1, BAC: 1, HFIAW: 1 },
          { HFIAW: 2, IABSORIW: 2, UA: 2, LIUNA: 1 },
          { UBC: 2, IUPAT: 2, BAC: 1, UA: 1 },
          { SF: 2, IUEC: 2, IBEW_I: 1 },
        ]
      },
      {
        q: "¿Qué es lo más importante para ti en una carrera?",
        options: [
          "Máximo salario y potencial de horas extras",
          "Aprender habilidades técnicas avanzadas y especializarme",
          "Trabajo físico al aire libre y variedad todos los días",
          "Ser parte de un equipo unido y especializado",
          "Un camino claro hacia la supervisión o tener mi propio negocio",
          "Estabilidad, buenos beneficios y pensión sólida",
        ],
        scores: [
          { IBEW_I: 1, IBEW_L: 1, IW: 1, IUEC: 1 },
          { IBEW_I: 1, UA: 1, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IBEW_L: 1, IW: 1, IUOE: 1, LIUNA: 1 },
          { IW: 1, BAC: 1, UBC: 1, HFIAW: 1, IABSORIW: 1 },
          { UBC: 1, UA: 1, IBEW_I: 1 },
          { UA: 1, SMART: 1, BAC: 1, LIUNA: 1 },
        ]
      },
    ],
    pl: [
      {
        q: "Jaki rodzaj pracy najbardziej Cię przyciąga?",
        options: [
          "Systemy elektryczne — okablowanie, zasilanie, sterowanie i technologia",
          "Linie energetyczne i infrastruktura sieci — praca na zewnątrz",
          "Rury, instalacje wod-kan, gaz i systemy grzewcze/chłodnicze",
          "Blacha, kanały wentylacyjne i systemy HVAC",
          "Stal konstrukcyjna — budowanie mostów i wieżowców",
          "Cegła, kamień, glazura i murarstwo",
          "Szkielet drewniany, stolarka i wykończenie",
          "Malowanie, powłoki i wykończenie powierzchni",
          "Izolacja i ochrona urządzeń przemysłowych",
          "Obsługa ciężkiego sprzętu — dźwigi, buldożery, koparki",
          "Ogólne roboty budowlane — przygotowanie terenu, wyburzenia, beton",
          "Ochrona przeciwpożarowa i systemy tryskaczowe",
          "Windy, schody ruchome i transport pionowy",
          "Kotły, zbiorniki ciśnieniowe i przemysłowe systemy parowe",
          "Transport materiałów i prowadzenie ciężkich pojazdów na budowie",
        ],
        scores: [
          { IBEW_I: 3 }, { IBEW_L: 3 }, { UA: 3 }, { SMART: 3 }, { IW: 3 },
          { BAC: 3 }, { UBC: 3 }, { IUPAT: 3 }, { HFIAW: 3 }, { IUOE: 3 },
          { LIUNA: 3 }, { SF: 3 }, { IUEC: 3 }, { IABSORIW: 3 }, { IBT: 3 },
        ]
      },
      {
        q: "Które środowisko pracy brzmi dla Ciebie najbardziej ekscytująco?",
        options: [
          "Wewnątrz budynków komercyjnych — biura, szpitale, centra danych",
          "Na zewnątrz przy liniach energetycznych i podstacjach",
          "Na dużych obiektach przemysłowych — rafinerie, elektrownie",
          "Na wysokości — mosty, wieżowce lub wieże transmisyjne",
          "Pod ziemią — tunele, wykopy i roboty podziemne",
          "Na budowach mieszkaniowych — domy i budynki wielorodzinne",
          "Przemieszczam się między różnymi placami budowy — różnorodność",
        ],
        scores: [
          { IBEW_I: 2, SMART: 1, UA: 1, HFIAW: 1, IUPAT: 1, UBC: 1 },
          { IBEW_L: 2, IW: 1 },
          { HFIAW: 2, UA: 2, IABSORIW: 2, LIUNA: 1, IUOE: 1 },
          { IW: 2, IBEW_L: 2, IUEC: 1 },
          { LIUNA: 2, UA: 1, IBT: 1 },
          { UBC: 2, BAC: 1, IUPAT: 1, UA: 1 },
          { LIUNA: 1, IBT: 1, IUOE: 1, UBC: 1, IUPAT: 1 },
        ]
      },
      {
        q: "Jak czujesz się pracując na dużych wysokościach?",
        options: [
          "Uwielbiam — im wyżej, tym lepiej",
          "Komfortowo, gdy jest to konieczne",
          "Dość komfortowo — dam radę",
          "Wolę pozostać blisko ziemi",
        ],
        scores: [
          { IBEW_L: 2, IW: 2, IUEC: 1 },
          { IBEW_I: 1, SMART: 1, UBC: 1, IUEC: 1 },
          { UA: 1, BAC: 1, HFIAW: 1, IUPAT: 1 },
          { LIUNA: 1, BAC: 1, OPCMIA: 1, UA: 1, IABSORIW: 1 },
        ]
      },
      {
        q: "Co najlepiej opisuje Twój styl pracy?",
        options: [
          "Precyzyjna praca techniczna — czytanie planów, rozwiązywanie problemów",
          "Ciężka praca fizyczna — budowanie, dźwiganie, wylewanie betonu",
          "Obsługa maszyn i sprzętu",
          "Artystyczna i szczegółowa praca wykończeniowa",
          "Praca o krytycznym znaczeniu dla bezpieczeństwa ze specjalistycznymi systemami",
        ],
        scores: [
          { IBEW_I: 2, UA: 2, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IW: 2, LIUNA: 2, BAC: 1, OPCMIA: 1, UBC: 1 },
          { IUOE: 2, IBT: 2, IW: 1 },
          { IUPAT: 2, BAC: 1, UBC: 1 },
          { SF: 2, IABSORIW: 2, HFIAW: 1, UA: 1 },
        ]
      },
      {
        q: "Przy jakich projektach chcesz pracować?",
        options: [
          "Ogromna infrastruktura — tamy, autostrady, mosty, stadiony",
          "Duże budownictwo komercyjne — szpitale, lotniska, wieżowce",
          "Przemysłowe — elektrownie, rafinerie, zakłady chemiczne",
          "Mieszkaniowe — domy, apartamenty, osiedla",
          "Systemy specjalistyczne — ochrona pożarowa, windy",
        ],
        scores: [
          { IW: 2, LIUNA: 2, IUOE: 2, IBT: 1 },
          { IBEW_I: 2, UA: 1, SMART: 1, BAC: 1, HFIAW: 1 },
          { HFIAW: 2, IABSORIW: 2, UA: 2, LIUNA: 1 },
          { UBC: 2, IUPAT: 2, BAC: 1, UA: 1 },
          { SF: 2, IUEC: 2, IBEW_I: 1 },
        ]
      },
      {
        q: "Co jest dla Ciebie najważniejsze w karierze?",
        options: [
          "Najwyższe wynagrodzenie i możliwość nadgodzin",
          "Nauka zaawansowanych umiejętności technicznych i specjalizacja",
          "Fizyczna praca na zewnątrz i codzienne zróżnicowanie",
          "Bycie częścią zgranego, wykwalifikowanego zespołu",
          "Wyraźna ścieżka do nadzoru lub własnego biznesu",
          "Stabilność, dobre świadczenia i solidna emerytura",
        ],
        scores: [
          { IBEW_I: 1, IBEW_L: 1, IW: 1, IUEC: 1 },
          { IBEW_I: 1, UA: 1, SMART: 1, HFIAW: 1, IUEC: 1 },
          { IBEW_L: 1, IW: 1, IUOE: 1, LIUNA: 1 },
          { IW: 1, BAC: 1, UBC: 1, HFIAW: 1, IABSORIW: 1 },
          { UBC: 1, UA: 1, IBEW_I: 1 },
          { UA: 1, SMART: 1, BAC: 1, LIUNA: 1 },
        ]
      },
    ]
  };`;

// ─── NEW SCORING LOGIC ─────────────────────────────────────────────────────────
const newScoringLogic = `    if (quizStep < QUIZ[lang].length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Tally scores across all questions
      const tradeScores = {};
      QUIZ[lang].forEach((q, qi) => {
        if (q.scores && newAnswers[qi] !== undefined) {
          const scoreMap = q.scores[newAnswers[qi]];
          if (scoreMap) {
            Object.entries(scoreMap).forEach(([trade, pts]) => {
              tradeScores[trade] = (tradeScores[trade] || 0) + pts;
            });
          }
        }
      });
      const top = Object.entries(tradeScores).sort((a,b) => b[1]-a[1])[0][0];
      setQuizResult(top);
    }`;

// ─── NEW TRADE_RESULTS ─────────────────────────────────────────────────────────
const newTradeResults = `  let TRADE_RESULTS = {
    en: {
      IBEW_I: {
        name: "IBEW — Inside Wiremen",
        color: "#F5C518",
        icon: "⚡",
        why: "You're drawn to technology, precision work, and systems that power the modern world. Inside wiremen wire commercial and industrial buildings — from hospitals to data centers to stadiums.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$20-28/hr", "Journeyman: Full union wages, typically $35–75/hr depending on location", "Foreman/General Foreman: Lead crews on major projects", "Master Electrician / Business Owner: Run your own shop"],
        apprenticeship: "5-year registered apprenticeship through NECA-IBEW JATC. No college debt.",
        website: "ibew.org"
      },
      IBEW_L: {
        name: "IBEW — Outside Linemen",
        color: "#FFD700",
        icon: "🔌",
        why: "You thrive outdoors, love working at heights, and want to keep the power grid running. Linemen build and maintain the transmission and distribution lines that power entire regions.",
        path: ["Year 1–4: Apprentice Lineman — earn while you learn at ~$22-30/hr", "Journeyman Lineman: Full wages, $40–80/hr in most markets", "Foreman: Lead line crews on major transmission projects", "General Foreman / Superintendent: Oversee large infrastructure projects"],
        apprenticeship: "4-year registered apprenticeship through IBEW/NECA JATC. Extensive hands-on training.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Plumbers & Pipefitters",
        color: "#3b9eff",
        icon: "🔧",
        why: "You're interested in the systems that keep buildings running — water, gas, steam, and heating/cooling. Pipe trades are essential on every major construction project.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Plumber/Pipefitter: Full union wages, $30–70/hr", "Foreman: Lead pipe crews on commercial and industrial projects", "Master Plumber / Business Owner: License and run your own operation"],
        apprenticeship: "5-year registered apprenticeship through UA JATC. Earn from day one.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Sheet Metal Workers",
        color: "#e05a2b",
        icon: "🌬️",
        why: "You're interested in HVAC, ductwork, and the systems that control airflow in buildings. Sheet metal workers are skilled fabricators who work on commercial and industrial HVAC systems.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$17-24/hr", "Journeyman Sheet Metal Worker: Full wages, $30–65/hr", "Foreman: Manage duct installation and HVAC crews", "Estimator / Project Manager: Move into the business side"],
        apprenticeship: "5-year apprenticeship through SMART JATC training centers nationwide.",
        website: "smart-union.org"
      },
      IW: {
        name: "Ironworkers — Structural & Reinforcing",
        color: "#ef4444",
        icon: "🏗️",
        why: "You want to build the bones of America — bridges, skyscrapers, stadiums, and industrial plants. Ironworkers work at height connecting structural steel and placing rebar for concrete.",
        path: ["Year 1–3: Apprentice — earn while you learn at ~$20-28/hr", "Journeyman Ironworker: Full wages, $35–70/hr depending on market", "Foreman: Lead steel erection or reinforcing crews", "General Foreman / Superintendent: Manage major structural projects"],
        apprenticeship: "3-year registered apprenticeship through IMPACT (Ironworkers JATC). Paid from day one.",
        website: "ironworkers.org"
      },
      BAC: {
        name: "BAC — Bricklayers & Allied Craftworkers",
        color: "#f97316",
        icon: "🧱",
        why: "You're drawn to hands-on work building lasting structures with brick, stone, tile, and masonry. Union bricklayers earn excellent wages with full benefits.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Mason: Full union wages, $30–65/hr depending on location", "Foreman: Lead masonry crews on commercial and industrial projects", "Superintendent / Contractor: Run your own masonry operation"],
        apprenticeship: "3-year registered apprenticeship through BAC JATC. Paid training from day one.",
        website: "bacweb.org"
      },
      UBC: {
        name: "UBC — Carpenters",
        color: "#a78bfa",
        icon: "🪚",
        why: "You enjoy working with wood, building structures, and seeing the physical results of your work. Carpenters work on framing, finishing, millwork, and everything in between.",
        path: ["Year 1–4: Apprentice — learn framing, finishing, formwork", "Journeyman Carpenter: Full wages on commercial and residential projects", "Foreman: Lead carpentry crews", "Superintendent / Contractor: Run your own projects"],
        apprenticeship: "4-year apprenticeship through UBC regional councils.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Insulators",
        color: "#38bdf8",
        icon: "🧊",
        why: "You're drawn to the technical side of industrial systems — keeping pipes, equipment, and facilities insulated for efficiency and safety. Insulators work on power plants, refineries, and commercial buildings.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Insulator: Full union wages, $30–65/hr depending on location", "Foreman: Lead insulation crews on industrial and commercial projects", "Superintendent / Contractor: Manage large-scale insulation operations"],
        apprenticeship: "4-year registered apprenticeship through HFIAW JATC. Paid training from day one.",
        website: "insulators.org"
      },
      LIUNA: {
        name: "LIUNA — Laborers",
        color: "#fb923c",
        icon: "⛏️",
        why: "You want to be on the ground floor of every major project — doing the essential site work that makes everything else possible. Laborers work on tunnels, highways, foundations, demolition, and more.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-25/hr", "Journeyman Laborer: Full wages, $28–55/hr depending on location and specialty", "Foreman: Lead labor crews on large projects", "Superintendent: Oversee multiple crews on major infrastructure jobs"],
        apprenticeship: "Registered apprenticeship through LIUNA Training & Education Fund. Diverse specializations available.",
        website: "liuna.org"
      },
      IUOE: {
        name: "IUOE — Operating Engineers",
        color: "#84cc16",
        icon: "🚜",
        why: "You want to operate the machines that move mountains — cranes, excavators, bulldozers, and more. Operating Engineers are among the highest-paid craft workers on any job site.",
        path: ["Year 1–4: Apprentice — earn while you learn operating various equipment", "Journeyman Operating Engineer: Full wages, $35–75/hr depending on equipment and market", "Master Mechanic: Specialize in crane operation or heavy equipment repair", "Foreman / Superintendent: Lead equipment crews on major projects"],
        apprenticeship: "4-year registered apprenticeship through IUOE Local JATC programs. Extensive equipment training.",
        website: "iuoe.org"
      },
      IUPAT: {
        name: "IUPAT — Painters & Allied Trades",
        color: "#c084fc",
        icon: "🎨",
        why: "You have an eye for detail and take pride in the finished product. Painters work on everything from commercial buildings to bridges, applying coatings that protect and beautify structures.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$17-23/hr", "Journeyman Painter: Full wages, $28–55/hr depending on location", "Foreman: Lead painting and coating crews", "Superintendent / Contractor: Run your own painting operation"],
        apprenticeship: "4-year registered apprenticeship through IUPAT District Councils.",
        website: "iupat.org"
      },
      SF: {
        name: "Sprinkler Fitters — UA Local 669",
        color: "#22d3ee",
        icon: "🚿",
        why: "You want to work on the life-safety systems that protect buildings and the people inside them. Sprinkler fitters design and install fire suppression systems in every type of building.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$18-25/hr", "Journeyman Sprinkler Fitter: Full wages, $35–65/hr depending on market", "Foreman: Oversee sprinkler installation on major projects", "Inspector / Estimator: Move into technical or business roles"],
        apprenticeship: "5-year registered apprenticeship through UA Local 669 JATC.",
        website: "sprinklerfitters669.org"
      },
      IUEC: {
        name: "IUEC — Elevator Constructors",
        color: "#facc15",
        icon: "🛗",
        why: "You want to work on one of the most specialized and highest-paid trades in construction. Elevator constructors install, maintain, and modernize elevators, escalators, and other vertical transportation systems.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$25-35/hr", "Journeyman Elevator Constructor: Full wages, $50–90/hr in major markets", "Mechanic in Charge: Lead installation crews", "Modernization Specialist: Work on retrofitting existing systems"],
        apprenticeship: "4-year registered apprenticeship through IUEC JATC. One of the highest-paid apprenticeships in the trades.",
        website: "iuec.org"
      },
      IABSORIW: {
        name: "Boilermakers — Brotherhood of Boilermakers",
        color: "#f59e0b",
        icon: "🔥",
        why: "You want to work on the industrial systems that power America — boilers, pressure vessels, tanks, and heat exchangers at power plants, refineries, and chemical plants.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$20-28/hr", "Journeyman Boilermaker: Full wages, $35–70/hr depending on location", "Foreman: Lead boilermaker crews on industrial projects", "General Foreman / Superintendent: Manage major industrial turnarounds"],
        apprenticeship: "4-year registered apprenticeship through Boilermakers National Apprenticeship Program.",
        website: "boilermakers.org"
      },
      IBT: {
        name: "Teamsters — Construction Division",
        color: "#94a3b8",
        icon: "🚛",
        why: "You want to keep construction sites moving — hauling materials, operating trucks, and ensuring the logistics that make every project possible.",
        path: ["Entry: CDL training and job site experience", "Journeyman Teamster: Full wages, $28–55/hr depending on location and equipment", "Foreman: Lead trucking and material handling operations", "Dispatcher / Owner-Operator: Run your own operation"],
        apprenticeship: "Teamsters Construction Division training programs. CDL license required for most positions.",
        website: "teamster.org"
      },
      OPCMIA: {
        name: "OPCMIA — Plasterers & Cement Masons",
        color: "#a78bfa",
        icon: "🏛️",
        why: "You want to work with concrete and plaster — finishing floors, walls, and decorative elements that require skill and an eye for detail.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-24/hr", "Journeyman Cement Mason/Plasterer: Full wages, $28–58/hr depending on location", "Foreman: Lead finishing crews on commercial projects", "Superintendent / Contractor: Run your own masonry/plastering operation"],
        apprenticeship: "3-year registered apprenticeship through OPCMIA JATC.",
        website: "opcmia.org"
      },
    },
    es: {
      IBEW_I: {
        name: "IBEW — Electricistas de Interior",
        color: "#F5C518", icon: "⚡",
        why: "Te atrae la tecnología, el trabajo de precisión y los sistemas que alimentan el mundo moderno. Los electricistas de interior cablan edificios comerciales e industriales.",
        path: ["Años 1-5: Aprendiz — comenzando ~$20-28/hr", "Oficial: Salario completo, $35-75/hr según ubicación", "Capataz/Capataz General: Liderar cuadrillas en proyectos importantes", "Electricista Maestro / Propietario: Tener tu propio negocio"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de NECA-IBEW JATC. Sin deuda universitaria.",
        website: "ibew.org"
      },
      IBEW_L: {
        name: "IBEW — Lineros Exteriores",
        color: "#FFD700", icon: "🔌",
        why: "Disfrutas trabajar al aire libre, en las alturas, manteniendo la red eléctrica en funcionamiento. Los lineros construyen y mantienen líneas de transmisión y distribución.",
        path: ["Años 1-4: Aprendiz Linero — comenzando ~$22-30/hr", "Linero Oficial: Salario completo, $40-80/hr", "Capataz: Liderar cuadrillas en proyectos de transmisión", "Capataz General/Superintendent: Supervisar grandes proyectos de infraestructura"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de IBEW/NECA JATC.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Plomeros y Pipefitters",
        color: "#3b9eff", icon: "🔧",
        why: "Te interesan los sistemas que mantienen los edificios en funcionamiento — agua, gas, vapor y climatización. Los oficios de tuberías son esenciales en cada gran proyecto de construcción.",
        path: ["Años 1-5: Aprendiz — comenzando ~$18-26/hr", "Oficial Plomero/Pipefitter: Salario completo, $30-70/hr", "Capataz: Liderar cuadrillas en proyectos comerciales e industriales", "Plomero Maestro/Propietario: Tener tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de UA JATC.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Trabajadores de Chapa Metálica",
        color: "#e05a2b", icon: "🌬️",
        why: "Te interesan el HVAC, los conductos y los sistemas que controlan el flujo de aire en los edificios.",
        path: ["Años 1-5: Aprendiz — comenzando ~$17-24/hr", "Oficial de Chapa Metálica: Salario completo, $30-65/hr", "Capataz: Gestionar instalaciones de conductos y cuadrillas HVAC", "Estimador/Director de Proyecto: Pasar al lado empresarial"],
        apprenticeship: "Aprendizaje de 5 años a través de los centros de capacitación SMART JATC.",
        website: "smart-union.org"
      },
      IW: {
        name: "Ironworkers — Estructurales y Refuerzo",
        color: "#ef4444", icon: "🏗️",
        why: "Quieres construir los huesos de América — puentes, rascacielos, estadios y plantas industriales. Los ironworkers trabajan conectando acero estructural y colocando armadura.",
        path: ["Años 1-3: Aprendiz — comenzando ~$20-28/hr", "Oficial Ironworker: Salario completo, $35-70/hr", "Capataz: Liderar cuadrillas de erección de acero", "Capataz General: Gestionar grandes proyectos estructurales"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de IMPACT JATC.",
        website: "ironworkers.org"
      },
      BAC: {
        name: "BAC — Albañiles y Artesanos Aliados",
        color: "#f97316", icon: "🧱",
        why: "Te atrae el trabajo manual construyendo estructuras duraderas con ladrillo, piedra, azulejo y mampostería.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-26/hr", "Oficial Albañil: Salario completo, $30-65/hr", "Capataz: Liderar cuadrillas de mampostería", "Superintendent/Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de BAC JATC.",
        website: "bacweb.org"
      },
      UBC: {
        name: "UBC — Carpinteros",
        color: "#a78bfa", icon: "🪚",
        why: "Disfrutas trabajar con madera, construir estructuras y ver los resultados físicos de tu trabajo.",
        path: ["Años 1-4: Aprendiz — aprender marcos, acabados, encofrados", "Carpintero Oficial: Salario completo en proyectos comerciales y residenciales", "Capataz: Liderar cuadrillas de carpintería", "Superintendent/Contratista: Manejar tus propios proyectos"],
        apprenticeship: "Aprendizaje de 4 años a través de los consejos regionales de UBC.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Aisladores",
        color: "#38bdf8", icon: "🧊",
        why: "Te atrae el lado técnico de los sistemas industriales — mantener tuberías, equipos e instalaciones aisladas para mayor eficiencia y seguridad.",
        path: ["Años 1-4: Aprendiz — comenzando ~$18-26/hr", "Aislador Oficial: Salario sindical completo, $30-65/hr", "Capataz: Liderar cuadrillas de aislamiento en proyectos industriales", "Superintendent/Contratista: Gestionar operaciones a gran escala"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de HFIAW JATC.",
        website: "insulators.org"
      },
      LIUNA: {
        name: "LIUNA — Trabajadores de la Construcción",
        color: "#fb923c", icon: "⛏️",
        why: "Quieres estar en la primera línea de cada gran proyecto. Los laborers realizan el trabajo esencial de preparación de sitios que hace posible todo lo demás.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-25/hr", "Oficial Laborer: Salario completo, $28-55/hr", "Capataz: Liderar cuadrillas laborales en grandes proyectos", "Superintendent: Supervisar múltiples cuadrillas"],
        apprenticeship: "Aprendizaje registrado a través del Fondo de Capacitación y Educación de LIUNA.",
        website: "liuna.org"
      },
      IUOE: {
        name: "IUOE — Operadores de Equipos",
        color: "#84cc16", icon: "🚜",
        why: "Quieres operar las máquinas que mueven montañas — grúas, excavadoras, bulldozers y más.",
        path: ["Años 1-4: Aprendiz — operando varios equipos", "Oficial Operador: Salario completo, $35-75/hr", "Mecánico en Jefe: Especializarse en operación de grúas", "Capataz/Superintendent: Liderar cuadrillas de equipo"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de programas JATC locales de IUOE.",
        website: "iuoe.org"
      },
      IUPAT: {
        name: "IUPAT — Pintores y Oficios Aliados",
        color: "#c084fc", icon: "🎨",
        why: "Tienes ojo para los detalles y te enorgulleces del producto terminado. Los pintores trabajan aplicando recubrimientos que protegen y embellecen estructuras.",
        path: ["Años 1-4: Aprendiz — comenzando ~$17-23/hr", "Oficial Pintor: Salario completo, $28-55/hr", "Capataz: Liderar cuadrillas de pintura", "Superintendent/Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de los Consejos de Distrito de IUPAT.",
        website: "iupat.org"
      },
      SF: {
        name: "Sprinkler Fitters — UA Local 669",
        color: "#22d3ee", icon: "🚿",
        why: "Quieres trabajar en los sistemas de seguridad que protegen edificios y personas. Los sprinkler fitters instalan sistemas de supresión de incendios.",
        path: ["Años 1-5: Aprendiz — comenzando ~$18-25/hr", "Oficial Sprinkler Fitter: Salario completo, $35-65/hr", "Capataz: Supervisar instalaciones en grandes proyectos", "Inspector/Estimador: Pasar a roles técnicos o empresariales"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de UA Local 669 JATC.",
        website: "sprinklerfitters669.org"
      },
      IUEC: {
        name: "IUEC — Constructores de Elevadores",
        color: "#facc15", icon: "🛗",
        why: "Quieres trabajar en uno de los oficios más especializados y mejor pagados de la construcción — elevadores, escaleras mecánicas y sistemas de transporte vertical.",
        path: ["Años 1-4: Aprendiz — comenzando ~$25-35/hr", "Oficial Constructor de Elevadores: Salario completo, $50-90/hr en grandes mercados", "Mecánico en Cargo: Liderar cuadrillas de instalación", "Especialista en Modernización: Trabajar en sistemas existentes"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de IUEC JATC.",
        website: "iuec.org"
      },
      IABSORIW: {
        name: "Boilermakers — Hermandad de Caldereros",
        color: "#f59e0b", icon: "🔥",
        why: "Quieres trabajar en los sistemas industriales que alimentan América — calderas, recipientes a presión y plantas de energía.",
        path: ["Años 1-4: Aprendiz — comenzando ~$20-28/hr", "Oficial Calderero: Salario completo, $35-70/hr", "Capataz: Liderar cuadrillas en proyectos industriales", "Capataz General: Gestionar grandes revisiones industriales"],
        apprenticeship: "Aprendizaje registrado de 4 años a través del Programa Nacional de Aprendizaje de Boilermakers.",
        website: "boilermakers.org"
      },
      IBT: {
        name: "Teamsters — División de Construcción",
        color: "#94a3b8", icon: "🚛",
        why: "Quieres mantener las obras en movimiento — transportando materiales y asegurando la logística que hace posible cada proyecto.",
        path: ["Entrada: Capacitación CDL y experiencia en obra", "Oficial Teamster: Salario completo, $28-55/hr", "Capataz: Liderar operaciones de camiones y manejo de materiales", "Dispatcher/Propietario: Tener tu propia operación"],
        apprenticeship: "Programas de capacitación de la División de Construcción de Teamsters.",
        website: "teamster.org"
      },
      OPCMIA: {
        name: "OPCMIA — Plasterers y Cement Masons",
        color: "#a78bfa", icon: "🏛️",
        why: "Quieres trabajar con concreto y yeso — terminando pisos, paredes y elementos decorativos que requieren habilidad y ojo para los detalles.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-24/hr", "Oficial Cement Mason/Plasterer: Salario completo, $28-58/hr", "Capataz: Liderar cuadrillas de acabado", "Superintendent/Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de OPCMIA JATC.",
        website: "opcmia.org"
      },
    },
    pl: {
      IBEW_I: {
        name: "IBEW — Elektrycy Wewnętrzni",
        color: "#F5C518", icon: "⚡",
        why: "Pociąga Cię technologia, precyzyjna praca i systemy zasilające nowoczesny świat. Elektrycy wewnętrzni okablowują budynki komercyjne i przemysłowe.",
        path: ["Lata 1-5: Praktykant — od ~$20-28/hr", "Czeladnik: Pełne wynagrodzenie, $35-75/hr", "Brygadzista/Brygadzista Generalny: Kierowanie ekipami", "Mistrz Elektryczny/Właściciel: Własna firma"],
        apprenticeship: "5-letnia praktyka przez NECA-IBEW JATC. Bez długu studenckiego.",
        website: "ibew.org"
      },
      IBEW_L: {
        name: "IBEW — Monterzy Linii Elektrycznych",
        color: "#FFD700", icon: "🔌",
        why: "Lubisz pracę na zewnątrz, na wysokościach, utrzymując sieć energetyczną. Monterzy budują i utrzymują linie przesyłowe i dystrybucyjne.",
        path: ["Lata 1-4: Praktykant — od ~$22-30/hr", "Monter Czeladnik: Pełne wynagrodzenie, $40-80/hr", "Brygadzista: Kierowanie ekipami linowymi", "Brygadzista Generalny: Nadzór dużych projektów infrastrukturalnych"],
        apprenticeship: "4-letnia praktyka przez IBEW/NECA JATC.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Hydraulicy i Monterzy Rurociągów",
        color: "#3b9eff", icon: "🔧",
        why: "Interesują Cię systemy utrzymujące budynki w ruchu — woda, gaz, para i klimatyzacja.",
        path: ["Lata 1-5: Praktykant — od ~$18-26/hr", "Hydraulik/Monter Czeladnik: Pełne wynagrodzenie, $30-70/hr", "Brygadzista: Kierowanie ekipami", "Mistrz Hydraulik/Właściciel: Własna firma"],
        apprenticeship: "5-letnia praktyka przez UA JATC.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Blacharze i Pracownicy HVAC",
        color: "#e05a2b", icon: "🌬️",
        why: "Interesuje Cię HVAC, kanały wentylacyjne i systemy kontroli przepływu powietrza w budynkach.",
        path: ["Lata 1-5: Praktykant — od ~$17-24/hr", "Czeladnik Blacharza: Pełne wynagrodzenie, $30-65/hr", "Brygadzista: Zarządzanie instalacjami kanałów i ekipami HVAC", "Kosztorysant/Kierownik Projektu: Strona biznesowa"],
        apprenticeship: "5-letnia praktyka przez centra szkoleniowe SMART JATC.",
        website: "smart-union.org"
      },
      IW: {
        name: "Ironworkers — Konstrukcje Stalowe",
        color: "#ef4444", icon: "🏗️",
        why: "Chcesz budować szkielet Ameryki — mosty, wieżowce, stadiony i zakłady przemysłowe.",
        path: ["Lata 1-3: Praktykant — od ~$20-28/hr", "Monter Czeladnik: Pełne wynagrodzenie, $35-70/hr", "Brygadzista: Kierowanie ekipami stalowymi", "Brygadzista Generalny: Zarządzanie dużymi projektami"],
        apprenticeship: "3-letnia praktyka przez IMPACT JATC.",
        website: "ironworkers.org"
      },
      BAC: {
        name: "BAC — Murarze i Rzemieślnicy",
        color: "#f97316", icon: "🧱",
        why: "Pociąga Cię praca manualna przy budowie trwałych konstrukcji z cegły, kamienia, płytek i murów.",
        path: ["Lata 1-3: Praktykant — od ~$18-26/hr", "Murarz Czeladnik: Pełne wynagrodzenie, $30-65/hr", "Brygadzista: Kierowanie ekipami murarskimi", "Superintendent/Wykonawca: Własna firma"],
        apprenticeship: "3-letnia praktyka przez BAC JATC.",
        website: "bacweb.org"
      },
      UBC: {
        name: "UBC — Cieśle",
        color: "#a78bfa", icon: "🪚",
        why: "Lubisz pracować z drewnem, budować konstrukcje i widzieć fizyczne efekty swojej pracy.",
        path: ["Lata 1-4: Praktykant — szkieletowanie, wykończenie, szalunki", "Czeladnik Cieśla: Pełna stawka przy projektach komercyjnych i mieszkaniowych", "Brygadzista: Prowadzenie ekip ciesielskich", "Superintendent/Wykonawca: Własne projekty"],
        apprenticeship: "4-letnia praktyka przez regionalne rady UBC.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Izolatorzy",
        color: "#38bdf8", icon: "🧊",
        why: "Pociąga Cię techniczny aspekt systemów przemysłowych — izolowanie rur, urządzeń i obiektów dla efektywności i bezpieczeństwa.",
        path: ["Lata 1-4: Praktykant — od ~$18-26/hr", "Izolator Czeladnik: Pełne wynagrodzenie związkowe, $30-65/hr", "Brygadzista: Kierowanie ekipami izolacyjnymi", "Superintendent/Wykonawca: Zarządzanie dużymi operacjami"],
        apprenticeship: "4-letnia praktyka przez HFIAW JATC.",
        website: "insulators.org"
      },
      LIUNA: {
        name: "LIUNA — Robotnicy Budowlani",
        color: "#fb923c", icon: "⛏️",
        why: "Chcesz być na pierwszej linii każdego dużego projektu — wykonując niezbędne prace przygotowawcze.",
        path: ["Lata 1-3: Praktykant — od ~$18-25/hr", "Robotnik Czeladnik: Pełne wynagrodzenie, $28-55/hr", "Brygadzista: Kierowanie ekipami roboczymi", "Superintendent: Nadzór nad wieloma ekipami"],
        apprenticeship: "Zarejestrowana praktyka przez Fundusz Szkoleniowy LIUNA.",
        website: "liuna.org"
      },
      IUOE: {
        name: "IUOE — Operatorzy Sprzętu",
        color: "#84cc16", icon: "🚜",
        why: "Chcesz obsługiwać maszyny poruszające górami — dźwigi, koparki, buldożery i inne.",
        path: ["Lata 1-4: Praktykant — obsługa różnych urządzeń", "Czeladnik Operator: Pełne wynagrodzenie, $35-75/hr", "Główny Mechanik: Specjalizacja w obsłudze dźwigów", "Brygadzista/Superintendent: Kierowanie ekipami sprzętowymi"],
        apprenticeship: "4-letnia zarejestrowana praktyka przez lokalne programy JATC IUOE.",
        website: "iuoe.org"
      },
      IUPAT: {
        name: "IUPAT — Malarze i Pokrewne Zawody",
        color: "#c084fc", icon: "🎨",
        why: "Masz oko do szczegółów i dbasz o jakość gotowego produktu. Malarze nakładają powłoki chroniące i upiększające konstrukcje.",
        path: ["Lata 1-4: Praktykant — od ~$17-23/hr", "Malarz Czeladnik: Pełne wynagrodzenie, $28-55/hr", "Brygadzista: Kierowanie ekipami malarskimi", "Superintendent/Wykonawca: Własna firma malarska"],
        apprenticeship: "4-letnia praktyka przez Okręgowe Rady IUPAT.",
        website: "iupat.org"
      },
      SF: {
        name: "Sprinkler Fitters — UA Local 669",
        color: "#22d3ee", icon: "🚿",
        why: "Chcesz pracować przy systemach bezpieczeństwa chroniących budynki i ludzi. Monterzy tryskaczów instalują systemy gaśnicze.",
        path: ["Lata 1-5: Praktykant — od ~$18-25/hr", "Monter Tryskaczów Czeladnik: Pełne wynagrodzenie, $35-65/hr", "Brygadzista: Nadzór instalacji", "Inspektor/Kosztorysant: Role techniczne lub biznesowe"],
        apprenticeship: "5-letnia praktyka przez UA Local 669 JATC.",
        website: "sprinklerfitters669.org"
      },
      IUEC: {
        name: "IUEC — Konstruktorzy Wind",
        color: "#facc15", icon: "🛗",
        why: "Chcesz pracować w jednym z najbardziej wyspecjalizowanych i najlepiej opłacanych zawodów budowlanych — windy, schody ruchome i systemy transportu pionowego.",
        path: ["Lata 1-4: Praktykant — od ~$25-35/hr", "Czeladnik Konstruktor Wind: Pełne wynagrodzenie, $50-90/hr", "Mechanik Odpowiedzialny: Kierowanie ekipami instalacyjnymi", "Specjalista Modernizacji: Praca z istniejącymi systemami"],
        apprenticeship: "4-letnia praktyka przez IUEC JATC.",
        website: "iuec.org"
      },
      IABSORIW: {
        name: "Boilermakers — Bracia Kotlarze",
        color: "#f59e0b", icon: "🔥",
        why: "Chcesz pracować przy systemach przemysłowych zasilających Amerykę — kotłach, zbiornikach ciśnieniowych i elektrowniach.",
        path: ["Lata 1-4: Praktykant — od ~$20-28/hr", "Kotlarz Czeladnik: Pełne wynagrodzenie, $35-70/hr", "Brygadzista: Kierowanie ekipami kotlarskimi", "Brygadzista Generalny: Zarządzanie dużymi przeglądami"],
        apprenticeship: "4-letnia praktyka przez Narodowy Program Szkoleniowy Boilermakers.",
        website: "boilermakers.org"
      },
      IBT: {
        name: "Teamsters — Dział Budowlany",
        color: "#94a3b8", icon: "🚛",
        why: "Chcesz utrzymywać place budowy w ruchu — transportując materiały i zapewniając logistykę każdego projektu.",
        path: ["Wejście: Szkolenie CDL i doświadczenie na budowie", "Czeladnik Teamster: Pełne wynagrodzenie, $28-55/hr", "Brygadzista: Kierowanie operacjami transportowymi", "Dyspozytor/Właściciel: Własna firma"],
        apprenticeship: "Programy szkoleniowe Działu Budowlanego Teamsters.",
        website: "teamster.org"
      },
      OPCMIA: {
        name: "OPCMIA — Tynkarze i Cementownicy",
        color: "#a78bfa", icon: "🏛️",
        why: "Chcesz pracować z betonem i tynkiem — wykańczając podłogi, ściany i elementy dekoracyjne.",
        path: ["Lata 1-3: Praktykant — od ~$18-24/hr", "Czeladnik Cementownik/Tynkarz: Pełne wynagrodzenie, $28-58/hr", "Brygadzista: Kierowanie ekipami wykończeniowymi", "Superintendent/Wykonawca: Własna firma"],
        apprenticeship: "3-letnia praktyka przez OPCMIA JATC.",
        website: "opcmia.org"
      },
    },
  };`;

// ─── FIND AND REPLACE OLD QUIZ ────────────────────────────────────────────────
const quizStart = '  // ── QUIZ DATA ───────────────────────────────────────────────────────────────';
const quizEnd = '  };';

const quizStartIdx = code.indexOf(quizStart);
if (quizStartIdx === -1) { console.error('ERROR: QUIZ start not found'); process.exit(1); }

// Find the end of the QUIZ object (the }; after the pl section)
const afterQuizStart = code.indexOf('  let TRADE_RESULTS', quizStartIdx);
if (afterQuizStart === -1) { console.error('ERROR: TRADE_RESULTS not found'); process.exit(1); }

// Replace quiz
code = code.slice(0, quizStartIdx) + newQuiz + '\n\n' + code.slice(afterQuizStart);
console.log('✅ QUIZ replaced with 6-question comprehensive version');

// ─── REPLACE TRADE_RESULTS ────────────────────────────────────────────────────
const tradeResultsStart = '  let TRADE_RESULTS = {';
const tradeResultsStartIdx = code.indexOf(tradeResultsStart);
if (tradeResultsStartIdx === -1) { console.error('ERROR: TRADE_RESULTS start not found'); process.exit(1); }

// Find end — look for };  followed by useEffect
const tradeResultsEnd = code.indexOf('\n\n\n  useEffect', tradeResultsStartIdx);
if (tradeResultsEnd === -1) {
  // Try alternate ending
  const alt = code.indexOf('  const CAREER_DATA', tradeResultsStartIdx);
  if (alt === -1) { console.error('ERROR: Cannot find end of TRADE_RESULTS'); process.exit(1); }
  code = code.slice(0, tradeResultsStartIdx) + newTradeResults + '\n\n' + code.slice(alt);
} else {
  code = code.slice(0, tradeResultsStartIdx) + newTradeResults + code.slice(tradeResultsEnd);
}
console.log('✅ TRADE_RESULTS replaced with all 16 trades');

// ─── REPLACE SCORING LOGIC ────────────────────────────────────────────────────
const oldScoring = `    if (quizStep < QUIZ[lang].length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Score: first two questions determine trade
      const tradeVotes = { IBEW: 0, UA: 0, SMART: 0, BAC: 0, UBC: 0, HFIAW: 0 };
      [0, 1].forEach(qi => {
        const q = QUIZ[lang][qi];
        if (q.trades && newAnswers[qi] !== undefined) {
          const trade = q.trades[newAnswers[qi]];
          if (trade && tradeVotes[trade] !== undefined) tradeVotes[trade]++;
        }
      });
      const top = Object.entries(tradeVotes).sort((a,b) => b[1]-a[1])[0][0];
      setQuizResult(top);
    }`;

if (!code.includes(oldScoring)) {
  console.error('ERROR: Old scoring logic not found — check manually');
} else {
  code = code.replace(oldScoring, newScoringLogic);
  console.log('✅ Scoring logic updated to weighted points system');
}

// ─── FIX QUIZ RESULT BUTTON — handle IBEW_I and IBEW_L separately ─────────────
const oldBtn = `setSelectedTrade(quizResult === "IBEW" ? "IBEW_I" : quizResult)`;
const newBtn = `setSelectedTrade(["IBEW_I","IBEW_L","UA","SMART","BAC","UBC","HFIAW","IW","LIUNA"].includes(quizResult) ? quizResult : "IBEW_I")`;
if (code.includes(oldBtn)) {
  code = code.replace(oldBtn, newBtn);
  console.log('✅ Quiz result button updated');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: comprehensive quiz rewrite for all 16 trades" && git push\n');
