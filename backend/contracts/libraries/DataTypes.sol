// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library DataTypes {
    enum CourtIDs {
        Centralized,
        Kleros,
        React,
        Python,
        NodeJS,
        Solidity,
        Java,
        Cpp,
        CSharp,
        Go,
        Rust,
        Ruby,
        PHP,
        Swift,
        Kotlin,
        Dart,
        Scala,
        Haskell,
        Lua,
        JavaScript,
        TypeScript,
        CoffeScript,
        Shell,
        SQL,
        HTML
    }

    enum ArbitratorStatus {
        None,
        Invited,
        Refused,
        Accepted
    }

    struct ArbitratorData {
        uint256 id;
        uint256 cvID; // ! To remove ? Doublon cvOf(ownerOf(arbitratorID))
        DataTypes.CourtIDs courtID;
        uint256 indexedAtCourt;
        uint256 nbArbitrations;
        uint256[] disputes;
    }

    struct EvidenceData {
        string missionURI;
        string featureURI;
        string workURI;
    }

    // struct ArbitrationData {
    //     uint256 arbitratorID;
    //     uint256 disputeID;
    //     ArbitrationVote vote;
    // }

    enum DeploymentStatus {
        Pending,
        Done,
        Migrate
    }

    /**
     *    @param Initialization during initialization process
     *    @param Init when all addresses are stored
     *    @param Paused when the protocol is paused
     */

    enum InitStatus {
        Initialization,
        Init,
        Paused
    }

    // ! TO DELETE
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
    // !

    /**
     *    @dev string name, string imgURI, address[] posts, uint256 followers, address[] followAccounts, address[] followMissions
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
        uint256 followers;
        address[] followAccounts;
        address[] followMissions;
        address[] posts;
    }

    /**
     *    @param cvID for followed cv ID
     *    @param indexedAt for index on indexers[cvID]
     */

    struct FollowData {
        uint256 cvID;
        uint256 indexedAt;
    }

    // *::::::::::::: ----------- :::::::::::::* //
    // *::::::::::::: PUBLICATION :::::::::::::* //
    // *::::::::::::: ----------- :::::::::::::* //

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

    struct PubData {
        uint likes;
        uint answers;
        uint missionID;
        bool isPayable;
    }

    struct PubPayableData {
        uint amount;
        uint viewers;
        string tokenURI;
        bool isAllowed;
    }
    /**
     *    @param id
     *    @param pubID
     */
    struct LikeData {
        uint256 id;
        uint256 pubID;
        uint256 indexedAt;
    }

    // *::::::::::::: ------- :::::::::::::* //
    // *::::::::::::: MISSION :::::::::::::* //
    // *::::::::::::: ------- :::::::::::::* //

    enum MissionStatus {
        Process,
        Close,
        Contest
    }

    struct MissionData {
        uint256 id;
        uint256 launchpad;
        MissionStatus status;
        uint[] features;
    }

    // *::::::::::::: -------- ::::::::::::: *//
    // *::::::::::::: FEATURES ::::::::::::: *//
    // *::::::::::::: -------- ::::::::::::: *//
    /**
     *    @param missionID is mission ID of feature
     *    @param workerAcceptJob is true when worker accept assignation job
     *    @param enterpriseAcceptWorker when feature have a commit but owner refused it and worker accept to rework on it
     */

    struct FeatureInteractionData {
        uint[] workerDemand;
        uint256 missionID; //! TO DELETE ? doublon featureData.missionID
        uint256 signedWorker; //! TO delete ? doublon featureData.cvWorker
        bool workerAcceptJob; //! TO delete ? doublon cvWorker
        bool workerContest;
        bool ownerContest;
    }

    /**
     *    @param Process when feature didn't have assign worker
     *    @param Improve when feature have a commit but owner refused it and worker accept to rework on it
     *    @param Validated when owner accept the commit of worker. This one mean worker received wadge
     *    @param Contest when litige between worker and owner
     */
    enum FeatureStatus {
        Process,
        Improve,
        Validated,
        Contest
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
        uint256 id;
        uint256 missionID;
        uint256 startedAt;
        uint256 wadge;
        uint16 estimatedDays;
        uint256 cvWorker;
        FeatureStatus status;
        CourtIDs specification;
        bool isInviteOnly;
        bool payWithToken;
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
        uint256 featureId;
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
        uint256 featureId;
        string title;
        string content;
        string imgURI;
    }

    // *::::::::::::: --------- :::::::::::::* //
    // *::::::::::::: LAUNCHPAD :::::::::::::* //
    // *::::::::::::: --------- :::::::::::::* //

    enum LaunchpadStatus {
        Waiting,
        Init,
        Paused,
        Closed,
        Error
    }

    struct LaunchpadData {
        uint id;
        // address tokenAddress;
        // uint8 numberOfTier;
        uint256 maxCap;
        uint256 minCap;
        uint256 minInvest;
        uint256 maxInvest;
        uint256 saleStart;
        uint256 saleEnd;
        uint amountRaised;
        // uint256 lockedTime;
        uint256 totalUser;
    }

    // struct TierData {
    //     uint256 maxTierCap;
    //     uint256 minTierCap;
    //     uint256 amountRaised;
    //     uint256 tokenPrice;
    //     uint256 users;
    // }

    /**
     * @notice tierLength must be equal to investedAmountLenght
     * @notice investedAmount[id] | id = tier[id]
     */
    struct InvestorData {
        // uint8[] tier;
        uint256 investedAmount;
        // uint256 lockedTokens;
    }
}
