

pragma solidity ^0.4.23;

import "../Utilities/SafeMath.sol";

import "../Token/GrindCoin.sol";


contract CrowdsaleBasic {
  using SafeMath for uint256;

  // The token being sold
  GrindCoin public grindcoin;

  // Address where funds are collected
  address public ethWallet;

  // How many token units a buyer gets per wei
  uint256 public rate;

  // Amount of wei raised
  uint256 public weiRaised;



  event TokenPurchase(
    address indexed purchaser,
    address indexed beneficiary,
    uint256 value,
    uint256 amount
  );


  constructor(GrindCoin _grindcoin, address _ethWallet, uint256 _rate) public {
    require(_rate > 0);
    require(_ethWallet != address(0));
    require(_grindcoin != address(0));

    rate = _rate;
    ethWallet = _ethWallet;
    grindcoin = _grindcoin;
    weiRaised = 0;
  }

  // -----------------------------------------
  // Crowdsale external interface
  // -----------------------------------------

  /**
   * @dev fallback function ***DO NOT OVERRIDE***
   */
 function () external payable {
    buyTokens(msg.sender);
  }

  function getWeiRaisedToDate() public view returns (uint){
    return weiRaised;
  }


 function buyTokens(address _beneficiary) public payable {

    uint256 weiAmount = msg.value;
    _preValidatePurchase(_beneficiary, weiAmount);

    // calculate token amount to be created
    uint256 tokens = _getTokenAmount(weiAmount);

    // update state
    weiRaised = weiRaised.add(weiAmount);

    _processPurchase(_beneficiary, tokens);
    emit TokenPurchase(
      msg.sender,
      _beneficiary,
      weiAmount,
      tokens
    );

    _updatePurchasingState(_beneficiary, weiAmount);

    _forwardFunds();
    _postValidatePurchase(_beneficiary, weiAmount);
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------


  function _preValidatePurchase(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal
  {
    require(_beneficiary != address(0));
    require(_weiAmount != 0);
  }


 function _postValidatePurchase(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal
  {
    // optional override
  }


  function _deliverTokens(
    address _beneficiary,
    uint256 _tokenAmount
  )
    internal
  {
    grindcoin.transfer(_beneficiary, _tokenAmount);
  }


  function _processPurchase(
    address _beneficiary,
    uint256 _tokenAmount
  )
    internal
  {
    _deliverTokens(_beneficiary, _tokenAmount);
  }


  function _updatePurchasingState(
    address _beneficiary,
    uint256 _weiAmount
  )
    internal
  {
    // optional override
  }


  function _getTokenAmount(uint256 _weiAmount)
    internal view returns (uint256)
  {
    return _weiAmount.mul(rate);
  }


  function _forwardFunds() internal {
    ethWallet.transfer(msg.value);
  }
}
