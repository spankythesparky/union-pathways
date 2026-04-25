
const PAGE_META = {
  '/':           { title: 'Union Pathways — Everything Union Trades. One Place.', desc: 'Find union locals, explore career paths, understand your benefits, and learn the history of the labor movement. Built by tradespeople, for tradespeople. Free.' },
  '/quiz':       { title: 'Union Pathways — Which Trade Is Right For You?', desc: 'Take our free quiz to find out which union construction trade matches your skills, interests, and goals. No cost, no signup.' },
  '/careers':    { title: 'Union Pathways — Career Paths in the Union Trades', desc: 'Learn about apprenticeships, wages, and career paths in union construction trades. Earn while you learn — no college debt.' },
  '/checklist':  { title: 'Union Pathways — How to Join a Union Apprenticeship', desc: 'Step-by-step guide to joining a union construction apprenticeship. The 3 real entry routes, step-by-step.' },
  '/locals':     { title: 'Union Pathways — Understanding Your Local', desc: 'Jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models explained in plain English.' },
  '/calculator': { title: 'Union Pathways — Union Wage Calculator', desc: 'Calculate your union wage, total compensation package value, and retirement projection based on your trade, market, and experience level.' },
  '/history':    { title: 'Union Pathways — Union History in America', desc: 'The 40-hour work week, the weekend, workplace safety — every benefit workers have today was fought for and won by unions.' },
  '/benefits':   { title: 'Union Pathways — Union Benefits Overview', desc: 'Pension, health insurance, annuity, and more — learn what a union job is really worth beyond the hourly wage.' },
  '/retirement': { title: 'Union Pathways — 401k vs Annuity vs Pension Explained', desc: 'Learn the difference between a 401k, annuity, and pension — and why union construction trades offer some of the best retirement benefits in America.' },
  '/health':     { title: 'Union Pathways — Union Health Insurance Explained', desc: 'Your contractor pays your health insurance — not you. Learn how union contractor-paid health coverage works and what it is worth.' },
  '/veterans':   { title: 'Union Pathways — Veterans and the Union Trades', desc: 'Military veterans are a perfect fit for union construction apprenticeships. Learn about Helmets to Hardhats and other veteran programs.' },
  '/about':      { title: 'Union Pathways — About Us', desc: 'Built by IBEW, BAC, and Insulators union members. Real tradespeople building a modern platform for the next generation of workers.' },
  '/resume':     { title: 'Union Pathways — Free Union Trades Resume Template', desc: 'Download a free resume template for union trades apprenticeship applications and career updates. Built by IBEW members.' },
  '/contact':    { title: 'Union Pathways — Contact Us', desc: 'Get in touch with the Union Pathways team. We help tradespeople find their nearest union local.' },
};

export default function middleware(req) {
  const path = new URL(req.url).pathname;
  const m = PAGE_META[path] || PAGE_META['/'];
  const url = 'https://unionpathways.com' + path;

  const ua = req.headers.get('user-agent') || '';
  const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|Applebot|Pinterest|Googlebot|bingbot|DuckDuckBot|redditbot|SnapchatBot|Instagram|vkShare|crawler|spider|bot|preview/i.test(ua);

  if (!isCrawler) return;

  return new Response(`<!DOCTYPE html><html><head>
<title>${m.title}</title>
<meta charset="UTF-8"/>
<meta name="description" content="${m.desc}"/>
<meta property="og:title" content="${m.title}"/>
<meta property="og:description" content="${m.desc}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Union Pathways"/>
<meta property="og:image" content="https://unionpathways.com/social-preview.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="1200"/>
<meta property="og:image:type" content="image/png"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${m.title}"/>
<meta name="twitter:description" content="${m.desc}"/>
<meta name="twitter:image" content="https://unionpathways.com/social-preview.png"/>
<link rel="canonical" href="${url}"/>
</head><body><h1>${m.title}</h1><p>${m.desc}</p></body></html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}
