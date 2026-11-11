// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Token de prueba con faucet limitado (solo testnet).
contract TesToken is ERC20 {
    uint256 public constant MAX_FAUCET_AMOUNT = 1_000 ether;
    uint256 public constant FAUCET_COOLDOWN = 10 minutes;

    mapping(address => uint256) public lastClaim;

    error FaucetAmountTooHigh();
    error FaucetCooldown(uint256 availableAt);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1_000_000 ether);
    }

    function faucet(uint256 amount) external {
        if (amount == 0 || amount > MAX_FAUCET_AMOUNT) revert FaucetAmountTooHigh();
        uint256 availableAt = lastClaim[msg.sender] + FAUCET_COOLDOWN;
        if (lastClaim[msg.sender] != 0 && block.timestamp < availableAt) {
            revert FaucetCooldown(availableAt);
        }
        lastClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, amount);
    }
}
