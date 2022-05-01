import crawlingTarget from "./not-login.json";
import { processGallery, waitForSeconds, log } from "./utils";
interface Gallery {
  url: string;
  gid: string | number;
  gToken: string;
}
const crawlingTargetList: Gallery[] = crawlingTarget as Gallery[];

const startIndex = 0;
const endIndex = 5;

const REQUEST_WAIT_TIME = 20;

const crawlingOnRange = async () => {
  for (var i = startIndex; i != endIndex; i++) {
    log(`Start Process Index: ${i}`)
    await processGallery(crawlingTargetList[i].url).then(() =>
      waitForSeconds(REQUEST_WAIT_TIME).then(() => {
        log(`Index Processed ${i}`);
      })
    );
  }
};
crawlingOnRange();