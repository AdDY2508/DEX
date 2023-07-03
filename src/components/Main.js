import React, { Component } from 'react';
import BuyForm from './BuyForm'
import SellForm from './SellForm';

const customStyles = {
  marginTop: '100px'
};

class Main extends Component {
  constructor(props){
   super(props)
   this.state = {
   currentForm: 'buy'
  }
  }
  render() {

      let content
      if(this.state.currentForm === 'buy') {
        content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
        />
      } else {
        content = <SellForm 
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
        />
        }

    return (
      <div id="content" style={customStyles}>

         <div className="d-flex justify-content-between mb-3" >
          <button className="btn btn-primary"
             onClick={(event) => {
            this.setState({ currentForm: 'buy'})
          }}
          >
            Buy
            </button>
            
            <button
              className="btn btn-danger"
                 onClick={(event) => {
            this.setState({ currentForm: 'sell'})
            }}
            >
            Sell
            </button>
            </div>
         
         <div className="card mb-4"  >
        
        <div id='exchange-box' className="card-body bg-transparent ">
        
        {content}

        </div>

       </div>

     </div>
    );
  } 
  
}

export default Main;
