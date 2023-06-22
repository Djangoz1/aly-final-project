// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
// import "./CV.sol";


import "./SBToken/FactoryCV.sol";
import './WorkflowStatusManager.sol';
import './Employer.sol';

contract Mission  is Employer {
    

    
    uint globalWadge;

    address public ownerCV;
    address public factoryCVaddress;

    FactoryCV public factoryCV;

    

    // ********************************** //
    // *::::::::::: MODIFIERS ::::::::::* //
    // ---------------------------------- //
 

    

  

    // ********************************** //
    // *:::::::::  CONSTRUCTOR  ::::::::* //
    // ---------------------------------- //

    constructor(uint _amount, address _ownerCV, address _factoryCV) {
        globalWadge += _amount;
        missionStatus = WorkflowStatusManager.MissionStatus.Pending;
        ownerCV = _ownerCV;
        factoryCVaddress = _factoryCV;
        // factoryCV = FactoryCV(factoryCVaddress);
    }

   
    

    // ! Faire le SBT
    // ! Le SBT est un contrat qui représente le compte, le CV de l'utilisateur sur la plateforme. Chaque commit est indiqué dans le SBT
    // ! Pour le SBT on va transférer l'ownership à l'address 0 et créer une address private _owner qu'on renseignera sur le constructeur
    // ! On retournera un bool pour savoir si l'address est bien le owner du SBT avec getWorkerByCV
}
