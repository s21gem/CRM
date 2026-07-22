const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'portals');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  // Backgrounds
  { regex: /(?<!dark:)bg-slate-950(?![\/\w])/g, replacement: 'bg-white dark:bg-slate-950' },
  { regex: /(?<!dark:)bg-slate-900(?![\/\w])/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /(?<!dark:)bg-\[\#0B1221\]/g, replacement: 'bg-white dark:bg-[#0B1221]' },
  { regex: /(?<!dark:)bg-slate-850/g, replacement: 'bg-slate-100 dark:bg-slate-850' },
  
  // Borders
  { regex: /(?<!dark:)border-slate-800(?![\/\w])/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /(?<!dark:)border-slate-700(?![\/\w])/g, replacement: 'border-slate-300 dark:border-slate-700' },
  { regex: /(?<!dark:)border-slate-850/g, replacement: 'border-slate-200 dark:border-slate-850' },

  // Text
  { regex: /(?<!dark:)text-slate-400/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /(?<!dark:)text-slate-300/g, replacement: 'text-slate-700 dark:text-slate-300' },
  { regex: /(?<!dark:)text-slate-500/g, replacement: 'text-slate-600 dark:text-slate-500' },
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Apply general replacements
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  // Handle text-white specially to avoid replacing it inside buttons
  // We'll only replace text-white if it doesn't appear in the same string as bg-blue, bg-emerald, bg-red, etc.
  // A simpler heuristic: Replace all text-white with text-slate-900 dark:text-white, 
  // THEN fix the buttons by replacing 'bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white' back to 'bg-blue-600 hover:bg-blue-700 text-white'
  
  content = content.replace(/(?<!dark:)text-white/g, 'text-slate-900 dark:text-white');
  
  // Revert for buttons and badges (bg-blue, bg-emerald, bg-red, bg-amber, bg-purple, bg-gradient)
  // This regex looks for className="... bg-<color> ... text-slate-900 dark:text-white ..." and fixes it.
  // Actually, let's just do a blanket fix for typical button classes.
  const buttonColors = ['blue', 'emerald', 'red', 'amber', 'purple', 'indigo'];
  buttonColors.forEach(color => {
    const regex1 = new RegExp(`bg-${color}-[56]00([^"]*)text-slate-900 dark:text-white`, 'g');
    content = content.replace(regex1, `bg-${color}-600$1text-white`);
    
    const regex2 = new RegExp(`bg-gradient-to-([^"]*)text-slate-900 dark:text-white`, 'g');
    content = content.replace(regex2, `bg-gradient-to-$1text-white`);
  });

  // Revert text-white for hover:text-white
  content = content.replace(/hover:text-slate-900 dark:text-white/g, 'hover:text-slate-900 dark:hover:text-white');

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
});
