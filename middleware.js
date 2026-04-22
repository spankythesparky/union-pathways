export const config = { matcher: ['/', '/quiz', '/careers', '/checklist', '/history', '/retirement', '/veterans', '/contact'] };

const PAGE_META = {
  '/':           { title: 'Union Pathways - Find Your Nearest Union Construction Local', desc: 'Find your nearest union construction local — IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators, Laborers and more. Free resource for tradespeople.' },
  '/quiz':       { title: 'Union Pathways - Which Trade Is Right For You?', desc: 'Take our free quiz to find out which union construction trade matches your skills, interests, and goals. No cost, no signup.' },
  '/careers':    { title: 'Union Pathways - Career Paths in the Union Trades', desc: 'Learn about apprenticeships, wages, and career paths in union construction trades. Earn while you learn — no college debt.' },
  '/checklist':  { title: 'Union Pathways - How to Join a Union Apprenticeship', desc: 'Step-by-step guide to joining a union construction apprenticeship. Requirements, timeline, and how to apply.' },
  '/history':    { title: 'Union Pathways - Union History in America', desc: 'The 40-hour work week, the weekend, workplace safety — every benefit workers have today was fought for and won by unions. Learn the history.' },
  '/retirement': { title: 'Union Pathways - 401k vs Annuity vs Pension Explained', desc: 'Learn the difference between a 401k, annuity, and pension — and why union construction trades offer some of the best retirement benefits in America.' },
  '/veterans':   { title: 'Union Pathways - Veterans and the Union Trades', desc: 'Military veterans are a perfect fit for union construction apprenticeships. Learn about Helmets to Hardhats and other veteran programs.' },
  '/contact':    { title: 'Union Pathways - Contact Us', desc: 'Get in touch with the Union Pathways team. We help tradespeople find their nearest union local.' },
  '/health':     { title: 'Union Pathways - Union Health Insurance Explained', desc: 'Learn how union contractor-paid health insurance works — and why it is one of the most valuable benefits in the trades.' },
  '/benefits':   { title: 'Union Pathways - Union Benefits Overview', desc: 'Pension, health insurance, annuity, and more — learn what a union job is really worth beyond the hourly wage.' },
  '/about':      { title: 'Union Pathways - About Us', desc: 'Built by union tradespeople for union tradespeople. Learn about the team behind Union Pathways.' },
  '/locals':     { title: 'Union Pathways - Understanding Your Local', desc: 'Jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models explained.' },
  '/calculator': { title: 'Union Pathways - Union Wage Calculator', desc: 'Calculate your union wage, total compensation package, and retirement projection based on your trade and market.' },
};

const CRAWLERS = ['facebookexternalhit','Facebot','Twitterbot','LinkedInBot','WhatsApp','Slackbot','TelegramBot','Discordbot','Applebot','Pinterest','Googlebot'];

export default function middleware(req) {
  const ua = req.headers.get('user-agent') || '';
  const isCrawler = CRAWLERS.some(b => ua.includes(b));
  if (!isCrawler) return;

  const path = new URL(req.url).pathname;
  const m = PAGE_META[path] || PAGE_META['/'];
  const url = 'https://unionpathways.com' + path;

  return new Response(`<!DOCTYPE html><html><head>
<title>${m.title}</title>
<meta name="description" content="${m.desc}"/>
<meta property="og:title" content="${m.title}"/>
<meta property="og:description" content="${m.desc}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Union Pathways"/>
<meta property="og:image" content="https://unionpathways.com/social-preview.png"/>
<meta name="twitter:title" content="${m.title}"/>
<meta name="twitter:description" content="${m.desc}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="1200"/>
<meta name="twitter:image" content="https://unionpathways.com/social-preview.png"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="canonical" href="${url}"/>
</head><body><h1>${m.title}</h1><p>${m.desc}</p></body></html>`, {
    headers: { 'Content-Type': 'text/html' }
  });
}
