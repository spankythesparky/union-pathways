const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Replace the handleJobSubmit function with EmailJS version
const oldSubmit = `          const handleJobSubmit = async () => {
            if (!jobTrade || !jobLocal || !jobStatus || !jobDate) return;
            const local = selectedTradeLocals.find(l => String(l.id) === String(jobLocal));
            if (!local) return;

            const tradeName = JOB_TRADES.find(t => t.key === jobTrade)?.label || jobTrade;
            const statusEmoji = jobStatus === 'busy' ? '🟢 Busy' : jobStatus === 'steady' ? '🟡 Steady' : '🔴 Slow';

            const body = \`
New Job Board Report Submitted — Union Pathways

Trade: \${tradeName}
Local: \${local.name} — \${local.city}, \${local.state}
Status: \${statusEmoji}
Job Calls: \${jobCalls || 'None listed'}
Report Date: \${jobDate}

Local Contact Info:
Phone: \${local.phone || 'N/A'}
Website: \${local.website || 'N/A'}
Email: \${local.email || 'N/A'}
Address: \${local.address || 'N/A'}

To approve this report, reply APPROVE to add it to the Job Board.
To reject, reply REJECT.

— Union Pathways Automated Submission
            \`.trim();

            // Use mailto as simple submission method
            const subject = encodeURIComponent(\`[Job Board] \${local.name} — \${statusEmoji}\`);
            const bodyEncoded = encodeURIComponent(body);
            window.location.href = \`mailto:Spankythesparky@gmail.com?subject=\${subject}&body=\${bodyEncoded}\`;
            setJobSubmitted(true);
          };`;

const newSubmit = `          const handleJobSubmit = async () => {
            if (!jobTrade || !jobLocal || !jobStatus || !jobDate) return;
            const local = selectedTradeLocals.find(l => String(l.id) === String(jobLocal));
            if (!local) return;

            const tradeName = JOB_TRADES.find(t => t.key === jobTrade)?.label || jobTrade;
            const statusLabel = jobStatus === 'busy' ? 'BUSY' : jobStatus === 'steady' ? 'STEADY' : 'SLOW';

            // Load EmailJS if not already loaded
            if (!window.emailjs) {
              await new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
              });
              window.emailjs.init('J8FxG05UtYq-sWLNT');
            }

            try {
              await window.emailjs.send('service_uy3qbna', 'pk2fzz8', {
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
            }
          };`;

if (!code.includes(oldSubmit)) { console.error('ERROR: old submit not found'); process.exit(1); }
code = code.replace(oldSubmit, newSubmit);
console.log('Updated handleJobSubmit with EmailJS');

fs.writeFileSync('src/App.jsx', code);
console.log('\nDone! Now run:');
console.log('   git add src/App.jsx && git commit -m "feat: wire EmailJS to job board submissions" && git push\n');
