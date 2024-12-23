'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import GlowingText from './GlowingText';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  symbol: string;
  collection?: string;
  updateAuthority: string;
  mintAddress: string;
}

export default function NFTDetails() {
  const params = useParams();
  const { connected } = useWallet();
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTMetadata = useCallback(async () => {
    if (!params.address) return;

    setLoading(true);
    setError(null);

    try {
      // Validate the address
      new PublicKey(params.address);

      const response = await fetch(`/api/nft/${params.address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NFT metadata');
      }

      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error('Error fetching NFT metadata:', err);
      setError('Failed to load NFT details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [params.address]);

  useEffect(() => {
    fetchNFTMetadata();
  }, [fetchNFTMetadata]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col items-center justify-center">
        <GlowingText className="text-2xl mb-6">Connect your wallet to view NFT details</GlowingText>
        <WalletMultiButton className="!bg-green-500 !text-black hover:!bg-green-400 transition-colors" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col items-center justify-center">
        <GlowingText className="text-2xl mb-4">Loading NFT Data</GlowingText>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col items-center justify-center">
        <GlowingText className="text-2xl mb-4">Error</GlowingText>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col items-center justify-center">
        <GlowingText className="text-2xl mb-4">NFT Not Found</GlowingText>
        <p className="text-center">The requested NFT could not be found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/50 backdrop-blur-sm border border-green-500 p-8 rounded-lg shadow-lg"
        >
          <GlowingText className="text-3xl text-center mb-8">{metadata.name}</GlowingText>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm">{metadata.description}</p>
            </div>

            <div className="space-y-6">
              <div>
                <GlowingText className="text-xl mb-4">Attributes</GlowingText>
                <div className="grid grid-cols-1 gap-4">
                  {metadata.attributes.map((attr, index) => (
                    <motion.div
                      key={attr.trait_type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-green-500/50 p-4 rounded-lg"
                    >
                      <div className="text-sm text-green-400">{attr.trait_type}</div>
                      <div className="text-lg">{attr.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <GlowingText className="text-xl mb-4">Details</GlowingText>
                <div className="space-y-2 text-sm">
                  <p>NFT Address: {metadata.mintAddress}</p>
                  <p>Collection: {metadata.collection || 'N/A'}</p>
                  <p>Symbol: {metadata.symbol}</p>
                  <p>Update Authority: {metadata.updateAuthority}</p>
                  <button
                    onClick={fetchNFTMetadata}
                    className="mt-4 w-full bg-green-500 text-black py-2 rounded hover:bg-green-400 transition-colors"
                  >
                    Refresh Metadata
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .loader {
          border: 2px solid #000;
          border-top: 2px solid #22c55e;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 