# AfroDex - Supabase Setup Guide

## Quick Start with Supabase (Recommended)

Supabase is a PostgreSQL database with a free tier perfect for AfroDex. It's reliable, scalable, and integrates seamlessly with Vercel.

### Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new organization

### Step 2: Create a New Project

1. Click "New Project"
2. Enter project name: `afrodex`
3. Create a strong password (save this!)
4. Select region closest to you
5. Click "Create new project"

Wait for the project to initialize (2-3 minutes).

### Step 3: Get Your Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Under "Connection string", select **URI** tab
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with the password you created
5. It should look like:
   \`\`\`
   postgresql://postgres:YOUR_PASSWORD@db.XXXXX.supabase.co:5432/postgres
   \`\`\`

### Step 4: Add to Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.XXXXX.supabase.co:5432/postgres
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
CONTRACT_ADDRESS=0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe8fff15bb5e14095bfdfa8bb85d83cc900c23c56
NEXT_PUBLIC_CHAIN_ID=1
RELAYER_PRIVATE_KEY=your_relayer_private_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

### Step 5: Run Database Migrations

\`\`\`bash
# Install dependencies
npm install

# Run migrations to create tables
npm run db:migrate
\`\`\`

### Step 6: Get Alchemy API Key

1. Go to https://www.alchemy.com/
2. Sign up for free
3. Create an app on Ethereum mainnet
4. Copy your API key
5. Add to `.env.local`:
   \`\`\`
   ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   \`\`\`

### Step 7: Create Relayer Wallet

The relayer wallet executes trades on behalf of users:

\`\`\`bash
# Generate a new wallet
node -e "const ethers = require('ethers'); const wallet = ethers.Wallet.createRandom(); console.log('Address:', wallet.address); console.log('Private Key:', wallet.privateKey);"
\`\`\`

1. Copy the private key
2. Add to `.env.local`:
   \`\`\`
   RELAYER_PRIVATE_KEY=your_private_key_here
   \`\`\`
3. Fund this wallet with some ETH for gas fees (0.1 ETH recommended)

### Step 8: Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000 and connect your MetaMask wallet!

---

## Supabase Free Tier Limits

- **Storage**: 500 MB
- **Bandwidth**: 2 GB/month
- **Database connections**: Up to 10
- **API requests**: Unlimited
- **Real-time subscriptions**: Included

Perfect for development and small production apps!

---

## Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Vercel will automatically detect it's a Next.js app and configure everything.

---

## Troubleshooting

### Connection Refused
- Check your DATABASE_URL is correct
- Verify password is correct
- Make sure Supabase project is active

### Migrations Failed
- Check database connection
- Ensure you have write permissions
- Try running migrations again

### Need Help?
- Supabase Docs: https://supabase.com/docs
- AfroDex Support: Check GitHub issues
