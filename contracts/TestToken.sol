// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TesToken is ERC20 {

    mapping (address => uint256) public lastClaim; 

    constructor(string memory name, string memory symbol) 
        ERC20(name,symbol)
        {
             _mint(msg.sender, 1000000 ether);
        }

    function faucet(uint256 amount) external {
        
        require(block.timestamp > lastClaim[msg.sender] + 10 minutes, "Wait a bit!!");
        
        lastClaim[msg.sender] = block.timestamp;

        _mint(msg.sender, amount);
    }

}