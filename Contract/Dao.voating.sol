// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DaoVoting {
    address public owner;

    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool exists;
        uint256 deadline;
    }

    uint public nextProposalId = 0;
    mapping(uint => Proposal) public proposals;
    mapping(uint => mapping(address => bool)) public hasVoted;
    mapping(uint => mapping(address => bool)) public voteChoices;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can execute.");
        _;
    }

    modifier proposalExists(uint _proposalId) {
        require(proposals[_proposalId].exists, "Proposal does not exist.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // 제안 생성 - 관리자만 가능
    function createProposal(string memory _description, uint256 _durationMinutes) public onlyOwner {
        uint256 proposalId = nextProposalId++;
        proposals[proposalId] = Proposal({
            id: proposalId,
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            exists: true,
            deadline: block.timestamp + (_durationMinutes * 1 minutes)
        });
    }

    // 제안 삭제 - 관리자만 가능
    function deleteProposal(uint _proposalId)
        public onlyOwner proposalExists(_proposalId)
    {
        proposals[_proposalId].exists = false;
    }

    // 투표 - 일반 사용자 가능
    function vote(uint proposalId, bool support) public proposalExists(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "You already voted");

        if (support) {
            proposal.yesVotes++;
            voteChoices[proposalId][msg.sender] = true; // 찬성
        } else {
            proposal.noVotes++;
            voteChoices[proposalId][msg.sender] = false; // 반대
        }

        hasVoted[proposalId][msg.sender] = true;
    }

    // 투표 취소 - 일반 사용자 가능
    function cancelVote(uint256 _proposalId) public proposalExists(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(hasVoted[_proposalId][msg.sender], "You haven't voted.");

        if (voteChoices[_proposalId][msg.sender]) {
            proposal.yesVotes--;
        } else {
            proposal.noVotes--;
        }

        hasVoted[_proposalId][msg.sender] = false;
        delete voteChoices[_proposalId][msg.sender];
    }

    // 제안 정보 조회
    function getProposal(uint256 _proposalId) public view returns (
        uint256, string memory, uint256, uint256, bool, uint256
    ) {
        Proposal memory p = proposals[_proposalId];
        return (p.id, p.description, p.yesVotes, p.noVotes, p.exists, p.deadline);
    }

    // ✅ 사용자의 투표 상태 조회 ("none", "yes", "no")
    function getMyVote(uint256 _proposalId) public view returns (string memory) {
        if (!hasVoted[_proposalId][msg.sender]) {
            return "none";
        }
        if (voteChoices[_proposalId][msg.sender]) {
            return "yes";
        } else {
            return "no";
        }
    }
}
