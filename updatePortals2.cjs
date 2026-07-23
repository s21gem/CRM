const fs = require('fs');
const path = require('path');

const dir = 'src/components/portals';
const files = ['CRMModule.tsx', 'CmsModule.tsx', 'OperationsModule.tsx', 'SuperAdminModule.tsx', 'ClientPortalModule.tsx'];

files.forEach(f => {
  let filepath = path.join(dir, f);
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Add overflow-x-auto wrapper to tables
  // We'll just replace `<table` with `<div className="overflow-x-auto w-full"><table`
  // and `</table>` with `</table></div>`
  // But we have to be careful not to do it twice.
  if (!content.includes('className="overflow-x-auto w-full"')) {
    content = content.replace(/<table/g, '<div className="overflow-x-auto w-full"><table');
    content = content.replace(/<\/table>/g, '</table></div>');
  }

  // Make grids responsive
  content = content.replace(/grid-cols-2(?! )/g, 'grid-cols-1 sm:grid-cols-2');
  content = content.replace(/grid-cols-3(?! )/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3');
  content = content.replace(/grid-cols-4(?! )/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
  
  // Clean up if it created duplicates
  content = content.replace(/grid-cols-1 sm:grid-cols-1 sm:grid-cols-2/g, 'grid-cols-1 sm:grid-cols-2');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(f + ' updated');
  }
});
