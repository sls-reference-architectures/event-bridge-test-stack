# event-bridge-test

This project demonstrates how a validation test for an EventBridge message might look like. It is a test-only stack that is designed to be deployed after other E2E tests have successfully completed. Then, the event tests can be run and the stack destroyed.

So, the typical CI flow looks like:
[other steps] -> Deploy App -> E2E Tests -> Deploy Event-Test Stack -> Event Tests -> Destroy Event-Test Stack

Because event tests involve a deployment/teardown, they can be costly in time. I suggest running these tests only if all the other (unit, integration, end-to-end) tests pass.

## To Deploy and Run

First, do whatever is necessary to have CLI access to your AWS account (you can quickly verify this with `aws s3 ls` or similar).

Next, update the bus name in **both** `serverless.yml` and `jest.setup.e2e.js` (look for "your bus name" in the comment and replace the value below with, you know, your bus name). If you are not running in `us-east-1`, then also update the region in the same file.
