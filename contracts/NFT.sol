// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract INFT is ERC721URIStorage {
    uint public nextTokenId;
    address public admin;

    event Mint(uint tokenId, address to, string tokenURI);
    event Buy( uint tokenId, address buyer);
    event Approve(uint tokenId, address approved);

    constructor() ERC721('IdenticonNFT', 'INFT') {
        admin = msg.sender;
    }

    function mint(address _to, string memory _tokenURI) external {
        _safeMint(_to, nextTokenId);
        _setTokenURI(nextTokenId, _tokenURI);

        emit Mint(nextTokenId, _to, _tokenURI);

        nextTokenId++;
    }

    function approve(address to, uint256 tokenId) public virtual override {
        ERC721.approve(to, tokenId);
        emit Approve(tokenId, to);
    }

    function buy(uint _tokenId) public {
        address owner = ERC721.ownerOf(_tokenId);

        require(msg.sender != owner, 'sending to owner');
        require(getApproved(_tokenId) == address(this), 'contract not approved to perform transaction');

        _safeTransfer(owner, msg.sender, _tokenId, "");

        emit Buy(_tokenId, msg.sender);
    }
}