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

   it("should burn 10000 GrindCoin", () => {
     var myTokenInstance;
     return MyToken.deployed().then((instance) => {
       myTokenInstance = instance;
       return myTokenInstance.burn(10000,{from:creatorAddress});
     }).then(result => {
       return myTokenInstance.totalSupply.call();
     }).then(balance => {
      assert.equal(balance.valueOf(), 990000, "100000 wasn't in the creator balance");
    });

   });


/*
   it("should send coin correctly", function() {
       var meta;

       //    Get initial balances of first and second account.
       var account_one = accounts[0];
       var account_two = accounts[1];

       var account_one_starting_balance;
       var account_two_starting_balance;
       var account_one_ending_balance;
       var account_two_ending_balance;

       var amount = 10;

       return MyToken.deployed().then(function(instance) {
         MyToken = instance;
         return MyToken.balanceOf.call(account_one);
       }).then(function(balance) {
         account_one_starting_balance = balance.toNumber();
         return MyToken.balanceOf.call(account_two);
       }).then(function(balance) {
         account_two_starting_balance = balance.toNumber();
         return MyToken.transfer(account_two, amount,{from: account_one});
       }).then(function() {
         return MyToken.balanceOf.call(account_one);
       }).then(function(balance) {
         account_one_ending_balance = balance.toNumber();
         return MyToken.balanceOf.call(account_two);
       }).then(function(balance) {
         account_two_ending_balance = balance.toNumber();

         assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
         assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
       });

});*/







});
