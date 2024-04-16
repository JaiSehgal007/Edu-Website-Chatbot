from django.http import HttpResponse
from rest_framework import generics
from .models import Question, Feedback
from .serializers import QuestionSerializer,UserSerializer,FeedbackSerializer
from .rag_application import answer_question
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView
import csv
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Question
from .serializers import QuestionSerializer
import json

class QuestionView(APIView):
    def put(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            session_id = serializer.validated_data['session_id']
            question = serializer.validated_data['question']

            try:
                question_obj = Question.objects.get(session_id=session_id)
                chat_history = question_obj.chat_history.copy()
            except Question.DoesNotExist:
                chat_history = []
                question_obj = None

            answer, new_chat_history=None,None
            if question_obj:
                if question_obj.status=='unanswered':
                    question_obj.status = 'unanswered'
                    question_obj.save()
                else:
                    if question_obj.answer_count!=0: answer, new_chat_history = answer_question(question, chat_history)  
                    else: 
                        answer, new_chat_history=question_obj.answer, question_obj.chat_history
                        start_index = answer.find("'answer'")
                        if start_index != -1:
                            # Find the index of the next occurrence of ' after start_index
                            end_index = answer.find("'", start_index + len("'answer': '"))

                            if end_index != -1:
                                # Extract the substring between start_index and end_index
                                answer = answer[start_index + len("'answer': '"):end_index]
                    question_obj.answer = answer
                    question_obj.chat_history = new_chat_history
                    question_obj.status = 'answered' if answer!='Please wait for a while, our team will answer you soon.' else 'unanswered'
                    question_obj.answer_count = 1+question_obj.answer_count
                    question_obj.save()
            else:
                answer, new_chat_history = answer_question(question, chat_history)
                question_data = {
                    'session_id': session_id,
                    'question': question,
                    'answer': answer,
                    'chat_history': new_chat_history,
                    'status': 'answered',
                } if answer!='Please wait for a while, our team will answer you soon.' else {
                    'session_id': session_id,
                    'question': question,
                    'answer': answer,
                    'chat_history': new_chat_history,
                    'status': 'unanswered',
                }
                serializer = QuestionSerializer(data=question_data)
                if serializer.is_valid():
                    question_obj = serializer.save()

            # Return the answer along with the question_id
            response_data = {
                'question_id': question_obj.id if question_obj else None,
                'answer': answer
            }

            return Response(response_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminQuestionView(APIView):
    def get(self, request):
        questions = Question.objects.filter(status='unanswered')
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            q = Question.objects.get(pk=pk)
            q.answer=request.data
            q.status='answered'
            q.answer_count=0
            q.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class FeedbackView(APIView):
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback = serializer.save()
            if not feedback.feedback:
                question = feedback.question
                question_data = {
                    'question': question.question,
                    'answer': question.answer,
                }
                q = Question.objects.create(**question_data)
                Feedback.objects.create(question=q, answer=question.answer, feedback=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    
    

class LogoutView(generics.DestroyAPIView):
    def destroy(self, request, *args, **kwargs):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ChatDataDownloadView(APIView):
    def get(self, request):
        # Fetch all questions with chat history
        questions = Question.objects.exclude(chat_history__isnull=True).exclude(chat_history={})
        
        # Prepare response as CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="chat_data.csv"'

        # Define CSV writer
        writer = csv.writer(response)
        
        # Write CSV header
        writer.writerow(['Question', 'Chat History'])

        # Write question data to CSV
        for question in questions:
            writer.writerow([question.question, question.chat_history])

        return response

class PerformanceDataDownloadView(APIView):
    def get(self, request):
        # Fetch all negative feedbacks
        negative_feedbacks = Feedback.objects.filter(feedback=False)
        
        # Prepare response as CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="performance_data.csv"'

        # Define CSV writer
        writer = csv.writer(response)
        
        # Write CSV header
        writer.writerow(['Question', 'Answer'])

        # Write negative feedback data to CSV
        for feedback in negative_feedbacks:
            writer.writerow([feedback.question.question, feedback.answer])

        return response

