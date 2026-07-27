const esModules = ['@faker-js/faker'];

module.exports = {
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
};
