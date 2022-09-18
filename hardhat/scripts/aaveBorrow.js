const { getWeth, AMOUNT } = require("../scripts/getWeth");
const { getNamedAccounts, ethers } = require("hardhat");

const main = async() => {
    //Convert ETH in WETH
    await getWeth();
    const { deployer } = await getNamedAccounts();

    //Get Lending Pool Address by iLendingPoolAddressesProvider
    //Address: 0xb53c1a33016b2dc2ff3653530bff1848a515c8c5
    const lendingPool = await getLendingPool(deployer);
    console.log(`Lending pool address: ${lendingPool.address}`);

    //Deposit some WETH in the Lending Pool
    const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    //we need to approve
    await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);

    console.log("Depositing...");
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited!")

    //BORROW SECTION
    //fetch user data in Lending Pool
    let {totalDebtETH, availableBorrowsETH} = await getBorrowUserdata(lendingPool, deployer);

    //Convert availableBorrowsETH to DAI price
    const daiPrice = await getDaiPrice();
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1/daiPrice.toNumber())
    console.log(`You can borrow ${amountDaiToBorrow} DAI`);
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString());

    //Borrow!
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    await borrowDAI(daiAddress, lendingPool, amountDaiToBorrowWei, deployer);

    //Repay
    await getBorrowUserdata(lendingPool, deployer);
    await repay(daiAddress, amountDaiToBorrowWei, lendingPool, deployer);
    await getBorrowUserdata(lendingPool, deployer);
}

const repay = async(daiAddress, amount, lendingPool, account) => {
  await approveERC20(daiAddress, lendingPool.address, amount, account);
  const repayTx = await lendingPool.repay(daiAddress, amount, 1, account);
  await repayTx.wait(1);
  console.log(`Repayed!`)
}

const borrowDAI = async (daiAddress, lendingPool, amountDaiToBorrowWei, account) => {
  const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrowWei, 1, 0, account);
  await borrowTx.wait(1);
  console.log(`Borrowed!`);
  //(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)
}

const getDaiPrice = async() => {
  const IAggregatorV3Interface = await ethers.getContractAt(
    "AggregatorV3Interface"
    ,"0x773616E4d11A78F511299002da57A0a94577F1f4"
  );

  const price = await IAggregatorV3Interface.latestRoundData();
  console.log(`The price is: ${price.answer.toString()}`);
  return price.answer;
}

const getBorrowUserdata = async (lendingPool, account) => {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH} = await lendingPool.getUserAccountData(account);
    console.log(`You have ${ethers.utils.formatEther(totalCollateralETH)} collateral`);
    console.log(`You have ${ethers.utils.formatEther(totalDebtETH)} debt`);
    console.log(`You can borrow ${ethers.utils.formatEther(availableBorrowsETH)} worth of ETH`);
    return { totalDebtETH, availableBorrowsETH};
}

const getLendingPool = async(account) =>{
  const iLendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider"
    ,"0xb53c1a33016b2dc2ff3653530bff1848a515c8c5"
    ,account
  );

  const lendingPoolAddress = await iLendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool"
    ,lendingPoolAddress
    ,account
  );
  return lendingPool;
} 

const approveERC20 = async(ERC20address, spenderAddress, amount, account) => {
  const erc20Token = await ethers.getContractAt("IERC20",ERC20address, account);

  const tx = await erc20Token.approve(spenderAddress, amount);
  await tx.wait(1);
  console.log("Approved!");
}

main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.log(error);
        process.exit(1);
      })