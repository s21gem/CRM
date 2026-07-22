const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'components', 'Solutions.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the imports
content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

// Replace hardcoded solutions array and state
const hardcodedRegex = /const solutions = \[\s*\{[\s\S]*?\}\s*\];/;
const replacement = `const [solutions, setSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchEnterpriseSolutions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/enterprise-solutions');
        if (res.ok) {
          const data = await res.json();
          const parsed = data.map((d: any) => ({
            ...d,
            useCases: JSON.parse(d.useCases || '[]'),
            benefits: JSON.parse(d.benefits || '[]'),
            industries: JSON.parse(d.industries || '[]'),
            flow: JSON.parse(d.flow || '[]')
          }));
          setSolutions(parsed);
          if (parsed.length > 0) {
            setSelectedSolution(parsed[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to fetch enterprise solutions", e);
      }
    };
    fetchEnterpriseSolutions();
  }, []);`;
content = content.replace(hardcodedRegex, replacement);

// Replace current
content = content.replace(
  "const current = solutions.find(s => s.id === selectedSolution) || solutions[0];",
  "const current = solutions.find(s => s.id === selectedSolution) || solutions[0];\n  if (!current) return <div className=\"pt-28 pb-12 flex justify-center\"><div className=\"animate-pulse text-slate-500\">Loading Sovereign Infrastructure...</div></div>;"
);

// Replace flowchart line
content = content.replace(
  '<div className="absolute top-[34px] left-[12%] right-[12%] h-[1px] bg-slate-200 dark:bg-slate-800 z-0" />',
  `<div className="absolute top-[34px] left-[12%] right-[12%] h-[1px] bg-slate-200 dark:bg-slate-800 z-0">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_2px_rgba(59,130,246,0.6)] rounded-full" 
                  style={{ width: \`\${(diagramStep / Math.max((current.flow.length - 1), 1)) * 100}%\` }} 
                />
              </div>`
);

fs.writeFileSync(filePath, content);
console.log("Solutions.tsx updated.");
