import * as userConfigJson from "../config.json"
interface IUserConfig {
    //
    IS_EX_HENTAI:boolean,

    //FALSE
    USE_LOGIN:boolean,

    //igneous=string; ipb_member_id=number; ipb_pass_hash=hashString; sk=hashString; yay=string
    E_HENTAI_COOKIE_STRING?: string,

    //"USE_AWS_DB_TABLE": true,
    USE_AWS_DB_TABLE: boolean,

    //"DYNAMO_DB_TABLE_NAME": "queuedUrls",
    DYNAMO_DB_TABLE_NAME?: string,

    //"AWS_REGION": "ap-southeast-2"
    AWS_REGION?: string
}
const userConfig: IUserConfig = userConfigJson;


export { userConfig }