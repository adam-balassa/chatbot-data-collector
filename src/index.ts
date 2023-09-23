import { getSites } from './sites';
// import { convert } from 'html-to-text';
// // import cheerio from 'cheerio'
// import puppeteer from 'puppeteer';


async function main() {
  // const browser = await puppeteer.launch({
  //   headless: 'new'
  // });
  // const page = await browser.newPage();
  // await page.goto('https://ayy.fi/en');
  // // const $ = cheerio.load(await page.content())
  // // console.log($('body').text())
  // console.log(convert(await page.content()))
  // await page.$eval('h1', data => { console.log(data) })
  // await browser.close()
  await getSites('https://www.ayy.fi/sitemap.xml', 'en', 10)
}

main().then(() => {
  console.log('Successful scraping')
})