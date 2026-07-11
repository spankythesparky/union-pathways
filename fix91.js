// fix91.js — Add wages + jobboard meta tags so social shares show the right description
const fs = require('fs');

const FILE = 'src/App.jsx';
let code = fs.readFileSync(FILE, 'utf8');

function replaceOnce(haystack, needle, replacement, label) {
  if (!haystack.includes(needle)) {
    console.error('ERROR: anchor not found for "' + label + '"');
    process.exit(1);
  }
  if (haystack.split(needle).length > 2) {
    console.error('ERROR: anchor matches more than once for "' + label + '"');
    process.exit(1);
  }
  return haystack.replace(needle, replacement);
}

// Add wages + jobboard entries to PAGE_META
const oldEnd = `      contact:   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },
    };`;

const newEnd = `      contact:   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },
      jobboard:  { title: "Union Pathways — Live Job Board", desc: "Real-time work outlook reports from union locals across the country. See which halls are busy, steady, or slow before you travel for work." },
      wages:     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },
    };`;

code = replaceOnce(code, oldEnd, newEnd, 'PAGE_META wages + jobboard');
console.log('1/1 ✓ Added wages + jobboard meta tags');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: meta tags for wages + jobboard pages" && git push\n');
