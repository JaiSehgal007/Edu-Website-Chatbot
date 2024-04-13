import React, { useState } from 'react';

const QuestionDetails = ({ question, onAnswerSubmit }) => {
  const [answer, setAnswer] = useState('');

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    onAnswerSubmit(question.id, answer);
    setAnswer('');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">{question.title}</h2>
      <p className="mb-4">{question.description}</p>
      <textarea
        className="w-full h-40 p-2 border border-gray-300 rounded mb-4"
        value={answer}
        onChange={handleAnswerChange}
        placeholder="Enter your answer..."
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuestionDetails;