const puppeteer = require('puppeteer');
const govbr = require('./libs/govbr');

const chromeOptions = {
  headless: false,
  defaultViewport: null,
  slowMo: 10,
};

(async () => {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();

  await page.goto('https://pcsdetran.rs.gov.br/consulta-veiculo');
  await page.waitForSelector('.pcs-btn-primary');
  await page.click('.pcs-btn-primary');

  await govbr.login(page);

  await page.waitForSelector('.pcs-btn-primary');
  await page.click('.pcs-btn-primary');

  await page.waitForSelector('.pcs-btn-primary');
  await page.click('.pcs-btn-primary');

  // await browser.close();
})();
