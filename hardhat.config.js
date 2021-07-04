require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: {
    version: '0.4.18',
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: './build',
  },
};
