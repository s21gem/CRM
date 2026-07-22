const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'portals');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  // Specific Backgrounds with opacities missed earlier
  { regex: /(?<!dark:)bg-slate-900\/(\d+)(?![\/\w])/g, replacement: 'bg-slate-100 dark:bg-slate-900/$1' },
  { regex: /(?<!dark:)bg-slate-950\/(\d+)(?![\/\w])/g, replacement: 'bg-slate-50 dark:bg-slate-950/$1' },
  
  // Specific Borders with opacities
  { regex: /(?<!dark:)border-slate-800\/(\d+)(?![\/\w])/g, replacement: 'border-slate-200 dark:border-slate-800/$1' },
  { regex: /(?<!dark:)border-slate-700\/(\d+)(?![\/\w])/g, replacement: 'border-slate-300 dark:border-slate-700/$1' },
  
  // Hover states
  { regex: /(?<!dark:)hover:bg-slate-900\/(\d+)/g, replacement: 'hover:bg-slate-200 dark:hover:bg-slate-900/$1' },

  // Text Colors
  { regex: /(?<!dark:)text-slate-100(?![\/\w])/g, replacement: 'text-slate-900 dark:text-slate-100' },
  { regex: /(?<!dark:)text-slate-200(?![\/\w])/g, replacement: 'text-slate-800 dark:text-slate-200' },
  
  // bg-[#0B1221] with opacities just in case
  { regex: /(?<!dark:)bg-\[\#0B1221\]\/(\d+)/g, replacement: 'bg-white dark:bg-[#0B1221]/$1' },
  
  // Some divides missed
  { regex: /(?<!dark:)divide-slate-850/g, replacement: 'divide-slate-200 dark:divide-slate-850' },
  { regex: /(?<!dark:)divide-slate-800/g, replacement: 'divide-slate-200 dark:divide-slate-800' }
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Apply general replacements
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
});
