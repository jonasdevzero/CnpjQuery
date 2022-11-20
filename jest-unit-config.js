const config = require('./jest.config');

config.testMatch = ['**/*.spec.ts'];
config.collectCoverage = false;

module.exports = config;
