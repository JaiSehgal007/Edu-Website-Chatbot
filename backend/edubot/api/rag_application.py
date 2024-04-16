import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.messages import ChatMessage, HumanMessage, AIMessage
from langchain_cohere import ChatCohere,CohereEmbeddings

load_dotenv()

os.environ['PINECONE_API_KEY']=os.getenv('PINECONE_API_KEY')
os.environ['PINECONE_INDEX_NAME']=os.getenv('PINECONE_INDEX_NAME')
os.environ["COHERE_API_KEY"]  = os.getenv('COHERE_API_KEY')



### initialize retriever and llm ###
embeddings =  CohereEmbeddings(model="embed-english-light-v3.0")
index_name = "edu-website-chatbot"
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={'k': 3})
llm = ChatCohere(model="command-r")

### Contextualize question ###
contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)

history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

### Answer question ###
qa_system_prompt = """You are an sales agest for ed-tech website . \
Use the following pieces of retrieved context to answer the question about our website couses. \
If the retrieved context does not contain any information related to user's query, \
just respond "Please wait for a while, our team will answer you soon". \
Do not use your knowledge to answer any query, remain stick to the context provided.\
Use one to two sentences maximum and keep the answer concise.\

Context : {context}"""
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)


def convert_chat_history(history,type):
  """
  Converts a ChatMessageHistory object to a dictionary and vice versa.

  Args:
      history: A ChatMessageHistory object or a dictionary representing chat history.

  Returns:
      A dictionary representing the chat history or a ChatMessageHistory object
      reconstructed from the dictionary.
  """
  messages = []
  if type==0:
    for message in history:
      if isinstance(message, HumanMessage):
        messages.append({"role": "human", "content": message.content})
      elif isinstance(message, AIMessage):
        messages.append({"role": "ai", "content": message.content})
  else:
    for message in history:
      if message["role"] == "human":
        messages.append(HumanMessage(content=message["content"]))
      elif message["role"] == "ai":
        messages.append(AIMessage(content=message["content"]))
  return messages


def answer_question(question,chat_history):
    # print(question,chat_history)
    model_history = convert_chat_history(chat_history,1)
    # print("1",model_history)
    ai_msg = rag_chain.invoke({"input": question, "chat_history": chat_history})
    model_history.extend([HumanMessage(content=question), AIMessage(content=ai_msg["answer"])])
    # print("2",model_history)
    model_history=convert_chat_history(model_history,0)
    # print("3",model_history)
    return ai_msg["answer"],model_history