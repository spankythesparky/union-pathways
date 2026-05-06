// Edge Middleware — fix190
//
// Per-request meta-tag injection so social crawlers (iMessage, Twitter,
// Slack, Facebook, LinkedIn) get a page-specific unfurl card instead of
// always seeing the home page meta.
//
// Vercel automatically detects this file at the project root and runs it
// on the Edge Runtime before serving the static index.html. No
// vercel.json or extra config needed.
//
// How it works:
//   1. Read the requested pathname (e.g., "/downpayment").
//   2. Look up matching entry in PAGE_META. Default to home if no match.
//   3. Fetch the static index.html the user would normally receive.
//   4. Replace the placeholder tokens ({{TITLE}}, {{DESC}}, etc.) with the
//      page-specific values. Escape HTML special chars to prevent injection.
//   5. Return the modified HTML.
//
// Skip non-HTML routes (assets, API calls) so the middleware doesn't slow
// those down — see the matcher config at the bottom.

const SITE = 'https://unionpathways.com';
const DEFAULT_IMAGE = 'https://unionpathways.com/social-preview.png';

// All page metadata. Mirrors PAGE_META in src/App.jsx.
const PAGE_META = {
  'home':      { title: "Union Pathways — Find Your Nearest Union Construction Local", desc: "Find your nearest union construction local — IBEW, UA, SMART, BAC, UBC, Ironworkers, Insulators, Laborers and more. Free resource for tradespeople." },
  'quiz':      { title: "Union Pathways — Which Trade Is Right For You?", desc: "Take our free quiz to find out which union construction trade matches your skills, interests, and goals." },
  'careers':   { title: "Union Pathways — Career Paths in the Union Trades", desc: "Learn about apprenticeships, wages, and career paths in union construction trades. Earn while you learn — no college debt." },
  'checklist': { title: "Union Pathways — How to Join a Union", desc: "Step-by-step guide to joining a union construction apprenticeship. Requirements, timeline, and how to apply." },
  'history':   { title: "Union Pathways — Union History in America", desc: "The 40-hour work week, the weekend, workplace safety — every benefit workers have today was fought for by unions. Learn the history." },
  'veterans':  { title: "Union Pathways — Veterans and the Union Trades", desc: "Military veterans are a perfect fit for union construction apprenticeships. Learn about Helmets to Hardhats and other veteran programs." },
  'locals':    { title: "Union Pathways — Understanding Your Local", desc: "Learn about union jurisdiction, Book 1 vs Book 2, home locals, travel work, and apprenticeship school models." },
  'about':     { title: "Union Pathways — About Us", desc: "Union Pathways was founded by Noah, an IBEW Journeyman and superintendent. Built for union tradespeople, by a union tradesperson." },
  'contact':   { title: "Union Pathways — Contact Us", desc: "Get in touch with the Union Pathways team. We help tradespeople find their nearest union local." },
  'jobboard':  { title: "Union Pathways — Live Job Board", desc: "Real-time work outlook reports from union locals across the country. See which halls are busy, steady, or slow before you travel for work." },
  'wages':     { title: "Union Pathways — Local Wages Verified by Members", desc: "Journeyman wage rates submitted by union members from locals nationwide. Hourly, fringes, pension, total package — all in one place." },
  'organize':  { title: "Union Pathways — Organize Your Workplace", desc: "How to organize your workplace, your rights under federal labor law, and how union members can help organize others. Built for workers and members alike." },
  'organize-contractor': { title: "Union Pathways — Organizing a Contractor", desc: "Top-down organizing in the construction trades. How non-union contractors come to sign with the union, why they would, and how members help bring them in." },
  'trade-history': { title: "Union Pathways — Trade Histories", desc: "Deep-dive histories for each union trade. Construction trades and industrial unions, from 1865 to today." },
  'history-ibew':  { title: "IBEW History — Wired for the Long Haul · Union Pathways", desc: "The full history of the International Brotherhood of Electrical Workers from its 1891 founding above a St. Louis dance hall to today. Henry Miller, the Reid-Murphy split, the Council on Industrial Relations, the data center boom, and the path back to one million members." },
  'history-ua':    { title: "UA History — The Pipe Trades' Long Brotherhood · Union Pathways", desc: "The full history of the United Association from its 1889 Washington founding to today. P.J. Quinlan, the Steamfitters' War, the 1936 federal apprenticeship, the postwar peak, the Veterans in Piping program, and the LNG and data center boom." },
  'history-smart': { title: "SMART History — Sheet, Rail, and the Air Itself · Union Pathways", desc: "The full history of SMART from the 1888 Toledo founding of the tinsmiths' union and the parallel railroad operating brotherhoods to the 2008 merger that created modern SMART. Megaprojects, the 2024 rail bargaining reset, and two crafts under one charter." },
  'history-bac':   { title: "BAC History — The Trowel and the Long Memory · Union Pathways", desc: "The full history of the International Union of Bricklayers and Allied Craftworkers from its 1865 Philadelphia founding to today. The oldest continuously operating trade union in North America. The postwar golden age, the long decline of structural masonry, and the modern restoration economy." },
  'history-ufcw':  { title: "UFCW History — Behind the Counter and on the Cutting Floor · Union Pathways", desc: "The full history of the United Food and Commercial Workers International Union — from the 1888 retail clerks and the 1897 Amalgamated Meat Cutters through the 1979 merger, the 2003 Southern California grocery strike, the Kroger-Albertsons fight, and the 2025 election of Milton Jones as the first African American UFCW president." },
  'history-iron':  { title: "Iron Workers History — Cowboys in the Sky · Union Pathways", desc: "The full history of the International Association of Bridge, Structural, Ornamental and Reinforcing Iron Workers — from the 1896 Pittsburgh founding, through the McNamara bombings, the Golden Gate Bridge, the 2002 Jake West scandal, and the bottom-up organizing model under Eric Dean." },
  'history-insul': { title: "Insulators History — Wrapping the Pipes · Union Pathways", desc: "The full history of the AWIU Heat and Frost Insulators — from the 1903 St. Louis founding, through World War II Pearl Harbor reconstruction, the Selikoff asbestos studies at Mount Sinai, and the modern push for the Federal Mechanical Insulation Act." },
  'history-iuec':  { title: "IUEC History — Going Up · Union Pathways", desc: "The full history of the International Union of Elevator Constructors — from the 1854 Otis Crystal Palace demonstration and the July 1901 Griswold Hotel founding through the Atlantic City Plan, the Christensen era, and the path to becoming the highest-paid building trade in the United States." },
  'history-iupat': { title: "IUPAT History — Brushes, Glass, and Brotherhood · Union Pathways", desc: "From the half-empty Baltimore meeting hall where Jack Elliott chartered the union in 1887 to the modern Hanover campus and the iFTI training institute. The East-West split, the absorption of glaziers and drywall finishers, the Schonfeld reform era, the 1999 IUPAT name change, and the Williams-era organizing strategy." },
  'history-nnu':   { title: "NNU History — By the Bedside · Union Pathways", desc: "How direct-care nurses built the largest registered nurses union in American history. The 2009 Phoenix merger of CNA, UAN, and MNA, the Kaiser strike, California's landmark AB 394 staffing ratios law, the COVID-19 pandemic, and the path from Shirley Titus's 1945 East Bay agreement to the modern 225,000-member union." },
  'rtw': { title: "Right to Work — The Price of \"Freedom\" to Opt Out · Union Pathways", desc: "An interactive investigation into right-to-work laws across the 50 states. Compare wages, union density, workplace fatality rates, household income, poverty, and uninsured rates between RTW and non-RTW states." },
  'apprenticeship': { title: "Apprenticeship Aptitude Tests — How to Get In · Union Pathways", desc: "What's actually on every union apprenticeship aptitude test, by trade. IBEW NJATC, UA GAN, SMART Sheet Metal, IUEC EIAT, IUPAT, and more. Test sections, scoring, study tips, and the things nobody tells you. No prep-course paywall." },
  'apprenticeship-ibew':  { title: "IBEW Aptitude Test (NJATC) — Full Breakdown · Union Pathways", desc: "Everything that's actually on the IBEW Inside Wireman aptitude test. Algebra & functions, reading comprehension, scoring on the 1-9 scale, study resources, and what the interview actually asks. Free, no upsell." },
  'apprenticeship-ua':    { title: "UA Plumbers & Pipefitters Aptitude Test (GAN) — Full Breakdown · Union Pathways", desc: "The full Piping Industry Entry Level Assessment broken down by section. Reading, math, mechanical, spatial, problem solving — what's tested, scoring, study tips, and the application window trap nobody warns you about." },
  'apprenticeship-smart': { title: "SMART Sheet Metal Apprenticeship Test — Full Breakdown · Union Pathways", desc: "What's on the SMART Sheet Metal apprenticeship test — math, reading, mechanical reasoning, spatial visualization. Local-by-local variation including SMART Local 36, Southern California JATC, Western Washington, and Local 20." },
  'apprenticeship-iuec':  { title: "IUEC EIAT — Elevator Industry Aptitude Test Breakdown · Union Pathways", desc: "Full breakdown of the NEIEP Elevator Industry Aptitude Test for IUEC apprenticeships. Arithmetic, reading comprehension, mechanical comprehension, the tool recognition assessment, and the four-tier scoring system." },
  'apprenticeship-iw':    { title: "Iron Workers Aptitude Test — Full Breakdown · Union Pathways", desc: "What's actually on the Iron Workers apprenticeship aptitude test. Math (often including trig), reading comprehension, the physical assessment with beam-walking and ladder climbing, scoring, application cycles, and the four trades within iron working." },
  'apprenticeship-bac':   { title: "BAC Bricklayers Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the BAC Bricklayers and Allied Craftworkers apprenticeship test. Math, reading, the physical assessment, and the seven crafts within BAC — bricklayer, stone mason, PCC, tile setter, tile finisher, terrazzo, plasterer." },
  'apprenticeship-hfiaw': { title: "HFIAW Insulators Aptitude Test — Full Breakdown · Union Pathways", desc: "Full breakdown of the Heat & Frost Insulators apprenticeship aptitude test. Reading comprehension, math, mechanical reasoning, physical and drug screen, and what insulators actually do — industrial, commercial, cryogenics, and asbestos abatement work." },
  'apprenticeship-iuoe':  { title: "IUOE Operating Engineers Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the IUOE Operating Engineers aptitude test. Math, reading, mechanical reasoning, the WorkKeys path some locals use, CDL requirements, the three IUOE branches — Hoisting, Stationary, and Heavy Equipment Mechanic — and the elite Local 150 training facility." },
  'apprenticeship-ubc':   { title: "UBC Carpenters Aptitude Test — Full Breakdown · Union Pathways", desc: "What's on the UBC Carpenters apprenticeship test, with detail on all 11 trade specialties — General Carpenter, Concrete Form Builder, Floor Coverer, Mill Cabinet, Millwright (the most technical), Pile Driver, Lathing, Drywall Finisher, and more." },
  'apprenticeship-iupat': { title: "IUPAT Apprenticeship Test — Full Breakdown · Union Pathways", desc: "What's on the IUPAT apprenticeship test — math, reading, mechanical, spatial, and (for painters) color perception. Coverage of the 8+ trades under IUPAT including glaziers, drywall finishers, and industrial painters, plus the wide regional variation between District Councils." },
  'weingarten':  { title: "Weingarten Rights — Your Right to a Union Rep · Union Pathways", desc: "If your boss is questioning you about something that could lead to discipline, you have the right to a union representative present. The full breakdown — what triggers it, what counts as an investigatory interview, the wallet card script, and what your rep can and can't do." },
  'benefits':    { title: "Union Benefits Overview — Pension, Health, Annuity & More · Union Pathways", desc: "What union members actually get — multiemployer pension, health and welfare, defined-contribution annuity, training trust, supplemental coverage. The full benefits package broken down so apprentices and journeymen can see what their hours are buying." },
  'retirement':  { title: "Union Retirement — 401k vs Annuity vs Pension · Union Pathways", desc: "How union retirement actually works. The difference between a 401(k), a multiemployer pension, and a defined-contribution annuity. What vesting means, why portability matters, and how three benefit streams stack into one paycheck after you hang it up." },
  'calculator':  { title: "Union Wage Calculator — Total Package Value · Union Pathways", desc: "Calculate your full union wage package — base hourly, fringes, health, pension, annuity, vacation, training. See your true hourly value and annual earnings, then compare against non-union work or other locals." },
  'resume':      { title: "Union Apprenticeship Resume Template — Free Download · Union Pathways", desc: "A clean, focused resume template built for union apprenticeship applications. Highlights the things JATC committees actually score on — work history, mechanical experience, references, math credit. Free download, no signup." },
  'downpayment': { title: "Down Payment Calculator — From Apprentice to Journeyman · Union Pathways", desc: "For fifth-year apprentices about to make journeyman. Calculate the gross raise from apprentice scale to full journeyman rate, then see how big a down payment you can save by living like an apprentice for a few more years. Built for the trades. Discipline not included — bring your own." },
  'caucus': { title: "How to Form a Union Caucus — A Field Guide for Members · Union Pathways", desc: "Every reform victory in modern American labor began the same way — a few members talking in a break room, deciding their union could be better, and getting organized. The 10-step field guide to caucus building, drawn from TDU, CORE, UAWD, and the rest of the modern reform tradition." },
};

// Escape HTML special characters so meta values can't break out of attribute
// quotes or inject markup. This is critical because the values include
// punctuation like " and & that would otherwise corrupt the HTML.
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const config = {
  // Match all routes EXCEPT static assets and API endpoints. The negative
  // lookahead skips Vercel's _next folder, common asset extensions, the
  // public favicon and the social preview image, and any /api/* route.
  matcher: [
    '/((?!_next/|api/|favicon|social-preview|map\\.html|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|json|woff|woff2|ttf|eot)).*)'
  ]
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/+|\/+$/g, ''); // trim leading/trailing slashes
  const pageKey = path === '' ? 'home' : path;
  const meta = PAGE_META[pageKey] || PAGE_META['home'];

  // Fetch the static index.html that Vercel would normally serve.
  const upstream = new URL('/index.html', request.url);
  const res = await fetch(upstream.toString(), {
    headers: { 'x-middleware-pass': '1' },
  });
  let body = await res.text();

  // Substitute every placeholder token. Same value goes into multiple slots
  // (title, description, og:title, og:description, twitter:*) — that's
  // intentional; social crawlers each look at slightly different ones.
  const fullUrl = SITE + (path === '' ? '' : '/' + path);
  body = body
    .replaceAll('{{TITLE}}', escapeHtml(meta.title))
    .replaceAll('{{DESC}}',  escapeHtml(meta.desc))
    .replaceAll('{{URL}}',   escapeHtml(fullUrl))
    .replaceAll('{{CANONICAL}}', escapeHtml(fullUrl))
    .replaceAll('{{IMAGE}}', DEFAULT_IMAGE);

  // Return the rewritten HTML. Use the same headers/status as the upstream
  // response so caching, content-encoding, etc. behave normally.
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Allow crawlers and CDNs to cache rewritten responses briefly. The
      // page key is part of the path so different URLs cache separately.
      'cache-control': 'public, max-age=0, s-maxage=300, must-revalidate',
    },
  });
}
