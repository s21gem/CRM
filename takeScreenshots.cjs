const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1440, height: 900 }
  });

  const outputDir = path.join(__dirname, 'docs', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const capturePortal = async (email, password, expectedUrlPath, filename) => {
    console.log(`Capturing ${filename} with user ${email}...`);
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);

    try {
      // Go to home page
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1000));

      if (email) {
        // Open Login Modal
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const loginBtn = buttons.find(b => b.textContent.includes('Enterprise Portals'));
          if (loginBtn) loginBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
        
        // Fill credentials
        await page.type('input[type="text"]', email);
        await page.type('input[type="password"]', password);
        await page.keyboard.press('Enter');
        
        // Wait for redirect to happen
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 3000)); // allow data to fetch

        // Verify URL
        if (!page.url().includes(expectedUrlPath)) {
            console.log(`Warning: expected to be on ${expectedUrlPath}, but on ${page.url()}. Forcing navigation.`);
            await page.goto(`http://localhost:3000${expectedUrlPath}`, { waitUntil: 'networkidle0' });
            await new Promise(r => setTimeout(r, 3000));
        }
      }

      // Hide the scrollbars for a cleaner screenshot
      await page.addStyleTag({content: '::-webkit-scrollbar { display: none; }'});

      await page.screenshot({ path: path.join(outputDir, filename) });
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(`Failed to capture ${filename}:`, e);
    } finally {
      await context.close();
    }
  };

  try {
    // 1. Capture Public Portal (no login needed)
    // await capturePortal(null, null, '/', 'public_portal.png');

    // 2. Capture Super Admin Portal
    // await capturePortal('admin', 'admin', '/admin', 'super_admin.png');

    // 3. Capture CRM Portal
    // await capturePortal('sales', 'sales', '/crm', 'crm.png');

    // 4. Capture Ops Portal
    // await capturePortal('ops', 'ops', '/ops', 'operations.png');

    // 5. Capture Client Portal
    await capturePortal('client', 'client', '/client', 'client_portal.png');

    console.log('All screenshots captured successfully!');
  } catch (error) {
    console.error('Error in main runner:', error);
  } finally {
    await browser.close();
  }
})();
