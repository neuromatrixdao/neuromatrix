import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
    '@solana/web3.js',
  ],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    });
    return config;
  },
};

export default nextConfig;
