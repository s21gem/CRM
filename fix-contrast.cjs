const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'portals');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix garbled classes like text-slate-600 dark:text-slate-500 dark:text-slate-400
  // which happened because of sequential regex runs
  content = content.replace(/text-slate-600 dark:text-slate-500 dark:text-slate-400/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-slate-700 dark:text-slate-300 dark:text-slate-300/g, 'text-slate-600 dark:text-slate-300');
  content = content.replace(/text-slate-600 dark:text-slate-500 dark:text-slate-500/g, 'text-slate-500');

  // Fix double dark hover text
  content = content.replace(/hover:text-slate-800 dark:text-slate-200/g, 'hover:text-slate-900 dark:hover:text-white');
  content = content.replace(/hover:text-slate-900 dark:text-slate-100/g, 'hover:text-slate-900 dark:hover:text-white');
  
  // Fix bg-slate-50 used as card backgrounds. 
  // We want to replace non-hover `bg-slate-50` with `bg-white` so it contrasts against the `bg-slate-50` main layout.
  // Wait, I should ONLY replace `bg-slate-50` when it's immediately followed by `dark:bg-slate-9` (meaning it was a card)
  // Example: `bg-slate-50 dark:bg-slate-950` -> `bg-white dark:bg-slate-950`
  // Example: `bg-slate-50 dark:bg-slate-900` -> `bg-white dark:bg-slate-900`
  content = content.replace(/(?<!hover:)bg-slate-50 (dark:bg-slate-9[05]0(?:\/\d+)?)/g, 'bg-white $1');

  // Same for bg-slate-100 which was mapped to bg-slate-900/40 etc. Let's make it bg-white.
  content = content.replace(/(?<!hover:)bg-slate-100 (dark:bg-slate-9[05]0(?:\/\d+)?)/g, 'bg-white $1');
  
  // For table heads: bg-slate-100 is good actually, maybe bg-slate-50 is better if rows are bg-white.
  // But let's let table headers be bg-slate-50.
  // Let's manually replace `thead className="bg-white` back to `thead className="bg-slate-50`
  content = content.replace(/thead className="bg-white/g, 'thead className="bg-slate-50');

  // hover states
  content = content.replace(/hover:bg-slate-100 dark:bg-slate/g, 'hover:bg-slate-50 dark:hover:bg-slate');

  // Remove duplicate dark classes generic regex
  // e.g. dark:text-slate-500 dark:text-slate-400 -> dark:text-slate-400
  content = content.replace(/dark:text-slate-\d+\s+dark:text-slate-(\d+)/g, 'dark:text-slate-$1');
  
  // dark:hover:bg-slate-100 dark:bg-slate-850 -> dark:hover:bg-slate-850
  content = content.replace(/dark:hover:bg-slate-100 dark:bg-slate-850/g, 'dark:hover:bg-slate-800');

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${file}`);
});
