import { convert } from 'html-to-text';
import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import bluebird from 'bluebird'
import cheerio from 'cheerio'

export async function scrapeSites(baseUrl: string, sites: string[], delayMs = 100) {
  // TODO: revisit concurrency here!
  return await withBrowser(async (browser) => {
    return bluebird.map(sites, async (site) => {
      return withPage(browser)(async (page) => {
        const wait = new Promise(resolve => setTimeout(resolve, delayMs))
        const result = scrapeSite(baseUrl, site, page)
        await wait
        return result
      });
    }, { concurrency: 3 });
  });
}

async function scrapeSite(baseUrl: string, siteUrl: string, page: Page) {
  console.log(siteUrl)
  await page.goto(siteUrl);
  const content = await page.content()
  const $ = cheerio.load(content)
  const body = $('body')
  const main = body.has('main').length ? body.find('main') : body
  return convert(main.html() ?? '', {
    preserveNewlines: false,
    wordwrap: false,
    encodeCharacters: {
      '\u00A0': ' '
    },
    formatters: {
      h3Formatter: (elem, walk, builder) => {
        builder.openBlock({ leadingLineBreaks: 0 });
        walk(elem.children, builder);
        builder.addInline(': ');
        builder.closeBlock({ trailingLineBreaks: 0 });
      },
    },
    selectors: [
      {
        selector: '*',
        options: {
          trimEmptyLines: true,
          trailingLineBreaks: 0,
          leadingLineBreaks: 0
        }
      },
      { selector: 'header', format: 'skip' },
      { selector: 'aside', format: 'skip' },
      { selector: 'nav', format: 'skip' },
      { selector: 'footer', format: 'skip' },
      { selector: 'img', format: 'skip' },
      {
        selector: 'a',
        options: {
          baseUrl,
        }
      },
      { selector: 'svg', format: 'skip' },
      { selector: 'hr', format: 'skip' },
      { selector: 'wbr', format: 'skip' },
      { selector: 'br', format: 'skip' },
      {
        selector: 'h3',
        format: 'h3Formatter',
        options: {
          leadingLineBreaks: 2,
          trailingLineBreaks: 1,
        }
      },
      {
        selector: 'p',
        options: {
          leadingLineBreaks: 1,
          trailingLineBreaks: 2,
        }
      }
    ]
  })
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
