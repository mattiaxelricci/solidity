pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "../contracts/Token/GrindCoin.sol";

contract TestMyToken {

  GrindCoin private _myToken;
  address private _owner;

  constructor() public {
    _owner = msg.sender;
  }

  function beforeEach() public {
    _myToken = new GrindCoin();
  }

  function test_constructor() public {
    uint allocatedTokens = _myToken.balanceOf(this);
    Assert.equal(allocatedTokens, 1000000, "Contract creator should hold 1000000 tokens");
  }

  function test_transfer_withValidAmount() public {
    _myToken.transfer(_owner, 100);
    uint transferredTokens = _myToken.balanceOf(_owner);
    uint allocatedTokens = _myToken.balanceOf(this);
    Assert.equal(transferredTokens, 100, "Recipient should hold 100 tokens");
    Assert.equal(allocatedTokens, 999900, "Contract creator should hold 999900 tokens");
  }

  function test_totalSupply() public {
    uint totalSupply = _myToken.totalSupply();
    Assert.equal(totalSupply, 1000000, "There should be 1000000 tokens in circulation");
  }
  function test_approve_withValidAmount() public {
  bool allocationSuccessful = _myToken.approve(_owner, 100);
  Assert.equal(allocationSuccessful, true, "Token owner should be able to allocate less than or equal to their holdings");
  }


  function test_allowance_withNoAllowedBalance() public {
    uint allowanceBalance = _myToken.allowance(_owner, this);
    Assert.equal(allowanceBalance, 0, "Spender should not be able to spend un-allowed token of the owner");
  }


}
