const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

c = c.replace(
  'onClick={() => setApprenticeOpen(o => !o)}',
  'onClick={() => { setApprenticeOpen(o => !o); setLearnOpen(false); }}'
);

c = c.replace(
  'onClick={() => setLearnOpen(o => !o)}',
  'onClick={() => { setLearnOpen(o => !o); setApprenticeOpen(false); }}'
);

fs.writeFileSync('src/App.jsx', c);
console.log('done');
