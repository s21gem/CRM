const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));
const replacement = "${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}";

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace fetch('http://localhost:5000/api...') -> fetch(`${baseUrl}/api...`)
  content = content.replace(/'http:\/\/localhost:5000(\/.*?)'/g, "`" + replacement + "$1`");
  
  // Replace `http://localhost:5000${url}` -> `${baseUrl}${url}`
  content = content.replace(/`http:\/\/localhost:5000(.*?)[`]/g, "`" + replacement + "$1`");

  // Replace 'http://localhost:5000' -> (baseUrl)
  content = content.replace(/'http:\/\/localhost:5000'/g, "(import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000'))");
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
}
