import Logger from "@dazn/lambda-powertools-logger";
import { writeEventToDb } from "./service";

const handler = async (event) => {
  Logger.debug("In messageWriter handler", { event });
  await writeEventToDb(event);
};

export default handler;
