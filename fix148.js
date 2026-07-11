// fix148.js
// Update the three Mission cards on the About page to reflect that
// Union Pathways now covers more than just the construction trades.
// Recently added: UFCW (food, grocery, meatpacking, healthcare, cannabis)
// and SMART-TD (rail, bus, transit, airline). The mission cards are still
// written as if the platform is construction-only.
//
// Three changes:
//   01 — Built by Workers: tighten body, broaden "tradespeople" → "union members"
//   02 — Every Union, One Place: rename + enumerate the new sector coverage
//   03 — For Every Worker: rename + replace construction-only worker types
//        ("apprentice, journeyman, veteran") with cross-sector examples
//        (hammer, shelf, freight train, hospital)

const fs = require('fs');
const appPath = 'src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

let changes = 0;

// ── CARD 01 — Built by Workers (body update only; title stays) ──────────────
const oldCard1Body = `                  <div className="impact-title">{lang===\"es\" ? \"Construido por Trabajadores\" : lang===\"pl\" ? \"Zbudowane przez Pracownikow\" : \"Built by Workers\"}</div>
                  <div className="impact-desc">{lang===\"es\" ? \"No somos una empresa de marketing. Somos electricistas, albaniles e insuladores que ven la necesidad de una plataforma real para trabajadores reales.\" : lang===\"pl\" ? \"Nie jestesmy firma marketingowa. Jestesmy elektrykami, murarzami i izolatorami, ktorzy widza potrzebe prawdziwej platformy dla prawdziwych pracownikow.\" : \"We are a small but mighty group — not a marketing agency, not a faceless brand. We are boots-on-the-ground tradespeople who clock in every day, then come home and build something better for the next generation.\"}</div>`;

const newCard1Body = `                  <div className="impact-title">{lang===\"es\" ? \"Construido por Trabajadores\" : lang===\"pl\" ? \"Zbudowane przez Pracowników\" : \"Built by Workers\"}</div>
                  <div className="impact-desc">{lang===\"es\" ? \"Sin agencia de marketing. Sin marca anónima. Somos miembros sindicales que estamos en el campo cada día, y al llegar a casa construimos algo mejor para la próxima generación de trabajadores.\" : lang===\"pl\" ? \"Bez agencji marketingowej. Bez bezimiennej marki. Jesteśmy członkami związkowymi, którzy każdego dnia są w terenie, a po pracy budują coś lepszego dla następnego pokolenia pracowników.\" : \"Not a marketing agency. Not a faceless brand. We're boots-on-the-ground union members who clock in every day, then come home and build something better for the next generation of workers.\"}</div>`;

if (code.includes("we're boots-on-the-ground union members")) {
  console.log('Skipping card 01 — already updated.');
} else if (code.includes(oldCard1Body)) {
  code = code.replace(oldCard1Body, newCard1Body);
  console.log('✓ Card 01 (Built by Workers) — body updated');
  changes++;
} else {
  console.error('ERROR: Card 01 anchor not found.');
  process.exit(1);
}

// ── CARD 02 — Every Union, One Place (rename + expand body) ────────────────
const oldCard2Body = `                  <div className="impact-title">{lang===\"es\" ? \"Todo en Un Lugar\" : lang===\"pl\" ? \"Wszystko w Jednym Miejscu\" : \"Everything in One Place\"}</div>
                  <div className="impact-desc">{lang===\"es\" ? \"Locales sindicales, rutas de carrera, beneficios, historia, recursos para veteranos — todo en una sola plataforma. Gratis. Siempre.\" : lang===\"pl\" ? \"Lokale zwiazowe, sciezki kariery, swiadczenia, historia, zasoby dla weteranow — wszystko w jednej platformie. Bezplatnie. Zawsze.\" : \"Union locals, career paths, benefits, history, veteran resources — everything in one platform. Free. Always.\"}</div>`;

const newCard2Body = `                  <div className="impact-title">{lang===\"es\" ? \"Cada Sindicato, Un Lugar\" : lang===\"pl\" ? \"Każdy Związek, Jedno Miejsce\" : \"Every Union, One Place\"}</div>
                  <div className="impact-desc">{lang===\"es\" ? \"Construcción, supermercados, empacadoras de carne, transporte, salud — cada oficio y cada sindicato, en una sola plataforma. Locales, rutas de carrera, beneficios, historia, herramientas de organización. Gratis. Siempre.\" : lang===\"pl\" ? \"Budownictwo, spożywczy, pakowanie mięsa, transport, służba zdrowia — każdy zawód i każdy związek, w jednej platformie. Lokale, ścieżki kariery, świadczenia, historia, narzędzia organizacyjne. Bezpłatnie. Zawsze.\" : \"Construction, grocery, meatpacking, transportation, healthcare — every trade and every union, in a single platform. Locals, career paths, benefits, history, organizing tools. Free. Always.\"}</div>`;

if (code.includes('Every Union, One Place')) {
  console.log('Skipping card 02 — already updated.');
} else if (code.includes(oldCard2Body)) {
  code = code.replace(oldCard2Body, newCard2Body);
  console.log('✓ Card 02 → renamed "Every Union, One Place" + body enumerates sectors');
  changes++;
} else {
  console.error('ERROR: Card 02 anchor not found.');
  process.exit(1);
}

// ── CARD 03 — For Every Worker (rename + cross-sector examples) ────────────
const oldCard3Body = `                  <div className="impact-title">{lang===\"es\" ? \"Por los Trabajadores\" : lang===\"pl\" ? \"Dla Pracownikow\" : \"For the Workers\"}</div>
                  <div className="impact-desc">{lang===\"es\" ? \"Ya seas un aprendiz, un oficial, un veterano o alguien que busca entrar a los oficios — este es tu recurso.\" : lang===\"pl\" ? \"Niezaleznie od tego, czy jestes praktykantem, czeladnikiem, weteranem czy kims, kto chce wejsc do zawodow — to jest Twoj zasob.\" : \"Whether you are an apprentice, journeyman, veteran, or someone looking to break into the trades — this is your resource.\"}</div>`;

const newCard3Body = `                  <div className="impact-title">{lang===\"es\" ? \"Para Cada Trabajador\" : lang===\"pl\" ? \"Dla Każdego Pracownika\" : \"For Every Worker\"}</div>
                  <div className="impact-desc">{lang===\"es\" ? \"Ya sea que manejes un martillo, surtas estanterías, operes un tren de carga o trabajes un turno en un hospital — si eres sindicalizado o estás pensando unirte, este es tu recurso.\" : lang===\"pl\" ? \"Czy machasz młotkiem, układasz towar na półkach, prowadzisz pociąg towarowy czy pracujesz na zmianie w szpitalu — jeśli jesteś w związku lub myślisz o dołączeniu, to jest Twoje miejsce.\" : \"Whether you swing a hammer, stock a shelf, run a freight train, or pull a shift in a hospital — if you're union or thinking about joining, this is your resource.\"}</div>`;

if (code.includes('For Every Worker')) {
  console.log('Skipping card 03 — already updated.');
} else if (code.includes(oldCard3Body)) {
  code = code.replace(oldCard3Body, newCard3Body);
  console.log('✓ Card 03 → renamed "For Every Worker" + body broadened to cross-sector examples');
  changes++;
} else {
  console.error('ERROR: Card 03 anchor not found.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: update About page Mission section to reflect cross-sector platform scope" && git push');
console.log('');
