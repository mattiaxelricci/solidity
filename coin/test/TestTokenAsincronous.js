const TestCoin = artifacts.require("../Token/GrindCoin.sol");

contract('2nd GrindCoin test', async (accounts) => {

  it("should put 1000000 GrindCoins in the first account", async () => {
     let instance = await TestCoin.deployed();
     let balance = await instance.balanceOf.call(accounts[0]);
     assert.equal(balance.valueOf(), 1000000);
  });


  it("should send GrindCoins correctly", async () => {

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


  it("should not be able to tranfer GrindCoins with insufficient balance", async () => {

    let account_four = accounts[4];


    let account_five = accounts[5];

    let amount = 1 ;

    let instance = await TestCoin.deployed();
    let test = instance;
    try{
      await test.transfer(account_four, amount, "", {from: account_five});
      assert.fail();
    }catch(err){
      assert.ok(/revert/.test(err.message));
    }
  });



  it("should approve 500 GrindCoins to the delegated balance", async () => {

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


  it("delegated address with allowance should not be able to transfer more than its allowance",async () => {

    let account_one = accounts[0];
    let account_two = accounts[1];
    let account_three = accounts[2];

    let amount_allowance = 100;
    let amount_requested = 200;

    let instance = await TestCoin.deployed();
    let test = instance;

    await test.approve(account_three, amount_allowance, {from: account_one});
    try{
    await test.transferFrom(account_one , account_two, amount_requested,"",{from: account_three});
    assert.fail();
    }catch(err){
      assert.ok(/revert/.test(err.message));
    }
});


it("delegated address with sufficent allowance should not be able to transfer more than current owner balance",async () => {

  let account_one = accounts[0];
  let account_two = accounts[1];
  let account_three = accounts[2];

  let amount_tranfer = 500000;
  let amount_allowance = 1000000;

  let instance = await TestCoin.deployed();
  let test = instance;

  await test.transfer(account_two, amount_tranfer,"",{from: account_one});
  await test.approve(account_three, amount_allowance, {from: account_one});
  try{
  await test.transferFrom(account_one , account_two, amount_allowance,"",{from: account_three});
  assert.fail();
  }catch(err){
    assert.ok(/revert/.test(err.message));
  }
  });
});
