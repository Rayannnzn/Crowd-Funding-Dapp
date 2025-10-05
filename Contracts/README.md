
# 💰 FundMe (Chainlink Price Feeds)

A decentralized crowdfunding contract built in Solidity.  
Users can send ETH to the contract, but only if it’s worth at least **$5 USD** (using live Chainlink Price Feeds).  
The owner of the contract can later withdraw the funds.  

---

## 📌 Features
- Enforces a **minimum funding threshold** in USD (`$5`)
- Integrates with **Chainlink Price Feeds** for reliable ETH/USD conversion
- Tracks all funders and their contributions
- Provides two withdrawal methods:
  - `withdraw()` → standard loop
  - `cheaperWithdraw()` → gas optimized
- Uses **custom errors** (`FundMe__NotOwner`) instead of `require` strings
- `onlyOwner` modifier to restrict withdrawals

---

## 🛠️ Tech Stack
- Solidity `^0.8.18`
- [Foundry](https://book.getfoundry.sh/) (Forge & Cast)
- [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds/addresses)
- Custom **PriceConverter library** for ETH → USD conversions

---

# About

This is a Crowd Sourcing App.This is a smart contract project built using **Solidity** and tested with **Foundry**, focused on creating a decentralized crowdfunding (FundMe) solution. It allows users to fund the contract and the owner to withdraw the funds.


# Getting Started

This section will help you get the project up and running on your local machine for development and testing purposes.

---

## Requirements

Before you begin, make sure you have the following installed:

- [Foundry](https://book.getfoundry.sh/getting-started/installation) – for smart contract development and testing
- [Git](https://git-scm.com/) – for cloning the repository
- [Node.js & npm](https://nodejs.org/) – *(Optional, if using frontend or JavaScript tools)*
- A code editor like [VS Code](https://code.visualstudio.com/)
- An Ethereum wallet (e.g. MetaMask) if deploying to a testnet

---

## QuickStart

```
cd https://github.com/Rayannnzn/Foundry-FundMe-F25
cd Foundry-FundMe-F25
forge build 
```




---

## 🚀 Features

- Fund the contract with ETH ✅
- Track funders and their contributions ✅
- Owner-only withdrawal function ✅
- Gas-optimized and secure ✅
- Thoroughly tested with Foundry ✅

---

## 🧪 Running Tests

Make sure Foundry is installed. Then, to run tests:

```bash
forge test
