var SafeMath = artifacts.require("../Utilities/SafeMath.sol");
var MyToken = artifacts.require("../Token/GrindCoin.sol");
var Addresses = artifacts.require("../Utilities/Addresses.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, MyToken);
  deployer.deploy(Addresses);
  deployer.link(Addresses, MyToken);
  deployer.deploy(MyToken);
};
