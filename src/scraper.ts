import { convert } from 'html-to-text';
import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import bluebird from 'bluebird'
import cheerio from 'cheerio'

// Function to scrape multiple sites concurrently
export async function scrapeSites(baseUrl: string, sites: string[], delayMs = 100) {
  return await withBrowser(async (browser) => {
    // Use bluebird to map over sites with concurrency
    return bluebird.map(sites, async (site) => {
      return withPage(browser)(async (page) => {
        // Add a delay before scraping each site
        const wait = new Promise(resolve => setTimeout(resolve, delayMs))
        const result = scrapeSite(baseUrl, site, page)
        await wait
        return result
      });
    }, { concurrency: 3 });
  });
}

// Function to scrape a single site
async function scrapeSite(baseUrl: string, siteUrl: string, page: Page) {
  console.log(siteUrl);
  // Navigate to the site URL
  await page.goto(siteUrl);
  // Retrieve and process the page content
  const content = await page.content();
  const $ = cheerio.load(content);
  const body = $('body');
  const main = body.has('main').length ? body.find('main') : body;

  // Convert HTML to plain text with specific formatting options
  return convert(main.html() ?? '', {
    preserveNewlines: false,
    wordwrap: false,
    encodeCharacters: {
      '\u00A0': ' '
    },
    // Custom formatting options for specific elements
    formatters: {
      h3Formatter: (elem, walk, builder) => {
        builder.openBlock({ leadingLineBreaks: 0 });
        walk(elem.children, builder);
        builder.addInline(': ');
        builder.closeBlock({ trailingLineBreaks: 0 });
      },
    },
    // Selectors to apply formatting options or skip elements
    selectors: [
      {
        selector: '*',
        options: {
          trimEmptyLines: true,
          trailingLineBreaks: 0,
          leadingLineBreaks: 0
        }
      },
      // Skip specific elements
      { selector: 'header', format: 'skip' },
      { selector: 'aside', format: 'skip' },
      { selector: 'nav', format: 'skip' },
      { selector: 'footer', format: 'skip' },
      { selector: 'img', format: 'skip' },
      // Handle anchor (a) elements with base URL
      {
        selector: 'a',
        options: {
          baseUrl,
        }
      },
      // Skip specific elements
      { selector: 'svg', format: 'skip' },
      { selector: 'hr', format: 'skip' },
      { selector: 'wbr', format: 'skip' },
      { selector: 'br', format: 'skip' },
      // Apply custom formatting to h3 and p elements
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

// Function to create a new page within a browser context
const withPage = <T> (browser: Browser) => async (fn: (page: Page) => T) => {
  const page = await browser.newPage();
  try {
    return await fn(page);
  } finally {
    await page.close();
  }
}

// Function to launch a headless Puppeteer browser and execute a function
const withBrowser = async <T>(fn: (browser: Browser) => T) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    return await fn(browser);
  } finally {
    await browser.close();
  }
}
