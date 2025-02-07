import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Question {
  question: string;
  correct_answer: string;
  explanation?: string;
}

interface QuizResultsProps {
  questions: Question[];
  selectedAnswers: SelectedAnswers;
  resetQuiz: () => void;
  score: number;
}

interface SelectedAnswers {
    [key: number]: string;
  }

const QuizResults: React.FC<QuizResultsProps> = ({ questions, selectedAnswers, resetQuiz,score }) => {
//   const score = questions.reduce(
//     (acc, q, i) => acc + (selectedAnswers[i] === q.correct_answer ? 1 : 0),
//     0
//   );
  const percentage = ((score/10) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">
            Your Score: {score}/{questions.length*10}
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor:
                  percentage >= 70 ? '#22c55e' :
                  percentage >= 40 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
          <p className="mt-2 text-gray-600">
            {percentage.toFixed(1)}% Correct
          </p>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const isCorrect = selectedAnswers[index] === question.correct_answer;
          return (
            <div
              key={index}
              className={`border rounded-xl p-6 transition-all duration-300 ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-medium text-lg flex-grow">
                  {question.question}
                </h4>
                {isCorrect ? (
                  <Check className="text-green-500 w-6 h-6 flex-shrink-0" />
                ) : (
                  <X className="text-red-500 w-6 h-6 flex-shrink-0" />
                )}
              </div>

              <div className="mt-4 space-y-2">
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  <span className="font-semibold">Your answer:</span> {selectedAnswers[index]}
                </p>

                {!isCorrect && (
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Correct answer:</span> {question.correct_answer}
                  </p>
                )}

                {question.explanation && (
                  <div className="mt-4 p-4 bg-white bg-opacity-50 rounded-lg border-l-4 border-black">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Explanation:</span> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        onClick={resetQuiz}
        className="w-full bg-black text-white py-3 rounded-lg font-medium transition duration-300"
      >
        Try Again
      </Button>
    </div>
  );
};

export default QuizResults;
