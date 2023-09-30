import { getRobotsTxt } from './robot';
import { getSites } from './sites';
import { scrapeSites } from './scraper';
import { zip } from 'zip-a-folder';
// import { generateJsonResponses } from './gptJsonGenerator';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const baseUrl = 'https://www.cashfree.com'
  const robot = await getRobotsTxt(baseUrl)
  const sites = await getSites(robot, 'en', 20)
  const delay = robot.getCrawlDelay()
  const result = await scrapeSites(baseUrl, sites, delay && delay / 1000)
  await writeToFiles(sites, result)

  // fs.writeFileSync('output.txt', result.join('\n\n\n\n----------------------------------------------------------------------------------------------------\n\n\n\n'))
}

async function writeToFiles(sites: string[], contents: unknown[]) {
  sites.forEach((site, index) => {
    let pageContent = 'LINK TO PAGE: ' + site + '\n\n\n\n----------------------------------------------------------------------------------------------------\n\n\n\n'
    pageContent = pageContent + contents[index]
    const filePath = 'outputs'
    const fileName = 'page_' + index + '.txt'
    fs.writeFileSync(path.join(filePath, fileName), pageContent)
  })
  await zip('outputs', 'outputs.zip');
}

main().then(() => {
  console.log('Successful scraping')
})
