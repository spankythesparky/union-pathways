// fix145.js
// Remove the David Knipp ("Proud Union Guy") entry from the About page
// partners list. Cleanly drops the entire object including its closing
// comma, leaving Noah Alassaf as the sole partner entry.

const fs = require('fs');
const appPath = 'src/App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

const oldBlock =
`                  },
                  {
                    id:"david",
                    img:"/partner-david.jpg",
                    name:"David Knipp",
                    handle:"Proud Union Guy",
                    union: lang===\"es\" ? \"Heat & Frost Insulators Local 1\" : lang===\"pl\" ? \"Heat & Frost Insulators Local 1\" : \"Heat & Frost Insulators Local 1\",
                    bio: lang===\"es\" ? \"David Knipp es un orgulloso miembro de Heat and Frost Insulators Local 1 cuya vida cambio cuando entro a los oficios sindicales en 2009. Conocido como Proud Union Guy, ha construido una creciente plataforma nacional hablando directamente a los trabajadores sobre oportunidad, equidad y el poder de los sindicatos. A traves de su contenido y discursos, David esta ayudando a liderar una nueva ola de voces de la clase trabajadora — impulsando un movimiento laboral moderno.\" : lang===\"pl\" ? \"David Knipp jest dumnym czlonkiem Heat and Frost Insulators Local 1, ktorego zycie zmienilo sie, gdy w 2009 roku wkroczyl do zwiazowych zawodow budowlanych. Znany jako Proud Union Guy, zbudowal rosnaca ogolnokrajowa platforme, mowiac bezposrednio do pracownikow o mozliwosciach, sprawiedliwosci i sile zwiazkow zawodowych.\" : \"David Knipp is a proud member of Heat and Frost Insulators Local 1 whose life changed when he entered the union trades in 2009. Known as Proud Union Guy, he has built a growing national platform by speaking directly to working people about opportunity, fairness, and the power of unions. Through his content and speaking, David is helping lead a new wave of working-class voices — pushing to spark a modern-day labor movement.\",
                    linktree: null,
                  },
                ].map((partner) => (`;

const newBlock =
`                  },
                ].map((partner) => (`;

if (!code.includes('id:"david",') && !code.includes("name:\"David Knipp\"")) {
  console.log('Skipping — David Knipp entry not found (already removed?).');
} else if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  console.log('✓ Removed David Knipp partner entry from About page');
} else {
  console.error('ERROR: Knipp partner block not found in expected form. The entry may have been edited or formatted differently.');
  process.exit(1);
}

fs.writeFileSync(appPath, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "chore: remove David Knipp section from About page" && git push');
console.log('');
