// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


library DataTypes {


    /**
    *    @param Initialization during initialization process
    *    @param Init when all addresses are stored
    *    @param Paused when the protocol is paused
    */

    enum AccessControlStatus {
        Initialization,
        Init,
        Paused
    }

    /**
    *    @param Social when publisher post on global access
    *    @param Work when publisher post on followers mission access
    *    @param Feed when publisher post on paid access
    *    @param Private when publisher post for a whitelisted address
    */
    enum PubType {
        Social,
        Work,
        Feed,
        Private
    }

    /**
    *    @dev string name, string imgURI, address[] posts, uint followers, address[] followAccounts, address[] followMissions
    *    @param name
    *    @param content
    *    @param imgURI
    *    @param followers
    *    @param followAccounts
    *    @param followMissions
    *    @param posts
    */

    struct ProfileData {
        string name;
        string imgURI;
        uint followers;
        address[] followAccounts;
        address[] followMissions;
        address[] posts;
    }

    /**
    *    @dev string title, string content, address publisher, uint followers
    *    @param title
    *    @param content
    *    @param imgURI
    *    @param publisher
    *    @param followers
    */
    struct PubData{
        string title;
        string content;
        string imgURI;
        address publisher;
        uint followers;
    }

    string private constant PUB_DATA_TYPE = "PubData(string title, string content, string imgURI, address publisher, uint followers)";
    

    struct MissionData {
        uint followersLength;
        string[] pubs;
        // mapping(address=>uint) followers;
    }


}