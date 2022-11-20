const config = require('./jest.config');

config.testMatch = ['**/*.test.ts'];
config.collectCoverage = false;

module.exports = config;
