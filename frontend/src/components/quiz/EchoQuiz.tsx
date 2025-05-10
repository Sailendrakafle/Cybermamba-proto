'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EchoQuizService } from './EchoQuizService';

export function EchoQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestion] = useState(() => {
    // Get a random question from our service
    return EchoQuizService.getRandomQuestion();
  });
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true);
      setTimeout(() => setShowExplanation(true), 1000);
    }
  };

  return (
    <div>
      <div>
        <h3>EchoMon Security Quiz</h3>
      </div>
      <div>
        <div>
          <p>{currentQuestion.question}</p>
          <div>
            {currentQuestion.options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="quiz-answer"
                  disabled={isSubmitted}
                  checked={selectedAnswer === index}
                  onChange={() => setSelectedAnswer(index)}
                />
                <label 
                  htmlFor={`option-${index}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </button>
          )}
          {isSubmitted && (
            <div>
              {selectedAnswer === currentQuestion.correctAnswer
                ? 'Correct! Well done!'
                : `Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
              
              {showExplanation && (
                <div>
                  <h4>Explanation:</h4>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
