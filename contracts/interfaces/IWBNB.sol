pragma solidity ^0.4.18;

interface IWBNB {
  function deposit() public payable;

  function transfer(address to, uint256 value) public returns (bool);

  function withdraw(uint256) public;
}
