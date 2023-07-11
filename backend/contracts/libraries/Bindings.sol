// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import {CV} from "../SBToken/CV.sol";
import {DataTypes} from "./DataTypes.sol";
import {IPub} from "../interfaces/IPub.sol";
import {IFactoryCV} from "../interfaces/IFactoryCV.sol";
import {ICV} from "../interfaces/ICV.sol";
import {IAccessControl} from "../interfaces/IAccessControl.sol";
import {Pub} from "../Pub.sol";
import {WorkerProposal} from "../WorkerProposal.sol";

library Bindings {
    function _deployCV(
        address _toAddr,
        address factoryCV,
        uint _id
    ) internal returns (address) {
        CV newCV = new CV(factoryCV, _id);
        newCV.transferOwnership(_toAddr);
        return address(newCV);
    }

    function deployPub(
        DataTypes.PubData memory _datas,
        uint _id
    ) internal returns (address) {
        CV iCV = CV(_datas.publisher);
        require(
            address(iCV) == _datas.publisher,
            "Missmatch error cv address and publisher"
        );
        Pub pub = new Pub(_datas, _id);
        return address(pub);
    }

    function deployWorkerProposal(
        DataTypes.WorkerProposalData memory _datas,
        uint _id
    ) internal returns (address) {
        WorkerProposal workerProposal = new WorkerProposal(_datas, _id);
        return address(workerProposal);
    }
}
