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
    struct PubData {
        string title;
        string content;
        string imgURI;
        address publisher;
        uint followers;
    }

    string private constant PUB_DATA_TYPE =
        "PubData(string title, string content, string imgURI, address publisher, uint followers)";

    struct MissionData {
        uint followersLength;
        string[] pubs;
        // mapping(address=>uint) followers;
    }

    // *::::::::::::: -------- ::::::::::::: *//
    // *::::::::::::: FEATURES ::::::::::::: *//
    // *::::::::::::: -------- ::::::::::::: *//

    /**
     *    @param Waiting when feature didn't have assign worker
     *    @param Working when owner assign a worker
     *    @param Validated when owner accept the commit of worker. This one mean worker received wadge
     *    @param Improve when feature have a commit but owner refused it and worker accept to rework on it
     *    @param Litigation when litige between worker and owner
     */
    enum FeatureType {
        Waiting,
        Working,
        Validated,
        Improve,
        Litigation
    }

    /**
     *   @notice missionId is id of mission referal. Feature can have only one mission and mission can have many features
     *   @notice metadata is concatenate string data of feature (title, content, imgURI)
     *   @notice createdAt is timestamp of deployment
     *   @notice startedAt is timestamp of assignWorker
     *   @notice wadge is value associate of worker and assign by owner
     *   @notice estimatedDays is number of days to deliver a job
     *   @notice isInviteOnly true if owner doesn't want a commit from a non-whitelist worker
     *   @notice isInviteOnly bool if owner accept  a commit from a non-whitelist worker
     *   @notice assignedWorker is address of assigned worker (means isInviteOnly == true)
     */

    struct FeatureData {
        uint256 missionID;
        uint256 startedAt;
        uint256 createdAt;
        uint256 wadge;
        uint16 estimatedDays;
        string tokenURI;
        bool isInviteOnly;
        address assignedWorker;
    }

    /**
     * @notice title of feature metadata
     * @notice content of feature metadata
     * @notice devLanguage is requirement language wanted by owner for this feature
     * @notice imgURI? if owner want assign an image to this feature
     * @notice assignedWorker? if owner want assign an assigned worker on deployment feature
     */

    struct CreationFeatureData {
        string title;
        string content;
        string devLanguage;
        string imgURI;
        uint256 wadge;
        address assignedWorker;
    }

    // *::::::::::::: ---------------- ::::::::::::: *//
    // *::::::::::::: WORKER PROPOSALS ::::::::::::: *//
    // *::::::::::::: ---------------- ::::::::::::: *//

    /**
     *    @param Propose when proposal is just proposed by worker
     *    @param Validate when owner of feature validate proposal (means worker received wadge)
     *    @param Refused when owner rejected the proposal
     *    @param Litigation when litige send to Kleros court
     */
    enum WorkerProposalType {
        Propose,
        Validate,
        Refused,
        Litigation
    }

    /**
     *   @notice featureId is referal feature of worker proposal
     *   @notice metadata is concatenate string data of worker proposal (title, content, imgURI)
     *   @notice closedAt is timestamp of Validate of Refused event
     *   @notice createdAt is timestamp of deployment
     */

    struct WorkerProposalData {
        uint featureId;
        string metadata;
        uint256 closedAt;
        uint256 createdAt;
    }

    /**
     * @notice title of worker proposal metadata
     * @notice content of worker proposla metadata
     * @notice imgURI? if owner want assign an image to this feature
     */

    struct CreationProposalData {
        uint featureId;
        string title;
        string content;
        string imgURI;
    }
}
