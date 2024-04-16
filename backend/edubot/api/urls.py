from django.urls import path
from .views import QuestionView, AdminQuestionView, FeedbackView, RegisterView, LogoutView, LoginView, ChatDataDownloadView,PerformanceDataDownloadView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('questions/', QuestionView.as_view(), name='question-view'),
    path('admin/questions/', AdminQuestionView.as_view(), name='admin-question-view'),
    path('admin/questions/<int:pk>/', AdminQuestionView.as_view(), name='admin-question-detail'),
    path('feedback/', FeedbackView.as_view(), name='feedback-view'),
    path('chat-data/', ChatDataDownloadView.as_view(), name='chat-data'),
    path('performance-data/', PerformanceDataDownloadView.as_view(), name='performance-data'),
]