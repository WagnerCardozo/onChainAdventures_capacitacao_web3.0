// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface AggregatorV3Interface {
    function latestRoundData()
        external view
        returns (uint80, int256, uint256, uint256, uint80);
}

contract PriceOracle {

    AggregatorV3Interface public feed;

    constructor(address _feed) {
        feed = AggregatorV3Interface(_feed);
    }

    function getPrice() public view returns (int256) {
        (, int256 price,,,) = feed.latestRoundData();
        return price;
    }
}