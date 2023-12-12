// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title Voting Contract
/// @author Alyra team
/// @notice This contract allows you to run a voting instance for small organizations
/// @dev Inherits the OpenZepplin Ownable implentation
contract Voting is Ownable {

    /// @notice The ID of the winning proposal
    /// @dev The winning proposal is re-calculated after each new vote
    uint public winningProposalID;
    
    /// @notice Definition of a Voter
    /// @param isRegistered true if the voter is registered by the owner
    /// @param hasVoted true if the voter has voted
    /// @param votedProposalId the ID of the proposal for which the voter has voted
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// @notice Definition of a Proposal
    /// @param description the description of the proposal
    /// @param voteCount the number of votes collected by the proposal
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @notice Definition of the different Workflow Status
    /// @param RegisteringVoters Workflow status starting voter registration (default)
    /// @param ProposalsRegistrationStarted Workflow status starting proposal registration
    /// @param ProposalsRegistrationEnded Workflow status ending proposal registration
    /// @param VotingSessionStarted Workflow status starting vote submission
    /// @param VotingSessionEnded Workflow status ending vote submission
    /// @param VotesTallied Workflow status cloturing the vote instance and determining the winning proposal
    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    /// @notice The current workflow status
    WorkflowStatus public workflowStatus;

    /// @notice The table of proposals
    /// @dev We use an array since we want to be able to browse easily among proposals
    Proposal[] proposalsArray;

    /// @notice The mapping of voters
    mapping (address => Voter) voters;

    /// @notice Event when a new voter is registered
    /// @param voterAddress the address of the registered voter
    event VoterRegistered(address voterAddress); 
    /// @notice Event when the workflow status is updated 
    /// @param previousStatus the previous workflow status
    /// @param newStatus the new workflow status
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    /// @notice Event when a new proposal is registered
    /// @param proposalId the ID of the new proposal
    event ProposalRegistered(uint proposalId);
    /// @notice Event when a new vote is submitted
    /// @param voter the address of the voter
    /// @param proposalId the ID of the proposal for which the voter has voted
    event Voted (address voter, uint proposalId);
    
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Get a voter's information
    /// @param _addr the address of the voter
    /// @return Voter the voter's info
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Get a proposal's information
    /// @param _id the ID of the proposal
    /// @return Proposal the proposal's info
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }
 
    // ::::::::::::: REGISTRATION ::::::::::::: // 

    /// @notice Add a voter to the registration list
    /// @param _addr the address of the voter
    /// @custom:event VoterRegistered
    /** @custom:callcondition
        - Caller is owner
        - Workflow status is RegisteringVoters
        - Voter is not already registered
    */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 
    // ::::::::::::: PROPOSAL ::::::::::::: // 

    /// @notice Add a proposal to the proposals table
    /// @param _desc the description of the proposal
    /// @custom:event ProposalRegistered
    /** @custom:callcondition
        - Caller is a voter
        - Workflow status is ProposalsRegistrationStarted
        - Description not empty
    */
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Submit a vote for a proposal
    /// @param _id the ID of the voted proposal
    /// @dev We avoid a DoS Gas Limit attack on the "proposalsArray" by determining the winning proposal after each new vote
    /// @custom:event Voted
    /** @custom:callcondition
        - Caller is a voter
        - Workflow status is VotingSessionStarted
        - Caller has not already voted
        - Proposal ID exists
    */
    function setVote(uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found');

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if(proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount) {
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Change the workflow status from RegisteringVoters to ProposalsRegistrationStarted
    /// @custom:event WorkflowStatusChange
    /** @custom:callcondition
        - Caller is owner
        - Workflow status is RegisteringVoters
    */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Change the workflow status from ProposalsRegistrationStarted to ProposalsRegistrationEnded
    /// @custom:event WorkflowStatusChange
    /** @custom:callcondition
        - Caller is owner
        - Workflow status is ProposalsRegistrationStarted
    */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Change the workflow status from ProposalsRegistrationEnded to VotingSessionStarted
    /// @custom:event WorkflowStatusChange
    /** @custom:callcondition
        - Caller is owner
        - Workflow status is ProposalsRegistrationEnded
    */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Change the workflow status from VotingSessionStarted to VotingSessionEnded
    /// @custom:event WorkflowStatusChange
    /** @custom:callcondition
        - Caller is owner
        - Workflow status is VotingSessionStarted
    */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Change the workflow status from VotingSessionEnded to VotesTallied
    /// @dev The code for determining the winning proposal has been commented since it is done in the setVote function
    /// @custom:event WorkflowStatusChange
    /** @custom:callcondition
        - Caller is owner
        - Workflow status is VotingSessionEnded
    */
   function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
//        uint _winningProposalId;
//        for (uint256 p = 0; p < proposalsArray.length; p++) {
//            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
//                _winningProposalId = p;
//            }
//        }
//        winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}