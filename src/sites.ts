import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import _ from 'lodash'

export type Language = 'en' | 'fi' | 'sv'

export async function getSites(siteMapUrl: string, language: Language, numberOfSites: number = 100) {
  const siteMapXml = await axios.get(siteMapUrl)
  const siteMap = await parseStringPromise(siteMapXml.data)
  const highestPrioritySites = _(siteMap.urlset.url)
    .sortBy(site => parseFloat(site.priority[0]))
    .reverse()
    .map(site => {
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
    .take(numberOfSites)
    .value()
  console.log(JSON.stringify(highestPrioritySites, null, 2))
}