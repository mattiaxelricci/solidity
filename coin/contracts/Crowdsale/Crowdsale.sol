pragma solidity ^0.4.23;

import "../Token/ERC223ReceivingContract.sol";
import "../Utilities/SafeMath.sol";
import "../Utilities/Ownable.sol";
import "../Token/GrindCoin.sol";
import "../Token/Token.sol";

contract Crowdsale is ERC223ReceivingContract {

  using SafeMath for uint;

  Token private _token;

  uint private _start;
  uint private _end;

  uint private _priceStart;
  uint private _priceEnd;


  uint private _limit;
  uint private _available;

  mapping (address => uint) private _limits;

  event Buy(address beneficiary, uint amount);

  modifier available() {
    require(_available > 0);
    require(block.number >= _start && block.number < _end);
    _;
  }

  modifier isToken() {
    require(msg.sender == address(_token));
    _;
  }

    modifier valid(address to, uint amount) {
    assert(amount > 0);
    amount = amount.div(getCurrentPrice());
    assert(_limit >= amount);
    assert(_limit >= _limits[to].add(amount));
    _;
  }

  constructor(address token, uint start, uint end, uint priceStart,uint priceEnd, uint limit)
      public {
      _token = Token(token);
      _start = start;
      _end = end;
      _priceStart = priceStart;
      _priceEnd = priceEnd;
      _limit = limit;
  }

  function getCurrentPrice() public view returns (uint256) {

  uint256 elapsedTime = block.number.sub(_start);
  uint256 timeRange = _end.sub(_start);
  uint256 rateRange = _priceEnd.sub(_priceStart);
  return _priceStart.add(elapsedTime.mul(rateRange).div(timeRange));
}
function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
  uint256 currentPrice = getCurrentPrice();
  return _weiAmount.div(currentPrice);
}


  function ()
      public
      payable {
      // Not enough gas for the transaction so prevent users from sending ether
      revert();
  }

  function buy()
      public
      payable {
      return buyFor(msg.sender);
  }

  function buyFor(address beneficiary)
      public
      available
      valid(beneficiary, msg.value)
      payable {

      uint amount = _getTokenAmount(msg.value);


      _token.transfer(beneficiary, amount);
      _available = _available.sub(amount);
      _limits[beneficiary] = _limits[beneficiary].add(amount);
      emit Buy(beneficiary, amount);
  }

  function tokenFallback(address, uint _value, bytes)
      isToken
      public {
      _available = _available.add(_value);
  }

  function availableBalance()
    view
    public
    returns (uint) {
    return _available;
  }
}
