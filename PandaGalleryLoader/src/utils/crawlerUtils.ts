import fetch from "node-fetch";
import * as fs from "fs";
import { getEHAsText, waitForSeconds, log } from "./index";
import parse from "node-html-parser";
import { userConfig } from "./configUtils";
import os from "os";
import resemble from "resemblejs";

const { OUTPUT_FOLDER, ENABLE_509_DETECTION } = userConfig;
const hostName = os.hostname();
const HOST_OUTPUT_DIR = `${OUTPUT_FOLDER}${hostName}/`;

if (!fs.existsSync(HOST_OUTPUT_DIR)) {
  fs.mkdirSync(HOST_OUTPUT_DIR);
}

const THE_509_TEMPLATE = fs.readFileSync(`${__dirname}/509.jpg`);
const resemble509 = resemble(THE_509_TEMPLATE);

const downloadImage = async (url, outputDir, imgTitle) => {
  const response = await fetch(url, {}, 240);
  const buffer = await response.buffer();
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const outputTarget = `${outputDir}/${imgTitle}`;
  fs.writeFile(outputTarget, buffer, () => {
    if (ENABLE_509_DETECTION) {
      resemble509
        .compareTo(fs.readFileSync(outputTarget))
        .onComplete((data) => {
          //if this image 90% look like 509..
          if (parseFloat(data.misMatchPercentage) < 90) {
            log(`509 detected on ${outputTarget}`);
            process.exit(1);
          }
        });
    }
  });
};
const processGalleryImgPage = async (imageRequest, title) => {
  const imagePage = await getEHAsText(imageRequest.link);
  const page = parse(imagePage);
  const imgSrc = page.querySelector("#img").getAttribute("src");
  await downloadImage(imgSrc, title, imageRequest.name);
};

const processGalleryPage = async (pageUrl, title, pageGap) => {
  console.log(await waitForSeconds(20 * pageGap));
  const imagePageText = await getEHAsText(pageUrl);
  const imagePage = parse(imagePageText);
  const requestForImagesOnPage = [
    ...imagePage.querySelector("#gdt").querySelectorAll("a"),
  ]
    .map((el) => {
      return {
        name: el.querySelector("img").getAttribute("title").split(": ")[1],
        link: el.getAttribute("href"),
      };
    })
    .map((request) => processGalleryImgPage(request, title));
  //try it's best to download files
  await Promise.allSettled(requestForImagesOnPage);
};

const processGallery = async (startUrl: string) => {
  //Collect metadata
  const galleryHTMLText = await getEHAsText(startUrl);
  log(`Processing ${startUrl}`);
  const page = parse(galleryHTMLText);
  const category = page.querySelector("#gdc")?.text;
  const title = page.querySelector("#gn")?.text;
  const subTitle = page.querySelector("#gj")?.text;
  const folderName = `${subTitle || title}`;
  if (!folderName) {
    log(`skip ${startUrl}`);
    return;
  }
  const outputFolderName = folderName
    .replace(/:/g, "")
    .replace(/\"/g, "")
    .replace(/\//g, "")
    .replace(/\\/g, "")
    .replace(/\|/g, "")
    .replace(/\?/g, "")
    .replace(/</g, "")
    .replace(/>/g, "")
    .trim();
  const outputDir = `${HOST_OUTPUT_DIR}${outputFolderName}`;

  const totalPages = parseInt(
    page
      .querySelector(".gpc")
      .textContent?.toString()
      .split("of")[1]
      .trim()
      .split(" ")[0]
  );

  if (!totalPages) {
    log(`skip ${startUrl}`);
    return;
  }
  const tags = [
    ...page.querySelector("#taglist").querySelectorAll("tr"),
  ].reduce((old, now) => {
    const key = now.querySelector(".tc")?.textContent.replace(":", "");
    const values = [...now.querySelectorAll("a")]?.map((tag) => tag.text);
    if (key && values) {
      old[key] = values;
    }
    return old;
  }, {});

  [...page.querySelector(".ptt").querySelectorAll("a")]
    .filter((pageSelectorCell) => ![">", "<"].includes(pageSelectorCell.text))
    .map((pageSelectorCell) => pageSelectorCell.getAttribute("href"))
    .forEach((url, i) => processGalleryPage(url, outputDir, i));

  const fullMeta = {
    title,
    subTitle,
    category,
    tags,
    totalPages,
  };

  const data = JSON.stringify(fullMeta, null, 4);
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(`${outputDir}/metadata.json`, data);
    log(`${title} ----> ${startUrl} ----> process finished`);
  } catch (error) {
    console.error(error);
  }
};

export { processGallery };
