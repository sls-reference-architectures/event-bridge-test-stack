import { EventBridgeEvent } from 'aws-lambda';
import Logger from '@dazn/lambda-powertools-logger';

import { NewMessage } from './models';

const handler = async (event: EventBridgeEvent<string, NewMessage>): Promise<void> => {
  Logger.debug('Writing message out', { event });
};

// eslint-disable-next-line import/prefer-default-export
export { handler };
