const Token = artifacts.require("Token");
const CryptoExchange = artifacts.require("CryptoExchange");

module.exports = async function(deployer) {
    await deployer.deploy(Token);
   const token = await Token.deployed()

   await deployer.deploy(CryptoExchange, token.address);
  const cryptoExchange = await CryptoExchange.deployed()

  await token.transfer(cryptoExchange.address, '1000000000000000000000000')
};
