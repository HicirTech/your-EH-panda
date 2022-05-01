import { Headers } from "node-fetch";
import { userConfig } from "./configUtils";

const { IS_EX_HENTAI, USE_LOGIN, E_HENTAI_COOKIE_STRING } = userConfig;

const createEHHeaders = () => {
  const eHentaiHeader: Headers = new Headers();

  // create standard header for no login
  eHentaiHeader.append(
    "sec-ch-ua",
    '" Not A;Brand";v="99", "Chromium";v="100", "Microsoft Edge";v="100"'
  );
  eHentaiHeader.append("sec-ch-ua-mobile", "?0");
  eHentaiHeader.append("sec-ch-ua-platform", '"Windows"');
  eHentaiHeader.append("Upgrade-Insecure-Requests", "1");
  eHentaiHeader.append("DNT", "1");
  eHentaiHeader.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.44"
  );
  eHentaiHeader.append(
    "Accept",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
  );
  eHentaiHeader.append("Sec-Fetch-Site", "same-origin");
  eHentaiHeader.append("Sec-Fetch-Mode", "navigate");
  eHentaiHeader.append("Sec-Fetch-User", "?1");
  eHentaiHeader.append("Sec-Fetch-Dest", "document");

  if (USE_LOGIN) {
    if (!E_HENTAI_COOKIE_STRING) {
      console.error("You must provide your exHentai cookie as string");
      process.exit(1);
    }

    const targetHost = IS_EX_HENTAI ? "exhentai.org" : "e-hentai.org";
    eHentaiHeader.append("host", targetHost);
    eHentaiHeader.append("Cookie", userConfig.E_HENTAI_COOKIE_STRING);
  }

  return eHentaiHeader;
};

/**
 * Create a fetch config for ExHentai
 * @returns fetch config for ExHentai
 */
const createEXFetchGetConfig = () => {
  const config: RequestInit = {
    method: "GET",
    headers: createEHHeaders(),
    redirect: "follow",
  };
  return config;
};

export { createEHHeaders, createEXFetchGetConfig };
