// Vercel Edge Middleware — rewrite per-page <title>, description, and OG tags
// Runs on every page request before serving HTML to the browser.

export const config = {
  matcher: '/((?!api|_next|.*\\.).*)',
};

const PAGES = {
  '/': {
    title: 'Union Pathways - Find Your Nearest Union Construction Local',
    description: 'Find your nearest union construction local — IBEW, UA, BAC, Ironworkers and more. Free resource for tradespeople.',
  },
  '/jobboard': {
    title: 'Job Board · Union Pathways',
    description: 'Real-time work outlook from union members nationwide. See which locals are busy, steady, or slow.',
  },
  '/careers': {
    title: 'Career Path · Union Pathways',
    description: 'From apprentice to journeyman to foreman — what to expect in a union construction trade career.',
  },
  '/checklist': {
    title: 'Apprenticeship Checklist · Union Pathways',
    description: 'Step-by-step guide to getting into a union apprenticeship in your area.',
  },
  '/quiz': {
    title: 'Which Trade is Right for You? · Union Pathways',
    description: 'Take the quiz to find the union construction trade that matches your interests and strengths.',
  },
  '/history': {
    title: 'Union History · Union Pathways',
    description: 'The fight that built America — union construction history from 1794 to today.',
  },
  '/retirement': {
    title: '401k vs Annuity vs Pension · Union Pathways',
    description: 'Three ways union construction trades help you retire — explained in plain English.',
  },
  '/veterans': {
    title: 'Helmets to Hardhats · Union Pathways',
    description: 'Direct pipeline from military service to a union construction trade career.',
  },
  '/locals': {
    title: 'Find Your Local · Union Pathways',
    description: 'Search by ZIP code or city to find your nearest union construction local.',
  },
  '/contact': {
    title: 'Contact · Union Pathways',
    description: 'Get in touch with Union Pathways — questions, feedback, or partnership inquiries.',
  },
  '/about': {
    title: 'About · Union Pathways',
    description: 'Built by tradespeople, for the trades. Learn what Union Pathways is and why it exists.',
  },
  '/calculator': {
    title: 'Pay Calculator · Union Pathways',
    description: 'See your union wage breakdown — base pay, benefits, total package.',
  },
  '/benefits': {
    title: 'Union Benefits · Union Pathways',
    description: 'What union construction members earn in benefits beyond base pay — health, pension, annuity.',
  },
  '/health': {
    title: 'Health & Welfare · Union Pathways',
    description: 'How union health insurance works for tradespeople and their families.',
  },
  '/resume': {
    title: 'Resume Builder · Union Pathways',
    description: 'Build a tradesperson resume designed for union halls and contractors.',
  },
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  // Skip admin entirely
  if (pathname.startsWith('/admin')) {
    return;
  }

  const meta = PAGES[pathname] || PAGES['/'];

  // Fetch the actual built HTML (the SPA shell)
  const response = await fetch(new URL('/', request.url));
  let html = await response.text();

  const fullUrl = `https://unionpathways.com${pathname === '/' ? '' : pathname}`;

  // Rewrite the four critical tag groups
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(meta.description)}"/>`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}"/>`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}"/>`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${fullUrl}"/>`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}"/>`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}"/>`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${fullUrl}"/>`
  );

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
