'use client'

import React from 'react'

interface GlitchProgressBarProps {
  value: number
  maxValue: number
}

const GlitchProgressBar: React.FC<GlitchProgressBarProps> = ({ value, maxValue }) => {
  const percentage = (value / maxValue) * 100

  return (
    <div className="w-full h-2 bg-black border border-green-400 relative overflow-hidden">
      <div
        className="h-full bg-green-400 transition-all duration-300 relative"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 glitch-effect"></div>
      </div>

      <style jsx>{`
        .glitch-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 255, 0, 0.5),
            transparent
          );
          animation: glitch 1s linear infinite;
        }

        @keyframes glitch {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export default GlitchProgressBar

