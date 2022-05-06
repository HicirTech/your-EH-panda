import * as userConfigJson from "../config.json";
interface IUserConfig {
  // "IS_EX_HENTAI":false
  IS_EX_HENTAI: boolean;

  //"USE_LOGIN":false
  USE_LOGIN: boolean;

  //"E_HENTAI_COOKIE_STRING":"igneous=string; ipb_member_id=number; ipb_pass_hash=hashString; sk=hashString; yay=string"
  E_HENTAI_COOKIE_STRING?: string;

  //"USE_AWS_DB_TABLE": true,
  USE_AWS_DB_TABLE: boolean;

  //"DYNAMO_DB_TABLE_NAME": "queuedUrls",
  DYNAMO_DB_TABLE_NAME?: string;

  //"AWS_REGION": "ap-southeast-2"
  AWS_REGION?: string;

  // "OUTPUT_FOLDER":"E:/"
  OUTPUT_FOLDER: string;

  // ENABLE_509_DETECTION:false
  ENABLE_509_DETECTION?:boolean;

}
const userConfig: IUserConfig = userConfigJson;

export { userConfig };
