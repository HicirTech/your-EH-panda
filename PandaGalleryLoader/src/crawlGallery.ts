import crawlingTarget from "./not-login.json";
import { processGallery, waitForSeconds, log } from "./utils";
import os from "os";

interface Gallery {
  url: string;
  gid: string | number;
  gToken: string;
}
const crawlingTargetList: Gallery[] = crawlingTarget as Gallery[];

const hostName = os.hostname();
const splitter = "_";
const batchNo = parseInt(hostName.split(splitter)[1]);
const batchSize = 400;
const batchStart = 18600;
const startIndex = batchStart + 1 + batchSize * (batchNo - 1);
const endIndex = batchStart + 1 + batchSize * batchNo;

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
