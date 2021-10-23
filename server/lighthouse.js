const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

async function lighthouseRun(domain) {
  try {
        // Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ['--no-sandbox','--disable-setuid-sandbox'],
    });

    // Lighthouse will open the URL.
    const runnerResult = await lighthouse(domain, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      onlyCategories: ['performance'],
      logLevel: 'info',
    });

    await browser.close();
    
    // `.lhr` is the Lighthouse Result as a JS object
    const reportJson = runnerResult.lhr

    console.log('Report is done for', reportJson.finalUrl);
    console.log('Performance score was', reportJson.categories.performance.score * 100);

    return reportJson;
  } catch (e) {
    console.log(e)
  }
}

module.exports = lighthouseRun;
