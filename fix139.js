// fix139.js
// The prerender script at scripts/generate-og-pages.mjs is missing four routes
// that have been added since it was last updated. Result: when someone shares
// /history-bac, /history-smart, /organize, or /organize-contractor on social
// media, the crawler hits the SPA fallback (home index.html) and unfurls with
// the home page description.
//
// Fix: Add those four routes to the PAGES object in the prerender script.
//
// The script runs automatically as a `postbuild` hook on Vercel — no other
// config changes are required. After this commits and redeploys, sharing any
// of those four pages will unfurl with the correct page-specific description.

const fs = require('fs');
const scriptPath = 'scripts/generate-og-pages.mjs';

if (!fs.existsSync(scriptPath)) {
  console.error('ERROR: ' + scriptPath + ' not found. Are you running this from the project root?');
  process.exit(1);
}

let code = fs.readFileSync(scriptPath, 'utf8');

const anchor = `  '/trade-history': { title: 'Trade History · Union Pathways', description: 'Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor.' },`;

const replacement =
`  '/trade-history': { title: 'Trade History · Union Pathways', description: 'Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor.' },
  '/history-smart': { title: 'SMART History · Union Pathways', description: 'The full history of SMART — the International Association of Sheet Metal, Air, Rail and Transportation Workers. From the 1888 Toledo founding of the tinsmiths\\' union and the parallel railroad operating brotherhoods to the 2008 merger that created modern SMART. Megaprojects, the 2024 rail bargaining reset, and two crafts under one charter.' },
  '/history-bac': { title: 'BAC History · Union Pathways', description: 'The full history of the International Union of Bricklayers and Allied Craftworkers. The oldest continuously operating trade union in North America — from the 1865 Philadelphia founding through the Bates era and the AFL-CIO merger to today\\'s restoration economy.' },
  '/organize': { title: 'Organize Your Workplace · Union Pathways', description: 'How to organize your workplace under federal labor law — your rights, the process, and how union members can help others organize. Built for workers and members alike.' },
  '/organize-contractor': { title: 'Organizing a Contractor · Union Pathways', description: 'Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in.' },`;

if (code.includes("'/history-bac':") || code.includes("'/history-smart':")) {
  console.log('Skipping — new routes already present in prerender script.');
} else if (code.includes(anchor)) {
  code = code.replace(anchor, replacement);
  console.log('✓ Added /history-smart, /history-bac, /organize, /organize-contractor to prerender script');
} else {
  console.error('ERROR: trade-history anchor not found in expected form. The prerender script may have been edited.');
  process.exit(1);
}

fs.writeFileSync(scriptPath, code);

console.log('');
console.log('Done.');
console.log('');
console.log('Now run:');
console.log('   git add scripts/generate-og-pages.mjs && git commit -m "feat: prerender og tags for SMART, BAC, and organize pages" && git push');
console.log('');
console.log('After Vercel rebuilds (~90 sec), test by pasting a link to /history-bac into iMessage');
console.log('or Facebook — it should now unfurl with the BAC-specific title and description.');
console.log('');
