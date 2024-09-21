import middy from '@middy/core';
import ioLogger from '@middy/input-output-logger';

import { writeMessageToDb } from './service';

const handler = async (event) => {
  const { detail: message } = event;
  await writeMessageToDb(message);
};

export default middy(handler).use(ioLogger());
