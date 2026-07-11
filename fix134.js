// fix134.js
// Trim the COMPARE_JOBS dataset down to just non-union construction trades.
// Removes: retail, restaurant, warehouse, office, factory.
// Keeps: construction laborer, electrician's helper, non-union electrician,
// plumber, carpenter, HVAC, custom.
//
// Also broadens a couple of the trade entries (helper → plus general, etc.)
// to cover the same ground with fewer options.

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldDataset =
`          const COMPARE_JOBS = {
            retail:       { name: { en:"Retail Sales Associate", es:"Vendedor Minorista", pl:"Sprzedawca Detaliczny" }, hourly: 16.50 },
            food:         { name: { en:"Restaurant / Food Service", es:"Restaurante / Servicio de Comida", pl:"Restauracja / Gastronomia" }, hourly: 15.00 },
            warehouse:    { name: { en:"Warehouse / Delivery Driver", es:"Almacen / Repartidor", pl:"Magazyn / Kierowca Dostawczy" }, hourly: 20.00 },
            laborer:      { name: { en:"Construction Laborer (Non-Union)", es:"Obrero de Construccion (No Sindical)", pl:"Robotnik Budowlany (Niezwiazowy)" }, hourly: 20.50 },
            helper:       { name: { en:"Electrician's Helper (Non-Union)", es:"Ayudante de Electricista (No Sindical)", pl:"Pomocnik Elektryka (Niezwiazowy)" }, hourly: 18.00 },
            elec_nu:      { name: { en:"Non-Union Journeyman Electrician", es:"Electricista Oficial (No Sindical)", pl:"Elektryk Czeladnik (Niezwiazowy)" }, hourly: 32.00 },
            plumb_nu:     { name: { en:"Non-Union Plumber", es:"Plomero (No Sindical)", pl:"Hydraulik (Niezwiazowy)" }, hourly: 30.00 },
            carp_nu:      { name: { en:"Non-Union Carpenter", es:"Carpintero (No Sindical)", pl:"Stolarz (Niezwiazowy)" }, hourly: 26.00 },
            hvac_nu:      { name: { en:"Non-Union HVAC Technician", es:"Tecnico HVAC (No Sindical)", pl:"Technik HVAC (Niezwiazowy)" }, hourly: 28.00 },
            office:       { name: { en:"Office / Administrative", es:"Oficina / Administrativo", pl:"Biuro / Administracja" }, hourly: 22.00 },
            factory:      { name: { en:"Manufacturing / Factory", es:"Fabricacion / Fabrica", pl:"Produkcja / Fabryka" }, hourly: 22.00 },
            custom:       { name: { en:"Custom (enter your wage)", es:"Personalizado (introduce tu salario)", pl:"Wlasna (wprowadz swoja stawke)" }, hourly: null },
          };`;

const newDataset =
`          const COMPARE_JOBS = {
            laborer:      { name: { en:"Construction Laborer (Non-Union)", es:"Obrero de Construccion (No Sindical)", pl:"Robotnik Budowlany (Niezwiazowy)" }, hourly: 20.50 },
            helper:       { name: { en:"Electrician's Helper / Trade Helper (Non-Union)", es:"Ayudante de Oficio (No Sindical)", pl:"Pomocnik (Niezwiazowy)" }, hourly: 18.00 },
            elec_nu:      { name: { en:"Non-Union Electrician", es:"Electricista (No Sindical)", pl:"Elektryk (Niezwiazowy)" }, hourly: 32.00 },
            plumb_nu:     { name: { en:"Non-Union Plumber / Pipefitter", es:"Plomero / Tuberia (No Sindical)", pl:"Hydraulik / Monter (Niezwiazowy)" }, hourly: 30.00 },
            carp_nu:      { name: { en:"Non-Union Carpenter", es:"Carpintero (No Sindical)", pl:"Stolarz (Niezwiazowy)" }, hourly: 26.00 },
            sm_nu:        { name: { en:"Non-Union Sheet Metal Worker", es:"Hojalatero (No Sindical)", pl:"Blacharz (Niezwiazowy)" }, hourly: 27.00 },
            iw_nu:        { name: { en:"Non-Union Ironworker", es:"Trabajador del Hierro (No Sindical)", pl:"Hutnik (Niezwiazowy)" }, hourly: 26.00 },
            hvac_nu:      { name: { en:"Non-Union HVAC Technician", es:"Tecnico HVAC (No Sindical)", pl:"Technik HVAC (Niezwiazowy)" }, hourly: 28.00 },
            mason_nu:     { name: { en:"Non-Union Bricklayer / Mason", es:"Albañil (No Sindical)", pl:"Murarz (Niezwiazowy)" }, hourly: 25.00 },
            op_nu:        { name: { en:"Non-Union Heavy Equipment Operator", es:"Operador de Equipo Pesado (No Sindical)", pl:"Operator Sprzetu Ciezkiego (Niezwiazowy)" }, hourly: 28.00 },
            custom:       { name: { en:"Custom (enter your wage)", es:"Personalizado (introduce tu salario)", pl:"Wlasna (wprowadz swoja stawke)" }, hourly: null },
          };`;

if (!code.includes(oldDataset)) {
  if (code.includes('sm_nu:')) {
    console.log('Skipping — dataset already trimmed.');
  } else {
    console.error('ERROR: original COMPARE_JOBS dataset not found.');
    process.exit(1);
  }
} else {
  code = code.replace(oldDataset, newDataset);
  console.log('✓ Trimmed COMPARE_JOBS to non-union trades only');
}

fs.writeFileSync(path, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: limit Compare Against to non-union trades only" && git push');
console.log('');
