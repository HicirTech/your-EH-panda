
import { config } from 'aws-sdk';
import { userConfig } from "./configUtils"
import { DynamoDB } from 'aws-sdk';

const { DYNAMO_DB_TABLE_NAME, AWS_REGION } = userConfig
config.update({ region: AWS_REGION });
const ddb = new DynamoDB();
const dbClient = new DynamoDB.DocumentClient();
const URL_SPLIT_ON = ".org/g/"

interface IPutQueryParam {
    PutRequest: {
        Item: {
            url: string,
            gid: string,
            gToken: string
        }
    }
}
const tryCreateTable = () => {
    const tableParam = {
        AttributeDefinitions: [
            {
                AttributeName: 'url',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'url',
                KeyType: 'HASH'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 3
        },
        TableName: DYNAMO_DB_TABLE_NAME,
    };

    ddb.createTable(tableParam, (err: any, data: any) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Table Created", data);
        }
    });
}

const createDynamoDbPutQueryParam = (galleryUrls: string[]) => (
    galleryUrls.map(url => {
        const [gid, gToken] = url.split(URL_SPLIT_ON)[1].split("/");
        const queryParamObject: IPutQueryParam = {
            PutRequest: {
                Item: {
                    url,
                    gid,
                    gToken
                }
            }
        }
        return queryParamObject;
    })
)


const createDynamoDbPutQuery = (dynamoDBQueryParams: IPutQueryParam[]) => {
    return {
        RequestItems: {
            [`${DYNAMO_DB_TABLE_NAME}`]: dynamoDBQueryParams

        }
    };
}

const putItemsIntoDynamoDB = (request, callback) => {
    dbClient.batchWrite(request, callback)
}

export {tryCreateTable, createDynamoDbPutQueryParam, createDynamoDbPutQuery, putItemsIntoDynamoDB }