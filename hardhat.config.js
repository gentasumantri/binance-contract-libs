// hardhat.config.js

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');

const mochaOptions = require('./.mocharc.js');

module.exports = {
  solidity: {
    version: '0.6.2',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  mocha: mochaOptions,
};
