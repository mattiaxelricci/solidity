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

  

});
