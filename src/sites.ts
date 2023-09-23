import type { Robot } from 'robots-parser'
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import _ from 'lodash'
import { UserAgent } from './robot';

export type Language = 'en' | 'fi' | 'sv'

export async function getSites(robot: Robot, language: Language, numberOfSites: number = 100) {
  const siteMapUrl = robot.getSitemaps()[0]
  const siteMapXml = await axios.get(siteMapUrl)
  const siteMap = await parseStringPromise(siteMapXml.data)
  return _(siteMap.urlset.url)
    .sortBy(site => parseFloat(site.priority[0]))
    .reverse()
    .map<string>(site => {
      if (site['xhtml:link']) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const languageSpecificSite = site['xhtml:link'].find(siteOption => siteOption.$.hreflang === language)
        if (languageSpecificSite) {
          return languageSpecificSite.$.href;
        }
      }
      return site.loc[0]
    })
    .uniq()
    .filter(url => Boolean(robot.isAllowed(url, UserAgent)))
    .take(numberOfSites)
    .value()
}