const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'ClientPortalModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// I will just add a download icon/button to the billing section.
const replacement = `  const handleDownloadInvoice = (inv: any) => {
    const content = \`INVOICE
-----------------------------
Project: \${inv.projectName || 'General Service'}
Amount: \${formatBDT(inv.amount)}
Due Date: \${inv.dueDate}
Status: \${inv.status}
-----------------------------\`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', \`Invoice_\${inv.id}.txt\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderBilling = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-500"/> Billing & Invoices</h2>
      {invoices.length === 0 ? <p className="text-slate-500 text-sm">No invoices found.</p> : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map(inv => (
            <div key={inv.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{inv.projectName || 'General Service Invoice'}</h4>
                <p className="text-xs text-slate-500 mt-1">Amount: <span className="font-bold text-slate-700 dark:text-slate-300">{formatBDT(inv.amount)}</span> • Due: {inv.dueDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={\`text-[10px] font-bold uppercase px-2 py-1 rounded \${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}\`}>
                  {inv.status}
                </span>
                
                <button onClick={() => handleDownloadInvoice(inv)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold rounded">
                  Download
                </button>

                {inv.status !== 'Paid' && (
                  <button onClick={() => handlePayInvoice(inv.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">Pay Now</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );`;

// Let's replace the old renderBilling block
data = data.replace(
  /const renderBilling = \(\) => \([\s\S]*?<\/div>\s*\);\s*};/m,
  replacement + "\\n"
);

fs.writeFileSync(file, data);
console.log("Client Portal Billing module updated to include download button.");
