// fix147.js
// Two updates to the About page partner section:
//
//   1. Heading + subtitle were written when the page featured multiple
//      partners across multiple trades. Now that it's just Noah, the line
//      "Electricians, bricklayers, insulators — real voices..." reads odd.
//      Update to focus on Noah specifically.
//
//   2. Career Path currently starts at CW. The actual journey started
//      earlier — Bachelor's from Ohio University, then non-union residential
//      electrical work — before he joined the IBEW. Extend the path to
//      reflect the full trajectory.

const fs = require('fs');
const appPath = 'src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

let changes = 0;

// ── 1. UPDATE THE SECTION HEADING ───────────────────────────────────────────
const oldTitle = `              <div className="history-section-title">{lang===\"es\" ? <>{\"Las Personas \"}<span className=\"accent\">{\"Detras de la Plataforma\"}</span></> : lang===\"pl\" ? <>{\"Ludzie \"}<span className=\"accent\">{\"Za Platforma\"}</span></> : <>{\"The People \"}<span className=\"accent\">{\"Behind the Platform\"}</span></>}</div>`;
const newTitle = `              <div className="history-section-title">{lang===\"es\" ? <>{\"Conoce al \"}<span className=\"accent\">{\"Fundador\"}</span></> : lang===\"pl\" ? <>{\"Poznaj \"}<span className=\"accent\">{\"Założyciela\"}</span></> : <>{\"Meet the \"}<span className=\"accent\">{\"Founder\"}</span></>}</div>`;

if (code.includes('Meet the ') && code.includes('Founder') && code.includes('history-section-title') && !code.includes('"The People "')) {
  console.log('Skipping title — already updated.');
} else if (code.includes(oldTitle)) {
  code = code.replace(oldTitle, newTitle);
  console.log('✓ Section title updated → "Meet the Founder"');
  changes++;
} else {
  console.error('ERROR: section title not found in expected form.');
  process.exit(1);
}

// ── 2. UPDATE THE SECTION SUBTITLE ──────────────────────────────────────────
const oldSub = `              <div className="history-section-sub">{lang===\"es\" ? \"Electricistas, albaniles, aisladores — voces reales del movimiento laboral moderno.\" : lang===\"pl\" ? \"Elektrycy, murarze, izolatorzy — prawdziwe glosy nowoczesnego ruchu pracowniczego.\" : \"Electricians, bricklayers, insulators — real voices of the modern labor movement.\"}</div>`;
const newSub = `              <div className="history-section-sub">{lang===\"es\" ? \"De la Universidad de Ohio al sector residencial no sindical, al IBEW como oficial y superintendente — el electricista que esta construyendo la plataforma que deseaba que existiera cuando empezó.\" : lang===\"pl\" ? \"Od Ohio University, przez niezwiązkowy sektor mieszkaniowy, do IBEW jako czeladnik i superintendent — elektryk budujący platformę, której brakowało mu na początku drogi.\" : \"From Ohio University to non-union residential to IBEW journeyman and superintendent — the electrician building the platform he wished existed when he started.\"}</div>`;

if (code.includes('From Ohio University to non-union residential')) {
  console.log('Skipping subtitle — already updated.');
} else if (code.includes(oldSub)) {
  code = code.replace(oldSub, newSub);
  console.log('✓ Section subtitle updated to reflect the actual journey');
  changes++;
} else {
  console.error('ERROR: section subtitle not found in expected form.');
  process.exit(1);
}

// ── 3. EXTEND THE CAREER PATH ───────────────────────────────────────────────
// Current array has 4 steps: CW, Apprentice, Journeyman, Superintendent.
// Prepend two more steps at the beginning: Ohio University, Non-Union Residential.
const oldPath = `                      {[
                        lang===\"es\" ? \"CW\" : lang===\"pl\" ? \"CW\" : \"CW\",
                        lang===\"es\" ? \"Aprendiz\" : lang===\"pl\" ? \"Praktykant\" : \"Apprentice\",
                        lang===\"es\" ? \"Oficial\" : lang===\"pl\" ? \"Czeladnik\" : \"Journeyman\",
                        lang===\"es\" ? \"Superintendente\" : lang===\"pl\" ? \"Superintendent\" : \"Superintendent\",
                      ].map((step, i, arr) => (`;
const newPath = `                      {[
                        lang===\"es\" ? \"Universidad de Ohio\" : lang===\"pl\" ? \"Ohio University\" : \"Ohio University\",
                        lang===\"es\" ? \"Residencial No Sindical\" : lang===\"pl\" ? \"Niezwiązkowy Mieszkaniowy\" : \"Non-Union Residential\",
                        lang===\"es\" ? \"CW\" : lang===\"pl\" ? \"CW\" : \"CW\",
                        lang===\"es\" ? \"Aprendiz\" : lang===\"pl\" ? \"Praktykant\" : \"Apprentice\",
                        lang===\"es\" ? \"Oficial\" : lang===\"pl\" ? \"Czeladnik\" : \"Journeyman\",
                        lang===\"es\" ? \"Superintendente\" : lang===\"pl\" ? \"Superintendent\" : \"Superintendent\",
                      ].map((step, i, arr) => (`;

if (code.includes('"Ohio University"')) {
  console.log('Skipping career path — already extended.');
} else if (code.includes(oldPath)) {
  code = code.replace(oldPath, newPath);
  console.log('✓ Career Path extended → Ohio University → Non-Union Residential → CW → Apprentice → Journeyman → Superintendent');
  changes++;
} else {
  console.error('ERROR: career path array not found in expected form.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: update About page heading and full career path" && git push');
console.log('');
