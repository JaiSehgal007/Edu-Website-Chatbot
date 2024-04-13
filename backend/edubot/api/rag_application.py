from transformers import pipeline

def answer_question(question):
    rag = pipeline('question-answering')
    result = rag(question)
    answer = result['answer']
    confidence_score = result['score']
    return answer, confidence_score