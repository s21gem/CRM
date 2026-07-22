const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'OperationsModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// Replace the dummy renderReports function with a functional one
const newRenderReports = `  const downloadCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => \`"\${String(cell).replace(/"/g, '""')}"\`).join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadReport = (reportType: string) => {
    if (reportType === 'projects') {
      const headers = ['Project Name', 'Organization', 'Category', 'Status', 'Budget (BDT)', 'Spent (BDT)', 'Progress', 'Start Date'];
      const rows = projects.map(p => [p.name, p.orgName, p.category, p.status, p.budget, p.spent, p.completionPercentage + '%', p.startDate]);
      downloadCSV('Projects_Audit_Report.csv', headers, rows);
    } else if (reportType === 'organizations') {
      const headers = ['Organization Name', 'Sector', 'Country', 'Security Clearance', 'Deal Value (BDT)', 'Status', 'Purpose'];
      const rows = organizations.map(o => [o.name, o.sector, o.country, o.securityClearance, o.totalDealValue, o.status, o.purpose || 'N/A']);
      downloadCSV('Organizations_Directory.csv', headers, rows);
    } else if (reportType === 'cases') {
      const headers = ['Case Title', 'Organization', 'Severity', 'Status', 'Assigned To', 'Created Date'];
      const rows = cases.map(c => [c.title, c.orgName, c.severity, c.status, c.assignedTo, c.createdAt]);
      downloadCSV('Support_Cases_Log.csv', headers, rows);
    }
  };

  const renderReports = () => {
    const reports = [
      { id: 'projects', title: 'Project Budget & Status Report', desc: 'Download a full CSV export of all active and completed projects with budget utilization.' },
      { id: 'organizations', title: 'Organization Directory Report', desc: 'Download a complete list of all synced CRM organizations and their clearance levels.' },
      { id: 'cases', title: 'Support Cases Audit Log', desc: 'Download a historical CSV log of all operational support cases and their severities.' }
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500"/> Operational Reports
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                  <FileText className="w-5 h-5"/>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{report.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{report.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownloadReport(report.id)} 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-2"
              >
                Download CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };`;

// We use regex to replace the old renderReports
data = data.replace(
  /const renderReports = \(\) => \([\s\S]*?Downloading \$\{report\}...\`\)}[\s\S]*?<\/div>\s*\);\s*};/m,
  newRenderReports
);

fs.writeFileSync(file, data);
console.log("Updated Reports to download real CSV from database.");
