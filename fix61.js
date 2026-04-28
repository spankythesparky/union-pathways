const fs = require('fs');

// ─── 1. FIX index.html — add og:tags for home page ───────────────────────────
let html = fs.readFileSync('index.html', 'utf8');
const newHead = `<!DOCTYPE html>
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
    <meta property="og:image:height" content="1200"/>
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
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

fs.writeFileSync('index.html', newHead);
console.log('✅ Fixed index.html with og:tags');

// ─── 2. FIX middleware.js — expand crawlers list ──────────────────────────────
let mw = fs.readFileSync('middleware.js', 'utf8');
mw = mw.replace(
  "const CRAWLERS = ['facebookexternalhit','Facebot','Twitterbot','LinkedInBot','WhatsApp','Slackbot','TelegramBot','Discordbot','Applebot','Pinterest','Googlebot'];",
  "const CRAWLERS = ['facebookexternalhit','Facebot','Twitterbot','LinkedInBot','WhatsApp','Slackbot','TelegramBot','Discordbot','Applebot','Pinterest','Googlebot','bingbot','Yahoo','DuckDuckBot','Baidu','iMessage','imessage','Messages','Instagram','SnapchatBot','redditbot','vkShare','W3C_Validator','preview','crawler','spider','bot'];"
);

// Also add home page to PAGE_META
mw = mw.replace(
  "const PAGE_META = {",
  "const PAGE_META = {\n  '/':           { title: 'Union Pathways - Find Your Nearest Union Construction Local', desc: 'Find your nearest union construction local — IBEW, UA, BAC, Ironworkers and more. Everything union trades, one place. Free.' },"
);

// Remove duplicate '/' entry if it exists
const lines = mw.split('\n');
const seen = new Set();
const deduped = lines.filter(line => {
  const match = line.match(/^\s*'\/'\s*:/);
  if (match) {
    if (seen.has('/')) return false;
    seen.add('/');
  }
  return true;
});
mw = deduped.join('\n');

fs.writeFileSync('middleware.js', mw);
console.log('✅ Fixed middleware.js with expanded crawlers and home page meta');
console.log('\n🎉 Done! Now run:');
console.log('   git add index.html middleware.js && git commit -m "fix: add og tags to index.html and expand crawler list" && git push\n');
