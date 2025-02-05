



"use client";

import React, { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
import { Timer, BookOpen, Flag, ChevronLeft, ChevronRight, CheckCircle, XCircle, HelpCircle, Menu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CreativeAILoader from "@/components/Loader";

  
  interface Question {
    id: string;
    question: string;
    options: [];
    correct_answer: string;
    explanation?: string;
  }
  
  interface SubjectQuestions {
    subject: string;
    questions: Question[];
  }
  
  interface QuestionStatus {
    isAnswered: boolean;
    isFlagged: boolean;
  }
  
  interface TestResults {
    correct: number;
    incorrect: number;
    unattempted: number;
    score: number;
  }


const QuestionNavigator = ({ 
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  getQuestionStatus
}: {
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  getQuestionStatus: (index: number) => QuestionStatus;
}) => (
  <div className="grid  grid-cols-4 gap-2">
    {questions.map((_, idx) => {
      const { isAnswered, isFlagged } = getQuestionStatus(idx);
      return (
        <button
          key={idx}
          onClick={() => setCurrentQuestionIndex(idx)}
          className={`p-2 rounded-lg flex items-center justify-center ${
            currentQuestionIndex === idx
              ? 'bg-blue-600 text-white'
              : isFlagged
              ? 'bg-yellow-100 text-yellow-600'
              : isAnswered
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {idx + 1}
        </button>
      );
    })}
  </div>
);

const JeeMockTest = () => {
  const [questions, setQuestions] = useState<SubjectQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSubject, setCurrentSubject] = useState("physics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  async function fetchQuestions() {
    try {
      const res = await fetch("/api/Jeequestions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setQuestions(data.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
   
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmitTest();
    }
  }, [timeLeft, showResults]);

  const getCurrentSubjectQuestions = (): Question[] => {
    return questions.find(q => q.subject === currentSubject)?.questions || [];
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionIndex: number, answer: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [`${currentSubject}-${questionIndex}`]: answer
    }));
  };

  const toggleFlag = (questionIndex: number) => {
    const key = `${currentSubject}-${questionIndex}`;
    setFlaggedQuestions(prev => 
      prev.includes(key) ? prev.filter(q => q !== key) : [...prev, key]
    );
  };

  const getQuestionStatus = (questionIndex: number): QuestionStatus => {
    const key = `${currentSubject}-${questionIndex}`;
    return {
      isAnswered: selectedAnswers[key] !== undefined,
      isFlagged: flaggedQuestions.includes(key)
    };
  };

  const calculateScore = (): TestResults => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach(subject => {
      subject.questions.forEach((q, idx) => {
        const key = `${subject.subject}-${idx}`;
        if (selectedAnswers[key] === undefined) {
          unattempted++;
        } else if (q.correct_answer === q.options[selectedAnswers[key]]) {
          correct++;
        } else {
          incorrect++;
        }
      });
    });

    return {
      correct,
      incorrect,
      unattempted,
      score: correct * 4 - incorrect
    };
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    // Simulate API call to submit test
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowResults(true);
    setIsSubmitting(false);
  };

  if (loading) {
    return (
     <>
     <CreativeAILoader/>
     </>
     )
  }
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl sm:text-2xl font-semibold text-gray-800">
        Click Here!! To start Test        
        </p>
        <button
          onClick={() =>fetchQuestions()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg mt-4 hover:bg-blue-700 transition-colors duration-200"
        >
          Start test
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              JEE Mock Test
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg flex items-center space-x-2 sm:space-x-3 border border-blue-100">
              <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span className="font-mono text-lg sm:text-2xl font-semibold text-blue-800">
                {formatTime(timeLeft)}
              </span>
            </div>
            <button
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 text-sm sm:text-base"
            >
              {isSubmitting && <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            <Tabs value={currentSubject} onValueChange={setCurrentSubject} className="w-full">
              <TabsList className="mb-4 w-full overflow-x-auto overflow-y-hidden  flex-wrap">
                {questions.map(subject => (
                  <TabsTrigger 
                    key={subject.subject} 
                    value={subject.subject}
                    className="capitalize text-sm sm:text-base"
                  >
                    {subject.subject}
                  </TabsTrigger>
                ))}
              </TabsList>

              {questions.map(subject => (
                <TabsContent key={subject.subject} value={subject.subject}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center text-base sm:text-lg">
                        <span>Question {currentQuestionIndex + 1} of {getCurrentSubjectQuestions().length}</span>
                        <button
                          onClick={() => toggleFlag(currentQuestionIndex)}
                          className={`p-2 rounded-full transition-colors ${
                            flaggedQuestions.includes(`${currentSubject}-${currentQuestionIndex}`)
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 sm:space-y-6">
                        <p className="text-base sm:text-lg">
                          {getCurrentSubjectQuestions()[currentQuestionIndex]?.question}
                        </p>
                        <div className="space-y-2 sm:space-y-3">
                          {getCurrentSubjectQuestions()[currentQuestionIndex]?.options.map((option, idx) => (
                            <label
                              key={idx}
                              className={`flex items-center p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors ${
                                selectedAnswers[`${currentSubject}-${currentQuestionIndex}`] === idx
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                checked={selectedAnswers[`${currentSubject}-${currentQuestionIndex}`] === idx}
                                onChange={() => handleAnswer(currentQuestionIndex, idx)}
                                className="mr-3"
                              />
                              <span className="text-sm sm:text-base">{option}</span>
                            </label>
                          ))}
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-sm sm:text-base"
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentQuestionIndex(prev => 
                              Math.min(getCurrentSubjectQuestions().length - 1, prev + 1)
                            )}
                            disabled={currentQuestionIndex === getCurrentSubjectQuestions().length - 1}
                            className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-sm sm:text-base"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Desktop Question Navigator */}
          <div className="hidden lg:mt-16 lg:block">
            <Card>
              <CardHeader>
                <CardTitle>Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionNavigator 
                  questions={getCurrentSubjectQuestions()}
                  currentQuestionIndex={currentQuestionIndex}
                  setCurrentQuestionIndex={setCurrentQuestionIndex}
                  getQuestionStatus={getQuestionStatus}
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">Flagged for review</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Not attempted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Question Navigator Sheet */}
          <div className="fixed bottom-4 right-4 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <div className="h-full overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Question Navigator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuestionNavigator 
                      questions={getCurrentSubjectQuestions()}
                      currentQuestionIndex={currentQuestionIndex}
                      setCurrentQuestionIndex={setCurrentQuestionIndex}
                      getQuestionStatus={getQuestionStatus}
                    />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Answered</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Flag className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Flagged for review</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">Not attempted</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results Modal */}
        <AlertDialog open={showResults}>
          <AlertDialogContent className="w-[95vw] max-w-3xl mx-2 sm:mx-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
                Test Results
              </AlertDialogTitle>
              <AlertDialogDescription>
              <div className="space-y-6 sm:space-y-8">
  {(() => {
    const results = calculateScore();

    // Ensure the percentage is calculated safely
    const totalAttempts = results.correct + results.incorrect + results.unattempted;
    const percentage = totalAttempts === 0
      ? 0
      : (results.correct / totalAttempts) * 100;

    return (
      <>
        <div className="text-center">
          <div className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-2 sm:mb-4">
            Your Score: {results.score}
          </div>
          {/* <Progress
            value={percentage}
            className="h-2 sm:h-3 w-full max-w-xs sm:max-w-md mx-auto"
          /> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm text-center border border-green-200">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
              {results.correct}
            </div>
            <div className="text-xs sm:text-sm font-medium text-green-600">
              Correct Answers
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm text-center border border-red-200">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 sm:mb-2">
              {results.incorrect}
            </div>
            <div className="text-xs sm:text-sm font-medium text-red-600">
              Incorrect Answers
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm text-center border border-gray-200">
            <div className="text-2xl sm:text-3xl font-bold text-gray-600 mb-1 sm:mb-2">
              {results.unattempted}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600">
              Not Attempted
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            Detailed Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-600">Accuracy Rate</span>
              <span className="font-medium text-gray-800">
                {((results.correct / (results.correct + results.incorrect)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium text-gray-800">
                {(((results.correct + results.incorrect) / totalAttempts) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-gray-600">Total Questions</span>
              <span className="font-medium text-gray-800">
                {totalAttempts}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  })()}
</div>

              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogAction 
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base"
              >
                Start New Test
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default JeeMockTest;









































