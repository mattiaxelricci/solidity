pragma solidity ^0.4.23;

interface ERC223 {
    function transfer(address _to, uint _value, bytes _data) public returns (bool);
    event Transfer(address indexed _from, address indexed _to, uint _value, bytes _data);
}
