const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. ENGLISH — Question 1: add HFIAW option ───────────────────────────────
const enQ1old = `        options: ["Working with electrical systems and technology", "Working with pipes, water, and heating/cooling systems", "Working with metal, ductwork, and HVAC systems", "Working with brick, stone, and masonry", "Working with wood, framing, and finishing"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const enQ1new = `        options: ["Working with electrical systems and technology", "Working with pipes, water, and heating/cooling systems", "Working with metal, ductwork, and HVAC systems", "Working with brick, stone, and masonry", "Working with wood, framing, and finishing", "Working with insulation, industrial systems, and temperature control"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;

if (!code.includes(enQ1old)) { console.error('ERROR: EN Q1 not found'); process.exit(1); }
code = code.replace(enQ1old, enQ1new);
console.log('✅ EN Question 1 updated');

// ─── 2. ENGLISH — Question 2: add HFIAW option ───────────────────────────────
const enQ2old = `        options: ["Powering buildings — wiring, panels, controls", "Keeping systems flowing — plumbing, gas, steam", "Controlling airflow — ducts, vents, HVAC", "Building walls and structures that last centuries", "Shaping structures — carpentry, millwork"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const enQ2new = `        options: ["Powering buildings — wiring, panels, controls", "Keeping systems flowing — plumbing, gas, steam", "Controlling airflow — ducts, vents, HVAC", "Building walls and structures that last centuries", "Shaping structures — carpentry, millwork", "Protecting systems — insulating pipes, equipment & industrial facilities"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;

if (!code.includes(enQ2old)) { console.error('ERROR: EN Q2 not found'); process.exit(1); }
code = code.replace(enQ2old, enQ2new);
console.log('✅ EN Question 2 updated');

// ─── 3. SPANISH — Question 1: add HFIAW option ───────────────────────────────
const esQ1old = `        options: ["Trabajar con sistemas eléctricos y tecnología", "Trabajar con tuberías, agua y calefacción/refrigeración", "Trabajar con metal, conductos y sistemas HVAC", "Trabajar con ladrillo, piedra y mampostería", "Trabajar con madera, marcos y acabados"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const esQ1new = `        options: ["Trabajar con sistemas eléctricos y tecnología", "Trabajar con tuberías, agua y calefacción/refrigeración", "Trabajar con metal, conductos y sistemas HVAC", "Trabajar con ladrillo, piedra y mampostería", "Trabajar con madera, marcos y acabados", "Trabajar con aislamiento, sistemas industriales y control de temperatura"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;

if (!code.includes(esQ1old)) { console.error('ERROR: ES Q1 not found'); process.exit(1); }
code = code.replace(esQ1old, esQ1new);
console.log('✅ ES Question 1 updated');

// ─── 4. SPANISH — Question 2: add HFIAW option ───────────────────────────────
const esQ2old = `        options: ["Dar energía a edificios — cableado, paneles, controles", "Mantener los sistemas fluyendo — plomería, gas, vapor", "Controlar el flujo de aire — conductos, ventilación, HVAC", "Construir muros y estructuras que duran siglos", "Dar forma a estructuras — carpintería, ebanistería"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const esQ2new = `        options: ["Dar energía a edificios — cableado, paneles, controles", "Mantener los sistemas fluyendo — plomería, gas, vapor", "Controlar el flujo de aire — conductos, ventilación, HVAC", "Construir muros y estructuras que duran siglos", "Dar forma a estructuras — carpintería, ebanistería", "Proteger sistemas — aislar tuberías, equipos e instalaciones industriales"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;

if (!code.includes(esQ2old)) { console.error('ERROR: ES Q2 not found'); process.exit(1); }
code = code.replace(esQ2old, esQ2new);
console.log('✅ ES Question 2 updated');

// ─── 5. POLISH — Question 1: add HFIAW option ────────────────────────────────
const plQ1old = `        options: ["Praca z systemami elektrycznymi i technologią", "Praca z rurociągami, wodą i ogrzewaniem/chłodzeniem", "Praca z metalem, kanałami i systemami HVAC", "Praca z cegłą, kamieniem i murarką", "Praca z drewnem, szkieletem i wykończeniem"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const plQ1new = `        options: ["Praca z systemami elektrycznymi i technologią", "Praca z rurociągami, wodą i ogrzewaniem/chłodzeniem", "Praca z metalem, kanałami i systemami HVAC", "Praca z cegłą, kamieniem i murarką", "Praca z drewnem, szkieletem i wykończeniem", "Praca z izolacją, systemami przemysłowymi i kontrolą temperatury"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;

if (!code.includes(plQ1old)) { console.error('ERROR: PL Q1 not found'); process.exit(1); }
code = code.replace(plQ1old, plQ1new);
console.log('✅ PL Question 1 updated');

// ─── 6. POLISH — Question 2: add HFIAW option ────────────────────────────────
const plQ2old = `        options: ["Zasilanie budynków — okablowanie, panele, sterowanie", "Utrzymanie systemów — hydraulika, gaz, para", "Kontrola przepływu powietrza — kanały, wentylacja, HVAC", "Budowanie ścian i konstrukcji trwających wieki", "Kształtowanie konstrukcji — ciesielstwo, stolarstwo"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const plQ2new = `        options: ["Zasilanie budynków — okablowanie, panele, sterowanie", "Utrzymanie systemów — hydraulika, gaz, para", "Kontrola przepływu powietrza — kanały, wentylacja, HVAC", "Budowanie ścian i konstrukcji trwających wieki", "Kształtowanie konstrukcji — ciesielstwo, stolarstwo", "Ochrona systemów — izolacja rur, urządzeń i obiektów przemysłowych"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;

if (!code.includes(plQ2old)) { console.error('ERROR: PL Q2 not found'); process.exit(1); }
code = code.replace(plQ2old, plQ2new);
console.log('✅ PL Question 2 updated');

// ─── 7. Add HFIAW to tradeVotes ───────────────────────────────────────────────
const oldVotes = `const tradeVotes = { IBEW: 0, UA: 0, SMART: 0, BAC: 0, UBC: 0 };`;
const newVotes = `const tradeVotes = { IBEW: 0, UA: 0, SMART: 0, BAC: 0, UBC: 0, HFIAW: 0 };`;

if (!code.includes(oldVotes)) { console.error('ERROR: tradeVotes not found'); process.exit(1); }
code = code.replace(oldVotes, newVotes);
console.log('✅ tradeVotes updated');

// ─── 8. Add HFIAW to TRADE_RESULTS (all 3 languages) ─────────────────────────
// We insert HFIAW result block right before the closing of each language block.
// Find the UBC entry end and insert HFIAW after it in each language.
// Strategy: find "website: \"carpenters.org\"" and insert after the closing brace.

const hfiawResultEN = `
      HFIAW: {
        name: "HFIAW — Insulators",
        color: "#38bdf8",
        icon: "🧊",
        why: "You're drawn to the technical side of industrial systems — keeping pipes, equipment, and facilities insulated for efficiency and safety. Insulators work on power plants, refineries, commercial buildings, and industrial facilities, earning excellent union wages.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Insulator: Full union wages, $30–65/hr depending on location", "Foreman: Lead insulation crews on industrial and commercial projects", "Superintendent / Contractor: Manage large-scale insulation operations"],
        apprenticeship: "4-year registered apprenticeship through HFIAW JATC. Paid training from day one.",
        website: "insulators.org"
      },`;

const hfiawResultES = `
      HFIAW: {
        name: "HFIAW — Aisladores",
        color: "#38bdf8",
        icon: "🧊",
        why: "Te atrae el lado técnico de los sistemas industriales — mantener tuberías, equipos e instalaciones aisladas para mayor eficiencia y seguridad. Los aisladores trabajan en plantas de energía, refinerías, edificios comerciales e instalaciones industriales.",
        path: ["Años 1–4: Aprendiz — gana mientras aprendes, desde ~$18-26/hr", "Aislador Oficial: Salario sindical completo, $30–65/hr según ubicación", "Capataz: Liderar cuadrillas de aislamiento en proyectos industriales y comerciales", "Superintendente / Contratista: Gestionar operaciones de aislamiento a gran escala"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de HFIAW JATC. Formación remunerada desde el primer día.",
        website: "insulators.org"
      },`;

const hfiawResultPL = `
      HFIAW: {
        name: "HFIAW — Izolatorzy",
        color: "#38bdf8",
        icon: "🧊",
        why: "Pociąga Cię techniczny aspekt systemów przemysłowych — izolowanie rur, urządzeń i obiektów dla efektywności i bezpieczeństwa. Izolatorzy pracują w elektrowniach, rafineriach, budynkach komercyjnych i obiektach przemysłowych.",
        path: ["Lata 1–4: Praktykant — zarabiaj ucząc się, od ~$18-26/hr", "Izolator Czeladnik: Pełne wynagrodzenie związkowe, $30–65/hr", "Brygadzista: Kierowanie ekipami izolacyjnymi przy projektach przemysłowych", "Superintendent / Wykonawca: Zarządzanie dużymi operacjami izolacyjnymi"],
        apprenticeship: "4-letnia praktyka zarejestrowana przez HFIAW JATC. Płatne szkolenie od pierwszego dnia.",
        website: "insulators.org"
      },`;

// Insert into EN results — find UBC en block end
const enUBCend = `        website: "carpenters.org"
      },
    },
    es:`;
const enUBCnew = `        website: "carpenters.org"
      },${hfiawResultEN}
    },
    es:`;

if (!code.includes(enUBCend)) { console.error('ERROR: EN TRADE_RESULTS end not found'); process.exit(1); }
code = code.replace(enUBCend, enUBCnew);
console.log('✅ HFIAW added to EN TRADE_RESULTS');

// Insert into ES results
const esUBCend = `        website: "carpenters.org"
      },
    },
    pl:`;
const esUBCnew = `        website: "carpenters.org"
      },${hfiawResultES}
    },
    pl:`;

if (!code.includes(esUBCend)) { console.error('ERROR: ES TRADE_RESULTS end not found'); process.exit(1); }
code = code.replace(esUBCend, esUBCnew);
console.log('✅ HFIAW added to ES TRADE_RESULTS');

// Insert into PL results — find end of PL block
const plUBCend = `        website: "carpenters.org"
      },
    },
  };`;
const plUBCnew = `        website: "carpenters.org"
      },${hfiawResultPL}
    },
  };`;

if (!code.includes(plUBCend)) { console.error('ERROR: PL TRADE_RESULTS end not found'); process.exit(1); }
code = code.replace(plUBCend, plUBCnew);
console.log('✅ HFIAW added to PL TRADE_RESULTS');

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Quiz updated with HFIAW Insulators. Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add HFIAW to trade quiz" && git push\n');
