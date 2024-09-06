import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = getDynamoDbClient();

const writeEventToDb = async (event) => {
  const putCommandParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      ...event,
      ttl: oneHourFromNow(),
    },
  };
  await ddbClient.send(new PutCommand(putCommandParams));

  const client = getDynamoDbClient();

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: event.id,
      data: event.data,
      ttl: oneHourFromNow(),
    },
  };

  await client.put(params);
};

const getDynamoDbClient = () => {
  const intermediateClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  return DynamoDBDocumentClient.from(intermediateClient);
};

const oneHourFromNow = () => 3600 + parseInt(Date.now() / 1000, 10);

// eslint-disable-next-line import/prefer-default-export
export { writeEventToDb };
