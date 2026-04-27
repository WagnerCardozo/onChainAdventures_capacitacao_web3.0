// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking is ReentrancyGuard {

    IERC20 public token;
    address public oracle;
    address public playerNFT;
    address public items;

    mapping(address => uint256) public staked;
    mapping(address => uint256) public lastUpdate;

    constructor(address _token, address _oracle, address _playerNFT, address _items) {
        token = IERC20(_token);
        oracle = _oracle;
        playerNFT = _playerNFT;
        items = _items;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Invalid");

        // PRIMEIRO transfere (se falhar, reverte tudo)
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // DEPOIS atualiza estado
        staked[msg.sender] += amount;
        lastUpdate[msg.sender] = block.timestamp;
    }

    function getPrice() internal view returns (int256) {
        (bool ok, bytes memory data) = oracle.staticcall(
            abi.encodeWithSignature("getPrice()")
        );
        require(ok, "Oracle fail");
        return abi.decode(data, (int256));
    }

    function claim() external nonReentrant {

        uint256 time = block.timestamp - lastUpdate[msg.sender];
        require(time > 0, "Wait");

        int256 price = getPrice();

        uint256 reward = (staked[msg.sender] * time * uint256(price)) / 1e20;

        lastUpdate[msg.sender] = block.timestamp;

        // só paga se tiver saldo
        uint256 contractBalance = token.balanceOf(address(this));

        if (contractBalance < reward) {
            reward = contractBalance;
        }

        require(token.transfer(msg.sender, reward), "Reward failed");

        // loot
        if (uint(keccak256(abi.encodePacked(block.timestamp))) % 5 == 0) {
            (bool success, ) = items.call(
                abi.encodeWithSignature(
                    "mint(address,uint256,uint256)",
                    msg.sender,
                    2,
                    1
                )
            );
            require(success, "Mint failed");
        }
    }
}