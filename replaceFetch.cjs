const fs = require('fs');
const path = require('path');

const portalsDir = path.join(__dirname, 'src', 'components', 'portals');
const files = fs.readdirSync(portalsDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(portalsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace manual fetch with apiClient
  if (content.includes('fetch(') || content.includes('fetch(') || content.includes('http://localhost:5000')) {
    
    // Add import if not exists
    if (!content.includes('apiClient')) {
      content = `import { apiClient } from '../../lib/apiClient';\n` + content;
    }

    content = content.replace(/fetch\(`?http:\/\/localhost:5000/g, 'apiClient(`');
    content = content.replace(/fetch\('http:\/\/localhost:5000/g, "apiClient('");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
