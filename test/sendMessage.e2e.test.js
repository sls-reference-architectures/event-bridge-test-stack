import { faker } from "@faker-js/faker";
import retry from "async-retry";
import EventBridge from "aws-sdk/clients/eventbridge";
import { getEventFromDb } from "../src/service";

describe("When a message is published to the event bus", () => {
  // For normal usage, change the next line to your bus name
  const busName = "event-bridge-test-dev-message-test";
  const source = "com.your-app.test";

  describe("with the correct detail type", () => {
    it("should get picked up by message writer", async () => {
      // ARRANGE
      const propOne = faker.lorem.slug();
      const message = {
        propOne,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };

      // ACT
      const id1 = await publishMessage(message, busName, source, "new");

      // ASSERT
      await retry(
        async () => {
          const event1 = await getEventFromDb(id1);
          expect(event1.detail).toEqual(message);
        },
        { retries: 3 },
      );
    });
  });

  describe("with the incorrect detail type", () => {
    it("should not get picked up by handler", async () => {
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
      const id1 = await publishMessage({
        message: messageOne,
        busName,
        source,
        detailType: correctDetailType,
      });
      const id2 = await publishMessage({
        message: messageTwo,
        busName,
        source,
        detailType: incorrectDetailType,
      });

      // ASSERT
      await retry(
        async () => {
          const event1 = await getEventFromDb(id1);
          expect(event1.detail).toEqual(messageOne);
          const event2 = await getEventFromDb(id2);
          expect(event2).toBeUndefined();
        },
        { retries: 3 },
      );
    });
  });
});

const publishMessage = async ({ message, busName, source, detailType }) => {
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
  const {
    Entries: [{ EventId: id }],
  } = await eventBridge.putEvents(putParams).promise();

  return id;
};
