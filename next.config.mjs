/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true is fine.
  reactStrictMode: true, 

  // --- START CLEANUP ---
  // The 'swcMinify' key is removed as it is the default behavior now.
  // The 'eslint' block is removed as it is deprecated.
  // --- END CLEANUP ---

  // Keep: Configuration for image optimization
  images: {
    unoptimized: true,
  },
  
  // Keep: Environmental variables (Crucial for contracts and chain ID)
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  },
  
  // Keep: TypeScript configuration (Good to ignore build errors during development/testing)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
