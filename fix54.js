const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// Fix comparison table rows
const oldTable = `                          {[
                            ["Who funds it?", "Employer pays", "Employer pays", "You pay in"],
                            ["Guaranteed payment?", "Yes, for life", "Yes, fixed amount", "No — market dependent"],
                            ["You control investments?", "No", "No", "Yes"],
                            ["Monthly check in retirement?", "Yes", "Yes", "You withdraw as needed"],
                            ["Common in union trades?", "Very common", "Very common", "Sometimes"],
                            ["Risk to worker?", "Very low", "Very low", "Higher — market risk"],
                          ].map((row, i) => (`;

const newTable = `                          {[
                            [lang==="es"?"Quien lo financia?":lang==="pl"?"Kto finansuje?":"Who funds it?", lang==="es"?"El empleador":lang==="pl"?"Pracodawca":"Employer pays", lang==="es"?"El empleador":lang==="pl"?"Pracodawca":"Employer pays", lang==="es"?"Tu pagas":lang==="pl"?"Ty placisz":"You pay in"],
                            [lang==="es"?"Pago garantizado?":lang==="pl"?"Gwarantowana wyplata?":"Guaranteed payment?", lang==="es"?"Si, de por vida":lang==="pl"?"Tak, dozgonnie":"Yes, for life", lang==="es"?"Si, monto fijo":lang==="pl"?"Tak, stala kwota":"Yes, fixed amount", lang==="es"?"No, depende del mercado":lang==="pl"?"Nie, zalezne od rynku":"No — market dependent"],
                            [lang==="es"?"Controlas inversiones?":lang==="pl"?"Kontrolujesz inwestycje?":"You control investments?", lang==="es"?"No":lang==="pl"?"Nie":"No", lang==="es"?"No":lang==="pl"?"Nie":"No", lang==="es"?"Si":lang==="pl"?"Tak":"Yes"],
                            [lang==="es"?"Cheque mensual?":lang==="pl"?"Miesieczna wyplata?":"Monthly check in retirement?", lang==="es"?"Si":lang==="pl"?"Tak":"Yes", lang==="es"?"Si":lang==="pl"?"Tak":"Yes", lang==="es"?"Retiras segun necesitas":lang==="pl"?"Wyplacasz wg potrzeb":"You withdraw as needed"],
                            [lang==="es"?"Comun en oficios sindicales?":lang==="pl"?"Czeste w zwiazach?":"Common in union trades?", lang==="es"?"Muy comun":lang==="pl"?"Bardzo czeste":"Very common", lang==="es"?"Muy comun":lang==="pl"?"Bardzo czeste":"Very common", lang==="es"?"A veces":lang==="pl"?"Czasem":"Sometimes"],
                            [lang==="es"?"Riesgo para el trabajador?":lang==="pl"?"Ryzyko dla pracownika?":"Risk to worker?", lang==="es"?"Muy bajo":lang==="pl"?"Bardzo niskie":"Very low", lang==="es"?"Muy bajo":lang==="pl"?"Bardzo niskie":"Very low", lang==="es"?"Mayor — riesgo de mercado":lang==="pl"?"Wyzsze — ryzyko rynkowe":"Higher — market risk"],
                          ].map((row, i) => (`;

if (!c.includes(oldTable)) { console.error('ERROR: table not found'); process.exit(1); }
c = c.replace(oldTable, newTable);
console.log('✅ Fixed comparison table translations');

// Fix the package table labels
const oldPackage = `                        {[
                          ["Base Wage", "$48.00/hr", true, lang==="es" ? "Lo que aparece en tu cheque" : lang==="pl" ? "Co pojawia sie w wyplacie" : "This is what appears on your paycheck"],
                          ["Health & Welfare", "$12.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Pension", "$9.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Annuity", "$5.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Vacation Fund", "$4.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          ["Training & Other", "$2.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                        ].map(([label, amount, isWage, note], i) => (`;

const newPackage = `                        {[
                          [lang==="es"?"Salario Base":lang==="pl"?"Wynagrodzenie Podstawowe":"Base Wage", "$48.00/hr", true, lang==="es" ? "Lo que aparece en tu cheque" : lang==="pl" ? "Co pojawia sie w wyplacie" : "This is what appears on your paycheck"],
                          [lang==="es"?"Salud y Bienestar":lang==="pl"?"Zdrowie i Swiadczenia":"Health & Welfare", "$12.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Pension":lang==="pl"?"Emerytura":"Pension", "$9.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Anualidad":lang==="pl"?"Renta Annuitetowa":"Annuity", "$5.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Fondo de Vacaciones":lang==="pl"?"Fundusz Urlopowy":"Vacation Fund", "$4.50/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                          [lang==="es"?"Formacion y Otros":lang==="pl"?"Szkolenie i Inne":"Training & Other", "$2.00/hr", false, lang==="es" ? "Pagado por el contratista — NO deducido" : lang==="pl" ? "Placone przez wykonawce — NIE potrącane" : "Paid by contractor — NOT deducted from your check"],
                        ].map(([label, amount, isWage, note], i) => (`;

if (!c.includes(oldPackage)) { console.error('ERROR: package table not found'); process.exit(1); }
c = c.replace(oldPackage, newPackage);
console.log('✅ Fixed package table translations');

// Fix total compensation label
c = c.replace(
  `<span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"white"}}>{lang==="es" ? "COMPENSACION TOTAL" : lang==="pl" ? "CALKOWITE WYNAGRODZENIE" : "TOTAL COMPENSATION"}</span>`,
  `<span style={{fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, color:"white"}}>{lang==="es" ? "COMPENSACION TOTAL" : lang==="pl" ? "CALKOWITE WYNAGRODZENIE" : "TOTAL COMPENSATION"}</span>`
);

// Fix table headers Pension/Annuity/401k
c = c.replace(
  `{["", "Pension", "Annuity", "401k"].map(h => (`,
  `{["", lang==="es"?"Pension":lang==="pl"?"Emerytura":"Pension", lang==="es"?"Anualidad":lang==="pl"?"Renta":"Annuity", "401k"].map(h => (`
);
console.log('✅ Fixed table column headers');

fs.writeFileSync('src/App.jsx', c);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "fix: retirement page full ES and PL translations" && git push\n');
