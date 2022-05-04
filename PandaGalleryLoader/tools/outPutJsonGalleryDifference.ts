import * as fs from "fs";

import fullJson from "../src/login-only.json";
import ehentaiJson from "../src/login-only.json";

interface Gallery {
  url: string;
  gid: string | number;
  gToken: string;
}

const fullJsonList: Gallery[] = fullJson as Gallery[];
const eHentaiList: Gallery[] = ehentaiJson as Gallery[];

const eHentaiUrls = eHentaiList.map((el) => el.url);
const filteredElements = fullJsonList
  .filter((el) => !eHentaiUrls.includes(el.url))
  .map((el) => {
    return { ...el, gid: `${el.gid}` };
  });

console.log(filteredElements.length);
const data = JSON.stringify(filteredElements, null, 4);

try {
  fs.writeFileSync("difference.json", data);
  console.log("JSON data is saved.");
} catch (error) {
  console.error(error);
}
