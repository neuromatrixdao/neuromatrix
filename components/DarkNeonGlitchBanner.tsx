'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function DarkNeonGlitchBanner() {
  const router = useRouter()

  const handleChatClick = () => {
    window.open('https://agent.neurotrinity.xyz/', '_blank')
  }

  return (
    <div className="relative w-full h-96 bg-gray-900 overflow-hidden flex flex-col items-center justify-center">
      <div className="glitch-wrapper mb-8">
        <div className="glitch" data-text="Neuro Trinity is Waiting for you">
          Neuro Trinity is Waiting for you
        </div>
      </div>
      <Button 
        onClick={handleChatClick}
        className="mt-4 bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white font-bold py-2 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 glitch-button"
      >
        Chat Now
      </Button>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-green-500 mix-blend-screen opacity-10 filter blur-xl"></div>
        <div className="absolute inset-0 bg-purple-500 mix-blend-screen opacity-10 filter blur-xl"></div>
      </div>
      <style jsx>{`
        .glitch-wrapper {
          position: relative;
          z-index: 1;
        }
        .glitch {
          font-size: 48px;
          font-weight: bold;
          color: #fff;
          text-shadow: 
            0 0 5px #8b5cf6,
            0 0 10px #8b5cf6,
            0 0 15px #8b5cf6,
            0 0 20px #8b5cf6;
          letter-spacing: 3px;
          animation: flicker 2s infinite alternate;
        }
        .glitch:before,
        .glitch:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch:before {
          left: 2px;
          text-shadow: -2px 0 #4ade80;
          clip: rect(24px, 550px, 90px, 0);
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }
        .glitch:after {
          left: -2px;
          text-shadow: -2px 0 #8b5cf6, 2px 2px #4ade80;
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        .glitch-button {
          position: relative;
          z-index: 2;
        }
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 
              0 0 5px #8b5cf6,
              0 0 10px #8b5cf6,
              0 0 15px #8b5cf6,
              0 0 20px #8b5cf6;
          }
          20%, 24%, 55% {
            text-shadow: none;
          }
        }
        @keyframes glitch-anim {
          0% {
            clip: rect(12px, 9999px, 52px, 0);
          }
          25% {
            clip: rect(58px, 9999px, 73px, 0);
          }
          50% {
            clip: rect(36px, 9999px, 95px, 0);
          }
          75% {
            clip: rect(82px, 9999px, 31px, 0);
          }
          100% {
            clip: rect(19px, 9999px, 65px, 0);
          }
        }
        @keyframes glitch-anim-2 {
          0% {
            clip: rect(65px, 9999px, 99px, 0);
          }
          25% {
            clip: rect(25px, 9999px, 54px, 0);
          }
          50% {
            clip: rect(4px, 9999px, 43px, 0);
          }
          75% {
            clip: rect(82px, 9999px, 99px, 0);
          }
          100% {
            clip: rect(17px, 9999px, 94px, 0);
          }
        }
      `}</style>
    </div>
  )
} 