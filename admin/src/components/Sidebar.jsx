import React from 'react';

const Sidebar = ({ questions, onQuestionClick }) => {
  return (
    <div className="bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Unanswered Questions</h2>
      <ul>
        {questions.map((question) => (
          <li
            key={question.id}
            className="bg-white p-4 mb-2 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onQuestionClick(question)}
          >
            {question.question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;