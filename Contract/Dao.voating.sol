// Solidity 버전 지정
pragma solidity ^0.8.0;

// DAO 투표 스마트 컨트랙트
contract DaoVoting {
    // 관리자(컨트랙트 배포자) 주소
    address public owner;

    // 제안 구조체 정의
    struct Proposal {
        uint256 id; // 제안 고유 ID
        string description; // 제안 설명
        uint256 yesVotes; // 찬성 투표 수
        uint256 noVotes; // 반대 투표 수
        bool exists; // 제안 존재 여부
        uint256 deadline; // 투표 마감 시간 (타임스탬프)
    }

    uint public nextProposalId = 0; // 다음 제안에 사용할 ID
    mapping(uint => Proposal) public proposals; // 제안 ID => 제안 정보
    mapping(uint => mapping(address => bool)) public hasVoted; // 제안 ID => (주소 => 투표 여부)
    mapping(uint => mapping(address => bool)) public voteChoices; // 제안 ID => (주소 => 찬반 여부)

    // 관리자만 실행 가능한 modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can execute.");
        _;
    }

    // 제안이 존재하는지 확인하는 modifier
    modifier proposalExists(uint _proposalId) {
        require(proposals[_proposalId].exists, "Proposal does not exist.");
        _;
    }

    // 생성자: 컨트랙트를 배포한 주소를 관리자(owner)로 설정
    constructor() {
        owner = msg.sender;
    }

    // 제안 생성 함수 - 관리자만 실행 가능
    function createProposal(string memory _description, uint256 _durationMinutes) public onlyOwner {
        uint256 proposalId = nextProposalId++; // 제안 ID 할당 및 증가
        proposals[proposalId] = Proposal({
            id: proposalId,
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            exists: true,
            deadline: block.timestamp + (_durationMinutes * 1 minutes) // 현재 시간 + 설정된 분 단위 시간
        });
    }

    // 제안 삭제 함수 - 관리자만 실행 가능
    function deleteProposal(uint _proposalId)
        public onlyOwner proposalExists(_proposalId)
    {
        proposals[_proposalId].exists = false;
    }

    // 투표 함수 - 일반 사용자용
    function vote(uint proposalId, bool support) public proposalExists(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended"); // 마감 시간 이전인지 확인
        require(!hasVoted[proposalId][msg.sender], "You already voted"); // 이미 투표했는지 확인

        if (support) {
            proposal.yesVotes++; // 찬성 증가
            voteChoices[proposalId][msg.sender] = true; // 투표 선택 저장 (찬성)
        } else {
            proposal.noVotes++; // 반대 증가
            voteChoices[proposalId][msg.sender] = false; // 투표 선택 저장 (반대)
        }

        hasVoted[proposalId][msg.sender] = true; // 투표 여부 기록
    }

    // 투표 취소 함수 - 일반 사용자용
    function cancelVote(uint256 _proposalId) public proposalExists(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended"); // 마감 전인지 확인
        require(hasVoted[_proposalId][msg.sender], "You haven't voted."); // 실제 투표했는지 확인

        // 기존 투표 결과를 감소시킴
        if (voteChoices[_proposalId][msg.sender]) {
            proposal.yesVotes--;
        } else {
            proposal.noVotes--;
        }

        // 투표 상태 초기화
        hasVoted[_proposalId][msg.sender] = false;
        delete voteChoices[_proposalId][msg.sender];
    }

    // 제안 정보 조회 함수
    function getProposal(uint256 _proposalId) public view returns (
        uint256, string memory, uint256, uint256, bool, uint256
    ) {
        Proposal memory p = proposals[_proposalId];
        return (p.id, p.description, p.yesVotes, p.noVotes, p.exists, p.deadline);
    }

    // 특정 제안에 대해 사용자의 투표 상태 확인 ("none", "yes", "no")
    function getMyVote(uint256 _proposalId) public view returns (string memory) {
        if (!hasVoted[_proposalId][msg.sender]) {
            return "none"; // 아직 투표하지 않음
        }
        if (voteChoices[_proposalId][msg.sender]) {
            return "yes"; // 찬성함
        } else {
            return "no"; // 반대함
        }
    }
}
