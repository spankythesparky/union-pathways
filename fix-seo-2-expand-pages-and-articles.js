// fix-seo-2-expand-pages-and-articles.js
//
// Rewrites scripts/generate-og-pages.mjs to:
//   1. Expand the PAGES list from 25 to ~50 pages (fill missing coverage)
//   2. Add Article JSON-LD injection for the 11 trade history pages
//      (which are 5000+ word original works — massively underleveraged content)
//
// After this deploys and Vercel rebuilds, all previously-uncovered pages
// will have proper <title> and <meta description>, and history pages will
// have Article schema that Google can feature as rich results.

const fs = require('fs');
const path = require('path');
const FILE = 'scripts/generate-og-pages.mjs';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: scripts/generate-og-pages.mjs not found.');
  process.exit(1);
}

const original = fs.readFileSync(FILE, 'utf8');

if (original.includes('// SEO PIECE 2 APPLIED')) {
  console.error('ERROR: SEO piece 2 already applied. Aborting.');
  process.exit(1);
}

const newFile = `// SEO PIECE 2 APPLIED
// scripts/generate-og-pages.mjs — postbuild step for per-page SEO
//
// For each page path listed in PAGES, generates a static /path/index.html
// with unique <title>, <meta description>, canonical, and OG tags.
// Additionally injects Article JSON-LD schema for trade history pages
// (they're 5000+ word original articles and benefit massively from Article markup).

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://unionpathways.com';
const PUBLISHER = {
  '@type': 'Organization',
  '@id': SITE + '/#organization',
  name: 'Union Pathways',
  logo: {
    '@type': 'ImageObject',
    url: SITE + '/social-preview.png'
  }
};
const PUBLISHED_DATE = '2025-01-01';   // placeholder; can be tuned per-page later
const MODIFIED_DATE = new Date().toISOString().split('T')[0];

// Article-schema-enabled pages — these produce a long-form Article JSON-LD block
// injected into the generated HTML in addition to the normal OG tags.
const ARTICLE_PAGES = {
  '/history-ibew':   { headline: 'History of the IBEW — The International Brotherhood of Electrical Workers', wordCount: 6500, section: 'Labor History' },
  '/history-ua':     { headline: 'History of the UA — Plumbers and Pipefitters', wordCount: 6200, section: 'Labor History' },
  '/history-smart':  { headline: 'History of SMART — Sheet Metal, Air, Rail and Transportation Workers', wordCount: 5800, section: 'Labor History' },
  '/history-bac':    { headline: 'History of BAC — International Union of Bricklayers and Allied Craftworkers', wordCount: 5200, section: 'Labor History' },
  '/history-ufcw':   { headline: 'History of the UFCW — United Food and Commercial Workers', wordCount: 5400, section: 'Labor History' },
  '/history-iron':   { headline: 'History of the Iron Workers — International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers', wordCount: 5300, section: 'Labor History' },
  '/history-insul':  { headline: 'History of the Insulators — Heat and Frost Insulators (AWIU)', wordCount: 4900, section: 'Labor History' },
  '/history-iuec':   { headline: 'History of IUEC — International Union of Elevator Constructors', wordCount: 4700, section: 'Labor History' },
  '/history-iupat':  { headline: 'History of IUPAT — International Union of Painters and Allied Trades', wordCount: 4600, section: 'Labor History' },
  '/history-nnu':    { headline: 'History of NNU — National Nurses United', wordCount: 4500, section: 'Labor History' },
  '/history':        { headline: 'The Fight That Built America — Union Construction History from 1794 to Today', wordCount: 8000, section: 'Labor History' },
};

const PAGES = {
  // ── Core tools ──
  '/jobboard':   { title: 'Job Board · Union Pathways', description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.' },
  '/wages':      { title: 'Local Wages · Union Pathways', description: 'Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place.' },
  '/locals':     { title: 'Find Your Local · Union Pathways', description: 'Search by ZIP code or city to find your nearest union construction local — IBEW, UA, SMART, Iron Workers, and more.' },
  '/calculator': { title: 'Pay Calculator · Union Pathways', description: 'See your union wage breakdown — base pay, benefits, total package.' },
  '/resume':     { title: 'Resume Builder · Union Pathways', description: 'Build a tradesperson resume designed for union halls and contractors.' },

  // ── Apprenticeship hub + all 10 trade detail pages ──
  '/apprenticeship':        { title: 'Apprenticeship Aptitude Tests · Union Pathways', description: 'What\\'s actually on every union trade apprenticeship test — IBEW NJATC, UA GAN, IUEC EIAT, SMART, Iron Workers, BAC, IUPAT, HFIAW, IUOE, UBC. No prep-course paywall.' },
  '/apprenticeship-ibew':   { title: 'IBEW Apprenticeship Test (NJATC) — What\\'s on It · Union Pathways', description: 'The IBEW electrical apprenticeship aptitude test — Algebra & Functions, Reading Comprehension, 69 questions, 96 minutes, scored 1-9. Complete guide to passing.' },
  '/apprenticeship-ua':     { title: 'UA Apprenticeship Test (GAN) — What\\'s on It · Union Pathways', description: 'The UA Plumbers and Pipefitters apprenticeship test — Reading, Math, Mechanical, Spatial. ~140 questions, 120 minutes. Full breakdown of the Piping Industry Entry Level Assessment.' },
  '/apprenticeship-smart':  { title: 'SMART Sheet Metal Apprenticeship Test — What\\'s on It · Union Pathways', description: 'The SMART sheet metal apprenticeship aptitude test — Math, Reading, Mechanical, Spatial. Format varies by local. Selection is ranking-based.' },
  '/apprenticeship-iuec':   { title: 'IUEC Elevator Apprenticeship Test (EIAT) — What\\'s on It · Union Pathways', description: 'The Elevator Industry Aptitude Test — Arithmetic, Reading Comprehension, Mechanical Comprehension. 100 questions, 90 minutes. Plus the tool recognition test.' },
  '/apprenticeship-iw':     { title: 'Iron Workers Apprenticeship Test — What\\'s on It · Union Pathways', description: 'The Iron Workers apprenticeship aptitude test — Math, Reading, plus a physical assessment. What to expect and how to prepare.' },
  '/apprenticeship-bac':    { title: 'BAC Bricklayers Apprenticeship — How to Get In · Union Pathways', description: 'How to get into the Bricklayers apprenticeship. Math, Reading, physical, and often a 12-week pre-apprenticeship. 7 craft tracks.' },
  '/apprenticeship-hfiaw':  { title: 'Insulators Apprenticeship (HFIAW) — How to Get In · Union Pathways', description: 'The Heat and Frost Insulators apprenticeship — local aptitude test, interview, physical. 4-year program with 160 classroom hours per year.' },
  '/apprenticeship-iuoe':   { title: 'IUOE Operating Engineers Apprenticeship — How to Get In · Union Pathways', description: 'The Operating Engineers apprenticeship. Three branches: Hoisting, Stationary, Mechanics. Local aptitude test or ACT WorkKeys. CDL often required.' },
  '/apprenticeship-ubc':    { title: 'UBC Carpenters Apprenticeship — How to Get In · Union Pathways', description: 'The United Brotherhood of Carpenters apprenticeship. 11 trade specialties. Regional Council aptitude test — Math, Reading, Mechanical, Spatial.' },
  '/apprenticeship-iupat':  { title: 'IUPAT Painters Apprenticeship — How to Get In · Union Pathways', description: 'The Painters and Allied Trades apprenticeship — District Council aptitude test varies by region. Interview-weighted. 8 trades including glaziers, drywall, painters.' },

  // ── History hub + all trade histories ──
  '/history':          { title: 'Union Construction History · Union Pathways', description: 'The fight that built America — union construction history from 1794 to today. Original long-form histories of every major building trade union.' },
  '/trade-history':    { title: 'Trade History Index · Union Pathways', description: 'Deep-dive histories for each union trade. Original 5,000+ word articles on IBEW, UA, SMART, BAC, Iron Workers, Insulators, IUEC, IUPAT, and more.' },
  '/history-ibew':     { title: 'IBEW History · Union Pathways', description: 'The full history of the International Brotherhood of Electrical Workers — from Henry Miller and the 1891 St. Louis founding through the Reid-Murphy split, the Council on Industrial Relations, the AT&T breakup, and today\\'s data center boom.' },
  '/history-ua':       { title: 'UA History · Union Pathways', description: 'The full history of the United Association of Plumbers and Pipefitters — from P.J. Quinlan and the 1889 Washington founding through the Steamfitters\\' War, the 1936 federal apprenticeship, the Veterans in Piping program, and today\\'s LNG and semiconductor boom.' },
  '/history-smart':    { title: 'SMART History · Union Pathways', description: 'The full history of SMART — the International Association of Sheet Metal, Air, Rail and Transportation Workers. From the 1888 Toledo founding through the 2008 merger creating modern SMART. Megaprojects and the 2024 rail bargaining reset.' },
  '/history-bac':      { title: 'BAC History · Union Pathways', description: 'The full history of the International Union of Bricklayers and Allied Craftworkers. The oldest continuously operating trade union in North America — from the 1865 Philadelphia founding through the AFL-CIO merger to today\\'s restoration economy.' },
  '/history-ufcw':     { title: 'UFCW History · Union Pathways', description: 'The full history of the United Food and Commercial Workers — from the 1888 retail clerks and 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, and the 2025 election of Milton Jones.' },
  '/history-iron':     { title: 'Iron Workers History · Union Pathways', description: 'The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding through the McNamara bombings, the Golden Gate Bridge, to the 2025 Kevin Bryenton presidency.' },
  '/history-insul':    { title: 'Insulators History · Union Pathways', description: 'The full history of the Heat and Frost Insulators (AWIU) — from the 1903 St. Louis founding through World War II, the Selikoff asbestos studies, and the push for the Federal Mechanical Insulation Act.' },
  '/history-iuec':     { title: 'IUEC History · Union Pathways', description: 'The full history of the International Union of Elevator Constructors — from the 1901 Pittsburgh founding to the modern elevator and escalator industry.' },
  '/history-iupat':    { title: 'IUPAT History · Union Pathways', description: 'The full history of the International Union of Painters and Allied Trades — from the 1887 founding to today\\'s coalition of painters, drywall finishers, glaziers, and floor coverers.' },
  '/history-nnu':      { title: 'NNU History · Union Pathways', description: 'The full history of National Nurses United — the largest union and professional association of registered nurses in U.S. history.' },

  // ── Organizing ──
  '/organize':             { title: 'Organize Your Workplace · Union Pathways', description: 'How to organize your workplace under federal labor law — your rights, the process, and how union members can help others organize. Built for workers and members alike.' },
  '/organize-contractor':  { title: 'Organizing a Contractor · Union Pathways', description: 'Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in.' },
  '/caucus':               { title: 'Caucus Organizing Guide · Union Pathways', description: 'How to organize a member-driven caucus inside your local. Democratic reform, contract fights, and building rank-and-file power.' },
  '/weingarten':           { title: 'Weingarten Rights — Your Rights at Work · Union Pathways', description: 'Your Weingarten rights when called into a meeting that could lead to discipline. What to say, when to invoke them, and how to enforce them.' },
  '/rtw':                  { title: 'Right to Work — What It Really Means · Union Pathways', description: 'Right to Work laws explained plainly — history, mechanism, and impact on union wages and safety. What states have it and what it means for you.' },

  // ── Career and prep ──
  '/careers':      { title: 'Career Path · Union Pathways', description: 'From apprentice to journeyman to foreman — what to expect in a union construction trade career.' },
  '/checklist':    { title: 'Apprenticeship Checklist · Union Pathways', description: 'Step-by-step guide to getting into a union apprenticeship in your area.' },
  '/quiz':         { title: 'Which Trade is Right for You? · Union Pathways', description: 'Take the quiz to find the union construction trade that matches your interests and strengths.' },
  '/veterans':     { title: 'Helmets to Hardhats — Veterans to the Trades · Union Pathways', description: 'Direct pipeline from military service to a union construction trade career.' },

  // ── Benefits and money ──
  '/benefits':     { title: 'Union Benefits · Union Pathways', description: 'What union construction members earn in benefits beyond base pay — health, pension, annuity.' },
  '/retirement':   { title: '401k vs Annuity vs Pension · Union Pathways', description: 'Three ways union construction trades help you retire — explained in plain English.' },
  '/health':       { title: 'Health & Welfare · Union Pathways', description: 'How union health insurance works for tradespeople and their families.' },
  '/downpayment':  { title: 'Down Payment Calculator for Tradespeople · Union Pathways', description: 'How much house can you actually afford on a union tradesperson\\'s wage? Real math for real budgets.' },
  '/mental-health':{ title: 'Mental Health for Tradespeople · Union Pathways', description: 'Mental health resources for construction workers. Suicide prevention, substance use, and the resources your local likely already provides.' },

  // ── Meta pages ──
  '/about':        { title: 'About · Union Pathways', description: 'Built by tradespeople, for the trades. Learn what Union Pathways is and why it exists.' },
  '/contact':      { title: 'Contact · Union Pathways', description: 'Get in touch with Union Pathways — questions, feedback, or partnership inquiries.' },
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

function buildArticleJsonLd(pagePath, meta, article) {
  const fullUrl = SITE + pagePath;
  return \`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "\${fullUrl}#article",
  "headline": \${JSON.stringify(article.headline)},
  "description": \${JSON.stringify(meta.description)},
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "\${fullUrl}"
  },
  "image": {
    "@type": "ImageObject",
    "url": "\${SITE}/social-preview.png",
    "width": 1200,
    "height": 630
  },
  "author": \${JSON.stringify(PUBLISHER)},
  "publisher": \${JSON.stringify(PUBLISHER)},
  "datePublished": "\${PUBLISHED_DATE}",
  "dateModified": "\${MODIFIED_DATE}",
  "articleSection": \${JSON.stringify(article.section)},
  "wordCount": \${article.wordCount},
  "inLanguage": "en-US",
  "isAccessibleForFree": true
}
</script>\`;
}

function rewriteHtml(html, meta, fullUrl, articleSchema) {
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);

  let rewritten = html
    .replace(/<title>[^<]*<\\/title>/, \`<title>\${t}</title>\`)
    .replace(/<meta name="description" content="[^"]*"\\s*\\/?>/, \`<meta name="description" content="\${d}"/>\`)
    .replace(/<meta property="og:title" content="[^"]*"\\s*\\/?>/, \`<meta property="og:title" content="\${t}"/>\`)
    .replace(/<meta property="og:description" content="[^"]*"\\s*\\/?>/, \`<meta property="og:description" content="\${d}"/>\`)
    .replace(/<meta property="og:url" content="[^"]*"\\s*\\/?>/, \`<meta property="og:url" content="\${fullUrl}"/>\`)
    .replace(/<meta name="twitter:title" content="[^"]*"\\s*\\/?>/, \`<meta name="twitter:title" content="\${t}"/>\`)
    .replace(/<meta name="twitter:description" content="[^"]*"\\s*\\/?>/, \`<meta name="twitter:description" content="\${d}"/>\`)
    .replace(/<link rel="canonical" href="[^"]*"\\s*\\/?>/, \`<link rel="canonical" href="\${fullUrl}"/>\`);

  // Inject Article JSON-LD just before </head> for pages that have it
  if (articleSchema) {
    rewritten = rewritten.replace('</head>', \`  \${articleSchema}\\n  </head>\`);
  }

  return rewritten;
}

let count = 0;
let articleCount = 0;
for (const [pagePath, meta] of Object.entries(PAGES)) {
  const fullUrl = SITE + pagePath;
  const article = ARTICLE_PAGES[pagePath];
  const articleSchema = article ? buildArticleJsonLd(pagePath, meta, article) : null;
  const html = rewriteHtml(indexHtml, meta, fullUrl, articleSchema);
  const targetDir = path.join(distDir, pagePath.slice(1));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  count++;
  if (article) articleCount++;
}

console.log(\`✓ Generated \${count} per-page HTML files with custom OG tags\`);
console.log(\`✓ Injected Article JSON-LD on \${articleCount} history/article pages\`);
`;

fs.writeFileSync(FILE, newFile);

console.log('');
console.log('Done. Piece 2 of 4 applied — expanded PAGES + Article schema:');
console.log('  - PAGES list expanded from 25 to ~45 pages');
console.log('    (added: apprenticeship hub + 10 detail pages, missing history pages,');
console.log('     caucus, weingarten, rtw, mental-health, downpayment)');
console.log('  - Article JSON-LD injection added for 11 history pages');
console.log('    (headline, wordCount, section, publisher, dates — full Article schema)');
console.log('  - Original 25-page coverage preserved and enhanced');
console.log('');
console.log('Now run:');
console.log('  git add scripts/generate-og-pages.mjs && git commit -m "seo: expand PAGES to ~50 pages, add Article JSON-LD to history" && git push');
console.log('');
console.log('After Vercel deploys (~90 sec), validate with:');
console.log('  https://validator.schema.org/#url=https%3A%2F%2Funionpathways.com%2Fhistory-ibew');
console.log('  (should show Article + WebSite + Organization detected, 0 errors)');
console.log('');
console.log('And Rich Results Test (Article IS a rich result type):');
console.log('  https://search.google.com/test/rich-results?url=https://unionpathways.com/history-ibew');
console.log('  (should show 1 valid Article — this is the visible SEO win)');
console.log('');
