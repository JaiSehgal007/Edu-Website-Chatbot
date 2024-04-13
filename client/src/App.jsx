import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles for dark mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #1a1a1a;
    color: #ffffff;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
`;

// Styled components for the chatbot interface
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8rem 1rem 1rem;
  width: 70vw; /* Constrain the width */
  margin: auto; /* Center the chat area */
  background-color: #1b1b1b; /* Background color for the chat area */
  border-radius: 1rem; /* Rounded corners */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3); /* Add a slight shadow */
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const UserMessage = styled(Message)`
  justify-content: flex-end;
`;

const BotMessage = styled(Message)`
  justify-content: flex-start;
`;

const MessageText = styled.p`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: ${(props) => (props.user ? '#4a4a4a' : '#1a1a1a')};
  color: ${(props) => (props.user ? '#ffffff' : '#cccccc')};
  max-width: 80%; /* Constrain the width */
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  position: fixed;
  bottom: ${({ prompt }) => (prompt ? '50vh' : '2rem')};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 2;
  transition: bottom 0.3s ease;
  padding: 0.5rem 1rem; /* Added padding */
  border-radius: 1rem; /* Rounded corners */
  width: ${({ prompt }) => (prompt ? '55vw' : '40vw')}; /* Adjust width */
`;


const Heading = styled.div`
  position: fixed;
  bottom: 65vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 2;
  font-size: 50px;
  font-weight: bold;
  transition: bottom 0.3s ease;
  padding: 0.5rem 1rem; /* Added padding */
  border-radius: 1rem; /* Rounded corners */
  width: ${({ prompt }) => (prompt ? '70vw' : 'auto')}; /* Adjust width */
`;



const Input = styled.input`
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 1rem;
  background-color: ${(isFirstQuery) => (isFirstQuery ? '#2b2b2b' : '#1a1a1a')};
  color: #ffffff;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #0077b6;
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005d9e;
  }
`;

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isFirstQuery, setIsFirstQuery] = useState(true);

  const handleSubmit = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      // Send the user's input to your backend
      // const response = await fetch('/api/chatbot', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ userInput }),
      // });
      // const data = await response.json();
      const data = { response: "Hi I am good" };
      // Update the chat messages with the user's input and the response from the backend
      setMessages((prevMessages) => [...prevMessages, { user: true, text: userInput }, { user: false, text: data.response }]);
      setUserInput('');
      setIsFirstQuery(false);
    }
  };

  return (
    <ChatContainer>
      <GlobalStyle />

      

      {!isFirstQuery && <>
        <nav style={{backgroundColor:"#1a1a1a"}} className="navbar navbar-dark fixed-top">
          <a className="navbar-brand" href="#">
            <img src="artificial-intelligence.png" width="30" height="30" className="d-inline-block align-top mr-2" alt="" />
            EduBot
          </a>
          <span style={{fontWeight:'bold'}} className="navbar-text d-none d-md-inline-block mx-auto">Ask Anything About Our Courses!</span>
          <div className="form-inline my-2 my-lg-0">
            <img src="user.png" width="40" height="40" className="d-inline-block align-top mr-2" alt="" />
          </div>
        </nav>


        <MessagesContainer>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {message.user ? (
                <UserMessage>
                  <MessageText user>{message.text}</MessageText>
                  <img src="user.png" width="33" height="33" className="d-inline-block align-top ml-2 mt-1" alt="" />
                </UserMessage>
              ) : (
                <BotMessage>
                  <img src="artificial-intelligence.png" width="30" height="30" className="d-inline-block align-top ml-2 mt-1" alt="" />
                  <MessageText>{message.text}</MessageText>
                </BotMessage>
              )}
            </React.Fragment>
          ))}
        </MessagesContainer>
      </>
      }

      {isFirstQuery &&
        <Heading>The EduBot<img src="artificial-intelligence.png" width="50" height="50" className="d-inline-block align-top ml-2" alt="" /></Heading>
      }
      <InputContainer prompt={isFirstQuery}>
        <Input
          style={{ backgroundColor: '#1a1a1a', boxShadow: '0px 0px 10px 0px #ffe390' }}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyDown={handleSubmit}
          isFirstQuery
        />
        {/* {!isFirstQuery && <SendButton onClick={handleSubmit}>Send</SendButton>} */}
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;
