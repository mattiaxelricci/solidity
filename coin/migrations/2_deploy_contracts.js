var SafeMath = artifacts.require("../Utilities/SafeMath.sol");
var MyToken = artifacts.require("../Token/GrindCoin.sol");
var Addresses = artifacts.require("../Utilities/Addresses.sol");
var Crowdsale = artifacts.require("../Crowdsale/Crowdsale.sol"); /*changed*/



module.exports = function(deployer,accounts) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, MyToken);
  deployer.deploy(Addresses);
  deployer.link(Addresses, MyToken);
  deployer.deploy(MyToken).then(function(){
    return deployer.deploy(
      Crowdsale,
      MyToken.address,
      web3.eth.blockNumber,
      web3.eth.blockNumber+500000,
      web3.toWei(0.0001, 'ether'),
      web3.toWei(0.0002, 'ether'),
      100000
    ).then(function(){});
  });
};
