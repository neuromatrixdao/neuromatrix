'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const NeuroMatrixGateway: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [nftAddress, setNftAddress] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [latestTask, setLatestTask] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    fetchGlobalCounter();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const matrix = "アイウエオカキクケコサシスセソタチツトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    let animationFrameId: number;
    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const fetchGlobalCounter = async () => {
    try {
      const response = await fetch('/api/counter');
      const data = await response.json();
      if (data.counter) {
        setAttempts(data.counter.attempts);
      }
      if (data.latestTask) {
        setLatestTask(data.latestTask.content);
      }
    } catch (error) {
      console.error('Failed to fetch counter:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setAttempts(prev => prev + 1);
    
    try {
      const response = await fetch('/api/counter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      if (data.counter) {
        if (data.counter.attempts !== attempts + 1) {
          setAttempts(data.counter.attempts);
        }
      }
      if (data.latestTask) {
        setLatestTask(data.latestTask.content);
      }
    } catch (error) {
      console.error('Failed to increment counter:', error);
    } finally {
      setIsSubmitting(false);
    }
    
    if (answer.toLowerCase() === 'red') {
      setIsCorrect(true);
    } else {
      const form = document.getElementById('riddleForm');
      form?.classList.add('shake');
      setTimeout(() => form?.classList.remove('shake'), 500);
    }
  };

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

  const GlowingText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
      className={`relative ${className}`}
      animate={{
        textShadow: [
          '0 0 4px #0F0',
          '0 0 8px #0F0',
          '0 0 12px #0F0',
          '0 0 8px #0F0',
          '0 0 4px #0F0'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden flex flex-col">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full" />
      
      <main className="relative z-10 container mx-auto px-4 py-8 flex-grow flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto w-full flex flex-col"
        >
          <GlowingText className="text-3xl text-center mb-6">
            NeuroMatrix Gateway
          </GlowingText>

          <div className="bg-black/50 backdrop-blur-sm border border-green-500 p-6 rounded-lg shadow-lg flex-grow flex flex-col">
            <GlowingText className="text-xl text-center mb-8">
              To those who seek enlightenment in the digital realm, solve this neural puzzle to proceed deeper into the Matrix.
            </GlowingText>

            <div className="space-y-6 text-center flex-grow flex flex-col justify-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg mb-4"
              >
                What color pill reveals the truth of our reality?
              </motion.p>

              <form 
                id="riddleForm"
                onSubmit={handleSubmit} 
                className="space-y-4"
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-black/50 border border-green-500 text-green-500 text-center p-2 rounded"
                  placeholder="Enter your answer"
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-green-500 text-black py-2 rounded hover:bg-green-400 transition-colors relative ${
                    isSubmitting ? 'opacity-90' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Submit</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="loader w-5 h-5 border-2"></div>
                      </div>
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>

              <div className="flex justify-between items-center text-sm">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-green-500 hover:text-green-400"
                  disabled={isSubmitting}
                >
                  Need a hint?
                </button>
                <div className="flex gap-4">
                  <motion.span
                    key={attempts}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3 }}
                  >
                    Attempts: {attempts}
                  </motion.span>
                  <span>|</span>
                  <span>Status: {isCorrect ? 'Access Granted' : 'Pending'}</span>
                </div>
              </div>

              {latestTask && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 p-4 border border-green-500/50 rounded"
                >
                  <p className="text-sm">Latest Task: {latestTask}</p>
                </motion.div>
              )}

              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-green-400/80 mt-4"
                  >
                    Hint: Remember Neo&apos;s choice in the first Matrix movie
                  </motion.div>
                )}
              </AnimatePresence>

              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 p-4 border border-green-500 rounded-lg"
                >
                  <GlowingText className="text-xl mb-4">Neural Link Established</GlowingText>
                  {!connected ? (
                    <div className="flex justify-center">
                      <WalletMultiButton className="!bg-green-500 !text-black hover:!bg-green-400 transition-colors" />
                    </div>
                  ) : (
                    <div>
                      {publicKey && (
                        <p className="mb-2">Wallet connected: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</p>
                      )}
                      {!nftAddress ? (
                        <div>
                          <div className="mb-4 text-center">
                            <h3 className="text-lg mb-2">NeuroMatrix Pass NFT</h3>
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
                              <div className="loader mt-2"></div>
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
                        <div>
                          <GlowingText className="text-lg mb-2">NeuroMatrix NFT Minted!</GlowingText>
                          <p>NFT Address: {nftAddress.slice(0, 6)}...{nftAddress.slice(-4)}</p>
                          <p className="mt-2 text-sm">Your unique NeuroMatrix identity is now secured on the Solana blockchain.</p>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4"
                          >
                            <a
                              href={`/nft/${nftAddress}`}
                              className="block w-full bg-green-500 text-black py-2 rounded hover:bg-green-400 transition-colors text-center"
                            >
                              View NFT Details
                            </a>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">1,337</div>
              <div className="text-sm">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm">Enlightened</div>
            </div>
          </div>
        </motion.div>
      </main>

      <style jsx>{`
        .loader {
          border: 2px solid #000;
          border-top: 2px solid transparent;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default NeuroMatrixGateway;

