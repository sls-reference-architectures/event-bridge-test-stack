# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test          # lint + unit tests
npm run lint       # ESLint check
npm run test:unit  # unit tests only
npm run test:e2e   # e2e tests against a deployed stack (jest.config.e2e.js)
npm run deploy     # deploy via Serverless Framework (osls)
npm run tear-down  # remove the stack
```

To run a single test file:

```bash
npx jest test/helloworld.unit.test.js
```

## Architecture

This project demonstrates how to write a validation test for messages flowing through
**EventBridge**, and is meant to be deployed as a short-lived, test-only stack: deploy it _after_
the system under test's own e2e tests have passed, run the event tests, then tear it down
immediately (`deploy` → `test:e2e` → `tear-down`, see `.github/workflows/ci.yml`). It is not meant
to stay deployed long-term.

**Components** (`serverless.yml`):

- A `TestEventBus` (`AWS::Events::EventBus`) — a purpose-built bus for this demo. In real usage
  you'd point `writeMessages`'s `eventBridge` trigger at an existing bus ARN instead (see the
  commented-out `eventBus: arn:...` line and the "NOTE" comments in `serverless.yml` /
  `test/jest.setup.e2e.js`).
- `writeMessages` (`src/handler.js` → `src/service.js`): a Lambda subscribed to the bus with an
  EventBridge rule matching `source: com.your-app.test` and `detail-type: new`. On match, it
  writes the event `detail` payload to `TestEventsTable` (DynamoDB, 1-hour TTL).

**e2e test** (`test/sendMessage.e2e.test.js`) publishes directly to the bus via
`PutEventsCommand` and polls DynamoDB (via `getMessageFromDb`, with `async-retry`) to confirm the
handler wrote the row — and, in the negative case, confirms a message with the _wrong_
`detail-type` is correctly ignored by the EventBridge rule and never gets written.

**No int tier** — only unit (`test/helloworld.unit.test.js`, a placeholder) and e2e.

## Known constraints

- `osls` (community fork) is the deploy tool, not the official `serverless` package.
- Before deploying with a real (non-demo) event bus, update the bus name in both `serverless.yml`
  and `test/jest.setup.e2e.js` — see the "NOTE" comments in each.
