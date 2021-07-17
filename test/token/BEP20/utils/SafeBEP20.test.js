const { expectRevert } = require('@openzeppelin/test-helpers');

const BEP20ReturnFalseMock = artifacts.require('BEP20ReturnFalseMock');
const BEP20ReturnTrueMock = artifacts.require('BEP20ReturnTrueMock');
const BEP20NoReturnMock = artifacts.require('BEP20NoReturnMock');
const SafeBEP20Wrapper = artifacts.require('SafeBEP20Wrapper');

contract('SafeBEP20', function (accounts) {
  const [hasNoCode] = accounts;

  describe('with address that has no contract code', function () {
    beforeEach(async function () {
      this.wrapper = await SafeBEP20Wrapper.new(hasNoCode);
    });

    shouldRevertOnAllCalls('Address: call to non-contract');
  });

  describe('with token that returns false on all calls', function () {
    beforeEach(async function () {
      this.wrapper = await SafeBEP20Wrapper.new((await BEP20ReturnFalseMock.new()).address);
    });

    shouldRevertOnAllCalls('SafeBEP20: BEP20 operation did not succeed');
  });

  describe('with token that returns true on all calls', function () {
    beforeEach(async function () {
      this.wrapper = await SafeBEP20Wrapper.new((await BEP20ReturnTrueMock.new()).address);
    });

    shouldOnlyRevertOnErrors();
  });

  describe('with token that returns no boolean values', function () {
    beforeEach(async function () {
      this.wrapper = await SafeBEP20Wrapper.new((await BEP20NoReturnMock.new()).address);
    });

    shouldOnlyRevertOnErrors();
  });
});

function shouldRevertOnAllCalls(reason) {
  it('reverts on transfer', async function () {
    await expectRevert(this.wrapper.transfer(), reason);
  });

  it('reverts on transferFrom', async function () {
    await expectRevert(this.wrapper.transferFrom(), reason);
  });

  it('reverts on approve', async function () {
    await expectRevert(this.wrapper.approve(0), reason);
  });

  it('reverts on increaseAllowance', async function () {
    // [TODO] make sure it's reverting for the right reason
    await expectRevert.unspecified(this.wrapper.increaseAllowance(0));
  });

  it('reverts on decreaseAllowance', async function () {
    // [TODO] make sure it's reverting for the right reason
    await expectRevert.unspecified(this.wrapper.decreaseAllowance(0));
  });
}

function shouldOnlyRevertOnErrors() {
  it('does not revert on transfer', async function () {
    await this.wrapper.transfer();
  });

  it('does not revert on transferFrom', async function () {
    await this.wrapper.transferFrom();
  });

  describe('approvals', function () {
    context('with zero allowance', function () {
      beforeEach(async function () {
        await this.wrapper.setAllowance(0);
      });

      it('does not revert when approving a non-zero allowance', async function () {
        await this.wrapper.approve(100);
      });

      it('does not revert when approving a zero allowance', async function () {
        await this.wrapper.approve(0);
      });

      it('does not revert when increasing the allowance', async function () {
        await this.wrapper.increaseAllowance(10);
      });

      it('reverts when decreasing the allowance', async function () {
        await expectRevert(this.wrapper.decreaseAllowance(10), 'SafeBEP20: decreased allowance below zero');
      });
    });

    context('with non-zero allowance', function () {
      beforeEach(async function () {
        await this.wrapper.setAllowance(100);
      });

      it('reverts when approving a non-zero allowance', async function () {
        await expectRevert(this.wrapper.approve(20), 'SafeBEP20: approve from non-zero to non-zero allowance');
      });

      it('does not revert when approving a zero allowance', async function () {
        await this.wrapper.approve(0);
      });

      it('does not revert when increasing the allowance', async function () {
        await this.wrapper.increaseAllowance(10);
      });

      it('does not revert when decreasing the allowance to a positive value', async function () {
        await this.wrapper.decreaseAllowance(50);
      });

      it('reverts when decreasing the allowance to a negative value', async function () {
        await expectRevert(this.wrapper.decreaseAllowance(200), 'SafeBEP20: decreased allowance below zero');
      });
    });
  });
}
