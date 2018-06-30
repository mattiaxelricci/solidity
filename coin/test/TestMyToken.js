
var MyToken = artifacts.require("../Token/GrindCoin.sol");

contract('MyToken', (accounts) => {
 var creatorAddress = accounts[0];
 var recipientAddress = accounts[1];
 var delegatedAddress = accounts[2];

 it("should contain 1000000 GrindCoin in circulation", () => {
   return MyToken.deployed().then((instance) => {
     return instance.totalSupply.call();
   }).then(balance => {
     assert.equal(balance.valueOf(), 1000000, "1000000 GrindCoins are NOT in circulation");
   });
 });


 it("should contain 1000000 MyToken in the creator balance", () => {
    return MyToken.deployed().then(instance => {
      return instance.balanceOf.call(creatorAddress);
    }).then(balance => {
      assert.equal(balance.valueOf(), 1000000, "1000000 wasn't in the creator balance");
    });
  });

  it("should burn 10000 GrindCoins", () => {
    var myTokenInstance;
    return MyToken.deployed().then((instance) => {
      myTokenInstance = instance;
      return myTokenInstance.burn(10000, {from:creatorAddress});
    }).then(result => {
      return myTokenInstance.totalSupply.call();
    }).then(balance => {
     assert.equal(balance.valueOf(), 990000, "Should have burned 10000 GrindCoins in the creator's address");
   });

  });

});
