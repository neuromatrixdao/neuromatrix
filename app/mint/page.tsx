'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import GlowingText from '@/components/GlowingText';
import { useRouter } from 'next/navigation';

const MintPage: FC = () => {
  const { connected, publicKey } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [nftAddress, setNftAddress] = useState<string | null>(null);
  const router = useRouter();

  const mintNFT = async () => {
    if (!connected || !publicKey) return;

    setIsMinting(true);
    try {
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mint NFT');
      }

      const data = await response.json();
      setNftAddress(data.nftAddress);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-green-500 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-black/50 backdrop-blur-sm border border-green-500 p-8 rounded-lg shadow-lg"
      >
        <GlowingText className="text-3xl text-center mb-8">NeuroMatrix Pass NFT</GlowingText>
        
        {!connected ? (
          <div className="text-center">
            <p className="mb-4">Connect your wallet to mint your NeuroMatrix Pass NFT</p>
            <WalletMultiButton className="!bg-green-500 !text-black hover:!bg-green-400 transition-colors" />
          </div>
        ) : (
          <div>
            {publicKey && (
              <p className="mb-4 text-center">Wallet connected: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</p>
            )}
            {!nftAddress ? (
              <div>
                <div className="mb-6 text-center">
                  <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden border-2 border-green-500">
                    <img
                      src="/neuromatrixpass.jpeg"
                      alt="NeuroMatrix Pass NFT Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {isMinting ? (
                  <div className="text-center">
                    <p>Minting your unique NeuroMatrix Pass NFT...</p>
                    <div className="loader mt-4"></div>
                  </div>
                ) : (
                  <button
                    onClick={mintNFT}
                    className="w-full bg-green-500 text-black py-2 rounded hover:bg-green-400 transition-colors"
                  >
                    Mint NeuroMatrix Pass NFT
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <GlowingText className="text-xl mb-4">NeuroMatrix NFT Minted!</GlowingText>
                <p className="mb-2">NFT Address: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}</p>
                <p className="mb-6 text-sm">Your unique NeuroMatrix identity is now secured on the Solana blockchain.</p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => router.push(`/nft/${nftAddress}`)}
                    className="w-full bg-green-500 text-black py-2 rounded hover:bg-green-400 transition-colors"
                  >
                    View NFT Details
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .loader {
          border: 2px solid #000;
          border-top: 2px solid #22c55e;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MintPage; 