const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove old Instagram script if present
html = html.replace(/\s*<script>\s*\/\/ Detect Instagram[\s\S]*?<\/script>/g, '');
html = html.replace(/\s*<script>\s*\(function\(\) \{[\s\S]*?isInstagram[\s\S]*?<\/script>/g, '');

// Add new script that runs IMMEDIATELY before React loads
const newScript = `  <script>
    (function() {
      var ua = navigator.userAgent || '';
      var isInstagram = ua.indexOf('Instagram') > -1;
      var isFB = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
      if (isInstagram || isFB) {
        // Write directly to document before React loads
        document.write('<style>body{margin:0;background:#060f1a;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;text-align:center;padding:24px;box-sizing:border-box}</style><div style="max-width:320px"><div style="font-size:32px;font-weight:900;color:#fff;margin-bottom:16px">Union <span style=\\'color:#FA8059\\'>Pathways</span></div><p style="color:rgba(160,180,196,0.7);font-size:15px;line-height:1.6;margin-bottom:32px">This link works best in your browser. Tap below to open it.</p><a href="' + window.location.href + '" target="_blank" style="display:inline-block;background:#FA8059;color:#000;font-weight:700;font-size:16px;padding:16px 32px;border-radius:50px;text-decoration:none">Open in Browser</a></div>');
        document.close();
      }
    })();
  </script>`;

// Insert BEFORE any other scripts, right after <head>
html = html.replace('<head>', '<head>\n' + newScript);

fs.writeFileSync('index.html', html);
console.log('done');
