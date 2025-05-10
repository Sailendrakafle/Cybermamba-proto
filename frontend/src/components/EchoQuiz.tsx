// filepath: /Users/sailendra/Documents/Cybermamba-proto/frontend/src/components/EchoQuiz.tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "What is a strong password practice?",
    options: [
      "Using the same password for all accounts",
      "Using a combination of letters, numbers, and special characters",
      "Using your birth date",
      "Using common words"
    ],
    correctAnswer: 1
  },
  {
    question: "How can you identify a potential phishing email?",
    options: [
      "The sender's email address looks legitimate",
      "It creates urgency to act immediately",
      "It has a professional layout",
      "It's from a known company"
    ],
    correctAnswer: 1
  },
  {
    question: "What is two-factor authentication?",
    options: [
      "Using two different passwords",
      "Using a password and a security question",
      "Using something you know and something you have",
      "Using two different email addresses"
    ],
    correctAnswer: 2
  }
];

export function EchoQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestion] = useState(() => {
    // Randomly select a question when component mounts
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    return quizQuestions[randomIndex];
  });

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cyber Security Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-medium">{currentQuestion.question}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="quiz-answer"
                  disabled={isSubmitted}
                  checked={selectedAnswer === index}
                  onChange={() => setSelectedAnswer(index)}
                  className="w-4 h-4 text-blue-600"
                />
                <label 
                  htmlFor={`option-${index}`}
                  className={`flex-grow p-2 rounded ${
                    isSubmitted
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900'
                        : selectedAnswer === index
                        ? 'bg-red-100 dark:bg-red-900'
                        : ''
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
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
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          )}
          {isSubmitted && (
            <div className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
            }`}>
              {selectedAnswer === currentQuestion.correctAnswer
                ? 'Correct! Well done!'
                : `Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}