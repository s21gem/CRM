const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'components', 'portals');
const files = ['OperationsModule.tsx', 'CRMModule.tsx', 'ClientPortalModule.tsx'];

const properFormatCurrency = `  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(2) + 'M';
    if (amount >= 1000) return '$' + (amount / 1000).toFixed(1) + 'k';
    return '$' + amount.toLocaleString();
  };
`;

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // The split string where the first accidental injection happened
  const splitStr = "const formatCurrency = (amount: number) => { if (amount >= 1000000) return '";
  
  const parts = content.split(splitStr);
  if (parts.length > 1) {
    const topPart = parts[0];
    
    // The bottom part is the rest of the file after the original formatCurrency.
    // In Operations and CRM, it might be `\n  const navItems` or `\n  // ...`
    // Wait, the first thing inside parts[1] IS exactly the bottom part!
    // Because the replacement was: "const formatCurrency = ... return '$'" + bottomPart + "+ (amount..."
    
    // But we need to isolate the bottom part. The bottom part ends where the next literal `+ (amount / 1000000).toFixed(2) + 'M'; if (amount >= 1000) return '` begins!
    const split2 = "+ (amount / 1000000).toFixed(2) + 'M'; if (amount >= 1000) return '";
    const bottomParts = parts[1].split(split2);
    
    if (bottomParts.length > 1) {
      const bottomPart = bottomParts[0];
      
      const newContent = topPart + properFormatCurrency + bottomPart;
      fs.writeFileSync(filePath, newContent);
      console.log("Fixed: " + file);
    } else {
       console.log("Could not find second split in " + file);
    }
  } else {
    console.log("Already fixed or not found in " + file);
  }
});
