// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Shop {

    IERC20 public token;
    address public items;

    mapping(uint256 => uint256) public prices;

    constructor(address _token, address _items) {
        token = IERC20(_token);
        items = _items;

        prices[1] = 100;
        prices[2] = 50;
    }

    function buy(uint256 id, uint256 amount) external {
        uint256 cost = prices[id] * amount;

        require(cost > 0, "Invalid item");

        require(
            token.transferFrom(msg.sender, address(this), cost),
            "Payment failed"
        );

        (bool success, ) = items.call(
            abi.encodeWithSignature(
                "mint(address,uint256,uint256)",
                msg.sender,
                id,
                amount
            )
        );

        require(success, "Mint failed");
    }
}