# AfroDex - Quick Start Guide

## What You Have

A fully functional DEX (Decentralized Exchange) frontend and backend with:
- MetaMask wallet integration
- Token swap interface
- Real-time price updates
- Trade execution with signature verification
- Transaction history tracking
- Beautiful dark theme with AfroDex branding

## 5-Minute Setup

### 1. Get Alchemy API Key (2 minutes)

1. Go to https://www.alchemy.com/
2. Click "Sign Up"
3. Create account with email
4. Create a new app on Ethereum mainnet
5. Copy your API key

### 2. Create Supabase Database (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project named "afrodex"
5. Go to Settings → Database → Connection string (URI)
6. Copy the connection string and replace `[YOUR-PASSWORD]` with your password

### 3. Setup Environment Variables (1 minute)

Create `.env.local` in your project root:

\`\`\`env
# Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.XXXXX.supabase.co:5432/postgres

# Ethereum RPC
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Contract
CONTRACT_ADDRESS=0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
NEXT_PUBLIC_CHAIN_ID=1

# Relayer (generate new wallet)
RELAYER_PRIVATE_KEY=your_private_key_here

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### 4. Generate Relayer Wallet

\`\`\`bash
node -e "const ethers = require('ethers'); const wallet = ethers.Wallet.createRandom(); console.log('Address:', wallet.address); console.log('Private Key:', wallet.privateKey);"
\`\`\`

Copy the private key to `.env.local`

### 5. Run Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000 and connect MetaMask!

---

## Frontend Features

### Header
- AfroDex logo
- Navigation (Swap, Liquidity, Analytics)
- Wallet connection status
- Disconnect button

### Swap Interface
- Token input with amount
- Token selector dropdown
- Reverse swap button
- Real-time price calculation
- Swap button with loading state
- Error handling

### Wallet Connection
- MetaMask integration
- Address display (truncated)
- Connection status
- Error messages

---

## Backend API Endpoints

### POST /api/price
Get price for token swap
\`\`\`json
{
  "tokenIn": "ETH",
  "tokenOut": "USDC",
  "amountIn": "1.0"
}
\`\`\`

### POST /api/orders/create
Create a new order
\`\`\`json
{
  "tokenGet": "USDC",
  "amountGet": "1000000000000000000",
  "tokenGive": "0x0000000000000000000000000000000000000000",
  "amountGive": "1000000000000000000",
  "userAddress": "0x..."
}
\`\`\`

### POST /api/trade
Execute a trade
\`\`\`json
{
  "tokenGet": "USDC",
  "amountGet": "1000000000000000000",
  "tokenGive": "0x0000000000000000000000000000000000000000",
  "amountGive": "1000000000000000000",
  "expires": 1234567890,
  "nonce": 1,
  "userAddress": "0x...",
  "signature": "0x..."
}
\`\`\`

### POST /api/balance
Get user balance
\`\`\`json
{
  "userAddress": "0x...",
  "token": "USDC"
}
\`\`\`

### POST /api/deposit
Deposit tokens
\`\`\`json
{
  "token": "USDC",
  "amount": "1000000000000000000",
  "userAddress": "0x..."
}
\`\`\`

---

## Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables
5. Deploy!

---

## Support

- Supabase Docs: https://supabase.com/docs
- Ethers.js Docs: https://docs.ethers.org
- Next.js Docs: https://nextjs.org/docs
- AfroDex Contract: https://etherscan.io/address/0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
\`\`\`
