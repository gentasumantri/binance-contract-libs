const { BN, expectEvent, balance, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const { shouldBehaveLikeBEP20 } = require('./WBNB.behavior');

const WBNB = artifacts.require('WBNB');

contract('WBNB', function (accounts) {
  const [initialHolder, recipient, anotherAccount] = accounts;

  const name = 'Wrapped BNB';
  const symbol = 'WBNB';

  beforeEach(async function () {
    this.token = await WBNB.new();
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
    describe('high-level', function () {
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

        expect(await balance.current(initialHolder)).to.be.bignumber.equal(
          this.preBNBBalance.sub(gasTotal).sub(amount),
        );
      });

      it('WBNB Balance should equal with amount', async function () {
        expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(amount);
      });

      it('totalSupply should equal with deposited amount', async function () {
        expect(await this.token.totalSupply()).to.be.bignumber.equal(amount);
      });
    });

    describe('low-level', function () {
      const amount = ether('1');

      beforeEach(async function () {
        this.preBNBBalance = await balance.current(initialHolder);
        this.logs = await this.token.send(amount, { from: initialHolder });
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

        expect(await balance.current(initialHolder)).to.be.bignumber.equal(
          this.preBNBBalance.sub(gasTotal).sub(amount),
        );
      });

      it('WBNB Balance should equal with amount', async function () {
        expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(amount);
      });

      it('totalSupply should equal with deposited amount', async function () {
        expect(await this.token.totalSupply()).to.be.bignumber.equal(amount);
      });
    });
  });

  describe('withdraw', function () {
    const amount = ether('1');

    beforeEach(async function () {
      await this.token.deposit({ from: initialHolder, value: amount });
      expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(amount);
      expect(await this.token.totalSupply()).to.be.bignumber.equal(amount);
      this.preBNBBalance = await balance.current(initialHolder);
      this.logs = await this.token.withdraw(amount, { from: initialHolder });
    });

    it('emits a Withdrawal event', async function () {
      expectEvent(this.logs, 'Withdrawal', {
        src: initialHolder,
        wad: amount,
      });
    });

    it('BNB Balance should increment', async function () {
      const gasUsed = new BN(this.logs.receipt.cumulativeGasUsed);
      const gasTotal = gasUsed.mul(this.gasPrice);

      expect(await balance.current(initialHolder)).to.be.bignumber.equal(this.preBNBBalance.sub(gasTotal).add(amount));
    });

    it('WBNB Balance should zero', async function () {
      expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal('0');
    });

    it('totalSupply should equal zero', async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal('0');
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