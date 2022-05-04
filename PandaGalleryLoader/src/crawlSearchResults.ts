import {
  log,
  tryCreateTable,
  waitForSeconds,
  getEHAsText,
  parseEHGalleryLinksFromHtml,
  createDynamoDbPutQuery,
  createDynamoDbPutQueryParam,
  putItemsIntoDynamoDB,
} from "./utils";

const START_FROM_PAGE = 0;
const TARGET_END_PAGE = 5;
const REQUEST_WAIT_TIME = 20;
let stopIndicator = false;

const getStartUrl = (page: number) => {
  const sampleURLs={
    exChineseDoujinshi:`https://exhentai.org/?page=${page}&f_cats=1021&f_search=chinese`,
    eChineseDoujinshi:`https://e-hentai.org/?page=${page}&f_cats=1021&f_search=chinese`
  }

  return sampleURLs.eChineseDoujinshi;
};


const loadUrls = async () => {
  // tryCreateTable()
  for (var i = START_FROM_PAGE; !stopIndicator && i != TARGET_END_PAGE; i++) {
    const targetUrl = getStartUrl(i);
    const textHTML = await getEHAsText(targetUrl);
    const galleryUrls = parseEHGalleryLinksFromHtml(textHTML);
    if (!galleryUrls.length) {
      log(`get block url:${targetUrl}`);
      stopIndicator = true;
      process.exit(1);
    }
    putItemsIntoDynamoDB(
      createDynamoDbPutQuery(createDynamoDbPutQueryParam(galleryUrls)),
      (err: any, data: any) => {
        if (err) {
          log("Error");
        } else {
          log(`Success page:${targetUrl}\n`);
        }
      }
    );

    await waitForSeconds(REQUEST_WAIT_TIME);
  }
};

loadUrls();



