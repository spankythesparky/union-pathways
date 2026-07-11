// fix-seo-1-sitewide-schema.js
//
// Adds site-wide JSON-LD structured data to index.html:
//   - Organization schema (Union Pathways as an org)
//   - WebSite schema with SearchAction (enables Google to show a search box in results)
//
// These are the foundational schemas every SEO consultant recommends first.
// They tell Google "this is the entity, this is the site, this is how to search it."

const fs = require('fs');
const FILE = 'index.html';

if (!fs.existsSync(FILE)) {
  console.error('ERROR: index.html not found. Run this from your project root.');
  process.exit(1);
}

let src = fs.readFileSync(FILE, 'utf8');
const original = src;

// Idempotency
if (src.includes('"@type": "Organization"')) {
  console.error('ERROR: Organization schema already exists. Aborting.');
  process.exit(1);
}

// The structured data block we're inserting.
// Placed just before </head> so it's the last thing loaded but still parsed.
const structuredData = `    <!-- SEO: JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://unionpathways.com/#organization",
      "name": "Union Pathways",
      "url": "https://unionpathways.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://unionpathways.com/social-preview.png",
        "width": 1200,
        "height": 630
      },
      "description": "Union Pathways is a free, ad-free resource for tradespeople. Find union locals, understand your apprenticeship test, know your wages, and learn the history of the trades — across 17 construction trades nationwide.",
      "sameAs": [
        "https://www.instagram.com/spankythesparky",
        "https://www.tiktok.com/@spankythesparky",
        "https://www.youtube.com/@spankythesparky",
        "https://twitter.com/spankythesparky"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://unionpathways.com/#website",
      "url": "https://unionpathways.com/",
      "name": "Union Pathways",
      "description": "Free, ad-free platform connecting workers to union locals, apprenticeships, wages, and jobs across every major building trade.",
      "publisher": {
        "@id": "https://unionpathways.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://unionpathways.com/locals?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "inLanguage": ["en-US", "es", "pl"]
    }
    </script>
  </head>`;

// Find and replace the closing </head> tag with our structured data + </head>
const anchorOld = '  </head>';
if (!src.includes(anchorOld)) {
  console.error('ERROR: Could not find </head> anchor.');
  process.exit(1);
}
src = src.replace(anchorOld, () => structuredData);

if (src === original) {
  console.error('ERROR: No changes made.');
  process.exit(1);
}

fs.writeFileSync(FILE, src);

console.log('');
console.log('Done. Piece 1 of 4 applied — site-wide JSON-LD structured data added:');
console.log('  - Organization schema: Union Pathways as an entity');
console.log('  - WebSite schema with SearchAction (enables Google search box in results)');
console.log('  - Both point at the /locals search page as the search endpoint');
console.log('  - Social links included in sameAs (Instagram, TikTok, YouTube, Twitter)');
console.log('');
console.log('Now run:');
console.log('  git add index.html && git commit -m "seo: add sitewide Organization + WebSite JSON-LD" && git push');
console.log('');
console.log('After Vercel deploys, validate with:');
console.log('  https://search.google.com/test/rich-results?url=https://unionpathways.com/');
console.log('');
