const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'Home.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the hardcoded array with state and useEffect
const hardcodedArrayRegex = /const featuredSolutions = \[\s*\{[\s\S]*?\}\s*\];/;
const replacement = `const [featuredSolutions, setFeaturedSolutions] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedSolutions = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cms/featured-solutions');
        if (res.ok) {
          const data = await res.json();
          // Map backend field names (imageUrl, desc) to what the UI expects (img, desc)
          const mapped = data.map((d: any) => ({
            ...d,
            img: \`http://localhost:5000\${d.imageUrl}\`
          }));
          setFeaturedSolutions(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch featured solutions", e);
      }
    };
    fetchFeaturedSolutions();
  }, []);`;

content = content.replace(hardcodedArrayRegex, replacement);

fs.writeFileSync(filePath, content);
console.log("Home.tsx updated.");
