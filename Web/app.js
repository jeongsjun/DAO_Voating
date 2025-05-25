// 수정 사항 : 새로 배포된 주소
const contractAddress = '0xE2B9674e2ca8e37D89d760FCF3E9602A7eF30018';

// 필요시 수정 : ABI
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

let web3;
let contract;
let accounts = [];
let currentAccount = '';
let owner = '';

window.addEventListener('load', async () => {
  web3 = new Web3('http://127.0.0.1:7545');

  try {
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
    onAccountChange();
    await loadProposals();
  } catch (err) {
    console.error("초기화 오류:", err);
    alert("초기화 중 오류 발생");
  }
});

function onAccountChange() {
  const selected = document.getElementById('accountSelect').value;
  currentAccount = selected;

  const isOwner = currentAccount.toLowerCase() === owner.toLowerCase();
  document.getElementById('createProposalSection').style.display = isOwner ? 'block' : 'none';
  document.getElementById('roleInfo').innerText = isOwner ? '관리자 계정' : '일반 사용자 계정';

  loadProposals();
}

async function createProposal() {
  const desc = document.getElementById('proposalDescription').value;
  const duration = parseInt(document.getElementById('proposalDuration').value);

  if (!desc || isNaN(duration) || duration <= 0) {
    alert("제안 내용과 유효한 마감 시간을 입력해주세요.");
    return;
  }

  try {
    await contract.methods.createProposal(desc, duration).send({ from: currentAccount, gas: 300000 });
    alert("제안 생성 완료");
    await loadProposals();
  } catch (error) {
    console.error("제안 생성 실패:", error);
    alert("제안 생성 중 오류 발생");
  }
}

async function vote(proposalId, voteYes) {
  try {
    await contract.methods.vote(proposalId, voteYes).send({ from: currentAccount, gas: 500000 });
    alert("투표 완료");
    await loadProposals();
  } catch (error) {
    console.error("투표 실패:", error);
    alert("투표 중 오류 발생");
  }
}

async function execute(proposalId) {
  try {
    alert("제안 실행 완료");
    await loadProposals();
  } catch (error) {
    console.error("실행 실패:", error);
    alert("제안 실행 중 오류 발생");
  }
}

function formatTimestamp(timestamp) {
  const d = new Date(timestamp * 1000);
  return isNaN(d.getTime()) ? '유효하지 않은 날짜' : d.toLocaleString();
}

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

      if (!exists) continue;

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
