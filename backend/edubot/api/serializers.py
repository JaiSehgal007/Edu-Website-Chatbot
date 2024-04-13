from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'title', 'description', 'answer']

    def validate_answer(self, value):
        print("Validating answer:", value)
        # Add custom validation logic here if needed
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user