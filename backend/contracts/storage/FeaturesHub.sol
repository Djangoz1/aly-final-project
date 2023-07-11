// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import {DataTypes} from "../libraries/DataTypes.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";

import {Feature} from "../Feature.sol";

contract FeaturesHub is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _featuresIds;

    /**
     * @notice each address cv have an indexers
     */
    mapping(address => uint256[]) indexersList;

    /**
     * @notice each feature id has an address
     */
    mapping(uint => address) featuresList;
    IAccessControl accessControl;

    modifier onlyProxy() {
        require(
            msg.sender == address(accessControl),
            "Must call function with proxy bindings"
        );
        _;
    }

    constructor(address _accessControl) {
        accessControl = IAccessControl(_accessControl);
        accessControl.setFeaturesHub(address(this));
        // /// @notice Create genesis features
        // DataTypes.FeatureData memory _featureData;
        // _featureData.metadata = "Genesis";
        // _featureData.missionId = 0;

        // Feature newFeature = new Feature(
        //     address(accessControl),
        //     _featuresIds.current(),
        //     _featureData
        // );
        // indexersList[msg.sender].push(_featuresIds.current());
        // featuresList[_featuresIds.current()] = address(newFeature);
        // _featuresIds.increment();
    }

    function getFeaturesIds() external view returns (uint) {
        return _featuresIds.current();
    }

    /**
     * @param _for is cv address
     * @param _featureData is data for new feature
     */

    function createFeature(
        address _for,
        DataTypes.FeatureData memory _featureData
    ) external onlyProxy {
        Feature newFeature = new Feature(
            address(accessControl),
            _featuresIds.current(),
            _featureData
        );
        require(address(newFeature) != address(0), "Deployment feature failed");
        newFeature.transferOwnership(_for);
        require(newFeature.owner() == _for, "Missmatch ownership deployment");
        indexersList[newFeature.owner()].push(_featuresIds.current());
        featuresList[_featuresIds.current()] = address(newFeature);
        _featuresIds.increment();
    }

    function getFeatureById(
        uint _id
    ) external view onlyProxy returns (address) {
        require(_id < _featuresIds.current(), "Id out of range");
        return featuresList[_id];
    }

    function getIndexersByAddress(
        address _for
    ) external view onlyProxy returns (uint256[] memory) {
        require(indexersList[_for].length > 0, "No features found");
        return indexersList[_for];
    }
}
