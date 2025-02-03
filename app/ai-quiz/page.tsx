"use client";


import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Check, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CreativeAILoader from "@/components/Loader";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

interface SelectedAnswers {
  [key: number]: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState<string>("physics");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    async function fetchQuestions(topic: string): Promise<void> {
      setLoading(true);
      setShowResults(false);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      try {
        const res = await fetch("/api/questions", {
          method: "POST",
          body: JSON.stringify({ topic }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log(data);
        if (data.data) {
          setQuestions(data.data);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions(topic);
  }, [topic]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      topic: HTMLInputElement;
    };
    const newTopic = formElements.topic.value.trim();
    if (newTopic) {
      setTopic(newTopic);
    }
  };

  const handleAnswerSelect = (answer: string): void => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNext = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const calculateScore = (): void => {
    const correct = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correct_answer ? 1 : 0);
    }, 0);
    setScore((correct / questions.length) * 100);
  };

  const resetQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className=" ">
          <CreativeAILoader/>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ai generated Quiz</CardTitle>
          <CardDescription>Test your knowledge in physics</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex gap-2 mb-4">
            <Input
              type="text"
              name="topic"
              placeholder="Enter topic"
              defaultValue={topic}
            />
            <Button type="submit">Change Topic</Button>
          </form>
          
          {questions.length > 0 && !showResults && (
            <div>
              <div className="mb-4">
                <Progress
                  value={(currentQuestionIndex + 1) / questions.length * 100}
                  className="h-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {questions[currentQuestionIndex].question}
                </h3>
                <RadioGroup
                  value={selectedAnswers[currentQuestionIndex]}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQuestionIndex]}
                className="w-full"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          )}

          {showResults && (
            <div className="space-y-4">
              <Alert className={score >= 70 ? "bg-green-50" : "bg-red-50"}>
                <AlertDescription>
                  Your score: {score.toFixed(1)}%
                  {score >= 70 ? " - Great job!" : " - Keep practicing!"}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{question.question}</h4>
                      {selectedAnswers[index] === question.correct_answer ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Your answer: {selectedAnswers[index]}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Correct answer: {question.correct_answer}
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={resetQuiz} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}