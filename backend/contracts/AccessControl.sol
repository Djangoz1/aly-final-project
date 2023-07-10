// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

import {DataTypes} from "./libraries/DataTypes.sol";
import {IAccessControl} from "./interfaces/IAccessControl.sol";
import {IFactoryMission} from "./interfaces/IFactoryMission.sol";
import {IPubHub} from "./interfaces/IPubHub.sol";
import {IFactoryCV} from "./interfaces/IFactoryCV.sol";
import {ICV} from "./interfaces/ICV.sol";

contract AccessControl is Ownable {
    uint cvPrice = 100;

    IFactoryMission public iFMI;
    IFactoryCV public iFCV;
    IPubHub public iPH;

    DataTypes.AccessControlStatus public workflow;

    modifier onlyInit() {
        require(
            workflow == DataTypes.AccessControlStatus.Init,
            "Init is not ready"
        );
        _;
    }

    modifier onlyStart() {
        require(
            workflow == DataTypes.AccessControlStatus.Initialization,
            "Init is not ready"
        );
        _;
    }

    function hasInit() internal view returns (bool) {
        if (
            address(iFMI) != address(0) &&
            address(iFCV) != address(0) &&
            address(iPH) != address(0)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // *::::::::::::::: -------------- :::::::::::::::* //
    // *::::::::::::::: Initialisation :::::::::::::::* //
    // *::::::::::::::: -------------- :::::::::::::::* //

    function setPubHub(address _pubHub) external onlyStart {
        iPH = IPubHub(_pubHub);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getPubHub() external view onlyInit returns (address) {
        return address(iPH);
    }

    function setFactoryCV(address _factoryCV) external onlyStart {
        iFCV = IFactoryCV(_factoryCV);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getFactoryCV() external view onlyInit returns (address) {
        return address(iFCV);
    }

    function setFactoryMission(address _factoryMission) external onlyStart {
        iFMI = IFactoryMission(_factoryMission);
        if (hasInit()) {
            workflow = DataTypes.AccessControlStatus.Init;
        }
    }

    function getFactoryMission() external view onlyInit returns (address) {
        return address(iFMI);
    }

    // *::::::::::::::: ----------- :::::::::::::::* //
    // *::::::::::::::: CV BINDINGS :::::::::::::::* //
    // *::::::::::::::: ----------- :::::::::::::::* //

    /**
     * @notice This function can called only one time per address
     * @dev Second call will be reverted by iFCV.createCV(_owner) because sender have already CV
     * @return address target deployment cv
     */
    function buyCV() external payable onlyInit returns (address) {
        require(msg.value > cvPrice, "Value must be greater than price");
        address newCV = iFCV.createCV(msg.sender);
        return newCV;
    }

    /**
     * @param _addr owner of cv
     * @return address of cv
     */
    function getCVByAddress(
        address _addr
    ) external view onlyInit returns (address) {
        return iFCV.getCVByAddress(_addr);
    }

    // *::::::::::::::: ------------ :::::::::::::::* //
    // *::::::::::::::: PUB BINDINGS :::::::::::::::* //
    // *::::::::::::::: ------------ :::::::::::::::* //

    function createPub(
        DataTypes.PubData memory _datas
    ) external onlyInit returns (address) {
        iFCV.checkRegistred(msg.sender);
        ICV iCV = ICV(_datas.publisher);
        require(
            iCV.owner() == msg.sender,
            "Must create a post with your own CV"
        );
        iFCV.checkRegistred(iCV.owner());
        address newPub = iPH.postPub(_datas);
        return newPub;
    }

    /**
     * @notice This function can called only
     */
    function getPubIndexers(
        address _addr
    ) external view onlyInit returns (uint[] memory) {
        ICV iCV = ICV(_addr);
        iFCV.checkRegistred(iCV.owner());
        uint[] memory indexer = iPH.getIndexerByAddr(_addr);
        return indexer;
    }

    function getPubById(uint _id) external view onlyInit returns (address) {
        return iPH.getPubById(_id);
    }
}
