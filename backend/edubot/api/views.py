from rest_framework import generics
from .models import Question
from .serializers import QuestionSerializer,UserSerializer
from .rag_application import answer_question
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView


class QuestionList(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        question = serializer.save()
        answer, confidence_score = answer_question(question.description)
        if confidence_score < 0.7:  # Adjust the threshold as needed
            # Forward the question to the doubt assistant panel
            pass
        else:
            question.answer = answer
            question.save()

class QuestionDetail(generics.RetrieveUpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def put(self, request, *args, **kwargs):
        print("Received PUT request")
        print("Request data:", request.data)
        
        instance = self.get_object()
        print("Instance before update:", instance)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        print("Serializer validated data:", serializer.validated_data)

        self.perform_update(serializer)
        print("Instance after update:", instance)

        return Response(serializer.data)

class UnansweredQuestionList(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Question.objects.filter(answer__isnull=True)


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
