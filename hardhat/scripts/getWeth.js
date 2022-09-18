const { getNamedAccounts, ethers } = require("hardhat");

const AMOUNT = ethers.utils.parseEther("0.02")

const getWeth = async () => {
    const {deployer} = await getNamedAccounts();
    //DEPOSIT FUNCTION IN CONTRACT
    //address: 0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6
    const iWeth = await ethers.getContractAt("IWeth","0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", deployer);
    const tx = await iWeth.deposit({value: AMOUNT});
    await tx.wait(1);
    const wethBalance = await iWeth.balanceOf(deployer);
    console.log(`Balance WETH: ${ethers.utils.formatEther(wethBalance.toString())}`);
}

module.exports = { getWeth, AMOUNT };