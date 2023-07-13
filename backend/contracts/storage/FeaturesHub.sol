// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

contract FeaturesHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDs;

    /**
     * @notice each address cv have an indexers
     */
    mapping(address => uint256[]) indexer;

    /**
     * @notice each feature id has an address
     */
    mapping(uint => DataTypes.FeatureData) featuresData;

    IAccessControl accessControl;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _accessControl) ERC721("Feature", "WF") {
        accessControl = IAccessControl(_accessControl);
        accessControl.setFeaturesHub(address(this));
    }

    function getTokensLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    /**
     * @param _cv is cv address
     * @param _data stored on blockchain
     */

    function createFeature(
        address _cv,
        DataTypes.FeatureData memory _data
    ) external onlyProxy returns (uint) {
        if (_data.assignedWorker == address(0)) {
            _data.status = DataTypes.FeatureType.Waiting;
        } else {
            _data.status = DataTypes.FeatureType.Working;
        }
        _tokenIDs.increment();
        uint newFeatureID = _tokenIDs.current();
        indexer[_cv].push(newFeatureID);
        _mint(_cv, newFeatureID);
        _setTokenURI(newFeatureID, _data.tokenURI);
        featuresData[newFeatureID] = _data;
        return newFeatureID;
    }

    function getIndexer(address _cv) external view returns (uint[] memory) {
        require(indexer[_cv].length > 0, "No feature found");
        return indexer[_cv];
    }

    function getDatas(
        uint _id
    ) external view returns (DataTypes.FeatureData memory _data) {
        require(featuresData[_id].createdAt != 0, "Feature not exist");
        return featuresData[_id];
    }
}
