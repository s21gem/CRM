const fs = require('fs');
const path = require('path');

const dir = 'src/components/portals';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  let filepath = path.join(dir, f);
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // We need to carefully wrap <table ...> ... </table>
  // A regex might be tricky if there are multiple tables. 
  // Wait, let's just do a simple replacement if the table is not already wrapped.
  // Look for `<table ` and `</table>`
  // Actually, we can use a more robust script or just replace `<table ` with `<div className="overflow-x-auto w-full"><table ` and `</table>` with `</table></div>`
  
  // This is safe assuming <table is not already wrapped in <div className="overflow-x-auto w-full"> and assuming well-formed jsx.
  if (!content.includes('className="overflow-x-auto w-full"')) {
    content = content.replace(/<table /g, '<div className="overflow-x-auto w-full"><table ');
    content = content.replace(/<\/table>/g, '</table></div>');
  }

  // Also fix grid-cols-2 or grid-cols-3 or grid-cols-4 without responsive prefixes in portals
  content = content.replace(/grid-cols-2(?! )/g, 'grid-cols-1 sm:grid-cols-2');
  content = content.replace(/grid-cols-3(?! )/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3');
  content = content.replace(/grid-cols-4(?! )/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
  
  // Clean up if it created duplicates like `grid-cols-1 sm:grid-cols-1 sm:grid-cols-2`
  content = content.replace(/grid-cols-1 sm:grid-cols-1 sm:grid-cols-2/g, 'grid-cols-1 sm:grid-cols-2');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(f + ' updated');
  }
});
