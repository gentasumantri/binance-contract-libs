// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../token/BEP20/BEP20.sol";

contract BEP20DecimalsMock is BEP20 {
  uint8 private _decimals;

  constructor(
    string memory name_,
    string memory symbol_,
    uint8 decimals_
  ) public BEP20(name_, symbol_) {
    _decimals = decimals_;
  }

  function decimals() public view returns (uint8) {
    return _decimals;
  }
}
