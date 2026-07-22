const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'routes', 'cmsRoutes.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const routesLogic = `
// ==========================================
// ENTERPRISE SOLUTIONS (Solutions Page)
// ==========================================
router.get('/enterprise-solutions', async (req, res) => {
  try {
    const solutions = await (prisma as any).enterpriseSolution.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enterprise solutions' });
  }
});

router.post('/enterprise-solutions', async (req, res) => {
  try {
    const { title, category, desc, useCases, benefits, industries, flow } = req.body;
    const solution = await (prisma as any).enterpriseSolution.create({
      data: { title, category, desc, useCases, benefits, industries, flow }
    });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create enterprise solution' });
  }
});

router.put('/enterprise-solutions/:id', async (req, res) => {
  try {
    const { title, category, desc, useCases, benefits, industries, flow } = req.body;
    const solution = await (prisma as any).enterpriseSolution.update({
      where: { id: req.params.id },
      data: { title, category, desc, useCases, benefits, industries, flow }
    });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enterprise solution' });
  }
});

router.delete('/enterprise-solutions/:id', async (req, res) => {
  try {
    await (prisma as any).enterpriseSolution.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enterprise solution' });
  }
});
`;

content = content.replace("export default router;", routesLogic + "\nexport default router;");
fs.writeFileSync(filePath, content);
console.log("Routes added.");
