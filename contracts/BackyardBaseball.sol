//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BackyardBaseball is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 MAX_SUPPLY = 100;
    string private _ipfsURI;

    constructor() ERC721("Backyard Baseball", "BYBB") {}

    function mintCharacter(uint256 numberOfTokens) public payable {
        console.log("mint character");
        require(numberOfTokens > 0, "You must mint at least 1 token");
        require(
            totalSupply() + numberOfTokens <= MAX_SUPPLY,
            "There are not enough characters left to mint that many"
        );

        for (uint256 idx = 0; idx < numberOfTokens; idx++) {
            uint256 mintIndex = totalSupply();
            console.log(mintIndex);
            _safeMint(msg.sender, mintIndex);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        console.log(totalSupply());
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _ipfsURI;
    }

    function baseURI() public view returns (string memory) {
        return _ipfsURI;
    }

    function _setBaseURI(string memory ipfsURI_) internal virtual {
        _ipfsURI = ipfsURI_;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        _setBaseURI(baseURI_);
    }
}
