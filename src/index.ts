import { getRobotsTxt } from './robot';
import { getSites } from './sites';
import { scrapeSites } from './scraper';
import * as fs from 'fs';


async function main() {
  const baseUrl = 'https://www.cashfree.com'
  const robot = await getRobotsTxt(baseUrl)
  const sites = await getSites(robot, 'en', 5)
  const delay = robot.getCrawlDelay()
  const result = await scrapeSites(baseUrl, sites, delay && delay / 1000)
  fs.writeFileSync('output.txt', result.join('\n\n\n\n----------------------------------------------------------------------------------------------------\n\n\n\n'))
}

main().then(() => {
  console.log('Successful scraping')
})
