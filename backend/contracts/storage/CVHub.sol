// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAddressHub} from "../interfaces/IAddressHub.sol";
import {CollectFollowCv} from "../collect/CollectFollowCv.sol";

contract CVHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint) private indexers;

    IAddressHub private _iAH;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAH.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier hasRegistred(address _ownerOf) {
        require(balanceOf(_ownerOf) == 1, "CV not exist");
        _;
    }

    constructor(address _addressHub) ERC721("CV", "WCV") {
        _iAH = IAddressHub(_addressHub);
        _iAH.setCVHub();
    }


// ! :: DEPRECATE :: Switch to address Hub 
    function getCollectFollowCv() external view returns (address) {
        return address(CollectFollowCv(_iAH.collectFollowCV()));
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIds.current();
    }

    function getCV(address _for) external view returns (uint) {
        require(indexers[_for] != 0, "CV not found");
        return indexers[_for];
    }

    function mint(address _from, string calldata _tokenURI) external onlyProxy {
        require(balanceOf(_from) == 0, "CV already exist");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_from, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        indexers[_from] = newItemId;
    }


}
