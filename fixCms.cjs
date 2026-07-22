const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'CmsModule.tsx');
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/\\\`http:\/\/localhost:5000\\\${f\.imageUrl}\\\`/g, '\`http://localhost:5000\${f.imageUrl}\`');
fs.writeFileSync(file, data);
console.log("Fixed CmsModule.tsx!");
