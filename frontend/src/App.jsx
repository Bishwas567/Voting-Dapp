import { useState } from "react";
import { ethers } from "ethers";
import Voting from "./contracts/Voting.json";
import { contractAddress } from "./contracts/contractAddress";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const votingContract = new ethers.Contract(
      contractAddress,
      Voting.abi,
      signer
    );

    setContract(votingContract);
    loadCandidates(votingContract);
  }

  async function loadCandidates(votingContract = contract) {
    if (!votingContract) return;

    const count = await votingContract.candidatesCount();
    const candidateList = [];

    for (let i = 1; i <= Number(count); i++) {
      const candidate = await votingContract.getCandidate(i);

      candidateList.push({
        id: Number(candidate[0]),
        name: candidate[1],
        votes: Number(candidate[2]),
      });
    }

    setCandidates(candidateList);
  }

  async function addCandidate() {
    const name = prompt("Enter candidate name:");
    if (!name) return;

    const tx = await contract.addCandidate(name);
    await tx.wait();

    alert("Candidate added");
    loadCandidates();
  }

  async function startVoting() {
    const tx = await contract.startVoting();
    await tx.wait();

    alert("Voting started");
  }

  async function endVoting() {
    const tx = await contract.endVoting();
    await tx.wait();

    alert("Voting ended");
    loadCandidates();
  }

  async function vote(candidateId) {
    const tx = await contract.vote(candidateId);
    await tx.wait();

    alert("Vote submitted");
    loadCandidates();
  }

  async function showWinner() {
    const result = await contract.getWinner();

    setWinner(`Winner: ${result[0]} with ${Number(result[1])} votes`);
  }

  async function resetElection() {
    const tx = await contract.resetElection();
    await tx.wait();

    setCandidates([]);
    setWinner("");
    alert("Election reset");
  }

  return (
    <div className="container">
      <h1>Decentralized Online Voting Platform</h1>

      <button onClick={connectWallet}>Connect Wallet</button>

      {account && <p>Connected Wallet: {account}</p>}

      {contract && (
        <div>
          <h2>Admin Panel</h2>

          <button onClick={addCandidate}>Add Candidate</button>
          <button onClick={startVoting}>Start Voting</button>
          <button onClick={endVoting}>End Voting</button>
          <button onClick={showWinner}>Show Winner</button>
          <button onClick={resetElection}>Reset Election</button>
          <button onClick={() => loadCandidates()}>Refresh Results</button>

          {winner && <h2>{winner}</h2>}

          <h2>Candidates / Results</h2>

          {candidates.length === 0 ? (
            <p>No candidates added yet.</p>
          ) : (
            candidates.map((candidate) => (
              <div className="candidate-card" key={candidate.id}>
                <h3>{candidate.name}</h3>
                <p>Votes: {candidate.votes}</p>
                <button onClick={() => vote(candidate.id)}>Cast Vote</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;