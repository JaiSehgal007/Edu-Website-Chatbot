from django.urls import path
from .views import QuestionList, QuestionDetail, RegisterView, LogoutView, LoginView, UnansweredQuestionList

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('questions/', QuestionList.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionDetail.as_view(), name='question-detail'),
    path('unanswered-questions/', UnansweredQuestionList.as_view(), name='unanswered-questions-list'),
]