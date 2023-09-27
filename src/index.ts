import { getRobotsTxt } from './robot';
import { getSites } from './sites';
import { scrapeSites } from './scraper';
import * as fs from 'fs';


async function main() {
  const robot = await getRobotsTxt('https://www.cashfree.com/')
  const sites = await getSites(robot, 'en', 2)
  const delay = robot.getCrawlDelay()
  const result = await scrapeSites(sites, delay && delay / 1000)
  fs.writeFileSync('output.txt', result.join('\n'))
}

main().then(() => {
  console.log('Successful scraping')
})
