import { convert } from 'html-to-text';
import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import bluebird from 'bluebird'
import cheerio from 'cheerio'

export async function scrapeSites(sites: string[], delayMs: number = 100) {
  // TODO: revisit concurrency here!
  return await withBrowser(async (browser) => {
    return bluebird.map(sites, async (site) => {
      return withPage(browser)(async (page) => {
        const wait = new Promise(resolve => setTimeout(resolve, delayMs))
        const result = scrapeSite(site, page)
        await wait
        return result
      });
    }, { concurrency:  3 });
  });
}

async function scrapeSite(siteUrl: string, page: Page) {
  await page.goto(siteUrl);
  const content = await page.content()
  const $ = cheerio.load(content)
  console.log($('h1').text())
  return convert(content)
}

const withPage = <T> (browser: Browser) => async (fn: (page: Page) => T) => {
  const page = await browser.newPage();
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
}

const withBrowser = async <T>(fn: (browser: Browser) => T) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}