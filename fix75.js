const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// ============================================================
// STEP 1: Add Supabase client initialization near top of App
// ============================================================
const supabaseInit = `
// ── SUPABASE CLIENT ─────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://bonqybbmcoaujfiiwson.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RjCnTsf0YLPVxtMNzI_p8Q_1ss3DQ8W';
let supabaseClient = null;
async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!window.supabase) {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}

`;

const appMarker = 'export default function UnionPathway';
if (!code.includes(appMarker)) { console.error('ERROR: UnionPathway component marker not found'); process.exit(1); }
if (!code.includes('SUPABASE_URL')) {
  code = code.replace(appMarker, supabaseInit + appMarker);
  console.log('Added Supabase client initialization');
} else {
  console.log('Supabase client already exists, skipping');
}

// ============================================================
// STEP 2: Update handleJobSubmit to also save to Supabase
// ============================================================
const oldEmailJSCall = `            try {
              await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                trade: tradeName,
                local_name: local.name,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || 'None listed',
                report_date: jobDate,
                phone: local.phone || 'N/A',
                website: local.website || 'N/A',
                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
              });
              setJobSubmitted(true);
            } catch(err) {
              console.error('EmailJS error:', err);
              alert('Submission failed. Please try again.');
            }`;

const newEmailJSCall = `            try {
              // Save to Supabase database (pending approval)
              const sb = await getSupabase();
              await sb.from('job_submissions').insert({
                trade: tradeName,
                local_name: local.name,
                local_id: local.id,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || null,
                report_date: jobDate,
                phone: local.phone || null,
                website: local.website || null,
                local_email: local.email || null,
                address: local.address || null,
                approved: false,
              });

              // Also send notification email
              await window.emailjs.send('service_uy3qbna', 'template_a55dhfh', {
                trade: tradeName,
                local_name: local.name,
                city: local.city,
                state: local.state,
                status: statusLabel,
                job_calls: jobCalls || 'None listed',
                report_date: jobDate,
                phone: local.phone || 'N/A',
                website: local.website || 'N/A',
                local_email: local.email || 'N/A',
                address: local.address || 'N/A',
              });
              setJobSubmitted(true);
            } catch(err) {
              console.error('Submission error:', err);
              alert('Submission failed. Please try again.');
            }`;

if (!code.includes(oldEmailJSCall)) { console.error('ERROR: old EmailJS call not found'); process.exit(1); }
code = code.replace(oldEmailJSCall, newEmailJSCall);
console.log('Updated handleJobSubmit to save to Supabase');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: wire Supabase into Job Board submissions" && git push\n');
