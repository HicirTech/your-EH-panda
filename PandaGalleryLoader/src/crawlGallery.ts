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

//45 is a safer time..
const REQUEST_WAIT_TIME = 45;

const crawlGallery = async () => {
  for (var i = startIndex; i != endIndex; i++) {
    try {
      log(`Start Process Index: ${i}`);
      await processGallery(crawlingTargetList[i].url).then(() =>
        waitForSeconds(REQUEST_WAIT_TIME).then(() => {
          log(`Index Processed ${i}`);
        })
      );
    } catch (error) {
      log(`Error in Index: ${i}, skip ${crawlingTargetList[i].url}`);

    }
  }
};
crawlGallery();
