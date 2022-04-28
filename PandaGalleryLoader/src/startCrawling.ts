import { log, tryCreateTable,waitForSeconds, getEHAsText, parseEHGalleryLinksFromHtml, createDynamoDbPutQuery, createDynamoDbPutQueryParam, putItemsIntoDynamoDB } from './utils';

const START_FROM_PAGE = 0;
const TARGET_END_PAGE = 2500
let stopIndicator = false;


const startCrawling = async () => {
    // tryCreateTable()
    for (var i = START_FROM_PAGE; !stopIndicator && i != TARGET_END_PAGE; i++) {
        const targetUrl = `https://exhentai.org/?page=${i}&f_cats=1021&f_search=chinese&from=2198604`;
        const textHTML = await getEHAsText(targetUrl);
        const galleryUrls = parseEHGalleryLinksFromHtml(textHTML);
        if (!galleryUrls.length) {
            log(`get block url:${targetUrl}`)
            stopIndicator = true;
            process.exit(1);
        }
        putItemsIntoDynamoDB(createDynamoDbPutQuery(createDynamoDbPutQueryParam(galleryUrls)), (err:any, data:any) => {
            if (err) {
                log("Error");
            } else {
                log(`Success page:${targetUrl}\n`);
            }
        })

        await waitForSeconds(10);
    }
}



startCrawling()