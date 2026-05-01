import fs from 'node:fs';
import path from 'node:path';

const PAGES = {
  '/jobboard':   { title: 'Job Board · Union Pathways', description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.' },
  '/wages':      { title: 'Local Wages · Union Pathways', description: 'Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.' },
  '/history-ibew': { title: 'IBEW History · Union Pathways', description: 'The full history of the International Brotherhood of Electrical Workers — from Henry Miller and the 1891 St. Louis founding through the Reid-Murphy split, the Council on Industrial Relations, the AT&T breakup, and today\'s data center boom.' },
  '/history-ua': { title: 'UA History · Union Pathways', description: 'The full history of the United Association of Plumbers and Pipefitters — from P.J. Quinlan and the 1889 Washington founding through the Steamfitters\' War, the 1936 federal apprenticeship, the Veterans in Piping program, and today\'s LNG and semiconductor boom.' },
  '/trade-history': { title: 'Trade History · Union Pathways', description: 'Deep-dive histories for each union trade are on the way. For now, read the general history of organized labor.' },
  '/history-smart': { title: 'SMART History · Union Pathways', description: 'The full history of SMART — the International Association of Sheet Metal, Air, Rail and Transportation Workers. From the 1888 Toledo founding of the tinsmiths\' union and the parallel railroad operating brotherhoods to the 2008 merger that created modern SMART. Megaprojects, the 2024 rail bargaining reset, and two crafts under one charter.' },
  '/history-bac': { title: 'BAC History · Union Pathways', description: 'The full history of the International Union of Bricklayers and Allied Craftworkers. The oldest continuously operating trade union in North America — from the 1865 Philadelphia founding through the Bates era and the AFL-CIO merger to today\'s restoration economy.' },
  '/history-ufcw': { title: 'UFCW History · Union Pathways', description: 'The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president.' },
  '/organize': { title: 'Organize Your Workplace · Union Pathways', description: 'How to organize your workplace under federal labor law — your rights, the process, and how union members can help others organize. Built for workers and members alike.' },
  '/organize-contractor': { title: 'Organizing a Contractor · Union Pathways', description: 'Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in.' },
  '/careers':    { title: 'Career Path · Union Pathways', description: 'From apprentice to journeyman to foreman — what to expect in a union construction trade career.' },
  '/checklist':  { title: 'Apprenticeship Checklist · Union Pathways', description: 'Step-by-step guide to getting into a union apprenticeship in your area.' },
  '/quiz':       { title: 'Which Trade is Right for You? · Union Pathways', description: 'Take the quiz to find the union construction trade that matches your interests and strengths.' },
  '/history':    { title: 'Union History · Union Pathways', description: 'The fight that built America — union construction history from 1794 to today.' },
  '/retirement': { title: '401k vs Annuity vs Pension · Union Pathways', description: 'Three ways union construction trades help you retire — explained in plain English.' },
  '/veterans':   { title: 'Helmets to Hardhats · Union Pathways', description: 'Direct pipeline from military service to a union construction trade career.' },
  '/locals':     { title: 'Find Your Local · Union Pathways', description: 'Search by ZIP code or city to find your nearest union construction local.' },
  '/contact':    { title: 'Contact · Union Pathways', description: 'Get in touch with Union Pathways — questions, feedback, or partnership inquiries.' },
  '/about':      { title: 'About · Union Pathways', description: 'Built by tradespeople, for the trades. Learn what Union Pathways is and why it exists.' },
  '/calculator': { title: 'Pay Calculator · Union Pathways', description: 'See your union wage breakdown — base pay, benefits, total package.' },
  '/benefits':   { title: 'Union Benefits · Union Pathways', description: 'What union construction members earn in benefits beyond base pay — health, pension, annuity.' },
  '/health':     { title: 'Health & Welfare · Union Pathways', description: 'How union health insurance works for tradespeople and their families.' },
  '/resume':     { title: 'Resume Builder · Union Pathways', description: 'Build a tradesperson resume designed for union halls and contractors.' },
};

const distDir = 'dist';
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf-8');

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function rewriteHtml(html, meta, fullUrl) {
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${d}"/>`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${t}"/>`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${d}"/>`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${fullUrl}"/>`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${t}"/>`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${d}"/>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${fullUrl}"/>`);
}

let count = 0;
for (const [pagePath, meta] of Object.entries(PAGES)) {
  const fullUrl = `https://unionpathways.com${pagePath}`;
  const html = rewriteHtml(indexHtml, meta, fullUrl);
  const targetDir = path.join(distDir, pagePath.slice(1));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  count++;
}

console.log(`✓ Generated ${count} per-page HTML files with custom OG tags`);
