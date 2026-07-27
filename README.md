# Midnight Bulletin Board DApp — Level 3 (First Quarter)

[![CI](https://github.com/VishvaRaj382/midnight-level-3/actions/workflows/ci.yml/badge.svg)](https://github.com/VishvaRaj382/midnight-level-3/actions/workflows/ci.yml)

> A production-grade privacy-preserving Bulletin Board dApp built on the Midnight network featuring zero-knowledge proofs, unit tests, automated CI/CD, and Lace wallet integration on Preprod testnet.

## Live Demo
[https://midnight-level-3.netlify.app](https://midnight-level-3.netlify.app)

## Contract Address
| Network  | Address                                                          |
|----------|------------------------------------------------------------------|
| Preprod  | `020084f7b494665427ecff72bb4bf2b91cbfdcba3b6bd6539bfbc14b62dbb7ed` |

## What This Does
A production-grade decentralized application built on the **Midnight Network**. Users can post messages to a shared bulletin board and take down their own posted messages. All state updates produce zero-knowledge proofs (ZKPs) locally in the browser via the Midnight.js SDK and Lace Wallet DApp connector API before submitting transactions on-chain.

## Privacy Model
- **PUBLIC (on-chain, visible to anyone)**: Current bulletin board occupancy state, post sequence number, and active message content.
- **PRIVATE (private witness, never on-chain)**: User's secret key (`secretKey`), raw signature credentials, and private witness inputs.
- **PROVED without revealing**: The caller owns the secret key matching the board's posted owner without disclosing the secret key itself on-chain.

## Privacy Claim
An on-chain observer can inspect public board state updates and verify ZK proof validity, but **cannot derive or reconstruct the poster's secret key or private credentials**.

## Tech Stack
- **Midnight Network & Compact Smart Contract Language (v0.31.0)**
- **Midnight.js SDK & Lace Wallet DApp Connector API**
- **React + TypeScript + Vite + Material UI**
- **Vitest Unit Testing Suite & GitHub Actions CI/CD**

## Prerequisites
- **Node.js v22+**
- **Docker Desktop** (running `midnightnetwork/proof-server:8.0.3` locally on port `6300`)
- **Lace Wallet Chrome Extension** (configured to **Preprod** network)

## Setup & Run Locally
1. **Clone repository**:
   ```bash
   git clone https://github.com/VishvaRaj382/midnight-level-3.git
   cd midnight-level-3
   ```
2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Build contract & frontend**:
   ```bash
   npm --prefix contract run build
   npm --prefix bboard-ui run build
   ```
4. **Start local dev server**:
   ```bash
   npm --prefix bboard-ui run dev
   ```

## Run Tests
Run the contract unit test suite:
```bash
npm --prefix contract run test -- --run
```
*(9 passing unit tests covering circuit logic, state transitions, and zero-knowledge privacy).*

## CI/CD
The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on every `push` to `main` and every `pull_request`. It compiles the Compact smart contract, executes the unit test suite, and builds the frontend application.

## Product Proposal
See [PROPOSAL.md](PROPOSAL.md) for full product architecture, data model, and mainnet feasibility roadmap.
