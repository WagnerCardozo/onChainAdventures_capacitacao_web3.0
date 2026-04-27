console.log("JS carregou");

let provider;
let signer;
let proposals = [];
let currentIndex = 0;

const playerAddress = "0xf1B3bA07a92428c8Deb455714B3f8Ef9afa3bF4b";
const shopAddress = "0x57bDE711cE5756a59f0f583B9DFa7b75b7f74aD9";
const stakingAddress = "0x3aA66f59AEaD6E26DED20718A3a73E1fb998404b";
const itemsAddress = "0xa2565658AE4CC40485D2d7bDdd46FAa4bE49E949";
const tokenAddress = "0x985F18a571C2720029bd7d87d160644eDEaeAA64";
const daoAddress = "0xbD1943629666d92647eDc6Fab1E25c8B45697F44";

// 🔧 FORMATAÇÃO BONITA
function formatNumber(value) {
    const num = parseFloat(value);

    if (num < 0.01) return "<0.01";
    if (num > 1000) return num.toLocaleString("pt-BR");

    return num.toFixed(2);
}

function setStatus(msg) {
    document.getElementById("status").innerText = "Status: " + msg;
}

// 🔗 CONEXÃO
const SEPOLIA_CHAIN_ID = "0xaa36a7";

async function switchToSepolia() {
    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }]
    });
}

async function connect() {
    await switchToSepolia();
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const addr = await signer.getAddress();
    setStatus("Conectado: " + addr);

    await checkPlayer();
    await loadBalance();
    await loadPrices();
    await loadAllProposals();
}

// 👤 PLAYER
async function checkPlayer() {
    const contract = new ethers.Contract(playerAddress, [
        "function balanceOf(address) view returns (uint256)",
        "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
        "function players(uint256) view returns (string name, uint256 level)"
    ], provider);

    const addr = await signer.getAddress();
    const balance = await contract.balanceOf(addr);

    if (balance > 0) {
        const tokenId = await contract.tokenOfOwnerByIndex(addr, 0);
        const player = await contract.players(tokenId);

        document.getElementById("playerSection").style.display = "none";
        document.getElementById("playerInfo").style.display = "block";

        document.getElementById("playerName").innerText = player.name;
        document.getElementById("playerLevel").innerText = player.level;
    }
}

async function createPlayer() {
    const name = document.getElementById("name").value;

    const contract = new ethers.Contract(playerAddress, ["function createPlayer(string,string)"], signer);
    const tx = await contract.createPlayer(name, "ipfs://player");
    await tx.wait();

    await checkPlayer();
}

// 💸 FAUCET
async function claimFaucet() {
    const contract = new ethers.Contract(tokenAddress, ["function claimTokens()"], signer);

    const tx = await contract.claimTokens();
    await tx.wait();

    await loadBalance();
    setStatus("Tokens recebidos 💸");
}

// 💰 SALDO
async function loadBalance() {
    const contract = new ethers.Contract(tokenAddress, ["function balanceOf(address) view returns (uint256)"], provider);
    const addr = await signer.getAddress();

    const balance = await contract.balanceOf(addr);

    document.getElementById("balance").innerText =
        formatNumber(ethers.utils.formatUnits(balance, 18));
}

// 🛒 PREÇOS
async function loadPrices() {
    const contract = new ethers.Contract(shopAddress, ["function prices(uint256) view returns (uint256)"], provider);

    const sword = await contract.prices(1);
    const potion = await contract.prices(2);

    document.getElementById("swordPrice").innerText =
        formatNumber(ethers.utils.formatUnits(sword, 18));

    document.getElementById("potionPrice").innerText =
        formatNumber(ethers.utils.formatUnits(potion, 18));
}

// 🛒 COMPRA
async function buySword() {
    const price = ethers.utils.parseUnits("100", 18);

    const token = new ethers.Contract(tokenAddress, ["function approve(address,uint256)"], signer);
    await (await token.approve(shopAddress, price)).wait();

    const shop = new ethers.Contract(shopAddress, ["function buy(uint256,uint256)"], signer);
    await (await shop.buy(1, 1)).wait();

    await loadBalance();
}

async function buyPotion() {
    const price = ethers.utils.parseUnits("50", 18);

    const token = new ethers.Contract(tokenAddress, ["function approve(address,uint256)"], signer);
    await (await token.approve(shopAddress, price)).wait();

    const shop = new ethers.Contract(shopAddress, ["function buy(uint256,uint256)"], signer);
    await (await shop.buy(2, 1)).wait();

    await loadBalance();
}

// 🌿 STAKE
async function stake() {
    const amount = ethers.utils.parseUnits("100", 18);

    const token = new ethers.Contract(tokenAddress, ["function approve(address,uint256)"], signer);
    await (await token.approve(stakingAddress, amount)).wait();

    const contract = new ethers.Contract(stakingAddress, ["function stake(uint256)"], signer);
    await (await contract.stake(amount)).wait();

    setStatus("Expedição iniciada 🌿");
}

async function claim() {
    const contract = new ethers.Contract(stakingAddress, ["function claim()"], signer);
    await (await contract.claim()).wait();

    await loadBalance();
}

// 🎒 INVENTÁRIO
async function loadInventory() {
    const contract = new ethers.Contract(itemsAddress, ["function balanceOf(address,uint256) view returns(uint256)"], signer);

    const addr = await signer.getAddress();

    const sword = await contract.balanceOf(addr, 1);
    const potion = await contract.balanceOf(addr, 2);

    document.getElementById("inventory").innerText =
        `🗡️ ${sword} | 🧪 ${potion}`;
}

// 🗳️ DAO

const daoAbi = [
    "function createProposal(string)",
    "function vote(uint256)",
    "function proposals(uint256) view returns (string description, uint256 votes)"
];

async function loadAllProposals() {
    try {
        const contract = new ethers.Contract(daoAddress, daoAbi, provider);

        let real = [];
        let i = 0;

        while (true) {
            try {
                const p = await contract.proposals(i);

                real.push({
                    description: p.description,
                    votes: Number(p.votes),
                    id: i
                });

                i++;
            } catch {
                break;
            }
        }

        proposals = real;
        currentIndex = 0;

        if (proposals.length === 0) {
            document.getElementById("proposalTextView").innerText = "Nenhuma proposta ainda";
            document.getElementById("proposalVotes").innerText = "";
            return;
        }

        updateProposalUI();

    } catch (err) {
        console.error(err);
    }
}

function updateProposalUI() {
    if (!proposals.length) return;

    const p = proposals[currentIndex];

    document.getElementById("proposalTextView").innerText = p.description;
    document.getElementById("proposalVotes").innerText = `👍 ${p.votes}`;
}

function nextProposal() {
    if (!proposals.length) return;

    currentIndex = (currentIndex + 1) % proposals.length;
    updateProposalUI();
}

function prevProposal() {
    if (!proposals.length) return;

    currentIndex = (currentIndex - 1 + proposals.length) % proposals.length;
    updateProposalUI();
}

async function supportProposal() {
    try {
        const p = proposals[currentIndex];

        const contract = new ethers.Contract(daoAddress, daoAbi, signer);

        const tx = await contract.vote(p.id);
        await tx.wait();

        setStatus("Voto registrado 👍");

        // RECARREGA DO CONTRATO
        await loadAllProposals();

    } catch (err) {
        console.error(err);
        setStatus("Erro ao votar");
    }
}

async function createProposal() {
    try {
        const text = document.getElementById("proposalText").value;

        const contract = new ethers.Contract(daoAddress, daoAbi, signer);

        const tx = await contract.createProposal(text);
        await tx.wait();

        setStatus("Proposta criada 🗳️");

        // RECARREGA DO CONTRATO
        await loadAllProposals();

    } catch (err) {
        console.error(err);
        setStatus("Erro ao criar proposta");
    }
}

// EVENTOS
connectBtn.onclick = connect;
createBtn.onclick = createPlayer;
faucetBtn.onclick = claimFaucet;
buySwordBtn.onclick = buySword;
buyPotionBtn.onclick = buyPotion;
stakeBtn.onclick = stake;
claimBtn.onclick = claim;
inventoryBtn.onclick = loadInventory;
createProposalBtn.onclick = createProposal;
supportBtn.onclick = supportProposal;
nextProposal.onclick = nextProposal;
prevProposal.onclick = prevProposal;