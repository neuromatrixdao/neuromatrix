'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Circle } from 'lucide-react'
import MatrixBackground2 from "./MatrixBackground2"
import GlitchProgressBar from './GlitchProgressBar'
import { useRouter } from 'next/navigation'

const questions = [
  {
    question: "You see a red door and a blue door. Which one do you choose?",
    options: ["Red", "Blue", "Neither", "Both"],
    correctAnswer: "Blue", // in the context of "The Matrix"
    neuroPulse: 10
  },
  {
    question: "Decode: 01001110 01000101 01001111",
    options: ["MATRIX", "AGENT", "NEO", "MORPHEUS"],
    correctAnswer: "NEO",
    neuroPulse: 15
  },
  {
    question: "What's more important: freedom or control?",
    options: ["Freedom", "Control", "Balance", "Neither"],
    correctAnswer: "Freedom", // in the context of "The Matrix"
    neuroPulse: 20
  },
  {
    question: "Create a word from 'MATRIX' that describes you.",
    options: ["MIRAGE", "TACTIC", "ENIGMA", "AXIOM"],
    correctAnswer: "ENIGMA", // Any answer could be correct, but we'll choose this for the example
    neuroPulse: 25
  },
  {
    question: "If you were to 'bend the spoon', what would you actually be bending?",
    options: ["The spoon", "Your mind", "The Matrix", "Reality"],
    correctAnswer: "Your mind",
    neuroPulse: 30
  }
]

export default function MatrixAgentChallenge() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [neuroPulse, setNeuroPulse] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameOver, setGameOver] = useState(false)
  const [agentMood, setAgentMood] = useState('neutral')
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null)

  const endGame = useCallback(() => {
    setGameOver(true);
    const isSuccessful = neuroPulse > (questions.length * 15);
    setAgentMood(isSuccessful ? 'friendly' : 'hostile');
  }, [neuroPulse]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameOver) {
      endGame()
    }
  }, [timeLeft, gameOver, endGame])

  const handleAnswer = (answer: string) => {
    const correct = answer === questions[currentQuestion].correctAnswer
    if (correct) {
      setNeuroPulse(neuroPulse + questions[currentQuestion].neuroPulse)
      setAgentMood('friendly')
      setAnswerStatus('correct')
    } else {
      setAgentMood('hostile')
      setAnswerStatus('incorrect')
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(15)
        setAnswerStatus(null)
        setAgentMood('neutral')
      } else {
        endGame()
      }
    }, 1000)
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setNeuroPulse(0)
    setTimeLeft(15)
    setGameOver(false)
    setAgentMood('neutral')
    setAnswerStatus(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-400 font-mono relative">
      <MatrixBackground2 agentMood={agentMood} />
      <div className="w-full max-w-md p-6 rounded-lg border border-green-400 shadow-lg shadow-green-400/50 relative overflow-hidden bg-black bg-opacity-80 z-10">
        <h1 className="text-3xl font-bold mb-4 text-center">Matrix Agent Challenge</h1>
        <div className="min-h-[300px]">
        {!gameOver ? (
          <>
            <div className="mb-4">
              <GlitchProgressBar value={timeLeft} maxValue={15} />
            </div>
            <p className="mb-4">Question {currentQuestion + 1} of {questions.length}</p>
            <p className="mb-4 text-xl">{questions[currentQuestion].question}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  variant="outline"
                  className="border-green-400 bg-black text-green-400 hover:bg-green-400 hover:text-black transition-colors font-bold text-lg py-2"
                  disabled={answerStatus !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
            {answerStatus && (
              <div className={`mt-4 text-center ${answerStatus === 'correct' ? 'text-blue-400' : 'text-red-400'}`}>
                {answerStatus === 'correct' ? (
                  <CheckCircle className="inline-block mr-2" />
                ) : (
                  <AlertCircle className="inline-block mr-2" />
                )}
                {answerStatus === 'correct' ? 'Correct!' : 'Incorrect!'}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">Game Over!</p>
            <p className="mb-4">Your NeuroPulse: {neuroPulse}</p>
            <p className="mb-4">
              {neuroPulse > (questions.length * 15)
                ? "Agent approves. You've passed the test."
                : "Agent disapproves. Try again."}
            </p>
            {neuroPulse > (questions.length * 15) ? (
              <Button 
                onClick={() => router.push('/mint')} 
                className="mt-4 mr-2 bg-[#00ff00] text-black font-bold uppercase transform hover:scale-105 transition-all duration-300 animate-pulse hover:bg-[#00cc00] shadow-[0_0_10px_#00ff00] hover:shadow-[0_0_20px_#00ff00]"
              >
                Next
              </Button>
            ) : null}
            <Button onClick={restartGame} className="mt-4">
              Restart
            </Button>
          </div>
        )}
        </div>
        <div className={`mt-4 text-center ${
          agentMood === 'friendly' ? 'text-blue-400' :
          agentMood === 'hostile' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {agentMood === 'friendly' && "Agent smiles"}
          {agentMood === 'hostile' && "Agent frowns"}
          {agentMood === 'neutral' && "Agent analyzes"}
        </div>
        <div className="mt-4 text-center">
          <Circle className="inline-block mr-2" />
          NeuroPulse: {neuroPulse}
        </div>
      </div>
    </div>
  );
}

