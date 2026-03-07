// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20Mock is ERC20 {
    constructor(string memory name, string memory symbol, address initialAccount, uint initialBalance) ERC20(name,symbol) {
        _mint(initialAccount, initialBalance);
    }

    function mint(address to, uint amount) external {
        _mint(to, amount);
        
    } 
}