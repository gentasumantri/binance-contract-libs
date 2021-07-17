const { BN, constants, expectEvent, expectRevert, balance, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS, MAX_UINT256 } = constants;

const { shouldBehaveLikeBEP20 } = require('./WBNB.behavior');

const BEP20WrapperMock = artifacts.require('WBNB');

contract('BEP20', function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;

  const name = 'Wrapped BNB';
  const symbol = 'WBNB';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await BEP20WrapperMock.new();
    this.gasPrice = new BN(await web3.eth.getGasPrice());
  });

  it('has a name', async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it('has a symbol', async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it('has 18 decimals', async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal('18');
  });

  describe('deposit', function () {
    const amount = ether('1');

    beforeEach(async function () {
      this.preBNBBalance = await balance.current(initialHolder);
      this.logs = await this.token.deposit({ from: initialHolder, value: amount });
    });

    it('emits a Deposit event', async function () {
      expectEvent(this.logs, 'Deposit', {
        dst: initialHolder,
        wad: amount,
      });
    });

    it('BNB Balance should decrement', async function () {
      const gasUsed = new BN(this.logs.receipt.cumulativeGasUsed);
      const gasTotal = gasUsed.mul(this.gasPrice);

      expect(await balance.current(initialHolder)).to.be.bignumber.equal(this.preBNBBalance.sub(gasTotal).sub(amount));
    });

    it('WBNB Balance should equal with amount', async function () {
      expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(amount);
    });

    it('totalSupply should equal with deposited amount', async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal(amount);
    });
  });

  describe('BEP20 behaviour', function () {
    const amount = ether('1');

    beforeEach(async function () {
      await this.token.deposit({ from: initialHolder, value: amount });
    });

    shouldBehaveLikeBEP20('BEP20', amount, initialHolder, recipient, anotherAccount);
  });
});
