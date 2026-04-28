import fs from 'node:fs';
import path from 'node:path';

const PAGES = {
  '/jobboard':   { title: 'Job Board · Union Pathways', description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.' },
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
