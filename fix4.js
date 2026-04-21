const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// ─── 1. EN Q1 ─────────────────────────────────────────────────────────────────
const enQ1old = `options: ["Working with electrical systems and technology", "Working with pipes, water, and heating/cooling systems", "Working with metal, ductwork, and HVAC systems", "Working with brick, stone, and masonry", "Working with wood, framing, and finishing"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const enQ1new = `options: ["Working with electrical systems and technology", "Working with pipes, water, and heating/cooling systems", "Working with metal, ductwork, and HVAC systems", "Working with brick, stone, and masonry", "Working with wood, framing, and finishing", "Working with insulation, industrial systems, and temperature control"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;
if (!code.includes(enQ1old)) { console.error('ERROR: EN Q1 not found'); process.exit(1); }
code = code.replace(enQ1old, enQ1new);
console.log('✅ EN Q1 updated');

// ─── 2. EN Q2 ─────────────────────────────────────────────────────────────────
const enQ2old = `options: ["Powering buildings — wiring, panels, controls", "Keeping systems flowing — plumbing, gas, steam", "Controlling airflow — ducts, vents, HVAC", "Building walls and structures that last centuries", "Shaping structures — carpentry, millwork"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const enQ2new = `options: ["Powering buildings — wiring, panels, controls", "Keeping systems flowing — plumbing, gas, steam", "Controlling airflow — ducts, vents, HVAC", "Building walls and structures that last centuries", "Shaping structures — carpentry, millwork", "Protecting systems — insulating pipes, equipment & industrial facilities"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;
if (!code.includes(enQ2old)) { console.error('ERROR: EN Q2 not found'); process.exit(1); }
code = code.replace(enQ2old, enQ2new);
console.log('✅ EN Q2 updated');

// ─── 3. ES Q1 ─────────────────────────────────────────────────────────────────
const esQ1old = `options: ["Trabajar con sistemas eléctricos y tecnología", "Trabajar con tuberías, agua y calefacción/refrigeración", "Trabajar con metal, conductos y sistemas HVAC", "Trabajar con ladrillo, piedra y mampostería", "Trabajar con madera, marcos y acabados"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const esQ1new = `options: ["Trabajar con sistemas eléctricos y tecnología", "Trabajar con tuberías, agua y calefacción/refrigeración", "Trabajar con metal, conductos y sistemas HVAC", "Trabajar con ladrillo, piedra y mampostería", "Trabajar con madera, marcos y acabados", "Trabajar con aislamiento, sistemas industriales y control de temperatura"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;
if (!code.includes(esQ1old)) { console.error('ERROR: ES Q1 not found'); process.exit(1); }
code = code.replace(esQ1old, esQ1new);
console.log('✅ ES Q1 updated');

// ─── 4. ES Q2 ─────────────────────────────────────────────────────────────────
const esQ2old = `options: ["Dar energía a edificios — cableado, paneles, controles", "Mantener los sistemas fluyendo — plomería, gas, vapor", "Controlar el flujo de aire — conductos, ventilación, HVAC", "Construir muros y estructuras que duran siglos", "Dar forma a estructuras — carpintería, ebanistería"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const esQ2new = `options: ["Dar energía a edificios — cableado, paneles, controles", "Mantener los sistemas fluyendo — plomería, gas, vapor", "Controlar el flujo de aire — conductos, ventilación, HVAC", "Construir muros y estructuras que duran siglos", "Dar forma a estructuras — carpintería, ebanistería", "Proteger sistemas — aislar tuberías, equipos e instalaciones industriales"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;
if (!code.includes(esQ2old)) { console.error('ERROR: ES Q2 not found'); process.exit(1); }
code = code.replace(esQ2old, esQ2new);
console.log('✅ ES Q2 updated');

// ─── 5. PL Q1 ─────────────────────────────────────────────────────────────────
const plQ1old = `options: ["Praca z systemami elektrycznymi i technologią", "Praca z rurociągami, wodą i ogrzewaniem/chłodzeniem", "Praca z metalem, kanałami i systemami HVAC", "Praca z cegłą, kamieniem i murarką", "Praca z drewnem, szkieletem i wykończeniem"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const plQ1new = `options: ["Praca z systemami elektrycznymi i technologią", "Praca z rurociągami, wodą i ogrzewaniem/chłodzeniem", "Praca z metalem, kanałami i systemami HVAC", "Praca z cegłą, kamieniem i murarką", "Praca z drewnem, szkieletem i wykończeniem", "Praca z izolacją, systemami przemysłowymi i kontrolą temperatury"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;
if (!code.includes(plQ1old)) { console.error('ERROR: PL Q1 not found'); process.exit(1); }
code = code.replace(plQ1old, plQ1new);
console.log('✅ PL Q1 updated');

// ─── 6. PL Q2 ─────────────────────────────────────────────────────────────────
const plQ2old = `options: ["Zasilanie budynków — okablowanie, panele, sterowanie", "Utrzymanie systemów — hydraulika, gaz, para", "Kontrola przepływu powietrza — kanały, wentylacja, HVAC", "Budowanie ścian i konstrukcji trwających wieki", "Kształtowanie konstrukcji — ciesielstwo, stolarstwo"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]`;
const plQ2new = `options: ["Zasilanie budynków — okablowanie, panele, sterowanie", "Utrzymanie systemów — hydraulika, gaz, para", "Kontrola przepływu powietrza — kanały, wentylacja, HVAC", "Budowanie ścian i konstrukcji trwających wieki", "Kształtowanie konstrukcji — ciesielstwo, stolarstwo", "Ochrona systemów — izolacja rur, urządzeń i obiektów przemysłowych"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC", "HFIAW"]`;
if (!code.includes(plQ2old)) { console.error('ERROR: PL Q2 not found'); process.exit(1); }
code = code.replace(plQ2old, plQ2new);
console.log('✅ PL Q2 updated');

// ─── 7. tradeVotes ────────────────────────────────────────────────────────────
const oldVotes = `const tradeVotes = { IBEW: 0, UA: 0, SMART: 0, BAC: 0, UBC: 0 };`;
const newVotes = `const tradeVotes = { IBEW: 0, UA: 0, SMART: 0, BAC: 0, UBC: 0, HFIAW: 0 };`;
if (!code.includes(oldVotes)) { console.error('ERROR: tradeVotes not found'); process.exit(1); }
code = code.replace(oldVotes, newVotes);
console.log('✅ tradeVotes updated');

// ─── 8. EN TRADE_RESULTS — insert after EN UBC using unique EN anchor ─────────
const enAnchor = `"UBC — Carpenters"`;
const enIdx = code.indexOf(enAnchor);
if (enIdx === -1) { console.error('ERROR: EN UBC not found'); process.exit(1); }
const enCarpentersIdx = code.indexOf(`website: "carpenters.org"`, enIdx);
if (enCarpentersIdx === -1) { console.error('ERROR: EN carpenters.org not found'); process.exit(1); }
const enCloseIdx = code.indexOf(`},`, enCarpentersIdx) + 2;

const hfiawEN = `
      HFIAW: {
        name: "HFIAW — Insulators",
        color: "#38bdf8",
        icon: "🧊",
        why: "You're drawn to the technical side of industrial systems — keeping pipes, equipment, and facilities insulated for efficiency and safety. Insulators work on power plants, refineries, commercial buildings, and industrial facilities, earning excellent union wages.",
        path: ["Year 1–4: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Insulator: Full union wages, $30–65/hr depending on location", "Foreman: Lead insulation crews on industrial and commercial projects", "Superintendent / Contractor: Manage large-scale insulation operations"],
        apprenticeship: "4-year registered apprenticeship through HFIAW JATC. Paid training from day one.",
        website: "insulators.org"
      },`;

code = code.slice(0, enCloseIdx) + hfiawEN + code.slice(enCloseIdx);
console.log('✅ HFIAW added to EN TRADE_RESULTS');

// ─── WRITE ────────────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add HFIAW to quiz questions and EN result" && git push\n');
