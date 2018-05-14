pragma solidity ^0.4.23;

import "../Utilities/SafeMath.sol";
import "../Utilities/Ownable.sol";
import "../Token/GrindCoin.sol";
import "./RefundVault.sol";


contract GrindCoinCrowdsale is Ownable{

  using SafeMath for uint256;

  GrindCoin public token ;

  RefundVault public walletVault;

  address public tokenWallet;

  uint256 public initialRate;
  uint256 public finalRate;

  uint256 public weiRaised;

  uint256 public goal;

  uint256 public openingTime;
  uint256 public closingTime;

  bool public isFinalized = false;

  mapping(address => uint256) public balances;



  modifier onlyWhileOpen {
      // solium-disable-next-line security/no-block-members
      require(block.timestamp >= openingTime && block.timestamp <= closingTime);
      _;
    }

  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

  event Finalized();



    constructor  (
      GrindCoin _token ,
      address _walletVault,
      address _tokenWallet,
      uint256 _initialRate,
      uint256 _finalRate,
      uint256 _goal,
      uint256 _openingTime,
      uint256 _closingTime)
      public {

        require(_openingTime >= block.timestamp);
        require(_closingTime >= _openingTime);
        require(_tokenWallet != address(0));
        require(_token.balanceOf(_tokenWallet)>0);
        require(_walletVault != address(0));
        require(_initialRate >= _finalRate);
        require(_finalRate > 0);
        require(_goal > 0);

        token = _token;
        walletVault =new RefundVault (_walletVault);
        tokenWallet = _tokenWallet;
        initialRate = _initialRate;
        finalRate = _finalRate;
        goal = _goal;
        openingTime = _openingTime;
        closingTime = _closingTime;

    }

    function () external payable {
      buyTokens(msg.sender);
    }

    function getCurrentRate() public view returns (uint256) {
      // solium-disable-next-line security/no-block-members
      uint256 elapsedTime = block.timestamp.sub(openingTime);
      uint256 timeRange = closingTime.sub(openingTime);
      uint256 rateRange = initialRate.sub(finalRate);
      return initialRate.sub(elapsedTime.mul(rateRange).div(timeRange));
    }

    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
      uint256 currentRate = getCurrentRate();
      return currentRate.mul(_weiAmount);
    }



  function buyTokens(address _beneficiary) public payable {
    // minimum contributions in wei (0.1 eth)
    require(msg.value>=100000000000000000 );

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

   _forwardFunds();

 }

 function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal onlyWhileOpen {
   require(_beneficiary != address(0));
  require(_weiAmount != 0);
 }

 function withdrawTokens() public {
   require(hasClosed());
   uint256 amount = balances[msg.sender];
   require(amount > 0);
   balances[msg.sender] = 0;
   _deliverTokens(msg.sender, amount);
 }

 function _processPurchase(address _beneficiary, uint256 _tokenAmount) internal {
   balances[_beneficiary] = balances[_beneficiary].add(_tokenAmount);

   }
   function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
    token.transferFrom(tokenWallet, _beneficiary, _tokenAmount);
  }
  function remainingTokens() public view returns (uint256) {
    return token.allowance(tokenWallet, this);
  }

  function _forwardFunds() internal {
    walletVault.deposit.value(msg.value)(msg.sender);
  }

  function hasClosed() public view returns (bool) {
     // solium-disable-next-line security/no-block-members
     return block.timestamp > closingTime;
   }

   function goalReached() public view returns (bool) {
      return weiRaised >= goal;
    }

    function claimRefund() public {
    require(isFinalized);
    require(!goalReached());

    walletVault.refund(msg.sender);
  }


      function finalize() public onlyOwner {
        require(!isFinalized);
        require(hasClosed());

        finalization();
        emit Finalized();

        isFinalized = true;
      }


      function finalization() internal {
          if (goalReached()) {
            walletVault.close();
          } else {
            walletVault.enableRefunds();
          }
        }




}
