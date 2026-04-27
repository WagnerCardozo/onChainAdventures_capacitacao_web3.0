// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleDAO {

    struct Proposal {
        string description;
        uint256 votes;
    }

    Proposal[] public proposals;

    function createProposal(string memory desc) external {
        proposals.push(Proposal(desc, 0));
    }

    function vote(uint256 id) external {
        proposals[id].votes++;
    }
}