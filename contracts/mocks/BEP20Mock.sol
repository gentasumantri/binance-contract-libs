// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "../token/BEP20/BEP20.sol";

contract BEP20Mock is BEP20 {
  constructor(
    string memory name,
    string memory symbol,
    address initialAccount,
    uint256 initialBalance
  ) public payable BEP20(name, symbol) {
    _mint(initialAccount, initialBalance);
  }

  function mint(address account, uint256 amount) public {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) public {
    _burn(account, amount);
  }

  function transferInternal(
    address from,
    address to,
    uint256 value
  ) public {
    _transfer(from, to, value);
  }

  function approveInternal(
    address owner,
    address spender,
    uint256 value
  ) public {
    _approve(owner, spender, value);
  }
}
