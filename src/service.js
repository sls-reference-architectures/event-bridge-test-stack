import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

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

const getDynamoDbClient = () => {
  const intermediateClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  return DynamoDBDocumentClient.from(intermediateClient);
};

const oneHourFromNow = () => 3600 + parseInt(Date.now() / 1000, 10);

// eslint-disable-next-line import/prefer-default-export
export { writeEventToDb };
