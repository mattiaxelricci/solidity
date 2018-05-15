const TestCoin = artifacts.require("../Token/GrindCoin.sol");

contract('2nd GrindCoin test', async (accounts) => {

  it("should put 1000000 GrindCoins in the first account", async () => {
     let instance = await TestCoin.deployed();
     let balance = await instance.balanceOf.call(accounts[0]);
     assert.equal(balance.valueOf(), 1000000);
  })


  it("should send coin correctly", async () => {

    // Get initial balances of first and second account.
    let account_one = accounts[0];

    let account_two = accounts[1];

    let amount = 10;


    let instance = await TestCoin.deployed();
    let test = instance;

    let balance = await test.balanceOf.call(account_one);
    let account_one_starting_balance = balance.toNumber();

    balance = await test.balanceOf.call(account_two);
    let account_two_starting_balance = balance.toNumber();
    await test.transfer(account_two, amount, "", {from: account_one});

    balance = await test.balanceOf.call(account_one);
    let account_one_ending_balance = balance.toNumber();

    balance = await test.balanceOf.call(account_two);
    let account_two_ending_balance = balance.toNumber();

    assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
  });


  it("should approve 500 MyToken to the delegated balance", async () => {

    let account_one = accounts[0];
    let account_two = accounts[1];

    let amount = 500

    let instance = await TestCoin.deployed();
    let test = instance;

    await test.approve(account_two, amount,{from: account_one});

    allowanceValue = await test.allowance.call(account_one,account_two);
    let _allowanceValue = allowanceValue.toNumber();
    assert.equal(_allowanceValue,amount,"Amount wasn't approved to the delegated balance");
  });

it("should transfer 200 MyToken from the creator to the alt recipient via the delegated address",async () => {

  let account_one = accounts[0];
  let account_two = accounts[1];

  let amount = 500

  let instance = await TestCoin.deployed();
  let test = instance;









});
