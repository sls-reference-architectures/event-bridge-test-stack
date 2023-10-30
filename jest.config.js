const esModules = ['aws-testing-library', 'filter-obj'];

module.exports = {
  rootDir: '.',
  setupFilesAfterEnv: ['./test/setupFrameworks.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
};
