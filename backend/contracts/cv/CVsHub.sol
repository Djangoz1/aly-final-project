// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAddressSystem} from "../interfaces/system/IAddressSystem.sol";

contract CVsHub is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint) private indexers;

    mapping(uint => bool) private _acceptToken;

    IAddressSystem private _iAS;

    modifier onlyProxy() {
        require(
            msg.sender == address(_iAS.apiPost()),
            "Must call function with proxy bindings"
        );
        _;
    }

    modifier hasRegistred(address _ownerOf) {
        require(balanceOf(_ownerOf) == 1, "CV not exist");
        _;
    }

    constructor(address _addressSystem) ERC721("CV", "WCV") {
        _iAS = IAddressSystem(_addressSystem);
        _iAS.setCVsHub();
        require(_iAS.cvsHub() == address(this), "CVsHub: Error deployment");
    }

    function tokensLength() external view returns (uint) {
        return _tokenIds.current();
    }

    function cvOf(address _for) external view returns (uint) {
        require(indexers[_for] != 0, "CV not found");
        return indexers[_for];
    }

    /**
     * @notice cv accept token by default
     */
    function mint(
        address _from,
        string calldata _tokenURI
    ) external onlyProxy returns (uint) {
        require(balanceOf(_from) == 0, "CV already exist");
        _tokenIds.increment();
        uint256 newID = _tokenIds.current();
        _mint(_from, newID);
        _setTokenURI(newID, _tokenURI);
        indexers[_from] = newID;
        _acceptToken[newID] = true;
        return newID;
    }

    function setAcceptToken(uint _cvID) external onlyProxy {
        _acceptToken[_cvID] = !_acceptToken[_cvID];
    }

    function isAcceptToken(uint _cvID) external view returns (bool) {
        require(_cvID > 0 && _cvID <= _tokenIds.current(), "Invalid CV ID");
        return _acceptToken[_cvID];
    }
}
