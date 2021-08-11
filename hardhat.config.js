require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-truffle5');

module.exports = {
  solidity: {
    version: '0.6.0',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  mocha: {
    reporter: 'mochawesome',
    reporterOptions: {
      json: false,
      charts: true,
      autoOpen: true,
      overwrite: true,
    },
  },
};
