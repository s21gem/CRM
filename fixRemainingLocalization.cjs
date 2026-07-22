const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'components');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  replacements.forEach(rep => {
    if ((typeof rep.search === 'string' && content.includes(rep.search)) || (rep.search instanceof RegExp && rep.search.test(content))) {
      content = content.replace(rep.search, rep.replace);
      changed = true;
    }
  });
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log("Updated: " + filePath);
  }
}

const replacements = [
  { search: /FoneBox Bangladesh/g, replace: 'FoneBox Global' },
  { search: /BANGLADESH POLICE/g, replace: 'INTERPOL HQ' },
  { search: /BANGLADESH BANK/g, replace: 'WORLD TECH BANK' },
  { search: /'Bangladesh'/g, replace: "'United States'" }
];

const targetFiles = [
  'Footer.tsx',
  'Home.tsx',
  'Industries.tsx',
  'DeveloperResources.tsx',
  'Careers.tsx',
  'About.tsx',
  'portals/CRMModule.tsx'
].map(f => path.join(baseDir, f));

targetFiles.forEach(file => replaceInFile(file, replacements));

console.log('Remaining localization fixed.');
