import middy from '@middy/core';
import ioLogger from '@middy/input-output-logger';

import { writeMessageToDb } from './service';

const writeMessageHandler = async (event) => {
  const { detail: message } = event;
  await writeMessageToDb(message);
};

export const handler = middy(writeMessageHandler).use(ioLogger());
