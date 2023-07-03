import React, { Component } from 'react';
import Web3 from 'web3'; 
import Token from '../abis/Token.json'
import CryptoExchange from '../abis/CryptoExchange.json'
// import logo from '../logo.png';
import Navbar from './Navbar'
import Main from './Main'
import './App.css';

class App extends Component {

   async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }


  async loadBlockchainData() {
    const web3 = window.web3
  

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })


    
    //Load Token
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) { 
    const token = new web3.eth.Contract(Token.abi, tokenData.address)
   this.setState({ token })
   let tokenBalance = await token.methods.balanceOf(this.state.account).call()
   this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    //Load CryptoExchange
    
    const cryptoExchangeData = CryptoExchange.networks[networkId]
    if(cryptoExchangeData) { 
    const cryptoExchange = new web3.eth.Contract(CryptoExchange.abi, cryptoExchangeData.address)
    this.setState({ cryptoExchange })
    } else {
      window.alert('CryptoExchange contract not deployed to detected network.')
    }

   this.setState({ loading: false })
  }
   async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non_Ethereum browser detected. You should consider trying Metamask!')
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true})
    this.state.cryptoExchange.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
    this.setState({ loading: false }) 
   })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })

       this.state.token.methods.approve(this.state.cryptoExchange.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.state.cryptoExchange.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }
  



      constructor(props) {
      super(props)
      this.state = {
      account: '',
      token: {},
      cryptoExchange: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
     }
   }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-centre">Loading..</p>
    }else {
     content = <Main 
      ethBalance={this.state.ethBalance} 
      tokenBalance={this.state.tokenBalance}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px', }}>
              <div className="content mr-auto ml-auto">
             
                
                {content}

                <a
                  className="App-link"
                  href="https://3university.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ position: 'relative', top: '-500px', left: '500px' }}
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
                <div className='innovate' >"Experience the future of trading with decentralized exchange"</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
