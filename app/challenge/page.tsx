'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import GlowingText from '@/components/GlowingText';
import { useRouter } from 'next/navigation';

const ChallengePage: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-green-500 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-black/50 backdrop-blur-sm border border-green-500 p-8 rounded-lg shadow-lg"
      >
        <GlowingText className="text-3xl text-center mb-8">Neural Challenge</GlowingText>
        <div className="space-y-6">
          <p className="text-xl text-center">
            Complete the neural challenge to proceed with minting your NeuroMatrix Pass NFT.
          </p>
          <div className="text-center">
            <button
              onClick={() => router.push('/mint')}
              className="bg-green-500 text-black px-8 py-2 rounded hover:bg-green-400 transition-colors"
            >
              Proceed to Minting
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChallengePage; 