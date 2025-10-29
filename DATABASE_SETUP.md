# AfroDex Database Setup Guide

## Option 1: Supabase (Recommended - Free PostgreSQL)

Supabase is a PostgreSQL database with a generous free tier and excellent Vercel integration.

### Setup Steps:

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with GitHub or email
   - Create a new project

2. **Get Connection String**
   - In Supabase dashboard, go to Settings → Database
   - Copy the "Connection string" (URI format)
   - It will look like: `postgresql://user:password@host:5432/postgres`

3. **Add to Environment Variables**
   \`\`\`
   DATABASE_URL=postgresql://user:password@host:5432/postgres
   \`\`\`

4. **Run Migrations**
   \`\`\`bash
   npm run db:migrate
   \`\`\`

### Free Tier Limits:
- 500 MB database storage
- Up to 2 projects
- Unlimited API requests
- Perfect for development and small production apps

---

## Option 2: MongoDB Atlas (Free NoSQL)

If you prefer NoSQL, MongoDB Atlas offers a free tier.

### Setup Steps:

1. **Create MongoDB Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a cluster

2. **Get Connection String**
   - In MongoDB Atlas, go to Databases → Connect
   - Choose "Drivers" and copy the connection string
   - It will look like: `mongodb+srv://user:password@cluster.mongodb.net/database`

3. **Add to Environment Variables**
   \`\`\`
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
   \`\`\`

### Free Tier Limits:
- 512 MB storage
- Shared cluster
- Perfect for development

---

## Option 3: PlanetScale (Free MySQL)

PlanetScale offers free MySQL hosting with Vercel integration.

### Setup Steps:

1. **Create PlanetScale Account**
   - Go to https://planetscale.com
   - Sign up with GitHub
   - Create a new database

2. **Get Connection String**
   - In PlanetScale dashboard, go to Connect
   - Copy the connection string
   - It will look like: `mysql://user:password@host/database`

3. **Add to Environment Variables**
   \`\`\`
   DATABASE_URL=mysql://user:password@host/database
   \`\`\`

### Free Tier Limits:
- 5 GB storage
- 1 billion row reads/month
- 10 million row writes/month

---

## Recommended: Supabase

We recommend **Supabase** because:
- PostgreSQL is more robust for financial/trading data
- Built-in authentication support
- Real-time subscriptions
- Excellent Vercel integration
- Free tier is generous for development

All migration scripts are already prepared for PostgreSQL. If you choose MongoDB or PlanetScale, you'll need to adapt the SQL scripts to their respective query languages.
\`\`\`

```env file="" isHidden
