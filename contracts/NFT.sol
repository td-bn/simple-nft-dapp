// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract AnimalNFT is ERC721 {
    uint public nextTokenId;
    address public admin;

    constructor() ERC721('AnimalNFT', 'ANFT') {
        admin = msg.sender;
    }

    function mint(address to) external {
        require(msg.sender == admin, 'only admin operation');
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}