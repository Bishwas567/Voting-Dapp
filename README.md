# Decentralized Voting DApp

## Overview
This project is a Hybrid Decentralized Application (DApp) developed using Ethereum blockchain technology. It provides a secure, transparent, and tamper-proof online voting system.

The system allows:
- Admin to add candidates
- Users to cast votes
- Automatic vote counting
- Display of results and winner

---

## Technologies Used
- Solidity (Smart Contract)
- Hardhat (Blockchain development)
- React.js (Frontend)
- Ethers.js (Blockchain interaction)
- MetaMask (Wallet connection)

---

## System Architecture
Frontend (React) → Ethers.js → Smart Contract (Solidity) → Hardhat Blockchain

---

## Features
- Add Candidates (Admin only)
- Start Voting
- Cast Vote (one vote per user)
- End Voting
- Show Winner
- Reset Election

---

## Installation Guide

### Backend Setup
```bash
cd backend
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
