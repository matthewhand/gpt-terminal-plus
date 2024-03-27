// test/setup.js

process.env.NODE_CONFIG_DIR = 'config';
const config = require('config');

// Determine whether SSH tests should run
const shouldRunSshTests = config.has('testSshServer.enable') && config.get('testSshServer.enable');

// Set a global variable based on the config
global.shouldRunSshTests = shouldRunSshTests;
