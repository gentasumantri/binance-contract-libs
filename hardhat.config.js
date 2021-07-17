require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-truffle5');

module.exports = {
  solidity: {
    version: '0.5.0',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
};
