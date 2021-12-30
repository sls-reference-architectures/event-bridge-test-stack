import faker from 'faker';
import EventBridge, { PutEventsRequest } from 'aws-sdk/clients/eventbridge';
import { NewMessage } from '../src/models';

describe('When a message is published to the event bus', () => {
  // For normal usage, change the next line to your bus name
  const busName = 'event-bridge-test-dev-message-test';
  const source = 'com.your-app.test';
  const functionName = 'event-bridge-test-dev-writeMessages';
  const region = 'us-east-1';

  describe('with the correct detail type', () => {
    it('should get picked up by message writer', async () => {
      // ARRANGE
      const propOne = faker.lorem.slug();
      const message: NewMessage = {
        propOne,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };
      const detailType = 'new';

      // ACT
      await publishMessage(message, busName, source, detailType);

      // ASSERT
      expect.assertions(1);
      await expect({
        region,
        function: functionName,
        timeout: 15000,
      }).toHaveLog(propOne);
    });
  });

  describe('with the incorrect detail type', () => {
    it('should not get picked up by message writer', async () => {
      // ARRANGE
      const propOneCorrect = `${faker.lorem.slug()}_correct`;
      const messageOne: NewMessage = {
        propOne: propOneCorrect,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };
      const propTwoIncorrect = `${faker.lorem.slug()}_incorrect`;
      const messageTwo: NewMessage = {
        propOne: propTwoIncorrect,
        propTwo: faker.lorem.slug(),
        propThree: faker.lorem.slug(),
      };
      const correctDetailType = 'new';
      const incorrectDetailType = 'old';

      // ACT
      await publishMessage(messageOne, busName, source, correctDetailType);
      await publishMessage(messageTwo, busName, source, incorrectDetailType);

      // ASSERT
      expect.assertions(2);
      await expect({
        region: 'us-east-1',
        function: functionName,
        timeout: 15000,
      }).toHaveLog(propOneCorrect);
      await expect({
        region: 'us-east-1',
        function: functionName,
        timeout: 15000,
      }).not.toHaveLog(propTwoIncorrect);
    });
  });
});

const publishMessage = async (
  message: NewMessage,
  busName: string,
  source: string,
  detailType: string,
): Promise<void> => {
  const eventBridge = new EventBridge();
  const putParams: PutEventsRequest = {
    Entries: [{
      Detail: JSON.stringify(message),
      DetailType: detailType,
      EventBusName: busName,
      Source: source,
    }],
  };
  await eventBridge.putEvents(putParams).promise();
};
