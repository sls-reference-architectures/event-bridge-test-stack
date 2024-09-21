import middy from "@middy/core";
import ioLogger from "@middy/input-output-logger";

import { writeEventToDb } from "./service";

const handler = async (event) => {
  await writeEventToDb(event);
};

export default middy(handler).use(ioLogger());
