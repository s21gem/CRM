const fs = require('fs');
const path = require('path');

const dir = 'src/components/portals';
const files = ['CRMModule.tsx', 'CmsModule.tsx', 'OperationsModule.tsx', 'SuperAdminModule.tsx', 'ClientPortalModule.tsx'];

files.forEach(f => {
  let filepath = path.join(dir, f);
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // 1. Main container flex direction
  content = content.replace(/className="flex h-full/g, 'className="flex flex-col md:flex-row h-full');
  
  // 2. Sidebar width and border
  content = content.replace(/className="w-64 border-r/g, 'className="w-full md:w-64 border-b md:border-b-0 md:border-r');

  // 3. Tab container layout
  content = content.replace(/<div className="space-y-1">/g, '<div className="flex md:block overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 pb-2 md:pb-0 hide-scrollbar">');

  // 4. Tab buttons whitespace
  // Replace `w-full flex items-center` with `whitespace-nowrap flex-shrink-0 md:w-full flex items-center`
  // Some files might have `w-full flex items-center gap-3 px-3 py-2.5`
  content = content.replace(/className={`w-full flex/g, 'className={`whitespace-nowrap flex-shrink-0 md:w-full flex');
  content = content.replace(/className="w-full flex/g, 'className="whitespace-nowrap flex-shrink-0 md:w-full flex');
  
  // Fix main content area padding on mobile
  content = content.replace(/className="flex-1 p-6 overflow-y-auto"/g, 'className="flex-1 p-4 md:p-6 overflow-y-auto"');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(f + ' updated');
  } else {
    console.log(f + ' no changes needed or regex failed');
  }
});
