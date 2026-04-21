const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const hfiawResultES = `
      HFIAW: {
        name: "HFIAW — Aisladores",
        color: "#38bdf8",
        icon: "🧊",
        why: "Te atrae el lado técnico de los sistemas industriales — mantener tuberías, equipos e instalaciones aisladas para mayor eficiencia y seguridad. Los aisladores trabajan en plantas de energía, refinerías y edificios comerciales.",
        path: ["Años 1–4: Aprendiz — gana mientras aprendes, desde ~$18-26/hr", "Aislador Oficial: Salario sindical completo, $30–65/hr según ubicación", "Capataz: Liderar cuadrillas de aislamiento en proyectos industriales", "Superintendente / Contratista: Gestionar operaciones a gran escala"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de HFIAW JATC. Formación remunerada desde el primer día.",
        website: "insulators.org"
      },`;

const hfiawResultPL = `
      HFIAW: {
        name: "HFIAW — Izolatorzy",
        color: "#38bdf8",
        icon: "🧊",
        why: "Pociąga Cię techniczny aspekt systemów przemysłowych — izolowanie rur, urządzeń i obiektów dla efektywności i bezpieczeństwa. Izolatorzy pracują w elektrowniach, rafineriach i budynkach komercyjnych.",
        path: ["Lata 1–4: Praktykant — zarabiaj ucząc się, od ~$18-26/hr", "Izolator Czeladnik: Pełne wynagrodzenie związkowe, $30–65/hr", "Brygadzista: Kierowanie ekipami izolacyjnymi przy projektach przemysłowych", "Superintendent / Wykonawca: Zarządzanie dużymi operacjami izolacyjnymi"],
        apprenticeship: "4-letnia praktyka zarejestrowana przez HFIAW JATC. Płatne szkolenie od pierwszego dnia.",
        website: "insulators.org"
      },`;

// ─── ES: find using unique Spanish UBC text ───────────────────────────────────
const esAnchor = `"UBC — Carpinteros"`;
const esIdx = code.indexOf(esAnchor);
if (esIdx === -1) { console.error('ERROR: ES UBC block not found'); process.exit(1); }

// From that point, find the next website: "carpenters.org"
const esCarpentersIdx = code.indexOf(`website: "carpenters.org"`, esIdx);
if (esCarpentersIdx === -1) { console.error('ERROR: ES carpenters.org not found'); process.exit(1); }

// Find the closing },  after that
const esCloseIdx = code.indexOf(`},`, esCarpentersIdx) + 2;

// Insert HFIAW after the closing },
code = code.slice(0, esCloseIdx) + hfiawResultES + code.slice(esCloseIdx);
console.log('✅ HFIAW added to ES TRADE_RESULTS');

// ─── PL: find using unique Polish UBC text ────────────────────────────────────
const plAnchor = `"4-letnia praktyka przez regionalne rady UBC."`;
const plIdx = code.indexOf(plAnchor);
if (plIdx === -1) { console.error('ERROR: PL UBC block not found'); process.exit(1); }

// From that point, find the next website: "carpenters.org"
const plCarpentersIdx = code.indexOf(`website: "carpenters.org"`, plIdx);
if (plCarpentersIdx === -1) { console.error('ERROR: PL carpenters.org not found'); process.exit(1); }

// Find the closing },  after that
const plCloseIdx = code.indexOf(`},`, plCarpentersIdx) + 2;

// Insert HFIAW after the closing },
code = code.slice(0, plCloseIdx) + hfiawResultPL + code.slice(plCloseIdx);
console.log('✅ HFIAW added to PL TRADE_RESULTS');

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
fs.writeFileSync(filePath, code, 'utf8');
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add HFIAW to quiz results (ES + PL)" && git push\n');
