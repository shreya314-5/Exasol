import { chromium } from 'playwright';

async function test() {
  console.log('Launching browser with channel: chrome...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });
  const context = await browser.newContext({
    recordVideo: {
      dir: './recordings',
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  console.log('Closing page...');
  await page.close();
  await context.close();
  await browser.close();
  console.log('Done test!');
}

test().catch(err => {
  console.error('Error in test:', err);
  process.exit(1);
});
