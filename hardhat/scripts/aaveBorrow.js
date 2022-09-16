const { getWeth } = require("../scripts/getWeth");

const main = async() => {
    //Convert ETH in WETH
    await getWeth();

}

main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.log(error);
        process.exit(1);
      })