import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

const writeEventToDb = async (event) => {
  const ddbClient = getDynamoDbClient();
  const putCommandParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      ...event,
      ttl: oneHourFromNow(),
    },
  };
  await ddbClient.send(new PutCommand(putCommandParams));
};

const getEventFromDb = async (id) => {
  const ddbClient = getDynamoDbClient();
  const getCommandParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id,
    },
  };
  const { Item } = await ddbClient.send(new GetCommand(getCommandParams));

  return Item;
};

const getDynamoDbClient = () => {
  const intermediateClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  return DynamoDBDocumentClient.from(intermediateClient);
};

const oneHourFromNow = () => 3600 + parseInt(Date.now() / 1000, 10);

export { getEventFromDb, writeEventToDb };
