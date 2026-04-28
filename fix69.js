const fs = require('fs');
let html = fs.readFileSync('public/map.html', 'utf8');

// Remove the legend div creation code
html = html.replace(/\/\/ Legend[\s\S]*?document\.getElementById\('map'\)\.appendChild\(legend\);/, '// Legend removed');

fs.writeFileSync('public/map.html', html);
console.log('✅ Removed legend from map');
console.log('\n🎉 Done! Now run:');
console.log('   git add public/map.html && git commit -m "fix: remove legend box from map" && git push\n');
