# AfroDex Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **Neon Database** - Sign up at https://neon.tech (free PostgreSQL)
3. **Alchemy API Key** - Get at https://www.alchemy.com (free tier)
4. **Contract ABI** - From Etherscan

## Step 1: Setup Neon Database

1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string (DATABASE_URL)
4. Run the SQL migration:
   \`\`\`bash
   psql <DATABASE_URL> < scripts/01-init-database.sql
   \`\`\`

## Step 2: Get Alchemy API Key

1. Go to https://www.alchemy.com
2. Sign up for free
3. Create an app on Ethereum mainnet
4. Copy your API key

## Step 3: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables:
   - `DATABASE_URL` - From Neon
   - `ETHEREUM_RPC_URL` - Alchemy URL with your API key
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` - Your contract address
   - `NEXT_PUBLIC_CHAIN_ID` - 1 (for Ethereum mainnet)
5. Click Deploy

## Step 4: Configure Contract ABI

1. Go to Etherscan: https://etherscan.io/address/0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56#code
2. Copy the Contract ABI (JSON)
3. Create a file `lib/contract-abi.json` with the ABI
4. Update `server.ts` to import the ABI

## Environment Variables

\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Ethereum
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
NEXT_PUBLIC_CHAIN_ID=1

# Frontend
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
\`\`\`

## Testing Locally

\`\`\`bash
# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Visit http://localhost:3000
\`\`\`

## Troubleshooting

### "Contract not initialized"
- Check that CONTRACT_ABI is valid JSON
- Verify CONTRACT_ADDRESS is correct

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check that Neon database is running
- Run migrations: `psql <DATABASE_URL> < scripts/01-init-database.sql`

### "MetaMask connection failed"
- Ensure MetaMask is installed
- Check that you're on Ethereum mainnet
- Verify contract address is correct

## Support

For issues, check:
1. Vercel logs: https://vercel.com/dashboard
2. Browser console for errors
3. Network tab for API calls
