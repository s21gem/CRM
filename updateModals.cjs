const fs = require('fs');

const files = ['LoginModal.tsx', 'ConsultationModal.tsx', 'SearchModal.tsx'];

files.forEach(f => {
  try {
    let c = fs.readFileSync('src/components/' + f, 'utf8');
    c = c.replace(/className="p-6 /g, 'className="p-4 sm:p-6 ');
    c = c.replace(/className="p-8 /g, 'className="p-4 sm:p-8 ');
    fs.writeFileSync('src/components/' + f, c);
    console.log(f + ' updated');
  } catch (e) {
    console.error(e);
  }
});
