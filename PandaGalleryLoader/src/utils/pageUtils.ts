import parse from "node-html-parser";
import { createEXFetchGetConfig } from "./headerUtils"
import fetch from "node-fetch"

const FETCH_GET_CONFIG = createEXFetchGetConfig()
const GALLERY_LINK_SELECTOR = '.gl3c > a';

const getEHAsText = async (url: string) => {
    if (!url) {
        console.error('url must not be empty or null!')
        process.exit(1)
    }
    const response = await fetch(url, FETCH_GET_CONFIG)
    return await response.text();
}

const parseEHGalleryLinksFromHtml = (textHtml: string) => {
    const galleryUrls: string[] = [...parse(textHtml).querySelectorAll(GALLERY_LINK_SELECTOR)].map(links => links.getAttribute("href"));
    return galleryUrls
}

export {
    getEHAsText,
    parseEHGalleryLinksFromHtml
}
