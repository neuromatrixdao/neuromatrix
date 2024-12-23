'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlowingText from './GlowingText';

// Mock functions for wallet connection and NFT minting
const connectWallet = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'DummyWalletAddress123456789';
};

const mintNFT = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return 'DummyNFTAddress987654321';
};

interface SolanaNFTMinterProps {
  isCorrect: boolean;
}

const SolanaNFTMinter: React.FC<SolanaNFTMinterProps> = ({ isCorrect }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [nftAddress, setNftAddress] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const handleMintNFT = useCallback(async () => {
    if (!walletAddress) return;

    setIsMinting(true);
    try {
      const address = await mintNFT();
      setNftAddress(address);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isCorrect && walletAddress && !nftAddress) {
      handleMintNFT();
    }
  }, [isCorrect, walletAddress, nftAddress, handleMintNFT]);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (!isCorrect) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-4 border border-green-500 rounded-lg"
    >
      <GlowingText className="text-xl mb-4">Neural Link Established</GlowingText>
      {!walletAddress ? (
        <button
          onClick={handleConnectWallet}
          className="w-full bg-green-500 text-black py-2 rounded hover:bg-green-400 transition-colors"
        >
          Connect Solana Wallet
        </button>
      ) : (
        <div>
          <p className="mb-2">Wallet connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          {!nftAddress ? (
            <div>
              {isMinting ? (
                <div className="text-center">
                  <p>Minting your unique NeuroMatrix NFT...</p>
                  <div className="loader mt-2"></div>
                </div>
              ) : (
                <p>Initiating NFT minting process...</p>
              )}
            </div>
          ) : (
            <div>
              <GlowingText className="text-lg mb-2">NeuroMatrix NFT Minted!</GlowingText>
              <p>NFT Address: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}</p>
              <p className="mt-2 text-sm">Your unique NeuroMatrix identity is now secured on the Solana blockchain.</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SolanaNFTMinter;

