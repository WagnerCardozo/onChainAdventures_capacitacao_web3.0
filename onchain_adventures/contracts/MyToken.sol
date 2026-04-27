// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {

    uint256 public constant FAUCET_AMOUNT = 1000 * 1e18;
    uint256 public constant COOLDOWN = 60;

    mapping(address => uint256) public lastClaim;

    constructor() ERC20("GameToken", "GTK") {
        _mint(msg.sender, 1_000_000 * 1e18);
    }

    function claimTokens() external {
        require(
            block.timestamp >= lastClaim[msg.sender] + COOLDOWN,
            "Cooldown ativo"
        );

        lastClaim[msg.sender] = block.timestamp;

        _mint(msg.sender, FAUCET_AMOUNT);
    }
}