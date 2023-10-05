import { getRobotsTxt } from './robot';
import { getSites } from './sites';
import { scrapeSites } from './scraper';
import { generateJsonResponses } from './gptJsonGenerator';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const baseUrl = 'https://www.cashfree.com'
  const robot = await getRobotsTxt(baseUrl)
  const sites = await getSites(robot, 'en', 2)
  const delay = robot.getCrawlDelay()
  const result = await scrapeSites(baseUrl, sites, delay && delay / 1000)
  sites.shift()
  result.shift()
  const jsonResponses = await generateJsonResponses(sites, result)
  await writeToFiles(sites, result)

  fs.writeFileSync('output1.txt', jsonResponses.join('\n\n\n\n----------------------------------------------------------------------------------------------------\n\n\n\n'))
}

async function writeToFiles(sites: string[], contents: unknown[]) {
  sites.forEach((site, index) => {
    let pageContent = 'LINK TO PAGE: ' + site + '\n\n\n\n----------------------------------------------------------------------------------------------------\n\n\n\n'
    pageContent = pageContent + contents[index]
    const filePath = 'outputs'
    const fileName = 'page_' + index + '.txt'
    fs.writeFileSync(path.join(filePath, fileName), pageContent)
  })
}

main().then(() => {
  console.log('Successful scraping')
})
