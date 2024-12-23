'use client'

import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
}

const GlowingText: React.FC<GlowingTextProps> = ({ children, className = '' }) => {
  return (
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
};

export default GlowingText;

