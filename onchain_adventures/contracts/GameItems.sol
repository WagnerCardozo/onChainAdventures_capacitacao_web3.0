// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameItems is ERC1155, Ownable {

    mapping(address => bool) public minters;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
    }

    function mint(address to, uint256 id, uint256 amount) external {
        require(minters[msg.sender], "Not allowed");
        _mint(to, id, amount, "");
    }
}