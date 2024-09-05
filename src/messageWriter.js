// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import Logger from "@dazn/lambda-powertools-logger";

// const ddbClient = getDynamoDbClient();

const handler = async (event) => {
  Logger.debug("Writing message out", { event });
  // const putCommandParams = {
  //   TableName: process.env.TABLE_NAME,
  //   Item: {
  //     id: '??',
  //     event,
  //     ttl: oneHourFromNow(),
  //   },
  // };
  // await ddbClient.send(new PutCommand(putCommandParams));
};

// const getDynamoDbClient = () => {
//   const intermediateClient = new DynamoDBClient({ region: process.env.AWS_REGION });

//   return DynamoDBDocumentClient.from(intermediateClient);
// };

// const oneHourFromNow = () => 3600 + parseInt(Date.now() / 1000, 10);

export default handler;
