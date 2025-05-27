// 스마트 컨트랙트 주소 (새로 배포된 주소로 교체)
const contractAddress = '[배포된 스마트 컨트랙트 주소]';

// 스마트 컨트랙트 ABI (함수 정의 정보)
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			}
		],
		"name": "cancelVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_durationMinutes",
				"type": "uint256"
			}
		],
		"name": "createProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			}
		],
		"name": "deleteProposal",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			}
		],
		"name": "getMyVote",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_proposalId",
				"type": "uint256"
			}
		],
		"name": "getProposal",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextProposalId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "proposals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "yesVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "noVotes",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "proposalId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "support",
				"type": "bool"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voteChoices",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// 웹3 인스턴스, 컨트랙트 인스턴스, 계정 정보 저장용 변수
let web3;
let contract;
let accounts = [];
let currentAccount = '';
let owner = '';

// 초기 로딩 시 실행되는 함수
window.addEventListener('load', async () => {
	// 페이지 로딩 시 Ganache 로컬 노드에 연결
	web3 = new Web3('http://127.0.0.1:7545');

	// 스마트 컨트랙트 인스턴스를 생성
	try {
		// 사용자 계정 목록을 가져와 드롭다운에 추가
		accounts = await web3.eth.getAccounts();
		contract = new web3.eth.Contract(abi, contractAddress);
		owner = await contract.methods.owner().call();

		const select = document.getElementById('accountSelect');
		select.innerHTML = '';
		accounts.forEach(acc => {
		const option = document.createElement('option');
		option.value = acc;
		option.innerText = acc;
		select.appendChild(option);
		});

		currentAccount = accounts[0];

		// 관리자 계정인지 여부를 확인하여 UI를 동적으로 표시
		onAccountChange();

		// 제안 목록을 불러오기
		await loadProposals();
	} catch (err) {
		console.error("초기화 오류:", err);
		alert("초기화 중 오류 발생");
	}
});

// 계정 변경 시 UI 업데이트
function onAccountChange() {
	// 선택된 계정을 기준으로 현재 계정 정보 업데이트
	const selected = document.getElementById('accountSelect').value;
	currentAccount = selected;

	// 해당 계정이 관리자(owner)인지 확인
	const isOwner = currentAccount.toLowerCase() === owner.toLowerCase();

	// 관리자만 제안 생성 섹션을 볼 수 있도록 설정
	document.getElementById('createProposalSection').style.display = isOwner ? 'block' : 'none';
	document.getElementById('roleInfo').innerText = isOwner ? '관리자 계정' : '일반 사용자 계정';

	// 제안 목록 다시 로딩
	loadProposals();
}

// 제안 생성 (관리자 전용)
async function createProposal() {
	// 제안 설명과 마감 시간(분 단위)을 입력 받아 createProposal 함수 호출							
	const desc = document.getElementById('proposalDescription').value;
	const duration = parseInt(document.getElementById('proposalDuration').value);

	if (!desc || isNaN(duration) || duration <= 0) {
		alert("제안 내용과 유효한 마감 시간을 입력해주세요.");
		return;
	}

	// 유효성 검사를 수행하고 오류 발생 시 alert 처리
	try {
		await contract.methods.createProposal(desc, duration).send({ from: currentAccount, gas: 300000 });
		alert("제안 생성 완료");
		await loadProposals();
	} catch (error) {
		console.error("제안 생성 실패:", error);
		alert("제안 생성 중 오류 발생");
	}
}

// 투표 (일반 사용자용)
async function vote(proposalId, voteYes) {
	// 제안 ID와 찬반 여부를 인자로 받아 vote() 스마트 컨트랙트 함수 호출
	try {
		await contract.methods.vote(proposalId, voteYes).send({ from: currentAccount, gas: 500000 });
		alert("투표 완료");
		await loadProposals();
	} catch (error) {
		console.error("투표 실패:", error);
		alert("투표 중 오류 발생");
	}
}

// 시간 포맷 변환 함수
function formatTimestamp(timestamp) {
	// 유닉스 타임스탬프를 사람이 읽을 수 있는 날짜 형식으로 변환					
	const d = new Date(timestamp * 1000);
	return isNaN(d.getTime()) ? '유효하지 않은 날짜' : d.toLocaleString();
}

// 제안 목록 로딩
async function loadProposals() {
	const proposalsDiv = document.getElementById('proposals');
	proposalsDiv.innerHTML = '';

	try {
		const count = await contract.methods.nextProposalId().call();

		for (let i = 0; i < count; i++) {
		const result = await contract.methods.getProposal(i).call();
		const id = result[0];
		const description = result[1];
		const yesVotes = result[2];
		const noVotes = result[3];
		const exists = result[4];
		const deadline = result[5];
		
		// 존재하는 제안만 표시
		if (!exists) continue;
		
		// 사용자 역할과 마감 여부에 따라 버튼 출력 조건 결정
		const now = Math.floor(Date.now() / 1000);
		const expired = now > deadline;
		const isOwner = currentAccount.toLowerCase() === owner.toLowerCase();
		const hasUserVoted = await contract.methods.hasVoted(id, currentAccount).call();

		const div = document.createElement('div');
		div.innerHTML = `
			<h3>[${id}] ${description}</h3>
			마감 시간: ${formatTimestamp(deadline)}<br>
			${expired ? '<strong style="color:red;">투표 마감됨</strong><br>' : ''}
			찬성: ${yesVotes} / 반대: ${noVotes} <br>
			${!expired && !isOwner ? `
			${!hasUserVoted ? `
				<button onclick="vote(${id}, true)">찬성</button>
				<button onclick="vote(${id}, false)">반대</button>
			` : `
				<button onclick="cancelVote(${id})">투표 취소</button>
			`}
			` : (expired && !isOwner ? `
			<em style="color: gray;">투표 기간이 종료되어 더 이상 투표할 수 없습니다.</em>
			` : '')}
			${isOwner ? `
			<button onclick="deleteProposal(${id})">삭제</button>
			` : ''}
			<hr>
		`;
		proposalsDiv.appendChild(div);
		}
	} catch (error) {
		console.error("제안 목록 로드 실패:", error);
		proposalsDiv.innerHTML = '제안 목록을 불러오는 데 실패했습니다.';
	}
}

// 사용자가 투표를 취소하는 함수
async function cancelVote(proposalId) {
  try {
    await contract.methods.cancelVote(proposalId).send({ from: currentAccount });
    alert("투표가 취소되었습니다.");
    await loadProposals();
  } catch (error) {
    console.error("투표 취소 실패:", error);
    alert("투표 취소 중 오류 발생");
  }
}

// 관리자가 제안을 삭제하는 함수
async function deleteProposal(proposalId) {
  try {
    await contract.methods.deleteProposal(proposalId).send({ from: currentAccount });
    alert("제안이 삭제되었습니다.");
    await loadProposals();
  } catch (error) {
    console.error("삭제 실패:", error);
    alert("제안 삭제 중 오류 발생");
  }
}
