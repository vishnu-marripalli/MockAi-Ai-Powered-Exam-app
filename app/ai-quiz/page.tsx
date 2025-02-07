"use client";


import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// import { Progress } from "@/components/ui/progress";
import {  Timer } from "lucide-react";
import CreativeAILoader from "@/components/Loader";
import QuizResults from "@/components/ResultinQuiz";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation:string;
}

interface SelectedAnswers {
  [key: number]: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topic, setTopic] = useState<string>("Gre quant");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState( 10 * 60);



  async function fetchQuestions(topic: string,difficulty:string): Promise<void> {
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        body: JSON.stringify({ topic,difficulty }),
        headers: { "Content-Type": "application/json" },
      });
      // const text = await res.text();  
      // console.log("Raw response:", text);
      const data = await res.json();
      console.log(data);
      if (data.data) {
        setQuestions(data.data);
        setTimeLeft(10 * 60);
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
  useEffect(() => {
    
    fetchQuestions(topic,difficulty);
  }, [topic,difficulty]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      topic: HTMLInputElement;
      difficulty: HTMLInputElement;
    };
    const newTopic = formElements.topic.value.trim();
    const newDifficulty = formElements.difficulty.value.trim();
    if (newTopic && newDifficulty) {
      setTopic(newTopic);
      setDifficulty(newDifficulty);
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

    useEffect(() => {
      if (timeLeft > 0 && !showResults) {
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
      } else if (timeLeft === 0) {
        calculateScore();
        setShowResults(true);
      }
    }, [timeLeft, showResults,questions ]);

  const calculateScore = (): void => {
    console.log("selectedAnswers",selectedAnswers);
    const correct = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correct_answer ? 1 : 0);
    }, 0);
    setScore((correct / questions.length) * 100);
  };


  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl sm:text-2xl font-semibold text-gray-800">
        Click Here!! To start Test        
        </p>
        <button
          onClick={() =>fetchQuestions(topic,difficulty)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg mt-4 hover:bg-blue-700 transition-colors duration-200"
        >
          Start test
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between flex-row ">
          <div>
            <CardTitle>Ai generated Quiz</CardTitle>
            <CardDescription>Test your knowledge in physics</CardDescription>
          </div>
          <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center space-x-2 sm:space-x-3 border border-blue-100">
              <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              <span className="font-mono text-lg sm:text-2xl font-semibold text-black">
                {formatTime(timeLeft)}
              </span>
            </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex gap-2 mb-4">
            <Input
              type="text"
              name="topic"
              placeholder="Enter topic"
              defaultValue={topic}
            />
            {/* <Input
            type="text"
            name="difficulty"
            placeholder="Enter difficulty"
            defaultValue={difficulty}
            /> */}
            <select
              name="difficulty"
              defaultValue={difficulty}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black focus:border-black" 
            >
              <option value="Medium">Easy</option>
              <option value="Hard">Medium</option>
              <option value="Extreme Hard">Hard</option>
            </select>
            <Button type="submit">Change Topic</Button>
          </form>
          
          {questions.length > 0 && !showResults && (
            <div>
              <div className="mb-4">
                {/* <Progress
                  value={(currentQuestionIndex + 1) / questions.length * 100}
                  className="h-2"
                /> */}
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
              <QuizResults questions={questions} selectedAnswers={selectedAnswers} resetQuiz={resetQuiz} score={score} />
            )}

        </CardContent>
      </Card>
    </div>
  );
}