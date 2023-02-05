// eslint-disable-next-line import/no-import-module-exports
import config from './jest.config';

config.testMatch = ['**/*.test.ts'];
config.collectCoverage = false;

export default config;
