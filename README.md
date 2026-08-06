# Midnight Bulletin Board DApp
[![CI](https://github.com/VishvaRaj382/midnight-level-3/actions/workflows/ci.yml/badge.svg)](https://github.com/VishvaRaj382/midnight-level-3/actions/workflows/ci.yml)
> A production-grade privacy-preserving Bulletin Board dApp built on the Midnight network featuring zero-knowledge proofs, comprehensive test suite, CI/CD pipeline, and Lace Wallet integration.

## Live Demo
[https://midnight-level-3-ecru.vercel.app]

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `020084f7b494665427ecff72bb4bf2b91cbfdcba3b6bd6539bfbc14b62dbb7ed` |

## What This Does
A decentralized application built on the **Midnight Network**. Users can post messages to a shared bulletin board and take down their own posted messages. All state updates produce zero-knowledge proofs (ZKPs) locally in the browser via the Midnight.js SDK and Lace Wallet DApp connector API before submitting transactions on-chain.

## Privacy Model
- **PUBLIC**: Current bulletin board state (`VACANT` or `OCCUPIED`), post sequence counter, and active message content on the public ledger.
- **PRIVATE**: User's local secret key (`secretKey`), witness state, and private credentials which remain strictly on the user's client.
- **PROVED without revealing**: The poster/caller holds the authorized secret key matching the active post owner without disclosing the secret key on-chain.

## Privacy Claim
What an on-chain observer sees vs cannot see:
- **An on-chain observer sees**: Public board state transitions, current message text, and valid zero-knowledge proofs verifying state validity.
- **An on-chain observer CANNOT see**: The poster's secret key, private witness data, or private signing credentials.

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
3. **Build contract & application**:
   ```bash
   npm run build
   ```
4. **Start local dev server**:
   ```bash
   npm run dev
   ```

## Run Tests
```bash
npm test
```

## CI/CD
The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on every `push` to `main` and every `pull_request`. It checks out the repository, sets up Node.js v22, installs dependencies, compiles the Compact smart contract (`npm run compact`), executes the full unit test suite (`npm test`), and builds the production dApp bundle (`npm run build`).

## Product Proposal
See [PROPOSAL.md](PROPOSAL.md) for full product architecture, data model, and mainnet feasibility roadmap.
