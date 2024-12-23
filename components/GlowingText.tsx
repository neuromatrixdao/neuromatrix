'use client'

import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface GlowingTextProps {
  children: ReactNode;
  className?: string;
}

const GlowingText: FC<GlowingTextProps> = ({ children, className = '' }) => (
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

export default GlowingText;

