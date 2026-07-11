// fix110.js — Improved Open button behavior to break out of FB/IG in-app browsers
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

const oldHtml = `    <div id="ig-banner">
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

const newHtml = `    <div id="ig-banner">
      <span id="ig-banner-text">For the best experience, tap to open in your browser.</span>
      <div id="ig-banner-actions">
        <button id="ig-open-btn" type="button">Open</button>
        <button id="ig-close-btn" aria-label="Dismiss">&times;</button>
      </div>
      <script>
        (function() {
          var openBtn = document.getElementById('ig-open-btn');
          var closeBtn = document.getElementById('ig-close-btn');
          var ua = navigator.userAgent || '';
          var isAndroid = /Android/i.test(ua);
          var isIOS = /iPhone|iPad|iPod/i.test(ua);
          var url = window.location.href;
          var host = window.location.host;
          var pathAndQuery = window.location.pathname + window.location.search + window.location.hash;

          openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isAndroid) {
              // Android intent — opens default browser, with fallback to Chrome
              var intent = 'intent://' + host + pathAndQuery + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url) + ';end';
              window.location.href = intent;
              setTimeout(function() {
                window.location.href = url;
              }, 500);
            } else if (isIOS) {
              // iOS Safari deep-link via x-safari-https://
              try {
                window.location.href = 'x-safari-https://' + host + pathAndQuery;
              } catch (err) {}
              // Fallback: copy URL and prompt user
              setTimeout(function() {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(url).then(function() {
                    var t = document.getElementById('ig-banner-text');
                    if (t) t.textContent = 'Link copied — paste into Safari';
                  }).catch(function() {});
                }
              }, 800);
            } else {
              window.open(url, '_blank');
            }
          });

          closeBtn.addEventListener('click', function() {
            document.body.classList.remove('is-instagram');
          });
        })();
      </script>
    </div>`;

code = replaceOnce(code, oldHtml, newHtml, 'better break-out logic');
console.log('1/1 ✓ Updated Open button with better in-app escape logic');

fs.writeFileSync(FILE, code);
console.log('\n✅ Done! Now run:');
console.log('   git add index.html && git commit -m "fix: improved in-app browser break-out (Android intent + iOS Safari + clipboard fallback)" && git push\n');
