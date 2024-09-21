/* eslint-disable import/no-extraneous-dependencies */
import { faker } from "@faker-js/faker";
import { ulid } from "ulid";

const generateTestMessage = (overrideWith) => {
  const message = {
    id: generateTestId(),
    propOne: faker.lorem.slug(),
    propTwo: faker.lorem.slug(),
    propThree: faker.lorem.slug(),
  };

  return { ...message, ...overrideWith };
};

const generateTestId = () => `TEST_${ulid()}`;

export { generateTestMessage };
