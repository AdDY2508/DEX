const Token = artifacts.require("Token");
const CryptoExchange = artifacts.require("CryptoExchange");

require('chai')
    .use(require('chai-as-promised'))
    .should()

    function tokens(n) {
        return web3.utils.toWei(n,'ether');
    }
  
contract('CryptoExchange', ([deployer, investor]) => {
    let token, cryptoExchange

    before(async () => {
         token = await Token.new()
         cryptoExchange = await CryptoExchange.new(token.address)

        await token.transfer(cryptoExchange.address, tokens('1000000'))
    })

     describe('Token deployement', async() => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'Token')
        })
      })
    

     describe('CryptoExchange deployement', async() => {
    it('contract has a name', async () => {
        const name = await cryptoExchange.name()
        assert.equal(name, 'CryptoExchange Instant Exchange')
    })

    it('contract has a token', async () => {
        let balance = await token.balanceOf(cryptoExchange.address)
        assert.equal(balance.toString(), tokens('1000000'))
    })
     })

     describe('buyTokens()', async() => {
        let result

        before(async () => {
         result = await cryptoExchange.buyTokens({from: investor, value: web3.utils.toWei('1','ether')})
       })
        it('Allows user to instantly purchase tokens from cryptoExchange for a fixed price', async () => {
          let investorBalance = await token.balanceOf(investor)
          assert.equal(investorBalance.toString(), tokens('100'))

          let cryptoExchangeBalance
          cryptoExchangeBalance = await token.balanceOf(cryptoExchange.address)
          assert.equal(cryptoExchangeBalance.toString(), tokens('999900'))
          cryptoExchangeBalance = await web3.eth.getBalance(cryptoExchange.address)
          assert.equal(cryptoExchangeBalance.toString(), web3.utils.toWei('1','Ether'))

          const event = result.logs[0].args
          assert.equal(event.account, investor)
          assert.equal(event.token, token.address)
          assert.equal(event.amount.toString(), tokens('100').toString())
          assert.equal(event.rate.toString(),'100')
        })
     })


     describe('sellTokens()', async() => {
        let result

        before(async () => {
            await token.approve(cryptoExchange.address, tokens('100'), { from: investor  })
            result = await cryptoExchange.sellTokens(tokens('100'), {from: investor })
         
       })
        it('Allows user to instantly sell tokens to cryptoExchange for a fixed price', async () => {
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

          //Check cryptoExchange balance after purchae
          let cryptoExchangeBalance
          cryptoExchangeBalance = await token.balanceOf(cryptoExchange.address)
          assert.equal(cryptoExchangeBalance.toString(), tokens('1000000'))
          cryptoExchangeBalance = await web3.eth.getBalance(cryptoExchange.address)
          assert.equal(cryptoExchangeBalance.toString(), web3.utils.toWei('0','Ether'))

          //check logs to ensure event was emitted with data
          const event = result.logs[0].args
          assert.equal(event.account, investor)
          assert.equal(event.token, token.address)
          assert.equal(event.amount.toString(), tokens('100').toString())
          assert.equal(event.rate.toString(),'100')

          //failure: investor can't sell more tokens than they have
          await cryptoExchange.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })
     })
})