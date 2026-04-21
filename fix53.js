const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

const oldSearch = `              const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS];
              const localResults = ALL_LOCALS.filter(l =>
                l.name.toLowerCase().includes(q) ||
                l.city.toLowerCase().includes(q) ||
                l.state.toLowerCase().includes(q) ||
                (l.address && l.address.toLowerCase().includes(q))
              ).slice(0, 8);`;

const newSearch = `              const ALL_LOCALS = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...BAC_LOCALS, ...IW_LOCALS];
              const qWords = q.split(/\\s+/).filter(Boolean);
              const localResults = ALL_LOCALS.filter(l => {
                const haystack = [l.name, l.city, l.state, l.address || "", l.phone || ""].join(" ").toLowerCase();
                return qWords.every(word => haystack.includes(word));
              }).slice(0, 10);`;

if (!c.includes(oldSearch)) { console.error('ERROR: search block not found'); process.exit(1); }
c = c.replace(oldSearch, newSearch);
fs.writeFileSync('src/App.jsx', c);
console.log('done');
