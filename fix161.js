// fix161.js — Swap wage form to dedicated EmailJS template
//
// Currently both wage AND job board submissions hit template_a55dhfh.
// User created template_8fxawbm specifically for wage emails.
// This change makes wage submissions use the new template; job board still uses the old one.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// The wage form's EmailJS send is unique — it's the one with status: 'WAGES SUBMISSION'
// Anchor on the full call so we don't accidentally swap the job board call.
const oldCall = `                await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',`;

const newCall = `                await window.emailjs.send('service_uy3qbna', 'template_8fxawbm', {
                  trade: tradeName, local_name: local.name, city: local.city, state: local.state,
                  status: 'WAGES SUBMISSION',`;

if (!src.includes(oldCall)) {
  console.error('ERROR: Could not find wage EmailJS send call. Aborting.');
  console.error('(Did fix160 run successfully first? It needs to land before this fix.)');
  process.exit(1);
}

const occurrences = src.split(oldCall).length - 1;
if (occurrences !== 1) {
  console.error('ERROR: Expected exactly 1 wage send call, found ' + occurrences + '. Aborting.');
  process.exit(1);
}

src = src.replace(oldCall, () => newCall);

if (src === original) {
  console.error('ERROR: No changes made. Aborting.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Wage form now uses template_8fxawbm (dedicated wage template).');
console.log('Job Board still uses template_a55dhfh (its existing template).');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: split wage submissions to dedicated EmailJS template" && git push');
console.log('');
