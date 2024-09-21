const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';
const tableName = process.env.TABLE_NAME || 'event-bridge-test-stack-events';

const setup = async () => {
  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.TABLE_NAME = tableName;
};

export default setup;
