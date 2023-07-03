import React, { Component } from 'react';
import Identicon from "identicon.js"; 
import logo from '../logo.png';

import "./Navbar.css"

const customStyles = {
  fontSize: '30px'
};

class Navbar extends Component {

  
render() {
    return (
        <nav id='background' className="navbar navbar-dark fixed-top flex-md-nowrap p-0">
          <img src={logo}  className="App-logo" alt="logo" />
        <a
          className="navbar-brand col-sm-3 col-md-8 mr-0"
          href="https://www.3-verse.io/allcoins"
          target="_blank"
          rel="noopener noreferrer"
          style={customStyles}
        >
          BLOCKCHAIN UNIVERSITY EXCHANGE
          </a>

        <ul className='navbar-nav px-3'>
         <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondry">
                <small id="account" style={{color: "white"}}>{this.props.account}</small>
                </small>
                { this.props.account
                ? <img
                className="ml-2"
                width='30'
                height='30'
                src={ ` data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                alt=""
                />
                : <span></span>
            }
            </li>
          </ul>
      </nav>
    );
  }
}

export default Navbar;
