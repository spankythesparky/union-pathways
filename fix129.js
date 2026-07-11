// fix129.js
// Strip all Local 24 references from the Organizing a Contractor page so the
// content reads as fully generic. Three targeted swaps:
//   1. Caveat paragraph: drop the "how IBEW Local 24 does it" framing
//   2. Bonding step: drop "Local 24 requires two"
//   3. Reporting step: drop "Local 24 uses one called EPRlive"
//
// (The Local 24 entry in the IBEW_INSIDE_LOCALS database is a separate, real
// directory entry — left untouched.)

const fs = require('fs');
const path = 'src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const swaps = [
  {
    label: 'caveat paragraph',
    old: `                The walkthrough below is how IBEW Local 24 does it. Treat it as the shape of the conversation, not the literal checklist — confirm the specifics with the local that has jurisdiction over the work.`,
    new: `                The walkthrough below is the general shape of the process. The specifics — bonding amounts, which administrator handles benefits, the workforce-transition rules — vary by local. Confirm details with the local that has jurisdiction over the work.`,
  },
  {
    label: 'bonding intro',
    old: `                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:12}}>Each local has its own bonding requirements. Local 24 requires two:</div>`,
    new: `                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7, marginBottom:12}}>Each local has its own bonding requirements. A common pattern is two bonds:</div>`,
  },
  {
    label: 'reporting / EPRlive',
    old: `                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>The contractor needs to be set up with the local to report fringe benefits on their employees. Most locals use a third-party administrator. Local 24 uses one called <b>EPRlive</b> — contractors enter monthly hours worked per member and the system calculates the amount owed.</div>`,
    new: `                  <div style={{fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.7}}>The contractor needs to be set up with the local to report fringe benefits on their employees. Most locals use a third-party administrator — contractors enter monthly hours worked per member and the system calculates the amount owed.</div>`,
  },
];

let changes = 0;
for (const s of swaps) {
  if (code.includes(s.old)) {
    code = code.replace(s.old, s.new);
    console.log(`✓ Updated ${s.label}`);
    changes++;
  } else if (code.includes(s.new)) {
    console.log(`Skipping ${s.label} — already updated.`);
  } else {
    console.error(`ERROR: ${s.label} pattern not found.`);
    process.exit(1);
  }
}

fs.writeFileSync(path, code);

console.log('');
console.log(`Done. ${changes} change(s) applied.`);
console.log('');
console.log('Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: remove Local 24 references from contractor page" && git push');
console.log('');
