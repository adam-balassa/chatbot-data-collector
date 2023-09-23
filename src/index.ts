import puppeteer from 'puppeteer'
import { convert } from 'html-to-text'


async function main() {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('https://ayy.fi/en');
  console.log(convert(await page.content()))
  await browser.close()
}

main().then(() => {
  console.log('Successful scraping')
})