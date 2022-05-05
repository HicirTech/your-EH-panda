# PandaGalleryLoader

A Crawling Utility design for E(x) Hentai

## Prepares

Project is developed with nodejs and typescript, run the following command in PandaGalleryLoader folder to install dependency

```Bash
npm install yarn ts-node -g
yarn
```

# How To

Follow all following script you will need to modify ts file correspondingly

## config.json

You will need to create `config.json` in `src` folder, see `src/util/configUtils.ts` for more details

## Getting Gallery Urls from E(x) Hentai home page

First you will need a start url as entry point of your, to obtain this url, search anything on E(x) hentai, then copy the url from your browse to `/src/crawlSearchResults.ts`,
There are some simple start Url in getStartUrl() function in `crawlSearchResults.ts`, you will need to specify start page and end page, for a single page, set both start and end index to the same page number

```Bash
yarn crawlSearchResults
```

### Future work

Currently `crawlSearchResults.ts` only save urls to AWS dynamoDB, it is json file base version under development

## Get Images and metadata from a gallery

Given you have a link to a gallery or list of galleries, you can use `crawlGallery.ts`, change imported json file for crawling, you will need to specify start page and end page, for a single page, set both start and end index to the same page number

```Bash
yarn crawlGallery
```

Similarly you can run for crawling by name, see `crawlByGalleryName.ts` for more detail

```Bash
yarn crawlByGalleryName

```

## Stop condition
There are some condition the crawler will stop it self
- There are 0 link in the search result => most likely your get ban by E(x) hentai, change you public IP address will help
-  There are 0 link in the gallery => if it is not ban by E(x) hentai, most likely you hit a no body show view warning, use cookie for crawling will help
- 509 detection => the most important stopper for the crawler => you are hitting the E(x) CDN limit, not the E(x) hentai limit, image still return but all of them are 509 (don't know what is 509? see `src/utils/509.jpg`), once detect 509, crawler will stop to prevent 509 pollution on the output folder
