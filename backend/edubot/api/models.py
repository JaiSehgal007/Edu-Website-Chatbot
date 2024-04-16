from django.db import models
from django.db.models import JSONField

class Question(models.Model):
    session_id = models.CharField(max_length=255)
    question = models.TextField()
    answer = models.TextField(blank=True, null=True)
    chat_history = JSONField(default=dict, blank=True, null=True)
    status = models.CharField(max_length=20, default='unanswered')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    answer_count = models.IntegerField(default=0)


class Feedback(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='feedbacks')
    answer = models.TextField()
    feedback = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)