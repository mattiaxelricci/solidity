pragma solidity ^0.4.4;

contract ERC223ReceivingContract {
    function tokenFallback(address _from, uint _value, bytes _data) public;
}
