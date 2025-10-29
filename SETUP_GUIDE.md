# AfroDex Exchange Setup Guide

## Overview
AfroDex is a relayer-based DEX (Decentralized Exchange) that allows users to trade ERC20 tokens and ETH on Ethereum. This guide will help you set up the exchange locally and deploy it to Vercel.

## Prerequisites
- Node.js 18+ installed
- MetaMask or another Web3 wallet
- Alchemy account (for Ethereum RPC)
- Neon account (for PostgreSQL database)
- Vercel account (for deployment)

## Step 1: Get Your API Keys

### Alchemy API Key
1. Go to https://www.alchemy.com/
2. Sign up for a free account
3. Create a new app on Ethereum Mainnet
4. Copy your API key

### Neon Database
1. Go to https://neon.tech/
2. Sign up for a free account
3. Create a new project
4. Copy your connection string

## Step 2: Setup Relayer Wallet

The relayer is responsible for executing trades on behalf of users. You need a wallet with some ETH for gas fees.

1. Create a new Ethereum wallet (or use an existing one)
2. Fund it with some ETH for gas fees (0.1 ETH minimum recommended)
3. Export the private key (from MetaMask: Account Details → Export Private Key)
4. **IMPORTANT**: Never commit this to version control!

## Step 3: Local Setup

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd afrodex

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your values:
# - ETHEREUM_RPC_URL: Your Alchemy API key URL
# - DATABASE_URL: Your Neon connection string
# - RELAYER_PRIVATE_KEY: Your relayer wallet private key
# - CONTRACT_ADDRESS: 0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
\`\`\`

## Step 4: Initialize Database

\`\`\`bash
# Run database migrations
npm run db:migrate

# Seed with initial data (optional)
npm run db:seed
\`\`\`

## Step 5: Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 in your browser.

## Step 6: Test the Exchange

1. Connect your MetaMask wallet
2. Select tokens to swap
3. Enter an amount
4. Click "Swap"
5. Sign the order in MetaMask
6. Wait for the transaction to be confirmed

## Step 7: Deploy to Vercel

\`\`\`bash
# Push to GitHub
git push origin main

# In Vercel dashboard:
# 1. Import your GitHub repository
# 2. Add environment variables:
#    - ETHEREUM_RPC_URL
#    - DATABASE_URL
#    - RELAYER_PRIVATE_KEY
#    - CONTRACT_ADDRESS
# 3. Deploy
\`\`\`

## Contract Details

**Contract Address**: 0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
**Network**: Ethereum Mainnet
**Type**: Relayer-based DEX

### Key Functions

- **trade()** - Execute a trade with signature verification
- **order()** - Create an order
- **cancelOrder()** - Cancel an order
- **depositToken()** - Deposit ERC20 tokens
- **withdraw()** - Withdraw ETH
- **balanceOf()** - Check token balance

## Troubleshooting

### "MetaMask not available"
- Make sure MetaMask is installed and enabled
- Refresh the page

### "Trade failed"
- Check that your relayer wallet has enough ETH for gas
- Verify the contract address is correct
- Check the Ethereum RPC URL is valid

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check that Neon database is running
- Run migrations: `npm run db:migrate`

### "Signature verification failed"
- Make sure you're signing with the correct wallet
- Check that the order hasn't expired

## Support

For issues or questions, please open an issue on GitHub or contact the AfroDex team.
