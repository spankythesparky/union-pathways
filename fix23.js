const fs = require('fs');

const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// For regional locals covering multiple states, we add one entry per major city
// in each covered state so the 50-mile search catches them everywhere.
// ID scheme: 20000 + sequential number

const entries = [
  // ── BAC 3 — Northern California ─────────────────────────────────────────────
  { id: 20001, name: "BAC Local 3 (Northern CA)", city: "Oakland", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", email: "troy@bac3-ca.org", address: "8201 Capwell Dr., Oakland, CA 94621", lat: 37.8044, lng: -122.2712 },
  { id: 20002, name: "BAC Local 3 (Northern CA)", city: "Sacramento", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", email: "troy@bac3-ca.org", address: "8201 Capwell Dr., Oakland, CA 94621", lat: 38.5816, lng: -121.4944 },
  { id: 20003, name: "BAC Local 3 (Northern CA)", city: "San Francisco", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", email: "troy@bac3-ca.org", address: "8201 Capwell Dr., Oakland, CA 94621", lat: 37.7749, lng: -122.4194 },
  { id: 20004, name: "BAC Local 3 (Northern CA)", city: "Fresno", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", email: "troy@bac3-ca.org", address: "8201 Capwell Dr., Oakland, CA 94621", lat: 36.7378, lng: -119.7871 },

  // ── BAC 4 — Southern California ─────────────────────────────────────────────
  { id: 20010, name: "BAC Local 4 (Southern CA)", city: "La Verne", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", email: "bac4andy@gmail.com", address: "2679 Sierra Way, LaVerne, CA 91750", lat: 34.1008, lng: -117.7678 },
  { id: 20011, name: "BAC Local 4 (Southern CA)", city: "Los Angeles", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", email: "bac4andy@gmail.com", address: "2679 Sierra Way, LaVerne, CA 91750", lat: 34.0522, lng: -118.2437 },
  { id: 20012, name: "BAC Local 4 (Southern CA)", city: "San Diego", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", email: "bac4andy@gmail.com", address: "2679 Sierra Way, LaVerne, CA 91750", lat: 32.7157, lng: -117.1611 },
  { id: 20013, name: "BAC Local 4 (Southern CA)", city: "Riverside", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", email: "bac4andy@gmail.com", address: "2679 Sierra Way, LaVerne, CA 91750", lat: 33.9806, lng: -117.3755 },

  // ── BAC 1 — Connecticut ──────────────────────────────────────────────────────
  { id: 20020, name: "BAC Local 1 (CT)", city: "Wallingford", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", email: "gmarotti@baclocal1ct.com", address: "17 North Plains Industrial Rd, Wallingford, CT 06492", lat: 41.4570, lng: -72.8230 },
  { id: 20021, name: "BAC Local 1 (CT)", city: "Hartford", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", email: "gmarotti@baclocal1ct.com", address: "17 North Plains Industrial Rd, Wallingford, CT 06492", lat: 41.7658, lng: -72.6851 },
  { id: 20022, name: "BAC Local 1 (CT)", city: "Bridgeport", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", email: "gmarotti@baclocal1ct.com", address: "17 North Plains Industrial Rd, Wallingford, CT 06492", lat: 41.1865, lng: -73.1952 },

  // ── BAC 1 — Maryland, Virginia, DC ──────────────────────────────────────────
  { id: 20030, name: "BAC Local 1 (MD/VA/DC)", city: "Laurel", state: "MD", phone: "(240) 695-9463", website: "baclocal1.org", email: "support@baclocal1.org", address: "305 Compton Avenue, Laurel, MD 20707", lat: 39.0993, lng: -76.8483 },
  { id: 20031, name: "BAC Local 1 (MD/VA/DC)", city: "Washington", state: "DC", phone: "(240) 695-9463", website: "baclocal1.org", email: "support@baclocal1.org", address: "305 Compton Avenue, Laurel, MD 20707", lat: 38.9072, lng: -77.0369 },
  { id: 20032, name: "BAC Local 1 (MD/VA/DC)", city: "Baltimore", state: "MD", phone: "(240) 695-9463", website: "baclocal1.org", email: "support@baclocal1.org", address: "305 Compton Avenue, Laurel, MD 20707", lat: 39.2904, lng: -76.6122 },
  { id: 20033, name: "BAC Local 1 (MD/VA/DC)", city: "Richmond", state: "VA", phone: "(240) 695-9463", website: "baclocal1.org", email: "support@baclocal1.org", address: "305 Compton Avenue, Laurel, MD 20707", lat: 37.5407, lng: -77.4360 },
  { id: 20034, name: "BAC Local 1 (MD/VA/DC)", city: "Norfolk", state: "VA", phone: "(240) 695-9463", website: "baclocal1.org", email: "support@baclocal1.org", address: "305 Compton Avenue, Laurel, MD 20707", lat: 36.8508, lng: -76.2859 },

  // ── BAC 1 — Hawaii ───────────────────────────────────────────────────────────
  { id: 20040, name: "BAC Local 1 (HI)", city: "Honolulu", state: "HI", phone: "(808) 841-8822", website: "hawaiimasonsunion.org", email: "pcoronas@masonsunion.com", address: "2251 North School Street, Honolulu, HI 96819", lat: 21.3069, lng: -157.8583 },

  // ── BAC 3 — Iowa ─────────────────────────────────────────────────────────────
  { id: 20050, name: "BAC Local 3 (IA)", city: "Marshalltown", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", email: "ray@bac3ia.us", address: "601 S 12th Avenue, Marshalltown, IA 50158", lat: 42.0494, lng: -92.9082 },
  { id: 20051, name: "BAC Local 3 (IA)", city: "Des Moines", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", email: "ray@bac3ia.us", address: "601 S 12th Avenue, Marshalltown, IA 50158", lat: 41.5868, lng: -93.6250 },
  { id: 20052, name: "BAC Local 3 (IA)", city: "Cedar Rapids", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", email: "ray@bac3ia.us", address: "601 S 12th Avenue, Marshalltown, IA 50158", lat: 41.9779, lng: -91.6656 },

  // ── BAC 8 — Illinois ─────────────────────────────────────────────────────────
  { id: 20060, name: "BAC Local 8 (IL)", city: "O'Fallon", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", email: "mbraun@bac8il.com", address: "715 Lakepointe Centre Suite 127, O'Fallon, IL 62269", lat: 38.5895, lng: -89.9112 },
  { id: 20061, name: "BAC Local 8 (IL)", city: "Springfield", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", email: "mbraun@bac8il.com", address: "715 Lakepointe Centre Suite 127, O'Fallon, IL 62269", lat: 39.7817, lng: -89.6501 },
  { id: 20062, name: "BAC Local 8 (IL)", city: "Peoria", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", email: "mbraun@bac8il.com", address: "715 Lakepointe Centre Suite 127, O'Fallon, IL 62269", lat: 40.6936, lng: -89.5890 },
  { id: 20063, name: "BAC ADC 1 (IL)", city: "Elmhurst", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", email: "mvolpentesta@bacadc1.org", address: "660 N Industrial Drive, Elmhurst, IL 60126", lat: 41.8997, lng: -87.9401 },
  { id: 20064, name: "BAC ADC 1 (IL)", city: "Chicago", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", email: "mvolpentesta@bacadc1.org", address: "660 N Industrial Drive, Elmhurst, IL 60126", lat: 41.8781, lng: -87.6298 },
  { id: 20065, name: "BAC ADC 1 (IL)", city: "Rockford", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", email: "mvolpentesta@bacadc1.org", address: "660 N Industrial Drive, Elmhurst, IL 60126", lat: 42.2711, lng: -89.0940 },

  // ── BAC 4 — Indiana, Kentucky ────────────────────────────────────────────────
  { id: 20070, name: "BAC Local 4 (IN/KY)", city: "Indianapolis", state: "IN", phone: "(800) 322-2283", website: "baclocal4.org", email: "steveknowles@baclocal4.org", address: "8455 Moller Road, Indianapolis, IN 46268", lat: 39.7684, lng: -86.1581 },
  { id: 20071, name: "BAC Local 4 (IN/KY)", city: "Fort Wayne", state: "IN", phone: "(800) 322-2283", website: "baclocal4.org", email: "steveknowles@baclocal4.org", address: "8455 Moller Road, Indianapolis, IN 46268", lat: 41.0793, lng: -85.1394 },
  { id: 20072, name: "BAC Local 4 (IN/KY)", city: "Evansville", state: "IN", phone: "(800) 322-2283", website: "baclocal4.org", email: "steveknowles@baclocal4.org", address: "8455 Moller Road, Indianapolis, IN 46268", lat: 37.9716, lng: -87.5711 },
  { id: 20073, name: "BAC Local 4 (IN/KY)", city: "Louisville", state: "KY", phone: "(800) 322-2283", website: "baclocal4.org", email: "steveknowles@baclocal4.org", address: "8455 Moller Road, Indianapolis, IN 46268", lat: 38.2527, lng: -85.7585 },
  { id: 20074, name: "BAC Local 4 (IN/KY)", city: "Lexington", state: "KY", phone: "(800) 322-2283", website: "baclocal4.org", email: "steveknowles@baclocal4.org", address: "8455 Moller Road, Indianapolis, IN 46268", lat: 38.0406, lng: -84.5037 },

  // ── BAC 3 — Massachusetts, Maine, New Hampshire, Rhode Island ───────────────
  { id: 20080, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Charlestown", state: "MA", phone: "(617) 242-5500", website: "local3bac.org", email: "aantonuccio@local3bac.org", address: "550 Medford Street, Charlestown, MA 02129", lat: 42.3772, lng: -71.0602 },
  { id: 20081, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Boston", state: "MA", phone: "(617) 242-5500", website: "local3bac.org", email: "aantonuccio@local3bac.org", address: "550 Medford Street, Charlestown, MA 02129", lat: 42.3601, lng: -71.0589 },
  { id: 20082, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Portland", state: "ME", phone: "(617) 242-5500", website: "local3bac.org", email: "aantonuccio@local3bac.org", address: "550 Medford Street, Charlestown, MA 02129", lat: 43.6591, lng: -70.2568 },
  { id: 20083, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Manchester", state: "NH", phone: "(617) 242-5500", website: "local3bac.org", email: "aantonuccio@local3bac.org", address: "550 Medford Street, Charlestown, MA 02129", lat: 42.9956, lng: -71.4548 },
  { id: 20084, name: "BAC Local 3 (MA/ME/NH/RI)", city: "Providence", state: "RI", phone: "(617) 242-5500", website: "local3bac.org", email: "aantonuccio@local3bac.org", address: "550 Medford Street, Charlestown, MA 02129", lat: 41.8240, lng: -71.4128 },

  // ── BAC 2 — Michigan ─────────────────────────────────────────────────────────
  { id: 20090, name: "BAC Local 2 (MI)", city: "Warren", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", email: "brett.gierak@bricklayers.org", address: "21031 Ryan Road, Warren, MI 48091", lat: 42.5145, lng: -83.0146 },
  { id: 20091, name: "BAC Local 2 (MI)", city: "Detroit", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", email: "brett.gierak@bricklayers.org", address: "21031 Ryan Road, Warren, MI 48091", lat: 42.3314, lng: -83.0458 },
  { id: 20092, name: "BAC Local 2 (MI)", city: "Grand Rapids", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", email: "brett.gierak@bricklayers.org", address: "21031 Ryan Road, Warren, MI 48091", lat: 42.9634, lng: -85.6681 },
  { id: 20093, name: "BAC Local 2 (MI)", city: "Flint", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", email: "brett.gierak@bricklayers.org", address: "21031 Ryan Road, Warren, MI 48091", lat: 43.0125, lng: -83.6875 },

  // ── BAC 15 — Missouri, Kansas, Nebraska ──────────────────────────────────────
  { id: 20100, name: "BAC Local 15 (MO/KS/NE)", city: "Kansas City", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 39.0997, lng: -94.5786 },
  { id: 20101, name: "BAC Local 15 (MO/KS/NE)", city: "St. Louis", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 38.6270, lng: -90.1994 },
  { id: 20102, name: "BAC Local 15 (MO/KS/NE)", city: "Springfield", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 37.2090, lng: -93.2923 },
  { id: 20103, name: "BAC Local 15 (MO/KS/NE)", city: "Wichita", state: "KS", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 37.6872, lng: -97.3301 },
  { id: 20104, name: "BAC Local 15 (MO/KS/NE)", city: "Topeka", state: "KS", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 39.0489, lng: -95.6780 },
  { id: 20105, name: "BAC Local 15 (MO/KS/NE)", city: "Omaha", state: "NE", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 41.2565, lng: -95.9345 },
  { id: 20106, name: "BAC Local 15 (MO/KS/NE)", city: "Lincoln", state: "NE", phone: "(816) 241-6695", website: "baclocal15.org", email: "dustinhimes@baclocal15.org", address: "632 W 39th Street, Kansas City, MO 64111", lat: 40.8136, lng: -96.7026 },
  { id: 20107, name: "BAC ADC Eastern MO", city: "Fenton", state: "MO", phone: "(314) 621-5560", website: "bacstl.com", email: "brian.jennewein@gmail.com", address: "1670 Fenpark Drive, Fenton, MO 63026", lat: 38.5117, lng: -90.4428 },

  // ── BAC ADC — New Jersey ─────────────────────────────────────────────────────
  { id: 20110, name: "BAC ADC (NJ)", city: "Bordentown", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", email: "j.capo@bacnj.com", address: "3281 Route 206 Suite 1, Bordentown, NJ 08505", lat: 40.1443, lng: -74.7107 },
  { id: 20111, name: "BAC ADC (NJ)", city: "Newark", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", email: "j.capo@bacnj.com", address: "3281 Route 206 Suite 1, Bordentown, NJ 08505", lat: 40.7357, lng: -74.1724 },
  { id: 20112, name: "BAC ADC (NJ)", city: "Trenton", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", email: "j.capo@bacnj.com", address: "3281 Route 206 Suite 1, Bordentown, NJ 08505", lat: 40.2171, lng: -74.7429 },

  // ── Mountain West ADC — Nevada ───────────────────────────────────────────────
  { id: 20120, name: "BAC Mountain West ADC (NV)", city: "Las Vegas", state: "NV", phone: "(702) 873-0332", website: "bacmwadc.org", email: "rcrawford@mwbac.org", address: "3900 W Quail Avenue, Las Vegas, NV 89118", lat: 36.1699, lng: -115.1398 },
  { id: 20121, name: "BAC Mountain West ADC (NV)", city: "Reno", state: "NV", phone: "(702) 873-0332", website: "bacmwadc.org", email: "rcrawford@mwbac.org", address: "3900 W Quail Avenue, Las Vegas, NV 89118", lat: 39.5296, lng: -119.8138 },

  // ── BAC 1 — New York ─────────────────────────────────────────────────────────
  { id: 20130, name: "BAC Local 1 (NY)", city: "Long Island City", state: "NY", phone: "(718) 392-0525", website: "bricklayersandalliedcraftworkerslocal1ny.org", email: "info@bac1ny.com", address: "4 Court Square West, Long Island City, NY 11101", lat: 40.7447, lng: -73.9485 },
  { id: 20131, name: "BAC Local 1 (NY)", city: "New York City", state: "NY", phone: "(718) 392-0525", website: "bricklayersandalliedcraftworkerslocal1ny.org", email: "info@bac1ny.com", address: "4 Court Square West, Long Island City, NY 11101", lat: 40.7128, lng: -74.0059 },

  // ── BAC 2 — New York, Vermont ────────────────────────────────────────────────
  { id: 20140, name: "BAC Local 2 (NY/VT)", city: "Albany", state: "NY", phone: "(518) 466-5885", website: "baclocal2nyvt.org", email: "ptirino@bac2.org", address: "302 Centre Drive, Albany, NY 12203", lat: 42.6526, lng: -73.7562 },
  { id: 20141, name: "BAC Local 2 (NY/VT)", city: "Burlington", state: "VT", phone: "(518) 466-5885", website: "baclocal2nyvt.org", email: "ptirino@bac2.org", address: "302 Centre Drive, Albany, NY 12203", lat: 44.4759, lng: -73.2121 },
  { id: 20142, name: "BAC Local 2 (NY/VT)", city: "Syracuse", state: "NY", phone: "(518) 466-5885", website: "baclocal2nyvt.org", email: "ptirino@bac2.org", address: "302 Centre Drive, Albany, NY 12203", lat: 43.0481, lng: -76.1474 },

  // ── BAC 3 — New York ─────────────────────────────────────────────────────────
  { id: 20150, name: "BAC Local 3 (NY)", city: "Rochester", state: "NY", phone: "(716) 604-2334", website: "bac3ny.com", email: "rickw@bac3ny.com", address: "33 Saginaw Drive, Rochester, NY 14623", lat: 43.1566, lng: -77.6088 },
  { id: 20151, name: "BAC Local 3 (NY)", city: "Buffalo", state: "NY", phone: "(716) 604-2334", website: "bac3ny.com", email: "rickw@bac3ny.com", address: "33 Saginaw Drive, Rochester, NY 14623", lat: 42.8864, lng: -78.8784 },

  // ── BAC 7 — New York, New Jersey ─────────────────────────────────────────────
  { id: 20160, name: "BAC Local 7 (NY/NJ)", city: "Long Island City", state: "NY", phone: "(917) 734-8390", website: "baclocal7.org", email: "whill@baclocal7.com", address: "45-34 Court Square, Long Island City, NY 11101", lat: 40.7447, lng: -73.9485 },

  // ── BAC 23 — Ohio, West Virginia, Kentucky, Maryland ────────────────────────
  { id: 20170, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Amherst", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 41.4009, lng: -82.2235 },
  { id: 20171, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Cleveland", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 41.4993, lng: -81.6944 },
  { id: 20172, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Columbus", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 39.9612, lng: -82.9988 },
  { id: 20173, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Cincinnati", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 39.1031, lng: -84.5120 },
  { id: 20174, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Charleston", state: "WV", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 38.3498, lng: -81.6326 },
  { id: 20175, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Lexington", state: "KY", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 38.0406, lng: -84.5037 },
  { id: 20176, name: "BAC Local 23 (OH/WV/KY/MD)", city: "Baltimore", state: "MD", phone: "(440) 986-3000", website: "23bricks.org", email: "dmusacchio@bac23-ohwvky.net", address: "8497 Leavitt Road, Amherst, OH 44001", lat: 39.2904, lng: -76.6122 },

  // ── BAC 5 — Oklahoma, Arkansas, Texas, New Mexico ───────────────────────────
  { id: 20180, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Oklahoma City", state: "OK", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 35.4676, lng: -97.5164 },
  { id: 20181, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Tulsa", state: "OK", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 36.1540, lng: -95.9928 },
  { id: 20182, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Little Rock", state: "AR", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 34.7465, lng: -92.2896 },
  { id: 20183, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Dallas", state: "TX", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 32.7767, lng: -96.7970 },
  { id: 20184, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Houston", state: "TX", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 29.7604, lng: -95.3698 },
  { id: 20185, name: "BAC Local 5 (OK/AR/TX/NM)", city: "San Antonio", state: "TX", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 29.4241, lng: -98.4936 },
  { id: 20186, name: "BAC Local 5 (OK/AR/TX/NM)", city: "Albuquerque", state: "NM", phone: "(405) 528-5609", website: "baclocal5.com", email: "tmcintyre@bacweb.org", address: "212 NE 27th Street, Oklahoma City, OK 73105", lat: 35.0844, lng: -106.6504 },

  // ── BAC 1 — Pennsylvania, Delaware ──────────────────────────────────────────
  { id: 20190, name: "BAC Local 1 (PA/DE)", city: "Philadelphia", state: "PA", phone: "(215) 856-9505", website: "bac1pa-de.org", email: null, address: "2706 Black Lake Place, Philadelphia, PA 19154", lat: 40.0719, lng: -74.9942 },
  { id: 20191, name: "BAC Local 1 (PA/DE)", city: "Wilmington", state: "DE", phone: "(215) 856-9505", website: "bac1pa-de.org", email: null, address: "2706 Black Lake Place, Philadelphia, PA 19154", lat: 39.7447, lng: -75.5484 },

  // ── BAC 5 — Pennsylvania ─────────────────────────────────────────────────────
  { id: 20200, name: "BAC Local 5 (PA)", city: "Harrisburg", state: "PA", phone: "(717) 564-5555", website: "baclocal5pa.org", email: "toms@bac5pa.com", address: "733 Firehouse Lane, Harrisburg, PA 17111", lat: 40.2732, lng: -76.8867 },
  { id: 20201, name: "BAC Local 5 (PA)", city: "Allentown", state: "PA", phone: "(717) 564-5555", website: "baclocal5pa.org", email: "toms@bac5pa.com", address: "733 Firehouse Lane, Harrisburg, PA 17111", lat: 40.6084, lng: -75.4902 },

  // ── BAC 9 — Pennsylvania ─────────────────────────────────────────────────────
  { id: 20210, name: "BAC Local 9 (PA)", city: "Pittsburgh", state: "PA", phone: "(412) 860-8390", website: "local9pa.com", email: "Normringer@baclocal9.com", address: "100 Kingston Drive, Pittsburgh, PA 15235", lat: 40.4406, lng: -79.9959 },

  // ── BAC 8 — Southeast ────────────────────────────────────────────────────────
  { id: 20220, name: "BAC Local 8 (Southeast)", city: "Atlanta", state: "GA", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 33.7490, lng: -84.3880 },
  { id: 20221, name: "BAC Local 8 (Southeast)", city: "Charlotte", state: "NC", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 35.2271, lng: -80.8431 },
  { id: 20222, name: "BAC Local 8 (Southeast)", city: "Birmingham", state: "AL", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 33.5186, lng: -86.8104 },
  { id: 20223, name: "BAC Local 8 (Southeast)", city: "Jacksonville", state: "FL", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 30.3322, lng: -81.6557 },
  { id: 20224, name: "BAC Local 8 (Southeast)", city: "Columbia", state: "SC", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 34.0007, lng: -81.0348 },
  { id: 20225, name: "BAC Local 8 (Southeast)", city: "Nashville", state: "TN", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 36.1627, lng: -86.7816 },
  { id: 20226, name: "BAC Local 8 (Southeast)", city: "Memphis", state: "TN", phone: "(404) 893-5809", website: "baclocal8se.org", email: "rbaker@bacsoutheast.org", address: "501 Pulliam Street SW Suite 319, Atlanta, GA 30312", lat: 35.1495, lng: -90.0490 },

  // ── BAC 1 — Washington, Alaska ───────────────────────────────────────────────
  { id: 20230, name: "BAC Local 1 (WA/AK)", city: "Tukwila", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", email: "lglodowski@bacnorthwest.org", address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", lat: 47.4709, lng: -122.2621 },
  { id: 20231, name: "BAC Local 1 (WA/AK)", city: "Seattle", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", email: "lglodowski@bacnorthwest.org", address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", lat: 47.6062, lng: -122.3321 },
  { id: 20232, name: "BAC Local 1 (WA/AK)", city: "Spokane", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", email: "lglodowski@bacnorthwest.org", address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", lat: 47.6587, lng: -117.4260 },
  { id: 20233, name: "BAC Local 1 (WA/AK)", city: "Anchorage", state: "AK", phone: "(206) 248-2456", website: "bac1wa-ak.org", email: "lglodowski@bacnorthwest.org", address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188", lat: 61.2181, lng: -149.9003 },

  // ── BAC Wisconsin DC ─────────────────────────────────────────────────────────
  { id: 20240, name: "BAC Wisconsin DC", city: "New Berlin", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", email: "jvick@bacwi.org", address: "PO Box 510617, New Berlin, WI 53151", lat: 42.9758, lng: -88.1110 },
  { id: 20241, name: "BAC Wisconsin DC", city: "Milwaukee", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", email: "jvick@bacwi.org", address: "PO Box 510617, New Berlin, WI 53151", lat: 43.0389, lng: -87.9065 },
  { id: 20242, name: "BAC Wisconsin DC", city: "Madison", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", email: "jvick@bacwi.org", address: "PO Box 510617, New Berlin, WI 53151", lat: 43.0731, lng: -89.4012 },
  { id: 20243, name: "BAC Wisconsin DC", city: "Green Bay", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", email: "jvick@bacwi.org", address: "PO Box 510617, New Berlin, WI 53151", lat: 44.5133, lng: -88.0133 },

  // ── BAC 1 — Minnesota, North Dakota, South Dakota ───────────────────────────
  { id: 20250, name: "BAC Local 1 (MN/ND/SD)", city: "Minneapolis", state: "MN", phone: "(612) 845-3136", website: "bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", address: "312 Central Avenue Room 328, Minneapolis, MN 55414", lat: 44.9778, lng: -93.2650 },
  { id: 20251, name: "BAC Local 1 (MN/ND/SD)", city: "St. Paul", state: "MN", phone: "(612) 845-3136", website: "bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", address: "312 Central Avenue Room 328, Minneapolis, MN 55414", lat: 44.9537, lng: -93.0900 },
  { id: 20252, name: "BAC Local 1 (MN/ND/SD)", city: "Fargo", state: "ND", phone: "(612) 845-3136", website: "bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", address: "312 Central Avenue Room 328, Minneapolis, MN 55414", lat: 46.8772, lng: -96.7898 },
  { id: 20253, name: "BAC Local 1 (MN/ND/SD)", city: "Sioux Falls", state: "SD", phone: "(612) 845-3136", website: "bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", address: "312 Central Avenue Room 328, Minneapolis, MN 55414", lat: 43.5446, lng: -96.7311 },
  { id: 20254, name: "BAC Local 1 (MN/ND/SD)", city: "Grand Forks", state: "ND", phone: "(612) 845-3136", website: "bac1mn-nd.org", email: "dschroeder@bac1mn-nd.org", address: "312 Central Avenue Room 328, Minneapolis, MN 55414", lat: 47.9253, lng: -97.0329 },

  // ── BAC 1 — Oregon, Washington, Idaho, Montana ──────────────────────────────
  { id: 20260, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Portland", state: "OR", phone: "(503) 232-0358", website: "bac1or.org", email: "office@bac1or.org", address: "12812 NE Marx Street, Portland, OR 97230", lat: 45.5231, lng: -122.6765 },
  { id: 20261, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Eugene", state: "OR", phone: "(503) 232-0358", website: "bac1or.org", email: "office@bac1or.org", address: "12812 NE Marx Street, Portland, OR 97230", lat: 44.0521, lng: -123.0868 },
  { id: 20262, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Boise", state: "ID", phone: "(503) 232-0358", website: "bac1or.org", email: "office@bac1or.org", address: "12812 NE Marx Street, Portland, OR 97230", lat: 43.6150, lng: -116.2023 },
  { id: 20263, name: "BAC Local 1 (OR/WA/ID/MT)", city: "Billings", state: "MT", phone: "(503) 232-0358", website: "bac1or.org", email: "office@bac1or.org", address: "12812 NE Marx Street, Portland, OR 97230", lat: 45.7833, lng: -108.5007 },

  // ── Canadian locals (single location each) ───────────────────────────────────
  { id: 20300, name: "BAC Local 1 (Alberta)", city: "Edmonton", state: "AB", phone: "(780) 426-7545", website: "bacedmonton.ca", email: "kcoghill@bacalberta.ca", address: "11330 143 Street, Edmonton, AB T5M 1V5", lat: 53.5461, lng: -113.4938 },
  { id: 20301, name: "BAC Local 2 (BC)", city: "Surrey", state: "BC", phone: "(604) 584-2021", website: "bac2bc.org", email: "info@bac2bc.org", address: "12309 Industrial Road, Surrey, BC V3V 3S4", lat: 49.1913, lng: -122.8490 },
  { id: 20302, name: "BAC Local 7 (Ontario)", city: "Ottawa", state: "ON", phone: "(613) 739-5944", website: "local7.ca", email: "info@local7.ca", address: "1427 Michael St, Ottawa, ON K1B 3R3", lat: 45.4215, lng: -75.6972 },
  { id: 20303, name: "BAC Local 1 (Manitoba)", city: "Winnipeg", state: "MB", phone: "(204) 297-6074", website: null, email: "evancollingridge@outlook.com", address: "Unit 4, 225 McPhillips Street, Winnipeg, MB R3E 2K3", lat: 49.8951, lng: -97.1384 },
  { id: 20304, name: "BAC Local 8 (New Brunswick)", city: "Saint John", state: "NB", phone: "(506) 635-1505", website: "bac8nb.ca", email: "apttc@nb.aibn.com", address: "1216 Sand Cove Road, Saint John, NB E2M 5V8", lat: 45.2733, lng: -66.0633 },
  { id: 20305, name: "BAC Local 1 (Newfoundland)", city: "Conception Bay South", state: "NL", phone: "(709) 625-7322", website: "baclocal1nl.com", email: "jleonard@baclocal1nl.com", address: "631 Conception Bay Highway, Conception Bay South, NL A1X 7L4", lat: 47.5234, lng: -52.9968 },
  { id: 20306, name: "BAC Local 1 (Nova Scotia)", city: "Halifax", state: "NS", phone: "(902) 450-5614", website: null, email: "reception@baclocal1.ca", address: "14 McQuade Lake Crescent Suite 203, Halifax, NS B3S 1B6", lat: 44.6488, lng: -63.5752 },
  { id: 20307, name: "BAC Local 4 (Quebec)", city: "Saint-Leonard", state: "QC", phone: "(418) 929-4343", website: null, email: "mlacroix@interlocal4.org", address: "6879 rue Jarry est, Saint-Leonard, QC H1P 1W7", lat: 45.5950, lng: -73.5771 },
  { id: 20308, name: "BAC Local 1 (Saskatchewan)", city: "Regina", state: "SK", phone: "(306) 359-6356", website: "bac1sk.ca", email: "derek@bac1sk.ca", address: "PO Box 3885, Regina, SK S4P 3R8", lat: 50.4452, lng: -104.6189 },
  { id: 20309, name: "BAC Local 6 (Ontario)", city: "Windsor", state: "ON", phone: "(519) 256-3070", website: null, email: "jtr.local6@bellnet.ca", address: "3454 Sandwich Street, Windsor, ON N9C 1B3", lat: 42.3149, lng: -83.0364 },
];

// Build entry strings
const entryLines = entries.map(e => {
  const emailStr = e.email ? `, email: "${e.email}"` : '';
  const siteStr = e.website ? `"${e.website}"` : 'null';
  return `  { id: ${e.id}, name: "${e.name}", city: "${e.city}", state: "${e.state}", phone: "${e.phone}", website: ${siteStr}, lat: ${e.lat}, lng: ${e.lng}, address: "${e.address}"${emailStr} },`;
}).join('\n');

// Replace empty BAC_LOCALS
code = code.replace('const BAC_LOCALS = [];', `const BAC_LOCALS = [\n${entryLines}\n];`);

fs.writeFileSync(filePath, code, 'utf8');
console.log(`✅ Added ${entries.length} BAC local entries (covering all regions)`);
console.log('\n🎉 Done! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: add all BAC locals with regional coverage" && git push\n');
