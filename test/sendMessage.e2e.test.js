import { faker } from "@faker-js/faker";
import EventBridge from "aws-sdk/clients/eventbridge";

describe("When a message is published to the event bus", () => {
  // For normal usage, change the next line to your bus name
  const busName = "event-bridge-test-dev-message-test";
  const source = "com.your-app.test";
  const functionName = "event-bridge-test-dev-writeMessages";
  const region = "us-east-1";

  describe("with the correct detail type", () => {
    it("should get picked up by message writer", async () => {
      // ARRANGE
      const propOne = faker.lorem.slug();
      const message = {
        propOne,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };
      const noiseMessage = {
        propOne: faker.lorem.slug(),
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };

      // ACT
      await publishMessage(message, busName, source, "new");
      await publishMessage(noiseMessage, busName, source, "modified");

      // ASSERT
      expect.assertions(1);
      await expect({
        region,
        function: functionName,
        timeout: 30000,
      }).toHaveLog(propOne);
    });
  });

  describe("with the incorrect detail type", () => {
    it("should not get picked up by message writer", async () => {
      // ARRANGE
      const propOneCorrect = `${faker.lorem.slug()}_correct`;
      const messageOne = {
        propOne: propOneCorrect,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };
      const propTwoIncorrect = `${faker.lorem.slug()}_incorrect`;
      const messageTwo = {
        propOne: propTwoIncorrect,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };
      const correctDetailType = "new";
      const incorrectDetailType = "old";

      // ACT
      await publishMessage(messageOne, busName, source, correctDetailType);
      await publishMessage(messageTwo, busName, source, incorrectDetailType);

      // ASSERT
      expect.assertions(2);
      await expect({
        region: "us-east-1",
        function: functionName,
        timeout: 30000,
      }).toHaveLog(propOneCorrect);
      await expect({
        region: "us-east-1",
        function: functionName,
        timeout: 30000,
      }).not.toHaveLog(propTwoIncorrect);
    });
  });
});

const publishMessage = async (message, busName, source, detailType) => {
  const eventBridge = new EventBridge();
  const putParams = {
    Entries: [
      {
        Detail: JSON.stringify(message),
        DetailType: detailType,
        EventBusName: busName,
        Source: source,
      },
    ],
  };
  await eventBridge.putEvents(putParams).promise();
};
