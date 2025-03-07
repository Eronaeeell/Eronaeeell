let account;
const CONTRACT_ADDRESS = "0x774E06F66A919989e1b5b443AFA6a5629A88d479"; // Replace with your deployed contract address
const ABI = [
    {
        "inputs": [],
        "name": "sendETH",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address payable", "name": "user", "type": "address" }],
        "name": "sendETHtoUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            account = accounts[0];
            document.getElementById("status").innerText = `Connected: ${account}`;
            document.getElementById("sendButton").disabled = false;
            document.getElementById("withdrawButton").disabled = false;
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    } else {
        alert("MetaMask is required.");
    }
}

// ✅ User Deposits 0.01 ETH into Contract
async function sendETH() {
    if (!account) {
        alert("Please connect your wallet first!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
        const tx = await contract.sendETH({ value: ethers.utils.parseEther("0.01") });

        document.getElementById("status").innerText = `Sending ETH... TX: ${tx.hash}`;
        await tx.wait();
        document.getElementById("status").innerText = "ETH Sent Successfully ✅";
        showSection('smart-contract-module');
    } catch (error) {
        console.error(error);
        document.getElementById("status").innerText = "Transaction failed ❌";
    }
}

// ✅ Admin Sends 0.01 ETH from Contract to User
async function withdrawETHToUser() {
    if (!account) {
        alert("Please connect your wallet first!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const userAddress = "0x16f2e725E6c6d3935Da212093690F21C07Fb9d27"; // Replace with actual user address

    try {
        const tx = await contract.sendETHtoUser(userAddress);
        
        document.getElementById("status").innerText = `Withdrawing ETH... TX: ${tx.hash}`;
        await tx.wait();
        document.getElementById("status").innerText = "ETH Withdrawn Successfully ✅";
        showSection('course-grid-section');
    } catch (error) {
        console.error(error);
        document.getElementById("status").innerText = "Withdrawal failed ❌";
    }
}
