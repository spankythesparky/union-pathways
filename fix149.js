// fix149.js — Update About page hero stats
// 452K+ Collective Followers  -> 164K Followers
// 600M+ Collective Views       -> 400M+ Views
// 30+ Years Collective Trades  -> REMOVED

const fs = require('fs');
const path = 'src/App.jsx';

let src = fs.readFileSync(path, 'utf8');
const original = src;

// 1. Replace 452K+ line (drop "Collective" from label, change number to 164K)
const oldFollowers = `                  { num: "452K+", label: lang==="es" ? "Seguidores Colectivos" : lang==="pl" ? "Lacznych Obserwujacych" : "Collective Followers" },`;
const newFollowers = `                  { num: "164K", label: lang==="es" ? "Seguidores" : lang==="pl" ? "Obserwujacych" : "Followers" },`;

if (!src.includes(oldFollowers)) {
  console.error('ERROR: Could not find the 452K+ Followers line. Aborting.');
  process.exit(1);
}
src = src.replace(oldFollowers, newFollowers);

// 2. Replace 600M+ line (drop "Collective", change to 400M+)
const oldViews = `                  { num: "600M+", label: lang==="es" ? "Visualizaciones Colectivas" : lang==="pl" ? "Lacznych Wyswietleni" : "Collective Views" },`;
const newViews = `                  { num: "400M+", label: lang==="es" ? "Visualizaciones" : lang==="pl" ? "Wyswietleni" : "Views" },`;

if (!src.includes(oldViews)) {
  console.error('ERROR: Could not find the 600M+ Views line. Aborting.');
  process.exit(1);
}
src = src.replace(oldViews, newViews);

// 3. Remove the entire 30+ Years line (including the trailing newline)
const oldYears = `                  { num: "30+", label: lang==="es" ? "Anos de Experiencia Colectiva en Oficios" : lang==="pl" ? "Lat Lacznego Doswiadczenia w Zawodach" : "Years of Collective Trades Experience" },\n`;

if (!src.includes(oldYears)) {
  console.error('ERROR: Could not find the 30+ Years line. Aborting.');
  process.exit(1);
}
src = src.replace(oldYears, '');

if (src === original) {
  console.error('ERROR: No changes were made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(path, src);
console.log('Done. About page hero stats updated:');
console.log('  - 452K+ Collective Followers -> 164K Followers');
console.log('  - 600M+ Collective Views      -> 400M+ Views');
console.log('  - 30+ Years entry             -> removed');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: update About page hero stats" && git push');
