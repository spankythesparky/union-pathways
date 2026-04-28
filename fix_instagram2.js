const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove all previous Instagram scripts
html = html.replace(/<script>\s*\(function\(\)[^<]*isInstagram[^<]*<\/script>/gs, '');
html = html.replace(/<script>\s*\/\/ Detect Instagram[^<]*<\/script>/gs, '');

// New approach: put the fallback UI directly in the HTML body
// It shows by default, React hides it on mount
const newHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon-32x32.png" />
    <title>Union Pathways - Find Your Nearest Union Construction Local</title>
    <meta name="description" content="Find your nearest union construction local — IBEW, UA, BAC, Ironworkers and more. Free resource for tradespeople."/>
    <meta property="og:title" content="Union Pathways - Find Your Nearest Union Construction Local"/>
    <meta property="og:description" content="Find your nearest union construction local — IBEW, UA, BAC, Ironworkers and more. Everything union trades, one place. Free."/>
    <meta property="og:url" content="https://unionpathways.com"/>
    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content="Union Pathways"/>
    <meta property="og:image" content="https://unionpathways.com/social-preview.png"/>
    <meta property="og:image:width" content="1200"/>
    <meta property="og:image:height" content="630"/>
    <meta property="og:image:type" content="image/png"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Union Pathways - Find Your Nearest Union Construction Local"/>
    <meta name="twitter:description" content="Find your nearest union construction local — IBEW, UA, BAC, Ironworkers and more. Free."/>
    <meta name="twitter:image" content="https://unionpathways.com/social-preview.png"/>
    <link rel="canonical" href="https://unionpathways.com"/>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6YG0F2LQKT"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "G-6YG0F2LQKT");
    </script>
    <style>
      #ig-fallback {
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
      body.is-instagram #root { display: none; }
    </style>
    <script>
      (function() {
        var ua = navigator.userAgent || '';
        if (ua.indexOf('Instagram') > -1 || ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1) {
          document.documentElement.className += ' instagram-browser';
          window.addEventListener('DOMContentLoaded', function() {
            document.body.className += ' is-instagram';
          });
        }
      })();
    </script>
  </head>
  <body>
    <div id="ig-fallback">
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
    </div>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

fs.writeFileSync('index.html', newHtml);
console.log('done');
