// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


library DataTypes {


    struct ProfileData {
        string name;
        string imageURI;
        string[]   pubs;
        uint followers;
        address[] followAcconts;
        address[] followMissions;


    }

    // struct PubData{
    //     string metadata;
    //     bool isAllow;
    // }

    struct MissionData {
        uint followersLength;
        string[] pubs;
        // mapping(address=>uint) followers;
    }


}