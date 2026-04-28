// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {
    address public admin;
    bool public votingStarted;
    bool public votingEnded;
    uint public electionId;

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => uint) public lastVotedElection;

    uint public candidatesCount;

    constructor() {
        admin = msg.sender;
        electionId = 1;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        require(!votingStarted, "Voting already started");

        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function startVoting() public onlyAdmin {
        require(candidatesCount >= 2, "Need at least two candidates");

        votingStarted = true;
        votingEnded = false;
    }

    function endVoting() public onlyAdmin {
        require(votingStarted, "Voting has not started");

        votingEnded = true;
    }

    function vote(uint _candidateId) public {
        require(votingStarted, "Voting has not started");
        require(!votingEnded, "Voting has ended");
        require(lastVotedElection[msg.sender] != electionId, "You already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        lastVotedElection[msg.sender] = electionId;
        candidates[_candidateId].voteCount++;
    }

    function getCandidate(uint _id) public view returns (uint, string memory, uint) {
        Candidate memory candidate = candidates[_id];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getWinner() public view returns (string memory winnerName, uint winnerVotes) {
        require(votingEnded, "Voting has not ended yet");

        uint winningVoteCount = 0;
        uint winningCandidateId = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidateId = i;
            }
        }

        require(winningCandidateId != 0, "No votes have been cast");

        return (
            candidates[winningCandidateId].name,
            candidates[winningCandidateId].voteCount
        );
    }

    function resetElection() public onlyAdmin {
        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }

        candidatesCount = 0;
        votingStarted = false;
        votingEnded = false;
        electionId++;
    }
}