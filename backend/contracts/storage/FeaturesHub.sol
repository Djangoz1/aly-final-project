// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

import {Feature} from "../Feature.sol";

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
    mapping(uint =>DataTypes.FeatureData) featuresData;

    
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

    function getFeaturesLength() external view returns (uint) {
        return _tokenIDs.current();
    }

    /**
     * @param _cv is cv address
     * @param _data stored on blockchain 
     */

    function createFeature(
        address _cv,
        DataTypes.FeatureData memory _data
    ) external onlyProxy returns(uint) {
        _tokenIDs.increment();
        uint newFeatureID = _tokenIDs.current();
        indexer[_cv].push(newFeatureID);
        _mint(_cv, newFeatureID);
        _setTokenURI(newFeatureID, _data.tokenURI);
        featuresData[newFeatureID] = _data;
        return newFeatureID;
    }

    function getIndexer(address _cv) external view returns(uint[] memory){
        require(indexer[_cv].length > 0, "No feature found");
        return indexer[_cv];
    }

    function getDatas(uint _id) external view returns(DataTypes.FeatureData memory _data){
        require(featuresData[_id].createdAt != 0, "Feature not exist");
        return featuresData[_id];
    }
}
// contract FeaturesHub is ERC721URIStorage, Ownable {
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIDs;

//     /**
//      * @notice each address cv have an indexers
//      */
//     mapping(address => uint256[]) indexersList;

//     /**
//      * @notice each feature id has an address
//      */
//     mapping(uint => address) featuresList;
//     IAccessControl accessControl;

//     modifier onlyProxy() {
//         require(
//             msg.sender == address(accessControl),
//             "Must call function with proxy bindings"
//         );
//         _;
//     }

//     constructor(address _accessControl) ERC721("Feature", "WF") {

//         accessControl = IAccessControl(_accessControl);
//         accessControl.setFeaturesHub(address(this));
//         // /// @notice Create genesis features
//         // DataTypes.FeatureData memory _featureData;
//         // _featureData.metadata = "Genesis";
//         // _featureData.missionId = 0;

//         // Feature newFeature = new Feature(
//         //     address(accessControl),
//         //     _tokenIDs.current(),
//         //     _featureData
//         // );
//         // indexersList[msg.sender].push(_tokenIDs.current());
//         // featuresList[_tokenIDs.current()] = address(newFeature);
//         // _tokenIDs.increment();
//     }

//     function getFeaturesIds() external view returns (uint) {
//         return _tokenIDs.current();
//     }

//     /**
//      * @param _for is cv address
//      * @param _featureData is data for new feature
//      */

//     function createFeature(
//         address _for,
//         DataTypes.FeatureData memory _featureData
//     ) external onlyProxy {
//         Feature newFeature = new Feature(
//             address(accessControl),
//             _tokenIDs.current(),
//             _featureData
//         );
//         require(address(newFeature) != address(0), "Deployment feature failed");
//         newFeature.transferOwnership(_for);
//         require(newFeature.owner() == _for, "Missmatch ownership deployment");
//         indexersList[newFeature.owner()].push(_tokenIDs.current());
//         featuresList[_tokenIDs.current()] = address(newFeature);
//         _tokenIDs.increment();
//     }

//     function getFeatureById(
//         uint _id
//     ) external view onlyProxy returns (address) {
//         require(_id < _tokenIDs.current(), "Id out of range");
//         return featuresList[_id];
//     }

//     function getIndexersByAddress(
//         address _for
//     ) external view onlyProxy returns (uint256[] memory) {
//         require(indexersList[_for].length > 0, "No features found");
//         return indexersList[_for];
//     }
// }
