# Product Proposal

## What is the product, and who uses it?

AIShield is a privacy-preserving identity verification platform for AI services. Users can prove they are authorized to access premium AI models, APIs, or enterprise tools without revealing their personal identity or credentials. It is designed for individual users, AI developers, businesses, and enterprises that require secure, confidential authentication and access control while protecting sensitive user data.

## Why Midnight specifically?

Traditional blockchains expose transaction and identity information publicly, making them unsuitable for confidential authentication. Midnight enables private witnesses and zero-knowledge proofs, allowing users to prove they possess valid credentials without revealing their identity or sensitive information. Only the authorization result is recorded on the blockchain, ensuring both privacy and trust.

## Data Model

| Data Point                  | Type            | Disclosed To        |
| --------------------------- | --------------- | ------------------- |
| User ID Hash                | Public Ledger   | Everyone            |
| Verification Status         | Public Ledger   | Everyone            |
| Access Level                | Public Ledger   | Everyone            |
| Identity Details            | Private Witness | No one              |
| Government ID / Credentials | Private Witness | No one              |
| API Token / Secret          | Private Witness | No one              |
| Proof of Authorization      | Private Witness | Smart Contract Only |

## Mainnet Feasibility

Yes. The smart contract for confidential identity verification and access control is realistic to complete by Level 6. The core functionality, including private credential verification and secure access management, can be implemented using Midnight's privacy features. Additional enhancements such as a web dashboard, enterprise integrations, multi-factor authentication, and AI service connectivity can be developed after the core blockchain infrastructure is complete.

