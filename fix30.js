const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Each replacement: [english, spanish, polish]
// We wrap each in lang ternary
const items = [
  // ── HISTORY TIMELINE ────────────────────────────────────────────────────────
  [
    `{ year: "1794", event: "First American Union Formed", desc: "The Federal Society of Journeymen Cordwainers forms in Philadelphia — considered the first trade union in the United States. Workers united to demand fair wages and better conditions." }`,
    `{ year: "1794", event: lang==="es" ? "Se Forma el Primer Sindicato Americano" : lang==="pl" ? "Powstaje Pierwszy Amerykański Związek Zawodowy" : "First American Union Formed", desc: lang==="es" ? "La Sociedad Federal de Zapateros Oficiales se forma en Filadelfia — considerada el primer sindicato en los Estados Unidos. Los trabajadores se unieron para exigir salarios justos y mejores condiciones." : lang==="pl" ? "Federalne Towarzystwo Czeladników Szewskich powstaje w Filadelfii — uważane za pierwszy związek zawodowy w Stanach Zjednoczonych. Pracownicy zjednoczyli się, aby domagać się sprawiedliwych płac i lepszych warunków pracy." : "The Federal Society of Journeymen Cordwainers forms in Philadelphia — considered the first trade union in the United States. Workers united to demand fair wages and better conditions." }`
  ],
  [
    `{ year: "1869", event: "Knights of Labor Founded", desc: "One of the first major labor organizations in the US opens its doors to all workers regardless of race, gender, or skill level. A radical idea for the time." }`,
    `{ year: "1869", event: lang==="es" ? "Fundación de los Caballeros del Trabajo" : lang==="pl" ? "Założenie Rycerzy Pracy" : "Knights of Labor Founded", desc: lang==="es" ? "Una de las primeras organizaciones laborales importantes en EE.UU. abre sus puertas a todos los trabajadores independientemente de su raza, género o nivel de habilidad. Una idea radical para la época." : lang==="pl" ? "Jedna z pierwszych głównych organizacji pracowniczych w USA otwiera swoje drzwi dla wszystkich pracowników niezależnie od rasy, płci czy poziomu umiejętności. Radykalna idea jak na tamte czasy." : "One of the first major labor organizations in the US opens its doors to all workers regardless of race, gender, or skill level. A radical idea for the time." }`
  ],
  [
    `{ year: "1886", event: "The Haymarket Affair", desc: "Chicago workers strike for the 8-hour workday. A turning point in labor history that galvanized the movement and eventually led to the 8-hour standard worldwide." }`,
    `{ year: "1886", event: lang==="es" ? "El Asunto de Haymarket" : lang==="pl" ? "Sprawa Haymarket" : "The Haymarket Affair", desc: lang==="es" ? "Los trabajadores de Chicago hacen huelga por la jornada de 8 horas. Un punto de inflexión en la historia laboral que galvanizó el movimiento y eventualmente llevó al estándar de 8 horas en todo el mundo." : lang==="pl" ? "Robotnicy z Chicago strajkują o 8-godzinny dzień pracy. Punkt zwrotny w historii pracy, który zjednoczył ruch i ostatecznie doprowadził do 8-godzinnego standardu na całym świecie." : "Chicago workers strike for the 8-hour workday. A turning point in labor history that galvanized the movement and eventually led to the 8-hour standard worldwide." }`
  ],
  [
    `{ year: "1886", event: "AFL Founded", desc: "Samuel Gompers founds the American Federation of Labor, organizing skilled craft workers into trade unions — the model that still exists today in construction." }`,
    `{ year: "1886", event: lang==="es" ? "Fundación de la AFL" : lang==="pl" ? "Założenie AFL" : "AFL Founded", desc: lang==="es" ? "Samuel Gompers funda la Federación Americana del Trabajo, organizando a trabajadores calificados en sindicatos — el modelo que aún existe hoy en la construcción." : lang==="pl" ? "Samuel Gompers zakłada Amerykańską Federację Pracy, organizując wykwalifikowanych rzemieślników w związki zawodowe — model, który istnieje do dziś w budownictwie." : "Samuel Gompers founds the American Federation of Labor, organizing skilled craft workers into trade unions — the model that still exists today in construction." }`
  ],
  [
    `{ year: "1911", event: "Triangle Shirtwaist Fire", desc: "146 garment workers die in New York City because fire exits were locked. The tragedy shocked the nation and led directly to major workplace safety legislation." }`,
    `{ year: "1911", event: lang==="es" ? "Incendio de la Fábrica Triangle" : lang==="pl" ? "Pożar w Fabryce Triangle" : "Triangle Shirtwaist Fire", desc: lang==="es" ? "146 trabajadores textiles mueren en Nueva York porque las salidas de emergencia estaban cerradas. La tragedia conmocionó a la nación y llevó directamente a una importante legislación de seguridad laboral." : lang==="pl" ? "146 pracowników odzieżowych ginie w Nowym Jorku, ponieważ wyjścia awaryjne były zamknięte. Tragedia wstrząsnęła krajem i doprowadziła bezpośrednio do ważnego ustawodawstwa dotyczącego bezpieczeństwa w pracy." : "146 garment workers die in New York City because fire exits were locked. The tragedy shocked the nation and led directly to major workplace safety legislation." }`
  ],
  [
    `{ year: "1935", event: "The Wagner Act", desc: "Congress passes the National Labor Relations Act, guaranteeing workers the right to organize, join unions, and engage in collective bargaining. A watershed moment." }`,
    `{ year: "1935", event: lang==="es" ? "La Ley Wagner" : lang==="pl" ? "Ustawa Wagnera" : "The Wagner Act", desc: lang==="es" ? "El Congreso aprueba la Ley Nacional de Relaciones Laborales, garantizando a los trabajadores el derecho a organizarse, unirse a sindicatos y negociar colectivamente. Un momento decisivo." : lang==="pl" ? "Kongres uchwala Krajową Ustawę o Stosunkach Pracy, gwarantując pracownikom prawo do organizowania się, wstępowania do związków i zbiorowego negocjowania. Przełomowy moment." : "Congress passes the National Labor Relations Act, guaranteeing workers the right to organize, join unions, and engage in collective bargaining. A watershed moment." }`
  ],
  [
    `{ year: "1938", event: "The Fair Labor Standards Act", desc: "The federal minimum wage is established. The 40-hour work week becomes law. Child labor is severely restricted. Overtime pay is mandated. Unions made this happen." }`,
    `{ year: "1938", event: lang==="es" ? "La Ley de Normas Laborales Justas" : lang==="pl" ? "Ustawa o Uczciwych Standardach Pracy" : "The Fair Labor Standards Act", desc: lang==="es" ? "Se establece el salario mínimo federal. La semana laboral de 40 horas se convierte en ley. El trabajo infantil se restringe severamente. Se exige el pago de horas extras. Los sindicatos hicieron que esto sucediera." : lang==="pl" ? "Ustanowiono federalną płacę minimalną. 40-godzinny tydzień pracy stał się prawem. Praca dzieci została poważnie ograniczona. Wprowadzono obowiązkowe wynagrodzenie za nadgodziny. Związki zawodowe to umożliwiły." : "The federal minimum wage is established. The 40-hour work week becomes law. Child labor is severely restricted. Overtime pay is mandated. Unions made this happen." }`
  ],
  [
    `{ year: "1955", event: "AFL-CIO Merger", desc: "The AFL and CIO merge into the most powerful labor federation in American history, representing 15 million workers and reshaping the political landscape." }`,
    `{ year: "1955", event: lang==="es" ? "Fusión AFL-CIO" : lang==="pl" ? "Fuzja AFL-CIO" : "AFL-CIO Merger", desc: lang==="es" ? "La AFL y el CIO se fusionan en la federación laboral más poderosa de la historia americana, representando a 15 millones de trabajadores y remodelando el panorama político." : lang==="pl" ? "AFL i CIO łączą się w najpotężniejszą federację pracowniczą w historii Ameryki, reprezentując 15 milionów pracowników i zmieniając krajobraz polityczny." : "The AFL and CIO merge into the most powerful labor federation in American history, representing 15 million workers and reshaping the political landscape." }`
  ],
  [
    `{ year: "1970", event: "OSHA Created", desc: "The Occupational Safety and Health Administration is established after decades of union advocacy. Workers finally have a federal agency protecting them on the job." }`,
    `{ year: "1970", event: lang==="es" ? "Creación de OSHA" : lang==="pl" ? "Powstanie OSHA" : "OSHA Created", desc: lang==="es" ? "La Administración de Seguridad y Salud Ocupacional se establece después de décadas de defensa sindical. Los trabajadores finalmente tienen una agencia federal que los protege en el trabajo." : lang==="pl" ? "Administracja Bezpieczeństwa i Higieny Pracy powstaje po dziesięcioleciach działalności związkowej. Pracownicy nareszcie mają federalną agencję chroniącą ich w pracy." : "The Occupational Safety and Health Administration is established after decades of union advocacy. Workers finally have a federal agency protecting them on the job." }`
  ],
  [
    `{ year: "1974", event: "ERISA — Protecting Pensions", desc: "The Employee Retirement Income Security Act protects union workers' pensions and retirement benefits — ensuring that decades of hard work translate into a secure retirement." }`,
    `{ year: "1974", event: lang==="es" ? "ERISA — Protegiendo las Pensiones" : lang==="pl" ? "ERISA — Ochrona Emerytur" : "ERISA — Protecting Pensions", desc: lang==="es" ? "La Ley de Seguridad de Ingresos de Jubilación de los Empleados protege las pensiones y beneficios de jubilación de los trabajadores sindicalizados — asegurando que décadas de trabajo duro se traduzcan en una jubilación segura." : lang==="pl" ? "Ustawa o zabezpieczeniu dochodów emerytalnych pracowników chroni emerytury i świadczenia emerytalne pracowników związkowych — zapewniając, że dekady ciężkiej pracy przekładają się na bezpieczną emeryturę." : "The Employee Retirement Income Security Act protects union workers' pensions and retirement benefits — ensuring that decades of hard work translate into a secure retirement." }`
  ],
  [
    `{ year: "Today", event: "The Trades Lead the Way", desc: "Construction unions continue to set the standard — negotiating the highest wages, best benefits, and safest job sites in the industry. The fight goes on." }`,
    `{ year: lang==="es" ? "Hoy" : lang==="pl" ? "Dziś" : "Today", event: lang==="es" ? "Los Oficios Lideran el Camino" : lang==="pl" ? "Zawody Prowadzą Drogę" : "The Trades Lead the Way", desc: lang==="es" ? "Los sindicatos de construcción siguen estableciendo el estándar — negociando los salarios más altos, los mejores beneficios y los sitios de trabajo más seguros de la industria. La lucha continúa." : lang==="pl" ? "Związki budowlane nadal wyznaczają standardy — negocjując najwyższe płace, najlepsze świadczenia i najbezpieczniejsze place budowy w branży. Walka trwa." : "Construction unions continue to set the standard — negotiating the highest wages, best benefits, and safest job sites in the industry. The fight goes on." }`
  ],

  // ── WHAT UNIONS WON CARDS ───────────────────────────────────────────────────
  [
    `{ icon: "📅", title: "The Weekend", desc: "Before unions, workers labored 6 or 7 days a week. The two-day weekend was a union victory — fought for and won by organized labor in the early 20th century." }`,
    `{ icon: "📅", title: lang==="es" ? "El Fin de Semana" : lang==="pl" ? "Weekend" : "The Weekend", desc: lang==="es" ? "Antes de los sindicatos, los trabajadores laboraban 6 o 7 días a la semana. El fin de semana de dos días fue una victoria sindical — luchada y ganada por el trabajo organizado a principios del siglo XX." : lang==="pl" ? "Przed powstaniem związków zawodowych pracownicy pracowali 6 lub 7 dni w tygodniu. Dwudniowy weekend był zwycięstwem związkowym — wywalczonym przez zorganizowaną pracę na początku XX wieku." : "Before unions, workers labored 6 or 7 days a week. The two-day weekend was a union victory — fought for and won by organized labor in the early 20th century." }`
  ],
  [
    `{ icon: "⏰", title: "The 8-Hour Day", desc: "'8 hours for work, 8 hours for rest, 8 hours for what we will.' Union workers fought for decades to limit the working day from 16+ hours to 8." }`,
    `{ icon: "⏰", title: lang==="es" ? "La Jornada de 8 Horas" : lang==="pl" ? "8-Godzinny Dzień Pracy" : "The 8-Hour Day", desc: lang==="es" ? "'8 horas para trabajar, 8 horas para descansar, 8 horas para lo que queramos.' Los trabajadores sindicalizados lucharon durante décadas para limitar la jornada laboral de más de 16 horas a 8." : lang==="pl" ? "'8 godzin pracy, 8 godzin odpoczynku, 8 godzin na co chcemy.' Związkowcy walczyli przez dekady, aby ograniczyć dzień pracy z ponad 16 godzin do 8." : "'8 hours for work, 8 hours for rest, 8 hours for what we will.' Union workers fought for decades to limit the working day from 16+ hours to 8." }`
  ],
  [
    `{ icon: "👶", title: "End of Child Labor", desc: "Children as young as 5 worked in mines and factories before unions pushed for child labor laws. The Fair Labor Standards Act of 1938 finally banned most child labor." }`,
    `{ icon: "👶", title: lang==="es" ? "Fin del Trabajo Infantil" : lang==="pl" ? "Koniec Pracy Dzieci" : "End of Child Labor", desc: lang==="es" ? "Niños tan pequeños como de 5 años trabajaban en minas y fábricas antes de que los sindicatos impulsaran las leyes contra el trabajo infantil. La Ley de Normas Laborales Justas de 1938 finalmente prohibió la mayor parte del trabajo infantil." : lang==="pl" ? "Dzieci w wieku 5 lat pracowały w kopalniach i fabrykach zanim związki zawodowe zaczęły walczyć o przepisy dotyczące pracy dzieci. Ustawa o uczciwych standardach pracy z 1938 roku ostatecznie zakazała większości pracy dzieci." : "Children as young as 5 worked in mines and factories before unions pushed for child labor laws. The Fair Labor Standards Act of 1938 finally banned most child labor." }`
  ],
  [
    `{ icon: "🏥", title: "Health Insurance", desc: "Employer-provided health insurance became standard in America because unions negotiated it into contracts — and other employers had to follow to compete for workers." }`,
    `{ icon: "🏥", title: lang==="es" ? "Seguro de Salud" : lang==="pl" ? "Ubezpieczenie Zdrowotne" : "Health Insurance", desc: lang==="es" ? "El seguro de salud proporcionado por el empleador se convirtió en estándar en América porque los sindicatos lo negociaron en los contratos — y otros empleadores tuvieron que seguir para competir por trabajadores." : lang==="pl" ? "Ubezpieczenie zdrowotne zapewniane przez pracodawcę stało się standardem w Ameryce, ponieważ związki wynegocjowały je w umowach — a inni pracodawcy musieli podążać za tym, aby konkurować o pracowników." : "Employer-provided health insurance became standard in America because unions negotiated it into contracts — and other employers had to follow to compete for workers." }`
  ],
  [
    `{ icon: "💰", title: "Minimum Wage", desc: "There was no minimum wage before unions fought for it. The first federal minimum wage of $0.25/hr in 1938 was a union victory." }`,
    `{ icon: "💰", title: lang==="es" ? "Salario Mínimo" : lang==="pl" ? "Płaca Minimalna" : "Minimum Wage", desc: lang==="es" ? "No había salario mínimo antes de que los sindicatos lucharan por él. El primer salario mínimo federal de $0.25/hr en 1938 fue una victoria sindical." : lang==="pl" ? "Nie było płacy minimalnej zanim związki zawodowe o nią nie walczyły. Pierwsza federalna płaca minimalna w wysokości $0,25/hr w 1938 roku była zwycięstwem związkowym." : "There was no minimum wage before unions fought for it. The first federal minimum wage of $0.25/hr in 1938 was a union victory." }`
  ],
  [
    `{ icon: "🦺", title: "Workplace Safety", desc: "OSHA, hard hats, safety harnesses, fire exits — union workers demanded these protections and eventually got them written into law for all American workers." }`,
    `{ icon: "🦺", title: lang==="es" ? "Seguridad en el Trabajo" : lang==="pl" ? "Bezpieczeństwo w Pracy" : "Workplace Safety", desc: lang==="es" ? "OSHA, cascos, arneses de seguridad, salidas de emergencia — los trabajadores sindicalizados exigieron estas protecciones y eventualmente lograron que se convirtieran en ley para todos los trabajadores americanos." : lang==="pl" ? "OSHA, kaski, uprzęże bezpieczeństwa, wyjścia awaryjne — pracownicy związkowi domagali się tych zabezpieczeń i ostatecznie doprowadzili do ich zapisania w prawie dla wszystkich amerykańskich pracowników." : "OSHA, hard hats, safety harnesses, fire exits — union workers demanded these protections and eventually got them written into law for all American workers." }`
  ],
  [
    `{ icon: "📈", title: "Overtime Pay", desc: "Time-and-a-half for overtime? That's a union win. Before the FLSA, employers could work you unlimited hours with no extra pay." }`,
    `{ icon: "📈", title: lang==="es" ? "Pago de Horas Extras" : lang==="pl" ? "Wynagrodzenie za Nadgodziny" : "Overtime Pay", desc: lang==="es" ? "¿Tiempo y medio por horas extras? Eso es una victoria sindical. Antes de la FLSA, los empleadores podían hacerte trabajar horas ilimitadas sin pago adicional." : lang==="pl" ? "Półtorakrotność stawki za nadgodziny? To zwycięstwo związkowe. Przed FLSA pracodawcy mogli zmuszać do nieograniczonej liczby godzin pracy bez dodatkowego wynagrodzenia." : "Time-and-a-half for overtime? That's a union win. Before the FLSA, employers could work you unlimited hours with no extra pay." }`
  ],
  [
    `{ icon: "🎓", title: "Paid Apprenticeships", desc: "The union apprenticeship model — earn while you learn, no student debt — is the gold standard of workforce training. Built by unions, for workers." }`,
    `{ icon: "🎓", title: lang==="es" ? "Aprendizajes Pagados" : lang==="pl" ? "Płatne Praktyki" : "Paid Apprenticeships", desc: lang==="es" ? "El modelo de aprendizaje sindical — ganar mientras aprendes, sin deuda estudiantil — es el estándar de oro de la formación laboral. Construido por sindicatos, para trabajadores." : lang==="pl" ? "Model praktyk związkowych — zarabiaj ucząc się, bez długu studenckiego — jest złotym standardem szkolenia zawodowego. Zbudowany przez związki, dla pracowników." : "The union apprenticeship model — earn while you learn, no student debt — is the gold standard of workforce training. Built by unions, for workers." }`
  ],

  // ── WHY IT MATTERS TODAY CARDS ───────────────────────────────────────────────
  [
    `{ icon: "💵", title: "Union Wage Premium", desc: "Union workers earn 18% more on average than non-union workers doing the same job. In construction, that gap is even larger." }`,
    `{ icon: "💵", title: lang==="es" ? "Prima Salarial Sindical" : lang==="pl" ? "Premia Płacowa Związkowców" : "Union Wage Premium", desc: lang==="es" ? "Los trabajadores sindicalizados ganan un 18% más en promedio que los trabajadores no sindicalizados que hacen el mismo trabajo. En la construcción, esa brecha es aún mayor." : lang==="pl" ? "Pracownicy związkowi zarabiają średnio o 18% więcej niż pracownicy niezrzeszeni wykonujący tę samą pracę. W budownictwie ta różnica jest jeszcze większa." : "Union workers earn 18% more on average than non-union workers doing the same job. In construction, that gap is even larger." }`
  ],
  [
    `{ icon: "🏗️", title: "The Trades Are Booming", desc: "America needs 500,000+ new construction workers. Unions offer the fastest path to a high-paying career with zero student debt." }`,
    `{ icon: "🏗️", title: lang==="es" ? "Los Oficios Están en Auge" : lang==="pl" ? "Zawody Budowlane Kwitną" : "The Trades Are Booming", desc: lang==="es" ? "América necesita más de 500,000 nuevos trabajadores de construcción. Los sindicatos ofrecen el camino más rápido hacia una carrera bien remunerada sin deuda estudiantil." : lang==="pl" ? "Ameryka potrzebuje ponad 500 000 nowych pracowników budowlanych. Związki oferują najszybszą drogę do dobrze płatnej kariery bez długu studenckiego." : "America needs 500,000+ new construction workers. Unions offer the fastest path to a high-paying career with zero student debt." }`
  ],
  [
    `{ icon: "🤝", title: "Collective Bargaining Works", desc: "When workers negotiate together, they win together. Union contracts set the floor for wages, safety, and benefits — and non-union employers have to compete." }`,
    `{ icon: "🤝", title: lang==="es" ? "La Negociación Colectiva Funciona" : lang==="pl" ? "Negocjacje Zbiorowe Działają" : "Collective Bargaining Works", desc: lang==="es" ? "Cuando los trabajadores negocian juntos, ganan juntos. Los contratos sindicales establecen el mínimo para salarios, seguridad y beneficios — y los empleadores no sindicalizados tienen que competir." : lang==="pl" ? "Kiedy pracownicy negocjują razem, wygrywają razem. Umowy związkowe ustalają poziom minimum dla płac, bezpieczeństwa i świadczeń — a pracodawcy niezrzeszeni muszą konkurować." : "When workers negotiate together, they win together. Union contracts set the floor for wages, safety, and benefits — and non-union employers have to compete." }`
  ],
  [
    `{ icon: "🌎", title: "Building America's Future", desc: "Every bridge, hospital, school, and data center in America is built by skilled tradespeople. Union workers build it safer, build it better, and build it to last." }`,
    `{ icon: "🌎", title: lang==="es" ? "Construyendo el Futuro de América" : lang==="pl" ? "Budowanie Przyszłości Ameryki" : "Building America's Future", desc: lang==="es" ? "Cada puente, hospital, escuela y centro de datos en América es construido por trabajadores calificados. Los trabajadores sindicalizados lo construyen más seguro, mejor y para durar." : lang==="pl" ? "Każdy most, szpital, szkoła i centrum danych w Ameryce jest budowane przez wykwalifikowanych rzemieślników. Pracownicy związkowi budują to bezpieczniej, lepiej i trwalej." : "Every bridge, hospital, school, and data center in America is built by skilled tradespeople. Union workers build it safer, build it better, and build it to last." }`
  ],
];

let count = 0;
for (const [oldStr, newStr] of items) {
  if (code.includes(oldStr)) {
    code = code.replace(oldStr, newStr);
    count++;
  } else {
    console.warn(`⚠️  Not found: ${oldStr.slice(0, 70)}...`);
  }
}

fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Applied ${count}/${items.length} card text translations`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: translate all card content on History and Retirement pages" && git push\n');
