require('@nomiclabs/hardhat-waffle');

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
