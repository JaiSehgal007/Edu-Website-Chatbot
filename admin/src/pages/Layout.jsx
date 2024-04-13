import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import QuestionDetails from '../components/QuestionDetails';

const Layout = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    // Fetch the list of unanswered questions from the backend
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
    //   const data=[
    //       {
    //         id: 1,
    //         title: "What is React?",
    //         description: "I'm new to web development and want to know what React is and how it works."
    //       },
    //       {
    //         id: 2,
    //         title: "How to handle form submissions in React?",
    //         description: "I'm building a form in React, and I'm not sure how to handle form submissions and send data to the server."
    //       },
    //       {
    //         id: 3,
    //         title: "Understanding React Hooks",
    //         description: "I'm struggling to understand React Hooks and when to use them. Can someone explain them in detail?"
    //       },
    //     ]
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerSubmit = async (questionId, answer) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer }),
      });

      if (response.ok) {
        // Handle successful answer submission
        console.log('Answer submitted successfully');
        setSelectedQuestion(null);
        fetchQuestions();
      } else {
        // Handle error
        console.error('Error submitting answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <div className="w-1/4">
          <Sidebar questions={questions} onQuestionClick={handleQuestionClick} />
        </div>
        <div className="w-3/4 bg-gray-100">
          {selectedQuestion ? (
            <QuestionDetails
              question={selectedQuestion}
              onAnswerSubmit={handleAnswerSubmit}
            />
          ) : (
            <div className="p-4">Select a question to provide an answer.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;