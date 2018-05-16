var SafeMath = artifacts.require("../Utilities/SafeMath.sol");
var MyToken = artifacts.require("../Token/GrindCoin.sol");
var Addresses = artifacts.require("../Utilities/Addresses.sol");
var Crowdsale = artifacts.require("../GrindCoinCrowdsale.sol");
var RefundVault = artifacts.require("../RefundVault.sol");


module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, MyToken);
  deployer.deploy(Addresses);
  deployer.link(Addresses, MyToken);
  deployer.deploy(MyToken).then(function(){
    return deployer.deploy(
      Crowdsale,
      MyToken,
      MyToken.address,
      MyToken.address,
      0.00000000000001,
      0.000000000000005,
      50000000000000000000,
      web3.eth.blockNumber+70,
      web3.eth.blockNumber+10000
    ).then(function(){});
  });
};
