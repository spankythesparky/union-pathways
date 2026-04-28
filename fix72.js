const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const seanStart = code.indexOf('                  {\n                    id:"sean"');
const jimmyEnd = code.indexOf('                    linktree: null,\n                  },\n                ].map((partner)', seanStart) + '                    linktree: null,\n                  },\n'.length;

if (seanStart === -1) { console.error('Sean not found'); process.exit(1); }

code = code.slice(0, seanStart) + '                ].map((partner)' + code.slice(jimmyEnd);

fs.writeFileSync('src/App.jsx', code);
console.log('done');
