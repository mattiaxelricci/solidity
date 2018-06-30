var Crowdsale = artifacts.require("../Crowdsale/Crowdsale.sol");
var MyToken = artifacts.require("../Token/GrindCoin.sol");

contract('Crowdsale', (accounts) => {

  var creatorAddress = accounts[0];
  var recipientAddress = accounts[1];

  var crowdsaleAddress;
  Crowdsale.deployed().then(instance => {
    crowdsaleAddress = instance.address;
  });

  var myTokenAddress;
  MyToken.deployed().then(instance => {
    myTokenAddress = instance.address;
  });

  it("should transfer 100000 MyToken to the crowdsale balance", () => {
    var myTokenInstance;
    return MyToken.deployed().then(instance => {
      myTokenInstance = instance;
      return myTokenInstance.transfer(crowdsaleAddress, 100000,"", {from: creatorAddress});
    }).then(result => {
      return myTokenInstance.balanceOf.call(crowdsaleAddress);
    }).then(crowdsaleBalance => {
      assert.equal(crowdsaleBalance.valueOf(), 100000, "1000 wasn't in the crowdsale balance");
    });
  });

  it("should have a crowdsale balance of 100000", () => {
    return Crowdsale.deployed().then(instance => {
      return instance.availableBalance.call();
    }).then(availableBalance => {
      assert.equal(availableBalance.valueOf(), 100000, "100000 wasn't the available crowdsale balance");
    });
  });

  it("should transfer 999 token to the creator address", () => {
    var crowdsaleInstance;
    return Crowdsale.deployed().then(instance => {
      crowdsaleInstance = instance;
      return crowdsaleInstance.buy({from: creatorAddress, value: web3.toWei(0.1, 'ether')});
    }).then(result => {
      return crowdsaleInstance.availableBalance.call();
    }).then(availableBalance => {
      assert.equal(availableBalance.valueOf(), 99001, "99001 wasn't the available crowdsale balance");
    });
  });

  it("should contain 900999 MyToken in the creator balance", () => {
    return MyToken.deployed().then(instance => {
      return instance.balanceOf.call(creatorAddress);
    }).then(balance => {
      assert.equal(balance.valueOf(), 900999, "900999 wasn't in the creator balance");
    });
  });

  it("should transfer 1 token to the recipient address", () => {
    var crowdsaleInstance;
    return Crowdsale.deployed().then(instance => {
      crowdsaleInstance = instance;
      return crowdsaleInstance.buyFor(recipientAddress, {from: creatorAddress, value: web3.toWei(0.1, 'ether')});
    }).then(result => {
      return crowdsaleInstance.availableBalance.call();
    }).then(availableBalance => {
      assert.equal(availableBalance.valueOf(), 98002, "98002 wasn't the available crowdsale balance");
    });
  });

  it("should contain 999 MyToken in the recipient balance", () => {
    return MyToken.deployed().then(instance => {
      return instance.balanceOf.call(recipientAddress);
    }).then(balance => {
      assert.equal(balance.valueOf(), 999, "999 wasn't in the recipient balance");
    });
  });
});
