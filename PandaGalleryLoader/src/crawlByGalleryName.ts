import crawlingTarget from "./reCrawlerTitles.json";
import {
  log,
  waitForSeconds,
  getEHAsText,
  parseEHGalleryLinksFromHtml,
  processGallery,
} from "./utils";
//https://e-hentai.org/?f_search=chinese+%28C97%29+%5BMISSING+PARK+%28%E3%83%81%E3%82%B5%E3%83%88%29%5D+%E7%8A%AC%E7%8C%AB%E5%A7%89%E5%A6%B9+%28%E3%82%B2%E3%82%B2%E3%82%B2%E3%81%AE%E9%AC%BC%E5%A4%AA%E9%83%8E%29+%5B%E4%B8%AD%E5%9B%BD%E7%BF%BB%E8%A8%B3%5D
const START_URL = "https://e-hentai.org/?f_search=";
const getStartUrls = (urlQueries: string[]) =>
  `${START_URL}${urlQueries.map((query) => encodeURI(query)).join("+")}`;
const reCrawlerURls = crawlingTarget.map((el) => getStartUrls(["chinese", el]));

const REQUEST_WAIT_TIME = 45;

const startIndex = 5;
const endIndex = 2300;
const crawlByGalleryName = async () => {
  for (var i = startIndex; i != endIndex; i++) {
    try {
      const targetUrl = reCrawlerURls[i];
      const textHTML = await getEHAsText(targetUrl);
      const galleryUrls = parseEHGalleryLinksFromHtml(textHTML);
      if (!galleryUrls.length) {
        log(`get block url:${targetUrl}`);
        continue;
      }

      await processGallery(galleryUrls[0]).then(() =>
        waitForSeconds(REQUEST_WAIT_TIME).then(() => {
          log(`Index Processed ${i}`);
        })
      );
    } catch {
      log(`Error in title ${crawlingTarget[i]} skipped`);
    }
  }
};

crawlByGalleryName();
