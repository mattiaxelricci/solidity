pragma solidity ^0.4.4;

interface ERC223 {
    function transfer(address _to, uint _value, bytes _data) public returns (bool);
    event Transfer(address indexed _from, address indexed _to, uint _value, bytes indexed _data);
}
