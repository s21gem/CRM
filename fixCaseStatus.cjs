const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CRMModule.tsx');
let data = fs.readFileSync(file, 'utf8');

data = data.replace(
  "<option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>",
  "<option>New</option><option>Open</option><option>In Progress</option><option>On Hold</option><option>Awaiting Client Response</option><option>Escalated</option><option>Resolved</option><option>Closed</option>"
);

fs.writeFileSync(file, data);
console.log("Updated Case statuses.");
