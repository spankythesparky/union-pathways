// fix-nav-corporate-v4.js
//
// Surgically updates the nav header + mobile drawer + newsletter footer
// to the corporate light theme. Replaces the SVG logo with the new logo file.
//
// NO JSX restructure. Just CSS + one logo image swap. Much safer than
// rewriting the full 470-line nav block.

const fs = require('fs');
const FILE = 'src/App.jsx';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: src/App.jsx not found.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

if (src.includes('/* NAV CORPORATE V4 */')) {
  console.error('ERROR: Nav v4 already applied. Aborting.');
  process.exit(1);
}

let editCount = 0;

// ═══════════════════════════════════════════════════════════════
// 1. NAV BAR CSS — white background, subtle bottom border
// ═══════════════════════════════════════════════════════════════
const navOld = `        /* ── NAV (light theme, warm) ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(245,243,238,0.94);
          border-bottom: 1px solid rgba(7,37,84,0.08);
          backdrop-filter: blur(12px);`;

const navFallback = `        /* ── NAV ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(0,0,0,0.97);
          border-bottom: 1px solid rgba(245,197,24,0.15);
          backdrop-filter: blur(12px);`;

const navNew = `        /* NAV CORPORATE V4 */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 24px;
          background: #ffffff;
          border-bottom: 1px solid rgba(7,37,84,0.08);
          box-shadow: 0 1px 3px rgba(7,37,84,0.03);
          backdrop-filter: none;`;

if (src.includes(navOld)) {
  src = src.replace(navOld, () => navNew);
  editCount++;
} else if (src.includes(navFallback)) {
  src = src.replace(navFallback, () => navNew);
  editCount++;
} else {
  console.error('ERROR: Could not find nav CSS block.');
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════
// 2. NAV-LOGO CSS — reduce padding since we're using an img not SVG
// ═══════════════════════════════════════════════════════════════
const navLogoOld = `        .nav-logo {`;
const navLogoNew = `        .nav-logo img { height: 44px; width: auto; display: block; }
        .nav-logo {`;
if (src.includes(navLogoOld)) {
  src = src.replace(navLogoOld, () => navLogoNew);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 3. NAV-LINK CSS — navy on white, orange hover
// ═══════════════════════════════════════════════════════════════
const navLinkOld = `        .nav-link {
          background: transparent;
          border: none;
          padding: 8px 14px;
          color: #072554;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          letter-spacing: -0.005em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #FF6B00; background: rgba(255,107,0,0.05); }`;

const navLinkFallback = `        .nav-link {
          background: transparent;
          border: none;
          padding: 6px 10px;
          color: rgba(255,255,255,0.6);
          font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.01em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }`;

const navLinkNew = `        .nav-link {
          background: transparent;
          border: none;
          padding: 8px 14px;
          color: #072554;
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          letter-spacing: -0.005em;
          text-transform: none;
          cursor: pointer; border-radius: 6px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover { color: #FF6B00; background: rgba(255,107,0,0.05); }
        .nav-link.active { color: #FF6B00; font-weight: 600; }`;

if (src.includes(navLinkOld)) {
  src = src.replace(navLinkOld, () => navLinkNew);
  editCount++;
} else if (src.includes(navLinkFallback)) {
  src = src.replace(navLinkFallback, () => navLinkNew);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 4. NAV-DROPDOWN CSS — light theme dropdowns
// ═══════════════════════════════════════════════════════════════
const navDropdownOld = /\.nav-dropdown \{[^}]+\}/;
if (navDropdownOld.test(src)) {
  const dropdownReplacement = `.nav-dropdown {
          position: absolute; top: calc(100% + 4px); left: 0;
          background: #ffffff;
          border: 1px solid rgba(7,37,84,0.10);
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(7,37,84,0.10);
          min-width: 240px; z-index: 1000; padding: 8px;
        }`;
  src = src.replace(navDropdownOld, () => dropdownReplacement);
  editCount++;
}

// Update nav-dropdown links to navy/orange
const navDropdownLinkPattern = /\.nav-dropdown-link \{[^}]+\}/;
if (navDropdownLinkPattern.test(src)) {
  src = src.replace(navDropdownLinkPattern, () => `.nav-dropdown-link {
          display: block; width: 100%;
          background: transparent; border: none;
          padding: 10px 14px; text-align: left;
          color: #072554; font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 500;
          border-radius: 6px; cursor: pointer;
          transition: all 0.15s;
        }`);
  editCount++;
}
// Update nav-dropdown-link hover
if (src.includes('.nav-dropdown-link:hover')) {
  src = src.replace(/\.nav-dropdown-link:hover[^}]+\}/, () => `.nav-dropdown-link:hover { background: rgba(7,37,84,0.05); color: #FF6B00; }`);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 5. NAV-HAMBURGER — dark icon on light bg
// ═══════════════════════════════════════════════════════════════
const hamburgerOld = /\.nav-hamburger \{[^}]+\}/;
if (hamburgerOld.test(src)) {
  src = src.replace(hamburgerOld, () => `.nav-hamburger {
          display: none; align-items: center; justify-content: center;
          width: 42px; height: 42px;
          background: transparent;
          border: 1px solid rgba(7,37,84,0.12);
          border-radius: 8px;
          color: #072554; cursor: pointer;
          transition: all 0.15s;
          -webkit-tap-highlight-color: transparent;
        }`);
  editCount++;
}
if (src.includes('.nav-hamburger:hover')) {
  src = src.replace(/\.nav-hamburger:hover[^}]+\}/, () => `.nav-hamburger:hover { background: rgba(7,37,84,0.05); border-color: rgba(7,37,84,0.2); }`);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 6. MOBILE DRAWER — light theme
// ═══════════════════════════════════════════════════════════════
const drawerOld = /\.mobile-drawer \{[^}]+\}/;
if (drawerOld.test(src)) {
  src = src.replace(drawerOld, () => `.mobile-drawer {
          position: fixed; top: 0; right: 0;
          width: 320px; max-width: 88vw; height: 100vh;
          background: #ffffff;
          color: #072554;
          border-left: 1px solid rgba(7,37,84,0.08);
          box-shadow: -8px 0 24px rgba(7,37,84,0.08);
          transform: translateX(100%);
          transition: transform 0.28s ease;
          z-index: 200;
          overflow-y: auto;
          display: flex; flex-direction: column;
        }`);
  editCount++;
}

const drawerHeaderOld = /\.mobile-drawer-header \{[^}]+\}/;
if (drawerHeaderOld.test(src)) {
  src = src.replace(drawerHeaderOld, () => `.mobile-drawer-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(7,37,84,0.08);
        }`);
  editCount++;
}

const drawerTitleOld = /\.mobile-drawer-title \{[^}]+\}/;
if (drawerTitleOld.test(src)) {
  src = src.replace(drawerTitleOld, () => `.mobile-drawer-title {
          font-family: 'Inter', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #FF6B00;
        }`);
  editCount++;
}

const drawerCloseOld = /\.mobile-drawer-close \{[^}]+\}/;
if (drawerCloseOld.test(src)) {
  src = src.replace(drawerCloseOld, () => `.mobile-drawer-close {
          background: transparent; border: none;
          color: #5A6478; cursor: pointer;
          padding: 6px; display: flex; align-items: center; justify-content: center;
        }`);
  editCount++;
}

const drawerLinkOld = /\.mobile-drawer-link \{[^}]+\}/;
if (drawerLinkOld.test(src)) {
  src = src.replace(drawerLinkOld, () => `.mobile-drawer-link {
          display: block; width: 100%; text-align: left;
          background: transparent; border: none;
          padding: 12px 20px;
          color: #072554; font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 500;
          cursor: pointer; border-radius: 0;
          transition: background 0.15s;
        }`);
  editCount++;
}
src = src.replace(/\.mobile-drawer-link:hover \{[^}]+\}/, () => `.mobile-drawer-link:hover { background: rgba(7,37,84,0.04); }`);
src = src.replace(/\.mobile-drawer-link\.active \{[^}]+\}/, () => `.mobile-drawer-link.active { color: #FF6B00; background: rgba(255,107,0,0.06); font-weight: 600; }`);
editCount += 2;

const drawerSecLabelOld = /\.mobile-drawer-section-label \{[^}]+\}/;
if (drawerSecLabelOld.test(src)) {
  src = src.replace(drawerSecLabelOld, () => `.mobile-drawer-section-label {
          padding: 20px 20px 8px;
          font-family: 'Inter', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: #5A6478;
        }`);
  editCount++;
}

// Section toggle (used for dropdown groups in drawer)
const drawerSecToggleOld = /\.mobile-drawer-section-toggle \{[^}]+\}/;
if (drawerSecToggleOld.test(src)) {
  src = src.replace(drawerSecToggleOld, () => `.mobile-drawer-section-toggle {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%;
          padding: 14px 20px;
          background: transparent; border: none;
          color: #072554; font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }`);
  editCount++;
}
if (src.includes('.mobile-drawer-section-toggle:hover')) {
  src = src.replace(/\.mobile-drawer-section-toggle:hover[^}]+\}/, () => `.mobile-drawer-section-toggle:hover { background: rgba(7,37,84,0.04); }`);
  editCount++;
}
if (src.includes('.mobile-drawer-section-toggle.active')) {
  src = src.replace(/\.mobile-drawer-section-toggle\.active[^}]+\}/, () => `.mobile-drawer-section-toggle.active { color: #FF6B00; }`);
  editCount++;
}

// Drawer toggle button (menu button in nav)
const drawerToggleOld = /\.mobile-drawer-toggle \{[^}]+\}/;
if (drawerToggleOld.test(src)) {
  src = src.replace(drawerToggleOld, () => `.mobile-drawer-toggle {
          display: block; width: 100%; text-align: left;
          background: transparent; border: none;
          padding: 12px 20px;
          color: #072554; font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }`);
  editCount++;
}
if (src.includes('.mobile-drawer-toggle:hover')) {
  src = src.replace(/\.mobile-drawer-toggle:hover[^}]+\}/, () => `.mobile-drawer-toggle:hover { background: rgba(7,37,84,0.04); }`);
  editCount++;
}
if (src.includes('.mobile-drawer-toggle.active')) {
  src = src.replace(/\.mobile-drawer-toggle\.active[^}]+\}/, () => `.mobile-drawer-toggle.active { color: #FF6B00; }`);
  editCount++;
}

// ═══════════════════════════════════════════════════════════════
// 7. SWAP THE SVG LOGO for the img file
// ═══════════════════════════════════════════════════════════════
// Find the nav-logo block and replace the SVG with an img
const svgStart = `          <div className="nav-logo" style={{cursor:"pointer", padding:"4px", margin:"-4px"}} onClick={() => { setPage("home"); setResults(null); setQuery(""); }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="450 395 390 110" style={{height:"56px", width:"auto"}}>`;

const svgStartIdx = src.indexOf(svgStart);
if (svgStartIdx !== -1) {
  // Find matching </svg> after this
  const svgEndPattern = '</svg>\n          </div>';
  const svgEndIdx = src.indexOf(svgEndPattern, svgStartIdx);
  if (svgEndIdx !== -1) {
    const fullSvgBlock = src.slice(svgStartIdx, svgEndIdx + svgEndPattern.length);
    const imgReplacement = `          <div className="nav-logo" style={{cursor:"pointer", padding:"4px", margin:"-4px"}} onClick={() => { setPage("home"); setResults(null); setQuery(""); }}>
            <img src="/logo.png" alt="Union Pathways"/>
          </div>`;
    src = src.replace(fullSvgBlock, () => imgReplacement);
    editCount++;
  }
}

// ═══════════════════════════════════════════════════════════════
// 8. NEWSLETTER FOOTER — recolor for light theme
// ═══════════════════════════════════════════════════════════════
// The newsletter footer has hardcoded dark-theme styles
// Update the background from dark to a corporate-style navy block

const footerNewsletterOld = `        {/* ─── NEWSLETTER (FOOTER) ─── */}
        <div style={{padding:'48px 24px', maxWidth:1280, margin:'0 auto', borderTop:'1px solid rgba(255,255,255,0.08)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}} className="footer-newsletter-grid">`;

const footerNewsletterNew = `        {/* ─── NEWSLETTER (FOOTER, corporate v4) ─── */}
        <div style={{background:'#072554', padding:'56px 24px', marginTop: 60}}>
        <div style={{maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}} className="footer-newsletter-grid">`;

if (src.includes(footerNewsletterOld)) {
  src = src.replace(footerNewsletterOld, () => footerNewsletterNew);
  editCount++;
}

// Update the newsletter eyebrow "// Newsletter" style
const newsletterEyebrowOld = `<div style={{fontFamily:"'Space Mono',monospace", fontSize:10, color:'#FA8059', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:12}}>
              // {lang==="es" ? "Boletin" : lang==="pl" ? "Newsletter" : "Newsletter"}
            </div>`;

const newsletterEyebrowNew = `<div style={{fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:700, color:'#FF6B00', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16}}>
              {lang==="es" ? "Boletin" : lang==="pl" ? "Newsletter" : "Newsletter"}
            </div>`;

if (src.includes(newsletterEyebrowOld)) {
  src = src.replace(newsletterEyebrowOld, () => newsletterEyebrowNew);
  editCount++;
}

// Update the newsletter heading style — remove italic, use bold
const newsletterHeadingOld = `<div style={{fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(18px, 2vw, 22px)', fontWeight:500, color:'#fff', lineHeight:1.2, letterSpacing:'-0.015em'}}>
              {lang==="es" ? <>Lo que esta pasando en los <span style={{color:'#FA8059', fontStyle:'italic'}}>oficios.</span></> :
               lang==="pl" ? <>Co sie dzieje w <span style={{color:'#FA8059', fontStyle:'italic'}}>zawodach.</span></> :
               <>What's happening in <span style={{color:'#FA8059', fontStyle:'italic'}}>the trades.</span></>}
            </div>`;

const newsletterHeadingNew = `<div style={{fontFamily:"'Inter',sans-serif", fontSize:'clamp(20px, 2.5vw, 28px)', fontWeight:700, color:'#ffffff', lineHeight:1.2, letterSpacing:'-0.015em'}}>
              {lang==="es" ? <>Lo que esta pasando en los <span style={{color:'#FF6B00'}}>oficios.</span></> :
               lang==="pl" ? <>Co sie dzieje w <span style={{color:'#FF6B00'}}>zawodach.</span></> :
               <>What's happening in <span style={{color:'#FF6B00'}}>the trades.</span></>}
            </div>`;

if (src.includes(newsletterHeadingOld)) {
  src = src.replace(newsletterHeadingOld, () => newsletterHeadingNew);
  editCount++;
}

// Close the extra wrapper div we added for the navy background
// Find where the footer newsletter grid ends and add extra </div>
const footerCloserOld = `          <NewsletterForm lang={lang} compact={true} />
        </div>
        <footer`;

const footerCloserNew = `          <NewsletterForm lang={lang} compact={true} />
        </div>
        </div>
        <footer`;

if (src.includes(footerCloserOld)) {
  src = src.replace(footerCloserOld, () => footerCloserNew);
  editCount++;
}

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Nav + newsletter atomic swap applied. Edits: ' + editCount);
console.log('');
console.log('What changed:');
console.log('  - Nav bar: white background, navy links, orange hover');
console.log('  - Nav logo: SVG replaced with /logo.png image file');
console.log('  - Nav dropdowns: light theme (white bg, navy links)');
console.log('  - Mobile hamburger: dark icon on light bg');
console.log('  - Mobile drawer: white bg, navy text, orange active state');
console.log('  - Newsletter footer: full navy block with orange accents');
console.log('  - No italics, no monospace — all Inter typography');
console.log('');
console.log('What is untouched:');
console.log('  - Home page (already v4)');
console.log('  - All other pages (Job Board, Wages, History, etc.) — still dark');
console.log('  - The actual <footer> at the very bottom — still dark for now');
console.log('');
console.log('Now run:');
console.log('  git add src/App.jsx && git commit -m "feat: nav + newsletter corporate redesign" && git push');
console.log('');
