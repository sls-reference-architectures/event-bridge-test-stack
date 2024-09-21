/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import retry from 'async-retry';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getMessageFromDb } from '../src/service';
import { generateTestMessage } from './dataGenerators';

const ebClient = new EventBridgeClient({ region: process.env.AWS_REGION });

describe('When a message is published to the event bus', () => {
  // For normal usage, change the next line to your bus name
  const busName = 'event-bridge-test-dev-message-test';
  const source = 'com.your-app.test';

  describe('with the correct detail type', () => {
    it('should get picked up by message writer', async () => {
      // ARRANGE
      const propOne = faker.lorem.slug();
      const message = generateTestMessage({ propOne });

      // ACT
      await publishMessage({
        message,
        busName,
        source,
        detailType: 'new',
      });

      // ASSERT
      await retry(
        async () => {
          const event1 = await getMessageFromDb(message.id);
          expect(event1.detail).toEqual(message);
        },
        { retries: 3 },
      );
    });
  });

  describe('with the incorrect detail type', () => {
    it('should not get picked up by handler', async () => {
      // ARRANGE
      const propOneCorrect = `${faker.lorem.slug()}_correct`;
      const messageOne = generateTestMessage({ propOne: propOneCorrect });
      const propOneIncorrect = `${faker.lorem.slug()}_incorrect`;
      const messageTwo = generateTestMessage({ propOne: propOneIncorrect });
      const correctDetailType = 'new';
      const incorrectDetailType = 'old';

      // ACT
      await publishMessage({
        message: messageOne,
        busName,
        source,
        detailType: correctDetailType,
      });
      await publishMessage({
        message: messageTwo,
        busName,
        source,
        detailType: incorrectDetailType,
      });

      // ASSERT
      await retry(
        async () => {
          const message1 = await getMessageFromDb(messageOne.id);
          expect(message1.detail).toEqual(messageOne);
          const message2 = await getMessageFromDb(messageTwo.id);
          expect(message2).toBeUndefined();
        },
        { retries: 3 },
      );
    });
  });
});

const publishMessage = async ({ message, busName, source, detailType }) => {
  const putCommand = new PutEventsCommand({
    Entries: [
      {
        Detail: JSON.stringify(message),
        DetailType: detailType,
        EventBusName: busName,
        Source: source,
      },
    ],
  });
  const {
    Entries: [{ EventId: eventId }],
  } = await ebClient.send(putCommand);

  return eventId;
};
