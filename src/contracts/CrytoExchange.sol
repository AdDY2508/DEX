// SPDX-License_Identifier: MIT
pragma solidity >=0.4.21 <0.8.19;

import "./Token.sol";

contract CryptoExchange {
   string public name = "CryptoExchange Instant Exchange";
    Token public token;
    uint public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token;
    }
    function buyTokens() public payable {
        //calculate the no. of tokens to buy
    uint tokenAmount = msg.value * rate;

    //Require that CryptoExchange has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    //Transfer tokens to users
    token.transfer(msg.sender,tokenAmount);

    //Emit an event
    emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);

    }
    function sellTokens(uint _amount) public {
        //User can't sell done more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);


        //calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        //Require that cryptoExhange has enough Ether
        require(address(this).balance >= etherAmount);

        //Perform sale
        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);
        //Emit an event
        emit TokenSold(msg.sender, address(token), _amount, rate);
        
    }
} 
