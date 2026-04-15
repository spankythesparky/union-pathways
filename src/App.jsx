import { useState, useEffect, useRef } from "react";

// ─── ALL UNION TRADES (for dropdown) ─────────────────────────────────────────
const UNION_TRADES = [
  {
    group: "Electrical & Communications",
    trades: [
      { abbr: "IBEW_I", name: "Inside Wiremen", full: "IBEW Inside Wiremen (Commercial & Industrial)", website: "www.ibew.org", status: "active", color: "#F5C518" },
      { abbr: "IBEW_L", name: "Linemen", full: "IBEW Outside Linemen (Utility & Transmission)", website: "www.ibew.org", status: "active", color: "#FFD700" },
    ],
  },
  {
    group: "Plumbing, Pipefitting & HVAC",
    trades: [
      { abbr: "UA", name: "Plumbers & Pipefitters", full: "United Association of Plumbers & Pipefitters", website: "www.ua.org", status: "active", color: "#3b9eff" },
      { abbr: "SMART", name: "Sheet Metal Workers", full: "Sheet Metal, Air, Rail & Transportation Workers", website: "www.smart-union.org", status: "active", color: "#e05a2b" },
    ],
  },
  {
    group: "Carpentry & Millwork",
    trades: [
      { abbr: "UBC", name: "Carpenters", full: "United Brotherhood of Carpenters", website: "www.carpenters.org", status: "active", color: "#a78bfa" },
      { abbr: "IUPAT", name: "Painters & Allied Trades", full: "Int'l Union of Painters & Allied Trades", website: "www.iupat.org", status: "coming" },
      { abbr: "BAC", name: "Bricklayers", full: "Int'l Union of Bricklayers & Allied Craftworkers", website: "www.bacweb.org", status: "active", color: "#f97316" },
    ],
  },
  {
    group: "Heavy Construction",
    trades: [
      { abbr: "IUOE", name: "Operating Engineers", full: "Int'l Union of Operating Engineers", website: "www.iuoe.org", status: "coming" },
      { abbr: "LIUNA", name: "Laborers", full: "Laborers' Int'l Union of North America", website: "www.liuna.org", status: "coming" },
      { abbr: "IW", name: "Ironworkers", full: "Int'l Association of Bridge & Structural Iron Workers", website: "www.ironworkers.org", status: "coming" },
      { abbr: "OCA", name: "Cement Masons", full: "Operative Plasterers' & Cement Masons' Int'l Association", website: "www.opcmia.org", status: "coming" },
    ],
  },
  {
    group: "Specialty Trades",
    trades: [
      { abbr: "IUEC", name: "Elevator Constructors", full: "Int'l Union of Elevator Constructors", website: "www.iuec.org", status: "coming" },
      { abbr: "HFIAW", name: "Insulators", full: "Heat & Frost Insulators and Allied Workers", website: "www.insulators.org", status: "active", color: "#38bdf8" },
      { abbr: "SF", name: "Sprinkler Fitters", full: "United Assoc. Sprinkler Fitters Local 669", website: "www.sprinklerfitters669.org", status: "coming" },
      { abbr: "IABSORIW", name: "Boilermakers", full: "Int'l Brotherhood of Boilermakers", website: "www.boilermakers.org", status: "coming" },
      { abbr: "IBT", name: "Teamsters (Construction)", full: "Int'l Brotherhood of Teamsters", website: "www.teamster.org", status: "coming" },
      { abbr: "OPCMIA", name: "Plasterers & Cement Masons", full: "Operative Plasterers' & Cement Masons' Int'l", website: "www.opcmia.org", status: "coming" },
    ],
  },
];

// ─── IBEW INSIDE WIREMEN DATABASE — Commercial & Industrial ──────────────────
// ─── IBEW INSIDE WIREMEN LOCAL DATABASE — Commercial & Industrial Construction ──
// Source: User-provided wage data. Only verified phones/websites included.
// All Canadian locals excluded. Zero overlap with Lineman locals.
const IBEW_INSIDE_LOCALS = [
  { id: 1, name: "IBEW Local 1", city: "St. Louis", state: "MO", phone: "(314) 647-5900", website: "ibewlocal1.org", lat: 38.627, lng: -90.1994, address: "5850 Elizabeth Ave, St. Louis, MO 63110" },
  { id: 3, name: "IBEW Local 3", city: "New York City", state: "NY", phone: "(718) 591-4000", website: "local3ibew.org", lat: 40.7128, lng: -74.0059, address: "158-11 Harry Van Arsdale Jr Ave, Flushing, NY 11365" },
  { id: 5, name: "IBEW Local 5", city: "Pittsburgh", state: "PA", phone: null, website: "ibew5.com", lat: 40.4406, lng: -79.9959, address: "Pittsburgh, PA" },
  { id: 6, name: "IBEW Local 6", city: "San Francisco", state: "CA", phone: null, website: "ibew6.org", lat: 37.7749, lng: -122.4194, address: "55 Fillmore St, San Francisco, CA 94117" },
  { id: 7, name: "IBEW Local 7", city: "Springfield", state: "MA", phone: null, website: null, lat: 42.1015, lng: -72.5898, address: "Springfield, MA" },
  { id: 8, name: "IBEW Local 8", city: "Toledo", state: "OH", phone: null, website: null, lat: 41.6528, lng: -83.5379, address: "Toledo, OH" },
  { id: 11, name: "IBEW Local 11", city: "Pasadena", state: "CA", phone: "(626) 243-9700", website: "ibew11.org", lat: 34.1478, lng: -118.1445, address: "297 N Marengo Ave, Pasadena, CA 91101" },
  { id: 12, name: "IBEW Local 12", city: "Pueblo", state: "CO", phone: null, website: null, lat: 38.2544, lng: -104.6091, address: "Pueblo, CO" },
  { id: 13, name: "IBEW Local 13", city: "Burlington", state: "IA", phone: null, website: null, lat: 40.8075, lng: -91.1129, address: "Burlington, IA" },
  { id: 14, name: "IBEW Local 14", city: "Eau Claire", state: "WI", phone: null, website: null, lat: 44.8113, lng: -91.4985, address: "Eau Claire, WI" },
  { id: 16, name: "IBEW Local 16", city: "Evansville", state: "IN", phone: null, website: null, lat: 37.9716, lng: -87.5711, address: "Evansville, IN" },
  { id: 20, name: "IBEW Local 20", city: "Dallas", state: "TX", phone: null, website: null, lat: 32.7767, lng: -96.797, address: "Dallas, TX" },
  { id: 22, name: "IBEW Local 22", city: "Omaha", state: "NE", phone: null, website: null, lat: 41.2565, lng: -95.9345, address: "Omaha, NE" },
  { id: 24, name: "IBEW Local 24", city: "Baltimore", state: "MD", phone: null, website: null, lat: 39.2904, lng: -76.6122, address: "Baltimore, MD" },
  { id: 25, name: "IBEW Local 25", city: "Hauppauge", state: "NY", phone: null, website: null, lat: 40.8232, lng: -73.2068, address: "Long Island, NY" },
  { id: 26, name: "IBEW Local 26", city: "Washington", state: "DC", phone: null, website: null, lat: 38.9072, lng: -77.0369, address: "Washington, DC" },
  { id: 32, name: "IBEW Local 32", city: "Lima", state: "OH", phone: null, website: null, lat: 40.7426, lng: -84.1052, address: "Lima, OH" },
  { id: 3401, name: "IBEW Local 34", city: "Quincy", state: "IL", phone: null, website: null, lat: 39.9356, lng: -91.4099, address: "Quincy, IL" },
  { id: 3402, name: "IBEW Local 34", city: "Peoria", state: "IL", phone: null, website: null, lat: 40.6936, lng: -89.589, address: "Peoria, IL" },
  { id: 3403, name: "IBEW Local 34", city: "Galesburg", state: "IL", phone: null, website: null, lat: 40.9478, lng: -90.3712, address: "Galesburg, IL" },
  { id: 35, name: "IBEW Local 35", city: "Hartford", state: "CT", phone: null, website: null, lat: 41.7658, lng: -72.6851, address: "Hartford, CT" },
  { id: 38, name: "IBEW Local 38", city: "Cleveland", state: "OH", phone: null, website: null, lat: 41.4993, lng: -81.6944, address: "Cleveland, OH" },
  { id: 40, name: "IBEW Local 40", city: "Hollywood", state: "CA", phone: null, website: null, lat: 34.0928, lng: -118.3287, address: "Hollywood, CA" },
  { id: 41, name: "IBEW Local 41", city: "Buffalo", state: "NY", phone: null, website: null, lat: 42.8864, lng: -78.8784, address: "Buffalo, NY" },
  { id: 43, name: "IBEW Local 43", city: "Syracuse", state: "NY", phone: null, website: null, lat: 43.0481, lng: -76.1474, address: "Syracuse, NY" },
  { id: 46, name: "IBEW Local 46", city: "Seattle", state: "WA", phone: null, website: "ibew46.com", lat: 47.6062, lng: -122.3321, address: "2230 6th Ave S, Seattle, WA 98134" },
  { id: 48, name: "IBEW Local 48", city: "Portland", state: "OR", phone: null, website: "ibew48.org", lat: 45.5231, lng: -122.6765, address: "306 NE Failing St, Portland, OR 97212" },
  { id: 56, name: "IBEW Local 56", city: "Erie", state: "PA", phone: null, website: null, lat: 42.1292, lng: -80.0851, address: "Erie, PA" },
  { id: 58, name: "IBEW Local 58", city: "Detroit", state: "MI", phone: null, website: "ibew58.org", lat: 42.3314, lng: -83.0458, address: "Detroit, MI" },
  { id: 60, name: "IBEW Local 60", city: "San Antonio", state: "TX", phone: null, website: null, lat: 29.4241, lng: -98.4936, address: "San Antonio, TX" },
  { id: 64, name: "IBEW Local 64", city: "Youngstown", state: "OH", phone: null, website: null, lat: 41.0998, lng: -80.6495, address: "Youngstown, OH" },
  { id: 68, name: "IBEW Local 68", city: "Denver", state: "CO", phone: null, website: null, lat: 39.7392, lng: -104.9903, address: "Denver, CO" },
  { id: 72, name: "IBEW Local 72", city: "Waco", state: "TX", phone: null, website: null, lat: 31.5493, lng: -97.1467, address: "Waco, TX" },
  { id: 73, name: "IBEW Local 73", city: "Spokane", state: "WA", phone: null, website: null, lat: 47.6588, lng: -117.426, address: "Spokane, WA" },
  { id: 76, name: "IBEW Local 76", city: "Tacoma", state: "WA", phone: null, website: null, lat: 47.2529, lng: -122.4443, address: "Tacoma, WA" },
  { id: 80, name: "IBEW Local 80", city: "Norfolk", state: "VA", phone: null, website: null, lat: 36.8508, lng: -76.2859, address: "Norfolk, VA" },
  { id: 81, name: "IBEW Local 81", city: "Scranton", state: "PA", phone: null, website: null, lat: 41.409, lng: -75.6624, address: "Scranton, PA" },
  { id: 82, name: "IBEW Local 82", city: "Dayton", state: "OH", phone: null, website: null, lat: 39.7589, lng: -84.1916, address: "Dayton, OH" },
  { id: 86, name: "IBEW Local 86", city: "Rochester", state: "NY", phone: null, website: null, lat: 43.1566, lng: -77.6088, address: "Rochester, NY" },
  { id: 90, name: "IBEW Local 90", city: "New Haven", state: "CT", phone: null, website: null, lat: 41.3083, lng: -72.9279, address: "New Haven, CT" },
  { id: 95, name: "IBEW Local 95", city: "Joplin", state: "MO", phone: null, website: null, lat: 37.0842, lng: -94.5133, address: "Joplin, MO" },
  { id: 96, name: "IBEW Local 96", city: "Worcester", state: "MA", phone: null, website: null, lat: 42.2626, lng: -71.8023, address: "Worcester, MA" },
  { id: 98, name: "IBEW Local 98", city: "Philadelphia", state: "PA", phone: null, website: null, lat: 39.9526, lng: -75.1652, address: "Philadelphia, PA" },
  { id: 99, name: "IBEW Local 99", city: "Providence", state: "RI", phone: null, website: null, lat: 41.824, lng: -71.4128, address: "Providence, RI" },
  { id: 100, name: "IBEW Local 100", city: "Fresno", state: "CA", phone: null, website: null, lat: 36.7378, lng: -119.7871, address: "Fresno, CA" },
  { id: 102, name: "IBEW Local 102", city: "Paterson", state: "NJ", phone: null, website: null, lat: 40.9168, lng: -74.1718, address: "Paterson, NJ" },
  { id: 103, name: "IBEW Local 103", city: "Boston", state: "MA", phone: null, website: "ibew103.org", lat: 42.3601, lng: -71.0589, address: "256 Freeport St, Boston, MA 02122" },
  { id: 106, name: "IBEW Local 106", city: "Jamestown", state: "NY", phone: null, website: null, lat: 42.097, lng: -79.2353, address: "Jamestown, NY" },
  { id: 110, name: "IBEW Local 110", city: "St. Paul", state: "MN", phone: null, website: null, lat: 44.9537, lng: -93.09, address: "St. Paul, MN" },
  { id: 111, name: "IBEW Local 111", city: "Denver", state: "CO", phone: null, website: null, lat: 39.7291, lng: -104.9617, address: "Denver, CO" },
  { id: 112, name: "IBEW Local 112", city: "Kennewick", state: "WA", phone: null, website: null, lat: 46.2112, lng: -119.1372, address: "Kennewick, WA" },
  { id: 113, name: "IBEW Local 113", city: "Colorado Springs", state: "CO", phone: null, website: null, lat: 38.8339, lng: -104.8214, address: "Colorado Springs, CO" },
  { id: 117, name: "IBEW Local 117", city: "Elgin", state: "IL", phone: null, website: null, lat: 42.0354, lng: -88.2826, address: "Elgin, IL" },
  { id: 124, name: "IBEW Local 124", city: "Kansas City", state: "MO", phone: null, website: null, lat: 39.0997, lng: -94.5786, address: "Kansas City, MO" },
  { id: 127, name: "IBEW Local 127", city: "Kenosha", state: "WI", phone: null, website: null, lat: 42.5847, lng: -87.8212, address: "Kenosha, WI" },
  { id: 129, name: "IBEW Local 129", city: "Lorain", state: "OH", phone: null, website: null, lat: 41.4523, lng: -82.1824, address: "Lorain, OH" },
  { id: 130, name: "IBEW Local 130", city: "New Orleans", state: "LA", phone: null, website: null, lat: 29.9511, lng: -90.0715, address: "New Orleans, LA" },
  { id: 131, name: "IBEW Local 131", city: "Kalamazoo", state: "MI", phone: null, website: null, lat: 42.2917, lng: -85.5872, address: "Kalamazoo, MI" },
  { id: 134, name: "IBEW Local 134", city: "Chicago", state: "IL", phone: null, website: "ibew134.org", lat: 41.8781, lng: -87.6298, address: "600 W Washington Blvd, Chicago, IL 60661" },
  { id: 136, name: "IBEW Local 136", city: "Birmingham", state: "AL", phone: null, website: null, lat: 33.5186, lng: -86.8104, address: "Birmingham, AL" },
  { id: 139, name: "IBEW Local 139", city: "Elmira", state: "NY", phone: null, website: null, lat: 42.0898, lng: -76.8077, address: "Elmira, NY" },
  { id: 141, name: "IBEW Local 141", city: "Wheeling", state: "WV", phone: null, website: null, lat: 40.064, lng: -80.7209, address: "Wheeling, WV" },
  { id: 143, name: "IBEW Local 143", city: "Harrisburg", state: "PA", phone: null, website: null, lat: 40.2732, lng: -76.8867, address: "Harrisburg, PA" },
  { id: 145, name: "IBEW Local 145", city: "Davenport", state: "IA", phone: null, website: null, lat: 41.5236, lng: -90.5776, address: "Davenport, IA" },
  { id: 146, name: "IBEW Local 146", city: "Decatur", state: "IL", phone: null, website: null, lat: 39.8403, lng: -88.9548, address: "Decatur, IL" },
  { id: 150, name: "IBEW Local 150", city: "Waukegan", state: "IL", phone: null, website: null, lat: 42.3636, lng: -87.8448, address: "Waukegan, IL" },
  { id: 153, name: "IBEW Local 153", city: "South Bend", state: "IN", phone: null, website: null, lat: 41.6764, lng: -86.252, address: "South Bend, IN" },
  { id: 158, name: "IBEW Local 158", city: "Green Bay", state: "WI", phone: null, website: null, lat: 44.5133, lng: -88.0133, address: "Green Bay, WI" },
  { id: 159, name: "IBEW Local 159", city: "Madison", state: "WI", phone: null, website: null, lat: 43.0731, lng: -89.4012, address: "Madison, WI" },
  { id: 163, name: "IBEW Local 163", city: "Wilkes-Barre", state: "PA", phone: null, website: null, lat: 41.2459, lng: -75.8813, address: "Wilkes-Barre, PA" },
  { id: 164, name: "IBEW Local 164", city: "Jersey City", state: "NJ", phone: null, website: null, lat: 40.7178, lng: -74.0431, address: "Jersey City, NJ" },
  { id: 175, name: "IBEW Local 175", city: "Chattanooga", state: "TN", phone: null, website: null, lat: 35.0456, lng: -85.3097, address: "Chattanooga, TN" },
  { id: 176, name: "IBEW Local 176", city: "Joliet", state: "IL", phone: null, website: null, lat: 41.525, lng: -88.0817, address: "Joliet, IL" },
  { id: 177, name: "IBEW Local 177", city: "Jacksonville", state: "FL", phone: "(904) 355-4569", website: "ibew177.org", lat: 30.3266, lng: -81.6659, address: "966 Liberty St, Jacksonville, FL 32206" },
  { id: 180, name: "IBEW Local 180", city: "Napa", state: "CA", phone: null, website: null, lat: 38.2975, lng: -122.2869, address: "Napa, CA" },
  { id: 191, name: "IBEW Local 191", city: "Everett", state: "WA", phone: null, website: null, lat: 47.979, lng: -122.2021, address: "Everett, WA" },
  { id: 193, name: "IBEW Local 193", city: "Springfield", state: "IL", phone: null, website: null, lat: 39.7817, lng: -89.6501, address: "Springfield, IL" },
  { id: 194, name: "IBEW Local 194", city: "Shreveport", state: "LA", phone: null, website: null, lat: 32.5252, lng: -93.7502, address: "Shreveport, LA" },
  { id: 197, name: "IBEW Local 197", city: "Bloomington", state: "IL", phone: null, website: null, lat: 40.4842, lng: -88.9937, address: "Bloomington, IL" },
  { id: 212, name: "IBEW Local 212", city: "Cincinnati", state: "OH", phone: null, website: null, lat: 39.1031, lng: -84.512, address: "Cincinnati, OH" },
  { id: 223, name: "IBEW Local 223", city: "Brockton", state: "MA", phone: null, website: null, lat: 42.0834, lng: -71.0184, address: "Brockton, MA" },
  { id: 226, name: "IBEW Local 226", city: "Topeka", state: "KS", phone: null, website: null, lat: 39.0473, lng: -95.6752, address: "Topeka, KS" },
  { id: 229, name: "IBEW Local 229", city: "York", state: "PA", phone: null, website: null, lat: 39.9626, lng: -76.7277, address: "York, PA" },
  { id: 231, name: "IBEW Local 231", city: "Sioux City", state: "IA", phone: null, website: null, lat: 42.4999, lng: -96.4003, address: "Sioux City, IA" },
  { id: 233, name: "IBEW Local 233", city: "Helena", state: "MT", phone: null, website: null, lat: 46.5958, lng: -112.027, address: "Helena, MT" },
  { id: 234, name: "IBEW Local 234", city: "Salinas", state: "CA", phone: null, website: null, lat: 36.6777, lng: -121.6555, address: "Salinas, CA" },
  { id: 236, name: "IBEW Local 236", city: "Albany", state: "NY", phone: null, website: null, lat: 42.6526, lng: -73.7562, address: "Albany, NY" },
  { id: 237, name: "IBEW Local 237", city: "Niagara Falls", state: "NY", phone: null, website: null, lat: 43.0962, lng: -79.0377, address: "Niagara Falls, NY" },
  { id: 238, name: "IBEW Local 238", city: "Asheville", state: "NC", phone: null, website: null, lat: 35.5951, lng: -82.5515, address: "Asheville, NC" },
  { id: 241, name: "IBEW Local 241", city: "Ithaca", state: "NY", phone: null, website: null, lat: 42.444, lng: -76.5021, address: "Ithaca, NY" },
  { id: 242, name: "IBEW Local 242", city: "Duluth", state: "MN", phone: null, website: null, lat: 46.7867, lng: -92.1005, address: "Duluth, MN" },
  { id: 246, name: "IBEW Local 246", city: "Steubenville", state: "OH", phone: null, website: null, lat: 40.3698, lng: -80.6337, address: "Steubenville, OH" },
  { id: 252, name: "IBEW Local 252", city: "Ann Arbor", state: "MI", phone: null, website: null, lat: 42.2808, lng: -83.743, address: "Ann Arbor, MI" },
  { id: 257, name: "IBEW Local 257", city: "Jefferson City", state: "MO", phone: null, website: null, lat: 38.5767, lng: -92.1735, address: "Jefferson City, MO" },
  { id: 265, name: "IBEW Local 265", city: "Lincoln", state: "NE", phone: null, website: null, lat: 40.8136, lng: -96.7026, address: "Lincoln, NE" },
  { id: 269, name: "IBEW Local 269", city: "Trenton", state: "NJ", phone: null, website: null, lat: 40.2171, lng: -74.7429, address: "Trenton, NJ" },
  { id: 270, name: "IBEW Local 270", city: "Oak Ridge", state: "TN", phone: null, website: null, lat: 36.0104, lng: -84.2696, address: "Oak Ridge, TN" },
  { id: 271, name: "IBEW Local 271", city: "Wichita", state: "KS", phone: null, website: null, lat: 37.6872, lng: -97.3301, address: "Wichita, KS" },
  { id: 275, name: "IBEW Local 275", city: "Coopersville", state: "MI", phone: null, website: null, lat: 43.0648, lng: -85.9286, address: "Coopersville, MI" },
  { id: 278, name: "IBEW Local 278", city: "Corpus Christi", state: "TX", phone: null, website: null, lat: 27.8006, lng: -97.3964, address: "Corpus Christi, TX" },
  { id: 280, name: "IBEW Local 280", city: "Tangent", state: "OR", phone: null, website: null, lat: 44.5429, lng: -123.1065, address: "Tangent, OR" },
  { id: 288, name: "IBEW Local 288", city: "Waterloo", state: "IA", phone: null, website: null, lat: 42.4928, lng: -92.3426, address: "Waterloo, IA" },
  { id: 291, name: "IBEW Local 291", city: "Boise", state: "ID", phone: null, website: null, lat: 43.615, lng: -116.2023, address: "Boise, ID" },
  { id: 292, name: "IBEW Local 292", city: "Minneapolis", state: "MN", phone: null, website: "ibew292.org", lat: 44.9778, lng: -93.265, address: "Minneapolis, MN" },
  { id: 294, name: "IBEW Local 294", city: "Hibbing", state: "MN", phone: null, website: null, lat: 47.4275, lng: -92.9377, address: "Hibbing, MN" },
  { id: 295, name: "IBEW Local 295", city: "Little Rock", state: "AR", phone: null, website: null, lat: 34.7465, lng: -92.2896, address: "Little Rock, AR" },
  { id: 300, name: "IBEW Local 300", city: "Burlington", state: "VT", phone: null, website: null, lat: 44.4759, lng: -73.2121, address: "Burlington, VT" },
  { id: 301, name: "IBEW Local 301", city: "Texarkana", state: "TX", phone: null, website: null, lat: 33.4251, lng: -94.0477, address: "Texarkana, TX" },
  { id: 302, name: "IBEW Local 302", city: "Martinez", state: "CA", phone: null, website: null, lat: 38.0194, lng: -122.1341, address: "Martinez, CA" },
  { id: 305, name: "IBEW Local 305", city: "Fort Wayne", state: "IN", phone: null, website: null, lat: 41.1306, lng: -85.1289, address: "Fort Wayne, IN" },
  { id: 306, name: "IBEW Local 306", city: "Akron", state: "OH", phone: null, website: null, lat: 41.0814, lng: -81.519, address: "Akron, OH" },
  { id: 307, name: "IBEW Local 307", city: "Cumberland", state: "MD", phone: null, website: null, lat: 39.6529, lng: -78.7625, address: "Cumberland, MD" },
  { id: 309, name: "IBEW Local 309", city: "Collinsville", state: "IL", phone: null, website: null, lat: 38.6703, lng: -89.9845, address: "Collinsville, IL" },
  { id: 313, name: "IBEW Local 313", city: "New Castle", state: "DE", phone: null, website: null, lat: 39.6595, lng: -75.5671, address: "New Castle, DE" },
  { id: 317, name: "IBEW Local 317", city: "Huntington", state: "WV", phone: null, website: null, lat: 38.4193, lng: -82.4452, address: "Huntington, WV" },
  { id: 322, name: "IBEW Local 322", city: "Casper", state: "WY", phone: null, website: null, lat: 42.8501, lng: -106.3252, address: "Casper, WY" },
  { id: 325, name: "IBEW Local 325", city: "Binghamton", state: "NY", phone: null, website: null, lat: 42.0987, lng: -75.918, address: "Binghamton, NY" },
  { id: 332, name: "IBEW Local 332", city: "San Jose", state: "CA", phone: null, website: null, lat: 37.3382, lng: -121.8863, address: "San Jose, CA" },
  { id: 340, name: "IBEW Local 340", city: "Sacramento", state: "CA", phone: null, website: null, lat: 38.5816, lng: -121.4944, address: "Sacramento, CA" },
  { id: 342, name: "IBEW Local 342", city: "Greensboro", state: "NC", phone: null, website: null, lat: 36.0726, lng: -79.792, address: "Greensboro, NC" },
  { id: 343, name: "IBEW Local 343", city: "Rochester", state: "MN", phone: null, website: null, lat: 43.9695, lng: -92.4663, address: "Rochester, MN" },
  { id: 347, name: "IBEW Local 347", city: "Des Moines", state: "IA", phone: null, website: null, lat: 41.5868, lng: -93.625, address: "Des Moines, IA" },
  { id: 349, name: "IBEW Local 349", city: "Miami", state: "FL", phone: "(305) 325-1330", website: "ibew349.net", lat: 25.7974, lng: -80.222, address: "1657 NW 17th Ave, Miami, FL 33125" },
  { id: 350, name: "IBEW Local 350", city: "Hannibal", state: "MO", phone: null, website: null, lat: 39.7081, lng: -91.3568, address: "Hannibal, MO" },
  { id: 351, name: "IBEW Local 351", city: "Folsom", state: "NJ", phone: null, website: null, lat: 39.6059, lng: -74.8574, address: "Folsom, NJ" },
  { id: 354, name: "IBEW Local 354", city: "Salt Lake City", state: "UT", phone: null, website: null, lat: 40.7608, lng: -111.891, address: "Salt Lake City, UT" },
  { id: 357, name: "IBEW Local 357", city: "Las Vegas", state: "NV", phone: null, website: null, lat: 36.1699, lng: -115.1398, address: "Las Vegas, NV" },
  { id: 363, name: "IBEW Local 363", city: "New City", state: "NY", phone: null, website: null, lat: 41.1476, lng: -73.989, address: "New City, NY" },
  { id: 364, name: "IBEW Local 364", city: "Rockford", state: "IL", phone: null, website: null, lat: 42.2711, lng: -89.094, address: "Rockford, IL" },
  { id: 369, name: "IBEW Local 369", city: "Louisville", state: "KY", phone: null, website: null, lat: 38.2527, lng: -85.7585, address: "Louisville, KY" },
  { id: 375, name: "IBEW Local 375", city: "Allentown", state: "PA", phone: null, website: null, lat: 40.6084, lng: -75.4902, address: "Allentown, PA" },
  { id: 379, name: "IBEW Local 379", city: "Charlotte", state: "NC", phone: null, website: null, lat: 35.2271, lng: -80.8431, address: "Charlotte, NC" },
  { id: 388, name: "IBEW Local 388", city: "Stevens Point", state: "WI", phone: null, website: null, lat: 44.5236, lng: -89.5746, address: "Stevens Point, WI" },
  { id: 400, name: "IBEW Local 400", city: "Asbury Park", state: "NJ", phone: null, website: null, lat: 40.2204, lng: -74.0121, address: "Asbury Park, NJ" },
  { id: 401, name: "IBEW Local 401", city: "Reno", state: "NV", phone: null, website: null, lat: 39.5296, lng: -119.8138, address: "Reno, NV" },
  { id: 405, name: "IBEW Local 405", city: "Cedar Rapids", state: "IA", phone: null, website: null, lat: 41.9779, lng: -91.6656, address: "Cedar Rapids, IA" },
  { id: 413, name: "IBEW Local 413", city: "Santa Barbara", state: "CA", phone: null, website: null, lat: 34.4208, lng: -119.6982, address: "Santa Barbara, CA" },
  { id: 415, name: "IBEW Local 415", city: "Cheyenne", state: "WY", phone: null, website: null, lat: 41.14, lng: -104.8202, address: "Cheyenne, WY" },
  { id: 426, name: "IBEW Local 426", city: "Sioux Falls", state: "SD", phone: null, website: null, lat: 43.5446, lng: -96.7311, address: "Sioux Falls, SD" },
  { id: 428, name: "IBEW Local 428", city: "Bakersfield", state: "CA", phone: null, website: null, lat: 35.3733, lng: -119.0187, address: "Bakersfield, CA" },
  { id: 429, name: "IBEW Local 429", city: "Nashville", state: "TN", phone: null, website: null, lat: 36.1627, lng: -86.7816, address: "Nashville, TN" },
  { id: 430, name: "IBEW Local 430", city: "Racine", state: "WI", phone: null, website: null, lat: 42.7261, lng: -87.7829, address: "Racine, WI" },
  { id: 436, name: "IBEW Local 436", city: "El Dorado", state: "AR", phone: null, website: null, lat: 33.2009, lng: -92.666, address: "El Dorado, AR" },
  { id: 440, name: "IBEW Local 440", city: "Riverside", state: "CA", phone: null, website: null, lat: 33.9533, lng: -117.3961, address: "Riverside, CA" },
  { id: 441, name: "IBEW Local 441", city: "Orange County", state: "CA", phone: null, website: null, lat: 33.7175, lng: -117.8311, address: "Anaheim, CA" },
  { id: 443, name: "IBEW Local 443", city: "Montgomery", state: "AL", phone: null, website: null, lat: 32.3668, lng: -86.2999, address: "Montgomery, AL" },
  { id: 444, name: "IBEW Local 444", city: "Ponca City", state: "OK", phone: null, website: null, lat: 36.707, lng: -97.0856, address: "Ponca City, OK" },
  { id: 445, name: "IBEW Local 445", city: "Battle Creek", state: "MI", phone: null, website: null, lat: 42.3212, lng: -85.1797, address: "Battle Creek, MI" },
  { id: 446, name: "IBEW Local 446", city: "Monroe", state: "LA", phone: null, website: null, lat: 32.5093, lng: -92.1193, address: "Monroe, LA" },
  { id: 449, name: "IBEW Local 449", city: "Pocatello", state: "ID", phone: null, website: null, lat: 42.8713, lng: -112.4455, address: "Pocatello, ID" },
  { id: 453, name: "IBEW Local 453", city: "Springfield", state: "MO", phone: null, website: null, lat: 37.209, lng: -93.2923, address: "Springfield, MO" },
  { id: 461, name: "IBEW Local 461", city: "Aurora", state: "IL", phone: null, website: null, lat: 41.7606, lng: -88.3201, address: "Aurora, IL" },
  { id: 466, name: "IBEW Local 466", city: "Charleston", state: "WV", phone: null, website: null, lat: 38.3498, lng: -81.6326, address: "Charleston, WV" },
  { id: 474, name: "IBEW Local 474", city: "Memphis", state: "TN", phone: null, website: null, lat: 35.1495, lng: -90.049, address: "Memphis, TN" },
  { id: 477, name: "IBEW Local 477", city: "San Bernardino", state: "CA", phone: null, website: null, lat: 34.1083, lng: -117.2898, address: "San Bernardino, CA" },
  { id: 479, name: "IBEW Local 479", city: "Beaumont", state: "TX", phone: null, website: null, lat: 30.086, lng: -94.1018, address: "Beaumont, TX" },
  { id: 480, name: "IBEW Local 480", city: "Jackson", state: "MS", phone: null, website: null, lat: 32.2988, lng: -90.1848, address: "Jackson, MS" },
  { id: 481, name: "IBEW Local 481", city: "Indianapolis", state: "IN", phone: null, website: null, lat: 39.7684, lng: -86.1581, address: "Indianapolis, IN" },
  { id: 488, name: "IBEW Local 488", city: "Bridgeport", state: "CT", phone: null, website: null, lat: 41.1865, lng: -73.1952, address: "Bridgeport, CT" },
  { id: 490, name: "IBEW Local 490", city: "Concord", state: "NH", phone: null, website: null, lat: 43.2081, lng: -71.5376, address: "Concord, NH" },
  { id: 494, name: "IBEW Local 494", city: "Milwaukee", state: "WI", phone: null, website: null, lat: 43.0389, lng: -87.9065, address: "Milwaukee, WI" },
  { id: 495, name: "IBEW Local 495", city: "Wilmington", state: "NC", phone: null, website: null, lat: 34.2257, lng: -77.9447, address: "Wilmington, NC" },
  { id: 498, name: "IBEW Local 498", city: "Traverse City", state: "MI", phone: null, website: null, lat: 44.7631, lng: -85.6206, address: "Traverse City, MI" },
  { id: 505, name: "IBEW Local 505", city: "Mobile", state: "AL", phone: null, website: null, lat: 30.6954, lng: -88.0399, address: "Mobile, AL" },
  { id: 508, name: "IBEW Local 508", city: "Savannah", state: "GA", phone: null, website: null, lat: 32.0835, lng: -81.0998, address: "Savannah, GA" },
  { id: 518, name: "IBEW Local 518", city: "Globe", state: "AZ", phone: null, website: null, lat: 33.3942, lng: -110.7865, address: "Globe, AZ" },
  { id: 520, name: "IBEW Local 520", city: "Austin", state: "TX", phone: null, website: null, lat: 30.2672, lng: -97.7431, address: "Austin, TX" },
  { id: 527, name: "IBEW Local 527", city: "Galveston", state: "TX", phone: null, website: null, lat: 29.3013, lng: -94.7977, address: "Galveston, TX" },
  { id: 531, name: "IBEW Local 531", city: "La Porte", state: "IN", phone: null, website: null, lat: 41.61, lng: -86.7225, address: "La Porte, IN" },
  { id: 532, name: "IBEW Local 532", city: "Billings", state: "MT", phone: null, website: null, lat: 45.7833, lng: -108.5007, address: "Billings, MT" },
  { id: 538, name: "IBEW Local 538", city: "Danville", state: "IL", phone: null, website: null, lat: 40.1242, lng: -87.63, address: "Danville, IL" },
  { id: 540, name: "IBEW Local 540", city: "Canton", state: "OH", phone: null, website: null, lat: 40.7989, lng: -81.3784, address: "Canton, OH" },
  { id: 545, name: "IBEW Local 545", city: "St. Joseph", state: "MO", phone: null, website: null, lat: 39.7675, lng: -94.8467, address: "St. Joseph, MO" },
  { id: 551, name: "IBEW Local 551", city: "Santa Rosa", state: "CA", phone: null, website: null, lat: 38.4404, lng: -122.7141, address: "Santa Rosa, CA" },
  { id: 553, name: "IBEW Local 553", city: "Raleigh", state: "NC", phone: null, website: null, lat: 35.7796, lng: -78.6382, address: "Raleigh, NC" },
  { id: 557, name: "IBEW Local 557", city: "Saginaw", state: "MI", phone: null, website: null, lat: 43.4195, lng: -83.9508, address: "Saginaw, MI" },
  { id: 558, name: "IBEW Local 558", city: "Sheffield", state: "AL", phone: null, website: null, lat: 34.7651, lng: -87.6975, address: "Sheffield, AL" },
  { id: 567, name: "IBEW Local 567", city: "Auburn", state: "ME", phone: null, website: null, lat: 44.0979, lng: -70.2312, address: "Auburn, ME" },
  { id: 569, name: "IBEW Local 569", city: "San Diego", state: "CA", phone: null, website: null, lat: 32.7157, lng: -117.1611, address: "San Diego, CA" },
  { id: 570, name: "IBEW Local 570", city: "Tucson", state: "AZ", phone: null, website: null, lat: 32.2226, lng: -110.9747, address: "Tucson, AZ" },
  { id: 573, name: "IBEW Local 573", city: "Warren", state: "OH", phone: null, website: null, lat: 41.2376, lng: -80.8184, address: "Warren, OH" },
  { id: 575, name: "IBEW Local 575", city: "Portsmouth", state: "OH", phone: null, website: null, lat: 38.7318, lng: -82.9977, address: "Portsmouth, OH" },
  { id: 576, name: "IBEW Local 576", city: "Alexandria", state: "LA", phone: null, website: null, lat: 31.3113, lng: -92.4451, address: "Alexandria, LA" },
  { id: 577, name: "IBEW Local 577", city: "Appleton", state: "WI", phone: null, website: null, lat: 44.2619, lng: -88.4154, address: "Appleton, WI" },
  { id: 58301, name: "IBEW Local 583", city: "El Paso", state: "TX", phone: null, website: null, lat: 31.7619, lng: -106.485, address: "El Paso, TX" },
  { id: 58302, name: "IBEW Local 583", city: "Las Cruces", state: "NM", phone: null, website: null, lat: 32.3199, lng: -106.7637, address: "Las Cruces, NM" },
  { id: 584, name: "IBEW Local 584", city: "Tulsa", state: "OK", phone: null, website: null, lat: 36.1539, lng: -95.9928, address: "Tulsa, OK" },
  { id: 59501, name: "IBEW Local 595", city: "Stockton", state: "CA", phone: null, website: null, lat: 37.9577, lng: -121.2908, address: "Stockton, CA" },
  { id: 59502, name: "IBEW Local 595", city: "Dublin", state: "CA", phone: null, website: null, lat: 37.7021, lng: -121.9358, address: "Dublin, CA" },
  { id: 596, name: "IBEW Local 596", city: "Clarksburg", state: "WV", phone: null, website: null, lat: 39.2806, lng: -80.3445, address: "Clarksburg, WV" },
  { id: 601, name: "IBEW Local 601", city: "Champaign", state: "IL", phone: null, website: null, lat: 40.1164, lng: -88.2434, address: "Champaign, IL" },
  { id: 602, name: "IBEW Local 602", city: "Amarillo", state: "TX", phone: null, website: null, lat: 35.222, lng: -101.8313, address: "Amarillo, TX" },
  { id: 606, name: "IBEW Local 606", city: "Orlando", state: "FL", phone: "(407) 896-7271", website: "ibew606.org", lat: 28.56, lng: -81.3675, address: "820 Virginia Dr, Orlando, FL 32803" },
  { id: 607, name: "IBEW Local 607", city: "Shamokin", state: "PA", phone: null, website: null, lat: 40.7887, lng: -76.5586, address: "Shamokin, PA" },
  { id: 611, name: "IBEW Local 611", city: "Albuquerque", state: "NM", phone: null, website: null, lat: 35.0844, lng: -106.6504, address: "Albuquerque, NM" },
  { id: 613, name: "IBEW Local 613", city: "Atlanta", state: "GA", phone: null, website: null, lat: 33.749, lng: -84.388, address: "Atlanta, GA" },
  { id: 617, name: "IBEW Local 617", city: "San Mateo", state: "CA", phone: null, website: null, lat: 37.563, lng: -122.3255, address: "San Mateo, CA" },
  { id: 639, name: "IBEW Local 639", city: "San Luis Obispo", state: "CA", phone: null, website: null, lat: 35.2828, lng: -120.6596, address: "San Luis Obispo, CA" },
  { id: 640, name: "IBEW Local 640", city: "Phoenix", state: "AZ", phone: null, website: null, lat: 33.4484, lng: -112.074, address: "Phoenix, AZ" },
  { id: 648, name: "IBEW Local 648", city: "Hamilton", state: "OH", phone: null, website: null, lat: 39.3995, lng: -84.5613, address: "Hamilton, OH" },
  { id: 649, name: "IBEW Local 649", city: "Alton", state: "IL", phone: null, website: null, lat: 38.8906, lng: -90.1843, address: "Alton, IL" },
  { id: 654, name: "IBEW Local 654", city: "Chester", state: "PA", phone: null, website: null, lat: 39.8498, lng: -75.3557, address: "Chester, PA" },
  { id: 659, name: "IBEW Local 659", city: "Medford", state: "OR", phone: null, website: null, lat: 42.3265, lng: -122.8756, address: "Medford, OR" },
  { id: 661, name: "IBEW Local 661", city: "Hutchinson", state: "KS", phone: null, website: null, lat: 38.0608, lng: -97.9298, address: "Hutchinson, KS" },
  { id: 665, name: "IBEW Local 665", city: "Lansing", state: "MI", phone: null, website: null, lat: 42.7325, lng: -84.5555, address: "Lansing, MI" },
  { id: 666, name: "IBEW Local 666", city: "Richmond", state: "VA", phone: null, website: null, lat: 37.5407, lng: -77.436, address: "Richmond, VA" },
  { id: 668, name: "IBEW Local 668", city: "Lafayette", state: "IN", phone: null, website: null, lat: 40.4167, lng: -86.8753, address: "Lafayette, IN" },
  { id: 673, name: "IBEW Local 673", city: "Painesville", state: "OH", phone: null, website: null, lat: 41.7248, lng: -81.2457, address: "Painesville, OH" },
  { id: 676, name: "IBEW Local 676", city: "Pensacola", state: "FL", phone: "(850) 477-8768", website: "ibewlocal676.com", lat: 30.4344, lng: -87.2086, address: "Pensacola, FL 32534" },
  { id: 681, name: "IBEW Local 681", city: "Wichita Falls", state: "TX", phone: null, website: null, lat: 33.9137, lng: -98.4934, address: "Wichita Falls, TX" },
  { id: 683, name: "IBEW Local 683", city: "Columbus", state: "OH", phone: null, website: null, lat: 39.9612, lng: -82.9988, address: "Columbus, OH" },
  { id: 684, name: "IBEW Local 684", city: "Modesto", state: "CA", phone: null, website: null, lat: 37.6391, lng: -120.9969, address: "Modesto, CA" },
  { id: 688, name: "IBEW Local 688", city: "Mansfield", state: "OH", phone: null, website: null, lat: 40.7584, lng: -82.5154, address: "Mansfield, OH" },
  { id: 692, name: "IBEW Local 692", city: "Bay City", state: "MI", phone: null, website: null, lat: 43.5945, lng: -83.8888, address: "Bay City, MI" },
  { id: 697, name: "IBEW Local 697", city: "Gary", state: "IN", phone: null, website: null, lat: 41.5934, lng: -87.3464, address: "Gary, IN" },
  { id: 700, name: "IBEW Local 700", city: "Fort Smith", state: "AR", phone: null, website: null, lat: 35.3859, lng: -94.3985, address: "Fort Smith, AR" },
  { id: 701, name: "IBEW Local 701", city: "Warrenville", state: "IL", phone: null, website: null, lat: 41.8175, lng: -88.1845, address: "Warrenville, IL" },
  { id: 702, name: "IBEW Local 702", city: "West Frankfort", state: "IL", phone: null, website: null, lat: 37.8984, lng: -88.9267, address: "West Frankfort, IL" },
  { id: 704, name: "IBEW Local 704", city: "Dubuque", state: "IA", phone: null, website: null, lat: 42.5006, lng: -90.6646, address: "Dubuque, IA" },
  { id: 712, name: "IBEW Local 712", city: "Beaver", state: "PA", phone: null, website: null, lat: 40.6912, lng: -80.3048, address: "Beaver, PA" },
  { id: 714, name: "IBEW Local 714", city: "Minot", state: "ND", phone: null, website: null, lat: 48.2325, lng: -101.2963, address: "Minot, ND" },
  { id: 716, name: "IBEW Local 716", city: "Houston", state: "TX", phone: null, website: null, lat: 29.7604, lng: -95.3698, address: "Houston, TX" },
  { id: 725, name: "IBEW Local 725", city: "Terre Haute", state: "IN", phone: null, website: null, lat: 39.4667, lng: -87.4139, address: "Terre Haute, IN" },
  { id: 728, name: "IBEW Local 728", city: "Fort Lauderdale", state: "FL", phone: "(954) 525-3106", website: "ibew728.org", lat: 26.0928, lng: -80.1396, address: "201 SE 24th St, Fort Lauderdale, FL 33316" },
  { id: 743, name: "IBEW Local 743", city: "Reading", state: "PA", phone: null, website: null, lat: 40.3356, lng: -75.9269, address: "Reading, PA" },
  { id: 756, name: "IBEW Local 756", city: "Port Orange", state: "FL", phone: "(386) 756-2756", website: "ibew756.org", lat: 29.1086, lng: -81.012, address: "5901 S Williamson Blvd, Port Orange, FL 32128" },
  { id: 760, name: "IBEW Local 760", city: "Knoxville", state: "TN", phone: null, website: null, lat: 35.9606, lng: -83.9207, address: "Knoxville, TN" },
  { id: 768, name: "IBEW Local 768", city: "Kalispell", state: "MT", phone: null, website: null, lat: 48.192, lng: -114.3168, address: "Kalispell, MT" },
  { id: 776, name: "IBEW Local 776", city: "North Charleston", state: "SC", phone: "(843) 554-1080", website: "ibewlocal776.org", lat: 32.8546, lng: -79.9748, address: "3345 Seiberling Rd, North Charleston, SC 29418" },
  { id: 812, name: "IBEW Local 812", city: "Williamsport", state: "PA", phone: null, website: null, lat: 41.2412, lng: -77.0011, address: "Williamsport, PA" },
  { id: 816, name: "IBEW Local 816", city: "Paducah", state: "KY", phone: null, website: null, lat: 37.0834, lng: -88.6001, address: "Paducah, KY" },
  { id: 824, name: "IBEW Local 824", city: "Tampa", state: "FL", phone: "(813) 626-5136", website: "ibew824.org", lat: 27.9932, lng: -82.3893, address: "6603 E Chelsea St, Tampa, FL 33610" },
  { id: 840, name: "IBEW Local 840", city: "Geneva", state: "NY", phone: null, website: null, lat: 42.869, lng: -76.9774, address: "Geneva, NY" },
  { id: 852, name: "IBEW Local 852", city: "Corinth", state: "MS", phone: null, website: null, lat: 34.9345, lng: -88.5223, address: "Corinth, MS" },
  { id: 855, name: "IBEW Local 855", city: "Muncie", state: "IN", phone: null, website: null, lat: 40.1934, lng: -85.3864, address: "Muncie, IN" },
  { id: 861, name: "IBEW Local 861", city: "Lake Charles", state: "LA", phone: null, website: null, lat: 30.2266, lng: -93.2174, address: "Lake Charles, LA" },
  { id: 873, name: "IBEW Local 873", city: "Kokomo", state: "IN", phone: null, website: null, lat: 40.4864, lng: -86.1336, address: "Kokomo, IN" },
  { id: 890, name: "IBEW Local 890", city: "Janesville", state: "WI", phone: null, website: null, lat: 42.6828, lng: -89.0187, address: "Janesville, WI" },
  { id: 903, name: "IBEW Local 903", city: "Gulfport", state: "MS", phone: null, website: null, lat: 30.3674, lng: -89.0928, address: "Gulfport, MS" },
  { id: 906, name: "IBEW Local 906", city: "Marquette", state: "MI", phone: null, website: null, lat: 46.5436, lng: -87.3954, address: "Marquette, MI" },
  { id: 910, name: "IBEW Local 910", city: "Watertown", state: "NY", phone: null, website: null, lat: 43.9748, lng: -75.9107, address: "Watertown, NY" },
  { id: 915, name: "IBEW Local 915", city: "Tampa", state: "FL", phone: "(813) 621-6451", website: "ibew915.org", lat: 27.9506, lng: -82.4572, address: "Tampa, FL 33610" },
  { id: 917, name: "IBEW Local 917", city: "Meridian", state: "MS", phone: null, website: null, lat: 32.3643, lng: -88.7037, address: "Meridian, MS" },
  { id: 932, name: "IBEW Local 932", city: "Coos Bay", state: "OR", phone: null, website: null, lat: 43.3665, lng: -124.2179, address: "Coos Bay, OR" },
  { id: 934, name: "IBEW Local 934", city: "Kingsport", state: "TN", phone: null, website: null, lat: 36.5484, lng: -82.5618, address: "Kingsport, TN" },
  { id: 948, name: "IBEW Local 948", city: "Flint", state: "MI", phone: null, website: null, lat: 43.0125, lng: -83.6875, address: "Flint, MI" },
  { id: 952, name: "IBEW Local 952", city: "Ventura", state: "CA", phone: null, website: null, lat: 34.2805, lng: -119.2945, address: "Ventura, CA" },
  { id: 968, name: "IBEW Local 968", city: "Parkersburg", state: "WV", phone: null, website: null, lat: 39.2667, lng: -81.5615, address: "Parkersburg, WV" },
  { id: 972, name: "IBEW Local 972", city: "Marietta", state: "OH", phone: null, website: null, lat: 39.4151, lng: -81.454, address: "Marietta, OH" },
  { id: 995, name: "IBEW Local 995", city: "Baton Rouge", state: "LA", phone: null, website: null, lat: 30.4515, lng: -91.1871, address: "Baton Rouge, LA" },
  { id: 1015, name: "IBEW Local 1015", city: "McAllen", state: "TX", phone: null, website: null, lat: 26.2034, lng: -98.23, address: "McAllen, TX" },
  { id: 1077, name: "IBEW Local 1077", city: "Bogalusa", state: "LA", phone: null, website: null, lat: 30.7913, lng: -89.8487, address: "Bogalusa, LA" },
  { id: 1105, name: "IBEW Local 1105", city: "Newark", state: "OH", phone: null, website: null, lat: 40.0581, lng: -82.4013, address: "Newark, OH" },
  { id: 1141, name: "IBEW Local 1141", city: "Oklahoma City", state: "OK", phone: null, website: null, lat: 35.4676, lng: -97.5164, address: "Oklahoma City, OK" },
  { id: 1186, name: "IBEW Local 1186", city: "Honolulu", state: "HI", phone: null, website: null, lat: 21.3069, lng: -157.8583, address: "Honolulu, HI" },
  { id: 1205, name: "IBEW Local 1205", city: "Gainesville", state: "FL", phone: "(352) 376-7701", website: "ibew1205.org", lat: 29.6734, lng: -82.3558, address: "2510 NW 6th St, Gainesville, FL 32609" },
  { id: 1250, name: "IBEW Local 1250", city: "Rapid City", state: "SD", phone: null, website: null, lat: 44.0805, lng: -103.231, address: "Rapid City, SD" },
  { id: 1253, name: "IBEW Local 1253", city: "Augusta", state: "ME", phone: null, website: null, lat: 44.3106, lng: -69.7795, address: "Augusta, ME" },
  { id: 1316, name: "IBEW Local 1316", city: "Macon", state: "GA", phone: null, website: null, lat: 32.8407, lng: -83.6324, address: "Macon, GA" },
  { id: 1340, name: "IBEW Local 1340", city: "Newport News", state: "VA", phone: null, website: null, lat: 36.9787, lng: -76.43, address: "Newport News, VA" },
  { id: 1426, name: "IBEW Local 1426", city: "Grand Forks", state: "ND", phone: null, website: null, lat: 47.9253, lng: -97.0329, address: "Grand Forks, ND" },
  { id: 1516, name: "IBEW Local 1516", city: "Jonesboro", state: "AR", phone: null, website: null, lat: 35.8423, lng: -90.7043, address: "Jonesboro, AR" },
  { id: 1531, name: "IBEW Local 1531", city: "Albany", state: "GA", phone: null, website: null, lat: 31.5785, lng: -84.1557, address: "Albany, GA" },
  { id: 1547, name: "IBEW Local 1547", city: "Anchorage", state: "AK", phone: null, website: null, lat: 61.2181, lng: -149.9003, address: "Anchorage, AK" },
  { id: 1579, name: "IBEW Local 1579", city: "Augusta", state: "GA", phone: null, website: null, lat: 33.4735, lng: -82.0105, address: "Augusta, GA" },
  { id: 1701, name: "IBEW Local 1701", city: "Owensboro", state: "KY", phone: null, website: null, lat: 37.7719, lng: -87.1112, address: "Owensboro, KY" },
  { id: 1914, name: "IBEW Local 1914", city: "Cheswick", state: "PA", phone: null, website: null, lat: 40.5412, lng: -79.797, address: "Cheswick, PA" },
  { id: 1925, name: "IBEW Local 1925", city: "Martin", state: "TN", phone: null, website: null, lat: 36.3434, lng: -88.8503, address: "Martin, TN" },
];

// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ──────────────────
// ─── IBEW LINEMAN DATABASE — Outside Utility & Transmission ─────────────────
// Source: User-provided wage data. Completely separate from Inside Wireman locals.
// All Canadian locals excluded. IDs use 90000 + local number to avoid conflicts.
const IBEW_LINEMAN_LOCALS = [
  { id: 90002, name: "IBEW Local 2 (Lineman)", city: "St. Louis", state: "MO", phone: null, website: null, lat: 38.627, lng: -90.1994, address: "St. Louis, MO" },
  { id: 90003, name: "IBEW Local 3 (Lineman)", city: "New York City", state: "NY", phone: null, website: null, lat: 40.7128, lng: -74.0059, address: "Flushing, NY" },
  { id: 90009, name: "IBEW Local 9 (Lineman)", city: "Chicago", state: "IL", phone: null, website: null, lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
  { id: 90012, name: "IBEW Local 12 (Lineman)", city: "Pueblo", state: "CO", phone: null, website: null, lat: 38.2544, lng: -104.6091, address: "Pueblo, CO" },
  { id: 90017, name: "IBEW Local 17 (Lineman)", city: "Southfield", state: "MI", phone: null, website: null, lat: 42.4734, lng: -83.2218, address: "Southfield, MI" },
  { id: 90042, name: "IBEW Local 42 (Lineman)", city: "East Windsor", state: "CT", phone: null, website: null, lat: 41.9165, lng: -72.599, address: "East Windsor, CT" },
  { id: 90044, name: "IBEW Local 44 (Lineman)", city: "Butte", state: "MT", phone: null, website: null, lat: 46.0038, lng: -112.5349, address: "Butte, MT" },
  { id: 90047, name: "IBEW Local 47 (Lineman)", city: "Diamond Bar", state: "CA", phone: null, website: null, lat: 33.9994, lng: -117.8102, address: "Diamond Bar, CA" },
  { id: 90050, name: "IBEW Local 50 (Lineman)", city: "Richmond", state: "VA", phone: null, website: null, lat: 37.5407, lng: -77.436, address: "Richmond, VA" },
  { id: 90051, name: "IBEW Local 51 (Lineman)", city: "Springfield", state: "IL", phone: null, website: null, lat: 39.7817, lng: -89.6501, address: "Springfield, IL" },
  { id: 90053, name: "IBEW Local 53 (Lineman)", city: "Kansas City", state: "MO", phone: null, website: null, lat: 39.0997, lng: -94.5786, address: "Kansas City, MO" },
  { id: 90055, name: "IBEW Local 55 (Lineman)", city: "Des Moines", state: "IA", phone: null, website: null, lat: 41.5868, lng: -93.625, address: "Des Moines, IA" },
  { id: 90057, name: "IBEW Local 57 (Lineman)", city: "Salt Lake City", state: "UT", phone: null, website: null, lat: 40.7608, lng: -111.891, address: "Salt Lake City, UT" },
  { id: 90066, name: "IBEW Local 66 (Lineman)", city: "Houston", state: "TX", phone: null, website: null, lat: 29.7604, lng: -95.3698, address: "Houston, TX" },
  { id: 90070, name: "IBEW Local 70 (Lineman)", city: "Forestville", state: "MD", phone: null, website: null, lat: 38.8513, lng: -76.868, address: "Forestville, MD" },
  { id: 90071, name: "IBEW Local 71 (Lineman)", city: "Columbus", state: "OH", phone: null, website: null, lat: 39.9612, lng: -82.9988, address: "Columbus, OH" },
  { id: 90077, name: "IBEW Local 77 (Lineman)", city: "Seattle", state: "WA", phone: null, website: null, lat: 47.6062, lng: -122.3321, address: "Seattle, WA" },
  { id: 90080, name: "IBEW Local 80 (Lineman)", city: "Norfolk", state: "VA", phone: null, website: null, lat: 36.8508, lng: -76.2859, address: "Norfolk, VA" },
  { id: 90084, name: "IBEW Local 84 (Lineman)", city: "Newnan", state: "GA", phone: null, website: null, lat: 33.3807, lng: -84.7997, address: "Newnan, GA" },
  { id: 90089, name: "IBEW Local 89 (Lineman)", city: "Mount Vernon", state: "WA", phone: null, website: null, lat: 48.4201, lng: -122.3343, address: "Mount Vernon, WA" },
  { id: 90102, name: "IBEW Local 102 (Lineman)", city: "Parsippany", state: "NJ", phone: null, website: null, lat: 40.8573, lng: -74.4265, address: "Parsippany, NJ" },
  { id: 90104, name: "IBEW Local 104 (Lineman)", city: "Mansfield", state: "MA", phone: null, website: null, lat: 42.0251, lng: -71.2187, address: "Mansfield, MA" },
  { id: 90111, name: "IBEW Local 111 (Lineman)", city: "Denver", state: "CO", phone: null, website: null, lat: 39.7392, lng: -104.9903, address: "Denver, CO" },
  { id: 90113, name: "IBEW Local 113 (Lineman)", city: "Colorado Springs", state: "CO", phone: null, website: null, lat: 38.8339, lng: -104.8214, address: "Colorado Springs, CO" },
  { id: 90125, name: "IBEW Local 125 (Lineman)", city: "Portland", state: "OR", phone: null, website: null, lat: 45.5231, lng: -122.6765, address: "Portland, OR" },
  { id: 90126, name: "IBEW Local 126 (Lineman)", city: "Norristown", state: "PA", phone: null, website: null, lat: 40.1215, lng: -75.3399, address: "Montgomery, PA" },
  { id: 90141, name: "IBEW Local 141 (Lineman)", city: "Wheeling", state: "WV", phone: null, website: null, lat: 40.064, lng: -80.7209, address: "Wheeling, WV" },
  { id: 90145, name: "IBEW Local 145 (Lineman)", city: "Moline", state: "IL", phone: null, website: null, lat: 41.5067, lng: -90.5151, address: "Moline, IL" },
  { id: 90160, name: "IBEW Local 160 (Lineman)", city: "Baudette", state: "MN", phone: null, website: null, lat: 48.7136, lng: -94.5975, address: "Baudette, MN" },
  { id: 90164, name: "IBEW Local 164 (Lineman)", city: "Jersey City", state: "NJ", phone: null, website: null, lat: 40.7178, lng: -74.0431, address: "Jersey City, NJ" },
  { id: 90175, name: "IBEW Local 175 (Lineman)", city: "Chattanooga", state: "TN", phone: null, website: null, lat: 35.0456, lng: -85.3097, address: "Chattanooga, TN" },
  { id: 90177, name: "IBEW Local 177 (Lineman)", city: "Jacksonville", state: "FL", phone: null, website: "ibew177.org", lat: 30.3322, lng: -81.6557, address: "Jacksonville, FL" },
  { id: 90193, name: "IBEW Local 193 (Lineman)", city: "Springfield", state: "IL", phone: null, website: null, lat: 39.7817, lng: -89.6501, address: "Springfield, IL" },
  { id: 90194, name: "IBEW Local 194 (Lineman)", city: "Shreveport", state: "LA", phone: null, website: null, lat: 32.5252, lng: -93.7502, address: "Shreveport, LA" },
  { id: 90196, name: "IBEW Local 196 (Lineman)", city: "Batavia", state: "IL", phone: null, website: null, lat: 41.85, lng: -88.3126, address: "Batavia, IL" },
  { id: 90220, name: "IBEW Local 220 (Lineman)", city: "Fort Worth", state: "TX", phone: null, website: null, lat: 32.7548, lng: -97.3308, address: "Fort Worth, TX" },
  { id: 90222, name: "IBEW Local 222 (Lineman)", city: "Orlando", state: "FL", phone: null, website: null, lat: 28.5383, lng: -81.3792, address: "Orlando, FL" },
  { id: 90238, name: "IBEW Local 238 (Lineman)", city: "Asheville", state: "NC", phone: null, website: null, lat: 35.5951, lng: -82.5515, address: "Asheville, NC" },
  { id: 90245, name: "IBEW Local 245 (Lineman)", city: "Toledo", state: "OH", phone: null, website: null, lat: 41.6528, lng: -83.5379, address: "Toledo, OH" },
  { id: 90269, name: "IBEW Local 269 (Lineman)", city: "Trenton", state: "NJ", phone: null, website: null, lat: 40.2171, lng: -74.7429, address: "Trenton, NJ" },
  { id: 90270, name: "IBEW Local 270 (Lineman)", city: "Oak Ridge", state: "TN", phone: null, website: null, lat: 36.0104, lng: -84.2696, address: "Oak Ridge, TN" },
  { id: 90278, name: "IBEW Local 278 (Lineman)", city: "Corpus Christi", state: "TX", phone: null, website: null, lat: 27.8006, lng: -97.3964, address: "Corpus Christi, TX" },
  { id: 90291, name: "IBEW Local 291 (Lineman)", city: "Boise", state: "ID", phone: null, website: null, lat: 43.615, lng: -116.2023, address: "Boise, ID" },
  { id: 90295, name: "IBEW Local 295 (Lineman)", city: "Little Rock", state: "AR", phone: null, website: null, lat: 34.7465, lng: -92.2896, address: "Little Rock, AR" },
  { id: 90301, name: "IBEW Local 301 (Lineman)", city: "Texarkana", state: "TX", phone: null, website: null, lat: 33.4251, lng: -94.0477, address: "Texarkana, TX" },
  { id: 90304, name: "IBEW Local 304 (Lineman)", city: "Topeka", state: "KS", phone: null, website: null, lat: 39.0473, lng: -95.6752, address: "Topeka, KS" },
  { id: 90307, name: "IBEW Local 307 (Lineman)", city: "Cumberland", state: "MD", phone: null, website: null, lat: 39.6529, lng: -78.7625, address: "Cumberland, MD" },
  { id: 90309, name: "IBEW Local 309 (Lineman)", city: "Collinsville", state: "IL", phone: null, website: null, lat: 38.6703, lng: -89.9845, address: "Collinsville, IL" },
  { id: 90317, name: "IBEW Local 317 (Lineman)", city: "Huntington", state: "WV", phone: null, website: null, lat: 38.4193, lng: -82.4452, address: "Huntington, WV" },
  { id: 90322, name: "IBEW Local 322 (Lineman)", city: "Casper", state: "WY", phone: null, website: null, lat: 42.8501, lng: -106.3252, address: "Casper, WY" },
  { id: 90342, name: "IBEW Local 342 (Lineman)", city: "Greensboro", state: "NC", phone: null, website: null, lat: 36.0726, lng: -79.792, address: "Greensboro, NC" },
  { id: 90351, name: "IBEW Local 351 (Lineman)", city: "Folsom", state: "NJ", phone: null, website: null, lat: 39.6059, lng: -74.8574, address: "Folsom, NJ" },
  { id: 90359, name: "IBEW Local 359 (Lineman)", city: "Miami", state: "FL", phone: null, website: null, lat: 25.7617, lng: -80.1918, address: "Miami, FL" },
  { id: 90369, name: "IBEW Local 369 (Lineman)", city: "Louisville", state: "KY", phone: null, website: null, lat: 38.2527, lng: -85.7585, address: "Louisville, KY" },
  { id: 90379, name: "IBEW Local 379 (Lineman)", city: "Charlotte", state: "NC", phone: null, website: null, lat: 35.2271, lng: -80.8431, address: "Charlotte, NC" },
  { id: 90396, name: "IBEW Local 396 (Lineman)", city: "Las Vegas", state: "NV", phone: null, website: null, lat: 36.1699, lng: -115.1398, address: "Las Vegas, NV" },
  { id: 90400, name: "IBEW Local 400 (Lineman)", city: "Asbury Park", state: "NJ", phone: null, website: null, lat: 40.2204, lng: -74.0121, address: "Asbury Park, NJ" },
  { id: 90426, name: "IBEW Local 426 (Lineman)", city: "Sioux Falls", state: "SD", phone: null, website: null, lat: 43.5446, lng: -96.7311, address: "Sioux Falls, SD" },
  { id: 90429, name: "IBEW Local 429 (Lineman)", city: "Nashville", state: "TN", phone: null, website: null, lat: 36.1627, lng: -86.7816, address: "Nashville, TN" },
  { id: 90436, name: "IBEW Local 436 (Lineman)", city: "El Dorado", state: "AR", phone: null, website: null, lat: 33.2009, lng: -92.666, address: "El Dorado, AR" },
  { id: 90443, name: "IBEW Local 443 (Lineman)", city: "Montgomery", state: "AL", phone: null, website: null, lat: 32.3668, lng: -86.2999, address: "Montgomery, AL" },
  { id: 90449, name: "IBEW Local 449 (Lineman)", city: "Pocatello", state: "ID", phone: null, website: null, lat: 42.8713, lng: -112.4455, address: "Pocatello, ID" },
  { id: 90455, name: "IBEW Local 455 (Lineman)", city: "Springfield", state: "MA", phone: null, website: null, lat: 42.1015, lng: -72.5898, address: "Springfield, MA" },
  { id: 90456, name: "IBEW Local 456 (Lineman)", city: "North Brunswick", state: "NJ", phone: null, website: null, lat: 40.4893, lng: -74.4774, address: "North Brunswick, NJ" },
  { id: 90474, name: "IBEW Local 474 (Lineman)", city: "Memphis", state: "TN", phone: null, website: null, lat: 35.1495, lng: -90.049, address: "Memphis, TN" },
  { id: 90483, name: "IBEW Local 483 (Lineman)", city: "Tacoma", state: "WA", phone: null, website: null, lat: 47.2529, lng: -122.4443, address: "Tacoma, WA" },
  { id: 90495, name: "IBEW Local 495 (Lineman)", city: "Wilmington", state: "NC", phone: null, website: null, lat: 34.2257, lng: -77.9447, address: "Wilmington, NC" },
  { id: 90532, name: "IBEW Local 532 (Lineman)", city: "Billings", state: "MT", phone: null, website: null, lat: 45.7833, lng: -108.5007, address: "Billings, MT" },
  { id: 90553, name: "IBEW Local 553 (Lineman)", city: "Durham", state: "NC", phone: null, website: null, lat: 35.994, lng: -78.8986, address: "Durham, NC" },
  { id: 90558, name: "IBEW Local 558 (Lineman)", city: "Sheffield", state: "AL", phone: null, website: null, lat: 34.7651, lng: -87.6975, address: "Sheffield, AL" },
  { id: 90583, name: "IBEW Local 583 (Lineman)", city: "El Paso", state: "TX", phone: null, website: null, lat: 31.7619, lng: -106.485, address: "El Paso, TX" },
  { id: 90596, name: "IBEW Local 596 (Lineman)", city: "Clarksburg", state: "WV", phone: null, website: null, lat: 39.2806, lng: -80.3445, address: "Clarksburg, WV" },
  { id: 90602, name: "IBEW Local 602 (Lineman)", city: "Amarillo", state: "TX", phone: null, website: null, lat: 35.222, lng: -101.8313, address: "Amarillo, TX" },
  { id: 90611, name: "IBEW Local 611 (Lineman)", city: "Albuquerque", state: "NM", phone: null, website: null, lat: 35.0844, lng: -106.6504, address: "Albuquerque, NM" },
  { id: 90613, name: "IBEW Local 613 (Lineman)", city: "Atlanta", state: "GA", phone: null, website: null, lat: 33.749, lng: -84.388, address: "Atlanta, GA" },
  { id: 90649, name: "IBEW Local 649 (Lineman)", city: "Alton", state: "IL", phone: null, website: null, lat: 38.8906, lng: -90.1843, address: "Alton, IL" },
  { id: 90659, name: "IBEW Local 659 (Lineman)", city: "Medford", state: "OR", phone: null, website: null, lat: 42.3265, lng: -122.8756, address: "Medford, OR" },
  { id: 90666, name: "IBEW Local 666 (Lineman)", city: "Sandston", state: "VA", phone: null, website: null, lat: 37.5143, lng: -77.3174, address: "Sandston, VA" },
  { id: 90676, name: "IBEW Local 676 (Lineman)", city: "Pensacola", state: "FL", phone: "(850) 477-8768", website: "ibewlocal676.com", lat: 30.4213, lng: -87.2169, address: "Pensacola, FL" },
  { id: 90681, name: "IBEW Local 681 (Lineman)", city: "Wichita Falls", state: "TX", phone: null, website: null, lat: 33.9137, lng: -98.4934, address: "Wichita Falls, TX" },
  { id: 90688, name: "IBEW Local 688 (Lineman)", city: "Mansfield", state: "OH", phone: null, website: null, lat: 40.7584, lng: -82.5154, address: "Mansfield, OH" },
  { id: 90700, name: "IBEW Local 700 (Lineman)", city: "Fort Smith", state: "AR", phone: null, website: null, lat: 35.3859, lng: -94.3985, address: "Fort Smith, AR" },
  { id: 90702, name: "IBEW Local 702 (Lineman)", city: "West Frankfort", state: "IL", phone: null, website: null, lat: 37.8984, lng: -88.9267, address: "West Frankfort, IL" },
  { id: 90714, name: "IBEW Local 714 (Lineman)", city: "Minot", state: "ND", phone: null, website: null, lat: 48.2325, lng: -101.2963, address: "Minot, ND" },
  { id: 90738, name: "IBEW Local 738 (Lineman)", city: "Longview", state: "TX", phone: null, website: null, lat: 32.5007, lng: -94.7405, address: "Longview, TX" },
  { id: 90760, name: "IBEW Local 760 (Lineman)", city: "Knoxville", state: "TN", phone: null, website: null, lat: 35.9606, lng: -83.9207, address: "Knoxville, TN" },
  { id: 90768, name: "IBEW Local 768 (Lineman)", city: "Kalispell", state: "MT", phone: null, website: null, lat: 48.192, lng: -114.3168, address: "Kalispell, MT" },
  { id: 90769, name: "IBEW Local 769 (Lineman)", city: "Phoenix", state: "AZ", phone: null, website: null, lat: 33.4484, lng: -112.074, address: "Phoenix, AZ" },
  { id: 90776, name: "IBEW Local 776 (Lineman)", city: "North Charleston", state: "SC", phone: "(843) 554-1080", website: "ibewlocal776.org", lat: 32.8546, lng: -79.9748, address: "3345 Seiberling Rd, North Charleston, SC 29418" },
  { id: 90816, name: "IBEW Local 816 (Lineman)", city: "Paducah", state: "KY", phone: null, website: null, lat: 37.0834, lng: -88.6001, address: "Paducah, KY" },
  { id: 90852, name: "IBEW Local 852 (Lineman)", city: "Corinth", state: "MS", phone: null, website: null, lat: 34.9345, lng: -88.5223, address: "Corinth, MS" },
  { id: 90876, name: "IBEW Local 876 (Lineman)", city: "Mount Pleasant", state: "MI", phone: null, website: null, lat: 43.5978, lng: -84.7675, address: "Mount Pleasant, MI" },
  { id: 90903, name: "IBEW Local 903 (Lineman)", city: "Gulfport", state: "MS", phone: null, website: null, lat: 30.3674, lng: -89.0928, address: "Gulfport, MS" },
  { id: 90934, name: "IBEW Local 934 (Lineman)", city: "Blountville", state: "TN", phone: null, website: null, lat: 36.53, lng: -82.3307, address: "Blountville, TN" },
  { id: 90953, name: "IBEW Local 953 (Lineman)", city: "Eau Claire", state: "WI", phone: null, website: null, lat: 44.8113, lng: -91.4985, address: "Eau Claire, WI" },
  { id: 90968, name: "IBEW Local 968 (Lineman)", city: "Parkersburg", state: "WV", phone: null, website: null, lat: 39.2667, lng: -81.5615, address: "Parkersburg, WV" },
  { id: 90995, name: "IBEW Local 995 (Lineman)", city: "Baton Rouge", state: "LA", phone: null, website: null, lat: 30.4515, lng: -91.1871, address: "Baton Rouge, LA" },
  { id: 91002, name: "IBEW Local 1002 (Lineman)", city: "Tulsa", state: "OK", phone: null, website: null, lat: 36.1539, lng: -95.9928, address: "Tulsa, OK" },
  { id: 91049, name: "IBEW Local 1049 (Lineman)", city: "Hauppauge", state: "NY", phone: null, website: null, lat: 40.8232, lng: -73.2068, address: "Long Island, NY" },
  { id: 91186, name: "IBEW Local 1186 (Lineman)", city: "Honolulu", state: "HI", phone: null, website: null, lat: 21.3069, lng: -157.8583, address: "Honolulu, HI" },
  { id: 91245, name: "IBEW Local 1245 (Lineman)", city: "Vacaville", state: "CA", phone: null, website: null, lat: 38.3566, lng: -121.9877, address: "Vacaville, CA" },
  { id: 91249, name: "IBEW Local 1249 (Lineman)", city: "Cicero", state: "NY", phone: null, website: null, lat: 43.1748, lng: -76.0671, address: "Cicero, NY" },
  { id: 91250, name: "IBEW Local 1250 (Lineman)", city: "Rapid City", state: "SD", phone: null, website: null, lat: 44.0805, lng: -103.231, address: "Rapid City, SD" },
  { id: 91316, name: "IBEW Local 1316 (Lineman)", city: "Macon", state: "GA", phone: null, website: null, lat: 32.8407, lng: -83.6324, address: "Macon, GA" },
  { id: 91319, name: "IBEW Local 1319 (Lineman)", city: "Bloomsburg", state: "PA", phone: null, website: null, lat: 41.0048, lng: -76.4549, address: "Bloomsburg, PA" },
  { id: 91340, name: "IBEW Local 1340 (Lineman)", city: "Newport News", state: "VA", phone: null, website: null, lat: 36.9787, lng: -76.43, address: "Newport News, VA" },
  { id: 91393, name: "IBEW Local 1393 (Lineman)", city: "Indianapolis", state: "IN", phone: null, website: null, lat: 39.7684, lng: -86.1581, address: "Indianapolis, IN" },
  { id: 91426, name: "IBEW Local 1426 (Lineman)", city: "Grand Forks", state: "ND", phone: null, website: null, lat: 47.9253, lng: -97.0329, address: "Grand Forks, ND" },
  { id: 91516, name: "IBEW Local 1516 (Lineman)", city: "Jonesboro", state: "AR", phone: null, website: null, lat: 35.8423, lng: -90.7043, address: "Jonesboro, AR" },
  { id: 91525, name: "IBEW Local 1525 (Lineman)", city: "Omaha", state: "NE", phone: null, website: null, lat: 41.2565, lng: -95.9345, address: "Omaha, NE" },
  { id: 91531, name: "IBEW Local 1531 (Lineman)", city: "Albany", state: "GA", phone: null, website: null, lat: 31.5785, lng: -84.1557, address: "Albany, GA" },
  { id: 91547, name: "IBEW Local 1547 (Lineman)", city: "Anchorage", state: "AK", phone: null, website: null, lat: 61.2181, lng: -149.9003, address: "Anchorage, AK" },
  { id: 91579, name: "IBEW Local 1579 (Lineman)", city: "Augusta", state: "GA", phone: null, website: null, lat: 33.4735, lng: -82.0105, address: "Augusta, GA" },
  { id: 91701, name: "IBEW Local 1701 (Lineman)", city: "Owensboro", state: "KY", phone: null, website: null, lat: 37.7719, lng: -87.1112, address: "Owensboro, KY" },
  { id: 91925, name: "IBEW Local 1925 (Lineman)", city: "Martin", state: "TN", phone: null, website: null, lat: 36.3434, lng: -88.8503, address: "Martin, TN" },
  { id: 92150, name: "IBEW Local 2150 (Lineman)", city: "Menomonee Falls", state: "WI", phone: null, website: null, lat: 43.1781, lng: -88.1076, address: "Menomonee Falls, WI" },
  { id: 92286, name: "IBEW Local 2286 (Lineman)", city: "Port Arthur", state: "TX", phone: null, website: null, lat: 29.8849, lng: -93.9399, address: "Port Arthur, TX" },
];


// ─── HFIAW LOCALS DATABASE — Heat & Frost Insulators & Allied Workers ─────────
const HFIAW_LOCALS = [
  { id: 1,  name: "HFIAW Local 1",  city: "St. Louis",     state: "MO", phone: "(314) 291-7399",  website: "insulators1.org",       lat: 38.6270, lng: -90.1994, address: "St. Louis, MO" },
  { id: 2,  name: "HFIAW Local 2",  city: "New York",      state: "NY", phone: null,               website: null,                    lat: 40.7128, lng: -74.0059, address: "New York, NY" },
  { id: 3,  name: "HFIAW Local 3",  city: "Cleveland",     state: "OH", phone: null,               website: null,                    lat: 41.4993, lng: -81.6944, address: "Cleveland, OH" },
  { id: 4,  name: "HFIAW Local 4",  city: "Buffalo",       state: "NY", phone: null,               website: null,                    lat: 42.8864, lng: -78.8784, address: "Buffalo, NY" },
  { id: 5,  name: "HFIAW Local 5",  city: "Los Angeles",   state: "CA", phone: null,               website: null,                    lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  { id: 6,  name: "HFIAW Local 6",  city: "Boston",        state: "MA", phone: null,               website: null,                    lat: 42.3601, lng: -71.0589, address: "Boston, MA" },
  { id: 7,  name: "HFIAW Local 7",  city: "Albany",        state: "NY", phone: null,               website: null,                    lat: 42.6526, lng: -73.7562, address: "Albany, NY" },
  { id: 8,  name: "HFIAW Local 8",  city: "Cincinnati",    state: "OH", phone: null,               website: null,                    lat: 39.1031, lng: -84.5120, address: "Cincinnati, OH" },
  { id: 9,  name: "HFIAW Local 9",  city: "Detroit",       state: "MI", phone: null,               website: null,                    lat: 42.3314, lng: -83.0458, address: "Detroit, MI" },
  { id: 10, name: "HFIAW Local 10", city: "Washington",    state: "DC", phone: null,               website: null,                    lat: 38.9072, lng: -77.0369, address: "Washington, DC" },
  { id: 11, name: "HFIAW Local 11", city: "Phoenix",       state: "AZ", phone: null,               website: null,                    lat: 33.4484, lng: -112.0740, address: "Phoenix, AZ" },
  { id: 12, name: "HFIAW Local 12", city: "Newark",        state: "NJ", phone: null,               website: null,                    lat: 40.7357, lng: -74.1724, address: "Newark, NJ" },
  { id: 13, name: "HFIAW Local 13", city: "Pittsburgh",    state: "PA", phone: null,               website: null,                    lat: 40.4406, lng: -79.9959, address: "Pittsburgh, PA" },
  { id: 14, name: "HFIAW Local 14", city: "Rochester",     state: "NY", phone: null,               website: null,                    lat: 43.1566, lng: -77.6088, address: "Rochester, NY" },
  { id: 15, name: "HFIAW Local 15", city: "Baltimore",     state: "MD", phone: null,               website: null,                    lat: 39.2904, lng: -76.6122, address: "Baltimore, MD" },
  { id: 16, name: "HFIAW Local 16", city: "Portland",      state: "ME", phone: null,               website: null,                    lat: 43.6591, lng: -70.2568, address: "Portland, ME" },
  { id: 17, name: "HFIAW Local 17", city: "Chicago",       state: "IL", phone: "(708) 468-8000",   website: "local17insulators.com", lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
  { id: 18, name: "HFIAW Local 18", city: "Indianapolis",  state: "IN", phone: "(317) 786-3216",   website: "insulators18.org",      lat: 39.7684, lng: -86.1581, address: "Indianapolis, IN" },
  { id: 19, name: "HFIAW Local 19", city: "Milwaukee",     state: "WI", phone: "(262) 548-9606",   website: "insulators19.com",      lat: 43.0389, lng: -87.9065, address: "Milwaukee, WI" },
  { id: 21, name: "HFIAW Local 21", city: "Houston",       state: "TX", phone: null,               website: null,                    lat: 29.7604, lng: -95.3698, address: "Houston, TX" },
  { id: 22, name: "HFIAW Local 22", city: "Dallas",        state: "TX", phone: null,               website: null,                    lat: 32.7767, lng: -96.7970, address: "Dallas, TX" },
  { id: 23, name: "HFIAW Local 23", city: "Syracuse",      state: "NY", phone: null,               website: null,                    lat: 43.0481, lng: -76.1474, address: "Syracuse, NY" },
  { id: 24, name: "HFIAW Local 24", city: "Memphis",       state: "TN", phone: null,               website: null,                    lat: 35.1495, lng: -90.0490, address: "Memphis, TN" },
  { id: 25, name: "HFIAW Local 25", city: "Kansas City",   state: "MO", phone: null,               website: null,                    lat: 39.0997, lng: -94.5786, address: "Kansas City, MO" },
  { id: 26, name: "HFIAW Local 26", city: "New Orleans",   state: "LA", phone: null,               website: null,                    lat: 29.9511, lng: -90.0715, address: "New Orleans, LA" },
  { id: 27, name: "HFIAW Local 27", city: "Denver",        state: "CO", phone: "(816) 252-0588",   website: "insulators27.com",      lat: 39.7392, lng: -104.9903, address: "Denver, CO" },
  { id: 28, name: "HFIAW Local 28", city: "Atlanta",       state: "GA", phone: null,               website: null,                    lat: 33.7490, lng: -84.3880, address: "Atlanta, GA" },
  { id: 29, name: "HFIAW Local 29", city: "San Francisco", state: "CA", phone: null,               website: null,                    lat: 37.7749, lng: -122.4194, address: "San Francisco, CA" },
  { id: 30, name: "HFIAW Local 30", city: "Scranton",      state: "PA", phone: null,               website: null,                    lat: 41.4090, lng: -75.6624, address: "Scranton, PA" },
  { id: 31, name: "HFIAW Local 31", city: "Minneapolis",   state: "MN", phone: null,               website: null,                    lat: 44.9778, lng: -93.2650, address: "Minneapolis, MN" },
  { id: 34, name: "HFIAW Local 34", city: "Chicago",       state: "IL", phone: null,               website: null,                    lat: 41.8827, lng: -87.6233, address: "Chicago, IL" },
  { id: 35, name: "HFIAW Local 35", city: "Tampa",         state: "FL", phone: null,               website: null,                    lat: 27.9506, lng: -82.4572, address: "Tampa, FL" },
  { id: 36, name: "HFIAW Local 36", city: "Las Vegas",     state: "NV", phone: null,               website: null,                    lat: 36.1699, lng: -115.1398, address: "Las Vegas, NV" },
  { id: 37, name: "HFIAW Local 37", city: "Oklahoma City", state: "OK", phone: "(812) 477-2341",   website: "insulators37.org",      lat: 35.4676, lng: -97.5164, address: "Oklahoma City, OK" },
  { id: 39, name: "HFIAW Local 39", city: "Omaha",         state: "NE", phone: "(402) 333-6960",   website: null,                    lat: 41.2565, lng: -95.9345, address: "Omaha, NE" },
  { id: 40, name: "HFIAW Local 40", city: "Portland",      state: "OR", phone: null,               website: null,                    lat: 45.5231, lng: -122.6765, address: "Portland, OR" },
  { id: 41, name: "HFIAW Local 41", city: "Fort Wayne",    state: "IN", phone: null,               website: null,                    lat: 41.0793, lng: -85.1394, address: "Fort Wayne, IN" },
  { id: 42, name: "HFIAW Local 42", city: "Seattle",       state: "WA", phone: null,               website: null,                    lat: 47.6062, lng: -122.3321, address: "Seattle, WA" },
  { id: 45, name: "HFIAW Local 45", city: "Toledo",        state: "OH", phone: null,               website: null,                    lat: 41.6528, lng: -83.5379, address: "Toledo, OH" },
  { id: 46, name: "HFIAW Local 46", city: "Oakland",       state: "CA", phone: null,               website: null,                    lat: 37.8044, lng: -122.2712, address: "Oakland, CA" },
  { id: 48, name: "HFIAW Local 48", city: "Salt Lake City",state: "UT", phone: null,               website: null,                    lat: 40.7608, lng: -111.8910, address: "Salt Lake City, UT" },
  { id: 50, name: "HFIAW Local 50", city: "Columbus",      state: "OH", phone: null,               website: null,                    lat: 39.9612, lng: -82.9988, address: "Columbus, OH" },
  { id: 52, name: "HFIAW Local 52", city: "Minneapolis",   state: "MN", phone: null,               website: null,                    lat: 44.9638, lng: -93.2422, address: "Minneapolis, MN" },
  { id: 53, name: "HFIAW Local 53", city: "Birmingham",    state: "AL", phone: null,               website: null,                    lat: 33.5186, lng: -86.8104, address: "Birmingham, AL" },
  { id: 55, name: "HFIAW Local 55", city: "Des Moines",    state: "IA", phone: null,               website: null,                    lat: 41.5868, lng: -93.6250, address: "Des Moines, IA" },
  { id: 65, name: "HFIAW Local 65", city: "Nashville",     state: "TN", phone: null,               website: null,                    lat: 36.1627, lng: -86.7816, address: "Nashville, TN" },
  { id: 73, name: "HFIAW Local 73", city: "Albuquerque",   state: "NM", phone: null,               website: null,                    lat: 35.0844, lng: -106.6504, address: "Albuquerque, NM" },
  { id: 74, name: "HFIAW Local 74", city: "Charlotte",     state: "NC", phone: "(515) 288-0472",   website: "insulators74.org",      lat: 35.2271, lng: -80.8431, address: "Charlotte, NC" },
  { id: 84, name: "HFIAW Local 84", city: "Akron",         state: "OH", phone: null,               website: null,                    lat: 41.0998, lng: -81.5190, address: "Akron, OH" },
];

// ─── UA LOCALS DATABASE — Plumbers & Pipefitters (source: unionpayscales.com) ─
const UA_LOCALS = [
  // All data verified from ua.org official directory

  // ── ALABAMA ──
  { id: 52,  name: "UA Local 52",  city: "Montgomery",       state: "AL", phone: "(334) 272-9500", website: "ualocal52.org",    lat: 32.3182, lng: -86.1549, address: "5563 Wares Ferry Rd, Montgomery, AL 36117" },
  { id: 91,  name: "UA Local 91",  city: "Birmingham",       state: "AL", phone: "(205) 591-2721", website: "ualocal91.com",    lat: 33.5186, lng: -86.8104, address: "3648 9th Ave N, Birmingham, AL 35222" },
  { id: 119, name: "UA Local 119", city: "Mobile",           state: "AL", phone: "(251) 476-0625", website: "ualocal119.com",   lat: 30.6954, lng: -88.0399, address: "2458 Old Shell Rd, Mobile, AL 36607" },
  { id: 372, name: "UA Local 372", city: "Tuscaloosa",       state: "AL", phone: "(205) 758-6236", website: "ualocal372.org",   lat: 33.2098, lng: -87.5692, address: "9410 Hwy 82 E, Duncanville, AL 35456" },
  { id: 548, name: "UA Local 548", city: "Montgomery",       state: "AL", phone: "(334) 309-4563", website: "ualocal548.org",   lat: 32.4637, lng: -86.3697, address: "1719 Country Rd 85, Prattville, AL 36067" },
  { id: 760, name: "UA Local 760", city: "Muscle Shoals",    state: "AL", phone: "(256) 383-7900", website: "ualocal760.org",   lat: 34.7448, lng: -87.6675, address: "2807 Avalon Ave, Muscle Shoals, AL 35661" },

  // ── ALASKA ──
  { id: 262, name: "UA Local 262", city: "Juneau",           state: "AK", phone: "(907) 586-2874", website: "ualocal262.org",   lat: 58.3005, lng: -134.4197, address: "1751 Anka St, Juneau, AK 99801" },
  { id: 367, name: "UA Local 367", city: "Anchorage",        state: "AK", phone: "(907) 562-2810", website: "ualocal367.org",   lat: 61.1753, lng: -149.8885, address: "610 W 54th Ave, Anchorage, AK 99518" },
  { id: 375, name: "UA Local 375", city: "Fairbanks",        state: "AK", phone: "(907) 479-6221", website: "ualocal375.org",   lat: 64.8378, lng: -147.7164, address: "3980 Boat St, Fairbanks, AK 99709" },

  // ── ARIZONA ──
  { id: 469, name: "UA Local 469", city: "Phoenix",          state: "AZ", phone: "(602) 956-9350", website: "ualocal469.org",   lat: 33.4893, lng: -112.0268, address: "3109 N 24th St, Phoenix, AZ 85016" },

  // ── ARKANSAS ──
  { id: 155, name: "UA Local 155", city: "Little Rock",      state: "AR", phone: "(501) 374-4943", website: "ualocal155.org",   lat: 34.7465, lng: -92.2896, address: "1223 W Markham, Little Rock, AR 72201" },

  // ── CALIFORNIA ──
  { id: 38,  name: "UA Local 38",  city: "San Francisco",    state: "CA", phone: "(415) 626-2000", website: "ualocal38.org",    lat: 37.7749, lng: -122.4194, address: "1621 Market St, San Francisco, CA 94103" },
  { id: 62,  name: "UA Local 62",  city: "Castroville",      state: "CA", phone: "(831) 633-6091", website: "ualocal62.org",    lat: 36.7627, lng: -121.7608, address: "11445 Commercial Pkwy, Castroville, CA 95012" },
  { id: 78,  name: "UA Local 78",  city: "Los Angeles",      state: "CA", phone: "(213) 688-9090", website: "ualocal78.org",    lat: 34.0522, lng: -118.2437, address: "1111 W James M Wood Blvd, Los Angeles, CA 90015" },
  { id: 114, name: "UA Local 114", city: "Buellton",         state: "CA", phone: "(805) 688-1470", website: "ualocal114.org",   lat: 34.6136, lng: -120.1938, address: "93 Thomas Rd, Buellton, CA 93427" },
  { id: 159, name: "UA Local 159", city: "Martinez",         state: "CA", phone: "(925) 229-0400", website: "ualocal159.org",   lat: 37.9935, lng: -122.1341, address: "1308 Roman Way, Martinez, CA 94553" },
  { id: 228, name: "UA Local 228", city: "Marysville",       state: "CA", phone: "(530) 673-8690", website: "ualocal228.org",   lat: 39.1457, lng: -121.5913, address: "1015 Yuba St, Marysville, CA 95901" },
  { id: 230, name: "UA Local 230", city: "San Diego",        state: "CA", phone: "(858) 554-0586", website: "ualocal230.org",   lat: 32.8770, lng: -117.2127, address: "6313 Nancy Ridge Dr, San Diego, CA 92121" },
  { id: 246, name: "UA Local 246", city: "Fresno",           state: "CA", phone: "(559) 252-7246", website: "ualocal246.org",   lat: 36.7828, lng: -119.7673, address: "1303 N Rabe Ave, Fresno, CA 93727" },
  { id: 250, name: "UA Local 250", city: "Gardena",          state: "CA", phone: "(310) 660-0035", website: "ualocal250.com",   lat: 33.8883, lng: -118.3090, address: "18355 S Figueroa St, Gardena, CA 90248" },
  { id: 342, name: "UA Local 342", city: "Concord",          state: "CA", phone: "(925) 686-5880", website: "ualocal342.org",   lat: 37.9780, lng: -122.0311, address: "935 Detroit Ave, Concord, CA 94518" },
  { id: 343, name: "UA Local 343", city: "Vacaville",        state: "CA", phone: "(707) 644-4071", website: "ualocal343.org",   lat: 38.3566, lng: -121.9877, address: "220 Peabody Rd, Vacaville, CA 95687" },
  { id: 345, name: "UA Local 345", city: "Duarte",           state: "CA", phone: "(626) 357-9345", website: "ualocal345.org",   lat: 34.1395, lng: -117.9773, address: "1430 Huntington Dr, Duarte, CA 91010" },
  { id: 364, name: "UA Local 364", city: "Colton",           state: "CA", phone: "(909) 825-0359", website: "ualocal364.org",   lat: 34.0739, lng: -117.3131, address: "223 S Rancho Ave, Colton, CA 92324" },
  { id: 393, name: "UA Local 393", city: "San Jose",         state: "CA", phone: "(408) 225-3030", website: "ualocal393.org",   lat: 37.2319, lng: -121.7958, address: "6299 San Ignacio Ave, San Jose, CA 95119" },
  { id: 398, name: "UA Local 398", city: "Rancho Cucamonga", state: "CA", phone: "(909) 945-5557", website: "ualocal398.org",   lat: 34.1064, lng: -117.5931, address: "8590 Utica Ave, Rancho Cucamonga, CA 91730" },
  { id: 403, name: "UA Local 403", city: "San Luis Obispo",  state: "CA", phone: "(805) 543-2416", website: "ualocal403.org",   lat: 35.2828, lng: -120.6596, address: "3710 Broad St, San Luis Obispo, CA 93401" },
  { id: 442, name: "UA Local 442", city: "Modesto",          state: "CA", phone: "(209) 338-0751", website: "ualocal442.org",   lat: 37.6390, lng: -120.9969, address: "4842 Nutcracker Ln, Modesto, CA 95356" },
  { id: 447, name: "UA Local 447", city: "Sacramento",       state: "CA", phone: "(916) 457-6595", website: "ualocal447.org",   lat: 38.5580, lng: -121.4669, address: "5841 Newman Ct, Sacramento, CA 95819" },
  { id: 460, name: "UA Local 460", city: "Bakersfield",      state: "CA", phone: "(661) 589-4600", website: "ualocal460.org",   lat: 35.3856, lng: -119.0186, address: "6718 Meany Ave, Bakersfield, CA 93308" },
  { id: 467, name: "UA Local 467", city: "Burlingame",       state: "CA", phone: "(650) 692-4730", website: "ualocal467.org",   lat: 37.5841, lng: -122.3661, address: "1519 Rollins Rd, Burlingame, CA 94010" },
  { id: 483, name: "UA Local 483", city: "Hayward",          state: "CA", phone: "(510) 785-8483", website: "ualocal483.org",   lat: 37.6349, lng: -122.0927, address: "2525 Barrington Ct, Hayward, CA 94545" },
  { id: 484, name: "UA Local 484", city: "Ventura",          state: "CA", phone: "(805) 643-6345", website: "ualocal484.org",   lat: 34.2805, lng: -119.2945, address: "1955 N Ventura Ave, Ventura, CA 93001" },
  { id: 582, name: "UA Local 582", city: "Orange",           state: "CA", phone: "(714) 978-0582", website: "ualocal582.org",   lat: 33.7879, lng: -117.8531, address: "1916 W Chapman Ave, Orange, CA 92868" },
  { id: 709, name: "UA Local 709", city: "Whittier",         state: "CA", phone: "(562) 698-9909", website: "ualocal709.org",   lat: 33.9792, lng: -118.0326, address: "12140 Rivera Rd, Whittier, CA 90606" },
  { id: 761, name: "UA Local 761", city: "Burbank",          state: "CA", phone: "(818) 843-8670", website: "ualocal761.org",   lat: 34.2003, lng: -118.3090, address: "1305 N Niagara St, Burbank, CA 91505" },

  // ── COLORADO ──
  { id: 3,   name: "UA Local 3",   city: "Aurora",           state: "CO", phone: "(303) 739-9300", website: "ualocal3.org",     lat: 39.7294, lng: -104.8319, address: "17100 E 32nd Pl, Aurora, CO 80011" },
  { id: 58,  name: "UA Local 58",  city: "Colorado Springs", state: "CO", phone: "(719) 633-4052", website: "ualocal58.org",    lat: 38.7747, lng: -104.8656, address: "2870 Janitell Rd, Colorado Springs, CO 80906" },
  { id: 145, name: "UA Local 145", city: "Grand Junction",   state: "CO", phone: "(970) 245-2012", website: "ualocal145.org",   lat: 39.0639, lng: -108.5506, address: "3168 Pipe Ct, Grand Junction, CO 81504" },
  { id: 208, name: "UA Local 208", city: "Denver",           state: "CO", phone: "(303) 428-4380", website: "ualocal208.org",   lat: 39.7853, lng: -104.9783, address: "6350 N Broadway, Denver, CO 80216" },

  // ── CONNECTICUT ──
  { id: 777, name: "UA Local 777", city: "Meriden",          state: "CT", phone: "(203) 317-4750", website: "ualocal777.org",   lat: 41.5382, lng: -72.8070, address: "1250 E Main St, Meriden, CT 06450" },

  // ── DELAWARE ──
  { id: 74,  name: "UA Local 74",  city: "Newark",           state: "DE", phone: "(302) 636-7400", website: "ualocal74.com",    lat: 39.6837, lng: -75.7497, address: "201 Executive Dr, Newark, DE 19702" },

  // ── DISTRICT OF COLUMBIA ──
  { id: 5,   name: "UA Local 5",   city: "Lanham",           state: "MD", phone: "(301) 899-7861", website: "ualocal5.org",     lat: 38.9642, lng: -76.8547, address: "4755 Walden Ln, Lanham, MD 20746" },
  { id: 602, name: "UA Local 602", city: "Capitol Heights",  state: "MD", phone: "(301) 333-2356", website: "ualocal602.org",   lat: 38.8840, lng: -76.9072, address: "8700 Ashwood Dr, Capitol Heights, MD 20743" },

  // ── FLORIDA ──
  { id: 123, name: "UA Local 123", city: "Dover",            state: "FL", phone: "(813) 636-0123", website: "ualocal123.org",   lat: 27.9931, lng: -82.2182, address: "3601 N McIntosh Rd, Dover, FL 33527" },
  { id: 234, name: "UA Local 234", city: "Jacksonville",     state: "FL", phone: "(904) 786-0941", website: "ualocal234.org",   lat: 30.3380, lng: -81.7277, address: "5411 Cassidy Rd, Jacksonville, FL 32254" },
  { id: 295, name: "UA Local 295", city: "Daytona Beach",    state: "FL", phone: "(386) 253-9972", website: "ualocal295.org",   lat: 29.2108, lng: -81.0228, address: "743 N Beach St, Daytona Beach, FL 32114" },
  { id: 519, name: "UA Local 519", city: "Hialeah",          state: "FL", phone: "(305) 362-0519", website: "ualocal519.org",   lat: 25.8576, lng: -80.2781, address: "5931 NW 173rd Dr, Hialeah, FL 33015" },
  { id: 630, name: "UA Local 630", city: "West Palm Beach",  state: "FL", phone: "(561) 689-8400", website: "ualocal630.org",   lat: 26.7153, lng: -80.0534, address: "1900 N Florida Mango Rd, West Palm Beach, FL 33409" },
  { id: 719, name: "UA Local 719", city: "Fort Lauderdale",  state: "FL", phone: "(954) 522-2532", website: "ualocal719.org",   lat: 26.1224, lng: -80.1373, address: "2502 S Andrews Ave, Fort Lauderdale, FL 33316" },
  { id: 725, name: "UA Local 725", city: "Opa Locka",        state: "FL", phone: "(305) 681-8596", website: "ualocal725.org",   lat: 25.9026, lng: -80.2497, address: "13185 NW 45th Ave, Opa Locka, FL 33054" },
  { id: 803, name: "UA Local 803", city: "Orlando",          state: "FL", phone: "(407) 851-9240", website: "ualocal803.org",   lat: 28.4158, lng: -81.3757, address: "2447 Orlando Central Pkwy, Orlando, FL 32809" },
  { id: 821, name: "UA Local 821", city: "West Palm Beach",  state: "FL", phone: "(561) 422-9821", website: "ualocal821.org",   lat: 26.6686, lng: -80.1455, address: "1975 Sansbury Way, West Palm Beach, FL 33411" },

  // ── GEORGIA ──
  { id: 72,  name: "UA Local 72",  city: "Atlanta",          state: "GA", phone: "(404) 373-5778", website: "ualocal72.org",    lat: 33.7490, lng: -84.3448, address: "374 Maynard Ter SE, Atlanta, GA 30316" },
  { id: 150, name: "UA Local 150", city: "Augusta",          state: "GA", phone: "(706) 724-8846", website: "ualocal150.org",   lat: 33.4735, lng: -82.0105, address: "1211 Telfair St, Augusta, GA 30901" },
  { id: 177, name: "UA Local 177", city: "Brunswick",        state: "GA", phone: "(912) 265-1890", website: "ualocal177.org",   lat: 31.1499, lng: -81.4915, address: "6148 New Jessup Hwy, Brunswick, GA 31523" },
  { id: 188, name: "UA Local 188", city: "Savannah",         state: "GA", phone: "(912) 354-5520", website: "ualocal188.org",   lat: 32.0254, lng: -81.0998, address: "2337 E Victory Dr, Savannah, GA 31404" },
  { id: 473, name: "UA Local 473", city: "Jesup",            state: "GA", phone: "(912) 321-2919", website: "ualocal473.org",   lat: 31.6071, lng: -81.8851, address: "113 Oliver Ln, Jesup, GA 31545" },

  // ── HAWAII ──
  { id: 675, name: "UA Local 675", city: "Honolulu",         state: "HI", phone: "(808) 536-5454", website: "ualocal675.org",   lat: 21.3069, lng: -157.8583, address: "1109 Bethel St, Honolulu, HI 96813" },
  { id: 811, name: "UA Local 811", city: "Waianae",          state: "HI", phone: "(808) 630-8000", website: "ualocal811.org",   lat: 21.4468, lng: -158.1847, address: "85-1060 Waianae Valley Rd, Waianae, HI 96792" },

  // ── IDAHO ──
  { id: 296, name: "UA Local 296", city: "Meridian",         state: "ID", phone: "(208) 288-1296", website: "ualocal296.org",   lat: 43.6121, lng: -116.3915, address: "575 N Ralstin, Meridian, ID 83642" },
  { id: 648, name: "UA Local 648", city: "Pocatello",        state: "ID", phone: "(208) 232-6806", website: "ualocal648.org",   lat: 42.8713, lng: -112.4455, address: "456 N Arthur, Pocatello, ID 83204" },

  // ── ILLINOIS ──
  { id: 23,  name: "UA Local 23",  city: "Rockford",         state: "IL", phone: "(815) 397-0350", website: "ualocal23.org",    lat: 42.2634, lng: -89.0820, address: "4525 Boeing Dr, Rockford, IL 61109" },
  { id: 25,  name: "UA Local 25",  city: "Rock Island",      state: "IL", phone: "(309) 788-4569", website: "ualocal25.org",    lat: 41.5095, lng: -90.5751, address: "4600 46th Ave, Rock Island, IL 61201" },
  { id: 63,  name: "UA Local 63",  city: "East Peoria",      state: "IL", phone: "(309) 699-3570", website: "ualocal63.org",    lat: 40.6681, lng: -89.5773, address: "116 Harvey Ct, East Peoria, IL 61611" },
  { id: 99,  name: "UA Local 99",  city: "Bloomington",      state: "IL", phone: "(309) 663-2337", website: "ualocal99.org",    lat: 40.4842, lng: -88.9937, address: "406 S Eldorado Rd, Bloomington, IL 61704" },
  { id: 101, name: "UA Local 101", city: "Belleville",       state: "IL", phone: "(618) 234-5504", website: "ualocal101.org",   lat: 38.5201, lng: -89.9840, address: "8 Premier Dr, Belleville, IL 62220" },
  { id: 130, name: "UA Local 130", city: "Chicago",          state: "IL", phone: "(312) 421-1010", website: "ualocal130.org",   lat: 41.8827, lng: -87.6576, address: "1340 W Washington Blvd, Chicago, IL 60607" },
  { id: 137, name: "UA Local 137", city: "Springfield",      state: "IL", phone: "(217) 544-2724", website: "ualocal137.org",   lat: 39.7817, lng: -89.6140, address: "2880 E Cook St, Springfield, IL 62703" },
  { id: 149, name: "UA Local 149", city: "Savoy",            state: "IL", phone: "(217) 359-5201", website: "ualocal149.org",   lat: 40.0564, lng: -88.2484, address: "1003 N Dulap Ave, Savoy, IL 61874" },
  { id: 160, name: "UA Local 160", city: "Murphysboro",      state: "IL", phone: "(618) 684-4521", website: "ualocal160.org",   lat: 37.7645, lng: -89.3351, address: "901 Mullberry St, Murphysboro, IL 62966" },
  { id: 281, name: "UA Local 281", city: "Alsip",            state: "IL", phone: "(708) 597-1800", website: "ualocal281.org",   lat: 41.6697, lng: -87.7312, address: "11900 S Laramie Ave, Alsip, IL 60803" },
  { id: 353, name: "UA Local 353", city: "Peoria",           state: "IL", phone: "(309) 633-1353", website: "ualocal353.org",   lat: 40.6681, lng: -89.6296, address: "6304 W Development Dr, Peoria, IL 61604" },
  { id: 360, name: "UA Local 360", city: "Collinsville",     state: "IL", phone: "(618) 346-2560", website: "ualocal360.org",   lat: 38.6706, lng: -89.9845, address: "5 Meadow Hgts, Collinsville, IL 62234" },
  { id: 439, name: "UA Local 439", city: "Caseyville",       state: "IL", phone: "(618) 624-6096", website: "ualocal439.org",   lat: 38.6292, lng: -90.0254, address: "1220 Donald Bailey Dr, Caseyville, IL 62232" },
  { id: 551, name: "UA Local 551", city: "West Frankfort",   state: "IL", phone: "(618) 937-1363", website: "ualocal551.org",   lat: 37.8981, lng: -88.9281, address: "10967 Dean Browning Blvd, West Frankfort, IL 62896" },
  { id: 553, name: "UA Local 553", city: "East Alton",       state: "IL", phone: "(618) 259-6787", website: "ualocal553.org",   lat: 38.8892, lng: -90.1090, address: "2 S Wesley Dr, East Alton, IL 62024" },
  { id: 597, name: "UA Local 597", city: "Chicago",          state: "IL", phone: "(312) 829-4191", website: "ualocal597.org",   lat: 41.8829, lng: -87.6602, address: "45 N Ogden Ave, Chicago, IL 60607" },
  { id: 653, name: "UA Local 653", city: "Centralia",        state: "IL", phone: "(618) 532-3351", website: "ualocal653.org",   lat: 38.5253, lng: -89.1334, address: "116 S Chestnut St, Centralia, IL 62801" },

  // ── INDIANA ──
  { id: 136, name: "UA Local 136", city: "Evansville",       state: "IN", phone: "(812) 423-8043", website: "ualocal136.org",   lat: 37.9716, lng: -87.5711, address: "2300 St Joseph Ind Pk Dr, Evansville, IN 47720" },
  { id: 157, name: "UA Local 157", city: "Terre Haute",      state: "IN", phone: "(812) 877-1531", website: "ualocal157.org",   lat: 39.4667, lng: -87.3531, address: "8801 E Milner Ave, Terre Haute, IN 47803" },
  { id: 166, name: "UA Local 166", city: "Fort Wayne",       state: "IN", phone: "(260) 490-5696", website: "ualocal166.org",   lat: 41.1306, lng: -85.2018, address: "2930 W Ludwig Rd, Fort Wayne, IN 46818" },
  { id: 172, name: "UA Local 172", city: "South Bend",       state: "IN", phone: "(574) 273-0300", website: "ualocal172.org",   lat: 41.7003, lng: -86.2180, address: "4172 Ralph Jones Ct, South Bend, IN 46628" },
  { id: 210, name: "UA Local 210", city: "Merrillville",     state: "IN", phone: "(219) 942-7224", website: "ualocal210.org",   lat: 41.4731, lng: -87.3320, address: "2901 E 83rd Pl, Merrillville, IN 46410" },
  { id: 440, name: "UA Local 440", city: "Indianapolis",     state: "IN", phone: "(317) 856-3771", website: "ualocal440.org",   lat: 39.7026, lng: -86.0764, address: "1521 Brookville Crossing Way, Indianapolis, IN 46239" },

  // ── IOWA ──
  { id: 33,  name: "UA Local 33",  city: "Des Moines",       state: "IA", phone: "(515) 243-3244", website: "ualocal33.com",    lat: 41.5868, lng: -93.6250, address: "2501 Bell Ave, Des Moines, IA 50321" },
  { id: 125, name: "UA Local 125", city: "Cedar Rapids",     state: "IA", phone: "(319) 365-0413", website: "ualocal125.org",   lat: 41.9545, lng: -91.7201, address: "5001 J St SW, Cedar Rapids, IA 52404" },

  // ── KANSAS ──
  { id: 441, name: "UA Local 441", city: "Wichita",          state: "KS", phone: "(316) 265-4291", website: "ualocal441.org",   lat: 37.6546, lng: -97.4261, address: "529 S Anna St, Wichita, KS 67209" },

  // ── KENTUCKY ──
  { id: 184, name: "UA Local 184", city: "Paducah",          state: "KY", phone: "(270) 442-3213", website: "ualocal184.org",   lat: 37.0834, lng: -88.6001, address: "1127 Broadway St, Paducah, KY 42001" },
  { id: 248, name: "UA Local 248", city: "Ashland",          state: "KY", phone: "(606) 325-2544", website: "ualocal248.org",   lat: 38.4784, lng: -82.6379, address: "924 Greenup Ave, Ashland, KY 41101" },
  { id: 452, name: "UA Local 452", city: "Lexington",        state: "KY", phone: "(859) 252-8337", website: "ualocal452.org",   lat: 38.0606, lng: -84.5037, address: "701 Allenridge Point, Lexington, KY 40510" },
  { id: 502, name: "UA Local 502", city: "Louisville",       state: "KY", phone: "(502) 361-8492", website: "ualocal502.org",   lat: 38.1868, lng: -85.7059, address: "4330 Crittenden Dr, Louisville, KY 40209" },
  { id: 633, name: "UA Local 633", city: "Owensboro",        state: "KY", phone: "(270) 683-1587", website: "ualocal633.org",   lat: 37.7719, lng: -87.1112, address: "3128 Alvey Park Dr W, Owensboro, KY 42303" },

  // ── LOUISIANA ──
  { id: 60,  name: "UA Local 60",  city: "Metairie",         state: "LA", phone: "(504) 885-3054", website: "ualocal60.org",    lat: 29.9985, lng: -90.1854, address: "3515 N I-10 Service Rd, Metairie, LA 70002" },
  { id: 141, name: "UA Local 141", city: "Shreveport",       state: "LA", phone: "(318) 671-1175", website: "ualocal141.org",   lat: 32.4252, lng: -93.8254, address: "7111 W Bert Kouns Industrial Loop, Shreveport, LA 71129" },
  { id: 198, name: "UA Local 198", city: "Baton Rouge",      state: "LA", phone: "(225) 356-3333", website: "ualocal198.org",   lat: 30.4736, lng: -91.1401, address: "5888 Airline Hwy, Baton Rouge, LA 70805" },
  { id: 247, name: "UA Local 247", city: "Alexandria",       state: "LA", phone: "(318) 442-9923", website: "ualocal247.org",   lat: 31.3113, lng: -92.4451, address: "249 McKeithen Dr, Alexandria, LA 71303" },

  // ── MAINE ──
  { id: 716, name: "UA Local 716", city: "Augusta",          state: "ME", phone: "(207) 621-0555", website: "ualocal716.org",   lat: 44.3106, lng: -69.7795, address: "21 Gabriel Dr, Augusta, ME 04330" },

  // ── MARYLAND ──
  { id: 486, name: "UA Local 486", city: "Baltimore",        state: "MD", phone: "(410) 866-4380", website: "ualocal486.org",   lat: 39.3996, lng: -76.5256, address: "8100 Sandpiper Cr, Baltimore, MD 21236" },
  { id: 669, name: "UA Local 669", city: "Columbia",         state: "MD", phone: "(410) 381-4300", website: "sprinklerfitters669.org", lat: 39.2037, lng: -76.8610, address: "7050 Oakland Mills Rd, Columbia, MD 21046" },

  // ── MASSACHUSETTS ──
  { id: 4,   name: "UA Local 4",   city: "West Boylston",    state: "MA", phone: "(508) 835-1150", website: "ualocal4.com",     lat: 42.3459, lng: -71.7887, address: "150 Hartwell St, West Boylston, MA 01583" },
  { id: 12,  name: "UA Local 12",  city: "Boston",           state: "MA", phone: "(617) 288-6200", website: "ualocal12.org",    lat: 42.3112, lng: -71.0650, address: "1240 Massachusetts Ave, Boston, MA 02125" },
  { id: 104, name: "UA Local 104", city: "Holyoke",          state: "MA", phone: "(413) 594-5152", website: "ualocal104.org",   lat: 42.2043, lng: -72.6162, address: "86 Lower Westfield Rd, Holyoke, MA 01040" },
  { id: 537, name: "UA Local 537", city: "Dorchester",       state: "MA", phone: "(617) 787-5370", website: "ualocal537.org",   lat: 42.2976, lng: -71.0633, address: "40 Enterprise St, Dorchester, MA 02125" },
  { id: 550, name: "UA Local 550", city: "Boston",           state: "MA", phone: "(617) 323-0474", website: "ualocal550.org",   lat: 42.2884, lng: -71.1649, address: "46 Rockland St, Boston, MA 02132" },

  // ── MICHIGAN ──
  { id: 85,  name: "UA Local 85",  city: "Saginaw",          state: "MI", phone: "(989) 799-5261", website: "ualocal85.org",    lat: 43.4195, lng: -83.9508, address: "3535 Bay Rd, Saginaw, MI 48603" },
  { id: 98,  name: "UA Local 98",  city: "Madison Heights",  state: "MI", phone: "(248) 307-9800", website: "ualocal98.org",    lat: 42.5003, lng: -83.1052, address: "555 Horace Brown Dr, Madison Heights, MI 48071" },
  { id: 111, name: "UA Local 111", city: "Escanaba",         state: "MI", phone: "(906) 789-9784", website: "ualocal111.org",   lat: 45.7453, lng: -87.0647, address: "2601 N 30th St, Escanaba, MI 49829" },
  { id: 174, name: "UA Local 174", city: "Coopersville",     state: "MI", phone: "(616) 837-0222", website: "ualocal174.org",   lat: 43.0648, lng: -85.9286, address: "1008 O'Malley Dr, Coopersville, MI 49404" },
  { id: 190, name: "UA Local 190", city: "Ann Arbor",        state: "MI", phone: "(734) 424-0962", website: "ualocal190.org",   lat: 42.3223, lng: -83.7274, address: "7920 Jackson Rd, Ann Arbor, MI 48103" },
  { id: 333, name: "UA Local 333", city: "Lansing",          state: "MI", phone: "(517) 393-5480", website: "ualocal333.org",   lat: 42.6940, lng: -84.4932, address: "5405 S Martin L King Jr Blvd, Lansing, MI 48911" },
  { id: 357, name: "UA Local 357", city: "Schoolcraft",      state: "MI", phone: "(269) 679-2570", website: "ualocal357.org",   lat: 42.1142, lng: -85.6383, address: "11847 Shaver Rd, Schoolcraft, MI 49087" },
  { id: 370, name: "UA Local 370", city: "Fenton",           state: "MI", phone: "(810) 720-5243", website: "ualocal370.org",   lat: 42.7956, lng: -83.7049, address: "2151 W Thompson Rd, Fenton, MI 48430" },
  { id: 636, name: "UA Local 636", city: "Farmington Hills", state: "MI", phone: "(248) 538-6636", website: "ualocal636.org",   lat: 42.4851, lng: -83.3674, address: "30100 Northwestern Hwy, Farmington Hills, MI 48334" },
  { id: 671, name: "UA Local 671", city: "Monroe",           state: "MI", phone: "(734) 242-5711", website: "ualocal671.org",   lat: 41.9164, lng: -83.3977, address: "309 Detroit Ave, Monroe, MI 48162" },
  { id: 704, name: "UA Local 704", city: "Southfield",       state: "MI", phone: "(248) 474-7553", website: "ualocal704.org",   lat: 42.4734, lng: -83.2219, address: "23475 Northwestern Hwy, Southfield, MI 48075" },

  // ── MINNESOTA ──
  { id: 6,   name: "UA Local 6",   city: "Rochester",        state: "MN", phone: "(507) 288-4172", website: "ualocal6.org",     lat: 44.0234, lng: -92.4637, address: "3111 19th St NW, Rochester, MN 55901" },
  { id: 11,  name: "UA Local 11",  city: "Duluth",           state: "MN", phone: "(218) 727-2199", website: "ualocal11.org",    lat: 46.8291, lng: -92.1854, address: "4402 Airpark Blvd, Duluth, MN 55811" },
  { id: 15,  name: "UA Local 15",  city: "Maple Grove",      state: "MN", phone: "(612) 333-8601", website: "ualocal15.org",    lat: 45.0940, lng: -93.4557, address: "8625 Monticello Ln N, Maple Grove, MN 55369" },
  { id: 34,  name: "UA Local 34",  city: "St. Paul",         state: "MN", phone: "(651) 224-3828", website: "ualocal34.org",    lat: 44.9486, lng: -93.1029, address: "353 W 7th St, St. Paul, MN 55102" },
  { id: 340, name: "UA Local 340", city: "Minneapolis",      state: "MN", phone: "(612) 379-3241", website: "ualocal340.org",   lat: 44.9837, lng: -93.2416, address: "312 Central Ave, Minneapolis, MN 55414" },
  { id: 417, name: "UA Local 417", city: "Shoreview",        state: "MN", phone: "(612) 781-5804", website: "ualocal417.org",   lat: 45.0785, lng: -93.1372, address: "529 County Rd EW, Shoreview, MN 55126" },
  { id: 455, name: "UA Local 455", city: "St. Paul",         state: "MN", phone: "(651) 455-0455", website: "ualocal455.org",   lat: 44.9145, lng: -93.0994, address: "1301 L'Orient St, St. Paul, MN 55117" },
  { id: 539, name: "UA Local 539", city: "Minneapolis",      state: "MN", phone: "(612) 379-4711", website: "ualocal539.org",   lat: 44.9837, lng: -93.2416, address: "312 Central Ave, Minneapolis, MN 55414" },
  { id: 589, name: "UA Local 589", city: "Virginia",         state: "MN", phone: "(218) 741-2482", website: "ualocal589.org",   lat: 47.5230, lng: -92.5380, address: "107 S 15th Ave W, Virginia, MN 55792" },

  // ── MISSISSIPPI ──
  { id: 436, name: "UA Local 436", city: "Pascagoula",       state: "MS", phone: "(228) 762-2972", website: "ualocal436.org",   lat: 30.3657, lng: -88.5561, address: "1307 Jackson Ave, Pascagoula, MS 39567" },
  { id: 568, name: "UA Local 568", city: "Saucier",          state: "MS", phone: "(228) 863-1853", website: "ualocal568.org",   lat: 30.6307, lng: -89.1362, address: "18511 Nobles Rd, Saucier, MS 39574" },
  { id: 619, name: "UA Local 619", city: "Vicksburg",        state: "MS", phone: "(601) 638-2546", website: "ualocal619.org",   lat: 32.3526, lng: -90.8779, address: "3203 N Frontage Dr, Vicksburg, MS 39180" },

  // ── MISSOURI ──
  { id: 8,   name: "UA Local 8",   city: "Kansas City",      state: "MO", phone: "(816) 363-8888", website: "ualocal8.org",     lat: 39.0719, lng: -94.5254, address: "5950 Manchester Trafficway, Kansas City, MO 64130" },
  { id: 45,  name: "UA Local 45",  city: "St. Joseph",       state: "MO", phone: "(816) 279-5534", website: "ualocal45.org",    lat: 39.7676, lng: -94.8467, address: "2329 S 22nd St, St. Joseph, MO 64503" },
  { id: 178, name: "UA Local 178", city: "Springfield",      state: "MO", phone: "(417) 869-0633", website: "ualocal178.org",   lat: 37.2153, lng: -93.3174, address: "2501 W Grand, Springfield, MO 65802" },
  { id: 268, name: "UA Local 268", city: "St. Louis",        state: "MO", phone: "(314) 241-8023", website: "ualocal268.org",   lat: 38.6270, lng: -90.1994, address: "1544 S 3rd St, St. Louis, MO 63104" },
  { id: 314, name: "UA Local 314", city: "Kansas City",      state: "MO", phone: "(816) 444-5113", website: "ualocal314.org",   lat: 38.9770, lng: -94.5827, address: "8510 Hillcrest Rd, Kansas City, MO 64138" },
  { id: 533, name: "UA Local 533", city: "Kansas City",      state: "MO", phone: "(816) 523-1533", website: "ualocal533.org",   lat: 38.9770, lng: -94.5827, address: "8600 Hillcrest Rd, Kansas City, MO 64138" },
  { id: 562, name: "UA Local 562", city: "Earth City",       state: "MO", phone: "(314) 355-1000", website: "ualocal562.org",   lat: 38.7448, lng: -90.3899, address: "3640 Corporate Trail Dr, Earth City, MO 63045" },
  { id: 781, name: "UA Local 781", city: "Kansas City",      state: "MO", phone: "(816) 739-4028", website: "ualocal781.org",   lat: 39.0570, lng: -94.5349, address: "4501 Cleaver II Blvd, Kansas City, MO 64130" },

  // ── MONTANA ──
  { id: 30,  name: "UA Local 30",  city: "Billings",         state: "MT", phone: "(406) 252-9371", website: "ualocal30.org",    lat: 45.7833, lng: -108.5007, address: "317 Washington St, Billings, MT 59101" },
  { id: 41,  name: "UA Local 41",  city: "Butte",            state: "MT", phone: "(406) 494-3051", website: "ualocal41.org",    lat: 46.0038, lng: -112.5348, address: "45 E Silver St, Butte, MT 59701" },
  { id: 459, name: "UA Local 459", city: "Missoula",         state: "MT", phone: "(406) 549-3479", website: "ualocal459.org",   lat: 46.8721, lng: -113.9940, address: "1026 S 5th St W, Missoula, MT 59801" },

  // ── NEBRASKA ──
  { id: 16,  name: "UA Local 16",  city: "Omaha",            state: "NE", phone: "(402) 734-6274", website: "ualocal16.org",    lat: 41.2266, lng: -95.9387, address: "4801 F St, Omaha, NE 68117" },
  { id: 464, name: "UA Local 464", city: "Omaha",            state: "NE", phone: "(402) 333-5859", website: "ualocal464.org",   lat: 41.2408, lng: -96.0620, address: "3375 Oakview Dr, Omaha, NE 68144" },

  // ── NEVADA ──
  { id: 350, name: "UA Local 350", city: "Sparks",           state: "NV", phone: "(775) 359-2142", website: "ualocal350.org",   lat: 39.5349, lng: -119.7527, address: "1110 Greg St, Sparks, NV 89431" },
  { id: 525, name: "UA Local 525", city: "Las Vegas",        state: "NV", phone: "(702) 452-1520", website: "ualocal525.org",   lat: 36.2093, lng: -115.0597, address: "760 N Lamb Blvd, Las Vegas, NV 89110" },

  // ── NEW HAMPSHIRE ──
  { id: 131, name: "UA Local 131", city: "Hooksett",         state: "NH", phone: "(603) 669-7307", website: "ualocal131.org",   lat: 43.0773, lng: -71.4437, address: "161 Londonderry Tpke, Hooksett, NH 03106" },

  // ── NEW JERSEY ──
  { id: 9,   name: "UA Local 9",   city: "Englishtown",      state: "NJ", phone: "(732) 792-0999", website: "ualocal9.org",     lat: 40.2957, lng: -74.3679, address: "2 Iron Ore Rd at Rte 33, Englishtown, NJ 07726" },
  { id: 24,  name: "UA Local 24",  city: "West Caldwell",    state: "NJ", phone: "(973) 521-7058", website: "ualocal24.org",    lat: 40.8471, lng: -74.2965, address: "20 Fairfield Pl, West Caldwell, NJ 07006" },
  { id: 274, name: "UA Local 274", city: "Parsippany",       state: "NJ", phone: "(201) 943-4700", website: "ualocal274.org",   lat: 40.8573, lng: -74.4210, address: "205 Jefferson Rd, Parsippany, NJ 07054" },
  { id: 322, name: "UA Local 322", city: "Winslow",          state: "NJ", phone: "(609) 567-3322", website: "ualocal322.org",   lat: 39.7012, lng: -74.9108, address: "534 S Rte 73, Winslow, NJ 08095" },
  { id: 475, name: "UA Local 475", city: "Warren",           state: "NJ", phone: "(908) 754-1030", website: "ualocal475.org",   lat: 40.6812, lng: -74.5038, address: "136 Mt Bethel Rd, Warren, NJ 07059" },
  { id: 696, name: "UA Local 696", city: "Millburn",         state: "NJ", phone: "(973) 379-7446", website: "ualocal696.org",   lat: 40.7262, lng: -74.3079, address: "41-43 E Willow St, Millburn, NJ 07041" },
  { id: 855, name: "UA Local 855", city: "Somerville",       state: "NJ", phone: "(908) 450-7620", website: "ualocal855.org",   lat: 40.5773, lng: -74.6099, address: "261 E Main St, Somerville, NJ 08876" },

  // ── NEW MEXICO ──
  { id: 412, name: "UA Local 412", city: "Albuquerque",      state: "NM", phone: "(505) 265-1513", website: "ualocal412.org",   lat: 35.0740, lng: -106.5904, address: "510 San Pedro Dr SE, Albuquerque, NM 87108" },

  // ── NEW YORK ──
  { id: 1,   name: "UA Local 1",   city: "Long Island City", state: "NY", phone: "(718) 738-7500", website: "ualocal1.org",     lat: 40.7440, lng: -73.9485, address: "50-02 5th St, Long Island City, NY 11101" },
  { id: 7,   name: "UA Local 7",   city: "Latham",           state: "NY", phone: "(518) 785-9808", website: "ualocal7.org",     lat: 42.7454, lng: -73.7557, address: "18 Avis Dr, Latham, NY 12110" },
  { id: 13,  name: "UA Local 13",  city: "Rochester",        state: "NY", phone: "(585) 338-2360", website: "ualocal13.org",    lat: 43.1900, lng: -77.6538, address: "1850 Mt Read Blvd, Rochester, NY 14615" },
  { id: 21,  name: "UA Local 21",  city: "Peekskill",        state: "NY", phone: "(914) 737-2166", website: "local21union.com", lat: 41.2948, lng: -73.9218, address: "1024 McKinley St, Peekskill, NY 10566" },
  { id: 22,  name: "UA Local 22",  city: "West Seneca",      state: "NY", phone: "(716) 656-0220", website: "ualocal22.com",    lat: 42.8319, lng: -78.8005, address: "120 Gardenville Pkwy, West Seneca, NY 14224" },
  { id: 81,  name: "UA Local 81",  city: "Syracuse",         state: "NY", phone: "(315) 437-7397", website: "ualocal81.org",    lat: 43.0595, lng: -76.1019, address: "107 Twin Oaks Dr, Syracuse, NY 13206" },
  { id: 112, name: "UA Local 112", city: "Binghamton",       state: "NY", phone: "(607) 723-9593", website: "ualocal112.org",   lat: 42.0987, lng: -75.9180, address: "11 Griswold St, Binghamton, NY 13904" },
  { id: 128, name: "UA Local 128", city: "Schenectady",      state: "NY", phone: "(518) 381-0819", website: "ualocal128.org",   lat: 42.7877, lng: -74.0619, address: "348 Duanesbury Rd, Schenectady, NY 12306" },
  { id: 200, name: "UA Local 200", city: "Ronkonkoma",       state: "NY", phone: "(631) 981-2158", website: "plu200ua.org",     lat: 40.8143, lng: -73.1229, address: "2123 5th Ave, Ronkonkoma, NY 11779" },
  { id: 373, name: "UA Local 373", city: "Mountainville",    state: "NY", phone: "(845) 534-1050", website: "ua373.com",        lat: 41.3915, lng: -74.0540, address: "76 Pleasant Hill Rd, Mountainville, NY 10953" },
  { id: 638, name: "UA Local 638", city: "Long Island City", state: "NY", phone: "(718) 392-3420", website: "steamfitters638.org", lat: 40.7480, lng: -73.9490, address: "27-08 40th Ave, Long Island City, NY 11101" },
  { id: 773, name: "UA Local 773", city: "Queensbury",       state: "NY", phone: "(518) 792-9157", website: "lu773.org",        lat: 43.3413, lng: -73.6932, address: "37 Luzerne Rd, Queensbury, NY 12804" },

  // ── NORTH DAKOTA ──
  { id: 300, name: "UA Local 300", city: "Mandan",           state: "ND", phone: "(701) 663-0999", website: "ualocal300.org",   lat: 46.8273, lng: -100.8896, address: "2901 Twin City Dr, Mandan, ND 58554" },

  // ── OHIO ──
  { id: 42,  name: "UA Local 42",  city: "Norwalk",          state: "OH", phone: "(419) 668-4491", website: "ualocal42.org",    lat: 41.2423, lng: -82.6157, address: "65 Gibbs Rd, Norwalk, OH 44857" },
  { id: 50,  name: "UA Local 50",  city: "Northwood",        state: "OH", phone: "(419) 662-5456", website: "ualocal50.org",    lat: 41.6061, lng: -83.4693, address: "7570 Caple Blvd, Northwood, OH 43619" },
  { id: 55,  name: "UA Local 55",  city: "Brooklyn Heights", state: "OH", phone: "(216) 459-0099", website: "ualocal55.org",    lat: 41.4256, lng: -81.6935, address: "980 Keynote Cr, Brooklyn Heights, OH 44131" },
  { id: 94,  name: "UA Local 94",  city: "Canton",           state: "OH", phone: "(330) 478-1864", website: "ualocal94.org",    lat: 40.7989, lng: -81.4163, address: "3919 13th St SW, Canton, OH 44710" },
  { id: 120, name: "UA Local 120", city: "Cleveland",        state: "OH", phone: "(216) 447-3408", website: "ualocal120.org",   lat: 41.3698, lng: -81.6966, address: "6305 Halle Dr, Cleveland, OH 44125" },
  { id: 162, name: "UA Local 162", city: "Dayton",           state: "OH", phone: "(937) 222-8747", website: "ualocal162.org",   lat: 39.7603, lng: -84.1858, address: "1200 E 2nd St, Dayton, OH 45403" },
  { id: 168, name: "UA Local 168", city: "Marietta",         state: "OH", phone: "(740) 373-7965", website: "ualocal168.org",   lat: 39.4151, lng: -81.4549, address: "300 Commerce Dr, Marietta, OH 45750" },
  { id: 189, name: "UA Local 189", city: "Columbus",         state: "OH", phone: "(614) 486-2912", website: "ualocal189.org",   lat: 39.9836, lng: -83.0272, address: "1250 Kinnear Rd, Columbus, OH 43212" },
  { id: 219, name: "UA Local 219", city: "Akron",            state: "OH", phone: "(330) 253-9166", website: "ualocal219.org",   lat: 41.1220, lng: -81.5151, address: "1655 Brittain Rd, Akron, OH 44310" },
  { id: 392, name: "UA Local 392", city: "Cincinnati",       state: "OH", phone: "(513) 241-1760", website: "ualocal392.org",   lat: 39.1155, lng: -84.5064, address: "1228 Central Pkwy, Cincinnati, OH 45202" },
  { id: 396, name: "UA Local 396", city: "Boardman",         state: "OH", phone: "(330) 758-4596", website: "ualocal396.org",   lat: 41.0267, lng: -80.6434, address: "493 Bev Rd, Boardman, OH 44512" },
  { id: 495, name: "UA Local 495", city: "Cambridge",        state: "OH", phone: "(740) 439-3623", website: "ualocal495.org",   lat: 40.0315, lng: -81.5896, address: "11306 E Pike Rd, Cambridge, OH 43725" },
  { id: 577, name: "UA Local 577", city: "Portsmouth",       state: "OH", phone: "(740) 353-5869", website: "ualocal577.org",   lat: 38.7318, lng: -82.9977, address: "1236 Gallia St, Portsmouth, OH 45662" },
  { id: 776, name: "UA Local 776", city: "Lima",             state: "OH", phone: "(419) 229-5176", website: "ualocal776.org",   lat: 40.7454, lng: -84.1052, address: "1300 Bowman Rd, Lima, OH 45804" },

  // ── OKLAHOMA ──
  { id: 344, name: "UA Local 344", city: "Oklahoma City",    state: "OK", phone: "(405) 682-4571", website: "ualocal344.org",   lat: 35.4293, lng: -97.5581, address: "4335 SW 44th St, Oklahoma City, OK 73119" },
  { id: 430, name: "UA Local 430", city: "Tulsa",            state: "OK", phone: "(918) 836-0430", website: "ualocal430.org",   lat: 36.1864, lng: -95.9422, address: "2908 N Harvard Ave, Tulsa, OK 74115" },
  { id: 798, name: "UA Local 798", city: "Tulsa",            state: "OK", phone: "(918) 622-1900", website: "pipeliners798.org", lat: 36.1013, lng: -95.8891, address: "4823 S 83rd E St, Tulsa, OK 74145" },

  // ── OREGON ──
  { id: 290, name: "UA Local 290", city: "Tualatin",         state: "OR", phone: "(503) 691-5700", website: "ualocal290.org",   lat: 45.3840, lng: -122.7631, address: "20210 SW Teton Ave, Tualatin, OR 97062" },

  // ── PENNSYLVANIA ──
  { id: 27,  name: "UA Local 27",  city: "Coraopolis",       state: "PA", phone: "(724) 695-8175", website: "ualocal27.org",    lat: 40.5200, lng: -80.1948, address: "1040 Montour W Ind Pk, Coraopolis, PA 15108" },
  { id: 354, name: "UA Local 354", city: "Youngwood",        state: "PA", phone: "(724) 925-7238", website: "ualocal354.org",   lat: 40.2392, lng: -79.5774, address: "271 Armbrust Rd, Youngwood, PA 15697" },
  { id: 420, name: "UA Local 420", city: "Philadelphia",     state: "PA", phone: "(267) 350-4200", website: "ualocal420.org",   lat: 40.1024, lng: -74.9754, address: "14420 Townsend Rd, Philadelphia, PA 19154" },
  { id: 449, name: "UA Local 449", city: "Harmony",          state: "PA", phone: "(412) 381-1133", website: "ualocal449.org",   lat: 40.8015, lng: -80.1312, address: "232 Wise Rd, Harmony, PA 16037" },
  { id: 520, name: "UA Local 520", city: "Harrisburg",       state: "PA", phone: "(717) 652-3135", website: "ualocal520.org",   lat: 40.3233, lng: -76.8344, address: "7193 Jonestown Rd, Harrisburg, PA 17112" },
  { id: 524, name: "UA Local 524", city: "Scranton",         state: "PA", phone: "(570) 347-9214", website: "ualocal524.org",   lat: 41.4090, lng: -75.6624, address: "711 Corey St, Scranton, PA 18505" },
  { id: 542, name: "UA Local 542", city: "Pittsburgh",       state: "PA", phone: "(412) 822-8040", website: "ualocal542.org",   lat: 40.4866, lng: -79.9558, address: "227 Stanton Ave, Pittsburgh, PA 15209" },
  { id: 600, name: "UA Local 600", city: "Sinking Spring",   state: "PA", phone: "(484) 955-5083", website: "ualocal600.org",   lat: 40.3265, lng: -75.9699, address: "3323 Pequot Dr, Sinking Spring, PA 19608" },
  { id: 690, name: "UA Local 690", city: "Philadelphia",     state: "PA", phone: "(215) 677-6900", website: "ualocal690.org",   lat: 40.1024, lng: -74.9754, address: "2791 Southampton Rd, Philadelphia, PA 19154" },
  { id: 692, name: "UA Local 692", city: "Philadelphia",     state: "PA", phone: "(215) 671-1692", website: "ualocal692.org",   lat: 40.0950, lng: -75.0180, address: "14002 McNulty Rd, Philadelphia, PA 19154" },

  // ── RHODE ISLAND ──
  { id: 51,  name: "UA Local 51",  city: "East Providence",  state: "RI", phone: "(401) 943-3033", website: "ualocal51.com",    lat: 41.8137, lng: -71.3673, address: "11 Hemingway Dr, East Providence, RI 02915" },

  // ── SOUTH CAROLINA ──
  { id: 421, name: "UA Local 421", city: "North Charleston", state: "SC", phone: "(843) 554-3655", website: "ualocal421.org",   lat: 32.8546, lng: -79.9748, address: "2556 Oscar Johnson Dr, North Charleston, SC 29405" },

  // ── TENNESSEE ──
  { id: 17,  name: "UA Local 17",  city: "Memphis",          state: "TN", phone: "(901) 368-0900", website: "ualocal17.org",    lat: 35.0901, lng: -89.9186, address: "4229 Prescott Rd, Memphis, TN 38118" },
  { id: 43,  name: "UA Local 43",  city: "Chattanooga",      state: "TN", phone: "(423) 698-6991", website: "ualocal43.org",    lat: 35.0456, lng: -85.2672, address: "3009 Riverside Dr, Chattanooga, TN 37406" },
  { id: 102, name: "UA Local 102", city: "Knoxville",        state: "TN", phone: "(865) 523-7413", website: "ualocal102.org",   lat: 35.9862, lng: -83.9540, address: "1216 Broadway NE, Knoxville, TN 37917" },
  { id: 538, name: "UA Local 538", city: "Johnson City",     state: "TN", phone: "(423) 928-5751", website: "ualocal538.org",   lat: 36.3134, lng: -82.3535, address: "2404 S Roan St, Johnson City, TN 37601" },
  { id: 572, name: "UA Local 572", city: "Nashville",        state: "TN", phone: "(615) 262-0893", website: "ualocal572.org",   lat: 36.2046, lng: -86.7638, address: "225 Ben Allen Rd, Nashville, TN 37207" },
  { id: 614, name: "UA Local 614", city: "Arlington",        state: "TN", phone: "(901) 386-8166", website: "ualocal614.org",   lat: 35.2990, lng: -89.6645, address: "5670 Commander Dr, Arlington, TN 38002" },
  { id: 702, name: "UA Local 702", city: "Madison",          state: "TN", phone: "(615) 913-6734", website: "ualocal702.org",   lat: 36.2589, lng: -86.7236, address: "1209 Coreland Dr, Madison, TN 37115" },
  { id: 718, name: "UA Local 718", city: "Oak Ridge",        state: "TN", phone: "(865) 574-0235", website: "ualocal718.org",   lat: 36.0104, lng: -84.2696, address: "109 Viking Rd, Oak Ridge, TN 37931" },

  // ── TEXAS ──
  { id: 68,  name: "UA Local 68",  city: "Houston",          state: "TX", phone: "(713) 869-3592", website: "ualocal68.org",    lat: 29.7830, lng: -95.3850, address: "502 Link Rd, Houston, TX 77009" },
  { id: 100, name: "UA Local 100", city: "Mesquite",         state: "TX", phone: "(214) 341-8606", website: "ualocal100.org",   lat: 32.7668, lng: -96.5992, address: "3010 Interstate 30, Mesquite, TX 75150" },
  { id: 142, name: "UA Local 142", city: "San Antonio",      state: "TX", phone: "(210) 226-1244", website: "ualocal142.org",   lat: 29.4448, lng: -98.4313, address: "3630 Belgium Ln, San Antonio, TX 78219" },
  { id: 146, name: "UA Local 146", city: "Fort Worth",       state: "TX", phone: "(817) 536-1979", website: "ualocal146.org",   lat: 32.7548, lng: -97.4686, address: "9920 White Settlement Rd, Fort Worth, TX 76108" },
  { id: 211, name: "UA Local 211", city: "Deer Park",        state: "TX", phone: "(713) 644-5521", website: "ualocal211.org",   lat: 29.7052, lng: -95.1240, address: "1301 W 13th St, Deer Park, TX 77536" },
  { id: 286, name: "UA Local 286", city: "Austin",           state: "TX", phone: "(512) 385-0002", website: "local286.org",     lat: 30.2672, lng: -97.7431, address: "814 Airport Blvd, Austin, TX 78702" },
  { id: 404, name: "UA Local 404", city: "Lubbock",          state: "TX", phone: "(806) 744-3835", website: "ualocal404.org",   lat: 33.5779, lng: -101.8552, address: "510 Ave G, Lubbock, TX 79401" },
  { id: 529, name: "UA Local 529", city: "Waco",             state: "TX", phone: "(254) 754-3471", website: "ualocal529.org",   lat: 31.5493, lng: -97.1467, address: "510 Crescent St, Waco, TX 76705" },

  // ── UTAH ──
  { id: 140, name: "UA Local 140", city: "Salt Lake City",   state: "UT", phone: "(801) 973-6784", website: "ualocal140.org",   lat: 40.6991, lng: -111.9290, address: "2261 S Redwood Rd, Salt Lake City, UT 84119" },

  // ── VERMONT ──
  { id: 693, name: "UA Local 693", city: "South Burlington", state: "VT", phone: "(802) 864-4042", website: "ualocal693.org",   lat: 44.4669, lng: -73.1709, address: "3 Gregory Dr, South Burlington, VT 05403" },

  // ── VIRGINIA ──
  { id: 10,  name: "UA Local 10",  city: "Richmond",         state: "VA", phone: "(804) 231-4233", website: "ualocal10.org",    lat: 37.5266, lng: -77.4439, address: "701 Stockton St, Richmond, VA 23224" },
  { id: 110, name: "UA Local 110", city: "Norfolk",          state: "VA", phone: "(757) 587-4768", website: "ualocal110.org",   lat: 36.9471, lng: -76.2957, address: "520 Naval Base Rd, Norfolk, VA 23505" },
  { id: 272, name: "UA Local 272", city: "Portsmouth",       state: "VA", phone: "(757) 537-0765", website: "ualocal272.org",   lat: 36.8354, lng: -76.3719, address: "5664 Rivermill Cir, Portsmouth, VA 23707" },
  { id: 376, name: "UA Local 376", city: "Norfolk",          state: "VA", phone: "(757) 270-1608", website: "ualocal376.org",   lat: 36.9182, lng: -76.2371, address: "1005 Green St, Norfolk, VA 23513" },
  { id: 477, name: "UA Local 477", city: "Smithfield",       state: "VA", phone: "(757) 617-1180", website: "ualocal477.org",   lat: 36.9818, lng: -76.6316, address: "1205 Wilson Rd, Smithfield, VA 23430" },
  { id: 851, name: "UA Local 851", city: "DeWitt",           state: "VA", phone: "(804) 898-1703", website: "ualocal851.org",   lat: 37.0774, lng: -77.5563, address: "11916 Patillo Rd, DeWitt, VA 23841" },

  // ── WASHINGTON ──
  { id: 26,  name: "UA Local 26",  city: "Burlington",       state: "WA", phone: "(360) 486-9340", website: "ualocal26.org",    lat: 48.4758, lng: -122.3343, address: "780 Chrysler Dr, Burlington, WA 98233" },
  { id: 32,  name: "UA Local 32",  city: "Renton",           state: "WA", phone: "(425) 277-6680", website: "ualocal32.com",    lat: 47.4799, lng: -122.2171, address: "597 Monster Rd SW, Renton, WA 98057" },
  { id: 44,  name: "UA Local 44",  city: "Spokane",          state: "WA", phone: "(509) 624-5101", website: "ualocal44.org",    lat: 47.6588, lng: -117.4234, address: "3915 E Main, Spokane, WA 99202" },
  { id: 598, name: "UA Local 598", city: "Pasco",            state: "WA", phone: "(509) 545-1446", website: "ualocal598.org",   lat: 46.2396, lng: -119.1006, address: "1328 Rd 28, Pasco, WA 99301" },
  { id: 699, name: "UA Local 699", city: "Tukwila",          state: "WA", phone: "(206) 441-0737", website: "ualocal699.org",   lat: 47.4740, lng: -122.2621, address: "4411 S Ryan Way, Tukwila, WA 98178" },

  // ── WEST VIRGINIA ──
  { id: 83,  name: "UA Local 83",  city: "Wheeling",         state: "WV", phone: "(304) 233-4445", website: "ualocal83wv.org",  lat: 40.0640, lng: -80.7209, address: "177 29th St, Wheeling, WV 26003" },
  { id: 152, name: "UA Local 152", city: "Morgantown",       state: "WV", phone: "(304) 292-8818", website: "ualocal152.org",   lat: 39.6295, lng: -79.9559, address: "100 Richard St, Morgantown, WV 26501" },
  { id: 521, name: "UA Local 521", city: "Huntington",       state: "WV", phone: "(304) 523-8489", website: "ualocal521.org",   lat: 38.4193, lng: -82.4452, address: "137 5th Ave, Huntington, WV 25701" },
  { id: 565, name: "UA Local 565", city: "Parkersburg",      state: "WV", phone: "(304) 485-5202", website: "ualocal565.org",   lat: 39.2667, lng: -81.5615, address: "593 Cedar Grove Rd, Parkersburg, WV 26104" },
  { id: 625, name: "UA Local 625", city: "Charleston",       state: "WV", phone: "(304) 744-3881", website: "ualocal625.org",   lat: 38.3498, lng: -81.6326, address: "3611 James St, Charleston, WV 25387" },

  // ── WISCONSIN ──
  { id: 75,  name: "UA Local 75",  city: "Milwaukee",        state: "WI", phone: "(414) 359-1310", website: "ualocal75.org",    lat: 43.1442, lng: -88.0380, address: "11175 W Parkland Ave, Milwaukee, WI 53224" },
  { id: 118, name: "UA Local 118", city: "Kenosha",          state: "WI", phone: "(262) 654-3815", website: "ualocal118.com",   lat: 42.5847, lng: -87.8212, address: "3030 39th Ave, Kenosha, WI 53144" },
  { id: 183, name: "UA Local 183", city: "Menomonee Falls",  state: "WI", phone: "(262) 252-0183", website: "ualocal183.org",   lat: 43.1789, lng: -88.1195, address: "W175 N5700 Technology Dr, Menomonee Falls, WI 53051" },
  { id: 400, name: "UA Local 400", city: "Kaukauna",         state: "WI", phone: "(920) 462-0400", website: "ualocal400.org",   lat: 44.2783, lng: -88.2601, address: "2700 Northridge Dr, Kaukauna, WI 54130" },
  { id: 434, name: "UA Local 434", city: "Mosinee",          state: "WI", phone: "(715) 692-4341", website: "ualocal434.org",   lat: 44.7955, lng: -89.7065, address: "912 N View Dr, Mosinee, WI 54455" },
  { id: 601, name: "UA Local 601", city: "Milwaukee",        state: "WI", phone: "(414) 543-0601", website: "ualocal601.org",   lat: 43.0160, lng: -88.0426, address: "3300 S 103rd St, Milwaukee, WI 53227" },

  // ── WYOMING ──
  { id: 192, name: "UA Local 192", city: "Cheyenne",         state: "WY", phone: "(307) 634-5837", website: "ualocal192.org",   lat: 41.1400, lng: -104.8202, address: "411 W 5th St, Cheyenne, WY 82007" },
];

const SMART_LOCALS = [
  // ── ALASKA ──
  { id: 23, name: "SMART Local 23", city: "Anchorage", state: "AK", phone: "(907) 277-5313", website: "aklocal23.org", lat: 61.1508, lng: -149.9003, address: "1317 E 75th Ave #4, Anchorage, AK 99518" },

  // ── ARIZONA ──
  { id: 359, name: "SMART Local 359", city: "Phoenix", state: "AZ", phone: null, website: "smw359.org", lat: 33.4484, lng: -112.0740, address: "Phoenix, AZ" },

  // ── CALIFORNIA ──
  { id: 104, name: "SMART Local 104", city: "San Francisco", state: "CA", phone: null, website: "smw104.org", lat: 37.7749, lng: -122.4194, address: "San Francisco, CA" },
  { id: 104, name: "SMART Local 104", city: "Sacramento", state: "CA", phone: null, website: "smw104.org", lat: 38.5816, lng: -121.4944, address: "Sacramento, CA" },
  { id: 105, name: "SMART Local 105", city: "Los Angeles", state: "CA", phone: null, website: "local105.org", lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  { id: 206, name: "SMART Local 206", city: "San Diego", state: "CA", phone: null, website: "smwlocal206.org", lat: 32.7157, lng: -117.1611, address: "San Diego, CA" },

  // ── COLORADO ──
  { id: 9, name: "SMART Local 9", city: "Denver", state: "CO", phone: "(303) 922-1213", website: "smw9.com", lat: 39.7392, lng: -105.0178, address: "PO Box 11040, Denver, CO 80211" },

  // ── FLORIDA ──
  { id: 15, name: "SMART Local 15", city: "Tampa", state: "FL", phone: "(813) 628-0021", website: "smwlocal15.org", lat: 27.9506, lng: -82.4572, address: "5619 N 50th St, Tampa, FL 33610" },
  { id: 32, name: "SMART Local 32", city: "Fort Lauderdale", state: "FL", phone: null, website: "smw32.org", lat: 26.1224, lng: -80.1373, address: "Southern Florida" },
  { id: 435, name: "SMART Local 435", city: "Jacksonville", state: "FL", phone: null, website: "smart-union.org", lat: 30.3322, lng: -81.6557, address: "Jacksonville, FL" },

  // ── GEORGIA ──
  { id: 85, name: "SMART Local 85", city: "Atlanta", state: "GA", phone: null, website: "smart85.org", lat: 33.7490, lng: -84.3880, address: "Atlanta, GA" },

  // ── HAWAII ──
  { id: 293, name: "SMART Local 293", city: "Honolulu", state: "HI", phone: null, website: "hawaiisheetmetal.com", lat: 21.3069, lng: -157.8583, address: "Honolulu, HI" },

  // ── ILLINOIS ──
  { id: 1, name: "SMART Local 1", city: "Peoria", state: "IL", phone: "(309) 682-5677", website: "smartlu1.org", lat: 40.6936, lng: -89.5890, address: "840 W Birchwood, Morton, IL 61550" },
  { id: 73, name: "SMART Local 73", city: "Chicago", state: "IL", phone: null, website: "smw73.org", lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
  { id: 218, name: "SMART Local 218", city: "Springfield", state: "IL", phone: null, website: "smart218.org", lat: 39.7817, lng: -89.6501, address: "Springfield, IL" },
  { id: 219, name: "SMART Local 219", city: "Rockford", state: "IL", phone: null, website: "smwlocal219.com", lat: 42.2711, lng: -89.0940, address: "Rockford, IL" },
  { id: 265, name: "SMART Local 265", city: "Naperville", state: "IL", phone: null, website: "smart265.org", lat: 41.8508, lng: -88.0200, address: "DuPage County, IL" },
  { id: 268, name: "SMART Local 268", city: "Carbondale", state: "IL", phone: null, website: "local268.com", lat: 37.7270, lng: -89.2167, address: "Southern Illinois" },

  // ── INDIANA ──
  { id: 20, name: "SMART Local 20", city: "Indianapolis", state: "IN", phone: "(317) 549-6013", website: "smw20.com", lat: 39.7684, lng: -86.1581, address: "PO Box 20530, Indianapolis, IN 46220" },

  // ── IOWA ──
  { id: 91, name: "SMART Local 91", city: "Davenport", state: "IA", phone: null, website: "smw91.org", lat: 41.5236, lng: -90.5776, address: "Davenport, IA" },
  { id: 263, name: "SMART Local 263", city: "Cedar Rapids", state: "IA", phone: null, website: "smart263.org", lat: 41.9779, lng: -91.6656, address: "Cedar Rapids, IA" },

  // ── KANSAS ──
  { id: 29, name: "SMART Local 29", city: "Wichita", state: "KS", phone: null, website: "sheetmetal29.com", lat: 37.6872, lng: -97.3301, address: "Wichita, KS" },

  // ── KENTUCKY ──
  { id: 110, name: "SMART Local 110", city: "Louisville", state: "KY", phone: null, website: "smw110.com", lat: 38.2527, lng: -85.7585, address: "Louisville, KY" },

  // ── LOUISIANA ──
  { id: 214, name: "SMART Local 214", city: "Baton Rouge", state: "LA", phone: null, website: "smart-local214.org", lat: 30.4515, lng: -91.1871, address: "Baton Rouge, LA" },

  // ── MASSACHUSETTS ──
  { id: 17, name: "SMART Local 17", city: "Boston", state: "MA", phone: "(617) 296-1680", website: "smw17boston.org", lat: 42.2929, lng: -71.0636, address: "1157 Adams St, Dorchester, MA 02124" },
  { id: 63, name: "SMART Local 63", city: "Springfield", state: "MA", phone: null, website: "smwsmartlocal63.org", lat: 42.1015, lng: -72.5898, address: "Western Massachusetts" },

  // ── MICHIGAN ──
  { id: 7, name: "SMART Local 7", city: "Lansing", state: "MI", phone: "(517) 882-4064", website: "sheetmetal7.org", lat: 42.7335, lng: -84.5555, address: "4931 Contec Dr, Lansing, MI 48910" },
  { id: 80, name: "SMART Local 80", city: "Detroit", state: "MI", phone: null, website: "sheet80.org", lat: 42.4734, lng: -83.2219, address: "Detroit, MI" },
  { id: 292, name: "SMART Local 292", city: "Detroit", state: "MI", phone: null, website: "sheetmetal292.com", lat: 42.3314, lng: -83.0458, address: "Detroit, MI" },

  // ── MINNESOTA ──
  { id: 10, name: "SMART Local 10", city: "Maplewood", state: "MN", phone: "(651) 770-2388", website: "smw10.org", lat: 44.9536, lng: -93.0344, address: "1681 E Cope Ave Ste A, Maplewood, MN 55109" },

  // ── MISSOURI ──
  { id: 2, name: "SMART Local 2", city: "Kansas City", state: "MO", phone: "(816) 254-8021", website: "sheetmetal2.org", lat: 39.0997, lng: -94.5786, address: "PO Box 300378, Kansas City, MO 64130" },
  { id: 36, name: "SMART Local 36", city: "St. Louis", state: "MO", phone: null, website: "sheetmetal36.org", lat: 38.6270, lng: -90.1994, address: "St. Louis, MO" },

  // ── MONTANA ──
  { id: 103, name: "SMART Local 103", city: "Helena", state: "MT", phone: null, website: "smartlocal103.org", lat: 46.5958, lng: -112.0270, address: "Helena, MT" },

  // ── NEBRASKA ──
  { id: 3, name: "SMART Local 3", city: "Omaha", state: "NE", phone: "(402) 330-3383", website: "sheetmetalworkerslocal3.org", lat: 41.2223, lng: -96.0154, address: "3333 South 24th St, Omaha, NE 68108" },

  // ── NEVADA ──
  { id: 26, name: "SMART Local 26", city: "Sparks", state: "NV", phone: "(775) 352-9226", website: "smw26.com", lat: 39.5349, lng: -119.7527, address: "PO Box 26, Sparks, NV 89432" },
  { id: 88, name: "SMART Local 88", city: "Las Vegas", state: "NV", phone: null, website: "smart88.org", lat: 36.1699, lng: -115.1398, address: "Las Vegas, NV" },

  // ── NEW JERSEY ──
  { id: 22, name: "SMART Local 22", city: "Cranford", state: "NJ", phone: "(908) 931-1798", website: "smwialu22.org", lat: 40.6576, lng: -74.2998, address: "106 South Ave W, Cranford, NJ 07016" },
  { id: 25, name: "SMART Local 25", city: "Carlstadt", state: "NJ", phone: "(201) 507-0330", website: "smw25.org", lat: 40.8376, lng: -74.0921, address: "440 Barell Ave, Carlstadt, NJ 07072" },
  { id: 27, name: "SMART Local 27", city: "Farmingdale", state: "NJ", phone: "(732) 919-1999", website: "smwlu27.org", lat: 40.1987, lng: -74.1657, address: "PO Box 847, Farmingdale, NJ 07727" },

  // ── NEW MEXICO ──
  { id: 49, name: "SMART Local 49", city: "Albuquerque", state: "NM", phone: null, website: "smwlu49.org", lat: 35.0844, lng: -106.6504, address: "Albuquerque, NM" },

  // ── NEW YORK ──
  { id: 28, name: "SMART Local 28", city: "New York City", state: "NY", phone: "(212) 941-7700", website: "smart28.org", lat: 40.7265, lng: -74.0073, address: "500 Greenwich St 5th Floor, New York, NY 10013" },
  { id: 38, name: "SMART Local 38", city: "Brewster", state: "NY", phone: "(845) 278-6868", website: "smart38.org", lat: 41.3987, lng: -73.6179, address: "38 Starr Ridge Rd, Brewster, NY 10509" },
  { id: 46, name: "SMART Local 46", city: "Rochester", state: "NY", phone: null, website: "smw46.com", lat: 43.1610, lng: -77.6109, address: "Rochester, NY" },
  { id: 58, name: "SMART Local 58", city: "Syracuse", state: "NY", phone: null, website: "smw58.org", lat: 43.0481, lng: -76.1474, address: "Syracuse, NY" },
  { id: 71, name: "SMART Local 71", city: "Buffalo", state: "NY", phone: null, website: "smartlocal71.com", lat: 42.8864, lng: -78.8784, address: "Buffalo, NY" },
  { id: 83, name: "SMART Local 83", city: "Albany", state: "NY", phone: null, website: "smwlocal83.org", lat: 42.6526, lng: -73.7562, address: "Albany, NY" },
  { id: 112, name: "SMART Local 112", city: "Elmira", state: "NY", phone: null, website: "smw112.org", lat: 42.0898, lng: -76.8077, address: "Elmira, NY" },
  { id: 137, name: "SMART Local 137", city: "New York City", state: "NY", phone: null, website: "smart137.com", lat: 40.7580, lng: -73.9855, address: "New York, NY" },

  // ── OHIO ──
  { id: 24, name: "SMART Local 24", city: "Dayton", state: "OH", phone: "(937) 277-9303", website: "smw24.org", lat: 39.7795, lng: -84.1996, address: "6550 Poe Ave, Dayton, OH 45414" },
  { id: 33, name: "SMART Local 33", city: "Cleveland", state: "OH", phone: null, website: "smwlu33.org", lat: 41.4993, lng: -81.6944, address: "Northern Ohio" },

  // ── OKLAHOMA ──
  { id: 124, name: "SMART Local 124", city: "Oklahoma City", state: "OK", phone: null, website: "smw124.com", lat: 35.4676, lng: -97.5164, address: "Oklahoma City, OK" },
  { id: 270, name: "SMART Local 270", city: "Tulsa", state: "OK", phone: null, website: "smart-union.org", lat: 36.1540, lng: -95.9928, address: "Tulsa, OK" },

  // ── OREGON ──
  { id: 16, name: "SMART Local 16", city: "Portland", state: "OR", phone: "(503) 254-0123", website: "smw16.org", lat: 45.5601, lng: -122.5085, address: "2379 NE 178th Ave, Portland, OR 97230" },

  // ── PENNSYLVANIA ──
  { id: 12, name: "SMART Local 12", city: "Pittsburgh", state: "PA", phone: "(412) 828-5300", website: "smlocal12.org", lat: 40.5001, lng: -79.8969, address: "1200 Gulf Lab Rd, Pittsburgh, PA 15238" },
  { id: 19, name: "SMART Local 19", city: "Philadelphia", state: "PA", phone: "(215) 952-1999", website: "smartlu19.org", lat: 39.9350, lng: -75.1411, address: "1301 S Columbus Blvd, Philadelphia, PA 19147" },
  { id: 44, name: "SMART Local 44", city: "Scranton", state: "PA", phone: null, website: "smwlu44.org", lat: 41.4090, lng: -75.6624, address: "Northeastern PA" },

  // ── SOUTH CAROLINA ──
  { id: 399, name: "SMART Local 399", city: "Charleston", state: "SC", phone: null, website: "sheetmetallocal399.com", lat: 32.7765, lng: -79.9311, address: "Charleston, SC" },

  // ── TENNESSEE ──
  { id: 4, name: "SMART Local 4", city: "Memphis", state: "TN", phone: "(901) 278-7288", website: "smwlocal4.org", lat: 35.2115, lng: -89.9793, address: "6735 Whitten Place, Memphis, TN 38133" },
  { id: 5, name: "SMART Local 5", city: "Knoxville", state: "TN", phone: "(865) 689-2928", website: "sheetmetal5.org", lat: 36.0414, lng: -83.9272, address: "112 Hillcrest Dr, Knoxville, TN 37918" },
  { id: 177, name: "SMART Local 177", city: "Nashville", state: "TN", phone: null, website: "sheetmetal177.com", lat: 36.1627, lng: -86.7816, address: "Nashville, TN" },

  // ── TEXAS ──
  { id: 54, name: "SMART Local 54", city: "Houston", state: "TX", phone: null, website: "smart-local54.org", lat: 29.7604, lng: -95.3698, address: "Houston, TX" },
  { id: 67, name: "SMART Local 67", city: "San Antonio", state: "TX", phone: null, website: "smart-local67.org", lat: 29.4241, lng: -98.4936, address: "San Antonio, TX" },
  { id: 68, name: "SMART Local 68", city: "Dallas", state: "TX", phone: null, website: "localunion68.com", lat: 32.7767, lng: -96.7970, address: "Dallas/Fort Worth, TX" },

  // ── UTAH ──
  { id: 312, name: "SMART Local 312", city: "Salt Lake City", state: "UT", phone: null, website: "utahsheetmetal.com", lat: 40.7608, lng: -111.8910, address: "Salt Lake City, UT" },

  // ── VIRGINIA / DC / MD ──
  { id: 100, name: "SMART Local 100", city: "Washington DC Area", state: "VA", phone: null, website: "smart100.org", lat: 38.8951, lng: -77.0364, address: "Washington DC, Maryland and Virginia" },

  // ── WASHINGTON ──
  { id: 55, name: "SMART Local 55", city: "Pasco", state: "WA", phone: null, website: "smw55.org", lat: 46.2396, lng: -119.1006, address: "Pasco, WA" },
  { id: 66, name: "SMART Local 66", city: "Seattle", state: "WA", phone: null, website: "smw66.org", lat: 47.6062, lng: -122.3321, address: "Seattle, WA" },

  // ── WISCONSIN ──
  { id: 18, name: "SMART Local 18", city: "Waukesha", state: "WI", phone: "(262) 798-1818", website: "smwlu18.org", lat: 43.0117, lng: -88.2315, address: "2201 Springdale Rd, Waukesha, WI 53186" },
];
// ─── BAC LOCAL DATABASE — Bricklayers & Allied Craftworkers ──────────────────
// All data verified from bacweb.org official directory
const BAC_LOCALS = [
  // ── ALABAMA / SOUTHEAST ──
  { id: 8, name: "BAC Local 8 Southeast", city: "Atlanta", state: "GA", phone: "(404) 893-5809", website: "baclocal8se.org", lat: 33.7490, lng: -84.3880, address: "501 Pulliam St SW Suite 319, Atlanta, GA 30312" },

  // ── CALIFORNIA ──
  { id: 3, name: "BAC Local 3 California", city: "Oakland", state: "CA", phone: "(510) 632-8781", website: "bac3-ca.org", lat: 37.8044, lng: -122.2712, address: "8201 Capwell Dr, Oakland, CA 94621" },
  { id: 4, name: "BAC Local 4 California", city: "La Verne", state: "CA", phone: "(626) 739-5600", website: "bac4ca.org", lat: 34.1008, lng: -117.7678, address: "2679 Sierra Way, La Verne, CA 91750" },

  // ── CONNECTICUT ──
  { id: 1, name: "BAC Local 1 Connecticut", city: "Wallingford", state: "CT", phone: "(203) 697-0820", website: "baclocal1ct.com", lat: 41.4567, lng: -72.8231, address: "17 North Plains Industrial Rd, Wallingford, CT 06492" },

  // ── HAWAII ──
  { id: 1, name: "BAC Local 1 Hawaii", city: "Honolulu", state: "HI", phone: "(808) 841-8822", website: "hawaiimasonsunion.org", lat: 21.3069, lng: -157.8583, address: "2251 North School St, Honolulu, HI 96819" },

  // ── ILLINOIS ──
  { id: 8, name: "BAC Local 8 Illinois", city: "O'Fallon", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 38.5895, lng: -89.9117, address: "715 Lakepointe Centre, O'Fallon, IL 62269" },
  { id: 8, name: "BAC Local 8 Illinois", city: "Springfield", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 39.7817, lng: -89.6501, address: "Springfield, IL" },
  { id: 8, name: "BAC Local 8 Illinois", city: "Champaign", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 40.1164, lng: -88.2434, address: "Champaign, IL" },
  { id: 8, name: "BAC Local 8 Illinois", city: "Murphysboro", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 37.7645, lng: -89.3351, address: "Murphysboro, IL" },
  { id: 8, name: "BAC Local 8 Illinois", city: "Jacksonville", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 39.7345, lng: -90.2290, address: "Jacksonville, IL" },
  { id: 8, name: "BAC Local 8 Illinois", city: "Effingham", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 39.1203, lng: -88.5434, address: "Effingham, IL" },
  { id: 8, name: "BAC Local 8 Illinois", city: "Belleville", state: "IL", phone: "(618) 234-5340", website: "bac8il.com", lat: 38.5201, lng: -89.9840, address: "Belleville, IL" },
  { id: 21, name: "BAC ADC 1 Illinois", city: "Elmhurst", state: "IL", phone: "(630) 941-2300", website: "bacadc1.org", lat: 41.8994, lng: -87.9401, address: "660 N Industrial Dr, Elmhurst, IL 60126" },
  { id: 21, name: "BAC Local 21 Illinois", city: "Chicago", state: "IL", phone: "(312) 421-1997", website: "baclocal21.com", lat: 41.8781, lng: -87.6298, address: "2522 W. 35th Street, Chicago, IL 60632" },

  // ── INDIANA / KENTUCKY ──
  { id: 4, name: "BAC Local 4 Indiana/Kentucky", city: "Indianapolis", state: "IN", phone: "(800) 322-2830", website: "baclocal4.org", lat: 39.7684, lng: -86.1581, address: "8455 Moller Rd, Indianapolis, IN 46268" },

  // ── IOWA ──
  { id: 3, name: "BAC Local 3 Iowa", city: "Marshalltown", state: "IA", phone: "(515) 557-0551", website: "baclocal3ia.org", lat: 42.0494, lng: -92.9077, address: "601 S 12th Ave, Marshalltown, IA 50158" },

  // ── MARYLAND / VIRGINIA / DC ──
  { id: 1, name: "BAC Local 1 MD/VA/DC", city: "Laurel", state: "MD", phone: "(240) 695-9463", website: "baclocal1.org", lat: 39.0993, lng: -76.8483, address: "305 Compton Ave, Laurel, MD 20707" },

  // ── MASSACHUSETTS / ME / NH / RI ──
  { id: 3, name: "BAC Local 3 MA/ME/NH/RI", city: "Charlestown", state: "MA", phone: "(617) 242-5500", website: "local3bac.org", lat: 42.3764, lng: -71.0603, address: "550 Medford St, Charlestown, MA 02129" },

  // ── MICHIGAN ──
  { id: 2, name: "BAC Local 2 Michigan", city: "Warren", state: "MI", phone: "(586) 754-0888", website: "bricklayers.org", lat: 42.4775, lng: -83.0277, address: "21031 Ryan Rd, Warren, MI 48091" },

  // ── MINNESOTA / ND / SD ──
  { id: 1, name: "BAC Local 1 MN/ND/SD", city: "Minneapolis", state: "MN", phone: "(612) 845-3136", website: "bac1mn-nd.org", lat: 44.9778, lng: -93.2650, address: "312 Central Ave Room 328, Minneapolis, MN 55414" },

  // ── MISSOURI / KANSAS / NEBRASKA ──
  { id: 15, name: "BAC Local 15 MO/KS/NE", city: "Kansas City", state: "MO", phone: "(816) 241-6695", website: "baclocal15.org", lat: 39.0997, lng: -94.5786, address: "632 W 39th St, Kansas City, MO 64111" },
  { id: 0, name: "BAC ADC Eastern Missouri", city: "Fenton", state: "MO", phone: "(314) 621-5560", website: "bacstl.com", lat: 38.5139, lng: -90.4432, address: "1670 Fenpark Dr, Fenton, MO 63026" },

  // ── NEVADA / MOUNTAIN WEST ──
  { id: 0, name: "BAC Mountain West ADC", city: "Las Vegas", state: "NV", phone: "(702) 873-0332", website: "bacmwadc.org", lat: 36.1699, lng: -115.1398, address: "3900 W Quail Ave, Las Vegas, NV 89118" },

  // ── NEW JERSEY ──
  { id: 0, name: "BAC ADC New Jersey", city: "Bordentown", state: "NJ", phone: "(609) 324-9681", website: "bacnj.com", lat: 40.1454, lng: -74.7157, address: "3281 Route 206, Bordentown, NJ 08505" },

  // ── NEW YORK ──
  { id: 1, name: "BAC Local 1 New York", city: "Long Island City", state: "NY", phone: "(718) 392-0525", website: "bricklayersandalliedcraftworkerslocal1ny.org", lat: 40.7440, lng: -73.9485, address: "4 Court Square West, Long Island City, NY 11101" },
  { id: 2, name: "BAC Local 2 NY/VT", city: "Albany", state: "NY", phone: "(518) 466-5885", website: "baclocal2nyvt.org", lat: 42.6526, lng: -73.7562, address: "302 Centre Dr, Albany, NY 12203" },
  { id: 3, name: "BAC Local 3 New York", city: "Rochester", state: "NY", phone: "(716) 604-2334", website: "bac3ny.com", lat: 43.1610, lng: -77.6109, address: "33 Saginaw Dr, Rochester, NY 14623" },
  { id: 7, name: "BAC Local 7 NY/NJ", city: "Long Island City", state: "NY", phone: "(917) 734-8390", website: "baclocal7.org", lat: 40.7480, lng: -73.9490, address: "45-34 Court Square, Long Island City, NY 11101" },

  // ── OHIO / WV / KY ──
  { id: 23, name: "BAC Local 23 OH/WV/KY", city: "Amherst", state: "OH", phone: "(440) 986-3000", website: "23bricks.org", lat: 41.4000, lng: -82.2246, address: "8497 Leavitt Rd, Amherst, OH 44001" },

  // ── OKLAHOMA / AR / TX / NM ──
  { id: 5, name: "BAC Local 5 OK/AR/TX/NM", city: "Oklahoma City", state: "OK", phone: "(405) 528-5609", website: "baclocal5.com", lat: 35.4676, lng: -97.5164, address: "212 NE 27th St, Oklahoma City, OK 73105" },

  // ── OREGON / WA / ID / MT ──
  { id: 1, name: "BAC Local 1 OR/WA/ID/MT", city: "Portland", state: "OR", phone: "(503) 232-0358", website: "bac1or.org", lat: 45.5231, lng: -122.6765, address: "12812 NE Marx St, Portland, OR 97230" },

  // ── PENNSYLVANIA / DELAWARE ──
  { id: 1, name: "BAC Local 1 PA/DE", city: "Philadelphia", state: "PA", phone: "(215) 856-9505", website: "bac1pa-de.org", lat: 39.9526, lng: -75.1652, address: "2706 Black Lake Place, Philadelphia, PA 19154" },
  { id: 5, name: "BAC Local 5 Pennsylvania", city: "Harrisburg", state: "PA", phone: "(717) 564-6460", website: "baclocal5pa.org", lat: 40.2732, lng: -76.8867, address: "733 Firehouse Ln, Harrisburg, PA 17111" },
  { id: 9, name: "BAC Local 9 Pennsylvania", city: "Pittsburgh", state: "PA", phone: "(412) 860-8390", website: "local9pa.com", lat: 40.4406, lng: -79.9959, address: "100 Kingston Dr, Pittsburgh, PA 15235" },

  // ── WASHINGTON / ALASKA ──
  { id: 1, name: "BAC Local 1 WA/AK", city: "Tukwila", state: "WA", phone: "(206) 248-2456", website: "bac1wa-ak.org", lat: 47.4740, lng: -122.2621, address: "15208 52nd Ave S Suite 120, Tukwila, WA 98188" },

  // ── WISCONSIN ──
  { id: 0, name: "BAC Wisconsin District Council", city: "New Berlin", state: "WI", phone: "(262) 827-4080", website: "bacwi.org", lat: 42.9764, lng: -88.1081, address: "New Berlin, WI 53151" },
];

// ─── UBC LOCAL DATABASE — United Brotherhood of Carpenters ───────────────────
// Only verified phones/websites from official regional council directories
const UBC_LOCALS = [
  // ── ALASKA ──
  { id: 1281, name: "UBC Local 1281", city: "Anchorage",       state: "AK", phone: null,               website: "wsbuildsbetter.com",   lat: 61.2181, lng: -149.9003, address: "Anchorage, AK" },
  { id: 1243, name: "UBC Local 1243", city: "Fairbanks",       state: "AK", phone: null,               website: "wsbuildsbetter.com",   lat: 64.8378, lng: -147.7164, address: "Fairbanks, AK" },

  // ── CALIFORNIA ──
  { id: 22,   name: "UBC Local 22",   city: "San Francisco",  state: "CA", phone: "(415) 355-1322",    website: "local22.org",          lat: 37.7614, lng: -122.3873, address: "2085 Third St, San Francisco, CA 94107" },
  { id: 34,   name: "UBC Local 34",   city: "Oakland",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.7392, lng: -122.1944, address: "265 Hegenberger Rd, Oakland, CA 94621" },
  { id: 35,   name: "UBC Local 35",   city: "San Rafael",     state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.9735, lng: -122.5311, address: "San Rafael, CA" },
  { id: 46,   name: "UBC Local 46",   city: "Sacramento",     state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 38.5816, lng: -121.4944, address: "Sacramento, CA" },
  { id: 152,  name: "UBC Local 152",  city: "Manteca",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.7974, lng: -121.2161, address: "Manteca, CA" },
  { id: 152,  name: "UBC Local 152",  city: "Martinez",       state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.9935, lng: -122.1341, address: "Martinez, CA" },
  { id: 180,  name: "UBC Local 180",  city: "Vallejo",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 38.1040, lng: -122.2566, address: "Vallejo, CA" },
  { id: 213,  name: "UBC Local 213",  city: "Monterey Park",  state: "CA", phone: null,               website: "wsbuildsbetter.com",   lat: 34.0625, lng: -118.1228, address: "Monterey Park, CA" },
  { id: 217,  name: "UBC Local 217",  city: "San Mateo",      state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.5630, lng: -122.3255, address: "San Mateo, CA" },
  { id: 405,  name: "UBC Local 405",  city: "San Jose",       state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.2319, lng: -121.7958, address: "San Jose, CA" },
  { id: 505,  name: "UBC Local 505",  city: "Santa Cruz",     state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 36.9741, lng: -122.0308, address: "Santa Cruz, CA" },
  { id: 562,  name: "UBC Local 562",  city: "Los Angeles",    state: "CA", phone: null,               website: "wsbuildsbetter.com",   lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  { id: 605,  name: "UBC Local 605",  city: "Marina",         state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 36.6850, lng: -121.8025, address: "Marina, CA" },
  { id: 619,  name: "UBC Local 619",  city: "San Diego",      state: "CA", phone: null,               website: "wsbuildsbetter.com",   lat: 32.7157, lng: -117.1611, address: "San Diego, CA" },
  { id: 661,  name: "UBC Local 661",  city: "Sylmar",         state: "CA", phone: null,               website: "wsbuildsbetter.com",   lat: 34.3027, lng: -118.4530, address: "Sylmar, CA" },
  { id: 701,  name: "UBC Local 701",  city: "Fresno",         state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 36.7468, lng: -119.7726, address: "Fresno, CA" },
  { id: 713,  name: "UBC Local 713",  city: "Hayward",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.6688, lng: -122.0808, address: "Hayward, CA" },
  { id: 714,  name: "UBC Local 714",  city: "Buena Park",     state: "CA", phone: null,               website: "wsbuildsbetter.com",   lat: 33.8672, lng: -117.9981, address: "Buena Park, CA" },
  { id: 751,  name: "UBC Local 751",  city: "Santa Rosa",     state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 38.4404, lng: -122.7141, address: "Santa Rosa, CA" },
  { id: 805,  name: "UBC Local 805",  city: "Camarillo",      state: "CA", phone: null,               website: "wsbuildsbetter.com",   lat: 34.2164, lng: -119.0376, address: "Camarillo, CA" },
  { id: 1109, name: "UBC Local 1109", city: "Visalia",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 36.3302, lng: -119.2921, address: "Visalia, CA" },
  { id: 1599, name: "UBC Local 1599", city: "Redding",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 40.5865, lng: -122.3917, address: "Redding, CA" },
  { id: 1789, name: "UBC Local 1789", city: "Lake Tahoe",     state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 38.9399, lng: -119.9772, address: "South Lake Tahoe, CA" },
  { id: 2236, name: "UBC Local 2236", city: "Oakland",        state: "CA", phone: "(510) 568-4788",    website: "nccrc.org",            lat: 37.8044, lng: -122.2712, address: "Oakland, CA" },

  // ── GEORGIA ──
  { id: 225,  name: "UBC Local 225",  city: "Atlanta",        state: "GA", phone: null,               website: "atlantacarpenters.com", lat: 33.6888, lng: -84.4710, address: "3500 Atlanta Industrial Dr, Atlanta, GA 30331" },
  { id: 256,  name: "UBC Local 256",  city: "Savannah",       state: "GA", phone: null,               website: "southeasterncarpenters.org", lat: 32.0835, lng: -81.0998, address: "40 Telfair Place, Savannah, GA 31415" },
  { id: 283,  name: "UBC Local 283",  city: "Augusta",        state: "GA", phone: "(706) 722-4445",    website: "carpenterslocalunion283.org", lat: 33.4998, lng: -82.0529, address: "3025 Riverwatch Pkwy, Augusta, GA 30907" },

  // ── IDAHO ──
  { id: 808,  name: "UBC Local 808",  city: "Idaho Falls",    state: "ID", phone: null,               website: "wsbuildsbetter.com",   lat: 43.4926, lng: -112.0408, address: "Idaho Falls, ID" },

  // ── ILLINOIS ──
  { id: 237,  name: "UBC Local 237",  city: "Peoria",         state: "IL", phone: null,               website: "nmcarpenters.com",     lat: 40.6936, lng: -89.5890, address: "Peoria, IL" },
  { id: 243,  name: "UBC Local 243",  city: "Champaign",      state: "IL", phone: null,               website: "nmcarpenters.com",     lat: 40.1164, lng: -88.2434, address: "Champaign, IL" },
  { id: 270,  name: "UBC Local 270",  city: "Springfield",    state: "IL", phone: null,               website: "nmcarpenters.com",     lat: 39.7817, lng: -89.6501, address: "Springfield, IL" },

  // ── INDIANA ──
  { id: 133,  name: "UBC Local 133",  city: "Terre Haute",    state: "IN", phone: "(812) 232-6035",    website: "cmwcarpenters.com",    lat: 39.4667, lng: -87.4139, address: "Terre Haute, IN" },
  { id: 215,  name: "UBC Local 215",  city: "Lafayette",      state: "IN", phone: "(765) 477-1215",    website: "cmwcarpenters.com",    lat: 40.4167, lng: -86.8753, address: "Lafayette, IN" },
  { id: 224,  name: "UBC Local 224",  city: "Evansville",     state: "IN", phone: "(812) 490-0500",    website: "cmwcarpenters.com",    lat: 37.9716, lng: -87.5711, address: "Evansville, IN" },
  { id: 232,  name: "UBC Local 232",  city: "Fort Wayne",     state: "IN", phone: "(260) 484-1803",    website: "cmwcarpenters.com",    lat: 41.1306, lng: -85.1280, address: "1520 Profit Dr, Fort Wayne, IN 46808" },
  { id: 301,  name: "UBC Local 301",  city: "Indianapolis",   state: "IN", phone: "(317) 632-9780",    website: "cmwcarpenters.com",    lat: 39.7045, lng: -86.0716, address: "3530 S Rural St, Indianapolis, IN 46237" },
  { id: 413,  name: "UBC Local 413",  city: "South Bend",     state: "IN", phone: "(574) 233-2138",    website: "cmwcarpenters.com",    lat: 41.6764, lng: -86.2520, address: "South Bend, IN" },
  { id: 599,  name: "UBC Local 599",  city: "Griffith",       state: "IN", phone: "(219) 942-0518",    website: "cmwcarpenters.com",    lat: 41.5281, lng: -87.4237, address: "Griffith, IN" },
  { id: 615,  name: "UBC Local 615",  city: "Kokomo",         state: "IN", phone: "(765) 236-0082",    website: "cmwcarpenters.com",    lat: 40.4864, lng: -86.1336, address: "Kokomo, IN" },
  { id: 1016, name: "UBC Local 1016", city: "Muncie",         state: "IN", phone: "(765) 288-7568",    website: "cmwcarpenters.com",    lat: 40.1934, lng: -85.3864, address: "Muncie, IN" },
  { id: 1076, name: "UBC Local 1076", city: "Greenwood",      state: "IN", phone: null,               website: "cmwcarpenters.com",    lat: 39.6134, lng: -86.1067, address: "Greenwood, IN" },

  // ── KENTUCKY ──
  { id: 175,  name: "UBC Local 175",  city: "Louisville",     state: "KY", phone: null,               website: "carpenters.org",       lat: 38.2527, lng: -85.7585, address: "Louisville, KY" },

  // ── MARYLAND ──
  { id: 197,  name: "UBC Local 197",  city: "Marlboro",       state: "MD", phone: null,               website: "carpenters.org",       lat: 38.8407, lng: -76.7491, address: "Upper Marlboro, MD" },

  // ── MASSACHUSETTS ──
  { id: 327,  name: "UBC Local 327",  city: "Boston",         state: "MA", phone: "(617) 379-5600",    website: "nasrcc.org",           lat: 42.2929, lng: -71.0636, address: "1252 Massachusetts Ave, Dorchester, MA 02125" },
  { id: 336,  name: "UBC Local 336",  city: "Springfield",    state: "MA", phone: "(413) 505-5051",    website: "nasrcc.org",           lat: 42.1015, lng: -72.5898, address: "29 Oakland St, Springfield, MA 01108" },
  { id: 339,  name: "UBC Local 339",  city: "Wilmington",     state: "MA", phone: "(978) 229-5200",    website: "nasrcc.org",           lat: 42.5454, lng: -71.1728, address: "350 Fordham Rd, Wilmington, MA 01887" },

  // ── MAINE / NH / VT ──
  { id: 349,  name: "UBC Local 349",  city: "New England",    state: "ME", phone: "(617) 268-3400",    website: "nasrcc.org",           lat: 44.3106, lng: -69.7795, address: "ME, NH, VT" },

  // ── MICHIGAN ──
  { id: 100,  name: "UBC Local 100",  city: "Wayland",        state: "MI", phone: null,               website: "nmcarpenters.com",     lat: 42.6734, lng: -85.6444, address: "Wayland, MI" },
  { id: 315,  name: "UBC Local 315",  city: "Kansas City",    state: "MI", phone: null,               website: "nmcarpenters.com",     lat: 42.1695, lng: -85.0086, address: "Michigan" },
  { id: 687,  name: "UBC Local 687",  city: "Detroit",        state: "MI", phone: null,               website: "nmcarpenters.com",     lat: 42.3314, lng: -83.0458, address: "Detroit, MI" },
  { id: 706,  name: "UBC Local 706",  city: "Saginaw",        state: "MI", phone: null,               website: "nmcarpenters.com",     lat: 43.4195, lng: -83.9508, address: "Saginaw, MI" },
  { id: 706,  name: "UBC Local 706",  city: "Flint",          state: "MI", phone: null,               website: "nmcarpenters.com",     lat: 43.0125, lng: -83.6875, address: "Flint, MI" },

  // ── MINNESOTA ──
  { id: 322,  name: "UBC Local 322",  city: "St. Paul",       state: "MN", phone: null,               website: "carpenters322.org",    lat: 44.9486, lng: -93.1029, address: "730 Olive St, Saint Paul, MN 55130" },
  { id: 606,  name: "UBC Local 606",  city: "Virginia",       state: "MN", phone: null,               website: "nmcarpenters.com",     lat: 47.5230, lng: -92.5380, address: "Virginia, MN" },

  // ── MISSOURI ──
  { id: 945,  name: "UBC Local 945",  city: "Springfield",    state: "MO", phone: null,               website: "nmcarpenters.com",     lat: 37.2153, lng: -93.2982, address: "Springfield, MO" },
  { id: 1127, name: "UBC Local 1127", city: "Kansas City",    state: "MO", phone: null,               website: "nmcarpenters.com",     lat: 39.0997, lng: -94.5786, address: "Kansas City, MO" },

  // ── MONTANA ──
  { id: 82,   name: "UBC Local 82",   city: "Great Falls",    state: "MT", phone: null,               website: "wsbuildsbetter.com",   lat: 47.5002, lng: -111.3008, address: "Great Falls, MT" },

  // ── NEVADA ──
  { id: 971,  name: "UBC Local 971",  city: "Reno",           state: "NV", phone: null,               website: "wsbuildsbetter.com",   lat: 39.5296, lng: -119.8138, address: "Reno, NV" },

  // ── NEW JERSEY ──
  { id: 254,  name: "UBC Local 254",  city: "Edison",         state: "NJ", phone: null,               website: "ubclocal255.org",      lat: 40.5187, lng: -74.4121, address: "Edison, NJ" },
  { id: 255,  name: "UBC Local 255",  city: "Hammonton",      state: "NJ", phone: null,               website: "ubclocal255.org",      lat: 39.6418, lng: -74.7996, address: "Hammonton, NJ" },

  // ── NEW YORK ──
  { id: 276,  name: "UBC Local 276",  city: "Rochester",      state: "NY", phone: null,               website: "carpenters.org",       lat: 43.1610, lng: -77.6109, address: "Cheektowaga, NY" },
  { id: 277,  name: "UBC Local 277",  city: "New York State", state: "NY", phone: null,               website: "carpenters.org",       lat: 42.0987, lng: -75.9180, address: "Binghamton, NY" },
  { id: 740,  name: "UBC Local 740",  city: "Long Island",    state: "NY", phone: null,               website: "carpenters.org",       lat: 40.7282, lng: -73.7949, address: "Woodhaven, NY" },
  { id: 1556, name: "UBC Local 1556", city: "New York City",  state: "NY", phone: null,               website: "carpenters.org",       lat: 40.7128, lng: -74.0059, address: "New York, NY" },

  // ── OHIO ──
  { id: 186,  name: "UBC Local 186",  city: "Steubenville",   state: "OH", phone: null,               website: "carpenters.org",       lat: 40.3698, lng: -80.6342, address: "Steubenville, OH" },
  { id: 285,  name: "UBC Local 285",  city: "North Canton",   state: "OH", phone: null,               website: "carpenters.org",       lat: 40.8751, lng: -81.4026, address: "North Canton, OH" },
  { id: 351,  name: "UBC Local 351",  city: "Rossford",       state: "OH", phone: null,               website: "carpenters.org",       lat: 41.6031, lng: -83.5641, address: "Rossford, OH" },
  { id: 373,  name: "UBC Local 373",  city: "Cleveland",      state: "OH", phone: null,               website: "carpenters.org",       lat: 41.4993, lng: -81.6944, address: "Cleveland, OH" },
  { id: 435,  name: "UBC Local 435",  city: "Cleveland",      state: "OH", phone: null,               website: "carpenters.org",       lat: 41.5500, lng: -81.6000, address: "Cleveland, OH" },
  { id: 1090, name: "UBC Local 1090", city: "Akron",          state: "OH", phone: null,               website: "carpenters.org",       lat: 41.0814, lng: -81.5190, address: "Akron, OH" },

  // ── OREGON ──
  { id: 541,  name: "UBC Local 541",  city: "Hermiston",      state: "OR", phone: null,               website: "wsbuildsbetter.com",   lat: 45.8407, lng: -119.2892, address: "Hermiston, OR" },
  { id: 1503, name: "UBC Local 1503", city: "Oregon City",    state: "OR", phone: null,               website: "wsbuildsbetter.com",   lat: 45.3573, lng: -122.6068, address: "Oregon City, OR" },

  // ── PENNSYLVANIA ──
  { id: 158,  name: "UBC Local 158",  city: "Philadelphia",   state: "PA", phone: null,               website: "carpenters.org",       lat: 39.9526, lng: -75.1652, address: "Philadelphia, PA" },
  { id: 432,  name: "UBC Local 432",  city: "Pittsburgh",     state: "PA", phone: null,               website: "carpenters.org",       lat: 40.4406, lng: -79.9959, address: "Pittsburgh, PA" },

  // ── RHODE ISLAND ──
  { id: 330,  name: "UBC Local 330",  city: "Warwick",        state: "RI", phone: "(401) 424-1100",    website: "carpenters330.org",    lat: 41.7001, lng: -71.4162, address: "14 Jefferson Park Rd, Warwick, RI 02888" },

  // ── TENNESSEE ──
  { id: 74,   name: "UBC Local 74",   city: "Chattanooga",    state: "TN", phone: null,               website: "southeasterncarpenters.org", lat: 35.0456, lng: -85.3097, address: "Chattanooga, TN" },
  { id: 223,  name: "UBC Local 223",  city: "Nashville",      state: "TN", phone: null,               website: "southeasterncarpenters.org", lat: 36.1627, lng: -86.7816, address: "130 Veterans Memorial Pkwy, La Vergne, TN 37086" },

  // ── WASHINGTON ──
  { id: 59,   name: "UBC Local 59",   city: "Spokane",        state: "WA", phone: null,               website: "wsbuildsbetter.com",   lat: 47.6588, lng: -117.4260, address: "Spokane, WA" },
  { id: 70,   name: "UBC Local 70",   city: "Mount Vernon",   state: "WA", phone: null,               website: "wsbuildsbetter.com",   lat: 48.4200, lng: -122.3343, address: "Mount Vernon, WA" },
  { id: 129,  name: "UBC Local 129",  city: "Lacey",          state: "WA", phone: "(360) 459-0359",    website: "spscarpenters129.org", lat: 47.0343, lng: -122.8232, address: "4224 6th Ave SE, Lacey, WA 98503" },
  { id: 625,  name: "UBC Local 625",  city: "Seattle",        state: "WA", phone: null,               website: "wsbuildsbetter.com",   lat: 47.6062, lng: -122.3321, address: "Seattle, WA" },

  // ── WISCONSIN ──
  { id: 161,  name: "UBC Local 161",  city: "Kenosha",        state: "WI", phone: null,               website: "nmcarpenters.com",     lat: 42.5847, lng: -87.8212, address: "Kenosha, WI" },
  { id: 344,  name: "UBC Local 344",  city: "Pewaukee",       state: "WI", phone: null,               website: "nmcarpenters.com",     lat: 43.0800, lng: -88.2587, address: "Pewaukee, WI" },
];

function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── STATE CENTER COORDINATES ────────────────────────────────────────────────
const STATE_CENTERS = {
  AL:{lat:32.806,lng:-86.791},AK:{lat:61.370,lng:-152.404},AZ:{lat:33.729,lng:-111.431},
  AR:{lat:34.969,lng:-92.373},CA:{lat:36.778,lng:-119.418},CO:{lat:39.113,lng:-105.358},
  CT:{lat:41.597,lng:-72.755},DE:{lat:39.318,lng:-75.507},FL:{lat:27.664,lng:-81.515},
  GA:{lat:32.678,lng:-83.223},HI:{lat:21.094,lng:-157.498},ID:{lat:44.240,lng:-114.478},
  IL:{lat:40.349,lng:-88.986},IN:{lat:39.849,lng:-86.258},IA:{lat:42.011,lng:-93.210},
  KS:{lat:38.526,lng:-96.726},KY:{lat:37.668,lng:-84.670},LA:{lat:31.169,lng:-91.867},
  ME:{lat:44.693,lng:-69.381},MD:{lat:39.063,lng:-76.802},MA:{lat:42.230,lng:-71.530},
  MI:{lat:43.326,lng:-84.536},MN:{lat:45.694,lng:-93.900},MS:{lat:32.741,lng:-89.678},
  MO:{lat:38.456,lng:-92.288},MT:{lat:46.921,lng:-110.454},NE:{lat:41.125,lng:-98.268},
  NV:{lat:38.313,lng:-117.055},NH:{lat:43.452,lng:-71.563},NJ:{lat:40.298,lng:-74.521},
  NM:{lat:34.840,lng:-106.248},NY:{lat:42.165,lng:-74.948},NC:{lat:35.630,lng:-79.806},
  ND:{lat:47.528,lng:-99.784},OH:{lat:40.388,lng:-82.764},OK:{lat:35.565,lng:-96.928},
  OR:{lat:44.572,lng:-122.070},PA:{lat:40.590,lng:-77.209},RI:{lat:41.680,lng:-71.511},
  SC:{lat:33.856,lng:-80.945},SD:{lat:44.299,lng:-99.438},TN:{lat:35.747,lng:-86.692},
  TX:{lat:31.054,lng:-97.563},UT:{lat:40.150,lng:-111.862},VT:{lat:44.045,lng:-72.710},
  VA:{lat:37.769,lng:-78.169},WA:{lat:47.400,lng:-121.490},WV:{lat:38.491,lng:-80.954},
  WI:{lat:44.268,lng:-89.616},WY:{lat:42.755,lng:-107.302},DC:{lat:38.907,lng:-77.036},
};

const STATE_NAMES = {
  alabama:"AL",alaska:"AK",arizona:"AZ",arkansas:"AR",california:"CA",colorado:"CO",
  connecticut:"CT",delaware:"DE",florida:"FL",georgia:"GA",hawaii:"HI",idaho:"ID",
  illinois:"IL",indiana:"IN",iowa:"IA",kansas:"KS",kentucky:"KY",louisiana:"LA",
  maine:"ME",maryland:"MD",massachusetts:"MA",michigan:"MI",minnesota:"MN",
  mississippi:"MS",missouri:"MO",montana:"MT",nebraska:"NE",nevada:"NV",
  "new hampshire":"NH","new jersey":"NJ","new mexico":"NM","new york":"NY",
  "north carolina":"NC","north dakota":"ND",ohio:"OH",oklahoma:"OK",oregon:"OR",
  pennsylvania:"PA","rhode island":"RI","south carolina":"SC","south dakota":"SD",
  tennessee:"TN",texas:"TX",utah:"UT",vermont:"VT",virginia:"VA",washington:"WA",
  "west virginia":"WV",wisconsin:"WI",wyoming:"WY","district of columbia":"DC",
  "washington dc":"DC","washington d.c.":"DC",
};

// ─── ZIP PREFIX → STATE/REGION MAP ───────────────────────────────────────────
// Maps first 3 digits of ZIP to approximate lat/lng center
const ZIP_PREFIX_MAP = {
  "005":["MA",42.36,-71.06],"006":["PR",18.22,-66.59],"007":["PR",18.39,-66.06],
  "008":["VI",18.34,-64.90],"009":["PR",18.01,-66.61],
  "010":["MA",42.10,-72.59],"011":["MA",42.27,-71.80],"012":["MA",42.45,-73.25],
  "013":["MA",42.38,-72.52],"014":["MA",42.54,-71.78],"015":["MA",42.27,-71.80],
  "016":["MA",42.27,-71.80],"017":["MA",42.27,-71.80],"018":["MA",42.52,-70.90],
  "019":["MA",42.52,-70.90],"020":["MA",42.25,-71.00],"021":["MA",42.36,-71.06],
  "022":["MA",42.36,-71.06],"023":["MA",42.25,-71.00],"024":["MA",42.25,-71.00],
  "025":["MA",41.75,-70.60],"026":["MA",41.75,-70.60],"027":["MA",41.83,-71.41],
  "028":["RI",41.82,-71.41],"029":["RI",41.47,-71.31],
  "030":["NH",43.21,-71.54],"031":["NH",43.05,-71.01],"032":["NH",43.21,-71.54],
  "033":["NH",43.68,-71.54],"034":["NH",44.31,-71.54],"035":["NH",43.21,-71.54],
  "036":["NH",43.21,-71.54],"037":["NH",43.21,-71.54],"038":["NH",43.08,-70.75],
  "039":["ME",43.65,-70.26],"040":["ME",43.65,-70.26],"041":["ME",43.65,-70.26],
  "042":["ME",44.55,-69.63],"043":["ME",44.31,-69.78],"044":["ME",44.80,-68.78],
  "045":["ME",44.80,-68.78],"046":["ME",47.20,-68.20],"047":["ME",47.20,-68.20],
  "048":["ME",44.80,-68.78],"049":["ME",44.80,-68.78],
  "050":["VT",44.48,-73.21],"051":["VT",44.48,-73.21],"052":["VT",44.48,-73.21],
  "053":["VT",44.03,-72.67],"054":["VT",44.48,-73.21],"055":["VT",43.62,-72.98],
  "056":["VT",44.48,-73.21],"057":["VT",44.48,-73.21],"058":["VT",44.92,-71.88],
  "059":["VT",44.48,-73.21],
  "060":["CT",41.77,-72.68],"061":["CT",41.77,-72.68],"062":["CT",41.55,-72.65],
  "063":["CT",41.31,-72.93],"064":["CT",41.31,-72.93],"065":["CT",41.19,-73.20],
  "066":["CT",41.19,-73.20],"067":["CT",41.55,-72.65],"068":["CT",41.05,-73.54],
  "069":["CT",41.05,-73.54],
  "070":["NJ",40.73,-74.17],"071":["NJ",40.73,-74.17],"072":["NJ",40.73,-74.17],
  "073":["NJ",40.73,-74.17],"074":["NJ",40.86,-74.43],"075":["NJ",40.86,-74.43],
  "076":["NJ",40.86,-74.43],"077":["NJ",40.37,-74.10],"078":["NJ",40.37,-74.10],
  "079":["NJ",40.37,-74.10],"080":["NJ",39.93,-75.12],"081":["NJ",39.93,-75.12],
  "082":["NJ",39.37,-74.44],"083":["NJ",39.37,-74.44],"084":["NJ",39.93,-75.12],
  "085":["NJ",40.22,-74.78],"086":["NJ",40.22,-74.78],"087":["NJ",40.22,-74.78],
  "088":["NJ",40.58,-74.15],"089":["NJ",40.58,-74.15],
  "100":["NY",40.71,-74.01],"101":["NY",40.71,-74.01],"102":["NY",40.71,-74.01],
  "103":["NY",40.60,-74.15],"104":["NY",40.85,-73.87],"105":["NY",41.05,-73.88],
  "106":["NY",41.05,-73.88],"107":["NY",41.05,-73.88],"108":["NY",41.05,-73.88],
  "109":["NY",41.30,-74.00],"110":["NY",40.73,-73.79],"111":["NY",40.73,-73.79],
  "112":["NY",40.65,-73.95],"113":["NY",40.73,-73.79],"114":["NY",40.73,-73.79],
  "115":["NY",40.80,-73.43],"116":["NY",40.80,-73.43],"117":["NY",40.80,-73.43],
  "118":["NY",40.80,-73.43],"119":["NY",40.80,-73.43],"120":["NY",42.65,-73.76],
  "121":["NY",42.65,-73.76],"122":["NY",42.65,-73.76],"123":["NY",42.65,-73.76],
  "124":["NY",41.70,-74.01],"125":["NY",41.70,-74.01],"126":["NY",41.70,-74.01],
  "127":["NY",41.70,-74.01],"128":["NY",42.10,-75.92],"129":["NY",42.10,-75.92],
  "130":["NY",43.05,-76.14],"131":["NY",43.05,-76.14],"132":["NY",43.05,-76.14],
  "133":["NY",43.10,-75.23],"134":["NY",43.10,-75.23],"135":["NY",43.10,-75.23],
  "136":["NY",43.45,-76.51],"137":["NY",42.10,-75.92],"138":["NY",43.45,-76.51],
  "139":["NY",43.10,-75.23],"140":["NY",42.89,-78.88],"141":["NY",42.89,-78.88],
  "142":["NY",42.89,-78.88],"143":["NY",42.87,-76.98],"144":["NY",43.16,-77.61],
  "145":["NY",43.16,-77.61],"146":["NY",43.16,-77.61],"147":["NY",42.10,-79.24],
  "148":["NY",42.44,-76.50],"149":["NY",42.10,-75.92],
  "150":["PA",40.44,-79.99],"151":["PA",40.44,-79.99],"152":["PA",40.44,-79.99],
  "153":["PA",40.44,-79.99],"154":["PA",40.44,-79.99],"155":["PA",40.44,-79.99],
  "156":["PA",40.44,-79.99],"157":["PA",40.44,-79.99],"158":["PA",40.44,-79.99],
  "159":["PA",40.44,-79.99],"160":["PA",40.44,-79.99],"161":["PA",41.24,-77.00],
  "162":["PA",41.24,-77.00],"163":["PA",41.41,-75.66],"164":["PA",42.13,-80.09],
  "165":["PA",42.13,-80.09],"166":["PA",42.13,-80.09],"167":["PA",40.61,-75.49],
  "168":["PA",40.61,-75.49],"169":["PA",40.61,-75.49],"170":["PA",40.27,-76.89],
  "171":["PA",40.27,-76.89],"172":["PA",40.27,-76.89],"173":["PA",39.96,-76.73],
  "174":["PA",39.96,-76.73],"175":["PA",39.96,-76.73],"176":["PA",39.96,-76.73],
  "177":["PA",41.24,-77.00],"178":["PA",40.27,-76.89],"179":["PA",40.27,-76.89],
  "180":["PA",40.61,-75.49],"181":["PA",39.95,-75.17],"182":["PA",39.95,-75.17],
  "183":["PA",39.95,-75.17],"184":["PA",41.41,-75.66],"185":["PA",41.41,-75.66],
  "186":["PA",41.41,-75.66],"187":["PA",41.41,-75.66],"188":["PA",41.41,-75.66],
  "189":["PA",39.95,-75.17],"190":["PA",39.95,-75.17],"191":["PA",39.95,-75.17],
  "192":["PA",39.95,-75.17],"193":["PA",39.95,-75.17],"194":["PA",40.06,-75.31],
  "195":["PA",40.06,-75.31],"196":["PA",40.06,-75.31],
  "197":["DE",39.32,-75.51],"198":["DE",39.68,-75.76],"199":["DE",39.68,-75.76],
  "200":["DC",38.91,-77.04],"201":["VA",38.91,-77.04],"202":["DC",38.91,-77.04],
  "203":["DC",38.91,-77.04],"204":["DC",38.91,-77.04],"205":["DC",38.91,-77.04],
  "206":["MD",39.29,-76.61],"207":["MD",39.29,-76.61],"208":["MD",38.99,-77.03],
  "209":["MD",38.99,-77.03],"210":["MD",39.29,-76.61],"211":["MD",39.29,-76.61],
  "212":["MD",39.29,-76.61],"214":["MD",39.29,-76.61],"215":["MD",39.65,-78.76],
  "216":["MD",38.68,-76.87],"217":["MD",38.68,-76.87],"218":["MD",38.38,-75.60],
  "219":["MD",38.38,-75.60],
  "220":["VA",38.84,-77.43],"221":["VA",38.84,-77.43],"222":["VA",38.84,-77.43],
  "223":["VA",38.84,-77.43],"224":["VA",37.54,-77.43],"225":["VA",37.54,-77.43],
  "226":["VA",38.30,-78.08],"227":["VA",38.30,-78.08],"228":["VA",38.30,-78.08],
  "229":["VA",37.27,-79.94],"230":["VA",37.54,-77.43],"231":["VA",37.54,-77.43],
  "232":["VA",37.54,-77.43],"233":["VA",36.85,-76.29],"234":["VA",36.85,-76.29],
  "235":["VA",36.85,-76.29],"236":["VA",36.85,-76.29],"237":["VA",36.85,-76.29],
  "238":["VA",37.54,-77.43],"239":["VA",37.09,-76.47],
  "240":["WV",37.27,-80.41],"241":["WV",37.27,-80.41],"242":["WV",38.42,-82.45],
  "243":["WV",38.42,-82.45],"244":["WV",38.42,-82.45],"245":["WV",38.42,-82.45],
  "246":["WV",38.42,-82.45],"247":["WV",38.35,-81.63],"248":["WV",38.35,-81.63],
  "249":["WV",38.35,-81.63],"250":["WV",38.35,-81.63],"251":["WV",38.35,-81.63],
  "252":["WV",38.35,-81.63],"253":["WV",38.35,-81.63],"254":["WV",39.28,-80.34],
  "255":["WV",39.28,-80.34],"256":["WV",39.28,-80.34],"257":["WV",39.27,-81.56],
  "258":["WV",39.27,-81.56],"259":["WV",39.27,-81.56],"260":["WV",39.49,-79.98],
  "261":["WV",39.49,-79.98],"262":["WV",40.06,-80.72],"263":["WV",40.06,-80.72],
  "264":["WV",40.06,-80.72],"265":["WV",39.28,-80.34],"266":["WV",39.28,-80.34],
  "267":["WV",39.28,-80.34],"268":["WV",39.28,-80.34],
  "270":["NC",36.07,-79.79],"271":["NC",36.07,-79.79],"272":["NC",35.78,-78.64],
  "273":["NC",35.78,-78.64],"274":["NC",35.78,-78.64],"275":["NC",35.78,-78.64],
  "276":["NC",35.78,-78.64],"277":["NC",35.78,-78.64],"278":["NC",35.59,-77.37],
  "279":["NC",35.59,-77.37],"280":["NC",35.23,-80.84],"281":["NC",35.23,-80.84],
  "282":["NC",35.23,-80.84],"283":["NC",35.23,-80.84],"284":["NC",34.23,-77.94],
  "285":["NC",35.59,-77.37],"286":["NC",35.60,-82.55],"287":["NC",35.60,-82.55],
  "288":["NC",36.10,-80.24],"289":["NC",36.10,-80.24],
  "290":["SC",33.99,-81.03],"291":["SC",33.99,-81.03],"292":["SC",33.99,-81.03],
  "293":["SC",34.85,-82.39],"294":["SC",34.85,-82.39],"295":["SC",33.99,-81.03],
  "296":["SC",34.85,-82.39],"297":["SC",34.85,-82.39],"298":["SC",32.78,-79.93],
  "299":["SC",32.78,-79.93],
  "300":["GA",33.75,-84.39],"301":["GA",33.75,-84.39],"302":["GA",33.75,-84.39],
  "303":["GA",33.75,-84.39],"304":["GA",33.75,-84.39],"305":["GA",33.75,-84.39],
  "306":["GA",33.75,-84.39],"307":["GA",33.75,-84.39],"308":["GA",33.47,-82.01],
  "309":["GA",33.47,-82.01],"310":["GA",32.08,-81.10],"311":["GA",32.08,-81.10],
  "312":["GA",32.84,-83.63],"313":["GA",32.84,-83.63],"314":["GA",32.84,-83.63],
  "315":["GA",31.58,-84.16],"316":["GA",31.58,-84.16],"317":["GA",32.08,-81.10],
  "318":["GA",30.83,-83.28],"319":["GA",30.83,-83.28],
  "320":["FL",30.33,-81.66],"321":["FL",28.54,-81.38],"322":["FL",30.33,-81.66],
  "323":["FL",30.44,-84.28],"324":["FL",30.44,-84.28],"325":["FL",30.44,-84.28],
  "326":["FL",29.65,-82.33],"327":["FL",28.54,-81.38],"328":["FL",28.54,-81.38],
  "329":["FL",28.54,-81.38],"330":["FL",25.76,-80.19],"331":["FL",25.76,-80.19],
  "332":["FL",25.76,-80.19],"333":["FL",26.12,-80.14],"334":["FL",26.12,-80.14],
  "335":["FL",27.95,-82.46],"336":["FL",27.95,-82.46],"337":["FL",27.95,-82.46],
  "338":["FL",27.95,-82.46],"339":["FL",26.12,-80.14],"340":["FL",27.95,-82.46],
  "341":["FL",26.64,-81.87],"342":["FL",27.95,-82.46],"344":["FL",29.21,-81.02],
  "346":["FL",27.95,-82.46],"347":["FL",27.95,-82.46],"349":["FL",28.54,-81.38],
  "350":["AL",33.52,-86.81],"351":["AL",33.52,-86.81],"352":["AL",33.52,-86.81],
  "354":["AL",33.52,-86.81],"355":["AL",33.52,-86.81],"356":["AL",34.73,-86.59],
  "357":["AL",34.73,-86.59],"358":["AL",34.73,-86.59],"359":["AL",33.52,-86.81],
  "360":["AL",32.38,-86.31],"361":["AL",32.38,-86.31],"362":["AL",32.38,-86.31],
  "363":["AL",31.85,-85.95],"364":["AL",31.85,-85.95],"365":["AL",30.69,-88.04],
  "366":["AL",30.69,-88.04],"367":["AL",31.85,-85.95],"368":["AL",31.85,-85.95],
  "369":["AL",34.76,-87.70],
  "370":["TN",36.16,-86.78],"371":["TN",36.16,-86.78],"372":["TN",36.16,-86.78],
  "373":["TN",35.96,-83.92],"374":["TN",35.96,-83.92],"375":["TN",35.15,-90.05],
  "376":["TN",35.15,-90.05],"377":["TN",35.96,-83.92],"378":["TN",35.96,-83.92],
  "379":["TN",35.96,-83.92],"380":["TN",35.15,-90.05],"381":["TN",35.15,-90.05],
  "382":["TN",36.16,-86.78],"383":["TN",36.16,-86.78],"384":["TN",36.16,-86.78],
  "385":["TN",36.16,-86.78],
  "386":["MS",34.93,-88.52],"387":["MS",33.50,-88.43],"388":["MS",32.30,-90.18],
  "389":["MS",32.30,-90.18],"390":["MS",32.30,-90.18],"391":["MS",32.30,-90.18],
  "392":["MS",32.30,-90.18],"393":["MS",30.37,-89.09],"394":["MS",30.37,-89.09],
  "395":["MS",30.37,-89.09],"396":["MS",30.37,-89.09],"397":["MS",32.36,-88.70],
  "398":["GA",30.83,-83.28],"399":["GA",30.83,-83.28],
  "400":["KY",38.25,-85.76],"401":["KY",38.25,-85.76],"402":["KY",38.25,-85.76],
  "403":["KY",37.99,-84.48],"404":["KY",37.99,-84.48],"405":["KY",37.99,-84.48],
  "406":["KY",37.99,-84.48],"407":["KY",37.99,-84.48],"408":["KY",37.99,-84.48],
  "409":["KY",37.99,-84.48],"410":["KY",38.25,-85.76],"411":["KY",37.08,-88.60],
  "412":["KY",37.08,-88.60],"413":["KY",37.08,-88.60],"414":["KY",37.72,-87.11],
  "415":["KY",37.72,-87.11],"416":["KY",37.72,-87.11],"417":["KY",37.72,-87.11],
  "418":["KY",37.72,-87.11],
  "420":["OH",41.50,-81.69],"421":["OH",41.50,-81.69],"422":["OH",41.50,-81.69],
  "423":["OH",41.08,-81.52],"424":["OH",41.08,-81.52],"425":["OH",41.08,-81.52],
  "426":["OH",39.96,-82.99],"427":["OH",39.96,-82.99],"428":["OH",41.66,-83.55],
  "429":["OH",41.66,-83.55],"430":["OH",39.96,-82.99],"431":["OH",39.96,-82.99],
  "432":["OH",39.96,-82.99],"433":["OH",39.96,-82.99],"434":["OH",41.66,-83.55],
  "435":["OH",41.66,-83.55],"436":["OH",39.96,-82.99],"437":["OH",39.76,-84.19],
  "438":["OH",39.76,-84.19],"439":["OH",39.10,-84.51],"440":["OH",41.50,-81.69],
  "441":["OH",41.50,-81.69],"442":["OH",41.10,-80.65],"443":["OH",41.10,-80.65],
  "444":["OH",41.24,-80.82],"445":["OH",41.24,-80.82],"446":["OH",40.80,-81.38],
  "447":["OH",40.80,-81.38],"448":["OH",40.76,-82.52],"449":["OH",40.76,-82.52],
  "450":["OH",39.10,-84.51],"451":["OH",39.10,-84.51],"452":["OH",39.76,-84.19],
  "453":["OH",39.76,-84.19],"454":["OH",39.76,-84.19],"455":["OH",40.48,-88.99],
  "456":["OH",39.96,-82.99],"457":["OH",39.42,-81.45],"458":["OH",38.73,-82.99],
  "459":["OH",38.73,-82.99],
  "460":["IN",39.77,-86.16],"461":["IN",39.77,-86.16],"462":["IN",39.77,-86.16],
  "463":["IN",41.68,-86.25],"464":["IN",41.68,-86.25],"465":["IN",41.08,-85.14],
  "466":["IN",41.08,-85.14],"467":["IN",41.61,-86.72],"468":["IN",41.61,-86.72],
  "469":["IN",41.61,-86.72],"470":["IN",39.77,-86.16],"471":["IN",37.97,-87.57],
  "472":["IN",40.19,-85.39],"473":["IN",40.49,-86.88],"474":["IN",39.47,-87.41],
  "475":["IN",39.47,-87.41],"476":["IN",40.49,-86.88],"477":["IN",40.49,-86.88],
  "478":["IN",40.49,-86.88],"479":["IN",40.49,-86.88],
  "480":["MI",42.33,-83.05],"481":["MI",42.33,-83.05],"482":["MI",42.33,-83.05],
  "483":["MI",42.33,-83.05],"484":["MI",42.97,-85.67],"485":["MI",42.97,-85.67],
  "486":["MI",42.29,-85.18],"487":["MI",42.29,-85.18],"488":["MI",43.42,-83.95],
  "489":["MI",43.42,-83.95],"490":["MI",42.33,-85.18],"491":["MI",42.33,-85.18],
  "492":["MI",43.01,-83.69],"493":["MI",43.01,-83.69],"494":["MI",44.76,-85.62],
  "495":["MI",46.54,-87.40],"496":["MI",43.01,-83.69],"497":["MI",42.33,-83.05],
  "498":["MI",46.54,-87.40],"499":["MI",46.54,-87.40],
  "500":["IA",41.59,-93.63],"501":["IA",41.59,-93.63],"502":["IA",41.59,-93.63],
  "503":["IA",41.59,-93.63],"504":["IA",41.59,-93.63],"505":["IA",42.50,-96.40],
  "506":["IA",42.50,-96.40],"507":["IA",42.50,-96.40],"508":["IA",42.50,-96.40],
  "510":["IA",42.50,-96.40],"511":["IA",43.43,-95.68],"512":["IA",42.50,-96.40],
  "513":["IA",43.43,-95.68],"514":["IA",43.43,-95.68],"515":["IA",42.49,-92.34],
  "516":["IA",42.49,-92.34],"520":["IA",42.50,-90.67],"521":["IA",42.50,-90.67],
  "522":["IA",41.52,-90.58],"523":["IA",41.52,-90.58],"524":["IA",40.81,-91.11],
  "525":["IA",40.81,-91.11],"526":["IA",40.81,-91.11],"527":["IA",41.00,-92.41],
  "528":["IA",41.98,-91.67],
  "530":["WI",43.04,-87.91],"531":["WI",43.04,-87.91],"532":["WI",43.04,-87.91],
  "534":["WI",43.04,-87.91],"535":["WI",43.07,-89.40],"537":["WI",43.07,-89.40],
  "538":["WI",44.52,-88.02],"539":["WI",44.52,-88.02],"540":["WI",44.81,-91.50],
  "541":["WI",44.52,-88.02],"542":["WI",44.52,-88.02],"543":["WI",44.52,-88.02],
  "544":["WI",44.52,-88.02],"545":["WI",44.52,-88.02],"546":["WI",42.73,-87.78],
  "547":["WI",42.68,-89.02],"548":["WI",44.52,-89.57],"549":["WI",46.60,-90.88],
  "550":["MN",44.95,-93.10],"551":["MN",44.95,-93.10],"553":["MN",44.95,-93.10],
  "554":["MN",44.95,-93.10],"555":["MN",44.95,-93.10],"556":["MN",46.79,-92.10],
  "557":["MN",46.79,-92.10],"558":["MN",47.43,-92.94],"559":["MN",44.01,-92.48],
  "560":["MN",44.01,-92.48],"561":["MN",44.01,-92.48],"562":["MN",44.01,-92.48],
  "563":["MN",43.66,-93.37],"564":["MN",43.66,-93.37],"565":["MN",47.50,-94.87],
  "566":["MN",47.50,-94.87],"567":["MN",47.50,-94.87],
  "570":["SD",43.54,-96.73],"571":["SD",43.54,-96.73],"572":["SD",44.08,-103.23],
  "573":["SD",44.08,-103.23],"574":["SD",43.54,-96.73],"575":["SD",43.54,-96.73],
  "576":["SD",45.46,-98.49],"577":["SD",45.46,-98.49],
  "580":["ND",46.88,-96.79],"581":["ND",46.88,-96.79],"582":["ND",48.23,-101.30],
  "583":["ND",48.23,-101.30],"584":["ND",47.93,-97.03],"585":["ND",46.88,-96.79],
  "586":["ND",46.88,-96.79],"587":["ND",47.93,-97.03],"588":["ND",48.23,-101.30],
  "590":["MT",45.78,-108.50],"591":["MT",45.78,-108.50],"592":["MT",45.78,-108.50],
  "593":["MT",46.60,-112.03],"594":["MT",47.50,-111.30],"595":["MT",47.50,-111.30],
  "596":["MT",46.88,-113.99],"597":["MT",48.19,-114.32],"598":["MT",48.19,-114.32],
  "599":["MT",48.19,-114.32],
  "600":["IL",41.88,-87.63],"601":["IL",41.88,-87.63],"602":["IL",41.88,-87.63],
  "603":["IL",41.88,-87.63],"604":["IL",41.88,-87.63],"605":["IL",41.88,-87.63],
  "606":["IL",41.88,-87.63],"607":["IL",41.88,-87.63],"608":["IL",41.88,-87.63],
  "609":["IL",41.88,-87.63],"610":["IL",41.88,-87.63],"611":["IL",42.04,-88.28],
  "612":["IL",42.04,-88.28],"613":["IL",41.53,-88.08],"614":["IL",41.53,-88.08],
  "615":["IL",40.69,-89.59],"616":["IL",40.69,-89.59],"617":["IL",40.69,-89.59],
  "618":["IL",38.67,-89.98],"619":["IL",38.67,-89.98],"620":["IL",38.89,-90.18],
  "621":["IL",39.78,-89.65],"622":["IL",39.78,-89.65],"623":["IL",40.12,-87.63],
  "624":["IL",40.12,-87.63],"625":["IL",39.78,-89.65],"626":["IL",39.78,-89.65],
  "627":["IL",39.78,-89.65],"628":["IL",37.90,-88.93],"629":["IL",37.90,-88.93],
  "630":["MO",38.63,-90.20],"631":["MO",38.63,-90.20],"633":["MO",38.63,-90.20],
  "634":["MO",38.63,-90.20],"635":["MO",38.63,-90.20],"636":["MO",38.63,-90.20],
  "637":["MO",38.63,-90.20],"638":["MO",38.63,-90.20],"639":["MO",38.63,-90.20],
  "640":["MO",39.10,-94.58],"641":["MO",39.10,-94.58],"644":["MO",39.10,-94.58],
  "645":["MO",39.10,-94.58],"646":["MO",39.77,-94.85],"647":["MO",39.77,-94.85],
  "648":["MO",37.22,-93.30],"649":["MO",37.22,-93.30],"650":["MO",38.58,-92.17],
  "651":["MO",38.58,-92.17],"652":["MO",38.58,-92.17],"653":["MO",39.71,-91.36],
  "654":["MO",37.08,-94.51],"655":["MO",37.08,-94.51],"656":["MO",37.08,-94.51],
  "657":["MO",37.08,-94.51],"658":["MO",37.08,-94.51],
  "660":["KS",39.05,-95.69],"661":["KS",39.05,-95.69],"662":["KS",37.69,-97.33],
  "664":["KS",37.69,-97.33],"665":["KS",37.69,-97.33],"666":["KS",37.69,-97.33],
  "667":["KS",37.69,-97.33],"668":["KS",38.06,-97.93],"669":["KS",38.06,-97.93],
  "670":["KS",38.06,-97.93],"671":["KS",38.06,-97.93],"672":["KS",38.06,-97.93],
  "673":["KS",38.06,-97.93],"674":["KS",38.06,-97.93],"675":["KS",37.69,-97.33],
  "676":["KS",38.06,-97.93],"677":["KS",38.06,-97.93],"678":["KS",38.06,-97.93],
  "679":["KS",38.06,-97.93],
  "680":["NE",41.26,-95.93],"681":["NE",41.26,-95.93],"683":["NE",40.81,-96.70],
  "684":["NE",40.81,-96.70],"685":["NE",40.81,-96.70],"686":["NE",40.81,-96.70],
  "687":["NE",40.81,-96.70],"688":["NE",40.81,-96.70],"689":["NE",40.81,-96.70],
  "690":["NE",40.81,-96.70],"691":["NE",40.81,-96.70],"692":["NE",40.81,-96.70],
  "693":["NE",40.81,-96.70],
  "700":["LA",29.95,-90.07],"701":["LA",29.95,-90.07],"703":["LA",29.95,-90.07],
  "704":["LA",29.95,-90.07],"705":["LA",31.31,-92.45],"706":["LA",30.45,-91.19],
  "707":["LA",30.45,-91.19],"708":["LA",30.45,-91.19],"710":["LA",32.53,-93.75],
  "711":["LA",32.53,-93.75],"712":["LA",32.51,-92.12],"713":["LA",29.83,-93.22],
  "714":["LA",29.83,-93.22],
  "716":["AR",35.39,-94.40],"717":["AR",35.39,-94.40],"718":["AR",34.75,-92.29],
  "719":["AR",34.75,-92.29],"720":["AR",34.75,-92.29],"721":["AR",34.75,-92.29],
  "722":["AR",34.75,-92.29],"723":["AR",34.75,-92.29],"724":["AR",35.84,-90.70],
  "725":["AR",35.84,-90.70],"726":["AR",35.39,-94.40],"727":["AR",35.84,-90.70],
  "728":["AR",35.84,-90.70],"729":["AR",35.84,-90.70],
  "730":["OK",35.47,-97.52],"731":["OK",35.47,-97.52],"733":["OK",36.71,-97.09],
  "734":["OK",36.15,-95.99],"735":["OK",36.15,-95.99],"736":["OK",36.15,-95.99],
  "737":["OK",36.15,-95.99],"738":["OK",36.15,-95.99],"739":["OK",35.47,-97.52],
  "740":["OK",36.15,-95.99],"741":["OK",36.15,-95.99],"743":["OK",36.15,-95.99],
  "744":["OK",35.47,-97.52],"745":["OK",35.47,-97.52],"746":["OK",35.47,-97.52],
  "747":["OK",35.47,-97.52],"748":["OK",35.47,-97.52],"749":["OK",35.47,-97.52],
  "750":["TX",32.78,-96.80],"751":["TX",32.78,-96.80],"752":["TX",32.78,-96.80],
  "753":["TX",32.78,-96.80],"754":["TX",32.78,-96.80],"755":["TX",32.08,-94.12],
  "756":["TX",32.08,-94.12],"757":["TX",32.08,-94.12],"758":["TX",33.44,-94.04],
  "759":["TX",31.55,-97.15],"760":["TX",32.72,-97.32],"761":["TX",32.72,-97.32],
  "762":["TX",32.72,-97.32],"763":["TX",33.91,-98.49],"764":["TX",31.55,-97.15],
  "765":["TX",31.55,-97.15],"766":["TX",31.55,-97.15],"767":["TX",31.55,-97.15],
  "768":["TX",31.55,-97.15],"769":["TX",32.30,-90.19],"770":["TX",29.76,-95.37],
  "771":["TX",29.76,-95.37],"772":["TX",29.76,-95.37],"773":["TX",29.76,-95.37],
  "774":["TX",29.76,-95.37],"775":["TX",29.76,-95.37],"776":["TX",30.09,-94.10],
  "777":["TX",30.09,-94.10],"778":["TX",27.80,-97.40],"779":["TX",27.80,-97.40],
  "780":["TX",29.42,-98.49],"781":["TX",29.42,-98.49],"782":["TX",29.42,-98.49],
  "783":["TX",29.42,-98.49],"784":["TX",29.42,-98.49],"785":["TX",30.27,-97.74],
  "786":["TX",30.27,-97.74],"787":["TX",30.27,-97.74],"788":["TX",30.27,-97.74],
  "789":["TX",30.27,-97.74],"790":["TX",35.22,-101.83],"791":["TX",35.22,-101.83],
  "792":["TX",35.22,-101.83],"793":["TX",31.76,-106.49],"794":["TX",31.76,-106.49],
  "795":["TX",31.76,-106.49],"796":["TX",32.45,-99.73],"797":["TX",32.45,-99.73],
  "798":["TX",31.76,-106.49],"799":["TX",31.76,-106.49],
  "800":["CO",39.74,-104.99],"801":["CO",39.74,-104.99],"802":["CO",39.74,-104.99],
  "803":["CO",39.74,-104.99],"804":["CO",39.74,-104.99],"805":["CO",40.59,-105.08],
  "806":["CO",40.59,-105.08],"807":["CO",40.59,-105.08],"808":["CO",38.83,-104.82],
  "809":["CO",38.83,-104.82],"810":["CO",38.25,-104.61],"811":["CO",37.68,-106.25],
  "812":["CO",39.06,-108.55],"813":["CO",39.06,-108.55],"814":["CO",37.68,-106.25],
  "815":["CO",37.68,-106.25],"816":["CO",37.68,-106.25],
  "820":["WY",41.14,-104.82],"821":["WY",41.14,-104.82],"822":["WY",42.85,-106.33],
  "823":["WY",42.85,-106.33],"824":["WY",42.85,-106.33],"825":["WY",42.85,-106.33],
  "826":["WY",42.85,-106.33],"827":["WY",42.85,-106.33],"828":["WY",41.14,-104.82],
  "829":["WY",41.14,-104.82],"830":["WY",41.14,-104.82],"831":["WY",41.14,-104.82],
  "832":["ID",43.62,-116.20],"833":["ID",43.62,-116.20],"834":["ID",43.62,-116.20],
  "835":["ID",43.62,-116.20],"836":["ID",43.62,-116.20],"837":["ID",43.62,-116.20],
  "838":["ID",47.66,-116.78],
  "840":["UT",40.76,-111.89],"841":["UT",40.76,-111.89],"842":["UT",40.76,-111.89],
  "843":["UT",40.76,-111.89],"844":["UT",40.76,-111.89],"845":["UT",40.76,-111.89],
  "846":["UT",40.76,-111.89],"847":["UT",40.76,-111.89],
  "850":["AZ",33.45,-112.07],"851":["AZ",33.45,-112.07],"852":["AZ",33.45,-112.07],
  "853":["AZ",33.45,-112.07],"854":["AZ",33.45,-112.07],"855":["AZ",33.45,-112.07],
  "856":["AZ",32.22,-110.97],"857":["AZ",32.22,-110.97],"859":["AZ",34.54,-112.47],
  "860":["AZ",34.54,-112.47],"863":["AZ",34.54,-112.47],"864":["AZ",32.72,-114.62],
  "865":["AZ",32.22,-110.97],
  "870":["NM",35.08,-106.65],"871":["NM",35.08,-106.65],"872":["NM",35.08,-106.65],
  "873":["NM",35.08,-106.65],"874":["NM",36.73,-108.21],"875":["NM",35.08,-106.65],
  "877":["NM",35.08,-106.65],"878":["NM",33.39,-104.52],"879":["NM",32.32,-106.77],
  "880":["NM",31.76,-106.49],"881":["NM",31.76,-106.49],"882":["NM",34.00,-106.90],
  "883":["NM",34.00,-106.90],"884":["NM",34.00,-106.90],
  "889":["NV",36.17,-115.14],"890":["NV",36.17,-115.14],"891":["NV",36.17,-115.14],
  "893":["NV",36.17,-115.14],"894":["NV",39.53,-119.81],"895":["NV",39.53,-119.81],
  "897":["NV",39.53,-119.81],"898":["NV",39.53,-119.81],
  "900":["CA",34.05,-118.24],"901":["CA",34.05,-118.24],"902":["CA",34.05,-118.24],
  "903":["CA",34.05,-118.24],"904":["CA",34.05,-118.24],"905":["CA",34.05,-118.24],
  "906":["CA",34.05,-118.24],"907":["CA",34.05,-118.24],"908":["CA",34.05,-118.24],
  "910":["CA",34.05,-118.24],"911":["CA",34.05,-118.24],"912":["CA",34.05,-118.24],
  "913":["CA",34.18,-118.31],"914":["CA",34.18,-118.31],"915":["CA",34.18,-118.31],
  "916":["CA",34.18,-118.31],"917":["CA",34.18,-118.31],"918":["CA",34.18,-118.31],
  "919":["CA",32.72,-117.16],"920":["CA",32.72,-117.16],"921":["CA",32.72,-117.16],
  "922":["CA",33.98,-117.38],"923":["CA",33.98,-117.38],"924":["CA",33.98,-117.38],
  "925":["CA",33.77,-117.98],"926":["CA",33.77,-117.98],"927":["CA",33.77,-117.98],
  "928":["CA",33.77,-117.98],"930":["CA",34.42,-119.70],"931":["CA",34.42,-119.70],
  "932":["CA",36.74,-119.79],"933":["CA",36.74,-119.79],"934":["CA",35.37,-119.02],
  "935":["CA",35.37,-119.02],"936":["CA",36.74,-119.79],"937":["CA",36.74,-119.79],
  "938":["CA",36.74,-119.79],"939":["CA",36.60,-121.89],"940":["CA",37.78,-122.42],
  "941":["CA",37.78,-122.42],"942":["CA",38.58,-121.49],"943":["CA",37.56,-122.33],
  "944":["CA",37.56,-122.33],"945":["CA",37.56,-122.33],"946":["CA",37.72,-121.94],
  "947":["CA",37.72,-121.94],"948":["CA",38.44,-122.71],"949":["CA",38.44,-122.71],
  "950":["CA",37.34,-121.89],"951":["CA",37.34,-121.89],"952":["CA",37.72,-121.94],
  "953":["CA",37.34,-121.89],"954":["CA",38.58,-121.49],"955":["CA",40.59,-122.39],
  "956":["CA",38.58,-121.49],"957":["CA",38.58,-121.49],"958":["CA",38.58,-121.49],
  "959":["CA",40.59,-122.39],"960":["CA",40.59,-122.39],"961":["CA",39.52,-119.81],
  "970":["OR",45.52,-122.68],"971":["OR",45.52,-122.68],"972":["OR",45.52,-122.68],
  "973":["OR",45.52,-122.68],"974":["OR",42.33,-122.88],"975":["OR",44.05,-123.09],
  "976":["OR",42.33,-122.88],"977":["OR",43.37,-124.22],"978":["OR",44.05,-123.09],
  "979":["OR",44.05,-123.09],
  "980":["WA",47.61,-122.33],"981":["WA",47.61,-122.33],"982":["WA",47.61,-122.33],
  "983":["WA",47.61,-122.33],"984":["WA",47.25,-122.44],"985":["WA",47.25,-122.44],
  "986":["WA",47.61,-122.33],"988":["WA",47.66,-117.43],"989":["WA",46.21,-119.14],
  "990":["WA",47.66,-117.43],"991":["WA",47.66,-117.43],"992":["WA",47.66,-117.43],
  "993":["WA",46.21,-119.14],"994":["WA",46.21,-119.14],"995":["AK",61.22,-149.90],
  "996":["AK",61.22,-149.90],"997":["AK",64.84,-147.72],"998":["AK",59.55,-151.49],
  "999":["AK",55.34,-131.65],
};

// ─── GEOCODE: ZIP or City/State ───────────────────────────────────────────────
const CITY_COORDS = {
  "chicago": [41.8781, -87.6298],
  "new york": [40.7128, -74.0059],
  "los angeles": [34.0522, -118.2437],
  "houston": [29.7604, -95.3698],
  "phoenix": [33.4484, -112.0740],
  "philadelphia": [39.9526, -75.1652],
  "san antonio": [29.4241, -98.4936],
  "san diego": [32.7157, -117.1611],
  "dallas": [32.7767, -96.7970],
  "san jose": [37.3382, -121.8863],
  "austin": [30.2672, -97.7431],
  "jacksonville": [30.3322, -81.6557],
  "fort worth": [32.7548, -97.3308],
  "columbus": [39.9612, -82.9988],
  "charlotte": [35.2271, -80.8431],
  "indianapolis": [39.7684, -86.1581],
  "san francisco": [37.7749, -122.4194],
  "seattle": [47.6062, -122.3321],
  "denver": [39.7392, -104.9903],
  "boston": [42.3601, -71.0589],
  "detroit": [42.3314, -83.0458],
  "nashville": [36.1627, -86.7816],
  "memphis": [35.1495, -90.0490],
  "portland": [45.5231, -122.6765],
  "oklahoma city": [35.4676, -97.5164],
  "las vegas": [36.1699, -115.1398],
  "louisville": [38.2527, -85.7585],
  "baltimore": [39.2904, -76.6122],
  "milwaukee": [43.0389, -87.9065],
  "albuquerque": [35.0844, -106.6504],
  "tucson": [32.2226, -110.9747],
  "fresno": [36.7378, -119.7871],
  "sacramento": [38.5816, -121.4944],
  "mesa": [33.4152, -111.8315],
  "kansas city": [39.0997, -94.5786],
  "atlanta": [33.7490, -84.3880],
  "omaha": [41.2565, -95.9345],
  "colorado springs": [38.8339, -104.8214],
  "raleigh": [35.7796, -78.6382],
  "long beach": [33.7701, -118.1937],
  "virginia beach": [36.8529, -75.9780],
  "minneapolis": [44.9778, -93.2650],
  "tampa": [27.9506, -82.4572],
  "new orleans": [29.9511, -90.0715],
  "cleveland": [41.4993, -81.6944],
  "pittsburgh": [40.4406, -79.9959],
  "miami": [25.7617, -80.1918],
  "cincinnati": [39.1031, -84.5120],
  "st louis": [38.6270, -90.1994],
  "st. louis": [38.6270, -90.1994],
  "orlando": [28.5383, -81.3792],
  "columbia": [34.0007, -81.0348],
  "athens": [33.9519, -83.3576],
  "richmond": [37.5407, -77.4360],
  "birmingham": [33.5186, -86.8104],
  "mobile": [30.6954, -88.0399],
  "montgomery": [32.3668, -86.2999],
  "baton rouge": [30.4515, -91.1871],
  "shreveport": [32.5252, -93.7502],
  "knoxville": [35.9606, -83.9207],
  "chattanooga": [35.0456, -85.3097],
  "greenville": [34.8526, -82.3940],
  "columbia sc": [34.0007, -81.0348],
  "columbia md": [39.2037, -76.8610],
  "columbia mo": [38.9517, -92.3341],
  "athens ga": [33.9519, -83.3576],
  "athens oh": [39.3292, -82.1013],
  "richmond va": [37.5407, -77.4360],
  "pensacola": [30.4213, -87.2169],
  "tallahassee": [30.4383, -84.2807],
  "gainesville": [29.6520, -82.3250],
  "savannah": [32.0835, -81.0998],
  "augusta": [33.4735, -82.0105],
  "macon": [32.8407, -83.6324],
  "spokane": [47.6588, -117.4260],
  "tacoma": [47.2529, -122.4443],
  "anchorage": [61.2181, -149.9003],
  "honolulu": [21.3069, -157.8583],
  "el paso": [31.7619, -106.4850],
  "wichita": [37.6872, -97.3301],
  "tulsa": [36.1539, -95.9928],
  "lexington": [38.0406, -84.5037],
  "lincoln": [40.8136, -96.7026],
  "fort wayne": [41.1306, -85.1289],
  "des moines": [41.5868, -93.6250],
  "grand rapids": [42.9634, -85.6681],
  "worcester": [42.2626, -71.8023],
  "hartford": [41.7658, -72.6851],
  "providence": [41.8240, -71.4128],
  "buffalo": [42.8864, -78.8784],
  "rochester": [43.1566, -77.6088],
  "syracuse": [43.0481, -76.1474],
  "albany": [42.6526, -73.7562],
  "salt lake city": [40.7608, -111.8910],
  "boise": [43.6150, -116.2023],
  "little rock": [34.7465, -92.2896],
  "jackson": [32.2988, -90.1848],
  "charleston": [32.7765, -79.9311],
  "north charleston": [32.8546, -79.9748],
  "charleston sc": [32.7765, -79.9311],
  "charleston wv": [38.3498, -81.6326],
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function UnionPathway() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [locationLabel, setLocationLabel] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState("IBEW_I");
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("en");
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // ── TRANSLATIONS ────────────────────────────────────────────────────────────
  const T = {
    en: {
      tagline: "Find Your Union Local",
      heroTitle1: "Built by",
      heroAccent: "Tradespeople",
      heroTitle2: "For the Trades",
      heroSub: "Enter your location to find the union construction local nearest you — and take the first step toward a career in the skilled trades.",
      searchLabel: "Enter ZIP Code or City, State",
      searchBtn: "Find Local",
      geoBtn: "Use My Current Location",
      locating: "Detecting location…",
      nearYou: "Locals Near You",
      nearest: "Nearest",
      milesAway: "miles away",
      visitWebsite: "Visit Website",
      navQuiz: "Which Trade?",
      navCareers: "Career Path",
      navContact: "Contact",
      navChecklist: "Join a Union",
      navVets: "Veterans",
      navHome: "Find a Local",
      errorMsg: "We couldn't find that location. Try a ZIP code or \"City, State\".",
      ibewLabel: "⚡ IBEW Inside —",
      ibewLinLabel: "⚡ IBEW Lineman —",
      uaLabel: "🔧 UA Plumbers & Pipefitters —",
      smartLabel: "🌬️ SMART Sheet Metal Workers —",
      bacLabel: "🧱 BAC Bricklayers —",
      ubcLabel: "🪚 UBC Carpenters —",
      liunaLabel: "⚒️ LIUNA Laborers —",
      iwLabel: "🏗️ Ironworkers —",
      iuecLabel: "🛗 Elevator Constructors —",
      hfiawLabel: "🔥 Insulators —",
      sfLabel: "💧 Sprinkler Fitters —",
      featIBEW: "266 IBEW locals across all 50 states",
      featUA: "210 UA Plumbers & Pipefitters locals",
      featSMART: "54 SMART Sheet Metal Workers locals",
      featPin: "Nearest local found instantly by distance",
      allTrades: "All Trades",
      footerLeft: "© 2026 Union Pathways · Union Construction Locator",
      footerRight: "More trades added regularly",
    },
    es: {
      tagline: "Encuentra Tu Local Sindical",
      heroTitle1: "Construido por",
      heroAccent: "Trabajadores",
      heroTitle2: "Para los Oficios",
      heroSub: "Ingresa tu ubicación para encontrar el local sindical más cercano — y da el primer paso hacia una carrera en los oficios calificados.",
      searchLabel: "Ingresa tu código postal o Ciudad, Estado",
      searchBtn: "Encontrar Local",
      geoBtn: "Usar Mi Ubicación Actual",
      locating: "Detectando ubicación…",
      nearYou: "Locales Cercanos",
      nearest: "Más Cercano",
      milesAway: "millas de distancia",
      visitWebsite: "Visitar Sitio Web",
      navQuiz: "¿Qué Oficio?",
      navCareers: "Trayectoria",
      navContact: "Contacto",
      navChecklist: "Únete al Sindicato",
      navVets: "Veteranos",
      navHome: "Encontrar Local",
      errorMsg: "No pudimos encontrar esa ubicación. Intenta con un código postal o \"Ciudad, Estado\".",
      ibewLabel: "⚡ IBEW Interior —",
      ibewLinLabel: "⚡ IBEW Liniero —",
      uaLabel: "🔧 UA Plomeros y Tuberos —",
      smartLabel: "🌬️ SMART Trabajadores de Chapa —",
      bacLabel: "🧱 BAC Albañiles —",
      ubcLabel: "🪚 UBC Carpinteros —",
      liunaLabel: "⚒️ LIUNA Obreros —",
      iwLabel: "🏗️ Trabajadores del Hierro —",
      iuecLabel: "🛗 Constructores de Elevadores —",
      hfiawLabel: "🔥 Aisladores —",
      sfLabel: "💧 Instaladores de Rociadores —",
      featIBEW: "266 locales de IBEW en los 50 estados",
      featUA: "210 locales de UA Plomeros y Tuberos",
      featSMART: "54 locales de SMART Chapistas",
      featPin: "El local más cercano encontrado al instante",
      allTrades: "Todos los Oficios",
      footerLeft: "© 2026 Union Pathways · Localizador Sindical",
      footerRight: "Más oficios agregados regularmente",
    },
    pl: {
      tagline: "Znajdź Swój Lokalny Związek",
      heroTitle1: "Zbudowane przez",
      heroAccent: "Rzemieślników",
      heroTitle2: "Dla Branży Budowlanej",
      heroSub: "Wpisz swoją lokalizację, aby znaleźć najbliższy lokalny związek zawodowy — i zrób pierwszy krok w kierunku kariery w wykwalifikowanych zawodach budowlanych.",
      searchLabel: "Wpisz kod pocztowy lub Miasto, Stan",
      searchBtn: "Znajdź Lokalny",
      geoBtn: "Użyj Mojej Lokalizacji",
      locating: "Wykrywanie lokalizacji…",
      nearYou: "Lokalne Związki w Pobliżu",
      nearest: "Najbliższy",
      milesAway: "mil stąd",
      visitWebsite: "Odwiedź Stronę",
      navQuiz: "Który Zawód?",
      navCareers: "Ścieżka Kariery",
      navContact: "Kontakt",
      navChecklist: "Dołącz do Związku",
      navVets: "Weterani",
      navHome: "Znajdź Lokalny",
      errorMsg: "Nie mogliśmy znaleźć tej lokalizacji. Spróbuj kodu pocztowego lub Miasto, Stan.",
      ibewLabel: "⚡ IBEW Elektryczni —",
      ibewLinLabel: "⚡ IBEW Lineman —",
      uaLabel: "🔧 UA Hydraulicy i Monterzy —",
      smartLabel: "🌬️ SMART Blacharze —",
      bacLabel: "🧱 BAC Murarze —",
      ubcLabel: "🪚 UBC Cieśle —",
      liunaLabel: "⚒️ LIUNA Robotnicy —",
      iwLabel: "🏗️ Ironworkers —",
      iuecLabel: "🛗 Elevator Constructors —",
      hfiawLabel: "🔥 Insulators —",
      sfLabel: "💧 Sprinkler Fitters —",
      featIBEW: "266 oddziałów IBEW we wszystkich 50 stanach",
      featUA: "210 oddziałów UA Hydraulicy i Monterzy",
      featSMART: "54 oddziały SMART Blacharze",
      featPin: "Najbliższy oddział znajdowany natychmiast",
      allTrades: "Wszystkie Zawody",
      footerLeft: "© 2026 Union Pathways · Lokalizator Związków",
      footerRight: "Nowe zawody dodawane regularnie",
    }
  };
  const t = T[lang];

  // ── QUIZ DATA ───────────────────────────────────────────────────────────────
  const QUIZ = {
    en: [
      {
        q: "What kind of work environment do you prefer?",
        options: ["Working with electrical systems and technology", "Working with pipes, water, and heating/cooling systems", "Working with metal, ductwork, and HVAC systems", "Working with brick, stone, and masonry", "Working with wood, framing, and finishing"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]
      },
      {
        q: "Which best describes your interest?",
        options: ["Powering buildings — wiring, panels, controls", "Keeping systems flowing — plumbing, gas, steam", "Controlling airflow — ducts, vents, HVAC", "Building walls and structures that last centuries", "Shaping structures — carpentry, millwork"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]
      },
      {
        q: "How do you feel about working at heights?",
        options: ["Comfortable — heights don't bother me", "Somewhat comfortable", "I'd prefer to stay close to the ground"],
        trades: null
      },
      {
        q: "Are you interested in working on large industrial or commercial projects?",
        options: ["Yes — the bigger the better", "I'd like a mix of commercial and residential", "I prefer residential and smaller jobs"],
        trades: null
      },
      {
        q: "What matters most to you in a career?",
        options: ["Top pay and overtime potential", "Job stability and benefits", "Learning advanced technical skills", "Working with a close-knit crew", "A clear path to supervisory roles"],
        trades: null
      },
    ],
    es: [
      {
        q: "¿Qué tipo de ambiente de trabajo prefieres?",
        options: ["Trabajar con sistemas eléctricos y tecnología", "Trabajar con tuberías, agua y calefacción/refrigeración", "Trabajar con metal, conductos y sistemas HVAC", "Trabajar con ladrillo, piedra y mampostería", "Trabajar con madera, marcos y acabados"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]
      },
      {
        q: "¿Cuál describe mejor tu interés?",
        options: ["Dar energía a edificios — cableado, paneles, controles", "Mantener los sistemas fluyendo — plomería, gas, vapor", "Controlar el flujo de aire — conductos, ventilación, HVAC", "Construir muros y estructuras que duran siglos", "Dar forma a estructuras — carpintería, ebanistería"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]
      },
      {
        q: "¿Cómo te sientes trabajando en alturas?",
        options: ["Cómodo — las alturas no me molestan", "Algo cómodo", "Prefiero quedarme cerca del suelo"],
        trades: null
      },
      {
        q: "¿Te interesa trabajar en grandes proyectos industriales o comerciales?",
        options: ["Sí — cuanto más grande, mejor", "Me gustaría una mezcla de comercial y residencial", "Prefiero residencial y trabajos más pequeños"],
        trades: null
      },
      {
        q: "¿Qué es lo más importante para ti en una carrera?",
        options: ["El mejor salario y potencial de horas extras", "Estabilidad laboral y beneficios", "Aprender habilidades técnicas avanzadas", "Trabajar con un equipo unido", "Un camino claro hacia roles de supervisión"],
        trades: null
      },
    ],
    pl: [
      {
        q: "Jakie środowisko pracy preferujesz?",
        options: ["Praca z systemami elektrycznymi i technologią", "Praca z rurociągami, wodą i ogrzewaniem/chłodzeniem", "Praca z metalem, kanałami i systemami HVAC", "Praca z cegłą, kamieniem i murarką", "Praca z drewnem, szkieletem i wykończeniem"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]
      },
      {
        q: "Co najlepiej opisuje Twoje zainteresowania?",
        options: ["Zasilanie budynków — okablowanie, panele, sterowanie", "Utrzymanie systemów — hydraulika, gaz, para", "Kontrola przepływu powietrza — kanały, wentylacja, HVAC", "Budowanie ścian i konstrukcji trwających wieki", "Kształtowanie konstrukcji — ciesielstwo, stolarstwo"],
        trades: ["IBEW", "UA", "SMART", "BAC", "UBC"]
      },
      {
        q: "Jak czujesz się pracując na wysokościach?",
        options: ["Komfortowo — wysokości mi nie przeszkadzają", "Dość komfortowo", "Wolę pozostać blisko ziemi"],
        trades: null
      },
      {
        q: "Czy interesuje Cię praca przy dużych projektach przemysłowych lub komercyjnych?",
        options: ["Tak — im większy, tym lepiej", "Chciałbym połączenie komercyjnego i mieszkaniowego", "Wolę projekty mieszkaniowe i mniejsze zlecenia"],
        trades: null
      },
      {
        q: "Co jest dla Ciebie najważniejsze w karierze?",
        options: ["Najwyższe wynagrodzenie i możliwość nadgodzin", "Stabilność zatrudnienia i świadczenia", "Nauka zaawansowanych umiejętności technicznych", "Praca w zgranym zespole", "Wyraźna ścieżka do stanowisk kierowniczych"],
        trades: null
      },
    ]
  };

  let TRADE_RESULTS = {
    en: {
      IBEW: {
        name: "IBEW — Electricians",
        color: "#F5C518",
        icon: "⚡",
        why: "You're drawn to technology, precision work, and systems that power the modern world. Electricians are among the highest-paid in the trades and work on everything from homes to hospitals to data centers.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$20-28/hr", "Journeyman: Full union wages, typically $35–75/hr depending on location", "Foreman/General Foreman: Lead crews on major projects", "Master Electrician / Business Owner: Run your own shop"],
        apprenticeship: "5-year registered apprenticeship through NECA-IBEW JATC. No college debt.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Plumbers & Pipefitters",
        color: "#3b9eff",
        icon: "🔧",
        why: "You're interested in the systems that keep buildings running — water, gas, steam, and heating/cooling. Pipe trades are essential on every major construction project and offer excellent long-term stability.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Plumber/Pipefitter: Full union wages, $30–70/hr", "Foreman: Lead pipe crews on commercial and industrial projects", "Master Plumber / Business Owner: License and run your own operation"],
        apprenticeship: "5-year registered apprenticeship through UA JATC. Earn from day one.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Sheet Metal Workers",
        color: "#e05a2b",
        icon: "🌬️",
        why: "You're interested in HVAC, ductwork, and the systems that control airflow in buildings. Sheet metal workers are skilled fabricators who work on commercial and industrial HVAC systems.",
        path: ["Year 1–5: Apprentice — earn while you learn, starting ~$17-24/hr", "Journeyman Sheet Metal Worker: Full wages, $30–65/hr", "Foreman: Manage duct installation and HVAC crews", "Estimator / Project Manager: Move into the business side"],
        apprenticeship: "5-year apprenticeship through SMART JATC training centers nationwide.",
        website: "smart-union.org"
      },
      "BAC": {
        name: "BAC — Bricklayers & Allied Craftworkers",
        color: "#f97316",
        icon: "🧱",
        why: "You're drawn to hands-on work building lasting structures with brick, stone, tile, and masonry. Bricklayers work on some of the most iconic buildings and infrastructure in America — and union bricklayers earn excellent wages with full benefits.",
        path: ["Year 1–3: Apprentice — earn while you learn, starting ~$18-26/hr", "Journeyman Mason: Full union wages, $30–65/hr depending on location", "Foreman: Lead masonry crews on commercial and industrial projects", "Superintendent / Contractor: Run your own masonry operation"],
        apprenticeship: "3-year registered apprenticeship through BAC JATC. Paid training from day one.",
        website: "bacweb.org"
      },
      "UBC": {
        name: "UBC — Carpenters",
        color: "#a78bfa",
        icon: "🪚",
        why: "You enjoy working with wood, building structures, and seeing the physical results of your work. Carpenters work on framing, finishing, millwork, and everything in between.",
        path: ["Year 1–4: Apprentice — learn framing, finishing, formwork", "Journeyman Carpenter: Full wages on commercial and residential projects", "Foreman: Lead carpentry crews", "Superintendent / Contractor: Run your own projects"],
        apprenticeship: "4-year apprenticeship through UBC regional councils.",
        website: "carpenters.org"
      },
    },
    es: {
      IBEW: {
        name: "IBEW — Electricistas",
        color: "#F5C518",
        icon: "⚡",
        why: "Te atrae la tecnología, el trabajo de precisión y los sistemas que alimentan el mundo moderno. Los electricistas están entre los mejor pagados en los oficios y trabajan en todo, desde casas hasta hospitales y centros de datos.",
        path: ["Años 1-5: Aprendiz — gana mientras aprendes, comenzando ~$20-28/hr", "Oficial: Salario sindical completo, típicamente $35-75/hr según ubicación", "Capataz/Capataz General: Liderar cuadrillas en grandes proyectos", "Electricista Maestro / Propietario: Manejar tu propio negocio"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de NECA-IBEW JATC. Sin deuda universitaria.",
        website: "ibew.org"
      },
      UA: {
        name: "UA — Plomeros y Tuberos",
        color: "#3b9eff",
        icon: "🔧",
        why: "Te interesan los sistemas que mantienen los edificios funcionando — agua, gas, vapor y calefacción/refrigeración. Los oficios de tuberías son esenciales en cada proyecto de construcción importante.",
        path: ["Años 1-5: Aprendiz — gana mientras aprendes, comenzando ~$18-26/hr", "Plomero/Tubero Oficial: Salario completo, $30-70/hr", "Capataz: Liderar cuadrillas en proyectos comerciales e industriales", "Plomero Maestro / Propietario: Licencia y maneja tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 5 años a través de UA JATC. Gana desde el primer día.",
        website: "ua.org"
      },
      SMART: {
        name: "SMART — Trabajadores de Chapa",
        color: "#e05a2b",
        icon: "🌬️",
        why: "Te interesan el HVAC, los conductos y los sistemas que controlan el flujo de aire en los edificios.",
        path: ["Años 1-5: Aprendiz — comenzando ~$17-24/hr", "Chapista Oficial: Salario completo, $30-65/hr", "Capataz: Gestionar la instalación de conductos y cuadrillas de HVAC", "Estimador / Gerente de Proyecto: Pasar al lado empresarial"],
        apprenticeship: "Aprendizaje de 5 años a través de los centros de capacitación SMART JATC.",
        website: "smart-union.org"
      },
      "BAC": {
        name: "BAC — Albañiles y Artesanos Afines",
        color: "#f97316",
        icon: "🧱",
        why: "Te atrae el trabajo manual construyendo estructuras duraderas con ladrillo, piedra, azulejo y mampostería. Los albañiles sindicalizados ganan excelentes salarios con beneficios completos.",
        path: ["Años 1-3: Aprendiz — comenzando ~$18-26/hr", "Oficial Albañil: Salario completo, $30-65/hr", "Capataz: Liderar cuadrillas de mampostería en proyectos comerciales", "Superintendente / Contratista: Manejar tu propia operación"],
        apprenticeship: "Aprendizaje registrado de 3 años a través de BAC JATC. Capacitación pagada desde el primer día.",
        website: "bacweb.org"
      },
      "UBC": {
        name: "UBC — Carpinteros",
        color: "#a78bfa",
        icon: "🪚",
        why: "Disfrutas trabajar con madera, construir estructuras y ver los resultados físicos de tu trabajo.",
        path: ["Años 1-4: Aprendiz — aprender marcos, acabados, encofrados", "Carpintero Oficial: Salario completo en proyectos comerciales y residenciales", "Capataz: Liderar cuadrillas de carpintería", "Superintendente / Contratista: Manejar tus propios proyectos"],
        apprenticeship: "Aprendizaje de 4 años a través de los consejos regionales de UBC.",
        website: "carpenters.org"
      },
      HFIAW: {
        name: "HFIAW — Aisladores",
        color: "#38bdf8",
        icon: "🧊",
        why: "Te atrae el lado técnico de los sistemas industriales — mantener tuberías, equipos e instalaciones aisladas para mayor eficiencia y seguridad. Los aisladores trabajan en plantas de energía, refinerías y edificios comerciales.",
        path: ["Años 1–4: Aprendiz — gana mientras aprendes, desde ~$18-26/hr", "Aislador Oficial: Salario sindical completo, $30–65/hr según ubicación", "Capataz: Liderar cuadrillas de aislamiento en proyectos industriales", "Superintendente / Contratista: Gestionar operaciones a gran escala"],
        apprenticeship: "Aprendizaje registrado de 4 años a través de HFIAW JATC. Formación remunerada desde el primer día.",
        website: "insulators.org"
      },
    }
  };

  const CAREER_DATA = {
    en: {
      title: "Career Path in the Union Trades",
      sub: "Every trade offers a structured path from apprentice to master — earning real wages the entire way. No student debt. No unpaid internships.",
      stages: [
        { stage: "Apprentice", years: "Years 1–5", pay: "$18–35/hr", icon: "📋", desc: "You're enrolled in a registered apprenticeship — working full-time on the job while attending trade school. Your wage increases every 6 months. You earn benefits from day one." },
        { stage: "Journeyman", years: "5+ Years", pay: "$35–75/hr", icon: "🔨", desc: "You've completed your apprenticeship and earned your journeyman card. You can work anywhere your union has jurisdiction. Full wages, full benefits, full pension contributions." },
        { stage: "Foreman", years: "8–15 Years", pay: "$45–90/hr", icon: "📐", desc: "Experienced journeymen step into foreman roles — leading crews, reading plans, coordinating materials. Foreman pay includes a premium on top of journeyman scale." },
        { stage: "General Foreman / Super", years: "15+ Years", pay: "$75–120k+/yr", icon: "🏗️", desc: "Managing multiple crews and subcontractors on major projects. Often salaried. Some move into project management, estimating, or inspection roles." },
        { stage: "Master / Business Owner", years: "Varies", pay: "Unlimited", icon: "⭐", desc: "With a master's license (where applicable) you can pull permits and run your own contracting company — while still enjoying union scale on public and prevailing wage work." },
      ],
      whyUnion: [
        { label: "Pension", icon: "💰", desc: "Defined benefit pensions that pay you for life after retirement — rare in today's economy." },
        { label: "Health Insurance", icon: "🏥", desc: "Full family health coverage, often with no premium for the worker. Dental and vision included." },
        { label: "Apprenticeship", icon: "🎓", desc: "Earn while you learn. No student loans. Training paid for by the industry." },
        { label: "Annuity / 401k", icon: "📈", desc: "Additional retirement savings on top of your pension, contributed by employers." },
        { label: "Paid Holidays", icon: "📅", desc: "Union contracts typically include paid holidays, vacation funds, and sick leave." },
        { label: "Safety", icon: "🦺", desc: "Union job sites have strict safety standards. Union members have the right to refuse unsafe work." },
      ],
      stats: [
        { num: "$63/hr", label: "Average journeyman wage in major metro markets" },
        { num: "$0", label: "Cost of apprenticeship training to the worker" },
        { num: "5 Years", label: "Typical apprenticeship length — shorter than a college degree" },
        { num: "300%+", label: "More likely to have employer-provided health insurance" },
      ]
    },
    es: {
      title: "Trayectoria Profesional en los Oficios Sindicales",
      sub: "Cada oficio ofrece un camino estructurado de aprendiz a maestro — ganando salarios reales durante todo el proceso. Sin deuda estudiantil. Sin pasantías sin pago.",
      stages: [
        { stage: "Aprendiz", years: "Años 1–5", pay: "$18–35/hr", icon: "📋", desc: "Estás inscrito en un aprendizaje registrado — trabajando a tiempo completo mientras asistes a la escuela de oficios. Tu salario aumenta cada 6 meses. Recibes beneficios desde el primer día." },
        { stage: "Oficial", years: "5+ Años", pay: "$35–75/hr", icon: "🔨", desc: "Completaste tu aprendizaje y obtuviste tu tarjeta de oficial. Puedes trabajar donde tu sindicato tenga jurisdicción. Salarios completos, beneficios completos, contribuciones completas de pensión." },
        { stage: "Capataz", years: "8–15 Años", pay: "$45–90/hr", icon: "📐", desc: "Los oficiales experimentados asumen roles de capataz — liderando cuadrillas, leyendo planos, coordinando materiales. El pago de capataz incluye una prima sobre la escala de oficial." },
        { stage: "Capataz General / Superintendent", years: "15+ Años", pay: "$75–120k+/año", icon: "🏗️", desc: "Gestionar múltiples cuadrillas y subcontratistas en proyectos importantes. A menudo asalariado." },
        { stage: "Maestro / Propietario", years: "Varía", pay: "Ilimitado", icon: "⭐", desc: "Con una licencia de maestro puedes sacar permisos y manejar tu propia empresa contratista." },
      ],
      whyUnion: [
        { label: "Pensión", icon: "💰", desc: "Pensiones de beneficio definido que te pagan de por vida después de la jubilación." },
        { label: "Seguro Médico", icon: "🏥", desc: "Cobertura médica familiar completa, a menudo sin prima para el trabajador." },
        { label: "Aprendizaje", icon: "🎓", desc: "Gana mientras aprendes. Sin préstamos estudiantiles. Capacitación pagada por la industria." },
        { label: "Anualidad / 401k", icon: "📈", desc: "Ahorros adicionales para la jubilación además de tu pensión, aportados por los empleadores." },
        { label: "Días Festivos Pagados", icon: "📅", desc: "Los contratos sindicales incluyen días festivos pagados, fondos de vacaciones y licencia por enfermedad." },
        { label: "Seguridad", icon: "🦺", desc: "Los sitios de trabajo sindicales tienen estrictas normas de seguridad." },
      ],
      stats: [
        { num: "$63/hr", label: "Salario promedio de oficial en grandes mercados metropolitanos" },
        { num: "$0", label: "Costo del aprendizaje para el trabajador" },
        { num: "5 Años", label: "Duración típica del aprendizaje — más corto que una carrera universitaria" },
        { num: "300%+", label: "Más probabilidades de tener seguro médico proporcionado por el empleador" },
      ]
    },
    pl: {
      title: "Ścieżka Kariery w Zawodach Związkowych",
      sub: "Każdy zawód oferuje ustrukturyzowaną ścieżkę od praktykanta do mistrza — zarabiając prawdziwe wynagrodzenie przez cały czas. Bez długu studenckiego. Bez bezpłatnych staży.",
      stages: [
        { stage: "Praktykant", years: "Lata 1–5", pay: "$18–35/godz", icon: "📋", desc: "Jesteś zapisany do zarejestrowanego programu praktyk — pracujesz w pełnym wymiarze godzin, jednocześnie uczęszczając do szkoły zawodowej. Wynagrodzenie rośnie co 6 miesięcy. Świadczenia od pierwszego dnia." },
        { stage: "Czeladnik", years: "5+ lat", pay: "$35–75/godz", icon: "🔨", desc: "Ukończyłeś praktykę i otrzymałeś kartę czeladnika. Możesz pracować wszędzie, gdzie twój związek ma jurysdykcję. Pełne wynagrodzenie, pełne świadczenia, pełne składki emerytalne." },
        { stage: "Brygadzista", years: "8–15 lat", pay: "$45–90/godz", icon: "📐", desc: "Doświadczeni czeladnicy obejmują role brygadzistów — prowadzą ekipy, czytają plany, koordynują materiały. Wynagrodzenie brygadzisty zawiera premię ponad stawkę czeladnika." },
        { stage: "Główny Brygadzista / Superintendent", years: "15+ lat", pay: "$75–120k+/rok", icon: "🏗️", desc: "Zarządzanie wieloma ekipami i podwykonawcami przy dużych projektach. Często na etacie." },
        { stage: "Mistrz / Właściciel", years: "Różnie", pay: "Nieograniczone", icon: "⭐", desc: "Z licencją mistrzowską możesz uzyskiwać pozwolenia i prowadzić własną firmę wykonawczą." },
      ],
      whyUnion: [
        { label: "Emerytura", icon: "💰", desc: "Emerytury ze zdefiniowanym świadczeniem, które wypłacają Ci przez całe życie po przejściu na emeryturę." },
        { label: "Ubezpieczenie Zdrowotne", icon: "🏥", desc: "Pełne ubezpieczenie zdrowotne rodziny, często bez składki dla pracownika. Dentysta i wzrok w zestawie." },
        { label: "Praktyka", icon: "🎓", desc: "Zarabiaj ucząc się. Bez pożyczek studenckich. Szkolenie opłacone przez przemysł." },
        { label: "Renta / 401k", icon: "📈", desc: "Dodatkowe oszczędności emerytalne oprócz emerytury, wnoszone przez pracodawców." },
        { label: "Płatne Urlopy", icon: "📅", desc: "Umowy związkowe obejmują płatne dni wolne, fundusze urlopowe i urlop chorobowy." },
        { label: "Bezpieczeństwo", icon: "🦺", desc: "Place budowy związkowe mają surowe standardy bezpieczeństwa. Członkowie mają prawo odmówić niebezpiecznej pracy." },
      ],
      stats: [
        { num: "$63/godz", label: "Średnie wynagrodzenie czeladnika na głównych rynkach miejskich" },
        { num: "$0", label: "Koszt szkolenia praktykanta dla pracownika" },
        { num: "5 lat", label: "Typowy czas trwania praktyki — krótszy niż studia wyższe" },
        { num: "300%+", label: "Większe prawdopodobieństwo posiadania ubezpieczenia zdrowotnego od pracodawcy" },
      ]
    }
  };

  // Polish TRADE_RESULTS added inline below ES
  TRADE_RESULTS.pl = {
    IBEW: {
      name: "IBEW — Elektrycy",
      color: "#F5C518",
      icon: "⚡",
      why: "Przyciąga Cię technologia, praca precyzyjna i systemy zasilające współczesny świat. Elektrycy należą do najlepiej opłacanych w zawodach budowlanych i pracują przy wszystkim — od domów po szpitale i centra danych.",
      path: ["Lata 1–5: Praktykant — zarabiaj ucząc się, zaczynając od ~$20-28/godz", "Czeladnik: Pełna stawka związkowa, zazwyczaj $35–75/godz zależnie od lokalizacji", "Brygadzista: Prowadzenie ekip przy dużych projektach", "Elektryk Mistrzowski / Właściciel: Prowadzenie własnej firmy"],
      apprenticeship: "5-letnia zarejestrowana praktyka przez NECA-IBEW JATC. Bez długu studenckiego.",
      website: "ibew.org"
    },
    UA: {
      name: "UA — Hydraulicy i Monterzy",
      color: "#3b9eff",
      icon: "🔧",
      why: "Interesują Cię systemy utrzymujące budynki w ruchu — woda, gaz, para i ogrzewanie/chłodzenie. Zawody rurociągowe są niezbędne przy każdym dużym projekcie budowlanym.",
      path: ["Lata 1–5: Praktykant — zaczynając od ~$18-26/godz", "Czeladnik Hydraulik/Monter: Pełna stawka, $30–70/godz", "Brygadzista: Prowadzenie ekip przy projektach komercyjnych i przemysłowych", "Mistrz Hydrauliczny / Właściciel: Licencja i własna firma"],
      apprenticeship: "5-letnia zarejestrowana praktyka przez UA JATC. Zarabiasz od pierwszego dnia.",
      website: "ua.org"
    },
    SMART: {
      name: "SMART — Blacharze",
      color: "#e05a2b",
      icon: "🌬️",
      why: "Interesujesz się HVAC, kanałami wentylacyjnymi i systemami kontrolującymi przepływ powietrza w budynkach.",
      path: ["Lata 1–5: Praktykant — zaczynając od ~$17-24/godz", "Czeladnik Blacharz: Pełna stawka, $30–65/godz", "Brygadzista: Zarządzanie montażem kanałów i ekipami HVAC", "Kosztorysant / Kierownik Projektu: Przejście na stronę biznesową"],
      apprenticeship: "5-letnia praktyka przez centra szkoleniowe SMART JATC.",
      website: "smart-union.org"
    },
    "BAC": {
      name: "BAC — Murarze i Rzemieślnicy Pokrewni",
      color: "#f97316",
      icon: "🧱",
      why: "Przyciąga Cię praca manualna przy budowaniu trwałych konstrukcji z cegły, kamienia, płytek i murów. Murarze związkowi zarabiają doskonałe wynagrodzenia z pełnymi świadczeniami.",
      path: ["Lata 1-3: Praktykant — zaczynając ~$18-26/godz", "Czeladnik Murarz: Pełne wynagrodzenie, $30-65/godz", "Brygadzista: Prowadzenie ekip murarskich przy projektach komercyjnych", "Superintendent / Wykonawca: Prowadzenie własnej firmy murarskiej"],
      apprenticeship: "3-letnia zarejestrowana praktyka przez BAC JATC. Płatne szkolenie od pierwszego dnia.",
      website: "bacweb.org"
    },
    "UBC": {
      name: "UBC — Cieśle",
      color: "#a78bfa",
      icon: "🪚",
      why: "Lubisz pracować z drewnem, budować konstrukcje i widzieć fizyczne efekty swojej pracy.",
      path: ["Lata 1–4: Praktykant — szkieletowanie, wykończenie, szalunki", "Czeladnik Cieśla: Pełna stawka przy projektach komercyjnych i mieszkaniowych", "Brygadzista: Prowadzenie ekip ciesielskich", "Superintendent / Wykonawca: Prowadzenie własnych projektów"],
      apprenticeship: "4-letnia praktyka przez regionalne rady UBC.",
      website: "carpenters.org"
    },
      HFIAW: {
        name: "HFIAW — Izolatorzy",
        color: "#38bdf8",
        icon: "🧊",
        why: "Pociąga Cię techniczny aspekt systemów przemysłowych — izolowanie rur, urządzeń i obiektów dla efektywności i bezpieczeństwa. Izolatorzy pracują w elektrowniach, rafineriach i budynkach komercyjnych.",
        path: ["Lata 1–4: Praktykant — zarabiaj ucząc się, od ~$18-26/hr", "Izolator Czeladnik: Pełne wynagrodzenie związkowe, $30–65/hr", "Brygadzista: Kierowanie ekipami izolacyjnymi przy projektach przemysłowych", "Superintendent / Wykonawca: Zarządzanie dużymi operacjami izolacyjnymi"],
        apprenticeship: "4-letnia praktyka zarejestrowana przez HFIAW JATC. Płatne szkolenie od pierwszego dnia.",
        website: "insulators.org"
      },
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const resolveLocation = async (input) => {
    const q = input.trim();
    if (!q) return null;

    const ALL = [...IBEW_INSIDE_LOCALS, ...IBEW_LINEMAN_LOCALS, ...UA_LOCALS, ...SMART_LOCALS, ...BAC_LOCALS, ...UBC_LOCALS, ...HFIAW_LOCALS];

    // ZIP code (5 digits) — use local ZIP map first for speed
    if (/^\d{5}$/.test(q)) {
      const entry = ZIP_PREFIX_MAP[q.slice(0, 3)];
      if (entry) return { lat: entry[1], lng: entry[2], display: `ZIP ${q}` };
    }

    // Try Nominatim geocoding for any city/address input
    try {
      const encoded = encodeURIComponent(q + ", USA");
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=us`, {
        headers: { "Accept-Language": "en", "User-Agent": "UnionPathway/1.0" }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name.split(",").slice(0,2).join(",").trim() };
      }
    } catch (e) {
      // Fall through to local lookup
    }

    // Fallback: known city lookup table
    const qLow = q.toLowerCase();
    if (CITY_COORDS[qLow]) return { lat: CITY_COORDS[qLow][0], lng: CITY_COORDS[qLow][1], display: q };

    // Fallback: state name only
    const stateAbbr2 = STATE_NAMES[qLow] || (STATE_CENTERS[q.toUpperCase()] ? q.toUpperCase() : null);
    if (stateAbbr2 && STATE_CENTERS[stateAbbr2]) {
      const sc2 = STATE_CENTERS[stateAbbr2];
      return { lat: sc2.lat, lng: sc2.lng, display: q };
    }

    // Fallback: city name search across all locals
    const cityHit = ALL.find(l => l.city.toLowerCase() === qLow)
      || ALL.find(l => l.city.toLowerCase().includes(qLow));
    if (cityHit) return { lat: cityHit.lat, lng: cityHit.lng, display: `${cityHit.city}, ${cityHit.state}` };

    return null;
  };

  const handleSearch = async (searchQuery) => {
    const q = (searchQuery || query).trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResults(null);

    const loc = await resolveLocation(q);
    if (!loc) {
      setError(t.errorMsg);
      setLoading(false);
      return;
    }

    setLocationLabel(loc.display);
    const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
    const withDist = database
      .map(l => ({ ...l, distance: getDistanceMiles(loc.lat, loc.lng, l.lat, l.lng) }))
      .sort((a, b) => a.distance - b.distance);
    const within150 = withDist.filter(l => l.distance <= 150);
    setResults(within150.length > 0 ? within150 : withDist.slice(0, 5));
    setLoading(false);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported by your browser."); return; }
    setGeoLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocationLabel("Your Current Location");
        const database = selectedTrade === "UA" ? UA_LOCALS : selectedTrade === "SMART" ? SMART_LOCALS : selectedTrade === "BAC" ? BAC_LOCALS : selectedTrade === "UBC" ? UBC_LOCALS : selectedTrade === "HFIAW" ? HFIAW_LOCALS : selectedTrade === "IBEW_L" ? IBEW_LINEMAN_LOCALS : IBEW_INSIDE_LOCALS;
        const withDist = database
          .map(l => ({ ...l, distance: getDistanceMiles(lat, lng, l.lat, l.lng) }))
          .sort((a, b) => a.distance - b.distance);
        const within150 = withDist.filter(l => l.distance <= 150);
        setResults(within150.length > 0 ? within150 : withDist.slice(0, 5));
        setGeoLoading(false);
      },
      () => { setError("Location access denied. Please enter your location manually."); setGeoLoading(false); }
    );
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleQuizAnswer = (answer, idx) => {
    const newAnswers = [...quizAnswers, idx];
    setQuizAnswers(newAnswers);
    if (quizStep < QUIZ[lang].length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Score: first two questions determine trade
      const tradeVotes = { IBEW: 0, UA: 0, SMART: 0, BAC: 0, UBC: 0 };
      [0, 1].forEach(qi => {
        const q = QUIZ[lang][qi];
        if (q.trades && newAnswers[qi] !== undefined) {
          const trade = q.trades[newAnswers[qi]];
          if (trade && tradeVotes[trade] !== undefined) tradeVotes[trade]++;
        }
      });
      const top = Object.entries(tradeVotes).sort((a,b) => b[1]-a[1])[0][0];
      setQuizResult(top);
    }
  };

  const resetQuiz = () => { setQuizStep(0); setQuizAnswers([]); setQuizResult(null); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --yellow: #F5C518;
          --yellow-dim: #c9a012;
          --steel: #0f1923;
          --steel-mid: #162130;
          --steel-light: #1e2f42;
          --plate: #243347;
          --wire: #2e4260;
          --text: #e8edf2;
          --muted: #7a92a8;
          --card-bg: #152030;
        }

        body {
          font-family: 'Barlow', sans-serif;
          background: var(--steel);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app { min-height: 100vh; display: flex; flex-direction: column; }

        /* ── NAV ── */
        nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          background: rgba(15,25,35,0.95);
          border-bottom: 1px solid rgba(245,197,24,0.15);
          backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 100;
          gap: 8px; flex-wrap: wrap;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
        }
        .nav-bolt {
          width: 32px; height: 32px;
          background: var(--yellow);
          clip-path: polygon(60% 0%, 100% 0%, 40% 50%, 80% 50%, 0% 100%, 20% 55%, -10% 55%);
          flex-shrink: 0;
        }
        .nav-wordmark {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .nav-wordmark span { color: var(--yellow); }
        .nav-right { position: relative; }

        .nav-trades-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.25);
          border-radius: 8px;
          padding: 9px 16px;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .nav-trades-btn:hover, .nav-trades-btn.open {
          background: rgba(245,197,24,0.15);
          border-color: var(--yellow);
          color: var(--yellow);
        }
        .nav-trades-btn .chevron {
          transition: transform 0.2s ease;
        }
        .nav-trades-btn.open .chevron { transform: rotate(180deg); }

        .trades-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          width: 380px;
          background: var(--steel-light);
          border: 1px solid var(--wire);
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,197,24,0.06);
          overflow: hidden;
          display: flex; flex-direction: column;
          max-height: min(70vh, 520px);
          animation: dropIn 0.18s ease;
          z-index: 200;
        }
        .dropdown-scroll-body {
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          flex: 1;
        }
        .dropdown-scroll-body::-webkit-scrollbar { width: 4px; }
        .dropdown-scroll-body::-webkit-scrollbar-track { background: transparent; }
        .dropdown-scroll-body::-webkit-scrollbar-thumb { background: var(--wire); border-radius: 4px; }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid var(--wire);
          background: rgba(245,197,24,0.04);
        }
        .dropdown-title {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--text); margin-bottom: 3px;
        }
        .dropdown-sub { font-size: 12px; color: var(--muted); }

        .dropdown-group { padding: 10px 0; border-bottom: 1px solid rgba(46,66,96,0.5); }
        .dropdown-group:last-of-type { border-bottom: none; }

        .dropdown-group-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); padding: 4px 20px 8px;
        }

        .dropdown-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 20px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .dropdown-item.active.selected {
          background: rgba(245,197,24,0.08);
          border-left: 3px solid var(--yellow);
        }
        .dropdown-item.active:hover { background: rgba(245,197,24,0.06); }
        .dropdown-item.coming { opacity: 0.55; cursor: default; }

        .trade-abbr-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 800;
          letter-spacing: 0.05em;
          border: 1px solid var(--wire);
          color: var(--muted);
          border-radius: 5px;
          padding: 3px 6px;
          min-width: 52px; text-align: center;
          flex-shrink: 0;
        }
        .dropdown-item.active .trade-abbr-badge {
          border-color: rgba(245,197,24,0.4);
          color: var(--yellow);
        }

        .trade-info { flex: 1; }
        .trade-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.02em; color: var(--text);
        }
        .trade-full { font-size: 11px; color: var(--muted); margin-top: 1px; }

        .trade-status { flex-shrink: 0; }
        .status-live {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          color: #4ade80; letter-spacing: 0.05em;
        }
        .status-soon {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          background: var(--plate);
          border: 1px solid var(--wire);
          color: var(--muted);
          border-radius: 4px; padding: 2px 7px;
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        .dropdown-footer {
          padding: 12px 20px;
          font-size: 11px; color: var(--muted);
          background: rgba(0,0,0,0.2);
          border-top: 1px solid var(--wire);
          text-align: center;
        }
        .dropdown-footer a { color: var(--yellow); text-decoration: none; }
        .dropdown-footer a:hover { text-decoration: underline; }


          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          background: rgba(245,197,24,0.12);
          border: 1px solid rgba(245,197,24,0.3);
          color: var(--yellow);
          padding: 4px 10px; border-radius: 4px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* ── HERO ── */
        .hero {
          flex: 1;
          display: flex; flex-direction: column; align-items: center;
          padding: 70px 24px 60px;
          position: relative; overflow: hidden;
        }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .hero-glow {
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(245,197,24,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          position: relative; z-index: 1;
          max-width: 760px; width: 100%;
          text-align: center;
          margin: 0 auto;
          display: flex; flex-direction: column; align-items: center;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-content.visible { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--yellow);
          margin-bottom: 20px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .eyebrow-line { width: 32px; height: 1px; background: var(--yellow); opacity: 0.5; }

        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px, 9vw, 92px);
          font-weight: 900;
          line-height: 0.92;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 24px;
        }
        .hero-title .accent { color: var(--yellow); display: block; }

        .hero-sub {
          font-size: 17px; font-weight: 300; color: var(--muted);
          line-height: 1.6; max-width: 520px; margin: 0 auto 48px;
        }
        .hero-sub strong { color: var(--text); font-weight: 500; }

        /* ── SEARCH BOX ── */
        .search-card {
          background: var(--steel-light);
          border: 1px solid var(--wire);
          border-radius: 16px;
          padding: 28px 32px;
          width: 100%; max-width: 620px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.05);
          transition: transform 0.3s ease;
        }
        .search-card:hover { transform: translateY(-2px); }

        .search-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--muted);
          margin-bottom: 14px; display: block;
        }

        .search-row {
          display: flex; gap: 10px;
        }

        .search-input {
          flex: 1;
          background: var(--steel-mid);
          border: 1.5px solid var(--wire);
          border-radius: 10px;
          padding: 14px 18px;
          font-family: 'Barlow', sans-serif;
          font-size: 16px; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(245,197,24,0.1);
        }

        .btn-search {
          background: var(--yellow);
          color: var(--steel);
          border: none; cursor: pointer;
          border-radius: 10px;
          padding: 14px 26px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: background 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .btn-search:hover { background: #ffd740; transform: translateY(-1px); }
        .btn-search:active { transform: translateY(0); }
        .btn-search:disabled { opacity: 0.6; cursor: not-allowed; }

        .search-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0;
          color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .search-divider::before, .search-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--wire);
        }

        .btn-geo {
          width: 100%;
          background: transparent;
          border: 1.5px solid var(--wire);
          border-radius: 10px;
          padding: 12px 20px;
          color: var(--muted);
          font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .btn-geo:hover {
          border-color: var(--yellow);
          color: var(--yellow);
          background: rgba(245,197,24,0.05);
        }

        /* ── LOADING ── */
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(245,197,24,0.3);
          border-top-color: var(--yellow);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── ERROR ── */
        .error-msg {
          margin-top: 14px;
          padding: 12px 16px;
          background: rgba(255, 80, 80, 0.08);
          border: 1px solid rgba(255, 80, 80, 0.25);
          border-radius: 8px;
          color: #ff8080; font-size: 14px;
        }

        /* ── RESULTS ── */
        .results-section {
          width: 100%; max-width: 760px;
          margin: 48px auto 0; padding: 0 24px 80px;
        }
        .results-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 24px;
        }
        .results-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .results-title span { color: var(--yellow); }
        .results-location {
          font-size: 12px; color: var(--muted);
          font-style: italic;
        }

        .local-card {
          background: var(--card-bg);
          border: 1px solid var(--wire);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 14px;
          display: flex; align-items: flex-start; gap: 20px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          animation: slideUp 0.4s ease both;
        }
        .local-card:nth-child(1) { animation-delay: 0.05s; }
        .local-card:nth-child(2) { animation-delay: 0.12s; }
        .local-card:nth-child(3) { animation-delay: 0.19s; }
        .local-card:nth-child(4) { animation-delay: 0.26s; }
        .local-card:nth-child(5) { animation-delay: 0.33s; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .local-card:hover {
          border-color: var(--yellow);
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,197,24,0.15);
        }

        .card-rank {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          color: rgba(245,197,24,0.2);
          line-height: 1; min-width: 36px; text-align: center;
          padding-top: 4px;
        }
        .local-card:hover .card-rank { color: rgba(245,197,24,0.5); }

        .card-body { flex: 1; }

        .card-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.03em;
          margin-bottom: 4px;
        }

        .card-location {
          font-size: 13px; color: var(--muted); margin-bottom: 14px;
        }

        .card-info {
          display: flex; flex-wrap: wrap; gap: 10px;
        }

        .info-chip {
          display: flex; align-items: center; gap: 6px;
          background: var(--steel-light);
          border: 1px solid var(--wire);
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 13px; color: var(--muted);
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .info-chip:hover { border-color: var(--yellow); color: var(--yellow); }
        .info-chip svg { flex-shrink: 0; }

        .card-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
        .btn-share {
          background: transparent;
          border: 1px solid var(--wire);
          border-radius: 8px; padding: 8px 14px;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-share:hover { border-color: var(--yellow); color: var(--yellow); }
        .btn-correction {
          background: transparent; border: none;
          color: rgba(255,255,255,0.3); cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 11px; padding: 8px 4px;
          transition: color 0.2s;
        }
        .btn-correction:hover { color: var(--muted); }

        .btn-apply {
          background: var(--yellow);
          color: var(--steel);
          border: none; cursor: pointer;
          border-radius: 8px; padding: 10px 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; display: inline-block;
          transition: background 0.2s;
        }
        .btn-apply:hover { background: #ffd740; }

        .btn-website {
          background: transparent;
          border: 1.5px solid var(--wire);
          color: var(--muted); cursor: pointer;
          border-radius: 8px; padding: 10px 20px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          text-decoration: none; display: inline-block;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-website:hover { border-color: var(--yellow); color: var(--yellow); }

        .card-distance {
          text-align: right; min-width: 80px;
          display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
        }
        .distance-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          color: var(--yellow); line-height: 1;
        }
        .distance-unit {
          font-size: 11px; color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .nearest-badge {
          background: rgba(245,197,24,0.12);
          border: 1px solid rgba(245,197,24,0.3);
          color: var(--yellow);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px; white-space: nowrap;
        }

        /* ── FEATURES STRIP ── */
        .features {
          border-top: 1px solid var(--wire);
          padding: 40px 24px;
          display: flex; justify-content: center; gap: 60px;
          flex-wrap: wrap;
        }
        .feature {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; color: var(--muted);
        }
        .feature-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.15);
          display: flex; align-items: center; justify-content: center;
        }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid var(--wire);
          padding: 20px 40px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: var(--muted);
          flex-wrap: wrap; gap: 8px;
        }

        /* ── LANGUAGE TOGGLE ── */
        .lang-btn {
          background: transparent;
          border: 1.5px solid var(--wire);
          border-radius: 6px;
          padding: 8px 14px;
          color: var(--muted);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.08em; cursor: pointer;
          transition: all 0.2s; min-width: 40px;
          -webkit-tap-highlight-color: transparent;
        }
        .lang-btn:hover { border-color: var(--yellow); color: var(--yellow); }
        .lang-btn.active { background: var(--yellow); color: var(--steel); border-color: var(--yellow); }

        /* ── NAV LINKS ── */
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 7px 12px; border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: var(--yellow); }

        /* ── NAV DROPDOWN ── */
        .nav-dropdown-wrap { position: relative; }
        .nav-dropdown-btn {
          background: transparent; border: none;
          color: var(--muted); cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 7px 12px; border-radius: 6px;
          display: flex; align-items: center; gap: 5px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-dropdown-btn:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-dropdown-btn.active { color: var(--yellow); }
        .nav-dropdown-btn svg { transition: transform 0.2s; }
        .nav-dropdown-btn.open svg { transform: rotate(180deg); }
        .nav-dropdown-menu {
          position: absolute; top: calc(100% + 6px); left: 0;
          background: var(--steel-mid);
          border: 1px solid var(--wire);
          border-radius: 10px; overflow: hidden;
          min-width: 180px; z-index: 200;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: fadeIn 0.15s ease;
        }
        .nav-dropdown-item {
          display: flex; flex-direction: column;
          padding: 12px 16px; cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          text-align: left;
        }
        .nav-dropdown-item:last-child { border-bottom: none; }
        .nav-dropdown-item:hover { background: rgba(255,255,255,0.06); }
        .nav-dropdown-item.active .nav-dropdown-label { color: var(--yellow); }
        .nav-dropdown-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--text);
        }
        .nav-dropdown-sub {
          font-size: 11px; color: var(--muted); margin-top: 2px;
        }

        /* ── QUIZ PAGE ── */
        .page { max-width: 700px; margin: 0 auto; padding: 48px 24px 80px; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .page-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--yellow);
          margin-bottom: 12px;
        }
        .page-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(36px, 6vw, 56px); font-weight: 900;
          text-transform: uppercase; line-height: 1; margin-bottom: 16px;
        }
        .page-sub { font-size: 16px; color: var(--muted); line-height: 1.6; margin-bottom: 40px; max-width: 560px; }

        .quiz-progress {
          display: flex; gap: 6px; margin-bottom: 32px;
        }
        .quiz-pip {
          height: 3px; flex: 1; border-radius: 2px;
          background: var(--wire); transition: background 0.3s;
        }
        .quiz-pip.done { background: var(--yellow); }

        .quiz-question {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 800;
          margin-bottom: 20px; line-height: 1.2;
        }
        .quiz-step-label {
          font-size: 12px; color: var(--muted);
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px;
        }

        .quiz-options { display: flex; flex-direction: column; gap: 10px; }
        .quiz-option {
          background: var(--card-bg);
          border: 1.5px solid var(--wire);
          border-radius: 10px;
          padding: 16px 20px;
          text-align: left; cursor: pointer; color: var(--text);
          font-family: 'Barlow', sans-serif; font-size: 15px;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          display: flex; align-items: center; gap: 12px;
        }
        .quiz-option:hover { border-color: var(--yellow); background: rgba(245,197,24,0.05); transform: translateX(4px); }
        .quiz-option-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800; color: var(--muted);
          min-width: 20px;
        }

        /* ── QUIZ RESULT ── */
        .quiz-result { animation: fadeIn 0.4s ease; }
        .result-card {
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          border: 1px solid;
        }
        .result-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .result-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .result-why { font-size: 15px; line-height: 1.7; color: var(--muted); margin-bottom: 24px; }
        .result-path { margin-bottom: 24px; }
        .result-path-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 12px;
        }
        .result-path-step {
          display: flex; gap: 12px; padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 14px; color: var(--text); align-items: flex-start;
        }
        .result-path-step:last-child { border-bottom: none; }
        .step-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--yellow); margin-top: 6px; flex-shrink: 0;
        }
        .result-app-note {
          font-size: 13px; color: var(--muted); font-style: italic;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px; border: 1px solid var(--wire);
          margin-bottom: 20px;
        }
        .result-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-primary {
          background: var(--yellow); color: var(--steel);
          border: none; cursor: pointer; border-radius: 8px;
          padding: 12px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.06em; text-transform: uppercase;
          text-decoration: none; display: inline-block;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #ffd740; }
        .btn-ghost {
          background: transparent; color: var(--muted);
          border: 1.5px solid var(--wire); cursor: pointer;
          border-radius: 8px; padding: 12px 24px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: var(--yellow); color: var(--yellow); }

        /* ── CAREER PATH PAGE ── */
        .career-stats {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 16px; margin-bottom: 48px;
        }
        .stat-card {
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 12px; padding: 20px;
        }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px; font-weight: 900; color: var(--yellow);
          line-height: 1; margin-bottom: 6px;
        }
        .stat-label { font-size: 13px; color: var(--muted); line-height: 1.4; }

        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--wire);
        }

        .career-stages { margin-bottom: 48px; }
        .career-stage {
          display: flex; gap: 20px;
          padding: 24px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          align-items: flex-start;
        }
        .stage-icon {
          font-size: 28px; min-width: 44px; text-align: center;
          padding-top: 4px;
        }
        .stage-info { flex: 1; }
        .stage-header {
          display: flex; align-items: baseline;
          gap: 12px; margin-bottom: 8px; flex-wrap: wrap;
        }
        .stage-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800; text-transform: uppercase;
        }
        .stage-years { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .stage-pay {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 800; color: var(--yellow);
          margin-left: auto;
        }
        .stage-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }

        .benefits-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 14px; margin-bottom: 40px;
        }
        .benefit-card {
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 18px;
        }
        .benefit-icon { font-size: 22px; margin-bottom: 10px; }
        .benefit-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 800;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .benefit-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }

        .cta-banner {
          background: rgba(245,197,24,0.08);
          border: 1px solid rgba(245,197,24,0.25);
          border-radius: 14px; padding: 28px;
          text-align: center; margin-top: 16px;
        }
        .cta-banner h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 10px;
        }
        .cta-banner p { color: var(--muted); font-size: 14px; margin-bottom: 20px; }

        /* ── CHECKLIST PAGE ── */
        .checklist-intro {
          background: rgba(245,197,24,0.06);
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 14px;
          padding: 24px 28px;
          margin-bottom: 40px;
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
        }
        .checklist-intro strong { color: var(--text); }

        .checklist-section { margin-bottom: 40px; }
        .checklist-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .checklist-section-title::after {
          content: ''; flex: 1; height: 1px; background: var(--wire);
        }

        .checklist-items { display: flex; flex-direction: column; gap: 10px; }
        .checklist-item {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--card-bg);
          border: 1px solid var(--wire);
          border-radius: 10px;
          padding: 16px 18px;
        }
        .checklist-item.required { border-left: 3px solid var(--yellow); }
        .checklist-item.optional { border-left: 3px solid #4a9eff; }
        .checklist-item.helpful  { border-left: 3px solid #22c55e; }

        .checklist-icon { font-size: 22px; min-width: 28px; text-align: center; }
        .checklist-text { flex: 1; }
        .checklist-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .checklist-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .checklist-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px;
          margin-left: 8px; vertical-align: middle;
        }
        .tag-required { background: rgba(245,197,24,0.15); color: var(--yellow); }
        .tag-optional { background: rgba(74,158,255,0.15); color: #4a9eff; }
        .tag-helpful  { background: rgba(34,197,94,0.15); color: #22c55e; }

        .trade-diff-grid {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: 14px; margin-bottom: 40px;
        }
        .trade-diff-card {
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 18px;
        }
        .trade-diff-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .trade-diff-list {
          font-size: 13px; color: var(--muted);
          line-height: 1.8; list-style: none; padding: 0; margin: 0;
        }
        .trade-diff-list li::before { content: "→ "; color: var(--yellow); }

        .checklist-steps {
          counter-reset: steps;
          display: flex; flex-direction: column; gap: 12px;
        }
        .checklist-step {
          display: flex; gap: 16px; align-items: flex-start;
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 16px 18px;
        }
        .step-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 900; color: var(--yellow);
          min-width: 32px; line-height: 1;
        }
        .step-content { flex: 1; }
        .step-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px; font-weight: 800;
          text-transform: uppercase; margin-bottom: 4px;
        }
        .step-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

        .checklist-legend {
          display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--muted);
        }
        .legend-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }

        @media (max-width: 640px) {
          .trade-diff-grid { grid-template-columns: 1fr; }
        }

        /* ── VETERANS PAGE ── */
        .h2h-hero {
          background: linear-gradient(135deg, rgba(15,25,35,0.95), rgba(30,45,60,0.9));
          border: 1px solid rgba(245,197,24,0.2);
          border-radius: 16px; padding: 36px;
          margin-bottom: 40px;
          display: flex; gap: 32px; align-items: center; flex-wrap: wrap;
        }
        .h2h-logo-block { text-align: center; flex-shrink: 0; }
        .h2h-emblem { font-size: 64px; line-height: 1; margin-bottom: 8px; }
        .h2h-logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase; color: var(--yellow);
        }
        .h2h-hero-text { flex: 1; min-width: 240px; }
        .h2h-hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 12px; line-height: 1.1;
        }
        .h2h-hero-desc { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
        .h2h-stat-row { display: flex; gap: 24px; flex-wrap: wrap; }
        .h2h-stat { text-align: center; }
        .h2h-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900; color: var(--yellow); line-height: 1;
        }
        .h2h-stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
        .vet-advantage-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; margin-bottom: 40px; }
        .vet-advantage-card {
          background: var(--card-bg); border: 1px solid var(--wire);
          border-radius: 10px; padding: 18px;
          display: flex; gap: 14px; align-items: flex-start;
        }
        .vet-adv-icon { font-size: 24px; min-width: 32px; }
        .vet-adv-label { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
        .vet-adv-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
        .h2h-steps { display: flex; flex-direction: column; margin-bottom: 40px; }
        .h2h-step { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: flex-start; }
        .h2h-step:last-child { border-bottom: none; }
        .h2h-step-num { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 900; color: var(--yellow); min-width: 36px; line-height: 1; }
        .h2h-step-title { font-family: 'Barlow Condensed', sans-serif; font-size: 17px; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; }
        .h2h-step-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .gi-bill-box {
          background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.25);
          border-radius: 12px; padding: 24px 28px; margin-bottom: 40px;
          display: flex; gap: 20px; align-items: flex-start;
        }
        .gi-bill-icon { font-size: 36px; flex-shrink: 0; }
        .gi-bill-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 900; text-transform: uppercase; color: #22c55e; margin-bottom: 8px; }
        .gi-bill-desc { font-size: 14px; color: var(--muted); line-height: 1.7; }
        .trades-vet-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 40px; }
        .trade-vet-card { background: var(--card-bg); border: 1px solid var(--wire); border-radius: 10px; padding: 16px; display: flex; gap: 12px; align-items: center; }
        .trade-vet-icon { font-size: 26px; }
        .trade-vet-name { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 800; text-transform: uppercase; }
        .trade-vet-desc { font-size: 12px; color: var(--muted); }
        @media (max-width: 640px) {
          .vet-advantage-grid { grid-template-columns: 1fr; }
          .trades-vet-grid { grid-template-columns: 1fr; }
          .h2h-hero { flex-direction: column; text-align: center; }
          .gi-bill-box { flex-direction: column; }
        }

        .contact-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 48px; align-items: start;
        }
        .contact-info-block { margin-bottom: 28px; }
        .contact-info-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 6px;
        }
        .contact-info-value { font-size: 15px; color: var(--text); }

        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 8px;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: var(--steel-mid);
          border: 1.5px solid var(--wire);
          border-radius: 8px;
          padding: 12px 16px;
          font-family: 'Barlow', sans-serif;
          font-size: 15px; color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--yellow);
          box-shadow: 0 0 0 3px rgba(245,197,24,0.1);
        }
        .form-select { appearance: none; cursor: pointer; }
        .form-select option { background: var(--steel-mid); color: var(--text); }
        .form-textarea { resize: vertical; min-height: 130px; line-height: 1.6; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .contact-success {
          text-align: center; padding: 48px 24px;
          animation: fadeIn 0.4s ease;
        }
        .contact-success-icon { font-size: 56px; margin-bottom: 20px; }
        .contact-success h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900;
          text-transform: uppercase; margin-bottom: 12px; color: var(--yellow);
        }
        .contact-success p { color: var(--muted); font-size: 15px; margin-bottom: 24px; }

        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
          .form-row { grid-template-columns: 1fr; }
        }
          .search-card { padding: 20px 20px; }
          .search-row { flex-direction: column; }
          .btn-search { width: 100%; }
          .results-section { padding: 0 16px 60px; }
          .local-card { flex-direction: column; gap: 12px; }
          .card-distance { flex-direction: row; align-items: center; gap: 10px; }
          .features { gap: 30px; }
          footer { justify-content: center; text-align: center; }
          .nav-wordmark { font-size: 17px; }
          .nav-link { padding: 5px 7px; font-size: 10px; }
          .nav-trades-btn { padding: 7px 10px; font-size: 12px; }
          .trades-dropdown { width: calc(100vw - 32px); right: -8px; }
          .career-stats { grid-template-columns: 1fr; }
          .benefits-grid { grid-template-columns: 1fr; }
          .stage-pay { margin-left: 0; }
          .page { padding: 32px 16px 60px; }
        }

      `}</style>

      <div className="app">
        {/* NAV */}
        <nav>
          <div className="nav-logo" style={{cursor:"pointer"}} onClick={() => setPage("home")}>
            <div className="nav-bolt" />
            <div className="nav-wordmark">Union<span>Pathways</span></div>
          </div>

          <div className="nav-links">
            <button className={`nav-link ${page==="home"?"active":""}`} onClick={() => setPage("home")}>{t.navHome}</button>
            <button className={`nav-link ${page==="quiz"?"active":""}`} onClick={() => { setPage("quiz"); resetQuiz(); }}>{t.navQuiz}</button>

            {/* GET STARTED DROPDOWN */}
            <div className="nav-dropdown-wrap" style={{position:"relative"}}>
              <button
                className={`nav-dropdown-btn${(page==="careers"||page==="checklist")?" active":""}${getStartedOpen?" open":""}`}
                onClick={() => setGetStartedOpen(o => !o)}
                onBlur={() => setTimeout(() => setGetStartedOpen(false), 150)}
              >
                {lang==="es" ? "Empezar" : lang==="pl" ? "Zacznij" : "Get Started"}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {getStartedOpen && (
                <div className="nav-dropdown-menu">
                  <div
                    className={`nav-dropdown-item${page==="careers"?" active":""}`}
                    onMouseDown={() => { setPage("careers"); setGetStartedOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{t.navCareers}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Salarios, etapas y beneficios" : lang==="pl" ? "Wynagrodzenia, etapy i świadczenia" : "Wages, stages & benefits"}</span>
                  </div>
                  <div
                    className={`nav-dropdown-item${page==="checklist"?" active":""}`}
                    onMouseDown={() => { setPage("checklist"); setGetStartedOpen(false); }}
                  >
                    <span className="nav-dropdown-label">{t.navChecklist}</span>
                    <span className="nav-dropdown-sub">{lang==="es" ? "Requisitos y cómo aplicar" : lang==="pl" ? "Wymagania i jak aplikować" : "Requirements & how to apply"}</span>
                  </div>
                </div>
              )}
            </div>

            <button className={`nav-link ${page==="veterans"?"active":""}`} onClick={() => setPage("veterans")}>{t.navVets}</button>
            <button className={`nav-link ${page==="contact"?"active":""}`} onClick={() => { setPage("contact"); setContactSent(false); }}>{t.navContact}</button>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:"6px"}}>
            <button className={`lang-btn ${lang==="en"?"active":""}`} onClick={() => setLang("en")}>EN</button>
            <button className={`lang-btn ${lang==="es"?"active":""}`} onClick={() => setLang("es")}>ES</button>
            <button className={`lang-btn ${lang==="pl"?"active":""}`} onClick={() => setLang("pl")}>PL</button>
          </div>

          {/* TRADES DROPDOWN — only on home */}
          {page === "home" && (
          <div className="nav-right" ref={dropdownRef}>
            <button
              className={`nav-trades-btn ${dropdownOpen ? "open" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              All Trades · <span style={{color:"var(--yellow)"}}>{selectedTrade === "IBEW_I" ? "IBEW Inside" : selectedTrade === "IBEW_L" ? "IBEW Lineman" : selectedTrade === "IUEC" ? "Elevator" : selectedTrade === "HFIAW" ? "Insulators" : selectedTrade === "SF" ? "Sprinkler Fitters" : selectedTrade}</span>
              <svg className="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="trades-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">Union Construction Trades</span>
                  <span className="dropdown-sub">Select a trade to find your local</span>
                </div>

                <div className="dropdown-scroll-body" onWheel={e => e.stopPropagation()} onTouchMove={e => e.stopPropagation()}>
                {UNION_TRADES.map((group) => (
                  <div key={group.group} className="dropdown-group">
                    <div className="dropdown-group-label">{group.group}</div>
                    {group.trades.map((trade) => (
                      <div
                        key={trade.abbr + trade.name}
                        className={`dropdown-item ${trade.status === "active" ? "active" : "coming"} ${selectedTrade === trade.abbr ? "selected" : ""}`}
                        onClick={() => {
                          if (trade.status !== "active") return;
                          setSelectedTrade(trade.abbr);
                          setDropdownOpen(false);
                          setResults(null);
                          setQuery("");
                          setError("");
                          setTimeout(() => {
                            inputRef.current?.focus();
                            inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                          }, 100);
                        }}
                      >
                        <div className="trade-abbr-badge" style={trade.color ? { borderColor: trade.color + "55", color: trade.color } : {}}>
                          {trade.abbr}
                        </div>
                        <div className="trade-info">
                          <div className="trade-name">{trade.name}</div>
                          <div className="trade-full">{trade.full}</div>
                        </div>
                        <div className="trade-status">
                          {trade.status === "active" ? (
                            <span className="status-live">● Live</span>
                          ) : (
                            <span className="status-soon">Soon</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                </div>

                <div className="dropdown-footer">
                  {lang==="es" ? "Más oficios agregados regularmente · " : lang==="pl" ? "Nowe zawody dodawane regularnie · " : "More trades added regularly · "}
                  <a href="#" onClick={(e) => e.preventDefault()}>{lang==="es" ? "Solicitar un oficio" : lang==="pl" ? "Zaproponuj zawód" : "Request a trade"}</a>
                </div>
              </div>
            )}
          </div>
          )}
        </nav>

        {/* ── QUIZ PAGE ── */}
        {page === "quiz" && (
          <div className="page">
            <div className="page-eyebrow">{lang==="es" ? "Buscador de Carrera" : lang==="pl" ? "Znajdź Swój Zawód" : "Career Finder"}</div>
            <h1 className="page-title">{lang==="es" ? "¿Qué Oficio Es Para Ti?" : lang==="pl" ? "Który Zawód Jest dla Ciebie?" : "Which Trade Is Right For You?"}</h1>
            <p className="page-sub">{lang==="es" ? "Responde 5 preguntas rápidas y te dirigiremos hacia el oficio sindical que se adapta a tus habilidades e intereses." : lang==="pl" ? "Odpowiedz na 5 szybkich pytań, a wskaże Ci zawód związkowy pasujący do Twoich umiejętności i zainteresowań." : "Answer 5 quick questions and we'll point you toward the union trade that fits your skills and interests."}</p>

            {!quizResult ? (
              <>
                <div className="quiz-progress">
                  {QUIZ[lang].map((_, i) => <div key={i} className={`quiz-pip ${i <= quizStep ? "done" : ""}`} />)}
                </div>
                <div className="quiz-step-label">{lang === "es" ? `Pregunta ${quizStep + 1} de ${QUIZ[lang].length}` : lang === "pl" ? `Pytanie ${quizStep + 1} z ${QUIZ[lang].length}` : `Question ${quizStep + 1} of ${QUIZ[lang].length}`}</div>
                <div className="quiz-question">{QUIZ[lang][quizStep].q}</div>
                <div className="quiz-options">
                  {QUIZ[lang][quizStep].options.map((opt, i) => (
                    <button key={i} className="quiz-option" onClick={() => handleQuizAnswer(opt, i)}>
                      <span className="quiz-option-num">{String.fromCharCode(65+i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="quiz-result">
                {(() => {
                  const res = TRADE_RESULTS[lang][quizResult];
                  return (
                    <div className="result-card" style={{borderColor: res.color + "55", background: res.color + "08"}}>
                      <div className="result-badge" style={{color: res.color}}>{lang==="es" ? "✓ Tu Mejor Opción" : lang==="pl" ? "✓ Twoje Najlepsze Dopasowanie" : "✓ Your Best Match"}</div>
                      <div className="result-title">{res.icon} {res.name}</div>
                      <p className="result-why">{res.why}</p>
                      <div className="result-path">
                        <div className="result-path-title">{lang==="es" ? "Trayectoria Profesional" : lang==="pl" ? "Ścieżka Kariery" : "Career Path"}</div>
                        {res.path.map((step, i) => (
                          <div key={i} className="result-path-step">
                            <div className="step-dot" style={{background: res.color}} />
                            {step}
                          </div>
                        ))}
                      </div>
                      <div className="result-app-note">{res.apprenticeship}</div>
                      <div className="result-actions">
                        <button className="btn-primary" onClick={() => { setSelectedTrade(quizResult === "IBEW" ? "IBEW_I" : quizResult); setPage("home"); }}>
                          {lang==="es" ? "Encontrar Mi Local Más Cercano →" : lang==="pl" ? "Znajdź Mój Najbliższy Oddział →" : "Find My Nearest Local →"}
                        </button>
                        <a className="btn-ghost" href={`https://www.${res.website}`} target="_blank" rel="noopener noreferrer">
                          {lang==="es" ? "Sitio Nacional" : lang==="pl" ? "Strona Krajowa" : "National Website"}
                        </a>
                        <button className="btn-ghost" onClick={resetQuiz}>
                          {lang==="es" ? "Volver a Tomar" : lang==="pl" ? "Powtórz Quiz" : "Retake Quiz"}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ── CAREER PATH PAGE ── */}
        {page === "careers" && (() => {
          const cd = CAREER_DATA[lang];
          return (
            <div className="page">
              <div className="page-eyebrow">{lang==="es" ? "Oficios Sindicales" : lang==="pl" ? "Zawody Związkowe" : "Union Trades"}</div>
              <h1 className="page-title">{cd.title}</h1>
              <p className="page-sub">{cd.sub}</p>

              <div className="career-stats">
                {cd.stats.map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="section-title">{lang==="es" ? "La Trayectoria" : lang==="pl" ? "Ścieżka Kariery" : "The Career Path"}</div>
              <div className="career-stages">
                {cd.stages.map((s, i) => (
                  <div key={i} className="career-stage">
                    <div className="stage-icon">{s.icon}</div>
                    <div className="stage-info">
                      <div className="stage-header">
                        <span className="stage-name">{s.stage}</span>
                        <span className="stage-years">{s.years}</span>
                        <span className="stage-pay">{s.pay}</span>
                      </div>
                      <div className="stage-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-title">{lang==="es" ? "Beneficios Sindicales" : lang==="pl" ? "Świadczenia Związkowe" : "Union Benefits"}</div>
              <div className="benefits-grid">
                {cd.whyUnion.map((b, i) => (
                  <div key={i} className="benefit-card">
                    <div className="benefit-icon">{b.icon}</div>
                    <div className="benefit-label">{b.label}</div>
                    <div className="benefit-desc">{b.desc}</div>
                  </div>
                ))}
              </div>

              <div className="cta-banner">
                <h3>{lang==="es" ? "¿Listo para Comenzar?" : lang==="pl" ? "Gotowy, żeby Zacząć?" : "Ready to Get Started?"}</h3>
                <p>{lang==="es" ? "Encuentra el local sindical más cercano y da el primer paso hacia una carrera sindical." : lang==="pl" ? "Znajdź najbliższy oddział związkowy i zrób pierwszy krok w kierunku kariery związkowej." : "Find the local union nearest you and take the first step toward a union career."}</p>
                <button className="btn-primary" onClick={() => setPage("home")}>
                  {lang==="es" ? "Encontrar Mi Local Más Cercano →" : lang==="pl" ? "Znajdź Mój Najbliższy Oddział →" : "Find My Nearest Local →"}
                </button>
              </div>
            </div>
          );
        })()}

        {/* ── HOME PAGE ── */}
        {page === "home" && (<>
        {/* HERO */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className={`hero-content ${heroVisible ? "visible" : ""}`}>
            <div className="hero-eyebrow">
              <span className="eyebrow-line" />
              {t.tagline}
              <span className="eyebrow-line" />
            </div>
            <h1 className="hero-title">
              {t.heroTitle1}<br />
              <span className="accent">{t.heroAccent}</span>
              {t.heroTitle2}
            </h1>
            <p className="hero-sub">{t.heroSub}</p>

            {/* SEARCH CARD */}
            <div className="search-card">
              <span className="search-label">
                {selectedTrade === "UA" ? t.uaLabel : selectedTrade === "SMART" ? t.smartLabel : selectedTrade === "BAC" ? t.bacLabel : selectedTrade === "UBC" ? t.ubcLabel : selectedTrade === "LIUNA" ? t.liunaLabel : selectedTrade === "IW" ? t.iwLabel : selectedTrade === "IBEW_L" ? t.ibewLinLabel : selectedTrade === "IUEC" ? t.iuecLabel : selectedTrade === "HFIAW" ? t.hfiawLabel : selectedTrade === "SF" ? t.sfLabel : t.ibewLabel}
                {" "}{t.searchLabel}
              </span>
              <div className="search-row">
                <input
                  ref={inputRef}
                  className="search-input"
                  type="text"
                  placeholder={lang==="es" ? "ej. 60614 o Chicago, IL" : lang==="pl" ? "np. 60614 lub Chicago, IL" : "e.g. 60614 or Chicago, IL"}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button className="btn-search" onClick={() => handleSearch()} disabled={loading || !query.trim()}>
                  {loading ? <span className="spinner" /> : t.searchBtn}
                </button>
              </div>

              <div className="search-divider">{lang==="es" ? "o" : lang==="pl" ? "lub" : "or"}</div>

              <button className="btn-geo" onClick={handleGeolocate} disabled={geoLoading}>
                {geoLoading ? (
                  <><span className="spinner" /> {t.locating}</>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
                      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
                    </svg>
                    {t.geoBtn}
                  </>
                )}
              </button>

              {error && <div className="error-msg">{t.errorMsg}</div>}
            </div>
          </div>
        </section>

        {/* RESULTS */}
        {results && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title"><span>{results.length}</span> {t.nearYou}</div>
              <div className="results-location">📍 {locationLabel}</div>
            </div>
            {results.map((local, i) => (
              <div className="local-card" key={`${local.id}-${i}`}>
                <div className="card-rank">#{i + 1}</div>
                <div className="card-body">
                  <div className="card-name">{local.name}</div>
                  <div className="card-location">{local.city}, {local.state}</div>
                  <div className="card-info">
                    {local.phone && (
                      <span className="info-chip">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14h0z"/>
                        </svg>
                        <a href={`tel:${local.phone}`} style={{color:"inherit",textDecoration:"none"}}>{local.phone}</a>
                      </span>
                    )}
                    <span className="info-chip">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {local.address || `${local.city}, ${local.state}`}
                    </span>
                  </div>
                  <div className="card-actions">
                    {local.website && (
                      <a className="btn-website" href={`https://${local.website}`} target="_blank" rel="noopener noreferrer">
                        {t.visitWebsite}
                      </a>
                    )}
                    <button className="btn-share" onClick={() => {
                      const text = `${local.name} — ${local.city}, ${local.state}${local.phone ? ` | ${local.phone}` : ""}${local.website ? ` | https://${local.website}` : ""} | Found on Union Pathways`;
                      if (navigator.share) {
                        navigator.share({ title: local.name, text });
                      } else {
                        navigator.clipboard.writeText(text).then(() => alert(lang==="es" ? "¡Info copiada!" : lang==="pl" ? "Skopiowano informacje!" : "Local info copied!"));
                      }
                    }}>
                      {lang==="es" ? "Compartir" : lang==="pl" ? "Udostępnij" : "Share"}
                    </button>
                    <button className="btn-correction" onClick={() => {
                      setPage("contact");
                      setContactSent(false);
                      setTimeout(() => setContactForm(f => ({
                        ...f,
                        subject: "local-info",
                        message: `I'd like to submit a correction or update for:\n\n${local.name}\n${local.city}, ${local.state}\n\nCorrection:\n`
                      })), 100);
                    }}>
                      {lang==="es" ? "✏ Sugerir una Corrección" : lang==="pl" ? "✏ Zaproponuj Korektę" : "✏ Suggest a Correction"}
                    </button>
                  </div>
                </div>
                <div className="card-distance">
                  {i === 0 && <div className="nearest-badge">{t.nearest}</div>}
                  <div className="distance-num">{Math.round(local.distance)}</div>
                  <div className="distance-unit">{t.milesAway}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FEATURES STRIP */}
        {!results && (
          <div className="features">
            {[
              { icon: "⚡", text: t.featIBEW },
              { icon: "🔧", text: t.featUA },
              { icon: "🌬️", text: t.featSMART },
              { icon: "🧱", text: lang==="es" ? "Locales de BAC Albañiles a nivel nacional" : lang==="pl" ? "Oddziały BAC Murarze w całym kraju" : "BAC Bricklayers locals nationwide" },
              { icon: "🪚", text: lang==="es" ? "Locales de UBC Carpinteros a nivel nacional" : lang==="pl" ? "Oddziały UBC Cieśle w całym kraju" : "UBC Carpenters locals nationwide" },
              { icon: "⚒️", text: lang==="es" ? "Locales de LIUNA Obreros a nivel nacional" : lang==="pl" ? "Oddziały LIUNA Robotnicy w całym kraju" : "LIUNA Laborers locals nationwide" },
              { icon: "🏗️", text: lang==="es" ? "Locales de Trabajadores del Hierro a nivel nacional" : lang==="pl" ? "Oddziały Ironworkers w całym kraju" : "Ironworkers locals nationwide" },
              { icon: "📍", text: t.featPin },
            ].map(({ icon, text }) => (
              <div className="feature" key={text}>
                <div className="feature-icon">{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}
        {/* EMAIL CAPTURE */}
        {!results && (
          <div style={{
            maxWidth: 600, margin: "0 auto 60px", padding: "0 24px",
            textAlign: "center"
          }}>
            <div style={{
              background: "rgba(245,197,24,0.06)",
              border: "1px solid rgba(245,197,24,0.2)",
              borderRadius: 14, padding: "28px 32px"
            }}>
              <div style={{
                fontFamily:"'Barlow Condensed',sans-serif",
                fontSize: 20, fontWeight: 900,
                textTransform: "uppercase", marginBottom: 8
              }}>
                {lang==="es" ? "Recibe Notificaciones a Medida que Crecemos" : lang==="pl" ? "Otrzymuj Powiadomienia o Naszym Rozwoju" : "Get Notified as We Grow"}
              </div>
              <p style={{fontSize:14, color:"var(--muted)", marginBottom:20, lineHeight:1.6}}>
                {lang==="es"
                  ? "Estamos agregando nuevos oficios y locales regularmente. Ingresa tu correo y te avisaremos cuando tu oficio o estado esté disponible."
                  : lang==="pl"
                  ? "Regularnie dodajemy nowe zawody i oddziały. Wpisz swój e-mail, a powiadomimy Cię, gdy Twój zawód lub stan zostanie dodany."
                  : "We're adding new trades and locals regularly. Drop your email and we'll let you know when your trade or state goes live."}
              </p>
              <div style={{display:"flex", gap:8, maxWidth:420, margin:"0 auto"}}>
                <input
                  type="email"
                  placeholder={lang==="es" ? "tu@correo.com" : lang==="pl" ? "twoj@email.com" : "your@email.com"}
                  style={{
                    flex:1, background:"var(--steel-mid)",
                    border:"1.5px solid var(--wire)", borderRadius:8,
                    padding:"11px 16px", color:"var(--text)",
                    fontFamily:"'Barlow',sans-serif", fontSize:14, outline:"none"
                  }}
                  onFocus={e => e.target.style.borderColor="var(--yellow)"}
                  onBlur={e => e.target.style.borderColor="var(--wire)"}
                  id="email-capture-input"
                />
                <button
                  className="btn-primary"
                  style={{whiteSpace:"nowrap", padding:"11px 20px"}}
                  onClick={() => {
                    const val = document.getElementById("email-capture-input").value;
                    if (val && val.includes("@")) {
                      setPage("contact");
                      setContactSent(false);
                      setTimeout(() => setContactForm(f => ({
                        ...f,
                        email: val,
                        subject: "other",
                        message: lang==="es"
                          ? "Por favor agrégame a la lista de notificaciones de Union Pathways."
                          : lang==="pl"
                          ? "Proszę dodaj mnie do listy powiadomień Union Pathways o nowych zawodach i oddziałach."
                          : "Please add me to the Union Pathways notify list for new trades and locals."
                      })), 100);
                    }
                  }}
                >
                  {lang==="es" ? "Notifícame" : lang==="pl" ? "Powiadom Mnie" : "Notify Me"}
                </button>
              </div>
            </div>
          </div>
        )}
        </>)}

        {/* ── JOIN A UNION CHECKLIST PAGE ── */}
        {page === "checklist" && (
          <div className="page" style={{maxWidth: 780}}>
            <div className="page-eyebrow">{lang==="es" ? "Cómo Empezar" : lang==="pl" ? "Jak Zacząć" : "Getting Started"}</div>
            <h1 className="page-title">{lang==="es" ? "Cómo Unirse a un Oficio Sindical" : lang==="pl" ? "Jak Dołączyć do Zawodowego Związku" : "How to Join a Union Trade"}</h1>
            <p className="page-sub">
              {lang==="es"
                ? "Todo lo que necesitas saber antes de aplicar — qué se requiere, qué ayuda y cómo funciona el proceso."
                : lang==="pl"
                ? "Wszystko, co musisz wiedzieć przed złożeniem wniosku — czego wymaga się od Ciebie, co pomaga i jak działa ten proces."
                : "Everything you need to know before you apply — what's required, what helps, and how the process works."}
            </p>

            <div className="checklist-intro">
              {lang==="es" ? (
                <><strong>Lo esencial:</strong> Los aprendizajes sindicales son competitivos pero abiertos a cualquier persona que califique. No hay tarifa para aplicar, no se requiere universidad, y ganas un sueldo desde el primer día.</>
              ) : lang==="pl" ? (
                <><strong>Najważniejsze:</strong> Programy praktyk związkowych są konkurencyjne, ale otwarte dla każdego, kto spełnia wymagania. Nie ma opłaty za złożenie wniosku, nie jest wymagane wykształcenie wyższe, a wynagrodzenie zarabiasz od pierwszego dnia.</>
              ) : (
                <><strong>The bottom line:</strong> Union apprenticeships are competitive but open to anyone who qualifies. There's no fee to apply, no college required, and you earn a paycheck from day one. Most locals hold open enrollment periods — typically spring and fall — but some accept applications year-round.</>
              )}
            </div>

            {/* Legend */}
            <div className="checklist-legend">
              <div className="legend-item"><div className="legend-dot" style={{background:"var(--yellow)"}} />{lang==="es"?"Requerido — necesario para aplicar":lang==="pl"?"Wymagane — konieczne do aplikacji":"Required — must have to apply"}</div>
              <div className="legend-item"><div className="legend-dot" style={{background:"#4a9eff"}} />{lang==="es"?"A menudo requerido — varía por local":lang==="pl"?"Często Wymagane — zależy od oddziału":"Often Required — varies by local"}</div>
              <div className="legend-item"><div className="legend-dot" style={{background:"#22c55e"}} />{lang==="es"?"Útil — mejora tus posibilidades":lang==="pl"?"Pomocne — zwiększa Twoje szanse":"Helpful — improves your chances"}</div>
            </div>

            {/* Section 1 — Basic Requirements */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Requisitos Básicos":lang==="pl"?"Podstawowe Wymagania":"Basic Requirements"}</div>
              <div className="checklist-items">
                <div className="checklist-item required">
                  <div className="checklist-icon">🎂</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"18 Años de Edad":lang==="pl"?"18 Lat":"18 Years Old"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Debes tener al menos 18 años para ingresar a un programa de aprendizaje registrado.":lang==="pl"?"Musisz mieć co najmniej 18 lat, aby przystąpić do zarejestrowanego programu praktyk. Niektóre zawody przyjmują 17-latków za zgodą rodzica, ale 18 lat to standard.":"You must be at least 18 to enter a registered apprenticeship program. Some trades accept 17 with a parent or guardian signature in certain states, but 18 is the standard."}</div>
                  </div>
                </div>
                <div className="checklist-item required">
                  <div className="checklist-icon">📄</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Diploma de Escuela Secundaria o GED":lang==="pl"?"Dyplom Ukończenia Szkoły Średniej lub GED":"High School Diploma or GED"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Los cuatro oficios requieren un diploma de escuela secundaria o GED.":lang==="pl"?"Wszystkie zawody wymagają dyplomu szkoły średniej lub GED. Jeśli jeszcze go nie masz, zdobycie GED to Twój pierwszy krok.":"All four trades require proof of a high school diploma or GED. If you don't have one yet, getting your GED is your first step. Community colleges offer GED prep programs, many for free."}</div>
                  </div>
                </div>
                <div className="checklist-item required">
                  <div className="checklist-icon">🇺🇸</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Derecho Legal a Trabajar en EE.UU.":lang==="pl"?"Prawo do Pracy w USA":"Legal Right to Work in the US"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Debes estar legalmente autorizado para trabajar en los Estados Unidos.":lang==="pl"?"Musisz być prawnie upoważniony do pracy w Stanach Zjednoczonych. Dotyczy to obywateli USA, stałych rezydentów i posiadaczy ważnych zezwoleń na pracę.":"You must be legally authorized to work in the United States. This includes US citizens, permanent residents, and holders of valid work authorization."}</div>
                  </div>
                </div>
                <div className="checklist-item optional">
                  <div className="checklist-icon">🧪</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Pasar una Prueba de Drogas":lang==="pl"?"Zdać Test Narkotykowy":"Pass a Drug Test"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"La mayoría de los locales requieren una prueba de drogas antes del empleo.":lang==="pl"?"Większość oddziałów wymaga testu narkotykowego przed zatrudnieniem. Place budowy to środowiska krytyczne dla bezpieczeństwa.":"Most locals require a pre-employment drug test. Construction sites are safety-critical environments. Know your local's policy before you apply."}</div>
                  </div>
                </div>
                <div className="checklist-item optional">
                  <div className="checklist-icon">🚗</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Licencia de Conducir Válida":lang==="pl"?"Ważne Prawo Jazdy":"Valid Driver's License"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Muchos locales requieren una licencia de conducir válida.":lang==="pl"?"Wiele oddziałów wymaga ważnego prawa jazdy, ponieważ place budowy mogą być poza trasami komunikacji miejskiej.":"Many locals require a valid driver's license since job sites may not be on public transit routes. Having reliable transportation is essential."}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 — Tests & Aptitude */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Pruebas y Aptitud":lang==="pl"?"Testy i Predyspozycje":"Tests & Aptitude"}</div>
              <div className="checklist-items">
                <div className="checklist-item required">
                  <div className="checklist-icon">➕</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Prueba de Aptitud Matemática":lang==="pl"?"Test Uzdolnień Matematycznych":"Math Aptitude Test"} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Todos los oficios requieren una prueba básica de aptitud matemática que cubre álgebra, fracciones y matemáticas aplicadas.":lang==="pl"?"Wszystkie zawody wymagają podstawowego testu uzdolnień matematycznych obejmującego algebrę, ułamki i matematykę stosowaną. Przygotuj się wcześniej — Khan Academy oferuje darmowe kursy algebry.":"All trades require a basic math aptitude test covering algebra, fractions, and applied math. The IBEW/NECA test is well-known, but UA, SMART, and BAC have their own versions. Study ahead — Khan Academy has free algebra courses that cover everything you need."}</div>
                  </div>
                </div>
                <div className="checklist-item optional">
                  <div className="checklist-icon">📐</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Comprensión de Lectura":lang==="pl"?"Rozumienie Tekstu":"Reading Comprehension"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Algunos locales también evalúan la comprensión lectora y el razonamiento mecánico.":lang==="pl"?"Niektóre oddziały testują również rozumienie tekstu i rozumowanie mechaniczne. Umiejętność czytania i interpretowania instrukcji technicznych jest kluczowa.":"Some locals also test reading comprehension and mechanical reasoning. Being able to read and interpret technical instructions is key to the job."}</div>
                  </div>
                </div>
                <div className="checklist-item helpful">
                  <div className="checklist-icon">📚</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Estudia Antes de la Prueba":lang==="pl"?"Ucz się Przed Testem":"Study Before You Test"} <span className="checklist-tag tag-helpful">{lang==="es"?"Útil":lang==="pl"?"Pomocne":"Helpful"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"El puntaje de la prueba de matemáticas afecta mucho tu posición en la lista de espera. Hay guías de estudio gratuitas disponibles en línea.":lang==="pl"?"Wynik testu matematycznego ma duży wpływ na Twoje miejsce na liście oczekujących na praktykę. Wyższy wynik = szybsze przyjęcie.":"The math test scores heavily impact your ranking on the apprenticeship waiting list. A higher score = faster entry. Free study guides are available online — search for \"NJATC aptitude test study guide\" for IBEW or the specific trade you're targeting."}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 — Physical */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Requisitos Físicos":lang==="pl"?"Wymagania Fizyczne":"Physical Requirements"}</div>
              <div className="checklist-items">
                <div className="checklist-item optional">
                  <div className="checklist-icon">💪</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Condición Física":lang==="pl"?"Sprawność Fizyczna":"Physical Fitness"} <span className="checklist-tag tag-optional">{lang==="es"?"A Menudo Requerido":lang==="pl"?"Często Wymagane":"Often Required"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Los oficios de construcción son físicamente exigentes. La mayoría de los locales requieren un examen físico.":lang==="pl"?"Zawody budowlane są wymagające fizycznie. Większość oddziałów wymaga badania lekarskiego potwierdzającego zdolność do pracy — dźwigania, wspinaczki, pracy w ciasnych przestrzeniach.":"Construction trades are physically demanding. Most locals require a physical exam or medical clearance confirming you can perform the duties of the trade — lifting, climbing, working in confined spaces, and extended time on your feet."}</div>
                  </div>
                </div>
                <div className="checklist-item helpful">
                  <div className="checklist-icon">🦺</div>
                  <div className="checklist-text">
                    <div className="checklist-label">{lang==="es"?"Tarjeta OSHA 10 (Recomendada)":lang==="pl"?"Karta OSHA 10 (Zalecana)":"OSHA 10 Card (Recommended)"} <span className="checklist-tag tag-helpful">{lang==="es"?"Útil":lang==="pl"?"Pomocne":"Helpful"}</span></div>
                    <div className="checklist-desc">{lang==="es"?"Tener una certificación OSHA 10 antes de aplicar muestra iniciativa. Es un curso de 10 horas disponible en línea.":lang==="pl"?"Posiadanie certyfikatu OSHA 10 przed złożeniem wniosku świadczy o inicjatywie i świadomości bezpieczeństwa. To 10-godzinny kurs dostępny online za około 30 dolarów.":"Having an OSHA 10 certification before you apply shows initiative and safety awareness. It's a 10-hour course available online for around $30. Some locals offer it free after you're accepted."}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 — Documents */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Documentos que Necesitas":lang==="pl"?"Dokumenty do Przyniesienia":"Documents to Bring"}</div>
              <div className="checklist-items">
                {[
                  { icon:"📋", label: lang==="es"?"Solicitud Completada":lang==="pl"?"Wypełniony Wniosek":"Completed Application", desc: lang==="es"?"Descarga del sitio web de tu local o recógela en persona.":lang==="pl"?"Pobierz ze strony swojego oddziału lub odbierz osobiście. Wypełnij go w całości — niekompletne wnioski są zazwyczaj odrzucane.":"Download from your local's website or pick up in person. Fill it out completely — incomplete applications are typically rejected." },
                  { icon:"🪪", label: lang==="es"?"Identificación con Foto del Gobierno":lang==="pl"?"Dowód Tożsamości ze Zdjęciem":"Government-Issued Photo ID", desc: lang==="es"?"Licencia de conducir, ID estatal o pasaporte.":lang==="pl"?"Prawo jazdy, dowód osobisty lub paszport.":"Driver's license, state ID, or passport." },
                  { icon:"📜", label: lang==="es"?"Comprobante de Educación":lang==="pl"?"Potwierdzenie Wykształcenia":"Proof of Education", desc: lang==="es"?"Expediente académico oficial de secundaria o certificado GED.":lang==="pl"?"Oficjalny transkrypt ze szkoły średniej lub certyfikat GED. Wiele oddziałów nie akceptuje samego dyplomu — potrzebują transkryptów.":"Official high school transcript or GED certificate. Many locals won't accept a diploma alone — they want transcripts." },
                  { icon:"🎖️", label: lang==="es"?"Papeles de Baja Militar (DD-214)":lang==="pl"?"Dokumenty Zwolnienia z Wojska (DD-214)":"Military Discharge Papers (DD-214)", desc: lang==="es"?"Si eres veterano, trae tu DD-214. Muchos locales dan preferencia a los veteranos.":lang==="pl"?"Jeśli jesteś weteranem, przynieś swój DD-214. Wiele oddziałów daje preferencje weteranom i niektóre zawody mają dedykowane ścieżki praktyk dla weteranów.":"If you're a veteran, bring your DD-214. Many locals give preference to veterans and some trades have dedicated veteran apprenticeship pathways." },
                  { icon:"📷", label: lang==="es"?"Fotos Estilo Pasaporte":lang==="pl"?"Zdjęcia Paszportowe":"Passport-Style Photos", desc: lang==="es"?"Algunos locales solicitan fotos recientes con la solicitud.":lang==="pl"?"Niektóre oddziały wymagają aktualnych zdjęć wraz z wnioskiem. Sprawdź wymagania swojego oddziału.":"Some locals request recent photos with the application. Check the specific requirements for your local." },
                ].map((item, i) => (
                  <div key={i} className="checklist-item required">
                    <div className="checklist-icon">{item.icon}</div>
                    <div className="checklist-text">
                      <div className="checklist-label">{item.label} <span className="checklist-tag tag-required">{lang==="es"?"Requerido":lang==="pl"?"Wymagane":"Required"}</span></div>
                      <div className="checklist-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5 — Trade Specific */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"Notas Específicas por Oficio":lang==="pl"?"Uwagi Specyficzne dla Zawodu":"Trade-Specific Notes"}</div>
              <div className="trade-diff-grid">
                {[
                  { trade:"⚡ IBEW", color:"#F5C518", notes: lang==="es"?[
                    "Prueba de aptitud NJATC requerida",
                    "Mínimo 1 año de álgebra en secundaria",
                    "Algunos locales requieren comprobante de álgebra",
                    "La entrevista se puntúa como parte del ranking",
                  ]:lang==="pl"?[
                    "Wymagany test predyspozycji NJATC (matematyka + czytanie)",
                    "Minimum 1 rok algebry w szkole średniej",
                    "Niektóre oddziały wymagają dowodu zaliczenia algebry",
                    "Rozmowa kwalifikacyjna punktowana jako część rankingu",
                  ]:[
                    "NJATC aptitude test required (math + reading)",
                    "Minimum 1 year of high school algebra",
                    "Some locals require algebra transcript proof",
                    "Interview scored as part of application ranking",
                  ]},
                  { trade:"🔧 UA", color:"#3b9eff", notes: lang==="es"?[
                    "Prueba de aptitud ATAP requerida",
                    "Algunos locales añaden razonamiento mecánico",
                    "Cubre plomería, tubería, HVAC y soldadura",
                    "La entrevista sigue a un puntaje aprobatorio",
                  ]:lang==="pl"?[
                    "Test predyspozycji ATAP (algebra + rozumienie tekstu)",
                    "Niektóre oddziały dodają sekcję rozumowania mechanicznego",
                    "Obejmuje hydraulikę, monterstwo, HVAC i spawanie",
                    "Rozmowa zwykle po pozytywnym wyniku testu",
                  ]:[
                    "ATAP aptitude test (algebra + reading comprehension)",
                    "Some locals add a mechanical reasoning section",
                    "Covers plumbing, pipefitting, HVAC, and welding paths",
                    "Interview typically follows a passing test score",
                  ]},
                  { trade:"🌬️ SMART", color:"#e05a2b", notes: lang==="es"?[
                    "La prueba de aptitud incluye matemáticas y razonamiento mecánico",
                    "Algunos locales requieren álgebra completada",
                    "Cubre chapistería, HVAC, techado y soldadura",
                    "La entrevista oral es parte de la mayoría de las solicitudes",
                  ]:lang==="pl"?[
                    "Test predyspozycji obejmuje matematykę i rozumowanie mechaniczne",
                    "Niektóre oddziały wymagają zaliczonego kursu algebry",
                    "Obejmuje blacharstwo, HVAC, pokrycia dachowe i spawanie",
                    "Rozmowa ustna jest częścią większości wniosków",
                  ]:[
                    "Aptitude test includes math and mechanical reasoning",
                    "Some locals require proof of completed algebra course",
                    "Covers sheet metal, HVAC, roofing, and welding",
                    "Oral interview is part of most applications",
                  ]},
                  { trade:"🧱 BAC", color:"#f97316", notes: lang==="es"?[
                    "La prueba de aptitud cubre matemáticas y lectura",
                    "Algunos locales hacen una demostración práctica de habilidades",
                    "Cubre albañilería, colocación de azulejos y enlucido",
                    "Se enfatiza la fuerza física y la resistencia",
                  ]:lang==="pl"?[
                    "Pisemny test predyspozycji obejmuje matematykę i czytanie",
                    "Niektóre oddziały przeprowadzają praktyczną demonstrację umiejętności",
                    "Obejmuje murarstwo, kafelkarstwo, tynkarstwo",
                    "Nacisk na siłę fizyczną i wytrzymałość",
                  ]:[
                    "Written aptitude test covers math and reading",
                    "Some locals conduct a hands-on skills demonstration",
                    "Covers bricklaying, tile setting, masonry, and plastering",
                    "Physical strength and endurance are emphasized",
                  ]},
                ].map((t, i) => (
                  <div key={i} className="trade-diff-card">
                    <div className="trade-diff-name" style={{color: t.color}}>{t.trade}</div>
                    <ul className="trade-diff-list">
                      {t.notes.map((n, j) => <li key={j}>{n}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6 — The Process */}
            <div className="checklist-section">
              <div className="checklist-section-title">{lang==="es"?"El Proceso de Solicitud":lang==="pl"?"Proces Aplikacyjny":"The Application Process"}</div>
              <div className="checklist-steps">
                {(lang==="es"?[
                  { n:"1", title:"Encuentra Tu Local", desc:"Usa la página Encontrar Local en este sitio para ubicar el local sindical más cercano para el oficio que elijas." },
                  { n:"2", title:"Verifica la Inscripción Abierta", desc:"Llama o visita el sitio web del local para saber cuándo abre su próxima ventana de solicitud." },
                  { n:"3", title:"Presenta Tu Solicitud", desc:"Recoge o descarga la solicitud. Preséntala con todos los documentos requeridos antes de la fecha límite." },
                  { n:"4", title:"Toma la Prueba de Aptitud", desc:"Serás programado para una prueba de aptitud escrita. Estudia matemáticas, especialmente álgebra." },
                  { n:"5", title:"Asiste a Tu Entrevista", desc:"Los solicitantes mejor clasificados son invitados a una entrevista oral. Sé profesional, puntual y preparado." },
                  { n:"6", title:"Recibe Tu Despacho", desc:"Una vez aceptado, serás enviado a un sitio de trabajo e inscrito en clases de escuela de oficios. Ganas salario completo desde el primer día." },
                ]:lang==="pl"?[
                  { n:"1", title:"Znajdź Swój Oddział", desc:"Skorzystaj ze strony Znajdź Oddział na tej stronie, aby zlokalizować najbliższy oddział związkowy dla wybranego zawodu." },
                  { n:"2", title:"Sprawdź Otwarte Zapisy", desc:"Zadzwoń lub odwiedź stronę oddziału, aby dowiedzieć się, kiedy otwiera się kolejne okno aplikacyjne. Większość przeprowadza zapisy 1–2 razy w roku." },
                  { n:"3", title:"Złóż Wniosek", desc:"Odbierz lub pobierz wniosek. Złóż go ze wszystkimi wymaganymi dokumentami przed terminem. Spóźnione lub niekompletne wnioski są zazwyczaj dyskwalifikowane." },
                  { n:"4", title:"Podejdź do Testu Predyspozycji", desc:"Zostaniesz zaplanowany na pisemny test predyspozycji. Ucz się matematyki — zwłaszcza algebry. Twój wynik określa pozycję na liście." },
                  { n:"5", title:"Weź Udział w Rozmowie Kwalifikacyjnej", desc:"Najwyżej ocenieni kandydaci są zaproszeni na rozmowę ustną. Bądź profesjonalny, punktualny i przygotowany." },
                  { n:"6", title:"Otrzymaj Przydział", desc:"Po przyjęciu zostaniesz przydzielony do budowy i zapisany na zajęcia szkoły zawodowej. Zarabiasz pełne wynagrodzenie od pierwszego dnia." },
                ]:[
                  { n:"1", title:"Find Your Local", desc:"Use the Find a Local page on this site to locate the union local nearest you for your chosen trade." },
                  { n:"2", title:"Check Open Enrollment", desc:"Call or visit the local's website to find out when their next application window opens. Most hold enrollment 1–2 times per year, though some are open year-round." },
                  { n:"3", title:"Submit Your Application", desc:"Pick up or download the application. Submit it with all required documents before the deadline. Late or incomplete applications are usually disqualified." },
                  { n:"4", title:"Take the Aptitude Test", desc:"You'll be scheduled for a written aptitude test. Study your math — especially algebra. Your score determines your ranking on the list." },
                  { n:"5", title:"Attend Your Interview", desc:"Top-ranked applicants are invited for an oral interview. Be professional, on time, and prepared to explain why you want to work in the trades." },
                  { n:"6", title:"Get Dispatched", desc:"Once accepted, you'll be dispatched to a job site and enrolled in trade school classes. You earn full wages from day one while your training is paid for by the industry." },
                ]).map((s, i) => (
                  <div key={i} className="checklist-step">
                    <div className="step-num">{s.n}</div>
                    <div className="step-content">
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="cta-banner">
              <h3>{lang==="es"?"¿Listo para Dar el Primer Paso?":lang==="pl"?"Gotowy na Pierwszy Krok?":"Ready to Take the First Step?"}</h3>
              <p>{lang==="es"?"Encuentra el local sindical más cercano y comunícate directamente para comenzar el proceso de solicitud.":lang==="pl"?"Znajdź najbliższy oddział związkowy i skontaktuj się bezpośrednio, aby rozpocząć proces aplikacyjny.":"Find the local union nearest you and reach out directly to get the application process started."}</p>
              <button className="btn-primary" onClick={() => setPage("home")}>
                {lang==="es"?"Encontrar Mi Local Más Cercano →":lang==="pl"?"Znajdź Mój Najbliższy Oddział →":"Find My Nearest Local →"}
              </button>
            </div>
          </div>
        )}

        {/* ── VETERANS / HELMETS TO HARDHATS PAGE ── */}
        {page === "veterans" && (
          <div className="page" style={{maxWidth: 820}}>
            <div className="page-eyebrow">{lang==="es" ? "Para Veteranos y Militares" : lang==="pl" ? "Dla Weteranów i Żołnierzy" : "For Veterans & Service Members"}</div>
            <h1 className="page-title">{lang==="es" ? "Tu Servicio Abre la Puerta" : lang==="pl" ? "Twoja Służba Otwiera Drzwi" : "Your Service Opens the Door"}</h1>
            <p className="page-sub">
              {lang==="es"
                ? "Las habilidades que desarrollaste en el servicio militar — disciplina, trabajo en equipo, conciencia de seguridad — son exactamente lo que los oficios sindicales buscan."
                : lang==="pl"
                ? "Umiejętności, które zdobyłeś w mundurze — dyscyplina, praca zespołowa, świadomość bezpieczeństwa, praca pod presją — to dokładnie to, czego szukają związki zawodowe. Tysiące weteranów już dokonało tej zmiany. Oto jak."
                : "The skills you built in uniform — discipline, teamwork, safety awareness, working under pressure — are exactly what the union trades are looking for. Thousands of veterans have made the transition. Here's how."}
            </p>

            {/* H2H Hero Card */}
            <div className="h2h-hero">
              <div className="h2h-logo-block">
                <div className="h2h-emblem">🪖</div>
                <div className="h2h-logo-text">Helmets<br/>to<br/>Hardhats</div>
              </div>
              <div className="h2h-hero-text">
                <div className="h2h-hero-title">{lang==="es" ? "El Puente Oficial del Servicio Militar a las Carreras Sindicales" : lang==="pl" ? "Oficjalny Most od Służby Wojskowej do Kariery Związkowej" : "The Official Bridge from Military Service to Union Careers"}</div>
                <p className="h2h-hero-desc">
                  {lang==="es"
                    ? "Helmets to Hardhats (H2H) es una organización sin fines de lucro que ha conectado a casi 50,000 veteranos con aprendizajes registrados en los oficios de construcción desde 2003."
                    : lang==="pl"
                    ? "Helmets to Hardhats (H2H) to organizacja non-profit 501(c)(3), która od 2003 roku połączyła prawie 50 000 weteranów z zarejestrowanymi programami praktyk w zawodach budowlanych. Jest bezpłatna, stworzona wspólnie przez pracodawców i pracowników, i poparta przez 15 międzynarodowych związków budowlanych."
                    : "Helmets to Hardhats (H2H) is a 501(c)(3) nonprofit that has connected nearly 50,000 veterans to registered apprenticeships in the construction trades since 2003. It's free, it's built by labor and management together, and it's backed by 15 international building trades unions including IBEW, UA, SMART, and BAC."}
                </p>
                <div className="h2h-stat-row">
                  {[
                    { num: "50,000+", label: lang==="es"?"Veteranos colocados desde 2003":lang==="pl"?"Weteranów zatrudnionych od 2003":"Veterans placed since 2003" },
                    { num: "15", label: lang==="es"?"Sindicatos internacionales socios":lang==="pl"?"Partnerskich związków międzynarodowych":"Partner international unions" },
                    { num: "$0", label: lang==="es"?"Costo para aplicar":lang==="pl"?"Koszt aplikacji":"Cost to apply" },
                  ].map((s,i) => (
                    <div key={i} className="h2h-stat">
                      <div className="h2h-stat-num">{s.num}</div>
                      <div className="h2h-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Veterans Thrive */}
            <div className="section-title">{lang==="es"?"Por Qué los Veteranos Prosperan en los Oficios":lang==="pl"?"Dlaczego Weterani Odnoszą Sukces w Zawodach Budowlanych":"Why Veterans Thrive in the Trades"}</div>
            <div className="vet-advantage-grid">
              {[
                { icon:"🎖️", label: lang==="es"?"Las Habilidades Militares Transfieren":lang==="pl"?"Umiejętności Wojskowe się Przekładają":"Military Skills Transfer", desc: lang==="es"?"El liderazgo, trabajar bajo presión, atención al detalle y disciplina de seguridad se traducen directamente a los oficios de construcción.":lang==="pl"?"Przywództwo, praca pod presją, dbałość o szczegóły, dyscyplina bezpieczeństwa — wszystko to bezpośrednio przekłada się na zawody budowlane. Wielu weteranów awansuje szybciej niż inni praktykanci.":"Leadership, working under pressure, attention to detail, safety discipline — all of these directly translate to the construction trades. Many veterans advance faster than non-veteran apprentices." },
                { icon:"🤝", label: lang==="es"?"Cultura de Hermandad":lang==="pl"?"Kultura Braterstwa":"Brotherhood Culture", desc: lang==="es"?"Los locales sindicales operan con los mismos principios que el ejército — lealtad, cuidarse mutuamente, no dejar a nadie atrás.":lang==="pl"?"Sale związkowe działają na tych samych zasadach co wojsko — lojalność, wzajemna opieka, nie zostawianie nikogo w tyle. Weterani często mówią, że kultura czuje się jak dom.":"Union halls operate on the same principles as the military — loyalty to your brothers and sisters, taking care of each other, and leaving no one behind. Veterans consistently report the culture feels like home." },
                { icon:"📋", label: lang==="es"?"Preferencia para Veteranos":lang==="pl"?"Preferencje dla Weteranów":"Veteran Preference", desc: lang==="es"?"Muchos locales otorgan puntos de preferencia a los veteranos en el proceso de clasificación de aprendizaje. Un DD-214 puede ser una ventaja real.":lang==="pl"?"Wiele oddziałów przyznaje weteranom dodatkowe punkty w procesie rankingowym praktyk. DD-214 może być prawdziwą przewagą w konkursie o miejsca.":"Many locals give veterans preference points in the apprenticeship ranking process. A DD-214 can be a real advantage when applications are competitive." },
                { icon:"💰", label: lang==="es"?"Combina GI Bill + Salario de Aprendiz":lang==="pl"?"Połącz GI Bill + Wynagrodzenie Praktykanta":"Stack GI Bill + Apprentice Pay", desc: lang==="es"?"Los veteranos en aprendizajes aprobados pueden usar su GI Bill para suplementar su salario de aprendiz.":lang==="pl"?"Weterani w zatwierdzonych programach praktyk mogą używać GI Bill do uzupełnienia wynagrodzenia praktykanta — dzięki czemu możesz zarabiać prawie tyle co wykwalifikowany pracownik podczas szkolenia.":"Veterans in approved apprenticeships can use their GI Bill to supplement their apprentice wage — meaning you can earn close to journey-level pay while you're still training. This is one of the most underused veteran benefits." },
                { icon:"⚕️", label: lang==="es"?"Beneficios desde el Primer Día":lang==="pl"?"Świadczenia od Pierwszego Dnia":"Benefits from Day One", desc: lang==="es"?"Seguro médico, contribuciones de pensión y beneficios de anualidad comienzan de inmediato.":lang==="pl"?"Ubezpieczenie zdrowotne, składki emerytalne i świadczenia rentowe zaczynają się natychmiast. Nie czekasz lat na kwalifikacje — umowa związkowa obejmuje Cię od pierwszego dnia pracy.":"Health insurance, pension contributions, and annuity benefits start immediately. You're not waiting years to qualify — the union contract covers you from your first dispatch." },
                { icon:"🏗️", label: lang==="es"?"Trayectoria Profesional Clara":lang==="pl"?"Wyraźna Ścieżka Kariery":"Clear Career Path", desc: lang==="es"?"Los oficios ofrecen el mismo tipo de estructura de rango al que los veteranos están acostumbrados — aprendiz, oficial, capataz, superintendente.":lang==="pl"?"Zawody budowlane oferują tę samą strukturę rang, do której przyzwyczajeni są weterani — praktykant, czeladnik, brygadzista, superintendant.":"The trades offer the same kind of rank structure veterans are used to — apprentice, journeyman, foreman, superintendent. You always know where you stand and what comes next." },
              ].map((a,i) => (
                <div key={i} className="vet-advantage-card">
                  <div className="vet-adv-icon">{a.icon}</div>
                  <div>
                    <div className="vet-adv-label">{a.label}</div>
                    <div className="vet-adv-desc">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* GI Bill Box */}
            <div className="gi-bill-box">
              <div className="gi-bill-icon">💡</div>
              <div>
                <div className="gi-bill-title">{lang==="es"?"La Combinación de GI Bill + Aprendizaje":lang==="pl"?"Kombinacja GI Bill + Praktykantstwo":"The GI Bill + Apprenticeship Combination"}</div>
                <div className="gi-bill-desc">
                  {lang==="es"
                    ? "La mayoría de los aprendizajes de construcción sindical están aprobados para los beneficios del GI Bill. Como aprendiz, ganas un porcentaje del salario de oficial — comenzando alrededor del 45-50% y aumentando cada 6 meses. Tu subsidio de vivienda del GI Bill se paga adicionalmente. Para muchos veteranos, el ingreso combinado durante el aprendizaje iguala o supera el salario completo de oficial."
                    : lang==="pl"
                    ? "Większość związkowych praktyk budowlanych jest zatwierdzona do świadczeń GI Bill (Rozdział 33 Post-9/11 lub Rozdział 30 Montgomery). Jako praktykant zarabiasz procent wynagrodzenia czeladnika — zaczynając od około 45-50% i rosnąc co 6 miesięcy. Zasiłek mieszkaniowy GI Bill jest wypłacany dodatkowo. Dla wielu weteranów łączny dochód podczas praktyki dorównuje lub przekracza pełne wynagrodzenie czeladnika."
                    : "Most union construction apprenticeships are approved for GI Bill (Chapter 33 Post-9/11 or Chapter 30 Montgomery) benefits. As an apprentice, you earn a percentage of journeyman wages — starting around 45-50% and increasing every 6 months. Your GI Bill housing allowance is paid on top of that. For many veterans, the combined income during apprenticeship matches or exceeds full journeyman pay. Contact your local VA education office or visit va.gov to verify your eligibility and calculate your benefit."}
                </div>
              </div>
            </div>

            {/* How H2H Works */}
            <div className="section-title">{lang==="es"?"Cómo Funciona Helmets to Hardhats":lang==="pl"?"Jak Działa Helmets to Hardhats":"How Helmets to Hardhats Works"}</div>
            <div className="h2h-steps">
              {(lang==="es"?[
                { n:"1", title:"Crea una Cuenta Gratuita", desc:"Ve a helmetstohardhats.org y crea un perfil gratuito. Ingresarás tu historial militar, habilidades, ubicación e intereses de oficio." },
                { n:"2", title:"Conéctate con un Representante Regional", desc:"Una vez que tu cuenta esté activa, un miembro del personal de H2H en tu región toma un papel activo conectándote con oportunidades de aprendizaje cerca de ti." },
                { n:"3", title:"Aplica a Programas de Aprendizaje", desc:"H2H te conecta directamente con locales sindicales que están aceptando solicitudes." },
                { n:"4", title:"Toma la Prueba de Aptitud", desc:"La mayoría de los oficios requieren una prueba de aptitud matemática. H2H puede orientarte a recursos de estudio." },
                { n:"5", title:"Comienza Tu Aprendizaje", desc:"Una vez aceptado, eres enviado a un sitio de trabajo, inscrito en la escuela de oficios y ganando beneficios completos desde el primer día." },
              ]:lang==="pl"?[
                { n:"1", title:"Utwórz Darmowe Konto", desc:"Przejdź do helmetstohardhats.org i utwórz bezpłatny profil. Wpiszesz swoje doświadczenie wojskowe, umiejętności, lokalizację i zainteresowania zawodowe. Zajmuje to około 10 minut." },
                { n:"2", title:"Zostań Dopasowany do Regionalnego Przedstawiciela", desc:"Gdy Twoje konto jest aktywne, pracownik H2H w Twoim regionie aktywnie łączy Cię z ofertami praktyk i możliwościami kariery w pobliżu." },
                { n:"3", title:"Aplikuj do Programów Praktyk", desc:"H2H łączy Cię bezpośrednio z oddziałami związkowymi przyjmującymi wnioski. Wszystkie oferty pracy pochodzą od pracodawców związkowych." },
                { n:"4", title:"Podejdź do Testu Predyspozycji", desc:"Większość zawodów wymaga testu predyspozycji matematycznych. H2H może wskazać Ci materiały do nauki. Weterani często osiągają dobre wyniki dzięki wojskowemu przeszkoleniu technicznemu." },
                { n:"5", title:"Rozpocznij Praktykę", desc:"Po przyjęciu zostajesz przydzielony do budowy, zapisany do szkoły zawodowej i zarabiasz pełne świadczenia od pierwszego dnia. GI Bill uzupełnia Twoje wynagrodzenie." },
              ]:[
                { n:"1", title:"Create a Free Account", desc:"Go to helmetstohardhats.org and create a free profile. You'll enter your military background, skills, location, and trade interests. It takes about 10 minutes." },
                { n:"2", title:"Get Matched to a Regional Rep", desc:"Once your account is active, an H2H staff member in your region takes an active role connecting you to apprenticeship openings and career opportunities near you." },
                { n:"3", title:"Apply to Apprenticeship Programs", desc:"H2H connects you directly to union locals that are accepting applications. All job postings come from union-signatory employers — no non-union work." },
                { n:"4", title:"Take the Aptitude Test", desc:"Most trades require a math aptitude test. H2H can point you to study resources. Veterans often score well due to military technical training backgrounds." },
                { n:"5", title:"Start Your Apprenticeship", desc:"Once accepted, you're dispatched to a job site, enrolled in trade school, and earning full benefits from day one. Your GI Bill kicks in to supplement your wage." },
              ]).map((s,i) => (
                <div key={i} className="h2h-step">
                  <div className="h2h-step-num">{s.n}</div>
                  <div className="h2h-step-body">
                    <div className="h2h-step-title">{s.title}</div>
                    <div className="h2h-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Participating Trades */}
            <div className="section-title">{lang==="es"?"Oficios Disponibles a Través de H2H":lang==="pl"?"Zawody Dostępne przez H2H":"Trades Available Through H2H"}</div>
            <div className="trades-vet-grid">
              {[
                { icon:"⚡", name:"IBEW Electricians", desc: lang==="es"?"Electricistas, trabajadores de línea, telecomunicaciones":lang==="pl"?"Elektrycy wewnętrzni, monterzy linii, telekomunikacja":"Inside wiremen, lineworkers, telecom" },
                { icon:"🔧", name:"UA Plumbers & Pipefitters", desc: lang==="es"?"Plomería, tubería, HVAC, soldadura":lang==="pl"?"Hydraulika, monterstwo, HVAC, spawanie":"Plumbing, pipefitting, HVAC, welding" },
                { icon:"🌬️", name:"SMART Sheet Metal", desc: lang==="es"?"Conductos, fabricación HVAC, techado":lang==="pl"?"Kanały wentylacyjne, produkcja HVAC, pokrycia dachowe":"Ductwork, HVAC fabrication, roofing" },
                { icon:"🧱", name:"BAC Bricklayers", desc: lang==="es"?"Mampostería, azulejo, piedra, terrazo":lang==="pl"?"Murarka, kafelkarstwo, kamień, lastryko":"Masonry, tile, stone, terrazzo" },
                { icon:"🪚", name:"UBC Carpenters", desc: lang==="es"?"Marcos, ebanistería, encofrado":lang==="pl"?"Szkieletowanie, stolarstwo, szalunki, meble":"Framing, millwork, formwork, cabinetry" },
                { icon:"🏗️", name:"IUOE Operating Engineers", desc: lang==="es"?"Equipo pesado, grúas, excavadoras":lang==="pl"?"Ciężki sprzęt, dźwigi, koparki":"Heavy equipment, cranes, excavators" },
                { icon:"⚒️", name:"Ironworkers", desc: lang==="es"?"Acero estructural, varilla, ornamental":lang==="pl"?"Stal konstrukcyjna, zbrojenie, ornamentyka":"Structural steel, rebar, ornamental" },
                { icon:"🚧", name:"LIUNA Laborers", desc: lang==="es"?"Construcción general, tunelería, tuberías":lang==="pl"?"Budownictwo ogólne, drążenie tuneli, rurociągi":"General construction, tunneling, pipeline" },
              ].map((t,i) => (
                <div key={i} className="trade-vet-card">
                  <div className="trade-vet-icon">{t.icon}</div>
                  <div>
                    <div className="trade-vet-name">{t.name}</div>
                    <div className="trade-vet-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="cta-banner">
              <h3>{lang==="es"?"¿Listo para Hacer la Transición?":lang==="pl"?"Gotowy na Zmianę?":"Ready to Make the Transition?"}</h3>
              <p>{lang==="es"?"Comienza en Helmets to Hardhats — o encuentra tu local sindical más cercano aquí mismo.":lang==="pl"?"Zacznij od Helmets to Hardhats — lub znajdź najbliższy oddział związkowy tutaj i skontaktuj się bezpośrednio.":"Start at Helmets to Hardhats — or find your nearest union local right here and reach out directly."}</p>
              <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
                <a className="btn-primary" href="https://helmetstohardhats.org" target="_blank" rel="noopener noreferrer">
                  {lang==="es"?"Visitar Helmets to Hardhats →":lang==="pl"?"Odwiedź Helmets to Hardhats →":"Visit Helmets to Hardhats →"}
                </a>
                <button className="btn-ghost" onClick={() => setPage("home")}>
                  {lang==="es"?"Encontrar Mi Local Más Cercano":lang==="pl"?"Znajdź Mój Najbliższy Oddział":"Find My Nearest Local"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT PAGE ── */}
        {page === "contact" && (
          <div className="page" style={{maxWidth: 860}}>
            <div className="page-eyebrow">{lang==="es" ? "Contáctanos" : lang==="pl" ? "Skontaktuj się" : "Get In Touch"}</div>
            <h1 className="page-title">{lang==="es" ? "Contáctenos" : lang==="pl" ? "Kontakt" : "Contact Us"}</h1>
            <p className="page-sub">
              {lang==="es"
                ? "¿Tienes una pregunta sobre un oficio, tu local sindical o este sitio? Contáctanos y te responderemos."
                : lang==="pl"
                ? "Masz pytanie dotyczące zawodu, lokalnego związku lub tej strony? Skontaktuj się z nami, a odpiszemy."
                : "Have a question about a trade, your local union, or this site? Reach out and we'll get back to you."}
            </p>

            {contactSent ? (
              <div className="contact-success">
                <div className="contact-success-icon">✅</div>
                <h3>{lang==="es" ? "¡Mensaje Enviado!" : lang==="pl" ? "Wiadomość Wysłana!" : "Message Sent!"}</h3>
                <p>{lang==="es" ? "Gracias por contactarnos. Te responderemos lo antes posible." : lang==="pl" ? "Dziękujemy za kontakt. Odpiszemy tak szybko, jak to możliwe." : "Thanks for reaching out. We'll get back to you as soon as possible."}</p>
                <button className="btn-primary" onClick={() => { setContactSent(false); setContactForm({ name:"", email:"", phone:"", subject:"", message:"" }); }}>
                  {lang==="es" ? "Enviar Otro Mensaje" : lang==="pl" ? "Wyślij Kolejną Wiadomość" : "Send Another Message"}
                </button>
              </div>
            ) : (
              <div className="contact-grid">
                {/* LEFT — info */}
                <div>
                  <div className="contact-info-block">
                    <div className="contact-info-label">{lang==="es" ? "Sobre Este Sitio" : lang==="pl" ? "O Tej Stronie" : "About This Site"}</div>
                    <div className="contact-info-value">
                      {lang==="es"
                        ? "Union Pathways es un recurso gratuito que conecta a los trabajadores con su local sindical de construcción más cercano. No estamos afiliados a ningún sindicato internacional — somos construidos por trabajadores del oficio, para trabajadores del oficio."
                        : lang==="pl"
                        ? "Union Pathways to bezpłatny zasób łączący pracowników z najbliższym lokalnym związkiem zawodowym w budownictwie. Nie jesteśmy powiązani z żadnym międzynarodowym związkiem — jesteśmy zbudowani przez rzemieślników, dla rzemieślników."
                        : "Union Pathways is a free resource connecting workers with their nearest union construction local. We are not affiliated with any international union — we're built by tradespeople, for tradespeople."}
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="contact-info-label">{lang==="es" ? "En Qué Podemos Ayudar" : lang==="pl" ? "W czym możemy pomóc" : "What We Can Help With"}</div>
                    <div className="contact-info-value" style={{fontSize:14, color:"var(--muted)", lineHeight:1.7}}>
                      {lang==="es" ? (
                        <>
                          ✔ Preguntas sobre cómo unirse a un oficio sindical<br/>
                          ✔ Actualizar o corregir información del local sindical<br/>
                          ✔ Sugerir un oficio o local para agregar<br/>
                          ✔ Preguntas generales sobre aprendizajes<br/>
                          ✔ Consultas de asociación o medios de comunicación
                        </>
                      ) : lang==="pl" ? (
                        <>
                          ✔ Pytania o dołączeniu do zawodowego związku<br/>
                          ✔ Aktualizacja lub korekta danych lokalnego oddziału<br/>
                          ✔ Sugestia zawodu lub oddziału do dodania<br/>
                          ✔ Ogólne pytania dotyczące praktyk zawodowych<br/>
                          ✔ Zapytania o partnerstwo lub kontakty z mediami
                        </>
                      ) : (
                        <>
                          ✔ Questions about joining a union trade<br/>
                          ✔ Updating or correcting local union info<br/>
                          ✔ Suggesting a trade or local to add<br/>
                          ✔ General questions about apprenticeships<br/>
                          ✔ Partnership or media inquiries
                        </>
                      )}
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="contact-info-label">{lang==="es" ? "Tiempo de Respuesta" : lang==="pl" ? "Czas Odpowiedzi" : "Response Time"}</div>
                    <div className="contact-info-value" style={{color:"var(--muted)", fontSize:14}}>
                      {lang==="es" ? "Normalmente respondemos en 1 a 2 días hábiles." : lang==="pl" ? "Zazwyczaj odpowiadamy w ciągu 1–2 dni roboczych." : "We typically respond within 1–2 business days."}
                    </div>
                  </div>
                </div>

                {/* RIGHT — form */}
                <div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">{lang==="es" ? "Nombre Completo *" : lang==="pl" ? "Imię i Nazwisko *" : "Full Name *"}</label>
                      <input className="form-input" type="text"
                        placeholder={lang==="es" ? "Juan García" : lang==="pl" ? "Jan Kowalski" : "John Smith"}
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang==="es" ? "Número de Teléfono" : lang==="pl" ? "Numer Telefonu" : "Phone Number"}</label>
                      <input className="form-input" type="tel"
                        placeholder="(555) 000-0000"
                        value={contactForm.phone}
                        onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang==="es" ? "Correo Electrónico *" : lang==="pl" ? "Adres Email *" : "Email Address *"}</label>
                    <input className="form-input" type="email"
                      placeholder={lang==="es" ? "tu@correo.com" : lang==="pl" ? "ty@email.com" : "you@email.com"}
                      value={contactForm.email}
                      onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang==="es" ? "Asunto *" : lang==="pl" ? "Temat *" : "Subject *"}</label>
                    <select className="form-select" value={contactForm.subject}
                      onChange={e => setContactForm({...contactForm, subject: e.target.value})}>
                      <option value="">{lang==="es" ? "Seleccionar un tema..." : lang==="pl" ? "Wybierz temat..." : "Select a topic..."}</option>
                      <option value="joining">{lang==="es" ? "Unirse a un Oficio Sindical" : lang==="pl" ? "Dołączenie do Zawodowego Związku" : "Joining a Union Trade"}</option>
                      <option value="apprenticeship">{lang==="es" ? "Preguntas sobre Aprendizaje" : lang==="pl" ? "Pytania o Praktyki" : "Apprenticeship Questions"}</option>
                      <option value="local-info">{lang==="es" ? "Actualizar Info del Local" : lang==="pl" ? "Aktualizacja / Korekta Danych Oddziału" : "Update / Correct Local Info"}</option>
                      <option value="add-local">{lang==="es" ? "Solicitar que se Agregue un Local" : lang==="pl" ? "Prośba o Dodanie Oddziału" : "Request a Local Be Added"}</option>
                      <option value="add-trade">{lang==="es" ? "Sugerir un Oficio" : lang==="pl" ? "Zaproponuj Zawód" : "Suggest a Trade"}</option>
                      <option value="partnership">{lang==="es" ? "Consulta de Asociación / Medios" : lang==="pl" ? "Zapytanie o Partnerstwo / Media" : "Partnership / Media Inquiry"}</option>
                      <option value="other">{lang==="es" ? "Otro" : lang==="pl" ? "Inne" : "Other"}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{lang==="es" ? "Mensaje *" : lang==="pl" ? "Wiadomość *" : "Message *"}</label>
                    <textarea className="form-textarea"
                      placeholder={lang==="es" ? "Cuéntanos cómo podemos ayudarte..." : lang==="pl" ? "Powiedz nam, jak możemy pomóc..." : "Tell us how we can help..."}
                      value={contactForm.message}
                      onChange={e => setContactForm({...contactForm, message: e.target.value})} />
                  </div>

                  <button className="btn-primary"
                    style={{width:"100%", padding:"14px", fontSize:"15px"}}
                    disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
                    onClick={async () => {
                      try {
                        await fetch("https://formspree.io/f/myklzalg", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", "Accept": "application/json" },
                          body: JSON.stringify({
                            name: contactForm.name,
                            email: contactForm.email,
                            phone: contactForm.phone || "Not provided",
                            subject: contactForm.subject,
                            message: contactForm.message
                          })
                        });
                        setContactSent(true);
                      } catch (e) {
                        alert("Something went wrong. Please try again.");
                      }
                    }}>
                    {lang==="es" ? "Enviar Mensaje →" : lang==="pl" ? "Wyślij Wiadomość →" : "Send Message →"}
                  </button>
                  <p style={{fontSize:12, color:"var(--muted)", marginTop:10, textAlign:"center"}}>
                    {lang==="es" ? "* Campos obligatorios" : lang==="pl" ? "* Pola obowiązkowe" : "* Required fields"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <footer>
          <span>{t.footerLeft}</span>
          <span>{t.footerRight}</span>
        </footer>
      </div>
    </>
  );
}
