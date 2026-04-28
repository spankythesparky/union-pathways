const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Fix Sean's handle
c = c.replace(
  'handle:"Proud Union Warrior",\n                    union: lang==="es" ? "BAC Local 21 Chicago — Presidente"',
  'handle:"Proud Union Warrior",\n                    union: lang==="es" ? "BAC Local 21 Chicago — Presidente"'
);

// Fix "Proud Union Warrior" label (in case it says "Union Proud Warrior")
c = c.replace(/handle:"Union Proud Warrior"/g, 'handle:"Proud Union Warrior"');
console.log('✅ Fixed Sean handle');

// Add Jimmy after Sean's entry
const seanEnd = `                    bio: lang==="es" ? "Sean Allen es el Presidente del Local 21 de Chicago de la union de albaniles BAC y creador de Proud Union Warrior. Como miembro de 4a generacion del BAC, conoce la importancia de organizar y hacer crecer el movimiento laboral. Union Pathways es la forma mas facil y amigable de encontrar un sindicato y aprender mas sobre ellos de las personas que lo viven todos los dias." : lang==="pl" ? "Sean Allen jest Prezydentem Local 21 w Chicago zwiazku murarzy BAC i tworca Proud Union Warrior. Jako czlonek BAC 4. pokolenia, zna znaczenie organizowania i rozwijania ruchu pracowniczego. Union Pathways to najlatwiejszy i najbardziej przyjazny dla uzytkownika sposob na znalezienie zwiazku zawodowego." : "Sean Allen is the President of BAC Local 21 Chicago and creator of Proud Union Warrior. As a 4th generation BAC member, he knows the importance of organizing and growing the labor movement. Union Pathways is the easiest, most user-friendly way to find a union and learn more about them from the people who live it every day.",
                    linktree: null,
                  },`;

const jimmyEntry = `                    bio: lang==="es" ? "Sean Allen es el Presidente del Local 21 de Chicago de la union de albaniles BAC y creador de Proud Union Warrior. Como miembro de 4a generacion del BAC, conoce la importancia de organizar y hacer crecer el movimiento laboral. Union Pathways es la forma mas facil y amigable de encontrar un sindicato y aprender mas sobre ellos de las personas que lo viven todos los dias." : lang==="pl" ? "Sean Allen jest Prezydentem Local 21 w Chicago zwiazku murarzy BAC i tworca Proud Union Warrior. Jako czlonek BAC 4. pokolenia, zna znaczenie organizowania i rozwijania ruchu pracowniczego. Union Pathways to najlatwiejszy i najbardziej przyjazny dla uzytkownika sposob na znalezienie zwiazku zawodowego." : "Sean Allen is the President of BAC Local 21 Chicago and creator of Proud Union Warrior. As a 4th generation BAC member, he knows the importance of organizing and growing the labor movement. Union Pathways is the easiest, most user-friendly way to find a union and learn more about them from the people who live it every day.",
                    linktree: null,
                  },
                  {
                    id:"jimmy",
                    img:"/partner-sean.jpg",
                    name:"Jimmy Fulton",
                    handle:"Proud Union Warrior",
                    union: lang==="es" ? "BAC Local 21 Chicago — Agente de Negocios / Vicepresidente" : lang==="pl" ? "BAC Local 21 Chicago — Agent ds. Biznesu / Wiceprezes" : "BAC Local 21 Chicago — Business Agent & Vice President",
                    bio: lang==="es" ? "Jimmy Fulton es un orgulloso colocador de azulejos sindical y miembro del BAC Local 21. Como miembro sindical de primera generacion, su carrera es prueba de lo que la oportunidad, la formacion y la hermandad en los oficios pueden lograr. Mas alla del sitio de trabajo, Jimmy es Agente de Negocios para los Colocadores de Azulejos y Acabadores del Local 21 en Chicago. Sirve como Vicepresidente y socio contribuyente de Proud Union Warrior, donde ayuda a amplificar la voz de la clase trabajadora y promover los valores sindicales." : lang==="pl" ? "Jimmy Fulton jest dumnym zwiazowym glazikiem i czlonkiem BAC Local 21. Jako czlonek zwiazku pierwszego pokolenia, jego kariera jest dowodem na to, co mozliwosci, szkolenie i braterstwo w zawodach moga naprawde zapewnic. Poza placem budowy Jimmy jest Agentem ds. Biznesu dla Glazikow i Wykanczajacych z Local 21 w Chicago. Pelni funkcje Wiceprezesa i wspolpracujacego partnera Proud Union Warrior." : "Jimmy Fulton is a proud Union Tile Setter and member of BAC Local 21. As a first-generation union member, his career stands as proof of what opportunity, training, and brotherhood in the trades can truly deliver. Beyond the jobsite, Jimmy is a Business Agent for Local 21 Tile Setters and Finishers in Chicago. He serves as Vice President and contributing partner of Proud Union Warrior, where he helps amplify the voice of the working class, promote union values, and build a platform that represents the grit, pride, and future of the trades.",
                    linktree: null,
                  },`;

if (!c.includes(seanEnd)) { console.error('ERROR: Sean end marker not found'); process.exit(1); }
c = c.replace(seanEnd, jimmyEntry);
console.log('✅ Added Jimmy Fulton');

fs.writeFileSync('src/App.jsx', c);
console.log('done');
