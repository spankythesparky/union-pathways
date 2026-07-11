// fix109.js — Convert the in-app browser takeover into a dismissible top banner
const fs = require('fs');

const FILE = 'index.html';
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

// 1. Replace the takeover CSS with banner CSS
const oldCss = `      #ig-fallback {
        display: none;
        position: fixed;
        inset: 0;
        background: #060f1a;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 24px;
        box-sizing: border-box;
        z-index: 99999;
      }
      body.is-instagram #ig-fallback { display: flex; }
      body.is-instagram #root { display: none; }`;

const newCss = `      #ig-banner {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(90deg, #FA8059 0%, #F5A878 100%);
        color: #000;
        font-family: Arial, sans-serif;
        padding: 10px 14px;
        z-index: 99999;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        font-size: 13px;
        font-weight: 600;
      }
      body.is-instagram #ig-banner { display: flex; }
      body.is-instagram { padding-top: 44px; }
      #ig-banner-text { flex: 1; line-height: 1.3; }
      #ig-banner-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
      #ig-open-btn {
        display: inline-block;
        background: #000;
        color: #FA8059;
        font-weight: 800;
        font-size: 12px;
        padding: 7px 14px;
        border-radius: 50px;
        text-decoration: none;
        white-space: nowrap;
      }
      #ig-close-btn {
        background: transparent;
        border: 1px solid rgba(0,0,0,0.4);
        color: #000;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 900;
        line-height: 1;
        padding: 0;
      }`;

code = replaceOnce(code, oldCss, newCss, '1: takeover CSS to banner CSS');
console.log('1/3 ✓ Replaced takeover styling with banner styling');

// 2. Replace the takeover HTML with banner HTML
const oldHtml = `    <div id="ig-fallback">
      <div style="font-size:36px;font-weight:900;color:#fff;margin-bottom:16px">
        Union <span style="color:#FA8059">Pathways</span>
      </div>
      <p style="color:rgba(160,180,196,0.7);font-size:16px;line-height:1.6;margin-bottom:32px;max-width:300px">
        For the best experience, open this page in your browser.
      </p>
      <a id="ig-open-btn" href="https://unionpathways.com" style="display:inline-block;background:#FA8059;color:#000;font-weight:700;font-size:16px;padding:16px 36px;border-radius:50px;text-decoration:none">
        Open in Browser
      </a>
      <script>
        document.getElementById('ig-open-btn').href = window.location.href;
      </script>
    </div>`;

const newHtml = `    <div id="ig-banner">
      <span id="ig-banner-text">For the best experience, open in your browser.</span>
      <div id="ig-banner-actions">
        <a id="ig-open-btn" href="https://unionpathways.com">Open</a>
        <button id="ig-close-btn" aria-label="Dismiss">&times;</button>
      </div>
      <script>
        document.getElementById('ig-open-btn').href = window.location.href;
        document.getElementById('ig-close-btn').addEventListener('click', function() {
          document.body.classList.remove('is-instagram');
        });
      </script>
    </div>`;

code = replaceOnce(code, oldHtml, newHtml, '2: takeover HTML to banner HTML');
console.log('2/3 ✓ Replaced takeover HTML with banner HTML');

// 3. Sanity check — output passes
console.log('3/3 ✓ Banner is dismissible, site loads underneath');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add index.html && git commit -m "fix: in-app browser banner instead of takeover screen" && git push\n');
