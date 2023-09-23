import robotsParser from 'robots-parser'
import axios from 'axios';

export const UserAgent = 'ChatBotRobot'

export async function getRobotsTxt(baseUrl: string) {
  const robotsFileUrl = new URL('/robots.txt', baseUrl).toString()
  const robotsFile = await axios.get(robotsFileUrl)
  return robotsParser(robotsFileUrl, robotsFile.data)
}