const { expect } = require('chai');
const { balance, ether, expectEvent } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeBEP20 } = require('./WBNB.behavior');

const WBNB = artifacts.require('WBNB');

contract('WBNB', function (accounts) {
  const [owner, user, recipient, anotherAccount] = accounts;

  const name = 'Wrapped BNB';
  const symbol = 'WBNB';

  const depositAmount = ether('1');

  beforeEach(async function () {
    this.token = await WBNB.new({ from: owner });
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

  describe('deposit BNB', function () {
    function shouldDeposit(depositer, amountBNB, transaction) {
      beforeEach(async function () {
        this.depositerBalance = await balance.current(depositer);
        this.logs = await transaction.call(this);
        // this.logs = await this.token.deposit({ from: depositer, value: amount, gasPrice: 0 });
      });

      it('emits a Deposit event', async function () {
        expectEvent(this.logs, 'Deposit', {
          dst: depositer,
          wad: amountBNB,
        });
      });

      it('depositer BNB Balance should decrement', async function () {
        const currentBalance = await balance.current(depositer);
        expect(currentBalance).to.be.bignumber.equal(this.depositerBalance.sub(amountBNB));
      });

      it('contract BNB balance should increment', async function () {
        expect(await balance.current(this.token.address)).to.be.bignumber.equal(amountBNB);
      });

      it('depositer WBNB Balance should increment', async function () {
        expect(await this.token.balanceOf(depositer)).to.be.bignumber.equal(amountBNB);
      });

      it('totalSupply should equal with deposited amount', async function () {
        expect(await this.token.totalSupply()).to.be.bignumber.equal(amountBNB);
      });
    }

    describe('high-level', function () {
      const amount = depositAmount;

      shouldDeposit(user, amount, function () {
        return this.token.deposit({ from: user, value: amount, gasPrice: 0 });
      });
    });

    describe('low-level', function () {
      const amount = ether('1');

      shouldDeposit(user, amount, function () {
        return this.token.send(amount, { from: user, gasPrice: 0 });
      });
    });
  });

  describe('withdraw', function () {
    const amount = ether('1');
    const withdrawer = user;

    beforeEach(async function () {
      await this.token.deposit({ from: withdrawer, value: amount, gasPrice: 0 });
      this.depositerBalance = await balance.current(withdrawer);
      this.logs = await this.token.withdraw(amount, { from: withdrawer, gasPrice: 0 });
    });

    it('emits a Withdrawal event', async function () {
      expectEvent(this.logs, 'Withdrawal', {
        src: withdrawer,
        wad: amount,
      });
    });

    it('withdrawer BNB Balance should increment', async function () {
      expect(await balance.current(withdrawer)).to.be.bignumber.equal(this.depositerBalance.add(amount));
    });

    it('contract BNB Balance should zero', async function () {
      expect(await balance.current(this.token.address)).to.be.bignumber.equal('0');
    });

    it('user WBNB Balance should zero', async function () {
      expect(await this.token.balanceOf(withdrawer)).to.be.bignumber.equal('0');
    });

    it('totalSupply should zero', async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal('0');
    });
  });

  describe('BEP20 behaviour', function () {
    const amount = ether('1');

    beforeEach(async function () {
      await this.token.deposit({ from: user, value: amount });
    });

    shouldBehaveLikeBEP20('BEP20', amount, user, recipient, anotherAccount);
  });
});
