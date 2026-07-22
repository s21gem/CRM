const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CRMModule.tsx');
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "<option>Discovery</option><option>Technical Vetting</option><option>HSM Demo</option><option>Contract Negotiation</option><option>Procurement</option><option>Signed</option>",
  "<option>New</option><option>Contacted</option><option>Qualified</option><option>Proposal Sent</option><option>Discovery</option><option>Technical Vetting</option><option>HSM Demo</option><option>Contract Negotiation</option><option>Negotiating</option><option>Procurement</option><option>Signed</option><option>Closed</option>"
);

fs.writeFileSync(file, data);
console.log("Updated Lead statuses.");
