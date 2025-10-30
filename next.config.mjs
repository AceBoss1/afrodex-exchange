/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode is now enabled by default in Next.js 13+
  // swcMinify is now enabled by default and should be removed.
  // The top-level 'eslint' object is deprecated and should be configured via .eslintrc.js
  
  // NOTE: I am removing 'reactStrictModeMode', 'swcMinify', and 'eslint' keys 
  // to resolve the Unrecognized Key warnings.

  typescript: {
    // This setting prevents build failure if there are TypeScript errors, 
    // but it's generally best practice to set it to false (default) 
    // once you are confident in your code quality.
    ignoreBuildErrors: true, 
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
  },
};

export default nextConfig;
