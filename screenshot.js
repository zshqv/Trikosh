const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    await page.screenshot({ path: 'navbar-screenshot.png' });

    // Get the GitHub link
    const githubLink = await page.locator('a[href="https://github.com/zshqv/Trikosh"]').first();
    const exists = await githubLink.isVisible();
    const href = await githubLink.getAttribute('href');
    const target = await githubLink.getAttribute('target');
    const rel = await githubLink.getAttribute('rel');

    console.log('GitHub link found:', exists);
    console.log('Href:', href);
    console.log('Target:', target);
    console.log('Rel:', rel);
    console.log('Screenshot saved to navbar-screenshot.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
