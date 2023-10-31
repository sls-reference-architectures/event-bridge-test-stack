/**
 * This file is a fork from https://github.com/erezrokah/aws-testing-library/blob/main/src/jest/cloudwatch.ts
 * As of 2023-10-30, it does not support paging results from CloudWatch.
 * This version does.
 */

import AWS from 'aws-sdk';
import { EOL } from 'os';
// import { expectedProps, ICloudwatchProps } from '../common/cloudwatch';
// import { verifyProps } from '../common/index';
// import { getLogGroupName } from '../utils/cloudwatch';

export const toHaveLog = async function (
  this: jest.MatcherUtils,
  props: ICloudwatchProps,
  pattern: string,
) {
  verifyProps({ ...props, pattern }, expectedProps);
  const {
    region,
    function: functionName,
    startTime = epochDateMinusHours(1),
    logGroupName,
  } = props;

  try {
    const messageSubject = this.utils.printExpected(
      logGroupName || functionName,
    );
    const printRegion = this.utils.printExpected(region);
    const printPattern = this.utils.printExpected(pattern) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveLog') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveLog') + EOL + EOL;

    const { events } = await filterLogEvents(
      region,
      logGroupName || getLogGroupName(functionName || ''),
      startTime,
      pattern,
    );
    const found = events.length > 0;
    if (found) {
      // matching log found
      return {
        message: () => `${notHint}Expected ${messageSubject} at region ${printRegion} not to have log matching pattern ${printPattern}`,
        pass: true,
      };
    }
    // matching log not found
    return {
      message: () => `${hint}Expected ${messageSubject} at region ${printRegion} to have log matching pattern ${printPattern}`,
      pass: false,
    };
  } catch (error) {
    const e = error as Error;
    // unknown error
    console.error(`Unknown error while matching log: ${e.message}`);
    throw e;
  }
};

interface ICloudwatchProps extends ICommonProps {
  function?: string;
  startTime?: number;
  logGroupName?: string;
}

interface ICommonProps {
  region: string;
  timeout?: number;
  pollEvery?: number;
}

const expectedProps = ['region', 'pattern'];

const hoursToMilliseconds = (hours: number) => hours * 60 * 60 * 1000;

const epochDateMinusHours = (hours: number) => (Date.now() - hoursToMilliseconds(hours));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyProps = (props: any, expectedPropsInput: string[]) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of expectedPropsInput) {
    const value = props[prop];
    if (!value) {
      throw new Error(`Missing ${prop} from received props`);
    }
  }
};

const filterLogEvents = async (
  region: string,
  logGroupName: string,
  startTime: number,
  filterPattern: string,
) => {
  const cloudWatchLogs = new AWS.CloudWatchLogs({ region });

  const { events = [] } = await cloudWatchLogs
    .filterLogEvents({
      filterPattern,
      interleaved: true,
      limit: 1,
      logGroupName,
      startTime,
    })
    .promise();

  return { events };
};

const getLogGroupName = (functionName: string) => `/aws/lambda/${functionName}`;

export const placeholder = () => {};
