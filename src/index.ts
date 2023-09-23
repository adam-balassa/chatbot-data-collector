import { getRobotsTxt } from './robot';
import { getSites } from './sites';
import { scrapeSites } from './scraper';


async function main() {
  const robot = await getRobotsTxt('https://www.ayy.fi')
  const sites = await getSites(robot, 'en', 1)
  const delay = robot.getCrawlDelay()
  const result = await scrapeSites(sites, delay && delay / 1000)
  console.log(result)
}

main().then(() => {
  console.log('Successful scraping')
})
