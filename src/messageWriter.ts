/* eslint-disable @typescript-eslint/no-explicit-any */
import Logger from '@dazn/lambda-powertools-logger';

export const handler = async (event: any): Promise<void> => {
  Logger.debug('Writing message out', { event });
};

export const placeholder = () => { };
