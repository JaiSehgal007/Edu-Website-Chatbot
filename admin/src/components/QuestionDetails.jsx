import React, { useState } from 'react';

const QuestionDetails = ({ question, onAnswerSubmit }) => {
  const [answer, setAnswer] = useState('');

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = () => {
    onAnswerSubmit(question.id, answer, question.title, question.description);
    setAnswer('');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">{question.title}</h2>
      <div className="mb-4">
        {Object.keys(question.chat_history).length !== 0 && (
          question.chat_history.map((item, index) => (
            <div key={index}>
              <strong>{item.role}</strong>: {item.content}
            </div>
          ))
        )}
      </div>
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