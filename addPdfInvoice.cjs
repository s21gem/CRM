const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'portals', 'ClientPortalModule.tsx');
let data = fs.readFileSync(file, 'utf8');

// 1. Inject imports
data = data.replace(
  'import {',
  'import jsPDF from "jspdf";\\nimport html2canvas from "html2canvas";\\nimport {'
);

// 2. Add state for the invoice being printed so the hidden div can render it
data = data.replace(
  '  const [cases, setCases] = useState<any[]>([]);',
  '  const [cases, setCases] = useState<any[]>([]);\\n  const [printingInvoice, setPrintingInvoice] = useState<any>(null);'
);

// 3. Update handleDownloadInvoice to use html2canvas + jsPDF
const newHandleDownloadInvoice = `  const handleDownloadInvoice = async (inv: any) => {
    setPrintingInvoice(inv);
    // Wait for state to update and DOM to render the hidden invoice
    setTimeout(async () => {
      const element = document.getElementById('invoice-print-template');
      if (!element) return;
      
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(\`Fonebox_Invoice_\${inv.id || 'Current'}.pdf\`);
      } catch (err) {
        console.error("Error generating PDF", err);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setPrintingInvoice(null);
      }
    }, 100);
  };`;

data = data.replace(
  /  const handleDownloadInvoice = \(inv: any\) => \{[\s\S]*?document\.body\.removeChild\(link\);\s*\};/,
  newHandleDownloadInvoice
);

// 4. Inject the hidden invoice template right before the final return statement
const hiddenInvoiceTemplate = `
  {/* Hidden Invoice Template for PDF Generation */}
  {printingInvoice && (
    <div className="fixed top-[200%] left-[200%] bg-white" style={{ width: '800px', padding: '40px' }} id="invoice-print-template">
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
        <div>
          <img src="/logo.png" alt="Fonebox Logo" className="h-12 mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">INVOICE</h1>
          <p className="text-sm text-slate-500 mt-1">Ref: INV-{String(printingInvoice.id).substring(0, 8).toUpperCase()}</p>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p className="font-bold text-slate-900 text-base">Fonebox Enterprise ICT Solutions</p>
          <p>Level 4, Fonebox Tower</p>
          <p>Banani, Dhaka 1213, Bangladesh</p>
          <p>contact@fonebox.com.bd</p>
          <p>+880 96 1111 2222</p>
        </div>
      </div>
      
      <div className="flex justify-between mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billed To</p>
          <p className="font-bold text-slate-900 text-lg">{printingInvoice.orgName || clientOrgName}</p>
          <p className="text-sm text-slate-600">IT Department</p>
          <p className="text-sm text-slate-600">Dhaka, Bangladesh</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Invoice Details</p>
          <table className="text-sm w-full text-right">
            <tbody>
              <tr><td className="pr-4 text-slate-500 py-1">Date Issued:</td><td className="font-semibold text-slate-900">{printingInvoice.issuedDate || new Date().toISOString().split('T')[0]}</td></tr>
              <tr><td className="pr-4 text-slate-500 py-1">Due Date:</td><td className="font-semibold text-slate-900">{printingInvoice.dueDate}</td></tr>
              <tr><td className="pr-4 text-slate-500 py-1">Payment Status:</td><td className={\`font-bold \${printingInvoice.status === 'Paid' ? 'text-emerald-600' : 'text-red-600'}\`}>{printingInvoice.status.toUpperCase()}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <table className="w-full mb-10 text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-y border-slate-200">
            <th className="py-3 px-4 font-bold text-slate-700 text-sm">Description</th>
            <th className="py-3 px-4 font-bold text-slate-700 text-sm w-32 text-center">Qty</th>
            <th className="py-3 px-4 font-bold text-slate-700 text-sm w-40 text-right">Total (BDT)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <td className="py-4 px-4 text-sm text-slate-800 font-medium">{printingInvoice.projectName || 'Enterprise ICT Service Fees'}</td>
            <td className="py-4 px-4 text-sm text-slate-600 text-center">1</td>
            <td className="py-4 px-4 text-sm text-slate-800 text-right">{formatBDT(printingInvoice.amount)}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="flex justify-end mb-16">
        <div className="w-1/2">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-slate-600">Subtotal</span>
            <span className="text-slate-900 font-medium">{formatBDT(printingInvoice.amount)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-slate-600">VAT (15%)</span>
            <span className="text-slate-900 font-medium">Included</span>
          </div>
          <div className="flex justify-between py-4 border-b-2 border-slate-800">
            <span className="text-lg font-bold text-slate-900">Total Due</span>
            <span className="text-xl font-bold text-blue-600">{formatBDT(printingInvoice.amount)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs text-slate-400 mt-20 pt-8 border-t border-slate-200">
        <p className="font-bold text-slate-500 mb-1">Thank you for your business.</p>
        <p>Please make all cheques payable to Fonebox Enterprise ICT Solutions. Bank Transfer: DBBL A/C 101.xxx.xxx</p>
        <p className="mt-4">This is a system generated invoice and does not require a physical signature.</p>
      </div>
    </div>
  )}
`;

data = data.replace(
  '  return (',
  hiddenInvoiceTemplate + '\\n  return ('
);

fs.writeFileSync(file, data);
console.log("PDF Invoice feature successfully integrated.");
