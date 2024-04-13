import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import QuestionDetails from '../components/QuestionDetails';
import { getCsrfToken } from './utils';
import axios from 'axios';

const Layout = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    // Fetch the list of unanswered questions from the backend
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/unanswered-questions/', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerSubmit = async (questionId, answer, oldTitle, oldDescription) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const csrfToken = getCsrfToken();
      const response = await fetch(`http://localhost:8000/api/questions/${questionId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ 
          answer,
          title: oldTitle,
          description: oldDescription
        }),
      });
  
      if (response.ok) {
        console.log('Answer submitted successfully');
        setSelectedQuestion(null);
        fetchQuestions();
      } else {
        console.error('Error submitting answer:', response.statusText);
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