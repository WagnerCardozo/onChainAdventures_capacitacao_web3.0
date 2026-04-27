// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PlayerNFT is ERC721Enumerable, ERC721URIStorage {

    uint256 public nextId;

    struct Player {
        string name;
        uint256 level;
    }

    mapping(uint256 => Player) public players;

    constructor() ERC721("Player", "PLY") {}

    function createPlayer(string memory name, string memory uri) public {
        require(balanceOf(msg.sender) == 0, "Already has player");

        uint256 id = nextId;

        _safeMint(msg.sender, id);
        _setTokenURI(id, uri);

        players[id] = Player(name, 1);

        nextId++;
    }

    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}