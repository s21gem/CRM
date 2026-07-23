const fs = require('fs');
let css = fs.readFileSync('src/index.css');

// Since it might have been written in UTF-16 at the end, it's safer to just rewrite the file content and append using Node.js
// Actually, let's just strip out any null bytes (UTF-16 LE null bytes)
let str = css.toString('utf8');
str = str.replace(/\0/g, ''); // Remove null bytes

// The last two lines were added incorrectly.
// Let's remove them and append correctly.
str = str.replace(/\.hide-scrollbar::-webkit-scrollbar \{ display: none; \}/g, '');
str = str.replace(/\.hide-scrollbar \{ -ms-overflow-style: none; scrollbar-width: none; \}/g, '');

str += `\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n`;
str += `.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n`;

fs.writeFileSync('src/index.css', str, 'utf8');
console.log('Fixed index.css');
