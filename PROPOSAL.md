# Product Proposal

## What is the product, and who uses it?

**PrivateAge** is a privacy-preserving age and eligibility verification dApp built on the Midnight Network.

The product allows users to prove that they satisfy an age requirement, such as being 18 or older, without publicly revealing their exact age, date of birth, or other unnecessary personal information.

A user provides their age-related information privately, and the application uses a zero-knowledge proof to verify whether the required age threshold is satisfied.

Potential users include online platforms, event organizers, membership services, gaming platforms, marketplaces, and other applications that need to verify whether a user meets an age or eligibility requirement while minimizing exposure of personal information.

## Why Midnight specifically?

Traditional blockchains are transparent, which makes them unsuitable for storing sensitive information such as a person's date of birth or exact age.

Midnight enables the application to separate public and private information and use zero-knowledge proofs to verify eligibility without revealing the underlying private data.

For example, instead of publishing:

"Date of Birth: 15 March 2004"

the user can prove only:

"Age requirement ≥ 18: VERIFIED"

The user's underlying age or date-of-birth information remains private while the verification result can be independently validated.

This selective-disclosure model is the primary reason PrivateAge benefits from Midnight rather than a fully transparent blockchain.

## Data Model

| Data Point                      | Type               | Disclosed To |
| ------------------------------- | ------------------ | ------------ |
| Required age threshold          | Public ledger      | Everyone     |
| Verification result             | Public ledger      | Everyone     |
| Verification identifier/hash    | Public ledger      | Everyone     |
| User's date of birth / age data | Private witness    | No one       |
| Private proof inputs            | Private witness    | No one       |
| Wallet private credentials      | Private local data | No one       |

The user proves that their private age information satisfies the publicly defined eligibility threshold without revealing the underlying age or date-of-birth information.

## Mainnet Feasibility

PrivateAge is realistic to develop toward a Mainnet-ready MVP by Level 6.

The core functionality can be implemented with a Compact smart contract containing a public eligibility threshold and private witness data representing the user's age-related information. A circuit can determine whether the private value satisfies the required threshold and disclose only the verification result.

Level 4 can implement the working privacy-preserving eligibility MVP and deploy it to Preprod. Level 5 can collect user feedback and improve the verification experience. Level 6 can incorporate those improvements, strengthen the user experience and documentation, and prepare the product for a production-oriented launch.

A future production version could also integrate trusted credential issuers so that users prove eligibility using verified credentials rather than simply providing age information themselves.
